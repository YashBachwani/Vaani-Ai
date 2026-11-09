import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import {
  TrendingUp,
  Flame,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  Loader2
} from 'lucide-react';

export const LearnProgressPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        const res = await api.getLearningProgress();
        setProfile(res.profile);
        setProgress(res.progress);
        setRecentSessions(res.recentSessions || []);
      } catch (err: any) {
        showToast('Failed to load progress statistics.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs text-slate-400">Loading progress...</span>
      </div>
    );
  }

  const vocabList: string[] = progress?.vocabularyLearned || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Learning Progress</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your language milestones, active streak, and vocabulary acquisition.
          </p>
        </div>

        <Link
          to="/learn"
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors self-start sm:self-auto shadow-md"
        >
          Practice More Scenarios
        </Link>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#151D32] border border-[#27324A]">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase">Streak</span>
          </div>
          <div className="text-2xl font-black text-white">{profile?.currentStreak || 0} Days</div>
          <div className="text-[10px] text-slate-400 mt-1">Consecutive activity</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151D32] border border-[#27324A]">
          <div className="flex items-center gap-2 text-violet-400 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase">Sessions</span>
          </div>
          <div className="text-2xl font-black text-white">{progress?.completedSessions || 0}</div>
          <div className="text-[10px] text-slate-400 mt-1">Completed scenarios</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151D32] border border-[#27324A]">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <BookOpen className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase">Vocabulary</span>
          </div>
          <div className="text-2xl font-black text-white">{vocabList.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Words in bank</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151D32] border border-[#27324A]">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <GraduationCap className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase">Target</span>
          </div>
          <div className="text-xl font-bold text-white capitalize truncate">
            {profile?.proficiencyLevel || 'Beginner'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Current level</div>
        </div>
      </div>

      {/* Vocabulary Bank */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151D32] border border-[#27324A] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">Your Vocabulary Bank</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">{vocabList.length} words</span>
        </div>

        {vocabList.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {vocabList.map((word, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-[#10172A] border border-[#27324A] text-xs font-semibold text-slate-200 hover:border-cyan-400/50 transition-colors"
              >
                {word}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4">
            No vocabulary items collected yet. Start practice sessions in VAANI Learn to build your custom word bank!
          </p>
        )}
      </div>

      {/* Recent Learning Sessions History */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151D32] border border-[#27324A] space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-violet-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Recent Completed Sessions</h2>
        </div>

        {recentSessions.length > 0 ? (
          <div className="space-y-3 pt-2">
            {recentSessions.map((session) => (
              <div
                key={session._id}
                className="p-4 rounded-2xl bg-[#10172A] border border-[#27324A] flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200 truncate">
                      {session.scenarioTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      {session.language}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Level: {session.level}</span>
                    {session.results?.score && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">{session.results.score}% Accuracy</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4">
            No past sessions recorded yet.
          </p>
        )}
      </div>
    </div>
  );
};

