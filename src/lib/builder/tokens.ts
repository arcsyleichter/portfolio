import type { AlignToken, MaxWidthToken, RadiusToken, SpacingToken } from "./types";

export const TEXT_ALIGN_CLASSES: Record<AlignToken, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const FLEX_ALIGN_CLASSES: Record<AlignToken, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

/** Vertical margin between a block and its neighbours. */
export const SPACING_CLASSES: Record<SpacingToken, string> = {
  none: "",
  sm: "my-2",
  md: "my-5",
  lg: "my-10",
  xl: "my-16",
};

export const SPACER_HEIGHT_CLASSES: Record<SpacingToken, string> = {
  none: "h-0",
  sm: "h-4",
  md: "h-8",
  lg: "h-16",
  xl: "h-24",
};

/** Gap inside a flex/grid layout (columns block) — a distinct scale from SPACING_CLASSES. */
export const GAP_CLASSES: Record<SpacingToken, string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-6",
  lg: "gap-10",
  xl: "gap-16",
};

export const RADIUS_CLASSES: Record<RadiusToken, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export const MAX_WIDTH_CLASSES: Record<MaxWidthToken, string> = {
  prose: "max-w-prose",
  narrow: "max-w-md",
  content: "max-w-2xl",
  wide: "max-w-4xl",
  full: "max-w-full",
};
