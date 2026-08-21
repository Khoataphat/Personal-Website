import React, { useEffect, useState } from 'react';
import { useCockpitStore } from '../../store/cockpitStore';

const VERTICAL_INDICATORS = ['01', '02', '03', '04', '05'];
const SECTION_LABELS = ['ABOUT', 'SKILLS', 'WORK', 'BLOG', 'CONTACT'];

/**
 * HeroTypography
 *
 * Left-side hero text overlay with:
 *   - Main title: "UNLOCK YOUR REALITY" in gradient text
 *   - Sub-heading: "EXPLORE BEYOND THE MASK OF COGNITION"
 *   - Vertical scroll/section indicators on the right edge of the text block
 *   - Active section label indicator
 *
 * Positioned absolutely over the 3D canvas, pointer-events: none except for
 * the interactive section indicators which snap the disc.
 */
export function HeroTypography() {
  const [mounted, setMounted] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const activeCard = useCockpitStore((s) => s.activeCard);

  // Entrance animation trigger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Occasional glitch on title
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 120);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleIndicatorClick = (i) => {
    if (typeof window !== 'undefined' && window.snapToDiscCard) {
      window.snapToDiscCard(i);
    }
  };

  return (
    <div
      className="fixed inset-0 z-30 pointer-events-none"
      style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
    >
      {/* Main text content — bottom-left quadrant */}
      <div
        style={{
          position: 'absolute',
          left: '5%',
          bottom: '18%',
          maxWidth: '42%',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Tag line */}
        <div style={{
          fontSize: '9px',
          letterSpacing: '4px',
          color: '#00f2fe',
          marginBottom: '10px',
          opacity: 0.8,
          textShadow: '0 0 8px rgba(0,242,254,0.5)',
        }}>
          ⬡ OPERATOR PROFILE · SYSTEM ONLINE
        </div>

        {/* Main H1 Title */}
        <h1
          style={{
            fontSize: 'clamp(28px, 4.5vw, 62px)',
            fontWeight: '900',
            lineHeight: 1.05,
            margin: 0,
            marginBottom: '14px',
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #ffffff 20%, #00f2fe 60%, #7928ca 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: glitchActive
              ? 'hue-rotate(180deg) brightness(1.5)'
              : 'none',
            transition: 'filter 0.05s',
          }}
        >
          UNLOCK YOUR<br />REALITY
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(9px, 1.2vw, 12px)',
          letterSpacing: '2.5px',
          color: 'rgba(255,255,255,0.55)',
          margin: 0,
          marginBottom: '22px',
          lineHeight: 1.8,
        }}>
          EXPLORE BEYOND THE MASK OF COGNITION
        </p>

        {/* Thin cyan accent bar */}
        <div style={{
          width: '80px',
          height: '2px',
          background: 'linear-gradient(90deg, #00f2fe, #7928ca)',
          borderRadius: '2px',
          boxShadow: '0 0 10px rgba(0,242,254,0.5)',
        }} />
      </div>

      {/* Vertical section indicators — right side */}
      <div
        style={{
          position: 'absolute',
          right: '2.5%',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease 0.4s',
          pointerEvents: 'auto', // clickable
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
              <span style={{
                fontSize: '8px',
                letterSpacing: '1px',
                color: isActive ? '#00f2fe' : 'rgba(255,255,255,0.2)',
                transition: 'color 0.3s',
                fontFamily: 'inherit',
              }}>
                {isActive ? SECTION_LABELS[i] : num}
              </span>
              <div style={{
                width: isActive ? '24px' : '6px',
                height: '2px',
                background: isActive ? '#00f2fe' : 'rgba(255,255,255,0.15)',
                borderRadius: '2px',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: isActive ? '0 0 8px rgba(0,242,254,0.7)' : 'none',
              }} />
            </button>
          );
        })}
      </div>

      {/* Bottom scroll hint */}
      <div style={{
        position: 'absolute',
        bottom: '4%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '8px',
        letterSpacing: '3px',
        color: 'rgba(255,255,255,0.2)',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 1.2s ease 0.8s',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}>
        <div style={{
          width: '1px',
          height: '24px',
          background: 'linear-gradient(180deg, transparent, rgba(0,242,254,0.4))',
          margin: '0 auto',
        }} />
        SCROLL OR DRAG TO ORBIT
      </div>
    </div>
  );
}
