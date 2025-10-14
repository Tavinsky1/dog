// Load generated redirects for legacy city routes
// Run `node scripts/generate-redirects.cjs` to regenerate redirects.generated.cjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const redirectsFromGenerated = require('./redirects.generated.cjs');

export default {
  // Legacy city redirects (e.g., /berlin → /countries/germany/berlin)
  async redirects() {
    return redirectsFromGenerated;
  },

  // Performance optimizations
  experimental: {
    // Enable experimental features for better performance
    optimizePackageImports: ['lucide-react', 'leaflet', 'react-leaflet'],
  },

  // Turbopack configuration
  turbopack: {
    rules: {
      '*.ts': ['typescript'],
      '*.tsx': ['typescript'],
    },
  },

  // Webpack configuration for custom paths
  webpack: (config) => {
    config.resolve.alias['@/lib'] = './lib';
    return config;
  },

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },

  // Compression
  compress: true,

  // Headers for caching
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer in development
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    }

    return config
  },

  // Output optimization
  output: 'standalone',

  // Power optimizations for static export
  trailingSlash: false,
  poweredByHeader: false,
};
