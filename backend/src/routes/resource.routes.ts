import { Router } from 'express';
import {
  getResources,
  getResourceById,
  uploadResource,
  trackDownload,
  deleteResource,
} from '../controllers/resource.controller.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { createResourceSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/', upload.single('file'), validate(createResourceSchema), uploadResource);
router.post('/:id/download', trackDownload);
router.delete('/:id', deleteResource);

export default router;
