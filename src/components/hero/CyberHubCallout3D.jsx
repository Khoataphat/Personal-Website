import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useCockpitStore } from '../../store/cockpitStore';
import { soundFx } from '../../services/soundFx';

/**
 * DynamicLaserSegment
 * Laser cylinder segment updated real-time each frame from pARef and pBRef.
 * Uses a unit-height cylinder (height=1) scaled by length each frame.
 */
function DynamicLaserSegment({ pARef, pBRef, isHovered, renderOrder = 98 }) {
  const groupRef = useRef();

  useFrame(() => {
    const pA = pARef.current;
    const pB = pBRef.current;
    if (!groupRef.current || !pA || !pB) return;
    const length = pA.distanceTo(pB);
    if (length < 0.0001) return;

    // Midpoint position
    groupRef.current.position.set(
      (pA.x + pB.x) / 2,
      (pA.y + pB.y) / 2,
      (pA.z + pB.z) / 2
    );

    // Orient cylinder from Y-up toward direction pA→pB
    const dir = new THREE.Vector3().subVectors(pB, pA).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    groupRef.current.quaternion.copy(quat);

    // Scale Y to match actual length (cylinder height = 1 unit by design)
    groupRef.current.scale.set(1, length, 1);
  });

  return (
    <group ref={groupRef}>
      {/* Outer Cyan Halo */}
      <mesh renderOrder={renderOrder}>
        <cylinderGeometry args={[0.003, 0.003, 1, 12]} />
        <meshBasicMaterial
          color="#00f2fe"
          transparent
          opacity={isHovered ? 0.85 : 0.55}
          toneMapped={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner White Core Ray */}
      <mesh renderOrder={renderOrder + 1}>
        <cylinderGeometry args={[0.0012, 0.0012, 1, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={isHovered ? 0.98 : 0.90}
          toneMapped={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/**
 * DynamicNode
 * Mesh node (circle/ring) updated in position each frame from posRef.
 */
function DynamicNode({ posRef, geometry, color, renderOrder = 100, zOffset = 0 }) {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current && posRef.current) {
      meshRef.current.position.set(
        posRef.current.x,
        posRef.current.y,
        posRef.current.z + zOffset
      );
    }
  });
  return (
    <mesh ref={meshRef} renderOrder={renderOrder}>
      {geometry}
      <meshBasicMaterial
        color={color}
        toneMapped={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/**
 * CyberHubCallout3D
 *
 * Compact Holographic Sci-Fi HUD Callout Box with Dogleg Laser Beam.
 *
 * KEY: endVec is computed every frame by casting a Z-ray from the screen
 * through the SVG socket pixel (cx=10, cy=48 in 176×54 div) into 3D world.
 *
 * Formula (from drei Html distanceFactor math):
 *   scale = objectDist / distanceFactor
 *   worldUnitsPerCssPx = objectDist² / (distFactor × focalY × halfViewportHeight)
 *
 * This is EXACTLY what the user described: "chiếu tia Z vuông góc màn hình
 * qua chấm socket, tìm điểm cắt trong 3D" — project Z-ray through pixel, find 3D intersection.
 */
export function CyberHubCallout3D({
  orbCenter = [0, 0, 0],
  hubOffset = [0.68, -0.11, 0.10],
}) {
  const photonRef = useRef();
  const socketDotRef = useRef(); // ref to SVG <circle> DOM element
  const glCanvasRef = useRef();  // ref to THREE.js WebGL canvas element
  const [isHovered, setIsHovered] = useState(false);
  const enterStorytelling = useCockpitStore((s) => s.enterStorytelling);

  const { camera, size, gl } = useThree();

  // Capture canvas element for getBoundingClientRect offset
  useEffect(() => {
    glCanvasRef.current = gl.domElement;
  }, [gl]);

  // ── All laser vectors as refs — computed every frame ──
  const startVecRef = useRef(new THREE.Vector3(0, 0, 0));
  const endVecRef   = useRef(new THREE.Vector3());
  const elbowVecRef = useRef(new THREE.Vector3());
  const d1Ref       = useRef(0);
  const d2Ref       = useRef(0);
  const totalDistRef = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // ── Auto-align endVec: lấy vị trí socket từ DOM, sau đó unproject → 3D ──
    // Ý tưởng của user: chiếu tia Z từ điểm socket trên màn hình vào không gian 3D
    // Cách này chính xác 100% vì lấy px thực tế từ DOM thay vì tính lý thuyết
    if (socketDotRef.current && glCanvasRef.current) {
      const circleRect = socketDotRef.current.getBoundingClientRect();
      const canvasRect = glCanvasRef.current.getBoundingClientRect();

      // Tâm socket trong CSS pixels (relative to canvas CSS box)
      const cssX = circleRect.left + circleRect.width / 2 - canvasRect.left;
      const cssY = circleRect.top + circleRect.height / 2 - canvasRect.top;

      // Convert CSS pixels → NDC [-1, 1]
      // getBoundingClientRect() trả về CSS pixels, canvas CSS box cũng CSS pixels
      // → tỷ lệ CSS pixel / CSS box size cho NDC chính xác
      // KHÔNG cần DPR vì cả 2 đều ở cùng hệ CSS pixels
      const ndcX = (cssX / canvasRect.width) * 2 - 1;
      const ndcY = -(cssY / canvasRect.height) * 2 + 1;

      // Unproject NDC → world at same depth as hub center
      const hubWorld = new THREE.Vector3(
        orbCenter[0] + hubOffset[0],
        orbCenter[1] + hubOffset[1],
        orbCenter[2] + hubOffset[2]
      );
      const hubNDC = hubWorld.clone().project(camera);

      const socketNDC = new THREE.Vector3(ndcX, ndcY, hubNDC.z);
      const socketWorld = socketNDC.clone().unproject(camera);

      // endVec relative to group (orbCenter)
      endVecRef.current.set(
        socketWorld.x - orbCenter[0],
        socketWorld.y - orbCenter[1],
        socketWorld.z - orbCenter[2]  // dùng z thực từ unproject thay vì hardcode
      );
    }

    // Elbow: same Y as endVec, offset right from start
    elbowVecRef.current.set(
      startVecRef.current.x + 0.12,
      endVecRef.current.y,
      startVecRef.current.z
    );

    // Path lengths
    d1Ref.current = startVecRef.current.distanceTo(elbowVecRef.current);
    d2Ref.current = elbowVecRef.current.distanceTo(endVecRef.current);
    totalDistRef.current = d1Ref.current + d2Ref.current;

    // ── Animate photon along path ──
    if (photonRef.current && totalDistRef.current > 0) {
      const speed = isHovered ? 1.5 : 0.85;
      const progress = (t * speed) % 1.0;
      const currentDist = progress * totalDistRef.current;

      if (currentDist <= d1Ref.current) {
        const segP = d1Ref.current > 0 ? currentDist / d1Ref.current : 0;
        photonRef.current.position.lerpVectors(startVecRef.current, elbowVecRef.current, segP);
      } else {
        const segP = d2Ref.current > 0 ? (currentDist - d1Ref.current) / d2Ref.current : 0;
        photonRef.current.position.lerpVectors(elbowVecRef.current, endVecRef.current, segP);
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    try { soundFx.playTransitionWarp?.(); } catch (_) {}
    enterStorytelling('about');
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    try { soundFx.playHover?.(); } catch (_) {}
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  return (
    <group position={orbCenter}>
      {/* ── 2-Segment Dogleg Bent Laser Beam ──────────────────────────── */}
      {/* Segment 1: Tâm Reticle → Elbow (chéo xuống) */}
      <DynamicLaserSegment pARef={startVecRef} pBRef={elbowVecRef} isHovered={isHovered} renderOrder={98} />

      {/* Segment 2: Elbow → Socket SVG (ngang phẳng, tự căn chỉnh) */}
      <DynamicLaserSegment pARef={elbowVecRef} pBRef={endVecRef} isHovered={isHovered} renderOrder={98} />

      {/* ── Anchor & Joint Nodes ──────────────────────────────────────── */}
      {/* Target Center Node (start = tâm orb) */}
      <DynamicNode posRef={startVecRef} geometry={<circleGeometry args={[0.008, 16]} />} color="#00f2fe" renderOrder={100} />
      <DynamicNode posRef={startVecRef} geometry={<ringGeometry args={[0.011, 0.015, 16]} />} color="#f72585" renderOrder={100} zOffset={0.001} />

      {/* Elbow Bent Joint */}
      <DynamicNode posRef={elbowVecRef} geometry={<circleGeometry args={[0.004, 16]} />} color="#ffffff" renderOrder={100} />
      <DynamicNode posRef={elbowVecRef} geometry={<ringGeometry args={[0.0055, 0.0085, 16]} />} color="#00f2fe" renderOrder={100} zOffset={0.001} />

      {/* Socket Endpoint Node — khớp chính xác với SVG circle (cx=10, cy=48) */}
      <DynamicNode posRef={endVecRef} geometry={<circleGeometry args={[0.005, 16]} />} color="#00f2fe" renderOrder={100} />

      {/* ── Traveling Quantum Photon ─────────────────────────────────── */}
      <mesh ref={photonRef} renderOrder={101}>
        <sphereGeometry args={[0.006, 12, 12]} />
        <meshBasicMaterial color="#00f2fe" toneMapped={false} depthTest={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* ── Compact Holographic Sci-Fi HUD Box ──────────────────────── */}
      <group position={hubOffset}>
        <Html
          center
          distanceFactor={3.6}
          zIndexRange={[35, 50]}
          style={{ pointerEvents: 'auto', userSelect: 'none' }}
        >
          <div
            onClick={handleClick}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            className={`
              relative cursor-pointer select-none transition-all duration-300 transform
              ${isHovered ? 'scale-105 -translate-y-0.5' : 'scale-100'}
            `}
            style={{ width: '176px', height: '54px' }}
          >
            {/* SVG Vector Hologram Frame Blueprint (176 x 54) */}
            <svg
              width="176"
              height="54"
              viewBox="0 0 176 54"
              fill="none"
              className="absolute inset-0 overflow-visible pointer-events-none"
            >
              <defs>
                <filter id="holoGlowFinal" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation={isHovered ? '2.5' : '1.4'} result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <pattern id="holoScanFinal" width="100%" height="3.5" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(0, 242, 254, 0.12)" strokeWidth="0.8" />
                </pattern>

                <linearGradient id="holoFillGradFinal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isHovered ? 'rgba(0, 242, 254, 0.18)' : 'rgba(0, 180, 255, 0.08)'} />
                  <stop offset="100%" stopColor={isHovered ? 'rgba(6, 16, 42, 0.75)' : 'rgba(4, 12, 32, 0.60)'} />
                </linearGradient>
              </defs>

              {/* Main Sci-Fi Chamfered Polygon Box */}
              <polygon
                points="10,48 10,14 20,5 134,5 142,0 169,0 174,5 174,36 164,48 118,48 112,53 65,53 59,48"
                fill="url(#holoFillGradFinal)"
                stroke="#00f2fe"
                strokeWidth={isHovered ? "2.0" : "1.5"}
                filter="url(#holoGlowFinal)"
                style={{ backdropFilter: 'blur(12px)' }}
              />

              {/* Scanline Fill Overlay */}
              <polygon
                points="10,48 10,14 20,5 134,5 142,0 169,0 174,5 174,36 164,48 118,48 112,53 65,53 59,48"
                fill="url(#holoScanFinal)"
                opacity={0.55}
              />

              {/* Top-Right Double Accent Bracket */}
              <path d="M 139 -3 L 172 -3 L 177 2 L 177 20" fill="none" stroke="#00f2fe" strokeWidth="1.6" filter="url(#holoGlowFinal)" />

              {/* Bottom-Right Sub Step Accent */}
              <path d="M 109 54 L 62 54" fill="none" stroke="#00f2fe" strokeWidth="1.8" filter="url(#holoGlowFinal)" />

              {/* Left Indicator Socket Notch */}
              <path d="M 7 22 L 7 38" fill="none" stroke="#00f2fe" strokeWidth="2.6" strokeLinecap="round" filter="url(#holoGlowFinal)" />

              {/* Laser Docking Socket Node at (10, 48) — góc ngoài trái dưới */}
              <circle cx="10" cy="48" r="2.8" fill="#ffffff" stroke="#00f2fe" strokeWidth="1.2" filter="url(#holoGlowFinal)" />
            </svg>

            {/* Invisible DOM marker tại vị trí socket (10, 48) — dùng cho getBoundingClientRect
                Không dùng SVG circle vì filter glow làm phình boundingRect */}
            <div
              ref={socketDotRef}
              style={{
                position: 'absolute',
                left: '10px',
                top: '48px',
                width: '1px',
                height: '1px',
                pointerEvents: 'none',
              }}
            />

            {/* Inner Content: KHÁM PHÁ / ABOUT ME → */}
            <div className="relative z-10 w-full h-full flex items-center justify-center pl-3 pr-2">
              <div className="flex items-center gap-1.5">
                <span
                  className="font-mono font-bold text-[10.5px] text-white tracking-[1.3px] uppercase whitespace-nowrap"
                  style={{
                    textShadow: isHovered
                      ? '0 0 10px rgba(0, 242, 254, 0.95), 0 0 20px rgba(0, 242, 254, 0.6)'
                      : '0 0 8px rgba(0, 242, 254, 0.75)',
                  }}
                >
                  KHÁM PHÁ / ABOUT ME
                </span>
                <span className={`text-[10.5px] font-mono font-bold text-cyan-300 transition-transform duration-300 ${isHovered ? 'translate-x-1 text-cyan-200' : ''}`}>
                  ➔
                </span>
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
