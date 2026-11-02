import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/collaboration.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCollabSchema, updateCollabSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', validate(createCollabSchema), createPost);
router.put('/:id', validate(updateCollabSchema), updatePost);
router.delete('/:id', deletePost);

export default router;

