import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeEntry extends Document {
  title: string;
  content: string;
  language: 'en' | 'hi' | 'gu' | 'all';
  category: 'general' | 'science' | 'technology' | 'language' | 'travel' | 'calculations' | 'india' | 'education' | 'grammar';
  keywords: string[];
  synonyms: string[];
  source: string;
  summary?: string;
  updatedAt: Date;
}

const KnowledgeEntrySchema = new Schema<IKnowledgeEntry>({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  language: { 
    type: String, 
    enum: ['en', 'hi', 'gu', 'all'], 
    default: 'all' 
  },
  category: { 
    type: String, 
    enum: ['general', 'science', 'technology', 'language', 'travel', 'calculations', 'india', 'education', 'grammar'],
    default: 'general' 
  },
  keywords: [{ type: String, lowercase: true, trim: true }],
  synonyms: [{ type: String, lowercase: true, trim: true }],
  source: { type: String, default: 'VAANI Curated Knowledge' },
  summary: { type: String }
}, {
  timestamps: true
});

KnowledgeEntrySchema.index({ category: 1, language: 1 });
KnowledgeEntrySchema.index({ keywords: 1 });
KnowledgeEntrySchema.index(
  { title: 'text', content: 'text', keywords: 'text' },
  { default_language: 'none', language_override: 'none' }
);

export const KnowledgeEntry = mongoose.model<IKnowledgeEntry>('KnowledgeEntry', KnowledgeEntrySchema);
