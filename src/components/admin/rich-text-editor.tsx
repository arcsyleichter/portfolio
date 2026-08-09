"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function RichTextEditor({ value, onChange }: { value: JSONContent; onChange: (doc: JSONContent) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    // Required in the App Router to avoid a hydration-mismatch warning —
    // not optional polish, see Tiptap's SSR docs.
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold [&_p]:mt-2 [&_p:first-child]:mt-0",
      },
    },
  });

  return <EditorContent editor={editor} />;
}
