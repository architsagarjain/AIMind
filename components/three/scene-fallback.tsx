'use client';

import { motion } from 'framer-motion';

/**
 * Static stand-in for the 3D scene.
 *
 * Shown while the canvas loads, and permanently on low-power devices or under
 * prefers-reduced-motion. It is a CSS-only composition — a silhouette lit by
 * the same cyan key — so the hero never renders as an empty rectangle.
 */
export function SceneFallback({ animated = true }: { animated?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden" aria-hidden="true">
      {/* Window light */}
      <div className="absolute top-0 right-0 h-[70%] w-[62%] bg-gradient-to-bl from-[#12203a] via-[#0a1024] to-transparent opacity-80" />

      {/* City lights */}
      <div className="absolute top-[18%] right-[6%] h-[38%] w-[48%] opacity-60">
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-[1px] bg-[#ffd7a0]"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 4 === 0 ? 3 : 2,
              opacity: 0.25 + ((i * 7) % 10) / 14,
            }}
          />
        ))}
      </div>

      {/* Cyan rim bloom */}
      <motion.div
        className="bloom h-[42rem] w-[42rem] -translate-x-1/4 translate-y-[-10%]"
        animate={animated ? { opacity: [0.5, 0.85, 0.5], scale: [1, 1.05, 1] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ left: '20%', top: '10%' }}
      />

      {/* Seated silhouette */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[78%] w-[52%] -translate-x-1/2"
        animate={animated ? { y: [0, -6, 0] } : undefined}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute bottom-0 left-1/2 h-[62%] w-[74%] -translate-x-1/2 rounded-t-[42%] bg-gradient-to-t from-[#0b0b12] to-[#16161f]" />
        <div className="absolute bottom-[58%] left-1/2 h-[26%] w-[34%] -translate-x-1/2 rounded-[46%] bg-gradient-to-b from-[#2a2233] to-[#14141c]" />
      </motion.div>

      {/* Desk edge */}
      <div className="absolute bottom-[12%] right-0 h-[3px] w-[58%] bg-gradient-to-l from-[#3a2b21] to-transparent" />
      {/* Laptop glow */}
      <div className="absolute right-[18%] bottom-[14%] h-24 w-40 rounded-md bg-[#6ef2ff] opacity-[0.07] blur-2xl" />
    </div>
  );
}
