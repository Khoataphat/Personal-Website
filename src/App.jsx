import React from 'react';
import { useCockpitStore } from './store/cockpitStore';
import { HeroCosmicScene } from './components/hero/HeroCosmicScene';
import { HeroTopNav } from './components/hero/HeroTopNav';
import { HeroBackgroundTypography, HeroForegroundHUD } from './components/hero/HeroTypography';
import { EditorialDossier } from './components/editorial/EditorialDossier';
import { ExpandedDetailModal } from './components/hero/ExpandedDetailModal';
import { ProjectDeepDiveModal } from './components/cockpit/ProjectDeepDiveModal';
import BlogModal from './components/common/BlogModal';
import PdfViewerModal from './components/common/PdfViewerModal';
import CustomCursor from './components/common/CustomCursor';

export default function App() {
  const activeBlogModal = useCockpitStore((s) => s.activeBlogModal);
  const closeBlogModal = useCockpitStore((s) => s.closeBlogModal);
  const activePdfUrl = useCockpitStore((s) => s.activePdfUrl);
  const closePdfModal = useCockpitStore((s) => s.closePdfModal);

  return (
    <div className="relative w-screen h-screen bg-[#070709] text-text-main overflow-hidden select-none">
      {/* Custom Cyber Cursor */}
      <CustomCursor />

      {/* ── 1. Background Typography (Layer 1: z-0 behind 3D Canvas) ── */}
      <HeroBackgroundTypography />

      {/* ── 2. 3D Hero Cosmic Scene (Layer 2: z-10 Canvas) ──────────── */}
      <HeroCosmicScene />

      {/* ── 3. Foreground HUD Overlays (Layer 3: z-20/z-30) ─────────── */}
      <HeroTopNav />
      <HeroForegroundHUD />

      {/* ── 4. Minimalist Dark Editorial Dossier (Layer 4: z-50 Fullscreen) ─ */}
      <EditorialDossier />

      {/* Expanded Section Card Detail Modal */}
      <ExpandedDetailModal />

      {/* ── Legacy Content Modals (kept for card detail content) */}
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
