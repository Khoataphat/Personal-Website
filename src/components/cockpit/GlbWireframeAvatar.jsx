import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

// ─────────────────────────────────────────────────────────────
// MESH COLOR MAP  (key = mesh.name từ GLB, value = hex color)
// ─────────────────────────────────────────────────────────────
// Node names đã confirm từ console:
//   Body_Body_0      → Cyan  (thân người)
//   Hand_Hand_0      → Cyan  (tay)
//   Zweihander_Sword_0 → Purple (kiếm)
//   Mask_Mask_0      → Purple (mặt nạ phần 1)
//   Mask_Mask_0_1    → Purple (mặt nạ phần 2)
//   Mask_Mask_0_2    → Cyan   (mặt nạ phần 3)
//   straps_Straps_0  → Purple (dây đai)
//   Cloth_Robe_0     → Green  (áo choàng)
//   Eye_Eye_0        → Yellow (mắt chính)
//   Eye001_Eye_0 ... Eye005_Eye_0 → Yellow (các mắt phụ)
//   Maze_Maze_0      → Cyan   (quả cầu maze)
// ─────────────────────────────────────────────────────────────
const MESH_COLOR_MAP = {
  'Body_Body_0':        '#00E5FF',  // Cyan  — thân người
  'Hand_Hand_0':        '#00E5FF',  // Cyan  — tay
  'Zweihander_Sword_0': '#7A00FF',  // Purple — kiếm
  'Mask_Mask_0':        '#7A00FF',  // Purple — mặt nạ
  'Mask_Mask_0_1':      '#7A00FF',  // Purple — mặt nạ
  'Mask_Mask_0_2':      '#00E5FF',  // Cyan   — viền mặt nạ
  'straps_Straps_0':    '#7A00FF',  // Purple — dây đai
  'Cloth_Robe_0':       '#00FF88',  // Green  — áo choàng
  'Eye_Eye_0':          '#FFD700',  // Yellow — mắt
  'Eye001_Eye_0':       '#FFD700',  // Yellow
  'Eye002_Eye_0':       '#FFD700',  // Yellow
  'Eye003_Eye_0':       '#FFD700',  // Yellow
  'Eye004_Eye_0':       '#FFD700',  // Yellow
  'Eye005_Eye_0':       '#FFD700',  // Yellow
  'Maze_Maze_0':        '#00E5FF',  // Cyan   — quả cầu maze
  DEFAULT:              '#00E5FF',  // Fallback
};

// Opacity theo tên mesh
const MESH_OPACITY_MAP = {
  'Cloth_Robe_0': 0.60,  // Áo choàng mờ hơn để thấy thân bên trong
  'Maze_Maze_0':  0.70,  // Quả cầu maze bán trong suốt
  DEFAULT:        0.88,
};

// Vite base path: '/Personal-Website/' — GLB path phải relative với base
const GLB_PATH = `${import.meta.env.BASE_URL}models/avatar.glb`;

/**
 * GlbWireframeAvatar
 *
 * Load GLB từ /models/avatar.glb, clone scene, traverse tất cả mesh,
 * convert sang WireframeGeometry + LineBasicMaterial theo màu node name.
 * Original mesh geometry ẩn hoàn toàn — GLB chỉ làm khung wireframe.
 *
 * Architecture:
 *   - Clone scene để tránh mutation ảnh hưởng đến cache của useGLTF
 *   - Traverse clone, replace từng Mesh bằng LineSegments (wireframe)
 *   - Render <primitive object={clonedScene}> — giữ đúng transform hierarchy
 *
 * Props:
 *   position [x, y, z]  — vị trí gốc trong scene (default: [0, -0.9, 0])
 *   scale    number      — scale đồng đều (default: 1.0)
 */
export function GlbWireframeAvatar({ position = [0, -0.9, 0], scale = 1.0 }) {
  const rootRef = useRef();

  // Load GLB (meshopt-compressed → useGLTF handles it natively)
  const { scene } = useGLTF(GLB_PATH);

  // Clone scene và convert tất cả Mesh → LineSegments wireframe
  const wireframeScene = useMemo(() => {
    // Clone toàn bộ scene graph (deep clone giữ đúng transform hierarchy)
    const cloned = scene.clone(true);

    // Force update world matrices trên clone
    cloned.updateMatrixWorld(true);

    // Traverse và replace mesh bằng wireframe lines
    const toReplace = [];

    cloned.traverse((child) => {
      if (!child.isMesh && !child.isSkinnedMesh) return;

      // Debug: in tên node ra console để biết mapping
      console.log('[GLB Node]', child.name, '| visible:', child.visible);

      const sourceGeo = child.geometry;
      if (!sourceGeo) return;

      // Tạo WireframeGeometry từ geometry gốc
      const wireGeo = new THREE.WireframeGeometry(sourceGeo);

      // Lấy màu và opacity theo tên node
      const color   = MESH_COLOR_MAP[child.name]   ?? MESH_COLOR_MAP.DEFAULT;
      const opacity = MESH_OPACITY_MAP[child.name] ?? MESH_OPACITY_MAP.DEFAULT;

      const wireMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        toneMapped:  false,
        depthWrite:  false, // Tránh z-fighting giữa wireframe layers
      });

      // Tạo LineSegments thay thế mesh — giữ nguyên name để trace
      const lines = new THREE.LineSegments(wireGeo, wireMat);
      lines.name = child.name + '_wire';

      // Sao chép transform từ mesh gốc
      lines.position.copy(child.position);
      lines.rotation.copy(child.rotation);
      lines.scale.copy(child.scale);
      lines.matrix.copy(child.matrix);
      lines.matrixAutoUpdate = false;

      toReplace.push({ child, lines, parent: child.parent });
    });

    // Thực hiện swap sau khi traverse xong (tránh modify trong khi traverse)
    toReplace.forEach(({ child, lines, parent }) => {
      if (parent) {
        parent.remove(child);
        parent.add(lines);
      }
    });

    // ── AUTO-NORMALIZE SCALE ──────────────────────────────────────────
    // Tính bounding box thực của model sau khi swap wireframe
    // và scale về chiều cao mục tiêu TARGET_HEIGHT (scene units)
    // để đảm bảo avatar luôn vừa với scene bất kể native GLB units.
    const TARGET_HEIGHT = 2.0; // ~chiều cao của HumanWireframeAvatar cũ

    const bbox = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    if (size.y > 0) {
      const normalizeScale = TARGET_HEIGHT / size.y;
      cloned.scale.setScalar(normalizeScale);
      console.log(
        `[GlbWireframeAvatar] BBox height=${size.y.toFixed(3)} → normalizeScale=${normalizeScale.toFixed(4)}`
      );
    }
    // ─────────────────────────────────────────────────────────────────

    return cloned;
  }, [scene]);

  // Levitation: bob y-axis nhẹ nhàng theo sin wave
  useFrame(({ clock }) => {
    if (rootRef.current) {
      const elapsed = clock.getElapsedTime();
      rootRef.current.position.y = position[1] + Math.sin(elapsed * 1.5) * 0.035;
    }
  });

  return (
    <group ref={rootRef} position={position} scale={scale}>
      <primitive object={wireframeScene} />
    </group>
  );
}

// Preload GLB khi module được import (tránh delay lần đầu render)
useGLTF.preload(GLB_PATH);
