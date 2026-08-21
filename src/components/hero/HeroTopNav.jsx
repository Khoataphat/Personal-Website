import React from 'react';
import { useCockpitStore } from '../../store/cockpitStore';
import { soundFx } from '../../services/soundFx';
import { Volume2, VolumeX } from 'lucide-react';

const NAV_ITEMS = [
  { id: 0, label: 'ABOUT' },
  { id: 1, label: 'SKILLS' },
  { id: 2, label: 'WORK' },
  { id: 3, label: 'BLOG' },
  { id: 4, label: 'CONTACT' },
];

/**
 * HeroTopNav
 *
 * Top navigation bar for the Hero Cosmic Scene.
 * Left: Cyberpunk brand logo (KHOA) + System telemetry.
 * Right: Nav links that directly open the ExpandedDetailModal for that section.
 *        Includes Audio ON/OFF toggle.
 */
export function HeroTopNav() {
  const isAudioMuted = useCockpitStore((s) => s.isAudioMuted);
  const toggleMute = useCockpitStore((s) => s.toggleMute);
  const telemetry = useCockpitStore((s) => s.telemetry);
  const activeCard = useCockpitStore((s) => s.activeCard);
  const isCardExpanded = useCockpitStore((s) => s.isCardExpanded);
  const setActiveCard = useCockpitStore((s) => s.setActiveCard);
  const setIsCardExpanded = useCockpitStore((s) => s.setIsCardExpanded);

  const handleNavClick = (id) => {
    soundFx.playDockClick?.();
    setActiveCard(id);
    setIsCardExpanded(true);
  };

  const handleMuteClick = () => {
    soundFx.playToggle?.();
    toggleMute();
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 pointer-events-none"
      style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
    >
      <div
        className="pointer-events-auto flex items-center justify-between px-5 sm:px-8 py-3 sm:py-4"
        style={{
          background: 'rgba(5, 5, 14, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 242, 254, 0.12)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
        }}
      >
        {/* ── Logo / Brand ─────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '28px',
              height: '28px',
              border: '2px solid #00f2fe',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(0,242,254,0.4)',
            }}
          >
            <span style={{ color: '#00f2fe', fontSize: '14px', fontWeight: 'bold', lineHeight: 1 }}>K</span>
          </div>
          <div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 'bold',
                letterSpacing: '4px',
                color: '#ffffff',
                textShadow: '0 0 12px rgba(0,242,254,0.4)',
              }}
            >
              KHOA
            </div>
            <div
              style={{
                fontSize: '8px',
                letterSpacing: '2px',
                color: '#00f2fe',
                opacity: 0.7,
              }}
            >
              {telemetry.fps > 0 ? `FPS: ${telemetry.fps} · ` : ''}{telemetry.utcClock || 'SYSTEM ONLINE'}
            </div>
          </div>
        </div>

        {/* ── Nav Links (Clicking opens ExpandedDetailModal) ── */}
        <div className="hidden sm:flex items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = isCardExpanded && activeCard === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  background: isActive ? 'rgba(0,242,254,0.15)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(0,242,254,0.6)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '6px',
                  color: isActive ? '#00f2fe' : 'rgba(255,255,255,0.7)',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
                  textShadow: isActive ? '0 0 8px rgba(0,242,254,0.6)' : 'none',
                  fontFamily: 'inherit',
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#00f2fe';
                    e.currentTarget.style.borderColor = 'rgba(0,242,254,0.4)';
                    e.currentTarget.style.background = 'rgba(0,242,254,0.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* ── Audio Toggle ──────────────────────────────────── */}
        <button
          onClick={handleMuteClick}
          style={{
            background: !isAudioMuted ? 'rgba(0,242,254,0.08)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${!isAudioMuted ? 'rgba(0,242,254,0.35)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '6px',
            color: !isAudioMuted ? '#00f2fe' : 'rgba(255,255,255,0.35)',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '10px',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
          }}
        >
          {!isAudioMuted
            ? <Volume2 size={13} style={{ color: '#00f2fe' }} />
            : <VolumeX size={13} />
          }
          <span className="hidden sm:inline">{!isAudioMuted ? 'AUDIO ON' : 'MUTED'}</span>
        </button>
      </div>
    </div>
  );
}
