import express from 'express';
import {
  authenticateToken,
  verifyAdmin
} from '../middleware/authMiddleware.js';
import {
  createNotification,
  listMyNotifications,
  markAsRead,
  listAllNotifications,
  deleteNotification
} from '../controllers/notificationsController.js';

const router = express.Router();

// Notifications Routes

// Admin: create & view all & delete
router.post(
  '/notifications',
  authenticateToken,
  verifyAdmin,
  createNotification
);
router.get(
  '/notifications/all',
  authenticateToken,
  verifyAdmin,
  listAllNotifications
);
router.delete(
  '/notifications/:id',
  authenticateToken,
  verifyAdmin,
  deleteNotification
);

// User: list own & mark read
router.get(
  '/notifications',
  authenticateToken,
  listMyNotifications
);
router.patch(
  '/notifications/:id/read',
  authenticateToken,
  markAsRead
);

export default router;
