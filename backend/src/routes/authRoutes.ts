import { Router } from 'express';
import { googleAuth, getProfile } from '../controller/authController';
import { protect } from '../utils/protect';

const router = Router();

router.post('/google', googleAuth);
router.get('/profile', protect, getProfile);

export default router;
