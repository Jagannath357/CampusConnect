import { Router } from 'express';
import {
  getEvents,
  getEventById,
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} from '../controllers/event.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getEvents);
router.get('/my-registrations', getMyRegistrations);
router.get('/:id', getEventById);
router.post('/:id/register', registerForEvent);
router.post('/:id/cancel', cancelRegistration);

export default router;
