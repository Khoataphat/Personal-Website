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
    // [1] Fresnel Rim Glow
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 4.0);

    // [2] Scanline
    float scanline = (sin(vWorldPosition.y * 30.0 + uTime * 2.0) + 1.0) * 0.5;
    scanline = mix(0.7, 1.0, scanline);

    // [3] Combine
    vec3 color = uColor * (fresnel * 2.0 + 0.3) * scanline;
    gl_FragColor = vec4(color, uOpacity * (fresnel + 0.15));
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
