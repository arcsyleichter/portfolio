import type { JSONContent } from "@tiptap/react";
import type { Locale } from "@/lib/i18n/config";

export type BlockId = string;

export type AnimationTrigger = "onLoad" | "onScroll" | "onHover" | "none";
export type AnimationEffect = "none" | "fade" | "slideUp" | "slideLeft" | "scale";
export type AnimationEasing = "linear" | "easeIn" | "easeOut" | "easeInOut" | "brandEase";

export interface BlockAnimation {
  trigger: AnimationTrigger;
  effect: AnimationEffect;
  /** seconds */
  duration: number;
  /** seconds */
  delay: number;
  easing: AnimationEasing;
}

/**
 * Style props are references into the brand's design tokens (globals.css),
 * never raw CSS values — this is what keeps builder output on-brand instead
 * of an arbitrary CSS sandbox.
 */
export type ToneToken = "gold" | "gold-light" | "charcoal" | "tech-blue" | "tech-blue-light" | "cream" | "ink";
export type SpacingToken = "none" | "sm" | "md" | "lg" | "xl";
export type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type MaxWidthToken = "prose" | "narrow" | "content" | "wide" | "full";
export type AlignToken = "left" | "center" | "right";

interface BaseBlock {
  id: BlockId;
  /** Absent = static, no motion wrapper at all. */
  animation?: BlockAnimation;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  content: { text: string; level: "h1" | "h2" | "h3" | "h4" };
  style: { align: AlignToken; gradientText: boolean; spacing: SpacingToken };
}

export interface RichTextBlock extends BaseBlock {
  type: "richtext";
  /** Tiptap ProseMirror document JSON — never raw HTML (avoids dangerouslySetInnerHTML). */
  content: { doc: JSONContent };
  style: { maxWidth: MaxWidthToken; align: AlignToken };
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  content: { blobKey: string; alt: string; caption?: string };
  style: { radius: RadiusToken; maxWidth: MaxWidthToken; align: AlignToken };
}

export interface ButtonBlock extends BaseBlock {
  type: "button";
  content: { label: string; href: string };
  style: { variant: "primary" | "secondary" | "outline"; align: AlignToken };
}

export interface SpacerBlock extends BaseBlock {
  type: "spacer";
  content: Record<string, never>;
  style: { height: SpacingToken };
}

export interface ColumnsBlock extends BaseBlock {
  type: "columns";
  /** Recursive — each column is its own block list. */
  content: { columns: Block[][] };
  style: { ratio: "50/50" | "60/40" | "33/33/33"; gap: SpacingToken };
}

export type Block =
  | HeadingBlock
  | RichTextBlock
  | ImageBlock
  | ButtonBlock
  | SpacerBlock
  | ColumnsBlock;

export type BlockType = Block["type"];

export interface BlogPostDocument {
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  coverImageKey?: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
  blocks: Block[];
}

export interface PostSummary {
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  coverImageKey?: string;
  status: "draft" | "published";
  updatedAt: string;
  publishedAt?: string;
}
