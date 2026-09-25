import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';
import { education, experience, skills } from '@/content/resume';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { AutoPrint } from './auto-print';
import './print.css';

export const metadata: Metadata = {
  alternates: { canonical: '/resume' },
  title: 'Resume',
  description: `Resume of ${profile.name} — ${profile.roles.join(', ')}.`,
};

/**
 * Print-optimised resume.
 *
 * Renders as a normal dark page on screen and as a clean black-on-white A4
 * document when printed (see `print.css`). `?print=1` opens the dialog directly,
 * which is what the desktop's Download PDF button links to.
 */
export default function ResumePage() {
  return (
    <main className="resume-page mx-auto min-h-dvh max-w-3xl bg-void px-6 py-12 md:px-10 md:py-16">
      <Suspense fallback={null}>
        <AutoPrint />
      </Suspense>

      {/* Screen-only controls */}
      <div className="no-print mb-10 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-muted uppercase transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          ARCHIT.AI
        </Link>
        <a
          href="?print=1"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-void uppercase transition-colors hover:bg-accent"
        >
          <Printer className="h-3.5 w-3.5" />
          Save as PDF
        </a>
      </div>

      {/* ---------------------------------------------------------- header */}
      <header className="border-b border-hairline pb-6">
        <h1 className="font-display text-4xl font-extrabold text-ink">{profile.name}</h1>
        <p className="mt-2 text-sm text-muted">{profile.roles.join(' · ')}</p>
        <p className="mt-2 text-xs text-faint">
          {profile.hometown} · {profile.links.email} · {profile.links.linkedin}
        </p>
        <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-muted">
          {profile.description}
        </p>
      </header>

      {/* ------------------------------------------------------ experience */}
      <section className="mt-9">
        <h2 className="text-[11px] font-bold tracking-[0.24em] text-accent uppercase">Experience</h2>
        <div className="mt-5 space-y-6">
          {experience.map((role) => (
            <article key={`${role.org}-${role.role}`} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-bold text-ink">
                  {role.role} — {role.org}
                </h3>
                <p className="text-[11px] text-faint">
                  {role.period} · {role.location}
                </p>
              </div>
              <ul className="mt-2 space-y-1">
                {role.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-muted">
                    <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-white/30" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- education */}
      <section className="mt-9">
        <h2 className="text-[11px] font-bold tracking-[0.24em] text-accent uppercase">Education</h2>
        <div className="mt-5 space-y-3">
          {education.map((entry) => (
            <div key={entry.school} className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-ink">
                {entry.degree} — {entry.school}
              </p>
              <p className="text-[11px] text-faint">
                {entry.period} · {entry.location}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- skills */}
      <section className="mt-9">
        <h2 className="text-[11px] font-bold tracking-[0.24em] text-accent uppercase">Skills</h2>
        <div className="mt-5 space-y-2.5">
          {skills.map((group) => (
            <p key={group.group} className="text-[13px] leading-relaxed">
              <span className="font-semibold text-ink">{group.group}: </span>
              <span className="text-muted">{group.items.join(' · ')}</span>
            </p>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- projects */}
      <section className="mt-9">
        <h2 className="text-[11px] font-bold tracking-[0.24em] text-accent uppercase">Projects</h2>
        <div className="mt-5 space-y-4">
          {projects.map((project) => (
            <article key={project.slug} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-bold text-ink">
                  {project.name} — {project.subtitle}
                </h3>
                <p className="text-[11px] text-faint">{project.role}</p>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{project.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="no-print mt-12 border-t border-hairline pt-6 text-xs text-faint">
        Generated from{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-accent">content/resume.ts</code> —
        edit there and this page updates.
      </footer>
    </main>
  );
}
