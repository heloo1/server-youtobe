import express from 'express';
import { signup, signin, getUser } from '../controllers/auth.js';
import { verifyToken } from '../verifyToken.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/getUser', verifyToken, getUser);

export default router;
