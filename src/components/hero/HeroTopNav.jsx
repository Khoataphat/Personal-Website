import React from 'react';
import { useCockpitStore } from '../../store/cockpitStore';
import { soundFx } from '../../services/soundFx';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * HeroTopNav
 *
 * Floating Cyber HUD elements:
 * 1. Top-Left: Floating Signature Brand ("Khoa") + "RETURN TO CORE" button in storytelling mode
 * 2. Top-Right: Floating Audio Toggle Pill
 */
export function HeroTopNav() {
  const isAudioMuted = useCockpitStore((s) => s.isAudioMuted);
  const toggleMute = useCockpitStore((s) => s.toggleMute);
  const pageMode = useCockpitStore((s) => s.pageMode);
  const returnToHero = useCockpitStore((s) => s.returnToHero);

  const isStorytelling = pageMode === 'storytelling';

  const handleBrandClick = () => {
    if (isStorytelling) {
      returnToHero();
    } else {
      soundFx.playDockClick?.();
    }
  };

  const handleMuteClick = () => {
    soundFx.playToggle?.();
    toggleMute();
  };

  return (
    <>
      {/* ── 1. Top-Left Floating Neon Signature Brand ───────────────── */}
      <aside
        aria-label="System Identity"
        className="fixed z-[60] select-none flex items-center gap-4 pointer-events-auto"
        style={{
          top: 'clamp(18px, 2.8vh, 32px)',
          left: 'clamp(24px, 3.5vw, 48px)',
          zIndex: 60,
        }}
      >
        <button
          type="button"
          onClick={handleBrandClick}
          aria-label="Khoa Portfolio Home"
          className="group flex flex-col items-start cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 text-left border-0 bg-transparent p-0 focus:outline-none"
          title={isStorytelling ? "Return to Hero 3D" : "Dang Khoa Sovereign System"}
        >
          {/* Fluid Neon Calligraphy Signature Wordmark */}
          <span
            className="inline-block transition-all duration-300 group-hover:brightness-125 select-none"
            style={{
              fontFamily: "'Alex Brush', 'Great Vibes', cursive",
              fontSize: 'clamp(36px, 2.8vw, 48px)',
              lineHeight: 1.25,
              padding: '10px 12px 2px 6px',
              margin: '-8px -4px -4px -4px',
              background: 'linear-gradient(135deg, #ffffff 15%, #00f2fe 65%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 12px rgba(0, 242, 254, 0.7)) drop-shadow(0 0 24px rgba(121, 40, 202, 0.45))',
              letterSpacing: '1px',
              overflow: 'visible',
            }}
          >
            Khoa
          </span>

          {/* Artistic Calligraphy Brush Flourish */}
          <svg
            width="96"
            height="22"
            viewBox="0 0 96 22"
            fill="none"
            className="overflow-visible transition-all duration-500 group-hover:scale-105"
            style={{ marginTop: '-8px', marginLeft: '4px' }}
          >
            <defs>
              <linearGradient id="sigCalligraphyGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.75" />
                <stop offset="30%" stopColor="#00f2fe" stopOpacity="1" />
                <stop offset="65%" stopColor="#9d4edd" stopOpacity="1" />
                <stop offset="90%" stopColor="#00f2fe" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>
              <filter id="sigCalligraphyGlow" x="-30%" y="-50%" width="160%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 6 4 C 18 16, 44 20, 72 10 C 82 6, 88 2, 92 -4"
              stroke="url(#sigCalligraphyGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#sigCalligraphyGlow)"
            />
          </svg>
        </button>

        {/* ── Return to Hero 3D Button (When in Storytelling mode) ──── */}
        {isStorytelling && (
          <button
            onClick={() => returnToHero()}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs text-cyan-300 bg-[#060c1d]/90 border border-cyan-500/50 hover:border-cyan-400 hover:text-white shadow-[0_0_18px_rgba(0,242,254,0.35)] backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="tracking-wider font-bold">◈ RETURN TO CORE</span>
          </button>
        )}
      </aside>

      {/* ── 2. Top-Right Floating Audio Toggle Button ────────────────── */}
      <div
        className="fixed z-[60] pointer-events-auto select-none flex items-center gap-3"
        style={{
          top: 'clamp(20px, 3vh, 36px)',
          right: 'clamp(24px, 3.5vw, 48px)',
          fontFamily: "'Fira Code', monospace",
          zIndex: 60,
        }}
      >
        {/* Return to Hero button on mobile in top right */}
        {isStorytelling && (
          <button
            onClick={() => returnToHero()}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] text-cyan-300 bg-[#060c1d]/90 border border-cyan-500/50 backdrop-blur-md"
          >
            <span>◈ HERO</span>
          </button>
        )}

        <button
          onClick={handleMuteClick}
          aria-label={!isAudioMuted ? "Mute interactive audio" : "Enable audio"}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group"
          style={{
            background: !isAudioMuted ? 'rgba(0, 242, 254, 0.1)' : 'rgba(6, 7, 16, 0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${!isAudioMuted ? 'rgba(0, 242, 254, 0.45)' : 'rgba(255, 255, 255, 0.14)'}`,
            boxShadow: !isAudioMuted
              ? '0 4px 20px rgba(0, 242, 254, 0.25), 0 0 12px rgba(0, 242, 254, 0.2)'
              : '0 4px 16px rgba(0, 0, 0, 0.6)',
            color: !isAudioMuted ? '#00f2fe' : 'rgba(255, 255, 255, 0.45)',
          }}
          title={!isAudioMuted ? "Audio Feedback: ON (Click to Mute)" : "Audio Feedback: MUTED (Click to Unmute)"}
        >
          {!isAudioMuted ? (
            <Volume2 className="w-4 h-4 text-[#00f2fe] transition-transform duration-200 group-hover:scale-110" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          )}
        </button>
      </div>
    </>
  );
}
