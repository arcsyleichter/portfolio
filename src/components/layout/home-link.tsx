"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import type { Locale } from "@/lib/i18n/config";
import { Logo } from "@/components/ui/logo";

/**
 * The logo, wired as a real "home" control: on another page it navigates
 * home as usual; already on the home page, a click just scrolls back to
 * the top (via Lenis when smooth scroll is active, native scroll otherwise
 * — e.g. reduced-motion, where SmoothScroll doesn't mount Lenis at all).
 */
export function HomeLink({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const homeHref = `/${locale}`;
  const isHome = pathname === homeHref || pathname === `${homeHref}/`;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isHome) return;
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Link href={homeHref} aria-label="Arcsy Design Studio — kezdőlap" onClick={handleClick} className={className}>
      <Logo />
    </Link>
  );
}
