/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
  // Ensure the base path is set correctly for Vercel
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
};

module.exports = nextConfig; 