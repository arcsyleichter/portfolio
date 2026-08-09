import { CheckCircle2 } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/motion/reveal";
import { GradientBackground } from "@/components/ui/gradient-background";

export function About({ dict }: { dict: Dictionary }) {
  const a = dict.about;

  return (
    <section
      id="about"
      className="section-light relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28"
    >
      <GradientBackground tone="light" className="absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-5 lg:gap-16">
        <Reveal className="lg:col-span-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-text">
            {a.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{a.title}</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            {a.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg hover:shadow-black/20">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Highlights
            </h3>
            <ul className="mt-4 space-y-4">
              {a.highlights.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className={`mt-0.5 h-5 w-5 shrink-0 ${i === 1 ? "text-tech-blue-light" : "text-accent-text"}`}
                  />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
