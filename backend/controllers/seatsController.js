import sqlQuery from '../utils/db.js';

export const addSeats = async (req, res) => {
  const { flightId, seats } = req.body;
  // seats: array of { seat_number, seat_class }
  if (!flightId || !Array.isArray(seats)) {
    return res.status(400).json({ message: 'Provide flightId and seats array' });
  }

  try {
    const insertSql = `
      INSERT IGNORE INTO seats (flight_id, seat_number, seat_class)
      VALUES (?, ?, ?)
    `;
    for (const s of seats) {
      await sqlQuery(insertSql, [flightId, s.seat_number, s.seat_class]);
    }

    res.status(201).json({ message: 'Seats added successfully' });
  } catch (err) {
    console.error('Add Seats Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listSeats = async (req, res) => {
  const flightId = Number(req.params.flightId);
  try {
    const rows = await sqlQuery(
      'SELECT seat_id, seat_number, seat_class, is_booked FROM seats WHERE flight_id = ? ORDER BY seat_number',
      [flightId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List Seats Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const bookSeat = async (req, res) => {
  const bookingId = Number(req.body.bookingId);
  const seatId = Number(req.body.seatId);
  const userId = req.user.id;

  if (!bookingId || !seatId) {
    return res.status(400).json({ message: 'bookingId and seatId required' });
  }

  try {
    // Verify booking belongs to user
    const bk = await sqlQuery('SELECT user_id FROM bookings WHERE booking_id = ?', [bookingId]);
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }

    // Check seat availability
    const seat = await sqlQuery('SELECT is_booked FROM seats WHERE seat_id = ?', [seatId]);
    if (!seat.length || seat[0].is_booked) {
      return res.status(400).json({ message: 'Seat is not available' });
    }

    // Reserve
    await sqlQuery(
      'INSERT INTO seat_reservations (booking_id, seat_id) VALUES (?, ?)',
      [bookingId, seatId]
    );
    await sqlQuery('UPDATE seats SET is_booked = TRUE WHERE seat_id = ?', [seatId]);

    res.status(201).json({ message: 'Seat booked successfully' });
  } catch (err) {
    console.error('Book Seat Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listReservations = async (req, res) => {
  const bookingId = Number(req.params.bookingId);
  const userId = req.user.id;

  try {
    // Verify booking belongs to user
    const bk = await sqlQuery('SELECT user_id FROM bookings WHERE booking_id = ?', [bookingId]);
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }

    const rows = await sqlQuery(
      `SELECT sr.reservation_id, s.seat_id, s.seat_number, s.seat_class, sr.reserved_at
         FROM seat_reservations sr
         JOIN seats s ON sr.seat_id = s.seat_id
        WHERE sr.booking_id = ?`,
      [bookingId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List Reservations Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelReservation = async (req, res) => {
  const reservationId = Number(req.params.id);
  const userId = req.user.id;

  try {
    // Find reservation and its booking
    const row = await sqlQuery(
      `SELECT sr.booking_id, sr.seat_id, b.user_id
         FROM seat_reservations sr
         JOIN bookings b ON sr.booking_id = b.booking_id
        WHERE sr.reservation_id = ?`,
      [reservationId]
    );
    if (!row.length || row[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete reservation & mark seat available
    await sqlQuery('DELETE FROM seat_reservations WHERE reservation_id = ?', [reservationId]);
    await sqlQuery('UPDATE seats SET is_booked = FALSE WHERE seat_id = ?', [row[0].seat_id]);

    res.json({ message: 'Seat reservation cancelled' });
  } catch (err) {
    console.error('Cancel Reservation Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
