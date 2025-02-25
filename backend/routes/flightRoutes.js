import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
    listFlights,
    fetchUserBookings,
    bookFlight,
    deleteBooking,
    addFlight,
    listAirports,
    addAirport,
    listAirlines,
    addAirline,
} from '../controllers/flightController.js';

const router = express.Router();

router.get('/flights', authenticateToken, listFlights);
router.get('/bookings', authenticateToken, fetchUserBookings);
router.post('/bookings', authenticateToken, bookFlight);
router.delete('/bookings/:id', authenticateToken, deleteBooking);
router.post('/flights/add', authenticateToken, addFlight);
router.get('/airports', authenticateToken, listAirports);
router.post('/airports/add', authenticateToken, addAirport);
router.get('/airlines', authenticateToken, listAirlines);
router.post('/airlines/add', authenticateToken, addAirline);

export default router;

