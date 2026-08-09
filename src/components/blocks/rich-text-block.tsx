import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";
import type { RichTextBlock } from "@/lib/builder/types";
import { TEXT_ALIGN_CLASSES, MAX_WIDTH_CLASSES } from "@/lib/builder/tokens";

export function RichTextBlockView({ block }: { block: RichTextBlock }) {
  const html = generateHTML(block.content.doc, [StarterKit]);

  return (
    <div
      className={cn(
        "mx-auto text-base leading-relaxed text-foreground",
        "[&>p]:mt-4 [&>p:first-child]:mt-0",
        "[&_a]:text-accent-text [&_a]:underline [&_a]:underline-offset-2",
        "[&_strong]:font-semibold",
        "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_code]:font-mono [&_code]:text-sm",
        "[&_h1]:font-heading [&_h2]:font-heading [&_h3]:font-heading",
        TEXT_ALIGN_CLASSES[block.style.align],
        MAX_WIDTH_CLASSES[block.style.maxWidth],
      )}
      // Content is authored exclusively through our own admin Tiptap editor
      // (StarterKit schema only, no raw-HTML node type) — not arbitrary
      // public input — so this is the sanctioned Tiptap pattern for
      // rendering stored ProseMirror JSON outside a live editor instance.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
