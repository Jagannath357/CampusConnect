import { Router } from 'express';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  createAnswer,
  deleteQuestion,
} from '../controllers/question.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createQuestionSchema, createAnswerSchema } from '../validators/index.js';

const router = Router();

router.use(authenticate);

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', validate(createQuestionSchema), createQuestion);
router.post('/:questionId/answers', validate(createAnswerSchema), createAnswer);
router.delete('/:id', deleteQuestion);

export default router;
