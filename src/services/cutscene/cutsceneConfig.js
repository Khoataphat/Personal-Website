/**
 * CUTSCENE_CONFIG
 * Centralized Configuration Hub for the 5.2s Epic Anime / Movie Cutscene Engine.
 *
 * You can customize and tweak every parameter of each transition phase here:
 * - Durations (seconds)
 * - Camera coordinates & Lerp Speeds
 * - Camera Shake amplitude & decay
 * - Dynamic FOV Punch
 * - Singularity Core Scales
 * - Bio-mechanical Hand Clench
 * - 3D Glass Fracture Shards & Optical Shockwave
 */

export const CUTSCENE_CONFIG = {
  // ── 1. Phase Durations (Total: 5.2s) ──────────────────────────────
  durations: {
    frenzy: 1.30,   // Phase 1: Spiral acceleration (0.0s – 1.3s)
    absorb: 0.90,   // Phase 2: Core swell & fusion (1.3s – 2.2s)
    clench: 1.40,   // Phase 3: Bullet-time slow-mo clench (2.2s – 3.6s)
    crush: 0.90,    // Phase 4: Supernova burst & fracture (3.6s – 4.5s)
    reveal: 0.70,   // Phase 5: Camera recoil & dossier unveil (4.5s – 5.2s)
  },

  // ── 2. Phase 1: Frenzy Spiral Parameters ──────────────────────────
  frenzy: {
    spiralLoops: 3.0,          // Number of graceful spiral loops around hand
    speedMultiplier: 8.0,      // Max angular speed acceleration
    speedExponent: 1.4,        // Acceleration curve exponent
    inclinationAmp: 0.45,      // Wave oscillation amplitude
    minSpiralScale: 0.01,      // Target card minimum scale at point of entry
    fadeCardExponent: 1.4,     // Non-target cards fade curve exponent
    fadeCardMultiplier: 1.3,   // Non-target cards fade speed
  },

  // ── 3. Phase 2: Core Absorption & Fusion Parameters ───────────────
  absorb: {
    peakCoreScale: 1.95,       // Maximum swell multiplier
    colorInterpolationSpeed: 4.5,
  },

  // ── 4. Phase 3: Bullet-Time Slow-Mo Clench Parameters ─────────────
  clench: {
    minCoreScale: 0.12,        // Micro-singularity compressed scale
    camera: {
      radius: 1.34,            // Close-up dramatic zoom distance
      phi: Math.PI * 0.52,     // Elevation angle
      theta: -0.08,            // Azimuth angle
      targetY: -0.14,          // LookAt Y offset (centers the hand)
      speedFactor: 4.5,        // Camera lerp speed
    },
    vignette: {
      innerRadius: 140,        // Spotlight transparent radius (px)
      midRadius: 450,          // Darkness transition radius (px)
      midAlpha: 0.78,          // Mid vignette opacity
      edgeAlpha: 0.92,         // Screen edge darkness
    },
  },

  // ── 5. Phase 4: Supernova Hand Crush Parameters ───────────────────
  crush: {
    flashBurstScale: 0.65,     // Core explosion flare scale
    camera: {
      radius: 1.45,
      phi: Math.PI * 0.51,
      theta: -0.05,
      targetY: -0.10,
    },
    cameraShake: {
      intensity: 0.048,        // Trauma shake base magnitude
      decayExponent: 1.8,      // Shake decay curve
    },
    fovPunch: {
      maxPunch: 6.5,           // FOV reduction in degrees (45° -> 38.5°)
    },
    shockwave: {
      durationMs: 880,
      maxRadiusMultiplier: 1.6,
      flashAlpha: 0.85,
    },
    glassFracture: {
      numShards: 128,
      durationMs: 1350,
      zDispersalMin: 350,
      zDispersalMax: 1450,
    },
  },

  // ── 6. Phase 5: Dossier Reveal Parameters ─────────────────────────
  reveal: {
    camera: {
      desktop: {
        radius: 2.05,
        phi: Math.PI * 0.50,
        theta: 0.0,
        targetY: 0.05,
        shiftXRatio: -0.265,   // -26.5% viewport width for Split Stage
      },
      mobile: {
        radius: 2.45,
        phi: Math.PI * 0.51,
        theta: -0.10,
        targetY: 0.18,
        shiftXRatio: 0,
      },
    },
  },
};
