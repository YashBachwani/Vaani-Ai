import { Router } from 'express';
import { KnowledgeController } from '../controllers/knowledgeController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, KnowledgeController.listEntries);
router.post('/', requireAuth, KnowledgeController.createEntry);
router.put('/:id', requireAuth, KnowledgeController.updateEntry);
router.delete('/:id', requireAuth, KnowledgeController.deleteEntry);

export default router;

