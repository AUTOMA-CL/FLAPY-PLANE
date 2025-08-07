import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Configuración para Vercel - sin output standalone
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
