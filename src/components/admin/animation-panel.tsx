"use client";

import type { Block, BlockAnimation } from "@/lib/builder/types";

const SELECT_CLASS =
  "rounded-lg border border-border bg-background/40 px-2.5 py-1.5 text-xs outline-none focus:border-gold";

const TRIGGER_OPTIONS: { value: BlockAnimation["trigger"]; label: string }[] = [
  { value: "onLoad", label: "Betöltéskor" },
  { value: "onScroll", label: "Görgetéskor" },
  { value: "onHover", label: "Rámutatáskor" },
];

const EFFECT_OPTIONS: { value: BlockAnimation["effect"]; label: string }[] = [
  { value: "fade", label: "Elhalványulás" },
  { value: "slideUp", label: "Csúszás alulról" },
  { value: "slideLeft", label: "Csúszás jobbról" },
  { value: "scale", label: "Nagyítás" },
];

const EASING_OPTIONS: { value: BlockAnimation["easing"]; label: string }[] = [
  { value: "easeOut", label: "Lassuló" },
  { value: "easeIn", label: "Gyorsuló" },
  { value: "easeInOut", label: "Lassuló-gyorsuló" },
  { value: "linear", label: "Egyenletes" },
  { value: "brandEase", label: "Márka-ease" },
];

const DEFAULT_ANIMATION: BlockAnimation = {
  trigger: "onScroll",
  effect: "fade",
  duration: 0.6,
  delay: 0,
  easing: "easeOut",
};

function clamp01to10(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(10, Math.max(0, value));
}

export function AnimationPanel({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const animation = block.animation;

  if (!animation) {
    return (
      <button
        type="button"
        onClick={() => onChange({ ...block, animation: DEFAULT_ANIMATION })}
        className="mt-3 cursor-pointer rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
      >
        + Animáció hozzáadása
      </button>
    );
  }

  function patch(next: Partial<BlockAnimation>) {
    if (!animation) return;
    onChange({ ...block, animation: { ...animation, ...next } });
  }

  return (
    <div className="mt-3 rounded-xl border border-border bg-background/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Animáció</p>
        <button
          type="button"
          onClick={() => onChange({ ...block, animation: undefined })}
          className="cursor-pointer text-xs text-destructive hover:underline"
        >
          Eltávolítás
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Indítás
          <select
            value={animation.trigger}
            onChange={(e) => patch({ trigger: e.target.value as BlockAnimation["trigger"] })}
            className={SELECT_CLASS}
          >
            {TRIGGER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Effekt
          <select
            value={animation.effect}
            onChange={(e) => patch({ effect: e.target.value as BlockAnimation["effect"] })}
            className={SELECT_CLASS}
          >
            {EFFECT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Görbe
          <select
            value={animation.easing}
            onChange={(e) => patch({ easing: e.target.value as BlockAnimation["easing"] })}
            className={SELECT_CLASS}
          >
            {EASING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Időtartam (mp)
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={animation.duration}
            onChange={(e) => patch({ duration: clamp01to10(Number(e.target.value)) })}
            className={SELECT_CLASS}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Késleltetés (mp)
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={animation.delay}
            onChange={(e) => patch({ delay: clamp01to10(Number(e.target.value)) })}
            className={SELECT_CLASS}
          />
        </label>
      </div>
    </div>
  );
}
