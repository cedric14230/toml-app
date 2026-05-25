import type { Metadata } from "next";
import "./globals.css";
import "@/components/toml-ds/toml.css";

export const metadata: Metadata = {
  title: "TOML — Top On My List",
  description: "Créez et partagez vos wishlists avec TOML, l'application Top On My List.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TOML",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Sora:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <div
          className="toml-ds"
          style={{ overflow: 'visible', position: 'static', background: 'transparent' }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
