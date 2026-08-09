"use client";

import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Block, BlockType, CarouselBlock, ColumnsBlock, CtaBlock, GalleryBlock } from "@/lib/builder/types";
import { createBlock } from "@/lib/builder/defaults";
import { columnContainerId, columnEndDropId } from "@/lib/builder/block-tree";
import { RichTextEditor } from "./rich-text-editor";
import { ImageUploadField } from "./image-upload-field";
import { SortableBlockCard } from "./sortable-block-card";
import { ContainerEndDropZone } from "./container-end-drop-zone";
import { useBuilderDndUi } from "./builder-dnd-ui-context";

const FIELD_CLASS =
  "w-full rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold";

// Columns can't contain further columns — keeps nesting to one level and
// keeps the "add block" palette inside a column small and predictable.
const NESTED_ADDABLE_TYPES: { type: Exclude<BlockType, "columns">; label: string }[] = [
  { type: "heading", label: "+ Cím" },
  { type: "richtext", label: "+ Szöveg" },
  { type: "image", label: "+ Kép" },
  { type: "button", label: "+ Gomb" },
  { type: "spacer", label: "+ Térköz" },
  { type: "gallery", label: "+ Galéria" },
  { type: "carousel", label: "+ Carousel" },
  { type: "cta", label: "+ CTA" },
];

const RATIO_OPTIONS: { value: ColumnsBlock["style"]["ratio"]; label: string; columnCount: number }[] = [
  { value: "50/50", label: "50 / 50", columnCount: 2 },
  { value: "60/40", label: "60 / 40", columnCount: 2 },
  { value: "33/33/33", label: "33 / 33 / 33", columnCount: 3 },
];

function resizeColumns(cols: Block[][], count: number): Block[][] {
  if (cols.length === count) return cols;
  if (cols.length < count) return [...cols, ...Array.from({ length: count - cols.length }, () => [])];
  return cols.slice(0, count);
}

function ColumnsBlockEditor({ block, onChange }: { block: ColumnsBlock; onChange: (b: ColumnsBlock) => void }) {
  const { dragState } = useBuilderDndUi();

  function updateColumn(index: number, blocks: Block[]) {
    onChange({ ...block, content: { columns: block.content.columns.map((c, i) => (i === index ? blocks : c)) } });
  }

  function setRatio(ratio: ColumnsBlock["style"]["ratio"]) {
    const option = RATIO_OPTIONS.find((r) => r.value === ratio);
    if (!option) return;
    onChange({
      ...block,
      style: { ...block.style, ratio },
      content: { columns: resizeColumns(block.content.columns, option.columnCount) },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={`ratio-${block.id}`} className="text-xs font-medium text-muted-foreground">
          Arány
        </label>
        <select
          id={`ratio-${block.id}`}
          value={block.style.ratio}
          onChange={(e) => setRatio(e.target.value as ColumnsBlock["style"]["ratio"])}
          className={`${FIELD_CLASS} sm:w-40`}
        >
          {RATIO_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className={`grid grid-cols-1 gap-3 ${block.content.columns.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {block.content.columns.map((colBlocks, colIndex) => {
          const containerId = columnContainerId(block.id, colIndex);
          return (
            <div key={colIndex} className="flex flex-col gap-3 rounded-xl border border-dashed border-border p-3">
              <p className="text-xs font-medium text-muted-foreground">{colIndex + 1}. oszlop</p>

              <SortableContext items={colBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                {colBlocks.map((nested, i) => (
                  <SortableBlockCard
                    key={nested.id}
                    block={nested}
                    containerId={containerId}
                    index={i}
                    onChange={(next) => updateColumn(colIndex, colBlocks.map((b) => (b.id === nested.id ? next : b)))}
                    onMoveUp={() => {
                      if (i === 0) return;
                      const next = [...colBlocks];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      updateColumn(colIndex, next);
                    }}
                    onMoveDown={() => {
                      if (i === colBlocks.length - 1) return;
                      const next = [...colBlocks];
                      [next[i], next[i + 1]] = [next[i + 1], next[i]];
                      updateColumn(colIndex, next);
                    }}
                    onDelete={() => updateColumn(colIndex, colBlocks.filter((b) => b.id !== nested.id))}
                    canMoveUp={i > 0}
                    canMoveDown={i < colBlocks.length - 1}
                  />
                ))}
              </SortableContext>

              {colBlocks.length === 0 && (
                <p className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                  Üres oszlop — húzz ide egy blokkot
                </p>
              )}

              <ContainerEndDropZone id={columnEndDropId(block.id, colIndex)} active={dragState !== null} />

              <div className="flex flex-wrap gap-1.5">
                {NESTED_ADDABLE_TYPES.map(({ type, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateColumn(colIndex, [...colBlocks, createBlock(type)])}
                    className="cursor-pointer rounded-full border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GalleryBlockEditor({ block, onChange }: { block: GalleryBlock; onChange: (b: GalleryBlock) => void }) {
  function updateImage(index: number, patch: Partial<GalleryBlock["content"]["images"][number]>) {
    onChange({
      ...block,
      content: { images: block.content.images.map((img, i) => (i === index ? { ...img, ...patch } : img)) },
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <label htmlFor={`gallery-cols-${block.id}`} className="text-xs font-medium text-muted-foreground">
          Oszlopok
        </label>
        <select
          id={`gallery-cols-${block.id}`}
          value={block.style.columns}
          onChange={(e) =>
            onChange({ ...block, style: { ...block.style, columns: Number(e.target.value) as 2 | 3 | 4 } })
          }
          className={`${FIELD_CLASS} sm:w-24`}
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>

      {block.content.images.map((img, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-lg border border-dashed border-border p-3 sm:flex-row sm:items-center">
          <ImageUploadField blobKey={img.blobKey} onUploaded={(blobKey) => updateImage(i, { blobKey })} />
          <input
            value={img.alt}
            onChange={(e) => updateImage(i, { alt: e.target.value })}
            placeholder="Alt szöveg"
            className={FIELD_CLASS}
          />
          <button
            type="button"
            onClick={() => onChange({ ...block, content: { images: block.content.images.filter((_, idx) => idx !== i) } })}
            className="shrink-0 cursor-pointer rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
          >
            Törlés
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange({ ...block, content: { images: [...block.content.images, { blobKey: "", alt: "" }] } })}
        className="cursor-pointer self-start rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
      >
        + Kép hozzáadása
      </button>
    </div>
  );
}

function CarouselBlockEditor({ block, onChange }: { block: CarouselBlock; onChange: (b: CarouselBlock) => void }) {
  function updateSlide(index: number, patch: Partial<CarouselBlock["content"]["slides"][number]>) {
    onChange({
      ...block,
      content: { slides: block.content.slides.map((s, i) => (i === index ? { ...s, ...patch } : s)) },
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {block.content.slides.map((slide, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-lg border border-dashed border-border p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <ImageUploadField blobKey={slide.blobKey} onUploaded={(blobKey) => updateSlide(i, { blobKey })} />
            <input
              value={slide.alt}
              onChange={(e) => updateSlide(i, { alt: e.target.value })}
              placeholder="Alt szöveg"
              className={FIELD_CLASS}
            />
          </div>
          <div className="flex gap-2">
            <input
              value={slide.caption ?? ""}
              onChange={(e) => updateSlide(i, { caption: e.target.value })}
              placeholder="Felirat (opcionális)"
              className={FIELD_CLASS}
            />
            <button
              type="button"
              onClick={() => onChange({ ...block, content: { slides: block.content.slides.filter((_, idx) => idx !== i) } })}
              className="shrink-0 cursor-pointer rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
            >
              Törlés
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange({ ...block, content: { slides: [...block.content.slides, { blobKey: "", alt: "", caption: "" }] } })
        }
        className="cursor-pointer self-start rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
      >
        + Dia hozzáadása
      </button>
    </div>
  );
}

const CTA_TONE_OPTIONS: { value: CtaBlock["style"]["tone"]; label: string }[] = [
  { value: "gold", label: "Arany" },
  { value: "charcoal", label: "Faszén" },
  { value: "tech-blue", label: "Tech-kék" },
  { value: "cream", label: "Krém" },
  { value: "ink", label: "Tinta" },
];

function CtaBlockEditor({ block, onChange }: { block: CtaBlock; onChange: (b: CtaBlock) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <input
        value={block.content.heading}
        onChange={(e) => onChange({ ...block, content: { ...block.content, heading: e.target.value } })}
        placeholder="Cím"
        className={FIELD_CLASS}
      />
      <textarea
        value={block.content.text}
        onChange={(e) => onChange({ ...block, content: { ...block.content, text: e.target.value } })}
        placeholder="Szöveg"
        rows={2}
        className={FIELD_CLASS}
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={block.content.buttonLabel}
          onChange={(e) => onChange({ ...block, content: { ...block.content, buttonLabel: e.target.value } })}
          placeholder="Gomb szövege"
          className={FIELD_CLASS}
        />
        <input
          value={block.content.buttonHref}
          onChange={(e) => onChange({ ...block, content: { ...block.content, buttonHref: e.target.value } })}
          placeholder="Link (URL)"
          className={FIELD_CLASS}
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor={`cta-tone-${block.id}`} className="text-xs font-medium text-muted-foreground">
          Szín
        </label>
        <select
          id={`cta-tone-${block.id}`}
          value={block.style.tone}
          onChange={(e) => onChange({ ...block, style: { ...block.style, tone: e.target.value as CtaBlock["style"]["tone"] } })}
          className={`${FIELD_CLASS} sm:w-40`}
        >
          {CTA_TONE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export const TYPE_LABELS: Record<Block["type"], string> = {
  heading: "Cím",
  richtext: "Szöveg",
  image: "Kép",
  button: "Gomb",
  spacer: "Térköz",
  columns: "Oszlopok",
  gallery: "Galéria",
  carousel: "Carousel",
  cta: "Call-to-action",
};

interface Props {
  block: Block;
  onChange: (block: Block) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  dragHandleAttributes?: DraggableAttributes;
  dragHandleListeners?: DraggableSyntheticListeners;
}

export function BlockEditorCard({
  block,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
  dragHandleAttributes,
  dragHandleListeners,
}: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-md shadow-black/10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {dragHandleListeners && (
            <button
              type="button"
              {...dragHandleAttributes}
              {...dragHandleListeners}
              aria-label="Blokk húzása az átrendezéshez"
              title="Húzd az átrendezéshez"
              style={{ touchAction: "none" }}
              className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:cursor-grabbing"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <circle cx="9" cy="6" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="9" cy="18" r="1.5" />
                <circle cx="15" cy="6" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="15" cy="18" r="1.5" />
              </svg>
            </button>
          )}
          <span className="rounded-full border border-tech-blue/30 px-2.5 py-1 text-xs font-medium text-tech-blue-light">
            {TYPE_LABELS[block.type]}
          </span>
        </div>
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

        {block.type === "columns" && <ColumnsBlockEditor block={block} onChange={onChange} />}
        {block.type === "gallery" && <GalleryBlockEditor block={block} onChange={onChange} />}
        {block.type === "carousel" && <CarouselBlockEditor block={block} onChange={onChange} />}
        {block.type === "cta" && <CtaBlockEditor block={block} onChange={onChange} />}
      </div>
    </div>
  );
}
