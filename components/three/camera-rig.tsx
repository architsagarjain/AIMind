'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LAPTOP_NORMAL, LAPTOP_SCREEN } from './office';

/**
 * Scroll-driven camera move, in three beats:
 *
 *   0.00 → 0.45  push in on the subject
 *   0.45 → 0.80  attention swings across to the laptop
 *   0.80 → 1.00  the lens dives at the screen until it fills the frame
 *
 * The path is a Catmull-Rom curve so the move arcs rather than sliding on a
 * straight line, and the look-at target is interpolated separately — that
 * separation is what makes it read as a camera operator rather than a lerp.
 * Every frame damps toward the target, so a fast scroll still resolves smoothly.
 */

/** Framing target for the opening shot: just below the eyeline, so the head
 *  sits high in frame and the body fills the lower half. */
const SUBJECT = new THREE.Vector3(0.62, 1.3, 0.3);

/** Final camera position: just off the screen surface, along its normal. */
const SCREEN_EYE = LAPTOP_SCREEN.clone().addScaledVector(LAPTOP_NORMAL, 0.2);

const PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.05, 1.55, 4.6), // establishing wide
  new THREE.Vector3(0.25, 1.5, 3.5), // push in
  new THREE.Vector3(0.75, 1.4, 2.5), // begin the swing right
  new THREE.Vector3(1.45, 1.25, 1.55), // over the desk
  new THREE.Vector3(1.95, 1.12, 0.55), // approaching the lid
  SCREEN_EYE, // nose against the screen
]);

/** Field of view narrows into the dive, which exaggerates the sense of speed. */
const FOV_START = 38;
const FOV_END = 26;

interface CameraRigProps {
  /** 0 → 1 scroll progress through the hero track. */
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  still?: boolean;
}

export function CameraRig({ progress, pointer, still = false }: CameraRigProps) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3().copy(SUBJECT));
  const desired = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(progress.current ?? 0, 0, 1);

    // Ease the raw scroll value so the dive accelerates into the screen.
    const eased = p < 0.8 ? p * 0.92 : 0.736 + Math.pow((p - 0.8) / 0.2, 1.8) * 0.264;

    PATH.getPointAt(THREE.MathUtils.clamp(eased, 0, 1), desired.current);

    // Parallax: a small pointer-driven offset, faded out during the dive so the
    // final approach stays locked on the screen.
    if (!still) {
      const sway = (1 - p) * 0.12;
      desired.current.x += (pointer.current?.x ?? 0) * sway;
      desired.current.y += (pointer.current?.y ?? 0) * sway * 0.6;
      // A slow handheld drift keeps the frame from feeling mechanically static.
      const t = state.clock.elapsedTime;
      desired.current.x += Math.sin(t * 0.31) * 0.014 * (1 - p);
      desired.current.y += Math.cos(t * 0.24) * 0.011 * (1 - p);
    }

    // Attention shifts from subject → laptop across the middle of the scroll.
    const shift = THREE.MathUtils.smoothstep(p, 0.32, 0.78);
    lookAt.current.copy(SUBJECT).lerp(LAPTOP_SCREEN, shift);

    // Critically-damped follow: frame-rate independent, no overshoot.
    const damp = 1 - Math.pow(0.0015, delta);
    camera.position.lerp(desired.current, damp);
    target.current.lerp(lookAt.current, damp);
    camera.lookAt(target.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      const fov = THREE.MathUtils.lerp(FOV_START, FOV_END, THREE.MathUtils.smoothstep(p, 0.6, 1));
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, fov, damp);
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
