import sqlQuery from '../utils/db.js';

// Admin: create a notification for a user (with user existence check)
export const createNotification = async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res
      .status(400)
      .json({ message: 'userId and message are required' });
  }
  try {
    // Verify the user exists
    const users = await sqlQuery('SELECT 1 FROM users WHERE user_id = ?', [userId]);
    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await sqlQuery(
      'INSERT INTO notifications (user_id, message) VALUES (?, ?)',
      [userId, message]
    );
    return res
      .status(201)
      .json({
        message: 'Notification created successfully',
        notification_id: result.insertId
      });
  } catch (err) {
    console.error('Create Notification Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// User: list their own notifications
export const listMyNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    const rows = await sqlQuery(
      'SELECT notification_id, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return res.json(rows);
  } catch (err) {
    console.error('List My Notifications Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// User: mark a notification as read
export const markAsRead = async (req, res) => {
  const notifId = Number(req.params.id);
  const userId = req.user.id;
  try {
    const n = await sqlQuery(
      'SELECT 1 FROM notifications WHERE notification_id = ? AND user_id = ?',
      [notifId, userId]
    );
    if (!n.length) {
      return res.status(403).json({ message: 'Not your notification' });
    }
    await sqlQuery(
      'UPDATE notifications SET is_read = TRUE WHERE notification_id = ?',
      [notifId]
    );
    return res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Mark As Read Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Admin: list all notifications for all users
export const listAllNotifications = async (_req, res) => {
  try {
    const rows = await sqlQuery(`
      SELECT n.notification_id, n.user_id, u.username, n.message, n.is_read, n.created_at
        FROM notifications n
        JOIN users u ON n.user_id = u.user_id
       ORDER BY n.created_at DESC
    `);
    return res.json(rows);
  } catch (err) {
    console.error('List All Notifications Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Admin: delete any notification
export const deleteNotification = async (req, res) => {
  const notifId = Number(req.params.id);
  try {
    await sqlQuery(
      'DELETE FROM notifications WHERE notification_id = ?',
      [notifId]
    );
    return res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Delete Notification Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
