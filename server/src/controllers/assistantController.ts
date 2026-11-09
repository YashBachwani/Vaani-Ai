import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { VaaniCore } from '../core/vaani';
import { GnaniSTTService } from '../services/gnani/sttService';

export class AssistantController {
  /**
   * Process text message to VAANI Assistant
   */
  public static async sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const user = req.user!;
      const { text, conversationId, generateVoice = true, language } = req.body;

      if (!text || !text.trim()) {
        res.status(400).json({ error: 'Text message cannot be empty.' });
        return;
      }

      // 1. Find or create conversation
      let conv;
      if (conversationId && Types.ObjectId.isValid(conversationId)) {
        conv = await Conversation.findOne({ _id: conversationId, userId });
      }

      if (!conv) {
        const title = text.trim().slice(0, 35) + (text.length > 35 ? '...' : '');
        conv = await Conversation.create({
          userId,
          title,
          language: language || user.preferredLanguage || 'en-IN',
          messageCount: 0
        });
      }

      // 2. Save user message to DB
      const userMsg = await Message.create({
        conversationId: conv._id,
        userId,
        role: 'user',
        content: text.trim(),
        language: language || conv.language,
        timestamp: new Date()
      });

      // 3. Process with VAANI CORE
      const coreResult = await VaaniCore.process({
        text: text.trim(),
        userId,
        sessionId: conv._id.toString(),
        preferredLanguage: language || user.preferredLanguage || 'en-IN',
        generateVoice,
        voiceName: user.preferredVoice || 'Nalini'
      });

      // 4. Save assistant response to DB
      const assistantMsg = await Message.create({
        conversationId: conv._id,
        userId,
        role: 'assistant',
        content: coreResult.text,
        language: coreResult.language,
        intent: coreResult.intent,
        confidence: coreResult.confidence,
        timestamp: new Date(),
        metadata: {
          actionResult: coreResult.actionResult,
          knowledgeMatch: coreResult.knowledgeMatch,
          suggestedFollowUps: coreResult.suggestedFollowUps
        }
      });

      // Update conversation metadata
      conv.lastMessageAt = new Date();
      conv.messageCount += 2;
      await conv.save();

      // Convert audioBuffer to base64 if available
      const audioBase64 = coreResult.audioBuffer
        ? `data:audio/wav;base64,${coreResult.audioBuffer.toString('base64')}`
        : null;

      res.status(200).json({
        conversationId: conv._id,
        userMessage: {
          id: userMsg._id,
          role: 'user',
          content: userMsg.content,
          timestamp: userMsg.timestamp
        },
        assistantMessage: {
          id: assistantMsg._id,
          role: 'assistant',
          content: assistantMsg.content,
          language: assistantMsg.language,
          intent: coreResult.intent,
          confidence: coreResult.confidence,
          timestamp: assistantMsg.timestamp,
          actionResult: coreResult.actionResult,
          knowledgeMatch: coreResult.knowledgeMatch,
          suggestedFollowUps: coreResult.suggestedFollowUps,
          audioUrl: audioBase64
        }
      });
    } catch (err: any) {
      console.error('[Assistant sendMessage Error]', err);
      res.status(500).json({ error: 'Failed to process assistant message: ' + err.message });
    }
  }

  /**
   * Process voice audio file upload (MediaRecorder audio/wav or webm)
   */
  public static async processVoice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const user = req.user!;
      const { conversationId, language } = req.body;
      const file = req.file;

      if (!file || !file.buffer) {
        res.status(400).json({ error: 'No audio file received. Please record your voice.' });
        return;
      }

      const mimeType = file.mimetype || 'audio/wav';
      const langCode = language || user.preferredLanguage || 'hi-IN';

      console.log(`[Assistant Voice] Received ${file.buffer.length} bytes, mime: ${mimeType}, lang: ${langCode}`);

      // 1. Transcribe audio with official Gnani STT
      const sttResult = await GnaniSTTService.transcribeAudio(
        file.buffer,
        mimeType,
        langCode,
        userId
      );

      if (!sttResult.success || !sttResult.transcript) {
        res.status(422).json({
          error: sttResult.error || 'Could not understand spoken audio. Please speak clearly and try again.',
          transcript: ''
        });
        return;
      }

      const transcribedText = sttResult.transcript;

      // 2. Find or create conversation
      let conv;
      if (conversationId && Types.ObjectId.isValid(conversationId)) {
        conv = await Conversation.findOne({ _id: conversationId, userId });
      }

      if (!conv) {
        const title = transcribedText.slice(0, 35) + (transcribedText.length > 35 ? '...' : '');
        conv = await Conversation.create({
          userId,
          title,
          language: langCode,
          messageCount: 0
        });
      }

      // 3. Save user message to DB
      const userMsg = await Message.create({
        conversationId: conv._id,
        userId,
        role: 'user',
        content: transcribedText,
        language: sttResult.detectedLanguage || langCode,
        timestamp: new Date()
      });

      // 4. Process with VAANI CORE & synthesize speech response
      const coreResult = await VaaniCore.process({
        text: transcribedText,
        userId,
        sessionId: conv._id.toString(),
        preferredLanguage: (sttResult.detectedLanguage as any) || langCode,
        generateVoice: true,
        voiceName: user.preferredVoice || 'Nalini'
      });

      // 5. Save assistant response to DB
      const assistantMsg = await Message.create({
        conversationId: conv._id,
        userId,
        role: 'assistant',
        content: coreResult.text,
        language: coreResult.language,
        intent: coreResult.intent,
        confidence: coreResult.confidence,
        timestamp: new Date(),
        metadata: {
          actionResult: coreResult.actionResult,
          knowledgeMatch: coreResult.knowledgeMatch,
          suggestedFollowUps: coreResult.suggestedFollowUps
        }
      });

      conv.lastMessageAt = new Date();
      conv.messageCount += 2;
      await conv.save();

      const audioBase64 = coreResult.audioBuffer
        ? `data:audio/wav;base64,${coreResult.audioBuffer.toString('base64')}`
        : null;

      res.status(200).json({
        conversationId: conv._id,
        transcript: transcribedText,
        detectedLanguage: sttResult.detectedLanguage,
        userMessage: {
          id: userMsg._id,
          role: 'user',
          content: userMsg.content,
          timestamp: userMsg.timestamp
        },
        assistantMessage: {
          id: assistantMsg._id,
          role: 'assistant',
          content: assistantMsg.content,
          language: assistantMsg.language,
          intent: coreResult.intent,
          confidence: coreResult.confidence,
          timestamp: assistantMsg.timestamp,
          actionResult: coreResult.actionResult,
          knowledgeMatch: coreResult.knowledgeMatch,
          suggestedFollowUps: coreResult.suggestedFollowUps,
          audioUrl: audioBase64
        }
      });
    } catch (err: any) {
      console.error('[Assistant processVoice Error]', err);
      res.status(500).json({ error: 'Failed to process voice request: ' + err.message });
    }
  }

  /**
   * Get all conversations for current user
   */
  public static async getConversations(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);

      const conversations = await Conversation.find({ userId })
        .sort({ lastMessageAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Conversation.countDocuments({ userId });

      res.status(200).json({
        conversations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load conversations.' });
    }
  }

  /**
   * Get messages for a specific conversation
   */
  public static async getConversationById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const conversation = await Conversation.findOne({ _id: id, userId });
      if (!conversation) {
        res.status(404).json({ error: 'Conversation not found.' });
        return;
      }

      const messages = await Message.find({ conversationId: id, userId }).sort({ timestamp: 1 });

      res.status(200).json({
        conversation,
        messages
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load conversation messages.' });
    }
  }

  /**
   * Delete conversation
   */
  public static async deleteConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const result = await Conversation.findOneAndDelete({ _id: id, userId });
      if (!result) {
        res.status(404).json({ error: 'Conversation not found.' });
        return;
      }

      await Message.deleteMany({ conversationId: id, userId });

      res.status(200).json({ message: 'Conversation deleted successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete conversation.' });
    }
  }
}

