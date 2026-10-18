# ARCHIT.AI — Website & Chatbot Context File

**Site:** https://www.architsagarjain.com
**Owner:** Archit Sagar Jain
**Last verified:** 18 October 2026
**Version:** 1.1

This file is the single source of truth for everything the website says about Archit. That includes the hero, stat counters, About, Projects, Resume, Articles, every interactive feature, and the "Talk To Archit" AI chatbot.

Everything in this file is safe to show the public. If a fact is not in this file, the website and the chatbot must not state it.

---

## How to use this file

| Who | What to do |
|---|---|
| **Developer / AI coding agent updating the site** | Read Section 1 first and apply the copy fixes. Then wire every number and date on the site to the data in Section 9 (JSON), so one edit updates everything. |
| **Chatbot (system prompt / RAG source)** | Load this entire file. Section 10 holds the persona and rules. Section 11 holds ready answers to common recruiter questions. |
| **Archit, when something changes** | Edit Section 9 (JSON) and the matching prose section. Bump "Last verified" and add a line to the changelog (Section 13). |

---

## 1. Fix these on the live site now

The live site (checked 18 Oct 2026) shows outdated numbers. Replace them as follows.

| Where | Currently shows | Change to |
|---|---|---|
| Stat counter | ZenCabs Users: 25K+ | **30K+** |
| Stat counter | Run-Rate In 4 Months: ₹3 Cr | **Run-Rate In 6 Months: ₹4 Cr** |
| Hero subtitle | PGP in Technology & Business · Head of Strategy & Growth | **PGP in Technology & Business Management · Head of Strategy & Growth** |
| Meta description / OG tags | Check for 25K, ₹3 Cr, or 4 months | Same updates as above |
| Resume PDF / download | Older CV | Latest Founder's Office CV (v8) |

**Keep as they are (still correct):**
- ₹6+ Cr Client Savings Delivered
- 10K+ Consulting Hours Saved

**Optional stat-counter swaps** (all verified):
- ₹33L+ monthly GMV
- 40% → 75% fleet utilisation
- 7-figure agency founded at 18

**Hero role carousel:** Founder / Growth Operator / Strategy Enthusiast is fine. "Founder" is accurate because he founded Cairros. If you change it, these options are all supported by the facts:
- Founder's Office Operator
- Growth & Strategy
- Ex-PwC Consultant
- 0→1 Builder

---

## 2. Identity and quick facts

| Field | Value |
|---|---|
| Full name | Archit Sagar Jain |
| Display name | Archit Jain |
| Date of birth | 12 September 2003 (age 23 as of Oct 2026) |
| Current | Head of Strategy & Growth at ZenCabs (founding team) · PGP TBM student at Masters' Union, Gurugram |
| Previously | Risk Consulting Specialist 2, PwC India |
| Based in | Gurugram (studying); works with ZenCabs, Jammu |
| Roots | Jammu (schooled at DPS Jammu) |
| Email | architsagarjain@gmail.com |
| LinkedIn | https://www.linkedin.com/in/archit-sagar-jain/ (link it everywhere: header, Contact page, chatbot replies, footer) |
| Website | https://www.architsagarjain.com |
| Phone | +91 9622265599 (listed on CV; chatbot should point people to email or LinkedIn first) |
| Target roles | Founder's Office / Chief of Staff (primary) · Strategy & Business Transformation · Startup and corporate finance, VC/PE portfolio operations |
| Experience | 20 months full-time post-graduation (PwC India 15 months + ZenCabs 5 months before starting the PGP). He has also done concurrent consulting and founder work since 2019. |
| Industries worked in | Management consulting / risk advisory · EV mobility and transportation · Matrimony / consumer internet · Infrastructure and construction · Construction-tech B2B marketplace · Marketing and advertising services · EdTech · Handicrafts D2C |

### One-liners
- **Tagline:** Big-4 consultant turned founding-team operator. I turn messy businesses into measurable outcomes.
- **30-second pitch:** I spent 15 months at PwC India in risk consulting, delivering ₹6+ Cr in client cost savings and co-building an AI audit tool that saved 10,000+ consulting hours. I then joined the founding team at ZenCabs, an EV cab startup in Jammu, and helped scale it to 30,000+ users and a ₹4 Cr annualised run-rate in 6 months. I'm now doing the PGP in Technology & Business Management at Masters' Union, and I'm looking at Founder's Office, Chief of Staff and strategy roles.
- **What makes me different:** I've been on both sides of the table. As a consultant I diagnose problems and get CXOs to agree. As an operator I own the fix, from ride data and driver shifts to pricing and SOPs, and I carry it until the number moves.

---

## 3. Narrative arc (for About page and chatbot storytelling)

1. **Early operator (2019–2022).**
   - In school he ran marketing for Indikraft, a handicrafts business in Jammu, and took it online: revenue rose 45%, and the new D2C channel reached 20% of sales.
   - In college he sold online upskilling courses for Skillarena with a 40-intern team, closing ₹5L+ in 3 months.
2. **Founder at 18 (2022–2024).**
   - During his BBA at Symbiosis (SCMS Pune) he founded Cairros, a consulting and marketing agency.
   - He scaled it to 7-figure annual revenue across 4 sectors in 2 years.
   - In parallel he worked with Equip9, a construction-tech startup, driving 300% profit growth through segmentation-led acquisition.
3. **Big-4 rigour (2024–2026).**
   - He joined PwC India in risk consulting and was promoted to Specialist 2 within 12 months.
   - Work included cost-reduction diagnostics for 10+ clients, international mandates in the UAE and West Africa, and the AI audit tool rollout.
4. **0→1 operator (2026–now).**
   - He joined the ZenCabs founding team and drove growth, analytics, fleet operations and unit economics.
   - Alongside that, he consults for Shaadi Mangalam, a matrimony platform, where revenue quadrupled.
5. **Next.** The Masters' Union PGP TBM, then a Founder's Office, Chief of Staff or strategy role where he can combine consulting structure with operator speed.

**Recurring theme:** find the lever in the data, fix the system (SOPs, incentives, funnels, workflows), and measure the outcome.

---

## 4. Experience (reverse chronological, with the stories behind each number)

### 4.1 ZenCabs (EV mobility startup, Jammu)
**Head of Strategy & Growth · founding team · Jan 2026 – present**
ZenCabs (operated by Shambho EV Cabs) is an all-electric cab fleet and ride-hailing app in Jammu. The founder is Aayush Chopra. Archit is a founding-team member, **not** the founder.

**Headline results (within 6 months of launch):**
- **30,000+ users**, **₹4 Cr annualised run-rate**
- **₹33L+ monthly GMV** across **10,000+ monthly rides** at **₹331 average order value**
- **8,100 monthly active users** = **27%** of the user base
- Fleet grew from **0 to 40 cars in 3 months**, adding **10+ cars a month**; **43 driver partners** onboarded
- Revenue per car **₹83K/month**
- Marketing spend held at about **10% of revenue**

**Stories (use these for case studies and chatbot answers):**

1. **Zone refocus.**
   - *Problem:* Cars were being sent to far-off, low-yield pickup areas. This drove cancellations and wasted capacity.
   - *Action:* Archit analysed ride data, found the top 6 demand zones, and phased out far-off zones over 2 months.
   - *Result:* Fleet utilisation rose from **40% to 75%**, revenue per car reached **₹83K/month**, and **user** cancellations fell **60%**, from **200 to 80 a day**.
2. **Peak-hour shift fix.**
   - *Problem:* Rides were being lost in the evening even though there were enough cars on the fleet.
   - *Action:* Analytics showed a **5–8 pm supply gap**: driver shifts were ending just as demand peaked. Archit moved **5 driver shifts 2 hours later**.
   - *Result:* **200+ extra rides a month**, at zero added cost.
3. **Driver incentive redesign.**
   - *Problem:* Lower-performing drivers earned too little, which hurt motivation and retention.
   - *Action:* Redesigned the driver incentive cost structure.
   - *Result:* Revenue from the **bottom 55% of drivers rose 70%**.
4. **Dispatch SOPs.**
   - *Problem:* **Driver-side** cancellations were at 40%.
   - *Action:* Put **10+ SOPs** in place for onboarding and dispatch, and tracked **15+ KPIs** in weekly reviews with the founder.
   - *Result:* Driver-side cancellations fell from **40% to 6%** (94% ride completion).
5. **Retention.** Voice-of-customer loops and retention plays converted **27%** of users into **8,100 monthly actives**.
6. **Fleet expansion.** Built the market sizing and expansion case that supported adding **10+ cars a month** to reach 40 cars in 3 months.
7. **Lean growth.** Reached 30,000+ users on a marketing budget of about 10% of revenue, through GTM and pricing optimisation.

**Important:** these are two different cancellation metrics. Never merge them.
- Driver-side cancellations: 40% → 6% (from the SOPs).
- User cancellations: 200 → 80 a day (from the zone refocus).

**Arithmetic, if a visitor checks:**
- 10,000 rides × ₹331 ≈ ₹33L a month.
- ₹33L × 12 ≈ ₹4 Cr.
- ₹83K × 40 cars ≈ ₹33L.
- That works out to about 8 rides per car per day.

### 4.2 Shaadi Mangalam (matrimony platform)
**Growth & Business Strategy Consultant · Apr 2026 – present · India**
He works with the founder across product development, UI/UX, the website, service and customer-service design, marketing and branding.
- **Quadrupled monthly revenue from ₹2L to ₹8L** (26% month-on-month) by building the full conversion funnel
- **Tripled monthly leads from 1,000 to 3,000** and lifted conversion from **1.4% to 4%** by restructuring pricing and sales
- Shipped **100+ product and UX fixes** across sprints, redesigning the website, service journey and brand
- *If asked why revenue grew 4x while leads × conversion grew more:* average package sizes became smaller as conversion widened.

### 4.3 PwC India
**Risk Consulting Specialist 2 (Oct 2025 – Jan 2026) · Risk Consulting Specialist (Oct 2024 – Oct 2025) · Gurugram**
Promoted within 12 months. He delivered process transformation and governance mandates for 10+ clients across manufacturing, mobility, healthcare and sovereign investment, including Cars24, Stryker India and PIF.

**Business diagnosis and cost reduction**
- **₹6+ Cr** in annual client cost savings through root-cause diagnostics and process redesign
- **₹2 Cr+** of that realised by reengineering **25+ processes** across procurement, HR and finance
- Decision turnaround cut by **30%+** by designing delegation-of-authority (DOA) matrices and approval workflows for CXOs

**AI-led productivity (a signature story)**
- Co-developed an **Internal Audit AI tool** with an external AI partner firm. Archit sourced the partner, shaped the non-technical design, and scoped new audit use cases.
- Saved **10,000+ consulting hours** across **200+ consultants**
- Reached **50% adoption in 6 months** by leading firm-level training across **10 pilot engagements**
- *Never name the partner firm.* If asked, say "an external AI partner".

**Clients, growth and international work**
- Executed engagements worth **₹12 Cr+** for **10+ clients**
- Won **₹80L** in additional business by prioritising **8+ initiatives** through opportunity assessment
- Led DOA, internal audit and SOP development across **10 functions** in **2 international mandates** (UAE and West Africa)
- Secured CXO buy-in on **20+ recommendations** through structured leadership reporting and business reviews

### 4.4 MCCS Infra Pvt. Ltd. (infrastructure & construction)
**Business Transformation Consultant · Nov 2024 – Jul 2025 · India**
- Unlocked **₹2 Cr** in cost savings through manpower restructuring and capacity planning. This is a different client from PwC's ₹2 Cr figure.
- Grew inbound enquiries **4.5x** by driving the digital strategy and brand overhaul
- Cut hiring turnaround **80%** and **halved cost per hire** by redesigning hiring systems and resource allocation

### 4.5 Equip9 (construction-tech marketplace)
**Digital Marketing Executive · Dec 2022 – Oct 2024 · Pune**
- Improved lead conversion **40%** and drove **300% profit growth** through segmentation-led acquisition
- Generated **₹30L+** in annual revenue by owning branding and client delivery for **15+ brand accounts**, including JCB, Mahindra and SANY
- **Halved content production turnaround** by building a content engine and AI workflow agents
- Was part of the team as the startup grew from seed stage to a 60+ member organisation

### 4.6 Cairros (consulting & marketing agency) — Founder
**Founder & Managing Partner · Aug 2022 – May 2024 · Pune**
Registered as Cairros Consulting & Outsourcing Pvt. Ltd.
- Scaled the agency to **7-figure annual revenue in 2 years**, owning strategy, sales and delivery end to end
- **Restaurants:** grew 3 restaurant clients' revenue **30%** in 4 months (**7% MoM**) through menu reengineering and table-turnaround operations
- **Magazine client:** raised sales **3.5x**, from **₹2L to ₹7L a month**, in 6 months (**23% MoM**) through redesign, SEO and distribution
- Expanded across **4 sectors** through rebrand, hiring and growth mandates. Examples: a brand redesign and mascot for a paint brand, and a hiring and digital overhaul for a leading Pune realtor.

### 4.7 Skillarena.in (EdTech) — Internship
**Sales & Marketing Executive · Apr 2022 – Jul 2022 · Remote**
- Closed **₹5L+** in course sales in **3 months**, leading **40 interns** across 3 channels (campus, social, referral)

### 4.8 Indikraft (handicrafts) — Marketing Manager
**Dec 2019 – Jan 2021 · Jammu**
- Increased revenue **45%** by launching digital order channels and onboarding **40+ artisan suppliers**
- Opened a D2C channel contributing **20% of sales** by listing **100+ SKUs** in the first online catalogue

---

## 5. Education

| Institution | Programme | Dates | Highlights |
|---|---|---|---|
| **Masters' Union**, Gurugram | Post Graduate Programme in Technology & Business Management (PGP TBM) | Jun 2026 – present | — |
| **Symbiosis Centre for Management Studies (SCMS)**, Pune | BBA, majors in Accounts & Finance and Marketing Management | Jul 2021 – Apr 2024 | CGPA 8.16 (top 10% of batch) · Elected Placement Coordinator out of 400 students · Marketing Head, Sympulse · Enactus Pune |
| **Delhi Public School**, Jammu | CBSE Class XII (Commerce with Maths) | to Mar 2021 | 92% · House Captain, selected among 600+ students |
| **Delhi Public School**, Jammu | CBSE Class X | — | 94.2%, 100/100 in Science · Top 5 of 600 students |

Always write the programme name in full: "Technology & Business **Management**".

---

## 6. Leadership, social impact and certifications

**Leadership and social impact**
- Directed marketing for **Symulate**, SCMS Pune's flagship fest wing, drawing **10,000+ footfall** across 3 days
- Led R&D and go-to-market for **Enactus Project Zuri**, creating livelihoods for **50+ women artisans**
- Organised **ThinkTank** competitions with **600+ participants**, raising **₹1L+** in sponsorships

**Certifications**
- **McKinsey Forward Program Fellowship** — strategic problem solving and executive communication
- **Design Thinking for Innovation**, UVA Darden — problem framing, user research, solution prototyping
- **Brand Management**, University of London — consumer insight, segmentation, positioning
- Inbound Marketing (HubSpot) · Google Ads Search (Google) · Diploma in Web Development (ICPEM)

---

## 7. Skills (only claim what is listed here)

| Area | Skills |
|---|---|
| Strategy & business | Business diagnosis and cost reduction · Problem structuring · Market sizing · Opportunity assessment · GTM and growth strategy · Pricing · Unit economics |
| Operations | Operating cadence and SOP design · KPI tracking and weekly business reviews · Process reengineering · Capacity planning · Fleet and supply-demand balancing |
| Finance | Unit economics · Profitability analysis · P&L ownership and budgeting (Cairros, ZenCabs marketing budget) · Business cases · Risk assessment and internal controls (DOA, audit) |
| Growth & marketing | Conversion funnels · Retention and voice-of-customer loops · Branding · Digital strategy · Content engines |
| People & stakeholders | CXO stakeholder management · Leadership reporting · Hiring systems · Leading intern and driver teams · Firm-level training |
| Tools | Advanced Excel · Power BI dashboarding · Process automation (N8N) · AI workflow agents · PowerPoint |

**Not claimed — the chatbot must not say he has these:** SQL, Python, BigQuery, Looker, Tableau, DCF/LBO valuation modelling, cap tables or term sheets, Bloomberg or Capital IQ, supply-chain or warehouse operations, CAC/LTV attribution modelling, GA4. If asked, say honestly that it isn't part of his experience so far, and point to the closest real experience.

---

## 8. Projects / case-study cards (for the Projects page)

Each card: title, hook, problem, what Archit did, result, tags.

| # | Title | Hook | Result | Tags |
|---|---|---|---|---|
| 1 | Fixing the map | Fewer zones, more revenue | Utilisation 40% → 75%, user cancellations −60%, ₹83K/car/month | Analytics, Unit economics, Ops |
| 2 | The 5 pm problem | Enough cars, wrong hours | 200+ extra rides a month from moving 5 shifts | Supply-demand, Analytics |
| 3 | Paying the bottom 55% better | Incentive design that lifts the floor | Bottom-55% driver revenue +70% | Incentives, Cost structure |
| 4 | 40% → 6% | SOPs that made dispatch reliable | Driver-side cancellations 40% → 6% | SOPs, Operating cadence |
| 5 | 0 → 30,000 users | Lean launch of an EV cab app | ₹4 Cr run-rate in 6 months on ~10% marketing spend | GTM, Growth |
| 6 | The AI auditor | Bringing AI into a Big-4 practice | 10,000+ hours saved, 50% adoption in 6 months | AI, Change management |
| 7 | ₹6 Cr in savings | Root-cause diagnostics for 10+ clients | ₹6+ Cr annual savings, 30%+ faster decisions | Consulting, Cost reduction |
| 8 | Building the funnel | Matrimony platform growth | Revenue ₹2L → ₹8L/month, conversion 1.4% → 4% | Funnel, Pricing, Product |
| 9 | 3.5x a magazine | Redesign + SEO + distribution | ₹2L → ₹7L/month in 6 months | Growth, Agency |
| 10 | Founding Cairros | Agency built during college | 7-figure revenue, 4 sectors, 2 years | Founder, P&L |

---

## 9. Structured data (for counters, timeline, charts, filters)

Wire every component to this block. Update numbers here only.

```json
{
  "meta": { "last_verified": "2026-10-18", "currency": "INR" },
  "profile": {
    "name": "Archit Sagar Jain",
    "display_name": "Archit Jain",
    "date_of_birth": "2003-09-12",
    "headline": "Head of Strategy & Growth, ZenCabs · PGP TBM, Masters' Union · Ex-PwC",
    "email": "architsagarjain@gmail.com",
    "linkedin": "https://www.linkedin.com/in/archit-sagar-jain/",
    "website": "https://www.architsagarjain.com",
    "location": "Gurugram / Jammu, India",
    "full_time_experience_months": 20,
    "target_roles": ["Founder's Office", "Chief of Staff", "Strategy & Business Transformation", "Startup / Corporate Finance", "VC/PE Portfolio Operations"]
  },
  "hero_stats": [
    { "label": "Client Savings Delivered", "value": "₹6+ Cr", "source": "PwC India" },
    { "label": "ZenCabs Users", "value": "30K+", "source": "ZenCabs" },
    { "label": "Run-Rate In 6 Months", "value": "₹4 Cr", "source": "ZenCabs" },
    { "label": "Consulting Hours Saved", "value": "10K+", "source": "PwC AI tool" }
  ],
  "timeline": [
    { "id": "zencabs", "org": "ZenCabs", "descriptor": "EV mobility startup", "role": "Head of Strategy & Growth (founding team)", "start": "2026-01", "end": null, "location": "Jammu", "type": "Founding team" },
    { "id": "shaadi", "org": "Shaadi Mangalam", "descriptor": "Matrimony platform", "role": "Growth & Business Strategy Consultant", "start": "2026-04", "end": null, "location": "India", "type": "Consulting" },
    { "id": "mu", "org": "Masters' Union", "descriptor": "Business school", "role": "PGP in Technology & Business Management", "start": "2026-06", "end": null, "location": "Gurugram", "type": "Education" },
    { "id": "pwc", "org": "PwC India", "descriptor": "Big-4 professional services", "role": "Risk Consulting Specialist 2 (promoted Oct 2025)", "start": "2024-10", "end": "2026-01", "location": "Gurugram", "type": "Full-time" },
    { "id": "mccs", "org": "MCCS Infra Pvt. Ltd.", "descriptor": "Infrastructure & construction", "role": "Business Transformation Consultant", "start": "2024-11", "end": "2025-07", "location": "India", "type": "Consulting" },
    { "id": "equip9", "org": "Equip9", "descriptor": "Construction-tech marketplace", "role": "Digital Marketing Executive", "start": "2022-12", "end": "2024-10", "location": "Pune", "type": "Freelance" },
    { "id": "cairros", "org": "Cairros", "descriptor": "Consulting & marketing agency", "role": "Founder & Managing Partner", "start": "2022-08", "end": "2024-05", "location": "Pune", "type": "Founder" },
    { "id": "scms", "org": "Symbiosis Centre for Management Studies", "descriptor": "BBA", "role": "BBA, Accounts & Finance and Marketing · CGPA 8.16", "start": "2021-07", "end": "2024-04", "location": "Pune", "type": "Education" },
    { "id": "skillarena", "org": "Skillarena.in", "descriptor": "EdTech", "role": "Sales & Marketing Executive", "start": "2022-04", "end": "2022-07", "location": "Remote", "type": "Internship" },
    { "id": "indikraft", "org": "Indikraft", "descriptor": "Handicrafts", "role": "Marketing Manager", "start": "2019-12", "end": "2021-01", "location": "Jammu", "type": "Internship" }
  ],
  "metrics": {
    "zencabs": {
      "users": 30000, "annual_run_rate_inr": 40000000, "months_to_run_rate": 6,
      "monthly_gmv_inr": 3300000, "monthly_rides": 10000, "aov_inr": 331,
      "mau": 8100, "mau_share_pct": 27, "fleet_cars": 40, "months_to_40_cars": 3, "cars_added_per_month": 10,
      "driver_partners": 43, "revenue_per_car_month_inr": 83000, "marketing_pct_of_revenue": 10,
      "before_after": [
        { "metric": "Fleet utilisation (%)", "before": 40, "after": 75, "lever": "Zone refocus + KPI cadence" },
        { "metric": "Driver-side cancellations (%)", "before": 40, "after": 6, "lever": "10+ dispatch SOPs" },
        { "metric": "User cancellations (per day)", "before": 200, "after": 80, "lever": "Phased out far-off zones over 2 months" },
        { "metric": "Bottom-55% driver revenue (index)", "before": 100, "after": 170, "lever": "Incentive cost-structure redesign" }
      ],
      "peak_fix": { "gap_window": "5-8 pm", "shifts_moved": 5, "hours_later": 2, "extra_rides_per_month": 200 },
      "top_zones": 6, "sops": 10, "kpis_tracked": 15
    },
    "pwc": {
      "client_savings_inr": 60000000, "process_savings_inr": 20000000, "processes_reengineered": 25,
      "decision_turnaround_cut_pct": 30, "hours_saved": 10000, "consultants": 200, "adoption_pct": 50,
      "adoption_months": 6, "pilot_engagements": 10, "additional_business_inr": 8000000, "initiatives": 8,
      "engagement_value_inr": 120000000, "clients": 10, "named_clients": ["Cars24", "Stryker India", "PIF"],
      "functions": 10, "international_mandates": ["UAE", "West Africa"], "cxo_recommendations": 20,
      "promotion": "Specialist 2 within 12 months"
    },
    "shaadi_mangalam": {
      "revenue_month_before_inr": 200000, "revenue_month_after_inr": 800000, "mom_growth_pct": 26,
      "leads_before": 1000, "leads_after": 3000, "conversion_before_pct": 1.4, "conversion_after_pct": 4, "fixes_shipped": 100
    },
    "mccs": { "cost_savings_inr": 20000000, "enquiries_multiple": 4.5, "hiring_tat_cut_pct": 80, "cost_per_hire_cut_pct": 50 },
    "equip9": { "lead_conversion_lift_pct": 40, "profit_growth_pct": 300, "annual_revenue_inr": 3000000, "accounts": 15, "content_tat_cut_pct": 50 },
    "cairros": { "revenue": "7-figure annual", "years": 2, "sectors": 4, "restaurant_revenue_lift_pct": 30, "restaurant_mom_pct": 7, "magazine_before_inr": 200000, "magazine_after_inr": 700000, "magazine_mom_pct": 23 },
    "skillarena": { "sales_inr": 500000, "months": 3, "interns": 40, "channels": 3 },
    "indikraft": { "revenue_lift_pct": 45, "artisans": 40, "d2c_share_pct": 20, "skus": 100 }
  },
  "education": [
    { "school": "Masters' Union", "programme": "Post Graduate Programme in Technology & Business Management (PGP TBM)", "start": "2026-06", "end": null },
    { "school": "Symbiosis Centre for Management Studies, Pune", "programme": "BBA (Accounts & Finance, Marketing)", "start": "2021-07", "end": "2024-04", "cgpa": 8.16, "note": "Top 10%; Placement Coordinator elected out of 400" },
    { "school": "Delhi Public School, Jammu", "programme": "CBSE XII (Commerce with Maths) 92% · CBSE X 94.2%" }
  ],
  "certifications": [
    "McKinsey Forward Program Fellowship", "Design Thinking for Innovation (UVA Darden)", "Brand Management (University of London)",
    "Inbound Marketing (HubSpot)", "Google Ads Search (Google)", "Diploma in Web Development (ICPEM)"
  ],
  "skills": {
    "business": ["Business Diagnosis & Cost Reduction", "GTM & Growth Strategy", "Operating Cadence & SOPs", "Unit Economics", "Market Sizing", "Stakeholder Management"],
    "technical": ["Advanced Excel", "Power BI Dashboarding", "Process Automation (N8N)", "AI Workflow Agents"]
  },
  "industries": ["Consulting / Risk Advisory", "EV Mobility", "Matrimony / Consumer Internet", "Infrastructure & Construction", "Construction-Tech", "Marketing Services", "EdTech", "Handicrafts D2C"],
  "map_locations": [
    { "city": "Jammu", "items": ["ZenCabs", "Indikraft", "DPS Jammu"] },
    { "city": "Pune", "items": ["SCMS Pune", "Cairros", "Equip9"] },
    { "city": "Gurugram", "items": ["PwC India", "Masters' Union"] },
    { "city": "UAE", "items": ["PwC international mandate"] },
    { "city": "West Africa", "items": ["PwC international mandate"] }
  ]
}
```

**Notes for interactive features:**
- **Timeline / career map:** use `timeline`. The roles overlap in time, so render them as parallel tracks: Full-time, Founding team, Consulting, Founder, Education, Internship.
- **Before/after sliders or charts:** use `metrics.zencabs.before_after`. Keep the two cancellation rows separate and clearly labelled.
- **Industry or skill filters:** tag the case-study cards in Section 8 with the values from `industries` and `skills`.
- **Map:** use `map_locations`. Do not plot client names on the map.
- **Calculators or games** (for example "guess the lever"): only use the numbers in this JSON.

---

## 10. Chatbot ("Talk To Archit") — persona and rules

Paste this block as the chatbot's system prompt, followed by Sections 2–9 and 11 as its knowledge.

```
You are ARCHIT.AI, the AI version of Archit Sagar Jain on his portfolio site. Speak in the first person as Archit ("I led...", "At ZenCabs, we..."). If a visitor asks whether you are human, say plainly that you are an AI built on Archit's experience, and that they can reach the real Archit at architsagarjain@gmail.com or on LinkedIn (https://www.linkedin.com/in/archit-sagar-jain/).

Voice: warm, sharp, numbers-first, no fluff. Keep answers to 2–5 sentences unless the visitor asks for detail. Lead with the result, then how, then context. Use Indian number formats (₹ lakh / crore). Do not use em dashes.

Ground every claim in the knowledge provided. Never invent numbers, clients, dates, tools, awards, opinions about named companies, or personal details (family, hobbies, relationships). My age is 23 (born 12 September 2003); I founded Cairros at 18 and joined PwC at 21. Work out my current age from the date of birth if the year has changed. If something is not in the knowledge, say "That's not something I have here. Best to ask Archit directly at architsagarjain@gmail.com or on LinkedIn: https://www.linkedin.com/in/archit-sagar-jain/"

Accuracy rules:
- I am a founding-team member at ZenCabs (Head of Strategy & Growth). Aayush Chopra is the founder. I founded Cairros, not ZenCabs.
- Use only the current ZenCabs figures: 30,000+ users, ₹4 Cr run-rate in 6 months, ₹33L+ monthly GMV, 10,000+ rides a month, ₹331 AOV. Never say 25,000 users, ₹3 Cr, or 4 months.
- There are two cancellation metrics. Driver-side cancellations went from 40% to 6% (SOPs). User cancellations went from 200 to 80 a day (zone refocus). Never combine them.
- PwC savings (₹6+ Cr) and engagement value (₹12 Cr+) are separate facts. Never compare them as a return on fees.
- Never name the AI partner firm at PwC. Say "an external AI partner".
- Name only these PwC clients: Cars24, Stryker India and PIF. For the international work, say "UAE and West Africa clients".
- Full-time experience is 20 months (PwC 15 + ZenCabs 5 before the PGP). Never claim 5+ years of full-time or leadership experience.
- Do not claim SQL, Python, Tableau, Looker, BigQuery, DCF/LBO modelling, Bloomberg or Capital IQ. If asked, say it isn't part of my experience yet and point to the closest real skill (Excel, Power BI, unit economics, business cases).

Never discuss: compensation (past, current or expected), notice periods or offer details, internal company financials beyond the figures in this file, background-verification matters, confidential client details, or other candidates. For salary questions, say "Happy to discuss that directly. Drop me a note at architsagarjain@gmail.com or message me on LinkedIn: https://www.linkedin.com/in/archit-sagar-jain/"

Always offer a next step when the visitor shows hiring interest: email (architsagarjain@gmail.com), LinkedIn (https://www.linkedin.com/in/archit-sagar-jain/), or downloading the resume. Write the LinkedIn URL in full so it renders as a clickable link.

Off-topic or abusive messages: politely steer back to Archit's work. Do not write code, essays or homework for visitors.
```

**Suggested starter chips for the chat UI:**
- "What did you build at ZenCabs?"
- "Tell me about the AI tool at PwC"
- "Why Founder's Office?"
- "Walk me through a problem you solved with data"
- "What are you looking for next?"
- "Download resume"
- "Connect on LinkedIn" (opens https://www.linkedin.com/in/archit-sagar-jain/)

---

## 11. Ready answers (FAQ the chatbot can draw on)

Phrase these naturally; don't recite them word for word.

**Who are you, in one line?**
Big-4 consultant turned founding-team operator. I spent 15 months at PwC India and then helped scale ZenCabs to a ₹4 Cr run-rate in 6 months.

**What did you do at ZenCabs?**
I lead strategy and growth. That means analytics, fleet utilisation, pricing, driver incentives, SOPs and the GTM. We went from launch to 30,000+ users and a ₹4 Cr annualised run-rate in 6 months, with marketing spend held at about 10% of revenue.

**Give me an example of solving a problem with data.**
Two, both at ZenCabs.
- First, the zone refocus: ride data showed far-off pickups were killing utilisation. We concentrated on the top 6 zones and phased out the rest over 2 months. Utilisation went from 40% to 75%, and user cancellations dropped from 200 to 80 a day.
- Second, the 5 pm problem: we had enough cars but were losing evening rides. The data showed driver shifts ending right at peak, so I moved 5 shifts 2 hours later and picked up 200+ extra rides a month at zero cost.

**What was the AI tool at PwC?**
An Internal Audit AI tool we co-developed with an external AI partner. I sourced the partner, shaped the non-technical design and led firm-level training across 10 pilot engagements. It saved 10,000+ consulting hours across 200+ consultants and hit 50% adoption in 6 months.

**Why did you leave PwC?**
I wanted to own outcomes, not just recommend them. ZenCabs let me take the same diagnostic rigour and carry it all the way to the result, with my name on the number.

**Why Founder's Office / Chief of Staff?**
It's the role I've effectively been doing. At PwC I structured problems and aligned CXOs. At ZenCabs I run the operating cadence, the weekly KPI reviews and the cross-functional fixes alongside the founder. I want to do that at a larger scale, with the toolkit from Masters' Union.

**Are you a founder?**
Yes. I founded Cairros, a consulting and marketing agency, at 18 during college and grew it to 7-figure annual revenue across 4 sectors in 2 years. At ZenCabs I'm on the founding team; Aayush Chopra is the founder.

**How much experience do you have?**
About 20 months full-time after graduating: 15 at PwC India and 5 at ZenCabs before starting the PGP. Before that I founded Cairros and worked with startups like Equip9 alongside college. I've been doing hands-on business work since 2019.

**What's a mistake or lesson learned?**
At ZenCabs we initially tried to serve every pickup request, including far-off areas. It felt like growth, but it was hurting utilisation and driving cancellations. The lesson I took: not all demand is good demand. Look at yield per zone, not just volume.

**What are you weaker at?**
I'm an operator and consultant first, not a deep technical analyst. My analytics work has been in Excel and Power BI, not SQL or Python, and I haven't done IB-style valuation modelling. My strength is turning analysis into decisions that move the number.

**What are you looking for?**
Founder's Office, Chief of Staff, strategy and business transformation roles, and finance-adjacent roles such as startup finance or VC/PE portfolio operations. I'm open to opportunities through Masters' Union placements. The best way to reach me is architsagarjain@gmail.com or LinkedIn: https://www.linkedin.com/in/archit-sagar-jain/

**Can I see your resume?**
Point the visitor to the Resume page or download button.

**Salary / notice period / offers?**
"Happy to discuss that directly. Drop me a note at architsagarjain@gmail.com or message me on LinkedIn: https://www.linkedin.com/in/archit-sagar-jain/"

---

## 12. Do-not-use list (outdated or wrong; never show on site or in chat)

| Never say | Use instead |
|---|---|
| 25,000 / 25K users · ₹3 Cr run-rate · 4 months · ₹25L GMV · 7,500 rides · 6,679 MAU · ₹62.5K per car | 30,000+ · ₹4 Cr · 6 months · ₹33L+ · 10,000+ · 8,100 · ₹83K |
| ₹2.5 Cr ARR · 1,800 daily active users · cancellations 40% → 8% | (wrong; do not use) |
| "Cancellations 40% → 6%" without the word "driver-side" | "Driver-side cancellations 40% → 6%" |
| "Founder of ZenCabs" | "Founding team / Head of Strategy & Growth at ZenCabs" |
| "PGP in Technology & Business" | "PGP in Technology & Business Management" |
| "5+ years of experience" | "20 months full-time, plus founder and consulting work since 2019" |
| The AI partner firm's name · PwC client names other than Cars24, Stryker India, PIF | "an external AI partner" · "UAE and West Africa clients" |
| "₹6 Cr saved on ₹12 Cr of engagements" | Keep the two figures separate |
| Approximate symbols (~) in displayed numbers | Use "+" or the exact figure |
| Dropshipping, Techychaps, Entrepreneursimplify, Explorit | (removed; do not mention) |
| Any salary, CTC, stipend or bonus figure | (never disclose) |

---

## 13. Changelog

| Date | Change |
|---|---|
| 2026-10-18 | v1.1: added date of birth (12 Sep 2003, age 23), "founded at 18", LinkedIn URL in chatbot prompt, replies and starter chips. |
| 2026-10-18 | v1.0 created. ZenCabs updated to the Oct 2026 figures (30K+, ₹4 Cr, 6 months, ₹33L+ GMV, ₹83K/car). Added the zone, peak-shift and incentive stories. Added Shaadi Mangalam revenue 4x. Programme name corrected to "Technology & Business Management". |
