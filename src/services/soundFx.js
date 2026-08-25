import { useCockpitStore } from '../store/cockpitStore';

class SoundFxService {
  constructor() {
    this.ctx = null;
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  isMuted() {
    return useCockpitStore.getState().isAudioMuted;
  }

  // Sci-fi mechanical click when orbit moves or switches panels
  playPanelSwitch() {
    if (this.isMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.04); // Jump to A6

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext policy fallback
    }
  }

  // Neon chirp when clicking QuickDock buttons
  playDockClick() {
    if (this.isMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext policy fallback
    }
  }

  // Toggle feedback beep
  playToggle() {
    if (this.isMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext policy fallback
    }
  }

  // Sci-fi close whoosh / warp reset
  playClose() {
    if (this.isMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(720, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  // Subtle hover tick
  playHover() {
    if (this.isMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch {}
  }

  // Transmission dispatch sound
  playTransmission() {
    if (this.isMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {}
  }

  // Success chime
  playSuccess() {
    if (this.isMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  // ── Cinematic Transition Audio Synthesizers (5.2s Epic Cutscene) ────
  // 1. Orbital acceleration vortex whoosh (1.3s spool-up turbine & stereo plasma spin)
  playFrenzyWhoosh() {
    if (this.isMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      // Pitch ramp up over 1.25s
      osc1.frequency.setValueAtTime(110, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.25);

      osc2.frequency.setValueAtTime(220, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 1.25);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(250, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3600, ctx.currentTime + 1.25);
      filter.Q.setValueAtTime(4.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.90);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.30);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.30);
      osc2.stop(ctx.currentTime + 1.30);
    } catch {}
  }

  // 2. Singularity core fusion & expansion chord (0.9s grand energy swell)
  playCoreAbsorb() {
    if (this.isMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const chords = [392, 587.33, 880, 1174.66]; // G4, D5, A5, D6
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.85);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), ctx.currentTime + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.90);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + 0.90);
      });
    } catch {}
  }

  // 3. Bio-mechanical servo hand clench & 40Hz tension drone (1.4s Slow-Mo Clench)
  playHandClench() {
    if (this.isMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const subOsc = ctx.createOscillator();
      const servoOsc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      // Deep 40Hz sub-bass tension drone
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(90, ctx.currentTime);
      subOsc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 1.35);

      // Mechanical servo torque strain
      servoOsc.type = 'sawtooth';
      servoOsc.frequency.setValueAtTime(180, ctx.currentTime);
      servoOsc.frequency.linearRampToValueAtTime(75, ctx.currentTime + 1.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(120, ctx.currentTime + 1.35);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.95);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.40);

      subOsc.connect(gain);
      servoOsc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      subOsc.start();
      servoOsc.start();
      subOsc.stop(ctx.currentTime + 1.40);
      servoOsc.stop(ctx.currentTime + 1.40);

      // Electric arc crackles during slow-mo compression
      const crackleTimes = [0.25, 0.45, 0.70, 0.95, 1.15];
      crackleTimes.forEach((delay) => {
        const cOsc = ctx.createOscillator();
        const cGain = ctx.createGain();
        cOsc.type = 'square';
        cOsc.frequency.setValueAtTime(1400 + Math.random() * 800, ctx.currentTime + delay);
        cGain.gain.setValueAtTime(0.03, ctx.currentTime + delay);
        cGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.06);
        cOsc.connect(cGain);
        cGain.connect(ctx.destination);
        cOsc.start(ctx.currentTime + delay);
        cOsc.stop(ctx.currentTime + delay + 0.06);
      });
    } catch {}
  }

  // 4. Glass fracture & shockwave bass blast (Massive impact drop + crystalline glass shower)
  playGlassShatterImpact() {
    if (this.isMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      // Massive cinematic bass impact kick
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(180, ctx.currentTime);
      kickOsc.frequency.exponentialRampToValueAtTime(24, ctx.currentTime + 0.75);
      kickGain.gain.setValueAtTime(0.35, ctx.currentTime);
      kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
      kickOsc.connect(kickGain);
      kickGain.connect(ctx.destination);
      kickOsc.start();
      kickOsc.stop(ctx.currentTime + 0.85);

      // Multi-tone crystalline glass fracture shower (8 harmonic pings)
      const shardPings = [2400, 3100, 3850, 4600, 5400, 6200, 7500, 8800];
      shardPings.forEach((freq, idx) => {
        const shardOsc = ctx.createOscillator();
        const shardGain = ctx.createGain();
        shardOsc.type = 'sine';
        const startT = ctx.currentTime + idx * 0.035;
        shardOsc.frequency.setValueAtTime(freq + Math.random() * 250, startT);
        shardOsc.frequency.exponentialRampToValueAtTime(freq * 0.40, startT + 0.45);

        shardGain.gain.setValueAtTime(0.045, startT);
        shardGain.gain.exponentialRampToValueAtTime(0.001, startT + 0.50);

        shardOsc.connect(shardGain);
        shardGain.connect(ctx.destination);

        shardOsc.start(startT);
        shardOsc.stop(startT + 0.50);
      });
    } catch {}
  }
}

export const soundFx = new SoundFxService();
