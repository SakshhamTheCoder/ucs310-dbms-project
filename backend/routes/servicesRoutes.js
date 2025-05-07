import express from 'express';
import {
  listServices,
  createService,
  updateService,
  deleteService,
  addServiceToBooking,
  listBookingServices,
  removeServiceFromBooking,
  listAllServiceOrders
} from '../controllers/servicesController.js';
import { authenticateToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/services', listServices);

// Admin Routes
router.post('/services/add', authenticateToken, verifyAdmin, createService);
router.patch('/services/:id', authenticateToken, verifyAdmin, updateService);
router.delete('/services/:id', authenticateToken, verifyAdmin, deleteService);
router.get('/service-orders/all', authenticateToken, verifyAdmin, listAllServiceOrders);

// Authenticated User Routes
router.post('/bookings/:bid/services', authenticateToken, addServiceToBooking);
router.get('/bookings/:bid/services', authenticateToken, listBookingServices);
router.delete('/bookings/:bid/services/:id', authenticateToken, removeServiceFromBooking);

export default router;
