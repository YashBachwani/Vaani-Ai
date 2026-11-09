import { SupportedLanguage } from '../language/multilingualProcessor';

export type ResponseStyle = 'friendly' | 'professional' | 'concise' | 'detailed';

export class PersonalityEngine {
  /**
   * Generates a greeting tailored to language, style, and remembered user name
   */
  public static getGreeting(language: SupportedLanguage, style: ResponseStyle = 'friendly', userName?: string): string {
    const namePart = userName ? ` ${userName}` : '';

    if (language === 'hi-IN') {
      if (style === 'concise') return `नमस्ते${namePart}! कहिए, मैं क्या मदद करूँ?`;
      if (style === 'professional') return `नमस्कार${namePart}! वाणी एआई में आपका स्वागत है। मैं आपकी किस प्रकार सहायता कर सकता हूँ?`;
      return `नमस्ते${namePart}! मैं वाणी हूँ, आपकी बहुभाषी आवाज़ साथी। आज आप क्या करना या सीखना चाहेंगे?`;
    }

    if (language === 'gu-IN') {
      if (style === 'concise') return `નમસ્તે${namePart}! કહો, હું શું મદદ કરું?`;
      if (style === 'professional') return `નમસ્કાર${namePart}! વાણી એઆઈ માં આપનું સ્વાગત છે. હું આપની કેવી રીતે સહાય કરી શકું?`;
      return `નમસ્તે${namePart}! હું વાણી છું, તમારી મલ્ટીલિંગ્યુઅલ વૉઇસ કમ્પેનિયન. આજે તમે શું કરવા માંગો છો?`;
    }

    // en-IN default
    if (style === 'concise') return `Hello${namePart}! How can I assist you today?`;
    if (style === 'professional') return `Greetings${namePart}. Welcome to VAANI AI. How may I be of assistance today?`;
    return `Hello${namePart}! I'm VAANI, your voice companion. What would you like to explore, accomplish, or learn today?`;
  }

  /**
   * Generates a farewell
   */
  public static getFarewell(language: SupportedLanguage, userName?: string): string {
    const namePart = userName ? ` ${userName}` : '';
    if (language === 'hi-IN') return `अलविदा${namePart}! आपका दिन शुभ हो। जब भी आवश्यकता हो, आवाज़ दें।`;
    if (language === 'gu-IN') return `આવજો${namePart}! તમારો દિવસ સારો રહે. ફરી જરૂર પડે ત્યારે યાદ કરજો!`;
    return `Goodbye${namePart}! Have a wonderful day ahead. Speak with you again soon!`;
  }

  /**
   * Generates encouragement for learning
   */
  public static getEncouragement(language: SupportedLanguage, isCorrect: boolean): string {
    if (language === 'hi-IN') {
      return isCorrect
        ? 'शानदार प्रयास! आपका उत्तर बहुत सटीक और स्पष्ट है।'
        : 'बहुत बढ़िया कोशिश! गलतियों से ही हम सीखते हैं। आइए इसे दोबारा देखें।';
    }
    if (language === 'gu-IN') {
      return isCorrect
        ? 'ખૂબ સરસ પ્રયાસ! તમારો જવાબ એકદમ સાચો છે.'
        : 'ખૂબ સારો પ્રયાસ! શીખતી વખતે ભૂલો થવી સ્વાભાવિક છે. ચાલો ફરીથી પ્રયત્ન કરીએ.';
    }
    return isCorrect
      ? 'Excellent effort! Your response was clear, accurate, and confident.'
      : "Great try! Mistakes are a natural part of mastering a language. Let's practice it together.";
  }
}

