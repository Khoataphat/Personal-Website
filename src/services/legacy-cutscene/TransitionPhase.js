import { soundFx } from '../soundFx';

/**
 * TransitionPhase (Abstract Base Class)
 *
 * Defines the standard lifecycle and helper methods for any Cutscene Phase:
 * - enter(context): Invoked once when the phase begins.
 * - update(progress, elapsed, delta, context): Evaluates and returns FrameState.
 * - exit(context): Invoked once when the phase transitions out.
 * - playSound(soundMethodName): Safe one-shot audio trigger helper.
 */
export class TransitionPhase {
  constructor(name, duration, config = {}) {
    if (this.constructor === TransitionPhase) {
      throw new Error('TransitionPhase is an abstract class and cannot be instantiated directly.');
    }
    this.name = name;
    this.duration = duration;
    this.config = config;
    this.hasPlayedAudio = false;
  }

  /**
   * Called once upon entering this phase.
   * @param {Object} context - { targetTab, accentColor, startTime, totalElapsed }
   */
  enter(context) {
    this.hasPlayedAudio = false;
  }

  /**
   * Main evaluation loop called on every animation frame.
   * @param {number} progress - Normalized progress [0..1] within this phase.
   * @param {number} elapsed - Seconds elapsed within this phase.
   * @param {number} delta - Delta time in seconds.
   * @param {Object} context - { targetTab, accentColor, time }
   * @returns {Object} FrameState
   */
  update(progress, elapsed, delta, context) {
    throw new Error(`update() method must be implemented by subclass '${this.name}'`);
  }

  /**
   * Called once upon exiting this phase.
   * @param {Object} context
   */
  exit(context) {
    // Optional cleanup in subclasses
  }

  /**
   * Helper to trigger Web Audio synthesizer safely once per phase entry.
   * @param {Function|string} soundFn - Method on soundFx or function
   */
  triggerAudio(soundMethodName) {
    if (!this.hasPlayedAudio) {
      if (typeof soundMethodName === 'string' && typeof soundFx[soundMethodName] === 'function') {
        soundFx[soundMethodName]();
      } else if (typeof soundMethodName === 'function') {
        soundMethodName();
      }
      this.hasPlayedAudio = true;
    }
  }

  // ── Common Mathematical Easing Utilities ──────────────────────────
  lerp(a, b, t) {
    return a + (b - a) * Math.min(1, Math.max(0, t));
  }

  smoothstep(x, min = 0, max = 1) {
    if (x <= min) return 0;
    if (x >= max) return 1;
    const t = (x - min) / (max - min);
    return t * t * (3 - 2 * t);
  }

  easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }
}
