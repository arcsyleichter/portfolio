"use client";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { MagneticDock, type DockItem } from "@/components/ui/magnetic-dock";

const GOLD_TINT: [string, string] = ["var(--gold-light)", "var(--gold)"];
const CYAN_TINT: [string, string] = ["var(--tech-blue-light)", "var(--tech-blue)"];

export function SiteDock({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const links: { id: string; label: string; href: string }[] = [
    { id: "about", label: dict.nav.about, href: `/${locale}#about` },
    { id: "services", label: dict.nav.services, href: `/${locale}#services` },
    { id: "projects", label: dict.nav.projects, href: `/${locale}#projects` },
    { id: "process", label: dict.nav.process, href: `/${locale}#process` },
    { id: "tech", label: dict.nav.tech, href: `/${locale}#tech` },
    { id: "pricing", label: dict.nav.pricing, href: `/${locale}#pricing` },
    { id: "blog", label: dict.nav.blog, href: `/${locale}/blog` },
  ];

  // Symmetric gold/cyan split: with an odd item count only the exact center
  // tile takes the secondary accent, everything else stays gold — mirrors the
  // "middle differs, outer pairs match" rule used across the rest of the site.
  const centerIndex = (links.length - 1) / 2;
  const items: DockItem[] = links.map((link, i) => ({
    id: link.id,
    label: link.label,
    tint: i === centerIndex ? CYAN_TINT : GOLD_TINT,
  }));

  return (
    <nav
      aria-label={dict.nav.cta}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 hidden lg:block"
    >
      <MagneticDock
        items={items}
        magnetRadius={110}
        maxScale={1.12}
        lift={10}
        idleWave
        tooltip={false}
        onSelect={(id) => {
          const link = links.find((l) => l.id === id);
          if (link) window.location.href = link.href;
        }}
      />
    </nav>
  );
}
