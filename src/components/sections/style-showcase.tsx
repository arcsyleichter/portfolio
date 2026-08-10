"use client";

import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/motion/reveal";
import { GradientBackground } from "@/components/ui/gradient-background";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "@/components/ui/carousel";
import { STYLE_MOCKUPS, type StyleId } from "@/components/ui/style-hero-mockups";
import { SectionHeader } from "./section-header";

export function StyleShowcase({ dict, override }: { dict: Dictionary; override?: Dictionary["styleShowcase"] }) {
  const s = override ?? dict.styleShowcase;

  return (
    <section
      id="style-showcase"
      className="section-dark relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28"
    >
      <GradientBackground tone="dark" className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />

        <Reveal delay={0.1} className="mt-14">
          <Carousel opts={{ align: "start", loop: true }} className="px-1">
            <CarouselContent>
              {s.styles.map((style) => {
                const Mockup = STYLE_MOCKUPS[style.id as StyleId];
                return (
                  <CarouselItem key={style.id} className="sm:basis-1/2 lg:basis-1/3">
                    <div className="group h-full">
                      <div className="overflow-hidden rounded-2xl shadow-lg shadow-black/20 transition-transform duration-300 group-hover:-translate-y-1">
                        <Mockup />
                      </div>
                      <div className="mt-4 px-1">
                        <h3 className="font-heading text-base font-semibold">{style.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{style.audience}</p>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <div className="mt-8 flex items-center justify-center gap-6">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselDots />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
}
