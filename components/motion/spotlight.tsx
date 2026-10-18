'use client';

import { useEffect, useRef } from 'react';

/**
 * A soft light that follows the pointer across a card, with a brighter rim
 * where it meets the border. Adapted from React Bits' SpotlightCard
 * (github.com/DavidHDev/react-bits, MIT + Commons Clause, © David Haz): the
 * same eased follow, proximity fade and falloff, reduced to a layer that sits
 * inside an existing card, so the card keeps its own markup and styles.
 *
 * Drop it in as the first child of a `relative isolate overflow-hidden`
 * element: the light sits under the card's content, the rim over its border. It
 * only runs for a mouse or trackpad, draws nothing until the pointer is near,
 * and stops its animation loop as soon as the light settles.
 */

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** React Bits' falloff: a solid core easing into a long, soft tail. */
function falloff(color: string, softness: number) {
  const soft = clamp(softness, 0, 1);
  const core = (1 - soft) ** 1.5 * 0.85;
  const stop = (alpha: number, at: number) =>
    `color-mix(in srgb, ${color} ${(alpha * 100).toFixed(2)}%, transparent) ${(at * 100).toFixed(2)}%`;
  const list = [stop(1, 0)];
  for (let i = 0; i <= 14; i++) {
    const t = core + ((1 - core) * i) / 14;
    const g = (t - core) / (1 - core);
    const smooth = 1 - g * g * (3 - 2 * g);
    const glow = Math.exp(-4.6 * g * g) * (1 - g ** 6);
    list.push(stop(smooth + (glow - smooth) * soft, t));
  }
  return list.join(', ');
}

const RIM_MASK =
  'p-px [-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [-webkit-mask-composite:xor] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]';

export function Spotlight({
  color = 'var(--color-accent)',
  size = 260,
  intensity = 0.14,
  rim = 0.55,
  proximity = 70,
}: {
  color?: string;
  size?: number;
  intensity?: number;
  rim?: number;
  proximity?: number;
}) {
  const lightRef = useRef<HTMLSpanElement>(null);
  const rimRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    const edge = rimRef.current;
    const card = light?.parentElement;
    if (!light || !edge || !card) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const fill = falloff(color, 0.7);
    const rimFill = falloff(color, 1);
    const state = { x: 0, y: 0, presence: 0 };
    const pointer = { x: 0, y: 0, active: false };
    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const rect = card.getBoundingClientRect();
      let tx = state.x;
      let ty = state.y;
      let target = 0;
      if (pointer.active) {
        tx = pointer.x - rect.left;
        ty = pointer.y - rect.top;
        const gap = Math.hypot(Math.max(0, -tx, tx - rect.width), Math.max(0, -ty, ty - rect.height));
        target = gap === 0 ? 1 : Math.max(0, 1 - gap / proximity) ** 2;
      }
      // Appear where the pointer is rather than sliding in from the last spot.
      if (state.presence < 0.02 && target > 0) {
        state.x = tx;
        state.y = ty;
      }
      const follow = 1 - Math.exp(-dt / 0.08);
      state.x += (tx - state.x) * follow;
      state.y += (ty - state.y) * follow;
      const fade = 1 - Math.exp(-dt / (target > state.presence ? 0.1 : 0.32));
      state.presence += (target - state.presence) * fade;
      if (Math.abs(target - state.presence) < 0.002) state.presence = target;

      const at = `${state.x.toFixed(1)}px ${state.y.toFixed(1)}px`;
      light.style.background = `radial-gradient(circle ${size}px at ${at}, ${fill})`;
      edge.style.background = `radial-gradient(circle ${size * 0.6}px at ${at}, ${rimFill})`;
      light.style.opacity = String(state.presence * intensity);
      edge.style.opacity = String(state.presence * rim);

      const moving = Math.abs(tx - state.x) > 0.1 || Math.abs(ty - state.y) > 0.1;
      if (moving || state.presence !== target) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      // Only cards near the pointer do any work.
      const r = card.getBoundingClientRect();
      const near =
        e.clientX > r.left - proximity &&
        e.clientX < r.right + proximity &&
        e.clientY > r.top - proximity &&
        e.clientY < r.bottom + proximity;
      if (near || state.presence > 0) wake();
    };
    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      pointer.active = false;
      wake();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
    };
  }, [color, intensity, proximity, rim, size]);

  return (
    <>
      <span ref={lightRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0" />
      <span
        ref={rimRef}
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-[2] rounded-[inherit] opacity-0 ${RIM_MASK}`}
      />
    </>
  );
}
