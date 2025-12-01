import type React from "react";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";

import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "The Entropy Browser | Dreamware 2025",
  description:
    "A digital journal where memories cannot be kept. Watch your words fall into oblivion.",
  keywords: [
    "entropy",
    "memories",
    "loss",
    "impermanence",
    "generative art",
    "physics",
    "dreamware",
  ],
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
