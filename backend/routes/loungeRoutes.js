import express from 'express';
import {
  listLounges,
  addLounge,
  assignLounge,
  listMyLounges,
  removeLoungeAccess,
  listAllLoungeAccess
} from '../controllers/loungeController.js';
import { authenticateToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/lounges', listLounges);

// Admin
router.post('/lounges', authenticateToken, verifyAdmin, addLounge);
router.get('/lounge-access/all', authenticateToken, verifyAdmin, listAllLoungeAccess);

// User
router.post('/bookings/:bid/lounges', authenticateToken, assignLounge);
router.get('/bookings/:bid/lounges', authenticateToken, listMyLounges);
router.delete('/bookings/:bid/lounges/:id', authenticateToken, removeLoungeAccess);

export default router;
