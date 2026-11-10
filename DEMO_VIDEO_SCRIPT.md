# VAANI AI — 2.5-Minute Official Demo Video Script & Storyboard

**Title:** VAANI AI — Your Voice. Your Language. Your World.  
**Target Duration:** 2 minutes 30 seconds (150 seconds)  
**Aspect Ratio:** 16:9 (1920x1080 Full HD)  
**Audio:** Voiceover (Clear, energetic, conversational tone) with subtle background tech ambient music (20% volume).

---

## 🎬 Scene-by-Scene Timeline & Storyboard

### SCENE 1: The Hook & The Core Problem (0:00 – 0:25)
- **Visual on Screen:** 
  - Open on the **VAANI AI Landing Page** (`http://localhost:5173/`).
  - Smooth pan down the futuristic dark navy `#080B16` interface.
  - Hover over the central animated AI Orb pulsing with cyan and violet lightwaves.
- **On-Screen Text Overlay:** 
  *"VAANI AI — Multilingual Voice Intelligence. 100% LLM-Free."*
- **Voiceover (Narration):**
  > *"Every modern voice assistant today relies on expensive cloud LLMs that hallucinate facts, drain API budgets, and fail on India's vernacular nuances. What if you could have a fast, context-aware multilingual voice assistant and spoken language tutor with ZERO external LLM dependencies? Welcome to VAANI AI — Your voice. Your language. Your world."*

---

### SCENE 2: VAANI ASSISTANT — Voice Interaction & Action Engine (0:25 – 1:05)
- **Visual on Screen:**
  - Click **"Launch Assistant"** to navigate to `/assistant`.
  - Click the large glowing microphone button. The AI Orb instantly transitions to `listening` (cyan glow) with the live waveform reacting in real-time.
  - **Spoken input:** *"Calculate 45 times 18, and remind me to prepare the presentation."*
  - The Orb transitions to `processing`, calls **Gnani.ai STT (Prisma v3.0)**, passes text to **VAANI CORE**, and speaks back via **Gnani Timbre v2.5**.
  - Show the response bubble appear with an intent badge `Calculation` & `Task Creation`, displaying: `45 * 18 = 810` and task card `Added task: Prepare the presentation`.
  - Next, demonstrate context resolution: User types or speaks: *"What is my name?"*
  - VAANI replies instantly with context memory: *"Your name is Rahul Sharma! I remember our previous conversation."*
- **Voiceover (Narration):**
  > *"VAANI Assistant combines pure client-side 16-bit PCM WAV encoding with official Gnani.ai speech inference. Our in-house VAANI CORE engine parses entities, executes mathematical equations safely without dangerous eval, and creates real persistent tasks in MongoDB — all while maintaining conversation context across turns."*

---

### SCENE 3: Native Multilingual Speech (Hindi & Gujarati) (1:05 – 1:40)
- **Visual on Screen:**
  - Click the language selector dropdown in the top bar. Switch from **English** to **हिन्दी (Hindi)**.
  - Switch voice model from **Nalini** to **Deepak**.
  - Click the microphone and speak in Hindi: *"नमस्ते, प्रकाश संश्लेषण क्या है?"*
  - Watch the transcript populate in native Devanagari script.
  - VAANI CORE queries the curated factual knowledge base and Deepak's voice speaks the Hindi explanation clearly.
  - Switch language to **ગુજરાતી (Gujarati)** and show instant greeting: *"નમસ્તે! વાણી એઆઈ માં તમારું સ્વાગત છે."*
- **Voiceover (Narration):**
  > *"VAANI AI is built vernacular-first. It natively understands and speaks English, Hindi, and Gujarati with both Devanagari and Gujarati scripts as well as Romanized transliterations. Audio is rendered through Gnani's expressive Timbre v2.5 voices like Nalini and Deepak, with instant replay and variable playback speeds."*

---

### SCENE 4: VAANI LEARN — Interactive Spoken Language Tutor (1:40 – 2:15)
- **Visual on Screen:**
  - Navigate to **VAANI LEARN** (`/learn`).
  - Show the streak counter (Flame icon), target proficiency level, and category filters (*Everyday Conversations*, *Interview Prep*, *Travel*, *Grammar*).
  - Select scenario: **"Ordering Food at a Restaurant"** and click **Start Practice**.
  - Screen opens the interactive dialogue tree.
  - AI Tutor speaks: *"Welcome to Cafe Delight! What would you like to drink to start?"*
  - Click mic and say: *"I want cold coffee please."*
  - Show real-time feedback banner: *"Great response! Relevant vocabulary detected: coffee, please."*
  - Show the progress bar move from Step 1 to Step 2.
  - Demonstrate finishing the scenario: Confetti bursts across the screen, displaying the final accuracy score (95%), vocabulary bank collected, and constructive grammar pointers.
- **Voiceover (Narration):**
  > *"Equally powerful is VAANI Learn. Unlike traditional apps with flashcards, VAANI Learn immerses you in real-world dialogue state machines. The AI tutor speaks prompts aloud, listens to your spoken answer, checks vocabulary alignment, and offers instant grammar corrections. And we are transparent: we verify recognized speech without fabricating fake phonetic scores."*

---

### SCENE 5: Architecture, Test Verification & Call to Action (2:15 – 2:30)
- **Visual on Screen:**
  - Quick split-screen or cut to the terminal showing all **32 automated tests passing** (`npm test`).
  - Return to the Settings & Dashboard showing real statistics (zero fake metrics, persistent database records).
  - Fade to closing logo with the tagline: *"VAANI AI — Your Voice. Your Language. Your World."*
- **Voiceover (Narration):**
  > *"Backed by 32 automated tests, zero LLM subscription overhead, and enterprise Gnani.ai speech intelligence, VAANI AI delivers the future of Indian voice experiences today. Thank you!"*

---

## 🎙 Recording Tips for Video Creators
1. **Resolution:** Record your browser in Full HD (1920x1080) at 100% zoom.
2. **Audio Levels:** Keep microphone input clear and normalized (-6dB to -3dB peak).
3. **Pacing:** Let the Gnani TTS audio clips play for 2-3 seconds so viewers can hear the authentic voice synthesis.
4. **Interactive Walkthrough Tool:** You can also run the built-in automated demo player at `/demo` or open `vaani_demo_player.html` to run this exact 2.5-minute presentation automatically!

