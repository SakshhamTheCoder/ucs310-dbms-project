import sqlQuery from '../utils/db.js';

export const addPassengers = async (req, res) => {
  const bookingId = Number(req.params.id);
  const userId = req.user.id;
  const { passengers } = req.body; // expect array of { name, age, gender, passport_no }

  if (!Array.isArray(passengers) || passengers.length === 0) {
    return res
      .status(400)
      .json({ message: 'Pass an array of passengers' });
  }

  try {
    // Verify booking belongs to this user
    const bk = await sqlQuery(
      'SELECT user_id FROM bookings WHERE booking_id = ?',
      [bookingId]
    );
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }

    // Insert each passenger
    const insertSql = `
      INSERT INTO passengers
        (booking_id, name, age, gender, passport_no)
      VALUES (?, ?, ?, ?, ?)
    `;
    for (const p of passengers) {
      await sqlQuery(insertSql, [
        bookingId,
        p.name,
        p.age,
        p.gender,
        p.passport_no || null
      ]);
    }

    res
      .status(201)
      .json({ message: 'Passengers added successfully' });
  } catch (err) {
    console.error('Add Passengers Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listPassengers = async (req, res) => {
  const bookingId = Number(req.params.id);
  const userId = req.user.id;

  try {
    // Verify ownership
    const bk = await sqlQuery(
      'SELECT user_id FROM bookings WHERE booking_id = ?',
      [bookingId]
    );
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }

    const rows = await sqlQuery(
      'SELECT passenger_id, name, age, gender, passport_no, created_at FROM passengers WHERE booking_id = ?',
      [bookingId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List Passengers Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePassenger = async (req, res) => {
  const passengerId = Number(req.params.id);

  try {
    await sqlQuery(
      'DELETE FROM passengers WHERE passenger_id = ?',
      [passengerId]
    );
    res.json({ message: 'Passenger removed successfully' });
  } catch (err) {
    console.error('Delete Passenger Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
