/** Shared domain types for ARCHIT.AI. */

export type WindowId = 'about' | 'projects' | 'timeline' | 'resume' | 'writing' | 'ask';

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

// ------------------------------------------------------------------ articles

export type ArticleCategory = 'Framework' | 'Founder’s Office' | 'Venture Capital';

/** Figures built from HTML, so their text is real, indexable, and reflows on phones. */
export type ArticleFigure = 'lever' | 'bridges' | 'chain';

/**
 * Article body, as data rather than MDX: the pages stay fully static, the AI
 * clone can read the same source, and there is no markdown pipeline to add.
 * Text supports two inline marks: **bold** and [label](href).
 */
export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'callout'; text: string }
  | { type: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { type: 'figure'; figure: ArticleFigure; caption: string };

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  /** The on-page headline. */
  title: string;
  /** The <title>, when the headline is too long for a search result. */
  seoTitle?: string;
  /** Meta description: about 150 characters, written for the search result. */
  description: string;
  /** One or two sentences for cards and the hub. */
  excerpt: string;
  category: ArticleCategory;
  keywords: string[];
  /** ISO dates. */
  published: string;
  updated?: string;
  /** Pinned to the top of the hub. */
  featured?: boolean;
  blocks: ArticleBlock[];
  /** Rendered on the page and emitted as FAQPage structured data. */
  faq?: ArticleFaq[];
}

/** Coverage elsewhere. `featured` entries lead the press strip. */
export interface PressMention {
  outlet: string;
  title: string;
  url: string;
  /** ISO date. */
  date: string;
  summary?: string;
  featured?: boolean;
}

/** Apps Archit has built and shipped. */
export interface BuiltApp {
  name: string;
  url: string;
  tagline: string;
  builtWith: string;
}
