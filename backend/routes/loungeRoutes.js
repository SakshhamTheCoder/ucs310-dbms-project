import express from 'express';
import {
  listLounges,
  addLounge,
  assignLounge,
  listMyLounges,
  removeLoungeAccess
} from '../controllers/loungeController.js';
import { authenticateToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/lounges', listLounges);

// Admin
router.post('/lounges', authenticateToken, verifyAdmin, addLounge);

// User
router.post('/bookings/:bid/lounges', authenticateToken, assignLounge);
router.get('/bookings/:bid/lounges', authenticateToken, listMyLounges);
router.delete('/bookings/:bid/lounges/:id', authenticateToken, removeLoungeAccess);

export default router;
