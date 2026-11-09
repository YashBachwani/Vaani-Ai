import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDialogueMessage {
  speaker: 'tutor' | 'user';
  text: string;
  expectedKeywords?: string[];
  feedback?: string;
  timestamp: Date;
}

export interface ILearningCorrection {
  original: string;
  corrected: string;
  explanation: string;
  category: 'grammar' | 'vocabulary' | 'pronunciation' | 'politeness';
}

export interface ILearningSession extends Document {
  userId: Types.ObjectId;
  language: string;
  scenarioId: string;
  scenarioTitle: string;
  category: string;
  level: string;
  status: 'active' | 'completed' | 'abandoned';
  currentStepIndex: number;
  totalSteps: number;
  messages: IDialogueMessage[];
  corrections: ILearningCorrection[];
  vocabularyLearned: string[];
  results?: {
    score?: number;
    completedAt?: Date;
    totalAttempts?: number;
    grammarAccuracy?: number;
    feedbackSummary?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LearningSessionSchema = new Schema<ILearningSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  language: { type: String, required: true },
  scenarioId: { type: String, required: true },
  scenarioTitle: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  currentStepIndex: { type: Number, default: 0 },
  totalSteps: { type: Number, default: 5 },
  messages: [{
    speaker: { type: String, enum: ['tutor', 'user'], required: true },
    text: { type: String, required: true },
    expectedKeywords: [{ type: String }],
    feedback: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  corrections: [{
    original: { type: String },
    corrected: { type: String },
    explanation: { type: String },
    category: { type: String }
  }],
  vocabularyLearned: [{ type: String }],
  results: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

LearningSessionSchema.index({ userId: 1, createdAt: -1 });

export const LearningSession = mongoose.model<ILearningSession>('LearningSession', LearningSessionSchema);

