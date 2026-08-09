"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { createEmptyDocument, slugify } from "@/lib/builder/defaults";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [locale, setLocale] = useState<Locale>("hu");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const finalSlug = slugify(slug);
    if (!finalSlug) {
      setError("A slug nem lehet üres.");
      return;
    }

    setSubmitting(true);

    const existing = await fetch(`/api/admin/posts/${locale}/${finalSlug}`);
    if (existing.ok) {
      setError("Ezzel a slug-gal már létezik bejegyzés ezen a nyelven.");
      setSubmitting(false);
      return;
    }

    const doc = { ...createEmptyDocument(locale, finalSlug), title };
    const res = await fetch(`/api/admin/posts/${locale}/${finalSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    });

    if (!res.ok) {
      setError("Létrehozás sikertelen.");
      setSubmitting(false);
      return;
    }

    router.push(`/admin/posts/${locale}/${finalSlug}/edit`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="font-heading text-2xl font-bold">Új bejegyzés</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium">
            Cím
          </label>
          <input
            id="title"
            required
            autoFocus
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-card/60 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label htmlFor="slug" className="text-sm font-medium">
            Slug
          </label>
          <input
            id="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="mt-1.5 w-full rounded-lg border border-border bg-card/60 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>

        <div>
          <label htmlFor="locale" className="text-sm font-medium">
            Nyelv
          </label>
          <select
            id="locale"
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="mt-1.5 w-full rounded-lg border border-border bg-card/60 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full cursor-pointer rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? "Létrehozás..." : "Létrehozás és szerkesztés"}
        </button>
      </form>
    </div>
  );
}
