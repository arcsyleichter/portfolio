"use client";

import { Bot, LayoutDashboard, Rocket } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/motion/reveal";
import { InteractiveSynapseNetwork } from "@/components/ui/interactive-synapse-network";
import { GradientBackground } from "@/components/ui/gradient-background";
import { SectionHeader } from "./section-header";

const icons = [LayoutDashboard, Bot, Rocket];

export function Services({ dict }: { dict: Dictionary }) {
  const s = dict.services;

  return (
    <section
      id="services"
      className="section-dark relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28"
    >
      <GradientBackground tone="dark" className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl">
        <InteractiveSynapseNetwork
          className="mx-auto h-28 w-28 rounded-full"
          nodeColor="#d9a521"
          pulseColor="#faf8f5"
          connectionColor="#b8860b"
          backgroundColor="#1a1a1a"
          nodeCount={16}
          connectionRadius={46}
          trailOpacity={0.18}
        />
        <SectionHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            const isAi = i === 1;
            return (
              <Reveal key={item.title} delay={i * 0.1}>
                <div
                  className={`group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 ${
                    isAi ? "hover:border-tech-blue/50" : "hover:border-gold/50"
                  }`}
                >
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                      isAi
                        ? "bg-gradient-to-br from-tech-blue to-tech-blue-light"
                        : "bg-gradient-brand"
                    }`}
                  >
                    <Icon className="h-6 w-6 text-ink" />
                  </div>
                  <h3 className="mt-5 min-h-14 font-heading text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mt-5 flex min-h-[3.75rem] flex-wrap items-start gap-2">
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
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
