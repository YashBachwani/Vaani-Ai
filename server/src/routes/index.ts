import { Router } from 'express';
import authRoutes from './authRoutes';
import assistantRoutes from './assistantRoutes';
import voiceRoutes from './voiceRoutes';
import learningRoutes from './learningRoutes';
import notesRoutes from './notesRoutes';
import tasksRoutes from './tasksRoutes';
import settingsRoutes from './settingsRoutes';
import knowledgeRoutes from './knowledgeRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/assistant', assistantRoutes);
router.use('/voice', voiceRoutes);
router.use('/learning', learningRoutes);
router.use('/notes', notesRoutes);
router.use('/tasks', tasksRoutes);
router.use('/settings', settingsRoutes);
router.use('/knowledge', knowledgeRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'VAANI AI API',
    version: '1.0.0',
    llmFree: true,
    engine: 'VAANI CORE'
  });
});

export default router;

