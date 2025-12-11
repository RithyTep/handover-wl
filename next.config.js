/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable cacheComponents for "use cache" directive (Next.js 16)
  cacheComponents: true,

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Cache images for 1 year (pixel art assets don't change often)
    minimumCacheTTL: 31536000,
  },
};

module.exports = nextConfig;
