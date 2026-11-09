import { KnowledgeEntry, IKnowledgeEntry } from '../../../models/KnowledgeEntry';
import { MultilingualProcessor } from '../language/multilingualProcessor';

export interface KnowledgeMatch {
  title: string;
  content: string;
  category: string;
  language: string;
  source: string;
  score: number;
}

export class KnowledgeRetriever {
  /**
   * Search knowledge base using weighted keyword, synonym, and title scoring
   */
  public static async search(query: string, language: string = 'en-IN'): Promise<KnowledgeMatch | null> {
    const clean = MultilingualProcessor.normalize(query);
    const keywords = MultilingualProcessor.extractKeywords(clean);

    if (keywords.length === 0) return null;

    // Filter by language: match document language, 'all', or prefix (e.g. 'en', 'hi', 'gu')
    const langPrefix = language.split('-')[0].toLowerCase();

    // Query candidates from MongoDB
    const candidates = await KnowledgeEntry.find({
      $or: [
        { language: 'all' },
        { language: langPrefix },
        { keywords: { $in: keywords } }
      ]
    }).lean();

    if (candidates.length === 0) return null;

    let bestMatch: KnowledgeMatch | null = null;
    let highestScore = 0;

    for (const doc of candidates) {
      let score = 0;
      const docTitle = doc.title.toLowerCase();
      const docContent = doc.content.toLowerCase();
      const docKeywords = doc.keywords.map((k: string) => k.toLowerCase());
      const docSynonyms = (doc.synonyms || []).map((s: string) => s.toLowerCase());

      // 1. Direct title containment
      if (clean.includes(docTitle) || docTitle.includes(clean)) {
        score += 3.0;
      }

      // 2. Keyword hits
      for (const kw of keywords) {
        if (docKeywords.includes(kw)) {
          score += 1.5;
        } else if (docSynonyms.includes(kw)) {
          score += 1.2;
        } else if (docTitle.includes(kw)) {
          score += 1.0;
        } else if (docContent.includes(kw)) {
          score += 0.3;
        }
      }

      // 3. Language alignment bonus
      if (doc.language === langPrefix || doc.language === 'all') {
        score += 0.5;
      }

      if (score > highestScore && score >= 1.5) {
        highestScore = score;
        bestMatch = {
          title: doc.title,
          content: doc.content,
          category: doc.category,
          language: doc.language,
          source: doc.source || 'VAANI Knowledge Base',
          score: Math.min(1.0, Math.round((score / 5) * 100) / 100)
        };
      }
    }

    return bestMatch;
  }
}

