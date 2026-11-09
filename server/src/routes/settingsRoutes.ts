import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, SettingsController.getSettings);
router.put('/', requireAuth, SettingsController.updateSettings);
router.post('/clear-memory', requireAuth, SettingsController.clearMemory);

export default router;

