import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import {
  GraduationCap,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Languages,
  Coffee,
  Briefcase,
  Plane,
  CheckCircle2,
  Sparkles,
  Sliders,
  Loader2
} from 'lucide-react';

export const LearnDashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadLearnData() {
      try {
        setLoading(true);
        const [profileRes, scenariosRes] = await Promise.all([
          api.getLearningProfile(),
          api.getLearningScenarios()
        ]);
        setProfile(profileRes);
        setScenarios(scenariosRes.scenarios || []);
      } catch (err: any) {
        showToast('Failed to load learning modules.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadLearnData();
  }, []);

  const categories = [
    { id: 'all', label: 'All Modules', icon: Sparkles },
    { id: 'everyday', label: 'Everyday Conversations', icon: Coffee },
    { id: 'interview', label: 'Interview Prep', icon: Briefcase },
    { id: 'travel', label: 'Travel Scenarios', icon: Plane },
    { id: 'grammar', label: 'Grammar Mastery', icon: BookOpen }
  ];

  const filteredScenarios = scenarios.filter((s) => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Learning Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#151D32] via-[#10172A] to-[#151D32] border border-[#27324A] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10172A] border border-[#27324A] text-xs text-cyan-400 font-semibold mb-3">
              <GraduationCap className="w-4 h-4" />
              <span>VAANI LEARN</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Language Learning Platform
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
              Practise speaking, improve grammar and vocabulary through voice interactions in English, Hindi, and Gujarati.
            </p>
          </div>

          {/* User Progress Stats Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#10172A] border border-[#27324A]">
            <div className="flex items-center gap-2 pr-4 border-r border-[#27324A]">
              <Flame className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <div className="text-lg font-black text-white">{profile?.currentStreak || 0}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Day Streak</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-200">
                  {profile?.targetLanguage === 'hi-IN' ? 'हिन्दी (Hindi)' : profile?.targetLanguage === 'gu-IN' ? 'ગુજરાતી (Gujarati)' : 'English'}
                </div>
                <div className="text-[10px] text-slate-400 capitalize">
                  {profile?.proficiencyLevel || 'Beginner'} Level
                </div>
              </div>
            </div>

            <Link
              to="/learn/languages"
              className="p-2 rounded-xl bg-[#151D32] hover:bg-[#1B2540] text-slate-400 hover:text-white transition-colors"
              title="Change target language & goals"
            >
              <Sliders className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-[#151D32] hover:bg-[#1B2540] text-slate-400 border border-[#27324A]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scenarios Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs text-slate-400">Loading interactive scenarios...</span>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="rounded-3xl bg-[#151D32] border border-[#27324A] hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all hover:shadow-glow-cyan group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#10172A] border border-[#27324A] text-[10px] font-mono text-cyan-300 uppercase">
                    {scenario.language}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 capitalize">
                    {scenario.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 group-hover:text-white mb-2">
                  {scenario.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {scenario.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#27324A]">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{scenario.steps?.length || 3} Dialogue Turns</span>
                  <span>Voice & Text</span>
                </div>

                <Link
                  to={`/learn/practice?scenarioId=${scenario.id}`}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Start Practice Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

