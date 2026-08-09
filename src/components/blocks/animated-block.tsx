"use client";

import { motion, type Target, type Transition } from "motion/react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { BlockAnimation } from "@/lib/builder/types";

/** Enter-animation deltas: the "hidden" state a block animates FROM. */
const ENTER_VARIANTS: Record<string, { hidden: Target; visible: Target }> = {
  none: { hidden: {}, visible: {} },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  slideUp: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  slideLeft: { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
};

/** Hover deltas: applied relative to the block's normal (already-visible) state. */
const HOVER_VARIANTS: Record<string, Target> = {
  none: {},
  fade: { opacity: 0.85 },
  slideUp: { y: -6 },
  slideLeft: { x: -6 },
  scale: { scale: 1.04 },
};

const EASING_MAP: Record<string, Transition["ease"]> = {
  linear: "linear",
  easeIn: "easeIn",
  easeOut: "easeOut",
  easeInOut: "easeInOut",
  brandEase: [0.16, 1, 0.3, 1],
};

export function AnimatedBlock({ animation, children }: { animation?: BlockAnimation; children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  if (!animation || animation.trigger === "none" || animation.effect === "none" || reducedMotion) {
    return <>{children}</>;
  }

  const transition: Transition = {
    duration: animation.duration,
    delay: animation.delay,
    ease: EASING_MAP[animation.easing] ?? "easeOut",
  };

  if (animation.trigger === "onHover") {
    return (
      <motion.div whileHover={HOVER_VARIANTS[animation.effect]} transition={transition}>
        {children}
      </motion.div>
    );
  }

  const variants = ENTER_VARIANTS[animation.effect] ?? ENTER_VARIANTS.fade;

  if (animation.trigger === "onScroll") {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={variants}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  // onLoad
  return (
    <motion.div initial="hidden" animate="visible" variants={variants} transition={transition}>
      {children}
    </motion.div>
  );
}
