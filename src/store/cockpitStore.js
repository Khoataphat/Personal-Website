import { create } from 'zustand';
import { cutsceneDirector } from '../services/cutscene';

export const SECTION_THEMES = [
  { id: 0, label: 'ABOUT',   accent: '#00f2fe', secondary: '#818cf8', rgb: [0, 242, 254], name: 'Ice Cyan' },
  { id: 1, label: 'SKILLS',  accent: '#00ff88', secondary: '#00e5ff', rgb: [0, 255, 136], name: 'Neon Emerald' },
  { id: 2, label: 'WORK',    accent: '#a855f7', secondary: '#ec4899', rgb: [168, 85, 247], name: 'Quantum Purple' },
  { id: 3, label: 'BLOG',    accent: '#f59e0b', secondary: '#ef4444', rgb: [245, 158, 11], name: 'Solar Amber' },
  { id: 4, label: 'CONTACT', accent: '#f43f5e', secondary: '#a855f7', rgb: [244, 63, 94], name: 'Cosmic Rose' },
];

export const useCockpitStore = create((set) => ({
  // Mouse tracking — normalized [-1, 1]
  mouseNorm: { x: 0, y: 0 },
  isMouseActive: false,
  setMouseNorm: (x, y) => set({ mouseNorm: { x, y }, isMouseActive: true }),
  setMouseInactive: () => set({ isMouseActive: false }),

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

  // ── Minimalist Dark Editorial Dossier State ──────────────────────────
  isDossierOpen: false,
  activeDossierTab: 0, // 0=About, 1=Skills, 2=Work, 3=Blog, 4=Contact
  activeThemeAccent: '#00f2fe',
  activeThemeSecondary: '#818cf8',
  orbScreenPos: { x: 0, y: 0 },
  setOrbScreenPos: (pos) => set({ orbScreenPos: pos }),
  orbWorldPos: { x: 0.0, y: -0.28, z: 0.42 },
  setOrbWorldPos: (pos) => set({ orbWorldPos: pos }),

  // ── Cinematic Hero-to-Dossier Hand Crush Transition System ─────────
  heroTransition: {
    active: false,
    phase: 'idle', // 'idle' | 'frenzy' | 'absorb' | 'clench' | 'crush' | 'reveal'
    progress: 0,
    targetTab: null,
    accentColor: '#00f2fe',
  },
  startHeroTransition: (tabIndex) => {
    const targetTheme = SECTION_THEMES[tabIndex] || SECTION_THEMES[0];
    cutsceneDirector.start(tabIndex, targetTheme.accent);
    set({
      heroTransition: {
        active: true,
        phase: 'frenzy',
        progress: 0,
        targetTab: tabIndex,
        accentColor: targetTheme.accent,
      },
      activeThemeAccent: targetTheme.accent,
      activeThemeSecondary: targetTheme.secondary,
      isCardExpanded: false,
    });
  },
  updateHeroTransition: (update) => set((s) => ({
    heroTransition: { ...s.heroTransition, ...update },
  })),
  completeHeroTransition: () => {
    const s = useCockpitStore.getState();
    const tabIndex = s.heroTransition.targetTab ?? 0;
    const targetTheme = SECTION_THEMES[tabIndex] || SECTION_THEMES[0];
    set({
      isDossierOpen: true,
      activeDossierTab: tabIndex,
      activeCard: tabIndex,
      activeThemeAccent: targetTheme.accent,
      activeThemeSecondary: targetTheme.secondary,
      heroTransition: {
        active: false,
        phase: 'idle',
        progress: 0,
        targetTab: null,
        accentColor: targetTheme.accent,
      },
    });
  },
  skipHeroTransition: () => {
    cutsceneDirector.skip();
    const s = useCockpitStore.getState();
    const tabIndex = s.heroTransition.targetTab ?? 0;
    const targetTheme = SECTION_THEMES[tabIndex] || SECTION_THEMES[0];
    set({
      isDossierOpen: true,
      activeDossierTab: tabIndex,
      activeCard: tabIndex,
      activeThemeAccent: targetTheme.accent,
      activeThemeSecondary: targetTheme.secondary,
      heroTransition: {
        active: false,
        phase: 'idle',
        progress: 0,
        targetTab: null,
        accentColor: targetTheme.accent,
      },
    });
  },
  openDossier: (tabIndex = 0) => set({
    isDossierOpen: true,
    activeDossierTab: tabIndex,
    activeCard: tabIndex,
    activeThemeAccent: SECTION_THEMES[tabIndex]?.accent || '#00f2fe',
    activeThemeSecondary: SECTION_THEMES[tabIndex]?.secondary || '#818cf8',
    isCardExpanded: false,
  }),
  closeDossier: () => set({
    isDossierOpen: false,
    activeThemeAccent: '#00f2fe',
    activeThemeSecondary: '#818cf8',
    heroTransition: {
      active: false,
      phase: 'idle',
      progress: 0,
      targetTab: null,
      accentColor: '#00f2fe',
    },
  }),
  switchDossierTab: (tabIndex) => set({
    activeDossierTab: tabIndex,
    activeCard: tabIndex,
    activeThemeAccent: SECTION_THEMES[tabIndex]?.accent || '#00f2fe',
    activeThemeSecondary: SECTION_THEMES[tabIndex]?.secondary || '#818cf8',
  }),
}));

// Expose store globally in development mode for easy DevTools inspection
if (typeof window !== 'undefined') {
  window.useCockpitStore = useCockpitStore;
}


