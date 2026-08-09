import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/motion/reveal";
import { GradientBackground } from "@/components/ui/gradient-background";
import { SectionHeader } from "./section-header";

export function TechStack({ dict }: { dict: Dictionary }) {
  const t = dict.tech;

  return (
    <section
      id="tech"
      className="section-light relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28"
    >
      <GradientBackground tone="light" className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.categories.map((cat, i) => {
            // Symmetric color split for a 4-in-a-row layout: inner pair (1,2)
            // one color, outer pair (0,3) the other — mirrors the 3-item rule
            // used elsewhere (middle vs. the two outer items).
            const isAi = i === 1 || i === 2;
            return (
            <Reveal key={cat.name} delay={i * 0.08}>
              <div
                className={`h-full rounded-2xl border border-border bg-card/60 p-6 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 ${
                  isAi ? "hover:border-tech-blue/40" : "hover:border-gold/40"
                }`}
              >
                <h3
                  className={`font-heading text-sm font-semibold uppercase tracking-wide ${
                    isAi ? "text-tech-blue-light" : "text-accent-text"
                  }`}
                >
                  {cat.name}
                </h3>
                <ul className="mt-4 space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
