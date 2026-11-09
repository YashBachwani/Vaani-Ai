# VAANI AI — Your Voice. Your Language. Your World.

> **Next-Generation Multilingual Voice Assistant & Spoken Language Learning Platform**  
> *Powered exclusively by Gnani.ai Speech Intelligence and our proprietary, 100% LLM-free VAANI CORE engine.*

---

## 🎯 Executive Solution Pitch (1-Page Brief)

### The Challenge
India is home to over 1.4 billion people speaking hundreds of languages and dialects, yet the modern AI landscape is dominated by English-centric, expensive, and opaque Large Language Models (LLMs). Contemporary voice assistants and language platforms suffer from three fundamental bottlenecks:
1. **Cost & Infrastructure Overhead:** Heavy reliance on external LLM APIs (OpenAI, Anthropic, Google) incurs high recurring token fees, vendor lock-in, and unpredictable latency.
2. **Hallucination & Lack of Control:** Probabilistic LLMs frequently fabricate facts, struggle with deterministic calculations, and lack predictable dialogue state tracking.
3. **Weak Vernacular Voice Nuance:** Mainstream platforms lack authentic speech synthesis and accurate dialect transcription for native Indian languages like Hindi and Gujarati, often delivering generic translations and fake pronunciation metrics.

### The VAANI AI Solution
**VAANI AI** is a standalone, sovereign, voice-first web platform engineered to deliver natural speech experiences in **English**, **Hindi (हिन्दी)**, and **Gujarati (ગુજરાતી)** without utilizing any external or local LLM. 

VAANI AI delivers two unified commercial-grade experiences through a single responsive platform:

1. **VAANI ASSISTANT — The Everyday Spoken Companion:**  
   Enables users to manage tasks, capture notes, solve mathematical equations, convert units, and access verified cultural/general knowledge using their natural voice. Backed by real-time animated AI orb visualizers and low-latency audio waveforms.
2. **VAANI LEARN — Spoken Language Mastery Tutor:**  
   An interactive language-learning simulator providing realistic dialogue state-machine scenarios (restaurant ordering, job interviews, airport navigation, grammar correction). Spoken tutor prompts guide users through natural voice replies with honest, transcript-verified vocabulary alignment and zero fake scores.

### Why VAANI AI Wins (Key Differentiators)
- **100% LLM-Free Sovereignty:** All intelligence, intent recognition, context management, anaphora resolution, and grammar analysis run directly within the project using our custom **VAANI CORE** engine in TypeScript.
- **Enterprise Speech Intelligence:** Powered by official **Gnani.ai Speech-to-Text (Prisma v3.0)** and **Text-to-Speech (Timbre v2.5)** with expressive native voices (*Nalini*, *Kaveri*, *Deepak*).
- **Direct Client PCM WAV Pipeline:** Encodes 16-bit mono PCM `.wav` directly in the browser via standard Web Audio API, ensuring 100% reliable transcription without server-side transcoding lag.
- **Context-Aware Dialogue Memory:** Remembers user identities, topics, and follow-ups across turns (e.g., *"My name is Rahul"* ➔ *"What is my name?"* ➔ *"Your name is Rahul"*).
- **Zero Ongoing AI Subscription Costs:** Eliminates token pricing entirely while ensuring total user privacy and instant responses.

---

## 🏗 System Architecture

```
                               ┌────────────────────────────────────────┐
                               │           VAANI AI FRONTEND            │
                               │   (React 19 + TypeScript + Tailwind)   │
                               └──────────────────┬─────────────────────┘
                                                  │
                      ┌───────────────────────────┴───────────────────────────┐
                      │ Browser Web Audio API (Direct 16-bit PCM WAV Stream)  │
                      └───────────────────────────┬───────────────────────────┘
                                                  │
                                                  ▼
                               ┌────────────────────────────────────────┐
                               │            VAANI AI BACKEND            │
                               │      (Node.js + Express REST API)      │
                               └──────┬──────────────────────────┬──────┘
                                      │                          │
                 ┌────────────────────┴────────────┐             │
                 ▼                                 ▼             ▼
  ┌─────────────────────────────┐   ┌────────────────────────┐  ┌────────────────────┐
  │      OFFICIAL GNANI.AI      │   │    VAANI CORE ENGINE   │  │      DATABASE      │
  │     SPEECH INTELLIGENCE     │   │   (100% LLM-Free NLP)  │  │ (MongoDB/Mongoose) │
  ├─────────────────────────────┤   ├────────────────────────┤  ├────────────────────┤
  │ • STT: Prisma v3.0          │   │ • Intent Classifier    │  │ • Users & Auth     │
  │ • TTS: Timbre v2.5          │   │ • Context Manager      │  │ • Conversations    │
  │ • Voices: Nalini/Kaveri/    │   │ • Multilingual NLP     │  │ • Learning Sessions│
  │   Deepak                    │   │ • Entity Extractor     │  │ • Tasks & Notes    │
  │ • Native WAV binary         │   │ • Action Engine        │  │ • Curated Knowledge│
  └─────────────────────────────┘   │ • Knowledge Retriever  │  └────────────────────┘
                                    │ • Learning Tutor Tree  │
                                    │ • Response Generator   │
                                    └────────────────────────┘
```

---

## 🌟 Platform Capabilities

### 1. VAANI Assistant
- **Microphone & Voice State Machine:** Seamlessly transitions through `idle`, `listening`, `processing`, and `speaking` with dynamic concentric glow animations and real-time audio waveforms.
- **Calculations & Unit Conversions:** Evaluates math expressions without dangerous `eval()` (percentages, multi-term arithmetic, powers) and handles metric-imperial conversions (km/miles, °C/°F, kg/lbs).
- **Persistent Notes & Tasks:** Create, view, summarize, and complete tasks and notes with automatic database synchronization.
- **Curated Knowledge Retrieval:** Instant, fact-based search covering Indian history, science, geography, and education with source attribution.
- **Audio Controls:** Full playback bar with speed adjustments (0.8x, 1.0x, 1.25x), instant replay, and mute toggles.

### 2. VAANI Learn
- **Curated Scenario Modules:**
  - *Everyday Conversations:* Self-introduction, cafe & restaurant food ordering, shopping.
  - *Interview Preparation:* Personal introductions, discussing career goals, strengths.
  - *Travel Navigation:* Airport check-in, customs, hotel booking, local directions.
  - *Grammar Mastery:* Correcting past/present tense errors, subject-verb agreement.
- **Interactive State Tree:** Step-by-step progress tracking where the tutor speaks audio prompts and evaluates spoken or typed user responses.
- **Constructive Grammar Guidance:** Instant feedback displaying matched vocabulary, suggested phrasing improvements, and grammar pointers.
- **Honest Speech Feedback:** Compares recognized transcripts against expected semantic concepts rather than inventing fake phonetic scores.
- **Milestone Celebration:** Confetti celebrations upon completing scenarios, persistent streak tracking, and personalized vocabulary bank storage.

---

## 🛠 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Router v7, Canvas Confetti |
| **Audio Pipeline** | HTML5 Web Audio API, AudioWorklet / ScriptProcessor (16-bit PCM WAV encoder) |
| **Backend** | Node.js, Express.js, TypeScript, REST Architecture, Multer |
| **Speech APIs** | Official Gnani.ai STT (`api.vachana.ai/stt/v3`) & TTS (`api.vachana.ai/api/v1/tts/inference`) |
| **Intelligence Engine**| Proprietary VAANI CORE (11 specialized TypeScript engines, 0% LLM) |
| **Database** | MongoDB & Mongoose (with local MongoDB and automated fallback resilience) |
| **Security** | Salted bcrypt (10 rounds), JSON Web Tokens (JWT), server-side secrets |
| **Testing** | Jest, Supertest, ts-jest (32 automated unit & integration tests) |

---

## 📁 Project Directory Structure

```
vaani-ai/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # AiOrb, WaveformVisualizer, AudioPlayer, Navbar, Sidebar, BottomNav
│   │   ├── contexts/           # AuthContext, ToastContext
│   │   ├── layouts/            # AppLayout (Responsive shell)
│   │   ├── pages/              # LandingPage, LoginPage, RegisterPage, DashboardPage,
│   │   │                       # AssistantPage, ConversationHistoryPage, LearnDashboardPage,
│   │   │                       # LearnLanguagesPage, LearnPracticePage, LearnProgressPage, SettingsPage
│   │   ├── services/           # ApiService (Central HTTP client)
│   │   └── utils/              # AudioRecorder (Pure Web Audio API PCM WAV encoder)
│   ├── index.html
│   └── package.json
│
├── server/                     # Backend API & VAANI CORE
│   ├── src/
│   │   ├── config/             # Environment, Database, & Gnani configuration
│   │   ├── controllers/        # Auth, Assistant, Learning, Notes, Tasks, Voice, Settings, Knowledge
│   │   ├── core/vaani/         # Proprietary VAANI CORE Intelligence Engine
│   │   │   ├── actions/        # ActionEngine (Safe math evaluator, conversions, notes & tasks dispatch)
│   │   │   ├── confidence/     # Confidence scoring & graceful fallback
│   │   │   ├── context/        # ContextManager & anaphora resolution
│   │   │   ├── entities/       # EntityExtractor (Math, units, names, notes, tasks)
│   │   │   ├── intent/         # IntentClassifier (Multilingual pattern & keyword matcher)
│   │   │   ├── knowledge/      # KnowledgeRetriever (Curated factual knowledge base)
│   │   │   ├── language/       # MultilingualProcessor (Script & transliteration handling)
│   │   │   ├── learning/       # LearningEngine (Scenario dialogue trees & grammar assessment)
│   │   │   ├── memory/         # Long-term user memories & user controls
│   │   │   ├── personality/    # Tone (Friendly, Professional, Concise, Detailed)
│   │   │   └── response/       # ResponseGenerator (Context-aware multilingual templates)
│   │   ├── middleware/         # JWT Authentication & role verification
│   │   ├── models/             # Mongoose schemas (User, Conversation, Message, Task, Note, etc.)
│   │   ├── routes/             # REST API routes
│   │   ├── services/gnani/     # Verified Gnani.ai STT & TTS service wrappers
│   │   ├── tests/              # Automated unit & integration tests (32 tests passing)
│   │   ├── seed.ts             # Curated multilingual knowledge database seeder
│   │   └── server.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (tested on Node v24).
- **MongoDB**: Local MongoDB instance running on port 27017, or a remote MongoDB Atlas URI.

### 2. Install Dependencies
In the root directory, install all workspace packages across client and server:
```bash
npm run install:all
```

### 3. Environment Configuration
Verify or copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```
Populate your `server/.env` with your secure credentials and endpoints:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/vaani_ai
JWT_SECRET=your_secure_jwt_secret_here

# Official Gnani.ai Credentials & Endpoints
GNANI_API_KEY=your_gnani_api_key_here
GNANI_STT_BASE_URL=https://api.vachana.ai/stt/v3
GNANI_TTS_BASE_URL=https://api.vachana.ai/api/v1/tts/inference

CLIENT_ORIGIN=http://localhost:5173
```

### 4. Seed the Knowledge Base
Seed the curated multilingual knowledge base into MongoDB:
```bash
npm run seed
```

### 5. Launch the Application
Run both backend and frontend concurrently in development mode:
```bash
npm run dev
```
- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

Alternatively, run them in separate terminals:
```bash
# Terminal 1: Backend Server
npm run dev:server

# Terminal 2: Frontend Client
npm run dev:client
```

---

## 🧪 Automated Testing

VAANI AI includes 32 automated unit and integration tests covering all critical paths:
```bash
npm test
```

### Verified Test Results:
```
PASS src/tests/vaaniCore.test.ts
  VAANI CORE — Intelligence Engine Tests
    1. MultilingualProcessor
      √ detects Devanagari script for Hindi text
      √ detects Gujarati script for Gujarati text
      √ detects Latin script for English text
      √ analyzes Romanized Hindi properly
      √ analyzes Romanized Gujarati properly
    2. EntityExtractor
      √ extracts math expression
      √ extracts percentage calculation
      √ extracts person name declaration
      √ extracts unit conversion parameters
      √ extracts task title
    3. IntentClassifier
      √ classifies greeting in English
      √ classifies greeting in Hindi
      √ classifies greeting in Gujarati
      √ classifies name recall intent
      √ classifies task creation
      √ classifies note creation
    4. ActionEngine (Calculator & Conversions)
      √ evaluates basic arithmetic accurately without eval
      √ evaluates percentage expressions
      √ converts distance (km to miles)
      √ converts temperature (celsius to fahrenheit)
    5. ContextManager
      √ maintains session context and resolves name recall
      √ resolves follow-up calculation with previous result
    6. LearningEngine (Scenario & Feedback)
      √ loads available scenarios for English, Hindi, and Gujarati
      √ evaluates satisfactory response with keyword alignment
      √ evaluates insufficient response and provides constructive hints

PASS src/tests/api.test.ts
  VAANI AI API Integration Tests
    √ POST /api/auth/register registers a user and returns token
    √ POST /api/auth/login logs in user
    √ GET /api/voice/config returns official supported Gnani voices
    √ POST /api/assistant/message handles calculation query
    √ POST /api/assistant/message handles context-aware name recall
    √ POST /api/tasks and GET /api/tasks manages to-do tasks
    √ GET /api/learning/scenarios returns structured modules

Test Suites: 2 passed, 2 total
Tests:       32 passed, 32 total
```

---

## 📦 Building for Production

Compile TypeScript and generate optimized production assets:
```bash
npm run build
```
Start the production server:
```bash
npm start
```

---

## 🛡 Security & Privacy Highlights

1. **Strict Zero-LLM Architecture:** Eliminates prompt injection, hallucination risks, model training on user data, and high API bills.
2. **Backend-Isolated Credentials:** Gnani API keys and JWT secrets are stored exclusively in backend environment variables.
3. **Password Protection:** Passwords are hashed with salted bcrypt (10 rounds) before persistence.
4. **Transparent Memory Controls:** Users can view, manage, and completely purge conversational context and short-term memory at any time from the Settings dashboard.
5. **No Third-Party Tracking:** Audio recordings are processed synchronously in memory and never persisted permanently without user consent.

---

## 📄 License
MIT License. Built by the VAANI AI Team.
