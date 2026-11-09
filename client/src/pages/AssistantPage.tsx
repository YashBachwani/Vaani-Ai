import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';
import { AudioRecorder } from '../utils/audioRecorder';
import { AiOrb, OrbState } from '../components/AiOrb';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import { AudioPlayer } from '../components/AudioPlayer';
import {
  Mic,
  MicOff,
  Send,
  Trash2,
  Languages,
  Volume2,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Calculator,
  FileText,
  CheckSquare,
  BookOpen,
  RotateCcw,
  Loader2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language?: string;
  intent?: string;
  confidence?: number;
  timestamp: string | Date;
  actionResult?: any;
  knowledgeMatch?: any;
  suggestedFollowUps?: string[];
  audioUrl?: string | null;
}

export const AssistantPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Assistant State Machine
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Ready to listen. Click microphone or type.');
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  // Conversation Data
  const [conversationId, setConversationId] = useState<string | null>(searchParams.get('conversationId'));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Language & Voice Settings
  const [selectedLanguage, setSelectedLanguage] = useState<string>(user?.preferredLanguage || 'en-IN');
  const [selectedVoice, setSelectedVoice] = useState<string>(user?.preferredVoice || 'Nalini');

  // Audio & Hardware Refs
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load existing conversation messages if conversationId is provided in URL
  useEffect(() => {
    async function loadConversation(id: string) {
      try {
        const res = await api.getConversationById(id);
        if (res.conversation) {
          setSelectedLanguage(res.conversation.language || 'en-IN');
        }
        if (res.messages) {
          const formatted = res.messages.map((m: any) => ({
            id: m._id,
            role: m.role,
            content: m.content,
            language: m.language,
            intent: m.intent,
            confidence: m.confidence,
            timestamp: m.timestamp,
            actionResult: m.metadata?.actionResult,
            knowledgeMatch: m.metadata?.knowledgeMatch,
            suggestedFollowUps: m.metadata?.suggestedFollowUps,
            audioUrl: null // Previous historical turn audio not cached in DB
          }));
          setMessages(formatted);
        }
      } catch (err: any) {
        showToast('Could not load existing conversation.', 'error');
      }
    }

    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, orbState]);

  // Handle Recording Start / Stop
  const startRecording = async () => {
    try {
      if (isRecording) {
        await stopRecording();
        return;
      }

      setOrbState('listening');
      setStatusMessage('Listening to your voice... (click again to finish)');
      setMicVolume(0);
      setRecordingSeconds(0);

      audioRecorderRef.current = new AudioRecorder({
        onAudioData: (vol) => {
          setMicVolume(vol);
        }
      });

      await audioRecorderRef.current.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 29) {
            // Auto stop at 30 seconds (Gnani short clip limit)
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      setOrbState('error');
      setStatusMessage('Microphone access denied or error occurred.');
      showToast(err.message, 'error');
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const stopRecording = async () => {
    if (!audioRecorderRef.current || !isRecording) return;

    try {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
      setOrbState('processing');
      setStatusMessage('Transcribing speech with Gnani.ai...');
      setIsProcessing(true);

      const { blob } = await audioRecorderRef.current.stop();

      if (blob.size < 1000) {
        showToast('Audio clip was too short. Please speak clearly.', 'info');
        setOrbState('idle');
        setStatusMessage('Ready to listen.');
        setIsProcessing(false);
        return;
      }

      setStatusMessage('Understanding request with VAANI CORE...');

      // Prepare FormData payload for backend
      const formData = new FormData();
      formData.append('audio', blob, 'user_speech.wav');
      formData.append('language', selectedLanguage);
      if (conversationId) {
        formData.append('conversationId', conversationId);
      }

      const res = await api.sendAssistantVoice(formData);

      if (!conversationId && res.conversationId) {
        setConversationId(res.conversationId);
        setSearchParams({ conversationId: res.conversationId });
      }

      // Add messages to state
      setMessages((prev) => [
        ...prev,
        {
          id: res.userMessage.id,
          role: 'user',
          content: res.userMessage.content,
          timestamp: res.userMessage.timestamp
        },
        {
          id: res.assistantMessage.id,
          role: 'assistant',
          content: res.assistantMessage.content,
          language: res.assistantMessage.language,
          intent: res.assistantMessage.intent,
          confidence: res.assistantMessage.confidence,
          timestamp: res.assistantMessage.timestamp,
          actionResult: res.assistantMessage.actionResult,
          knowledgeMatch: res.assistantMessage.knowledgeMatch,
          suggestedFollowUps: res.assistantMessage.suggestedFollowUps,
          audioUrl: res.assistantMessage.audioUrl
        }
      ]);

      if (res.assistantMessage.audioUrl) {
        setOrbState('speaking');
        setStatusMessage('Speaking response...');
      } else {
        setOrbState('idle');
        setStatusMessage('Response ready.');
      }
    } catch (err: any) {
      console.error('[Recording Error]', err);
      setOrbState('error');
      setStatusMessage('Failed to transcribe or process voice.');
      showToast(err.message || 'Speech recognition failed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Text Submission
  const handleSendText = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isProcessing) return;

    try {
      setIsProcessing(true);
      setInputText('');
      setOrbState('processing');
      setStatusMessage('Processing request with VAANI CORE...');

      const tempUserMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: textToSend.trim(),
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      const res = await api.sendAssistantMessage({
        text: textToSend.trim(),
        conversationId: conversationId || undefined,
        language: selectedLanguage,
        generateVoice: true
      });

      if (!conversationId && res.conversationId) {
        setConversationId(res.conversationId);
        setSearchParams({ conversationId: res.conversationId });
      }

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        {
          id: res.userMessage.id,
          role: 'user',
          content: res.userMessage.content,
          timestamp: res.userMessage.timestamp
        },
        {
          id: res.assistantMessage.id,
          role: 'assistant',
          content: res.assistantMessage.content,
          language: res.assistantMessage.language,
          intent: res.assistantMessage.intent,
          confidence: res.assistantMessage.confidence,
          timestamp: res.assistantMessage.timestamp,
          actionResult: res.assistantMessage.actionResult,
          knowledgeMatch: res.assistantMessage.knowledgeMatch,
          suggestedFollowUps: res.assistantMessage.suggestedFollowUps,
          audioUrl: res.assistantMessage.audioUrl
        }
      ]);

      if (res.assistantMessage.audioUrl) {
        setOrbState('speaking');
        setStatusMessage('Speaking response...');
      } else {
        setOrbState('idle');
        setStatusMessage('Response ready.');
      }
    } catch (err: any) {
      setOrbState('error');
      setStatusMessage('Error executing request.');
      showToast(err.message || 'Failed to send message.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setConversationId(null);
    setSearchParams({});
    setOrbState('idle');
    setStatusMessage('Conversation cleared. Ready for your voice.');
    showToast('Conversation cleared.', 'info');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#151D32] border border-[#27324A] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600/30 border border-violet-400/40 flex items-center justify-center text-violet-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>VAANI ASSISTANT</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                100% LLM-Free
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              {statusMessage}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-[#10172A] border border-[#27324A] rounded-xl px-2 py-1 text-xs text-slate-300">
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="en-IN" className="bg-[#10172A]">English (India)</option>
              <option value="hi-IN" className="bg-[#10172A]">हिन्दी (Hindi)</option>
              <option value="gu-IN" className="bg-[#10172A]">ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          {/* Voice Selector */}
          <div className="flex items-center gap-1 bg-[#10172A] border border-[#27324A] rounded-xl px-2 py-1 text-xs text-slate-300">
            <Volume2 className="w-3.5 h-3.5 text-violet-400" />
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="Nalini" className="bg-[#10172A]">Nalini (Warm)</option>
              <option value="Kaveri" className="bg-[#10172A]">Kaveri (Gentle)</option>
              <option value="Deepak" className="bg-[#10172A]">Deepak (Clear)</option>
            </select>
          </div>

          {/* Clear conversation button */}
          {messages.length > 0 && (
            <button
              onClick={handleClearConversation}
              className="p-2 rounded-xl bg-[#10172A] hover:bg-rose-500/10 border border-[#27324A] hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stage: AI Orb + Chat Transcript */}
      <div className="flex-1 min-h-0 flex flex-col rounded-3xl bg-[#10172A]/70 border border-[#27324A] backdrop-blur-md overflow-hidden relative shadow-2xl">
        {/* Animated AI Orb Hero Header when conversation is fresh */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <AiOrb
              state={orbState}
              volume={micVolume}
              size={180}
              onClick={startRecording}
            />

            <div className="max-w-md space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                "What can I help you with today?"
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Tap the microphone to speak, or type a request below. Try asking a calculation, creating a note or task, or practicing languages.
              </p>
            </div>

            <WaveformVisualizer isActive={isRecording || orbState === 'speaking'} volume={micVolume} />

            {/* Quick Starter Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
              {[
                'What is 45 * 18?',
                'Add task: Finish project presentation',
                'Take a note: Meeting tomorrow at 4pm',
                'मेरा नाम क्या है?',
                'Explain photosynthesis'
              ].map((starter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendText(starter)}
                  className="px-3 py-1.5 rounded-full bg-[#151D32] hover:bg-[#1B2540] border border-[#27324A] hover:border-cyan-400/50 text-xs text-slate-300 transition-colors"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Conversation Transcript View */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Compact Animated Orb Pill while chatting */}
            <div className="sticky top-0 z-20 flex items-center justify-center py-2 pointer-events-none">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#151D32]/90 border border-[#27324A] backdrop-blur-md shadow-lg pointer-events-auto">
                <AiOrb state={orbState} volume={micVolume} size={32} />
                <span className="text-xs font-semibold text-slate-300">
                  {orbState === 'listening' ? 'Listening...' : orbState === 'speaking' ? 'Speaking...' : orbState === 'processing' ? 'Processing...' : 'VAANI Active'}
                </span>
                {(isRecording || orbState === 'speaking') && (
                  <div className="w-16">
                    <WaveformVisualizer isActive={true} volume={micVolume} barCount={12} height={20} />
                  </div>
                )}
              </div>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-glow-violet">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-xl space-y-2`}>
                  {/* Speech Bubble */}
                  <div
                    className={`p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                        : 'bg-[#151D32] text-slate-100 border border-[#27324A] rounded-tl-none shadow-md'
                    }`}
                  >
                    {/* Header intent badge for assistant */}
                    {msg.role === 'assistant' && msg.intent && (
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#27324A]">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-400">
                          {msg.intent.replace(/_/g, ' ')}
                        </span>
                        {msg.confidence && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {Math.round(msg.confidence * 100)}% Match
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>

                    {/* Action Result Embedded Card */}
                    {msg.actionResult && (
                      <div className="mt-3 p-3 rounded-xl bg-[#10172A] border border-[#27324A] text-xs space-y-1">
                        <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                          {msg.intent === 'calculation' && <Calculator className="w-3.5 h-3.5" />}
                          {msg.intent?.includes('task') && <CheckSquare className="w-3.5 h-3.5" />}
                          {msg.intent?.includes('note') && <FileText className="w-3.5 h-3.5" />}
                          <span>Action Result</span>
                        </div>
                        <div className="text-slate-300 font-mono text-[11px]">
                          {msg.actionResult.message}
                        </div>
                      </div>
                    )}

                    {/* Knowledge Citation Card */}
                    {msg.knowledgeMatch && (
                      <div className="mt-3 p-2.5 rounded-xl bg-[#10172A] border border-[#27324A] text-[11px] text-slate-400 flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span>Source: {msg.knowledgeMatch.source}</span>
                      </div>
                    )}
                  </div>

                  {/* Audio Player for Assistant Speech */}
                  {msg.role === 'assistant' && msg.audioUrl && (
                    <div className="pt-1">
                      <AudioPlayer
                        audioUrl={msg.audioUrl}
                        autoPlay={msg.id === messages[messages.length - 1]?.id}
                        onPlayStateChange={(playing) => {
                          setOrbState(playing ? 'speaking' : 'idle');
                        }}
                      />
                    </div>
                  )}

                  {/* Suggested Follow-Ups */}
                  {msg.role === 'assistant' && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedFollowUps.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendText(suggestion)}
                          className="px-2.5 py-1 rounded-full bg-[#151D32] hover:bg-[#1B2540] border border-[#27324A] hover:border-cyan-400 text-[11px] text-slate-300 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Bottom Input Area */}
        <div className="p-3 sm:p-4 bg-[#151D32] border-t border-[#27324A]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendText();
            }}
            className="flex items-center gap-2 sm:gap-3"
          >
            {/* Primary Microphone Action Button */}
            <button
              type="button"
              onClick={startRecording}
              disabled={isProcessing}
              className={`relative flex items-center justify-center shrink-0 w-12 h-12 rounded-2xl transition-all shadow-lg min-w-[48px] min-h-[48px] ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_25px_rgba(244,63,94,0.6)]'
                  : 'bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white shadow-glow-violet'
              }`}
              title={isRecording ? 'Click to finish recording' : 'Click to speak'}
              aria-label="Microphone"
            >
              {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              {isRecording && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-rose-600 text-[9px] font-mono font-bold text-white">
                  {recordingSeconds}s
                </span>
              )}
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isRecording
                    ? 'Listening... speak into your microphone'
                    : `Ask in ${selectedLanguage === 'hi-IN' ? 'Hindi' : selectedLanguage === 'gu-IN' ? 'Gujarati' : 'English'}...`
                }
                disabled={isRecording || isProcessing}
                className="w-full py-3.5 pl-4 pr-12 rounded-2xl bg-[#10172A] border border-[#27324A] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-transparent text-white disabled:text-slate-600 transition-colors"
                aria-label="Send message"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

