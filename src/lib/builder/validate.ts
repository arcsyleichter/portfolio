import { z } from "zod";
import { locales } from "@/lib/i18n/config";
import type { Block } from "./types";

const animationSchema = z.object({
  trigger: z.enum(["onLoad", "onScroll", "onHover", "none"]),
  effect: z.enum(["none", "fade", "slideUp", "slideLeft", "scale"]),
  duration: z.number().min(0).max(10),
  delay: z.number().min(0).max(10),
  easing: z.enum(["linear", "easeIn", "easeOut", "easeInOut", "brandEase"]),
});

const alignSchema = z.enum(["left", "center", "right"]);
const spacingSchema = z.enum(["none", "sm", "md", "lg", "xl"]);
const radiusSchema = z.enum(["none", "sm", "md", "lg", "xl", "2xl", "full"]);
const maxWidthSchema = z.enum(["prose", "narrow", "content", "wide", "full"]);

// Tiptap documents are arbitrary recursive JSON — validated structurally
// (must be a plain object with a "type" string) rather than modeling every
// node/mark type, which would just duplicate Tiptap's own schema.
const tiptapDocSchema: z.ZodType<Record<string, unknown>> = z.looseObject({
  type: z.string(),
});

const baseBlockSchema = z.object({
  id: z.string().min(1),
  animation: animationSchema.optional(),
});

const headingBlockSchema = baseBlockSchema.extend({
  type: z.literal("heading"),
  content: z.object({
    text: z.string(),
    level: z.enum(["h1", "h2", "h3", "h4"]),
  }),
  style: z.object({
    align: alignSchema,
    gradientText: z.boolean(),
    spacing: spacingSchema,
  }),
});

const richTextBlockSchema = baseBlockSchema.extend({
  type: z.literal("richtext"),
  content: z.object({ doc: tiptapDocSchema }),
  style: z.object({ maxWidth: maxWidthSchema, align: alignSchema }),
});

const imageBlockSchema = baseBlockSchema.extend({
  type: z.literal("image"),
  content: z.object({
    blobKey: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  }),
  style: z.object({
    radius: radiusSchema,
    maxWidth: maxWidthSchema,
    align: alignSchema,
  }),
});

const buttonBlockSchema = baseBlockSchema.extend({
  type: z.literal("button"),
  content: z.object({ label: z.string(), href: z.string() }),
  style: z.object({
    variant: z.enum(["primary", "secondary", "outline"]),
    align: alignSchema,
  }),
});

const spacerBlockSchema = baseBlockSchema.extend({
  type: z.literal("spacer"),
  content: z.object({}),
  style: z.object({ height: spacingSchema }),
});

// `columns` nests full block lists, so it's tied together with
// z.lazy(() => blockSchema) below rather than being fully self-contained.
const columnsBlockSchemaShape = {
  type: z.literal("columns"),
  style: z.object({
    ratio: z.enum(["50/50", "60/40", "33/33/33"]),
    gap: spacingSchema,
  }),
};

export const blockSchema: z.ZodType<Block> = z.lazy(() =>
  z.discriminatedUnion("type", [
    headingBlockSchema,
    richTextBlockSchema,
    imageBlockSchema,
    buttonBlockSchema,
    spacerBlockSchema,
    baseBlockSchema.extend({
      ...columnsBlockSchemaShape,
      content: z.object({ columns: z.array(z.array(blockSchema)) }),
    }),
  ]),
);

export const blogPostDocumentSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "csak kisbetű, szám és kötőjel"),
  locale: z.enum(locales),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500),
  coverImageKey: z.string().optional(),
  status: z.enum(["draft", "published"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  seo: z
    .object({
      metaTitle: z.string().max(200).optional(),
      metaDescription: z.string().max(300).optional(),
    })
    .optional(),
  blocks: z.array(blockSchema),
});
