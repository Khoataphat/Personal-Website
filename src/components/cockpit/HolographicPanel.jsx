import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text, Html } from '@react-three/drei';

export function HolographicPanel({
  index,
  label,
  subLabel,
  isActive,
  isFrontFacing,
  badge,
  icon: Icon,
  details = [],
  summary,
  children,
}) {
  const scale = isActive ? 1.06 : 0.86;
  const opacity = isActive ? 1.0 : 0.45;
  const borderColor = isActive ? '#00f2fe' : '#7928ca';

  const planeGeo = useMemo(() => new THREE.PlaneGeometry(2.2, 3.0), []);
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(planeGeo), [planeGeo]);

  return (
    <group scale={[scale, scale, 1]}>
      {/* 1. 3D Glass Backing Mesh */}
      <mesh>
        <primitive object={planeGeo} attach="geometry" />
        <meshPhysicalMaterial
          color="#060810"
          transparent
          opacity={isActive ? 0.75 : 0.25}
          transmission={0.35}
          roughness={0.2}
          metalness={0.1}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Neon Cybernetic Border Frame */}
      <lineSegments>
        <primitive object={edgesGeo} attach="geometry" />
        <lineBasicMaterial
          color={borderColor}
          transparent
          opacity={isActive ? 0.95 : 0.35}
        />
      </lineSegments>

      {/* 3. 3D Top Header Text */}
      {isFrontFacing && (
        <Text
          position={[0, 1.68, 0.02]}
          fontSize={0.12}
          color={borderColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          {`⬡ ${label}`}
        </Text>
      )}

      {/* 4. Embedded Cybernetic DOM Card */}
      {isFrontFacing && (
        <Html
          center
          position={[0, -0.05, 0.05]}
          distanceFactor={4.8}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          style={{
            width: '270px',
            opacity,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: isActive ? 'auto' : 'none',
          }}
          transform
        >
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            className={`p-3.5 rounded-xl backdrop-blur-xl border transition-all duration-300 font-mono text-left select-none pointer-events-auto ${
              isActive
                ? 'bg-[#080b14]/90 border-[#00f2fe]/60 shadow-[0_0_30px_rgba(0,242,254,0.25)] ring-1 ring-[#00f2fe]/30'
                : 'bg-[#05070d]/75 border-[#7928ca]/30 shadow-lg'
            }`}
          >
            {/* Top Tag & Status */}
            <div className="flex items-center justify-between text-[10px] pb-1.5 mb-2 border-b border-white/10">
              <span className="text-[#00f2fe] tracking-widest font-bold">
                SYSTEM 0{index + 1}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider ${
                  isActive
                    ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40 animate-pulse'
                    : 'text-zinc-500 bg-white/5'
                }`}
              >
                {badge || (isActive ? 'ONLINE' : 'STANDBY')}
              </span>
            </div>

            {/* Custom Rich Children or Fallback Card */}
            {children ? (
              children
            ) : (
              <>
                {/* SubLabel / Title */}
                <div className="text-sm font-bold text-white tracking-wide mb-1.5 flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4 text-[#00f2fe]" />}
                  <span>{subLabel}</span>
                </div>

                {/* Summary / Description */}
                <p className="text-[11px] text-zinc-300 leading-relaxed mb-2.5 line-clamp-3">
                  {summary}
                </p>

                {/* Details / Tag list */}
                {details.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/10">
                    {details.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/10 font-mono"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
