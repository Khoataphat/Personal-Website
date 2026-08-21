import React from 'react';
import { useCockpitStore } from './store/cockpitStore';
import { HeroCosmicScene } from './components/hero/HeroCosmicScene';
import { HeroTopNav } from './components/hero/HeroTopNav';
import { HeroTypography } from './components/hero/HeroTypography';
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

      {/* ── 3D Hero Cosmic Scene (background canvas) ────────── */}
      <HeroCosmicScene />

      {/* ── 2D DOM Overlays ──────────────────────────────────── */}
      {/* Top Navigation Bar */}
      <HeroTopNav />

      {/* Hero Title Typography */}
      <HeroTypography />

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
