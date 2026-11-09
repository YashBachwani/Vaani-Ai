import { config } from '../../config';
import { UsageLog } from '../../models/UsageLog';

export interface TTSOptions {
  voice?: 'Nalini' | 'Kaveri' | 'Deepak';
  language?: 'en-IN' | 'hi-IN' | 'gu-IN' | string;
  speed?: number;
}

export class GnaniTTSService {
  private static apiKey = config.gnani.apiKey;
  private static baseUrl = config.gnani.ttsBaseUrl;
  
  // Cache to store audio buffers for identical text/voice queries
  private static audioCache = new Map<string, { buffer: Buffer; timestamp: number }>();
  private static MAX_CACHE_SIZE = 200;

  /**
   * Synthesize text to WAV audio using Gnani.ai Timbre v2.5
   */
  public static async synthesizeSpeech(
    text: string,
    options: TTSOptions = {},
    userId?: string
  ): Promise<{ audioBuffer: Buffer; contentType: string }> {
    const cleanText = text.trim();
    if (!cleanText) {
      throw new Error('TTS text cannot be empty');
    }

    // Map UI language keys
    let language = options.language || 'hi-IN';
    if (language === 'en' || language === 'english') language = 'en-IN';
    else if (language === 'hi' || language === 'hindi') language = 'hi-IN';
    else if (language === 'gu' || language === 'gujarati') language = 'gu-IN';

    const voice = options.voice || 'Nalini';
    const speed = options.speed && options.speed > 0.5 && options.speed <= 2.0 ? options.speed : 1.0;

    // Cache key
    const cacheKey = `${language}:${voice}:${speed}:${cleanText.slice(0, 100)}:${cleanText.length}`;
    const cached = this.audioCache.get(cacheKey);
    if (cached) {
      console.log(`[Gnani TTS] Returning cached audio for: "${cleanText.slice(0, 30)}..."`);
      return { audioBuffer: cached.buffer, contentType: 'audio/wav' };
    }

    const payload = {
      text: cleanText,
      voice,
      model: 'timbre-v2.5',
      language,
      speed,
      audio_config: {
        encoding: 'linear_pcm',
        container: 'wav',
        num_channels: 1,
        sample_rate: 48000,
        sample_width: 2,
      },
    };

    const startTime = Date.now();
    let retries = 2;
    let delay = 1000;

    while (retries >= 0) {
      try {
        console.log(`[Gnani TTS] Calling ${this.baseUrl} with voice=${voice}, lang=${language}`);
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'X-API-Key-ID': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const latencyMs = Date.now() - startTime;

        if (response.status === 429 && retries > 0) {
          console.warn(`[Gnani TTS 429 Rate Limit] Backing off for ${delay}ms...`);
          await new Promise((res) => setTimeout(res, delay));
          delay *= 1.5;
          retries--;
          continue;
        }

        if (!response.ok) {
          const errText = await response.text();
          console.error(`[Gnani TTS Error] HTTP ${response.status}: ${errText}`);

          await UsageLog.create({
            userId,
            service: 'TTS',
            operation: 'synthesize',
            language,
            status: 'error',
            latencyMs,
            usageMetadata: { httpStatus: response.status, errorText: errText }
          }).catch(() => {});

          throw new Error(`Gnani TTS failed with status ${response.status}: ${errText}`);
        }

        const arrayBuf = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);

        // Store in cache
        if (this.audioCache.size >= this.MAX_CACHE_SIZE) {
          const oldestKey = this.audioCache.keys().next().value;
          if (oldestKey) this.audioCache.delete(oldestKey);
        }
        this.audioCache.set(cacheKey, { buffer, timestamp: Date.now() });

        await UsageLog.create({
          userId,
          service: 'TTS',
          operation: 'synthesize',
          language,
          status: 'success',
          latencyMs,
          usageMetadata: {
            voice,
            byteLength: buffer.length,
            textLength: cleanText.length
          }
        }).catch(() => {});

        return { audioBuffer: buffer, contentType: 'audio/wav' };
      } catch (err: any) {
        if (retries === 0) {
          console.error('[Gnani TTS Final Exception]', err.message);
          throw err;
        }
        retries--;
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    throw new Error('TTS service failed after retries.');
  }
}

