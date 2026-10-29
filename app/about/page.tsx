import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Linkedin, Mail } from 'lucide-react';
import { heroStats, profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { education, experience, skills } from '@/content/resume';
import { articlesByDate, plain } from '@/content/articles';
import { positioning } from '@/content/services';
import { JsonLd } from '@/components/seo/json-ld';
import { Eyebrow, PageHeader } from '@/components/site/page-header';
import { breadcrumbSchema, graph, profilePageSchema } from '@/lib/seo';

/**
 * The profile as one plain page. The interactive desktop on the home page is
 * built in JavaScript, and most crawlers and AI assistants never run it, so
 * without this page they would see a name and four numbers. Everything here
 * is server-rendered from the same content files as the desktop.
 */

const TITLE = `${profile.name}: ${positioning.headline}`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: positioning.summary,
  alternates: { canonical: '/about' },
  openGraph: { title: TITLE, description: positioning.summary, url: '/about', type: 'profile' },
};

export default function AboutPage() {
  const writing = articlesByDate().slice(0, 6);
  return (
    <>
      <JsonLd data={graph(profilePageSchema(), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]))} />
      <PageHeader current="/about" />
      <main id="main" className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        {/* --------------------------------------------------------- intro */}
        <section className="pt-12 sm:pt-16">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-4 font-display text-[2.4rem] leading-[1.02] font-extrabold tracking-[-0.03em] text-ink sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 text-lg font-semibold text-ink/90 sm:text-xl">
            Go-to-market, growth and strategy · Founder’s Office · India
          </p>
          <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-muted sm:text-[17px]">{positioning.summary}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/work-with-me"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[12px] font-bold tracking-[0.12em] text-void uppercase transition-colors hover:bg-accent"
            >
              Work with me <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={profile.links.linkedin}
              rel="me noopener"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-3 text-[12px] font-bold tracking-[0.12em] text-ink uppercase transition-colors hover:border-accent/50"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-3 text-[12px] font-bold tracking-[0.12em] text-ink uppercase transition-colors hover:border-accent/50"
            >
              Resume
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label} className="bg-void p-4 sm:p-5">
                <dd className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{s.value}</dd>
                <dt className="mt-1 text-[11px] font-semibold tracking-[0.12em] text-faint uppercase">{s.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------------------------------------------------------- story */}
        <section className="mt-16" aria-labelledby="story">
          <Eyebrow>My story</Eyebrow>
          <h2 id="story" className="sr-only">
            My story
          </h2>
          <div className="mt-5 max-w-3xl space-y-4 text-[16px] leading-relaxed text-muted">
            {profile.about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- case studies */}
        <section id="case-studies" className="mt-16 scroll-mt-20" aria-labelledby="cases">
          <Eyebrow>Case studies</Eyebrow>
          <h2 id="cases" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">
            Work, with the numbers
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {projects.map((p) => (
              <article id={p.slug} key={p.slug} className="scroll-mt-20 rounded-2xl border border-hairline bg-surface p-6">
                <h3 className="font-display text-xl font-extrabold text-ink">{p.name}</h3>
                <p className="mt-1 text-[13px] text-faint">
                  {p.role} · {p.period}
                </p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{p.summary}</p>
                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <dd className="font-display text-lg font-extrabold text-accent">{m.value}</dd>
                      <dt className="text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">{m.label}</dt>
                    </div>
                  ))}
                </dl>
                <ul className="mt-4 space-y-1.5">
                  {p.caseStudy.results.map((r, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted">
                      <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                      {r}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------- experience */}
        <section className="mt-16" aria-labelledby="experience">
          <Eyebrow>Experience</Eyebrow>
          <h2 id="experience" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">
            Where I have worked
          </h2>
          <ol className="mt-8 space-y-7 border-l border-hairline pl-6">
            {experience.map((e) => (
              <li key={`${e.org}-${e.role}`} className="relative">
                <span className="absolute top-2 -left-[29px] h-2.5 w-2.5 rounded-full border-2 border-void bg-accent" />
                <h3 className="text-[16px] font-bold text-ink">
                  {e.role}, {e.org}
                </h3>
                <p className="mt-0.5 text-[12.5px] text-faint">
                  {e.period} · {e.location}
                </p>
                <ul className="mt-2 space-y-1">
                  {e.bullets.map((b, i) => (
                    <li key={i} className="text-[14px] leading-relaxed text-muted">
                      {b}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------- skills and education */}
        <section className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <Eyebrow>Skills</Eyebrow>
            <dl className="mt-5 space-y-4">
              {skills.map((g) => (
                <div key={g.group}>
                  <dt className="text-[14px] font-bold text-ink">{g.group}</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-muted">{g.items.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <Eyebrow>Education</Eyebrow>
            <ul className="mt-5 space-y-4">
              {education.map((ed) => (
                <li key={ed.school}>
                  <p className="text-[14px] font-bold text-ink">{ed.school}</p>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-muted">{ed.degree}</p>
                  <p className="mt-0.5 text-[12.5px] text-faint">
                    {ed.period} · {ed.location}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------- writing */}
        <section className="mt-16" aria-labelledby="writing">
          <Eyebrow>Writing</Eyebrow>
          <h2 id="writing" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">
            How I think about businesses
          </h2>
          <ul className="mt-6 divide-y divide-hairline rounded-2xl border border-hairline">
            {writing.map((a) => (
              <li key={a.slug}>
                <Link href={`/articles/${a.slug}`} className="group flex items-start justify-between gap-4 p-4 sm:p-5">
                  <span>
                    <span className="block text-[11px] font-bold tracking-[0.16em] text-accent uppercase">{a.category}</span>
                    <span className="mt-1 block text-[15px] leading-snug font-semibold text-ink group-hover:text-accent">
                      {plain(a.title)}
                    </span>
                  </span>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-faint group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/articles" className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent">
            All articles <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* -------------------------------------------------------- contact */}
        <section className="mt-16 rounded-3xl border border-hairline bg-surface p-6 sm:p-10">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Hiring, or need a hand?</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
            I’m looking at Founder’s Office, Chief of Staff and strategy roles, and I take on GTM, pricing and growth work
            for Indian businesses.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/work-with-me"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[12px] font-bold tracking-[0.12em] text-void uppercase transition-colors hover:bg-accent"
            >
              Work with me <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`mailto:${profile.links.email}`}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-hairline-strong px-5 py-3 text-[12px] font-bold tracking-[0.06em] break-all text-ink"
            >
              <Mail className="h-4 w-4 shrink-0" /> {profile.links.email}
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
