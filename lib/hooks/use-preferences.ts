'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';

/** Generic media-query hook that is SSR-safe (always false on the server). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

export const useIsMobile = () => useMediaQuery('(max-width: 767px)');

export const useIsTouch = () => useMediaQuery('(hover: none) and (pointer: coarse)');

const SLOW_KEY = 'archit:scene-slow';

/** Renderers that draw WebGL on the CPU. The scene would crawl on them. */
const SOFTWARE_GL = /swiftshader|llvmpipe|softpipe|software|basic render/i;

function softwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  try {
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? '');
    return SOFTWARE_GL.test(name);
  } catch {
    return false;
  }
}

/** The scene could not keep up on this device. Remembered for the session. */
const useSceneSlow = create<{ slow: boolean; mark: () => void }>((set) => ({
  slow: false,
  mark: () => {
    try {
      sessionStorage.setItem(SLOW_KEY, '1');
    } catch {}
    set({ slow: true });
  },
}));

/** Called by the scene when it measures a frame rate too low to be worth it. */
export const markSceneSlow = () => useSceneSlow.getState().mark();

/**
 * True when the device can plausibly run the 3D scene smoothly.
 *
 * Uses hardware hints rather than a benchmark, then the scene itself measures
 * its frame rate and gives up (markSceneSlow) if it cannot keep up. Either way
 * the fallback is the still of the same scene, so a wrong guess costs little.
 * Add ?force3d to the URL to skip the checks.
 */
export function useCanRender3D(): boolean {
  const [capable, setCapable] = useState(false);
  const reduced = useReducedMotion();
  const slow = useSceneSlow((s) => s.slow);

  useEffect(() => {
    if (reduced) {
      setCapable(false);
      return;
    }
    if (new URLSearchParams(window.location.search).has('force3d')) {
      setCapable(true);
      return;
    }
    try {
      if (sessionStorage.getItem(SLOW_KEY)) {
        setCapable(false);
        return;
      }
    } catch {}

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;

    if (saveData || cores < 4 || memory < 4) {
      setCapable(false);
      return;
    }

    // Confirm a hardware WebGL context is actually obtainable before mounting the canvas.
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      setCapable(Boolean(gl) && !softwareRenderer(gl!));
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      setCapable(false);
    }
  }, [reduced]);

  return capable && !slow;
}
