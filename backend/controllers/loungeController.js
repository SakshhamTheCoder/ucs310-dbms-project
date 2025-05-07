import sqlQuery from '../utils/db.js';

// ✅ List all lounges
export const listLounges = async (_req, res) => {
  try {
    const rows = await sqlQuery(
      `SELECT l.lounge_id, l.name, l.capacity, a.airport_name, a.city
         FROM lounges l
         JOIN airports a ON l.airport_id = a.airport_id`
    );
    res.json(rows);
  } catch (err) {
    console.error('List Lounges Error:', err);
    res.status(500).json({ message: 'Server error listing lounges' });
  }
};

// ✅ Add a new lounge
export const addLounge = async (req, res) => {
  const { airport_id, name, capacity } = req.body;

  if (!airport_id || !name || !capacity) {
    return res.status(400).json({ message: 'airport_id, name, and capacity are required' });
  }

  try {
    // Check if airport exists
    const [airport] = await sqlQuery('SELECT airport_name, city FROM airports WHERE airport_id = ?', [airport_id]);
    if (!airport) {
      return res.status(404).json({ message: 'Invalid airport_id' });
    }

    // Insert lounge
    const result = await sqlQuery(
      'INSERT INTO lounges (airport_id, name, capacity) VALUES (?, ?, ?)',
      [airport_id, name, capacity]
    );

    res.status(201).json({
      message: 'Lounge added',
      lounge: {
        lounge_id: result.insertId,
        name,
        capacity,
        location: {
          airport_name: airport.airport_name,
          city: airport.city,
        },
      },
    });
  } catch (err) {
    console.error('Add Lounge Error:', err);
    res.status(500).json({ message: 'Server error adding lounge' });
  }
};

// ✅ Delete a lounge
export const deleteLounge = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await sqlQuery('DELETE FROM lounges WHERE lounge_id = ?', [id]);
    res.json({ message: 'Lounge deleted' });
  } catch (err) {
    console.error('Delete Lounge Error:', err);
    res.status(500).json({ message: 'Server error deleting lounge' });
  }
};
