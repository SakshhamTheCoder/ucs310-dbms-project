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


router.post(
  '/payments/initiate',
  authenticateToken,
  initiatePayment
);


router.get(
  '/payments/my',
  authenticateToken,
  listMyPayments
);


router.get(
  '/payments/all',
  authenticateToken,
  verifyAdmin,
  listAllPayments
);


router.patch(
  '/payments/:id/status',
  authenticateToken,
  verifyAdmin,
  updatePaymentStatus
);

export default router;
