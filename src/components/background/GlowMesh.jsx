import React, { useEffect, useState } from 'react';

export default function GlowMesh() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
      if (!isHovered) setIsHovered(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Cursor Spotlight */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 transition-opacity duration-700 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          background: 'radial-gradient(circle, rgba(0,242,254,0.4) 0%, rgba(121,40,202,0.2) 60%, transparent 80%)',
          opacity: isHovered ? 0.35 : 0
        }}
      />

      {/* Ambient Atmospheric Lights */}
      <div className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-br from-primary/10 via-accent-violet/15 to-transparent blur-[160px] animate-pulse-glow" />
      <div className="absolute top-[40%] -right-[15%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-bl from-accent-violet/10 via-primary/10 to-transparent blur-[180px] animate-float" />
      <div className="absolute -bottom-[20%] left-[25%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-accent-cyan/10 via-accent-magenta/5 to-transparent blur-[200px]" />

      {/* Cyber Grid Texture Overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
    </div>
  );
}
