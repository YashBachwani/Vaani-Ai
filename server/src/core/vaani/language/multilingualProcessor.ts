export type SupportedLanguage = 'en-IN' | 'hi-IN' | 'gu-IN';

export interface LanguageAnalysis {
  detectedLanguage: SupportedLanguage;
  script: 'latin' | 'devanagari' | 'gujarati' | 'mixed';
  tokens: string[];
  cleanText: string;
  isTransliterated: boolean;
}

export class MultilingualProcessor {
  // Common stopwords across English, Hindi (Devanagari + Roman), Gujarati (Gujarati + Roman)
  private static stopWords = new Set([
    // English
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'of', 'for', 'to', 'with', 'and', 'or', 'please',
    // Hindi (Devanagari)
    'का', 'के', 'की', 'को', 'में', 'पर', 'से', 'है', 'हैं', 'था', 'थी', 'थे', 'और', 'या', 'कृपया',
    // Hindi (Roman transliteration)
    'ka', 'ke', 'ki', 'ko', 'mein', 'par', 'se', 'hai', 'hain', 'tha', 'thi', 'the', 'aur', 'ya',
    // Gujarati (Gujarati script)
    'નો', 'ની', 'નું', 'ના', 'માં', 'પર', 'થી', 'છે', 'હતો', 'હતી', 'અને', 'અથવા', 'કૃપા',
    // Gujarati (Roman transliteration)
    'no', 'ni', 'nu', 'na', 'ma', 'chhe', 'hato', 'hati', 'ane', 'athva'
  ]);

  /**
   * Detects script type based on Unicode block ranges
   */
  public static detectScript(text: string): 'latin' | 'devanagari' | 'gujarati' | 'mixed' {
    let devanagariCount = 0;
    let gujaratiCount = 0;
    let latinCount = 0;

    for (const char of text) {
      const code = char.charCodeAt(0);
      if (code >= 0x0900 && code <= 0x097f) {
        devanagariCount++;
      } else if (code >= 0x0a80 && code <= 0x0aff) {
        gujaratiCount++;
      } else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        latinCount++;
      }
    }

    if (devanagariCount > gujaratiCount && devanagariCount > latinCount) return 'devanagari';
    if (gujaratiCount > devanagariCount && gujaratiCount > latinCount) return 'gujarati';
    if (latinCount > 0 && devanagariCount === 0 && gujaratiCount === 0) return 'latin';
    if (devanagariCount > 0 || gujaratiCount > 0 || latinCount > 0) return 'mixed';
    return 'latin';
  }

  /**
   * Normalizes text by removing non-alphanumeric noise (preserving Indian scripts)
   */
  public static normalize(text: string): string {
    return text
      .trim()
      .toLowerCase()
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      // Remove trailing common punctuation but preserve math symbols (+, -, *, /, =)
      .replace(/[?!,;:]+$/g, '')
      .trim();
  }

  /**
   * Tokenizes text preserving Devanagari, Gujarati, Latin, and numeric sequences
   */
  public static tokenize(text: string): string[] {
    const normalized = this.normalize(text);
    // Split by non-word characters except Devanagari (0900-097F) and Gujarati (0A80-0AFF) and math symbols
    const tokens = normalized.match(/[\u0900-\u097F]+|[\u0A80-\u0AFF]+|[a-zA-Z0-9_+\-*/%^.]+/g) || [];
    return tokens.map((t) => t.trim()).filter(Boolean);
  }

  /**
   * Identifies likely language of input, recognizing Romanized Hindi/Gujarati as well
   */
  public static analyze(text: string, preferredLanguage: SupportedLanguage = 'en-IN'): LanguageAnalysis {
    const cleanText = this.normalize(text);
    const tokens = this.tokenize(cleanText);
    const script = this.detectScript(text);

    if (script === 'devanagari') {
      return { detectedLanguage: 'hi-IN', script, tokens, cleanText, isTransliterated: false };
    }
    if (script === 'gujarati') {
      return { detectedLanguage: 'gu-IN', script, tokens, cleanText, isTransliterated: false };
    }

    // If written in Latin script, detect if it's Romanized Hindi or Gujarati
    const lower = cleanText.toLowerCase();

    const hindiRomanKeywords = [
      'namaste', 'kya', 'kaise', 'kaun', 'kaha', 'kahan', 'batao', 'karo', 'mujhe', 'mera', 'meri',
      'mere', 'karna', 'sikhao', 'madad', 'dhanyawad', 'shukriya', 'kripya', 'alvida', 'samjhao'
    ];
    const gujaratiRomanKeywords = [
      'kem', 'cho', 'tame', 'mane', 'maru', 'mari', 'maro', 'shu', 'su', 'aabhar', 'sikho',
      'madad', 'samjav', 'aavjo', 'kaho', 'kare', 'chhe'
    ];

    let hiMatches = 0;
    for (const kw of hindiRomanKeywords) {
      if (tokens.includes(kw) || lower.includes(` ${kw} `) || lower.startsWith(`${kw} `) || lower.endsWith(` ${kw}`)) {
        hiMatches++;
      }
    }

    let guMatches = 0;
    for (const kw of gujaratiRomanKeywords) {
      if (tokens.includes(kw) || lower.includes(` ${kw} `) || lower.startsWith(`${kw} `) || lower.endsWith(` ${kw}`)) {
        guMatches++;
      }
    }

    if (guMatches > 0 && guMatches >= hiMatches) {
      return { detectedLanguage: 'gu-IN', script: 'latin', tokens, cleanText, isTransliterated: true };
    }
    if (hiMatches > 0) {
      return { detectedLanguage: 'hi-IN', script: 'latin', tokens, cleanText, isTransliterated: true };
    }

    // Default to preferred language if ambiguous or standard English
    return { detectedLanguage: preferredLanguage, script: 'latin', tokens, cleanText, isTransliterated: false };
  }

  /**
   * Filters out stopwords for indexing and keyword matching
   */
  public static extractKeywords(text: string): string[] {
    const tokens = this.tokenize(text);
    return tokens.filter((t) => t.length > 1 && !this.stopWords.has(t));
  }
}

