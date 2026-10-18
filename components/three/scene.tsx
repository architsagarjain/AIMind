'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ContactShadows } from '@react-three/drei';
import { AvatarModel } from './avatar-model';
import { Laptop } from './laptop';
import { Office } from './office';
import { CameraRig } from './camera-rig';
import { useExperience } from '@/lib/store/experience';
import { markSceneSlow, useIsMobile, useReducedMotion } from '@/lib/hooks/use-preferences';

/**
 * Tells the page once the figure and laptop are on screen, so the still
 * poster over the canvas can fade out. Waits a few frames after the models
 * mount, since the first frames also compile shaders.
 */
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current || ++frames.current < 4) return;
    done.current = true;
    onReady?.();
  });
  return null;
}

/**
 * Gives up on the scene when this device cannot draw it smoothly. After the
 * models are up it counts frames over two-second windows; two slow windows in
 * a row (under 20fps) and the page swaps to the still poster for the rest of
 * the session. A long gap between frames (a background tab) resets the count
 * instead of counting as slow.
 */
const SLOW_FPS = 20;
const WINDOW_S = 2;

function FrameRateGuard({ active, progress }: { active: boolean; progress: React.RefObject<number> }) {
  const state = useRef({ start: 0, frames: 0, slowWindows: 0, checked: 0, gaveUp: false });
  useFrame((_, delta) => {
    const s = state.current;
    if (!active || s.gaveUp) return;
    const now = performance.now() / 1000;
    // Only judge the opening frame: once the visitor scrolls into the dive,
    // swapping the scene out would break the scroll they are in the middle of.
    if ((progress.current ?? 0) > 0.02) {
      s.gaveUp = true;
      return;
    }
    if (delta > 1 || document.hidden) {
      s.start = now;
      s.frames = 0;
      return;
    }
    if (!s.start) s.start = now;
    s.frames++;
    const span = now - s.start;
    if (span < WINDOW_S) return;
    const fps = s.frames / span;
    s.start = now;
    s.frames = 0;
    s.checked++;
    s.slowWindows = fps < SLOW_FPS ? s.slowWindows + 1 : 0;
    if (s.slowWindows >= 2) {
      s.gaveUp = true;
      markSceneSlow();
    }
    // Five windows (ten seconds) of measuring is enough to judge.
    if (s.checked >= 5) s.gaveUp = true;
  });
  return null;
}

/**
 * The hero 3D scene.
 *
 * Scroll progress is read from the zustand store *imperatively* into a ref.
 * Subscribing with a selector would re-render this component on every scroll
 * frame and re-mount nothing useful — the render loop already runs at 60fps and
 * only needs the current value, so a ref is both faster and simpler.
 */
export default function Scene({ onReady }: { onReady?: () => void }) {
  const [ready, setReady] = useState(false);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

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
      // Capped DPR: above ~1.75 the extra pixels are invisible and the cost is
      // real. Phones cap lower still: a 3x screen at 1.75 renders ~36% more
      // pixels than at 1.5 for detail this scene does not have.
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
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
        <ReadySignal
          onReady={() => {
            setReady(true);
            onReady?.();
          }}
        />
      </Suspense>
      <FrameRateGuard active={ready} progress={progress} />
      <CameraRig progress={progress} pointer={pointer} still={reduced} />
    </Canvas>
  );
}
