import React, { useEffect, useRef } from 'react';

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate stars/particles
    const particleCount = Math.floor((width * height) / 12000);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        speedAlpha: Math.random() * 0.015 + 0.005,
        speedY: -(Math.random() * 0.2 + 0.05),
        speedX: (Math.random() - 0.5) * 0.1,
        color: Math.random() > 0.3 ? '#00f2fe' : Math.random() > 0.5 ? '#7928ca' : '#ffffff',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Twinkle effect
        p.alpha += p.speedAlpha;
        if (p.alpha > 0.8 || p.alpha < 0.2) {
          p.speedAlpha = -p.speedAlpha;
        }

        // Drift upward slowly
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
}
