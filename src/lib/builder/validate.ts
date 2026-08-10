import { z } from "zod";
import { locales } from "@/lib/i18n/config";
import type { Block } from "./types";
import { SECTION_KEYS, type SectionKey } from "./site-content-schema";

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
const toneSchema = z.enum(["gold", "gold-light", "charcoal", "tech-blue", "tech-blue-light", "cream", "ink"]);

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

const galleryBlockSchema = baseBlockSchema.extend({
  type: z.literal("gallery"),
  content: z.object({
    images: z.array(z.object({ blobKey: z.string(), alt: z.string() })),
  }),
  style: z.object({
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]),
    radius: radiusSchema,
    gap: spacingSchema,
  }),
});

const carouselBlockSchema = baseBlockSchema.extend({
  type: z.literal("carousel"),
  content: z.object({
    slides: z.array(z.object({ blobKey: z.string(), alt: z.string(), caption: z.string().optional() })),
  }),
  style: z.object({ radius: radiusSchema, maxWidth: maxWidthSchema }),
});

const ctaBlockSchema = baseBlockSchema.extend({
  type: z.literal("cta"),
  content: z.object({
    heading: z.string(),
    text: z.string(),
    buttonLabel: z.string(),
    buttonHref: z.string(),
  }),
  style: z.object({ tone: toneSchema, align: alignSchema }),
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
    galleryBlockSchema,
    carouselBlockSchema,
    ctaBlockSchema,
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

// Slugs that must never be assignable to a custom page — "blog" is a
// literal, static route segment under [locale]/, so a page saved with this
// slug would be permanently unreachable (the static route always wins).
export const RESERVED_PAGE_SLUGS = ["blog"] as const;

export const customPageDocumentSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "csak kisbetű, szám és kötőjel")
    .refine((s) => !(RESERVED_PAGE_SLUGS as readonly string[]).includes(s), "ez a slug foglalt"),
  locale: z.enum(locales),
  title: z.string().min(1).max(200),
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

// --- Homepage section content ---------------------------------------------
//
// Each schema mirrors one root key of the i18n dictionaries exactly (see
// src/lib/i18n/dictionaries/hu.json). Object arrays use .length(N) matching
// today's exact count — items are index/id-coupled to hardcoded icons,
// gradients, or mockup lookups in the section components, so cardinality is
// a deliberate v1 constraint (edit each item in place; no add/remove/
// reorder — see the plan). Plain string-list fields (no such coupling) use
// a looser bound instead of forcing an exact count.

const stat = z.object({ value: z.string().max(20), label: z.string().max(200) });

const heroContentSchema = z.object({
  eyebrow: z.string().max(200),
  title1: z.string().max(200),
  title2: z.string().max(200),
  subtitle: z.string().max(500),
  ctaPrimary: z.string().max(60),
  ctaSecondary: z.string().max(60),
  stats: z.array(stat).length(3),
});

const aboutContentSchema = z.object({
  eyebrow: z.string().max(200),
  title: z.string().max(300),
  paragraphs: z.array(z.string().max(500)).min(1).max(8),
  highlights: z.array(z.string().max(200)).min(1).max(8),
  highlightsLabel: z.string().max(60),
});

const serviceItem = z.object({
  title: z.string().max(200),
  description: z.string().max(500),
  tags: z.array(z.string().max(40)).min(0).max(8),
});

const servicesContentSchema = z.object({
  eyebrow: z.string().max(200),
  title: z.string().max(300),
  subtitle: z.string().max(500),
  items: z.array(serviceItem).length(3),
});

const projectItem = z.object({
  id: z.string().max(60),
  kind: z.enum(["live", "demo"]),
  title: z.string().max(200),
  summary: z.string().max(500),
  tags: z.array(z.string().max(40)).min(0).max(8),
});

const projectsContentSchema = z.object({
  eyebrow: z.string().max(200),
  title: z.string().max(300),
  subtitle: z.string().max(500),
  liveBadge: z.string().max(60),
  demoBadge: z.string().max(60),
  demoNote: z.string().max(500),
  cta: z.string().max(60),
  items: z.array(projectItem).length(4),
});

const styleItem = z.object({
  id: z.string().max(60),
  name: z.string().max(100),
  audience: z.string().max(200),
});

const styleShowcaseContentSchema = z.object({
  eyebrow: z.string().max(200),
  title: z.string().max(300),
  subtitle: z.string().max(500),
  styles: z.array(styleItem).length(10),
});

const processStep = z.object({
  title: z.string().max(100),
  description: z.string().max(500),
});

const processContentSchema = z.object({
  eyebrow: z.string().max(200),
  title: z.string().max(300),
  steps: z.array(processStep).length(6),
});

const techCategory = z.object({
  name: z.string().max(100),
  items: z.array(z.string().max(60)).min(1).max(10),
});

const techContentSchema = z.object({
  eyebrow: z.string().max(200),
  title: z.string().max(300),
  categories: z.array(techCategory).length(4),
});

const testimonialsContentSchema = z.object({
  eyebrow: z.string().max(200),
  title: z.string().max(300),
  comingSoon: z.string().max(300),
});

const pricingTier = z.object({
  name: z.string().max(100),
  description: z.string().max(300),
  features: z.array(z.string().max(100)).min(0).max(10),
  highlighted: z.boolean(),
});

const pricingContentSchema = z.object({
  eyebrow: z.string().max(200),
  title: z.string().max(300),
  subtitle: z.string().max(500),
  cta: z.string().max(60),
  customNote: z.string().max(300),
  popularLabel: z.string().max(60),
  tiers: z.array(pricingTier).length(3),
});

const contactContentSchema = z.object({
  eyebrow: z.string().max(200),
  title: z.string().max(300),
  subtitle: z.string().max(500),
  formName: z.string().max(60),
  formEmail: z.string().max(60),
  formCompany: z.string().max(60),
  formMessage: z.string().max(60),
  formSubmit: z.string().max(60),
  formSending: z.string().max(60),
  formSuccess: z.string().max(300),
  formError: z.string().max(300),
  directTitle: z.string().max(100),
  emailLabel: z.string().max(60),
});

export const sectionContentSchemas: Record<SectionKey, z.ZodType> = {
  hero: heroContentSchema,
  about: aboutContentSchema,
  services: servicesContentSchema,
  projects: projectsContentSchema,
  styleShowcase: styleShowcaseContentSchema,
  process: processContentSchema,
  tech: techContentSchema,
  testimonials: testimonialsContentSchema,
  pricing: pricingContentSchema,
  contact: contactContentSchema,
};

// --- Homepage page layout (composition) ------------------------------------
//
// A page_layout row is an ordered list of PageItem — either a pointer to one
// of the 10 built-in sections (reorderable, hideable, never deletable) or a
// freeform Block reusing blockSchema unchanged. See the plan for why
// membership of the 10 section keys is a hard schema invariant rather than a
// UI convention.

const sectionPageItemSchema = z.object({
  id: z.enum(SECTION_KEYS),
  kind: z.literal("section"),
  sectionKey: z.enum(SECTION_KEYS),
  hidden: z.boolean(),
});

const blockPageItemSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("block"),
  block: blockSchema,
});

export const pageItemSchema = z.discriminatedUnion("kind", [sectionPageItemSchema, blockPageItemSchema]);

export const pageLayoutSchema = z
  .array(pageItemSchema)
  .superRefine((items, ctx) => {
    const sectionItems = items.filter((item) => item.kind === "section");
    const seen = new Map<SectionKey, number>();
    sectionItems.forEach((item, i) => {
      if (item.id !== item.sectionKey) {
        ctx.addIssue({
          code: "custom",
          message: `section item id "${item.id}" must equal its sectionKey "${item.sectionKey}"`,
          path: [i],
        });
      }
      seen.set(item.sectionKey, (seen.get(item.sectionKey) ?? 0) + 1);
    });
    for (const key of SECTION_KEYS) {
      const count = seen.get(key) ?? 0;
      if (count !== 1) {
        ctx.addIssue({
          code: "custom",
          message: `section "${key}" must appear exactly once (found ${count})`,
          path: [],
        });
      }
    }
  });
