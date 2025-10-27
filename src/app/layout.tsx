import type { Metadata } from "next";
import "./globals.css";
import ServiceWorkerRegister from "./sw-register";

export const metadata: Metadata = {
  title: "Flappy Plane Game",
  description: "Juego web tipo Flappy Bird con temática de avión optimizado para móviles",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Flappy Plane",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Resource Hints - Preconnect a Google Apps Script */}
        <link rel="preconnect" href="https://script.google.com" />
        <link rel="dns-prefetch" href="https://script.google.com" />

        {/* Preload de assets críticos del juego */}
        <link
          rel="preload"
          href="/images/background.webp"
          as="image"
          type="image/webp"
        />
        <link
          rel="preload"
          href="/images/plane.webp"
          as="image"
          type="image/webp"
        />
        <link
          rel="preload"
          href="/images/logo.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body className="antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
