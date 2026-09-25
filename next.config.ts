import type { NextConfig } from 'next';
import { RETIRED_SLUGS } from './content/articles/retired';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // three.js ships ESM-only submodules that benefit from Next's optimizer.
  transpilePackages: ['three'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@react-three/drei'],
  },
  async redirects() {
    return Object.entries(RETIRED_SLUGS).map(([from, to]) => ({
      source: `/articles/${from}`,
      destination: `/articles/${to}`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        // The character model is content-stable: it only changes when the file
        // is replaced, and Next serves /public without a long cache by default.
        source: '/models/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
