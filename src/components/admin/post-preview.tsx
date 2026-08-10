"use client";

import { useState } from "react";
import type { Block } from "@/lib/builder/types";
import { PostArticleView } from "@/components/blocks/post-article-view";

const DEVICES = [
  { id: "desktop", label: "Asztali", width: "100%" },
  { id: "tablet", label: "Tablet", width: "768px" },
  { id: "mobile", label: "Mobil", width: "375px" },
] as const;

export function PostPreview({ title, excerpt, blocks }: { title: string; excerpt: string; blocks: Block[] }) {
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("desktop");
  const width = DEVICES.find((d) => d.id === device)?.width ?? "100%";

  return (
    <div className="mt-6">
      <div className="flex items-center gap-1.5">
        {DEVICES.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDevice(d.id)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              device === d.id
                ? "border-gold/50 bg-gold/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card/30 p-4">
        <div className="mx-auto overflow-hidden rounded-xl transition-[max-width] duration-300" style={{ maxWidth: width }}>
          <PostArticleView title={title} excerpt={excerpt} blocks={blocks} />
        </div>
      </div>
    </div>
  );
}
