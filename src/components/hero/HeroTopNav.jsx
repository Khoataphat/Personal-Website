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
      {/* ── 1. Top-Left Floating Glass Brand Island ─────────────────── */}
      <aside
        aria-label="System Identity & Telemetry"
        className="fixed top-4 left-4 sm:top-6 sm:left-8 z-[60] pointer-events-auto select-none"
        style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace", zIndex: 60 }}
      >
        <button
          type="button"
          onClick={handleBrandClick}
          aria-label={isDossierOpen ? "Close dossier and return to Cosmos Hero view" : "Dang Khoa Sovereign System online"}
          className="flex items-center gap-3 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl cursor-pointer group transition-all duration-300 hover:scale-[1.02] active:scale-95 text-left border-0 focus:outline-none"
          style={{
            background: 'rgba(6, 7, 16, 0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 242, 254, 0.22)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 242, 254, 0.1)',
          }}
          title={isDossierOpen ? "Click to return to Cosmos Hero [ESC]" : "Dang Khoa Sovereign Architecture"}
        >
          {/* Glowing Brand Monogram Box */}
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.7)]"
            style={{
              background: 'linear-gradient(135deg, rgba(0,242,254,0.2) 0%, rgba(121,40,202,0.2) 100%)',
              border: '1.5px solid #00f2fe',
              boxShadow: '0 0 10px rgba(0, 242, 254, 0.35)',
            }}
          >
            <span
              style={{
                color: '#00f2fe',
                fontSize: '13px',
                fontWeight: 900,
                fontFamily: "'Outfit', sans-serif",
                lineHeight: 1,
                textShadow: '0 0 8px rgba(0,242,254,0.8)',
              }}
            >
              K
            </span>
          </div>

          {/* Brand Name & Live Telemetry */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '3px',
                  color: '#ffffff',
                  fontFamily: "'Outfit', 'Orbitron', sans-serif",
                  textShadow: '0 0 10px rgba(0,242,254,0.4)',
                }}
              >
                KHOA
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-pulse" />
            </div>

            <div
              className="flex items-center gap-1.5"
              style={{
                fontSize: '8.5px',
                letterSpacing: '1.5px',
                color: isDossierOpen ? '#00ff88' : '#00f2fe',
                opacity: 0.85,
              }}
            >
              {telemetry.fps > 0 && <span className="text-zinc-400">FPS {telemetry.fps} ·</span>}
              <span>{isDossierOpen ? 'EDITORIAL ACTIVE' : (telemetry.utcClock || 'SYSTEM ONLINE')}</span>
            </div>
          </div>
        </button>
      </aside>

      {/* ── 2. Top-Right Floating Audio Pill ────────────────────────── */}
      <div
        className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[60] pointer-events-auto select-none"
        style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace", zIndex: 60 }}
      >
        <button
          onClick={handleMuteClick}
          className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 group"
          style={{
            background: !isAudioMuted ? 'rgba(0, 242, 254, 0.08)' : 'rgba(6, 7, 16, 0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${!isAudioMuted ? 'rgba(0, 242, 254, 0.4)' : 'rgba(255, 255, 255, 0.12)'}`,
            boxShadow: !isAudioMuted
              ? '0 4px 20px rgba(0, 242, 254, 0.2), 0 0 10px rgba(0, 242, 254, 0.1)'
              : '0 4px 20px rgba(0, 0, 0, 0.5)',
            color: !isAudioMuted ? '#00f2fe' : 'rgba(255, 255, 255, 0.4)',
          }}
          title={!isAudioMuted ? "Mute interactive audio" : "Enable sci-fi sound FX"}
        >
          {!isAudioMuted ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#00f2fe] animate-pulse" />
              <span className="text-[10px] tracking-widest font-bold hidden sm:inline">AUDIO ON</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] shadow-[0_0_6px_#00f2fe]" />
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              <span className="text-[10px] tracking-widest font-medium text-zinc-400 hidden sm:inline">MUTED</span>
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
