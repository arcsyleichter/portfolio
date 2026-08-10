import "server-only";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/lib/i18n/config";
import { getPool, ensureSchema, SITE_SECTIONS_TABLE } from "./db";
import type { SectionKey } from "./site-content-schema";
import { SECTION_KEYS } from "./site-content-schema";

export function siteSectionsCacheTag(locale: Locale): string {
  return `site-sections-${locale}`;
}

export async function getSectionOverride(locale: Locale, key: SectionKey): Promise<unknown | null> {
  await ensureSchema();
  const { rows } = await getPool().query(
    `SELECT content FROM ${SITE_SECTIONS_TABLE} WHERE locale = $1 AND section_key = $2`,
    [locale, key],
  );
  return rows[0]?.content ?? null;
}

export async function saveSectionOverride(locale: Locale, key: SectionKey, content: unknown): Promise<void> {
  await ensureSchema();
  await getPool().query(
    `INSERT INTO ${SITE_SECTIONS_TABLE} (locale, section_key, content, updated_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (locale, section_key)
     DO UPDATE SET content = $3, updated_at = $4`,
    [locale, key, JSON.stringify(content), new Date().toISOString()],
  );
}

export async function clearSectionOverride(locale: Locale, key: SectionKey): Promise<void> {
  await ensureSchema();
  await getPool().query(`DELETE FROM ${SITE_SECTIONS_TABLE} WHERE locale = $1 AND section_key = $2`, [locale, key]);
}

/** All overrides for a locale, keyed by section — absent keys mean "using the dictionary default". */
export async function listSectionOverrides(locale: Locale): Promise<Partial<Record<SectionKey, unknown>>> {
  await ensureSchema();
  const { rows } = await getPool().query(
    `SELECT section_key, content FROM ${SITE_SECTIONS_TABLE} WHERE locale = $1`,
    [locale],
  );
  const result: Partial<Record<SectionKey, unknown>> = {};
  for (const row of rows as { section_key: string; content: unknown }[]) {
    if ((SECTION_KEYS as readonly string[]).includes(row.section_key)) {
      result[row.section_key as SectionKey] = row.content;
    }
  }
  return result;
}

/**
 * Cached, tag-scoped version of listSectionOverrides for the public homepage.
 * A fresh unstable_cache wrapper is created per call so its tag can depend on
 * `locale` — the cache key itself comes from the keyParts array below, so this
 * still correctly caches per locale rather than colliding across calls.
 */
export function getCachedSectionOverrides(locale: Locale): Promise<Partial<Record<SectionKey, unknown>>> {
  return unstable_cache(() => listSectionOverrides(locale), ["site-sections", locale], {
    tags: [siteSectionsCacheTag(locale)],
  })();
}
