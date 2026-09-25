import type { ResumeEducation, ResumeExperience, SkillGroup } from '@/types';

/** Reverse-chronological, matching the CV. */
export const experience: ResumeExperience[] = [
  {
    org: 'ZenCabs',
    role: 'Head of Strategy & Growth',
    period: 'Jan 2026 to Present',
    location: 'Jammu, India',
    bullets: [
      'Built the venture from launch to 25,000+ users and a ₹3 Cr annualised run-rate in four months.',
      'Boosted monthly GMV past ₹25L across 7,500+ rides at ₹331 AOV via GTM and pricing optimisation.',
      'Converted 27% of the user base into 6,679 monthly actives through voice-of-customer loops and retention plays.',
      'Reduced ride cancellations from 40% to 6% by institutionalising 10+ SOPs across onboarding and dispatch.',
      'Drove fleet utilisation from 40% to 75% by tracking 15+ KPIs in weekly reviews with the founder.',
      'Lifted revenue per car to ₹62.5K/month by optimising utilisation, driver incentives and ride allocation.',
      'Added 10+ cars monthly to reach a 40-car fleet in three months, backed by market sizing and the expansion case.',
      'Onboarded 43 driver partners by designing recruitment, training and incentive frameworks end to end.',
    ],
  },
  {
    org: 'Shaadi Mangalam',
    role: 'Growth & Business Strategy Consultant',
    period: 'Apr 2026 to Present',
    location: 'India',
    bullets: [
      'Tripled monthly leads to 3,000 and lifted conversion from 1.4% to 4% by restructuring pricing and sales.',
      'Shipped 100+ process and product fixes across sprints by leading website redesign and digital strategy.',
    ],
  },
  {
    org: 'PwC India',
    role: 'Risk Consulting Specialist 2',
    period: 'Oct 2024 to Jan 2026',
    location: 'Gurugram, India',
    bullets: [
      'Delivered ₹6+ Cr in annual client cost savings via root-cause diagnostics and process redesign.',
      'Realised ₹2 Cr+ in savings by reengineering 25+ processes across procurement, HR and finance.',
      'Cut decision turnaround 30%+ by designing DOA matrices and approval workflows for CXOs.',
      'Saved 10,000+ consulting hours across 200+ consultants by co-developing an internal audit AI tool.',
      'Achieved 50% tool adoption in six months by leading firm-level training across 10 pilot engagements.',
      'Won ₹80L in additional business by prioritising 8+ initiatives through opportunity assessment.',
      'Executed engagements worth ₹12 Cr+ for 10+ clients including Cars24, Stryker India and PIF.',
      'Anchored DOA, internal audit and SOP development across 10 functions in two international mandates.',
      'Secured CXO buy-in on 20+ recommendations through structured leadership reporting and business reviews.',
    ],
  },
  {
    org: 'MCCS Infra Pvt. Ltd.',
    role: 'Business Transformation Consultant',
    period: 'Nov 2024 to Jul 2025',
    location: 'India',
    bullets: [
      'Unlocked ₹2 Cr in cost savings via manpower restructuring and capacity planning.',
      'Accelerated inbound enquiries 4.5x by driving the digital strategy and brand overhaul.',
      'Compressed hiring TAT 80% and halved cost per hire by redesigning hiring systems and resource allocation.',
    ],
  },
  {
    org: 'Cairros',
    role: 'Founder & Managing Partner',
    period: 'Aug 2022 to May 2024',
    location: 'Pune, India',
    bullets: [
      'Scaled the agency to seven-figure annual revenue in two years by owning strategy, sales and delivery end to end.',
      'Grew three restaurant clients 30% in revenue (7% MoM) via menu reengineering and table-turnaround operations.',
      'Raised a magazine client’s sales 3.5x, from ₹2L to ₹7L/month at 23% MoM over six months.',
      'Expanded across four sectors via rebrand, hiring and growth mandates backed by market research.',
    ],
  },
  {
    org: 'Equip9',
    role: 'Digital Marketing Executive',
    period: 'Dec 2022 to Oct 2024',
    location: 'Pune, India',
    bullets: [
      'Improved lead conversion 40% and drove 300% profit growth via segmentation-led acquisition.',
      'Generated ₹30L+ in annual revenue by owning branding and client delivery for 15+ accounts.',
      'Halved content production turnaround by building a content engine and AI workflow agents.',
    ],
  },
];

export const education: ResumeEducation[] = [
  {
    school: 'Masters’ Union',
    degree: 'PGP in Technology & Business Management',
    period: 'Jun 2026 to Present',
    location: 'Gurugram, India',
  },
  {
    school: 'Symbiosis Centre for Management Studies',
    degree: 'BBA in Accounts & Finance and Marketing Management · CGPA 8.16 (top 10%)',
    period: 'Jul 2021 to Apr 2024',
    location: 'Pune, India',
  },
  {
    school: 'Delhi Public School',
    degree: 'CBSE XII 92% (Commerce with Maths) · CBSE X 94.2%, 100/100 Science',
    period: '2007 to 2021',
    location: 'Jammu, India',
  },
];

export const skills: SkillGroup[] = [
  {
    group: 'Founder’s Office & Strategy',
    items: [
      'Problem structuring',
      'Business diagnostics',
      'GTM strategy',
      'Market sizing & expansion cases',
      'Operating cadence & KPI design',
      'Unit economics',
      'Executive communication',
    ],
  },
  {
    group: 'Consulting & Process',
    items: [
      'Root-cause diagnostics',
      'Process redesign',
      'Cost reduction',
      'Delegation-of-authority design',
      'Internal audit & SOPs',
      'Governance, risk & compliance',
      'Stakeholder management',
    ],
  },
  {
    group: 'Growth & Marketing',
    items: [
      'Performance marketing',
      'Segmentation-led acquisition',
      'Pricing strategy',
      'Retention & lifecycle',
      'Lead generation',
      'Brand positioning',
      'Marketplace growth',
    ],
  },
  {
    group: 'Operations & Technology',
    items: [
      'Two-sided marketplace ops',
      'Supply onboarding & retention',
      'Fleet utilisation',
      'Capacity & workforce planning',
      'Applied AI & workflow agents',
      'Product analytics',
    ],
  },
];
