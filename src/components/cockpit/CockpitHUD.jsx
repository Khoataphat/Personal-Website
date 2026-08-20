import React from 'react';
import { useCockpitStore } from '../../store/cockpitStore';
import { soundFx } from '../../services/soundFx';
import { Volume2, VolumeX, Monitor, RotateCcw } from 'lucide-react';

const DOCK_ITEMS = [
  { id: 0, key: '1', label: 'ABOUT' },
  { id: 1, key: '2', label: 'SKILLS' },
  { id: 2, key: '3', label: 'PROJECTS' },
  { id: 3, key: '4', label: 'BLOG' },
  { id: 4, key: '5', label: 'CONTACT' },
];

function RadarCompass({ rotationAngle = 0 }) {
  const deg = (rotationAngle * 180) / Math.PI;

  return (
    <div className="flex items-center gap-3 font-mono text-[10px] text-[#00f2fe]">
      <div className="relative w-14 h-14 flex items-center justify-center bg-black/40 rounded-full border border-[#00f2fe]/30 backdrop-blur-md shadow-[0_0_12px_rgba(0,242,254,0.15)]">
        <svg width="52" height="52" viewBox="-26 -26 52 52" className="overflow-visible">
          {/* Outer circle */}
          <circle r="22" stroke="#00f2fe" strokeWidth="0.75" fill="none" opacity="0.35" />
          <circle r="12" stroke="#7928ca" strokeWidth="0.5" fill="none" opacity="0.25" />

          {/* 5 Tick marks (72 degrees each) */}
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = (i * 72 - 90) * (Math.PI / 180);
            return (
              <line
                key={i}
                x1={17 * Math.cos(angle)}
                y1={17 * Math.sin(angle)}
                x2={22 * Math.cos(angle)}
                y2={22 * Math.sin(angle)}
                stroke="#00f2fe"
                strokeWidth="1.2"
                opacity="0.7"
              />
            );
          })}

          {/* Rotating Compass Needle */}
          <g transform={`rotate(${deg})`}>
            <polygon points="0,-19 -3,-2 3,-2" fill="#00f2fe" opacity="0.9" />
            <line x1="0" y1="-2" x2="0" y2="8" stroke="#7928ca" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="2" fill="#00f2fe" />
          </g>
        </svg>
      </div>

      <div className="hidden sm:flex flex-col gap-0.5 tracking-widest text-[9px]">
        <span className="text-[#00f2fe] font-bold">RADAR COMPASS</span>
        <span className="text-zinc-400">BEARING: {Math.round(((-deg % 360) + 360) % 360)}°</span>
      </div>
    </div>
  );
}

export function CockpitHUD() {
  const telemetry = useCockpitStore((s) => s.telemetry);
  const activePanel = useCockpitStore((s) => s.activePanel);
  const orbitAngle = useCockpitStore((s) => s.orbitAngle);
  const isAudioMuted = useCockpitStore((s) => s.isAudioMuted);
  const isFreeCamActive = useCockpitStore((s) => s.isFreeCamActive);
  const displayMode = useCockpitStore((s) => s.displayMode);
  const toggleMute = useCockpitStore((s) => s.toggleMute);
  const toggleFreeCam = useCockpitStore((s) => s.toggleFreeCam);
  const setDisplayMode = useCockpitStore((s) => s.setDisplayMode);

  const handleMuteClick = () => {
    soundFx.playToggle();
    toggleMute();
  };

  const handleFreeCamClick = () => {
    soundFx.playToggle();
    toggleFreeCam();
  };

  const handleModeClick = () => {
    soundFx.playToggle();
    setDisplayMode(displayMode === '3d' ? 'crt' : '3d');
  };

  const handleResetCamera = () => {
    soundFx.playToggle();
    if (typeof window !== 'undefined' && window.resetCockpitCamera) {
      window.resetCockpitCamera();
    }
  };

  const handleDockClick = (index) => {
    if (typeof window !== 'undefined' && window.snapToPanel) {
      window.snapToPanel(index);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none font-mono flex flex-col justify-between p-4 sm:p-6">
      {/* 1. TOP TELEMETRY BAR */}
      <div className="pointer-events-auto flex items-center justify-between px-4 py-2.5 rounded-lg bg-black/50 backdrop-blur-md border border-[#00f2fe]/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        {/* Left: Stream Telemetry */}
        <div className="flex items-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-[#00f2fe] tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
            <span className="font-bold hidden sm:inline">SYSTEM ONLINE</span>
            <span className="font-bold sm:hidden">ONLINE</span>
          </div>
          <span className="hidden md:inline text-zinc-500">|</span>
          <span className="text-zinc-300">
            LATENCY: <strong className="text-white font-bold">{telemetry.latency}ms</strong>
          </span>
          <span className="hidden md:inline text-zinc-500">|</span>
          <span className="text-zinc-300">
            FPS: <strong className="text-white font-bold">{telemetry.fps}</strong>
          </span>
          <span className="hidden md:inline text-zinc-500">|</span>
          <span className="text-zinc-400 hidden sm:inline">
            UTC: <span className="text-zinc-200">{telemetry.utcClock}</span>
          </span>
        </div>

        {/* Right: Controls (Free Cam Toggle, Reset Cam, Audio, Display Mode) */}
        <div className="flex items-center gap-2">
          {/* Free Cam (Di chuyển) Toggle Button */}
          <button
            onClick={handleFreeCamClick}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] tracking-wider border transition-all ${
              isFreeCamActive
                ? 'bg-[#00f2fe]/20 border-[#00f2fe] text-white shadow-[0_0_15px_rgba(0,242,254,0.3)] font-bold'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:border-[#00f2fe]/40 hover:text-[#00f2fe]'
            }`}
            title="Bật/Tắt chế độ di chuyển & thu phóng tự do"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isFreeCamActive ? 'bg-[#00f2fe] animate-ping' : 'bg-zinc-600'
              }`}
            />
            <span>DI CHUYỂN: {isFreeCamActive ? 'BẬT' : 'TẮT'}</span>
          </button>

          {/* Reset Camera Button (Visible when Free Cam is on) */}
          {isFreeCamActive && (
            <button
              onClick={handleResetCamera}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] tracking-wider border bg-white/5 border-white/10 text-zinc-300 hover:border-[#00f2fe]/40 hover:text-[#00f2fe] transition-all animate-fadeIn"
              title="Reset Camera Position [Key: R]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#00f2fe]" />
              <span className="hidden sm:inline">RESET CAM [R]</span>
            </button>
          )}

          {/* Audio Mute Toggle */}
          <button
            onClick={handleMuteClick}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] tracking-wider border transition-all ${
              !isAudioMuted
                ? 'bg-[#00f2fe]/10 border-[#00f2fe]/40 text-[#00f2fe]'
                : 'bg-white/5 border-white/10 text-zinc-500'
            }`}
            title="Toggle Audio Feedback"
          >
            {!isAudioMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{!isAudioMuted ? 'AUDIO ON' : 'MUTED'}</span>
          </button>

          {/* Display Mode Toggle */}
          <button
            onClick={handleModeClick}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] tracking-wider border bg-white/5 border-white/10 text-zinc-300 hover:border-[#00f2fe]/40 hover:text-[#00f2fe] transition-all"
            title="Toggle Display Mode"
          >
            <Monitor className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span className="hidden sm:inline">MODE: {displayMode.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* 2. BOTTOM NAVIGATION & RADAR DOCK */}
      <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Radar Compass */}
        <RadarCompass rotationAngle={orbitAngle} />

        {/* QuickDock Button Strip */}
        <div className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-[#00f2fe]/20 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
          {DOCK_ITEMS.map((item) => {
            const isActive = activePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleDockClick(item.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-lg text-[10px] tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-[#00f2fe]/20 border border-[#00f2fe] text-white shadow-[0_0_15px_rgba(0,242,254,0.3)] font-bold scale-105'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="text-[9px] text-[#00f2fe] opacity-80">[{item.key}]</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation & Camera Controls Hint */}
        <div className="hidden lg:block text-right text-[9px] tracking-widest text-zinc-400 font-mono">
          {isFreeCamActive ? (
            <>
              <div className="text-[#00f2fe] font-bold animate-pulse">// CHẾ ĐỘ DI CHUYỂN ĐANG BẬT</div>
              <div className="text-zinc-300">[W/A/S/D] MOVE · [Q/E] ELEVATE · [R] RESET</div>
            </>
          ) : (
            <>
              <div className="text-[#00f2fe]/80">// [DRAG / WHEEL] ORBIT PANELS</div>
              <div className="text-zinc-500">PRESS [1-5] OR [← →] TO SNAP</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

