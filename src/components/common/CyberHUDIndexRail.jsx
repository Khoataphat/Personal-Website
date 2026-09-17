import React, { useState, useEffect } from 'react';
import { useCockpitStore } from '../../store/cockpitStore';
import { soundFx } from '../../services/soundFx';
import { X, Sparkles } from 'lucide-react';

export const NAV_SECTIONS = [
  { id: 0, key: 'about', num: '01', label: 'ABOUT', sub: 'EXECUTIVE PROFILE', color: '#00f2fe' },
  { id: 1, key: 'skills', num: '02', label: 'SKILLS', sub: 'TECHNICAL ARSENAL', color: '#00ff88' },
  { id: 2, key: 'projects', num: '03', label: 'WORK', sub: 'MISSION ARCHIVES', color: '#a855f7' },
  { id: 3, key: 'blog', num: '04', label: 'BLOG', sub: 'TRANSMISSIONS', color: '#f59e0b' },
  { id: 4, key: 'contact', num: '05', label: 'CONTACT', sub: 'SECURE COMMS', color: '#f43f5e' },
];

/**
 * CyberHUDIndexRail
 *
 * Unified Primary Navigation System:
 * - Desktop: Vertical Laser Rail along the right edge with Magnetic Expansion,
 *   active section indicator & quick scrolling.
 * - Mobile: Floating Radial Dial at bottom-right.
 * - Supports both Hero 3D and Continuous Scrolltelling views.
 */
export function CyberHUDIndexRail() {
  const pageMode = useCockpitStore((s) => s.pageMode);
  const activeStorySection = useCockpitStore((s) => s.activeStorySection || 'about');
  const enterStorytelling = useCockpitStore((s) => s.enterStorytelling);
  const returnToHero = useCockpitStore((s) => s.returnToHero);

  const [hoveredTab, setHoveredTab] = useState(null);
  const [isMobileDialOpen, setIsMobileDialOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isStorytelling = pageMode === 'storytelling';

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 250);
    return () => clearTimeout(t);
  }, []);

  if (!isStorytelling) {
    return null;
  }

  const handleNavClick = (sectionKey) => {
    soundFx.playDockClick?.();
    if (!isStorytelling) {
      enterStorytelling(sectionKey);
    } else {
      const el = document.getElementById(`section-${sectionKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (isMobileDialOpen) {
      setIsMobileDialOpen(false);
    }
  };

  const handleMobileDialToggle = () => {
    soundFx.playPanelSwitch?.();
    setIsMobileDialOpen((prev) => !prev);
  };

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── 1. DESKTOP CYBER-HUD INDEX RAIL (>= 768px md:flex) ────────── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Main Navigation Index"
        className="hidden md:flex fixed right-4 lg:right-7 z-[60] pointer-events-auto select-none flex-col items-end gap-3"
        style={{
          top: 'clamp(120px, 24vh, 215px)',
          fontFamily: "'Fira Code', monospace",
          zIndex: 60,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'opacity 0.8s ease 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
        }}
      >
        {/* Background Vertical Laser Track Spine */}
        <div
          className="absolute right-[9px] top-4 bottom-4 w-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.12) 15%, rgba(0,242,254,0.3) 50%, rgba(255,255,255,0.12) 85%, transparent 100%)',
            boxShadow: '0 0 8px rgba(0,242,254,0.2)',
          }}
        />

        {NAV_SECTIONS.map((item) => {
          const isActive = isStorytelling && activeStorySection === item.key;
          const isHovered = hoveredTab === item.id;
          const itemColor = item.color;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.key)}
              onMouseEnter={() => {
                setHoveredTab(item.id);
                soundFx.playHover?.();
              }}
              onMouseLeave={() => setHoveredTab(null)}
              className="relative group flex items-center gap-3 py-1.5 pl-4 pr-1 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none"
              style={{
                background: isHovered
                  ? 'rgba(6, 7, 18, 0.88)'
                  : isActive
                  ? 'rgba(6, 7, 18, 0.75)'
                  : 'transparent',
                backdropFilter: (isHovered || isActive) ? 'blur(16px)' : 'none',
                WebkitBackdropFilter: (isHovered || isActive) ? 'blur(16px)' : 'none',
                border: isHovered
                  ? `1px solid ${itemColor}66`
                  : isActive
                  ? `1px solid ${itemColor}44`
                  : '1px solid transparent',
                boxShadow: isHovered
                  ? `0 4px 24px rgba(0,0,0,0.7), 0 0 16px ${itemColor}33`
                  : isActive
                  ? `0 4px 20px rgba(0,0,0,0.5), 0 0 12px ${itemColor}22`
                  : 'none',
              }}
              title={`Navigate to Section ${item.num}: ${item.label}`}
            >
              {/* Magnetic Expansion Pill (Expanded text label on Hover or Active) */}
              <div
                className="flex items-center overflow-hidden transition-all duration-300"
                style={{
                  maxWidth: (isHovered || isActive) ? '130px' : '0px',
                  opacity: (isHovered || isActive) ? 1 : 0,
                  transform: (isHovered || isActive) ? 'translateX(0)' : 'translateX(10px)',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    color: (isHovered || isActive) ? itemColor : '#ffffff',
                    fontFamily: "'Outfit', 'Orbitron', sans-serif",
                    textShadow: (isHovered || isActive) ? `0 0 10px ${itemColor}99` : 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </span>
              </div>

              {/* Number Badge */}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: (isActive || isHovered) ? 800 : 500,
                  letterSpacing: '1.5px',
                  color: isActive ? itemColor : isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  textShadow: isActive ? `0 0 12px ${itemColor}` : isHovered ? `0 0 8px ${itemColor}88` : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  fontFamily: "'Fira Code', monospace",
                }}
              >
                {item.num}
              </span>

              {/* Reactor Node / Indicator Line */}
              <div className="relative flex items-center justify-center w-5 h-5">
                {isActive && (
                  <span
                    className="absolute w-4 h-4 rounded-full animate-ping opacity-60 pointer-events-none"
                    style={{ background: itemColor }}
                  />
                )}

                <div
                  style={{
                    width: isActive ? '18px' : isHovered ? '14px' : '6px',
                    height: '2.5px',
                    background: isActive
                      ? itemColor
                      : isHovered
                      ? `linear-gradient(90deg, ${itemColor}, #ffffff)`
                      : 'rgba(255, 255, 255, 0.25)',
                    borderRadius: '2px',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: (isActive || isHovered) ? `0 0 10px ${itemColor}` : 'none',
                  }}
                />
              </div>
            </button>
          );
        })}

        {/* ── Return to Hero Trigger Button on Rail ─────────────────── */}
        {isStorytelling && (
          <button
            onClick={() => returnToHero()}
            className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-[10px] text-cyan-300 bg-[#060c1d]/90 border border-cyan-500/40 hover:border-cyan-400 hover:text-white shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all duration-300 hover:scale-105"
            title="Return to Hero 3D"
          >
            <span>◈ HERO 3D</span>
          </button>
        )}
      </nav>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* ── 2. MOBILE MINI FLOATING RADIAL DIAL (< 768px) ─────────────── */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-6 right-5 z-[60] pointer-events-auto select-none" style={{ zIndex: 60 }}>
        {isMobileDialOpen && (
          <div
            onClick={() => setIsMobileDialOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
          />
        )}

        {isMobileDialOpen && (
          <div
            className="absolute bottom-16 right-0 z-60 flex flex-col items-end gap-2.5 mb-2 animate-slideUp"
            style={{ fontFamily: "'Fira Code', monospace" }}
          >
            {isStorytelling && (
              <button
                onClick={() => {
                  setIsMobileDialOpen(false);
                  returnToHero();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-lg text-xs font-bold"
              >
                <span>◈ RETURN TO HERO</span>
              </button>
            )}

            {NAV_SECTIONS.map((item, idx) => {
              const isActive = isStorytelling && activeStorySection === item.key;
              const itemColor = item.color;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.key)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl transition-transform duration-200 active:scale-95 border"
                  style={{
                    background: isActive ? `${itemColor}22` : 'rgba(10, 12, 24, 0.92)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderColor: isActive ? itemColor : 'rgba(255, 255, 255, 0.15)',
                    boxShadow: isActive ? `0 0 20px ${itemColor}44` : '0 8px 30px rgba(0,0,0,0.8)',
                    animationDelay: `${idx * 40}ms`,
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '2px',
                      color: isActive ? itemColor : '#ffffff',
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {item.label}
                  </span>

                  <span
                    className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold"
                    style={{
                      background: `${itemColor}25`,
                      color: itemColor,
                      border: `1px solid ${itemColor}55`,
                    }}
                  >
                    {item.num}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Floating Dial Activator Button */}
        <button
          onClick={handleMobileDialToggle}
          aria-label="Toggle navigation menu"
          className="relative w-13 h-13 rounded-full flex items-center justify-center cursor-pointer shadow-2xl transition-all duration-300 active:scale-90 border"
          style={{
            background: 'rgba(6, 7, 18, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: isMobileDialOpen ? '#ffffff' : '#00f2fe88',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 242, 254, 0.35)',
          }}
        >
          {isMobileDialOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#00f2fe',
                  fontFamily: "'Outfit', 'Orbitron', sans-serif",
                  lineHeight: 1,
                  textShadow: '0 0 8px #00f2fe',
                }}
              >
                NAV
              </span>
              <span className="text-[7px] tracking-widest text-zinc-400 mt-0.5">INDEX</span>
            </div>
          )}
        </button>
      </div>
    </>
  );
}
