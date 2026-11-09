import { Router } from 'express';
import { TasksController } from '../controllers/tasksController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, TasksController.getTasks);
router.post('/', requireAuth, TasksController.createTask);
router.patch('/:id', requireAuth, TasksController.updateTask);
router.delete('/:id', requireAuth, TasksController.deleteTask);

export default router;

