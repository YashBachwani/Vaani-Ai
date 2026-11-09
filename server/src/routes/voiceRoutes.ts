import { Router } from 'express';
import multer from 'multer';
import { VoiceController } from '../controllers/voiceController';
import { requireAuth, optionalAuth } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

router.post('/stt', optionalAuth, upload.single('audio'), VoiceController.stt);
router.post('/tts', optionalAuth, VoiceController.tts);
router.get('/config', VoiceController.getConfig);

export default router;

