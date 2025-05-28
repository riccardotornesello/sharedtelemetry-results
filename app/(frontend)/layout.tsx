import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { Footer } from "@/components/footer";

dayjs.extend(duration);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SharedTelemetry Results",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Shared Telemetry" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <div className="flex-1">{children}</div>

        <Footer />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
