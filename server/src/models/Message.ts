import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  userId: Types.ObjectId;
  role: 'user' | 'assistant' | 'system';
  content: string;
  language: string;
  timestamp: Date;
  intent?: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

const MessageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  language: { type: String, default: 'en-IN' },
  timestamp: { type: Date, default: Date.now },
  intent: { type: String },
  confidence: { type: Number },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

MessageSchema.index({ conversationId: 1, timestamp: 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);

