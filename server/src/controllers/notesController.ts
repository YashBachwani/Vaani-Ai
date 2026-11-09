import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Note } from '../models/Note';

export class NotesController {
  public static async getNotes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const notes = await Note.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ notes });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch notes.' });
    }
  }

  public static async createNote(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { title, content, tags } = req.body;

      if (!title || !title.trim()) {
        res.status(400).json({ error: 'Title is required for notes.' });
        return;
      }

      const note = await Note.create({
        userId,
        title: title.trim(),
        content: content || title.trim(),
        tags: tags || ['general']
      });

      res.status(201).json({ note });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create note.' });
    }
  }

  public static async deleteNote(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const result = await Note.findOneAndDelete({ _id: id, userId });
      if (!result) {
        res.status(404).json({ error: 'Note not found.' });
        return;
      }

      res.status(200).json({ message: 'Note deleted successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete note.' });
    }
  }
}

