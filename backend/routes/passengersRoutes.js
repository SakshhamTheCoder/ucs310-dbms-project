import express from 'express';
import {
  authenticateToken
} from '../middleware/authMiddleware.js';
import {
  addPassengers,
  listPassengers,
  deletePassenger
} from '../controllers/passengersController.js';

const router = express.Router();

// User may add/list passengers on *their* booking
router.post(
  '/bookings/:id/passengers',
  authenticateToken,
  addPassengers
);
router.get(
  '/bookings/:id/passengers',
  authenticateToken,
  listPassengers
);

// Admin (or cleanup) may remove any passenger
router.delete(
  '/passengers/:id',
  authenticateToken,
  deletePassenger
);

export default router;
