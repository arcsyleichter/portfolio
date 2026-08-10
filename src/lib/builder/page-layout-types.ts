import type { Block } from "./types";
import { SECTION_KEYS, type SectionKey } from "./site-content-schema";

/**
 * One row in the homepage's admin-editable composition: either a pointer to
 * one of the 10 built-in bespoke sections (reorderable, hideable, but never
 * deletable/duplicable — see the plan for why), or a freeform Block reusing
 * the exact same block system the blog editor uses.
 */
export type PageItem =
  | { id: SectionKey; kind: "section"; sectionKey: SectionKey; hidden: boolean }
  | { id: string; kind: "block"; block: Block };

/**
 * The default composition when no page_layout row exists yet: all 10
 * sections, today's fixed order, nothing hidden. This is what makes rollout
 * a zero-migration, zero-visual-change change — see the plan.
 */
export function defaultPageItems(): PageItem[] {
  return SECTION_KEYS.map((sectionKey) => ({
    id: sectionKey,
    kind: "section",
    sectionKey,
    hidden: false,
  }));
}
