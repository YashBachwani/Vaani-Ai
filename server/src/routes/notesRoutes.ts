import { Router } from 'express';
import { NotesController } from '../controllers/notesController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, NotesController.getNotes);
router.post('/', requireAuth, NotesController.createNote);
router.delete('/:id', requireAuth, NotesController.deleteNote);

export default router;

