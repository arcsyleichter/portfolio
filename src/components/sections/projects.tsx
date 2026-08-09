import { Bot, FileSpreadsheet, Package, Receipt } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { projects, type ProjectId } from "@/lib/projects";
import { Reveal } from "@/components/motion/reveal";
import { GradientBackground } from "@/components/ui/gradient-background";
import { SectionHeader } from "./section-header";

const icons: Record<ProjectId, typeof Bot> = {
  lnyugta: Receipt,
  "ai-support": Bot,
  "saas-inventory": Package,
  "auto-reporting": FileSpreadsheet,
};

export function Projects({ dict }: { dict: Dictionary }) {
  const p = dict.projects;

  return (
    <section
      id="projects"
      className="section-light relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28"
    >
      <GradientBackground tone="light" className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {p.items.map((item, i) => {
            const meta = projects.find((proj) => proj.id === item.id);
            const Icon = icons[item.id as ProjectId];
            const isLive = item.kind === "live";
            // Symmetric split for the 2x2 grid: the inner pair (index 1 & 2 —
            // top-right and bottom-left, an anti-diagonal) takes cyan, the
            // outer pair (0 & 3, the main diagonal) stays gold.
            const isAi = i === 1 || i === 2;

            return (
              <Reveal key={item.id} delay={i * 0.08}>
                <div
                  className={`group h-full overflow-hidden rounded-2xl border border-border bg-card/60 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 ${
                    isAi ? "hover:border-tech-blue/50" : "hover:border-gold/50"
                  }`}
                >
                  <div
                    className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${meta?.gradient ?? "from-charcoal via-charcoal-elevated to-gold"}`}
                  >
                    <Icon className="h-10 w-10 text-cream/90" strokeWidth={1.5} />
                    <span
                      className="absolute right-3 top-3 rounded-full bg-ink/45 px-2.5 py-1 text-xs font-semibold text-cream backdrop-blur-sm"
                    >
                      {isLive ? p.liveBadge : p.demoBadge}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full border px-2.5 py-1 text-xs ${
                            isAi
                              ? "border-tech-blue/30 text-tech-blue-light"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">{p.demoNote}</p>
      </div>
    </section>
  );
}
