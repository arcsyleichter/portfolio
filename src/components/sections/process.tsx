import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/motion/reveal";
import { GradientBackground } from "@/components/ui/gradient-background";
import { SectionHeader } from "./section-header";

export function Process({ dict }: { dict: Dictionary }) {
  const pr = dict.process;

  return (
    <section
      id="process"
      className="section-dark relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28"
    >
      <GradientBackground tone="dark" className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow={pr.eyebrow} title={pr.title} />

        <ol className="mt-14 space-y-8">
          {pr.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <li className="group relative flex gap-5 pl-1">
                {i < pr.steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[19px] top-10 h-[calc(100%+0.5rem)] w-px bg-border"
                  />
                )}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-brand font-heading text-sm font-bold text-ink transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-gold/40">
                  {i + 1}
                </span>
                <div className="pb-2 transition-transform duration-300 group-hover:translate-x-1">
                  <h3 className="font-heading text-base font-semibold transition-colors duration-300 group-hover:text-accent-text">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
