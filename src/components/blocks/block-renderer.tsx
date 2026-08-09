import type { Block } from "@/lib/builder/types";
import { AnimatedBlock } from "./animated-block";
import { HeadingBlockView } from "./heading-block";
import { RichTextBlockView } from "./rich-text-block";
import { ImageBlockView } from "./image-block";
import { ButtonBlockView } from "./button-block";
import { SpacerBlockView } from "./spacer-block";
import { ColumnsBlockView } from "./columns-block";
import { GalleryBlockView } from "./gallery-block";
import { CarouselBlockView } from "./carousel-block";
import { CtaBlockView } from "./cta-block";

/**
 * The single shared renderer for a block tree — used both by the public
 * blog page and (in a later milestone) the editor canvas, so the two can
 * never visually drift apart.
 */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block) => (
        <AnimatedBlock key={block.id} animation={block.animation}>
          <BlockView block={block} />
        </AnimatedBlock>
      ))}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return <HeadingBlockView block={block} />;
    case "richtext":
      return <RichTextBlockView block={block} />;
    case "image":
      return <ImageBlockView block={block} />;
    case "button":
      return <ButtonBlockView block={block} />;
    case "spacer":
      return <SpacerBlockView block={block} />;
    case "columns":
      return <ColumnsBlockView block={block} />;
    case "gallery":
      return <GalleryBlockView block={block} />;
    case "carousel":
      return <CarouselBlockView block={block} />;
    case "cta":
      return <CtaBlockView block={block} />;
  }
}
