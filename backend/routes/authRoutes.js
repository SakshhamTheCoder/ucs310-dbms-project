import express from 'express';
import { login, me, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', me); // Ensure this is a GET request

export default router;