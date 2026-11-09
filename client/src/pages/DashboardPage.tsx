import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import {
  Bot,
  GraduationCap,
  History,
  MessageSquare,
  Sparkles,
  Flame,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Clock,
  Award,
  Mic
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [learningProfile, setLearningProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [settingsRes, convsRes, progRes] = await Promise.all([
          api.getSettings().catch(() => ({ stats: {} })),
          api.getConversations(1, 4).catch(() => ({ conversations: [] })),
          api.getLearningProgress().catch(() => ({ profile: null, progress: null, recentSessions: [] }))
        ]);

        setStats(settingsRes.stats || {});
        setRecentConversations(convsRes.conversations || []);
        setLearningProfile(progRes.profile);
        setRecentSessions(progRes.recentSessions || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#151D32] via-[#10172A] to-[#151D32] border border-[#27324A] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10172A] border border-[#27324A] text-xs text-cyan-400 font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VAANI Voice & Learning Platform</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {getGreeting()}, {user?.name || 'Explorer'}!
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
              Your voice companion is ready. Speak in{' '}
              <span className="text-cyan-400 font-semibold">
                {user?.preferredLanguage === 'hi-IN' ? 'Hindi' : user?.preferredLanguage === 'gu-IN' ? 'Gujarati' : 'English'}
              </span>{' '}
              with voice model <span className="text-violet-400 font-semibold">{user?.preferredVoice || 'Nalini'}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/assistant"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white font-semibold text-sm shadow-glow-violet transition-all flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Start Conversation</span>
            </Link>
            <Link
              to="/learn"
              className="px-5 py-3 rounded-2xl bg-[#1B2540] hover:bg-[#223055] border border-[#27324A] text-cyan-300 font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Practise Language</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            label: 'Voice Interactions',
            value: stats?.voiceUsageCount ?? 0,
            icon: Mic,
            color: 'text-violet-400',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/20'
          },
          {
            label: 'Learning Streak',
            value: `${learningProfile?.currentStreak || 0} Days`,
            icon: Flame,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
          },
          {
            label: 'Vocabulary Learned',
            value: stats?.vocabularyCount ?? 0,
            icon: BookOpen,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/20'
          },
          {
            label: 'Completed Sessions',
            value: stats?.completedSessions ?? 0,
            icon: Award,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-[#151D32] border ${item.border} flex items-center gap-4`}
            >
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{item.value}</div>
                <div className="text-xs text-slate-400 font-medium">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two Columns: Recent Assistant Conversations & Recent Learn Sessions */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* VAANI Assistant Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-bold text-slate-100">Recent Conversations</h2>
            </div>
            <Link
              to="/assistant/history"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentConversations.length > 0 ? (
              recentConversations.map((conv) => (
                <Link
                  key={conv._id}
                  to={`/assistant?conversationId=${conv._id}`}
                  className="block p-4 rounded-2xl bg-[#151D32] hover:bg-[#1B2540] border border-[#27324A] hover:border-violet-500/40 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                        {conv.title}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(conv.lastMessageAt || conv.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#10172A] border border-[#27324A] text-[10px] uppercase font-mono text-cyan-300">
                          {conv.language || 'en-IN'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-[#151D32] border border-[#27324A] text-center space-y-3">
                <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="text-sm font-semibold text-slate-300">No conversations yet</div>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click the microphone or type a question to start your first chat with VAANI Assistant.
                </p>
                <Link
                  to="/assistant"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Start First Conversation</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* VAANI Learn Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-100">Learning Activity</h2>
            </div>
            <Link
              to="/learn/progress"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View Progress</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <div
                  key={session._id}
                  className="p-4 rounded-2xl bg-[#151D32] border border-[#27324A] flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-200 truncate">
                        {session.scenarioTitle}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span>Level: {session.level}</span>
                      <span>•</span>
                      <span>Vocab: {session.vocabularyLearned?.length || 0}</span>
                      {session.results?.score && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400 font-semibold">{session.results.score}% Score</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Link
                    to="/learn"
                    className="p-2 rounded-xl bg-[#10172A] border border-[#27324A] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-colors shrink-0"
                    title="Practice more"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-[#151D32] border border-[#27324A] text-center space-y-3">
                <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="text-sm font-semibold text-slate-300">No practice sessions yet</div>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Practice spoken Hindi, Gujarati, or English in realistic real-world scenarios.
                </p>
                <Link
                  to="/learn"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Choose First Scenario</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

