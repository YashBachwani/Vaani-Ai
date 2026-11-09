import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  userId: Types.ObjectId;
  title: string;
  language: string;
  lastMessageAt: Date;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, default: 'New Conversation' },
  language: { type: String, default: 'en-IN' },
  lastMessageAt: { type: Date, default: Date.now },
  messageCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

ConversationSchema.index({ userId: 1, updatedAt: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);

