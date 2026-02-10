import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans-alt",
  subsets: ["latin"],
  display: "swap"
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono-alt",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "json-render-cli Skills Showcase",
  description:
    "Interactive landing page for json-render-cli skills with a fake chat showcase, prompt draw flow, and theme-aware static previews."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>{children}</body>
    </html>
  );
}
