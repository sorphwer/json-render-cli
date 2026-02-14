import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geist = Geist({
  variable: "--font-sans-alt",
  subsets: ["latin"],
  display: "swap"
});

const geistMono = Geist_Mono({
  variable: "--font-mono-alt",
  subsets: ["latin"],
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
      <body className={`${geist.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
