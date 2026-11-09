import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Mic,
  Languages,
  Bot,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Volume2,
  ShieldCheck,
  Cpu,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { AiOrb } from '../components/AiOrb';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

export const LandingPage: React.FC = () => {
  const [demoOrbState, setDemoOrbState] = useState<'idle' | 'listening' | 'speaking'>('idle');

  return (
    <div className="min-h-screen bg-[#080B16] text-[#F8FAFC] flex flex-col selection:bg-[#8B5CF6]/30 selection:text-[#22D3EE]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Ambient background glow gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#8B5CF6]/20 via-[#3B82F6]/15 to-[#22D3EE]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151D32] border border-[#27324A] text-xs font-semibold text-cyan-300 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multilingual Voice AI • 100% LLM-Free Intelligence</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
            >
              Your Voice.{' '}
              <span className="bg-gradient-to-r from-violet-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
                Your Language.
              </span>{' '}
              Your World.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto"
            >
              Meet your multilingual AI companion. Talk naturally, complete everyday tasks, and improve your language skills through intelligent voice-powered experiences in English, Hindi, and Gujarati.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white font-semibold shadow-glow-violet transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#showcase"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#151D32] hover:bg-[#1B2540] border border-[#27324A] text-slate-200 font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Explore Features
              </a>
            </motion.div>
          </div>

          {/* Interactive AI Orb Demonstration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-14 max-w-xl mx-auto rounded-3xl bg-gradient-to-b from-[#151D32]/90 to-[#10172A]/90 border border-[#27324A] p-8 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden"
          >
            <div className="absolute top-3 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#080B16] border border-[#27324A] text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interactive Preview</span>
            </div>

            <div className="my-4 flex justify-center">
              <AiOrb
                state={demoOrbState}
                volume={demoOrbState === 'listening' ? 0.6 : 0.2}
                size={180}
                onClick={() => {
                  if (demoOrbState === 'idle') setDemoOrbState('listening');
                  else if (demoOrbState === 'listening') setDemoOrbState('speaking');
                  else setDemoOrbState('idle');
                }}
              />
            </div>

            <div className="h-10 my-2 flex items-center justify-center">
              <WaveformVisualizer isActive={demoOrbState !== 'idle'} volume={0.6} />
            </div>

            <p className="text-sm font-medium text-slate-300">
              {demoOrbState === 'idle' && 'Click the orb or button below to test voice states'}
              {demoOrbState === 'listening' && 'Listening to your voice with Gnani STT...'}
              {demoOrbState === 'speaking' && 'Speaking back in natural Hindi, Gujarati, or English...'}
            </p>

            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setDemoOrbState('idle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  demoOrbState === 'idle'
                    ? 'bg-violet-600/30 border-violet-400 text-violet-300'
                    : 'bg-[#10172A] border-[#27324A] text-slate-400'
                }`}
              >
                Idle
              </button>
              <button
                onClick={() => setDemoOrbState('listening')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  demoOrbState === 'listening'
                    ? 'bg-cyan-600/30 border-cyan-400 text-cyan-300'
                    : 'bg-[#10172A] border-[#27324A] text-slate-400'
                }`}
              >
                Listening
              </button>
              <button
                onClick={() => setDemoOrbState('speaking')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  demoOrbState === 'speaking'
                    ? 'bg-purple-600/30 border-purple-400 text-purple-300'
                    : 'bg-[#10172A] border-[#27324A] text-slate-400'
                }`}
              >
                Speaking
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE: VAANI ASSISTANT & VAANI LEARN */}
      <section id="showcase" className="py-20 bg-[#10172A]/50 border-t border-b border-[#27324A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Two Powerful Products.{' '}
              <span className="text-cyan-400">One Voice Platform.</span>
            </h2>
            <p className="mt-3 text-slate-400">
              Seamlessly switch between personal voice assistance and structured language learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1: VAANI ASSISTANT */}
            <div className="rounded-3xl bg-[#151D32] border border-[#27324A] hover:border-violet-500/50 p-8 transition-all hover:shadow-glow-violet group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-glow-violet">
                  <Bot className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">VAANI ASSISTANT</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Voice-First
                  </span>
                </div>
                <p className="text-slate-300 text-base mb-6 font-medium">
                  "Your intelligent everyday voice companion."
                </p>
                <ul className="space-y-3 text-sm text-slate-400 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Calculations, unit conversions, and everyday math</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Voice-activated notes creation, search, and summaries</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>To-do task creation, status tracking, and completion</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Curated factual knowledge base & Indian history</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Context-aware memory (remembers your name & follow-ups)</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-center transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: VAANI LEARN */}
            <div className="rounded-3xl bg-[#151D32] border border-[#27324A] hover:border-cyan-500/50 p-8 transition-all hover:shadow-glow-cyan group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-6 shadow-glow-cyan">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">VAANI LEARN</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Interactive
                  </span>
                </div>
                <p className="text-slate-300 text-base mb-6 font-medium">
                  "Practise speaking, improve vocabulary, and build confidence."
                </p>
                <ul className="space-y-3 text-sm text-slate-400 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real scenario dialogue tree (restaurants, airport, jobs)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Spoken voice practice with real-time feedback</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Grammar tips, tense corrections, and vocabulary checks</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Three proficiency levels: Beginner, Intermediate, Advanced</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Daily streaks, vocabulary tracking, and milestone summaries</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-center transition-colors flex items-center justify-center gap-2"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How VAANI AI Works</h2>
            <p className="mt-3 text-slate-400">
              A 4-step voice interaction cycle engineered for speed, privacy, and precision.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Speak Naturally',
                desc: 'Click the mic and talk in English, Hindi, or Gujarati. Recorded as clean 16-bit PCM WAV audio.',
                icon: Mic,
                color: 'text-violet-400'
              },
              {
                step: '02',
                title: 'VAANI Transcribes',
                desc: 'Official Gnani.ai STT (Prisma v3.0) converts your speech to accurate text in milliseconds.',
                icon: Cpu,
                color: 'text-cyan-400'
              },
              {
                step: '03',
                title: 'CORE Processes',
                desc: 'Our proprietary VAANI CORE engine classifies intent, resolves context, and executes actions.',
                icon: Sparkles,
                color: 'text-blue-400'
              },
              {
                step: '04',
                title: 'Responds With Voice',
                desc: 'Gnani.ai Timbre v2.5 synthesizes expressive, clear voice audio in your chosen Indian dialect.',
                icon: Volume2,
                color: 'text-emerald-400'
              }
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="p-6 rounded-2xl bg-[#151D32] border border-[#27324A] relative overflow-hidden">
                  <div className="text-4xl font-black text-slate-700/40 mb-3">{s.step}</div>
                  <Icon className={`w-8 h-8 ${s.color} mb-3`} />
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SUPPORTED LANGUAGES */}
      <section id="languages" className="py-20 bg-[#10172A]/40 border-t border-[#27324A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151D32] border border-[#27324A] text-xs font-semibold text-cyan-300 mb-4">
            <Languages className="w-3.5 h-3.5" />
            <span>Multilingual First</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Supported Languages
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-12">
            Engineered with deep native support for India's major languages in both script and speech.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { code: 'en-IN', name: 'English (India)', native: 'Indian English', badge: 'Full Voice & Text' },
              { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी', badge: 'Devanagari & Roman' },
              { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી', badge: 'Gujarati Script & Roman' },
            ].map((lang) => (
              <div key={lang.code} className="p-6 rounded-2xl bg-[#151D32] border border-[#27324A] hover:border-violet-500/40 transition-colors">
                <div className="text-2xl font-bold text-white mb-1">{lang.native}</div>
                <div className="text-sm text-slate-400 mb-3">{lang.name}</div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#10172A] border border-[#27324A] text-cyan-300">
                  {lang.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-[#27324A] bg-[#080B16] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">VAANI AI</span>
            <span>•</span>
            <span>Your voice. Your language. Your world.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by Gnani.ai & VAANI CORE</span>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

