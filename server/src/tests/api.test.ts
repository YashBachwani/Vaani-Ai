import request from 'supertest';
import app from '../app';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/User';

describe('VAANI AI API Integration Tests', () => {
  let authToken = '';
  let userId = '';

  beforeAll(async () => {
    await connectDatabase();
    await User.deleteMany({ email: 'testrunner@vaani.ai' });
  });

  afterAll(async () => {
    await User.deleteMany({ email: 'testrunner@vaani.ai' });
    await disconnectDatabase();
  });

  test('POST /api/auth/register registers a user and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Runner',
        email: 'testrunner@vaani.ai',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('testrunner@vaani.ai');

    authToken = res.body.token;
    userId = res.body.user.id;
  });

  test('POST /api/auth/login logs in user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testrunner@vaani.ai',
        password: 'Password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('GET /api/voice/config returns official supported Gnani voices', async () => {
    const res = await request(app).get('/api/voice/config');
    expect(res.status).toBe(200);
    expect(res.body.supportedVoices).toBeDefined();
    expect(res.body.supportedVoices.some((v: any) => v.id === 'Nalini')).toBe(true);
    expect(res.body.supportedLanguages.some((l: any) => l.code === 'hi-IN')).toBe(true);
  });

  test('POST /api/assistant/message handles calculation query', async () => {
    const res = await request(app)
      .post('/api/assistant/message')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        text: 'What is 50 * 8?',
        generateVoice: false
      });

    expect(res.status).toBe(200);
    expect(res.body.assistantMessage.content).toContain('400');
    expect(res.body.assistantMessage.intent).toBe('calculation');
  });

  test('POST /api/assistant/message handles context-aware name recall', async () => {
    // 1. Declare name
    const msg1 = await request(app)
      .post('/api/assistant/message')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        text: 'My name is Vikram',
        generateVoice: false
      });

    expect(msg1.status).toBe(200);
    const convId = msg1.body.conversationId;

    // 2. Recall name in same conversation
    const recallRes = await request(app)
      .post('/api/assistant/message')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        conversationId: convId,
        text: 'What is my name?',
        generateVoice: false
      });

    expect(recallRes.status).toBe(200);
    expect(recallRes.body.assistantMessage.content).toContain('Vikram');
  });

  test('POST /api/tasks and GET /api/tasks manages to-do tasks', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Review speech models',
        priority: 'high'
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.task.title).toBe('Review speech models');

    const listRes = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.tasks.length).toBeGreaterThan(0);
  });

  test('GET /api/learning/scenarios returns structured modules', async () => {
    const res = await request(app)
      .get('/api/learning/scenarios')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.scenarios.length).toBeGreaterThanOrEqual(4);
  });
});
