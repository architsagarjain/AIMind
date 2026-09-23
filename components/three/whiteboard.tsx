'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { merge, place, roundedBox } from './set-geometry';
import { boardSketchTexture } from './set-textures';

/**
 * A dark glass board on the side wall, carrying a strategy sketch in glowing
 * marker. Origin at the board's centre, facing +z.
 *
 * It sits behind the headline, under the readability scrim, so it is lit to
 * be felt rather than read: a suggestion that this is where the thinking
 * happens.
 */

const WIDTH = 2.9;
const HEIGHT = 1.6;
const RAIL = 0.035;

export function Whiteboard({ env }: { env: THREE.Texture }) {
  const built = useMemo(() => {
    const sketch = boardSketchTexture();

    const frame = merge([
      roundedBox(WIDTH + RAIL, RAIL, 0.03, 0.008, { position: [0, HEIGHT / 2, 0] }),
      roundedBox(WIDTH + RAIL, RAIL, 0.03, 0.008, { position: [0, -HEIGHT / 2, 0] }),
      roundedBox(RAIL, HEIGHT, 0.03, 0.008, { position: [WIDTH / 2, 0, 0] }),
      roundedBox(RAIL, HEIGHT, 0.03, 0.008, { position: [-WIDTH / 2, 0, 0] }),
      // Marker tray along the bottom rail.
      roundedBox(0.9, 0.018, 0.07, 0.006, { position: [0.6, -HEIGHT / 2 - 0.02, 0.035] }),
    ]);

    const markers = merge(
      [0.42, 0.56].map((x) =>
        place(new THREE.CapsuleGeometry(0.011, 0.11, 4, 12), {
          position: [x, -HEIGHT / 2 - 0.0, 0.04],
          rotation: [0, 0, Math.PI / 2],
        }),
      ),
    );

    const glass = new THREE.PlaneGeometry(WIDTH, HEIGHT);

    const materials = {
      aluminium: new THREE.MeshStandardMaterial({
        color: '#9aa1ad',
        metalness: 1,
        roughness: 0.3,
        envMap: env,
        envMapIntensity: 0.8,
      }),
      // Dark frosted glass, with the sketch as its only emission. Kept off
      // glossy: at low roughness the rim and fill lights reflected as two
      // blown-out white discs sitting on top of the drawing.
      glass: new THREE.MeshStandardMaterial({
        color: '#0a1120',
        roughness: 0.42,
        metalness: 0,
        emissive: '#ffffff',
        emissiveMap: sketch,
        emissiveIntensity: 0.85,
        envMap: env,
        envMapIntensity: 0.5,
      }),
      marker: new THREE.MeshStandardMaterial({ color: '#1b2233', roughness: 0.5 }),
    };

    return {
      frame,
      markers,
      glass,
      materials,
      all: [sketch, frame, markers, glass, ...Object.values(materials)],
    };
  }, [env]);

  useEffect(() => () => built.all.forEach((d) => d.dispose()), [built]);

  const m = built.materials;
  return (
    <group>
      <mesh geometry={built.glass} material={m.glass} position={[0, 0, 0.005]} />
      <mesh geometry={built.frame} material={m.aluminium} />
      <mesh geometry={built.markers} material={m.marker} />
    </group>
  );
}
