import { Router } from 'express';
import { recieveInput } from '../controller/courseController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/input', authMiddleware, recieveInput);

export default router;
