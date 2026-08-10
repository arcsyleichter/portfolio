"use client";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Block, BlockType } from "@/lib/builder/types";
import type { ContainerId } from "@/lib/builder/block-tree";
import { columnContainerId, columnEndDropId } from "@/lib/builder/block-tree";
import { CanvasBlock } from "./canvas-block";
import { ContainerEndDropZone } from "./container-end-drop-zone";
import { useBuilderDndUi } from "./builder-dnd-ui-context";

const NESTED_QUICK_ADD: { type: BlockType; label: string }[] = [
  { type: "heading", label: "Cím" },
  { type: "richtext", label: "Szöveg" },
  { type: "image", label: "Kép" },
];

interface Props {
  blocks: Block[];
  columnsBlockId: string;
  columnIndex: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAddBlock: (containerId: ContainerId, type: BlockType) => void;
}

export function CanvasColumn({ blocks, columnsBlockId, columnIndex, selectedId, onSelect, onDelete, onAddBlock }: Props) {
  const { dragState } = useBuilderDndUi();
  const containerId = columnContainerId(columnsBlockId, columnIndex);

  return (
    <div className="flex min-h-16 flex-col gap-3 rounded-lg">
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        {blocks.map((block, i) => (
          <CanvasBlock
            key={block.id}
            block={block}
            containerId={containerId}
            index={i}
            selectedId={selectedId}
            onSelect={onSelect}
            onDelete={onDelete}
            onAddBlock={onAddBlock}
          />
        ))}
      </SortableContext>

      {blocks.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-4">
          <p className="text-xs text-muted-foreground">Üres oszlop</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {NESTED_QUICK_ADD.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddBlock(containerId, t.type);
                }}
                className="cursor-pointer rounded-full border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
              >
                + {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <ContainerEndDropZone id={columnEndDropId(columnsBlockId, columnIndex)} active={dragState !== null} />
    </div>
  );
}
