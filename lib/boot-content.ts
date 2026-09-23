import { heroStats, profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { timeline } from '@/content/timeline';

/**
 * Content for the ARCHIT.OS boot, shared by the full-screen boot
 * (components/hero/boot-sequence.tsx) and the laptop's standby screen in the
 * 3D scene (components/three/lock-screen-texture.ts), so the two always match.
 *
 * Every figure comes from `content/`. An earlier boot log had its own
 * hardcoded numbers, and they went stale when the CV was added.
 */

export const OS_NAME = 'ARCHIT.OS';
export const OS_VERSION = 'v2.0';
export const IDENTITY = profile.name;
export const ROLE = profile.alsoCurrently.split(',')[0] ?? '';

/** First and last initials: "Archit Sagar Jain" → "AJ". */
export const INITIALS = (() => {
  const parts = profile.name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ''}${parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : ''}`.toUpperCase();
})();

export const STATS = heroStats.slice(0, 4);

/** Counts for the HUD. */
export const COUNTS = { caseStudies: projects.length, milestones: timeline.length };

/**
 * On the laptop in the hero this is literal: scrolling the page is what flies
 * the camera into the screen and wakes it.
 */
export const WAKE_HINT = 'Scroll to wake Archit AI';

/** The boot log. */
export const BOOT_LINES = [
  `Initialising ${OS_NAME} ${OS_VERSION}`,
  `Verifying identity … ${IDENTITY}`,
  `Mounting /work … ${projects.length} case studies`,
  `Indexing /timeline … ${timeline.length} milestones`,
  ...heroStats.slice(0, 2).map((s) => `Loading ${s.label.toLowerCase()} … ${s.value}`),
  'Calibrating voice and personality … ok',
  'Waking Archit AI …',
];

/** "Good evening", by the visitor's clock. */
export function greeting(d: Date): string {
  const h = d.getHours();
  return h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

/** "14:03" or "2:03" per the visitor's locale, without AM/PM. */
export function formatClock(d: Date, seconds = false): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    ...(seconds ? { second: '2-digit' } : {}),
  })
    .formatToParts(d)
    .filter((p) => p.type !== 'dayPeriod')
    .map((p) => p.value)
    .join('')
    .trim();
}

/** "Wednesday 23 September" (order and punctuation per locale). */
export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
}
