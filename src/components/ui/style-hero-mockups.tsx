import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StyleId =
  | "minimal"
  | "maximal"
  | "brutalist"
  | "cyberpunk"
  | "industrial"
  | "glass"
  | "vaporwave"
  | "organic"
  | "luxury"
  | "playful";

function MockupFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border shadow-xl", className)}>
      <div className="flex items-center gap-1.5 border-b border-black/10 bg-[#e7e5e0] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="aspect-[16/10] w-full">{children}</div>
    </div>
  );
}

function Minimal() {
  return (
    <MockupFrame>
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#fbfbfa] px-8 text-center">
        <span className="h-1.5 w-1.5 rounded-full bg-[#1a1a1a]" />
        <h3 className="font-heading text-2xl font-light tracking-tight text-[#171717] sm:text-3xl">
          Kevesebb, de jobb.
        </h3>
        <div className="h-px w-10 bg-[#d8d8d4]" />
        <p className="max-w-[26ch] text-xs text-[#8a8a84]">Egyetlen erős gesztus, rengeteg légtér.</p>
      </div>
    </MockupFrame>
  );
}

function Maximal() {
  return (
    <MockupFrame>
      <div className="relative flex h-full w-full flex-col justify-center gap-2 overflow-hidden bg-[#12121a] px-6 py-6">
        <span className="absolute -right-6 top-4 h-20 w-20 rotate-12 rounded-2xl bg-[#ff3d7f]/80" />
        <span className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-[#ffd23f]/70" />
        <span className="absolute right-10 bottom-6 h-10 w-10 rotate-45 bg-[#00e0d3]/70" />
        <div className="relative z-10 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#ffd23f] px-2 py-0.5 text-[9px] font-bold text-[#12121a]">ÚJ</span>
          <span className="rounded-full bg-[#ff3d7f] px-2 py-0.5 text-[9px] font-bold text-white">HOT</span>
        </div>
        <h3 className="relative z-10 font-heading text-2xl leading-[1.05] font-black text-white sm:text-3xl">
          MINDEN.
          <br />
          EGYSZERRE.
        </h3>
        <p className="relative z-10 max-w-[22ch] text-xs font-medium text-white/70">
          Réteges, hangos, lehetetlen nem észrevenni.
        </p>
      </div>
    </MockupFrame>
  );
}

function Brutalist() {
  return (
    <MockupFrame>
      <div className="flex h-full w-full flex-col justify-between bg-[#f0efe9] p-6 font-mono">
        <div className="flex items-start justify-between">
          <h3 className="max-w-[14ch] text-2xl leading-[1.05] font-bold uppercase text-black sm:text-3xl">
            Nincs dísz.
          </h3>
          <span className="border-2 border-black px-1.5 py-0.5 text-[10px] font-bold uppercase">v1.0</span>
        </div>
        <div className="flex items-end justify-between">
          <p className="max-w-[20ch] text-[11px] text-black/70">Csak a tartalom, éles kontraszttal.</p>
          <span
            className="border-2 border-black bg-[#ff3b1e] px-3 py-1.5 text-xs font-bold uppercase text-black"
            style={{ boxShadow: "4px 4px 0 #000" }}
          >
            Start
          </span>
        </div>
      </div>
    </MockupFrame>
  );
}

function Cyberpunk() {
  return (
    <MockupFrame>
      <div className="relative flex h-full w-full flex-col justify-center gap-3 overflow-hidden bg-[#0a0a12] px-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, #00f0ff 0px, transparent 1px, transparent 3px)",
          }}
        />
        <span className="relative z-10 h-6 w-1.5 bg-[#ff2ea6] shadow-[0_0_12px_#ff2ea6]" />
        <h3 className="relative z-10 font-mono text-2xl font-bold uppercase tracking-tight text-transparent sm:text-3xl" style={{ backgroundImage: "linear-gradient(90deg,#00f0ff,#ff2ea6)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>
          NEON_JÖVŐ
        </h3>
        <p className="relative z-10 max-w-[24ch] font-mono text-[11px] text-[#7dfaff]/80">&gt; sötét felület, izzó akcentus, monospace</p>
        <span className="relative z-10 w-fit rounded-sm border border-[#ff2ea6] px-3 py-1 text-[10px] font-mono text-[#ff2ea6] shadow-[0_0_10px_rgba(255,46,166,0.5)]">
          BELÉPÉS
        </span>
      </div>
    </MockupFrame>
  );
}

function Industrial() {
  return (
    <MockupFrame>
      <div className="relative flex h-full w-full flex-col justify-center gap-3 bg-[#2b2b2b] px-6">
        <div
          className="absolute inset-x-0 top-0 h-2"
          style={{
            backgroundImage: "repeating-linear-gradient(-45deg, #f2b705 0 8px, #1a1a1a 8px 16px)",
          }}
        />
        <span className="absolute left-3 top-5 h-1.5 w-1.5 rounded-full bg-[#8a8a84]" />
        <span className="absolute right-3 top-5 h-1.5 w-1.5 rounded-full bg-[#8a8a84]" />
        <h3 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#f2b705] sm:text-3xl">
          Épített
          <br />
          teljesítmény
        </h3>
        <p className="max-w-[22ch] text-[11px] text-[#b8b8b0]">Funkció mindenek felett, nulla felesleg.</p>
      </div>
    </MockupFrame>
  );
}

function Glass() {
  return (
    <MockupFrame>
      <div
        className="relative flex h-full w-full items-center justify-center px-6"
        style={{ backgroundImage: "linear-gradient(135deg,#a78bfa,#60a5fa 50%,#34d399)" }}
      >
        <div
          className="flex w-full max-w-[240px] flex-col items-center gap-2.5 rounded-2xl border border-white/40 px-6 py-6 text-center"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)" }}
        >
          <h3 className="font-heading text-xl font-semibold text-white drop-shadow-sm sm:text-2xl">
            Áttetsző réteg
          </h3>
          <p className="text-[11px] text-white/85">Lágy fények, homályos üvegpanel, modern app-érzet.</p>
        </div>
      </div>
    </MockupFrame>
  );
}

function Vaporwave() {
  return (
    <MockupFrame>
      <div
        className="relative flex h-full w-full flex-col items-center justify-end gap-3 overflow-hidden px-6 pb-6 pt-8"
        style={{ backgroundImage: "linear-gradient(180deg,#2e1065 0%,#a21caf 45%,#fb7185 75%,#fbbf24 100%)" }}
      >
        <span className="absolute left-1/2 top-6 h-16 w-16 -translate-x-1/2 rounded-full bg-[#fde047]" />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 2px, transparent 2px 26px), linear-gradient(0deg, rgba(255,255,255,0.35), transparent)",
          }}
        />
        <h3 className="relative z-10 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl" style={{ textShadow: "3px 3px 0 #22d3ee" }}>
          RETRO WAVE
        </h3>
        <p className="relative z-10 text-[11px] text-white/85">Pasztell neon, nosztalgia, 80-as évek grid</p>
      </div>
    </MockupFrame>
  );
}

function Organic() {
  return (
    <MockupFrame>
      <div className="relative flex h-full w-full items-center overflow-hidden bg-[#f4f1e8] px-6">
        <span className="absolute -right-10 -top-10 h-40 w-40 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-[#c8d5b9]" />
        <span className="absolute -bottom-8 right-16 h-16 w-16 rounded-full bg-[#d99a6c]/50" />
        <div className="relative z-10 flex max-w-[70%] flex-col gap-2.5">
          <span className="w-fit rounded-full bg-[#7c9070] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-white">
            Természetes
          </span>
          <h3 className="font-heading text-2xl font-semibold text-[#4a4638] sm:text-3xl">Lélegzik a felület</h3>
          <p className="max-w-[22ch] text-[11px] text-[#6f6a5c]">Földszínek, lekerekített, szerves formák.</p>
        </div>
      </div>
    </MockupFrame>
  );
}

function Luxury() {
  return (
    <MockupFrame>
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 border-[3px] border-[#c9a227]/0 bg-[#0e0e0e] px-8 text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#c9a227]">Maison</span>
        <h3 className="font-serif text-2xl font-medium tracking-tight text-[#f5f0e6] sm:text-3xl">
          Csendes elegancia
        </h3>
        <div className="h-px w-14" style={{ backgroundImage: "linear-gradient(90deg,transparent,#c9a227,transparent)" }} />
        <p className="max-w-[26ch] text-[11px] text-[#a89f8c]">Fekete-arany, visszafogott tipográfia, tér a szónak.</p>
      </div>
    </MockupFrame>
  );
}

function Playful() {
  return (
    <MockupFrame>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#fff2d6] px-6">
        <span className="absolute left-4 top-5 h-8 w-8 rounded-full bg-[#ff8bb3]" />
        <span className="absolute right-6 top-8 h-4 w-4 rounded-full bg-[#7ed6a8]" />
        <span className="absolute bottom-5 left-10 h-5 w-5 rounded-full bg-[#5cc8ff]" />
        <div className="relative z-10 flex flex-col items-center gap-2.5 text-center">
          <h3 className="font-heading text-2xl font-extrabold text-[#ff5c8a] sm:text-3xl">Játsszunk! 🎉</h3>
          <p className="max-w-[22ch] text-[11px] font-medium text-[#8a6b45]">Kerekded, élénk, barátságos — bármelyik korosztálynak.</p>
          <span className="w-fit rounded-full bg-[#ff5c8a] px-4 py-1.5 text-xs font-bold text-white shadow-[0_4px_0_#c73e6a]">
            Csatlakozz
          </span>
        </div>
      </div>
    </MockupFrame>
  );
}

export const STYLE_MOCKUPS: Record<StyleId, () => ReactNode> = {
  minimal: Minimal,
  maximal: Maximal,
  brutalist: Brutalist,
  cyberpunk: Cyberpunk,
  industrial: Industrial,
  glass: Glass,
  vaporwave: Vaporwave,
  organic: Organic,
  luxury: Luxury,
  playful: Playful,
};
