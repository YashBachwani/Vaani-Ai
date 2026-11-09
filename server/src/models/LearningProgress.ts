import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILearningProgress extends Document {
  userId: Types.ObjectId;
  completedSessions: number;
  vocabularyLearned: string[];
  exercisesCompleted: number;
  levelCounts: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  categoryCounts: Record<string, number>;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LearningProgressSchema = new Schema<ILearningProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  completedSessions: { type: Number, default: 0 },
  vocabularyLearned: [{ type: String }],
  exercisesCompleted: { type: Number, default: 0 },
  levelCounts: {
    beginner: { type: Number, default: 0 },
    intermediate: { type: Number, default: 0 },
    advanced: { type: Number, default: 0 }
  },
  categoryCounts: { type: Schema.Types.Mixed, default: {} },
  lastActiveAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const LearningProgress = mongoose.model<ILearningProgress>('LearningProgress', LearningProgressSchema);

