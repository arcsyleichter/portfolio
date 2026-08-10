"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { SectionKey, SectionSchema } from "@/lib/builder/site-content-schema";
import { SiteSectionForm } from "./site-section-form";

export function SiteSectionEditor({
  locale,
  section,
  schema,
  initialContent,
  edited,
}: {
  locale: Locale;
  section: SectionKey;
  schema: SectionSchema;
  initialContent: Record<string, unknown>;
  edited: boolean;
}) {
  const [content, setContent] = useState(initialContent);
  const [isEdited, setIsEdited] = useState(edited);
  const [reverting, setReverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  async function handleSave(next: Record<string, unknown>) {
    const res = await fetch(`/api/admin/site/${locale}/${section}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!res.ok) throw new Error("save failed");
    const data = (await res.json()) as { content: Record<string, unknown> };
    setContent(data.content);
    setIsEdited(true);
    setVersion((v) => v + 1);
  }

  async function handleRevert() {
    if (
      !window.confirm(
        "Biztosan visszaállítod ezt a szekciót az alapértelmezett tartalomra? A mentett módosítások elvesznek.",
      )
    )
      return;
    setReverting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/site/${locale}/${section}`, { method: "DELETE" });
      if (!res.ok) throw new Error("revert failed");
      const data = (await res.json()) as { content: Record<string, unknown> };
      setContent(data.content);
      setIsEdited(false);
      setVersion((v) => v + 1);
    } catch {
      setError("Visszaállítás sikertelen.");
    } finally {
      setReverting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/site" className="text-sm text-muted-foreground hover:text-foreground">
          ← Vissza a listához
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {locale.toUpperCase()} · {isEdited ? "Szerkesztve" : "Alapértelmezett"}
          </span>
          {isEdited && (
            <button
              type="button"
              onClick={handleRevert}
              disabled={reverting}
              className="cursor-pointer rounded-full border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reverting ? "Visszaállítás…" : "Visszaállítás alapértelmezettre"}
            </button>
          )}
        </div>
      </div>

      <h1 className="mt-6 font-heading text-2xl font-bold">{schema.label}</h1>
      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-card/60 p-5 shadow-md shadow-black/10">
        <SiteSectionForm key={version} schema={schema} initialContent={content} onSave={handleSave} />
      </div>
    </div>
  );
}
