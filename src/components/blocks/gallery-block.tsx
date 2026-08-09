import { cn } from "@/lib/utils";
import type { GalleryBlock } from "@/lib/builder/types";
import { RADIUS_CLASSES, GAP_CLASSES } from "@/lib/builder/tokens";

const COLUMN_CLASSES: Record<GalleryBlock["style"]["columns"], string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export function GalleryBlockView({ block }: { block: GalleryBlock }) {
  const images = block.content.images.filter((img) => img.blobKey);
  if (images.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-1", COLUMN_CLASSES[block.style.columns], GAP_CLASSES[block.style.gap])}>
      {images.map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- dynamic Blobs-backed URL, no known intrinsic size
        <img
          key={i}
          src={`/api/images/${img.blobKey}`}
          alt={img.alt}
          className={cn("h-full w-full object-cover", RADIUS_CLASSES[block.style.radius])}
        />
      ))}
    </div>
  );
}
