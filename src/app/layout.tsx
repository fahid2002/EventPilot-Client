import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventPilot | Tech Event Discovery Platform",
  description: "Discover verified tech events, attend free events, unlock premium events, and manage organizer activity with a role-based dashboard."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
