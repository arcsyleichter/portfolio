import { cn } from "@/lib/utils";
import type { Block, BlockType, ColumnsBlock } from "@/lib/builder/types";
import { GAP_CLASSES } from "@/lib/builder/tokens";
import type { ContainerId } from "@/lib/builder/block-tree";
import { HeadingBlockView } from "@/components/blocks/heading-block";
import { RichTextBlockView } from "@/components/blocks/rich-text-block";
import { ImageBlockView } from "@/components/blocks/image-block";
import { ButtonBlockView } from "@/components/blocks/button-block";
import { SpacerBlockView } from "@/components/blocks/spacer-block";
import { GalleryBlockView } from "@/components/blocks/gallery-block";
import { CarouselBlockView } from "@/components/blocks/carousel-block";
import { CtaBlockView } from "@/components/blocks/cta-block";
import { CanvasColumn } from "./canvas-column";

const RATIO_CLASSES: Record<ColumnsBlock["style"]["ratio"], string> = {
  "50/50": "sm:grid-cols-2",
  "60/40": "sm:grid-cols-[60%_1fr]",
  "33/33/33": "sm:grid-cols-3",
};

function EmptyPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
      {label} — kattints a szerkesztéshez
    </div>
  );
}

interface Props {
  block: Block;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAddBlock: (containerId: ContainerId, type: BlockType) => void;
}

/** The canvas's content renderer — reuses the same leaf view components the
 * public page renders with, so what you see while editing IS what ships.
 * Diverges from block-renderer.tsx only where a block can render empty
 * (nothing to click on yet) and for columns, which need each column to be
 * its own interactive drop target instead of a static BlockRenderer list. */
export function CanvasBlockView({ block, selectedId, onSelect, onDelete, onAddBlock }: Props) {
  switch (block.type) {
    case "heading":
      return <HeadingBlockView block={block} />;
    case "richtext":
      return <RichTextBlockView block={block} />;
    case "image":
      return block.content.blobKey ? <ImageBlockView block={block} /> : <EmptyPlaceholder label="Kép" />;
    case "button":
      return <ButtonBlockView block={block} />;
    case "spacer":
      return <SpacerBlockView block={block} />;
    case "gallery":
      return block.content.images.some((i) => i.blobKey) ? (
        <GalleryBlockView block={block} />
      ) : (
        <EmptyPlaceholder label="Galéria" />
      );
    case "carousel":
      return block.content.slides.some((s) => s.blobKey) ? (
        <CarouselBlockView block={block} />
      ) : (
        <EmptyPlaceholder label="Carousel" />
      );
    case "cta":
      return <CtaBlockView block={block} />;
    case "columns":
      return (
        <div className={cn("grid grid-cols-1 rounded-lg", RATIO_CLASSES[block.style.ratio], GAP_CLASSES[block.style.gap])}>
          {block.content.columns.map((colBlocks, i) => (
            <CanvasColumn
              key={i}
              blocks={colBlocks}
              columnsBlockId={block.id}
              columnIndex={i}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              onAddBlock={onAddBlock}
            />
          ))}
        </div>
      );
  }
}
