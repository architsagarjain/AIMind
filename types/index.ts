/** Shared domain types for ARCHIT.AI. */

export type WindowId = 'about' | 'projects' | 'timeline' | 'resume' | 'ask';

export interface DesktopWindowState {
  id: WindowId;
  /** Open windows render; closed ones unmount to keep the DOM light. */
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  /** Top-left position in px, relative to the desktop surface. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Paint order. Highest z is focused. */
  z: number;
}

export interface ProjectCaseStudy {
  challenge: string;
  strategy: string[];
  execution: string[];
  results: string[];
  lessons: string[];
}

export interface Project {
  slug: string;
  name: string;
  subtitle: string;
  role: string;
  period: string;
  /** Short marketing line shown on the card face. */
  summary: string;
  tags: string[];
  /** Headline numbers. Only verified figures belong here. */
  metrics: { label: string; value: string }[];
  accent: string;
  caseStudy: ProjectCaseStudy;
}

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  org: string;
  location: string;
  kind: 'education' | 'work' | 'venture';
  summary: string;
  details: string[];
}

export interface ResumeExperience {
  org: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface ResumeEducation {
  school: string;
  degree: string;
  period: string;
  location: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}
