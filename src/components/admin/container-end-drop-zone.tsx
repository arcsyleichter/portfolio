"use client";

import { useDroppable } from "@dnd-kit/core";

/** A thin, always-present drop target at the end of a block container — the only way to drop into an empty one. */
export function ContainerEndDropZone({ id, active }: { id: string; active: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  if (!active) return null;
  return (
    <div
      ref={setNodeRef}
      aria-hidden
      className={`h-3 rounded-full transition-colors ${isOver ? "bg-gold" : "bg-transparent"}`}
    />
  );
}
