import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";

export const Projects = () => {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const step = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gap = 24;
    el.scrollBy({ left: ((card?.offsetWidth ?? el.clientWidth * 0.8) + gap) * dir, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
      const cards = [...el.querySelectorAll<HTMLElement>("[data-card]")];
      let closest = 0;
      let min = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - el.scrollLeft - 24);
        if (d < min) {
          min = d;
          closest = i;
        }
      });
      setActive(closest);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="projects" className="overflow-hidden bg-secondary/50 py-24 md:py-32">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">
              <span className="hairline-gold" /> Portfolio
            </p>
            <h2 className="mt-6 text-balance font-serif text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-foreground">
              A collection of<br />
              <span className="text-gold">living landmarks.</span>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-serif text-lg text-muted-foreground">
              <span className="text-foreground">{String(active + 1).padStart(2, "0")}</span>
              <span className="mx-1.5 text-gold">/</span>
              {String(projects.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous project"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-gold hover:text-gold"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next project"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-gold hover:text-gold"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-label="Project portfolio. Scroll horizontally to browse."
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 pl-[max(2rem,calc((100vw-1400px)/2+2rem))] pr-8"
      >
        {projects.map((p, i) => (
          <div
            key={p.slug}
            data-card
            className="w-[80vw] flex-shrink-0 snap-start sm:w-[52vw] md:w-[38vw] lg:w-[27vw] xl:w-[23vw]"
          >
            <ProjectCard project={p} index={i} />
          </div>
        ))}
      </div>

      <div className="container mt-10 flex items-center gap-6">
        <div className="h-px flex-1 bg-border">
          <div
            className="h-px bg-gold transition-[width] duration-300"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </div>
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 whitespace-nowrap text-[10px] uppercase tracking-[0.24em] text-foreground transition-colors hover:text-gold"
        >
          All projects
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
};
