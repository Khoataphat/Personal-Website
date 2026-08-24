import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCockpitStore, SECTION_THEMES } from '../../store/cockpitStore';

// ── 3D GLSL Simplex Noise & Multi-Harmonic Wave Math ───────────────
const NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const RIBBON_VERTEX_SHADER = `
varying vec2 vUv;
varying float vDisplacement;
uniform float uTime;
uniform float uIntensity;
uniform float uRibbonIndex;

${NOISE_GLSL}

void main() {
  vUv = uv;
  vec3 pos = position;

  // Wave ripple factor — zero at origin orb (uv.x = 0), maximum toward left panel (uv.x = 1)
  float fanSpan = smoothstep(0.0, 1.0, 1.0 - uv.x);
  float seed = uRibbonIndex * 1.73;

  // Multi-harmonic 3D undulating wave displacement
  float waveZ = sin(pos.x * 5.0 + uTime * (1.8 + uRibbonIndex * 0.25) + seed) * 0.09;
  waveZ += snoise(vec2(pos.x * 3.5 - uTime * 0.5, pos.y * 3.0 + seed)) * 0.06;
  
  float waveY = cos(pos.x * 4.2 + uTime * (1.5 + uRibbonIndex * 0.20) + seed) * 0.06;

  pos.z += waveZ * fanSpan * uIntensity;
  pos.y += waveY * fanSpan * uIntensity;

  vDisplacement = waveZ;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const RIBBON_FRAGMENT_SHADER = `
varying vec2 vUv;
varying float vDisplacement;
uniform float uTime;
uniform float uIntensity;
uniform float uRibbonIndex;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;

${NOISE_GLSL}

void main() {
  if (uIntensity < 0.005) discard;

  // 1. Vertical Curtain Light Striations on Top Ribbon (uRibbonIndex == 0.0)
  float isCurtain = step(uRibbonIndex, 0.5);
  float striationFreq = mix(18.0, 42.0, isCurtain);
  float waveWarp = snoise(vec2(vUv.x * 8.0 - uTime * 0.5, vUv.y * 4.0 + uRibbonIndex)) * 3.0;
  float striations = sin(vUv.x * striationFreq + waveWarp);
  striations = pow(abs(striations), mix(1.6, 2.4, isCurtain));

  // 2. Silk Plasma Sheen Flow
  float plasmaNoise = snoise(vec2(vUv.x * 4.5 - uTime * (0.6 + uRibbonIndex * 0.1), vUv.y * 3.0 + uRibbonIndex)) * 0.5 + 0.5;

  // 3. Dual-Tone Gradient Harmony (White Core -> Primary Theme -> Secondary Ethereal)
  vec3 whiteCore = vec3(1.0, 1.0, 1.0);
  float coreBrilliance = pow(smoothstep(0.0, 0.40, vUv.x), 2.0);
  
  vec3 baseTone = mix(uPrimaryColor, uSecondaryColor, plasmaNoise * 0.65 + uRibbonIndex * 0.08);
  vec3 finalColor = mix(whiteCore, baseTone, coreBrilliance);

  // Add luminous striation highlights
  finalColor += uPrimaryColor * striations * 0.70;
  finalColor += uSecondaryColor * (1.0 - striations) * 0.40;

  // 4. Clean Ribbon Boundary Feathering (Empty spaces between ribbons)
  // Horizontal fade (taper at Orb connection and panel edge)
  float alphaX = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
  // Vertical ribbon edge falloff (crisp silk ribbon borders)
  float alphaY = smoothstep(0.0, 0.28, vUv.y) * smoothstep(1.0, 0.72, vUv.y);

  float ribbonAlpha = mix(0.75, 0.95, isCurtain);
  float alpha = (striations * 0.60 + plasmaNoise * 0.40) * alphaX * alphaY * ribbonAlpha * uIntensity;

  if (alpha < 0.003) discard;

  gl_FragColor = vec4(finalColor, alpha);
}
`;

// ── 5 Distinct 3D Ribbon Specifications Matching Mockup ─────────────
const RIBBON_CONFIGS = [
  { id: 0, pos: [0.0, 0.26, 0.04],  scale: [1.50, 0.38, 1], rot: [0.06, 0.0, 0.08] },  // Top Curtain with vertical striations
  { id: 1, pos: [0.0, 0.11, 0.02],  scale: [1.44, 0.20, 1], rot: [0.04, 0.0, 0.04] },  // Upper-mid undulating silk strand
  { id: 2, pos: [0.0, -0.02, 0.00], scale: [1.48, 0.16, 1], rot: [0.00, 0.0, 0.00] },  // Center high-energy core laser ribbon
  { id: 3, pos: [0.0, -0.15, -0.02], scale: [1.42, 0.20, 1], rot: [-0.04, 0.0, -0.04] }, // Lower-mid twisting silk ribbon
  { id: 4, pos: [0.0, -0.28, -0.04], scale: [1.36, 0.18, 1], rot: [-0.08, 0.0, -0.07] }, // Bottom ethereal silk filament
];

export function VolumetricAuroraCurtain3D() {
  const isDossierOpen = useCockpitStore((s) => s.isDossierOpen);
  const activeDossierTab = useCockpitStore((s) => s.activeDossierTab);
  const activeThemeAccent = useCockpitStore((s) => s.activeThemeAccent || '#00f2fe');
  const activeThemeSecondary = useCockpitStore((s) => s.activeThemeSecondary || '#818cf8');

  const matRefs = useRef([]);
  const particlesRef = useRef(null);

  // Exact theme colors
  const primaryColor = useMemo(() => new THREE.Color(activeThemeAccent), [activeThemeAccent]);
  const secondaryColor = useMemo(() => new THREE.Color(activeThemeSecondary), [activeThemeSecondary]);

  // Create 5 Independent Shader Materials for the 5 distinct ribbons
  const materials = useMemo(() => {
    return RIBBON_CONFIGS.map((cfg) => {
      const uniforms = {
        uTime: { value: 0 },
        uIntensity: { value: 0 },
        uRibbonIndex: { value: cfg.id },
        uPrimaryColor: { value: new THREE.Color(activeThemeAccent) },
        uSecondaryColor: { value: new THREE.Color(activeThemeSecondary) },
      };

      return new THREE.ShaderMaterial({
        vertexShader: RIBBON_VERTEX_SHADER,
        fragmentShader: RIBBON_FRAGMENT_SHADER,
        uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    });
  }, []);

  // Create 3D Flowing Photon Stream Particles
  const photonParticles = useMemo(() => {
    const count = 24;
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    const ribbonIds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      speeds[i] = 0.42 + (i % 4) * 0.12;
      offsets[i] = i / count;
      ribbonIds[i] = i % 5;
    }
    return { count, pos, speeds, offsets, ribbonIds };
  }, []);

  useFrame((_, delta) => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    const targetIntensity = isDossierOpen && isDesktop ? 1.0 : 0.0;

    materials.forEach((mat) => {
      if (!mat.uniforms) return;

      // Smooth intensity lerp
      mat.uniforms.uIntensity.value = THREE.MathUtils.lerp(
        mat.uniforms.uIntensity.value,
        targetIntensity,
        Math.min(1, delta * 4.5)
      );

      if (mat.uniforms.uIntensity.value > 0.001) {
        mat.uniforms.uTime.value += delta;
        // Smooth direct color lerping
        mat.uniforms.uPrimaryColor.value.lerp(primaryColor, Math.min(1, delta * 8.0));
        mat.uniforms.uSecondaryColor.value.lerp(secondaryColor, Math.min(1, delta * 8.0));
      }
    });

    // Update 3D Floating Photon Particles along the 5 ribbon trajectories
    if (particlesRef.current && materials[0]?.uniforms?.uIntensity?.value > 0.001) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const t = materials[0].uniforms.uTime.value;
      const intensity = materials[0].uniforms.uIntensity.value;

      for (let i = 0; i < photonParticles.count; i++) {
        const progress = (t * photonParticles.speeds[i] + photonParticles.offsets[i]) % 1.0;
        const rId = photonParticles.ribbonIds[i];
        const rCfg = RIBBON_CONFIGS[rId] || RIBBON_CONFIGS[0];

        // Curve trajectory from Orb [0.02, -0.28, 0.42] to Panel edge [-0.56, rCfg.pos[1], 0.22]
        const startX = 0.02;
        const startY = -0.28;
        const startZ = 0.42;

        const endX = -0.56;
        const endY = rCfg.pos[1] * 1.15;
        const endZ = 0.22 + rCfg.pos[2];

        const curveX = THREE.MathUtils.lerp(startX, endX, progress);
        const curveY = THREE.MathUtils.lerp(startY, endY, progress) + Math.sin(progress * Math.PI * 2.0 + t * 2.5 + rId) * 0.035;
        const curveZ = THREE.MathUtils.lerp(startZ, endZ, progress) + Math.cos(progress * Math.PI + t * 1.8 + rId) * 0.04;

        positions[i * 3] = curveX;
        positions[i * 3 + 1] = curveY;
        positions[i * 3 + 2] = curveZ;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.material.opacity = intensity * 0.95;
    }
  });

  return (
    <group position={[-0.26, -0.08, 0.32]} rotation={[0.08, 0.32, -0.04]}>
      {/* 5 Distinct 3D Silk Aurora Ribbons Matching Mockup */}
      {RIBBON_CONFIGS.map((cfg, i) => (
        <mesh
          key={`ribbon-${cfg.id}`}
          position={cfg.pos}
          rotation={cfg.rot}
          scale={cfg.scale}
          material={materials[i]}
        >
          {/* Subdivided ribbon plane geometry */}
          <planeGeometry args={[1.0, 1.0, 48, 20]} />
        </mesh>
      ))}

      {/* 3D Flowing Photon Stream Points */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={photonParticles.count}
            array={photonParticles.pos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.032}
          color={primaryColor}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0}
        />
      </points>
    </group>
  );
}
