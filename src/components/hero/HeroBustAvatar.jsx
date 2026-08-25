import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useCockpitStore } from '../../store/cockpitStore';
import { soundFx } from '../../services/soundFx';
import { cutsceneDirector } from '../../services/cutscene';

const GLB_PATH = `${import.meta.env.BASE_URL}models/avatar.glb`;

const WIRE_COLOR = {
  'Body_Body_0': '#00E5FF',
  'Hand_Hand_0': '#00E5FF',
  'Zweihander_Sword_0': '#7A00FF',
  'Mask_Mask_0': '#C084FC', // Lavender Neon for Low-Poly Faceplate
  'Mask_Mask_0_1': '#C084FC',
  'Mask_Mask_0_2': '#C084FC',
  'straps_Straps_0': '#A855F7',
  'Cloth_Robe_0': '#00FF88',
  'Eye_Eye_0': '#FFB703',
  'Eye001_Eye_0': '#FFB703',
  'Eye002_Eye_0': '#FFB703',
  'Eye003_Eye_0': '#FFB703',
  'Eye004_Eye_0': '#FFB703',
  'Eye005_Eye_0': '#FFB703',
  'Maze_Maze_0': '#00E5FF',
};

const FILL_OPACITY = {
  'Cloth_Robe_0': 0.98,
  'Body_Body_0': 0.98,
  'Hand_Hand_0': 0.98,
  'Mask_Mask_0': 0.98,
  'Mask_Mask_0_1': 0.98,
  'Mask_Mask_0_2': 0.98,
  DEFAULT: 0.98,
};

const FILL_COLOR = {
  'Cloth_Robe_0': '#001408',
  'Body_Body_0': '#020612',
  'Hand_Hand_0': '#020612',
  'Mask_Mask_0': '#080214', // Deep Obsidian Black-Purple
  'Mask_Mask_0_1': '#080214',
  'Mask_Mask_0_2': '#080214',
  DEFAULT: '#050814',
};

// 5-Axis Gyroscopic Cross-Orbital System (Atomic Cross-Orbits with Alternating Bi-directional Flow, 72° Phase Lock)
const INDIVIDUAL_ORBITS = [
  {
    item: { label: 'ABOUT', icon: '◈', accent: '#FF2E63' }, // Electric Ruby
    radius: 0.245,
    initialAngle: 0,
    inclination: [0.42, 0.25, 0.18], // Left cross tilt
    speed: -0.22,
    arcAngle: 0.68,
    height: 0.046,
    trailLength: 0.88,
  },
  {
    item: { label: 'SKILLS', icon: '⬡', accent: '#FF7B00' }, // Solar Orange
    radius: 0.275,
    initialAngle: (2 * Math.PI) / 5, // 72 deg
    inclination: [-0.45, -0.28, -0.22], // Right cross tilt
    speed: 0.22,
    arcAngle: 0.66,
    height: 0.046,
    trailLength: 0.88,
  },
  {
    item: { label: 'WORK', icon: '◎', accent: '#D4FF00' }, // Acid Lime
    radius: 0.305,
    initialAngle: (4 * Math.PI) / 5, // 144 deg
    inclination: [0.75, -0.15, 0.35], // Steep diagonal tilt
    speed: -0.22,
    arcAngle: 0.64,
    height: 0.046,
    trailLength: 0.92,
  },
  {
    item: { label: 'BLOG', icon: '✦', accent: '#F72585' }, // Hot Magenta
    radius: 0.335,
    initialAngle: (6 * Math.PI) / 5, // 216 deg
    inclination: [-0.72, 0.20, -0.32], // Reverse steep diagonal tilt
    speed: 0.22,
    arcAngle: 0.62,
    height: 0.046,
    trailLength: 0.86,
  },
  {
    item: { label: 'CONTACT', icon: '⬟', accent: '#00F2FE' }, // Ice Cyan
    radius: 0.365,
    initialAngle: (8 * Math.PI) / 5, // 288 deg
    inclination: [0.15, -0.05, 0.05], // Equatorial shallow tilt
    speed: -0.22,
    arcAngle: 0.70,
    height: 0.046,
    trailLength: 0.95,
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
  ctx.font = 'bold 36px "Fira Code", monospace';
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
    grad.addColorStop(0.15, `${accent}dd`);
    grad.addColorStop(0.40, `${accent}77`);
    grad.addColorStop(0.72, `${accent}22`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
  } else {
    // Left (0) is tail tip fading to zero, Right (256) connects flush to card aura
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.28, `${accent}22`);
    grad.addColorStop(0.60, `${accent}77`);
    grad.addColorStop(0.85, `${accent}dd`);
    grad.addColorStop(1, accent);
  }

  // Tapered aerodynamic energy ribbon shape
  ctx.fillStyle = grad;
  ctx.beginPath();
  if (!isReversed) {
    ctx.moveTo(0, 10);
    ctx.lineTo(canvas.width, 29);
    ctx.lineTo(canvas.width, 35);
    ctx.lineTo(0, 54);
  } else {
    ctx.moveTo(0, 29);
    ctx.lineTo(canvas.width, 10);
    ctx.lineTo(canvas.width, 54);
    ctx.lineTo(0, 35);
  }
  ctx.closePath();
  ctx.fill();

  // Intense central laser beam in the trail
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.0;
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

  const handlePointerDown = (e) => {
    e.stopPropagation();
    const tabMap = { 'ABOUT': 0, 'SKILLS': 1, 'WORK': 2, 'BLOG': 3, 'CONTACT': 4 };
    const tabIndex = tabMap[item.label] ?? 0;
    const store = useCockpitStore.getState();
    if (!store.isDossierOpen) {
      soundFx.playDockClick?.();
      store.startHeroTransition(tabIndex);
    } else {
      soundFx.playPanelSwitch?.();
      store.switchDossierTab(tabIndex);
    }
  };

  return (
    <mesh
      geometry={geometry}
      material={material}
      onPointerDown={handlePointerDown}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    />
  );
}

/**
 * Procedural 2x2 Twill Carbon Weave & Razor-Thin Nano Laser Traces Shader
 */
function createProceduralCyberShaderMaterial({
  baseColor = '#05020a',
  lineColor = '#C084FC',
  rimColor = '#9333EA',
  viaColor = '#FFB703',
  scale = 26.0,
  lineWidth = 0.014,
  glow = 1.85,
  bilateral = true,
  isMask = false,
  isBody = false,
  isHand = false,
  palmCenter = new THREE.Vector3(0, 0, 0),
  eyeCenters = [],
  eyeT = [],
  eyeB = [],
  eyeRadii = [],
}) {
  const vertexShader = `
    uniform float uIsBody;
    uniform float uIsHand;
    uniform float uClenchProgress;
    uniform vec3 uPalmCenter;
    uniform mat4 uHeadMatrix;

    varying vec3 vLocalPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 pos = position;
      vec3 norm = normal;

      if (uIsBody > 0.5) {
        // Procedural Linear Blend Skinning:
        // pos.z in Body_Body_0: -0.10 (chest, weight = 0.0) -> 0.22 (head base, weight = 1.0)
        float weight = smoothstep(-0.10, 0.22, pos.z);

        // Exact 4x4 Joint Matrix Transformation:
        // For pos.z >= 0.22 (the full 3D skull and head), weight = 1.0, rotating identically 1:1 with the mask
        vec4 transformedPos = uHeadMatrix * vec4(pos, 1.0);
        vec3 transformedNorm = mat3(uHeadMatrix) * norm;

        pos = mix(pos, transformedPos.xyz, weight);
        norm = normalize(mix(norm, transformedNorm, weight));
      }

      if (uIsHand > 0.5 && uClenchProgress > 0.0) {
        // Bio-mechanical clench: fingers curl inward toward palm center
        vec3 toCenter = uPalmCenter - pos;
        float dist = length(toCenter);
        // Progressive inward flex based on distance from palm core
        vec3 clenchOffset = normalize(toCenter) * (dist * 0.46 * uClenchProgress);
        pos += clenchOffset;
      }

      vLocalPosition = pos;
      vNormal = normalize(normalMatrix * norm);
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uBaseColor;
    uniform vec3 uLineColor;
    uniform vec3 uRimColor;
    uniform vec3 uViaColor;
    uniform float uScale;
    uniform float uLineWidth;
    uniform float uGlow;
    uniform float uTime;
    uniform float uMouseSpeed;
    uniform float uBilateral;
    uniform float uIsMask;
    uniform vec3 uEyeCenters[6];
    uniform vec3 uEyeT[6];
    uniform vec3 uEyeB[6];
    uniform vec2 uEyeRadii[6];

    varying vec3 vLocalPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // High precision pseudo-random generator
    vec3 hash33(vec3 p) {
      p = fract(p * vec3(0.1031, 0.1030, 0.0973));
      p += dot(p, p.yxz + 33.33);
      return fract((p.xxy + p.yxx) * p.zyx);
    }

    // 2x2 Twill Carbon Weave Pattern & Micro-facet Normal Perturbation
    // Returns: vec3(yarnHeight, yarnCurve, isWarp ? 1.0 : 0.0)
    vec3 evaluate2x2TwillCarbon(vec2 uv) {
      // 45-degree diagonal rotation for classic twill weave orientation
      vec2 rotUV = vec2(uv.x + uv.y, uv.y - uv.x) * 0.70710678 * 1.8;

      vec2 cellId = floor(rotUV);
      vec2 cellUv = fract(rotUV);

      // In a 2x2 twill weave, the interlacing pattern has a period of 4
      float pattern = mod(cellId.x - cellId.y, 4.0);
      bool isWarp = (pattern < 2.0);

      // Smooth parabolic cylindrical profile across yarn width
      float uCoord = isWarp ? cellUv.x : cellUv.y;
      float yarnCurve = sin(uCoord * 3.14159265);
      float yarnHeight = pow(yarnCurve, 0.55);

      // Subtle micro-fiber striation along yarn length
      float vCoord = isWarp ? rotUV.y : rotUV.x;
      float microFiber = sin(vCoord * 18.84955) * 0.04;

      return vec3(yarnHeight + microFiber, yarnCurve, isWarp ? 1.0 : 0.0);
    }

    // Sparse, Razor-Thin Nano Laser Traces (No big blobs, perfectly clean)
    float evaluateNanoLaserTraces(vec2 uv) {
      vec2 grid = floor(uv * 0.35);
      vec2 local = fract(uv * 0.35);
      vec3 rnd = hash33(vec3(grid, 31.7));

      float minD = 10.0;

      // Selectively draw clean, sparse parallel and 45° bus lines
      if (rnd.x > 0.58) {
        float lineY = 0.25 + floor(rnd.y * 2.0) * 0.5;
        minD = min(minD, abs(local.y - lineY));
      }
      if (rnd.y > 0.62) {
        float lineX = 0.25 + floor(rnd.z * 2.0) * 0.5;
        minD = min(minD, abs(local.x - lineX));
      }
      if (rnd.z > 0.72) {
        // Clean 45-degree diagonal jumper
        float dDiag = abs((local.x - local.y)) * 0.70710678;
        minD = min(minD, dDiag);
      }

      return minD;
    }

    void main() {
      vec3 pos = vLocalPosition * uScale;
      if (uBilateral > 0.5) {
        pos.x = abs(pos.x);
      }

      vec3 norm = normalize(vNormal);

      // Sharp Dominant-Axis Triplanar Projection
      vec3 blendWeight = pow(abs(norm), vec3(6.0));
      blendWeight /= (blendWeight.x + blendWeight.y + blendWeight.z + 0.0001);

      // 1. Carbon Weave Evaluation
      vec3 cX = evaluate2x2TwillCarbon(pos.yz);
      vec3 cY = evaluate2x2TwillCarbon(pos.xz);
      vec3 cZ = evaluate2x2TwillCarbon(pos.xy);
      float carbonHeight = cX.x * blendWeight.x + cY.x * blendWeight.y + cZ.x * blendWeight.z;
      float yarnCurve = cX.y * blendWeight.x + cY.y * blendWeight.y + cZ.y * blendWeight.z;

      // 2. Nano Laser Traces
      float dX = evaluateNanoLaserTraces(pos.yz);
      float dY = evaluateNanoLaserTraces(pos.xz);
      float dZ = evaluateNanoLaserTraces(pos.xy);
      float minLaser = dX * blendWeight.x + dY * blendWeight.y + dZ * blendWeight.z;

      // Razor-sharp nano laser line factor (super thin & crisp)
      float laserFactor = 1.0 - smoothstep(0.0, uLineWidth, minLaser);

      // 3. Diagnostic Nano Energy Pulse Wave (~4.5s cycle)
      float scanCycle = 4.5;
      float scanProg = fract(uTime / scanCycle);
      float scanY = mix(-1.4, 1.8, scanProg);
      float distY = vLocalPosition.y - scanY;

      float scanWave = 0.0;
      if (distY <= 0.05 && distY > -0.65) {
        float wProgress = (distY + 0.65) / 0.70;
        scanWave = pow(sin(wProgress * 3.14159 * 0.5), 2.0);
      }

      float breath = 0.94 + 0.06 * sin(uTime * 0.75);
      float laserGlow = (uGlow * breath + scanWave * 1.8 + uMouseSpeed * 0.25);

      // ── Voronoi Eye Framing & Organic Eyelid 3D Relief ─────────────
      vec3 eyelidNormalBump = vec3(0.0);
      float socketAO = 1.0;

      if (uIsMask > 0.5) {
        float eyelidGlow = 0.0;
        float insideSocketMask = 0.0;

        for (int i = 0; i < 6; i++) {
          vec3 d = vLocalPosition - uEyeCenters[i];
          float u = dot(d, uEyeT[i]);
          float w = dot(d, uEyeB[i]);
          float a = uEyeRadii[i].x;
          float b = uEyeRadii[i].y;

          // Superellipse metric (p=2.2)
          float normU = abs(u) / max(a, 0.001);
          float normW = abs(w) / max(b, 0.001);
          float M = pow(pow(normU, 2.2) + pow(normW, 2.2), 1.0 / 2.2);

          vec3 gradDir = normalize(uEyeT[i] * (u / max(a * a, 0.0001)) + uEyeB[i] * (w / max(b * b, 0.0001)));

          // 1. Deep Socket Ambient Occlusion (darkens deep inside socket hole)
          float currentAO = smoothstep(0.82, 1.12, M);
          socketAO = min(socketAO, currentAO);

          // 2. Cut out random laser traces inside the socket hole
          float cutHole = 1.0 - smoothstep(0.85, 1.15, M);
          insideSocketMask = max(insideSocketMask, cutHole);

          // 3. Eyelid 3D Relief Normal Perturbation
          float slope = 0.0;
          if (M >= 0.88 && M < 1.22) {
            slope = sin((M - 0.88) / 0.34 * 3.14159) * 0.85;
          } else if (M >= 1.22 && M < 1.62) {
            slope = -sin((M - 1.22) / 0.40 * 3.14159) * 0.65;
          } else if (M >= 1.62 && M < 1.98) {
            slope = sin((M - 1.62) / 0.36 * 6.28318) * 0.30;
          }
          eyelidNormalBump += gradDir * slope;

          // 4. Razor-Thin Eyelid Contour Glow Lines
          float innerLip = (1.0 - smoothstep(0.0, uLineWidth * 1.2, abs(M - 0.96))) * 0.60;
          float peakRidge = (1.0 - smoothstep(0.0, uLineWidth * 1.5, abs(M - 1.22))) * 1.35;
          float outerFold = (1.0 - smoothstep(0.0, uLineWidth * 1.3, abs(M - 1.62))) * 0.75;

          float eyeContour = max(max(peakRidge, outerFold), innerLip);
          eyelidGlow = max(eyelidGlow, eyeContour);
        }

        laserFactor = mix(laserFactor, 0.0, insideSocketMask);
        laserFactor = max(laserFactor, eyelidGlow);
      }

      // ── 3D Surface Relief Lighting & Anisotropic Carbon Specular Sheen ──
      vec3 perturbedNorm = normalize(norm + eyelidNormalBump * 0.90);
      vec3 viewDir = normalize(vViewPosition);

      vec3 light1 = normalize(vec3(0.4, 0.7, 0.9));
      vec3 light2 = normalize(vec3(-0.5, 0.3, 0.7));
      float diff1 = max(dot(perturbedNorm, light1), 0.0);
      float diff2 = max(dot(perturbedNorm, light2), 0.0);
      float lighting = 0.20 + diff1 * 0.55 + diff2 * 0.30;

      // Anisotropic Specular Highlights on 2x2 Twill Carbon Fibers
      vec3 half1 = normalize(light1 + viewDir);
      vec3 half2 = normalize(light2 + viewDir);
      float spec1 = pow(max(dot(perturbedNorm, half1), 0.0), 28.0) * (0.35 + 0.65 * yarnCurve);
      float spec2 = pow(max(dot(perturbedNorm, half2), 0.0), 18.0) * 0.30;

      // Fresnel edge rim glow
      float fresnel = pow(1.0 - max(dot(viewDir, perturbedNorm), 0.0), 2.5);

      // Deep Obsidian Base Tint with subtle carbon weave micro-shading
      vec3 carbonBase = uBaseColor * (lighting + carbonHeight * 0.35);
      vec3 specSheen = mix(vec3(0.85, 0.92, 1.0), uRimColor, 0.35) * (spec1 * 0.75 + spec2 * 0.35);

      // Final composite with razor-thin laser emissive
      vec3 laserEmissive = uLineColor * (laserFactor * laserGlow);
      vec3 laserWaveFlash = vec3(1.0) * (scanWave * laserFactor * 1.2);

      vec3 col = (carbonBase + specSheen) * socketAO;
      col = mix(col, laserEmissive + laserWaveFlash, clamp(laserFactor, 0.0, 1.0));
      col += uRimColor * (fresnel * 0.55 * breath);
      col = clamp(col, vec3(0.0), vec3(4.0));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  // Default empty arrays for non-mask materials
  const defaultZeros = () => [
    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(),
    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
  ];
  const defaultVec2s = () => [
    new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(),
    new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()
  ];

  return new THREE.ShaderMaterial({
    uniforms: {
      uBaseColor: { value: new THREE.Color(baseColor) },
      uLineColor: { value: new THREE.Color(lineColor) },
      uRimColor: { value: new THREE.Color(rimColor) },
      uViaColor: { value: new THREE.Color(viaColor) },
      uScale: { value: scale },
      uLineWidth: { value: lineWidth },
      uGlow: { value: glow },
      uTime: { value: 0.0 },
      uMouseSpeed: { value: 0.0 },
      uBilateral: { value: bilateral ? 1.0 : 0.0 },
      uIsMask: { value: isMask ? 1.0 : 0.0 },
      uIsBody: { value: isBody ? 1.0 : 0.0 },
      uIsHand: { value: isHand ? 1.0 : 0.0 },
      uClenchProgress: { value: 0.0 },
      uPalmCenter: { value: palmCenter ? palmCenter.clone() : new THREE.Vector3(0, 0, 0) },
      uHeadMatrix: { value: new THREE.Matrix4() },
      uEyeCenters: { value: eyeCenters.length === 6 ? eyeCenters : defaultZeros() },
      uEyeT: { value: eyeT.length === 6 ? eyeT : defaultZeros() },
      uEyeB: { value: eyeB.length === 6 ? eyeB : defaultZeros() },
      uEyeRadii: { value: eyeRadii.length === 6 ? eyeRadii : defaultVec2s() },
    },
    vertexShader,
    fragmentShader,
    depthTest: true,
    depthWrite: true,
    side: THREE.FrontSide,
    toneMapped: false,
  });
}

/**
 * Energy Discharge Eye Shader — 6 Native Eye Meshes
 * Key: dot(viewDir, norm) = NDotV is 1 at the pole facing camera, 0 at rim.
 * disc coords = norm.xy (view-space) — maps to 2D disc on each sphere
 * regardless of the sphere's orientation in world space.
 */
function createOpticalEyeMaterial() {
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    precision highp float;

    uniform vec3  uVoidColor;      // Deep black void sclera
    uniform vec3  uBoltCyan;       // Primary lightning: electric cyan
    uniform vec3  uBoltViolet;     // Secondary lightning: quantum violet
    uniform vec3  uCoreWhite;      // Pupil singularity white-hot core
    uniform vec3  uCoronaAmber;    // Outer corona amber/gold rim
    uniform vec2  uPupilOffset;    // Gaze tracking
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // ─── Hash/noise helpers ────────────────────────────────────────────
    float hash11(float n) { return fract(sin(n) * 43758.5453123); }

    float valueNoise(float x) {
      float i = floor(x);
      float f = fract(x);
      float u = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), u);
    }

    // ─── Single jagged lightning bolt ─────────────────────────────────
    // uv.x = radial direction (forward), uv.y = lateral displacement
    float lightningBolt(vec2 uv, float seed, float rMax, float jitter, float spd) {
      const int SEGS = 8;
      float intensity = 0.0;

      for (int i = 1; i <= SEGS; i++) {
        float t     = float(i)     / float(SEGS);
        float tPrev = float(i - 1) / float(SEGS);

        float noiseC = valueNoise(seed + t     * 11.0 + uTime * spd);
        float noiseP = valueNoise(seed + tPrev * 11.0 + uTime * spd);

        vec2 cur   = vec2(t    * rMax, (noiseC - 0.5) * jitter);
        vec2 prev2 = vec2(tPrev * rMax, (noiseP - 0.5) * jitter);

        vec2 seg = cur - prev2;
        vec2 toP = uv  - prev2;
        float tt = clamp(dot(toP, seg) / (dot(seg, seg) + 1e-5), 0.0, 1.0);
        float d  = length(toP - seg * tt);

        // Thin glowing core + wider soft halo
        float core = smoothstep(0.022, 0.0,   d);
        float halo = smoothstep(0.075, 0.006, d) * 0.5;
        intensity  = max(intensity, core + halo);
      }
      return intensity;
    }

    void main() {
      vec3 norm    = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // NDotV: 1.0 at the pole of sphere closest to camera, 0.0 at the rim
      float NDotV = max(dot(norm, viewDir), 0.0);

      // disc: view-space norm.xy gives 2D eyeball surface coordinates
      vec2 disc = norm.xy;
      float rDisc = length(disc);
      float angDisc = atan(disc.y, disc.x);

      // Shifted pupil center (travels across the eyeball up to ~0.58)
      vec2 pupilCenter = uPupilOffset;
      vec2 toPupil = disc - pupilCenter;
      float rPupil = length(toPupil);

      float fresnel = pow(1.0 - NDotV, 2.2);

      // ── 1. Void sclera ─────────────────────────────────────────────────
      vec3 col = uVoidColor;

      // ── 2. Zones ──────────────────────────────────────────────────────
      // Iris disc is bounded to eyeball surface:
      float irisOuter = 0.95;
      float inIris = smoothstep(irisOuter, 0.15, rDisc);

      // Pupil is centered at the dynamic pupilCenter:
      float pupilR = 0.16;
      float inPupil = smoothstep(pupilR, 0.0, rPupil);

      // ── 3. Pupil Singularity Core (moves dynamically with pupilCenter) ─
      float pulse    = 0.75 + 0.35 * sin(uTime * 5.8);
      float coreGlow = smoothstep(0.48, 0.0, rPupil);
      col = mix(col, uBoltCyan  * 7.0 * pulse, coreGlow * NDotV);
      col = mix(col, uCoreWhite * 14.0 * pulse, inPupil  * NDotV);

      // ── 4. Lightning Bolts radiating directly from moving pupilCenter ──
      const int NB = 10;
      float boltSum = 0.0;
      vec3  boltCol = vec3(0.0);

      for (int i = 0; i < NB; i++) {
        float fi    = float(i);
        float drift = uTime * 0.10 * (hash11(fi * 3.71) * 2.0 - 1.0);
        float angle = (fi / float(NB)) * 6.28318 + drift;
        float ca = cos(-angle), sa = sin(-angle);
        vec2 local = vec2(ca * toPupil.x - sa * toPupil.y,
                          sa * toPupil.x + ca * toPupil.y);
        if (local.x < 0.01) continue;

        float seed   = fi * 7.339 + 42.1;
        float rMax   = irisOuter * (0.65 + hash11(fi * 1.91) * 0.35);
        float jitter = 0.06 + hash11(fi * 2.37) * 0.08;
        float spd    = 3.0  + hash11(fi * 0.53) * 3.0;

        float bolt = lightningBolt(local, seed, rMax, jitter, spd) * NDotV;
        float iv   = step(0.5, hash11(fi * 5.17));
        boltSum += bolt;
        boltCol += mix(uBoltCyan, uBoltViolet, iv) * bolt;
      }
      boltSum = clamp(boltSum, 0.0, 1.0);
      if (boltSum > 0.001) boltCol /= (boltSum * 5.0 + 0.001);
      boltCol *= boltSum;
      col = mix(col, boltCol * 8.0, inIris * boltSum);

      // ── 5. Iris ambient glow ───────────────────────────────────────────
      col += uBoltCyan * inIris * NDotV * (0.40 + 0.20 * sin(uTime * 2.5 + rPupil * 15.0));

      // ── 6. Amber Corona Ring (anchored at iris perimeter) ─────────────
      float rd = abs(rDisc - irisOuter * 0.94);
      float rm = smoothstep(0.055, 0.0, rd) * NDotV;
      col += uCoronaAmber * rm * (0.7 + 0.3 * sin(uTime * 4.0 + angDisc * 5.0)) * 5.0;

      // ── 7. Fresnel electric rim ────────────────────────────────────────
      col += uBoltCyan   * fresnel * 3.5;
      col += uBoltViolet * fresnel * 1.5;

      // ── 8. Dynamic Specular Catchlights (Moves in 1:1 sync with pupil) ──
      // Primary glossy glint on top-right edge of moving pupil
      vec2 toGlint1 = toPupil - vec2(0.045, 0.055);
      float glint1  = smoothstep(0.065, 0.005, length(toGlint1)) * 2.2;

      // Secondary subtle catchlight on bottom-left edge
      vec2 toGlint2 = toPupil + vec2(0.035, 0.035);
      float glint2  = smoothstep(0.035, 0.002, length(toGlint2)) * 1.2;

      col += vec3(glint1 * 0.9 + glint2 * 0.7, glint1 + glint2, glint1 + glint2) * NDotV;

      col = clamp(col, vec3(0.0), vec3(10.0));
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms: {
      uVoidColor:   { value: new THREE.Color('#010208') },
      uBoltCyan:    { value: new THREE.Color('#00FFFF') },
      uBoltViolet:  { value: new THREE.Color('#BF5FFF') },
      uCoreWhite:   { value: new THREE.Color('#FFFFFF') },
      uCoronaAmber: { value: new THREE.Color('#FFB300') },
      uPupilOffset: { value: new THREE.Vector2(0, 0) },
      uTime:        { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    depthTest: true,
    depthWrite: true,
    toneMapped: false,
    transparent: false,
  });
}



/**
 * Quantum Singularity Core Shader for Maze_Maze_0
 * Renders a celestial black hole event horizon with rotating quantum energy filaments,
 * pulsating gravitational accretion ripples, and a dynamic Cyan-to-Violet Fresnel photon halo.
 */
function createSingularityCoreMaterial() {
  const vertexShader = `
    varying vec3 vLocalPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vLocalPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    precision mediump float;

    uniform vec3 uCoreColor;
    uniform vec3 uCyanPlasma;
    uniform vec3 uPurplePlasma;
    uniform float uGlow;
    uniform float uTime;

    varying vec3 vLocalPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    vec3 hash33(vec3 p) {
      p = fract(p * vec3(443.897, 441.423, 437.195));
      p += dot(p, p.yxz + 19.19);
      return fract((p.xxy + p.yxx) * p.zyx);
    }

    vec2 voronoi3D(vec3 p) {
      vec3 b = floor(p);
      vec3 f = fract(p);
      float d1 = 8.0;
      float d2 = 8.0;

      for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
          for (int z = -1; z <= 1; z++) {
            vec3 cell = vec3(float(x), float(y), float(z));
            vec3 pt = cell + hash33(b + cell);
            float d = dot(pt - f, pt - f);
            if (d < d1) {
              d2 = d1;
              d1 = d;
            } else if (d < d2) {
              d2 = d;
            }
          }
        }
      }

      return vec2(sqrt(max(d1, 0.0)), sqrt(max(d2, 0.0)));
    }

    void main() {
      // Rotate 3D coordinates over time to create spinning accretion vortex
      vec3 p = vLocalPosition * 5.2;
      float angle = uTime * 0.75;
      mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      p.xz = rot * p.xz;

      // 3D Voronoi energy filaments
      vec2 v = voronoi3D(p);
      float edgeDist = v.y - v.x;
      float filaments = 1.0 - smoothstep(0.0, 0.075, edgeDist);

      // Gravitational ripple pulse from the singularity center
      float rDist = length(vLocalPosition);
      float pulseWave = sin(rDist * 40.0 - uTime * 3.2) * 0.5 + 0.5;

      // Dual-layer Fresnel photon accretion halo
      vec3 viewDir = normalize(vViewPosition);
      vec3 norm = normalize(vNormal);
      float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.2);

      // Dynamic breathing modulation
      float breath = 0.90 + 0.15 * sin(uTime * 0.95);

      // Color composition
      vec3 col = uCoreColor;

      // Filaments energy glow in quantum cyan
      col = mix(col, uCyanPlasma * (uGlow * breath), filaments * 0.88);

      // Accretion pulse ripple in electric violet
      col += uPurplePlasma * (pulseWave * filaments * 0.45 * breath);

      // Outer photon accretion rim (Cyan shifting to Violet at extreme angles)
      vec3 rimColor = mix(uCyanPlasma, uPurplePlasma, fresnel);
      col += rimColor * (fresnel * 2.2 * breath);

      // Safety clamp to guard against any GPU float overflow
      col = clamp(col, vec3(0.0), vec3(4.0));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms: {
      uCoreColor: { value: new THREE.Color('#01030a') },
      uCyanPlasma: { value: new THREE.Color('#00E5FF') },
      uPurplePlasma: { value: new THREE.Color('#A855F7') },
      uGlow: { value: 2.2 },
      uTime: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    depthTest: true,
    depthWrite: true,
    side: THREE.FrontSide,
    toneMapped: false,
  });
}


export const CELESTIAL_CONFIG = {
  baseScale: 0.75,      // 75% size by default
  hoverScale: 1.00,     // 100% size on hover (full original scale)
  lerpSpeed: 0.08,      // Smooth interpolation factor
};

/**
 * HeroBustAvatar
 *
 * Direct hierarchy attachment:
 * - Scans GLB clone for Maze_Maze_0 (which sits directly in the palm).
 * - Attaches Quantum Singularity Core, Photon Ring, and 5 Independent Planetary Orbital Belts with Unified Plasma Aura & Comet Trails.
 * - Supports Dynamic Master Scaling & Interactive Hover Zoom.
 */
export function HeroBustAvatar({ position = [0, -2.15, 0], coreScale = null }) {
  const rootRef = useRef();
  const headGroupRef = useRef(null);
  const bodyMeshRef = useRef(null);
  const handMeshRef = useRef(null);
  const handMatRef = useRef(null);
  const mazeMatRef = useRef(null);
  const currentHeadRotRef = useRef({ yaw: 0, pitch: 0 });
  const orbitRefs = useRef([]);
  const shaderMatsRef = useRef([]);
  const eyeMatsRef = useRef([]);
  const eyeMeshesRef = useRef([]);
  // ── Multi-Eye 6-Track Inertia Buffers: independent micro-lag per eye ─
  const smoothEyeRefs  = useRef(Array.from({ length: 6 }, () => ({ x: 0, y: 0 })));
  const smoothHeadRef  = useRef({ x: 0, y: 0 }); // Head Assembly inertia buffer
  // ── Soft Return-to-Center Target (lerps to 0 gradually on mouse leave) ─
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseSpeedRef = useRef(0);
  const hitAreaRef = useRef();
  const targetScaleRef = useRef(CELESTIAL_CONFIG.baseScale);
  const currentScaleRef = useRef(CELESTIAL_CONFIG.baseScale);

  // ── Cinematic Hero-to-Dossier Hand Crush Transition Refs ────────────
  const transitionStartRef = useRef(null);
  const audioTriggeredRef = useRef({ frenzy: false, absorb: false, clench: false, crush: false });

  const { scene } = useGLTF(GLB_PATH);

  const { dualLayerScene, mazeNode } = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    let foundMaze = null;

    // 6 Independent Eye Material Instances for True Parallax Convergence
    const eyeMaterials = Array.from({ length: 6 }, () => createOpticalEyeMaterial());

    // Shared Material Pool to prevent WebGL pipeline recompilation and black flickering
    const matPool = {
      mask: createProceduralCyberShaderMaterial({
        baseColor: '#080214',
        lineColor: '#C084FC',
        rimColor: '#A855F7',
        viaColor: '#FFB703',
        scale: 26.0,
        lineWidth: 0.014,
        glow: 1.85,
        bilateral: true,
        isMask: true,
        eyeCenters: [
          new THREE.Vector3(0.1005, -0.4056, 0.3008),
          new THREE.Vector3(0.3569, -0.3459, 0.4423),
          new THREE.Vector3(-0.3463, -0.3464, 0.4100),
          new THREE.Vector3(-0.1730, -0.4236, 0.0655),
          new THREE.Vector3(0.1228, -0.4222, -0.1640),
          new THREE.Vector3(0.2800, -0.3951, 0.0834),
        ],
        eyeT: [
          new THREE.Vector3(0.9953, 0.0874, 0.0423),
          new THREE.Vector3(0.9437, 0.2501, -0.2165),
          new THREE.Vector3(0.9163, -0.4006, -0.0015),
          new THREE.Vector3(0.9625, -0.2400, -0.1265),
          new THREE.Vector3(0.9050, 0.1711, -0.3895),
          new THREE.Vector3(0.9511, 0.3081, -0.0219),
        ],
        eyeB: [
          new THREE.Vector3(-0.0936, 0.7471, 0.6581),
          new THREE.Vector3(-0.0902, 0.8242, 0.5590),
          new THREE.Vector3(0.2999, 0.6835, 0.6654),
          new THREE.Vector3(0.2428, 0.5537, 0.7966),
          new THREE.Vector3(0.1973, 0.6422, 0.7407),
          new THREE.Vector3(-0.2140, 0.7084, 0.6726),
        ],
        eyeRadii: [
          new THREE.Vector2(0.085, 0.040),
          new THREE.Vector2(0.092, 0.044),
          new THREE.Vector2(0.094, 0.046),
          new THREE.Vector2(0.080, 0.038),
          new THREE.Vector2(0.092, 0.052),
          new THREE.Vector2(0.096, 0.060),
        ],
      }),
      robe: createProceduralCyberShaderMaterial({
        baseColor: '#001408',
        lineColor: '#00FF88',
        rimColor: '#00FF88',
        viaColor: '#FFB703',
        scale: 22.0,
        lineWidth: 0.012,
        glow: 1.75,
        bilateral: false,
      }),
      straps: createProceduralCyberShaderMaterial({
        baseColor: '#05020c',
        lineColor: '#A855F7',
        rimColor: '#A855F7',
        viaColor: '#FFB703',
        scale: 28.0,
        lineWidth: 0.015,
        glow: 1.80,
        bilateral: false,
      }),
      hand: createProceduralCyberShaderMaterial({
        baseColor: '#020612',
        lineColor: '#00E5FF',
        rimColor: '#00E5FF',
        viaColor: '#FFB703',
        scale: 28.0,
        lineWidth: 0.014,
        glow: 1.85,
        bilateral: false,
        isHand: true,
        palmCenter: new THREE.Vector3(0.0, 0.0, 0.0),
      }),
      body: createProceduralCyberShaderMaterial({
        baseColor: '#020612',
        lineColor: '#00E5FF',
        rimColor: '#00E5FF',
        viaColor: '#FFB703',
        scale: 24.0,
        lineWidth: 0.014,
        glow: 1.85,
        bilateral: true,
        isBody: true,
      }),
      maze: createSingularityCoreMaterial(),
    };

    const eyeMeshes = [];
    const headNodesSet = new Set();

    // Traverse to apply materials and collect head component parent nodes
    cloned.traverse((child) => {
      if (!child.isMesh && !child.isSkinnedMesh) return;
      const meshName = child.name;

      // ── Hide Zweihander Sword Completely ──────────────────────────────
      if (meshName.includes('Sword') || meshName === 'Zweihander_Sword_0') {
        child.visible = false;
        return;
      }

      // ── Quantum Singularity Core for Maze Sphere ─────────────────────
      if (meshName === 'Maze_Maze_0') {
        foundMaze = child;
        child.userData.initialScale = child.scale.clone();
        child.material = matPool.maze;
        child.visible = true;
        child.renderOrder = 7;
        return;
      }

      const geo = child.geometry;
      if (!geo) return;

      // ── Native Optical Emissive Shader for the 6 Eyes ─────────────────
      if (meshName.startsWith('Eye')) {
        const eyeIdx = eyeMeshes.length;
        const mat = eyeMaterials[eyeIdx] || createOpticalEyeMaterial();
        child.material = mat;
        child.visible = true;
        child.renderOrder = 8;
        eyeMeshes.push(child);
        if (child.parent) headNodesSet.add(child.parent);
        return;
      }

      // ── Procedural Voronoi Facet Shader for Mask Faceplate ───────────
      if (meshName.startsWith('Mask')) {
        child.material = matPool.mask;
        child.visible = true;
        child.renderOrder = 5;
        if (child.parent) headNodesSet.add(child.parent);
        return;
      }

      // ── Procedural Violet Facet Shader for Straps ────────────────────
      if (meshName.startsWith('straps') || meshName.includes('Straps')) {
        child.material = matPool.straps;
        child.visible = true;
        child.renderOrder = 6;
        if (child.parent) headNodesSet.add(child.parent);
        return;
      }

      // ── Procedural Cyber Emerald Facet Shader for Cloth Robe ─────────
      if (meshName.startsWith('Cloth') || meshName.includes('Robe')) {
        child.material = matPool.robe;
        child.visible = true;
        child.renderOrder = 2;
        return;
      }

      // ── Procedural Electric Cyan Facet Shader for Hand ───────────────
      if (meshName.startsWith('Hand') || meshName.includes('Hand')) {
        child.material = matPool.hand;
        child.visible = true;
        child.renderOrder = 4;
        handMeshRef.current = child;
        if (child.geometry) {
          child.geometry.computeBoundingBox();
          const pCenter = new THREE.Vector3();
          child.geometry.boundingBox.getCenter(pCenter);
          if (matPool.hand.uniforms.uPalmCenter) {
            matPool.hand.uniforms.uPalmCenter.value.copy(pCenter);
          }
        }
        return;
      }

      // ── Default: Intact Continuous Body & Neck Material ──────────────
      if (meshName.startsWith('Body_Body') || meshName === 'Body_Body_0') {
        bodyMeshRef.current = child;
      }
      child.material = matPool.body;
      child.visible = true;
      child.renderOrder = 3;
    });

    // ── Restructure Scene Graph for Full Unified Head Unit Articulation ──
    const rootNode = cloned.getObjectByName('RootNode') || cloned;

    // Neck Pivot in RootNode space (center of the neck collar)
    const NECK_PIVOT_LOCAL = new THREE.Vector3(0.801, 715.0, -40.99);
    const headPivotGroup = new THREE.Group();
    headPivotGroup.name = 'HeadPivotGroup';
    headPivotGroup.position.copy(NECK_PIVOT_LOCAL);
    rootNode.add(headPivotGroup);

    // Reparent all head components (Mask + Straps + 6 Eyes) into headPivotGroup
    headNodesSet.forEach((node) => {
      node.position.sub(NECK_PIVOT_LOCAL);
      headPivotGroup.add(node);
    });

    headGroupRef.current = headPivotGroup;
    handMatRef.current = matPool.hand;
    mazeMatRef.current = matPool.maze;
    shaderMatsRef.current = [...Object.values(matPool), ...eyeMaterials];
    eyeMatsRef.current = eyeMaterials;
    eyeMeshesRef.current = eyeMeshes;

    // Auto-scale to TARGET_HEIGHT
    const bbox = new THREE.Box3().setFromObject(cloned);
    const naturalHeight = bbox.max.y - bbox.min.y;
    const initialScale = TARGET_HEIGHT / naturalHeight;
    cloned.scale.setScalar(initialScale);

    return { dualLayerScene: cloned, mazeNode: foundMaze };
  }, [scene]);

  // Animation frame
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const rawMouse = useCockpitStore.getState().mouseNorm || { x: 0, y: 0 };
    const isInsideCanvas = useCockpitStore.getState().isMouseActive;
    const isDossierOpen = useCockpitStore.getState().isDossierOpen;
    const activeThemeAccent = useCockpitStore.getState().activeThemeAccent || '#00f2fe';

    // ── 0. Dynamic Singularity Core Plasma Shader Harmonization ───────
    if (mazeMatRef.current && mazeMatRef.current.uniforms) {
      const targetCol = new THREE.Color(activeThemeAccent);
      mazeMatRef.current.uniforms.uCyanPlasma.value.lerp(targetCol, delta * 6.0);
      const targetCol2 = targetCol.clone().offsetHSL(0.06, 0.0, 0.18);
      mazeMatRef.current.uniforms.uPurplePlasma.value.lerp(targetCol2, delta * 6.0);
    }

    const dx = rawMouse.x - prevMouseRef.current.x;
    const dy = rawMouse.y - prevMouseRef.current.y;
    const mouseSpeed = Math.hypot(dx, dy) / Math.max(0.001, delta);
    prevMouseRef.current = { x: rawMouse.x, y: rawMouse.y };
    smoothMouseSpeedRef.current = THREE.MathUtils.lerp(smoothMouseSpeedRef.current, Math.min(mouseSpeed, 8.0), 0.15);

    // Update breathing glow & mouse speed on all full-body shader materials
    shaderMatsRef.current.forEach((mat) => {
      if (mat.uniforms) {
        if (mat.uniforms.uTime) mat.uniforms.uTime.value = t;
        if (mat.uniforms.uMouseSpeed) mat.uniforms.uMouseSpeed.value = smoothMouseSpeedRef.current;
      }
    });

    if (isInsideCanvas) {
      // Mouse is inside: track actual position with a gentle lead-in
      mouseTargetRef.current.x = THREE.MathUtils.lerp(mouseTargetRef.current.x, rawMouse.x, 0.18);
      mouseTargetRef.current.y = THREE.MathUtils.lerp(mouseTargetRef.current.y, rawMouse.y, 0.18);
    } else {
      // Mouse left: ease the TARGET itself gently toward (0,0) — lerp 0.025 = ~0.4s drift back
      mouseTargetRef.current.x = THREE.MathUtils.lerp(mouseTargetRef.current.x, 0, 0.025);
      mouseTargetRef.current.y = THREE.MathUtils.lerp(mouseTargetRef.current.y, 0, 0.025);
    }
    const mouse = mouseTargetRef.current;

    // ── Head Assembly Inertia Buffer (Calm Sovereign Damping 0.05) ────
    smoothHeadRef.current.x = THREE.MathUtils.lerp(smoothHeadRef.current.x, mouse.x, 0.05);
    smoothHeadRef.current.y = THREE.MathUtils.lerp(smoothHeadRef.current.y, mouse.y, 0.05);

    const hdX = smoothHeadRef.current.x;
    const hdY = smoothHeadRef.current.y;

    // ── Soft easeOut Clamp — prevents hard robot-like angle cutoff ──────
    const softClamp = (v, limit) => {
      const sign = v >= 0 ? 1 : -1;
      return sign * limit * (1 - Math.exp(-Math.abs(v) / limit));
    };

    // ── 1. Multi-Eye 3D Gaze Convergence & Parallax Tracking (Gaze Lead-In) ──
    const lerpSpeeds = [0.15, 0.11, 0.14, 0.09, 0.13, 0.10];
    const targetWorldX = mouse.x * 2.8;
    const targetWorldY = mouse.y * 1.8 - 0.2;
    const targetWorldZ = 2.4;

    const tempEyeWorldPos = new THREE.Vector3();
    const tempGaze = new THREE.Vector3();

    eyeMeshesRef.current.forEach((eyeMesh, i) => {
      const mat = eyeMatsRef.current[i];
      if (!mat || !mat.uniforms || !mat.uniforms.uPupilOffset) return;

      // Exact 3D world position of this eye
      eyeMesh.getWorldPosition(tempEyeWorldPos);

      // Gaze vector from eye to target in world space (Parallax Convergence)
      tempGaze.set(
        targetWorldX - tempEyeWorldPos.x,
        targetWorldY - tempEyeWorldPos.y,
        targetWorldZ - tempEyeWorldPos.z
      ).normalize();

      // Convert gaze vector to disc offset (wide stylized travel)
      let targetOffsetX = tempGaze.x * 1.15;
      let targetOffsetY = tempGaze.y * 1.15;

      // Idle Scan & Saccades / Micro-tremors
      if (!isInsideCanvas) {
        const saccadeChance = Math.sin(t * 1.8 + i * 2.1);
        const jump = saccadeChance > 0.82 ? Math.sin(t * 8.0 + i * 3.7) * 0.18 : 0.0;
        const idleNoiseX = Math.sin(t * (0.8 + i * 0.25) + i * 1.3) * 0.12 + jump;
        const idleNoiseY = Math.cos(t * (0.6 + i * 0.20) + i * 2.7) * 0.08;
        targetOffsetX += idleNoiseX;
        targetOffsetY += idleNoiseY;
      } else {
        const microTremorX = Math.sin(t * 14.0 + i * 4.2) * 0.015;
        const microTremorY = Math.cos(t * 12.0 + i * 3.1) * 0.012;
        targetOffsetX += microTremorX;
        targetOffsetY += microTremorY;
      }

      // Stylized travel limit clamp (~0.58)
      const maxRange = 0.58;
      const currentLen = Math.hypot(targetOffsetX, targetOffsetY);
      if (currentLen > maxRange) {
        targetOffsetX = (targetOffsetX / currentLen) * maxRange;
        targetOffsetY = (targetOffsetY / currentLen) * maxRange;
      }

      // Smooth per-eye independent lerp (Multi-Eye Micro-Lag / Gaze Lead-In)
      const lSpeed = lerpSpeeds[i] || 0.12;
      smoothEyeRefs.current[i].x = THREE.MathUtils.lerp(smoothEyeRefs.current[i].x, targetOffsetX, lSpeed);
      smoothEyeRefs.current[i].y = THREE.MathUtils.lerp(smoothEyeRefs.current[i].y, targetOffsetY, lSpeed);

      mat.uniforms.uPupilOffset.value.set(smoothEyeRefs.current[i].x, smoothEyeRefs.current[i].y);
    });

    // ── 2. Full Unified Head Unit Articulation ────────────────────────
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    const headIdleY = Math.sin(t * 0.80) * 0.012 + Math.sin(t * 1.37) * 0.005;
    const headIdleX = Math.sin(t * 1.10) * 0.006 + Math.sin(t * 0.63) * 0.003;

    // When Dossier is open: Head is locked facing left toward content (-0.42 rad ~ -24.1°)
    const headMouseY = softClamp(hdX * 0.22, 0.35);
    const headMouseX = softClamp(-hdY * 0.14, 0.21);

    const targetHeadYaw = (isDossierOpen && isDesktop) ? -0.42 : (headMouseY + headIdleY);
    const targetHeadPitch = (isDossierOpen && isDesktop) ? 0.04 : (headMouseX + headIdleX);

    currentHeadRotRef.current.yaw = THREE.MathUtils.lerp(
      currentHeadRotRef.current.yaw,
      targetHeadYaw,
      Math.min(1, delta * 4.5)
    );
    currentHeadRotRef.current.pitch = THREE.MathUtils.lerp(
      currentHeadRotRef.current.pitch,
      targetHeadPitch,
      Math.min(1, delta * 4.5)
    );

    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = currentHeadRotRef.current.yaw;
      headGroupRef.current.rotation.x = currentHeadRotRef.current.pitch;
    }

    // ── 3. Update Exact 4x4 Head Skinning Matrix on Continuous Neck Body Mesh ──
    if (headGroupRef.current && bodyMeshRef.current) {
      const headGroup = headGroupRef.current;

      const pivotInBodyMesh = new THREE.Vector3(0.0, 0.166876, 0.161891);

      // Delta rotation of head in bodyMesh local space:
      const bodyQuatInRoot = new THREE.Quaternion(-0.7071068, 0, 0, 0.7071067);
      const headQuatInRoot = headGroup.quaternion.clone();
      const deltaQuat = bodyQuatInRoot.clone().invert().multiply(headQuatInRoot).multiply(bodyQuatInRoot);

      const uHeadMatrix = new THREE.Matrix4();
      const m1 = new THREE.Matrix4().makeTranslation(-pivotInBodyMesh.x, -pivotInBodyMesh.y, -pivotInBodyMesh.z);
      const m2 = new THREE.Matrix4().makeRotationFromQuaternion(deltaQuat);
      const m3 = new THREE.Matrix4().makeTranslation(pivotInBodyMesh.x, pivotInBodyMesh.y, pivotInBodyMesh.z);
      uHeadMatrix.multiplyMatrices(m3, m2).multiply(m1);

      shaderMatsRef.current.forEach((mat) => {
        if (mat.uniforms && mat.uniforms.uHeadMatrix) {
          mat.uniforms.uHeadMatrix.value.copy(uHeadMatrix);
        }
      });
    }

    // ── 4. Torso Grounding: ZERO mouse tilt, only calm levitation bobbing ──
    if (rootRef.current) {
      rootRef.current.position.y = position[1] + Math.sin(t * 1.1) * 0.02;
      rootRef.current.rotation.set(0, 0, 0);
    }

    // ── 5. Cinematic Hand Crush Transition (OOP Cutscene Engine) ───────
    const heroTransition = useCockpitStore.getState().heroTransition;
    let transitionScaleMultiplier = 1.0;
    let frameState = null;

    if (heroTransition && heroTransition.active) {
      const targetTab = heroTransition.targetTab ?? 0;
      const accentColor = heroTransition.accentColor || '#00f2fe';
      frameState = cutsceneDirector.update(t, delta, { targetTab, accentColor });

      if (frameState) {
        transitionScaleMultiplier = frameState.coreScale ?? 1.0;
        if (handMatRef.current?.uniforms?.uClenchProgress) {
          handMatRef.current.uniforms.uClenchProgress.value = frameState.handClench ?? 0.0;
        }
      }
    } else {
      if (handMatRef.current?.uniforms?.uClenchProgress) {
        handMatRef.current.uniforms.uClenchProgress.value = 0.0;
      }
    }

    // Dynamic scale interpolation (defaults to 50%, smoothly scales to 75% on hover)
    const desiredScale = coreScale !== null ? coreScale : targetScaleRef.current;
    currentScaleRef.current = THREE.MathUtils.lerp(
      currentScaleRef.current,
      desiredScale,
      CELESTIAL_CONFIG.lerpSpeed
    );
    const scale = currentScaleRef.current * transitionScaleMultiplier;

    if (mazeNode) {
      const worldPos = new THREE.Vector3();
      mazeNode.getWorldPosition(worldPos);

      // Project 3D world position of the Singularity Core to 2D screen coordinates
      const proj = worldPos.clone().project(state.camera);
      const screenX = (proj.x * 0.5 + 0.5) * window.innerWidth;
      const screenY = (-proj.y * 0.5 + 0.5) * window.innerHeight;
      useCockpitStore.getState().setOrbScreenPos({ x: screenX, y: screenY });
      useCockpitStore.getState().setOrbWorldPos({ x: worldPos.x, y: worldPos.y, z: worldPos.z });

      // Scale the singularity core sphere proportionally relative to its native GLB scale
      if (mazeNode.userData && mazeNode.userData.initialScale) {
        mazeNode.scale.copy(mazeNode.userData.initialScale).multiplyScalar(scale);
      } else {
        mazeNode.scale.setScalar(0.39852 * scale);
      }

      // Sync interactive hit area position
      if (hitAreaRef.current) {
        hitAreaRef.current.position.copy(worldPos);
      }

      // Orbit each of the 5 cards along its independent gyroscopic cross-orbital trajectory
      INDIVIDUAL_ORBITS.forEach((orbit, i) => {
        const ref = orbitRefs.current[i];
        if (!ref) return;

        ref.position.copy(worldPos);

        if (frameState) {
          const targetTab = heroTransition.targetTab ?? 0;
          if (i === targetTab && typeof frameState.calculateTargetCard === 'function') {
            const cardTransform = frameState.calculateTargetCard(orbit, scale);
            ref.rotation.x = cardTransform.rotation.x;
            ref.rotation.y = cardTransform.rotation.y;
            ref.rotation.z = cardTransform.rotation.z;
            ref.scale.setScalar(cardTransform.scale);
            ref.visible = cardTransform.visible !== false;
          } else if (typeof frameState.calculateOtherCard === 'function') {
            const cardTransform = frameState.calculateOtherCard(orbit, scale);
            ref.rotation.x = cardTransform.rotation.x;
            ref.rotation.y = cardTransform.rotation.y;
            ref.rotation.z = cardTransform.rotation.z;
            ref.scale.setScalar(cardTransform.scale);
            ref.visible = cardTransform.visible !== false;
          }
        } else {
          // Normal idle gyroscopic orbit
          ref.rotation.x = orbit.inclination[0];
          ref.rotation.y = t * orbit.speed + orbit.initialAngle;
          ref.rotation.z = orbit.inclination[2];
          ref.scale.setScalar(scale);
          ref.visible = true;
        }
      });
    }
  });

  return (
    <>
      <group ref={rootRef} position={position}>
        <primitive object={dualLayerScene} />
      </group>

      {/* ── Interactive Hit Target for Core Hover Zoom ── */}
      <mesh
        ref={hitAreaRef}
        visible={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          targetScaleRef.current = CELESTIAL_CONFIG.hoverScale;
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          targetScaleRef.current = CELESTIAL_CONFIG.baseScale;
        }}
      >
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

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



