import { MultilingualProcessor, SupportedLanguage } from './language/multilingualProcessor';
import { EntityExtractor, ExtractedEntities } from './entities/entityExtractor';
import { IntentClassifier, IntentResult } from './intent/intentClassifier';
import { ContextManager, ConversationContext } from './context/contextManager';
import { ActionEngine, ActionResult } from './actions/actionEngine';
import { KnowledgeRetriever, KnowledgeMatch } from './knowledge/knowledgeRetriever';
import { ResponseGenerator, GeneratedResponse } from './response/responseGenerator';
import { GnaniTTSService } from '../../services/gnani/ttsService';

export interface VaaniCoreInput {
  text: string;
  userId?: string;
  sessionId: string;
  preferredLanguage?: SupportedLanguage;
  generateVoice?: boolean;
  voiceName?: 'Nalini' | 'Kaveri' | 'Deepak';
  speed?: number;
}

export interface VaaniCoreOutput {
  text: string;
  language: SupportedLanguage;
  intent: string;
  confidence: number;
  entities: ExtractedEntities;
  actionResult?: ActionResult;
  knowledgeMatch?: KnowledgeMatch;
  audioBuffer?: Buffer;
  audioContentType?: string;
  suggestedFollowUps?: string[];
  context: ConversationContext;
}

export class VaaniCore {
  /**
   * Process a user message end-to-end through VAANI CORE
   */
  public static async process(input: VaaniCoreInput): Promise<VaaniCoreOutput> {
    const rawText = input.text.trim();
    const sessionId = input.sessionId || 'default-session';
    const preferredLang = input.preferredLanguage || 'en-IN';

    // 1. Context retrieval
    const currentContext = ContextManager.getContext(sessionId, preferredLang, input.userId);
    currentContext.userId = input.userId;

    // 2. Multilingual & Script Analysis
    const langAnalysis = MultilingualProcessor.analyze(rawText, preferredLang);
    currentContext.language = langAnalysis.detectedLanguage;

    // 3. Entity Extraction
    const entities = EntityExtractor.extract(rawText, currentContext);

    // 4. Context Resolution (e.g. "what is my name?", "+ 5", "make it harder")
    const { resolvedText, resolvedIntent } = ContextManager.resolveContext(rawText, currentContext);

    // 5. Intent Classification
    const intentResult: IntentResult = resolvedIntent
      ? { intent: resolvedIntent as any, confidence: 0.98, matchedPattern: 'contextResolution' }
      : IntentClassifier.classify(resolvedText, entities, currentContext.language);

    // 6. Action Execution (if applicable)
    let actionResult: ActionResult | undefined = undefined;

    if (intentResult.intent === 'calculation') {
      const mathExpr = entities.mathExpression || resolvedText;
      const calcRes = ActionEngine.evaluateMath(mathExpr);
      if (calcRes) {
        currentContext.lastCalculationResult = calcRes.result;
        actionResult = {
          success: true,
          action: 'calculate',
          data: calcRes,
          message: `${calcRes.expression} = ${calcRes.result}`
        };
      }
    } else if (intentResult.intent === 'unit_conversion') {
      if (entities.unitConversion) {
        const { value, fromUnit, toUnit } = entities.unitConversion;
        const convRes = ActionEngine.convertUnit(value, fromUnit, toUnit);
        if (convRes) {
          actionResult = {
            success: true,
            action: 'unit_conversion',
            data: convRes,
            message: `${convRes.fromStr} is equal to ${convRes.toStr}`
          };
        }
      }
    } else if (intentResult.intent === 'note_creation' && input.userId) {
      actionResult = await ActionEngine.createNote(
        input.userId,
        entities.noteTitle || 'Quick Note',
        entities.noteContent || rawText
      );
    } else if (intentResult.intent === 'note_retrieval' && input.userId) {
      actionResult = await ActionEngine.getNotes(input.userId);
    } else if (intentResult.intent === 'note_summary' && input.userId) {
      actionResult = await ActionEngine.summarizeNotes(input.userId);
    } else if (intentResult.intent === 'task_creation' && input.userId) {
      actionResult = await ActionEngine.createTask(
        input.userId,
        entities.taskTitle || rawText
      );
    } else if (intentResult.intent === 'task_listing' && input.userId) {
      actionResult = await ActionEngine.getTasks(input.userId);
    } else if (intentResult.intent === 'task_completion' && input.userId) {
      actionResult = await ActionEngine.completeTask(input.userId, entities.taskTitle);
    }

    // 7. Knowledge Base Search
    let knowledgeMatch: KnowledgeMatch | null = null;
    if (intentResult.intent === 'general_question' || intentResult.intent === 'explanation' || intentResult.intent === 'unknown_intent') {
      knowledgeMatch = await KnowledgeRetriever.search(rawText, currentContext.language);
    }

    // 8. Response Generation
    const generated = ResponseGenerator.generate(
      intentResult.intent,
      currentContext,
      actionResult,
      knowledgeMatch || undefined
    );

    // 9. Update Context with this turn
    ContextManager.updateContext(
      sessionId,
      'user',
      rawText,
      intentResult.intent,
      entities
    );
    ContextManager.updateContext(
      sessionId,
      'assistant',
      generated.text,
      intentResult.intent
    );

    // 10. Generate Voice (Gnani TTS) if requested
    let audioBuffer: Buffer | undefined = undefined;
    let audioContentType: string | undefined = undefined;

    if (input.generateVoice) {
      try {
        const ttsRes = await GnaniTTSService.synthesizeSpeech(
          generated.text,
          {
            voice: input.voiceName || 'Nalini',
            language: generated.language,
            speed: input.speed || 1.0
          },
          input.userId
        );
        audioBuffer = ttsRes.audioBuffer;
        audioContentType = ttsRes.contentType;
      } catch (ttsErr: any) {
        console.warn(`[VaaniCore] TTS synthesis skipped or failed: ${ttsErr.message}`);
      }
    }

    return {
      text: generated.text,
      language: generated.language,
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      entities,
      actionResult,
      knowledgeMatch: knowledgeMatch || undefined,
      audioBuffer,
      audioContentType,
      suggestedFollowUps: generated.suggestedFollowUps,
      context: currentContext
    };
  }
}
