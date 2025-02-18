import express from 'express';
import { login, me, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/me', me);

export default router;
