import express from 'express';
import sqlQuery from '../utils/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to list all flights (protected)
router.get('/flights', authenticateToken, async (req, res) => {
    try {
        const flights = await sqlQuery(`
            SELECT flights.flight_id, departure_time, arrival_time, 
                   dep.airport_name AS departure_airport, arr.airport_name AS arrival_airport, 
                   airlines.airline_name
            FROM flights
            JOIN airports dep ON flights.departure_station = dep.airport_id
            JOIN airports arr ON flights.arrival_station = arr.airport_id
            JOIN airlines ON flights.airline_id = airlines.airline_id
        `);
        console.log("Fetched Flights: ", flights); // Debugging line
        res.json(flights);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to fetch user bookings
router.get('/bookings', authenticateToken, async (req, res) => {
    const user_id = req.user.id;

    try {
        const bookings = await sqlQuery(`
            SELECT bookings.booking_id, bookings.booking_date,
                   flights.flight_id, flights.departure_time, flights.arrival_time,
                   dep.airport_name AS departure_airport, arr.airport_name AS arrival_airport,
                   airlines.airline_name
            FROM bookings
            JOIN flights ON bookings.flight_id = flights.flight_id
            JOIN airports dep ON flights.departure_station = dep.airport_id
            JOIN airports arr ON flights.arrival_station = arr.airport_id
            JOIN airlines ON flights.airline_id = airlines.airline_id
            WHERE bookings.user_id = ?
        `, [user_id]);

        console.log("Fetched Bookings for User:", bookings); // Debug log
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to book a flight
router.post('/bookings', authenticateToken, async (req, res) => {
    const { flightId } = req.body; // Ensure this matches the frontend payload
    const user_id = req.user.id;

    console.log('Incoming Payload:', req.body); // Debug log

    if (!flightId) {
        return res.status(400).json({ message: 'Flight ID is required' });
    }

    try {
        // Check if the user has already booked this flight
        const existingBooking = await sqlQuery(
            'SELECT * FROM bookings WHERE user_id = ? AND flight_id = ?',
            [user_id, flightId]
        );

        if (existingBooking.length > 0) {
            return res.status(400).json({ message: 'You have already booked this flight' });
        }

        // Create the booking
        const result = await sqlQuery(`
            INSERT INTO bookings (user_id, flight_id) VALUES (?, ?)
        `, [user_id, flightId]);

        res.status(201).json({ message: 'Booking successful', booking_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/bookings/:id
router.delete('/bookings/:id', authenticateToken, async (req, res) => {
    const bookingId = req.params.id;
    const user_id = req.user.id;

    try {
        await sqlQuery('DELETE FROM bookings WHERE booking_id = ? AND user_id = ?', [bookingId, user_id]);
        res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;