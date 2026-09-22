'use client';

import { useEffect, useState } from 'react';

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

/**
 * True when the device can plausibly run the 3D scene at 60fps.
 *
 * Uses hardware hints rather than a benchmark: a wrong guess costs a downgrade
 * to the static hero, which is a far better failure than a janky scene.
 */
export function useCanRender3D(): boolean {
  const [capable, setCapable] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setCapable(false);
      return;
    }

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;

    if (saveData || cores < 4 || memory < 4) {
      setCapable(false);
      return;
    }

    // Confirm a WebGL context is actually obtainable before mounting the canvas.
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      setCapable(Boolean(gl));
    } catch {
      setCapable(false);
    }
  }, [reduced]);

  return capable;
}
