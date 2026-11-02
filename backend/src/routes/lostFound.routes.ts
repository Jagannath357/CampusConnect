import { Router } from 'express';
import {
  getItems,
  getItemById,
  createItem,
  submitClaim,
  getMySubmissionsAndClaims,
} from '../controllers/lostFound.controller.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { createLostFoundSchema, createClaimSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', getItems);
router.get('/my-items', getMySubmissionsAndClaims);
router.get('/:id', getItemById);
router.post('/', upload.single('image'), validate(createLostFoundSchema), createItem);
router.post('/:id/claim', upload.single('proofFile'), validate(createClaimSchema), submitClaim);

export default router;

