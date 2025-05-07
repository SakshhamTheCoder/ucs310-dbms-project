import sqlQuery from '../utils/db.js';

// Helpers to resolve status/method names to IDs
const getStatusId = async (statusName) => {
  const rows = await sqlQuery('SELECT status_id FROM payment_statuses WHERE status_name = ?', [statusName]);
  return rows[0]?.status_id || null;
};

const getMethodId = async (methodName) => {
  const rows = await sqlQuery('SELECT method_id FROM payment_methods WHERE method_name = ?', [methodName]);
  return rows[0]?.method_id || null;
};

// Initiate or update a payment for a booking (normalized)
export const initiatePayment = async (req, res) => {
  const { bookingId, amount, method, transactionRef } = req.body;
  const userId = req.user.id;

  if (!bookingId || !amount || !method) {
    return res.status(400).json({ message: 'bookingId, amount, and method required' });
  }

  try {
    // Check if booking belongs to user
    const booking = await sqlQuery('SELECT user_id FROM bookings WHERE booking_id = ?', [bookingId]);
    if (!booking.length || booking[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }

    const methodId = await getMethodId(method);
    const statusId = await getStatusId('Completed');

    if (!methodId || !statusId) {
      return res.status(400).json({ message: 'Invalid method or status' });
    }

    const result = await sqlQuery(
      `INSERT INTO payments (booking_id, user_id, amount, method_id, transaction_ref, status_id)
         VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         amount = VALUES(amount),
         method_id = VALUES(method_id),
         transaction_ref = VALUES(transaction_ref),
         status_id = VALUES(status_id),
         payment_date = CURRENT_TIMESTAMP`,
      [bookingId, userId, amount, methodId, transactionRef || null, statusId]
    );

    let paymentId = result.insertId;
    if (!paymentId) {
      const rows = await sqlQuery('SELECT payment_id FROM payments WHERE booking_id = ?', [bookingId]);
      paymentId = rows[0]?.payment_id;
    }

    return res.status(201).json({ message: 'Payment recorded', payment_id: paymentId });
  } catch (err) {
    console.error('Initiate Payment Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List current user's payments with joined method/status
export const listMyPayments = async (req, res) => {
  const userId = req.user.id;
  try {
    const rows = await sqlQuery(
      `SELECT p.payment_id, p.booking_id, p.amount, pm.method_name, ps.status_name, p.payment_date
         FROM payments p
         JOIN payment_methods pm ON p.method_id = pm.method_id
         JOIN payment_statuses ps ON p.status_id = ps.status_id
        WHERE p.user_id = ?
        ORDER BY p.payment_date DESC`,
      [userId]
    );
    return res.json(rows);
  } catch (err) {
    console.error('List My Payments Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List all payments (admin)
export const listAllPayments = async (_req, res) => {
  try {
    const rows = await sqlQuery(
      `SELECT p.payment_id, p.booking_id, p.user_id, u.username, p.amount,
              pm.method_name, ps.status_name, p.payment_date
         FROM payments p
         JOIN users u ON p.user_id = u.user_id
         JOIN payment_methods pm ON p.method_id = pm.method_id
         JOIN payment_statuses ps ON p.status_id = ps.status_id
        ORDER BY p.payment_date DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('List All Payments Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update payment status by ID
export const updatePaymentStatus = async (req, res) => {
  const paymentId = Number(req.params.id);
  const { status } = req.body;

  if (!['Pending', 'Completed', 'Failed', 'Refunded'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const statusId = await getStatusId(status);
    if (!statusId) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await sqlQuery('UPDATE payments SET status_id = ? WHERE payment_id = ?', [statusId, paymentId]);
    return res.json({ message: 'Payment status updated' });
  } catch (err) {
    console.error('Update Payment Status Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add a payment (used by admin or backend processes)
export const addPayment = async (req, res) => {
  const { booking_id, user_id, amount, status_id, method_id, transaction_ref } = req.body;

  if (!booking_id || !user_id || !amount || !status_id || !method_id) {
    return res.status(400).json({ message: 'booking_id, user_id, amount, status_id, and method_id are required' });
  }

  try {
    const [booking] = await sqlQuery('SELECT booking_id FROM bookings WHERE booking_id = ?', [booking_id]);
    if (!booking) {
      return res.status(404).json({ message: 'Invalid booking_id' });
    }

    const result = await sqlQuery(
      'INSERT INTO payments (booking_id, user_id, amount, status_id, method_id, transaction_ref) VALUES (?, ?, ?, ?, ?, ?)',
      [booking_id, user_id, amount, status_id, method_id, transaction_ref]
    );

    res.status(201).json({ message: 'Payment added', payment_id: result.insertId });
  } catch (err) {
    console.error('Add Payment Error:', err);
    res.status(500).json({ message: 'Server error adding payment' });
  }
};

// List all payments with status/method/username
export const listPayments = async (_req, res) => {
  try {
    const rows = await sqlQuery(
      `SELECT p.payment_id, p.amount, p.transaction_ref, p.payment_date,
              ps.status_name, pm.method_name, u.username
         FROM payments p
         JOIN payment_statuses ps ON p.status_id = ps.status_id
         JOIN payment_methods pm ON p.method_id = pm.method_id
         JOIN users u ON p.user_id = u.user_id`
    );
    res.json(rows);
  } catch (err) {
    console.error('List Payments Error:', err);
    res.status(500).json({ message: 'Server error listing payments' });
  }
};

// Delete a payment by ID
export const deletePayment = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await sqlQuery('DELETE FROM payments WHERE payment_id = ?', [id]);
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    console.error('Delete Payment Error:', err);
    res.status(500).json({ message: 'Server error deleting payment' });
  }
};
