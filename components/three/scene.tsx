'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Avatar } from './avatar';
import { Office } from './office';
import { CameraRig } from './camera-rig';
import { useExperience } from '@/lib/store/experience';
import { useReducedMotion } from '@/lib/hooks/use-preferences';

/**
 * The hero 3D scene.
 *
 * Scroll progress is read from the zustand store *imperatively* into a ref.
 * Subscribing with a selector would re-render this component on every scroll
 * frame and re-mount nothing useful — the render loop already runs at 60fps and
 * only needs the current value, so a ref is both faster and simpler.
 */
export default function Scene() {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    progress.current = useExperience.getState().progress;
    return useExperience.subscribe((state) => {
      progress.current = state.progress;
    });
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  return (
    <Canvas
      // Capped DPR: above ~1.75 the extra pixels are invisible and the cost is real.
      dpr={[1, 1.75]}
      shadows="soft"
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      camera={{ position: [0.05, 1.52, 4.95], fov: 38, near: 0.05, far: 60 }}
      // Auto-degrades DPR if the frame budget slips, rather than dropping frames.
      performance={{ min: 0.5 }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor('#050816');
        scene.fog = new THREE.FogExp2('#050816', 0.058);
      }}
    >
      <Office still={reduced} />
      <Avatar pointer={pointer} still={reduced} />
      <CameraRig progress={progress} pointer={pointer} still={reduced} />
    </Canvas>
  );
}
