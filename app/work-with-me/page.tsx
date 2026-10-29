import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Briefcase, Linkedin, Mail, Rocket } from 'lucide-react';
import { profile } from '@/content/profile';
import { faq, howItStarts, industries, offers, positioning, roles } from '@/content/services';
import { JsonLd } from '@/components/seo/json-ld';
import { IntentButton, LeadForm } from '@/components/site/lead-form';
import { Eyebrow, PageHeader } from '@/components/site/page-header';
import { breadcrumbSchema, graph, servicesFaqSchema } from '@/lib/seo';

/**
 * The way in, for both kinds of inbound: companies hiring for a Founder's
 * Office, Chief of Staff or strategy role, and businesses that want GTM,
 * pricing or growth help. Written so a person or an AI assistant can tell in
 * one read what Archit does, the proof, and how to reach him.
 */

const TITLE = `Work with ${profile.name}: GTM, growth and strategy in India`;
const DESCRIPTION =
  "Hire Archit Sagar Jain for Founder's Office, Chief of Staff and strategy roles, or bring him in for GTM and growth strategy, pricing, unit economics and cost reduction. Ex-PwC India, founding team at ZenCabs.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/work-with-me' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/work-with-me' },
};

export default function WorkWithMePage() {
  return (
    <>
      <JsonLd
        data={graph(
          servicesFaqSchema(),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work with me', path: '/work-with-me' },
          ]),
        )}
      />
      <PageHeader current="/work-with-me" />
      <main id="main" className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        {/* --------------------------------------------------------- intro */}
        <section className="pt-12 sm:pt-16">
          <Eyebrow>Work with me</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-[2.3rem] leading-[1.04] font-extrabold tracking-[-0.03em] text-ink sm:text-[3.4rem]">
            {positioning.headline[0]!.toUpperCase() + positioning.headline.slice(1)}, for hire or on a project
          </h1>
          <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-muted sm:text-[17px]">{positioning.summary}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a href="#roles" className="group rounded-2xl border border-hairline bg-surface p-5 transition-colors hover:border-accent/40">
              <Briefcase className="h-5 w-5 text-accent" />
              <p className="mt-3 text-[17px] font-bold text-ink">You’re hiring</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted">Founder’s Office, Chief of Staff and strategy roles.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-accent">
                Roles I’m open to <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
            <a href="#consulting" className="group rounded-2xl border border-hairline bg-surface p-5 transition-colors hover:border-accent/40">
              <Rocket className="h-5 w-5 text-accent" />
              <p className="mt-3 text-[17px] font-bold text-ink">You need a problem solved</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted">GTM, pricing, unit economics, cost and operating cadence.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-accent">
                What I take on <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>
        </section>

        {/* ---------------------------------------------------------- roles */}
        <section id="roles" className="mt-16 scroll-mt-20" aria-labelledby="roles-title">
          <Eyebrow>For hiring managers and founders</Eyebrow>
          <h2 id="roles-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">
            Roles I’m open to
          </h2>
          <ol className="mt-6 space-y-3">
            {roles.map((r, i) => (
              <li key={r.title} className="flex gap-4 rounded-2xl border border-hairline bg-surface p-5">
                <span className="font-display text-xl font-extrabold text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block text-[16px] font-bold text-ink">{r.title}</span>
                  <span className="mt-0.5 block text-[14px] leading-relaxed text-muted">{r.note}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-muted">
            I’ve been on both sides of the table. As a consultant I diagnose problems and get CXOs to agree. As an operator I
            own the fix, from ride data and driver shifts to pricing and SOPs, and I carry it until the number moves. I’m
            currently on the PGP in Technology &amp; Business Management at Masters’ Union.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <IntentButton
              intent="hiring"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[12px] font-bold tracking-[0.12em] text-void uppercase transition-colors hover:bg-accent"
            >
              Talk about a role <ArrowRight className="h-4 w-4" />
            </IntentButton>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-3 text-[12px] font-bold tracking-[0.12em] text-ink uppercase"
            >
              Resume
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-3 text-[12px] font-bold tracking-[0.12em] text-ink uppercase"
            >
              Full profile
            </Link>
          </div>
        </section>

        {/* ----------------------------------------------------- consulting */}
        <section id="consulting" className="mt-16 scroll-mt-20" aria-labelledby="consulting-title">
          <Eyebrow>For founders and leadership teams</Eyebrow>
          <h2 id="consulting-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">
            Consulting work I take on
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {offers.map((o) => (
              <article id={o.id} key={o.id} className="flex scroll-mt-20 flex-col rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
                <h3 className="text-[17px] font-bold text-ink">{o.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{o.what}</p>
                <p className="mt-3 rounded-xl bg-accent/[0.07] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-ink/90">
                  <span className="font-semibold text-accent">Done before: </span>
                  {o.proof}
                </p>
                {o.read && (
                  <Link href={o.read.href} className="mt-3 inline-flex items-start gap-1 text-[13px] font-semibold text-muted hover:text-accent">
                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {o.read.label}
                  </Link>
                )}
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-muted">{howItStarts}</p>
          <IntentButton
            intent="consulting"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[12px] font-bold tracking-[0.12em] text-void uppercase transition-colors hover:bg-accent"
          >
            Start with a call <ArrowRight className="h-4 w-4" />
          </IntentButton>
          <p className="mt-4 text-[13.5px] leading-relaxed text-faint">
            <span className="font-semibold text-muted">Industries I’ve worked in: </span>
            {industries.join(' · ')}
          </p>
        </section>

        {/* -------------------------------------------------------- contact */}
        <section id="contact" className="mt-16 scroll-mt-20 rounded-3xl border border-hairline bg-surface p-5 sm:p-10" aria-labelledby="contact-title">
          <h2 id="contact-title" className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Tell me what you need
          </h2>
          <p className="mt-2 text-[15px] text-muted">It comes straight to me.</p>
          <div className="mt-6">
            <LeadForm email={profile.links.email} />
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-5 text-[13.5px] text-muted">
            <a href={`mailto:${profile.links.email}`} className="inline-flex items-center gap-2 break-all hover:text-ink">
              <Mail className="h-4 w-4 shrink-0" /> {profile.links.email}
            </a>
            <a href={profile.links.linkedin} target="_blank" rel="me noopener" className="inline-flex items-center gap-2 hover:text-ink">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section className="mt-16" aria-labelledby="faq-title">
          <h2 id="faq-title" className="font-display text-2xl font-extrabold tracking-tight text-ink">
            Questions people ask
          </h2>
          <div className="mt-5 divide-y divide-hairline rounded-2xl border border-hairline">
            {faq.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none text-[15.5px] font-semibold text-ink marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
