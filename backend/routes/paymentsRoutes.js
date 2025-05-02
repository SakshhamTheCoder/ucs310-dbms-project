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
  authenticateToken,
  initiatePayment
);

// User: view own payments
router.get(
  '/payments/my',
  authenticateToken,
  listMyPayments
);

// Admin: view all payments
router.get(
  '/payments/all',
  authenticateToken,
  verifyAdmin,
  listAllPayments
);

// Admin: update payment status
router.patch(
  '/payments/:id/status',
  authenticateToken,
  verifyAdmin,
  updatePaymentStatus
);

export default router;
