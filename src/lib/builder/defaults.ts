import type { Block, BlockType, BlogPostDocument } from "./types";

function id(): string {
  return crypto.randomUUID();
}

const emptyDoc = { type: "doc", content: [{ type: "paragraph" }] };

export function createBlock(type: BlockType): Block {
  switch (type) {
    case "heading":
      return {
        id: id(),
        type: "heading",
        content: { text: "Új cím", level: "h2" },
        style: { align: "left", gradientText: false, spacing: "md" },
      };
    case "richtext":
      return {
        id: id(),
        type: "richtext",
        content: { doc: emptyDoc },
        style: { maxWidth: "prose", align: "left" },
      };
    case "image":
      return {
        id: id(),
        type: "image",
        content: { blobKey: "", alt: "" },
        style: { radius: "xl", maxWidth: "content", align: "center" },
      };
    case "button":
      return {
        id: id(),
        type: "button",
        content: { label: "Kattints ide", href: "#" },
        style: { variant: "primary", align: "left" },
      };
    case "spacer":
      return {
        id: id(),
        type: "spacer",
        content: {},
        style: { height: "md" },
      };
    case "columns":
      return {
        id: id(),
        type: "columns",
        content: { columns: [[], []] },
        style: { ratio: "50/50", gap: "md" },
      };
  }
}

const COMBINING_DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "") // strip accents (á, é, ő, ű, ...)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function createEmptyDocument(locale: BlogPostDocument["locale"], slug: string): BlogPostDocument {
  const now = new Date().toISOString();
  return {
    slug,
    locale,
    title: "",
    excerpt: "",
    status: "draft",
    createdAt: now,
    updatedAt: now,
    blocks: [],
  };
}
