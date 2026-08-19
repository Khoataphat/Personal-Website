/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070709',
        surface: {
          DEFAULT: '#0f0f14',
          subtle: '#161620',
          card: 'rgba(18, 18, 26, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)'
        },
        primary: {
          DEFAULT: '#00f2fe',
          glow: '#4facfe',
          dark: '#0072ff'
        },
        accent: {
          violet: '#7928ca',
          magenta: '#ff0080',
          cyan: '#00f2fe',
          emerald: '#10b981'
        },
        text: {
          main: '#f8fafc',
          muted: '#94a3b8',
          dim: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.3)',
        'glow-violet': '0 0 25px -5px rgba(121, 40, 202, 0.3)',
        'glow-box': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
