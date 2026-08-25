import { TransitionPhase } from '../TransitionPhase';
import { CUTSCENE_CONFIG } from '../cutsceneConfig';

/**
 * Phase2_CoreAbsorb
 *
 * Phase 2 (1.3s – 2.2s):
 * - All cards are absorbed into the singularity nucleus (scale 0.0001).
 * - The Singularity Core swells dramatically to 1.95x with plasma accretion glow.
 * - Core shifts to the target tab's accent color.
 * - Plays Grand Harmonic Energy Chord & Bell Chime sound.
 */
export class Phase2_CoreAbsorb extends TransitionPhase {
  constructor(customConfig = {}) {
    const config = { ...CUTSCENE_CONFIG.absorb, ...customConfig };
    super('absorb', CUTSCENE_CONFIG.durations.absorb, config);
  }

  enter(context) {
    super.enter(context);
    this.triggerAudio('playCoreAbsorb');
  }

  update(progress, elapsed, delta, context) {
    this.triggerAudio('playCoreAbsorb');

    const p = Math.min(1, Math.max(0, progress));
    const cfg = this.config;

    // Sinusoidal swell curve (peaks at p = 0.5)
    const swellMultiplier = 1.0 + Math.sin(p * Math.PI) * (cfg.peakCoreScale - 1.0);

    return {
      phase: this.name,
      progress: p,
      elapsed,
      coreScale: swellMultiplier,
      handClench: 0.0,
      vignette: {
        active: false,
        opacity: 0,
      },
      shockwave: {
        active: false,
      },
      camera: {
        radius: 1.78,
        phi: Math.PI * 0.53,
        theta: -0.16,
        targetY: -0.02,
        targetShiftX: 0,
        shakeOffset: { x: 0, y: 0, z: 0 },
        fov: 45,
        speedFactor: 5.5,
      },
      calculateTargetCard: (orbit, baseScale) => ({
        rotation: { x: orbit.inclination[0], y: 0, z: orbit.inclination[2] },
        scale: 0.0001,
        visible: false,
      }),
      calculateOtherCard: (orbit, baseScale) => ({
        rotation: { x: orbit.inclination[0], y: 0, z: orbit.inclination[2] },
        scale: 0.0001,
        visible: false,
      }),
    };
  }
}
