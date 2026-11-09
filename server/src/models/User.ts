import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  preferredLanguage: 'en-IN' | 'hi-IN' | 'gu-IN';
  preferredVoice: 'Nalini' | 'Kaveri' | 'Deepak';
  responseStyle: 'friendly' | 'professional' | 'concise' | 'detailed';
  learningLanguage?: 'en-IN' | 'hi-IN' | 'gu-IN';
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  preferredLanguage: { 
    type: String, 
    enum: ['en-IN', 'hi-IN', 'gu-IN'], 
    default: 'en-IN' 
  },
  preferredVoice: { 
    type: String, 
    enum: ['Nalini', 'Kaveri', 'Deepak'], 
    default: 'Nalini' 
  },
  responseStyle: { 
    type: String, 
    enum: ['friendly', 'professional', 'concise', 'detailed'], 
    default: 'friendly' 
  },
  learningLanguage: {
    type: String,
    enum: ['en-IN', 'hi-IN', 'gu-IN', null],
    default: 'hi-IN'
  },
  onboardingCompleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);

