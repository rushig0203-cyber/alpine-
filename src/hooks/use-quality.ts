import { useEffect, useState } from "react";

export type Quality = "high" | "low" | "off";

/**
 * Decides how much WebGL a device should be asked to do.
 * `off` means we render the photographic fallback instead — the site must be
 * completely usable without a single triangle.
 */
export function detectQuality(): Quality {
  if (typeof window === "undefined") return "off";
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  if (!gl) return "off";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 900;

  if (cores <= 3 || memory <= 2) return "off";
  if (coarse || narrow || cores <= 6) return "low";
  return "high";
}

/** Client-side capability probe, resolved after first paint so LCP stays fast. */
export function useQuality(delay = 350) {
  const [quality, setQuality] = useState<Quality | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      setQuality(detectQuality());
    }, delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return { quality, reducedMotion, ready: quality !== null };
}

/** Runs a callback whenever the element enters or leaves the viewport. */
export function useInViewport<T extends HTMLElement>(
  ref: React.RefObject<T>,
  onChange: (visible: boolean) => void,
  margin = "200px",
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => onChange(entry.isIntersecting),
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, onChange, margin]);
}
