import { cn } from "@/lib/utils";

/**
 * Icon-only mark: an "A" built from two wedges around a shared apex. In the
 * gap where a crossbar would sit, a small two-node connection (gold + cyan,
 * linked by a line) stands in for it — the same nodes/connections/pulse
 * language as the site's interactive network background, condensed into the
 * mark, and asymmetric on purpose so it doesn't read as a static, overly
 * tidy centerpiece. Colors are fixed so it reads correctly on any background,
 * independent of section theme.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("h-8 w-8", className)} aria-hidden="true">
      <defs>
        <linearGradient id="arcsy-mark-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d9a521" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
        <linearGradient id="arcsy-mark-link" x1="55" y1="64" x2="66" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8c6a0a" />
          <stop offset="100%" stopColor="#19a6cd" />
        </linearGradient>
      </defs>
      <path d="M60 16 L14 104 L40 104 Z" fill="url(#arcsy-mark-gold)" />
      <path d="M60 16 L106 104 L80 104 Z" fill="url(#arcsy-mark-gold)" />
      <line x1="55" y1="64" x2="66" y2="82" stroke="url(#arcsy-mark-link)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="55" cy="64" r="5" fill="#faf8f5" stroke="#8c6a0a" strokeWidth="1.75" />
      <circle cx="66" cy="82" r="5.5" fill="#4fc3e0" stroke="#19a6cd" strokeWidth="1.75" />
    </svg>
  );
}

/**
 * Full lockup: mark + wordmark. Text uses the page's theme tokens
 * (text-foreground / text-muted-foreground, font-heading) so it adapts
 * automatically to whichever .section-light / .section-dark it's placed in.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
          ARCSY
        </span>
        <span className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Design Studio
        </span>
      </span>
    </span>
  );
}

export default Logo;
