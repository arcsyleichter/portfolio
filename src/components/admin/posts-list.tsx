"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PostSummary } from "@/lib/builder/types";
import { DeletePostButton } from "./delete-post-button";

const STATUS_FILTERS: { value: "all" | "draft" | "published"; label: string }[] = [
  { value: "all", label: "Mind" },
  { value: "draft", label: "Piszkozat" },
  { value: "published", label: "Publikálva" },
];

export function PostsList({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (status !== "all" && post.status !== status) return false;
      if (!q) return true;
      return post.title.toLowerCase().includes(q) || post.slug.toLowerCase().includes(q);
    });
  }, [posts, query, status]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Keresés cím vagy slug alapján…"
          className="w-full rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold sm:max-w-xs"
        />
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                status === f.value
                  ? "border-gold/50 bg-gold/10 text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
            {posts.length === 0
              ? "Még nincs egy bejegyzés sem — hozz létre egyet a fenti gombbal."
              : "Nincs a szűrésnek megfelelő bejegyzés."}
          </p>
        )}
        {filtered.map((post) => (
          <div
            key={`${post.locale}-${post.slug}`}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-5 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-black/20"
          >
            <Link href={`/admin/posts/${post.locale}/${post.slug}/edit`} className="min-w-0 flex-1">
              <h2 className="truncate font-heading text-base font-semibold">{post.title || "(cím nélkül)"}</h2>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {post.locale.toUpperCase()} · /{post.slug}
              </p>
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                  post.status === "published"
                    ? "border-tech-blue/30 text-tech-blue-light"
                    : "border-border text-muted-foreground"
                }`}
              >
                {post.status === "published" ? "Publikálva" : "Piszkozat"}
              </span>
              <DeletePostButton locale={post.locale} slug={post.slug} title={post.title} variant="icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
