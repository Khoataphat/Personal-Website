import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCockpitStore } from '../../store/cockpitStore';

const CYAN_HEX = '#00E5FF';
const PURPLE_HEX = '#7A00FF';
const WHITE_HEX = '#FFFFFF';

// Procedural Single Continuous Anatomical Male Human Body Generator
function buildContinuousMaleHumanGeometry() {
  const geom = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const indices = [];

  const cyan = new THREE.Color(CYAN_HEX);
  const purple = new THREE.Color(PURPLE_HEX);

  let vertexOffset = 0;

  // Helper to add a ring of N points with custom cross-section
  function createLimbMesh(crossSections) {
    const numSegments = 16;
    const startIdx = vertexOffset;

    for (let s = 0; s < crossSections.length; s++) {
      const { y, rx, rz, cx = 0, cz = 0, color = cyan } = crossSections[s];
      for (let i = 0; i < numSegments; i++) {
        const theta = (i / numSegments) * Math.PI * 2;
        const px = cx + rx * Math.cos(theta);
        const py = y;
        const pz = cz + rz * Math.sin(theta);

        positions.push(px, py, pz);
        colors.push(color.r, color.g, color.b);
        vertexOffset++;
      }
    }

    // Connect cross-sections with triangular faces
    for (let s = 0; s < crossSections.length - 1; s++) {
      const ring1 = startIdx + s * numSegments;
      const ring2 = startIdx + (s + 1) * numSegments;
      for (let i = 0; i < numSegments; i++) {
        const next = (i + 1) % numSegments;
        const a = ring1 + i;
        const b = ring2 + i;
        const c = ring2 + next;
        const d = ring1 + next;

        indices.push(a, b, c);
        indices.push(a, c, d);
      }
    }
  }

  // 1. HEAD & NECK (Cyan)
  const headRings = [
    { y: 1.62, rx: 0.08, rz: 0.08, cx: 0, cz: 0, color: cyan },
    { y: 1.68, rx: 0.075, rz: 0.08, cx: 0, cz: 0.01, color: cyan },
    { y: 1.74, rx: 0.10, rz: 0.11, cx: 0, cz: 0.02, color: cyan }, // jaw
    { y: 1.80, rx: 0.125, rz: 0.13, cx: 0, cz: 0.015, color: cyan }, // nose/eyes
    { y: 1.86, rx: 0.135, rz: 0.14, cx: 0, cz: 0, color: cyan }, // forehead
    { y: 1.93, rx: 0.11, rz: 0.12, cx: 0, cz: -0.01, color: cyan }, // cranium
    { y: 1.96, rx: 0.04, rz: 0.04, cx: 0, cz: -0.01, color: cyan }, // crown
  ];
  createLimbMesh(headRings);

  // 2. TORSO & PELVIS (V-taper athletic male)
  const torsoRings = [
    { y: 0.90, rx: 0.20, rz: 0.13, cx: 0, cz: 0, color: cyan }, // pelvis
    { y: 1.02, rx: 0.19, rz: 0.12, cx: 0, cz: 0, color: cyan },
    { y: 1.15, rx: 0.17, rz: 0.11, cx: 0, cz: 0, color: cyan }, // waist
    { y: 1.28, rx: 0.21, rz: 0.13, cx: 0, cz: 0.01, color: cyan }, // lower ribs
    { y: 1.42, rx: 0.26, rz: 0.15, cx: 0, cz: 0.02, color: cyan }, // pecs
    { y: 1.54, rx: 0.28, rz: 0.155, cx: 0, cz: 0.015, color: cyan }, // clavicle/shoulders
    { y: 1.62, rx: 0.16, rz: 0.11, cx: 0, cz: 0, color: cyan }, // neck base
  ];
  createLimbMesh(torsoRings);

  // 3. LEFT & RIGHT ARMS (Cyan upper arm, Purple forearm & hand)
  [-1, 1].forEach((side) => {
    const armRings = [
      { y: 1.52, rx: 0.08, rz: 0.08, cx: side * 0.32, cz: 0, color: cyan }, // shoulder
      { y: 1.38, rx: 0.075, rz: 0.075, cx: side * 0.38, cz: 0, color: cyan }, // bicep
      { y: 1.22, rx: 0.065, rz: 0.065, cx: side * 0.42, cz: 0, color: cyan }, // elbow
      { y: 1.05, rx: 0.06, rz: 0.055, cx: side * 0.40, cz: 0.02, color: purple }, // forearm
      { y: 0.88, rx: 0.045, rz: 0.035, cx: side * 0.38, cz: 0.02, color: purple }, // wrist
      { y: 0.76, rx: 0.05, rz: 0.025, cx: side * 0.36, cz: 0.02, color: purple }, // palm/fingers
      { y: 0.70, rx: 0.02, rz: 0.01, cx: side * 0.35, cz: 0.02, color: purple }, // fingertips
    ];
    createLimbMesh(armRings);
  });

  // 4. LEFT & RIGHT LEGS (Cyan thigh, Purple shin & foot)
  [-1, 1].forEach((side) => {
    const legRings = [
      { y: 0.90, rx: 0.12, rz: 0.12, cx: side * 0.14, cz: 0, color: cyan }, // upper thigh
      { y: 0.74, rx: 0.11, rz: 0.11, cx: side * 0.14, cz: 0, color: cyan }, // mid thigh
      { y: 0.56, rx: 0.085, rz: 0.085, cx: side * 0.14, cz: 0.01, color: cyan }, // knee
      { y: 0.42, rx: 0.085, rz: 0.08, cx: side * 0.14, cz: 0, color: purple }, // calf
      { y: 0.22, rx: 0.06, rz: 0.06, cx: side * 0.14, cz: 0, color: purple }, // lower shin
      { y: 0.08, rx: 0.05, rz: 0.05, cx: side * 0.14, cz: 0, color: purple }, // ankle
      { y: 0.02, rx: 0.06, rz: 0.12, cx: side * 0.14, cz: 0.05, color: purple }, // foot base
    ];
    createLimbMesh(legRings);
  });

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return geom;
}

function JointMarker({ position, radius = 0.028, color = CYAN_HEX }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.55, 8, 8]} />
        <meshBasicMaterial color={WHITE_HEX} toneMapped={false} />
      </mesh>
    </group>
  );
}

const lerp = (a, b, t) => a + (b - a) * t;

export function HumanWireframeAvatar({ position = [0, -0.95, 0], scale = 1.15 }) {
  const rootRef = useRef();
  const bodyGroupRef = useRef();
  const headGroupRef = useRef();
  const chestDiamondRef = useRef();
  const waistRing1Ref = useRef();
  const waistRing2Ref = useRef();
  const baseScannerRef = useRef();

  // Generate continuous male human mesh once
  const humanGeometry = useMemo(() => buildContinuousMaleHumanGeometry(), []);

  // Materials with vertex colors
  const wireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        wireframe: true,
        transparent: true,
        opacity: 0.95,
        toneMapped: false,
      }),
    []
  );

  const innerMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();
    const { mouseNorm, activePanel } = useCockpitStore.getState();

    // 1. Harmonic Levitation / Breathing
    if (rootRef.current) {
      rootRef.current.position.y = position[1] + Math.sin(elapsed * 1.5) * 0.035;
    }

    // 2. Head Tracking (Euler damping clamp ±26 deg)
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = lerp(
        headGroupRef.current.rotation.y,
        mouseNorm.x * 0.45,
        delta * 3.5
      );
      headGroupRef.current.rotation.x = lerp(
        headGroupRef.current.rotation.x,
        -mouseNorm.y * 0.22,
        delta * 3.5
      );
    }

    // 3. Body Gesture (Smooth turn towards active panel)
    if (bodyGroupRef.current) {
      const N = 5;
      const targetBodyY = -(activePanel * ((2 * Math.PI) / N));
      bodyGroupRef.current.rotation.y = lerp(
        bodyGroupRef.current.rotation.y,
        targetBodyY,
        delta * 2.0
      );
    }

    // 4. Chest Diamond Core & Waist Gyro Rings
    if (chestDiamondRef.current) {
      chestDiamondRef.current.rotation.y = elapsed * 1.5;
    }
    if (waistRing1Ref.current) {
      waistRing1Ref.current.rotation.z += delta * 0.6;
    }
    if (waistRing2Ref.current) {
      waistRing2Ref.current.rotation.z -= delta * 0.4;
      waistRing2Ref.current.rotation.x = Math.PI / 3 + Math.sin(elapsed * 0.8) * 0.12;
    }
    if (baseScannerRef.current) {
      baseScannerRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group ref={rootRef} position={position} scale={scale}>
      {/* ══════════════════════════════════════════════════════════════════
          1. SINGLE CONTINUOUS ANATOMICAL MALE HUMANOID WIREFRAME MESH
      ══════════════════════════════════════════════════════════════════ */}
      <group ref={bodyGroupRef}>
        {/* Continuous Human Wireframe Mesh */}
        <mesh geometry={humanGeometry} material={innerMat} />
        <mesh geometry={humanGeometry} material={wireMat} />

        {/* ── [CHEST DIAMOND ARC REACTOR (Sternum)] ── */}
        <group position={[0, 1.42, 0.15]}>
          <mesh>
            <ringGeometry args={[0.09, 0.11, 24]} />
            <meshBasicMaterial color={CYAN_HEX} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
          <mesh ref={chestDiamondRef}>
            <octahedronGeometry args={[0.065, 0]} />
            <meshBasicMaterial color={CYAN_HEX} toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color={WHITE_HEX} toneMapped={false} />
          </mesh>
        </group>

        {/* ── [ABDOMEN 6-PACK BLUEPRINT GRID] ── */}
        <group position={[0, 1.15, 0.12]}>
          {[-0.05, 0.05].map((x, col) =>
            [0.055, 0.0, -0.055].map((y, row) => (
              <mesh key={`${col}-${row}`} position={[x, y, 0]}>
                <planeGeometry args={[0.08, 0.045]} />
                <meshBasicMaterial color={CYAN_HEX} wireframe transparent opacity={0.7} side={THREE.DoubleSide} toneMapped={false} />
              </mesh>
            ))
          )}
        </group>

        {/* ── [HEAD TRACKING EYE BEAM GROUP] ── */}
        <group ref={headGroupRef} position={[0, 1.80, 0]}>
          {/* Glowing Eyes */}
          <mesh position={[-0.04, 0, 0.13]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial color={WHITE_HEX} toneMapped={false} />
          </mesh>
          <mesh position={[0.04, 0, 0.13]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial color={WHITE_HEX} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <boxGeometry args={[0.14, 0.01, 0.02]} />
            <meshBasicMaterial color={CYAN_HEX} toneMapped={false} />
          </mesh>
        </group>

        {/* ── [GLOWING JOINT TRACKING MARKERS AT ANATOMICAL JOINTS] ── */}
        {/* Shoulders */}
        <JointMarker position={[-0.32, 1.52, 0.02]} />
        <JointMarker position={[0.32, 1.52, 0.02]} />

        {/* Clavicle */}
        <JointMarker position={[-0.16, 1.48, 0.13]} radius={0.022} />
        <JointMarker position={[0.16, 1.48, 0.13]} radius={0.022} />

        {/* Elbows */}
        <JointMarker position={[-0.42, 1.22, 0.0]} />
        <JointMarker position={[0.42, 1.22, 0.0]} />

        {/* Wrists */}
        <JointMarker position={[-0.38, 0.88, 0.02]} radius={0.024} />
        <JointMarker position={[0.38, 0.88, 0.02]} radius={0.024} />

        {/* Hips */}
        <JointMarker position={[-0.16, 0.90, 0.05]} />
        <JointMarker position={[0.16, 0.90, 0.05]} />
        <JointMarker position={[0, 0.90, 0.08]} radius={0.02} />

        {/* Knees */}
        <JointMarker position={[-0.14, 0.56, 0.06]} />
        <JointMarker position={[0.14, 0.56, 0.06]} />

        {/* Ankles */}
        <JointMarker position={[-0.14, 0.08, 0.04]} radius={0.022} />
        <JointMarker position={[0.14, 0.08, 0.04]} radius={0.022} />
      </group>

      {/* ══════════════════════════════════════════════════════════════════
          2. FLOATING WAIST GYRO NEON RINGS (Cyan & Purple)
      ══════════════════════════════════════════════════════════════════ */}
      <mesh ref={waistRing1Ref} position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.68, 0.010, 8, 80]} />
        <meshBasicMaterial color={CYAN_HEX} toneMapped={false} />
      </mesh>

      <mesh ref={waistRing2Ref} position={[0, 1.05, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.76, 0.008, 8, 80]} />
        <meshBasicMaterial color={PURPLE_HEX} transparent opacity={0.8} toneMapped={false} />
      </mesh>

      {/* ══════════════════════════════════════════════════════════════════
          3. HOLOGRAPHIC SCANNER PEDESTAL BASE (Radial Ticks & Outer Rim)
      ══════════════════════════════════════════════════════════════════ */}
      <group position={[0, -0.01, 0]}>
        {/* Outer Cyan Glowing Rim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.78, 0.82, 64]} />
          <meshBasicMaterial color={CYAN_HEX} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        {/* Inner Purple Circuit Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.48, 48]} />
          <meshBasicMaterial color={PURPLE_HEX} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        {/* Radial Scanner Lines & Ticks (Matching photo 100%) */}
        <group ref={baseScannerRef} rotation={[-Math.PI / 2, 0, 0]}>
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * (2 * Math.PI)) / 16;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return (
              <line key={i}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([0.48 * cos, 0.48 * sin, 0.001, 0.78 * cos, 0.78 * sin, 0.001])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color={CYAN_HEX} transparent opacity={0.6} />
              </line>
            );
          })}
        </group>

        {/* Outer Perimeter Pointer Ticks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * (2 * Math.PI)) / 24;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          return (
            <mesh key={i} position={[0.88 * cos, 0.001, 0.88 * sin]} rotation={[0, -angle, 0]}>
              <planeGeometry args={[0.035, 0.012]} />
              <meshBasicMaterial color={CYAN_HEX} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
