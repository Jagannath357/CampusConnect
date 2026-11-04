import { Router } from 'express';
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getBroadcastHistory,
} from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getMyNotifications);
router.get('/broadcasts', getBroadcastHistory);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);

export default router;

