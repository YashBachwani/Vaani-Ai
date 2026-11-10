import mongoose from 'mongoose';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';
import { config } from './index';

let isConnected = false;
let mongodProcess: ChildProcess | null = null;

const LOCAL_MONGOD_PATH = 'C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe';
const LOCAL_DB_PATH = path.resolve(__dirname, '../../../data/db');

async function ensureLocalDataDir(): Promise<void> {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.mkdirSync(LOCAL_DB_PATH, { recursive: true });
  }
}

async function spawnLocalMongod(): Promise<boolean> {
  if (!fs.existsSync(LOCAL_MONGOD_PATH)) {
    return false;
  }
  await ensureLocalDataDir();

  return new Promise((resolve) => {
    try {
      console.log(`[Database] Launching local mongod.exe with dbpath "${LOCAL_DB_PATH}"...`);
      mongodProcess = spawn(LOCAL_MONGOD_PATH, [
        '--dbpath', LOCAL_DB_PATH,
        '--port', '27017',
        '--bind_ip', '127.0.0.1'
      ], {
        detached: false,
        stdio: 'ignore'
      });

      mongodProcess.on('error', (err) => {
        console.warn(`[Database] Error launching local mongod process: ${err.message}`);
        resolve(false);
      });

      // Give it 1.5 seconds to bind
      setTimeout(() => {
        resolve(true);
      }, 1500);
    } catch {
      resolve(false);
    }
  });
}

export async function connectDatabase(): Promise<typeof mongoose> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // First attempt: Connect to configured MongoDB URI
  try {
    console.log(`[Database] Attempting connection to ${config.mongoUri}...`);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 3000,
    });
    isConnected = true;
    console.log('[Database] Successfully connected to MongoDB at', config.mongoUri);
    return mongoose;
  } catch (primaryError: any) {
    console.warn(`[Database] Direct connection to ${config.mongoUri} was not active.`);

    // Try starting local mongod.exe
    const started = await spawnLocalMongod();
    if (started) {
      try {
        console.log('[Database] Retrying connection to local mongod at 127.0.0.1:27017...');
        await mongoose.connect(config.mongoUri, {
          serverSelectionTimeoutMS: 3000,
          connectTimeoutMS: 4000,
        });
        isConnected = true;
        console.log('[Database] Connected to launched local MongoDB instance successfully.');
        return mongoose;
      } catch (retryErr: any) {
        console.warn(`[Database] Local mongod retry failed: ${retryErr.message}`);
        if (mongodProcess) {
          try { mongodProcess.kill(); } catch {}
          mongodProcess = null;
        }
      }
    }

    // Fallback: MongoMemoryServer using ephemeral instance
    try {
      console.log('[Database] Initializing MongoMemoryServer fallback...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        binary: {
          systemBinary: fs.existsSync(LOCAL_MONGOD_PATH) ? LOCAL_MONGOD_PATH : undefined
        }
      });
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      isConnected = true;
      console.log('[Database] Connected to embedded MongoDB successfully at', uri);
      return mongoose;
    } catch (fallbackError: any) {
      console.error('[Database] Failed to establish database connection:', fallbackError);
      throw fallbackError;
    }
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[Database] Disconnected from MongoDB.');
  }
  if (mongodProcess && !mongodProcess.killed) {
    try {
      mongodProcess.kill();
    } catch {}
  }
}
