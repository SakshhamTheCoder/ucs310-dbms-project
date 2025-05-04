import sqlQuery from '../utils/db.js';

// On module load, ensure status enum is up-to-date
(async () => {
  try {
    await sqlQuery(`
      ALTER TABLE gates 
      MODIFY COLUMN status 
      ENUM('Open','Occupied','Closed','Maintenance') 
      DEFAULT 'Open'
    `);
    console.log('Gate status enum updated');
  } catch (err) {
    // If it already matches or this fails, we just log and continue
    console.warn('Could not update gates.status enum (may already be applied):', err.message);
  }
})();

export const listGates = async (_req, res) => {
  try {
    const rows = await sqlQuery('SELECT * FROM gates ORDER BY terminal, gate_number');
    res.json(rows);
  } catch (err) {
    console.error('List Gates Error:', err);
    res.status(500).json({ message: 'Server error listing gates' });
  }
};

export const addGate = async (req, res) => {
  const { terminal, gate_number } = req.body;
  if (!terminal || !gate_number) {
    return res.status(400).json({ message: 'terminal and gate_number required' });
  }
  try {
    const result = await sqlQuery(
      'INSERT INTO gates (terminal, gate_number) VALUES (?, ?)',
      [terminal, gate_number]
    );
    res.status(201).json({ message: 'Gate added', gate_id: result.insertId });
  } catch (err) {
    console.error('Add Gate Error:', err);
    res.status(500).json({ message: 'Server error adding gate' });
  }
};

// Update the updateGate function to match the database enum values
export const updateGate = async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const allowedStatus = ['Open', 'Occupied', 'Closed', 'Maintenance'];

  if (!status) {
    return res.status(400).json({ message: 'status is required' });
  }
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ 
      message: `Invalid status value. Must be one of: ${allowedStatus.join(', ')}` 
    });
  }

  try {
    await sqlQuery('UPDATE gates SET status = ? WHERE gate_id = ?', [status, id]);
    res.json({ message: 'Gate status updated' });
  } catch (err) {
    console.error('Update Gate Error:', err);
    res.status(500).json({ message: 'Server error updating gate' });
  }
};

export const deleteGate = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await sqlQuery('DELETE FROM gates WHERE gate_id = ?', [id]);
    res.json({ message: 'Gate deleted' });
  } catch (err) {
    console.error('Delete Gate Error:', err);
    res.status(500).json({ message: 'Server error deleting gate' });
  }
};

// In gateController.js - assignGate
// Update the assignGate function
export const assignGate = async (req, res) => {
  const flightId = Number(req.params.fid);
  const { gate_id } = req.body;

  try {
    // Verify flight exists
    const [flight] = await sqlQuery('SELECT flight_id FROM flights WHERE flight_id = ?', [flightId]);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });

    // Check gate availability
    const [gate] = await sqlQuery('SELECT * FROM gates WHERE gate_id = ?', [gate_id]);
    if (!gate) return res.status(404).json({ message: 'Gate not found' });
    if (gate.status !== 'Open') return res.status(400).json({ message: 'Gate not available' });

    // Check if flight already has a gate assigned
    const [existingAssignment] = await sqlQuery(
      'SELECT id, gate_id FROM gate_assignments WHERE flight_id = ?', 
      [flightId]
    );

    // Start transaction
    await sqlQuery('START TRANSACTION');
    
    if (existingAssignment) {
      // If flight already has a gate, free up the old gate first
      await sqlQuery('UPDATE gates SET status = "Open" WHERE gate_id = ?', [existingAssignment.gate_id]);
      await sqlQuery('DELETE FROM gate_assignments WHERE id = ?', [existingAssignment.id]);
    }
    
    // Update new gate status and create assignment
    await sqlQuery('UPDATE gates SET status = "Occupied" WHERE gate_id = ?', [gate_id]);
    
    const result = await sqlQuery(
      'INSERT INTO gate_assignments (flight_id, gate_id) VALUES (?, ?)',
      [flightId, gate_id]
    );

    await sqlQuery('COMMIT');
    res.status(201).json({ message: 'Gate assigned', id: result.insertId });
  } catch (err) {
    await sqlQuery('ROLLBACK');
    console.error('Assign Gate Error:', err);
    res.status(500).json({ message: 'Server error assigning gate' });
  }
};

// Improve the viewFlightGate function
export const viewFlightGate = async (req, res) => {
  const flightId = Number(req.params.fid);
  try {
    const rows = await sqlQuery(
      `SELECT ga.id, g.gate_id, g.terminal, g.gate_number, g.status
         FROM gate_assignments ga
         JOIN gates g ON ga.gate_id = g.gate_id
        WHERE ga.flight_id = ?`,
      [flightId]
    );
    if (rows.length === 0) {
      return res.json({ message: 'No gate assigned' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('View Flight Gate Error:', err);
    res.status(500).json({ message: 'Server error viewing flight gate' });
  }
};

export const unassignGate = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await sqlQuery('DELETE FROM gate_assignments WHERE id = ?', [id]);
    res.json({ message: 'Gate unassigned' });
  } catch (err) {
    console.error('Unassign Gate Error:', err);
    res.status(500).json({ message: 'Server error unassigning gate' });
  }
};
