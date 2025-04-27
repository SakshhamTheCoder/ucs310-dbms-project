import sqlQuery from '../utils/db.js';

export const createService = async (req, res) => {
  const { name, description, price } = req.body;
  if (!name || price == null) {
    return res
      .status(400)
      .json({ message: 'Name and price are required' });
  }

  try {
    const result = await sqlQuery(
      'INSERT INTO services (name, description, price) VALUES (?, ?, ?)',
      [name, description || null, price]
    );
    res
      .status(201)
      .json({
        message: 'Service created successfully',
        service_id: result.insertId
      });
  } catch (err) {
    console.error('Create Service Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listServices = async (_req, res) => {
  try {
    const rows = await sqlQuery(
      'SELECT service_id, name, description, price, created_at FROM services'
    );
    res.json(rows);
  } catch (err) {
    console.error('List Services Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addServiceToBooking = async (req, res) => {
  const bookingId = Number(req.params.bid);
  const userId = req.user.id;
  const { serviceId, quantity } = req.body;

  if (!serviceId || !quantity) {
    return res
      .status(400)
      .json({ message: 'serviceId and quantity required' });
  }

  try {
    // Verify booking belongs to user
    const bk = await sqlQuery(
      'SELECT user_id FROM bookings WHERE booking_id = ?',
      [bookingId]
    );
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }

    const result = await sqlQuery(
      `INSERT INTO booking_services
         (booking_id, service_id, quantity)
       VALUES (?, ?, ?)`,
      [bookingId, serviceId, quantity]
    );

    res
      .status(201)
      .json({
        message: 'Service added to booking',
        booking_service_id: result.insertId
      });
  } catch (err) {
    console.error('Add Service Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listBookingServices = async (req, res) => {
  const bookingId = Number(req.params.bid);
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
      `SELECT bs.id AS booking_service_id,
              bs.quantity,
              s.service_id,
              s.name,
              s.description,
              s.price
         FROM booking_services bs
         JOIN services s
           ON bs.service_id = s.service_id
        WHERE bs.booking_id = ?`,
      [bookingId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List Booking Services Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeServiceFromBooking = async (req, res) => {
  const srvBookingId = Number(req.params.id);

  try {
    await sqlQuery(
      'DELETE FROM booking_services WHERE id = ?',
      [srvBookingId]
    );
    res.json({ message: 'Service removed from booking' });
  } catch (err) {
    console.error('Remove Service Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
