'use client';

import { motion } from 'framer-motion';
import { Download, ExternalLink, Mail } from 'lucide-react';
import { education, experience, skills } from '@/content/resume';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { SectionLabel } from '@/components/ui/section-label';
import { Tag } from '@/components/ui/tag';
import { useTelemetry } from '@/lib/hooks/use-telemetry';

export function ResumeWindow() {
  const track = useTelemetry();

  return (
    <div className="relative px-7 py-8">
      <div className="bloom top-[-6rem] left-[-6rem] h-64 w-64" />

      <div className="relative">
        {/* ------------------------------------------------------------ header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <SectionLabel>Curriculum Vitae</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">{profile.name}</h2>
            <p className="mt-1.5 text-sm text-muted">{profile.roles.join(' · ')}</p>
            <p className="mt-1 text-xs text-faint">{profile.hometown}</p>
          </div>

          <div className="flex flex-col gap-2">
            {/* Opens the print-optimised resume route; the browser's own
                "Save as PDF" is the export. No PDF binary to keep in sync. */}
            <a
              href="/resume?print=1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('resume_downloaded')}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[11px] font-bold tracking-[0.14em] text-void uppercase transition-all duration-300 hover:bg-accent hover:shadow-[var(--shadow-glow-sm)]"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
            <a
              href={`mailto:${profile.links.email}`}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-hairline-strong bg-white/5 px-5 text-[11px] font-bold tracking-[0.14em] text-ink uppercase transition-all duration-300 hover:border-accent/40"
            >
              <Mail className="h-4 w-4" />
              Get In Touch
            </a>
          </div>
        </div>

        <div className="rule-fade my-8" />

        {/* -------------------------------------------------------- experience */}
        <SectionLabel>Experience</SectionLabel>
        <div className="mt-5 space-y-7">
          {experience.map((role, i) => (
            <motion.div
              key={`${role.org}-${role.role}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative border-l border-hairline-strong pl-5"
            >
              <span className="absolute top-1.5 -left-[3.5px] h-1.5 w-1.5 rounded-full bg-accent shadow-[var(--shadow-glow-sm)]" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-bold text-ink">{role.role}</h3>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-faint uppercase">
                  {role.period}
                </p>
              </div>
              <p className="mt-0.5 text-xs text-accent/80">
                {role.org} · {role.location}
              </p>
              <ul className="mt-3 space-y-1.5">
                {role.bullets.map((bullet, bi) => (
                  <li key={bi} className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                    <span className="mt-[0.52rem] h-1 w-1 shrink-0 rounded-full bg-white/25" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="rule-fade my-8" />

        {/* --------------------------------------------------------- education */}
        <SectionLabel>Education</SectionLabel>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {education.map((entry) => (
            <div
              key={entry.school}
              className="rounded-xl border border-hairline-strong bg-white/[0.03] p-4"
            >
              <h3 className="font-display text-sm font-bold text-ink">{entry.school}</h3>
              <p className="mt-1 text-[13px] text-muted">{entry.degree}</p>
              <p className="mt-2 text-[10px] font-semibold tracking-[0.14em] text-faint uppercase">
                {entry.period} · {entry.location}
              </p>
            </div>
          ))}
        </div>

        <div className="rule-fade my-8" />

        {/* ------------------------------------------------------------ skills */}
        <SectionLabel>Skills</SectionLabel>
        <div className="mt-5 space-y-5">
          {skills.map((group) => (
            <div key={group.group}>
              <p className="text-[11px] font-semibold tracking-wide text-ink">{group.group}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Tag key={item} className="text-[10px]">
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rule-fade my-8" />

        {/* ---------------------------------------------------------- projects */}
        <SectionLabel>Projects</SectionLabel>
        <div className="mt-5 space-y-3">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-hairline bg-white/[0.02] px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{project.name}</p>
                <p className="mt-0.5 text-xs text-faint">{project.subtitle}</p>
              </div>
              <p className="text-[11px] text-muted">{project.role}</p>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------- links */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent"
          >
            LinkedIn <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={`mailto:${profile.links.email}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent"
          >
            {profile.links.email}
          </a>
        </div>
      </div>
    </div>
  );
}
