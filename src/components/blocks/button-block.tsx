import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonBlock } from "@/lib/builder/types";
import { FLEX_ALIGN_CLASSES } from "@/lib/builder/tokens";

const VARIANT_CLASSES: Record<ButtonBlock["style"]["variant"], string> = {
  primary: "bg-gradient-brand text-ink shadow-lg shadow-gold/20 hover:scale-105",
  secondary: "bg-gradient-to-br from-tech-blue to-tech-blue-light text-ink hover:scale-105",
  outline: "border border-border text-foreground hover:bg-muted",
};

export function ButtonBlockView({ block }: { block: ButtonBlock }) {
  return (
    <div className={cn("flex", FLEX_ALIGN_CLASSES[block.style.align])}>
      <Link
        href={block.content.href || "#"}
        className={cn(
          "cursor-pointer rounded-full px-6 py-3 text-center text-sm font-semibold transition-transform",
          VARIANT_CLASSES[block.style.variant],
        )}
      >
        {block.content.label}
      </Link>
    </div>
  );
}
