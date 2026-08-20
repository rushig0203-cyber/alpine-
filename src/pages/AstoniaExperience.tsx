import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Compass,
  Layers3,
  MapPin,
  Maximize2,
  Pause,
  Play,
  Sparkles,
  Store,
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import fallback from "@/assets/astonia-dusk.jpg";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  FLOORS,
  PODIUM_D,
  PODIUM_HEIGHT,
  TOWER_D,
  TOWER_H,
  TOWER_X,
} from "@/components/three/astonia/geometry";
import { TIME_ORDER, TIME_PRESETS, type TimeKey } from "@/components/three/astonia/time";
import {
  FloorHighlight,
  Hotspot,
  TwinControls,
  TwinRig,
  type TwinView,
} from "@/components/three/astonia/twin";
import { findProject } from "@/data/projects";
import { useQuality } from "@/hooks/use-quality";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const AstoniaCanvas = lazy(() => import("@/components/three/astonia/AstoniaCanvas"));
const astonia = findProject("alpine-astonia")!;

type ZoneKey = "overview" | "residences" | "retail" | "amenities" | "plans";

const ZONES: Record<
  ZoneKey,
  {
    label: string;
    eyebrow: string;
    title: string;
    detail: string;
    icon: typeof Building2;
    view: TwinView;
    hotspot?: [number, number, number];
    facts?: [string, string][];
  }
> = {
  overview: {
    label: "Overview",
    eyebrow: "Kiwale, Ravet · PCMC",
    title: "The whole address.",
    detail:
      "Two residential towers on a retail podium, 67,000 sq.ft. of land and 4,00,000 sq.ft. built up. Drag to orbit, scroll to zoom, and use the hour switch to see the building at any time of day.",
    icon: Compass,
    view: { pos: [98, 44, 116], target: [0, 24, 0] },
    facts: [
      ["197", "Apartments"],
      ["39", "Shops"],
      ["13", "Floors"],
    ],
  },
  residences: {
    label: "Residences",
    eyebrow: "197 apartments · two towers",
    title: "A view made for living.",
    detail:
      "Thirteen residential floors of 2 and 3 BHK homes. Projecting slabs shade every window, and balconies alternate side to side so no two floors read the same.",
    icon: Building2,
    view: { pos: [-58, 38, 70], target: [-TOWER_X, 34, 0] },
    hotspot: [-TOWER_X, PODIUM_HEIGHT + TOWER_H * 0.72, TOWER_D / 2 + 3],
    facts: [
      ["2 & 3 BHK", "Configurations"],
      ["722 – 1010", "Carpet sq.ft."],
      ["Ready", "Possession"],
    ],
  },
  retail: {
    label: "Retail plaza",
    eyebrow: "39 ground-level shops",
    title: "The life below the towers.",
    detail:
      "A double-height retail street wraps the base of the building — daily convenience, cafés and clinics without leaving the address. The lobby sits at the centre of the frontage.",
    icon: Store,
    view: { pos: [34, 12, 78], target: [-2, 10, 18] },
    hotspot: [0, 6.4, PODIUM_D / 2 + 5],
    facts: [
      ["39", "Retail units"],
      ["Double", "Height frontage"],
      ["Basement", "Parking"],
    ],
  },
  amenities: {
    label: "Amenity deck",
    eyebrow: "Lifestyle above the street",
    title: "Spaces that extend the day.",
    detail:
      "The pool, lawn, pergola lounge, gym, indoor games and play courts sit on a raised deck between the towers, with a rooftop yoga terrace above.",
    icon: Sparkles,
    view: { pos: [10, 74, 62], target: [0, 12, 0] },
    hotspot: [0, PODIUM_HEIGHT + 5.5, 4],
    facts: [
      ["12+", "Amenities"],
      ["Rooftop", "Yoga deck"],
      ["24 / 7", "Security"],
    ],
  },
  plans: {
    label: "Floor plans",
    eyebrow: "2 BHK · 3 BHK",
    title: "Find your own rhythm.",
    detail:
      "Use the floor selector to travel up the tower, or open the plans below to see how the homes are laid out.",
    icon: Layers3,
    view: { pos: [56, 30, 62], target: [TOWER_X, 26, 0] },
    hotspot: [TOWER_X, PODIUM_HEIGHT + TOWER_H * 0.38, TOWER_D / 2 + 3],
  },
};

const ZONE_ORDER: ZoneKey[] = ["overview", "residences", "retail", "amenities", "plans"];

export default function AstoniaExperience() {
  const [zone, setZone] = useState<ZoneKey>("overview");
  const [timeKey, setTimeKey] = useState<TimeKey>("dusk");
  const [floor, setFloor] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [ready, setReady] = useState(false);
  const controls = useRef<OrbitControlsImpl | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { quality } = useQuality(200);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Alpine Astonia in 3D — ${SITE.name}`;
    const timer = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  const view = useMemo<TwinView>(() => {
    if (floor !== null) {
      const y = PODIUM_HEIGHT + (floor - 1) * 3.3 + 1.6;
      return { pos: [54, y + 5, 60], target: [-4, y, 0] };
    }
    return ZONES[zone].view;
  }, [zone, floor]);

  const active = ZONES[zone];
  const ActiveIcon = active.icon;
  const show3D = quality === "high" || quality === "low";

  const enterFullscreen = () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <main className="min-h-screen bg-[#05080d] text-white">
      <section ref={stageRef} className="relative h-[100svh] w-full overflow-hidden bg-[#05080d]">
        <img
          src={fallback}
          alt="Alpine Astonia at dusk"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            show3D ? "opacity-0" : "opacity-90",
          )}
        />

        {show3D && ready && (
          <Suspense fallback={null}>
            <div className="absolute inset-0">
              <AstoniaCanvas
                timeKey={timeKey}
                quality={quality === "high" ? "high" : "low"}
                interactive
                camera={{ position: ZONES.overview.view.pos, fov: 36 }}
              >
                <TwinControls controls={controls} />
                <TwinRig view={view} controls={controls} autoRotate={autoRotate} />
                <FloorHighlight floor={floor} />
                {ZONE_ORDER.filter((k) => ZONES[k].hotspot).map((k) => (
                  <Hotspot
                    key={k}
                    position={ZONES[k].hotspot!}
                    label={ZONES[k].label}
                    active={zone === k && floor === null}
                    onSelect={() => {
                      setFloor(null);
                      setZone(k);
                    }}
                  />
                ))}
              </AstoniaCanvas>
            </div>
          </Suspense>
        )}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,13,0.75)_0%,rgba(5,8,13,0)_22%),linear-gradient(0deg,rgba(5,8,13,0.9)_0%,rgba(5,8,13,0)_38%)]" />

        {/* ------------------------------------------------------------- top */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 px-5 py-5 md:px-8 md:py-6">
          <div className="pointer-events-auto flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-[0.26em] text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> {SITE.shortName}
            </Link>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border border-white/15 px-3.5 py-2 text-[9px] uppercase tracking-[0.2em] text-white/50 sm:inline-flex">
                {SITE.rera.authority} {SITE.rera.astonia}
              </span>
              <Link
                to="/projects/alpine-astonia"
                className="rounded-full border border-white/25 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:border-white/70"
              >
                Project details
              </Link>
            </div>
          </div>
        </header>

        {/* ---------------------------------------------------------- title */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-5 md:px-8">
          <div className="max-w-md">
            <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-white/60">
              <span className="h-px w-8 bg-gold" /> Real-time digital twin
            </p>
            <h1 className="mt-5 font-serif text-[clamp(2.6rem,6vw,5.4rem)] font-semibold leading-[0.88] tracking-[-0.06em]">
              Astonia,
              <br />
              <span className="text-white/50">in your hands.</span>
            </h1>
          </div>
        </div>

        {/* --------------------------------------------------- zone switcher */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5 md:px-8 md:pb-7">
          <div className="flex flex-col gap-4">
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {ZONE_ORDER.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setFloor(null);
                    setZone(k);
                  }}
                  aria-pressed={zone === k && floor === null}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] transition-colors",
                    zone === k && floor === null
                      ? "border-white bg-white text-[#0b1524]"
                      : "border-white/20 bg-black/40 text-white/70 backdrop-blur-md hover:border-white/60 hover:text-white",
                  )}
                >
                  {ZONES[k].label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur-md">
                {TIME_ORDER.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTimeKey(key)}
                    aria-pressed={timeKey === key}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[9px] uppercase tracking-[0.18em] transition-colors md:text-[10px]",
                      timeKey === key ? "bg-white text-[#0b1524]" : "text-white/60 hover:text-white",
                    )}
                  >
                    {TIME_PRESETS[key].label}
                  </button>
                ))}
              </div>

              {show3D && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAutoRotate((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-md transition-colors hover:text-white"
                  >
                    {autoRotate ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    {autoRotate ? "Pause orbit" : "Auto orbit"}
                  </button>
                  <button
                    type="button"
                    onClick={enterFullscreen}
                    aria-label="Toggle fullscreen"
                    className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-md transition-colors hover:text-white md:inline-flex"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --------------------------------------------------- floor selector */}
        {show3D && (
          <div className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-2 rounded-full border border-white/15 bg-black/40 px-2 py-4 backdrop-blur-md lg:flex">
            <span className="pb-1 text-[8px] uppercase tracking-[0.2em] text-white/40">Floor</span>
            {Array.from({ length: FLOORS }, (_, i) => FLOORS - i).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFloor(floor === f ? null : f)}
                aria-pressed={floor === f}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[9px] transition-colors",
                  floor === f ? "bg-white text-[#0b1524]" : "text-white/45 hover:text-white",
                )}
              >
                {f}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFloor(null)}
              className="mt-1 text-[8px] uppercase tracking-[0.16em] text-white/40 transition-colors hover:text-white"
            >
              Reset
            </button>
          </div>
        )}

        {/* --------------------------------------------------------- info card */}
        <aside className="absolute bottom-[10.5rem] left-0 right-0 z-10 px-5 md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:w-[24rem] md:-translate-y-1/2 md:px-0 lg:right-24">
          <div className="rounded-2xl border border-white/12 bg-black/55 p-4 backdrop-blur-xl md:p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white">
                <ActiveIcon className="h-4 w-4" strokeWidth={1.4} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/50">
                  {floor !== null ? `Floor ${floor} · ${(PODIUM_HEIGHT + (floor - 1) * 3.3).toFixed(0)} m above ground` : active.eyebrow}
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.04em]">
                  {floor !== null ? "A home in the air." : active.title}
                </h2>
              </div>
            </div>
            <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-white/65 md:line-clamp-none md:text-sm">
              {floor !== null
                ? `Nine homes share each floor, served by three lifts and two staircases. From floor ${floor} the outlook opens over the podium deck toward the Mumbai–Pune expressway corridor.`
                : active.detail}
            </p>

            {active.facts && floor === null && (
              <dl className="mt-5 hidden grid-cols-3 gap-3 border-t border-white/12 pt-5 sm:grid">
                {active.facts.map(([value, label]) => (
                  <div key={label}>
                    <dt className="font-serif text-lg font-semibold">{value}</dt>
                    <dd className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/45">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-white/12 pt-5">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/45">
                <MapPin className="h-3 w-3" /> Kiwale, PCMC
              </span>
              <Link
                to="/projects/alpine-astonia#contact"
                className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:text-white/60"
              >
                Enquire <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* ------------------------------------------------------------- plans */}
      <section className="border-t border-white/10 bg-[#070b12] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/45">
                <span className="h-px w-8 bg-gold" /> Layouts
              </p>
              <h2 className="mt-5 font-serif text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
                From spatial study
                <br />
                <span className="text-white/45">to the plan of your home.</span>
              </h2>
            </div>
            <Link
              to="/projects/alpine-astonia"
              className="group inline-flex items-center gap-2.5 self-start rounded-full border border-white/25 px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:border-white/70"
            >
              Plans, amenities & location
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {astonia.floorPlans && (
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {astonia.floorPlans.map((plan) => (
                <figure
                  key={plan.label}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white">
                    <img
                      src={plan.image}
                      alt={plan.label}
                      loading="lazy"
                      className="h-full w-full object-contain"
                      onError={(event) => {
                        (event.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <figcaption className="mt-5 text-sm text-white/70">{plan.label}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
