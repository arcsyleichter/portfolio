"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block } from "@/lib/builder/types";
import type { ContainerId } from "@/lib/builder/block-tree";
import { BlockEditorCard } from "./block-editor-card";
import { useBuilderDndUi } from "./builder-dnd-ui-context";

interface Props {
  block: Block;
  containerId: ContainerId;
  index: number;
  onChange: (block: Block) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function SortableBlockCard({ block, containerId, index, ...rest }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: { type: "block", containerId },
  });
  const { dragState, overInfo } = useBuilderDndUi();

  // Same-container reordering already gets dnd-kit's native "make space"
  // animation from useSortable — showing this line there too would double
  // up. It's only needed to signal a drop into a genuinely different
  // container (or a palette insert), where nothing else indicates position.
  const showInsertionLine =
    dragState !== null &&
    overInfo?.containerId === containerId &&
    overInfo.index === index &&
    (dragState.type === "palette" || dragState.sourceContainer !== containerId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {showInsertionLine && (
        <div className="absolute -top-2.5 left-0 right-0 z-10 h-1 rounded-full bg-gold" aria-hidden />
      )}
      <div className={isDragging ? "opacity-40" : ""}>
        <BlockEditorCard block={block} {...rest} dragHandleAttributes={attributes} dragHandleListeners={listeners} />
      </div>
    </div>
  );
}
