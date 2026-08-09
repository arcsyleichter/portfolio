"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.1,
        smoothWheel: true,
        anchors: { offset: -84 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
