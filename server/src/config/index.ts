import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vaani_ai',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  gnani: {
    apiKey: process.env.GNANI_API_KEY || process.env.GNANI_STT_API_KEY || '',
    sttBaseUrl: process.env.GNANI_STT_BASE_URL || 'https://api.vachana.ai/stt/v3',
    ttsBaseUrl: process.env.GNANI_TTS_BASE_URL || 'https://api.vachana.ai/api/v1/tts/inference',
    defaultVoices: {
      'hi-IN': 'Nalini',
      'en-IN': 'Nalini',
      'gu-IN': 'Nalini',
    },
    supportedVoices: ['Nalini', 'Kaveri', 'Deepak'],
    supportedLanguages: ['en-IN', 'hi-IN', 'gu-IN']
  }
};

