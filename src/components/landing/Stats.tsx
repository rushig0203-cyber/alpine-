import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

/** Counts up to a value the first time the strip scrolls into view. */
function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return value;
}

const parse = (raw: string) => {
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { number: 0, suffix: raw, decimals: 0 };
  const decimals = match[1].includes(".") ? 1 : 0;
  return { number: Number(match[1]), suffix: match[2], decimals };
};

function Stat({ value, label, run }: { value: string; label: string; run: boolean }) {
  const { number, suffix, decimals } = parse(value);
  const animated = useCountUp(number, run);
  return (
    <div className="group px-5 py-9 md:px-8 md:py-12">
      <div className="font-serif text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-5xl">
        {animated.toFixed(decimals)}
        <span className="text-gold">{suffix}</span>
      </div>
      <div className="mt-4 h-px w-7 bg-gold transition-all duration-700 group-hover:w-16" />
      <div className="mt-4 text-[10px] uppercase tracking-[0.26em] text-muted-foreground">{label}</div>
    </div>
  );
}

export const Stats = () => {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setRun(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-b border-border bg-background">
      <div className="container">
        <div className="grid grid-cols-2 divide-x divide-y divide-border border-x border-y border-border md:grid-cols-4 md:divide-y-0">
          {SITE.stats.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} run={run} />
          ))}
        </div>
      </div>
    </section>
  );
};
