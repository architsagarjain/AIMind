'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, ChevronDown, GraduationCap, Rocket } from 'lucide-react';
import { timeline } from '@/content/timeline';
import type { TimelineMilestone } from '@/types';
import { SectionLabel } from '@/components/ui/section-label';
import { useTelemetry } from '@/lib/hooks/use-telemetry';
import { cn } from '@/lib/utils';

const KIND_ICON: Record<TimelineMilestone['kind'], typeof Rocket> = {
  education: GraduationCap,
  work: Building2,
  venture: Rocket,
};

const KIND_COLOR: Record<TimelineMilestone['kind'], string> = {
  education: '#1D9BF0',
  work: '#9CA3AF',
  venture: '#6EF2FF',
};

/** Vertical timeline where each milestone expands in place. */
export function TimelineWindow() {
  const [openId, setOpenId] = useState<string | null>(timeline[0]?.id ?? null);
  const track = useTelemetry();

  return (
    <div className="relative px-7 py-8">
      <div className="bloom top-[-6rem] right-[-8rem] h-72 w-72" />

      <div className="relative">
        <SectionLabel>The path so far</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">Timeline</h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          Five steps from a business degree in Pune to building at Masters&apos; Union. Tap any one
          to open it.
        </p>

        <ol className="relative mt-9">
          {/* Spine */}
          <span className="absolute top-2 bottom-8 left-[19px] w-px bg-gradient-to-b from-accent/50 via-hairline-strong to-transparent" />

          {timeline.map((milestone, i) => {
            const Icon = KIND_ICON[milestone.kind];
            const color = KIND_COLOR[milestone.kind];
            const isOpen = openId === milestone.id;

            return (
              <motion.li
                key={milestone.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative pb-6 pl-14"
              >
                {/* Node */}
                <span
                  className={cn(
                    'absolute top-1 left-0 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-400',
                    isOpen ? 'border-transparent' : 'border-hairline-strong bg-surface',
                  )}
                  style={
                    isOpen
                      ? { background: `${color}1f`, boxShadow: `0 0 0 1px ${color}59, 0 0 24px -6px ${color}` }
                      : undefined
                  }
                >
                  <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.8} />
                </span>

                <button
                  onClick={() => {
                    const next = isOpen ? null : milestone.id;
                    setOpenId(next);
                    if (next) track('milestone_opened', { milestone: next });
                  }}
                  aria-expanded={isOpen}
                  className="group w-full text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.18em] text-faint uppercase">
                        {milestone.year}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-bold text-ink transition-colors group-hover:text-accent">
                        {milestone.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted">
                        {milestone.org} · {milestone.location}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        'mt-1 h-4 w-4 shrink-0 text-faint transition-transform duration-400',
                        isOpen && 'rotate-180 text-accent',
                      )}
                    />
                  </div>
                  <p className="mt-2 text-[13px] text-muted">{milestone.summary}</p>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-4 space-y-2.5 rounded-xl border border-hairline bg-white/[0.03] p-4">
                        {milestone.details.map((detail, di) => (
                          <li key={di} className="flex gap-3 text-[13px] leading-relaxed text-muted">
                            <span
                              className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full"
                              style={{ background: color }}
                            />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
