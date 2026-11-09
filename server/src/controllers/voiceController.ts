import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { GnaniSTTService } from '../services/gnani/sttService';
import { GnaniTTSService } from '../services/gnani/ttsService';
import { config } from '../config';

export class VoiceController {
  /**
   * Directly transcribe an uploaded audio clip
   */
  public static async stt(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const file = req.file;
      const language = (req.body.language || 'hi-IN') as string;

      if (!file || !file.buffer) {
        res.status(400).json({ error: 'Audio file is required.' });
        return;
      }

      const result = await GnaniSTTService.transcribeAudio(
        file.buffer,
        file.mimetype || 'audio/wav',
        language,
        req.userId
      );

      if (!result.success) {
        res.status(422).json({ error: result.error || 'Failed to transcribe audio' });
        return;
      }

      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'STT service error: ' + err.message });
    }
  }

  /**
   * Synthesize text to speech (returns audio/wav directly)
   */
  public static async tts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { text, voice = 'Nalini', language = 'hi-IN', speed = 1.0 } = req.body;

      if (!text || !text.trim()) {
        res.status(400).json({ error: 'Text is required for TTS synthesis.' });
        return;
      }

      const result = await GnaniTTSService.synthesizeSpeech(
        text,
        { voice, language, speed },
        req.userId
      );

      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Length', result.audioBuffer.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.status(200).send(result.audioBuffer);
    } catch (err: any) {
      res.status(500).json({ error: 'TTS service error: ' + err.message });
    }
  }

  /**
   * Get supported voice and language configuration
   */
  public static getConfig(_req: AuthenticatedRequest, res: Response): void {
    res.status(200).json({
      supportedVoices: [
        { id: 'Nalini', name: 'Nalini (Female)', gender: 'female', recommendedFor: ['hi-IN', 'en-IN', 'gu-IN'] },
        { id: 'Kaveri', name: 'Kaveri (Female)', gender: 'female', recommendedFor: ['en-IN', 'hi-IN'] },
        { id: 'Deepak', name: 'Deepak (Male)', gender: 'male', recommendedFor: ['hi-IN', 'en-IN', 'gu-IN'] }
      ],
      supportedLanguages: [
        { code: 'en-IN', name: 'English (India)', nativeName: 'English' },
        { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' }
      ],
      defaultVoice: config.gnani.defaultVoices['hi-IN'],
      model: 'timbre-v2.5'
    });
  }
}

