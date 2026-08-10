"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block, BlockType } from "@/lib/builder/types";
import type { ContainerId } from "@/lib/builder/block-tree";
import { TYPE_LABELS } from "./block-editor-card";
import { CanvasBlockView } from "./canvas-block-view";
import { useBuilderDndUi } from "./builder-dnd-ui-context";

interface Props {
  block: Block;
  containerId: ContainerId;
  index: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAddBlock: (containerId: ContainerId, type: BlockType) => void;
}

export function CanvasBlock({ block, containerId, index, selectedId, onSelect, onDelete, onAddBlock }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: { type: "block", containerId },
  });
  const { dragState, overInfo } = useBuilderDndUi();

  const showInsertionLine =
    dragState !== null &&
    overInfo?.containerId === containerId &&
    overInfo.index === index &&
    (dragState.type === "palette" || dragState.sourceContainer !== containerId);

  const selected = selectedId === block.id;
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {showInsertionLine && (
        <div className="absolute -top-2.5 right-0 left-0 z-10 h-1 rounded-full bg-gold" aria-hidden />
      )}

      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect(block.id);
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
              aria-label="Blokk húzása az átrendezéshez"
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
            <span className="px-1 text-xs font-semibold">{TYPE_LABELS[block.type]}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
              }}
              aria-label="Blokk törlése"
              title="Törlés"
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full hover:bg-ink/10"
            >
              ×
            </button>
          </div>
        )}
        <CanvasBlockView
          block={block}
          selectedId={selectedId}
          onSelect={onSelect}
          onDelete={onDelete}
          onAddBlock={onAddBlock}
        />
      </div>
    </div>
  );
}
