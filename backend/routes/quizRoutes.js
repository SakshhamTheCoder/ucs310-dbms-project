import express from 'express';
import { authenticateToken, verifyAdmin } from '../middleware/authMiddleware.js';
import { 
    createQuiz, 
    getQuizzes, 
    getQuizDetails 
} from '../controllers/quizController.js';

const router = express.Router();

router.post('/create', authenticateToken, verifyAdmin, createQuiz);
router.get('/', authenticateToken, verifyAdmin, getQuizzes);
router.get('/:id', authenticateToken, getQuizDetails);

export default router;