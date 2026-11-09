import app from './app';
import { config } from './config';
import { connectDatabase } from './config/database';
import { KnowledgeEntry } from './models/KnowledgeEntry';
import { seedDatabase } from './seed';

async function startServer() {
  try {
    // 1. Connect to MongoDB (or memory fallback)
    await connectDatabase();

    // 2. Check and seed knowledge base if empty
    const count = await KnowledgeEntry.countDocuments();
    if (count === 0) {
      console.log('[Server] No knowledge entries found. Initializing seed data...');
      await seedDatabase();
      // Reconnect after seed disconnects
      await connectDatabase();
    }

    // 3. Listen on configured port
    const server = app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`🚀 VAANI AI Server running on http://localhost:${config.port}`);
      console.log(`   Environment: ${config.nodeEnv}`);
      console.log(`   Client Origin: ${config.clientOrigin}`);
      console.log(`   Proprietary Engine: VAANI CORE (100% LLM-Free)`);
      console.log(`   Official Gnani STT: ${config.gnani.sttBaseUrl}`);
      console.log(`   Official Gnani TTS: ${config.gnani.ttsBaseUrl}`);
      console.log(`====================================================`);
    });

    const shutdown = async () => {
      console.log('\n[Server] Shutting down gracefully...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err: any) {
    console.error('[Server] Fatal startup error:', err);
    process.exit(1);
  }
}

startServer();

