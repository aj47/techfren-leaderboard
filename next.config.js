/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',  // Static HTML export for Cloudflare Pages
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Recommended for static hosting
};

module.exports = nextConfig;
