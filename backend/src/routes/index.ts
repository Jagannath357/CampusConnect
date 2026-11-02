import { Router } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import collabRoutes from './collaboration.routes.js';
import questionRoutes from './question.routes.js';
import resourceRoutes from './resource.routes.js';
import lostFoundRoutes from './lostFound.routes.js';
import eventRoutes from './event.routes.js';
import grievanceRoutes from './grievance.routes.js';
import notificationRoutes from './notification.routes.js';
import clubRoutes from './club.routes.js';
import placementRoutes from './placement.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/collaborations', collabRoutes);
router.use('/questions', questionRoutes);
router.use('/resources', resourceRoutes);
router.use('/lost-found', lostFoundRoutes);
router.use('/events', eventRoutes);
router.use('/grievances', grievanceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/clubs', clubRoutes);
router.use('/placements', placementRoutes);
router.use('/admin', adminRoutes);

export default router;

