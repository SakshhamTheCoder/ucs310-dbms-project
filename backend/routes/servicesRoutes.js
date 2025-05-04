import express from 'express';
import {
  listServices,
  createService,
  addServiceToBooking,
  listBookingServices,
  removeServiceFromBooking,
  updateService,
  listAllServiceOrders,
  deleteService
} from '../controllers/servicesController.js';
import { authenticateToken, verifyAdmin } from '../middleware/authMiddleware.js';

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
router.patch(
  '/services/:id',
  authenticateToken,
  verifyAdmin,
  updateService
);
// Admin - Delete service
router.delete(
  '/services/:id',
  authenticateToken,
  verifyAdmin,
  deleteService
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

router.get(
  '/service-orders/all',
  authenticateToken,
  verifyAdmin,
  listAllServiceOrders
);

export default router;