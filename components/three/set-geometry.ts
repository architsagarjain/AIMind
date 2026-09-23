import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Geometry helpers for the procedural set pieces (desk, chair).
 *
 * Every part is built in its owner's local space and then merged per material,
 * so a chair made of ~40 parts costs seven draw calls rather than forty.
 */

type Vec3 = readonly [number, number, number];

export interface Placement {
  position?: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
}

const _euler = new THREE.Euler();
const _quat = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3();

export function placementMatrix({ position, rotation, scale }: Placement = {}): THREE.Matrix4 {
  _pos.set(...(position ?? [0, 0, 0]));
  _quat.setFromEuler(_euler.set(...(rotation ?? [0, 0, 0])));
  _scale.set(...(scale ?? [1, 1, 1]));
  return new THREE.Matrix4().compose(_pos, _quat, _scale);
}

/** Bakes a placement into the geometry's vertices. */
export function place<G extends THREE.BufferGeometry>(geometry: G, placement: Placement = {}): G {
  geometry.applyMatrix4(placementMatrix(placement));
  return geometry;
}

/**
 * A box with softened edges.
 *
 * The rounding is the single most important detail on hard-surface props: a
 * perfectly sharp edge has no width, so it cannot catch a highlight, and that
 * missing highlight is exactly what makes a primitive read as a primitive.
 */
export function roundedBox(
  width: number,
  height: number,
  depth: number,
  radius: number,
  placement?: Placement,
  segments = 3,
): THREE.BufferGeometry {
  // RoundedBoxGeometry breaks down once the radius reaches half the smallest side.
  const r = Math.min(radius, Math.min(width, height, depth) / 2 - 1e-4);
  return place(new RoundedBoxGeometry(width, height, depth, segments, r), placement);
}

/**
 * Merges parts into one geometry. Inputs are consumed (disposed).
 *
 * Indexed and non-indexed geometries cannot be merged together, and three's
 * primitives are a mix of both, so everything is flattened first.
 */
export function merge(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const flat = parts.map((g) => {
    const out = g.index ? g.toNonIndexed() : g;
    // Only the attributes every part shares survive a merge.
    for (const name of Object.keys(out.attributes)) {
      if (name !== 'position' && name !== 'normal' && name !== 'uv') out.deleteAttribute(name);
    }
    if (out !== g) g.dispose();
    return out;
  });
  const merged = mergeGeometries(flat, false);
  flat.forEach((g) => g.dispose());
  if (!merged) throw new Error('set-geometry: parts have incompatible attributes');
  merged.computeBoundingSphere();
  return merged;
}

type Axis = 'x' | 'y' | 'z';

/**
 * Replaces a geometry's UVs with a planar projection along two axes.
 *
 * Box-style UVs give every face the full 0–1 range, so a 5cm edge gets the
 * same texture as a 1.2m top, squeezed flat, and reads as plywood. Projecting
 * from above instead lets the grain run over the edge unbroken, which is what
 * solid timber does. Spans are in the geometry's own units, so pieces
 * projected with the same spans share a grain scale.
 */
export function planarUV(
  geometry: THREE.BufferGeometry,
  u: Axis,
  v: Axis,
  uSpan: readonly [number, number],
  vSpan: readonly [number, number],
): THREE.BufferGeometry {
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const uv = geometry.attributes.uv as THREE.BufferAttribute;
  const read = { x: pos.getX.bind(pos), y: pos.getY.bind(pos), z: pos.getZ.bind(pos) };
  for (let i = 0; i < pos.count; i += 1) {
    uv.setXY(
      i,
      (read[u](i) - uSpan[0]) / (uSpan[1] - uSpan[0]),
      (read[v](i) - vSpan[0]) / (vSpan[1] - vSpan[0]),
    );
  }
  uv.needsUpdate = true;
  return geometry;
}
