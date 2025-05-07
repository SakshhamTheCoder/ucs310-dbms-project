import express from 'express';
import {
  listGates,
  addGate,
  updateGate,
  deleteGate,
  assignGate,
  viewFlightGate,
  unassignGate
} from '../controllers/gateController.js';
import { authenticateToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin
router.get('/gates', authenticateToken, verifyAdmin, listGates);
router.post('/gates', authenticateToken, verifyAdmin, addGate);
router.patch('/gates/:id', authenticateToken, verifyAdmin, updateGate);
router.delete('/gates/:id', authenticateToken, verifyAdmin, deleteGate);

// Assignments
router.post('/flights/:fid/gate', authenticateToken, verifyAdmin, assignGate);
router.get('/flights/:fid/gate', viewFlightGate);
router.delete('/gate-assignments/:id', authenticateToken, verifyAdmin, unassignGate);

export default router;
