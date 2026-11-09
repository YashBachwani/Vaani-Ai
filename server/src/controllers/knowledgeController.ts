import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { KnowledgeEntry } from '../models/KnowledgeEntry';

export class KnowledgeController {
  public static async listEntries(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { category, language, search } = req.query;
      const filter: any = {};

      if (category) filter.category = category;
      if (language) filter.language = language;
      if (search) {
        filter.$or = [
          { title: new RegExp(search as string, 'i') },
          { content: new RegExp(search as string, 'i') },
          { keywords: new RegExp(search as string, 'i') }
        ];
      }

      const entries = await KnowledgeEntry.find(filter).sort({ updatedAt: -1 }).limit(50);
      res.status(200).json({ entries });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch knowledge entries.' });
    }
  }

  public static async createEntry(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { title, content, language, category, keywords, synonyms, source } = req.body;

      if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required.' });
        return;
      }

      const entry = await KnowledgeEntry.create({
        title: title.trim(),
        content: content.trim(),
        language: language || 'all',
        category: category || 'general',
        keywords: Array.isArray(keywords) ? keywords : (keywords || '').split(',').map((k: string) => k.trim()),
        synonyms: Array.isArray(synonyms) ? synonyms : (synonyms || '').split(',').map((s: string) => s.trim()),
        source: source || 'Curated Knowledge Base'
      });

      res.status(201).json({ entry });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create knowledge entry.' });
    }
  }

  public static async updateEntry(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const entry = await KnowledgeEntry.findByIdAndUpdate(id, updateData, { new: true });
      if (!entry) {
        res.status(404).json({ error: 'Entry not found.' });
        return;
      }

      res.status(200).json({ entry });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update entry.' });
    }
  }

  public static async deleteEntry(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await KnowledgeEntry.findByIdAndDelete(id);
      if (!result) {
        res.status(404).json({ error: 'Entry not found.' });
        return;
      }
      res.status(200).json({ message: 'Knowledge entry deleted successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete entry.' });
    }
  }
}

