import { cn } from "@/lib/utils";
import type { ColumnsBlock } from "@/lib/builder/types";
import { GAP_CLASSES } from "@/lib/builder/tokens";
import { BlockRenderer } from "./block-renderer";

const RATIO_CLASSES: Record<ColumnsBlock["style"]["ratio"], string> = {
  "50/50": "sm:grid-cols-2",
  "60/40": "sm:grid-cols-[60%_1fr]",
  "33/33/33": "sm:grid-cols-3",
};

export function ColumnsBlockView({ block }: { block: ColumnsBlock }) {
  return (
    <div className={cn("grid grid-cols-1", RATIO_CLASSES[block.style.ratio], GAP_CLASSES[block.style.gap])}>
      {block.content.columns.map((column, i) => (
        <div key={i} className="flex flex-col">
          <BlockRenderer blocks={column} />
        </div>
      ))}
    </div>
  );
}
