import React, { useEffect, useState } from 'react';
import { useCockpitStore } from '../../store/cockpitStore';

const VERTICAL_INDICATORS = ['01', '02', '03', '04', '05'];
const SECTION_LABELS = ['ABOUT', 'SKILLS', 'WORK', 'BLOG', 'CONTACT'];

/**
 * HeroTypography
 *
 * Implements Cinematic Depth Layering:
 *   1. Massive background typography ("UNLOCK YOUR REALITY") positioned behind
 *      the 3D avatar bust, creating deep space parallax.
 *   2. Minimalist foreground overlay with subtle indicators, subtitle, and scroll hint.
 */
export function HeroTypography() {
  const [mounted, setMounted] = useState(false);
  const activeCard = useCockpitStore((s) => s.activeCard);
  const setActiveCard = useCockpitStore((s) => s.setActiveCard);
  const setIsCardExpanded = useCockpitStore((s) => s.setIsCardExpanded);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleIndicatorClick = (i) => {
    setActiveCard(i);
    setIsCardExpanded(true);
  };

  return (
    <>
      {/* ── 1. BACKGROUND DEPTH TYPOGRAPHY (Rendered behind the 3D Model) ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center select-none overflow-hidden"
        style={{
          fontFamily: "'Share Tech Mono', 'Courier New', monospace",
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            transform: 'translateY(-6%) scale(1.05)',
            letterSpacing: '-2px',
            lineHeight: 0.9,
          }}
        >
          <div
            style={{
              fontSize: 'clamp(55px, 12vw, 190px)',
              fontWeight: '900',
              textTransform: 'uppercase',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(0, 242, 254, 0.12)',
              textShadow: '0 0 40px rgba(0, 242, 254, 0.04)',
              marginBottom: '10px',
            }}
          >
            UNLOCK YOUR
          </div>
          <div
            style={{
              fontSize: 'clamp(55px, 12vw, 190px)',
              fontWeight: '900',
              textTransform: 'uppercase',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(121,40,202,0.04) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '1px rgba(121, 40, 202, 0.15)',
            }}
          >
            REALITY
          </div>
        </div>
      </div>

      {/* ── 2. FOREGROUND HUD OVERLAY ────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-20 pointer-events-none select-none"
        style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
      >
        {/* Left Subtitle & Bio Badge */}
        <div
          style={{
            position: 'absolute',
            left: '4%',
            bottom: '12%',
            maxWidth: '380px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              letterSpacing: '3px',
              color: '#00f2fe',
              marginBottom: '8px',
              opacity: 0.85,
              textShadow: '0 0 10px rgba(0,242,254,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f2fe', display: 'inline-block' }} />
            <span>OPERATOR // DANG KHOA</span>
          </div>

          <p
            style={{
              fontSize: '11px',
              letterSpacing: '2px',
              color: 'rgba(255,255,255,0.65)',
              margin: 0,
              marginBottom: '14px',
              lineHeight: 1.6,
            }}
          >
            EXPLORE BEYOND THE MASK OF COGNITION · FULL-STACK & IOT CREATIVE DEV
          </p>

          <div
            style={{
              width: '60px',
              height: '1.5px',
              background: 'linear-gradient(90deg, #00f2fe, #7928ca)',
              borderRadius: '2px',
              boxShadow: '0 0 8px rgba(0,242,254,0.6)',
            }}
          />
        </div>

        {/* Right Vertical Step Indicators */}
        <div
          style={{
            position: 'absolute',
            right: '2%',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 1s ease 0.4s',
            pointerEvents: 'auto',
          }}
        >
          {VERTICAL_INDICATORS.map((num, i) => {
            const isActive = activeCard === i;
            return (
              <button
                key={i}
                onClick={() => handleIndicatorClick(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '3px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'flex-end',
                }}
              >
                <span
                  style={{
                    fontSize: '8px',
                    letterSpacing: '1px',
                    color: isActive ? '#00f2fe' : 'rgba(255,255,255,0.25)',
                    transition: 'color 0.3s',
                    fontFamily: 'inherit',
                  }}
                >
                  {isActive ? SECTION_LABELS[i] : num}
                </span>
                <div
                  style={{
                    width: isActive ? '22px' : '5px',
                    height: '2px',
                    background: isActive ? '#00f2fe' : 'rgba(255,255,255,0.18)',
                    borderRadius: '2px',
                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                    boxShadow: isActive ? '0 0 8px rgba(0,242,254,0.7)' : 'none',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Bottom Orbit Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '3%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '8px',
            letterSpacing: '3px',
            color: 'rgba(255,255,255,0.25)',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 1.2s ease 0.6s',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <div
            style={{
              width: '1px',
              height: '18px',
              background: 'linear-gradient(180deg, transparent, rgba(0,242,254,0.4))',
              margin: '0 auto',
            }}
          />
          <span>PLANETARY ORBIT RING ACTIVE</span>
        </div>
      </div>
    </>
  );
}
