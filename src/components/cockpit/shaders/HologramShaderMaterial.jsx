import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  uniform float uTime;
  uniform float uGlitchStrength;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;

    // Glitch displacement (Vertex Glitch)
    float glitch = step(0.98, fract(sin(worldPos.y * 12.9898 + uTime) * 43758.5453));
    vec3 displaced = position;
    displaced.x += glitch * uGlitchStrength;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    // [1] Smooth Fresnel Rim Glow (power 2.0 for clear silhouette)
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float NdotV = max(0.0, dot(vNormal, viewDir));
    float fresnel = pow(1.0 - NdotV, 2.0);

    // [2] Scanline Cyber Wave
    float scanline = (sin(vWorldPosition.y * 30.0 + uTime * 3.0) + 1.0) * 0.5;
    scanline = mix(0.75, 1.0, scanline);

    // [3] Combine with strong emissive base and Fresnel edge
    vec3 color = uColor * (fresnel * 2.2 + 0.7) * scanline;
    float alpha = uOpacity * (fresnel * 0.65 + 0.45);

    gl_FragColor = vec4(color, alpha);
  }
`;

export const HologramMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00f2fe'),
    uOpacity: 0.85,
    uGlitchStrength: 0.04,
  },
  vertexShader,
  fragmentShader,
  (material) => {
    material.transparent = true;
    material.side = THREE.DoubleSide;
    material.depthWrite = false;
  }
);

extend({ HologramMaterial });

export function createHologramMaterial(color = '#00f2fe') {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0.85 },
      uGlitchStrength: { value: 0.04 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}
