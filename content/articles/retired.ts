/**
 * Articles that were published and then replaced. Each old path redirects
 * permanently to its closest successor (see next.config.ts), so a link or a
 * search result pointing at one still lands somewhere useful.
 */
export const RETIRED_SLUGS: Record<string, string> = {
  'what-is-a-founders-office-role': 'weekly-operating-review-kpi-cadence',
  'founders-office-vs-chief-of-staff': 'weekly-operating-review-kpi-cadence',
  'how-to-get-a-founders-office-job': 'where-margin-leaks-indian-companies',
  'weekly-operating-cadence-founders-office': 'weekly-operating-review-kpi-cadence',
  'first-90-days-founders-office': 'weekly-operating-review-kpi-cadence',
  'how-to-break-into-venture-capital-india': 'tier-2-india-investment-thesis',
  'founders-office-or-venture-capital': 'tier-2-india-investment-thesis',
  'marketplace-startup-due-diligence-checklist': 'marketplace-metrics-due-diligence',
};
