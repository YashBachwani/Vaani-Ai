import { Router } from 'express';
import multer from 'multer';
import { AssistantController } from '../controllers/assistantController';
import { requireAuth } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

router.post('/message', requireAuth, AssistantController.sendMessage);
router.post('/voice', requireAuth, upload.single('audio'), AssistantController.processVoice);
router.get('/conversations', requireAuth, AssistantController.getConversations);
router.get('/conversations/:id', requireAuth, AssistantController.getConversationById);
router.delete('/conversations/:id', requireAuth, AssistantController.deleteConversation);

export default router;

