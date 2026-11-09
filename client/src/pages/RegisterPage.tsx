import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Check,
  Languages,
  Volume2,
  Sliders
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<'register' | 'onboarding'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Onboarding states
  const [preferredLanguage, setPreferredLanguage] = useState<'en-IN' | 'hi-IN' | 'gu-IN'>('en-IN');
  const [preferredVoice, setPreferredVoice] = useState<'Nalini' | 'Kaveri' | 'Deepak'>('Nalini');
  const [responseStyle, setResponseStyle] = useState<'friendly' | 'professional' | 'concise' | 'detailed'>('friendly');
  const [learningLanguage, setLearningLanguage] = useState<'en-IN' | 'hi-IN' | 'gu-IN'>('hi-IN');

  const { register, updateOnboarding } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, password, confirmPassword });
      showToast('Account created successfully! Set up your preferences.', 'success');
      setStep('onboarding');
    } catch (err: any) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async (skipOptional = false) => {
    try {
      setLoading(true);
      await updateOnboarding({
        preferredLanguage,
        preferredVoice,
        responseStyle,
        learningLanguage: skipOptional ? undefined : learningLanguage
      });
      showToast('Welcome to VAANI AI!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast('Error saving preferences, continuing to dashboard...', 'info');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B16] text-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#8B5CF6]/20 via-[#3B82F6]/15 to-[#22D3EE]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 px-4">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] p-[1.5px] shadow-glow-violet">
            <div className="w-full h-full bg-[#080B16] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <span className="text-2xl font-black tracking-tight text-white">VAANI AI</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {step === 'register' ? 'Create your free account' : 'Customize your voice experience'}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {step === 'register' ? (
            <>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300">
                Sign in
              </Link>
            </>
          ) : (
            'Select your preferred language, dialect, and voice'
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 relative z-10">
        <div className="bg-[#151D32] py-8 px-6 sm:px-10 rounded-3xl border border-[#27324A] shadow-2xl backdrop-blur-xl">
          {step === 'register' ? (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Rahul Sharma"
                    className="block w-full pl-10 pr-4 py-3 bg-[#10172A] border border-[#27324A] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="block w-full pl-10 pr-4 py-3 bg-[#10172A] border border-[#27324A] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className="block w-full pl-10 pr-4 py-3 bg-[#10172A] border border-[#27324A] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter password"
                    className="block w-full pl-10 pr-4 py-3 bg-[#10172A] border border-[#27324A] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7C3AED] hover:to-[#2563EB] text-white shadow-glow-violet transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Preferences</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Preferred Language */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  <Languages className="w-4 h-4 text-cyan-400" />
                  <span>Primary Voice & Interface Language</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { code: 'en-IN', name: 'English', native: 'English' },
                    { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
                    { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setPreferredLanguage(l.code as any)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        preferredLanguage === l.code
                          ? 'bg-violet-600/30 border-violet-400 text-white shadow-glow-violet'
                          : 'bg-[#10172A] border-[#27324A] text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-sm">{l.native}</div>
                      <div className="text-[11px] opacity-75">{l.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Voice */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  <Volume2 className="w-4 h-4 text-violet-400" />
                  <span>Gnani Assistant Voice</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'Nalini', label: 'Nalini', desc: 'Female • Warm' },
                    { id: 'Kaveri', label: 'Kaveri', desc: 'Female • Expressive' },
                    { id: 'Deepak', label: 'Deepak', desc: 'Male • Clear' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setPreferredVoice(v.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        preferredVoice === v.id
                          ? 'bg-cyan-600/30 border-cyan-400 text-white shadow-glow-cyan'
                          : 'bg-[#10172A] border-[#27324A] text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-sm">{v.label}</div>
                      <div className="text-[10px] opacity-75">{v.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Response Style */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Response Style</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'friendly', name: 'Friendly', desc: 'Warm & conversational' },
                    { id: 'professional', name: 'Professional', desc: 'Polite & structured' },
                    { id: 'concise', name: 'Concise', desc: 'Short & direct' },
                    { id: 'detailed', name: 'Detailed', desc: 'In-depth explanations' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setResponseStyle(s.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        responseStyle === s.id
                          ? 'bg-[#1B2540] border-cyan-400 text-white'
                          : 'bg-[#10172A] border-[#27324A] text-slate-400'
                      }`}
                    >
                      <div className="font-semibold text-xs text-slate-200">{s.name}</div>
                      <div className="text-[10px] text-slate-500">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Learning Language */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Optional: Target Learning Language
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCompleteOnboarding(true)}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    Skip
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'hi-IN', label: 'Hindi' },
                    { code: 'gu-IN', label: 'Gujarati' },
                    { code: 'en-IN', label: 'English' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLearningLanguage(l.code as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                        learningLanguage === l.code
                          ? 'bg-violet-600/30 border-violet-400 text-white'
                          : 'bg-[#10172A] border-[#27324A] text-slate-400'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish Button */}
              <button
                type="button"
                onClick={() => handleCompleteOnboarding(false)}
                disabled={loading}
                className="w-full mt-4 py-3.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] text-white shadow-glow-violet transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Enter VAANI AI</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

