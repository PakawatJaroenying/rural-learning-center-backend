import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import scoreRoutes from './scoreRoutes';

const router: Router = Router();
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/scores', scoreRoutes);


export default router;
