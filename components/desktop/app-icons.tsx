'use client';

import { useId } from 'react';
import type { WindowId } from '@/types';
import { cn } from '@/lib/utils';

/**
 * The ARCHIT.OS app icons, drawn in the style of macOS: a continuous-corner
 * squircle, artwork lit from above, a soft top sheen and a hairline edge.
 * They are original drawings, not Apple's icons, so the desktop reads as a
 * Mac without borrowing Apple's artwork or logo.
 *
 * Every icon is a 100×100 SVG, so one drawing serves the 14px title-bar size
 * and the 80px magnified dock alike.
 */

export type AppIconId = WindowId | 'linkedin' | 'mail' | 'trash';

/** A superellipse (n = 5), the shape of a macOS app icon. */
const SQUIRCLE = 'M100.00 50.00L99.96 66.80L99.83 72.14L99.61 76.01L99.31 79.12L98.92 81.75L98.44 84.05L97.87 86.08L97.20 87.89L96.44 89.52L95.58 91.00L94.61 92.33L93.53 93.53L92.33 94.61L91.00 95.58L89.52 96.44L87.89 97.20L86.08 97.87L84.05 98.44L81.75 98.92L79.12 99.31L76.01 99.61L72.14 99.83L66.80 99.96L50.00 100.00L33.20 99.96L27.86 99.83L23.99 99.61L20.88 99.31L18.25 98.92L15.95 98.44L13.92 97.87L12.11 97.20L10.48 96.44L9.00 95.58L7.67 94.61L6.47 93.53L5.39 92.33L4.42 91.00L3.56 89.52L2.80 87.89L2.13 86.08L1.56 84.05L1.08 81.75L0.69 79.12L0.39 76.01L0.17 72.14L0.04 66.80L0.00 50.00L0.04 33.20L0.17 27.86L0.39 23.99L0.69 20.88L1.08 18.25L1.56 15.95L2.13 13.92L2.80 12.11L3.56 10.48L4.42 9.00L5.39 7.67L6.47 6.47L7.67 5.39L9.00 4.42L10.48 3.56L12.11 2.80L13.92 2.13L15.95 1.56L18.25 1.08L20.88 0.69L23.99 0.39L27.86 0.17L33.20 0.04L50.00 0.00L66.80 0.04L72.14 0.17L76.01 0.39L79.12 0.69L81.75 1.08L84.05 1.56L86.08 2.13L87.89 2.80L89.52 3.56L91.00 4.42L92.33 5.39L93.53 6.47L94.61 7.67L95.58 9.00L96.44 10.48L97.20 12.11L97.87 13.92L98.44 15.95L98.92 18.25L99.31 20.88L99.61 23.99L99.83 27.86L99.96 33.20Z';

/** Ids for gradients must be unique on the page and safe inside url(#…). */
function useIds(app: AppIconId) {
  const base = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (name: string) => `${app}-${base}-${name}`;
}

function Frame({ id, children, background }: { id: (n: string) => string; children: React.ReactNode; background: [string, string] }) {
  return (
    <>
      <defs>
        <linearGradient id={id('bg')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={background[0]} />
          <stop offset="1" stopColor={background[1]} />
        </linearGradient>
        <linearGradient id={id('sheen')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id('clip')}>
          <path d={SQUIRCLE} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id('clip')})`}>
        <path d={SQUIRCLE} fill={`url(#${id('bg')})`} />
        {children}
        <path d={SQUIRCLE} fill={`url(#${id('sheen')})`} />
      </g>
      <path d={SQUIRCLE} fill="none" stroke="#000" strokeOpacity="0.1" strokeWidth="0.8" />
    </>
  );
}

// ------------------------------------------------------------------ the apps

/** About: a contact card with the monogram. */
function About() {
  const id = useIds('about');
  return (
    <Frame id={id} background={['#fbf8f3', '#e4dccf']}>
      <defs>
        <linearGradient id={id('av')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6cc0ff" />
          <stop offset="1" stopColor="#1a6fe0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="13" height="100" fill="#b98d5d" />
      <rect x="13" y="0" width="1.4" height="100" fill="#8d6a43" opacity="0.5" />
      <circle cx="56" cy="41" r="21" fill={`url(#${id('av')})`} />
      <text
        x="56"
        y="47.5"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, system-ui, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="#fff"
        letterSpacing="0.5"
      >
        AJ
      </text>
      <rect x="35" y="70" width="42" height="5.5" rx="2.75" fill="#7c7268" opacity="0.75" />
      <rect x="41" y="80" width="30" height="4.5" rx="2.25" fill="#a69c90" opacity="0.6" />
    </Frame>
  );
}

/** Projects: a leather briefcase. */
function Projects() {
  const id = useIds('projects');
  return (
    <Frame id={id} background={['#8f8cff', '#4a3fd8']}>
      <defs>
        <linearGradient id={id('case')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8a865" />
          <stop offset="1" stopColor="#a8622a" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="80" rx="30" ry="4" fill="#1d1670" opacity="0.35" />
      <path d="M40 34 v-6 q0 -4 4 -4 h12 q4 0 4 4 v6" fill="none" stroke="#5c3415" strokeWidth="4" strokeLinecap="round" />
      <rect x="20" y="33" width="60" height="44" rx="7" fill={`url(#${id('case')})`} />
      <path d="M20 40 q0 -7 7 -7 h46 q7 0 7 7 v8 h-60 z" fill="#f0bb7e" opacity="0.55" />
      <rect x="20" y="48" width="60" height="1.6" fill="#6e3c16" opacity="0.6" />
      <rect x="45" y="44" width="10" height="9" rx="2" fill="#f7d79f" stroke="#7a4a1f" strokeWidth="1.2" />
    </Frame>
  );
}

/** Timeline: a desk calendar showing today. */
function Timeline() {
  const id = useIds('timeline');
  const now = new Date();
  const day = now.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase();
  return (
    <Frame id={id} background={['#ffffff', '#ececf1']}>
      <text
        x="50"
        y="32"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', Inter, system-ui, sans-serif"
        fontSize="15"
        fontWeight="600"
        fill="#f23b30"
        letterSpacing="0.6"
      >
        {day}
      </text>
      <text
        x="50"
        y="78"
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, system-ui, sans-serif"
        fontSize="46"
        fontWeight="400"
        fill="#1c1c1e"
        letterSpacing="-1.5"
      >
        {now.getDate()}
      </text>
    </Frame>
  );
}

/** Resume: a CV on a sheet of paper. */
function Resume() {
  const id = useIds('resume');
  return (
    <Frame id={id} background={['#ffb547', '#ff7a00']}>
      <defs>
        <linearGradient id={id('paper')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f1f1f4" />
        </linearGradient>
      </defs>
      <g transform="rotate(-6 50 50)">
        <rect x="26" y="15" width="48" height="68" rx="4" fill="#7a3600" opacity="0.25" transform="translate(1.5 3)" />
        <rect x="26" y="15" width="48" height="68" rx="4" fill={`url(#${id('paper')})`} />
        <circle cx="36.5" cy="27" r="5" fill="#ff8a1f" />
        <rect x="45" y="23" width="21" height="3.6" rx="1.8" fill="#3a3a3c" />
        <rect x="45" y="29" width="14" height="2.6" rx="1.3" fill="#8e8e93" />
        {[40, 47, 54, 61, 68].map((y, i) => (
          <rect key={y} x="32" y={y} width={i % 2 ? 30 : 36} height="2.6" rx="1.3" fill="#c7c7cc" />
        ))}
      </g>
    </Frame>
  );
}

/** Writing: a lined notepad. */
function Writing() {
  const id = useIds('writing');
  return (
    <Frame id={id} background={['#fffef9', '#f6f3e8']}>
      <defs>
        <linearGradient id={id('pad')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe46b" />
          <stop offset="1" stopColor="#ffc21a" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="29" fill={`url(#${id('pad')})`} />
      <rect x="0" y="29" width="100" height="1.2" fill="#c99700" opacity="0.5" />
      <path d="M8 34 H92" stroke="#cfcfd4" strokeWidth="1.2" strokeDasharray="1.5 2.5" />
      {[46, 58, 70, 82].map((y) => (
        <rect key={y} x="12" y={y} width="76" height="1.3" fill="#d6d6db" />
      ))}
      <rect x="12" y="41" width="44" height="2.8" rx="1.4" fill="#8e8e93" opacity="0.55" />
      <rect x="12" y="53" width="58" height="2.8" rx="1.4" fill="#8e8e93" opacity="0.4" />
    </Frame>
  );
}

/** Ask Archit: a message bubble with a spark, for the AI clone. */
function Ask() {
  const id = useIds('ask');
  return (
    <Frame id={id} background={['#6bf27f', '#0bb52f']}>
      <ellipse cx="50" cy="47" rx="32" ry="26" fill="#fff" />
      <path d="M27 63 C25.5 71 20 76 14 78.5 C24.5 79 32.5 75.5 37 70 Z" fill="#fff" />
      <path
        d="M50 33 C51.4 41 54 43.6 62 45 C54 46.4 51.4 49 50 57 C48.6 49 46 46.4 38 45 C46 43.6 48.6 41 50 33 Z"
        fill="#12c13a"
      />
      <path d="M63 31 C63.5 34 64.5 35 67.5 35.5 C64.5 36 63.5 37 63 40 C62.5 37 61.5 36 58.5 35.5 C61.5 35 62.5 34 63 31 Z" fill="#12c13a" opacity="0.8" />
    </Frame>
  );
}

/** LinkedIn: the "in" mark on LinkedIn blue. */
function LinkedIn() {
  const id = useIds('linkedin');
  return (
    <Frame id={id} background={['#2a8ae8', '#0a5fb8']}>
      <circle cx="31" cy="30" r="6.4" fill="#fff" />
      <rect x="25.4" y="40" width="11.2" height="35" rx="1.4" fill="#fff" />
      <path
        d="M44.5 40 H55 V45 C57.3 41.6 61.4 39.3 66.5 39.3 C75.8 39.3 79 45.2 79 54.3 V75 H68.3 V56.8 C68.3 51.8 66.9 48.8 62.5 48.8 C57.9 48.8 55.2 51.9 55.2 56.9 V75 H44.5 Z"
        fill="#fff"
      />
    </Frame>
  );
}

/** Mail: an envelope on sky blue. */
function Mail() {
  const id = useIds('mail');
  return (
    <Frame id={id} background={['#6ccaff', '#1670ee']}>
      <defs>
        <linearGradient id={id('env')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e3ecf8" />
        </linearGradient>
      </defs>
      <rect x="17" y="30" width="66" height="44" rx="5" fill="#0b3f91" opacity="0.25" transform="translate(0 2.5)" />
      <rect x="17" y="30" width="66" height="44" rx="5" fill={`url(#${id('env')})`} />
      <path d="M19 70 L42 51 M81 70 L58 51" stroke="#c9d6e8" strokeWidth="1.6" fill="none" />
      <path d="M18.5 32.5 L50 56 L81.5 32.5" stroke="#aebfd8" strokeWidth="2.4" fill="none" strokeLinejoin="round" />
    </Frame>
  );
}

/** Trash: a frosted wire bin. No squircle, as on a Mac. */
function Trash() {
  const id = useIds('trash');
  const grooves = [0, 1, 2, 3, 4, 5, 6];
  return (
    // Drawn small, then scaled up to stand as tall as the other icons.
    <g transform="translate(50 56) scale(1.14) translate(-50 -56)">
      <defs>
        <linearGradient id={id('bin')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d4d4da" />
          <stop offset="0.45" stopColor="#fbfbfd" />
          <stop offset="1" stopColor="#c6c6cd" />
        </linearGradient>
      </defs>
      <path d="M23 26 L77 26 L71.5 88 Q71 93 66 93 L34 93 Q29 93 28.5 88 Z" fill={`url(#${id('bin')})`} />
      {grooves.map((i) => {
        const top = 29 + i * 7;
        const bottom = 34 + i * 5.3;
        return <path key={i} d={`M${top} 31 L${bottom} 88`} stroke="#a3a3ab" strokeWidth="1.1" opacity="0.55" />;
      })}
      <path d="M23 26 L77 26 L71.5 88 Q71 93 66 93 L34 93 Q29 93 28.5 88 Z" fill="none" stroke="#8e8e96" strokeWidth="0.9" />
      <ellipse cx="50" cy="26" rx="27.5" ry="5" fill="#ededf1" stroke="#8e8e96" strokeWidth="0.9" />
      <ellipse cx="50" cy="26.5" rx="23.5" ry="3.2" fill="#77777f" opacity="0.45" />
    </g>
  );
}

const ICONS: Record<AppIconId, () => React.JSX.Element> = {
  about: About,
  projects: Projects,
  timeline: Timeline,
  resume: Resume,
  writing: Writing,
  ask: Ask,
  linkedin: LinkedIn,
  mail: Mail,
  trash: Trash,
};

export function AppIcon({ app, className }: { app: AppIconId; className?: string }) {
  const Art = ICONS[app];
  return (
    <svg viewBox="0 0 100 100" className={cn('block', className)} aria-hidden focusable="false">
      <Art />
    </svg>
  );
}
