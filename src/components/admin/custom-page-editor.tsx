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
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { CustomPageDocument, Block, BlockType } from "@/lib/builder/types";
import { createBlock } from "@/lib/builder/defaults";
import {
  ROOT_CONTAINER,
  findBlock,
  findContainerOf,
  getContainerBlocks,
  setContainerBlocks,
  insertBlockInTree,
  moveBlockInTree,
  resolveDropTarget,
  type ContainerId,
} from "@/lib/builder/block-tree";
import { TYPE_LABELS, BlockEditorCard } from "./block-editor-card";
import { CanvasBlock } from "./canvas-block";
import { PaletteItem } from "./palette-item";
import { ADDABLE_TYPES } from "./post-editor";
import { DeletePageButton } from "./delete-page-button";
import { TemplatePicker } from "./template-picker";
import { SeoPanel } from "./seo-panel";
import { ContainerEndDropZone } from "./container-end-drop-zone";
import { BuilderDndUiProvider, type BuilderDragState } from "./builder-dnd-ui-context";
import { CustomPagePreview } from "./custom-page-preview";

type ActiveData = { type: "palette"; blockType: BlockType } | { type: "block"; containerId: ContainerId };

export function CustomPageEditor({ initialDoc }: { initialDoc: CustomPageDocument }) {
  const [doc, setDoc] = useState(initialDoc);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [dragState, setDragState] = useState<BuilderDragState>(null);
  const [overInfo, setOverInfo] = useState<{ containerId: ContainerId; index: number } | null>(null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function patchDoc(patch: Partial<CustomPageDocument> | ((d: CustomPageDocument) => Partial<CustomPageDocument>)) {
    setDoc((d) => ({ ...d, ...(typeof patch === "function" ? patch(d) : patch) }));
    setDirty(true);
    setSavedMessage(null);
  }

  function updateBlockById(id: string, next: Block) {
    patchDoc((d) => {
      const containerId = findContainerOf(d.blocks, id);
      if (!containerId) return {};
      const container = getContainerBlocks(d.blocks, containerId).map((b) => (b.id === id ? next : b));
      return { blocks: setContainerBlocks(d.blocks, containerId, container) };
    });
  }

  function moveBlockById(id: string, dir: -1 | 1) {
    patchDoc((d) => {
      const containerId = findContainerOf(d.blocks, id);
      if (!containerId) return {};
      const container = getContainerBlocks(d.blocks, containerId);
      const index = container.findIndex((b) => b.id === id);
      const swapWith = index + dir;
      if (index < 0 || swapWith < 0 || swapWith >= container.length) return {};
      return { blocks: moveBlockInTree(d.blocks, id, containerId, containerId, swapWith) };
    });
  }

  function deleteBlockById(id: string) {
    patchDoc((d) => {
      const containerId = findContainerOf(d.blocks, id);
      if (!containerId) return {};
      const next = getContainerBlocks(d.blocks, containerId).filter((b) => b.id !== id);
      return { blocks: setContainerBlocks(d.blocks, containerId, next) };
    });
    setSelectedBlockId((cur) => (cur === id ? null : cur));
  }

  function addBlockToContainer(containerId: ContainerId, type: BlockType) {
    const newBlock = createBlock(type);
    patchDoc((d) => {
      const container = getContainerBlocks(d.blocks, containerId);
      return { blocks: insertBlockInTree(d.blocks, containerId, container.length, newBlock) };
    });
    setSelectedBlockId(newBlock.id);
  }

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as ActiveData;
    setDragState(
      data.type === "palette"
        ? { type: "palette", blockType: data.blockType }
        : { type: "block", blockId: String(event.active.id), sourceContainer: data.containerId },
    );
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    if (!over) {
      setOverInfo(null);
      return;
    }
    setOverInfo(resolveDropTarget(doc.blocks, String(over.id)));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setDragState(null);
    setOverInfo(null);
    if (!over) return;

    const activeData = active.data.current as ActiveData;
    const resolved = resolveDropTarget(doc.blocks, String(over.id));
    if (!resolved) return;

    if (activeData.type === "palette") {
      if (activeData.blockType === "columns" && resolved.containerId !== ROOT_CONTAINER) return;
      const newBlock = createBlock(activeData.blockType);
      patchDoc((d) => ({ blocks: insertBlockInTree(d.blocks, resolved.containerId, resolved.index, newBlock) }));
      setSelectedBlockId(newBlock.id);
      return;
    }

    if (String(active.id) === String(over.id)) return;

    const blockId = String(active.id);
    const sourceContainerId = activeData.containerId;
    const movingBlock = findBlock(doc.blocks, blockId);
    if (movingBlock?.type === "columns" && resolved.containerId !== ROOT_CONTAINER) return;

    patchDoc((d) => ({ blocks: moveBlockInTree(d.blocks, blockId, sourceContainerId, resolved.containerId, resolved.index) }));
  }

  async function save(nextStatus: CustomPageDocument["status"]) {
    const wasPublished = doc.status === "published";
    setSaving(true);
    setError(null);
    const payload: CustomPageDocument = { ...doc, status: nextStatus };

    try {
      const res = await fetch(`/api/admin/pages/${doc.locale}/${doc.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error === "invalid_document" ? "Érvénytelen tartalom." : "Mentés sikertelen.");
        return;
      }
      const { page } = (await res.json()) as { page: CustomPageDocument };
      setDoc(page);
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

  const selectedBlock = selectedBlockId ? findBlock(doc.blocks, selectedBlockId) : null;
  const selectedContainerId = selectedBlockId ? findContainerOf(doc.blocks, selectedBlockId) : null;
  const selectedContainerBlocks = selectedContainerId ? getContainerBlocks(doc.blocks, selectedContainerId) : [];
  const selectedIndex = selectedBlockId ? selectedContainerBlocks.findIndex((b) => b.id === selectedBlockId) : -1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/pages" className="text-sm text-muted-foreground hover:text-foreground">
          ← Vissza a listához
        </Link>
        <div className="flex items-center gap-3">
          {doc.status === "published" && (
            <a
              href={`/${doc.locale}/${doc.slug}`}
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
          <DeletePageButton
            locale={doc.locale}
            slug={doc.slug}
            title={doc.title}
            variant="icon"
            redirectAfter="/admin/pages"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {savedMessage && !dirty && <p className="mt-4 text-sm text-tech-blue-light">{savedMessage}</p>}

      <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-border bg-card/60 p-5 shadow-md shadow-black/10">
        <div className="flex flex-col gap-4">
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
          <p className="text-xs text-muted-foreground">
            {doc.locale.toUpperCase()} · /{doc.slug} · {doc.status === "published" ? "Publikálva" : "Piszkozat"}
          </p>
          <SeoPanel seo={doc.seo} onChange={(seo) => patchDoc({ seo })} />
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-3xl items-center gap-1.5">
        {(
          [
            { id: "edit", label: "Vászon" },
            { id: "preview", label: "Élő előnézet" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              mode === m.id
                ? "border-gold/50 bg-gold/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "preview" && (
        <div className="mx-auto max-w-3xl">
          <CustomPagePreview blocks={doc.blocks} />
        </div>
      )}

      <div className={mode === "preview" ? "hidden" : "mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:items-start"}>
        <DndContext
          id="custom-page-editor-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={() => {
            setDragState(null);
            setOverInfo(null);
          }}
        >
          <BuilderDndUiProvider value={{ dragState, overInfo }}>
            <div className="min-w-0 rounded-2xl border border-border bg-card/30 p-4 sm:p-6" onClick={() => setSelectedBlockId(null)}>
              <div className="flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
                <SortableContext items={doc.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  {doc.blocks.map((block, i) => (
                    <CanvasBlock
                      key={block.id}
                      block={block}
                      containerId={ROOT_CONTAINER}
                      index={i}
                      selectedId={selectedBlockId}
                      onSelect={setSelectedBlockId}
                      onDelete={deleteBlockById}
                      onAddBlock={addBlockToContainer}
                    />
                  ))}
                </SortableContext>
                {doc.blocks.length === 0 && <TemplatePicker onSelect={(blocks) => patchDoc({ blocks })} />}
                <ContainerEndDropZone id="canvas-end" active={dragState !== null} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                {ADDABLE_TYPES.map(({ type, label }) => (
                  <PaletteItem
                    key={type}
                    type={type}
                    label={label}
                    onClick={() => addBlockToContainer(ROOT_CONTAINER, type)}
                  />
                ))}
              </div>
            </div>

            <DragOverlay>
              {dragState?.type === "palette" && (
                <div className="rounded-full border border-gold/50 bg-card px-4 py-2 text-sm font-medium shadow-lg shadow-black/20">
                  {TYPE_LABELS[dragState.blockType]}
                </div>
              )}
              {dragState?.type === "block" &&
                (() => {
                  const block = findBlock(doc.blocks, dragState.blockId);
                  return block ? (
                    <div className="rounded-2xl border border-gold/50 bg-card px-5 py-3 text-sm font-medium shadow-lg shadow-black/20">
                      {TYPE_LABELS[block.type]}
                    </div>
                  ) : null;
                })()}
            </DragOverlay>
          </BuilderDndUiProvider>
        </DndContext>

        <div className="lg:sticky lg:top-6">
          {selectedBlock ? (
            <BlockEditorCard
              block={selectedBlock}
              onChange={(next) => updateBlockById(selectedBlock.id, next)}
              onMoveUp={() => moveBlockById(selectedBlock.id, -1)}
              onMoveDown={() => moveBlockById(selectedBlock.id, 1)}
              onDelete={() => deleteBlockById(selectedBlock.id)}
              canMoveUp={selectedIndex > 0}
              canMoveDown={selectedIndex >= 0 && selectedIndex < selectedContainerBlocks.length - 1}
            />
          ) : (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Válassz egy blokkot a vásznon a szerkesztéshez.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
