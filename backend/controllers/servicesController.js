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
      `INSERT INTO services (name, description)
       VALUES (?, ?)`,
      [name, description || null]
    );

    await sqlQuery(
      `INSERT INTO service_inventory (service_id, price, available_quantity)
       VALUES (?, ?, ?)`,
      [result.insertId, price, available_quantity]
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
      `SELECT s.service_id, s.name, s.description, 
              si.price, si.available_quantity
         FROM services s
         JOIN service_inventory si ON s.service_id = si.service_id`
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
    if (name !== undefined || description !== undefined) {
      await sqlQuery(
        `UPDATE services
            SET name = COALESCE(?, name),
                description = COALESCE(?, description)
          WHERE service_id = ?`,
        [name, description, id]
      );
    }

    if (price !== undefined || available_quantity !== undefined) {
      await sqlQuery(
        `UPDATE service_inventory
            SET price = COALESCE(?, price),
                available_quantity = COALESCE(?, available_quantity)
          WHERE service_id = ?`,
        [price, available_quantity, id]
      );
    }

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
      'SELECT available_quantity FROM service_inventory WHERE service_id = ?',
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
      `UPDATE bookings 
          SET total_price = total_price + (SELECT price FROM service_inventory WHERE service_id = ?) * ?, service_id = ?
        WHERE booking_id = ?`,
      [serviceId, quantity, serviceId, bookingId]
    );

    await sqlQuery(
      `UPDATE service_inventory
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
      `SELECT s.service_id, s.name, s.description, 
              si.price, b.total_price, si.available_quantity
         FROM bookings b
         JOIN services s ON b.service_id = s.service_id
         JOIN service_inventory si ON s.service_id = si.service_id
        WHERE b.booking_id = ?`,
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
  const bookingId = Number(req.params.bid);
  const userId = req.user.id;

  try {
    const bk = await sqlQuery(
      'SELECT user_id, service_id, total_price FROM bookings WHERE booking_id = ?',
      [bookingId]
    );
    if (!bk.length || bk[0].user_id !== userId) {
      return res.status(403).json({ message: 'Not your booking' });
    }

    const serviceId = bk[0].service_id;
    const totalPrice = bk[0].total_price;

    const srv = await sqlQuery(
      'SELECT price, available_quantity FROM service_inventory WHERE service_id = ?',
      [serviceId]
    );
    if (!srv.length) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const updatedPrice = totalPrice - srv[0].price;

    await sqlQuery(
      `UPDATE bookings 
          SET total_price = ?, service_id = NULL
        WHERE booking_id = ?`,
      [updatedPrice, bookingId]
    );

    await sqlQuery(
      `UPDATE service_inventory
          SET available_quantity = available_quantity + 1
        WHERE service_id = ?`,
      [serviceId]
    );

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
      SELECT b.booking_id, b.total_price, b.service_id, b.booking_date,
             s.name AS service_name, si.price,
             u.username 
        FROM bookings b
        JOIN services s ON b.service_id = s.service_id
        JOIN service_inventory si ON s.service_id = si.service_id
        JOIN users u ON b.user_id = u.user_id
       WHERE b.service_id IS NOT NULL
       ORDER BY b.booking_date DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('List All Service Orders Error:', err);
    res.status(500).json({ message: 'Server error listing service orders' });
  }
};
