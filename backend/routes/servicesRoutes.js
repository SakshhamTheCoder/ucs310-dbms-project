import express from 'express';
import {
  authenticateToken,
  verifyAdmin
} from '../middleware/authMiddleware.js';
import {
  createService,
  listServices,
  addServiceToBooking,
  listBookingServices,
  removeServiceFromBooking
} from '../controllers/servicesController.js';

const router = express.Router();

// Public: list all services
router.get('/services', listServices);

// Admin: manage master services
router.post('/services', authenticateToken, verifyAdmin, createService);

// User: add/list/remove services per booking
router.post(
  '/bookings/:bid/services',
  authenticateToken,
  addServiceToBooking
);
router.get(
  '/bookings/:bid/services',
  authenticateToken,
  listBookingServices
);
router.delete(
  '/bookings/:bid/services/:id',
  authenticateToken,
  removeServiceFromBooking
);

export default router;
