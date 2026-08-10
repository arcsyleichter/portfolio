import "server-only";
import type { Locale } from "@/lib/i18n/config";
import type { CustomPageDocument, CustomPageSummary } from "./types";
import { getPool, ensureSchema, CUSTOM_PAGES_TABLE } from "./db";

function toSummary(doc: CustomPageDocument): CustomPageSummary {
  return {
    slug: doc.slug,
    locale: doc.locale,
    title: doc.title,
    status: doc.status,
    updatedAt: doc.updatedAt,
    publishedAt: doc.publishedAt,
  };
}

export async function getCustomPage(locale: Locale, slug: string): Promise<CustomPageDocument | null> {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT doc FROM ${CUSTOM_PAGES_TABLE} WHERE locale = $1 AND slug = $2`, [
    locale,
    slug,
  ]);
  return (rows[0]?.doc as CustomPageDocument | undefined) ?? null;
}

export async function saveCustomPage(doc: CustomPageDocument): Promise<void> {
  await ensureSchema();
  await getPool().query(
    `INSERT INTO ${CUSTOM_PAGES_TABLE} (locale, slug, doc, status, updated_at, published_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (locale, slug)
     DO UPDATE SET doc = $3, status = $4, updated_at = $5, published_at = $6`,
    [doc.locale, doc.slug, JSON.stringify(doc), doc.status, doc.updatedAt, doc.publishedAt ?? null],
  );
}

export async function deleteCustomPage(locale: Locale, slug: string): Promise<void> {
  await ensureSchema();
  await getPool().query(`DELETE FROM ${CUSTOM_PAGES_TABLE} WHERE locale = $1 AND slug = $2`, [locale, slug]);
}

/** Admin-only: every custom page, every locale, every status. */
export async function listAllCustomPages(): Promise<CustomPageSummary[]> {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT doc FROM ${CUSTOM_PAGES_TABLE} ORDER BY updated_at DESC`);
  return rows.map((r) => toSummary(r.doc as CustomPageDocument));
}

/** Public: only the published page for a locale+slug — null if missing or draft. */
export async function getPublishedCustomPage(locale: Locale, slug: string): Promise<CustomPageDocument | null> {
  const doc = await getCustomPage(locale, slug);
  return doc && doc.status === "published" ? doc : null;
}
