export interface ExtractedEntities {
  mathExpression?: string;
  numbers?: number[];
  personName?: string;
  noteTitle?: string;
  noteContent?: string;
  taskTitle?: string;
  taskIdOrNumber?: string;
  targetLanguage?: 'en-IN' | 'hi-IN' | 'gu-IN';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  unitConversion?: {
    value: number;
    fromUnit: string;
    toUnit: string;
  };
  searchTerm?: string;
}

export class EntityExtractor {
  /**
   * Extracts recognized entities from normalized input across English, Hindi, and Gujarati
   */
  public static extract(text: string, context?: Record<string, any>): ExtractedEntities {
    const entities: ExtractedEntities = {};
    const lower = text.trim();

    // 1. Math Expression Extraction
    // Matches expressions like: 25 + 50, 40 * 12, 100 / 5, 20% of 500, 500 ka 20%, 500 na 20 taka
    const mathRegex = /(\b\d+(\.\d+)?\s*([+\-*/%^]|plus|minus|times|multiplied\s+by|divided\s+by|jod|ghata|guna|bhaag|vatta|ochha)\s*\d+(\.\d+)?(\s*([+\-*/%^]|plus|minus|times|divided\s+by)\s*\d+(\.\d+)?)*\b)/i;
    const mathMatch = lower.match(mathRegex);
    if (mathMatch) {
      entities.mathExpression = mathMatch[0];
    } else {
      // Percentage patterns: "20% of 500" or "500 का 20%" or "500 ના 20%"
      const percentMatch = lower.match(/(\d+(\.\d+)?)\s*(%|percent|pratishat|taka)\s*(of|ka|ki|ke|na|nu)?\s*(\d+(\.\d+)?)/i) ||
                           lower.match(/(\d+(\.\d+)?)\s*(ka|ki|ke|na|nu)\s*(\d+(\.\d+)?)\s*(%|percent|pratishat|taka)/i);
      if (percentMatch) {
        entities.mathExpression = percentMatch[0];
      }
    }

    // 2. Unit Conversion Extraction
    // e.g. "convert 50 km to miles", "100 celsius in fahrenheit", "5 kg to lbs"
    const unitRegex = /(\d+(\.\d+)?)\s*(km|kilometers|miles|celsius|fahrenheit|kg|kilograms|pounds|lbs|meters|feet|cm|inches)\s*(to|in|mein|ma)\s*(km|kilometers|miles|celsius|fahrenheit|kg|kilograms|pounds|lbs|meters|feet|cm|inches)/i;
    const unitMatch = lower.match(unitRegex);
    if (unitMatch) {
      entities.unitConversion = {
        value: parseFloat(unitMatch[1]),
        fromUnit: unitMatch[3].toLowerCase(),
        toUnit: unitMatch[5].toLowerCase(),
      };
    }

    // 3. Person Name Extraction
    // "my name is Rahul", "mera naam Amit hai", "maru naam Neha chhe", "call me Rohan", "I am Priya"
    const nameRegex = /(?:my name is|i am|call me|mera naam|maru naam|હું|મારું નામ|મારુ નામ|મેરા નામ)\s+([A-Za-z\u0900-\u097F\u0A80-\u0AFF]+)/i;
    const nameMatch = text.match(nameRegex);
    if (nameMatch && nameMatch[1]) {
      const candidate = nameMatch[1].trim();
      const forbiddenWords = ['vaani', 'vani', 'assistant', 'user', 'ai', 'a', 'the', 'chhe', 'hai'];
      if (!forbiddenWords.includes(candidate.toLowerCase())) {
        entities.personName = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }

    // 4. Note Extraction
    // "take a note: buy milk", "create note meeting tomorrow", "note banao: project idea", "note lakho: milk"
    const noteRegex = /(?:take\s+a\s+note|create\s+note|new\s+note|add\s+note|note\s+banao|note\s+karo|note\s+lakho|નોંધ\s+બનાવો|નોટ\s+લખો|नोट\s+बनाओ)[:\s]+(.+)/i;
    const noteMatch = text.match(noteRegex);
    if (noteMatch && noteMatch[1]) {
      const fullNote = noteMatch[1].trim();
      // Split into title / content if possible
      const parts = fullNote.split(/[:\n-]/);
      if (parts.length > 1) {
        entities.noteTitle = parts[0].trim();
        entities.noteContent = parts.slice(1).join(' ').trim();
      } else {
        entities.noteTitle = fullNote.length > 30 ? fullNote.slice(0, 30) + '...' : fullNote;
        entities.noteContent = fullNote;
      }
    }

    // 5. Task / To-Do Extraction
    // "add task: buy milk", "remind me to call mom", "create to do finish report", "task banao: exercise"
    const taskRegex = /(?:add\s+task|new\s+task|create\s+task|remind\s+me\s+to|todo|to-do|task\s+banao|kam\s+banao|task\s+lakho|કામ\s+ઉમેરો|ટાસ્ક\s+બનાવો)[:\s]+(.+)/i;
    const taskMatch = text.match(taskRegex);
    if (taskMatch && taskMatch[1]) {
      entities.taskTitle = taskMatch[1].replace(/^(to|that)\s+/i, '').trim();
    }

    // 6. Language Target
    if (/\b(hindi|हिन्दी|हिंदी)\b/i.test(text)) entities.targetLanguage = 'hi-IN';
    else if (/\b(gujarati|ગુજરાતી)\b/i.test(text)) entities.targetLanguage = 'gu-IN';
    else if (/\b(english|अंग्रेजी|અંગ્રેજી)\b/i.test(text)) entities.targetLanguage = 'en-IN';

    // 7. Difficulty / Level
    if (/\b(harder|difficult|advanced|tough|muskil|bhari|કઠિન|મુશ્કેલ)\b/i.test(text)) {
      entities.difficulty = 'advanced';
    } else if (/\b(intermediate|medium|madhyam|મધ્યમ)\b/i.test(text)) {
      entities.difficulty = 'intermediate';
    } else if (/\b(easier|easy|beginner|basic|saral|shuruat|સરળ|શરૂઆત)\b/i.test(text)) {
      entities.difficulty = 'beginner';
    }

    // 8. General Search / Question Term
    // "what is quantum computing?", "tell me about photosynthesis", "taj mahal ke baare mein batao"
    const searchRegex = /(?:what is|who is|tell me about|explain|kya hai|ke bare mein batao|vise kaho|શું છે)[:\s]+(.+)/i;
    const searchMatch = text.match(searchRegex);
    if (searchMatch && searchMatch[1]) {
      entities.searchTerm = searchMatch[1].replace(/[?!.]/g, '').trim();
    }

    return entities;
  }
}

