import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Space_Grotesk } from "next/font/google";
import { MotionConfig } from "motion/react";
import "../globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin — Arcsy Design Studio",
  robots: { index: false, follow: false },
};

/**
 * Root shell for the whole /admin tree — this project has no top-level
 * src/app/layout.tsx (the [locale] layout is the only thing that currently
 * defines <html>/<body>), and /admin is a sibling route tree that doesn't
 * inherit it. Deliberately no Navbar/Footer/Lenis/GradientBackground here —
 * minimal, dark admin chrome, not the marketing site.
 *
 * The session-gate redirect lives in `(protected)/layout.tsx`, not here,
 * so /admin/login can share this shell without being caught in a redirect
 * loop.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`${dmSans.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="section-dark min-h-full bg-background text-foreground">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
