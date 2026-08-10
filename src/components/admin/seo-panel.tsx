"use client";

import { useState } from "react";
import type { BlogPostDocument } from "@/lib/builder/types";

const FIELD_CLASS =
  "w-full rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold";

export function SeoPanel({
  seo,
  onChange,
}: {
  seo: BlogPostDocument["seo"];
  onChange: (seo: BlogPostDocument["seo"]) => void;
}) {
  const [open, setOpen] = useState(Boolean(seo?.metaTitle || seo?.metaDescription));

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 cursor-pointer rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
      >
        + SEO beállítások
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2 rounded-xl border border-border bg-background/30 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">SEO</p>
        <button
          type="button"
          onClick={() => {
            onChange(undefined);
            setOpen(false);
          }}
          className="cursor-pointer text-xs text-destructive hover:underline"
        >
          Eltávolítás
        </button>
      </div>
      <div>
        <label htmlFor="seo-title" className="text-xs text-muted-foreground">
          Meta cím{" "}
          <span className="text-muted-foreground/70">— ha üres, a bejegyzés címe lesz használva</span>
        </label>
        <input
          id="seo-title"
          value={seo?.metaTitle ?? ""}
          onChange={(e) => onChange({ ...seo, metaTitle: e.target.value })}
          maxLength={200}
          className={`${FIELD_CLASS} mt-1`}
        />
      </div>
      <div>
        <label htmlFor="seo-description" className="text-xs text-muted-foreground">
          Meta leírás{" "}
          <span className="text-muted-foreground/70">— ha üres, a kivonat lesz használva</span>
        </label>
        <textarea
          id="seo-description"
          rows={2}
          value={seo?.metaDescription ?? ""}
          onChange={(e) => onChange({ ...seo, metaDescription: e.target.value })}
          maxLength={300}
          className={`${FIELD_CLASS} mt-1`}
        />
      </div>
    </div>
  );
}
