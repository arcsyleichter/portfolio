"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n/config";
import { SITE_SECTION_SCHEMAS } from "@/lib/builder/site-sections";

interface SectionStatus {
  key: string;
  edited: boolean;
}

export default function AdminSitePage() {
  const [locale, setLocale] = useState<Locale>("hu");
  const [sections, setSections] = useState<SectionStatus[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/site/${locale}`)
      .then((r) => r.json())
      .then((data: { sections: SectionStatus[] }) => {
        if (!cancelled) setSections(data.sections);
      })
      .catch(() => {
        if (!cancelled) setSections([]);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Főoldal szerkesztése</h1>
          <p className="mt-1 text-sm text-muted-foreground">Szekciónként szerkesztheted a főoldal tartalmát.</p>
        </div>
        <Link href="/admin/posts" className="text-sm text-muted-foreground hover:text-foreground">
          ← Bejegyzésekhez
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-1.5">
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              locale === l
                ? "border-gold/50 bg-gold/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {SITE_SECTION_SCHEMAS.map((schema) => {
          const status = sections?.find((s) => s.key === schema.key);
          return (
            <Link
              key={schema.key}
              href={`/admin/site/${locale}/${schema.key}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-5 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-black/20"
            >
              <span className="font-heading text-base font-semibold">{schema.label}</span>
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                  status?.edited
                    ? "border-tech-blue/30 text-tech-blue-light"
                    : "border-border text-muted-foreground"
                }`}
              >
                {status ? (status.edited ? "Szerkesztve" : "Alapértelmezett") : "…"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
