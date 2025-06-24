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
      {
        source: '/education',
        destination: '/solutions/industries/education',
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
      {
        protocol: 'https',
        hostname: 'images.tryfastgpt.ai',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withMDX(config);
