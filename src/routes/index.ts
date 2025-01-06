import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';

const router: Router = Router();
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);


export default router;
