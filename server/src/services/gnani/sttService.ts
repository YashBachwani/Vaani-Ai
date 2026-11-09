import { config } from '../../config';
import { UsageLog } from '../../models/UsageLog';

export interface STTResult {
  transcript: string;
  detectedLanguage?: string;
  confidence?: number;
  duration?: number;
  success: boolean;
  error?: string;
}

export class GnaniSTTService {
  private static apiKey = config.gnani.apiKey;
  private static baseUrl = config.gnani.sttBaseUrl;

  /**
   * Transcribes an audio buffer using Gnani.ai STT v3 REST endpoint
   */
  public static async transcribeAudio(
    audioBuffer: Buffer,
    mimeType: string = 'audio/wav',
    languageCode: string = 'hi-IN',
    userId?: string
  ): Promise<STTResult> {
    const startTime = Date.now();

    // Map UI language keys to valid Gnani language codes
    let gnaniLang = languageCode;
    if (languageCode === 'en' || languageCode === 'english') gnaniLang = 'en-IN';
    else if (languageCode === 'hi' || languageCode === 'hindi') gnaniLang = 'hi-IN';
    else if (languageCode === 'gu' || languageCode === 'gujarati') gnaniLang = 'gu-IN';

    // Validate size (Gnani STT short clips up to ~30 seconds, 10MB limit)
    if (audioBuffer.length > 10 * 1024 * 1024) {
      throw new Error('Audio payload too large. Please record shorter clips (under 30 seconds).');
    }
    if (audioBuffer.length < 500) {
      throw new Error('Audio sample too short or empty. Please speak clearly.');
    }

    try {
      // Build FormData payload
      const formData = new FormData();
      const fileName = mimeType.includes('webm') ? 'input.webm' : 'input.wav';
      const audioBlob = new Blob([audioBuffer], { type: mimeType });
      formData.append('audio_file', audioBlob, fileName);
      formData.append('language_code', gnaniLang);

      console.log(`[Gnani STT] Sending ${audioBuffer.length} bytes to ${this.baseUrl} with lang=${gnaniLang}`);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'X-API-Key-ID': this.apiKey,
        },
        body: formData,
      });

      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Gnani STT Error] HTTP ${response.status}: ${errorText}`);

        await UsageLog.create({
          userId,
          service: 'STT',
          operation: 'transcribe',
          language: gnaniLang,
          status: 'error',
          latencyMs,
          usageMetadata: { httpStatus: response.status, errorText }
        }).catch(() => {});

        if (response.status === 429) {
          throw new Error('Gnani speech service rate limited. Please try speaking again in a moment.');
        }
        throw new Error(`Gnani STT failed with status ${response.status}: ${errorText || 'Unknown error'}`);
      }

      const data: any = await response.json();
      console.log('[Gnani STT Success] Response:', JSON.stringify(data));

      const transcript = (data.transcript || (data.output && data.output.literal) || '').trim();
      const detectedLang = data.detected_language_code || gnaniLang;

      await UsageLog.create({
        userId,
        service: 'STT',
        operation: 'transcribe',
        language: gnaniLang,
        status: 'success',
        latencyMs,
        usageMetadata: {
          requestId: data.request_id,
          model: data.model,
          processingTime: data.processing_time
        }
      }).catch(() => {});

      return {
        success: true,
        transcript,
        detectedLanguage: detectedLang,
        confidence: 0.95,
        duration: data.processing_time
      };
    } catch (err: any) {
      console.error('[Gnani STT Exception]', err.message);
      return {
        success: false,
        transcript: '',
        error: err.message
      };
    }
  }
}

