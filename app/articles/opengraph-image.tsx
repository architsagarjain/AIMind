import { profile } from '@/content/profile';
import { OG_SIZE, ogCard } from '@/lib/og-card';

export const alt = `Articles by ${profile.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({
    kicker: 'Writing',
    title: 'How Indian businesses actually work, from someone running them',
    footer: `By ${profile.name}`,
  });
}
