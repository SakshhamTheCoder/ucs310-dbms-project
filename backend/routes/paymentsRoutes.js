import express from 'express';
import {
  authenticateToken,
  verifyAdmin
} from '../middleware/authMiddleware.js';
import {
  initiatePayment,
  listMyPayments,
  listAllPayments,
  updatePaymentStatus
} from '../controllers/paymentsController.js';

const router = express.Router();

// User: make a payment
router.post(
  '/payments/initiate',
  authenticateToken, // Ensure user is authenticated
  initiatePayment // Handle payment initiation
);

// User: view own payments
router.get(
  '/payments/my',
  authenticateToken, // Ensure user is authenticated
  listMyPayments // Get list of user's payments
);

// Admin: view all payments
router.get(
  '/payments/all',
  authenticateToken, // Ensure user is authenticated
  verifyAdmin, // Ensure user is an admin
  listAllPayments // Get list of all payments
);

// Admin: update payment status
router.patch(
  '/payments/:id/status',
  authenticateToken, // Ensure user is authenticated
  verifyAdmin, // Ensure user is an admin
  updatePaymentStatus // Update the payment status
);

export default router;
