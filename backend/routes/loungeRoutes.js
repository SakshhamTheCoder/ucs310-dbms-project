import express from 'express';
import {
  listLounges,
  addLounge,
  deleteLounge
} from '../controllers/loungeController.js';
import { authenticateToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/lounges', listLounges);

// Admin
router.post('/lounges', authenticateToken, verifyAdmin, addLounge);
router.delete('/lounges/:id', authenticateToken, verifyAdmin, deleteLounge);

export default router;
