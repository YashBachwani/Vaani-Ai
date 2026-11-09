export interface ScenarioStep {
  stepIndex: number;
  tutorPrompt: string;
  expectedKeywords: string[];
  sampleGoodAnswer: string;
  grammarHints?: string;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  category: 'everyday' | 'interview' | 'travel' | 'vocabulary' | 'grammar';
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  language: string;
  steps: ScenarioStep[];
}

export class LearningEngine {
  private static scenarios: ScenarioDefinition[] = [
    // 1. Everyday: Ordering Food at a Restaurant (English)
    {
      id: 'food_ordering_en',
      title: 'Ordering Food at a Restaurant',
      category: 'everyday',
      level: 'beginner',
      description: 'Practice ordering your favorite meal and drinks politely at a cafe or restaurant.',
      language: 'en-IN',
      steps: [
        {
          stepIndex: 0,
          tutorPrompt: 'Welcome to Cafe Delight! A table for one? What would you like to drink to start?',
          expectedKeywords: ['water', 'coffee', 'tea', 'juice', 'soda', 'coke', 'drink', 'please', 'like', 'have'],
          sampleGoodAnswer: 'I would like a cold coffee with less sugar, please.',
          grammarHints: 'Use polite modal verbs like "I would like..." or "May I have...".'
        },
        {
          stepIndex: 1,
          tutorPrompt: 'Excellent choice. Are you ready to order your main dish, or do you need a recommendation?',
          expectedKeywords: ['pizza', 'pasta', 'sandwich', 'burger', 'salad', 'recommend', 'vegetarian', 'special'],
          sampleGoodAnswer: 'What do you recommend as the house special pizza?',
          grammarHints: 'Asking questions politely with "What do you recommend...".'
        },
        {
          stepIndex: 2,
          tutorPrompt: 'Our Paneer Tikka Pizza is very popular! Would you like that with extra cheese?',
          expectedKeywords: ['yes', 'no', 'sure', 'please', 'extra', 'cheese', 'fine', 'regular'],
          sampleGoodAnswer: 'Yes, please add extra cheese on the pizza.',
          grammarHints: 'Affirmative replies with polite add-ons.'
        },
        {
          stepIndex: 3,
          tutorPrompt: 'Wonderful! Would you like any dessert after your meal?',
          expectedKeywords: ['ice cream', 'cake', 'brownie', 'gulab jamun', 'no', 'full', 'check', 'bill'],
          sampleGoodAnswer: 'No dessert for now, thank you. Just the bill please.',
          grammarHints: 'Declining politely with "No, thank you".'
        }
      ]
    },

    // 2. Everyday: Self Introduction (Hindi)
    {
      id: 'self_intro_hi',
      title: 'अपना परिचय (Self Introduction)',
      category: 'everyday',
      level: 'beginner',
      description: 'नए लोगों से मिलने पर आत्मविश्वास से अपना नाम, कार्य और रुचियाँ बताना सीखें।',
      language: 'hi-IN',
      steps: [
        {
          stepIndex: 0,
          tutorPrompt: 'नमस्ते! आपका स्वागत है। क्या आप मुझे अपना नाम और अपने शहर के बारे में बता सकते हैं?',
          expectedKeywords: ['नाम', 'रहता', 'रहती', 'शहर', 'दिल्ली', 'मुंबई', 'अहमदाबाद', 'जयपुर', 'से'],
          sampleGoodAnswer: 'मेरा नाम राहुल है और मैं अहमदाबाद में रहता हूँ।',
          grammarHints: 'क्रिया का लिंग (रहता हूँ / रहती हूँ) पर ध्यान दें।'
        },
        {
          stepIndex: 1,
          tutorPrompt: 'बहुत अच्छा! आप क्या काम करते हैं या क्या पढ़ाई कर रहे हैं?',
          expectedKeywords: ['काम', 'इंजीनियर', 'विद्यार्थी', 'छात्र', 'नौकरी', 'सॉफ्टवेयर', 'पढ़ाई', 'करता'],
          sampleGoodAnswer: 'मैं एक सॉफ्टवेयर डेवलपर के रूप में काम करता हूँ।',
          grammarHints: 'वर्तमान काल (Present Tense) में अपनी भूमिका बताएं।'
        },
        {
          stepIndex: 2,
          tutorPrompt: 'शानदार! आपको अपने खाली समय में क्या करना पसंद है?',
          expectedKeywords: ['पसंद', 'शौक', 'किताबें', 'संगीत', 'खेलना', 'क्रिकेट', 'घूमना', 'पढ़ना'],
          sampleGoodAnswer: 'मुझे खाली समय में संगीत सुनना और क्रिकेट खेलना बहुत पसंद है।',
          grammarHints: 'पसंद (Hobbies) व्यक्त करने के लिए "मुझे ... पसंद है" संरचना का उपयोग करें।'
        }
      ]
    },

    // 3. Interview: Job Interview Introduction (English)
    {
      id: 'interview_intro_en',
      title: 'Job Interview: Tell Me About Yourself',
      category: 'interview',
      level: 'intermediate',
      description: 'Master the most crucial opening question in professional job interviews.',
      language: 'en-IN',
      steps: [
        {
          stepIndex: 0,
          tutorPrompt: 'Good morning! Thank you for joining us today. To start off, could you please tell me about yourself and your background?',
          expectedKeywords: ['experience', 'years', 'developer', 'engineer', 'background', 'graduated', 'skills', 'work'],
          sampleGoodAnswer: 'I have 3 years of experience in full-stack software development, specializing in React and Node.js.',
          grammarHints: 'Present perfect tense: "I have worked...", "I have developed..."'
        },
        {
          stepIndex: 1,
          tutorPrompt: 'Impressive! What would you consider to be your greatest professional strength?',
          expectedKeywords: ['strength', 'problem', 'solving', 'teamwork', 'learning', 'adaptable', 'communication', 'dedicated'],
          sampleGoodAnswer: 'My greatest strength is analytical problem-solving and collaborating effectively in cross-functional teams.',
          grammarHints: 'Use strong adjectives like "analytical", "adaptable", "proactive".'
        },
        {
          stepIndex: 2,
          tutorPrompt: 'That aligns well with our team values. Where do you see yourself in the next three to five years?',
          expectedKeywords: ['lead', 'architect', 'growth', 'contribute', 'skills', 'responsible', 'mentor', 'future'],
          sampleGoodAnswer: 'In five years, I see myself leading engineering projects and mentoring junior developers in building scalable products.',
          grammarHints: 'Future projections with "I see myself leading..." or "I aim to achieve..."'
        }
      ]
    },

    // 4. Travel: Airport Navigation (Gujarati)
    {
      id: 'travel_airport_gu',
      title: 'એરપોર્ટ પર વાતચીત (Airport Navigation)',
      category: 'travel',
      level: 'beginner',
      description: 'એરપોર્ટ પર ચેક-ઇન, બોર્ડિંગ પાસ અને સામાન વિશે વાતચીતની પ્રેક્ટિસ.',
      language: 'gu-IN',
      steps: [
        {
          stepIndex: 0,
          tutorPrompt: 'નમસ્તે! એરપોર્ટ ચેક-ઇન કાઉન્ટર પર તમારું સ્વાગત છે. શું હું તમારો પાસપોર્ટ અને ટિકિટ જોઈ શકું?',
          expectedKeywords: ['પાસપોર્ટ', 'ટિકિટ', 'આ', 'રહ્યા', 'લો', 'હા', 'કૃપા'],
          sampleGoodAnswer: 'હા, ચોક્કસ. આ રહ્યો મારો પાસપોર્ટ અને મારી ફ્લાઇટ ટિકિટ.',
          grammarHints: 'નમ્રતાપૂર્વક દસ્તાવેજો આપતી વખતે "આ રહ્યો..." અથવા "આ લો..." કહો.'
        },
        {
          stepIndex: 1,
          tutorPrompt: 'આભાર. તમારી પાસે કેટલા બેગ (સામાન) છે જે ચેક-ઇન કરવાના છે?',
          expectedKeywords: ['બેગ', 'એક', 'બે', 'સામાન', 'લગેજ', 'માત્ર'],
          sampleGoodAnswer: 'મારી પાસે માત્ર એક જ ચેક-ઇન બેગ અને એક હેન્ડ બેગ છે.',
          grammarHints: 'સંખ્યાઓ અને વજનની સ્પષ્ટતા રાખો.'
        },
        {
          stepIndex: 2,
          tutorPrompt: 'પરફેક્ટ! આ રહ્યો તમારો બોર્ડિંગ પાસ. ગેટ નંબર ૧૨ છે. તમારી યાત્રા મંગલમય રહે!',
          expectedKeywords: ['આભાર', 'થેન્ક', 'ખૂબ', 'ધન્યવાદ', 'સારું'],
          sampleGoodAnswer: 'ખૂબ ખૂબ આભાર! તમારો દિવસ સારો રહે.',
          grammarHints: 'કૃતજ્ઞતા વ્યક્ત કરવા "ખૂબ ખૂબ આભાર" શબ્દ વાપરો.'
        }
      ]
    },

    // 5. Grammar & Vocabulary: Sentence Correction (English)
    {
      id: 'grammar_tenses_en',
      title: 'Grammar Mastery: Common Tense Mistakes',
      category: 'grammar',
      level: 'intermediate',
      description: 'Practice spotting and correcting common tense and subject-verb agreement errors.',
      language: 'en-IN',
      steps: [
        {
          stepIndex: 0,
          tutorPrompt: 'Let\'s practice tenses! Correct this sentence: "Yesterday I go to the market and buy vegetables."',
          expectedKeywords: ['went', 'bought', 'yesterday', 'market'],
          sampleGoodAnswer: 'Yesterday I went to the market and bought vegetables.',
          grammarHints: 'Use simple past tense ("went", "bought") for completed past actions.'
        },
        {
          stepIndex: 1,
          tutorPrompt: 'Well done! Now correct this one: "He do not likes eating spicy food."',
          expectedKeywords: ['does', 'not', 'like', 'he', 'spicy'],
          sampleGoodAnswer: 'He does not like eating spicy food.',
          grammarHints: 'Third person singular takes "does not like" (base verb without -s).'
        },
        {
          stepIndex: 2,
          tutorPrompt: 'Excellent! Lastly, how do you correctly state: "I am living here since five years"?',
          expectedKeywords: ['have', 'been', 'living', 'for', 'five', 'years'],
          sampleGoodAnswer: 'I have been living here for five years.',
          grammarHints: 'Use present perfect continuous ("have been living") with "for" for duration of time.'
        }
      ]
    }
  ];

  public static getScenarios(): ScenarioDefinition[] {
    return this.scenarios;
  }

  public static getScenarioById(id: string): ScenarioDefinition | undefined {
    return this.scenarios.find((s) => s.id === id);
  }

  /**
   * Evaluates user response against expected scenario keywords and provides constructive feedback
   */
  public static evaluateStepResponse(
    step: ScenarioStep,
    userText: string
  ): {
    isSatisfactory: boolean;
    accuracyScore: number;
    matchedKeywords: string[];
    feedback: string;
    correction?: { original: string; corrected: string; explanation: string };
  } {
    const cleanUser = userText.toLowerCase().trim();
    const matched: string[] = [];

    for (const kw of step.expectedKeywords) {
      if (cleanUser.includes(kw.toLowerCase())) {
        matched.push(kw);
      }
    }

    const keywordRatio = step.expectedKeywords.length > 0 ? matched.length / Math.min(3, step.expectedKeywords.length) : 1;
    const wordCount = cleanUser.split(/\s+/).length;

    // Minimum sentence substance check
    const isSatisfactory = keywordRatio >= 0.3 && wordCount >= 2;
    const accuracyScore = Math.min(100, Math.round((Math.min(1, keywordRatio) * 0.7 + Math.min(1, wordCount / 5) * 0.3) * 100));

    let feedback = '';
    let correction = undefined;

    if (isSatisfactory) {
      feedback = `Great response! You naturally used relevant vocabulary (${matched.slice(0, 3).join(', ')}).`;
    } else {
      feedback = `Good try! To sound more natural, try including phrases like: "${step.sampleGoodAnswer}". ${step.grammarHints || ''}`;
      correction = {
        original: userText,
        corrected: step.sampleGoodAnswer,
        explanation: step.grammarHints || 'Formulate a complete sentence using proper verb agreements.'
      };
    }

    return {
      isSatisfactory,
      accuracyScore,
      matchedKeywords: matched,
      feedback,
      correction
    };
  }
}

