import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";

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

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "json-render-cli | Prompt-to-PNG for Agents",
  description:
    "Install one skill, route prompt requests to reusable JSON templates, and return polished PNG outputs directly from your agent workflow."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} ${outfit.variable}`}>{children}</body>
    </html>
  );
}
