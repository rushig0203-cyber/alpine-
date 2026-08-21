import { ArrowDown, ArrowUpRight, Box } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import astoniaDusk from "@/assets/astonia-dusk.jpg";

type Act = { eyebrow: string; title: [string, string]; body: string; stats?: [string, string][] };

const ACTS: Act[] = [
  { eyebrow: "Alpine Astonia · Kiwale, Pune", title: ["A landmark", "in Kiwale."], body: "A thoughtfully planned residential and retail address by Alpine Landmarks LLP." },
  { eyebrow: "The High Street", title: ["Retail at", "your door."], body: "The registered project includes 39 shop units alongside 2 and 3 BHK residences.", stats: [["39", "Shop units"], ["2 BHK", "Homes"], ["3 BHK", "Homes"]] },
  { eyebrow: "The Address", title: ["Space for", "everyday life."], body: "Alpine Astonia covers 3,936.63 sq. m. in Kiwale and is planned across two wings.", stats: [["3,936.63", "Sq. m. site"], ["0.97", "Acres"], ["2", "Wings"]] },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** The stage stays pinned while visitors move through Alpine's key ideas. */
export function CinematicStage() {
  const stageRef = useRef<HTMLElement>(null);
  const actRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let frame = 0;
    const update = () => {
      const total = stage.offsetHeight - window.innerHeight;
      const progress = total > 0 ? clamp(-stage.getBoundingClientRect().top / total) : 0;
      const position = progress * (ACTS.length - 1);
      ACTS.forEach((_, index) => {
        const opacity = clamp(1 - Math.abs(position - index) * 1.7);
        const act = actRefs.current[index];
        if (act) {
          act.style.opacity = String(opacity);
          act.style.transform = `translate3d(0, ${(position - index) * -28}px, 0)`;
          act.style.pointerEvents = opacity > 0.65 ? "auto" : "none";
        }
        if (railRefs.current[index]) railRefs.current[index]!.dataset.active = String(opacity > 0.5);
      });
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - progress * 6));
    };
    const requestUpdate = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => { window.removeEventListener("scroll", requestUpdate); window.removeEventListener("resize", requestUpdate); cancelAnimationFrame(frame); };
  }, []);

  const goToAct = useCallback((index: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const total = stage.offsetHeight - window.innerHeight;
    window.scrollTo({ top: stage.offsetTop + (total * index) / (ACTS.length - 1), behavior: "smooth" });
  }, []);

  return (
    <section ref={stageRef} id="stage" aria-label="Alpine Astonia" className="relative bg-[#070c14]" style={{ height: `${ACTS.length * 100}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <img src={astoniaDusk} alt="Alpine Astonia residential towers and retail plaza at dusk" fetchpriority="high" className="absolute inset-0 h-full w-full scale-105 object-cover object-[58%_center]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(4,8,14,0.92)_0%,rgba(4,8,14,0.62)_38%,rgba(4,8,14,0.08)_72%),linear-gradient(0deg,rgba(4,8,14,0.84)_0%,rgba(4,8,14,0)_42%)]" />
        {ACTS.map((act, index) => (
          <div key={act.eyebrow} ref={(node) => { actRefs.current[index] = node; }} className="absolute inset-0 flex items-center will-change-[opacity,transform]" style={{ opacity: index === 0 ? 1 : 0 }}>
            <div className="container"><div className="max-w-xl pb-16 pt-24 md:pb-0">
              <p className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white/60"><span className="h-px w-8 bg-gold" />{act.eyebrow}</p>
              <h1 className="mt-6 font-serif text-[clamp(3.2rem,7vw,6.6rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-white">{act.title[0]}<br /><span className="text-white/50">{act.title[1]}</span></h1>
              <p className="mt-7 max-w-md text-sm leading-relaxed text-white/80 md:text-base">{act.body}</p>
              {act.stats && <dl className="mt-9 grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6">{act.stats.map(([value, label]) => <div key={label}><dt className="font-serif text-xl font-semibold text-white md:text-2xl">{value}</dt><dd className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50">{label}</dd></div>)}</dl>}
              {index === 0 && <div className="mt-10 flex flex-wrap gap-3"><Link to="/projects/alpine-astonia/experience" className="group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[11px] uppercase tracking-[0.24em] text-[#0b1524] transition-colors hover:bg-gold hover:text-white"><Box className="h-3.5 w-3.5" strokeWidth={1.6} />Enter the 3D twin</Link><a href="#projects" className="group inline-flex items-center gap-2.5 rounded-full border border-white/30 px-6 py-3.5 text-[11px] uppercase tracking-[0.24em] text-white transition-colors hover:border-white/75">All projects<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></div>}
            </div></div>
          </div>
        ))}
        <div ref={hintRef} className="absolute bottom-8 right-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/60 md:bottom-10 md:right-12"><span className="hidden md:inline">Scroll to explore</span><ArrowDown className="h-4 w-4 animate-bounce" strokeWidth={1.5} /></div>
        <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">{ACTS.map((act, index) => <button key={act.eyebrow} ref={(node) => { railRefs.current[index] = node; }} type="button" onClick={() => goToAct(index)} aria-label={`Go to ${act.eyebrow}`} data-active={index === 0 ? "true" : "false"} className="h-6 w-10 border-l border-white/30 transition-all duration-500 data-[active=true]:border-gold data-[active=true]:border-l-4" />)}</div>
      </div>
    </section>
  );
}
