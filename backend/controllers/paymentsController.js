import sqlQuery from '../utils/db.js';

export const initiatePayment = async (req, res) => {
  const { bookingId, amount, method, transactionRef } = req.body;
  const userId = req.user.id;

  if (!bookingId || !amount || !method) {
    return res.status(400).json({ message: 'bookingId, amount, and method required' });
  }

  try {
    // Verify booking belongs to user
    const bk = await sqlQuery('SELECT user_id FROM bookings WHERE booking_id = ?', [bookingId]);
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }

    // Insert or update payment
    const result = await sqlQuery(
      `INSERT INTO payments (booking_id, user_id, amount, method, transaction_ref, status)
         VALUES (?, ?, ?, ?, ?, 'Completed')
       ON DUPLICATE KEY UPDATE
         amount          = VALUES(amount),
         method          = VALUES(method),
         transaction_ref = VALUES(transaction_ref),
         status          = 'Completed',
         payment_date    = CURRENT_TIMESTAMP`,
      [bookingId, userId, amount, method, transactionRef || null]
    );

    // Determine payment_id: prefer insertId, but if 0 (duplicate), fetch it
    let paymentId = result.insertId;
    if (!paymentId) {
      const rows = await sqlQuery(
        'SELECT payment_id FROM payments WHERE booking_id = ?',
        [bookingId]
      );
      paymentId = rows[0]?.payment_id;
    }

    return res.status(201).json({
      message: 'Payment recorded',
      payment_id: paymentId
    });
  } catch (err) {
    console.error('Initiate Payment Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const listMyPayments = async (req, res) => {
  const userId = req.user.id;
  try {
    const rows = await sqlQuery(
      `SELECT payment_id, booking_id, amount, method, status, payment_date
         FROM payments
        WHERE user_id = ?
        ORDER BY payment_date DESC`,
      [userId]
    );
    return res.json(rows);
  } catch (err) {
    console.error('List My Payments Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const listAllPayments = async (_req, res) => {
  try {
    const rows = await sqlQuery(
      `SELECT p.payment_id, p.booking_id, p.user_id, u.username, p.amount, p.method, p.status, p.payment_date
         FROM payments p
         JOIN users u ON p.user_id = u.user_id
        ORDER BY p.payment_date DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('List All Payments Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updatePaymentStatus = async (req, res) => {
  const paymentId = Number(req.params.id);
  const { status } = req.body; // Pending, Completed, Failed, Refunded

  if (!['Pending','Completed','Failed','Refunded'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    await sqlQuery('UPDATE payments SET status = ? WHERE payment_id = ?', [status, paymentId]);
    return res.json({ message: 'Payment status updated' });
  } catch (err) {
    console.error('Update Payment Status Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
