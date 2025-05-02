import express from 'express';
import {
  listCrew,
  addCrew,
  updateCrew,
  deleteCrew,
  assignCrew,
  listFlightCrew,
  unassignCrew
} from '../controllers/crewController.js';
import { authenticateToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin
router.get('/crew', authenticateToken, verifyAdmin, listCrew);
router.post('/crew', authenticateToken, verifyAdmin, addCrew);
router.patch('/crew/:id', authenticateToken, verifyAdmin, updateCrew);
router.delete('/crew/:id', authenticateToken, verifyAdmin, deleteCrew);

// Assignments
router.post('/flights/:fid/crew', authenticateToken, verifyAdmin, assignCrew);
router.get('/flights/:fid/crew', authenticateToken, listFlightCrew);
router.delete('/crew-assignments/:id', authenticateToken, verifyAdmin, unassignCrew);

export default router;
