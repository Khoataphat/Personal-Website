import React from 'react';
import { useCockpitStore } from '../../store/cockpitStore';
import { soundFx } from '../../services/soundFx';
import { Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';

/**
 * HeroTopNav
 *
 * Refactored into two independent Floating Cyber HUD elements:
 * 1. Top-Left: Floating Glass Brand Island (Logo "K" + Name "KHOA" + System/FPS Telemetry)
 * 2. Top-Right: Floating Audio Toggle Pill (Glassmorphic Audio On/Off state)
 *
 * The full-width top navigation bar has been removed to free up 100% of the 3D Cosmos sky.
 */
export function HeroTopNav() {
  const isAudioMuted = useCockpitStore((s) => s.isAudioMuted);
  const toggleMute = useCockpitStore((s) => s.toggleMute);
  const telemetry = useCockpitStore((s) => s.telemetry);
  
  const isDossierOpen = useCockpitStore((s) => s.isDossierOpen);
  const closeDossier = useCockpitStore((s) => s.closeDossier);

  const handleBrandClick = () => {
    if (isDossierOpen) {
      soundFx.playClose?.();
      closeDossier?.();
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
        className="fixed z-[60] select-none"
        style={{
          top: 'clamp(18px, 2.8vh, 32px)',
          left: 'clamp(24px, 3.5vw, 48px)',
          zIndex: 60,
          opacity: isDossierOpen ? 0 : 1,
          pointerEvents: isDossierOpen ? 'none' : 'auto',
          visibility: isDossierOpen ? 'hidden' : 'visible',
          transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s',
        }}
      >
        <button
          type="button"
          onClick={handleBrandClick}
          aria-label={isDossierOpen ? "Close dossier and return to Cosmos Hero view" : "Khoa Portfolio Home"}
          className="group flex flex-col items-start cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 text-left border-0 bg-transparent p-0 focus:outline-none"
          title={isDossierOpen ? "Return to Cosmos Hero [ESC]" : "Dang Khoa Sovereign System"}
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

          {/* Artistic Calligraphy Brush Flourish (Loop at start, thick belly, soaring upward ascent) */}
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
            {/* Calligraphy stroke with variable thickness (thin loop -> thick middle belly -> fine rising tip) */}
            <path
              d="M 10,13.5
                 C 6,15.5 2,16 1.5,12
                 C 1,7.5 6,5 10,7.5
                 C 14.5,10.5 16,15 22,16.5
                 C 34,18.5 50,17.5 66,12
                 C 76,8.5 85,4 92,1.2
                 C 92.8,0.9 91.5,2.4 89,3.8
                 C 79,9.8 69,14 56,17.2
                 C 41,20.5 26,19 17.5,14.8
                 C 13,12 9.5,9 7,9.5
                 C 4.5,10 3.8,12.5 5.5,14
                 C 7.5,15.5 9.5,14.5 10,13.5 Z"
              fill="url(#sigCalligraphyGrad)"
              filter="url(#sigCalligraphyGlow)"
            />
            {/* Micro accent starlight at soaring apex */}
            <circle
              cx="92.5"
              cy="1.2"
              r="1.2"
              fill="#ffffff"
              style={{ filter: 'drop-shadow(0 0 5px #00f2fe)' }}
            />
          </svg>
        </button>
      </aside>

      {/* ── 2. Top-Right Floating Audio Toggle Button ────────────────── */}
      <div
        className="fixed z-[60] pointer-events-auto select-none"
        style={{
          top: 'clamp(20px, 3vh, 36px)',
          right: 'clamp(24px, 3.5vw, 48px)',
          fontFamily: "'Fira Code', monospace",
          zIndex: 60,
        }}
      >
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
