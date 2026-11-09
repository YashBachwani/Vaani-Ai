import { SupportedLanguage } from '../language/multilingualProcessor';
import { ExtractedEntities } from '../entities/entityExtractor';

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  timestamp: Date;
}

export interface ConversationContext {
  conversationId?: string;
  userId?: string;
  userName?: string;
  currentTopic?: string;
  language: SupportedLanguage;
  recentTurns: ConversationTurn[];
  lastCalculationResult?: number;
  lastCreatedNoteId?: string;
  lastCreatedTaskId?: string;
  learningScenario?: string;
  learningDifficulty?: 'beginner' | 'intermediate' | 'advanced';
  pendingConfirmation?: {
    action: string;
    payload: any;
  };
}

export class ContextManager {
  // In-memory context cache per conversationId or userId
  private static contextStore = new Map<string, ConversationContext>();
  // Long-term user memories (e.g. remembered name, user preferences)
  private static userMemory = new Map<string, { userName?: string; preferences?: Record<string, any> }>();

  /**
   * Retrieves or initializes context
   */
  public static getContext(sessionId: string, preferredLanguage: SupportedLanguage = 'en-IN', userId?: string): ConversationContext {
    let ctx = this.contextStore.get(sessionId);
    if (!ctx) {
      ctx = {
        language: preferredLanguage,
        recentTurns: [],
        learningDifficulty: 'beginner'
      };
      this.contextStore.set(sessionId, ctx);
    }

    // Check userMemory fallback if userName is not set on session
    const effectiveUserId = userId || ctx.userId;
    if (!ctx.userName && effectiveUserId) {
      const mem = this.userMemory.get(effectiveUserId);
      if (mem?.userName) {
        ctx.userName = mem.userName;
      }
    }

    return ctx;
  }

  /**
   * Updates context with a new turn and extracted entities
   */
  public static updateContext(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
    intent?: string,
    entities?: ExtractedEntities,
    newContextProps?: Partial<ConversationContext>
  ): ConversationContext {
    const ctx = this.getContext(sessionId);

    // Append turn, keeping max 10 recent turns
    ctx.recentTurns.push({
      role,
      content,
      intent,
      timestamp: new Date()
    });
    if (ctx.recentTurns.length > 10) {
      ctx.recentTurns.shift();
    }

    // Update userName if extracted
    if (entities?.personName) {
      ctx.userName = entities.personName;
      if (ctx.userId) {
        const mem = this.userMemory.get(ctx.userId) || {};
        mem.userName = entities.personName;
        this.userMemory.set(ctx.userId, mem);
      }
    }

    // Update difficulty if extracted
    if (entities?.difficulty) {
      ctx.learningDifficulty = entities.difficulty;
    }

    // Merge any explicit updates
    if (newContextProps) {
      Object.assign(ctx, newContextProps);
    }

    return ctx;
  }

  /**
   * Resolves contextual references (e.g. "what is my name?", "make it harder", "add 5 to that")
   */
  public static resolveContext(text: string, ctx: ConversationContext): { resolvedText: string; resolvedIntent?: string } {
    const lower = text.toLowerCase().trim();

    // Check "what is my name?" / "mera naam kya hai"
    if (/\b(what\s+is\s+my\s+name|mera\s+naam\s+kya\s+hai|maru\s+naam\s+shu\s+chhe)\b/i.test(lower)) {
      return { resolvedText: text, resolvedIntent: 'name_recall' };
    }

    // Check "make it harder" / "make it easier"
    if (/\b(make\s+it\s+(harder|easier|tougher)|aur\s+kathin|muskil\s+karo)\b/i.test(lower)) {
      return { resolvedText: text, resolvedIntent: 'learning_request' };
    }

    // Check follow-up calculation referencing previous result (e.g. "+ 5", "plus 10", "times 2")
    if (ctx.lastCalculationResult !== undefined && /^[+\-*/]\s*\d+/i.test(lower)) {
      const resolved = `${ctx.lastCalculationResult} ${text}`;
      return { resolvedText: resolved, resolvedIntent: 'calculation' };
    }

    return { resolvedText: text };
  }

  /**
   * Clears context for a session
   */
  public static clearContext(sessionId: string): void {
    this.contextStore.delete(sessionId);
  }
}
