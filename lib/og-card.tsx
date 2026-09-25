import { ImageResponse } from 'next/og';

/**
 * The 1200×630 share card used for the site and for each article. Drawn with
 * next/og, so it is generated at build time from the same content as the page
 * and never goes stale.
 */
export const OG_SIZE = { width: 1200, height: 630 };

export function ogCard({ kicker, title, footer }: { kicker: string; title: string; footer: string }) {
  const size = title.length > 55 ? 58 : title.length > 40 ? 66 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'radial-gradient(circle at 85% 10%, #0e3a4a 0%, #050816 55%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 800, letterSpacing: 6 }}>
          ARCHIT.AI
          <div style={{ width: 12, height: 12, borderRadius: 12, background: '#6ef2ff', marginLeft: 10 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 4, color: '#6ef2ff', textTransform: 'uppercase' }}>
            {kicker}
          </div>
          <div style={{ marginTop: 20, fontSize: size, fontWeight: 800, lineHeight: 1.1, maxWidth: 1040 }}>{title}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 28, color: '#9ca3af' }}>{footer}</div>
      </div>
    ),
    OG_SIZE,
  );
}
