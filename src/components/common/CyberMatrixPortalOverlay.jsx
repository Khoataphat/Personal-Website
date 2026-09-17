import React, { useEffect, useRef } from 'react';
import { useCockpitStore } from '../../store/cockpitStore';
import { soundFx } from '../../services/soundFx';
import { gsap } from 'gsap';

/**
 * CyberMatrixPortalOverlay
 *
 * Independent Cyber Shutter & Matrix Portal transition engine:
 * - High-tech obsidian shutter plates with dual Cyan & Magenta laser bevels
 * - Real-time Matrix code stream & quantum particle dissolve canvas
 * - Smooth symmetric GSAP orchestration for forward & reverse transitions
 */
export function CyberMatrixPortalOverlay() {
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  const leftBladeRef = useRef(null);
  const rightBladeRef = useRef(null);
  const centerLockRef = useRef(null);
  const scanlineRef = useRef(null);

  const pageMode = useCockpitStore((s) => s.pageMode);
  const transitionDirection = useCockpitStore((s) => s.transitionDirection);
  const completeTransitionToStorytelling = useCockpitStore((s) => s.completeTransitionToStorytelling);
  const completeReturnToHero = useCockpitStore((s) => s.completeReturnToHero);

  // Matrix Particle Cascade Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '010101XYZ0123456789◈⬡◎✦⬟PORTAL::SYSTEM::ACTIVE';
    const fontSize = 14;
    const columns = Math.floor(window.innerWidth / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    const renderMatrix = () => {
      ctx.fillStyle = 'rgba(5, 8, 20, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "Fira Code", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const isCyan = i % 2 === 0;
        ctx.fillStyle = isCyan ? '#00f2fe' : '#f72585';
        ctx.shadowColor = isCyan ? '#00f2fe' : '#f72585';
        ctx.shadowBlur = 8;

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(renderMatrix);
    };

    renderMatrix();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // GSAP Transition Orchestrator
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    if (pageMode !== 'transitioning') {
      return;
    }
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const overlay = overlayRef.current;
    const leftBlade = leftBladeRef.current;
    const rightBlade = rightBladeRef.current;
    const centerLock = centerLockRef.current;
    const scanline = scanlineRef.current;

    if (!overlay || !leftBlade || !rightBlade) {
      isTransitioningRef.current = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
        gsap.set(overlay, { display: 'none', pointerEvents: 'none' });
      },
    });

    if (transitionDirection === 'forward') {
      // ── FORWARD: HERO ➔ STORYTELLING ──────────────────────────────
      try {
        soundFx.playTransitionWarp?.();
      } catch (_) {}

      // Reset initial state
      gsap.set(overlay, { display: 'flex', opacity: 1, pointerEvents: 'all' });
      gsap.set(leftBlade, { xPercent: -100, rotate: -3 });
      gsap.set(rightBlade, { xPercent: 100, rotate: 3 });
      gsap.set(centerLock, { scale: 0, opacity: 0 });
      gsap.set(scanline, { opacity: 0, top: '0%' });

      // Phase 1: Slam shutter blades into center
      tl.to([leftBlade, rightBlade], {
        xPercent: 0,
        rotate: 0,
        duration: 0.50,
        ease: 'power4.inOut',
      })
      .to(centerLock, {
        scale: 1,
        opacity: 1,
        duration: 0.20,
        ease: 'back.out(2)',
      }, '-=0.18')
      .to(scanline, {
        opacity: 0.9,
        top: '100%',
        duration: 0.35,
        ease: 'linear',
      }, '-=0.25')
      // Midpoint: Switch page mode while screen is 100% occluded
      .add(() => {
        completeTransitionToStorytelling();
        window.scrollTo({ top: 0, behavior: 'instant' });
      })
      // Phase 2: Retract shutter blades smoothly revealing Scrolltelling
      .to(centerLock, {
        scale: 1.3,
        opacity: 0,
        duration: 0.20,
        ease: 'power2.in',
      }, '+=0.08')
      .to(leftBlade, {
        xPercent: -115,
        duration: 0.60,
        ease: 'power4.out',
      }, '-=0.12')
      .to(rightBlade, {
        xPercent: 115,
        duration: 0.60,
        ease: 'power4.out',
      }, '<')
      .to(overlay, {
        opacity: 0,
        duration: 0.30,
        ease: 'power2.out',
      }, '-=0.25');

    } else if (transitionDirection === 'reverse') {
      // ── REVERSE: STORYTELLING ➔ HERO ──────────────────────────────
      try {
        soundFx.playDockClick?.();
      } catch (_) {}

      gsap.set(overlay, { display: 'flex', opacity: 1, pointerEvents: 'all' });
      gsap.set(leftBlade, { xPercent: -100 });
      gsap.set(rightBlade, { xPercent: 100 });
      gsap.set(centerLock, { scale: 0, opacity: 0 });

      tl.to([leftBlade, rightBlade], {
        xPercent: 0,
        duration: 0.45,
        ease: 'power4.inOut',
      })
      .to(centerLock, {
        scale: 1,
        opacity: 1,
        duration: 0.18,
        ease: 'back.out(2)',
      }, '-=0.12')
      .add(() => {
        completeReturnToHero();
      })
      .to([leftBlade, rightBlade], {
        xPercent: (i) => (i === 0 ? -115 : 115),
        duration: 0.55,
        ease: 'power4.out',
      }, '+=0.08')
      .to(centerLock, {
        scale: 0.5,
        opacity: 0,
        duration: 0.18,
      }, '<')
      .to(overlay, {
        opacity: 0,
        duration: 0.25,
      }, '-=0.20');
    }
  }, [pageMode, transitionDirection]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] hidden flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ background: 'transparent' }}
    >
      {/* ── Left Diagonal Cyber Shutter Blade ──────────────────────── */}
      <div
        ref={leftBladeRef}
        className="absolute top-0 left-0 w-[58vw] h-full z-10"
        style={{
          background: 'linear-gradient(135deg, #050814 0%, #0a1128 50%, #030611 100%)',
          clipPath: 'polygon(0 0, 100% 0, calc(100% - 14vw) 100%, 0 100%)',
          boxShadow: '10px 0 35px rgba(0, 242, 254, 0.45)',
          borderRight: '2px solid #00f2fe',
        }}
      >
        {/* Neon Laser Accent Strip on Blade Edge */}
        <div
          className="absolute top-0 right-0 w-[4px] h-full"
          style={{
            background: 'linear-gradient(180deg, #00f2fe 0%, #ffffff 50%, #f72585 100%)',
            boxShadow: '0 0 20px #00f2fe, 0 0 30px #f72585',
          }}
        />

        {/* Diagonal Tech Markings */}
        <div className="absolute top-8 left-8 font-mono text-[10px] text-cyan-400/60 tracking-widest uppercase">
          SEC::PORTAL_DISPATCH // SECTOR_01
        </div>
      </div>

      {/* ── Right Diagonal Cyber Shutter Blade ─────────────────────── */}
      <div
        ref={rightBladeRef}
        className="absolute top-0 right-0 w-[58vw] h-full z-10"
        style={{
          background: 'linear-gradient(315deg, #050814 0%, #0a1128 50%, #030611 100%)',
          clipPath: 'polygon(14vw 0, 100% 0, 100% 100%, 0 100%)',
          boxShadow: '-10px 0 35px rgba(247, 37, 133, 0.45)',
          borderLeft: '2px solid #f72585',
        }}
      >
        {/* Neon Laser Accent Strip on Blade Edge */}
        <div
          className="absolute top-0 left-0 w-[4px] h-full"
          style={{
            background: 'linear-gradient(180deg, #f72585 0%, #ffffff 50%, #00f2fe 100%)',
            boxShadow: '0 0 20px #f72585, 0 0 30px #00f2fe',
          }}
        />

        <div className="absolute bottom-8 right-8 font-mono text-[10px] text-magenta-400/60 tracking-widest uppercase">
          SYS::INITIALIZING_STORYTELLING
        </div>
      </div>

      {/* ── Background Matrix Digital Cascade ──────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-45"
      />

      {/* ── High-Speed Scanline Sweep ──────────────────────────────── */}
      <div
        ref={scanlineRef}
        className="absolute left-0 w-full h-[6px] z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #00f2fe 30%, #ffffff 50%, #f72585 70%, transparent 100%)',
          boxShadow: '0 0 25px #00f2fe, 0 0 35px #f72585',
        }}
      />

      {/* ── Central Target Lock Seal ───────────────────────────────── */}
      <div
        ref={centerLockRef}
        className="relative z-30 flex flex-col items-center justify-center p-6 rounded-2xl"
        style={{
          background: 'rgba(3, 7, 20, 0.92)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid #00f2fe',
          boxShadow: '0 0 35px rgba(0, 242, 254, 0.5), inset 0 0 20px rgba(247, 37, 133, 0.3)',
        }}
      >
        <div className="w-16 h-16 rounded-full border-2 border-cyan-400 border-t-magenta-500 animate-spin flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f2fe]" />
        </div>
        <span className="mt-3 font-mono font-bold text-xs tracking-[3px] text-cyan-300 uppercase">
          WARPING // STORY MATRIX
        </span>
      </div>
    </div>
  );
}
