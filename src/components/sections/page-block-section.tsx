import { BlockRenderer } from "@/components/blocks/block-renderer";
import type { Block } from "@/lib/builder/types";

/**
 * Wraps a single freeform PageItem block in the same section rhythm
 * (padding, max-width) the other homepage sections use, so a block inserted
 * between two bespoke sections doesn't render flush to the page edges.
 */
export function PageBlockSection({ block }: { block: Block }) {
  return (
    <section className="section-light relative isolate bg-background px-4 py-12 text-foreground sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <BlockRenderer blocks={[block]} />
      </div>
    </section>
  );
}
