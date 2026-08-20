import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCockpitStore } from '../../store/cockpitStore';
import { HolographicPanel } from './HolographicPanel';
import { soundFx } from '../../services/soundFx';
import { User, Cpu, FolderGit2, BookOpen, Send } from 'lucide-react';

const PANELS = [
  {
    id: 0,
    label: 'ABOUT',
    subLabel: 'Origin & Philosophy',
    icon: User,
    summary: 'Kỹ sư phần mềm AI & Fullstack, kiến tạo giải pháp số thông minh và trải nghiệm tương tác trực quan điện ảnh.',
    details: ['Architecture', 'Fullstack & AI', 'Hanoi, VN'],
  },
  {
    id: 1,
    label: 'SKILLS',
    subLabel: 'Tech Arsenal',
    icon: Cpu,
    summary: 'Hệ sinh thái công nghệ đa tầng từ React, Three.js, Node.js đến Python, AI Engine và Cloud Infrastructure.',
    details: ['React & WebGL', 'Node.js / Python', 'Docker & Cloud'],
  },
  {
    id: 2,
    label: 'PROJECTS',
    subLabel: 'Key Operations',
    icon: FolderGit2,
    summary: 'Tuyển tập 4 dự án quy mô với kiến trúc mở rộng cao, tối ưu hóa thuật toán và hồ sơ kỹ thuật STAR chuẩn mực.',
    details: ['STAR Method', 'High Scalability', 'PDF Whitepapers'],
  },
  {
    id: 3,
    label: 'BLOG',
    subLabel: 'Tech Chronicles',
    icon: BookOpen,
    summary: 'Các bài viết nghiên cứu chuyên sâu về tối ưu hiệu năng WebGL 3D, kiến trúc AI Agent và Clean Architecture.',
    details: ['Shader Dev', 'AI Multi-Agent', 'Clean Arch'],
  },
  {
    id: 4,
    label: 'CONTACT',
    subLabel: 'Transmission Link',
    icon: Send,
    summary: 'Cổng truyền thông tin trực tiếp, tải xuống CV kỹ sư chuyên nghiệp và kết nối mạng lưới kênh bảo mật.',
    details: ['Direct EmailJS', 'Instant CV Download', 'Encrypted Link'],
  },
];

const N = 5;
const RADIUS = 2.85; // Snug radius close to central reactor core
const STEP = (2 * Math.PI) / N;

export function OrbitPanelRing() {
  const activePanel = useCockpitStore((s) => s.activePanel);
  const setActivePanel = useCockpitStore((s) => s.setActivePanel);
  const setOrbitAngleStore = useCockpitStore((s) => s.setOrbitAngle);

  const angleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastActiveIndexRef = useRef(0);

  // Helper to snap to specific panel index
  const snapToPanel = (index) => {
    targetAngleRef.current = -index * STEP;
    soundFx.playDockClick();
  };

  // Expose snapToPanel on window for HUD / debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.snapToPanel = snapToPanel;
    }
  }, []);

  // Keyboard navigation (1-5 and Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '1' && e.key <= '5') {
        const idx = parseInt(e.key, 10) - 1;
        snapToPanel(idx);
      }
      if (e.key === 'ArrowRight') {
        const nextIdx = (activePanel + 1) % N;
        snapToPanel(nextIdx);
      }
      if (e.key === 'ArrowLeft') {
        const prevIdx = (activePanel - 1 + N) % N;
        snapToPanel(prevIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel]);

  // Scroll wheel rotation on window
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      velocityRef.current += e.deltaY * 0.0008;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Pointer Drag on window
  useEffect(() => {
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      lastPointerXRef.current = e.clientX;
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastPointerXRef.current;
      lastPointerXRef.current = e.clientX;
      angleRef.current += deltaX * 0.0035;
      targetAngleRef.current = angleRef.current;
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      // Auto-snap to closest panel index after release
      const currentRawIndex = -angleRef.current / STEP;
      const closestIndex = Math.round(currentRawIndex);
      targetAngleRef.current = closestIndex * STEP;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  useFrame((_, delta) => {
    // 1. Apply inertia velocity from wheel
    if (Math.abs(velocityRef.current) > 0.0001) {
      angleRef.current -= velocityRef.current;
      targetAngleRef.current = angleRef.current;
      velocityRef.current *= 0.88;
    } else if (!isDraggingRef.current) {
      // 2. Smooth Lerp towards targetAngle (Auto-snap)
      angleRef.current += (targetAngleRef.current - angleRef.current) * Math.min(1, delta * 7);
    }

    // 3. Compute normalized active panel index (0 to 4)
    const normalizedAngle = ((-angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const calculatedIndex = (Math.round(normalizedAngle / STEP) % N + N) % N;

    if (calculatedIndex !== lastActiveIndexRef.current) {
      lastActiveIndexRef.current = calculatedIndex;
      setActivePanel(calculatedIndex);
      soundFx.playPanelSwitch();
    }

    setOrbitAngleStore(angleRef.current);
  });

  return (
    <group name="orbit-panel-ring">
      {PANELS.map((panel, i) => {
        const theta = angleRef.current + i * STEP;
        const x = RADIUS * Math.sin(theta);
        const z = RADIUS * Math.cos(theta);
        const y = 0;
        const rotY = theta;
        const isActive = activePanel === i;
        const isFrontFacing = Math.cos(theta) > -0.3;

        return (
          <group key={panel.id} position={[x, y, z]} rotation={[0, rotY, 0]}>
            <HolographicPanel
              index={panel.id}
              label={panel.label}
              subLabel={panel.subLabel}
              isActive={isActive}
              isFrontFacing={isFrontFacing}
              icon={panel.icon}
              summary={panel.summary}
              details={panel.details}
            />
          </group>
        );
      })}
    </group>
  );
}
