"use client";

import { createContext, useContext } from "react";
import type { BlockType } from "@/lib/builder/types";
import type { ContainerId } from "@/lib/builder/block-tree";

export type BuilderDragState =
  | { type: "block"; blockId: string; sourceContainer: ContainerId }
  | { type: "palette"; blockType: BlockType }
  | null;

export interface BuilderDndUi {
  dragState: BuilderDragState;
  overInfo: { containerId: ContainerId; index: number } | null;
}

const BuilderDndUiContext = createContext<BuilderDndUi>({ dragState: null, overInfo: null });

export const BuilderDndUiProvider = BuilderDndUiContext.Provider;

export function useBuilderDndUi(): BuilderDndUi {
  return useContext(BuilderDndUiContext);
}
