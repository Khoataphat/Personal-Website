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

  // Telemetry (updated by HUD component)
  telemetry: { fps: 60, latency: 0, utcClock: '' },
  setTelemetry: (t) => set({ telemetry: t }),
}));

// Expose store globally in development mode for easy DevTools inspection
if (typeof window !== 'undefined') {
  window.useCockpitStore = useCockpitStore;
}
