import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUsageLog extends Document {
  userId?: Types.ObjectId;
  service: 'STT' | 'TTS' | 'ASSISTANT' | 'LEARN';
  operation: string;
  language: string;
  status: 'success' | 'error';
  latencyMs?: number;
  usageMetadata?: Record<string, any>;
  createdAt: Date;
}

const UsageLogSchema = new Schema<IUsageLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  service: { type: String, enum: ['STT', 'TTS', 'ASSISTANT', 'LEARN'], required: true },
  operation: { type: String, required: true },
  language: { type: String, default: 'en-IN' },
  status: { type: String, enum: ['success', 'error'], required: true },
  latencyMs: { type: Number },
  usageMetadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

UsageLogSchema.index({ service: 1, createdAt: -1 });

export const UsageLog = mongoose.model<IUsageLog>('UsageLog', UsageLogSchema);

