import { Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/motion/reveal";
import { GradientBackground } from "@/components/ui/gradient-background";
import { SectionHeader } from "./section-header";

export function Pricing({ locale, dict, override }: { locale: Locale; dict: Dictionary; override?: Dictionary["pricing"] }) {
  const pr = override ?? dict.pricing;

  return (
    <section
      id="pricing"
      className="section-light relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28"
    >
      <GradientBackground tone="light" className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow={pr.eyebrow} title={pr.title} subtitle={pr.subtitle} />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pr.tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.1}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  tier.highlighted
                    ? "border-gold bg-card shadow-xl shadow-gold/10 hover:shadow-2xl hover:shadow-gold/20"
                    : "border-border bg-card/60 shadow-md shadow-black/10 hover:border-gold/40 hover:shadow-lg hover:shadow-black/20"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-brand px-3 py-1 text-xs font-semibold text-ink">
                    {pr.popularLabel}
                  </span>
                )}
                <h3 className="font-heading text-lg font-semibold">{tier.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-text" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`/${locale}#contact`}
                  className={`mt-8 cursor-pointer rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-transform hover:scale-105 ${
                    tier.highlighted
                      ? "bg-gradient-brand text-ink"
                      : "border border-border text-foreground"
                  }`}
                >
                  {pr.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">{pr.customNote}</p>
      </div>
    </section>
  );
}
