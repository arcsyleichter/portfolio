"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block } from "@/lib/builder/types";
import { BlockEditorCard } from "./block-editor-card";

interface Props {
  block: Block;
  onChange: (block: Block) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  showInsertionLineBefore: boolean;
}

export function SortableBlockCard({ block, showInsertionLineBefore, ...rest }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: { type: "block" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {showInsertionLineBefore && (
        <div className="absolute -top-2.5 left-0 right-0 z-10 h-1 rounded-full bg-gold" aria-hidden />
      )}
      <div className={isDragging ? "opacity-40" : ""}>
        <BlockEditorCard block={block} {...rest} dragHandleAttributes={attributes} dragHandleListeners={listeners} />
      </div>
    </div>
  );
}
