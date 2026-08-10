import "server-only";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/lib/i18n/config";
import { getPool, ensureSchema, PAGE_LAYOUT_TABLE } from "./db";
import { defaultPageItems, type PageItem } from "./page-layout-types";

export function pageLayoutCacheTag(locale: Locale): string {
  return `page-layout-${locale}`;
}

/** The saved composition for a locale, or the default (today's fixed 10-section order) if none was ever saved. */
export async function getPageLayout(locale: Locale): Promise<PageItem[]> {
  await ensureSchema();
  const { rows } = await getPool().query(`SELECT items FROM ${PAGE_LAYOUT_TABLE} WHERE locale = $1`, [locale]);
  return (rows[0]?.items as PageItem[] | undefined) ?? defaultPageItems();
}

export async function savePageLayout(locale: Locale, items: PageItem[]): Promise<void> {
  await ensureSchema();
  await getPool().query(
    `INSERT INTO ${PAGE_LAYOUT_TABLE} (locale, items, updated_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (locale)
     DO UPDATE SET items = $2, updated_at = $3`,
    [locale, JSON.stringify(items), new Date().toISOString()],
  );
}

/**
 * Cached, tag-scoped version of getPageLayout for the public homepage.
 * A fresh unstable_cache wrapper is created per call so its tag can depend on
 * `locale` — the cache key itself comes from the keyParts array below, so this
 * still correctly caches per locale rather than colliding across calls.
 */
export function getCachedPageLayout(locale: Locale): Promise<PageItem[]> {
  return unstable_cache(() => getPageLayout(locale), ["page-layout", locale], {
    tags: [pageLayoutCacheTag(locale)],
  })();
}
