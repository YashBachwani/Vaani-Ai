import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILearningProfile extends Document {
  userId: Types.ObjectId;
  targetLanguage: 'en-IN' | 'hi-IN' | 'gu-IN';
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
  learningGoals: string[];
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

const LearningProfileSchema = new Schema<ILearningProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  targetLanguage: { 
    type: String, 
    enum: ['en-IN', 'hi-IN', 'gu-IN'], 
    default: 'hi-IN' 
  },
  proficiencyLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  learningGoals: [{ type: String }],
  currentStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: '' }
}, {
  timestamps: true
});

export const LearningProfile = mongoose.model<ILearningProfile>('LearningProfile', LearningProfileSchema);

