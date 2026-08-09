"use client";

import { BLOG_TEMPLATES } from "@/lib/builder/templates";
import type { Block } from "@/lib/builder/types";

export function TemplatePicker({ onSelect }: { onSelect: (blocks: Block[]) => void }) {
  const templates = BLOG_TEMPLATES.filter((t) => t.id !== "blank");

  return (
    <div className="rounded-2xl border border-dashed border-border p-5">
      <p className="text-sm font-medium">Kezdj egy kész elrendezéssel</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Válassz egy mintát — csak a saját szöveged és képeid kellenek bele. Vagy hagyd üresen, és építsd fel magad
        lentről, esetleg húzd ide a paletta valamelyik elemét.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.blocks())}
            className="cursor-pointer rounded-xl border border-border bg-card/60 p-4 text-left transition-colors hover:border-gold/40 hover:bg-muted"
          >
            <p className="text-sm font-semibold">{t.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
