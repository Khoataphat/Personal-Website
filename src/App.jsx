import React from 'react';
import { useCockpitStore } from './store/cockpitStore';
import { CockpitScene } from './components/cockpit/CockpitScene';
import CustomCursor from './components/common/CustomCursor';

export default function App() {
  const displayMode = useCockpitStore((s) => s.displayMode);

  return (
    <div className="relative w-screen h-screen bg-[#070709] text-text-main overflow-hidden select-none">
      {/* Custom Cyber Cursor */}
      <CustomCursor />

      {/* 3D Cybernetic Cockpit Universe */}
      {displayMode === '3d' && (
        <CockpitScene>
          {/* Future phase components (Orbit ring, Avatar, Interactive Panels) will be injected here */}
        </CockpitScene>
      )}

      {/* Minimal HUD Header Overlay for Phase 1 */}
      <div className="fixed top-6 left-6 z-20 pointer-events-none font-mono text-xs text-primary/80 flex flex-col gap-1 tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>CYBERNETIC COCKPIT v2.0 // PHASE 1: 3D SCENE</span>
        </div>
        <div className="text-[10px] text-text-muted">
          STATUS: MATRIX ONLINE · SHADER PIPELINE ACTIVE · POSTPROCESSING GLOW
        </div>
      </div>
    </div>
  );
}

