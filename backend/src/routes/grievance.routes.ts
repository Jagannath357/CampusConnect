import { Router } from 'express';
import { submitGrievance, trackGrievance } from '../controllers/grievance.controller.js';
import { validate } from '../middleware/validate.js';
import { createGrievanceSchema } from '../validators/index.js';

const router = Router();

// Anonymous submission & tracking (Preserving strict submitter anonymity)
router.post('/', validate(createGrievanceSchema), submitGrievance);
router.get('/track/:ticket', trackGrievance);

export default router;
