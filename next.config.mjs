import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // Removed 'output: standalone' to enable static generation for docs pages
  // while maintaining server-side functionality for other pages
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Enable static generation optimization
  experimental: {
    optimizePackageImports: ['fumadocs-ui', 'fumadocs-core'],
  },
  async redirects() {
    return [
      {
        source: '/devbox',
        destination: '/products/devbox',
        permanent: true,
      },
    ];
  },
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oss.laf.run',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
};

export default withMDX(config);
