import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Conversation } from '../models/Conversation';
import { Note } from '../models/Note';
import { Task } from '../models/Task';
import { UsageLog } from '../models/UsageLog';
import { LearningProgress } from '../models/LearningProgress';
import { ContextManager } from '../core/vaani/context/contextManager';

export class SettingsController {
  public static async getSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const userId = user._id;

      const [conversationsCount, notesCount, tasksCount, progress, voiceUsageCount] = await Promise.all([
        Conversation.countDocuments({ userId }),
        Note.countDocuments({ userId }),
        Task.countDocuments({ userId }),
        LearningProgress.findOne({ userId }),
        UsageLog.countDocuments({ userId })
      ]);

      res.status(200).json({
        profile: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          preferredVoice: user.preferredVoice,
          responseStyle: user.responseStyle,
          learningLanguage: user.learningLanguage,
          createdAt: user.createdAt
        },
        stats: {
          conversationsCount,
          notesCount,
          tasksCount,
          completedSessions: progress?.completedSessions || 0,
          vocabularyCount: progress?.vocabularyLearned?.length || 0,
          voiceUsageCount
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load settings.' });
    }
  }

  public static async updateSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { name, preferredLanguage, preferredVoice, responseStyle, learningLanguage } = req.body;

      if (name) user.name = name.trim();
      if (preferredLanguage) user.preferredLanguage = preferredLanguage;
      if (preferredVoice) user.preferredVoice = preferredVoice;
      if (responseStyle) user.responseStyle = responseStyle;
      if (learningLanguage) user.learningLanguage = learningLanguage;

      await user.save();

      res.status(200).json({
        message: 'Settings updated successfully',
        profile: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          preferredVoice: user.preferredVoice,
          responseStyle: user.responseStyle,
          learningLanguage: user.learningLanguage
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update settings.' });
    }
  }

  public static async clearMemory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      ContextManager.clearContext(userId);
      res.status(200).json({ message: 'Conversation memory and working context cleared successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to clear memory.' });
    }
  }
}

