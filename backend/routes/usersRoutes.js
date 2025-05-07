import express from 'express';
import {
  authenticateToken,
  verifyAdmin
} from '../middleware/authMiddleware.js';
import {
  listUsers,
  deleteUser
} from '../controllers/usersController.js';

const router = express.Router();

// Admin: user management
router.get(
  '/users',
  authenticateToken,
  verifyAdmin,
  listUsers
);
router.delete(
  '/users/:id',
  authenticateToken,
  verifyAdmin,
  deleteUser
);

export default router;
