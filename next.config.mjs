import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// Only import and use bundle analyzer when needed to avoid production dependency issues
let withBundleAnalyzer = (config) => config;
if (process.env.ANALYZE === 'true') {
  try {
    // Use dynamic import with require for compatibility
    const bundleAnalyzer = require('@next/bundle-analyzer');
    withBundleAnalyzer = bundleAnalyzer({
      enabled: true,
    });
  } catch (error) {
    console.warn(
      'Bundle analyzer not available, skipping analysis:',
      error.message,
    );
    withBundleAnalyzer = (config) => config;
  }
}

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block', // optional, deprecated
  },
];

/** @type {import('next').NextConfig} */
const config = {
  // Removed 'output: standalone' to enable static generation for docs pages
  // while maintaining server-side functionality for other pages
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Enable SWC minification
  swcMinify: true,
  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  // Enable static generation optimization
  experimental: {
    optimizePackageImports: [
      'fumadocs-ui',
      'fumadocs-core',
      'lucide-react',
      'motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-slot',
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
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
    // Only disable image optimization during Docker builds
    unoptimized: process.env.DOCKER_BUILD === 'true',
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
      {
        protocol: 'https',
        hostname: 'images.sealos.run',
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

export default withBundleAnalyzer(withMDX(config));
