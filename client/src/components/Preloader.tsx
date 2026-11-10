import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Cpu, Volume2, ShieldCheck } from 'lucide-react';

interface PreloaderProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  minDurationMs = 2400
}) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [langIndex, setLangIndex] = useState(0);

  const multilingualGreetings = [
    { title: 'VAANI AI', subtitle: 'Your Voice. Your Language. Your World.' },
    { title: 'वाणी एआई', subtitle: 'आपकी आवाज़। आपकी भाषा। आपका संसार।' },
    { title: 'વાણી એઆઈ', subtitle: 'તમારો અવાજ. તમારી ભાષા. તમારું વિશ્વ.' }
  ];

  const bootStages = [
    { text: 'Connecting to Gnani.ai Speech Intelligence...', icon: Volume2 },
    { text: 'Initializing VAANI CORE Intelligence Engine...', icon: Cpu },
    { text: 'Loading Vernacular Neural Dictionaries...', icon: Sparkles },
    { text: 'Security & Privacy Protocols Verified...', icon: ShieldCheck },
    { text: 'VAANI AI System Ready.', icon: Sparkles }
  ];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(100, Math.round((elapsed / minDurationMs) * 100));

      setProgress(calculatedProgress);

      const stage = Math.min(
        bootStages.length - 1,
        Math.floor((calculatedProgress / 100) * bootStages.length)
      );
      setStatusIndex(stage);

      const langStage = Math.floor((calculatedProgress / 100) * multilingualGreetings.length) % multilingualGreetings.length;
      setLangIndex(langStage);

      if (calculatedProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 400);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [minDurationMs, onComplete]);

  const activeGreeting = multilingualGreetings[langIndex];
  const activeStage = bootStages[statusIndex];
  const StageIcon = activeStage.icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080B16] text-[#F8FAFC] select-none overflow-hidden">
      {/* Background radial ambient aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#8B5CF6]/20 via-[#3B82F6]/15 to-[#22D3EE]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Cybernetic grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #22D3EE 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center space-y-8">
        {/* Holographic Glowing Central Core Visual */}
        <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
          {/* Outer Pulsing Kinetic Ring 1 */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.08, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute inset-0 rounded-full border border-dashed border-[#22D3EE]/40"
            style={{ filter: 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.5))' }}
          />

          {/* Outer Reverse Counter-Rotating Ring 2 */}
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1.05, 0.98, 1.05],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute inset-3 rounded-full border border-[#8B5CF6]/50"
            style={{ filter: 'drop-shadow(0 0 14px rgba(139, 92, 246, 0.5))' }}
          />

          {/* Audio Wave Frequencies Ring */}
          <motion.div
            animate={{
              scale: [0.95, 1.12, 0.95],
              opacity: [0.5, 0.85, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-6 rounded-full border border-cyan-400/30"
          />

          {/* Glowing Center Orb Core */}
          <motion.div
            animate={{
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="relative z-20 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] p-[2px] shadow-2xl"
            style={{
              boxShadow: '0 0 50px 15px rgba(139, 92, 246, 0.4), inset 0 0 25px rgba(34, 211, 238, 0.6)'
            }}
          >
            <div className="w-full h-full bg-[#080B16] rounded-full flex flex-col items-center justify-center relative overflow-hidden">
              {/* Internal light sheen */}
              <motion.div
                animate={{
                  x: [-30, 30, -30],
                  y: [-30, 30, -30]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-0 left-0 w-16 h-16 bg-white/20 rounded-full blur-md"
              />

              {/* Central Soundwave Bars */}
              <div className="flex items-center gap-1 z-10">
                {[4, 8, 14, 20, 14, 8, 4].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [h, h * 1.8, h],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 0.8 + i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="w-1 rounded-full bg-gradient-to-t from-[#8B5CF6] to-[#22D3EE]"
                    style={{ height: h }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Multilingual Typography Switcher */}
        <div className="h-20 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGreeting.title}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-1.5"
            >
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                {activeGreeting.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                {activeGreeting.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress & Live Boot Stage Logger */}
        <div className="w-full space-y-3">
          {/* Progress percentage & stage */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 text-cyan-400 font-medium truncate max-w-[80%]">
              <StageIcon className="w-3.5 h-3.5 shrink-0 animate-pulse" />
              <span className="truncate">{activeStage.text}</span>
            </div>
            <span className="text-violet-400 font-bold">{progress}%</span>
          </div>

          {/* High-Tech Progress Bar */}
          <div className="relative w-full h-2 bg-[#151D32] rounded-full overflow-hidden border border-[#27324A] shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#22D3EE] rounded-full relative"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            >
              {/* Leading spark head */}
              <div className="absolute top-0 right-0 bottom-0 w-3 bg-white rounded-full blur-[1px] shadow-[0_0_8px_white]" />
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Powered by Gnani.ai & VAANI CORE</span>
            {onComplete && (
              <button
                onClick={onComplete}
                className="text-cyan-400 hover:text-cyan-300 hover:underline font-sans cursor-pointer transition-colors"
              >
                Skip Intro
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

