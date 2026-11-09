import { MultilingualProcessor, SupportedLanguage } from '../language/multilingualProcessor';
import { ExtractedEntities } from '../entities/entityExtractor';

export type IntentType =
  | 'greeting'
  | 'farewell'
  | 'introduction'
  | 'name_recall'
  | 'calculation'
  | 'unit_conversion'
  | 'note_creation'
  | 'note_retrieval'
  | 'note_summary'
  | 'task_creation'
  | 'task_listing'
  | 'task_completion'
  | 'learning_request'
  | 'vocabulary_request'
  | 'grammar_request'
  | 'translation'
  | 'explanation'
  | 'general_question'
  | 'conversation_continuation'
  | 'clarification'
  | 'unknown_intent';

export interface IntentResult {
  intent: IntentType;
  confidence: number;
  secondaryIntents?: { intent: IntentType; confidence: number }[];
  matchedPattern?: string;
}

interface IntentPattern {
  intent: IntentType;
  patterns: RegExp[];
  keywords: string[];
  baseWeight: number;
}

export class IntentClassifier {
  private static intentDefinitions: IntentPattern[] = [
    // 1. GREETING
    {
      intent: 'greeting',
      patterns: [
        /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|day))\b/i,
        /(^|\s)(नमस्ते|नमस्कार|प्रणाम|जय\s+श्री\s+कृष्णा?)(\s|$|[.,!?])/i,
        /(^|\s)(નમસ્તે|નમસ્કાર|કેમ\s+છો|જય\s+શ્રી\s+કૃષ્ણ)(\s|$|[.,!?])/i,
        /(^|\s)(namaste|namaskar|kem\s+cho|pranam|kya\s+haal\s+hai)(\s|$|[.,!?])/i,
      ],
      keywords: ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'kemcho', 'pranam', 'नमस्ते', 'नमस्कार', 'નમસ્તે', 'કેમ'],
      baseWeight: 0.95,
    },

    // 2. FAREWELL
    {
      intent: 'farewell',
      patterns: [
        /\b(bye|goodbye|see\s+you|talk\s+to\s+you\s+later|have\s+a\s+nice\s+day)\b/i,
        /(अलविदा|फिर\s+मिलेंगे|शुभ\s+रात्रि|बाय)/i,
        /(આવજો|ફરી\s+મળીશું|શુભ\s+રાત્રિ|બાય)/i,
        /(alvida|phir\s+milenge|aavjo|bye)/i,
      ],
      keywords: ['bye', 'goodbye', 'alvida', 'aavjo', 'night', 'अलविदा', 'આવજો'],
      baseWeight: 0.95,
    },

    // 3. INTRODUCTION (Who are you? / My name is...)
    {
      intent: 'introduction',
      patterns: [
        /\b(who\s+are\s+you|what\s+is\s+your\s+name|tell\s+me\s+about\s+yourself|introduce\s+yourself)\b/i,
        /(tum\s+kaun\s+ho|aap\s+kaun\s+hain|aapka\s+naam\s+kya\s+hai)/i,
        /(तुम\s+कौन\s+हो|आपका\s+नाम\s+क्या\s+है|अपना\s+परिचय\s+दो)/i,
        /(તમે\s+કોણ\s+છો|તમારું\s+નામ\s+શું\s+છે|તમારો\s+પરિચય\s+આપો)/i,
        /\b(my\s+name\s+is|mera\s+naam|maru\s+naam|i\s+am)\s+[A-Za-z\u0900-\u097F\u0A80-\u0AFF]+/i,
      ],
      keywords: ['who', 'yourself', 'kaun', 'kon', 'parichay', 'naam', 'identity', 'परिचय', 'પરિચય'],
      baseWeight: 0.92,
    },

    // 4. NAME RECALL ("What is my name?")
    {
      intent: 'name_recall',
      patterns: [
        /\b(what\s+is\s+my\s+name|do\s+you\s+know\s+my\s+name|who\s+am\s+i)\b/i,
        /(mera\s+naam\s+kya\s+hai|kya\s+tum\s+mera\s+naam\s+jaante\s+ho)/i,
        /(मेरा\s+नाम\s+क्या\s+है|क्या\s+तुम\s+मेरा\s+नाम\s+जानते\s+हो)/i,
        /(મારું\s+નામ\s+શું\s+છે|તમને\s+મારું\s+નામ\s+ખબર\s+છે)/i,
      ],
      keywords: ['my name', 'mera naam kya', 'maru naam shu', 'who am i', 'मेरा नाम', 'મારું નામ'],
      baseWeight: 0.98,
    },

    // 5. CALCULATION
    {
      intent: 'calculation',
      patterns: [
        /\b(calculate|what\s+is|\bhow\s+much\s+is)\s+\d+(\.\d+)?\s*([+\-*/%^]|plus|minus|times|divided|guna|bhaag)/i,
        /\b\d+(\.\d+)?\s*([+\-*/^]|plus|minus|times|divided\s+by|jod|ghata|guna|vatta)\s*\d+/i,
        /\b(\d+(\.\d+)?)\s*(%|percent|pratishat|taka)\s*(of|ka|ki|ke|na|nu)\s*(\d+(\.\d+)?)/i,
        /\b(math|hisab|ganit|ગણિત|हिसाब)\b/i,
      ],
      keywords: ['calculate', 'compute', 'plus', 'minus', 'multiply', 'divide', 'percent', 'hisab', 'jod', 'guna'],
      baseWeight: 0.95,
    },

    // 6. UNIT CONVERSION
    {
      intent: 'unit_conversion',
      patterns: [
        /\b(convert|change|badlo|બદલો)\s+\d+(\.\d+)?\s*(km|miles|celsius|fahrenheit|kg|pounds|lbs|meters|feet)/i,
        /\b\d+(\.\d+)?\s*(km|miles|celsius|fahrenheit|kg|pounds|lbs)\s*(to|in|mein|ma)\s*(km|miles|celsius|fahrenheit|kg|pounds|lbs)/i,
      ],
      keywords: ['convert', 'conversion', 'badlo', 'rupantar'],
      baseWeight: 0.96,
    },

    // 7. NOTE CREATION
    {
      intent: 'note_creation',
      patterns: [
        /\b(take\s+a\s+note|create\s+a?\s*note|save\s+note|add\s+note|write\s+down)\b/i,
        /\b(note\s+banao|note\s+likho|ek\s+note\s+rakho)\b/i,
        /\b(नोट\s+बनाओ|नोट\s+लिखो|नोट\s+सेव\s+करो)\b/i,
        /\b(નોંધ\s+બનાવો|નોટ\s+લખો|નોટ\s+સેવ\s+કરો)\b/i,
      ],
      keywords: ['note', 'notedown', 'likho', 'lakho', 'nondh'],
      baseWeight: 0.94,
    },

    // 8. NOTE RETRIEVAL
    {
      intent: 'note_retrieval',
      patterns: [
        /\b(show\s+my\s+notes|list\s+notes|read\s+notes|get\s+notes|what\s+are\s+my\s+notes)\b/i,
        /\b(mere\s+notes\s+dikhao|notes\s+batao|notes\s+padho)\b/i,
        /\b(मेरे\s+नोट्स\s+दिखाओ|नोट्स\s+बताओ|नोट्स\s+पढ़ो)\b/i,
        /\b(મારા\s+નોટ્સ\s+બતાવો|નોંધ\s+જોવો)\b/i,
      ],
      keywords: ['show notes', 'list notes', 'read notes', 'mere notes', 'mara notes'],
      baseWeight: 0.95,
    },

    // 9. NOTE SUMMARY
    {
      intent: 'note_summary',
      patterns: [
        /\b(summarize\s+notes|summary\s+of\s+notes|brief\s+my\s+notes)\b/i,
        /\b(notes\s+ka\s+summary|notes\s+ka\s+nichod)\b/i,
        /\b(नोट्स\s+का\s+सारांश|सारांश\s+बताओ)\b/i,
        /\b(નોટ્સનો\s+સારાંશ|સારાંશ\s+આપો)\b/i,
      ],
      keywords: ['summarize', 'summary', 'saransh', 'nichod'],
      baseWeight: 0.96,
    },

    // 10. TASK CREATION
    {
      intent: 'task_creation',
      patterns: [
        /\b(add\s+task|create\s+task|new\s+task|remind\s+me\s+to|add\s+todo|add\s+to-do)\b/i,
        /\b(task\s+banao|kam\s+jodo|remind\s+karo)\b/i,
        /\b(टास्क\s+बनाओ|काम\s+जोड़ो|याद\s+दिलाना)\b/i,
        /\b(કામ\s+ઉમેરો|ટાસ્ક\s+બનાવો|યાદ\s+કરાવજો)\b/i,
      ],
      keywords: ['task', 'todo', 'remind', 'kam', 'kaam'],
      baseWeight: 0.93,
    },

    // 11. TASK LISTING
    {
      intent: 'task_listing',
      patterns: [
        /\b(show\s+tasks|list\s+tasks|what\s+are\s+my\s+tasks|pending\s+tasks|to-do\s+list)\b/i,
        /\b(mere\s+tasks\s+dikhao|kam\s+dikhao|kya\s+kam\s+hai)\b/i,
        /\b(मेरे\s+टास्क\s+दिखाओ|काम\s+की\s+सूची)\b/i,
        /\b(મારા\s+કામ\s+બતાવો|ટાસ્ક\s+લિસ્ટ)\b/i,
      ],
      keywords: ['list tasks', 'show tasks', 'pending tasks', 'mere kaam', 'mara kam'],
      baseWeight: 0.95,
    },

    // 12. TASK COMPLETION
    {
      intent: 'task_completion',
      patterns: [
        /\b(complete\s+task|mark\s+task\s+done|finish\s+task|done\s+task)\b/i,
        /\b(task\s+khatam|kam\s+ho\s+gaya|task\s+pura)\b/i,
        /\b(टास्क\s+पूरा|काम\s+हो\s+गया|डन)\b/i,
        /\b(કામ\s+પૂરું|ટાસ્ક\s+પૂર્ણ)\b/i,
      ],
      keywords: ['complete task', 'mark done', 'ho gaya', 'puru thayu'],
      baseWeight: 0.95,
    },

    // 13. LEARNING REQUEST
    {
      intent: 'learning_request',
      patterns: [
        /\b(i\s+want\s+to\s+learn|teach\s+me|practise|practice\s+speaking|start\s+lesson)\b/i,
        /\b(sikhao|shikho|padhna\s+hai|practice\s+karna\s+hai)\b/i,
        /\b(सीखना\s+है|सिखाओ|अभ्यास\s+करना\s+है)\b/i,
        /\b(શીખવું\s+છે|શીખવો|અભ્યાસ\s+કરવો\s+છે)\b/i,
        /\b(make\s+it\s+harder|increase\s+difficulty|make\s+it\s+easier)\b/i,
      ],
      keywords: ['learn', 'practice', 'practise', 'teach', 'lesson', 'sikho', 'sikhao', 'shikhvu'],
      baseWeight: 0.92,
    },

    // 14. VOCABULARY REQUEST
    {
      intent: 'vocabulary_request',
      patterns: [
        /\b(meaning\s+of|word\s+meaning|vocabulary|new\s+words|synonym\s+of|define)\b/i,
        /\b(shabd\s+ka\s+arth|arth\s+kya\s+hai|matlab\s+kya\s+hai)\b/i,
        /\b(शब्द\s+का\s+अर्थ|अर्थ\s+क्या\s+है|मतलब\s+बताओ)\b/i,
        /\b(શબ્દનો\s+અર્થ|અર્થ\s+શું\s+છે|મતલબ\s+કહો)\b/i,
      ],
      keywords: ['meaning', 'vocabulary', 'vocab', 'shabd', 'arth', 'matlab'],
      baseWeight: 0.94,
    },

    // 15. GRAMMAR REQUEST
    {
      intent: 'grammar_request',
      patterns: [
        /\b(grammar|tense|sentence\s+correction|check\s+grammar|correct\s+this\s+sentence)\b/i,
        /\b(vyakaran|grammer|shuddh\s+karo)\b/i,
        /\b(व्याकरण|वाक्य\s+सुधारो|सही\s+है\s+क्या)\b/i,
        /\b(વ્યાકરણ|વાક્ય\s+સુધારો)\b/i,
      ],
      keywords: ['grammar', 'tense', 'vyakaran', 'correction'],
      baseWeight: 0.94,
    },

    // 16. TRANSLATION
    {
      intent: 'translation',
      patterns: [
        /\b(translate|how\s+to\s+say|in\s+hindi|in\s+gujarati|in\s+english)\b/i,
        /\b(anuvad|tarjuma|ko\s+hindi\s+mein|ko\s+gujarati\s+ma)\b/i,
        /\b(अनुवाद\s+करो|हिन्दी\s+में\s+क्या\s+कहते\s+हैं)\b/i,
        /\b(અનુવાદ\s+કરો|ગુજરાતીમાં\s+શું\s+કહેવાય)\b/i,
      ],
      keywords: ['translate', 'translation', 'anuvad', 'trans'],
      baseWeight: 0.93,
    },

    // 17. EXPLANATION / GENERAL QUESTION
    {
      intent: 'explanation',
      patterns: [
        /\b(explain|how\s+does|why\s+is|what\s+is|tell\s+me\s+about|describe)\b/i,
        /\b(samjhao|batao|kya\s+hai|kaise\s+hota\s+hai)\b/i,
        /\b(समझाओ|बताओ|क्या\s+है|कैसे\s+होता\s+है)\b/i,
        /\b(સમજાવો|કહો|શું\s+છે|કેવી\s+રીતે)\b/i,
      ],
      keywords: ['explain', 'why', 'how', 'kya', 'kaise', 'shu', 'kem'],
      baseWeight: 0.85,
    },
  ];

  /**
   * Classify intent with confidence scoring (0.0 to 1.0)
   */
  public static classify(
    text: string,
    entities: ExtractedEntities,
    preferredLang: SupportedLanguage = 'en-IN'
  ): IntentResult {
    const cleanText = MultilingualProcessor.normalize(text);
    const keywords = MultilingualProcessor.extractKeywords(cleanText);

    // Context / Entity overrides
    if (entities.mathExpression || entities.unitConversion) {
      if (entities.unitConversion) {
        return { intent: 'unit_conversion', confidence: 0.98, matchedPattern: 'unitConversionEntity' };
      }
      return { intent: 'calculation', confidence: 0.97, matchedPattern: 'mathExpressionEntity' };
    }

    if (entities.personName && /\b(my name is|mera naam|maru naam)\b/i.test(text)) {
      return { intent: 'introduction', confidence: 0.96, matchedPattern: 'personNameDeclaration' };
    }

    if (entities.noteTitle || entities.noteContent) {
      return { intent: 'note_creation', confidence: 0.95, matchedPattern: 'noteEntity' };
    }

    if (entities.taskTitle) {
      return { intent: 'task_creation', confidence: 0.95, matchedPattern: 'taskEntity' };
    }

    let highestConfidence = 0.0;
    let bestIntent: IntentType = 'unknown_intent';
    let matchedPattern = '';
    const scoredIntents: { intent: IntentType; confidence: number }[] = [];

    for (const def of this.intentDefinitions) {
      let score = 0;

      // Check regex patterns
      for (const pattern of def.patterns) {
        if (pattern.test(cleanText)) {
          score = Math.max(score, def.baseWeight);
          matchedPattern = pattern.source;
          break;
        }
      }

      // Check keyword density
      let keywordHits = 0;
      for (const kw of def.keywords) {
        if (cleanText.includes(kw) || keywords.includes(kw)) {
          keywordHits++;
        }
      }

      if (keywordHits > 0) {
        const keywordScore = Math.min(0.85, 0.4 + keywordHits * 0.2);
        score = Math.max(score, keywordScore);
      }

      if (score > 0.4) {
        scoredIntents.push({ intent: def.intent, confidence: Math.round(score * 100) / 100 });
      }

      if (score > highestConfidence) {
        highestConfidence = score;
        bestIntent = def.intent;
      }
    }

    // Fallback logic
    if (highestConfidence < 0.5) {
      // Check if it's a general question
      if (text.includes('?') || /^(what|why|how|when|where|which|who|kya|kaun|kaha|kem|shu)\b/i.test(cleanText)) {
        return {
          intent: 'general_question',
          confidence: 0.65,
          secondaryIntents: scoredIntents,
          matchedPattern: 'questionMarkOrQuestionWord'
        };
      }

      return {
        intent: 'unknown_intent',
        confidence: Math.max(0.1, highestConfidence),
        secondaryIntents: scoredIntents,
        matchedPattern: 'none'
      };
    }

    return {
      intent: bestIntent,
      confidence: Math.round(highestConfidence * 100) / 100,
      secondaryIntents: scoredIntents.sort((a, b) => b.confidence - a.confidence).slice(1, 4),
      matchedPattern
    };
  }
}
