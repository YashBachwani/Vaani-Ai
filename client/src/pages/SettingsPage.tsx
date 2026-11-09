import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';
import {
  Settings,
  User,
  Volume2,
  Languages,
  Sliders,
  Trash2,
  LogOut,
  Play,
  Check,
  Shield,
  Loader2,
  Database
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en-IN');
  const [preferredVoice, setPreferredVoice] = useState(user?.preferredVoice || 'Nalini');
  const [responseStyle, setResponseStyle] = useState(user?.responseStyle || 'friendly');
  const [saving, setSaving] = useState(false);

  // Live voice preview state
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPreferredLanguage(user.preferredLanguage);
      setPreferredVoice(user.preferredVoice);
      setResponseStyle(user.responseStyle);
    }
  }, [user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateSettings({
        name,
        preferredLanguage,
        preferredVoice,
        responseStyle
      });
      updateUser(res.profile);
      showToast('Settings saved successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to save settings: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewVoice = async (voiceName: string) => {
    try {
      setPreviewingVoice(voiceName);
      const sampleText =
        preferredLanguage === 'hi-IN'
          ? `नमस्ते, मैं ${voiceName} हूँ। मैं आपकी वाणी आवाज़ सहायक हूँ।`
          : preferredLanguage === 'gu-IN'
          ? `નમસ્તે, હું ${voiceName} છું. વાણી એઆઈ માં તમારું સ્વાગત છે.`
          : `Hello, I am ${voiceName}, your VAANI AI voice assistant.`;

      const audioBlob = await api.synthesizeTTS({
        text: sampleText,
        voice: voiceName,
        language: preferredLanguage
      });

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => setPreviewingVoice(null);
      audio.onerror = () => setPreviewingVoice(null);
      await audio.play();
    } catch (err: any) {
      setPreviewingVoice(null);
      showToast('Voice preview failed: ' + err.message, 'error');
    }
  };

  const handleClearMemory = async () => {
    if (!confirm('Clear working short-term memory and conversational context?')) return;
    try {
      await api.clearMemory();
      showToast('Conversation memory and working context cleared.', 'info');
    } catch (err: any) {
      showToast('Failed to clear memory.', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-violet-400 mb-1">
          <Settings className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Settings & Audio Configuration</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal profile, preferred Gnani speech voices, and conversational style.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#151D32] border border-[#27324A] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#27324A]">
            <User className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Profile Details</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#10172A] border border-[#27324A] rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-[#10172A] border border-[#27324A] rounded-xl text-sm text-slate-400 cursor-not-allowed opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Language Selection Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#151D32] border border-[#27324A] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#27324A]">
            <Languages className="w-5 h-5 text-violet-400" />
            <h2 className="text-base font-bold text-white">Primary Interaction Language</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { code: 'en-IN', name: 'English (India)', native: 'English' },
              { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
              { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setPreferredLanguage(lang.code as any)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  preferredLanguage === lang.code
                    ? 'bg-violet-600/30 border-violet-400 text-white shadow-glow-violet'
                    : 'bg-[#10172A] border-[#27324A] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-base font-bold text-slate-100">{lang.native}</div>
                <div className="text-xs text-slate-400 mt-0.5">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Selection & Preview Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#151D32] border border-[#27324A] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#27324A]">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Gnani Voice Selection</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Timbre v2.5</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { id: 'Nalini', name: 'Nalini', gender: 'Female', trait: 'Warm & Natural' },
              { id: 'Kaveri', name: 'Kaveri', gender: 'Female', trait: 'Gentle & Expressive' },
              { id: 'Deepak', name: 'Deepak', gender: 'Male', trait: 'Clear & Conversational' },
            ].map((v) => {
              const isSelected = preferredVoice === v.id;
              const isPlaying = previewingVoice === v.id;
              return (
                <div
                  key={v.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-600/20 border-cyan-400 text-white shadow-glow-cyan'
                      : 'bg-[#10172A] border-[#27324A] text-slate-400'
                  }`}
                >
                  <div
                    onClick={() => setPreferredVoice(v.id as any)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-100">{v.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{v.gender} • {v.trait}</div>
                  </div>

                  {/* Live Preview Button */}
                  <button
                    type="button"
                    onClick={() => handlePreviewVoice(v.id)}
                    disabled={isPlaying}
                    className="mt-3 py-1.5 px-2.5 rounded-xl bg-[#151D32] hover:bg-[#1B2540] border border-[#27324A] text-[11px] font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isPlaying ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                        <span>Playing Voice...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-cyan-400" />
                        <span>Listen Sample</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Response Style Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#151D32] border border-[#27324A] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#27324A]">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Assistant Persona & Tone</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'friendly', name: 'Friendly', desc: 'Warm & encouraging' },
              { id: 'professional', name: 'Professional', desc: 'Direct & structured' },
              { id: 'concise', name: 'Concise', desc: 'Short answers' },
              { id: 'detailed', name: 'Detailed', desc: 'Deep explanations' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setResponseStyle(s.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  responseStyle === s.id
                    ? 'bg-emerald-600/20 border-emerald-400 text-white shadow-sm'
                    : 'bg-[#10172A] border-[#27324A] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="font-bold text-xs text-slate-100">{s.name}</div>
                <div className="text-[10px] text-slate-400 mt-1">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white font-semibold text-sm shadow-glow-violet transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Memory & Privacy Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#151D32] border border-[#27324A] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#27324A]">
          <Database className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">Memory & Privacy Controls</h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          VAANI AI runs completely independent of external LLMs. You have full transparency and control over remembered short-term conversation context.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleClearMemory}
            className="px-4 py-2.5 rounded-xl bg-[#10172A] hover:bg-amber-500/10 border border-[#27324A] hover:border-amber-500/40 text-xs font-semibold text-amber-300 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Short-Term Context</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

