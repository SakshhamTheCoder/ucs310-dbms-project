import express from 'express';
import {
  authenticateToken,
  verifyAdmin
} from '../middleware/authMiddleware.js';
import {
  addSeats,
  listSeats,
  bookSeat,
  listReservations,
  cancelReservation
} from '../controllers/seatsController.js';

const router = express.Router();

// Admin: bulk add seats to flight
router.post(
  '/seats/add',
  authenticateToken,
  verifyAdmin,
  addSeats
);

// Public: view seat map for flight
router.get(
  '/seats/:flightId',
  listSeats
);

// User: reserve a seat under a booking
router.post(
  '/seats/book',
  authenticateToken,
  bookSeat
);

// User: list my seat reservations for a booking
router.get(
  '/bookings/:bookingId/seats',
  authenticateToken,
  listReservations
);

// User: cancel my reservation
router.delete(
  '/seats/reservations/:id',
  authenticateToken,
  cancelReservation
);

export default router;
