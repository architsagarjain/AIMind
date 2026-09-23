'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from './set-textures';

/**
 * The view out of the window: a night sky and a city seen from a high floor.
 *
 * Interactive, in two ways:
 *   - Hover: windows under the cursor switch on in the brand cyan and fade
 *     out behind it, so moving the pointer leaves a trail of lit offices.
 *   - Tap / click: a ring of light ripples outward across the city.
 *
 * Both are resolved per window in the fragment shader against stored pointer
 * *rays*, not screen positions. A ray is a fixed line in world space, so a
 * trail stays on the buildings it lit while the camera drifts or the page
 * scrolls, rather than sliding along with the screen. The test is angular
 * (distance off the ray over distance along it), so the lit patch is the same
 * size on screen whether a building is near or far.
 *
 * The whole city is one instanced draw call. No textures.
 */

/** Pointer-trail samples kept for the shader. */
const TRAIL = 14;
/** Concurrent tap ripples. */
const RIPPLES = 4;
/** Street level. Well below anything visible from the office floor. */
const BASE_Y = -9;

interface Building {
  x: number;
  z: number;
  width: number;
  depth: number;
  top: number;
  seed: number;
  /** Window-module scale; see `layout`. */
  module: number;
}

/**
 * Rows of blocks receding from the glass, wider with distance so they fill
 * the view from every point on the camera path. Tops are mostly *below* eye
 * level, which is what makes the office read as high up: you look down onto
 * roofs. Height is biased toward the middle of the view to give the skyline a
 * shape rather than a flat top.
 */
function layout(): Building[] {
  const rand = mulberry32(42);
  const out: Building[] = [];
  for (let row = 0; row < 12; row += 1) {
    const zRow = -7.5 - row * 2.4;
    const spread = 4 + 1.1 * (-zRow - 4);
    // Farther blocks are larger, and so are their windows; at a fixed window
    // size the back rows would shrink to sub-pixel noise and shimmer.
    const scale = 1 + row * 0.1;
    let x = 1.4 - spread;
    while (x < 1.4 + spread) {
      const width = (0.7 + rand() * 1.6) * scale;
      const depth = (0.7 + rand() * 1.4) * scale;
      const centre = Math.exp(-(((x - 1.8) / (5 + row * 2.2)) ** 2));
      let top = -2.2 + 2.6 * rand() ** 1.6 + 3.2 * centre * rand() ** 1.3;
      if (rand() < 0.07) top += 1.2 + rand() * 1.8; // the occasional tower
      out.push({ x: x + width / 2, z: zRow + (rand() - 0.5) * 1.4, width, depth, top, seed: rand(), module: scale });
      x += width + 0.1 + rand() * 0.5;
    }
  }
  return out;
}

// ---------------------------------------------------------------- buildings

const BUILDING_VERTEX = /* glsl */ `
  attribute float aSeed;
  attribute float aModule;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vSeed;
  varying float vModule;
  varying float vTop;
  void main() {
    mat4 m = modelMatrix * instanceMatrix;
    vec4 world = m * vec4(position, 1.0);
    vWorld = world.xyz;
    // Blocks are axis-aligned and only scaled, so this keeps normals on-axis.
    vNormalW = normalize(mat3(m) * normal);
    vSeed = aSeed;
    vModule = aModule;
    vTop = (m * vec4(0.0, 1.0, 0.0, 1.0)).y;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const BUILDING_FRAGMENT = /* glsl */ `
  #define TRAIL ${TRAIL}
  #define RIPPLES ${RIPPLES}
  uniform float uTime;
  uniform vec3 uTrailO[TRAIL];
  uniform vec3 uTrailD[TRAIL];
  uniform float uTrailAge[TRAIL];
  uniform vec3 uRippleO[RIPPLES];
  uniform vec3 uRippleD[RIPPLES];
  uniform float uRippleAge[RIPPLES];
  // 1 while any trail sample or ripple can still visibly contribute.
  uniform float uInteractive;
  uniform vec3 uFacade;
  uniform vec3 uHaze;
  uniform vec3 uWarm;
  uniform vec3 uCool;
  uniform vec3 uAccent;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  varying float vSeed;
  varying float vModule;
  varying float vTop;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  // How far P is off a ray, as an angle (radians, small-angle). Zero on the
  // ray; large for anything behind its origin or for an unused slot.
  float offRay(vec3 P, vec3 o, vec3 d) {
    vec3 v = P - o;
    float along = dot(v, d);
    if (along <= 0.0) return 10.0;
    return length(v - along * d) / along;
  }

  void main() {
    vec3 n = normalize(vNormalW);
    // Facades fall off toward the ground, into the street haze.
    float lift = clamp((vWorld.y + 4.0) / 8.0, 0.0, 1.0);
    vec3 col = uFacade * (0.5 + 0.5 * lift);
    vec3 light = vec3(0.0);
    // Added after tone mapping; see the end of main().
    vec3 accent = vec3(0.0);

    if (n.y > 0.5) {
      col *= 0.8; // roofs
    } else if (n.y > -0.5) {
      bool side = abs(n.x) > 0.5;
      vec2 f = side ? vec2(vWorld.z, vWorld.y) : vec2(vWorld.x, vWorld.y);
      vec2 cellSize = vModule * vec2(0.11 + 0.06 * hash(vec2(vSeed, 1.7)), 0.14 + 0.05 * hash(vec2(vSeed, 2.3)));
      vec2 g = f / cellSize;
      vec2 cell = floor(g);
      vec2 fr = fract(g);

      // Antialiased window rectangle inside each cell.
      vec2 fw = fwidth(g);
      vec2 lo = smoothstep(vec2(0.2, 0.25) - fw, vec2(0.2, 0.25) + fw, fr);
      vec2 hi = 1.0 - smoothstep(vec2(0.8) - fw, vec2(0.8) + fw, fr);
      float win = lo.x * lo.y * hi.x * hi.y;
      // Parapet: no windows in the top band of the building.
      win *= step(vWorld.y, vTop - 0.12 * vModule);

      float h = hash(cell + vSeed * 91.7);
      float occupancy = 0.14 + 0.36 * hash(vec2(vSeed, 4.1));
      // Offices switch on and off over minutes, not seconds.
      float drift = 0.12 * sin(uTime * 0.07 + h * 60.0);
      float lit = step(h, occupancy + drift);
      float warmth = hash(cell.yx + vSeed * 13.1);
      vec3 winCol = warmth > 0.78 ? uCool : uWarm * (0.75 + 0.5 * warmth);

      // Interaction, tested at the window's centre so a window lights whole.
      vec2 cc = (cell + 0.5) * cellSize;
      vec3 P = side ? vec3(vWorld.x, cc.y, cc.x) : vec3(cc.x, cc.y, vWorld.z);
      float wake = 0.0;
      float ring = 0.0;
      // Uniform branch, so it is coherent across the whole draw: an idle city
      // (the usual case) never pays for the interaction loops at all.
      if (uInteractive > 0.5) {
        for (int i = 0; i < TRAIL; i++) {
          float a = offRay(P, uTrailO[i], uTrailD[i]);
          wake = max(wake, (1.0 - smoothstep(0.05, 0.12, a)) * exp(-uTrailAge[i] * 0.8));
        }
        for (int i = 0; i < RIPPLES; i++) {
          float a = offRay(P, uRippleO[i], uRippleD[i]);
          float r = uRippleAge[i] * 0.55;
          ring = max(ring, (1.0 - smoothstep(0.0, 0.07, abs(a - r))) * exp(-uRippleAge[i] * 0.9));
        }
      }
      // Skip a quarter of windows so the wake reads as offices switching on,
      // not as a torch beam.
      float woken = max(wake, ring) * step(0.25, hash(cell * 1.31 + vSeed));

      // Ordinary lit windows go through tone mapping with everything else.
      light = winCol * 1.5 * win * lit * (1.0 - woken);
      // The woken ones do not. ACES at this exposure desaturates bright
      // colours toward white: pushed through it, the brand cyan came out as
      // the same pale blue-white as an ordinary office window, and the
      // interaction looked like it did nothing. Added after tone mapping, the
      // output is the accent as specified. A faint halo on the facade makes
      // the patch read as one gesture rather than scattered windows.
      accent = uAccent * (win * woken + 0.07 * max(wake, ring));
    }

    vec3 outCol = col + light;
    float dist = distance(cameraPosition, vWorld);
    float haze = 1.0 - exp(-pow(dist * 0.028, 2.0));
    // Lit windows cut through the haze a little; that is what city lights do.
    outCol = mix(outCol, uHaze, haze * (1.0 - 0.35 * min(length(light), 1.0)));
    gl_FragColor = vec4(outCol, 1.0);
    #include <tonemapping_fragment>
    gl_FragColor.rgb += accent * (1.0 - 0.5 * haze);
    #include <colorspace_fragment>
  }
`;

// --------------------------------------------------------------------- sky

const SKY_VERTEX = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    // Centred on the camera, so the sky never gets closer as the camera moves.
    gl_Position = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0);
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  uniform float uTime;
  varying vec3 vDir;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec3 d = normalize(vDir);
    float y = d.y;
    vec3 zenith = vec3(0.006, 0.01, 0.03);
    vec3 horizon = vec3(0.05, 0.045, 0.1);
    vec3 col = mix(horizon, zenith, smoothstep(-0.02, 0.5, y));
    // Light pollution: a warm band sitting just above the roofline.
    col += vec3(0.2, 0.1, 0.07) * exp(-max(y + 0.03, 0.0) * 13.0) * 0.55;

    // Sparse stars, high up only; a city sky shows a handful, not a field.
    vec2 sp = vec2(atan(d.z, d.x), asin(y)) * 110.0;
    vec2 c = floor(sp);
    float h = hash(c);
    if (h > 0.986) {
      float s = smoothstep(0.16, 0.0, length(fract(sp) - 0.5));
      float twinkle = 0.55 + 0.45 * sin(uTime * (1.0 + h * 2.0) + h * 80.0);
      col += vec3(0.75, 0.82, 1.0) * s * twinkle * smoothstep(0.1, 0.35, y) * 0.9;
    }
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// ----------------------------------------------------------------- beacons

const BEACON_VERTEX = /* glsl */ `
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vOn;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = 70.0 * uPixelRatio / -mv.z;
    // Aviation obstruction lights: a slow blink, each tower out of phase.
    vOn = pow(max(0.0, sin(uTime * 1.9 + aPhase)), 12.0);
  }
`;

const BEACON_FRAGMENT = /* glsl */ `
  varying float vOn;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vec3(1.0, 0.16, 0.1) * (0.2 + vOn * 2.2), a * (0.25 + 0.75 * vOn));
  }
`;

interface SkylineProps {
  /** Normalised pointer, -1..1 on both axes, y down. */
  pointer: React.RefObject<{ x: number; y: number }>;
  still?: boolean;
}

export function Skyline({ pointer, still = false }: SkylineProps) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);

  const built = useMemo(() => {
    const blocks = layout();

    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0); // base at y = 0, so scale.y is the height

    const seeds = new Float32Array(blocks.length);
    const modules = new Float32Array(blocks.length);
    blocks.forEach((b, i) => {
      seeds[i] = b.seed;
      modules[i] = b.module;
    });
    box.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    box.setAttribute('aModule', new THREE.InstancedBufferAttribute(modules, 1));

    const uniforms = {
      uTime: { value: 0 },
      uTrailO: { value: Array.from({ length: TRAIL }, () => new THREE.Vector3()) },
      uTrailD: { value: Array.from({ length: TRAIL }, () => new THREE.Vector3()) },
      // Unused slots are "infinitely old", so they contribute nothing.
      uTrailAge: { value: new Array<number>(TRAIL).fill(1e3) },
      uRippleO: { value: Array.from({ length: RIPPLES }, () => new THREE.Vector3()) },
      uRippleD: { value: Array.from({ length: RIPPLES }, () => new THREE.Vector3()) },
      uRippleAge: { value: new Array<number>(RIPPLES).fill(1e3) },
      uInteractive: { value: 0 },
      uFacade: { value: new THREE.Color('#111a33') },
      uHaze: { value: new THREE.Color('#0c1328') },
      uWarm: { value: new THREE.Color('#ffc98a') },
      uCool: { value: new THREE.Color('#c4e4ff') },
      uAccent: { value: new THREE.Color('#6ef2ff') },
    };

    const buildingMaterial = new THREE.ShaderMaterial({
      vertexShader: BUILDING_VERTEX,
      fragmentShader: BUILDING_FRAGMENT,
      uniforms,
    });

    const city = new THREE.InstancedMesh(box, buildingMaterial, blocks.length);
    const matrix = new THREE.Matrix4();
    blocks.forEach((b, i) => {
      matrix.makeScale(b.width, b.top - BASE_Y, b.depth).setPosition(b.x, BASE_Y, b.z);
      city.setMatrixAt(i, matrix);
    });
    city.instanceMatrix.needsUpdate = true;
    city.computeBoundingSphere();

    // Beacons on anything tall enough to need one.
    const towers = blocks.filter((b) => b.top > 1.9);
    const beaconGeometry = new THREE.BufferGeometry();
    beaconGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(towers.flatMap((b) => [b.x, b.top + 0.06, b.z]), 3),
    );
    beaconGeometry.setAttribute(
      'aPhase',
      new THREE.Float32BufferAttribute(towers.map((b) => b.seed * Math.PI * 2), 1),
    );
    const beaconUniforms = { uTime: uniforms.uTime, uPixelRatio: { value: 1 } };
    const beaconMaterial = new THREE.ShaderMaterial({
      vertexShader: BEACON_VERTEX,
      fragmentShader: BEACON_FRAGMENT,
      uniforms: beaconUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const skyGeometry = new THREE.SphereGeometry(40, 48, 24);
    const skyMaterial = new THREE.ShaderMaterial({
      vertexShader: SKY_VERTEX,
      fragmentShader: SKY_FRAGMENT,
      uniforms: { uTime: uniforms.uTime },
      side: THREE.BackSide,
      depthWrite: false,
    });

    return {
      city,
      uniforms,
      beaconUniforms,
      beaconGeometry,
      beaconMaterial,
      skyGeometry,
      skyMaterial,
      towers: towers.length,
      disposables: [box, buildingMaterial, beaconGeometry, beaconMaterial, skyGeometry, skyMaterial],
    };
  }, []);

  useEffect(
    () => () => {
      built.disposables.forEach((d) => d.dispose());
      built.city.dispose();
    },
    [built],
  );

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const trail = useRef({
    slot: 0,
    lastSampleAt: -Infinity,
    lastMoveAt: -Infinity,
    last: { x: Number.NaN, y: Number.NaN },
  });
  /**
   * When each trail sample and ripple was made, on the real clock. Ages are
   * derived from these every frame rather than accumulated from frame deltas:
   * deltas are clamped (so a backgrounded tab does not jump), and summing
   * clamped deltas made the fade stretch out whenever the frame rate dropped,
   * which is exactly when a lingering trail looks worst.
   */
  const stamps = useRef({
    trail: new Array<number>(TRAIL).fill(-1e3),
    ripple: new Array<number>(RIPPLES).fill(-1e3),
  });
  const clock = useThree((s) => s.clock);

  // Taps and clicks ripple. Listening on the canvas itself means clicks on
  // the hero's buttons (which sit above it) never reach here.
  useEffect(() => {
    const el = gl.domElement;
    let slot = 0;
    const onDown = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      ndc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      const i = slot++ % RIPPLES;
      built.uniforms.uRippleO.value[i]!.copy(raycaster.ray.origin);
      built.uniforms.uRippleD.value[i]!.copy(raycaster.ray.direction);
      stamps.current.ripple[i] = clock.elapsedTime;
    };
    el.addEventListener('pointerdown', onDown);
    return () => el.removeEventListener('pointerdown', onDown);
  }, [gl, camera, clock, built, raycaster, ndc]);

  useFrame((state, delta) => {
    const u = built.uniforms;
    const dt = Math.min(delta, 0.1);
    if (!still) u.uTime.value += dt;
    built.beaconUniforms.uPixelRatio.value = state.gl.getPixelRatio();
    const t = state.clock.elapsedTime;
    const st = stamps.current;
    for (let i = 0; i < TRAIL; i += 1) u.uTrailAge.value[i] = t - st.trail[i]!;
    for (let i = 0; i < RIPPLES; i += 1) u.uRippleAge.value[i] = t - st.ripple[i]!;
    // Past these ages exp(-0.8a) / exp(-0.9a) are below ~1%: nothing visible left.
    const newestTrail = Math.min(...u.uTrailAge.value);
    const newestRipple = Math.min(...u.uRippleAge.value);
    u.uInteractive.value = newestTrail < 6 || newestRipple < 5.5 ? 1 : 0;

    const p = pointer.current;
    if (!p) return;
    const s = trail.current;
    const moved = p.x !== s.last.x || p.y !== s.last.y;
    if (moved) {
      // The first reading is the pointer's resting default, not a movement.
      if (!Number.isNaN(s.last.x)) s.lastMoveAt = t;
      s.last = { x: p.x, y: p.y };
    }
    // A cursor left resting keeps its patch lit briefly, then lets it fade.
    if (t - s.lastMoveAt > 1.5) return;

    ndc.set(p.x, -p.y);
    raycaster.setFromCamera(ndc, camera);
    // A new sample every ~70ms of movement; between samples the newest one is
    // refreshed, so the patch under the cursor tracks it exactly.
    if (moved && t - s.lastSampleAt > 0.07) {
      s.slot = (s.slot + 1) % TRAIL;
      s.lastSampleAt = t;
    }
    u.uTrailO.value[s.slot]!.copy(raycaster.ray.origin);
    u.uTrailD.value[s.slot]!.copy(raycaster.ray.direction);
    st.trail[s.slot] = t;
    u.uTrailAge.value[s.slot] = 0;
    // The flag above was computed before this sample existed; without this the
    // first frame of a fresh hover would render with the loops skipped.
    u.uInteractive.value = 1;
  });

  return (
    <group>
      {/* Drawn first and never occludes: everything else paints over it. */}
      <mesh geometry={built.skyGeometry} material={built.skyMaterial} renderOrder={-1} frustumCulled={false} />
      <primitive object={built.city} />
      {built.towers > 0 && <points geometry={built.beaconGeometry} material={built.beaconMaterial} />}
    </group>
  );
}
