'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { merge, place, planarUV, roundedBox } from './set-geometry';
import { loadWalnutMaps, placeholderWoodMaps } from './set-textures';

/**
 * The desk: a walnut slab on black steel sled legs.
 *
 * Its footprint and top height are load-bearing. The laptop, mug, books and
 * plant are all placed on a 0.775 top surface, and the laptop's position feeds
 * the camera's dive target, so changing TOP_Y or the slab's extent moves
 * things well outside this file.
 */

const WIDTH = 3.4;
const DEPTH = 1.2;
const THICKNESS = 0.05;
/** Top surface. See the note above before changing this. */
const TOP_Y = 0.775;
const UNDERSIDE = TOP_Y - THICKNESS;

/** Legs sit this far in from each end, clear of the chair's casters. */
const LEG_X = WIDTH / 2 - 0.15;
const LEG_DEPTH = DEPTH - 0.2;
const BAR = 0.045;
const LEG_THICKNESS = 0.03;

function roundedRectPath<T extends THREE.Path>(
  path: T,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  r: number,
): T {
  path.moveTo(x0 + r, y0);
  path.lineTo(x1 - r, y0);
  path.quadraticCurveTo(x1, y0, x1, y0 + r);
  path.lineTo(x1, y1 - r);
  path.quadraticCurveTo(x1, y1, x1 - r, y1);
  path.lineTo(x0 + r, y1);
  path.quadraticCurveTo(x0, y1, x0, y1 - r);
  path.lineTo(x0, y0 + r);
  path.quadraticCurveTo(x0, y0, x0 + r, y0);
  return path;
}

/**
 * One sled leg: a closed loop of flat steel bar, drawn as a profile with a
 * hole and extruded to the bar's thickness. A loop rather than four posts
 * because four posts, seen from the front, read as a folding table.
 */
function sledLeg(x: number): THREE.BufferGeometry {
  const half = LEG_DEPTH / 2;
  const bevel = 0.004;
  const outer = roundedRectPath(new THREE.Shape(), -half, bevel, half, UNDERSIDE - bevel, 0.04);
  outer.holes.push(
    roundedRectPath(new THREE.Path(), -half + BAR, BAR, half - BAR, UNDERSIDE - BAR, 0.012),
  );
  const geometry = new THREE.ExtrudeGeometry(outer, {
    depth: LEG_THICKNESS,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 10,
  });
  // Profile is drawn in XY; turn it so it spans the desk's depth, extruded along X.
  geometry.translate(0, 0, -LEG_THICKNESS / 2);
  return place(geometry, { position: [x, 0, 0], rotation: [0, Math.PI / 2, 0] });
}

export function Desk({ env }: { env: THREE.Texture }) {
  const { wood, steel, woodGeometry, steelGeometry } = useMemo(() => {
    // Real grain arrives from a worker a moment after mount; see the effect below.
    const { map, roughnessMap } = placeholderWoodMaps();

    const woodMaterial = new THREE.MeshPhysicalMaterial({
      map,
      roughnessMap,
      roughness: 1, // multiplied by the map, which carries the real values
      metalness: 0,
      // Lacquer: a sharp reflective layer over a duller wood base is what
      // separates finished walnut from brown plastic.
      clearcoat: 0.55,
      clearcoatRoughness: 0.26,
      envMap: env,
      envMapIntensity: 0.9,
    });

    const steelMaterial = new THREE.MeshStandardMaterial({
      color: '#23252b',
      metalness: 0.75,
      roughness: 0.38,
      envMap: env,
      envMapIntensity: 1,
    });

    // Both wood pieces are projected with the same spans, so the drawer front
    // carries the same grain scale as the slab above it.
    const spanX = [-WIDTH / 2, WIDTH / 2] as const;
    const woodParts = [
      planarUV(
        roundedBox(WIDTH, THICKNESS, DEPTH, 0.014, { position: [0, TOP_Y - THICKNESS / 2, 0] }, 4),
        'x',
        'z',
        spanX,
        [-DEPTH / 2, DEPTH / 2],
      ),
      // Walnut drawer front, set below the slab with a shadow gap.
      planarUV(
        roundedBox(0.95, 0.066, 0.018, 0.006, { position: [0.72, UNDERSIDE - 0.042, 0.552] }),
        'x',
        'y',
        spanX,
        [UNDERSIDE - DEPTH / 2, UNDERSIDE + DEPTH / 2],
      ),
    ];

    const steelParts = [
      sledLeg(-LEG_X),
      sledLeg(LEG_X),
      // Frame rails under the slab, recessed so the top reads as floating.
      roundedBox(LEG_X * 2, 0.04, 0.025, 0.006, { position: [0, UNDERSIDE - 0.02, 0.42] }),
      roundedBox(LEG_X * 2, 0.04, 0.025, 0.006, { position: [0, UNDERSIDE - 0.02, -0.42] }),
      // Low stretcher at the back, for racking stiffness — and so the legs
      // read as one frame rather than two unrelated loops.
      roundedBox(LEG_X * 2, 0.05, 0.022, 0.006, { position: [0, 0.2, -0.42] }),
      // Drawer carcass.
      roundedBox(0.95, 0.07, 0.5, 0.008, { position: [0.72, UNDERSIDE - 0.038, 0.3] }),
      // Steel finger pull along the drawer front's lower edge.
      roundedBox(0.34, 0.008, 0.01, 0.003, { position: [0.72, UNDERSIDE - 0.07, 0.562] }),
    ];

    return {
      wood: woodMaterial,
      steel: steelMaterial,
      woodGeometry: merge(woodParts),
      steelGeometry: merge(steelParts),
    };
  }, [env]);

  useEffect(
    () =>
      loadWalnutMaps((maps) => {
        wood.map?.dispose();
        wood.roughnessMap?.dispose();
        wood.map = maps.map;
        wood.roughnessMap = maps.roughnessMap;
      }),
    [wood],
  );

  useEffect(
    () => () => {
      wood.map?.dispose();
      wood.roughnessMap?.dispose();
      wood.dispose();
      steel.dispose();
      woodGeometry.dispose();
      steelGeometry.dispose();
    },
    [wood, steel, woodGeometry, steelGeometry],
  );

  return (
    <group>
      <mesh geometry={woodGeometry} material={wood} castShadow receiveShadow />
      <mesh geometry={steelGeometry} material={steel} castShadow receiveShadow />
    </group>
  );
}
