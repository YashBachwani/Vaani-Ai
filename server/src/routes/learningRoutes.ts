import { Router } from 'express';
import { LearningController } from '../controllers/learningController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/profile', requireAuth, LearningController.getProfile);
router.put('/profile', requireAuth, LearningController.updateProfile);
router.get('/scenarios', requireAuth, LearningController.getScenarios);
router.post('/session', requireAuth, LearningController.createSession);
router.post('/session/:id/message', requireAuth, LearningController.sendSessionMessage);
router.post('/session/:id/complete', requireAuth, LearningController.completeSession);
router.get('/progress', requireAuth, LearningController.getProgress);

export default router;

