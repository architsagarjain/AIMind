import { profile } from '@/content/profile';
import { OG_SIZE, ogCard } from '@/lib/og-card';

export const alt = `${profile.name}, ${profile.product}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({ kicker: profile.name, title: profile.altTagline, footer: profile.roles.join(' · ') });
}
