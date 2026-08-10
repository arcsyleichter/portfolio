import "server-only";
import { Pool } from "pg";

declare global {
  var __pgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({
    connectionString,
    // Render's Postgres cert isn't in Node's default trust store.
    ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: false },
  });
}

// Reuse a single pool across Next.js dev-mode hot reloads — otherwise every
// module re-evaluation opens a fresh pool and eventually exhausts the
// database's connection limit.
export function getPool(): Pool {
  if (!globalThis.__pgPool) {
    globalThis.__pgPool = createPool();
  }
  return globalThis.__pgPool;
}

// Render sets RENDER=true on every deployed service. NODE_ENV isn't a safe
// signal here — Next.js sets it to "production" for local `next build`/
// `next start` too. Dev keeps its own suffixed tables so local testing never
// touches live content.
const TABLE_SUFFIX = process.env.RENDER ? "" : "_dev";

export const POSTS_TABLE = `posts${TABLE_SUFFIX}`;
export const IMAGES_TABLE = `images${TABLE_SUFFIX}`;
export const SITE_SECTIONS_TABLE = `site_sections${TABLE_SUFFIX}`;

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(
        `
        CREATE TABLE IF NOT EXISTS ${POSTS_TABLE} (
          locale TEXT NOT NULL,
          slug TEXT NOT NULL,
          doc JSONB NOT NULL,
          status TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          published_at TEXT,
          PRIMARY KEY (locale, slug)
        );
        CREATE TABLE IF NOT EXISTS ${IMAGES_TABLE} (
          key TEXT PRIMARY KEY,
          data BYTEA NOT NULL,
          content_type TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS ${SITE_SECTIONS_TABLE} (
          locale TEXT NOT NULL,
          section_key TEXT NOT NULL,
          content JSONB NOT NULL,
          updated_at TEXT NOT NULL,
          PRIMARY KEY (locale, section_key)
        );
        `,
      )
      .then(() => undefined);
  }
  return schemaReady;
}
