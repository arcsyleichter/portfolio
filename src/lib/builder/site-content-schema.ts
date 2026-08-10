export const SECTION_KEYS = [
  "hero",
  "about",
  "services",
  "projects",
  "styleShowcase",
  "process",
  "tech",
  "testimonials",
  "pricing",
  "contact",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export function isSectionKey(value: string): value is SectionKey {
  return (SECTION_KEYS as readonly string[]).includes(value);
}

/**
 * A small set of reusable field kinds, declaratively describing how to edit
 * one property of a section's content — rendered generically by
 * SiteSectionForm the same way BlockEditorCard switches on block.type, just
 * switching on field kind instead. Section-specific shape lives in the DATA
 * (site-sections.ts), not in bespoke per-section form components.
 */
export type FieldKind =
  | { kind: "string"; maxLength?: number }
  | { kind: "text"; maxLength?: number }
  | { kind: "boolean" }
  | { kind: "select"; options: { value: string; label: string }[] }
  /** Displayed, never editable — for values other data (icons, gradients, mockup lookups) is keyed by. */
  | { kind: "readonly" }
  | { kind: "stringArray"; itemLabel: string; maxLength?: number }
  /** Fixed-length by construction — items are edited in place, never added/removed/reordered (v1 constraint, see plan). */
  | { kind: "objectArray"; itemLabel: string; fields: FieldDef[] };

export interface FieldDef {
  key: string;
  label: string;
  field: FieldKind;
}

export interface SectionSchema {
  key: SectionKey;
  label: string;
  fields: FieldDef[];
}
