import express from 'express';
import {
  addReview,
  listFlightReviews,
  deleteReview,
  listRecentReviews,
  listAllReviews
} from '../controllers/reviewsController.js';
import { authenticateToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User
router.post(
  '/bookings/:bid/passengers/:pid/reviews',
  authenticateToken,
  addReview
);

// Public
router.get('/flights/:fid/reviews', listFlightReviews);

// Admin
router.delete('/reviews/:id', authenticateToken, verifyAdmin, deleteReview);
// Add this new route
router.get('/reviews/recent', listRecentReviews);
router.get('/reviews/all', authenticateToken, verifyAdmin, listAllReviews);

export default router;
