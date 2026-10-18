"use client";

import { cn } from "@/lib/utils";

/**
 * A still of the 3D scene, rendered from the scene itself.
 *
 * It paints with the page (about 25KB on a phone, 55KB on a laptop), so the
 * figure is there long before the 3D models finish downloading. It fades out
 * once the live scene is ready, and stays on devices that skip the 3D: low
 * power, slow frame rates, or reduced motion. The camera frames portrait
 * screens differently, so there is a still for each.
 */
export function ScenePoster({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 bg-[#050816] transition-opacity duration-700 ease-out",
        hidden && "opacity-0",
      )}
      aria-hidden
    >
      <picture>
        <source
          media="(max-aspect-ratio: 4/5)"
          srcSet="/hero/poster-portrait.webp"
        />
        <img
          src="/hero/poster-landscape.webp"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </picture>
    </div>
  );
}
