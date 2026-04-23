/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Leviathan Dark Theme
        'leviathan': {
          'bg': '#0a0a0f',
          'surface': '#12121a',
          'surface-light': '#1a1a25',
          'border': '#2a2a3a',
          'primary': '#00d4ff',
          'secondary': '#7c3aed',
          'accent': '#f59e0b',
          'danger': '#ef4444',
          'success': '#10b981',
          'warning': '#f59e0b',
          'text': '#e2e8f0',
          'text-muted': '#64748b',
          'text-dim': '#475569',
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1a1a25 1px, transparent 1px), linear-gradient(to bottom, #1a1a25 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
