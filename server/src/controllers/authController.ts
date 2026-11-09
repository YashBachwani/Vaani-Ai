import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { LearningProfile } from '../models/LearningProfile';
import { LearningProgress } from '../models/LearningProgress';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/auth';

function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
}

export class AuthController {
  public static async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, email, password, confirmPassword } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email, and password are required.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long.' });
        return;
      }

      if (confirmPassword && password !== confirmPassword) {
        res.status(400).json({ error: 'Passwords do not match.' });
        return;
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({ error: 'An account with this email already exists.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        preferredLanguage: 'en-IN',
        preferredVoice: 'Nalini',
        responseStyle: 'friendly',
        learningLanguage: 'hi-IN',
        onboardingCompleted: false
      });

      // Initialize Learning Profile & Progress
      await LearningProfile.create({
        userId: user._id,
        targetLanguage: 'hi-IN',
        proficiencyLevel: 'beginner',
        learningGoals: ['Everyday conversation'],
        currentStreak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0]
      });

      await LearningProgress.create({
        userId: user._id,
        completedSessions: 0,
        vocabularyLearned: [],
        exercisesCompleted: 0,
        levelCounts: { beginner: 0, intermediate: 0, advanced: 0 },
        categoryCounts: {}
      });

      const token = generateToken(user._id.toString());

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          preferredVoice: user.preferredVoice,
          responseStyle: user.responseStyle,
          learningLanguage: user.learningLanguage,
          onboardingCompleted: user.onboardingCompleted
        }
      });
    } catch (err: any) {
      console.error('[Auth Register Error]', err);
      res.status(500).json({ error: 'Failed to complete registration.' });
    }
  }

  public static async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const token = generateToken(user._id.toString());

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          preferredVoice: user.preferredVoice,
          responseStyle: user.responseStyle,
          learningLanguage: user.learningLanguage,
          onboardingCompleted: user.onboardingCompleted
        }
      });
    } catch (err: any) {
      console.error('[Auth Login Error]', err);
      res.status(500).json({ error: 'Failed to process login.' });
    }
  }

  public static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        preferredVoice: user.preferredVoice,
        responseStyle: user.responseStyle,
        learningLanguage: user.learningLanguage,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Could not fetch user profile.' });
    }
  }

  public static async updateOnboarding(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const { preferredLanguage, preferredVoice, learningLanguage, responseStyle } = req.body;

      if (preferredLanguage) user.preferredLanguage = preferredLanguage;
      if (preferredVoice) user.preferredVoice = preferredVoice;
      if (learningLanguage) user.learningLanguage = learningLanguage;
      if (responseStyle) user.responseStyle = responseStyle;
      user.onboardingCompleted = true;

      await user.save();

      // Also update targetLanguage in LearningProfile if provided
      if (learningLanguage) {
        await LearningProfile.findOneAndUpdate(
          { userId: user._id },
          { targetLanguage: learningLanguage },
          { upsert: true }
        );
      }

      res.status(200).json({
        message: 'Preferences updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          preferredVoice: user.preferredVoice,
          responseStyle: user.responseStyle,
          learningLanguage: user.learningLanguage,
          onboardingCompleted: user.onboardingCompleted
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save onboarding preferences.' });
    }
  }

  public static async logout(_req: AuthenticatedRequest, res: Response): Promise<void> {
    res.status(200).json({ message: 'Logged out successfully.' });
  }
}

