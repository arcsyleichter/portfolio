"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { PageItem } from "@/lib/builder/page-layout-types";
import type { SectionKey } from "@/lib/builder/site-content-schema";
import { getSectionSchema } from "@/lib/builder/site-sections";
import { SECTION_COMPONENTS } from "@/components/sections/section-registry";
import { TYPE_LABELS } from "./block-editor-card";
import { CanvasBlockView } from "./canvas-block-view";

interface Props {
  item: PageItem;
  locale: Locale;
  dict: Dictionary;
  overrides: Partial<Record<SectionKey, unknown>>;
  selected: boolean;
  onSelect: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onDeleteBlock: (id: string) => void;
}

export function PageLayoutItem({
  item,
  locale,
  dict,
  overrides,
  selected,
  onSelect,
  onToggleHidden,
  onDeleteBlock,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const label =
    item.kind === "section" ? (getSectionSchema(item.sectionKey)?.label ?? item.sectionKey) : TYPE_LABELS[item.block.type];
  const hidden = item.kind === "section" && item.hidden;

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.id);
        }}
        className={`relative cursor-pointer rounded-lg outline-2 outline-offset-4 transition-all ${
          selected ? "outline-gold" : "outline-transparent hover:outline-border"
        } ${isDragging ? "opacity-40" : ""}`}
      >
        {selected && (
          <div className="absolute -top-9 left-0 z-10 flex items-center gap-1 rounded-full bg-gradient-brand px-1 py-1 text-ink shadow-lg shadow-gold/20">
            <button
              type="button"
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
              aria-label="Húzása az átrendezéshez"
              title="Húzd az átrendezéshez"
              style={{ touchAction: "none" }}
              className="flex h-6 w-6 cursor-grab items-center justify-center rounded-full hover:bg-ink/10 active:cursor-grabbing"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <circle cx="9" cy="6" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="9" cy="18" r="1.5" />
                <circle cx="15" cy="6" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="15" cy="18" r="1.5" />
              </svg>
            </button>
            <span className="px-1 text-xs font-semibold">{label}</span>
            {item.kind === "section" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHidden(item.id);
                }}
                aria-label={hidden ? "Szekció megjelenítése" : "Szekció elrejtése"}
                title={hidden ? "Megjelenítés" : "Elrejtés"}
                className="flex h-6 items-center justify-center rounded-full px-2 text-xs hover:bg-ink/10"
              >
                {hidden ? "Megjelenítés" : "Elrejtés"}
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBlock(item.id);
                }}
                aria-label="Blokk törlése"
                title="Törlés"
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-ink/10"
              >
                ×
              </button>
            )}
          </div>
        )}

        {item.kind === "section" ? (
          hidden ? (
            <div className="flex items-center justify-between rounded-xl border border-dashed border-border bg-card/30 px-5 py-4 text-sm text-muted-foreground">
              <span>{label}</span>
              <span className="rounded-full border border-border px-2.5 py-1 text-xs">Rejtve</span>
            </div>
          ) : (
            <div className="pointer-events-none">
              {SECTION_COMPONENTS[item.sectionKey]({ locale, dict, overrides })}
            </div>
          )
        ) : (
          <div className="pointer-events-none px-4 py-6 sm:px-6">
            <CanvasBlockView
              block={item.block}
              selectedId={null}
              onSelect={() => {}}
              onDelete={() => {}}
              onAddBlock={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
}
