import React from 'react';
import { useCockpitStore } from './store/cockpitStore';
import { HeroCosmicScene } from './components/hero/HeroCosmicScene';
import { HeroTopNav } from './components/hero/HeroTopNav';
import { HeroBackgroundTypography, HeroForegroundHUD } from './components/hero/HeroTypography';
import { CyberHUDIndexRail } from './components/common/CyberHUDIndexRail';
import { CyberMatrixPortalOverlay } from './components/common/CyberMatrixPortalOverlay';
import { ScrolltellingView } from './components/sections/ScrolltellingView';
import { ProjectDeepDiveModal } from './components/cockpit/ProjectDeepDiveModal';
import BlogModal from './components/common/BlogModal';
import PdfViewerModal from './components/common/PdfViewerModal';

export default function App() {
  const pageMode = useCockpitStore((s) => s.pageMode);
  const activeBlogModal = useCockpitStore((s) => s.activeBlogModal);
  const closeBlogModal = useCockpitStore((s) => s.closeBlogModal);
  const activePdfUrl = useCockpitStore((s) => s.activePdfUrl);
  const closePdfModal = useCockpitStore((s) => s.closePdfModal);

  const isHeroMode = pageMode === 'hero';
  const isStorytellingMode = pageMode === 'storytelling';

  return (
    <div className={`relative w-screen bg-[#070709] text-text-main ${isHeroMode ? 'h-[100dvh] min-h-[100dvh] overflow-hidden select-none' : 'min-h-screen overflow-x-hidden'}`}>

      {/* ── 1. Top Navigation & Cyber HUD Index Rail (Index rail only in Storytelling) ──── */}
      <HeroTopNav />
      {isStorytellingMode && <CyberHUDIndexRail />}

      {/* ── 2. Hero 3D Sovereign View (Rendered only in Hero / Transition mode) ── */}
      <div
        className={`fixed inset-0 w-full h-full z-10 transition-opacity duration-500 ${
          isHeroMode || pageMode === 'transitioning' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none hidden'
        }`}
      >
        <HeroBackgroundTypography />
        <HeroCosmicScene />
        <HeroForegroundHUD />
      </div>

      {/* ── 3. Continuous Full-Page Scrolltelling View ────────────────── */}
      {isStorytellingMode && (
        <div className="relative w-full z-20 animate-fadeIn">
          <ScrolltellingView />
        </div>
      )}

      {/* ── 4. Independent Cyber Shutter / Matrix Portal Transition ──── */}
      <CyberMatrixPortalOverlay />

      {/* ── 5. Project Deep Dive, Blog & PDF Modals ──────────────────── */}
      <ProjectDeepDiveModal />

      <BlogModal
        isOpen={Boolean(activeBlogModal)}
        onClose={closeBlogModal}
        blog={activeBlogModal}
      />

      <PdfViewerModal
        isOpen={Boolean(activePdfUrl)}
        onClose={closePdfModal}
        pdfUrl={activePdfUrl}
      />
    </div>
  );
}
