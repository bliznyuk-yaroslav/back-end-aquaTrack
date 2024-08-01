import { Router } from 'express';
import authRouter from './auth.js';
import userRouter from './user.js';

const router = Router();
router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router;
