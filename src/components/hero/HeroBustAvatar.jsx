import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useCockpitStore } from '../../store/cockpitStore';

const GLB_PATH = `${import.meta.env.BASE_URL}models/avatar.glb`;

const WIRE_COLOR = {
  'Body_Body_0': '#00E5FF',
  'Hand_Hand_0': '#00E5FF',
  'Zweihander_Sword_0': '#7A00FF',
  'Mask_Mask_0': '#7A00FF',
  'Mask_Mask_0_1': '#7A00FF',
  'Mask_Mask_0_2': '#00E5FF',
  'straps_Straps_0': '#7A00FF',
  'Cloth_Robe_0': '#00FF88',
  'Eye_Eye_0': '#FFD700',
  'Eye001_Eye_0': '#FFD700',
  'Eye002_Eye_0': '#FFD700',
  'Eye003_Eye_0': '#FFD700',
  'Eye004_Eye_0': '#FFD700',
  'Eye005_Eye_0': '#FFD700',
  'Maze_Maze_0': '#00E5FF',
};

const FILL_OPACITY = {
  'Cloth_Robe_0': 0.98,
  'Body_Body_0': 0.98,
  'Hand_Hand_0': 0.85,
  'Mask_Mask_0': 0.96,
  'Mask_Mask_0_1': 0.96,
  'Mask_Mask_0_2': 0.96,
  DEFAULT: 0.20,
};

const FILL_COLOR = {
  'Cloth_Robe_0': '#00150a',
  'Body_Body_0': '#020612',
  'Hand_Hand_0': '#001a2e',
  'Mask_Mask_0': '#1a0036',
  'Mask_Mask_0_1': '#1a0036',
  'Mask_Mask_0_2': '#001a2e',
  DEFAULT: '#0a0a16',
};

// 5-Axis Gyroscopic Cross-Orbital System (Atomic Cross-Orbits with Alternating Bi-directional Flow, 72° Phase Lock)
const INDIVIDUAL_ORBITS = [
  {
    item: { label: 'ABOUT', icon: '◈', accent: '#FF2E63' }, // Electric Ruby
    radius: 0.205,
    initialAngle: 0,
    inclination: [0.42, 0.25, 0.18], // Left cross tilt
    speed: -0.22,
    arcAngle: 0.74,
    height: 0.046,
    trailLength: 0.95,
  },
  {
    item: { label: 'SKILLS', icon: '⬡', accent: '#FF7B00' }, // Solar Orange
    radius: 0.235,
    initialAngle: (2 * Math.PI) / 5, // 72 deg
    inclination: [-0.45, -0.28, -0.22], // Right cross tilt
    speed: 0.22,
    arcAngle: 0.70,
    height: 0.046,
    trailLength: 0.95,
  },
  {
    item: { label: 'WORK', icon: '◎', accent: '#D4FF00' }, // Acid Lime
    radius: 0.265,
    initialAngle: (4 * Math.PI) / 5, // 144 deg
    inclination: [0.75, -0.15, 0.35], // Steep diagonal tilt
    speed: -0.22,
    arcAngle: 0.68,
    height: 0.046,
    trailLength: 1.05,
  },
  {
    item: { label: 'BLOG', icon: '✦', accent: '#F72585' }, // Hot Magenta
    radius: 0.295,
    initialAngle: (6 * Math.PI) / 5, // 216 deg
    inclination: [-0.72, 0.20, -0.32], // Reverse steep diagonal tilt
    speed: 0.22,
    arcAngle: 0.66,
    height: 0.046,
    trailLength: 0.90,
  },
  {
    item: { label: 'CONTACT', icon: '⬟', accent: '#00F2FE' }, // Ice Cyan
    radius: 0.325,
    initialAngle: (8 * Math.PI) / 5, // 288 deg
    inclination: [0.15, -0.05, 0.05], // Equatorial shallow tilt
    speed: -0.22,
    arcAngle: 0.76,
    height: 0.046,
    trailLength: 1.00,
  },
];

const TARGET_HEIGHT = 3.6;

/**
 * Creates high-DPI cyberpunk viewport front canvas texture
 */
function createCyberCardTexture(item) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 144;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const w = 480;
  const h = 116;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  const r = 36;

  // Translucent holographic glass gradient
  const bgGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  bgGrad.addColorStop(0, 'rgba(4, 10, 26, 0.82)');
  bgGrad.addColorStop(0.5, 'rgba(2, 6, 16, 0.74)');
  bgGrad.addColorStop(1, 'rgba(8, 16, 36, 0.82)');

  // Rounded viewport background
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Subtle interior grid / scanlines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let ly = y + 8; ly < y + h; ly += 12) {
    ctx.beginPath();
    ctx.moveTo(x + 16, ly);
    ctx.lineTo(x + w - 16, ly);
    ctx.stroke();
  }

  // Neon glowing outer border
  ctx.shadowColor = item.accent;
  ctx.shadowBlur = 18;
  ctx.strokeStyle = item.accent;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Inner subtle highlight border
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.0;
  ctx.stroke();
  ctx.restore();

  // Cyber corner brackets [ ]
  ctx.save();
  ctx.strokeStyle = item.accent;
  ctx.lineWidth = 2.5;
  const blen = 16;
  // Top left
  ctx.beginPath();
  ctx.moveTo(x + 22, y + 10);
  ctx.lineTo(x + 10, y + 10);
  ctx.lineTo(x + 10, y + 10 + blen);
  ctx.stroke();
  // Bottom right
  ctx.beginPath();
  ctx.moveTo(x + w - 22, y + h - 10);
  ctx.lineTo(x + w - 10, y + h - 10);
  ctx.lineTo(x + w - 10, y + h - 10 - blen);
  ctx.stroke();
  ctx.restore();

  // Left Icon Glyph
  ctx.save();
  ctx.shadowColor = item.accent;
  ctx.shadowBlur = 16;
  ctx.fillStyle = item.accent;
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(item.icon, x + 56, y + h / 2);
  ctx.restore();

  // Text Label
  ctx.save();
  ctx.shadowColor = item.accent;
  ctx.shadowBlur = 14;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "Share Tech Mono", "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '3.5px';
  ctx.fillText(item.label, x + 100, y + h / 2 + 1);
  ctx.restore();

  // Status pulse dot on right
  ctx.save();
  ctx.shadowColor = item.accent;
  ctx.shadowBlur = 14;
  ctx.fillStyle = item.accent;
  ctx.beginPath();
  ctx.arc(x + w - 46, y + h / 2, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x + w - 46, y + h / 2, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates dynamic glowing plasma aura envelope texture surrounding the card
 */
function createCardAuraTexture(accent) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const w = 496;
  const h = 136;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  const r = 40;

  // Outer plasma haze
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  const auraGrad = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    20,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  auraGrad.addColorStop(0, `${accent}44`);
  auraGrad.addColorStop(0.5, `${accent}22`);
  auraGrad.addColorStop(0.85, `${accent}11`);
  auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = auraGrad;
  ctx.fill();

  // Vibrant outer aura energy boundary
  ctx.shadowColor = accent;
  ctx.shadowBlur = 24;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Secondary luminous halo ring
  ctx.shadowBlur = 12;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // Energy edge flares at corners
  ctx.save();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.0;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 14;
  const flareLen = 18;
  ctx.beginPath();
  ctx.moveTo(x + 10, y + h / 2 - flareLen);
  ctx.lineTo(x + 10, y + h / 2 + flareLen);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + w - 10, y + h / 2 - flareLen);
  ctx.lineTo(x + w - 10, y + h / 2 + flareLen);
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * 3D Plasma Aura Envelope wrapping tightly around the card
 */
function CyberCardAura({ accent, radius, arcAngle, height }) {
  const texture = useMemo(() => createCardAuraTexture(accent), [accent]);

  const auraArc = arcAngle * 1.08;
  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      radius * 1.002,
      radius * 1.002,
      height * 1.35,
      20,
      1,
      true,
      -auraArc / 2,
      auraArc
    );
  }, [radius, height, auraArc]);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    });
  }, [texture]);

  return <mesh geometry={geometry} material={material} />;
}

/**
 * Creates dynamic glowing gradient comet trail texture seamlessly continuing the aura
 */
function createTrailTexture(accent, isReversed) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  if (!isReversed) {
    // Left (0) connects flush to card aura, Right (256) is tail tip fading to zero
    grad.addColorStop(0, accent);
    grad.addColorStop(0.12, accent);
    grad.addColorStop(0.35, `${accent}99`);
    grad.addColorStop(0.70, `${accent}33`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
  } else {
    // Left (0) is tail tip fading to zero, Right (256) connects flush to card aura
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.30, `${accent}33`);
    grad.addColorStop(0.65, `${accent}99`);
    grad.addColorStop(0.88, accent);
    grad.addColorStop(1, accent);
  }

  // Tapered aerodynamic energy ribbon shape
  ctx.fillStyle = grad;
  ctx.beginPath();
  if (!isReversed) {
    ctx.moveTo(0, 8);
    ctx.lineTo(canvas.width, 28);
    ctx.lineTo(canvas.width, 36);
    ctx.lineTo(0, 56);
  } else {
    ctx.moveTo(0, 28);
    ctx.lineTo(canvas.width, 8);
    ctx.lineTo(canvas.width, 56);
    ctx.lineTo(0, 36);
  }
  ctx.closePath();
  ctx.fill();

  // Intense central laser beam in the trail
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, 32);
  ctx.lineTo(canvas.width, 32);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Colored Glowing Comet Trail Ribbon
 * Extends backward from card aura's trailing edge along the circular orbit
 */
function CyberCardTrail({ accent, radius, arcAngle, trailLength, speed, height }) {
  const isReversed = speed > 0;
  const texture = useMemo(() => createTrailTexture(accent, isReversed), [accent, isReversed]);

  const thetaStart = isReversed ? -arcAngle / 2 - trailLength : arcAngle / 2;

  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      radius,
      radius,
      height * 1.15,
      24,
      1,
      true,
      thetaStart,
      trailLength
    );
  }, [radius, height, thetaStart, trailLength]);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.90,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    });
  }, [texture]);

  return <mesh geometry={geometry} material={material} />;
}

/**
 * 3D Curved Cyberpunk Viewport Mesh
 * Translucent single-pane see-through holographic glass.
 * Front shows crisp HUD; Back naturally reveals the flipped/mirrored reverse of the glass.
 */
function CurvedCyberCard({ item, radius, arcAngle = 0.74, height = 0.046 }) {
  const texture = useMemo(() => createCyberCardTexture(item), [item]);

  const geometry = useMemo(() => {
    // Cylinder segment curved along orbit circle of radius R
    return new THREE.CylinderGeometry(
      radius,
      radius,
      height,
      20,
      1,
      true,
      -arcAngle / 2,
      arcAngle
    );
  }, [radius, height, arcAngle]);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: false,
      toneMapped: false,
    });
  }, [texture]);

  return <mesh geometry={geometry} material={material} />;
}

/**
 * HeroBustAvatar
 *
 * Direct hierarchy attachment:
 * - Scans GLB clone for Maze_Maze_0 (which sits directly in the palm).
 * - Attaches Black Hole Core, Photon Ring, and 5 Independent Planetary Orbital Belts with Unified Plasma Aura & Comet Trails.
 */
export function HeroBustAvatar({ position = [0, -2.15, 0] }) {
  const rootRef = useRef();
  const orbitRefs = useRef([]);
  const { scene } = useGLTF(GLB_PATH);

  const { dualLayerScene, mazeNode } = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    let foundMaze = null;

    const replacements = [];
    cloned.traverse((child) => {
      if (!child.isMesh && !child.isSkinnedMesh) return;
      replacements.push(child);
    });

    replacements.forEach((child) => {
      const meshName = child.name;

      // ── Hide Zweihander Sword Completely ──────────────────────────────
      if (meshName.includes('Sword') || meshName === 'Zweihander_Sword_0') {
        child.visible = false;
        return;
      }

      if (meshName === 'Maze_Maze_0') {
        foundMaze = child;
        // Make the original maze mesh transparent and render wireframe + solid black hole inside it for 100% Z-occlusion
        const wireGeo = new THREE.WireframeGeometry(child.geometry);
        const wireMat = new THREE.LineBasicMaterial({
          color: '#00E5FF',
          transparent: true,
          opacity: 0.65,
          toneMapped: false,
          depthWrite: false,
        });
        const wireLines = new THREE.LineSegments(wireGeo, wireMat);
        child.add(wireLines);

        child.material = new THREE.MeshBasicMaterial({
          color: '#020308',
          transparent: false,
          depthWrite: true,
          depthTest: true,
          toneMapped: false,
        });
        return;
      }

      const geo = child.geometry;
      if (!geo) return;

      const isEye = meshName.startsWith('Eye');
      const isRobe = meshName === 'Cloth_Robe_0';
      const isMask = meshName.startsWith('Mask_Mask_0');
      const isHand = meshName === 'Hand_Hand_0';
      const isBody = meshName === 'Body_Body_0';

      // ── Special Case: Golden Eyes (Keep original prominent glowing eyes) ──
      if (isEye) {
        const eyeMat = new THREE.MeshBasicMaterial({
          color: '#FFD700',
          transparent: false,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        });
        child.material = eyeMat;
        child.renderOrder = 10;
        return;
      }

      // ── Layer 1: Wireframe LineSegments ──────────────────────────────
      const wireGeo = new THREE.WireframeGeometry(geo);
      const wireColor = WIRE_COLOR[meshName] ?? '#00E5FF';
      const wireMat = new THREE.LineBasicMaterial({
        color: wireColor,
        transparent: true,
        opacity: isRobe ? 0.65 : 0.85,
        toneMapped: false,
        depthTest: true,
        depthWrite: false,
      });
      const wireLines = new THREE.LineSegments(wireGeo, wireMat);
      wireLines.name = meshName + '_wire';
      wireLines.renderOrder = 3;

      // ── Layer 2: Inner fill Mesh (Solid Depth Occluder for Robe/Mask/Body/Hand) ──
      const fillColor = FILL_COLOR[meshName] ?? FILL_COLOR.DEFAULT;
      const fillOpacity = FILL_OPACITY[meshName] ?? FILL_OPACITY.DEFAULT;
      const shouldWriteDepth = isRobe || isMask || isHand || isBody;

      const fillMat = new THREE.MeshBasicMaterial({
        color: fillColor,
        transparent: false,
        opacity: fillOpacity,
        side: THREE.FrontSide,
        depthTest: true,
        depthWrite: shouldWriteDepth, // Solid depth occluder for head, neck, robe, mask & hand
        toneMapped: false,
      });
      const fillMesh = new THREE.Mesh(geo.clone(), fillMat);
      fillMesh.name = meshName + '_fill';
      fillMesh.renderOrder = (isRobe || isMask) ? 0 : 1;

      child.add(wireLines);
      child.add(fillMesh);

      child.material = new THREE.MeshBasicMaterial({ visible: false, transparent: true, opacity: 0 });
      child.material.depthWrite = false;
    });

    // Auto-scale to TARGET_HEIGHT
    const bbox = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    if (size.y > 0) {
      const s = TARGET_HEIGHT / size.y;
      cloned.scale.setScalar(s);
    }

    return { dualLayerScene: cloned, mazeNode: foundMaze };
  }, [scene]);

  // Animation frame
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mouse = useCockpitStore.getState().mouseNorm;

    if (rootRef.current) {
      rootRef.current.position.y = position[1] + Math.sin(t * 1.1) * 0.02;
      rootRef.current.rotation.y = 0;
      rootRef.current.rotation.x = 0;
    }

    if (mazeNode) {
      const worldPos = new THREE.Vector3();
      mazeNode.getWorldPosition(worldPos);

      // Orbit each of the 5 cards along its independent gyroscopic cross-orbital trajectory
      INDIVIDUAL_ORBITS.forEach((orbit, i) => {
        const ref = orbitRefs.current[i];
        if (ref) {
          ref.position.copy(worldPos);
          ref.rotation.y = t * orbit.speed + orbit.initialAngle;
        }
      });
    }
  });

  return (
    <>
      <group ref={rootRef} position={position}>
        <primitive object={dualLayerScene} />
      </group>

      {/* ── 5 Concentric Rigid Circular Orbits with Unified Plasma Aura & Comet Trails ── */}
      {INDIVIDUAL_ORBITS.map((orbit, i) => (
        <group
          key={orbit.item.label}
          ref={(el) => (orbitRefs.current[i] = el)}
          rotation={orbit.inclination}
        >
          {/* Continuous Plasma Stream Tail */}
          <CyberCardTrail
            accent={orbit.item.accent}
            radius={orbit.radius}
            arcAngle={orbit.arcAngle}
            trailLength={orbit.trailLength}
            speed={orbit.speed}
            height={orbit.height}
          />

          {/* Unified Plasma Aura Envelope around the card */}
          <CyberCardAura
            accent={orbit.item.accent}
            radius={orbit.radius}
            arcAngle={orbit.arcAngle}
            height={orbit.height}
          />

          {/* Rigid 3D Curved Cyberpunk Viewport Card */}
          <CurvedCyberCard
            item={orbit.item}
            radius={orbit.radius}
            arcAngle={orbit.arcAngle}
            height={orbit.height}
          />
        </group>
      ))}
    </>
  );
}

useGLTF.preload(GLB_PATH);



