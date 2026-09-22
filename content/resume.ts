import type { ResumeEducation, ResumeExperience, SkillGroup } from '@/types';

export const experience: ResumeExperience[] = [
  {
    org: "Masters' Union",
    role: 'PGP in Technology & Business (Current)',
    period: 'Present',
    location: 'Gurugram, India',
    bullets: [
      'Pursuing a practitioner-taught programme at the intersection of technology and business.',
      'Focused on product, applied AI and the technical side of building — complementing a growth and strategy background.',
    ],
  },
  {
    org: 'ZenCabs',
    role: 'Head of Strategy & Growth',
    period: '2023 — 2024',
    location: 'Jammu, India',
    bullets: [
      'Owned strategy and growth for a two-sided mobility marketplace; platform crossed 20,000+ users.',
      'Built the driver sourcing, verification and retention motion that supplied the demand side.',
      'Ran on-ground and digital acquisition in parallel, concentrating growth route-by-route for density.',
      'Established the operating cadence — supply/demand tracking, cancellation review and incentive tuning.',
    ],
  },
  {
    org: 'Cairros Consulting',
    role: 'Founder',
    period: '2022 — Present',
    location: 'India',
    bullets: [
      'Founded an execution-led growth, marketing and strategy consultancy; served 7+ clients.',
      'Delivered positioning, brand transformation and digital funnel builds for founder-led businesses.',
      'Worked hands-on inside client teams rather than advisory-only, leaving behind a running growth function.',
    ],
  },
  {
    org: 'PwC India',
    role: 'Risk Consultant',
    period: '1 Year',
    location: 'India',
    bullets: [
      'Delivered governance, risk and compliance engagements for enterprise clients.',
      'Mapped business processes, tested control design and operation, and documented remediation.',
      'Presented findings to client stakeholders and built the structured problem-solving habit used since.',
    ],
  },
];

export const education: ResumeEducation[] = [
  {
    school: "Masters' Union",
    degree: 'PGP, Technology & Business',
    period: 'Present',
    location: 'Gurugram, India',
  },
  {
    school: 'Symbiosis, Pune',
    degree: 'BBA, Marketing & Finance',
    period: '2019 — 2022',
    location: 'Pune, India',
  },
];

export const skills: SkillGroup[] = [
  {
    group: 'Growth & Marketing',
    items: [
      'Go-to-market strategy',
      'Performance marketing',
      'Brand positioning',
      'Lead generation',
      'Retention & lifecycle',
      'Marketplace growth',
    ],
  },
  {
    group: 'Strategy & Consulting',
    items: [
      'Structured problem solving',
      'Business diagnostics',
      'Governance, risk & compliance',
      'Process mapping',
      'Stakeholder management',
      'Unit economics',
    ],
  },
  {
    group: 'Operations & Product',
    items: [
      'Two-sided marketplace ops',
      'Supply onboarding & retention',
      'KPI design & review cadence',
      'Product discovery',
      'Founder-mode execution',
    ],
  },
  {
    group: 'Technology',
    items: ['Applied AI', 'Product analytics', 'No-code & automation', 'AI-assisted building'],
  },
];
