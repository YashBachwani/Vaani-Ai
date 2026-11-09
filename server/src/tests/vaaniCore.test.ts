import { MultilingualProcessor } from '../core/vaani/language/multilingualProcessor';
import { EntityExtractor } from '../core/vaani/entities/entityExtractor';
import { IntentClassifier } from '../core/vaani/intent/intentClassifier';
import { ActionEngine } from '../core/vaani/actions/actionEngine';
import { ContextManager } from '../core/vaani/context/contextManager';
import { LearningEngine } from '../core/vaani/learning/learningEngine';

describe('VAANI CORE — Intelligence Engine Tests', () => {

  describe('1. MultilingualProcessor', () => {
    test('detects Devanagari script for Hindi text', () => {
      const res = MultilingualProcessor.detectScript('नमस्ते आप कैसे हैं');
      expect(res).toBe('devanagari');
    });

    test('detects Gujarati script for Gujarati text', () => {
      const res = MultilingualProcessor.detectScript('નમસ્તે તમે કેમ છો');
      expect(res).toBe('gujarati');
    });

    test('detects Latin script for English text', () => {
      const res = MultilingualProcessor.detectScript('Hello, how are you?');
      expect(res).toBe('latin');
    });

    test('analyzes Romanized Hindi properly', () => {
      const analysis = MultilingualProcessor.analyze('namaste aap kaise ho');
      expect(analysis.detectedLanguage).toBe('hi-IN');
      expect(analysis.isTransliterated).toBe(true);
    });

    test('analyzes Romanized Gujarati properly', () => {
      const analysis = MultilingualProcessor.analyze('kem cho tame');
      expect(analysis.detectedLanguage).toBe('gu-IN');
      expect(analysis.isTransliterated).toBe(true);
    });
  });

  describe('2. EntityExtractor', () => {
    test('extracts math expression', () => {
      const entities = EntityExtractor.extract('What is 25 * 40?');
      expect(entities.mathExpression).toBeDefined();
    });

    test('extracts percentage calculation', () => {
      const entities = EntityExtractor.extract('calculate 20% of 500');
      expect(entities.mathExpression).toBeDefined();
    });

    test('extracts person name declaration', () => {
      const entities = EntityExtractor.extract('My name is Rahul');
      expect(entities.personName).toBe('Rahul');
    });

    test('extracts unit conversion parameters', () => {
      const entities = EntityExtractor.extract('Convert 50 km to miles');
      expect(entities.unitConversion).toEqual({
        value: 50,
        fromUnit: 'km',
        toUnit: 'miles'
      });
    });

    test('extracts task title', () => {
      const entities = EntityExtractor.extract('Add task: Buy groceries for dinner');
      expect(entities.taskTitle).toBe('Buy groceries for dinner');
    });
  });

  describe('3. IntentClassifier', () => {
    test('classifies greeting in English', () => {
      const res = IntentClassifier.classify('Hello there, good morning', {});
      expect(res.intent).toBe('greeting');
      expect(res.confidence).toBeGreaterThan(0.8);
    });

    test('classifies greeting in Hindi', () => {
      const res = IntentClassifier.classify('नमस्ते क्या हाल है', {});
      expect(res.intent).toBe('greeting');
    });

    test('classifies greeting in Gujarati', () => {
      const res = IntentClassifier.classify('નમસ્તે કેમ છો', {});
      expect(res.intent).toBe('greeting');
    });

    test('classifies name recall intent', () => {
      const res = IntentClassifier.classify('What is my name?', {});
      expect(res.intent).toBe('name_recall');
    });

    test('classifies task creation', () => {
      const res = IntentClassifier.classify('Add task clean my room', { taskTitle: 'clean my room' });
      expect(res.intent).toBe('task_creation');
    });

    test('classifies note creation', () => {
      const res = IntentClassifier.classify('Take a note: Meeting tomorrow at 3pm', { noteTitle: 'Meeting tomorrow', noteContent: 'Meeting tomorrow at 3pm' });
      expect(res.intent).toBe('note_creation');
    });
  });

  describe('4. ActionEngine (Calculator & Conversions)', () => {
    test('evaluates basic arithmetic accurately without eval', () => {
      const calc1 = ActionEngine.evaluateMath('25 * 4');
      expect(calc1?.result).toBe(100);

      const calc2 = ActionEngine.evaluateMath('100 / 4 + 15');
      expect(calc2?.result).toBe(40);
    });

    test('evaluates percentage expressions', () => {
      const calc = ActionEngine.evaluateMath('20% of 500');
      expect(calc?.result).toBe(100);
    });

    test('converts distance (km to miles)', () => {
      const conv = ActionEngine.convertUnit(100, 'km', 'miles');
      expect(conv?.result).toBe(62.14);
    });

    test('converts temperature (celsius to fahrenheit)', () => {
      const conv = ActionEngine.convertUnit(0, 'celsius', 'fahrenheit');
      expect(conv?.result).toBe(32);
    });
  });

  describe('5. ContextManager', () => {
    test('maintains session context and resolves name recall', () => {
      const sessionId = 'test-session-1';
      ContextManager.updateContext(sessionId, 'user', 'My name is Rahul', 'introduction', { personName: 'Rahul' });
      
      const ctx = ContextManager.getContext(sessionId);
      expect(ctx.userName).toBe('Rahul');

      const { resolvedIntent } = ContextManager.resolveContext('What is my name?', ctx);
      expect(resolvedIntent).toBe('name_recall');
    });

    test('resolves follow-up calculation with previous result', () => {
      const sessionId = 'test-session-2';
      const ctx = ContextManager.getContext(sessionId);
      ctx.lastCalculationResult = 50;

      const { resolvedText, resolvedIntent } = ContextManager.resolveContext('+ 10', ctx);
      expect(resolvedIntent).toBe('calculation');
      expect(resolvedText).toBe('50 + 10');
    });
  });

  describe('6. LearningEngine (Scenario & Feedback)', () => {
    test('loads available scenarios for English, Hindi, and Gujarati', () => {
      const scenarios = LearningEngine.getScenarios();
      expect(scenarios.length).toBeGreaterThanOrEqual(4);
      expect(scenarios.some(s => s.language === 'en-IN')).toBe(true);
      expect(scenarios.some(s => s.language === 'hi-IN')).toBe(true);
      expect(scenarios.some(s => s.language === 'gu-IN')).toBe(true);
    });

    test('evaluates satisfactory response with keyword alignment', () => {
      const scenario = LearningEngine.getScenarioById('food_ordering_en')!;
      const step = scenario.steps[0];
      const res = LearningEngine.evaluateStepResponse(step, 'I would like cold coffee please');
      expect(res.isSatisfactory).toBe(true);
      expect(res.accuracyScore).toBeGreaterThan(50);
    });

    test('evaluates insufficient response and provides constructive hints', () => {
      const scenario = LearningEngine.getScenarioById('food_ordering_en')!;
      const step = scenario.steps[0];
      const res = LearningEngine.evaluateStepResponse(step, 'nothing');
      expect(res.isSatisfactory).toBe(false);
      expect(res.correction).toBeDefined();
    });
  });

});

