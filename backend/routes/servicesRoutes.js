// routes/servicesRoutes.js
import express from 'express';
import {
  listServices,
  createService,
  addServiceToBooking,
  listBookingServices,
  removeServiceFromBooking
} from '../controllers/servicesController.js';
import {
  authenticateToken,
  verifyAdmin
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/services', listServices);

// Admin
router.post(
  '/services',
  authenticateToken,
  verifyAdmin,
  createService
);

// User
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
