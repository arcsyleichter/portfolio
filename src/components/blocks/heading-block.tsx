import { cn } from "@/lib/utils";
import type { HeadingBlock } from "@/lib/builder/types";
import { TEXT_ALIGN_CLASSES, SPACING_CLASSES } from "@/lib/builder/tokens";

export function HeadingBlockView({ block }: { block: HeadingBlock }) {
  const Tag = block.content.level;
  return (
    <Tag
      className={cn(
        "font-heading font-bold",
        block.content.level === "h1" && "text-4xl sm:text-5xl",
        block.content.level === "h2" && "text-3xl sm:text-4xl",
        block.content.level === "h3" && "text-2xl sm:text-3xl",
        block.content.level === "h4" && "text-xl sm:text-2xl",
        block.style.gradientText && "text-gradient-brand",
        TEXT_ALIGN_CLASSES[block.style.align],
        SPACING_CLASSES[block.style.spacing],
      )}
    >
      {block.content.text}
    </Tag>
  );
}
