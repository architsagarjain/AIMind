import type { ResumeEducation, ResumeExperience, SkillGroup } from '@/types';

/** Reverse-chronological, matching the CV. */
export const experience: ResumeExperience[] = [
  {
    org: 'ZenCabs',
    role: 'Head of Strategy & Growth (founding team)',
    period: 'Jan 2026 to Present',
    location: 'Jammu, India',
    bullets: [
      'Helped scale an EV cab startup from launch to 30,000+ users and a ₹4 Cr annualised run-rate in six months.',
      'Drove monthly GMV past ₹33L across 10,000+ rides at ₹331 AOV via GTM and pricing optimisation, with marketing held at about 10% of revenue.',
      'Lifted fleet utilisation from 40% to 75% and revenue per car to ₹83K/month by refocusing on the top 6 demand zones; user cancellations fell 60%, from 200 to 80 a day.',
      'Added 200+ rides a month at zero cost by moving 5 driver shifts 2 hours later to close a 5 to 8 pm supply gap.',
      'Cut driver-side cancellations from 40% to 6% with 10+ onboarding and dispatch SOPs, tracked against 15+ KPIs in weekly reviews with the founder.',
      'Raised revenue from the bottom 55% of drivers by 70% by redesigning the driver incentive cost structure.',
      'Converted 27% of users into 8,100 monthly actives through voice-of-customer loops and retention plays.',
      'Grew the fleet from 0 to 40 cars in three months, adding 10+ a month on the market sizing and expansion case, and onboarded 43 driver partners.',
    ],
  },
  {
    org: 'Shaadi Mangalam',
    role: 'Growth & Business Strategy Consultant',
    period: 'Apr 2026 to Present',
    location: 'India',
    bullets: [
      'Quadrupled monthly revenue from ₹2L to ₹8L (26% month on month) by building the full conversion funnel for a matrimony platform.',
      'Tripled monthly leads from 1,000 to 3,000 and lifted conversion from 1.4% to 4% by restructuring pricing and sales.',
      'Shipped 100+ product and UX fixes across sprints, redesigning the website, service journey and brand.',
    ],
  },
  {
    org: 'PwC India',
    role: 'Risk Consulting Specialist 2 (promoted within 12 months)',
    period: 'Oct 2024 to Jan 2026',
    location: 'Gurugram, India',
    bullets: [
      'Delivered ₹6+ Cr in annual client cost savings via root-cause diagnostics and process redesign.',
      'Realised ₹2 Cr+ in savings by reengineering 25+ processes across procurement, HR and finance.',
      'Cut decision turnaround 30%+ by designing DOA matrices and approval workflows for CXOs.',
      'Saved 10,000+ consulting hours across 200+ consultants by co-developing an internal audit AI tool with an external AI partner.',
      'Achieved 50% tool adoption in six months by leading firm-level training across 10 pilot engagements.',
      'Won ₹80L in additional business by prioritising 8+ initiatives through opportunity assessment.',
      'Executed engagements worth ₹12 Cr+ for 10+ clients including Cars24, Stryker India and PIF.',
      'Led DOA, internal audit and SOP development across 10 functions in two international mandates (UAE and West Africa).',
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
    org: 'Skillarena.in',
    role: 'Sales & Marketing Executive (internship)',
    period: 'Apr 2022 to Jul 2022',
    location: 'Remote',
    bullets: ['Closed ₹5L+ in course sales in three months, leading 40 interns across campus, social and referral channels.'],
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
      'Owned delivery for brand accounts including JCB, Mahindra and SANY as the startup grew from seed stage to a 60+ member team.',
    ],
  },
  {
    org: 'Indikraft',
    role: 'Marketing Manager',
    period: 'Dec 2019 to Jan 2021',
    location: 'Jammu, India',
    bullets: [
      'Increased revenue 45% by launching digital order channels and onboarding 40+ artisan suppliers.',
      'Opened a D2C channel contributing 20% of sales by listing 100+ SKUs in the first online catalogue.',
    ],
  },
];

/** Leadership and social impact, from the context file. */
export const leadership: string[] = [
  'Directed marketing for Symulate, SCMS Pune’s flagship fest wing, drawing 10,000+ footfall across three days.',
  'Led R&D and go-to-market for Enactus Project Zuri, creating livelihoods for 50+ women artisans.',
  'Organised ThinkTank competitions with 600+ participants, raising ₹1L+ in sponsorships.',
];

export const certifications: string[] = [
  'McKinsey Forward Program Fellowship',
  'Design Thinking for Innovation, UVA Darden',
  'Brand Management, University of London',
  'Inbound Marketing (HubSpot)',
  'Google Ads Search (Google)',
  'Diploma in Web Development (ICPEM)',
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
    degree: 'BBA in Accounts & Finance and Marketing Management · CGPA 8.16 (top 10%) · Placement Coordinator, elected out of 400',
    period: 'Jul 2021 to Apr 2024',
    location: 'Pune, India',
  },
  {
    school: 'Delhi Public School',
    degree: 'CBSE XII 92% (Commerce with Maths), House Captain · CBSE X 94.2%, 100/100 Science, top 5 of 600',
    period: '2007 to 2021',
    location: 'Jammu, India',
  },
];

/** Exactly the skills the context file claims (section 7), and no others. */
export const skills: SkillGroup[] = [
  {
    group: 'Strategy & Business',
    items: [
      'Business diagnosis & cost reduction',
      'Problem structuring',
      'Market sizing',
      'Opportunity assessment',
      'GTM & growth strategy',
      'Pricing',
      'Unit economics',
    ],
  },
  {
    group: 'Operations',
    items: [
      'Operating cadence & SOP design',
      'KPI tracking & weekly business reviews',
      'Process reengineering',
      'Capacity planning',
      'Fleet & supply-demand balancing',
    ],
  },
  {
    group: 'Finance',
    items: [
      'Profitability analysis',
      'P&L ownership & budgeting',
      'Business cases',
      'Risk assessment & internal controls (DOA, audit)',
    ],
  },
  {
    group: 'Growth & Marketing',
    items: ['Conversion funnels', 'Retention & voice-of-customer loops', 'Branding', 'Digital strategy', 'Content engines'],
  },
  {
    group: 'People & Stakeholders',
    items: [
      'CXO stakeholder management',
      'Leadership reporting',
      'Hiring systems',
      'Leading intern & driver teams',
      'Firm-level training',
    ],
  },
  {
    group: 'Tools',
    items: ['Advanced Excel', 'Power BI dashboarding', 'Process automation (N8N)', 'AI workflow agents', 'PowerPoint'],
  },
];
