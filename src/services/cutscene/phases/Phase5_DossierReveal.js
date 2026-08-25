import { TransitionPhase } from '../TransitionPhase';
import { CUTSCENE_CONFIG } from '../cutsceneConfig';

/**
 * Phase5_DossierReveal
 *
 * Phase 5 (4.5s – 5.2s):
 * - Camera glides back to Split Stage framing (Frustum shift X -26.5%).
 * - Avatar hand smoothly relaxes back to default resting posture.
 * - Singularity Core returns to normal size (1.0x).
 * - Editorial Dossier slides open on the left half of the viewport.
 */
export class Phase5_DossierReveal extends TransitionPhase {
  constructor(customConfig = {}) {
    const config = { ...CUTSCENE_CONFIG.reveal, ...customConfig };
    super('reveal', CUTSCENE_CONFIG.durations.reveal, config);
  }

  enter(context) {
    super.enter(context);
  }

  update(progress, elapsed, delta, context) {
    const p = Math.min(1, Math.max(0, progress));
    const cfg = this.config;
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

    const coreScale = this.lerp(CUTSCENE_CONFIG.clench.minCoreScale, 1.0, p);
    const handClench = (1.0 - p) * 0.65;

    const camSettings = isDesktop ? cfg.camera.desktop : cfg.camera.mobile;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const targetShiftX = camSettings.shiftXRatio * windowWidth * p;

    return {
      phase: this.name,
      progress: p,
      elapsed,
      coreScale,
      handClench,
      vignette: {
        active: false,
        opacity: 0,
      },
      shockwave: {
        active: false,
      },
      camera: {
        radius: camSettings.radius,
        phi: camSettings.phi,
        theta: camSettings.theta,
        targetY: camSettings.targetY,
        targetShiftX,
        shakeOffset: { x: 0, y: 0, z: 0 },
        fov: 45,
        speedFactor: 5.5,
      },
      calculateTargetCard: () => ({
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.0001,
        visible: false,
      }),
      calculateOtherCard: () => ({
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.0001,
        visible: false,
      }),
    };
  }
}
