import { TransitionPhase } from '../TransitionPhase';
import { CUTSCENE_CONFIG } from '../cutsceneConfig';

/**
 * Phase3_BulletTimeClench
 *
 * Phase 3 (2.2s – 3.6s - 1.4s Bullet Time):
 * - Camera performs Dramatic Dolly-In Close-Up onto the Hand & Core.
 * - Surrounding environment darkens with Spotlight Darkness Vignette.
 * - The Singularity Core intensely super-compresses into a micro-singularity (0.12x).
 * - Bio-mechanical vertex shader closes avatar fingers tightly around the core.
 * - Plays 40Hz Sub-Bass Tension Drone + Mechanical Torque Groan + Electric Arc Sparks.
 */
export class Phase3_BulletTimeClench extends TransitionPhase {
  constructor(customConfig = {}) {
    const config = { ...CUTSCENE_CONFIG.clench, ...customConfig };
    super('clench', CUTSCENE_CONFIG.durations.clench, config);
  }

  enter(context) {
    super.enter(context);
    this.triggerAudio('playHandClench');
  }

  update(progress, elapsed, delta, context) {
    this.triggerAudio('playHandClench');

    const p = Math.min(1, Math.max(0, progress));
    const smoothP = this.smoothstep(p, 0.0, 1.0);
    const cfg = this.config;

    // Core super-compresses from swell size down to micro-singularity bead
    const coreScale = this.lerp(CUTSCENE_CONFIG.absorb.peakCoreScale, cfg.minCoreScale, smoothP);

    // Hand clench smooth progression [0..1]
    const handClench = smoothP;

    return {
      phase: this.name,
      progress: p,
      elapsed,
      coreScale,
      handClench,
      vignette: {
        active: true,
        opacity: smoothP,
        config: cfg.vignette,
      },
      shockwave: {
        active: false,
      },
      camera: {
        radius: cfg.camera.radius,
        phi: cfg.camera.phi,
        theta: cfg.camera.theta,
        targetY: cfg.camera.targetY,
        targetShiftX: 0,
        shakeOffset: { x: 0, y: 0, z: 0 },
        fov: 45,
        speedFactor: cfg.camera.speedFactor || 4.5,
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
