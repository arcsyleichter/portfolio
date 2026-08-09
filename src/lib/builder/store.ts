import "server-only";
import { getStore } from "@netlify/blobs";
import type { Locale } from "@/lib/i18n/config";
import type { BlogPostDocument, PostSummary } from "./types";

/**
 * True only for a real deployed Netlify runtime (production or a deploy
 * preview) — deliberately NOT true under `netlify dev`, which also sets
 * NETLIFY but additionally sets NETLIFY_DEV. Only the store NAME depends on
 * this — auth is always zero-config (see below), so local testing (via
 * `netlify dev`, the only supported local workflow — plain `next dev` can't
 * reach Blobs at all) never touches production content, without ever
 * needing a raw auth token in `.env.local`.
 */
function isNetlifyProductionRuntime(): boolean {
  return Boolean(process.env.NETLIFY) && process.env.NETLIFY_DEV !== "true";
}

// Netlify Blobs defaults to "eventual" consistency (fast, edge-cached reads
// that can lag behind a write by seconds) — wrong for an editor, where
// saving a post and immediately being redirected to view/edit it must see
// that exact write. "strong" trades a bit of read latency for read-after-
// write correctness, which is what every call here actually needs.
function postsStore() {
  return getStore({ name: isNetlifyProductionRuntime() ? "blog-posts" : "blog-posts-dev", consistency: "strong" });
}

function imagesStore() {
  return getStore({ name: isNetlifyProductionRuntime() ? "blog-images" : "blog-images-dev", consistency: "strong" });
}

function postKey(locale: Locale, slug: string): string {
  return `posts/${locale}/${slug}.json`;
}

function toSummary(doc: BlogPostDocument): PostSummary {
  return {
    slug: doc.slug,
    locale: doc.locale,
    title: doc.title,
    excerpt: doc.excerpt,
    coverImageKey: doc.coverImageKey,
    status: doc.status,
    updatedAt: doc.updatedAt,
    publishedAt: doc.publishedAt,
  };
}

export async function getPost(locale: Locale, slug: string): Promise<BlogPostDocument | null> {
  const doc = await postsStore().get(postKey(locale, slug), { type: "json" });
  return (doc as BlogPostDocument | null) ?? null;
}

export async function savePost(doc: BlogPostDocument): Promise<void> {
  await postsStore().setJSON(postKey(doc.locale, doc.slug), doc);
}

export async function deletePost(locale: Locale, slug: string): Promise<void> {
  await postsStore().delete(postKey(locale, slug));
}

/** Admin-only: every post, every locale, every status. */
export async function listAllPosts(): Promise<PostSummary[]> {
  const store = postsStore();
  const { blobs } = await store.list({ prefix: "posts/" });
  const docs = await Promise.all(
    blobs.map((b) => store.get(b.key, { type: "json" }) as Promise<BlogPostDocument | null>),
  );
  return docs
    .filter((d): d is BlogPostDocument => d !== null)
    .map(toSummary)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Public: only published posts for the given locale, newest first. */
export async function listPublishedPosts(locale: Locale): Promise<PostSummary[]> {
  const store = postsStore();
  const { blobs } = await store.list({ prefix: `posts/${locale}/` });
  const docs = await Promise.all(
    blobs.map((b) => store.get(b.key, { type: "json" }) as Promise<BlogPostDocument | null>),
  );
  return docs
    .filter((d): d is BlogPostDocument => d !== null && d.status === "published")
    .map(toSummary)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(0, 80);
}

export async function saveImage(bytes: ArrayBuffer, contentType: string, filename: string): Promise<string> {
  // No "images/" prefix needed — this is a dedicated images-only store, not
  // shared namespace with posts, so the key IS the whole identifier.
  const key = `${crypto.randomUUID()}-${sanitizeFilename(filename)}`;
  await imagesStore().set(key, bytes, { metadata: { contentType } });
  return key;
}

export async function getImage(key: string): Promise<{ data: ArrayBuffer; contentType: string } | null> {
  const result = await imagesStore().getWithMetadata(key, { type: "arrayBuffer" });
  if (!result) return null;
  const contentType =
    typeof result.metadata?.contentType === "string" ? result.metadata.contentType : "application/octet-stream";
  return { data: result.data as ArrayBuffer, contentType };
}

export async function deleteImage(key: string): Promise<void> {
  await imagesStore().delete(key);
}
