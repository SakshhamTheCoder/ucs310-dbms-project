// controllers/crewController.js
import sqlQuery from '../utils/db.js';

export const listCrew = async (_req, res) => {
  try {
    const rows = await sqlQuery('SELECT * FROM crew_members ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('List Crew Error:', err);
    res.status(500).json({ message: 'Server error listing crew' });
  }
};

export const addCrew = async (req, res) => {
  let { name, role, license_no, license_number, contact, hired_date } = req.body;

  // Required fields
  if (!name || !role) {
    return res.status(400).json({ message: 'Name and role are required' });
  }

  // Map legacy license_no to license_number
  if (!license_number && license_no) {
    license_number = license_no;
  }

  try {
    const result = await sqlQuery(
      `INSERT INTO crew_members
         (name, role, license_number, contact, hired_date)
       VALUES (?, ?, ?, ?, ?)`,
      [name, role, license_number || null, contact || null, hired_date || null]
    );
    res
      .status(201)
      .json({ message: 'Crew member added', crew_id: result.insertId });
  } catch (err) {
    console.error('Add Crew Error:', err);
    res.status(500).json({ message: 'Server error adding crew' });
  }
};

export const updateCrew = async (req, res) => {
  const id = Number(req.params.id);
  const { status, contact } = req.body;
  try {
    await sqlQuery(
      'UPDATE crew_members SET status = COALESCE(?, status), contact = COALESCE(?, contact) WHERE crew_id = ?',
      [status, contact, id]
    );
    res.json({ message: 'Crew member updated' });
  } catch (err) {
    console.error('Update Crew Error:', err);
    res.status(500).json({ message: 'Server error updating crew' });
  }
};

export const deleteCrew = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await sqlQuery('DELETE FROM crew_members WHERE crew_id = ?', [id]);
    res.json({ message: 'Crew member removed' });
  } catch (err) {
    console.error('Delete Crew Error:', err);
    res.status(500).json({ message: 'Server error deleting crew' });
  }
};

export const assignCrew = async (req, res) => {
  const flightId = Number(req.params.fid);
  const { crew_id, assigned_role } = req.body;
  if (!crew_id || !assigned_role) {
    return res.status(400).json({ message: 'crew_id and assigned_role required' });
  }
  try {
    const result = await sqlQuery(
      `INSERT INTO crew_assignments
         (flight_id, crew_id, assigned_role)
       VALUES (?, ?, ?)`,
      [flightId, crew_id, assigned_role]
    );
    res
      .status(201)
      .json({ message: 'Crew assigned', assignment_id: result.insertId });
  } catch (err) {
    console.error('Assign Crew Error:', err);
    res.status(500).json({ message: 'Server error assigning crew' });
  }
};

export const listFlightCrew = async (req, res) => {
  const flightId = Number(req.params.fid);
  try {
    const rows = await sqlQuery(
      `SELECT ca.assignment_id, cm.crew_id, cm.name, ca.assigned_role
         FROM crew_assignments ca
         JOIN crew_members cm ON ca.crew_id = cm.crew_id
        WHERE ca.flight_id = ?
        ORDER BY ca.assigned_role`,
      [flightId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List Flight Crew Error:', err);
    res.status(500).json({ message: 'Server error listing flight crew' });
  }
};

export const unassignCrew = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await sqlQuery('DELETE FROM crew_assignments WHERE assignment_id = ?', [id]);
    res.json({ message: 'Crew unassigned' });
  } catch (err) {
    console.error('Unassign Crew Error:', err);
    res.status(500).json({ message: 'Server error unassigning crew' });
  }
};
