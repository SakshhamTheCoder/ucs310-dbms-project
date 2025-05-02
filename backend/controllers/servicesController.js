// controllers/servicesController.js
import sqlQuery from '../utils/db.js';

// Public: list services
export const listServices = async (_req, res) => {
  try {
    const rows = await sqlQuery(`
      SELECT service_id, name, description, price, available_quantity, created_at
        FROM services
       ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('List Services Error:', err);
    res.status(500).json({ message: 'Server error listing services' });
  }
};

// Admin: create service with stock
export const createService = async (req, res) => {
  const { name, description, price, available_quantity } = req.body;
  if (!name || price == null || available_quantity == null) {
    return res
      .status(400)
      .json({ message: 'Name, price, and available_quantity are required' });
  }

  try {
    const result = await sqlQuery(
      `INSERT INTO services
         (name, description, price, available_quantity)
       VALUES (?, ?, ?, ?)`,
      [name, description || null, price, available_quantity]
    );
    res.status(201).json({
      message: 'Service created successfully',
      service_id: result.insertId
    });
  } catch (err) {
    console.error('Create Service Error:', err);
    res.status(500).json({ message: 'Server error creating service' });
  }
};

// User: add to booking, decrement stock
export const addServiceToBooking = async (req, res) => {
  const bookingId = Number(req.params.bid);
  const userId    = req.user.id;
  const { serviceId, quantity } = req.body;

  if (!serviceId || !quantity) {
    return res
      .status(400)
      .json({ message: 'serviceId and quantity are required' });
  }

  try {
    // Verify booking ownership
    const bk = await sqlQuery(
      'SELECT user_id FROM bookings WHERE booking_id = ?',
      [bookingId]
    );
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }

    // Check stock
    const srv = await sqlQuery(
      'SELECT available_quantity FROM services WHERE service_id = ?',
      [serviceId]
    );
    if (!srv.length) {
      return res.status(404).json({ message: 'Service not found' });
    }
    if (srv[0].available_quantity < quantity) {
      return res
        .status(400)
        .json({ message: 'Insufficient service stock' });
    }

    // Add booking service
    const r = await sqlQuery(
      `INSERT INTO booking_services
         (booking_id, service_id, quantity)
       VALUES (?, ?, ?)`,
      [bookingId, serviceId, quantity]
    );

    // Decrement stock
    await sqlQuery(
      `UPDATE services
          SET available_quantity = available_quantity - ?
        WHERE service_id = ?`,
      [quantity, serviceId]
    );

    res.status(201).json({
      message: 'Service added to booking',
      booking_service_id: r.insertId
    });
  } catch (err) {
    console.error('Add Service Error:', err);
    res.status(500).json({ message: 'Server error adding service' });
  }
};

// User: list booking’s services
export const listBookingServices = async (req, res) => {
  const bookingId = Number(req.params.bid);
  const userId    = req.user.id;
  try {
    const bk = await sqlQuery(
      'SELECT user_id FROM bookings WHERE booking_id = ?',
      [bookingId]
    );
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    const rows = await sqlQuery(
      `SELECT bs.id    AS booking_service_id,
              bs.quantity,
              s.service_id,
              s.name,
              s.description,
              s.price
         FROM booking_services bs
         JOIN services s ON bs.service_id = s.service_id
        WHERE bs.booking_id = ?`,
      [bookingId]
    );
    res.json(rows);
  } catch (err) {
    console.error('List Booking Services Error:', err);
    res.status(500).json({ message: 'Server error listing booking services' });
  }
};

// User: remove service
export const removeServiceFromBooking = async (req, res) => {
  const id = Number(req.params.id);
  try {
    // Restore stock
    const row = await sqlQuery(
      `SELECT bs.quantity, bs.service_id
         FROM booking_services bs
        WHERE bs.id = ?`,
      [id]
    );
    if (row.length) {
      await sqlQuery(
        `UPDATE services
            SET available_quantity = available_quantity + ?
          WHERE service_id = ?`,
        [row[0].quantity, row[0].service_id]
      );
    }
    await sqlQuery(
      'DELETE FROM booking_services WHERE id = ?',
      [id]
    );
    res.json({ message: 'Service removed from booking' });
  } catch (err) {
    console.error('Remove Service Error:', err);
    res.status(500).json({ message: 'Server error removing service' });
  }
};
