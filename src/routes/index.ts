import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import scoreRoutes from './scoreRoutes';
import userRoutes from './userRoutes';

const router: Router = Router();
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/scores', scoreRoutes);
router.use('/users', userRoutes);


export default router;
