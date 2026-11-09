import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { LearningProfile } from '../models/LearningProfile';
import { LearningSession } from '../models/LearningSession';
import { LearningProgress } from '../models/LearningProgress';
import { LearningEngine } from '../core/vaani/learning/learningEngine';
import { GnaniTTSService } from '../services/gnani/ttsService';

export class LearningController {
  /**
   * Get user learning profile
   */
  public static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      let profile = await LearningProfile.findOne({ userId });
      if (!profile) {
        profile = await LearningProfile.create({
          userId,
          targetLanguage: 'hi-IN',
          proficiencyLevel: 'beginner',
          learningGoals: ['Everyday conversation'],
          currentStreak: 1,
          lastActiveDate: new Date().toISOString().split('T')[0]
        });
      }
      res.status(200).json(profile);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch learning profile.' });
    }
  }

  /**
   * Update learning profile
   */
  public static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { targetLanguage, proficiencyLevel, learningGoals } = req.body;

      const profile = await LearningProfile.findOneAndUpdate(
        { userId },
        {
          ...(targetLanguage && { targetLanguage }),
          ...(proficiencyLevel && { proficiencyLevel }),
          ...(learningGoals && { learningGoals })
        },
        { new: true, upsert: true }
      );

      res.status(200).json(profile);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update learning profile.' });
    }
  }

  /**
   * Get available learning scenarios
   */
  public static async getScenarios(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { category, level, language } = req.query;
      let scenarios = LearningEngine.getScenarios();

      if (category) {
        scenarios = scenarios.filter((s) => s.category === category);
      }
      if (level) {
        scenarios = scenarios.filter((s) => s.level === level);
      }
      if (language) {
        scenarios = scenarios.filter((s) => s.language === language);
      }

      res.status(200).json({ scenarios });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch scenarios.' });
    }
  }

  /**
   * Start a new learning session
   */
  public static async createSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const user = req.user!;
      const { scenarioId } = req.body;

      const scenario = LearningEngine.getScenarioById(scenarioId);
      if (!scenario) {
        res.status(404).json({ error: 'Scenario not found.' });
        return;
      }

      const initialStep = scenario.steps[0];

      // Synthesize initial tutor prompt voice
      let audioUrl = null;
      try {
        const ttsRes = await GnaniTTSService.synthesizeSpeech(
          initialStep.tutorPrompt,
          {
            voice: user.preferredVoice || 'Nalini',
            language: scenario.language
          },
          userId
        );
        audioUrl = `data:audio/wav;base64,${ttsRes.audioBuffer.toString('base64')}`;
      } catch (e: any) {
        console.warn('[Learning Tutor TTS Error]', e.message);
      }

      const session = await LearningSession.create({
        userId,
        language: scenario.language,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        category: scenario.category,
        level: scenario.level,
        status: 'active',
        currentStepIndex: 0,
        totalSteps: scenario.steps.length,
        messages: [
          {
            speaker: 'tutor',
            text: initialStep.tutorPrompt,
            expectedKeywords: initialStep.expectedKeywords,
            timestamp: new Date()
          }
        ],
        corrections: [],
        vocabularyLearned: []
      });

      res.status(201).json({
        session,
        scenario,
        currentStep: initialStep,
        tutorAudioUrl: audioUrl
      });
    } catch (err: any) {
      console.error('[Create Session Error]', err);
      res.status(500).json({ error: 'Failed to initiate learning session.' });
    }
  }

  /**
   * Submit an answer to the current step in the learning session
   */
  public static async sendSessionMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const user = req.user!;
      const { id } = req.params;
      const { text } = req.body;

      if (!text || !text.trim()) {
        res.status(400).json({ error: 'Answer cannot be empty.' });
        return;
      }

      const session = await LearningSession.findOne({ _id: id, userId });
      if (!session) {
        res.status(404).json({ error: 'Learning session not found.' });
        return;
      }

      if (session.status !== 'active') {
        res.status(400).json({ error: 'This learning session has already concluded.' });
        return;
      }

      const scenario = LearningEngine.getScenarioById(session.scenarioId);
      if (!scenario) {
        res.status(404).json({ error: 'Underlying scenario not found.' });
        return;
      }

      const currentStep = scenario.steps[session.currentStepIndex];

      // 1. Evaluate user answer
      const evalResult = LearningEngine.evaluateStepResponse(currentStep, text);

      // Record user turn
      session.messages.push({
        speaker: 'user',
        text: text.trim(),
        feedback: evalResult.feedback,
        timestamp: new Date()
      });

      // Record corrections & vocabulary
      if (evalResult.correction) {
        session.corrections.push({
          original: evalResult.correction.original,
          corrected: evalResult.correction.corrected,
          explanation: evalResult.correction.explanation,
          category: 'grammar'
        });
      }

      if (evalResult.matchedKeywords.length > 0) {
        for (const kw of evalResult.matchedKeywords) {
          if (!session.vocabularyLearned.includes(kw)) {
            session.vocabularyLearned.push(kw);
          }
        }
      }

      // Check if advancing to next step or completed
      let nextStep = null;
      let isCompleted = false;
      let nextTutorPrompt = '';

      if (evalResult.isSatisfactory || session.currentStepIndex + 1 >= scenario.steps.length) {
        if (session.currentStepIndex + 1 < scenario.steps.length) {
          session.currentStepIndex += 1;
          nextStep = scenario.steps[session.currentStepIndex];
          nextTutorPrompt = `${evalResult.feedback} ${nextStep.tutorPrompt}`;
        } else {
          isCompleted = true;
          session.status = 'completed';
          nextTutorPrompt = `${evalResult.feedback} Fantastic job! You have successfully completed the entire scenario!`;
        }
      } else {
        // Retry current step with hint
        nextStep = currentStep;
        nextTutorPrompt = `${evalResult.feedback} Try rephrasing your answer!`;
      }

      session.messages.push({
        speaker: 'tutor',
        text: nextTutorPrompt,
        timestamp: new Date()
      });

      await session.save();

      // Synthesize audio for tutor reply
      let audioUrl = null;
      try {
        const ttsRes = await GnaniTTSService.synthesizeSpeech(
          nextTutorPrompt,
          {
            voice: user.preferredVoice || 'Nalini',
            language: session.language
          },
          userId
        );
        audioUrl = `data:audio/wav;base64,${ttsRes.audioBuffer.toString('base64')}`;
      } catch (ttsErr: any) {
        console.warn('[Learning Tutor TTS Error]', ttsErr.message);
      }

      res.status(200).json({
        session,
        evaluation: evalResult,
        nextStep,
        isCompleted,
        tutorMessage: nextTutorPrompt,
        tutorAudioUrl: audioUrl
      });
    } catch (err: any) {
      console.error('[Session Message Error]', err);
      res.status(500).json({ error: 'Failed to process session step.' });
    }
  }

  /**
   * Finalize and mark session completed
   */
  public static async completeSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const session = await LearningSession.findOne({ _id: id, userId });
      if (!session) {
        res.status(404).json({ error: 'Session not found.' });
        return;
      }

      session.status = 'completed';
      session.results = {
        score: Math.max(70, Math.min(100, 100 - session.corrections.length * 10)),
        completedAt: new Date(),
        totalAttempts: session.messages.filter((m) => m.speaker === 'user').length,
        grammarAccuracy: Math.max(60, 100 - session.corrections.length * 10),
        feedbackSummary: `Completed ${session.scenarioTitle} with ${session.vocabularyLearned.length} vocabulary words practiced and ${session.corrections.length} grammar pointers.`
      };
      await session.save();

      // Update User Learning Progress & Streak
      const progress = await LearningProgress.findOneAndUpdate(
        { userId },
        {
          $inc: { completedSessions: 1, exercisesCompleted: 1 },
          $addToSet: { vocabularyLearned: { $each: session.vocabularyLearned } },
          $set: { lastActiveAt: new Date() }
        },
        { new: true, upsert: true }
      );

      // Update Profile Streak
      const today = new Date().toISOString().split('T')[0];
      const profile = await LearningProfile.findOne({ userId });
      if (profile) {
        if (profile.lastActiveDate !== today) {
          profile.currentStreak += 1;
          profile.lastActiveDate = today;
          await profile.save();
        }
      }

      res.status(200).json({
        session,
        progress,
        results: session.results
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to complete session.' });
    }
  }

  /**
   * Get learning progress statistics
   */
  public static async getProgress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const profile = await LearningProfile.findOne({ userId });
      let progress = await LearningProgress.findOne({ userId });

      if (!progress) {
        progress = await LearningProgress.create({
          userId,
          completedSessions: 0,
          vocabularyLearned: [],
          exercisesCompleted: 0
        });
      }

      const recentSessions = await LearningSession.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5);

      res.status(200).json({
        profile,
        progress,
        recentSessions
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch learning progress.' });
    }
  }
}

