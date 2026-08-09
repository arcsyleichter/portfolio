"use client";

import type { Block } from "@/lib/builder/types";
import { RichTextEditor } from "./rich-text-editor";
import { ImageUploadField } from "./image-upload-field";

const FIELD_CLASS =
  "w-full rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold";

const TYPE_LABELS: Record<Block["type"], string> = {
  heading: "Cím",
  richtext: "Szöveg",
  image: "Kép",
  button: "Gomb",
  spacer: "Térköz",
  columns: "Oszlopok",
};

interface Props {
  block: Block;
  onChange: (block: Block) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockEditorCard({ block, onChange, onMoveUp, onMoveDown, onDelete, canMoveUp, canMoveDown }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-md shadow-black/10">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-tech-blue/30 px-2.5 py-1 text-xs font-medium text-tech-blue-light">
          {TYPE_LABELS[block.type]}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label="Feljebb"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label="Lejjebb"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-border text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="cursor-pointer rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
          >
            Törlés
          </button>
        </div>
      </div>

      <div className="mt-4">
        {block.type === "heading" && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={block.content.text}
              onChange={(e) => onChange({ ...block, content: { ...block.content, text: e.target.value } })}
              placeholder="Cím szövege"
              className={FIELD_CLASS}
            />
            <select
              value={block.content.level}
              onChange={(e) =>
                onChange({
                  ...block,
                  content: { ...block.content, level: e.target.value as "h1" | "h2" | "h3" | "h4" },
                })
              }
              className={`${FIELD_CLASS} sm:w-24`}
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
            </select>
          </div>
        )}

        {block.type === "richtext" && (
          <RichTextEditor
            value={block.content.doc}
            onChange={(doc) => onChange({ ...block, content: { doc } })}
          />
        )}

        {block.type === "image" && (
          <div className="flex flex-col gap-2">
            <ImageUploadField
              blobKey={block.content.blobKey}
              onUploaded={(blobKey) => onChange({ ...block, content: { ...block.content, blobKey } })}
            />
            <input
              value={block.content.alt}
              onChange={(e) => onChange({ ...block, content: { ...block.content, alt: e.target.value } })}
              placeholder="Alt szöveg (akadálymentesség, SEO)"
              className={FIELD_CLASS}
            />
          </div>
        )}

        {block.type === "button" && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={block.content.label}
              onChange={(e) => onChange({ ...block, content: { ...block.content, label: e.target.value } })}
              placeholder="Gomb szövege"
              className={FIELD_CLASS}
            />
            <input
              value={block.content.href}
              onChange={(e) => onChange({ ...block, content: { ...block.content, href: e.target.value } })}
              placeholder="Link (URL)"
              className={FIELD_CLASS}
            />
          </div>
        )}

        {block.type === "spacer" && (
          <select
            value={block.style.height}
            onChange={(e) =>
              onChange({
                ...block,
                style: { ...block.style, height: e.target.value as typeof block.style.height },
              })
            }
            className={FIELD_CLASS}
          >
            <option value="sm">Kicsi</option>
            <option value="md">Közepes</option>
            <option value="lg">Nagy</option>
            <option value="xl">Extra nagy</option>
          </select>
        )}

        {block.type === "columns" && (
          <p className="text-sm text-muted-foreground">
            Az oszlopok tartalmának szerkesztése a következő körben érkezik, a drag-and-drop-pal együtt.
          </p>
        )}
      </div>
    </div>
  );
}
