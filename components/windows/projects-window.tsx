'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projects } from '@/content/projects';
import type { Project } from '@/types';
import { SectionLabel } from '@/components/ui/section-label';
import { Tag } from '@/components/ui/tag';
import { useTelemetry } from '@/lib/hooks/use-telemetry';
import { cn } from '@/lib/utils';

/** Grid of case-study cards that swap to a full case study in place. */
export function ProjectsWindow() {
  const [active, setActive] = useState<Project | null>(null);
  const track = useTelemetry();

  return (
    <div className="relative px-7 py-8">
      <div className="bloom top-[-8rem] left-[-4rem] h-72 w-72" />

      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <CaseStudy project={active} onBack={() => setActive(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative"
          >
            <SectionLabel>Selected Work</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">Projects</h2>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Four bodies of work across consulting, marketplaces and brand. Open any one for the
              full challenge, strategy, execution, results and lessons.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {projects.map((project, i) => (
                <motion.button
                  key={project.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    setActive(project);
                    track('project_viewed', { project: project.slug });
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-hairline-strong surface-1 p-5 text-left transition-all duration-400 hover:-translate-y-1 hover:border-accent/40 hover:surface-2"
                >
                  {/* Accent wash on hover */}
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(ellipse at 20% 0%, ${project.accent}1f 0%, transparent 62%)`,
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-bold text-ink">{project.name}</h3>
                        <p className="mt-1 text-xs text-faint">{project.subtitle}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </div>

                    <p className="mt-4 text-[13px] leading-relaxed text-muted">{project.summary}</p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                      {project.metrics.map((metric) => (
                        <div key={metric.label}>
                          <p
                            className="font-display text-base font-extrabold tabular-nums"
                            style={{ color: project.accent }}
                          >
                            {metric.value}
                          </p>
                          <p className="text-[9px] font-semibold tracking-[0.14em] text-faint uppercase">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Tag key={tag} className="text-[10px]">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SECTIONS = [
  { key: 'strategy', label: 'Strategy' },
  { key: 'execution', label: 'Execution' },
  { key: 'results', label: 'Results' },
  { key: 'lessons', label: 'Lessons' },
] as const;

function CaseStudy({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <article>
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Projects
      </button>

      <SectionLabel>{project.role}</SectionLabel>
      <h2 className="mt-3 font-display text-4xl font-extrabold text-ink">{project.name}</h2>
      <p className="mt-2 text-sm text-muted">
        {project.subtitle} · <span className="text-faint">{project.period}</span>
      </p>

      {/* Metric strip */}
      <div className="mt-7 grid grid-cols-3 divide-x divide-[color:var(--color-hairline-strong)] overflow-hidden rounded-xl border border-hairline-strong surface-1">
        {project.metrics.map((metric) => (
          <div key={metric.label} className="px-4 py-4 text-center">
            <p
              className="font-display text-xl font-extrabold tabular-nums"
              style={{ color: project.accent }}
            >
              {metric.value}
            </p>
            <p className="mt-1 text-[9px] font-semibold tracking-[0.14em] text-faint uppercase">
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      {/* Challenge */}
      <section className="mt-8">
        <SectionLabel>Challenge</SectionLabel>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{project.caseStudy.challenge}</p>
      </section>

      {SECTIONS.map(({ key, label }, index) => (
        <section key={key} className="mt-8">
          <SectionLabel>{label}</SectionLabel>
          <ul className="mt-3 space-y-3">
            {project.caseStudy[key].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i + index * 0.05, duration: 0.5 }}
                className="flex gap-3 text-[14px] leading-relaxed text-muted"
              >
                <span
                  className={cn('mt-[0.55rem] h-1 w-1 shrink-0 rounded-full')}
                  style={{ background: project.accent }}
                />
                {item}
              </motion.li>
            ))}
          </ul>
        </section>
      ))}

      <div className="mt-10 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </article>
  );
}
