import type { SpacerBlock } from "@/lib/builder/types";
import { SPACER_HEIGHT_CLASSES } from "@/lib/builder/tokens";

export function SpacerBlockView({ block }: { block: SpacerBlock }) {
  return <div aria-hidden className={SPACER_HEIGHT_CLASSES[block.style.height]} />;
}
