import React, { useRef, useEffect } from 'react';

/**
 * QuantumPlasmaSpine
 * 
 * Sub-Pixel Bezel-Locked Plasma Lightning Spine:
 * - Directly reads .editorial-stage-panel client dimensions (panelW, panelH)
 * - Zero-Gap exact alignment: xLeft=36px, xRight=panelW+36px, yTop=36px, yBottom=panelH+36px, R=24px
 * - High-DPI canvas overlay with 36px overflow bleed for 38px volumetric bloom
 * - 3 Traveling Voltage Surges & Razor-sharp 1.3px laser core
 * - 60 FPS Additive Blending
 */
export function QuantumPlasmaSpine({ accentColor, secondaryColor }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 36;
    let panelW = 800;
    let panelH = window.innerHeight;
    let canvasW = panelW + padding * 2;
    let canvasH = panelH + padding * 2;
    let dpr = window.devicePixelRatio || 1;

    const updateSize = () => {
      const panel = canvas.closest('.editorial-stage-panel');
      if (panel) {
        panelW = panel.clientWidth;
        panelH = panel.clientHeight;
      } else {
        panelW = Math.min(window.innerWidth * 0.68, 1024);
        panelH = window.innerHeight;
      }
      canvasW = panelW + padding * 2;
      canvasH = panelH + padding * 2;
      dpr = window.devicePixelRatio || 1;

      canvas.width = canvasW * dpr;
      canvas.height = canvasH * dpr;
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      canvas.style.left = `-${padding}px`;
      canvas.style.top = `-${padding}px`;
    };

    updateSize();
    const panel = canvas.closest('.editorial-stage-panel');
    const resizeObserver = new ResizeObserver(updateSize);
    if (panel) {
      resizeObserver.observe(panel);
    }
    window.addEventListener('resize', updateSize);

    let startTime = performance.now();

    const render = (now) => {
      const t = (now - startTime) * 0.001;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvasW, canvasH);

      // Additive Blending for blinding white-hot intersections
      ctx.globalCompositeOperation = 'lighter';

      const xLeft = padding; // Exactly x=0 of panel
      const xRight = panelW + padding; // Exactly x=panelW (right glass border)
      const yTop = padding; // Exactly y=0 of panel (top glass border)
      const yBottom = panelH + padding; // Exactly y=panelH (bottom glass border)
      const R = 24; // Corner radius matching md:rounded-r-3xl

      // ── 1. Parametric Path Construction: Full Top -> Corner -> Full Right ──
      const rawPath = [];
      const step = 8;

      // Segment 1: Full Top Edge Horizontal (Left to Right: from xLeft to xRight - R)
      const topDist = (xRight - R) - xLeft;
      const numTop = Math.max(4, Math.floor(topDist / step));
      for (let i = 0; i <= numTop; i++) {
        const u = i / numTop;
        const x = xLeft + u * topDist;
        const y = yTop;
        rawPath.push({ x, y, nx: 0, ny: -1 });
      }

      // Segment 2: Top-Right Rounded Corner Arc (90 deg)
      const arcLen = (Math.PI * 0.5) * R;
      const numArcTop = Math.max(3, Math.floor(arcLen / step));
      const cxTop = xRight - R;
      const cyTop = yTop + R;
      for (let i = 1; i <= numArcTop; i++) {
        const angle = -Math.PI * 0.5 + (i / numArcTop) * (Math.PI * 0.5);
        const x = cxTop + Math.cos(angle) * R;
        const y = cyTop + Math.sin(angle) * R;
        const nx = Math.cos(angle);
        const ny = Math.sin(angle);
        rawPath.push({ x, y, nx, ny });
      }

      // Segment 3: Full Right Vertical Edge (Top to Bottom: from yTop + R to yBottom)
      const vertDist = yBottom - (yTop + R);
      const numVert = Math.max(4, Math.floor(vertDist / step));
      for (let i = 1; i <= numVert; i++) {
        const u = i / numVert;
        const x = xRight;
        const y = (yTop + R) + u * vertDist;
        rawPath.push({ x, y, nx: 1, ny: 0 });
      }

      const totalNodes = rawPath.length;
      if (totalNodes < 4) {
        ctx.restore();
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // ── 2. Energy Breathing Cycle ────────────────────────────────
      const breathing = 0.88 + 0.12 * Math.sin(t * 2.2);

      // ── 3. Calculate 4 Fluid Wave Strands along Normal Vectors ───
      const strand0 = []; // Outer diffuse aura
      const strand1 = []; // Primary neon wave
      const strand2 = []; // Secondary intertwined harmonic wave
      const strand3 = []; // White-hot razor-sharp core filament (centered on glass edge)
      const envelopes = [];

      for (let i = 0; i < totalNodes; i++) {
        const node = rawPath[i];
        const s = i * step;

        // Smooth Cubic Smoothstep Taper Envelope on terminals
        const uStart = Math.min(1, i / 14.0);
        const smoothStart = uStart * uStart * (3 - 2 * uStart);
        const uEnd = Math.min(1, (totalNodes - 1 - i) / 14.0);
        const smoothEnd = uEnd * uEnd * (3 - 2 * uEnd);
        const envelope = smoothStart * smoothEnd;
        envelopes.push(envelope);

        // Fluid Harmonic Wave Math tightly hugging the bezel
        const w0 = (Math.sin(s * 0.008 + t * 1.8) * 3.2 + Math.cos(s * 0.016 - t * 1.2) * 1.8) * envelope * breathing;
        const w1 = (Math.sin(s * 0.012 + t * 2.8) * 2.0 + Math.sin(s * 0.025 + t * 3.6) * 1.0) * envelope * breathing;
        const w2 = (Math.cos(s * 0.009 - t * 2.2) * 1.8 + Math.sin(s * 0.028 - t * 3.1) * 0.8) * envelope * breathing;
        const w3 = ((w1 + w2) * 0.5 + Math.sin(s * 0.040 + t * 5.5) * 0.4) * envelope;

        strand0.push({ x: node.x + node.nx * w0, y: node.y + node.ny * w0 });
        strand1.push({ x: node.x + node.nx * w1, y: node.y + node.ny * w1 });
        strand2.push({ x: node.x + node.nx * w2, y: node.y + node.ny * w2 });
        strand3.push({ x: node.x + node.nx * w3, y: node.y + node.ny * w3 });
      }

      // Smooth Spline Drawing Helper
      const drawSpline = (points, lineWidth, strokeStyle, shadowBlur, shadowColor) => {
        if (points.length < 2) return;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowColor = shadowColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) * 0.5;
          const yc = (points[i].y + points[i + 1].y) * 0.5;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.stroke();
      };

      // ── Layer 1: Broad Volumetric Diffuse Bloom (38px Corona) ────
      drawSpline(strand0, 24 * breathing, `${accentColor}26`, 38 * breathing, accentColor);

      // ── Layer 2: Primary Neon Plasma Wave ─────────────────────────
      drawSpline(strand1, 6.0 * breathing, `${accentColor}aa`, 20 * breathing, accentColor);

      // ── Layer 3: Secondary Intertwined Harmonic Wave ─────────────
      drawSpline(strand2, 3.2 * breathing, `${secondaryColor || '#818cf8'}cc`, 12 * breathing, secondaryColor || '#818cf8');

      // ── Layer 4: Ultra-Sharp White-Hot Core Laser Filament (1.3px)
      drawSpline(strand3, 1.35, '#ffffff', 6, '#ffffff');

      // ── Layer 5: 3 Traveling Voltage Surges (Xung Điện Chạy Dọc) ──
      const surgeCount = 3;
      for (let p = 0; p < surgeCount; p++) {
        const pulseProgress = (t * 0.50 + p * (1.0 / surgeCount)) % 1.0;
        const pulseIdx = Math.min(totalNodes - 1, Math.floor(pulseProgress * totalNodes));
        const envelope = envelopes[pulseIdx] || 0;

        if (envelope > 0.05) {
          const pt = strand3[pulseIdx] || rawPath[pulseIdx];

          // Draw Glowing Surge Head
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (2.0 + Math.sin(t * 10.0 + p) * 0.5) * envelope, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 18 * envelope;
          ctx.shadowColor = '#ffffff';
          ctx.fill();

          // Draw Surge Comet Glow Corona
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (5.0 + Math.cos(t * 8.0 + p) * 1.0) * envelope, 0, Math.PI * 2);
          ctx.fillStyle = `${accentColor}88`;
          ctx.shadowBlur = 24 * envelope;
          ctx.shadowColor = accentColor;
          ctx.fill();
        }
      }

      // ── Layer 6: Micro Corner & Edge Electric Spark Discharges ───
      const sparkIndices = [
        Math.floor(numTop * 0.35),
        Math.floor(numTop * 0.75),
        numTop + Math.floor(numArcTop * 0.5),
        numTop + numArcTop + Math.floor(numVert * 0.25),
        numTop + numArcTop + Math.floor(numVert * 0.50),
        numTop + numArcTop + Math.floor(numVert * 0.75),
      ];

      sparkIndices.forEach((idx, sIdx) => {
        if (idx >= totalNodes) return;
        const envelope = envelopes[idx] || 0;
        if (envelope < 0.1) return;

        const sparkTime = t * 4.2 + sIdx * 1.4;
        const sparkPulse = (Math.sin(sparkTime) + 1) * 0.5 * envelope;

        if (sparkPulse > 0.35) {
          const origin = strand3[idx] || rawPath[idx];
          const node = rawPath[idx];
          const forkLen = 12 * sparkPulse;
          const forkAngle = Math.sin(t * 8.0 + sIdx) * 0.45;

          const nx = node.nx;
          const ny = node.ny;
          const tx = -ny;
          const ty = nx;

          const midX = origin.x + nx * forkLen * 0.55 + tx * forkAngle * 3.0;
          const midY = origin.y + ny * forkLen * 0.55 + ty * forkAngle * 3.0;
          const endX = origin.x + nx * forkLen + tx * forkAngle * 6.0;
          const endY = origin.y + ny * forkLen + ty * forkAngle * 6.0;

          ctx.beginPath();
          ctx.lineWidth = 1.3 * sparkPulse;
          ctx.strokeStyle = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.shadowColor = accentColor;
          ctx.moveTo(origin.x, origin.y);
          ctx.lineTo(midX, midY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(endX, endY, 1.5 * sparkPulse, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ffffff';
          ctx.fill();
        }
      });

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (panel) resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [accentColor, secondaryColor]);

  return (
    <canvas
      ref={canvasRef}
      className="quantum-plasma-spine pointer-events-none absolute overflow-visible z-35"
      style={{
        position: 'absolute',
        top: '-36px',
        left: '-36px',
        pointerEvents: 'none',
        zIndex: 35,
      }}
    />
  );
}
