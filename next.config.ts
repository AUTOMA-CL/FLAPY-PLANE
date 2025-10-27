import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// Configuración de Serwist
const withSerwist = withSerwistInit({
  // Solo generar SW en producción (deshabilitado en desarrollo)
  disable: process.env.NODE_ENV === "development",
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Opciones de precaching
  additionalPrecacheEntries: [
    // Assets críticos que siempre deben estar en caché
    { url: "/images/background.webp", revision: "v1" },
    { url: "/images/logo.webp", revision: "v1" },
    { url: "/images/plane.webp", revision: "v1" },
  ],
});

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Configuración para Vercel
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

// Exportar configuración con Serwist wrapper
export default withSerwist(nextConfig);
