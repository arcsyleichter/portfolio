"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { BlogPostDocument, Block, BlockType } from "@/lib/builder/types";
import { createBlock } from "@/lib/builder/defaults";
import { TYPE_LABELS } from "./block-editor-card";
import { SortableBlockCard } from "./sortable-block-card";
import { PaletteItem } from "./palette-item";
import { DeletePostButton } from "./delete-post-button";
import { TemplatePicker } from "./template-picker";

const ADDABLE_TYPES: { type: BlockType; label: string }[] = [
  { type: "heading", label: "+ Cím" },
  { type: "richtext", label: "+ Szöveg" },
  { type: "image", label: "+ Kép" },
  { type: "button", label: "+ Gomb" },
  { type: "spacer", label: "+ Térköz" },
  { type: "columns", label: "+ Oszlopok" },
];

type DragState = { type: "block"; blockId: string } | { type: "palette"; blockType: BlockType } | null;

function CanvasEndDropZone({ active }: { active: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-end" });
  if (!active) return null;
  return (
    <div
      ref={setNodeRef}
      aria-hidden
      className={`h-3 rounded-full transition-colors ${isOver ? "bg-gold" : "bg-transparent"}`}
    />
  );
}

export function PostEditor({ initialDoc }: { initialDoc: BlogPostDocument }) {
  const [doc, setDoc] = useState(initialDoc);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function patchDoc(patch: Partial<BlogPostDocument>) {
    setDoc((d) => ({ ...d, ...patch }));
    setDirty(true);
    setSavedMessage(null);
  }

  function updateBlock(id: string, next: Block) {
    patchDoc({ blocks: doc.blocks.map((b) => (b.id === id ? next : b)) });
  }

  function moveBlock(id: string, dir: -1 | 1) {
    const index = doc.blocks.findIndex((b) => b.id === id);
    const swapWith = index + dir;
    if (index < 0 || swapWith < 0 || swapWith >= doc.blocks.length) return;
    const next = [...doc.blocks];
    [next[index], next[swapWith]] = [next[swapWith], next[index]];
    patchDoc({ blocks: next });
  }

  function deleteBlock(id: string) {
    patchDoc({ blocks: doc.blocks.filter((b) => b.id !== id) });
  }

  function addBlock(type: BlockType) {
    patchDoc({ blocks: [...doc.blocks, createBlock(type)] });
  }

  function insertBlockAt(type: BlockType, index: number) {
    const blocks = [...doc.blocks];
    blocks.splice(index, 0, createBlock(type));
    patchDoc({ blocks });
  }

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as { type: "block" } | { type: "palette"; blockType: BlockType };
    setDragState(data.type === "palette" ? { type: "palette", blockType: data.blockType } : { type: "block", blockId: String(event.active.id) });
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if ((active.data.current as { type?: string } | undefined)?.type !== "palette") return;
    if (!over) {
      setOverIndex(null);
      return;
    }
    if (over.id === "canvas-end") {
      setOverIndex(doc.blocks.length);
      return;
    }
    const idx = doc.blocks.findIndex((b) => b.id === over.id);
    setOverIndex(idx === -1 ? doc.blocks.length : idx);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const insertAt = overIndex;
    setDragState(null);
    setOverIndex(null);
    if (!over) return;

    const activeData = active.data.current as { type: "block" } | { type: "palette"; blockType: BlockType };
    if (activeData.type === "palette") {
      insertBlockAt(activeData.blockType, insertAt ?? doc.blocks.length);
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = doc.blocks.findIndex((b) => b.id === active.id);
      const newIndex = doc.blocks.findIndex((b) => b.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        patchDoc({ blocks: arrayMove(doc.blocks, oldIndex, newIndex) });
      }
    }
  }

  async function save(nextStatus: BlogPostDocument["status"]) {
    const wasPublished = doc.status === "published";
    setSaving(true);
    setError(null);
    const payload: BlogPostDocument = { ...doc, status: nextStatus };

    try {
      const res = await fetch(`/api/admin/posts/${doc.locale}/${doc.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error === "invalid_document" ? "Érvénytelen tartalom." : "Mentés sikertelen.");
        return;
      }
      const { post } = (await res.json()) as { post: BlogPostDocument };
      setDoc(post);
      setDirty(false);
      setSavedMessage(
        nextStatus === "published"
          ? "Publikálva."
          : wasPublished
            ? "Visszavonva piszkozatba."
            : "Mentve piszkozatként.",
      );
    } catch {
      setError("Mentés sikertelen — hálózati hiba.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/posts" className="text-sm text-muted-foreground hover:text-foreground">
          ← Vissza a listához
        </Link>
        <div className="flex items-center gap-3">
          {doc.status === "published" && (
            <a
              href={`/${doc.locale}/blog/${doc.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-accent-text hover:underline"
            >
              Megtekintés élőben ↗
            </a>
          )}
          {doc.status === "published" ? (
            <button
              type="button"
              onClick={() => save("draft")}
              disabled={saving}
              className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Mentés..." : "Visszavonás piszkozatba"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => save("draft")}
              disabled={saving}
              className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Mentés..." : "Mentés piszkozatként"}
            </button>
          )}
          <button
            type="button"
            onClick={() => save("published")}
            disabled={saving}
            className="cursor-pointer rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {doc.status === "published" ? "Frissítés" : "Publikálás"}
          </button>
          <DeletePostButton
            locale={doc.locale}
            slug={doc.slug}
            title={doc.title}
            variant="icon"
            redirectAfter="/admin/posts"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {savedMessage && !dirty && <p className="mt-4 text-sm text-tech-blue-light">{savedMessage}</p>}

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-5 shadow-md shadow-black/10">
        <div>
          <label htmlFor="title" className="text-sm font-medium">
            Cím
          </label>
          <input
            id="title"
            value={doc.title}
            onChange={(e) => patchDoc({ title: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="text-sm font-medium">
            Kivonat
          </label>
          <textarea
            id="excerpt"
            rows={2}
            value={doc.excerpt}
            onChange={(e) => patchDoc({ excerpt: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {doc.locale.toUpperCase()} · /{doc.slug} · {doc.status === "published" ? "Publikálva" : "Piszkozat"}
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setDragState(null);
          setOverIndex(null);
        }}
      >
        <div className="mt-6 flex flex-col gap-4">
          <SortableContext items={doc.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            {doc.blocks.map((block, i) => (
              <SortableBlockCard
                key={block.id}
                block={block}
                onChange={(next) => updateBlock(block.id, next)}
                onMoveUp={() => moveBlock(block.id, -1)}
                onMoveDown={() => moveBlock(block.id, 1)}
                onDelete={() => deleteBlock(block.id)}
                canMoveUp={i > 0}
                canMoveDown={i < doc.blocks.length - 1}
                showInsertionLineBefore={dragState?.type === "palette" && overIndex === i}
              />
            ))}
          </SortableContext>
          {doc.blocks.length === 0 && <TemplatePicker onSelect={(blocks) => patchDoc({ blocks })} />}
          <CanvasEndDropZone active={dragState?.type === "palette"} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {ADDABLE_TYPES.map(({ type, label }) => (
            <PaletteItem key={type} type={type} label={label} onClick={() => addBlock(type)} />
          ))}
        </div>

        <DragOverlay>
          {dragState?.type === "palette" && (
            <div className="rounded-full border border-gold/50 bg-card px-4 py-2 text-sm font-medium shadow-lg shadow-black/20">
              {TYPE_LABELS[dragState.blockType]}
            </div>
          )}
          {dragState?.type === "block" &&
            (() => {
              const block = doc.blocks.find((b) => b.id === dragState.blockId);
              return block ? (
                <div className="rounded-2xl border border-gold/50 bg-card px-5 py-3 text-sm font-medium shadow-lg shadow-black/20">
                  {TYPE_LABELS[block.type]}
                </div>
              ) : null;
            })()}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
