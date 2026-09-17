import { TransitionPhase } from '../TransitionPhase';
import { CUTSCENE_CONFIG } from '../cutsceneConfig';

/**
 * Phase4_SupernovaCrush
 *
 * Phase 4 (3.6s – 4.5s):
 * - Hand crushes the micro-singularity, releasing a Supernova Flash.
 * - Trauma-based Camera Shake & Dynamic FOV Punch (45° -> 38.5° -> 45°).
 * - Fullscreen Chromatic Optical Shockwave wavefront expands across the viewport.
 * - Background kinetic marquee fractures into 128 3D crystal glass shards dispersing into Z-axis.
 * - Plays Massive Sub-Kick Bass Drop + 8-tone Crystalline Glass Shower.
 */
export class Phase4_SupernovaCrush extends TransitionPhase {
  constructor(customConfig = {}) {
    const config = { ...CUTSCENE_CONFIG.crush, ...customConfig };
    super('crush', CUTSCENE_CONFIG.durations.crush, config);
  }

  enter(context) {
    super.enter(context);
    this.triggerAudio('playGlassShatterImpact');
  }

  update(progress, elapsed, delta, context) {
    this.triggerAudio('playGlassShatterImpact');

    const p = Math.min(1, Math.max(0, progress));
    const cfg = this.config;

    // Supernova flash burst scale
    const coreScale = CUTSCENE_CONFIG.clench.minCoreScale + Math.pow(1.0 - p, 2.0) * cfg.flashBurstScale;

    // Hand holds compression then begins easing
    const handClench = 1.0 - p * 0.35;

    // Trauma-based Camera Shake with exponential decay
    const shakeDecay = Math.max(0, 1.0 - p);
    const shakeIntensity = cfg.cameraShake.intensity * Math.pow(shakeDecay, cfg.cameraShake.decayExponent);
    const shakeOffset = {
      x: (Math.random() - 0.5) * shakeIntensity,
      y: (Math.random() - 0.5) * shakeIntensity,
      z: (Math.random() - 0.5) * shakeIntensity,
    };

    // Dynamic FOV Punch (45° -> 38.5° -> 45°)
    const fovPunch = Math.sin(p * Math.PI) * cfg.fovPunch.maxPunch;
    const dynamicFov = 45 - fovPunch;

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
        active: true,
        progress: p,
        config: cfg.shockwave,
      },
      glassFracture: {
        active: true,
        config: cfg.glassFracture,
      },
      camera: {
        radius: cfg.camera.radius,
        phi: cfg.camera.phi,
        theta: cfg.camera.theta,
        targetY: cfg.camera.targetY,
        targetShiftX: 0,
        shakeOffset,
        fov: dynamicFov,
        speedFactor: 6.5,
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
