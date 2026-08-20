import React from 'react';
import { useCockpitStore } from './store/cockpitStore';
import { CockpitScene } from './components/cockpit/CockpitScene';
import { CockpitHUD } from './components/cockpit/CockpitHUD';
import CustomCursor from './components/common/CustomCursor';

export default function App() {
  const displayMode = useCockpitStore((s) => s.displayMode);

  return (
    <div className="relative w-screen h-screen bg-[#070709] text-text-main overflow-hidden select-none">
      {/* Custom Cyber Cursor */}
      <CustomCursor />

      {/* Cockpit HUD Overlay (Top Telemetry + Bottom Radar & QuickDock) */}
      <CockpitHUD />

      {/* 3D Cybernetic Cockpit Universe */}
      {displayMode === '3d' && (
        <CockpitScene>
          {/* Avatar and specialized interactive modals in Phase 3 & 4 */}
        </CockpitScene>
      )}
    </div>
  );
}


