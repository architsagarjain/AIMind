'use client';

import { motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';
import { profile } from '@/content/profile';
import { SectionLabel } from '@/components/ui/section-label';
import { Tag } from '@/components/ui/tag';

export function AboutWindow() {
  return (
    <div className="relative px-7 py-8">
      <div className="bloom top-[-6rem] right-[-6rem] h-64 w-64" />

      <div className="relative">
        <SectionLabel>About</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-ink">About Archit</h2>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-faint">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            {profile.hometown}
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            {profile.currently}
          </span>
        </div>

        <div className="mt-7 space-y-4">
          {profile.about.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[15px] leading-relaxed text-muted"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        <div className="rule-fade my-8" />

        <SectionLabel>What I care about</SectionLabel>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <Tag key={interest}>{interest}</Tag>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-accent/20 bg-accent/[0.04] p-5">
          <p className="text-sm leading-relaxed text-ink/90 italic">
            &ldquo;I enjoy building things, solving problems and scaling ideas. The thread through
            consulting, startups, growth and operations has always been the same — get close to the
            problem, then ship something.&rdquo;
          </p>
          <p className="mt-3 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
            — {profile.name}
          </p>
        </div>
      </div>
    </div>
  );
}
