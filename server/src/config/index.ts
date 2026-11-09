import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vaani_ai',
  jwtSecret: process.env.JWT_SECRET || 'vaani_ai_ultra_secure_jwt_secret_key_2026_super_secret',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  gnani: {
    apiKey: process.env.GNANI_API_KEY || process.env.GNANI_STT_API_KEY || 'vach_1ytE2CY5X2F6oVqBFGyC8NEXfFKo3h7vWVYb8aOdAx1STa3NixUUCA5zd8hlha0eop42CvweAoOdroL0VUckKXpNEg2idVrO_55333ebdf3274435186d792e45e41314',
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

