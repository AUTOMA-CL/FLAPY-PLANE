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
      <body className="antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
