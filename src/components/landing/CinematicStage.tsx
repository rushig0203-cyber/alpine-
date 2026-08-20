import { ArrowDown, ArrowUpRight, Box, Loader2 } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import fallbackImage from "@/assets/astonia-dusk.jpg";
import type { CameraKey } from "@/components/three/astonia/CinematicRig";
import { TIME_ORDER, TIME_PRESETS, type TimeKey } from "@/components/three/astonia/time";
import { useQuality } from "@/hooks/use-quality";
import { cn } from "@/lib/utils";

const AstoniaCanvas = lazy(() => import("@/components/three/astonia/AstoniaCanvas"));

type Act = {
  index: string;
  eyebrow: string;
  title: [string, string];
  body: string;
  stats: [string, string][];
};

const ACTS: Act[] = [
  {
    index: "",
    eyebrow: "Alpine Landmarks LLP · PCMC, Pune · Est. 2006",
    title: ["We build", "landmarks."],
    body: "Alpine Astonia, Kiwale — rebuilt as a real-time model you can move through. Scroll to walk the address before you ever visit it.",
    stats: [],
  },
  {
    index: "01",
    eyebrow: "The Towers",
    title: ["Two towers.", "197 homes."],
    body: "Thirteen residential floors of 2 and 3 BHK homes, wrapped in projecting slabs and alternating balconies so every home reads the sky differently.",
    stats: [
      ["2 & 3 BHK", "Configurations"],
      ["722 – 1010", "Carpet sq.ft."],
      ["13", "Floors"],
    ],
  },
  {
    index: "02",
    eyebrow: "The Plaza",
    title: ["A high street", "at your door."],
    body: "39 ground-level shops and a double-height lobby turn the base of the building into a neighbourhood — groceries, cafés and clinics, one lift ride away.",
    stats: [
      ["39", "Retail shops"],
      ["4,00,000", "Built-up sq.ft."],
      ["67,000", "Plot sq.ft."],
    ],
  },
  {
    index: "03",
    eyebrow: "The Podium",
    title: ["An amenity deck", "above the city."],
    body: "The pool, lawn, pergola lounge and play courts sit on a raised deck between the towers — traffic below, quiet above.",
    stats: [
      ["12+", "Amenities"],
      ["Rooftop", "Yoga deck"],
      ["24 / 7", "Security"],
    ],
  },
];

/* Framings verified against the model with scripts/preview_model.py */
const DESKTOP_KEYS: CameraKey[] = [
  { pos: [104, 44, 128], target: [0, 24, 0], fov: 30 },
  { pos: [-46, 10, 62], target: [-16, 40, -4], fov: 40 },
  { pos: [34, 12, 78], target: [-2, 10, 18], fov: 34 },
  { pos: [2, 92, 58], target: [0, 12, 0], fov: 36 },
];

const MOBILE_KEYS: CameraKey[] = [
  { pos: [126, 54, 152], target: [0, 26, 0], fov: 34 },
  { pos: [-56, 14, 76], target: [-16, 38, 0], fov: 46 },
  { pos: [42, 15, 96], target: [0, 10, 18], fov: 40 },
  { pos: [3, 108, 70], target: [0, 12, 0], fov: 40 },
];

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export function CinematicStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const actRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  const [timeKey, setTimeKey] = useState<TimeKey>("dusk");
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);
  const { quality, reducedMotion } = useQuality();

  useEffect(() => {
    const update = () => setCompact(window.innerWidth < 900);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "120px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Scroll → progress. Written straight to refs; no React re-render per frame. */
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = stageRef.current;
      if (el) {
        const total = el.offsetHeight - window.innerHeight;
        const p = total > 0 ? clamp(-el.getBoundingClientRect().top / total) : 0;
        progress.current = p;

        const span = ACTS.length - 1;
        ACTS.forEach((_, i) => {
          const node = actRefs.current[i];
          if (!node) return;
          const distance = Math.abs(p * span - i);
          const opacity = clamp(1 - distance * 1.85);
          node.style.opacity = String(opacity);
          node.style.transform = `translate3d(0, ${(p * span - i) * -26}px, 0)`;
          node.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
          const dot = railRefs.current[i];
          if (dot) dot.dataset.active = opacity > 0.5 ? "true" : "false";
        });

        if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - p * 6));
      }
      raf = requestAnimationFrame(tick);
    };
    if (visible) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  const goToAct = useCallback((i: number) => {
    const el = stageRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + (total * i) / (ACTS.length - 1);
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const keys = useMemo(() => (compact ? MOBILE_KEYS : DESKTOP_KEYS), [compact]);
  const show3D = quality === "high" || quality === "low";

  return (
    <section
      ref={stageRef}
      id="stage"
      aria-label="Alpine Astonia in 3D"
      className="relative bg-[#070c14]"
      style={{ height: `${ACTS.length * (compact ? 92 : 100)}svh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* -------------------------------------------------- 3D or fallback */}
        <div className="absolute inset-0">
          <img
            src={fallbackImage}
            alt="Alpine Astonia at dusk"
            className={cn(
              "h-full w-full scale-105 object-cover transition-opacity duration-1000",
              show3D ? "opacity-0" : "opacity-100",
            )}
          />
          {show3D && (
            <Suspense fallback={null}>
              <div className="absolute inset-0">
                <AstoniaCanvas
                  timeKey={timeKey}
                  quality={quality === "high" ? "high" : "low"}
                  frameloop={visible ? "always" : "never"}
                  camera={{ position: keys[0].pos, fov: keys[0].fov ?? 34 }}
                  rig={{
                    keys,
                    progress,
                    parallax: reducedMotion ? 0 : compact ? 0.3 : 1,
                    smoothing: reducedMotion ? 0.1 : 0.6,
                  }}
                />
              </div>
            </Suspense>
          )}
        </div>

        {/* Legibility scrim — light enough to keep the model readable. */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(4,8,14,0.92)_0%,rgba(4,8,14,0.62)_38%,rgba(4,8,14,0.05)_72%),linear-gradient(0deg,rgba(4,8,14,0.85)_0%,rgba(4,8,14,0)_38%)]" />

        {/* ----------------------------------------------------------- acts */}
        <div className="absolute inset-0">
          {ACTS.map((act, i) => (
            <div
              key={act.eyebrow}
              ref={(node) => (actRefs.current[i] = node)}
              className="absolute inset-0 flex items-center will-change-[opacity,transform]"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <div className="container">
                <div className="max-w-xl pb-16 pt-24 md:pb-0">
                  <p className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white/55">
                    {act.index && <span className="text-white/40">{act.index}</span>}
                    <span className="h-px w-8 bg-gold" />
                    {act.eyebrow}
                  </p>
                  <h2 className="mt-6 font-serif text-[clamp(2.9rem,7vw,6.4rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-white">
                    {act.title[0]}
                    <br />
                    <span className="text-white/45">{act.title[1]}</span>
                  </h2>
                  <p className="mt-7 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
                    {act.body}
                  </p>

                  {act.stats.length > 0 && (
                    <dl className="mt-9 grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6">
                      {act.stats.map(([value, label]) => (
                        <div key={label}>
                          <dt className="font-serif text-xl font-semibold text-white md:text-2xl">
                            {value}
                          </dt>
                          <dd className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/50">
                            {label}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {i === 0 && (
                    <div className="mt-10 flex flex-wrap items-center gap-3">
                      <Link
                        to="/projects/alpine-astonia/experience"
                        className="group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[11px] uppercase tracking-[0.24em] text-[#0b1524] transition-colors hover:bg-gold hover:text-white"
                      >
                        <Box className="h-3.5 w-3.5" strokeWidth={1.6} />
                        Enter the 3D twin
                      </Link>
                      <a
                        href="#projects"
                        className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 px-6 py-3.5 text-[11px] uppercase tracking-[0.24em] text-white transition-colors hover:border-white/70"
                      >
                        All projects
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  )}

                  {i === ACTS.length - 1 && (
                    <Link
                      to="/projects/alpine-astonia"
                      className="group mt-9 inline-flex items-center gap-3 border-b border-gold pb-2 text-[11px] uppercase tracking-[0.24em] text-white/80 transition-colors hover:text-white"
                    >
                      See plans, amenities & pricing
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------- controls */}
        {show3D && (
          <div className="absolute bottom-6 left-0 right-0 z-10">
            <div className="container flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/35 p-1 backdrop-blur-md">
                {TIME_ORDER.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTimeKey(key)}
                    aria-pressed={timeKey === key}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[9px] uppercase tracking-[0.2em] transition-colors md:text-[10px]",
                      timeKey === key
                        ? "bg-white text-[#0b1524]"
                        : "text-white/60 hover:text-white",
                    )}
                  >
                    {TIME_PRESETS[key].label}
                  </button>
                ))}
              </div>
              <div ref={hintRef} className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/50 md:flex">
                Scroll to move the camera
                <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* Act rail */}
        <div className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
          {ACTS.map((act, i) => (
            <button
              key={act.eyebrow}
              ref={(node) => (railRefs.current[i] = node)}
              type="button"
              onClick={() => goToAct(i)}
              aria-label={`Go to ${act.eyebrow}`}
              data-active={i === 0 ? "true" : "false"}
              className="group flex h-6 items-center gap-2"
            >
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/0 transition-colors group-hover:text-white/60">
                {act.eyebrow}
              </span>
              <span className="h-px w-6 bg-white/30 transition-all duration-500 group-data-[active=true]:w-10 group-data-[active=true]:bg-gold" />
            </button>
          ))}
        </div>

        {!show3D && quality === null && (
          <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/40">
            <Loader2 className="h-3 w-3 animate-spin" /> Preparing 3D
          </div>
        )}
      </div>
    </section>
  );
}
