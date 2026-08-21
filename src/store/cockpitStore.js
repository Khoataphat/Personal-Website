import { create } from 'zustand';

export const useCockpitStore = create((set) => ({
  // Mouse tracking — normalized [-1, 1]
  mouseNorm: { x: 0, y: 0 },
  setMouseNorm: (x, y) => set({ mouseNorm: { x, y } }),

  // Orbit navigation
  activePanel: 0,           // 0=About 1=Skills 2=Projects 3=Blog 4=Contact
  orbitAngle: 0,            // radians — góc xoay orbit hiện tại
  setActivePanel: (i) => set({ activePanel: i }),
  setOrbitAngle: (a) => set({ orbitAngle: a }),

  // Display mode
  displayMode: '3d',        // '3d' | 'crt'
  setDisplayMode: (m) => set({ displayMode: m }),

  // Audio
  isAudioMuted: false,
  toggleMute: () => set((s) => ({ isAudioMuted: !s.isAudioMuted })),

  // Free-Cam Mode (Inspection controls)
  isFreeCamActive: false,
  toggleFreeCam: () => set((s) => ({ isFreeCamActive: !s.isFreeCamActive })),
  setFreeCam: (val) => set({ isFreeCamActive: val }),

  // Telemetry (updated by HUD component)
  telemetry: { fps: 60, latency: 0, utcClock: '' },
  setTelemetry: (t) => set({ telemetry: t }),

  // Modals (Project Deep Dive, Blog, PDF)
  activeProjectModal: null, // project id or null
  activeBlogModal: null,    // blog object or null
  activePdfUrl: null,       // pdf url string or null
  openProjectModal: (id) => set({ activeProjectModal: id }),
  closeProjectModal: () => set({ activeProjectModal: null }),
  openBlogModal: (blog) => set({ activeBlogModal: blog }),
  closeBlogModal: () => set({ activeBlogModal: null }),
  openPdfModal: (url) => set({ activePdfUrl: url }),
  closePdfModal: () => set({ activePdfUrl: null }),

  // ── Hero Cosmic Scene State ──────────────────────────────────────────
  // activeCard: which of the 5 section cards is selected (null = none)
  activeCard: null,
  setActiveCard: (i) => set({ activeCard: i }),

  // isCardExpanded: whether the selected card is blown up into detail modal
  isCardExpanded: false,
  setIsCardExpanded: (v) => set({ isCardExpanded: v }),

  // discAngle: current rotation angle (radians) of the accretion disc orbit
  discAngle: 0,
  setDiscAngle: (a) => set({ discAngle: a }),
}));

// Expose store globally in development mode for easy DevTools inspection
if (typeof window !== 'undefined') {
  window.useCockpitStore = useCockpitStore;
}
