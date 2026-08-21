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
 * Procedural Cyber-Voronoi Shader Material Generator
 * Computes 3D Voronoi facet edges + Fresnel rim glow + dynamic breathing glow directly on the GPU.
 */
function createProceduralCyberShaderMaterial({
  baseColor = '#020612',
  lineColor = '#00E5FF',
  rimColor = '#00E5FF',
  scale = 2.8,
  lineWidth = 0.048,
  glow = 1.8,
  bilateral = false,
}) {
  const vertexShader = `
    varying vec3 vLocalPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vLocalPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uBaseColor;
    uniform vec3 uLineColor;
    uniform vec3 uRimColor;
    uniform float uScale;
    uniform float uLineWidth;
    uniform float uGlow;
    uniform float uTime;
    uniform float uBilateral;

    varying vec3 vLocalPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Fast, ultra-stable non-trigonometric 3D hash (0% risk of float overflow or NaN)
    vec3 hash33(vec3 p) {
      p = fract(p * vec3(0.1031, 0.1030, 0.0973));
      p += dot(p, p.yxz + 33.33);
      return fract((p.xxy + p.yxx) * p.zyx);
    }

    // 3D Voronoi with NaN guard and boundary safety
    vec2 voronoi3D(vec3 x) {
      vec3 p = floor(x);
      vec3 f = fract(x);

      float d1 = 8.0;
      float d2 = 8.0;

      for (int k = -1; k <= 1; k++) {
        for (int j = -1; j <= 1; j++) {
          for (int i = -1; i <= 1; i++) {
            vec3 b = vec3(float(i), float(j), float(k));
            vec3 r = vec3(b) - f + hash33(p + b);
            float d = dot(r, r);

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
      vec3 pos = vLocalPosition * uScale;
      if (uBilateral > 0.5) {
        pos.x = abs(pos.x);
      }

      // Compute Voronoi boundary
      vec2 v = voronoi3D(pos);
      float edgeDist = v.y - v.x;
      float lineFactor = 1.0 - smoothstep(0.0, uLineWidth, edgeDist);

      // Subtle breathing wave modulation on glow
      float breath = 0.85 + 0.30 * sin(uTime * 0.85);
      float currentGlow = uGlow * breath;

      // Fresnel edge rim glow
      vec3 viewDir = normalize(vViewPosition);
      vec3 norm = normalize(vNormal);
      float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.5);

      // Final color composition
      vec3 col = uBaseColor;
      col = mix(col, uLineColor * currentGlow, lineFactor);
      col += uRimColor * (fresnel * 0.75 * breath);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms: {
      uBaseColor: { value: new THREE.Color(baseColor) },
      uLineColor: { value: new THREE.Color(lineColor) },
      uRimColor: { value: new THREE.Color(rimColor) },
      uScale: { value: scale },
      uLineWidth: { value: lineWidth },
      uGlow: { value: glow },
      uTime: { value: 0.0 },
      uBilateral: { value: bilateral ? 1.0 : 0.0 },
    },
    vertexShader,
    fragmentShader,
    depthTest: true,
    depthWrite: true,
    toneMapped: false,
  });
}

/**
 * Optical Multi-Layer Emissive Shader for the 6 Native Eye Meshes
 */
function createOpticalEyeMaterial() {
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vLocalPos;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vLocalPos = position;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uOuterGold;
    uniform vec3 uRimGold;
    uniform vec3 uCavityColor;
    uniform vec3 uPupilColor;
    uniform float uGlow;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vLocalPos;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      // Center-distance in UV space
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(vUv, center) * 2.0;

      // Outer gold bevel & highlight rim
      float outerRim = smoothstep(0.68, 0.86, dist);
      float outerSparkle = smoothstep(0.88, 1.0, dist);

      // Inner iris blade ring
      float irisRing = smoothstep(0.30, 0.44, dist) * (1.0 - smoothstep(0.60, 0.70, dist));
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
      float blades = sin(angle * 12.0) * 0.5 + 0.5;
      float bladeIntensity = irisRing * (0.6 + 0.4 * blades);

      // Luminous white-hot center pupil core with subtle breathing pulse
      float pupilCore = 1.0 - smoothstep(0.0, 0.28, dist);
      float breath = 0.90 + 0.20 * sin(uTime * 0.85);

      // Composite final optical eye color
      vec3 col = uCavityColor;
      col = mix(col, uOuterGold, outerRim);
      col = mix(col, uRimGold * 1.6, outerSparkle);
      col = mix(col, uOuterGold * 1.4, bladeIntensity);
      col = mix(col, uPupilColor * (uGlow * breath), pupilCore);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms: {
      uOuterGold: { value: new THREE.Color('#FFB703') },     // Solar Gold
      uRimGold: { value: new THREE.Color('#FFF275') },       // Sparkling Gold Highlight
      uCavityColor: { value: new THREE.Color('#020106') },   // Deep Obsidian
      uPupilColor: { value: new THREE.Color('#FFFFFF') },    // White-Hot Core
      uGlow: { value: 2.5 },                                 // Radiant pupil glow
      uTime: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    depthTest: true,
    depthWrite: true,
    toneMapped: false,
  });
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
  const shaderMatsRef = useRef([]);
  const { scene } = useGLTF(GLB_PATH);

  const { dualLayerScene, mazeNode } = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    let foundMaze = null;

    // Shared Material Pool to prevent WebGL pipeline recompilation and black flickering
    const matPool = {
      eye: createOpticalEyeMaterial(),
      mask: createProceduralCyberShaderMaterial({
        baseColor: '#080214',
        lineColor: '#C084FC',
        rimColor: '#A855F7',
        scale: 4.6,
        lineWidth: 0.046,
        glow: 1.85,
        bilateral: true,
      }),
      robe: createProceduralCyberShaderMaterial({
        baseColor: '#001408',
        lineColor: '#00FF88',
        rimColor: '#00FF88',
        scale: 3.6,
        lineWidth: 0.042,
        glow: 1.75,
        bilateral: false,
      }),
      straps: createProceduralCyberShaderMaterial({
        baseColor: '#05020c',
        lineColor: '#A855F7',
        rimColor: '#A855F7',
        scale: 5.5,
        lineWidth: 0.046,
        glow: 1.80,
        bilateral: false,
      }),
      hand: createProceduralCyberShaderMaterial({
        baseColor: '#020612',
        lineColor: '#00E5FF',
        rimColor: '#00E5FF',
        scale: 5.2,
        lineWidth: 0.046,
        glow: 1.85,
        bilateral: false,
      }),
      body: createProceduralCyberShaderMaterial({
        baseColor: '#020612',
        lineColor: '#00E5FF',
        rimColor: '#00E5FF',
        scale: 4.8,
        lineWidth: 0.044,
        glow: 1.85,
        bilateral: true,
      }),
    };

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

      // ── Native Optical Emissive Shader for the 6 Eyes ─────────────────
      if (meshName.startsWith('Eye')) {
        child.material = matPool.eye;
        child.visible = true;
        child.renderOrder = 4;
        return;
      }

      // ── Procedural Voronoi Facet Shader for Mask Faceplate ───────────
      if (meshName.startsWith('Mask')) {
        child.material = matPool.mask;
        child.visible = true;
        child.renderOrder = 2;
        return;
      }

      // ── Procedural Cyber Emerald Facet Shader for Cloth Robe ─────────
      if (meshName.startsWith('Cloth') || meshName.includes('Robe')) {
        child.material = matPool.robe;
        child.visible = true;
        child.renderOrder = 1;
        return;
      }

      // ── Procedural Violet Facet Shader for Straps ────────────────────
      if (meshName.startsWith('straps') || meshName.includes('Straps')) {
        child.material = matPool.straps;
        child.visible = true;
        child.renderOrder = 2;
        return;
      }

      // ── Procedural Electric Cyan Facet Shader for Hand ───────────────
      if (meshName.startsWith('Hand') || meshName.includes('Hand')) {
        child.material = matPool.hand;
        child.visible = true;
        child.renderOrder = 2;
        return;
      }

      // ── Default: Procedural Electric Cyan Facet Shader for Body & Neck
      child.material = matPool.body;
      child.visible = true;
      child.renderOrder = 1;
    });

    shaderMatsRef.current = Object.values(matPool);

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

    // Update breathing glow on all full-body shader materials
    shaderMatsRef.current.forEach((mat) => {
      if (mat.uniforms && mat.uniforms.uTime) {
        mat.uniforms.uTime.value = t;
      }
    });

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



