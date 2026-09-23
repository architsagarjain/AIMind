'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ContactShadows } from '@react-three/drei';
import { AvatarModel } from './avatar-model';
import { Laptop } from './laptop';
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
        toneMappingExposure: 1.38,
      }}
      camera={{ position: [0.12, 1.2, 4.15], fov: 38, near: 0.05, far: 60 }}
      // Auto-degrades DPR if the frame budget slips, rather than dropping frames.
      performance={{ min: 0.5 }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor('#050816');
        scene.fog = new THREE.FogExp2('#0a1024', 0.042);
      }}
    >
      <Office pointer={pointer} still={reduced} />
      {/* The model streams separately from the rest of the scene, so the room
          and lighting render immediately rather than blocking on it. */}
      <Suspense fallback={null}>
        <Laptop still={reduced} />
        <AvatarModel pointer={pointer} still={reduced} />
        {/* Grounding shadow. Baked on the first frame rather than re-rendered
            every frame — the figure only sways a few millimetres, so a live
            shadow pass would cost a render target for no visible gain. */}
        <ContactShadows
          position={[0.72, 0.008, 0.62]}
          scale={3.4}
          blur={2.6}
          opacity={0.62}
          far={2.2}
          resolution={512}
          frames={1}
          color="#000814"
        />
      </Suspense>
      <CameraRig progress={progress} pointer={pointer} still={reduced} />
    </Canvas>
  );
}
