import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import {
  Languages,
  Check,
  Award,
  Target,
  ArrowRight,
  Loader2
} from 'lucide-react';

export const LearnLanguagesPage: React.FC = () => {
  const [targetLanguage, setTargetLanguage] = useState<'en-IN' | 'hi-IN' | 'gu-IN'>('hi-IN');
  const [proficiencyLevel, setProficiencyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [learningGoals, setLearningGoals] = useState<string[]>(['Everyday conversation']);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await api.getLearningProfile();
        if (res) {
          if (res.targetLanguage) setTargetLanguage(res.targetLanguage);
          if (res.proficiencyLevel) setProficiencyLevel(res.proficiencyLevel);
          if (res.learningGoals) setLearningGoals(res.learningGoals);
        }
      } catch (err) {
        showToast('Could not load current preferences.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const availableGoals = [
    'Everyday conversation',
    'Interview preparation',
    'Travel conversations',
    'Professional communication',
    'Vocabulary improvement',
    'Grammar improvement'
  ];

  const toggleGoal = (goal: string) => {
    setLearningGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.updateLearningProfile({
        targetLanguage,
        proficiencyLevel,
        learningGoals
      });
      showToast('Learning profile updated successfully!', 'success');
      navigate('/learn');
    } catch (err: any) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 text-cyan-400 mb-1">
          <Languages className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Language & Learning Goals</h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your target language, proficiency level, and objectives.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#151D32] border border-[#27324A] space-y-8">
        {/* 1. Target Language */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Target Language to Master
          </label>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी', desc: 'Devanagari & Spoken' },
              { code: 'gu-IN', label: 'Gujarati', native: 'ગુજરાતી', desc: 'Gujarati Script & Spoken' },
              { code: 'en-IN', label: 'English', native: 'English', desc: 'Indian English Fluency' }
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setTargetLanguage(lang.code as any)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  targetLanguage === lang.code
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-glow-cyan'
                    : 'bg-[#10172A] border-[#27324A] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-xl font-bold text-slate-100">{lang.native}</div>
                <div className="text-xs font-semibold text-cyan-300 mt-0.5">{lang.label}</div>
                <div className="text-[11px] text-slate-500 mt-1">{lang.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Proficiency Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Current Proficiency Level
          </label>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { id: 'beginner', label: 'Beginner', desc: 'Basic vocabulary & simple everyday phrases' },
              { id: 'intermediate', label: 'Intermediate', desc: 'Full sentences, dialogues, and interviews' },
              { id: 'advanced', label: 'Advanced', desc: 'Professional nuance and complex topics' }
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setProficiencyLevel(lvl.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  proficiencyLevel === lvl.id
                    ? 'bg-violet-600/25 border-violet-400 text-white shadow-glow-violet'
                    : 'bg-[#10172A] border-[#27324A] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-slate-100">{lvl.label}</span>
                  {proficiencyLevel === lvl.id && <Check className="w-4 h-4 text-violet-400" />}
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed">{lvl.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Learning Goals */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Learning Objectives (Select all that apply)
          </label>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {availableGoals.map((goal) => {
              const isSelected = learningGoals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#10172A] border-cyan-400 text-cyan-300'
                      : 'bg-[#10172A] border-[#27324A] text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <span>{goal}</span>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#27324A]">
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="px-5 py-2.5 rounded-xl bg-[#10172A] hover:bg-[#1B2540] text-sm text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};

