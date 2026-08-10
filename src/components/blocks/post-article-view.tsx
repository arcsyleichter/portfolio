import { GradientBackground } from "@/components/ui/gradient-background";
import { BlockRenderer } from "./block-renderer";
import type { Block } from "@/lib/builder/types";

/**
 * The exact markup a published post renders with — shared by the public
 * page and the admin editor's live preview so the two can never visually
 * drift apart.
 */
export function PostArticleView({ title, excerpt, blocks }: { title: string; excerpt: string; blocks: Block[] }) {
  return (
    <article className="section-light relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28">
      <GradientBackground tone="light" className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {excerpt && <p className="mt-4 text-lg text-muted-foreground">{excerpt}</p>}
        <div className="mt-10 flex flex-col gap-6">
          <BlockRenderer blocks={blocks} />
        </div>
      </div>
    </article>
  );
}
