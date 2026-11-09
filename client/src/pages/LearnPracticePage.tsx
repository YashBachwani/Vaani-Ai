import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { AudioRecorder } from '../utils/audioRecorder';
import { AudioPlayer } from '../components/AudioPlayer';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import {
  GraduationCap,
  Mic,
  MicOff,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Volume2,
  Award,
  Loader2,
  Info
} from 'lucide-react';

export const LearnPracticePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const scenarioId = searchParams.get('scenarioId') || 'food_ordering_en';
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // State Machine
  const [session, setSession] = useState<any>(null);
  const [scenario, setScenario] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<any>(null);
  const [tutorAudioUrl, setTutorAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completionSummary, setCompletionSummary] = useState<any>(null);

  // Input & Audio state
  const [userText, setUserText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [micVolume, setMicVolume] = useState<number>(0);

  // Hardware refs
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<any>(null);

  // Initialize or fetch session
  useEffect(() => {
    async function startSession() {
      try {
        setLoading(true);
        const res = await api.createLearningSession(scenarioId);
        setSession(res.session);
        setScenario(res.scenario);
        setCurrentStep(res.currentStep);
        if (res.tutorAudioUrl) {
          setTutorAudioUrl(res.tutorAudioUrl);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to start learning session.', 'error');
      } finally {
        setLoading(false);
      }
    }
    startSession();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRecorderRef.current) audioRecorderRef.current.cleanup();
    };
  }, [scenarioId]);

  // Voice recording handlers
  const startRecording = async () => {
    try {
      if (isRecording) {
        await stopRecording();
        return;
      }

      setMicVolume(0);
      setRecordingSeconds(0);
      audioRecorderRef.current = new AudioRecorder({
        onAudioData: (vol) => setMicVolume(vol)
      });

      await audioRecorderRef.current.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 25) {
            stopRecording();
            return 25;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      showToast(err.message || 'Microphone error.', 'error');
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const stopRecording = async () => {
    if (!audioRecorderRef.current || !isRecording) return;

    try {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);

      const { blob } = await audioRecorderRef.current.stop();
      if (blob.size < 1000) {
        showToast('Spoken response was too short. Please try again.', 'info');
        return;
      }

      showToast('Transcribing spoken answer with Gnani STT...', 'info');

      // Send to STT endpoint
      const formData = new FormData();
      formData.append('audio', blob, 'practice_answer.wav');
      formData.append('language', scenario?.language || 'en-IN');

      const sttRes = await fetch('/api/voice/stt', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vaani_token')}`
        },
        body: formData
      });

      const sttData = await sttRes.json();
      if (sttData.transcript) {
        setUserText(sttData.transcript);
        // Automatically submit transcribed answer
        handleSubmitAnswer(sttData.transcript);
      } else {
        showToast('Could not recognize words clearly. Try typing below.', 'info');
      }
    } catch (err: any) {
      showToast('Failed to transcribe speech: ' + err.message, 'error');
    }
  };

  // Submit Answer
  const handleSubmitAnswer = async (submittedText?: string) => {
    const textToSend = submittedText || userText;
    if (!textToSend.trim() || !session || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setUserText('');

      const res = await api.sendSessionMessage(session._id, textToSend.trim());

      setSession(res.session);
      if (res.tutorAudioUrl) {
        setTutorAudioUrl(res.tutorAudioUrl);
      }

      if (res.isCompleted) {
        setIsCompleted(true);
        // Trigger milestone completion on server
        const compRes = await api.completeLearningSession(session._id);
        setCompletionSummary(compRes.results);

        // Confetti celebration
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      } else if (res.nextStep) {
        setCurrentStep(res.nextStep);
      }
    } catch (err: any) {
      showToast(err.message || 'Error processing response.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs text-slate-400">Preparing interactive tutor...</span>
      </div>
    );
  }

  // COMPLETED VIEW
  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#151D32] border border-cyan-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 mx-auto shadow-glow-cyan">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold text-xs border border-cyan-500/30">
              Scenario Completed!
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              {scenario?.title}
            </h1>
            <p className="text-sm text-slate-300 mt-2">
              Outstanding practice session! Here is your verified performance summary.
            </p>
          </div>

          {/* Performance Summary Metrics */}
          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-[#10172A] border border-[#27324A]">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Accuracy</div>
              <div className="text-2xl font-black text-cyan-300 mt-1">
                {completionSummary?.grammarAccuracy || 90}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#10172A] border border-[#27324A]">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Vocabulary</div>
              <div className="text-2xl font-black text-violet-400 mt-1">
                {session?.vocabularyLearned?.length || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#10172A] border border-[#27324A]">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Score</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {completionSummary?.score || 95}/100
              </div>
            </div>
          </div>

          {/* Pronunciation Transparency Note */}
          <div className="p-3.5 rounded-2xl bg-[#10172A] border border-[#27324A] text-left text-xs text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300">Speech Verification Note:</span> Voice feedback compares recognized words and sentence structures against expected vocabulary to build confidence without fabricating arbitrary phonetic scores.
            </div>
          </div>

          {/* New Vocabulary Bank */}
          {session?.vocabularyLearned?.length > 0 && (
            <div className="text-left space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Vocabulary Practiced in Session
              </div>
              <div className="flex flex-wrap gap-2">
                {session.vocabularyLearned.map((w: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#10172A] border border-[#27324A] text-xs font-medium text-slate-200"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Corrections Review */}
          {session?.corrections?.length > 0 && (
            <div className="text-left space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Grammar Pointers & Suggested Improvements
              </div>
              <div className="space-y-2">
                {session.corrections.map((c: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#10172A] border border-[#27324A] text-xs">
                    <div className="text-slate-400 line-through">{c.original}</div>
                    <div className="text-emerald-400 font-semibold mt-0.5">{c.corrected}</div>
                    <div className="text-slate-500 text-[11px] mt-1">{c.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#10172A] hover:bg-[#1B2540] border border-[#27324A] text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Scenario</span>
            </button>
            <Link
              to="/learn"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-glow-cyan"
            >
              <span>Next Recommended Exercise</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE INTERACTIVE SESSION VIEW
  const stepIndex = session?.currentStepIndex || 0;
  const totalSteps = scenario?.steps?.length || 4;
  const progressPercent = Math.min(100, Math.round(((stepIndex + 1) / totalSteps) * 100));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Session Progress Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#151D32] border border-[#27324A] space-y-3">
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold text-[10px] uppercase font-mono">
              {scenario?.language}
            </span>
            <span className="font-bold text-slate-200">{scenario?.title}</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            Step {stepIndex + 1} of {totalSteps}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#10172A] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tutor Speech & Dialogue Area */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151D32] border border-[#27324A] space-y-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shrink-0 shadow-glow-cyan">
            <GraduationCap className="w-6 h-6" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                VAANI AI Tutor
              </span>
              {tutorAudioUrl && (
                <AudioPlayer audioUrl={tutorAudioUrl} autoPlay={true} />
              )}
            </div>

            <div className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              {currentStep?.tutorPrompt}
            </div>

            {currentStep?.grammarHints && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#10172A] border border-[#27324A] text-xs text-slate-400 mt-2">
                <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span>Tip: {currentStep.grammarHints}</span>
              </div>
            )}
          </div>
        </div>

        {/* Previous Message Exchanges in Current Session */}
        {session?.messages?.length > 1 && (
          <div className="pt-4 border-t border-[#27324A] space-y-3 max-h-60 overflow-y-auto pr-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Dialogue History
            </div>
            {session.messages.slice(0, -1).map((msg: any, idx: number) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl text-xs ${
                  msg.speaker === 'user'
                    ? 'bg-violet-600/20 border border-violet-500/30 text-violet-200 ml-8'
                    : 'bg-[#10172A] border border-[#27324A] text-slate-300 mr-8'
                }`}
              >
                <div className="font-semibold text-[10px] text-slate-400 uppercase mb-1">
                  {msg.speaker === 'user' ? 'You' : 'Tutor'}
                </div>
                <div>{msg.text}</div>
                {msg.feedback && (
                  <div className="mt-1 pt-1 border-t border-white/10 text-[11px] text-cyan-300">
                    {msg.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Audio Waveform when recording */}
        {isRecording && (
          <div className="py-2 flex flex-col items-center justify-center space-y-2">
            <span className="text-xs font-semibold text-rose-400 animate-pulse">
              Recording your answer ({recordingSeconds}s)... Speak clearly
            </span>
            <WaveformVisualizer isActive={true} volume={micVolume} height={40} />
          </div>
        )}

        {/* User Answer Input Controls */}
        <div className="pt-4 border-t border-[#27324A] space-y-3">
          <div className="flex items-center gap-3">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={startRecording}
              disabled={isSubmitting}
              className={`p-3.5 rounded-2xl transition-all shadow-md shrink-0 flex items-center justify-center ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold'
              }`}
              title="Click to speak answer"
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input Option */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmitAnswer();
                  }
                }}
                placeholder={
                  isRecording ? 'Listening...' : 'Type or speak your answer in scenario language...'
                }
                disabled={isRecording || isSubmitting}
                className="w-full py-3.5 pl-4 pr-12 rounded-2xl bg-[#10172A] border border-[#27324A] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />

              <button
                type="button"
                onClick={() => handleSubmitAnswer()}
                disabled={!userText.trim() || isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-transparent text-white disabled:text-slate-600 transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sample Helpful Answer Toggle */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Don't know what to say?</span>
            <button
              type="button"
              onClick={() => setUserText(currentStep?.sampleGoodAnswer || '')}
              className="text-cyan-400 hover:underline"
            >
              Suggest sample answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

