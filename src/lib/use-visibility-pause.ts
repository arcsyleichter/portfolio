"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Returns whether the referenced element is currently worth animating — i.e.
 * on-screen AND the tab is visible. Use it to stop rAF loops, autoplay, or
 * per-frame canvas work when a component scrolls off-screen or the tab is
 * backgrounded, instead of paying for it everywhere on the page at once.
 */
export function useVisibilityPause<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0.1 }: { threshold?: number } = {},
): boolean {
  const [onScreen, setOnScreen] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return onScreen && tabVisible;
}
