import { cn } from "@/lib/utils";
import type { ImageBlock } from "@/lib/builder/types";
import { RADIUS_CLASSES, MAX_WIDTH_CLASSES, FLEX_ALIGN_CLASSES } from "@/lib/builder/tokens";

export function ImageBlockView({ block }: { block: ImageBlock }) {
  if (!block.content.blobKey) return null;

  return (
    <figure className={cn("flex", FLEX_ALIGN_CLASSES[block.style.align])}>
      <div className={cn("w-full", RADIUS_CLASSES[block.style.radius], MAX_WIDTH_CLASSES[block.style.maxWidth])}>
        {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Blobs-backed URL, no known intrinsic size to feed next/image yet */}
        <img
          src={`/api/images/${block.content.blobKey}`}
          alt={block.content.alt}
          className={cn("h-auto w-full", RADIUS_CLASSES[block.style.radius])}
        />
        {block.content.caption && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">{block.content.caption}</figcaption>
        )}
      </div>
    </figure>
  );
}
