import { Sparkles } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/motion/reveal";
import { GradientBackground } from "@/components/ui/gradient-background";

export function Testimonials({ dict, override }: { dict: Dictionary; override?: Dictionary["testimonials"] }) {
  const t = override ?? dict.testimonials;

  return (
    <section className="section-dark relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-24">
      <GradientBackground tone="dark" className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-text">
            {t.eyebrow}
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t.title}</h2>
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-10">
            <Sparkles className="h-6 w-6 text-accent-text" />
            <p className="text-sm text-muted-foreground">{t.comingSoon}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
