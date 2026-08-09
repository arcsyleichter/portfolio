"use client";

import { useDraggable } from "@dnd-kit/core";
import type { BlockType } from "@/lib/builder/types";

export function PaletteItem({ type, label, onClick }: { type: BlockType; label: string; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type: "palette", blockType: type },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-0.5 rounded-full border border-border pr-1 transition-colors ${
        isDragging ? "opacity-50" : "hover:bg-muted"
      }`}
    >
      <button type="button" onClick={onClick} className="cursor-pointer rounded-full py-2 pl-4 pr-1 text-sm font-medium">
        {label}
      </button>
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`${label} húzása a kívánt pozícióba`}
        title="Húzd a kívánt pozícióba"
        style={{ touchAction: "none" }}
        className="flex h-7 w-7 cursor-grab items-center justify-center rounded-full text-muted-foreground hover:bg-border/60 active:cursor-grabbing"
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
    </div>
  );
}
