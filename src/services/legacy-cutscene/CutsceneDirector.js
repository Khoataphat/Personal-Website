import { useCockpitStore } from '../../store/cockpitStore';
import { CUTSCENE_CONFIG } from './cutsceneConfig';
import { Phase1_FrenzySpiral } from './phases/Phase1_FrenzySpiral';
import { Phase2_CoreAbsorb } from './phases/Phase2_CoreAbsorb';
import { Phase3_BulletTimeClench } from './phases/Phase3_BulletTimeClench';
import { Phase4_SupernovaCrush } from './phases/Phase4_SupernovaCrush';
import { Phase5_DossierReveal } from './phases/Phase5_DossierReveal';

/**
 * CutsceneDirector (State & Strategy Pattern Orchestrator)
 *
 * Manages the sequencing, timeline progression, and frame state evaluation
 * for all 5 Cutscene Phases:
 * 1. Frenzy Spiral
 * 2. Core Fusion & Swell
 * 3. Bullet-Time Clench
 * 4. Supernova Hand Crush
 * 5. Dossier Reveal
 */
export class CutsceneDirector {
  constructor(customConfigs = {}) {
    this.phases = [
      new Phase1_FrenzySpiral(customConfigs.frenzy),
      new Phase2_CoreAbsorb(customConfigs.absorb),
      new Phase3_BulletTimeClench(customConfigs.clench),
      new Phase4_SupernovaCrush(customConfigs.crush),
      new Phase5_DossierReveal(customConfigs.reveal),
    ];

    this.active = false;
    this.startTime = null;
    this.currentPhaseIndex = -1;
    this.context = {
      targetTab: 0,
      accentColor: '#00f2fe',
      time: 0,
    };

    this.lastFrameState = null;
  }

  /**
   * Total duration of all sequenced phases combined.
   */
  get totalDuration() {
    return this.phases.reduce((sum, p) => sum + p.duration, 0);
  }

  /**
   * Starts a new cinematic cutscene sequence.
   */
  start(targetTab = 0, accentColor = '#00f2fe') {
    this.active = true;
    this.startTime = null;
    this.currentPhaseIndex = -1;
    this.context = {
      targetTab,
      accentColor,
      time: 0,
    };
    this.lastFrameState = null;
  }

  /**
   * Evaluates the current frame and returns a unified FrameState object.
   * @param {number} time - Global Three.js clock time (seconds).
   * @param {number} delta - Delta time in seconds.
   * @param {Object} overrideContext - Optional overrides for targetTab or accentColor.
   * @returns {Object|null} FrameState
   */
  update(time, delta, overrideContext = {}) {
    if (!this.active) {
      return null;
    }

    if (this.startTime === null) {
      this.startTime = time;
      this.currentPhaseIndex = 0;
      this.phases[0].enter(this.context);
    }

    this.context = {
      ...this.context,
      ...overrideContext,
      time,
    };

    const totalElapsed = time - this.startTime;

    // Check if the entire cutscene has finished
    if (totalElapsed >= this.totalDuration) {
      if (this.currentPhaseIndex >= 0 && this.currentPhaseIndex < this.phases.length) {
        this.phases[this.currentPhaseIndex].exit(this.context);
      }
      this.active = false;
      this.startTime = null;
      this.currentPhaseIndex = -1;
      useCockpitStore.getState().completeHeroTransition();
      return null;
    }

    // Determine current active phase based on accumulated duration
    let accumulatedTime = 0;
    let targetPhaseIndex = 0;
    let phaseElapsed = 0;

    for (let i = 0; i < this.phases.length; i++) {
      const phaseDuration = this.phases[i].duration;
      if (totalElapsed < accumulatedTime + phaseDuration) {
        targetPhaseIndex = i;
        phaseElapsed = totalElapsed - accumulatedTime;
        break;
      }
      accumulatedTime += phaseDuration;
    }

    // Handle phase transitions (exit old, enter new)
    if (targetPhaseIndex !== this.currentPhaseIndex) {
      if (this.currentPhaseIndex >= 0 && this.currentPhaseIndex < this.phases.length) {
        this.phases[this.currentPhaseIndex].exit(this.context);
      }
      this.currentPhaseIndex = targetPhaseIndex;
      this.phases[this.currentPhaseIndex].enter(this.context);
    }

    const currentPhase = this.phases[this.currentPhaseIndex];
    const phaseProgress = Math.min(1, Math.max(0, phaseElapsed / currentPhase.duration));

    // Evaluate FrameState from active phase class
    const frameState = currentPhase.update(phaseProgress, phaseElapsed, delta, this.context);

    // Sync state with cockpitStore for HUD, Dossier and UI overlays
    useCockpitStore.getState().updateHeroTransition({
      phase: frameState.phase,
      progress: frameState.progress,
      totalProgress: totalElapsed / this.totalDuration,
    });

    this.lastFrameState = frameState;
    return frameState;
  }

  /**
   * Fast-forwards / skips the cutscene immediately.
   */
  skip() {
    if (!this.active) return;
    if (this.currentPhaseIndex >= 0 && this.currentPhaseIndex < this.phases.length) {
      this.phases[this.currentPhaseIndex].exit(this.context);
    }
    this.active = false;
    this.startTime = null;
    this.currentPhaseIndex = -1;
    useCockpitStore.getState().completeHeroTransition();
  }

  /**
   * Update configuration for a specific phase dynamically.
   */
  setPhaseConfig(phaseName, customConfig = {}) {
    const phase = this.phases.find((p) => p.name === phaseName);
    if (phase) {
      phase.config = { ...phase.config, ...customConfig };
    }
  }

  /**
   * Retrieves the current frame state or last computed state.
   */
  getCurrentState() {
    return this.lastFrameState;
  }
}

// Export a singleton director instance for app-wide use
export const cutsceneDirector = new CutsceneDirector();
