import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * Creates a high-DPI Canvas texture for the Cyber Target Reticle HUD
 * matching the concept blueprint:
 * - Angle markers: 0°, 45°, 90°, 125°, 180°, 270°, 325°
 * - Dual cyan (#00f2fe) & magenta (#f72585) concentric tick rings
 * - Crosshair brackets & diagnostic degree markings
 */
function createReticleBaseTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  const cx = 512;
  const cy = 512;

  ctx.clearRect(0, 0, 1024, 1024);

  // Outer thin cyan ring
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(cx, cy, 460, 0, Math.PI * 2);
  ctx.stroke();

  // Magenta secondary inner ring
  ctx.strokeStyle = '#f72585';
  ctx.lineWidth = 5;
  ctx.shadowColor = '#f72585';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(cx, cy, 430, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle interior cyan ring
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, 390, 0, Math.PI * 2);
  ctx.stroke();

  // Concentric tick marks (72 ticks around the circle)
  ctx.shadowBlur = 10;
  for (let i = 0; i < 72; i++) {
    const angle = (i * Math.PI * 2) / 72;
    const isMajor = i % 9 === 0; // Every 45 deg
    const r1 = 390;
    const r2 = isMajor ? 425 : 405;

    ctx.strokeStyle = isMajor ? '#f72585' : 'rgba(0, 242, 254, 0.75)';
    ctx.lineWidth = isMajor ? 5 : 2.5;
    ctx.beginPath();
    ctx.moveTo(cx + r1 * Math.cos(angle), cy + r1 * Math.sin(angle));
    ctx.lineTo(cx + r2 * Math.cos(angle), cy + r2 * Math.sin(angle));
    ctx.stroke();
  }

  // Angle Degree Callouts (matching the exact blueprint: 0°, 45°, 90°, 125°, 180°, 270°, 325°)
  const angleLabels = [
    { deg: 0, text: '0°', angleRad: 0 },
    { deg: 45, text: '45°', angleRad: -Math.PI / 4 },
    { deg: 90, text: '90°', angleRad: -Math.PI / 2 },
    { deg: 125, text: '125°', angleRad: -(125 * Math.PI) / 180 },
    { deg: 180, text: '180°', angleRad: Math.PI },
    { deg: 270, text: '270°', angleRad: Math.PI / 2 },
    { deg: 325, text: '325°', angleRad: (145 * Math.PI) / 180 },
  ];

  ctx.font = 'bold 30px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  angleLabels.forEach(({ text, angleRad }) => {
    const textR = 490;
    const tx = cx + textR * Math.cos(angleRad);
    const ty = cy + textR * Math.sin(angleRad);

    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#00f2fe';
    ctx.fillText(text, tx, ty);

    // Indicator tick outside text
    const tickR1 = 460;
    const tickR2 = 475;
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + tickR1 * Math.cos(angleRad), cy + tickR1 * Math.sin(angleRad));
    ctx.lineTo(cx + tickR2 * Math.cos(angleRad), cy + tickR2 * Math.sin(angleRad));
    ctx.stroke();
  });

  // 4 Crosshair brackets
  const crosshairLen = 40;
  const crosshairR = 350;
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.9)';
  ctx.lineWidth = 4;
  [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((rad) => {
    const x1 = cx + (crosshairR - crosshairLen) * Math.cos(rad);
    const y1 = cy + (crosshairR - crosshairLen) * Math.sin(rad);
    const x2 = cx + crosshairR * Math.cos(rad);
    const y2 = cy + crosshairR * Math.sin(rad);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates dynamic rotating radar sweep line texture
 */
function createRadarSweepTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const cx = 256;
  const cy = 256;

  ctx.clearRect(0, 0, 512, 512);

  // Radar beam gradient sector (approx 45 degrees sweep)
  const sweepAngle = Math.PI * 0.30;
  const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 230);
  grad.addColorStop(0, 'rgba(0, 242, 254, 0.85)');
  grad.addColorStop(0.7, 'rgba(0, 242, 254, 0.35)');
  grad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, 230, 0, sweepAngle);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Leading edge laser ray
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 230 * Math.cos(sweepAngle), cy + 230 * Math.sin(sweepAngle));
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * CyberTargetReticle3D
 *
 * 3D HUD Reticle anchored on the chest singularity orb core.
 */
export function CyberTargetReticle3D({
  position = [0, 0, 0],
  radius = 0.155,
}) {
  const baseMeshRef = useRef();
  const radarMeshRef = useRef();
  const outerPulseRef = useRef();

  const baseTexture = useMemo(() => createReticleBaseTexture(), []);
  const radarTexture = useMemo(() => createRadarSweepTexture(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Constant smooth radar sweep (counter-clockwise)
    if (radarMeshRef.current) {
      radarMeshRef.current.rotation.z = -t * 1.65;
    }

    // Subtle gentle breath on outer base HUD
    if (baseMeshRef.current) {
      const breath = 1 + Math.sin(t * 2.2) * 0.025;
      baseMeshRef.current.scale.set(breath, breath, 1);
    }

    // Pulse wave ring
    if (outerPulseRef.current) {
      const p = (t * 0.8) % 1.0;
      const s = 1.0 + p * 0.35;
      outerPulseRef.current.scale.set(s, s, 1);
      outerPulseRef.current.material.opacity = (1.0 - p) * 0.45;
    }
  });

  return (
    <group position={position}>
      {/* ── Outer expanding pulse ring ── */}
      <mesh ref={outerPulseRef} position={[0, 0, 0.005]}>
        <ringGeometry args={[radius * 0.96, radius * 1.02, 64]} />
        <meshBasicMaterial
          color="#00f2fe"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Main Base Reticle (Ticks, Angle markers, Dual cyan/magenta rings) ── */}
      <mesh ref={baseMeshRef} position={[0, 0, 0.010]}>
        <planeGeometry args={[radius * 2.35, radius * 2.35]} />
        <meshBasicMaterial
          map={baseTexture}
          transparent
          opacity={0.96}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Rotating Radar Sweep Beam ── */}
      <mesh ref={radarMeshRef} position={[0, 0, 0.015]}>
        <planeGeometry args={[radius * 2.15, radius * 2.15]} />
        <meshBasicMaterial
          map={radarTexture}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Central Focal Target Dot ── */}
      <mesh position={[0, 0, 0.020]}>
        <circleGeometry args={[0.012, 32]} />
        <meshBasicMaterial
          color="#00f2fe"
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, 0, 0.019]}>
        <ringGeometry args={[0.016, 0.022, 32]} />
        <meshBasicMaterial
          color="#f72585"
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
