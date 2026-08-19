import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if mobile / touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive') ||
        target.closest('.interactive')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Smooth trailing animation loop
    let animId;
    const follow = () => {
      setTrailPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      animId = requestAnimationFrame(follow);
    };
    animId = requestAnimationFrame(follow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [pos.x, pos.y, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Central Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#00f2fe]"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Trailing Outer Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full border pointer-events-none z-50 transition-all duration-150 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isHovered
            ? 'w-12 h-12 border-primary bg-primary/10 shadow-glow-cyan'
            : 'w-8 h-8 border-white/30 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${trailPos.x}px, ${trailPos.y}px, 0) translate(-50%, -50%)`,
        }}
      />
    </>
  );
}
