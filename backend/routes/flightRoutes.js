import express from 'express';
import sqlQuery from '../utils/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to list all flights
router.get('/flights', async (req, res) => {
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
        res.json(flights);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to book a flight
router.post('/bookings', authenticateToken, async (req, res) => {
    const { flight_id } = req.body;
    const user_id = req.user.id;

    if (!flight_id) {
        return res.status(400).json({ message: 'Flight ID is required' });
    }

    try {
        const result = await sqlQuery(`
            INSERT INTO bookings (user_id, flight_id) VALUES (?, ?)
        `, [user_id, flight_id]);

        res.status(201).json({ message: 'Booking successful', booking_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
