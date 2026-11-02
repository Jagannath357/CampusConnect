import { Router } from 'express';
import {
  getClubs,
  getClubById,
  applyForClub,
  getMyClubApplications,
} from '../controllers/club.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { applyClubSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', getClubs);
router.get('/my-applications', getMyClubApplications);
router.get('/:id', getClubById);
router.post('/apply', validate(applyClubSchema), applyForClub);

export default router;

