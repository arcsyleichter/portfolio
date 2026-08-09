import "server-only";
import type { Locale } from "@/lib/i18n/config";
import type { BlogPostDocument, PostSummary } from "./types";
import { getPool, ensureSchema, POSTS_TABLE, IMAGES_TABLE } from "./db";

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
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT doc FROM ${POSTS_TABLE} WHERE locale = $1 AND slug = $2`, [
    locale,
    slug,
  ]);
  return (rows[0]?.doc as BlogPostDocument | undefined) ?? null;
}

export async function savePost(doc: BlogPostDocument): Promise<void> {
  await ensureSchema();
  await getPool().query(
    `INSERT INTO ${POSTS_TABLE} (locale, slug, doc, status, updated_at, published_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (locale, slug)
     DO UPDATE SET doc = $3, status = $4, updated_at = $5, published_at = $6`,
    [doc.locale, doc.slug, JSON.stringify(doc), doc.status, doc.updatedAt, doc.publishedAt ?? null],
  );
}

export async function deletePost(locale: Locale, slug: string): Promise<void> {
  await ensureSchema();
  await getPool().query(`DELETE FROM ${POSTS_TABLE} WHERE locale = $1 AND slug = $2`, [locale, slug]);
}

/** Admin-only: every post, every locale, every status. */
export async function listAllPosts(): Promise<PostSummary[]> {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT doc FROM ${POSTS_TABLE} ORDER BY updated_at DESC`);
  return rows.map((r) => toSummary(r.doc as BlogPostDocument));
}

/** Public: only published posts for the given locale, newest first. */
export async function listPublishedPosts(locale: Locale): Promise<PostSummary[]> {
  await ensureSchema();
  const { rows } = await getPool().query(
    `SELECT doc FROM ${POSTS_TABLE} WHERE locale = $1 AND status = 'published' ORDER BY published_at DESC NULLS LAST`,
    [locale],
  );
  return rows.map((r) => toSummary(r.doc as BlogPostDocument));
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(0, 80);
}

export async function saveImage(bytes: ArrayBuffer, contentType: string, filename: string): Promise<string> {
  await ensureSchema();
  const key = `${crypto.randomUUID()}-${sanitizeFilename(filename)}`;
  await getPool().query(`INSERT INTO ${IMAGES_TABLE} (key, data, content_type) VALUES ($1, $2, $3)`, [
    key,
    Buffer.from(bytes),
    contentType,
  ]);
  return key;
}

export async function getImage(key: string): Promise<{ data: ArrayBuffer; contentType: string } | null> {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT data, content_type FROM ${IMAGES_TABLE} WHERE key = $1`, [key]);
  const row = rows[0] as { data: Buffer; content_type: string } | undefined;
  if (!row) return null;
  const { data: buf } = row;
  return {
    // Node's pg driver always backs this with a real ArrayBuffer, never SharedArrayBuffer.
    data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
    contentType: row.content_type,
  };
}

export async function deleteImage(key: string): Promise<void> {
  await ensureSchema();
  await getPool().query(`DELETE FROM ${IMAGES_TABLE} WHERE key = $1`, [key]);
}
