"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);

  const anchorItems: { href: string; label: string }[] = [
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#services`, label: dict.nav.services },
    { href: `/${locale}#projects`, label: dict.nav.projects },
    { href: `/${locale}#process`, label: dict.nav.process },
    { href: `/${locale}#tech`, label: dict.nav.tech },
    { href: `/${locale}#pricing`, label: dict.nav.pricing },
    { href: `/${locale}/blog`, label: dict.nav.blog },
  ];

  return (
    <header className="section-light sticky top-0 z-50 border-b border-border/60 bg-background/85 text-foreground backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="font-heading text-lg font-bold tracking-tight text-gradient-brand"
        >
          Árcsy
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {anchorItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher locale={locale} />
          <a
            href={`/${locale}#contact`}
            className="cursor-pointer rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-105"
          >
            {dict.nav.cta}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex cursor-pointer items-center justify-center rounded-lg border border-border p-2 lg:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 bg-foreground transition-all ${open ? "top-[7px] rotate-45" : "top-0"}`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 bg-foreground transition-opacity ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 bg-foreground transition-all ${open ? "top-[7px] -rotate-45" : "top-[14px]"}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-border/60 lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {anchorItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={`/${locale}#contact`}
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-gradient-brand px-4 py-2 text-center text-sm font-semibold text-ink"
              >
                {dict.nav.cta}
              </a>
              <div className="mt-3">
                <LanguageSwitcher locale={locale} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
