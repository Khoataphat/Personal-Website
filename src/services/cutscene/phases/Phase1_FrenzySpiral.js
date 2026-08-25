import { TransitionPhase } from '../TransitionPhase';
import { CUTSCENE_CONFIG } from '../cutsceneConfig';

/**
 * Phase1_FrenzySpiral
 *
 * Phase 1 (0.0s – 1.3s):
 * - Target card accelerates in 2-3 graceful escalating vortex loops around the avatar's hand.
 * - Other 4 cards gently expand out and fade into the dark void.
 * - Singularity Core remains stable at 1.0x.
 * - Plays Stereo Plasma Vortex Whoosh sound.
 */
export class Phase1_FrenzySpiral extends TransitionPhase {
  constructor(customConfig = {}) {
    const config = { ...CUTSCENE_CONFIG.frenzy, ...customConfig };
    super('frenzy', CUTSCENE_CONFIG.durations.frenzy, config);
  }

  enter(context) {
    super.enter(context);
    this.triggerAudio('playFrenzyWhoosh');
  }

  update(progress, elapsed, delta, context) {
    this.triggerAudio('playFrenzyWhoosh');

    const p = Math.min(1, Math.max(0, progress));
    const t = context.time || 0;
    const cfg = this.config;

    return {
      phase: this.name,
      progress: p,
      elapsed,
      coreScale: 1.0,
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
      // Target card spiral calculation function
      calculateTargetCard: (orbit, baseScale) => {
        const spiralSpeed = orbit.speed * (1.0 + cfg.speedMultiplier * Math.pow(p, cfg.speedExponent));
        const rotY = t * spiralSpeed + orbit.initialAngle;
        const rotX = orbit.inclination[0] + Math.sin(p * Math.PI * cfg.spiralLoops) * p * cfg.inclinationAmp;
        const rotZ = orbit.inclination[2] + Math.cos(p * Math.PI * cfg.spiralLoops) * p * cfg.inclinationAmp;
        const spiralScale = Math.max(cfg.minSpiralScale, 1.0 - Math.pow(p, 3.0) * 0.85);

        return {
          rotation: { x: rotX, y: rotY, z: rotZ },
          scale: baseScale * spiralScale,
          visible: true,
        };
      },
      // Other 4 cards fade calculation function
      calculateOtherCard: (orbit, baseScale) => {
        const rotY = t * orbit.speed + orbit.initialAngle;
        const fadeScale = Math.max(0.0001, 1.0 - Math.pow(p, cfg.fadeCardExponent) * cfg.fadeCardMultiplier);

        return {
          rotation: { x: orbit.inclination[0], y: rotY, z: orbit.inclination[2] },
          scale: baseScale * fadeScale,
          visible: fadeScale > 0.001,
        };
      },
    };
  }
}
