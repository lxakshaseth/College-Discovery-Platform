import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareFloatingBar } from "@/components/college/CompareFloatingBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusPulse — College Discovery, Side-by-Side Comparison & Rank Predictor",
  description:
    "Explore 50+ top Indian engineering, science & management colleges. Compare fees, placements, ratings, NIRF rankings, and predict your admission chance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50 text-slate-900">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-slate-50 text-slate-900`}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareFloatingBar />
        </Providers>
      </body>
    </html>
  );
}
