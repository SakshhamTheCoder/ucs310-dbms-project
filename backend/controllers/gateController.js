import sqlQuery from '../utils/db.js';

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
      `INSERT INTO gates (terminal, gate_number) VALUES (?, ?)`,
      [terminal, gate_number]
    );
    res.status(201).json({ message: 'Gate added', gate_id: result.insertId });
  } catch (err) {
    console.error('Add Gate Error:', err);
    res.status(500).json({ message: 'Server error adding gate' });
  }
};

export const updateGate = async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: 'status is required' });
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

export const assignGate = async (req, res) => {
  const flightId = Number(req.params.fid);
  const { gate_id } = req.body;
  if (!gate_id) {
    return res.status(400).json({ message: 'gate_id required' });
  }
  try {
    const result = await sqlQuery(
      'INSERT INTO gate_assignments (flight_id, gate_id) VALUES (?, ?)',
      [flightId, gate_id]
    );
    res.status(201).json({ message: 'Gate assigned', id: result.insertId });
  } catch (err) {
    console.error('Assign Gate Error:', err);
    res.status(500).json({ message: 'Server error assigning gate' });
  }
};

export const viewFlightGate = async (req, res) => {
  const flightId = Number(req.params.fid);
  try {
    const rows = await sqlQuery(
      `SELECT ga.id, g.terminal, g.gate_number
         FROM gate_assignments ga
         JOIN gates g ON ga.gate_id = g.gate_id
        WHERE ga.flight_id = ?`,
      [flightId]
    );
    res.json(rows[0] || {});
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
