import { Router } from 'express';
import {
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  getProfileByUserId,
} from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/index.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(authenticate);

router.get('/me', getMyProfile);
router.put('/me', validate(updateProfileSchema), updateMyProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.get('/user/:userId', getProfileByUserId);

export default router;
