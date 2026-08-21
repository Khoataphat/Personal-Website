import React, { useEffect } from 'react';
import { useCockpitStore } from '../../store/cockpitStore';
import { PanelContentAbout } from '../cockpit/panels/PanelContentAbout';
import { PanelContentSkills } from '../cockpit/panels/PanelContentSkills';
import { PanelContentProjects } from '../cockpit/panels/PanelContentProjects';
import { PanelContentBlog } from '../cockpit/panels/PanelContentBlog';
import { PanelContentContact } from '../cockpit/panels/PanelContentContact';

const PANEL_COMPONENTS = [
  PanelContentAbout,
  PanelContentSkills,
  PanelContentProjects,
  PanelContentBlog,
  PanelContentContact,
];

const PANEL_META = [
  { label: 'ABOUT',    accent: '#00f2fe', icon: '◈' },
  { label: 'SKILLS',   accent: '#00ff88', icon: '⬡' },
  { label: 'PROJECTS', accent: '#7928ca', icon: '◎' },
  { label: 'BLOG',     accent: '#ff8c00', icon: '✦' },
  { label: 'CONTACT',  accent: '#f72585', icon: '⬟' },
];

/**
 * ExpandedDetailModal
 *
 * Full-screen DOM overlay that renders the detailed panel content when a card
 * is clicked on the AccretionDiscOrbit. Animates in/out with CSS transitions.
 * Pressing Escape or clicking the backdrop closes the modal.
 */
export function ExpandedDetailModal() {
  const activeCard = useCockpitStore((s) => s.activeCard);
  const isCardExpanded = useCockpitStore((s) => s.isCardExpanded);
  const setIsCardExpanded = useCockpitStore((s) => s.setIsCardExpanded);
  const setActiveCard = useCockpitStore((s) => s.setActiveCard);

  const isOpen = isCardExpanded && activeCard !== null;

  const handleClose = () => {
    setIsCardExpanded(false);
    setActiveCard(null);
  };

  // Escape key closes modal
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  if (!isOpen || activeCard === null) return null;

  const meta = PANEL_META[activeCard] ?? PANEL_META[0];
  const PanelContent = PANEL_COMPONENTS[activeCard] ?? PANEL_COMPONENTS[0];

  return (
    <div
      className="hero-card-modal fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={handleClose} // click backdrop = close
    >
      <div
        onClick={(e) => e.stopPropagation()} // prevent backdrop close inside panel
        style={{
          width: 'min(92vw, 780px)',
          maxHeight: '85vh',
          background: 'rgba(8, 8, 18, 0.95)',
          border: `1.5px solid ${meta.accent}55`,
          borderRadius: '16px',
          boxShadow: `0 0 60px ${meta.accent}33, 0 0 20px rgba(0,0,0,0.8)`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'expandIn 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* ── Header Bar ────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: `1px solid ${meta.accent}33`,
          background: `linear-gradient(90deg, ${meta.accent}11 0%, transparent 100%)`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '20px',
              color: meta.accent,
              textShadow: `0 0 12px ${meta.accent}`,
            }}>
              {meta.icon}
            </span>
            <span style={{
              fontFamily: "'Share Tech Mono', 'Courier New', monospace",
              fontSize: '13px',
              fontWeight: 'bold',
              letterSpacing: '3px',
              color: meta.accent,
              textShadow: `0 0 8px ${meta.accent}`,
            }}>
              {meta.label}
            </span>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '1px',
              marginLeft: '4px',
            }}>
              {`// SYSTEM 0${(activeCard ?? 0) + 1} ACTIVE`}
            </span>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.7)',
              padding: '5px 12px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '11px',
              letterSpacing: '1px',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = meta.accent + '88';
              e.target.style.color = meta.accent;
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.12)';
              e.target.style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            [ESC] CLOSE
          </button>
        </div>

        {/* ── Content Area ─────────────────────────────────────── */}
        <div
          className="overflow-y-auto"
          style={{
            flex: 1,
            padding: '20px',
            color: '#f8fafc',
          }}
        >
          <PanelContent />
        </div>
      </div>
    </div>
  );
}
