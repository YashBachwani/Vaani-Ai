import { SupportedLanguage } from '../language/multilingualProcessor';
import { IntentType } from '../intent/intentClassifier';
import { ActionResult } from '../actions/actionEngine';
import { ConversationContext } from '../context/contextManager';
import { KnowledgeMatch } from '../knowledge/knowledgeRetriever';
import { PersonalityEngine, ResponseStyle } from '../personality/personalityEngine';

export interface GeneratedResponse {
  text: string;
  language: SupportedLanguage;
  actionResult?: ActionResult;
  knowledgeMatch?: KnowledgeMatch;
  suggestedFollowUps?: string[];
}

export class ResponseGenerator {
  public static generate(
    intent: IntentType,
    context: ConversationContext,
    actionResult?: ActionResult,
    knowledgeMatch?: KnowledgeMatch,
    style: ResponseStyle = 'friendly'
  ): GeneratedResponse {
    const lang = context.language || 'en-IN';
    const userName = context.userName;

    // 1. GREETING
    if (intent === 'greeting') {
      const greeting = PersonalityEngine.getGreeting(lang, style, userName);
      const suggestions = lang === 'hi-IN'
        ? ['एक नया टास्क बनाओ', 'कुछ नया सीखें', '50 का 20% कितना होता है?']
        : lang === 'gu-IN'
        ? ['નવો ટાસ્ક બનાવો', 'નવું શીખીએ', 'નોંધ બનાવો']
        : ['Create a task', 'Practice language', 'Calculate 25 * 40'];

      return {
        text: greeting,
        language: lang,
        suggestedFollowUps: suggestions
      };
    }

    // 2. FAREWELL
    if (intent === 'farewell') {
      return {
        text: PersonalityEngine.getFarewell(lang, userName),
        language: lang
      };
    }

    // 3. INTRODUCTION / NAME DECLARATION
    if (intent === 'introduction') {
      if (userName) {
        if (lang === 'hi-IN') {
          return {
            text: `नमस्ते ${userName}! आपसे मिलकर बहुत खुशी हुई। मैंने आपका नाम याद रख लिया है। अब बताइए, मैं आपकी क्या मदद करूँ?`,
            language: lang,
            suggestedFollowUps: ['मेरा नाम क्या है?', 'एक नोट बनाओ']
          };
        }
        if (lang === 'gu-IN') {
          return {
            text: `નમસ્તે ${userName}! તમને મળીને ખૂબ આનંદ થયો. મેં તમારું નામ યાદ રાખી લીધું છે. કહો, હું તમારી શું મદદ કરું?`,
            language: lang,
            suggestedFollowUps: ['મારું નામ શું છે?', 'નવો ટાસ્ક બનાવો']
          };
        }
        return {
          text: `Nice to meet you, ${userName}! I have remembered your name. How can I assist you today?`,
          language: lang,
          suggestedFollowUps: ['What is my name?', 'Create a note', 'Practice English']
        };
      }

      // Asking who VAANI is
      if (lang === 'hi-IN') {
        return {
          text: 'मैं वाणी (VAANI AI) हूँ — आपकी समर्पित बहुभाषी आवाज़ सहायक और भाषा शिक्षण साथी। मैं बिना किसी बाहरी एलएलएम के, विशुद्ध भारतीय भाषा समझ और ज्ञानी.एआई स्पीच तकनीक पर काम करती हूँ।',
          language: lang,
          suggestedFollowUps: ['आप क्या कर सकती हैं?', 'एक हिसाब करो']
        };
      }
      if (lang === 'gu-IN') {
        return {
          text: 'હું વાણી (VAANI AI) છું — તમારી સમર્પિત મલ્ટીલિંગ્યુઅલ વૉઇસ આસિસ્ટન્ટ અને લેંગ્વેજ લર્નિંગ પાર્ટનર. હું તમારી પોતાની ભાષામાં બોલવા અને શીખવામાં મદદ કરું છું.',
          language: lang,
          suggestedFollowUps: ['તમે શું કરી શકો છો?', 'ટાસ્ક બનાવો']
        };
      }
      return {
        text: "I am VAANI AI — your dedicated multilingual voice assistant and language learning platform. Powered by Gnani.ai speech technology and our proprietary VAANI CORE intelligence engine, I'm here to help you speak, learn, and manage tasks.",
        language: lang,
        suggestedFollowUps: ['What can you do?', 'Start language practice', 'Calculate 15% of 800']
      };
    }

    // 4. NAME RECALL
    if (intent === 'name_recall') {
      if (userName) {
        if (lang === 'hi-IN') return { text: `आपका नाम ${userName} है! मुझे भली-भांति याद है।`, language: lang };
        if (lang === 'gu-IN') return { text: `તમારું નામ ${userName} છે! મને બરાબર યાદ છે.`, language: lang };
        return { text: `Your name is ${userName}! I remember our previous conversation.`, language: lang };
      }
      if (lang === 'hi-IN') return { text: 'आपने अभी तक मुझे अपना नाम नहीं बताया है। आप कह सकते हैं: "मेरा नाम राहुल है"।', language: lang };
      if (lang === 'gu-IN') return { text: 'તમે હજુ સુધી મને તમારું નામ નથી કહ્યું. તમે કહી શકો છો: "મારું નામ અમિત છે".', language: lang };
      return { text: "You haven't told me your name yet! You can say: \"My name is...\" and I will remember it.", language: lang };
    }

    // 5. CALCULATION
    if (intent === 'calculation' || intent === 'unit_conversion') {
      if (actionResult && actionResult.success) {
        if (lang === 'hi-IN') {
          return {
            text: `गणना का परिणाम है: ${actionResult.message}`,
            language: lang,
            actionResult,
            suggestedFollowUps: ['इसमें 10 जोड़ो', 'एक नया हिसाब करो']
          };
        }
        if (lang === 'gu-IN') {
          return {
            text: `ગણતરીનું પરિણામ છે: ${actionResult.message}`,
            language: lang,
            actionResult,
            suggestedFollowUps: ['નવો હિસાબ કરો']
          };
        }
        return {
          text: `The result is: ${actionResult.message}`,
          language: lang,
          actionResult,
          suggestedFollowUps: ['Add 10 to that', 'Calculate 500 / 4']
        };
      }
      return {
        text: lang === 'hi-IN'
          ? 'माफ़ कीजिए, मैं इस गणितीय समीकरण को हल नहीं कर सकी। कृपया स्पष्ट संख्याएँ और चिन्ह बोलें।'
          : lang === 'gu-IN'
          ? 'માફ કરશો, હું આ ગણતરી ઉકેલી શકી નથી. કૃપા કરીને સ્પષ્ટ સંખ્યાઓ કહો.'
          : 'I could not compute that mathematical expression. Please provide a clear expression like "25 * 4" or "20% of 500".',
        language: lang
      };
    }

    // 6. NOTE ACTIONS
    if (intent === 'note_creation' || intent === 'note_retrieval' || intent === 'note_summary') {
      if (actionResult) {
        return {
          text: actionResult.message,
          language: lang,
          actionResult,
          suggestedFollowUps: intent === 'note_creation' ? ['मेरे नोट्स दिखाओ', 'नोट्स का सारांश'] : ['एक नया नोट बनाओ']
        };
      }
    }

    // 7. TASK ACTIONS
    if (intent === 'task_creation' || intent === 'task_listing' || intent === 'task_completion') {
      if (actionResult) {
        return {
          text: actionResult.message,
          language: lang,
          actionResult,
          suggestedFollowUps: intent === 'task_creation' ? ['मेरे सभी टास्क दिखाओ'] : ['एक नया टास्क बनाओ']
        };
      }
    }

    // 8. LEARNING REQUEST
    if (intent === 'learning_request') {
      const difficulty = context.learningDifficulty || 'beginner';
      if (lang === 'hi-IN') {
        return {
          text: `बिल्कुल! आइए भाषा सीखने का अभ्यास शुरू करें। वर्तमान स्तर: ${difficulty}। आप रेस्टोरेंट में बातचीत, साक्षात्कार तैयारी या दैनिक बातचीत में से क्या चुनना चाहेंगे?`,
          language: lang,
          suggestedFollowUps: ['दैनिक बातचीत', 'इंटरव्यू तैयारी', 'यात्रा अभ्यास']
        };
      }
      if (lang === 'gu-IN') {
        return {
          text: `ચોક્કસ! ચાલો ભાષા શીખવાનો અભ્યાસ શરૂ કરીએ. સ્તર: ${difficulty}. તમે રેસ્ટોરન્ટ, ઇન્ટરવ્યુ કે રોજિંદી વાતચીતમાંથી શું પસંદ કરશો?`,
          language: lang,
          suggestedFollowUps: ['રોજિંદી વાતચીત', 'ઇન્ટરવ્યુ પ્રેક્ટિસ', 'મુસાફરી']
        };
      }
      return {
        text: `Certainly! Let's start language practice. Current difficulty: ${difficulty}. Would you like to practice Everyday Conversations, Interview Prep, or Travel Scenarios?`,
        language: lang,
        suggestedFollowUps: ['Everyday Conversation', 'Interview Practice', 'Travel Scenarios']
      };
    }

    // 9. KNOWLEDGE MATCH
    if (knowledgeMatch && knowledgeMatch.score >= 0.35) {
      return {
        text: knowledgeMatch.content,
        language: lang,
        knowledgeMatch,
        suggestedFollowUps: [`Source: ${knowledgeMatch.source}`, 'Ask another question']
      };
    }

    // 10. UNKNOWN / FALLBACK
    if (lang === 'hi-IN') {
      return {
        text: 'मुझे इस विषय पर अभी सटीक जानकारी नहीं मिली। आप मुझसे कोई गणना, नोट्स, टास्क या भाषा सीखने का अभ्यास करने के लिए कह सकते हैं।',
        language: lang,
        suggestedFollowUps: ['मेरे टास्क दिखाओ', '50 + 75 कितना होता है?', 'एक नोट बनाओ']
      };
    }
    if (lang === 'gu-IN') {
      return {
        text: 'મને આ વિષય વિશે ચોક્કસ માહિતી મળી નથી. તમે મને ગણતરી, નોટ્સ, ટાસ્ક અથવા ભાષા શીખવાનો અભ્યાસ કરવા કહી શકો છો.',
        language: lang,
        suggestedFollowUps: ['મારા ટાસ્ક બતાવો', 'નોટ બનાવો', 'ભાષા શીખવો']
      };
    }
    return {
      text: "I do not currently have a reliable answer for that request in my internal knowledge base. You can ask me to perform calculations, manage notes and tasks, or practice languages in VAANI Learn.",
      language: lang,
      suggestedFollowUps: ['Show my tasks', 'Calculate 150 * 3', 'Practice Hindi', 'Take a note']
    };
  }
}

