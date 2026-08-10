"use client";

import { useEffect, useState } from "react";
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
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Block, BlockType } from "@/lib/builder/types";
import { createBlock } from "@/lib/builder/defaults";
import type { PageItem } from "@/lib/builder/page-layout-types";
import { getSectionSchema } from "@/lib/builder/site-sections";
import type { SectionKey } from "@/lib/builder/site-content-schema";
import { ADDABLE_TYPES } from "./post-editor";
import { PaletteItem } from "./palette-item";
import { TYPE_LABELS, BlockEditorCard } from "./block-editor-card";
import { PageLayoutItem } from "./page-layout-item";
import { SiteSectionForm } from "./site-section-form";

interface LayoutResponse {
  items: PageItem[];
  overrides: Partial<Record<SectionKey, unknown>>;
}

// Columns nest their own block lists, which the flat page-layout array has no
// container addressing for — keeping the palette to non-nesting types avoids
// shipping a block whose "add inside" affordance would silently do nothing.
const PAGE_LAYOUT_ADDABLE_TYPES = ADDABLE_TYPES.filter((t) => t.type !== "columns");

type ActiveDrag = { kind: "palette"; blockType: BlockType } | { kind: "item"; item: PageItem };

export function PageLayoutEditor() {
  const [locale, setLocale] = useState<Locale>("hu");
  const [items, setItems] = useState<PageItem[] | null>(null);
  const [overrides, setOverrides] = useState<Partial<Record<SectionKey, unknown>>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inspectorVersion, setInspectorVersion] = useState(0);
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);

  const dict = getDictionary(locale);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/site/${locale}/layout`)
      .then((r) => r.json())
      .then((data: LayoutResponse) => {
        if (cancelled) return;
        setItems(data.items);
        setOverrides(data.overrides);
        setDirty(false);
        setSelectedId(null);
        setSavedMessage(null);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  function markDirty() {
    setDirty(true);
    setSavedMessage(null);
  }

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as { type: "palette"; blockType: BlockType } | undefined;
    if (data?.type === "palette") {
      setActiveDrag({ kind: "palette", blockType: data.blockType });
      return;
    }
    const item = items?.find((i) => i.id === event.active.id);
    if (item) setActiveDrag({ kind: "item", item });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDrag(null);
    if (!over || !items) return;

    const activeData = active.data.current as { type: "palette"; blockType: BlockType } | undefined;
    if (activeData?.type === "palette") {
      const overIndex = items.findIndex((i) => i.id === over.id);
      const insertAt = overIndex === -1 ? items.length : overIndex;
      const newItem: PageItem = { id: crypto.randomUUID(), kind: "block", block: createBlock(activeData.blockType) };
      const next = [...items];
      next.splice(insertAt, 0, newItem);
      setItems(next);
      setSelectedId(newItem.id);
      markDirty();
      return;
    }

    if (active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    setItems(arrayMove(items, oldIndex, newIndex));
    markDirty();
  }

  function toggleHidden(id: string) {
    setItems((cur) => cur?.map((i) => (i.id === id && i.kind === "section" ? { ...i, hidden: !i.hidden } : i)) ?? cur);
    markDirty();
  }

  function addBlock(type: BlockType) {
    const newItem: PageItem = { id: crypto.randomUUID(), kind: "block", block: createBlock(type) };
    setItems((cur) => (cur ? [...cur, newItem] : cur));
    setSelectedId(newItem.id);
    markDirty();
  }

  function deleteBlock(id: string) {
    setItems((cur) => cur?.filter((i) => i.id !== id) ?? cur);
    setSelectedId((cur) => (cur === id ? null : cur));
    markDirty();
  }

  function updateBlockContent(id: string, next: Block) {
    setItems((cur) => cur?.map((i) => (i.id === id && i.kind === "block" ? { ...i, block: next } : i)) ?? cur);
    markDirty();
  }

  function moveBlock(id: string, dir: -1 | 1) {
    setItems((cur) => {
      if (!cur) return cur;
      const index = cur.findIndex((i) => i.id === id);
      const swapWith = index + dir;
      if (index < 0 || swapWith < 0 || swapWith >= cur.length) return cur;
      return arrayMove(cur, index, swapWith);
    });
    markDirty();
  }

  async function handleSaveLayout() {
    if (!items) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/site/${locale}/layout`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      if (!res.ok) throw new Error("save failed");
      setDirty(false);
      setSavedMessage("Elrendezés mentve.");
    } catch {
      setError("Mentés sikertelen.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSectionSave(sectionKey: SectionKey, content: Record<string, unknown>) {
    const res = await fetch(`/api/admin/site/${locale}/${sectionKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (!res.ok) throw new Error("save failed");
    const data = (await res.json()) as { content: Record<string, unknown> };
    setOverrides((cur) => ({ ...cur, [sectionKey]: data.content }));
  }

  async function handleSectionRevert(sectionKey: SectionKey) {
    if (!window.confirm("Biztosan visszaállítod ezt a szekciót az alapértelmezett tartalomra? A mentett módosítások elvesznek.")) {
      return;
    }
    const res = await fetch(`/api/admin/site/${locale}/${sectionKey}`, { method: "DELETE" });
    if (!res.ok) return;
    const data = (await res.json()) as { content: Record<string, unknown> };
    setOverrides((cur) => {
      const next = { ...cur };
      delete next[sectionKey];
      return next;
    });
    void data;
    setInspectorVersion((v) => v + 1);
  }

  const selectedItem = items?.find((i) => i.id === selectedId) ?? null;
  const selectedSchema = selectedItem?.kind === "section" ? getSectionSchema(selectedItem.sectionKey) : undefined;
  const selectedEdited =
    selectedItem?.kind === "section" ? Object.prototype.hasOwnProperty.call(overrides, selectedItem.sectionKey) : false;
  const selectedContent =
    selectedItem?.kind === "section"
      ? ((overrides[selectedItem.sectionKey] ?? dict[selectedItem.sectionKey]) as Record<string, unknown>)
      : null;

  const selectedIndex = selectedId ? (items?.findIndex((i) => i.id === selectedId) ?? -1) : -1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/posts" className="text-sm text-muted-foreground hover:text-foreground">
          ← Bejegyzésekhez
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/admin/pages" className="text-sm text-muted-foreground hover:text-foreground">
            Egyedi oldalak →
          </Link>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {savedMessage && !dirty && <p className="text-sm text-tech-blue-light">{savedMessage}</p>}
          <button
            type="button"
            onClick={handleSaveLayout}
            disabled={saving || !dirty}
            className="cursor-pointer rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Mentés…" : "Elrendezés mentése"}
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-1.5">
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              locale === l
                ? "border-gold/50 bg-gold/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <div
          className="min-w-0 rounded-2xl border border-border bg-card/30 p-4 sm:p-6"
          onClick={() => setSelectedId(null)}
        >
          {items === null ? (
            <p className="text-sm text-muted-foreground">Betöltés…</p>
          ) : (
            <DndContext
              id="page-layout-dnd"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveDrag(null)}
            >
              <div className="flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
                <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                  {items.map((item) => (
                    <PageLayoutItem
                      key={item.id}
                      item={item}
                      locale={locale}
                      dict={dict}
                      overrides={overrides}
                      selected={selectedId === item.id}
                      onSelect={setSelectedId}
                      onToggleHidden={toggleHidden}
                      onDeleteBlock={deleteBlock}
                    />
                  ))}
                </SortableContext>
              </div>

              <div className="mt-6 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                {PAGE_LAYOUT_ADDABLE_TYPES.map(({ type, label }) => (
                  <PaletteItem key={type} type={type} label={label} onClick={() => addBlock(type)} />
                ))}
              </div>

              <DragOverlay>
                {activeDrag?.kind === "palette" && (
                  <div className="rounded-full border border-gold/50 bg-card px-4 py-2 text-sm font-medium shadow-lg shadow-black/20">
                    {TYPE_LABELS[activeDrag.blockType]}
                  </div>
                )}
                {activeDrag?.kind === "item" && (
                  <div className="rounded-2xl border border-gold/50 bg-card px-5 py-3 text-sm font-medium shadow-lg shadow-black/20">
                    {activeDrag.item.kind === "section"
                      ? (getSectionSchema(activeDrag.item.sectionKey)?.label ?? activeDrag.item.sectionKey)
                      : TYPE_LABELS[activeDrag.item.block.type]}
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          )}
        </div>

        <div className="lg:sticky lg:top-6">
          {selectedItem?.kind === "section" && selectedSchema && selectedContent ? (
            <div className="rounded-2xl border border-border bg-card/60 p-5 shadow-md shadow-black/10">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading text-lg font-semibold">{selectedSchema.label}</h2>
                {selectedEdited && (
                  <button
                    type="button"
                    onClick={() => handleSectionRevert(selectedItem.sectionKey)}
                    className="cursor-pointer text-xs font-medium text-destructive hover:underline"
                  >
                    Visszaállítás
                  </button>
                )}
              </div>
              <div className="mt-4">
                <SiteSectionForm
                  key={`${selectedItem.sectionKey}-${inspectorVersion}`}
                  schema={selectedSchema}
                  initialContent={selectedContent}
                  onSave={(content) => handleSectionSave(selectedItem.sectionKey, content)}
                />
              </div>
            </div>
          ) : selectedItem?.kind === "block" ? (
            <BlockEditorCard
              block={selectedItem.block}
              onChange={(next) => updateBlockContent(selectedItem.id, next)}
              onMoveUp={() => moveBlock(selectedItem.id, -1)}
              onMoveDown={() => moveBlock(selectedItem.id, 1)}
              onDelete={() => deleteBlock(selectedItem.id)}
              canMoveUp={selectedIndex > 0}
              canMoveDown={selectedIndex >= 0 && !!items && selectedIndex < items.length - 1}
            />
          ) : (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Válassz egy elemet a vásznon a szerkesztéshez.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
