import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CtaBlock } from "@/lib/builder/types";
import { TEXT_ALIGN_CLASSES, TONE_BG_CLASSES } from "@/lib/builder/tokens";

export function CtaBlockView({ block }: { block: CtaBlock }) {
  return (
    <div
      className={cn(
        "rounded-2xl px-6 py-10 sm:px-10",
        TONE_BG_CLASSES[block.style.tone],
        TEXT_ALIGN_CLASSES[block.style.align],
      )}
    >
      <h3 className="font-heading text-2xl font-bold sm:text-3xl">{block.content.heading}</h3>
      {block.content.text && <p className="mt-3 opacity-90">{block.content.text}</p>}
      {block.content.buttonLabel && (
        <Link
          href={block.content.buttonHref || "#"}
          className="mt-6 inline-block cursor-pointer rounded-full bg-ink/10 px-6 py-3 text-sm font-semibold backdrop-blur transition-transform hover:scale-105"
        >
          {block.content.buttonLabel}
        </Link>
      )}
    </div>
  );
}
