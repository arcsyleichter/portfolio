import { GradientBackground } from "@/components/ui/gradient-background";
import { BlockRenderer } from "./block-renderer";
import type { Block } from "@/lib/builder/types";

/**
 * Shell for an admin-created custom page — unlike PostArticleView there's no
 * title/excerpt header: a custom page is a blank canvas, so a visible
 * heading (if wanted) is just a heading block the admin added themselves.
 * Shared by the public route and (later) the admin editor's live preview.
 */
export function CustomPageView({ blocks }: { blocks: Block[] }) {
  return (
    <article className="section-light relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28">
      <GradientBackground tone="light" className="absolute inset-0 -z-10" />
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <BlockRenderer blocks={blocks} />
      </div>
    </article>
  );
}
