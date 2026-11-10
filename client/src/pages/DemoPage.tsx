import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Sparkles,
  Bot,
  GraduationCap,
  Languages,
  CheckCircle2,
  Award,
  ArrowRight,
  Calculator,
  CheckSquare,
  Maximize2
} from 'lucide-react';
import { AiOrb } from '../components/AiOrb';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

interface Scene {
  id: number;
  timeRange: string;
  title: string;
  subtitle: string;
  duration: number; // in seconds
}

export const DemoPage: React.FC = () => {
  const scenes: Scene[] = [
    {
      id: 1,
      timeRange: '0:00 - 0:25',
      title: 'Problem & Executive Vision',
      subtitle: 'Why 100% LLM-Free voice intelligence is essential for Indian vernacular languages.',
      duration: 25
    },
    {
      id: 2,
      timeRange: '0:25 - 1:05',
      title: 'VAANI ASSISTANT in Action',
      subtitle: 'Voice-driven math, persistent tasks, and context-aware conversational memory.',
      duration: 40
    },
    {
      id: 3,
      timeRange: '1:05 - 1:40',
      title: 'Multilingual Speech (Hindi & Gujarati)',
      subtitle: 'Authentic Indian dialect speech synthesis with Gnani Timbre v2.5.',
      duration: 35
    },
    {
      id: 4,
      timeRange: '1:40 - 2:15',
      title: 'VAANI LEARN Dialogue Engine',
      subtitle: 'Interactive real-world scenario state machine with real-time grammar feedback.',
      duration: 35
    },
    {
      id: 5,
      timeRange: '2:15 - 2:30',
      title: 'Architecture & Test Verification',
      subtitle: '32 automated tests passed, zero ongoing AI subscription costs.',
      duration: 15
    }
  ];

  const TOTAL_DURATION = 150; // 2 minutes 30 seconds

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync active scene
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < scenes.length; i++) {
      accumulated += scenes[i].duration;
      if (currentTime <= accumulated) {
        if (activeSceneIndex !== i) {
          setActiveSceneIndex(i);
          // If entering Scene 4 near completion, trigger celebratory confetti
          if (i === 3 && currentTime > accumulated - 8) {
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            } catch {}
          }
        }
        break;
      }
    }
  }, [currentTime]);

  const handleRestart = () => {
    setCurrentTime(0);
    setActiveSceneIndex(0);
    setIsPlaying(true);
  };

  const jumpToScene = (index: number) => {
    let time = 0;
    for (let i = 0; i < index; i++) {
      time += scenes[i].duration;
    }
    setCurrentTime(time);
    setActiveSceneIndex(index);
    setIsPlaying(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Video Export Functionality (Uses screen capture or canvas)
  const handleRecordVideo = async () => {
    try {
      if (isRecordingVideo) {
        mediaRecorderRef.current?.stop();
        setIsRecordingVideo(false);
        return;
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: true
      });

      videoChunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) videoChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const fullBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(fullBlob);
        setRecordedVideoUrl(url);
        setIsRecordingVideo(false);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecordingVideo(true);
      handleRestart();
    } catch (err: any) {
      console.warn('Screen recording cancelled or unsupported:', err.message);
    }
  };

  const activeScene = scenes[activeSceneIndex];

  return (
    <div className="min-h-screen bg-[#080B16] text-[#F8FAFC] flex flex-col selection:bg-[#8B5CF6]/30">
      {/* Top Bar */}
      <header className="border-b border-[#27324A] bg-[#080B16]/90 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] p-[1.5px]">
            <div className="w-full h-full bg-[#080B16] rounded-[9px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight">VAANI AI</div>
            <div className="text-[10px] text-slate-400 -mt-0.5">2.5-Minute Master Demo Video</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/assistant"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#151D32] border border-[#27324A] text-slate-300 hover:text-white transition-colors"
          >
            Live App
          </Link>
          <button
            onClick={handleRecordVideo}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              isRecordingVideo
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:opacity-90'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{isRecordingVideo ? 'Stop & Save Video' : 'Record Screen Video'}</span>
          </button>
        </div>
      </header>

      {/* Main Video Presentation Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center space-y-4">
        {/* Video Frame */}
        <div
          ref={containerRef}
          className="relative aspect-video w-full rounded-3xl bg-[#10172A] border-2 border-[#27324A] overflow-hidden shadow-2xl flex flex-col justify-between p-6 sm:p-10"
        >
          {/* Ambient Video Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-violet-600/15 via-blue-500/10 to-cyan-400/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Video Header Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151D32]/90 border border-[#27324A] text-xs font-semibold text-cyan-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Scene {activeScene.id} of 5 • {activeScene.title}</span>
            </div>

            <div className="text-xs font-mono text-slate-400 bg-[#151D32]/80 px-2.5 py-1 rounded-lg border border-[#27324A]">
              {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
            </div>
          </div>

          {/* DYNAMIC SCENE CONTENT */}
          <div className="relative z-10 my-auto text-center space-y-4 max-w-2xl mx-auto">
            {/* SCENE 1 */}
            {activeScene.id === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-glow-violet">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Why Settle For Costly, Hallucinating LLMs?
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  VAANI AI solves India's multilingual challenge through sovereign, deterministic NLP and official Gnani.ai speech intelligence. Zero token fees. Zero latency lags. 100% precision.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold border border-violet-500/30">
                    VAANI CORE Engine
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
                    Gnani Prisma & Timbre
                  </span>
                </div>
              </div>
            )}

            {/* SCENE 2 */}
            {activeScene.id === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-center">
                  <AiOrb state={currentTime % 4 === 0 ? 'speaking' : 'listening'} size={130} />
                </div>
                <div className="p-4 rounded-2xl bg-[#151D32] border border-[#27324A] text-left space-y-2 max-w-lg mx-auto shadow-lg">
                  <div className="flex items-center justify-between text-xs text-cyan-300 font-mono">
                    <span>Voice Input Recognized:</span>
                    <span>Gnani STT v3</span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    "Calculate 45 times 18, and remind me to prepare the presentation."
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#10172A] border border-[#27324A] text-xs text-slate-200 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-violet-400" />
                    <span>Calculated: 45 * 18 = <strong>810</strong></span>
                    <span className="text-slate-500">•</span>
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>Added Task: <strong>Prepare presentation</strong></span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Context Anaphora: Remembers user's identity & previous turns automatically.
                </div>
              </div>
            )}

            {/* SCENE 3 */}
            {activeScene.id === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-center gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-violet-600/30 border border-violet-400 text-violet-300 font-bold text-sm">
                    हिन्दी (Hindi)
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-cyan-600/30 border border-cyan-400 text-cyan-300 font-bold text-sm">
                    ગુજરાતી (Gujarati)
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-blue-600/30 border border-blue-400 text-blue-300 font-bold text-sm">
                    English
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Native Vernacular Voices by Gnani Timbre
                </h2>
                <div className="p-4 rounded-2xl bg-[#151D32] border border-[#27324A] max-w-md mx-auto text-sm space-y-1">
                  <div className="text-violet-300 font-bold">Deepak (Voice Model):</div>
                  <div className="text-slate-200 italic">"नमस्ते, प्रकाश संश्लेषण वह प्रक्रिया है जिससे पौधे सूर्य के प्रकाश से भोजन बनाते हैं।"</div>
                </div>
                <p className="text-xs text-slate-400">
                  Handles both native scripts and Romanized transliteration ("namaste", "kem cho").
                </p>
              </div>
            )}

            {/* SCENE 4 */}
            {activeScene.id === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center mx-auto shadow-glow-cyan font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                  VAANI LEARN — Spoken Dialogue Engine
                </h2>
                <div className="p-4 rounded-2xl bg-[#151D32] border border-[#27324A] text-left text-xs max-w-md mx-auto space-y-2">
                  <div className="text-cyan-400 font-bold uppercase">Scenario: Ordering Food at a Restaurant</div>
                  <div className="text-slate-300">Tutor: "Welcome! What would you like to drink?"</div>
                  <div className="text-violet-300 font-semibold">User: "I want cold coffee please."</div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Vocabulary & Grammar Verified: 95% Accuracy Score!</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 5 */}
            {activeScene.id === 5 && (
              <div className="space-y-4 animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto">
                  <Award className="w-7 h-7" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                  Tested. Sovereign. Production-Ready.
                </h2>
                <p className="text-sm text-slate-300 max-w-lg mx-auto">
                  All 32 automated tests passed. Zero external LLM subscription dependencies. Clean TypeScript architecture built for scale.
                </p>
                <div className="pt-2">
                  <Link
                    to="/assistant"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs shadow-glow-violet hover:opacity-90 transition-opacity"
                  >
                    <span>Try VAANI AI Live</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Timeline Indicator inside Video */}
          <div className="relative z-10 space-y-2">
            <div className="h-1.5 w-full bg-[#151D32] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{activeScene.subtitle}</span>
              <span>1080p Full HD</span>
            </div>
          </div>
        </div>

        {/* Video Control Bar */}
        <div className="p-4 rounded-2xl bg-[#151D32] border border-[#27324A] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-colors shadow-glow-violet"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={handleRestart}
              className="p-2.5 rounded-xl bg-[#10172A] border border-[#27324A] text-slate-400 hover:text-white transition-colors"
              title="Restart Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-xl bg-[#10172A] border border-[#27324A] text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Scene Jump Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {scenes.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => jumpToScene(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeSceneIndex === idx
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-[#10172A] border border-[#27324A] text-slate-400 hover:text-white'
                }`}
              >
                {s.id}. {s.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Download Recorded Video link if generated */}
          {recordedVideoUrl && (
            <a
              href={recordedVideoUrl}
              download="vaani-ai-demo-video.webm"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download MP4/WebM Video</span>
            </a>
          )}
        </div>
      </main>
    </div>
  );
};

