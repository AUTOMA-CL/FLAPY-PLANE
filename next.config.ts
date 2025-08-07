import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Optimización para Vercel
  output: 'standalone',
};

export default nextConfig;
