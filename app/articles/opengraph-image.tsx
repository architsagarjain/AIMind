import { profile } from '@/content/profile';
import { OG_SIZE, ogCard } from '@/lib/og-card';

export const alt = `Articles by ${profile.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({
    kicker: 'Articles',
    title: 'Founder’s Office, Chief of Staff and venture capital, from an operator',
    footer: `By ${profile.name}`,
  });
}
