import sqlQuery from '../utils/db.js';

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
      `INSERT INTO services (name, description, price, available_quantity)
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

// List all services
export const listServices = async (_req, res) => {
  try {
    const rows = await sqlQuery(
      `SELECT s.service_id, s.name, s.description, s.price, s.available_quantity
         FROM services s`
    );
    res.json(rows);
  } catch (err) {
    console.error('List Services Error:', err);
    res.status(500).json({ message: 'Server error listing services' });
  }
};

// Admin: update an existing service
export const updateService = async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, available_quantity } = req.body;

  if (
    name === undefined &&
    description === undefined &&
    price === undefined &&
    available_quantity === undefined
  ) {
    return res
      .status(400)
      .json({ message: 'At least one field is required to update' });
  }

  try {
    await sqlQuery(
      `UPDATE services
          SET name = COALESCE(?, name),
              description = COALESCE(?, description),
              price = COALESCE(?, price),
              available_quantity = COALESCE(?, available_quantity)
        WHERE service_id = ?`,
      [name, description, price, available_quantity, id]
    );
    return res.json({ message: 'Service updated successfully' });
  } catch (err) {
    console.error('Update Service Error:', err);
    return res.status(500).json({ message: 'Server error updating service' });
  }
};

// Admin: delete a service
export const deleteService = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await sqlQuery('DELETE FROM services WHERE service_id = ?', [id]);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    console.error('Delete Service Error:', err);
    res.status(500).json({ message: 'Server error deleting service' });
  }
};

// User: add to booking, decrement stock
export const addServiceToBooking = async (req, res) => {
  const bookingId = Number(req.params.bid);
  const userId = req.user.id;
  const { serviceId, quantity } = req.body;

  if (!serviceId || !quantity) {
    return res
      .status(400)
      .json({ message: 'serviceId and quantity are required' });
  }

  try {
    const bk = await sqlQuery(
      'SELECT user_id FROM bookings WHERE booking_id = ?',
      [bookingId]
    );
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }

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

    const r = await sqlQuery(
      `INSERT INTO booking_services (booking_id, service_id, quantity)
       VALUES (?, ?, ?)`,
      [bookingId, serviceId, quantity]
    );

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

// User: list services in a booking
export const listBookingServices = async (req, res) => {
  const bookingId = Number(req.params.bid);
  const userId = req.user.id;
  try {
    const bk = await sqlQuery(
      'SELECT user_id FROM bookings WHERE booking_id = ?',
      [bookingId]
    );
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    const rows = await sqlQuery(
      `SELECT bs.id AS booking_service_id, bs.quantity,
              s.service_id, s.name, s.description, s.price
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

// User: remove service from booking and restore stock
export const removeServiceFromBooking = async (req, res) => {
  const id = Number(req.params.id);
  try {
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

    await sqlQuery('DELETE FROM booking_services WHERE id = ?', [id]);
    res.json({ message: 'Service removed from booking' });
  } catch (err) {
    console.error('Remove Service Error:', err);
    res.status(500).json({ message: 'Server error removing service' });
  }
};

// Admin: list all service orders
export const listAllServiceOrders = async (_req, res) => {
  try {
    const rows = await sqlQuery(`
      SELECT bs.id, bs.booking_id, bs.quantity, bs.added_at,
             s.name AS service_name, s.price,
             u.username 
        FROM booking_services bs
        JOIN services s ON bs.service_id = s.service_id
        JOIN bookings b ON bs.booking_id = b.booking_id
        JOIN users u ON b.user_id = u.user_id
       ORDER BY bs.added_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('List All Service Orders Error:', err);
    res.status(500).json({ message: 'Server error listing service orders' });
  }
};
