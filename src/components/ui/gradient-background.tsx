// Soft, blurred radial-gradient accent texture — zero dependencies, one
// absolutely-positioned <div>. Purely additive: it paints translucent color
// blobs that fade to fully transparent, so it must sit ON TOP of the
// section's own solid bg-background (via .section-dark/.section-light),
// never replace it. Recolored from the original "Jade Sky" recipe to our
// brand palette (charcoal / gold-bronze / cream).
// Usage: <section className="relative isolate bg-background ...">
//          <GradientBackground tone="dark" className="absolute inset-0 -z-10" />
//          ...content...
//        </section>

interface GradientStop {
  position: string;
  rgb: string;
  peak: number;
  fade: string;
}

const TONES: Record<"dark" | "light", GradientStop[]> = {
  dark: [
    { position: "65% 20%", rgb: "184, 134, 11", peak: 0.28, fade: "50%" },
    { position: "15% 75%", rgb: "217, 165, 33", peak: 0.2, fade: "55%" },
    { position: "85% 85%", rgb: "58, 55, 51", peak: 0.5, fade: "60%" },
  ],
  light: [
    { position: "65% 20%", rgb: "217, 165, 33", peak: 0.16, fade: "50%" },
    { position: "15% 75%", rgb: "184, 134, 11", peak: 0.12, fade: "55%" },
    { position: "85% 85%", rgb: "242, 236, 223", peak: 0.7, fade: "60%" },
  ],
};

export function GradientBackground({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const backgroundImage = TONES[tone]
    .map(
      (s) =>
        `radial-gradient(circle at ${s.position}, rgba(${s.rgb}, ${s.peak}) 0%, rgba(${s.rgb}, 0) ${s.fade})`
    )
    .join(", ");

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ overflow: "hidden", contain: "paint" }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-4%",
          filter: "blur(24px)",
          backgroundImage,
        }}
      />
    </div>
  );
}
