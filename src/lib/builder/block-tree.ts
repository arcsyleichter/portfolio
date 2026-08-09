import type { Block } from "./types";

/**
 * A "container" is any place a flat list of blocks lives: the document root,
 * or one specific column of one specific columns-block. Columns can't nest
 * (enforced at the call sites that build new blocks), so this two-level
 * addressing scheme is exhaustive — no need for a general tree path.
 */
export type ContainerId = string;
export const ROOT_CONTAINER: ContainerId = "root";

export function columnContainerId(columnsBlockId: string, columnIndex: number): ContainerId {
  return `col:${columnsBlockId}:${columnIndex}`;
}

export function columnEndDropId(columnsBlockId: string, columnIndex: number): string {
  return `col-end:${columnsBlockId}:${columnIndex}`;
}

function parseColumnContainer(containerId: ContainerId): { blockId: string; columnIndex: number } | null {
  if (!containerId.startsWith("col:")) return null;
  const [, blockId, colIndexStr] = containerId.split(":");
  return { blockId, columnIndex: Number(colIndexStr) };
}

export function getContainerBlocks(blocks: Block[], containerId: ContainerId): Block[] {
  if (containerId === ROOT_CONTAINER) return blocks;
  const parsed = parseColumnContainer(containerId);
  if (!parsed) return [];
  const owner = blocks.find((b) => b.id === parsed.blockId);
  if (!owner || owner.type !== "columns") return [];
  return owner.content.columns[parsed.columnIndex] ?? [];
}

export function setContainerBlocks(blocks: Block[], containerId: ContainerId, next: Block[]): Block[] {
  if (containerId === ROOT_CONTAINER) return next;
  const parsed = parseColumnContainer(containerId);
  if (!parsed) return blocks;
  return blocks.map((b) => {
    if (b.id !== parsed.blockId || b.type !== "columns") return b;
    const columns = b.content.columns.map((c, i) => (i === parsed.columnIndex ? next : c));
    return { ...b, content: { columns } };
  });
}

export function findContainerOf(blocks: Block[], blockId: string): ContainerId | null {
  if (blocks.some((b) => b.id === blockId)) return ROOT_CONTAINER;
  for (const b of blocks) {
    if (b.type === "columns") {
      for (let i = 0; i < b.content.columns.length; i++) {
        if (b.content.columns[i].some((n) => n.id === blockId)) return columnContainerId(b.id, i);
      }
    }
  }
  return null;
}

export function findBlock(blocks: Block[], blockId: string): Block | null {
  for (const b of blocks) {
    if (b.id === blockId) return b;
    if (b.type === "columns") {
      for (const col of b.content.columns) {
        const found = col.find((n) => n.id === blockId);
        if (found) return found;
      }
    }
  }
  return null;
}

/** Maps a dnd-kit `over.id` (a block id, or one of the synthetic end-of-list ids) to a container + insertion index. */
export function resolveDropTarget(blocks: Block[], overId: string): { containerId: ContainerId; index: number } | null {
  if (overId === "canvas-end") {
    return { containerId: ROOT_CONTAINER, index: getContainerBlocks(blocks, ROOT_CONTAINER).length };
  }
  if (overId.startsWith("col-end:")) {
    const [, blockId, colIndexStr] = overId.split(":");
    const containerId = columnContainerId(blockId, Number(colIndexStr));
    return { containerId, index: getContainerBlocks(blocks, containerId).length };
  }
  const containerId = findContainerOf(blocks, overId);
  if (!containerId) return null;
  const container = getContainerBlocks(blocks, containerId);
  const index = container.findIndex((b) => b.id === overId);
  return { containerId, index: index === -1 ? container.length : index };
}

/** Moves an existing block — within the same container (reorder) or across containers. */
export function moveBlockInTree(
  blocks: Block[],
  blockId: string,
  sourceContainerId: ContainerId,
  destContainerId: ContainerId,
  destIndexOriginal: number,
): Block[] {
  const source = getContainerBlocks(blocks, sourceContainerId);
  const sourceIndex = source.findIndex((b) => b.id === blockId);
  if (sourceIndex === -1) return blocks;
  const moving = source[sourceIndex];

  if (sourceContainerId === destContainerId) {
    // Removing the item first shifts every later index left by one, so a
    // target position that was after it needs the same adjustment.
    const adjusted = destIndexOriginal > sourceIndex ? destIndexOriginal - 1 : destIndexOriginal;
    const next = [...source];
    next.splice(sourceIndex, 1);
    next.splice(Math.max(0, Math.min(adjusted, next.length)), 0, moving);
    return setContainerBlocks(blocks, sourceContainerId, next);
  }

  const sourceNext = source.filter((b) => b.id !== blockId);
  const dest = getContainerBlocks(blocks, destContainerId);
  const destNext = [...dest];
  destNext.splice(Math.max(0, Math.min(destIndexOriginal, destNext.length)), 0, moving);

  const withSourceUpdated = setContainerBlocks(blocks, sourceContainerId, sourceNext);
  return setContainerBlocks(withSourceUpdated, destContainerId, destNext);
}

export function insertBlockInTree(blocks: Block[], containerId: ContainerId, index: number, newBlock: Block): Block[] {
  const container = getContainerBlocks(blocks, containerId);
  const next = [...container];
  next.splice(Math.max(0, Math.min(index, next.length)), 0, newBlock);
  return setContainerBlocks(blocks, containerId, next);
}
