import express from 'express';
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
  getBookingsByUsername,
} from '../controllers/flightController.js';
import {
  authenticateToken,
  verifyAdmin,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// — Public —
router.get('/flights', listFlights);
router.get('/airports', listAirports);
router.get('/airlines', listAirlines);

// — Admin Only —
router.post('/flights/add', authenticateToken, verifyAdmin, addFlight);
router.post('/airports/add', authenticateToken, verifyAdmin, addAirport);
router.post('/airlines/add', authenticateToken, verifyAdmin, addAirline);

// — Authenticated Users —
router.post('/bookings', authenticateToken, bookFlight);
router.get('/bookings', authenticateToken, fetchUserBookings);
router.delete('/bookings/:id', authenticateToken, deleteBooking);
router.get('/bookings/search', authenticateToken, verifyAdmin, getBookingsByUsername);

export default router;
