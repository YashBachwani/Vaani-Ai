import React from 'react';
import { motion } from 'framer-motion';

export type OrbState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error';

interface AiOrbProps {
  state: OrbState;
  volume?: number; // 0 to 1
  size?: number; // in px
  onClick?: () => void;
}

export const AiOrb: React.FC<AiOrbProps> = ({
  state,
  volume = 0,
  size = 200,
  onClick
}) => {
  // Scale multiplier based on audio volume
  const scale = 1 + (state === 'listening' || state === 'speaking' ? volume * 0.45 : 0);

  const getColors = () => {
    switch (state) {
      case 'listening':
        return {
          core: 'from-cyan-400 via-sky-500 to-blue-600',
          glow: 'rgba(34, 211, 238, 0.6)',
          ring: 'border-cyan-400/50'
        };
      case 'processing':
        return {
          core: 'from-violet-500 via-fuchsia-500 to-cyan-400',
          glow: 'rgba(168, 85, 247, 0.65)',
          ring: 'border-fuchsia-400/60'
        };
      case 'speaking':
        return {
          core: 'from-violet-500 via-purple-600 to-indigo-700',
          glow: 'rgba(139, 92, 246, 0.7)',
          ring: 'border-purple-400/50'
        };
      case 'error':
        return {
          core: 'from-rose-500 via-red-600 to-amber-600',
          glow: 'rgba(244, 63, 94, 0.6)',
          ring: 'border-rose-400/50'
        };
      case 'idle':
      default:
        return {
          core: 'from-violet-600 via-indigo-600 to-cyan-500',
          glow: 'rgba(139, 92, 246, 0.4)',
          ring: 'border-violet-400/30'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center select-none ${onClick ? 'cursor-pointer' : ''}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Glow Ring 1 */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: state === 'processing' ? 2 : 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`absolute inset-0 rounded-full border border-dashed ${colors.ring}`}
        style={{ filter: `drop-shadow(0 0 15px ${colors.glow})` }}
      />

      {/* Outer Glow Ring 2 */}
      <motion.div
        animate={{
          scale: [1.1, 1.25, 1.1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: state === 'processing' ? 3 : 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute inset-2 rounded-full border border-violet-500/20"
      />

      {/* Atmospheric Ambient Glow behind Orb */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-500"
        style={{
          width: size * 0.85,
          height: size * 0.85,
          background: `radial-gradient(circle, ${colors.glow} 0%, rgba(8, 11, 22, 0) 70%)`,
          filter: 'blur(20px)'
        }}
      />

      {/* Central Interactive Orb Core */}
      <motion.div
        animate={{
          scale: state === 'processing' ? [1, 1.08, 1] : scale,
          rotate: state === 'processing' ? 360 : 0
        }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          rotate: state === 'processing' ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}
        }}
        className={`relative z-10 rounded-full bg-gradient-to-tr ${colors.core} shadow-2xl flex items-center justify-center overflow-hidden`}
        style={{
          width: size * 0.65,
          height: size * 0.65,
          boxShadow: `0 0 45px 5px ${colors.glow}, inset 0 0 25px rgba(255, 255, 255, 0.35)`
        }}
      >
        {/* Inner highlights & fluid motion */}
        <motion.div
          animate={{
            x: [-10, 10, -10],
            y: [-10, 10, -10]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -top-4 -left-4 w-20 h-20 bg-white/40 rounded-full blur-md"
        />

        <motion.div
          animate={{
            x: [10, -10, 10],
            y: [10, -10, 10]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute -bottom-4 -right-4 w-16 h-16 bg-cyan-300/30 rounded-full blur-md"
        />

        {/* Center Iris dot */}
        <div className="w-3 h-3 rounded-full bg-white/90 shadow-[0_0_10px_white]" />
      </motion.div>
    </div>
  );
};

