"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CarouselBlock } from "@/lib/builder/types";
import { RADIUS_CLASSES, MAX_WIDTH_CLASSES } from "@/lib/builder/tokens";

export function CarouselBlockView({ block }: { block: CarouselBlock }) {
  const slides = block.content.slides.filter((s) => s.blobKey);
  const [index, setIndex] = useState(0);

  if (slides.length === 0) return null;
  const current = slides[Math.min(index, slides.length - 1)];

  return (
    <div className={cn("relative mx-auto", MAX_WIDTH_CLASSES[block.style.maxWidth])}>
      <figure className={cn("overflow-hidden", RADIUS_CLASSES[block.style.radius])}>
        {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Blobs-backed URL, no known intrinsic size */}
        <img src={`/api/images/${current.blobKey}`} alt={current.alt} className="h-auto w-full" />
        {current.caption && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">{current.caption}</figcaption>
        )}
      </figure>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            aria-label="Előző dia"
            className="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-charcoal/70 text-cream backdrop-blur transition-colors hover:bg-charcoal"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            aria-label="Következő dia"
            className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-charcoal/70 text-cream backdrop-blur transition-colors hover:bg-charcoal"
          >
            ›
          </button>
          <div className="mt-3 flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ugrás a(z) ${i + 1}. diára`}
                className={cn("h-1.5 w-1.5 cursor-pointer rounded-full transition-colors", i === index ? "bg-gold" : "bg-border")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
