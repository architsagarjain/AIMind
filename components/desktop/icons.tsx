import { Briefcase, FileText, MessagesSquare, Route, User } from 'lucide-react';
import type { WindowId } from '@/types';

/** Shared window metadata: one place defines every label, icon and subtitle. */
export const WINDOW_META: Record<
  WindowId,
  { label: string; subtitle: string; Icon: typeof User; accent: string }
> = {
  about: { label: 'About', subtitle: 'Who I am', Icon: User, accent: '#6EF2FF' },
  projects: { label: 'Projects', subtitle: 'Case studies', Icon: Briefcase, accent: '#1D9BF0' },
  timeline: { label: 'Timeline', subtitle: 'The path so far', Icon: Route, accent: '#6EF2FF' },
  resume: { label: 'Resume', subtitle: 'Experience & skills', Icon: FileText, accent: '#1D9BF0' },
  ask: { label: 'Ask Archit', subtitle: 'Talk to the clone', Icon: MessagesSquare, accent: '#6EF2FF' },
};
