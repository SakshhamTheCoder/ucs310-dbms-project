import sqlQuery from '../utils/db.js';

// Admin: list all users
export const listUsers = async (_req, res) => {
  try {
    const rows = await sqlQuery(`
      SELECT user_id, username, email, phone_number, passport_number
        FROM users
       ORDER BY username
    `);
    res.json(rows);
  } catch (err) {
    console.error('List Users Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: delete a user (and cascade all their data)
export const deleteUser = async (req, res) => {
  const userId = Number(req.params.id);
  try {
    await sqlQuery('DELETE FROM users WHERE user_id = ?', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete User Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
