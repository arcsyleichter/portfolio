"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* Magnetic dock nav — adapted for this project's brand palette (charcoal /
   gold / tech-blue) and switched to text pills instead of icon tiles. */

/* -------------------------------------------------------------------------- */
/* Dock design tokens                                                         */
/* -------------------------------------------------------------------------- */
/* Rendered with the component, in a low cascade layer, so a `:root { --dock-*: … }`
   override always wins. Values are mapped from this project's own brand
   tokens (see globals.css) rather than duplicated. */
const DOCK_TOKENS =
  "@layer dock{:root{" +
  "--dock-accent:var(--gold-light);" +
  "--dock-accent-text:var(--gold);" +
  "--dock-secondary-accent:var(--tech-blue-light);" +
  "--dock-bg:var(--ink);" +
  "--dock-border:rgba(245,241,232,0.14);" +
  "--dock-border-strong:rgba(245,241,232,0.24);" +
  "--dock-fg:var(--cream);" +
  "--dock-fg-secondary:var(--cream-text-on-dark);" +
  "--dock-muted:var(--warm-gray-on-dark);" +
  "--dock-surface:var(--charcoal-elevated);" +
  "--dock-surface-2:var(--charcoal)" +
  "}}";

/* ---- motion primitives ---- */

/**
 * Returns whether the referenced element is currently worth animating — i.e.
 * on-screen AND the tab is visible. Use it to pause per-frame work when the
 * component scrolls away or the tab is backgrounded.
 */
function useVisibilityPause<T extends Element>(
  ref: React.RefObject<T | null>,
  { threshold = 0.1 }: { threshold?: number } = {},
): boolean {
  const [onScreen, setOnScreen] = React.useState(true);
  const [tabVisible, setTabVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  React.useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return onScreen && tabVisible;
}

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface DockItem {
  /** Stable id passed back to `onSelect`. */
  id: string;
  /** Accessible name + tile text. */
  label: string;
  /** Optional custom tile content override (falls back to the label text). */
  icon?: React.ReactNode;
  /** Optional two-stop gradient override for the tile, e.g. `["#d9a521", "#b8860b"]`. */
  tint?: [string, string];
}

export interface MagneticDockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** The dock's nav items, left to right. */
  items: DockItem[];
  /** σ of the shared gaussian attraction field, in px. Larger = wider, softer cascade. */
  magnetRadius?: number;
  /** Scale of the tile directly under the pointer (1 = no growth). */
  maxScale?: number;
  /** Peak vertical lift, in px. */
  lift?: number;
  /** Scale-spring stiffness. */
  stiffness?: number;
  /** Scale-spring damping. */
  damping?: number;
  /** Sweep a virtual pointer across the bar when nothing is hovering it. */
  idleWave?: boolean;
  /** Show the spring-chased label chip above the dominant tile. */
  tooltip?: boolean;
  /** Fired when a tile is activated by click, Enter, or Space. */
  onSelect?: (id: string) => void;
  /** Deterministic seed for the idle-wave phase (SSR-stable). */
  seed?: number;
  /** Stop the rAF loop when scrolled offscreen or the tab is hidden. */
  pauseWhenHidden?: boolean;
  /** Force the static, motion-free variant regardless of system preference. */
  reducedMotion?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Physics                                                                    */
/* -------------------------------------------------------------------------- */

interface Spring {
  x: number;
  v: number;
}

const mkSpring = (x = 0): Spring => ({ x, v: 0 });

/** Semi-implicit Euler spring with substeps — stable at low/irregular frame rates. */
function spring(s: Spring, target: number, k: number, c: number, dt: number): number {
  const n = dt > 0.012 ? Math.ceil(dt / 0.008) : 1;
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    s.v += (-k * (s.x - target) - c * s.v) * h;
    s.x += s.v * h;
  }
  return s.x;
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/** mulberry32 — no Math.random at render or module scope (SSR-stable). */
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -------------------------------------------------------------------------- */
/* Palette                                                                    */
/* -------------------------------------------------------------------------- */

const ACCENT = "var(--dock-accent, #d9a521)";
const CYAN = "var(--dock-secondary-accent, #4fc3e0)";

/** Two-tone brand ramp; cycles for docks longer than two items. */
const TINTS: ReadonlyArray<[string, string]> = [
  [ACCENT, "var(--dock-accent-text, #b8860b)"],
  [CYAN, "var(--tech-blue, #19a6cd)"],
];

/* Field constants ported verbatim from the original prototype. */
const LIFT_K = 360;
const LIFT_C = 22;
const DRIFT = 0.13;
const DRIFT_K = 300;
const DRIFT_C = 20;
const TIP_K = 340;
const TIP_C = 26;
/** Vertical reach of the field — it dies out this far above/below the bar. */
const VERTICAL_REACH = 220;

interface Base {
  x: number;
  y: number;
}

interface PointerState {
  x: number;
  y: number;
  inside: boolean;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * MagneticDock — a nav dock whose tiles live inside ONE shared gaussian
 * attraction field rather than per-tile hover states, so neighbours cascade and
 * the whole bar reads as liquid under a magnet. Each tile samples
 * `exp(-d²/2σ²)` of its distance to the pointer (attenuated vertically), and
 * that influence drives three springs: scale, lift, and a lateral drift toward
 * the pointer. Unattended, a virtual pointer sweeps the bar so the dock
 * breathes on load. One rAF loop, transform-only, base positions cached from
 * `offsetLeft` (transform-immune, no layout feedback).
 */
function MagneticDockBase({
  items,
  magnetRadius = 78,
  maxScale = 1.5,
  lift = 24,
  stiffness = 420,
  damping = 26,
  idleWave = true,
  tooltip = true,
  onSelect,
  seed = 1,
  pauseWhenHidden = true,
  reducedMotion,
  className,
  style,
  ...props
}: MagneticDockProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const tipRef = React.useRef<HTMLDivElement | null>(null);
  const iconsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  const basesRef = React.useRef<Base[]>([]);
  const pointerRef = React.useRef<PointerState>({ x: -1e4, y: -1e4, inside: false });
  const focusRef = React.useRef(-1);

  const systemReduced = useReducedMotion();
  const staticMode = reducedMotion === true || systemReduced;
  const onScreen = useVisibilityPause(rootRef, { threshold: 0.06 });
  const paused = pauseWhenHidden && !onScreen;
  const animate = !staticMode && !paused;

  const count = items.length;
  const labels = items.map((i) => i.label).join(" ");

  // Live prop mirror so the rAF loop reads fresh values without re-subscribing.
  const params = React.useRef({ magnetRadius, maxScale, lift, stiffness, damping, idleWave, tooltip });
  React.useEffect(() => {
    params.current = { magnetRadius, maxScale, lift, stiffness, damping, idleWave, tooltip };
  });

  /* Base centers come from offsetLeft/offsetTop, which ignore transforms — so a
     scaled/lifted tile can never feed back into the field it samples. */
  React.useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const measure = () => {
      const bx = bar.offsetLeft;
      const by = bar.offsetTop;
      basesRef.current = iconsRef.current.slice(0, count).map((el) =>
        el ? { x: bx + el.offsetLeft + el.offsetWidth / 2, y: by + el.offsetTop + el.offsetHeight / 2 } : { x: 0, y: 0 },
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(bar);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, [count, labels]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!animate) {
      // Designed static state: no springs, CSS hover/focus lift keeps the affordance.
      iconsRef.current.forEach((el) => {
        if (el) el.style.transform = "";
      });
      if (tipRef.current) tipRef.current.style.opacity = "0";
      return;
    }

    const states = Array.from({ length: count }, () => ({ s: mkSpring(1), y: mkSpring(0), dx: mkSpring(0) }));
    const tipX = mkSpring(0);
    const tipO = mkSpring(0);
    const rng = makeRng(seed);
    let idleT = rng() * 20;
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      let dt = (now - last) / 1000;
      last = now;
      if (!(dt > 0) || dt > 0.05) dt = 0.016;
      idleT += dt;

      const cfg = params.current;
      const bases = basesRef.current;
      const p = pointerRef.current;
      const w = root.clientWidth;
      const grow = Math.max(0, cfg.maxScale - 1);
      const sigma = Math.max(8, cfg.magnetRadius);

      let px: number;
      let py: number;
      let amp: number;
      const fi = focusRef.current;
      if (p.inside) {
        px = p.x;
        py = p.y;
        amp = 1;
      } else if (fi >= 0 && bases[fi]) {
        // Keyboard parity: a focused tile bends the field exactly like a hover.
        px = bases[fi].x;
        py = bases[fi].y;
        amp = 1;
      } else if (cfg.idleWave) {
        px = w / 2 + Math.sin(idleT * 0.55) * w * 0.34;
        py = bases[0]?.y ?? root.clientHeight - 70;
        amp = 0.42;
      } else {
        px = -1e4;
        py = -1e4;
        amp = 0;
      }

      let bestI = -1;
      let bestInf = 0;
      for (let i = 0; i < count; i++) {
        const b = bases[i];
        const el = iconsRef.current[i];
        const st = states[i];
        if (!b || !el || !st) continue;
        const d = px - b.x;
        const vert = Math.max(0, 1 - Math.abs(py - b.y) / VERTICAL_REACH);
        const inf = Math.exp(-(d * d) / (2 * sigma * sigma)) * amp * vert;
        if (inf > bestInf) {
          bestInf = inf;
          bestI = i;
        }
        spring(st.s, 1 + grow * inf, cfg.stiffness, cfg.damping, dt);
        spring(st.y, -cfg.lift * inf, LIFT_K, LIFT_C, dt);
        spring(st.dx, d * DRIFT * inf, DRIFT_K, DRIFT_C, dt);
        el.style.transform = `translate3d(${st.dx.x.toFixed(2)}px,${st.y.x.toFixed(2)}px,0) scale(${st.s.x.toFixed(3)})`;
      }

      const tip = tipRef.current;
      if (!tip) return;
      const showTip = cfg.tooltip && (p.inside || fi >= 0) && bestInf > 0.55 && bestI >= 0;
      if (showTip) {
        const next = items[bestI]?.label ?? "";
        if (tip.textContent !== next) tip.textContent = next;
        spring(tipX, bases[bestI].x, TIP_K, TIP_C, dt);
      }
      spring(tipO, showTip ? 1 : 0, 220, 24, dt);
      const o = clamp(tipO.x, 0, 1);
      if (o > 0.01 && bestI >= 0 && bases[bestI]) {
        const ty = bases[bestI].y - 72 - states[bestI].y.x * -0.4 - 18 * o;
        tip.style.opacity = o.toFixed(3);
        tip.style.transform = `translate3d(${(tipX.x - tip.offsetWidth / 2).toFixed(1)}px,${ty.toFixed(1)}px,0)`;
      } else {
        tip.style.opacity = "0";
      }
    };

    last = typeof performance !== "undefined" ? performance.now() : 0;
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate, count, items, seed]);

  const track = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) return;
    const r = root.getBoundingClientRect();
    pointerRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, inside: true };
  }, []);

  const release = React.useCallback(() => {
    pointerRef.current = { x: -1e4, y: -1e4, inside: false };
  }, []);

  return (
    <div
      ref={rootRef}
      data-motion={staticMode ? "static" : "animated"}
      data-paused={paused ? "true" : "false"}
      className={cn("relative w-full select-none pointer-events-none", className)}
      // pan-y keeps vertical page scrolling working while a finger sweeps the dock.
      style={{ touchAction: "pan-y", ...style }}
      onPointerMove={track}
      onPointerDown={track}
      onPointerLeave={release}
      onPointerCancel={release}
      {...props}
    >
      <div className="flex w-full justify-center px-3 pb-3 pt-24">
        <div
          ref={barRef}
          className={cn(
            "pointer-events-auto relative flex max-w-full flex-wrap items-end justify-center gap-2.5 rounded-[22px] px-[14px] py-2.5",
            "border border-[var(--dock-border,rgba(245,241,232,0.14))] backdrop-blur-[14px]",
          )}
          style={{
            background: "color-mix(in oklab, var(--dock-surface, #3a3733) 82%, transparent)",
            boxShadow: "0 18px 50px -18px color-mix(in oklab, var(--dock-accent, #d9a521) 35%, transparent)",
          }}
        >
          {items.map((item, i) => {
            const [a, b] = item.tint ?? TINTS[i % TINTS.length];
            return (
              <button
                key={item.id}
                type="button"
                ref={(el) => {
                  iconsRef.current[i] = el;
                }}
                data-dock-item={item.id}
                aria-label={item.label}
                onClick={() => onSelect?.(item.id)}
                onFocus={() => {
                  focusRef.current = i;
                }}
                onBlur={() => {
                  if (focusRef.current === i) focusRef.current = -1;
                }}
                className={cn(
                  "relative grid h-11 shrink-0 origin-bottom place-items-center whitespace-nowrap rounded-full px-4",
                  "cursor-pointer border-0 text-sm font-semibold tracking-tight",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--dock-accent,#d9a521)]",
                  staticMode &&
                    "transition-transform duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-1.5 hover:scale-[1.06] focus-visible:-translate-y-1.5 focus-visible:scale-[1.06]",
                )}
                style={{
                  color: "var(--dock-bg, #1a1a1a)",
                  backgroundImage: `linear-gradient(140deg, ${a}, ${b})`,
                  boxShadow: `inset 0 1px 0 color-mix(in oklab, var(--dock-fg, #faf8f5) 22%, transparent), 0 8px 20px -8px color-mix(in oklab, ${a} 60%, transparent)`,
                  willChange: "transform",
                }}
              >
                {item.icon ?? item.label}
              </button>
            );
          })}
        </div>
      </div>

      {tooltip && !staticMode ? (
        <div
          ref={tipRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 whitespace-nowrap rounded-lg px-[11px] py-[5px] text-xs font-semibold opacity-0"
          style={{
            background: "var(--dock-fg, #faf8f5)",
            color: "var(--dock-bg, #1a1a1a)",
            transform: "translate3d(-999px,-999px,0)",
            willChange: "transform, opacity",
          }}
        />
      ) : null}
    </div>
  );
}

MagneticDock.displayName = "MagneticDock";

export function MagneticDock(props: MagneticDockProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DOCK_TOKENS }} />
      <MagneticDockBase {...props} />
    </>
  );
}

export default MagneticDock;
