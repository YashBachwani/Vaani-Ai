/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vaani: {
          bg: '#080B16',
          secondary: '#10172A',
          card: '#151D32',
          cardHover: '#1B2540',
          violet: '#8B5CF6',
          'violet-glow': 'rgba(139, 92, 246, 0.35)',
          cyan: '#22D3EE',
          'cyan-glow': 'rgba(34, 211, 238, 0.35)',
          blue: '#3B82F6',
          text: '#F8FAFC',
          muted: '#94A3B8',
          border: '#27324A',
          borderLight: '#334155'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'orb-idle': '0 0 40px 10px rgba(139, 92, 246, 0.35), inset 0 0 20px rgba(34, 211, 238, 0.5)',
        'orb-listening': '0 0 60px 20px rgba(34, 211, 238, 0.6), inset 0 0 30px rgba(59, 130, 246, 0.8)',
        'orb-speaking': '0 0 70px 25px rgba(139, 92, 246, 0.7), inset 0 0 40px rgba(168, 85, 247, 0.9)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

