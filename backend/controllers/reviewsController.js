import sqlQuery from '../utils/db.js';

export const addReview = async (req, res) => {
  const bookingId   = Number(req.params.bid);
  const passengerId = Number(req.params.pid);
  const { rating, comment } = req.body;
  const userId      = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'rating must be 1–5' });
  }

  try {
    // verify booking ownership and passenger belongs to booking
    const bk = await sqlQuery(
      'SELECT user_id FROM bookings WHERE booking_id = ?',
      [bookingId]
    );
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    const ps = await sqlQuery(
      'SELECT 1 FROM passengers WHERE passenger_id = ? AND booking_id = ?',
      [passengerId, bookingId]
    );
    if (!ps.length) {
      return res.status(404).json({ message: 'Passenger not found on booking' });
    }
    const result = await sqlQuery(
      `INSERT INTO reviews (passenger_id, flight_id, rating, comment)
       VALUES (?, (SELECT flight_id FROM bookings WHERE booking_id = ?), ?, ?)`,
      [passengerId, bookingId, rating, comment || null]
    );
    res.status(201).json({ message: 'Review added', review_id: result.insertId });
  } catch (err) {
    console.error('Add Review Error:', err);
    res.status(500).json({ message: 'Server error adding review' });
  }
};

export const listFlightReviews = async (req, res) => {
  const flightId = Number(req.params.fid);
  try {
    const rows = await sqlQuery(
      `SELECT r.review_id, r.rating, r.comment, r.created_at,
              p.name AS passenger_name
         FROM reviews r
         JOIN passengers p ON r.passenger_id = p.passenger_id
        WHERE r.flight_id = ?
        ORDER BY r.created_at DESC`,
      [flightId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List Flight Reviews Error:', err);
    res.status(500).json({ message: 'Server error listing reviews' });
  }
};

export const deleteReview = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await sqlQuery('DELETE FROM reviews WHERE review_id = ?', [id]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Delete Review Error:', err);
    res.status(500).json({ message: 'Server error deleting review' });
  }
};

export const listRecentReviews = async (req, res) => {
  try {
    const rows = await sqlQuery(
      `SELECT r.review_id, r.rating, r.comment, r.created_at,
              p.name AS passenger_name,
              CONCAT(dep.airport_name, ' → ', arr.airport_name) AS flight_route
         FROM reviews r
         JOIN passengers p ON r.passenger_id = p.passenger_id
         JOIN flights f ON r.flight_id = f.flight_id
         JOIN airports dep ON f.departure_station = dep.airport_id
         JOIN airports arr ON f.arrival_station = arr.airport_id
        ORDER BY r.created_at DESC
        LIMIT 10`,
    );
    res.json(rows);
  } catch (err) {
    console.error('List Recent Reviews Error:', err);
    res.status(500).json({ message: 'Server error listing recent reviews' });
  }
};

export const listAllReviews = async (req, res) => {
  try {
    const rows = await sqlQuery(
      `SELECT r.review_id, r.flight_id, r.rating, r.comment, r.created_at,
              p.name AS passenger_name
         FROM reviews r
         JOIN passengers p ON r.passenger_id = p.passenger_id
        ORDER BY r.created_at DESC`,
    );
    res.json(rows);
  } catch (err) {
    console.error('List All Reviews Error:', err);
    res.status(500).json({ message: 'Server error listing all reviews' });
  }
};