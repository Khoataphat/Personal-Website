import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainNodeRef = useRef(null);

  // Synthesize an ambient spatial soundtrack using Web Audio API (Zero external assets needed, pure cinematic sound)
  const startAmbientSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 3);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Low soothing drone chord (C minor ambient: C2, G2, Eb3)
      const frequencies = [65.41, 98.0, 155.56, 196.0];
      const oscs = frequencies.map((freq, index) => {
        const osc = ctx.createOscillator();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const filter = ctx.createBiquadFilter();

        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        if (panner) {
          panner.pan.setValueAtTime(index % 2 === 0 ? -0.4 : 0.4, ctx.currentTime);
          osc.connect(filter).connect(panner).connect(masterGain);
        } else {
          osc.connect(filter).connect(masterGain);
        }

        osc.start();
        return osc;
      });

      oscillatorsRef.current = oscs;
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
    }
  };

  const stopAmbientSound = () => {
    if (gainNodeRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {}
        });
        oscillatorsRef.current = [];
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      }, 1000);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAmbientSound();
      setIsPlaying(false);
    } else {
      startAmbientSound();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? 'Mute Ambient Sound' : 'Play Ambient Soundscape'}
      className={`group relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
        isPlaying
          ? 'bg-primary/10 border-primary/40 text-primary shadow-glow-cyan'
          : 'bg-white/5 border-white/10 text-text-muted hover:border-white/20 hover:text-text-main'
      }`}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4 text-primary animate-pulse" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}

      {/* Soundwave bars animation */}
      <div className="flex items-center gap-0.5 h-3">
        <span
          className={`w-0.5 rounded-full bg-current transition-all ${
            isPlaying ? 'h-3 animate-[pulse_0.8s_ease-in-out_infinite]' : 'h-1'
          }`}
        />
        <span
          className={`w-0.5 rounded-full bg-current transition-all ${
            isPlaying ? 'h-2 animate-[pulse_1.1s_ease-in-out_infinite]' : 'h-1'
          }`}
        />
        <span
          className={`w-0.5 rounded-full bg-current transition-all ${
            isPlaying ? 'h-3.5 animate-[pulse_0.6s_ease-in-out_infinite]' : 'h-1'
          }`}
        />
        <span
          className={`w-0.5 rounded-full bg-current transition-all ${
            isPlaying ? 'h-1.5 animate-[pulse_0.9s_ease-in-out_infinite]' : 'h-1'
          }`}
        />
      </div>

      <span className="text-xs font-mono font-medium tracking-wider uppercase hidden sm:inline-block">
        {isPlaying ? 'Sound ON' : 'Sound'}
      </span>
    </button>
  );
}
