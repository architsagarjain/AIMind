import { Briefcase, FileText, MessagesSquare, Route, User } from 'lucide-react';
import type { WindowId } from '@/types';

/** Shared window metadata: one place defines every label, icon and subtitle. */
/**
 * Accents are saturated rather than the brand cyan: the desktop is a light
 * surface, and #6EF2FF on white has almost no contrast. These sit in the same
 * family as the macOS system colours, so a dock of them reads as apps.
 */
export const WINDOW_META: Record<
  WindowId,
  { label: string; subtitle: string; Icon: typeof User; accent: string }
> = {
  about: { label: 'About', subtitle: 'Who I am', Icon: User, accent: '#0A84FF' },
  projects: { label: 'Projects', subtitle: 'Case studies', Icon: Briefcase, accent: '#5E5CE6' },
  timeline: { label: 'Timeline', subtitle: 'The path so far', Icon: Route, accent: '#FF9F0A' },
  resume: { label: 'Resume', subtitle: 'Experience & skills', Icon: FileText, accent: '#0E9F9F' },
  ask: { label: 'Ask Archit', subtitle: 'Talk to the clone', Icon: MessagesSquare, accent: '#BF5AF2' },
};

/** macOS paints every folder the same blue; only apps vary. */
export const FOLDER_BLUE = '#3E9BE9';
