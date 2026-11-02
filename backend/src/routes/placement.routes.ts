import { Router } from 'express';
import {
  getEligiblePlacements,
  getPlacementById,
} from '../controllers/placement.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

// Personalized eligible placements filtered strictly by student's branch & CGPA on the backend
router.get('/', getEligiblePlacements);
router.get('/:id', getPlacementById);

export default router;

