import { heroStats, profile } from '@/content/profile';
import { projects } from '@/content/projects';

/**
 * Content for the ARCHIT.OS lock screen, shared by the full-screen version
 * (components/hero/boot-sequence.tsx) and the laptop's screen in the 3D scene
 * (components/three/lock-screen-texture.ts), so the two always match.
 *
 * Every figure comes from `content/`. The boot screen this replaced had its
 * own hardcoded numbers, and they went stale when the CV was added.
 */

export const LOCK_NAME = profile.name;

/** First and last initials: "Archit Sagar Jain" → "AJ". */
export const LOCK_INITIALS = (() => {
  const parts = profile.name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ''}${parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : ''}`.toUpperCase();
})();

/** The stat widgets under the clock. */
export const LOCK_STATS = heroStats.slice(0, 4);

/**
 * On the laptop in the hero this is literal: scrolling the page is what flies
 * the camera into this screen and unlocks it.
 */
export const LOCK_HINT = 'Scroll to unlock';

/** Status lines shown under the avatar while it unlocks. */
export const UNLOCK_STEPS = [
  'Unlocking ARCHIT.OS',
  `Loading ${projects.length} case studies`,
  ...heroStats.slice(0, 2).map((s) => `${s.value} · ${s.label}`),
  'Waking Archit AI',
];

/** "14:03" or "2:03" per the visitor's locale, without AM/PM, as lock screens show it. */
export function formatLockTime(d: Date): string {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
    .formatToParts(d)
    .filter((p) => p.type !== 'dayPeriod')
    .map((p) => p.value)
    .join('')
    .trim();
}

/** "Wednesday 23 September" (order and punctuation per locale). */
export function formatLockDate(d: Date): string {
  return new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
}
