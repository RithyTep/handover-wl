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
  },
};

module.exports = nextConfig;
