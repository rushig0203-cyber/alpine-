import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { TiltFrame } from "@/components/landing/TiltFrame";

export const Projects = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gap = 32;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    const target = cards[i];
    if (target) {
      el.scrollTo({ left: target.offsetLeft - 32, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = el.querySelectorAll<HTMLElement>("[data-card]");
      let closest = 0;
      let min = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - el.scrollLeft - 32);
        if (d < min) {
          min = d;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="projects" className="overflow-hidden bg-background py-24 md:py-36">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              <span className="hairline" /> Our Projects
            </p>
            <h2 className="mt-6 text-balance font-serif text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-foreground md:text-6xl lg:text-7xl">
              A collection<br />of <span className="text-gold-deep">living landmarks.</span>
            </h2>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end gap-1">
              <span className="font-serif text-2xl font-light text-foreground">
                {String(activeIndex + 1).padStart(2, "0")}
                <span className="mx-2 text-gold">/</span>
                {String(projects.length).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollByCard(-1)}
                aria-label="Previous projects"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-luxury hover:border-gold hover:text-gold"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => scrollByCard(1)}
                aria-label="Next projects"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-luxury hover:border-gold hover:text-gold"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-14 flex items-center justify-between border-t border-border pt-5 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        <span>Scroll to explore</span>
        <span>Selected works / 2006—2026</span>
      </div>

      {/* Horizontal project collection */}
      <div
        ref={scrollerRef}
        className="mt-20 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth pb-8 pl-[max(2rem,calc((100vw-1400px)/2+2rem))] pr-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            to={`/projects/${p.slug}`}
            data-card
            aria-label={`View details for ${p.name}`}
            className="group relative block w-[78vw] flex-shrink-0 snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:w-[52vw] md:w-[38vw] lg:w-[30vw] xl:w-[26vw]"
          >
            {/* Image frame */}
            <TiltFrame className="relative aspect-[4/5] overflow-hidden bg-muted shadow-[0_20px_50px_-28px_hsl(0_0%_11%_/_0.55)]">
              <img
                src={p.cover}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
              />

              {/* Quiet bottom vignette for text legibility */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/10 to-transparent" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gold/0 transition-colors duration-700 group-hover:bg-gold/10" />

              <span className="pointer-events-none absolute -right-3 -top-5 font-serif text-8xl leading-none text-primary-foreground/[0.12] transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-1 md:text-9xl" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="absolute left-6 top-6 flex items-start justify-between gap-3 text-primary-foreground/80 md:left-8 md:top-8">
                <span className="font-serif text-xs tracking-[0.35em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="border border-primary-foreground/30 bg-primary/20 px-2 py-1 text-[8px] uppercase tracking-[0.22em] backdrop-blur-sm">{p.status}</span>
              </div>

              {/* Bottom caption */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-10" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/80">
                    {p.location}
                  </p>
                </div>
                <h3 className="mt-4 font-serif text-2xl font-light leading-tight text-primary-foreground transition-colors duration-500 group-hover:text-gold md:text-[1.75rem]">
                  {p.name}
                </h3>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-primary-foreground/55">{p.type}</p>

                {/* View prompt — appears on hover */}
                <p className="mt-4 max-h-0 overflow-hidden text-[10px] uppercase tracking-[0.3em] text-primary-foreground/0 transition-all duration-500 group-hover:max-h-6 group-hover:text-primary-foreground/80">
                  View Project
                </p>
              </div>
            </TiltFrame>
          </Link>
        ))}
      </div>

      {/* Minimal progress indicator */}
      <div className="container mt-10">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border">
            <div
              className="h-full bg-gold transition-all duration-500"
              style={{
                width: `${((activeIndex + 1) / projects.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Clickable tick marks */}
        <div className="mt-4 flex items-center justify-between">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${p.name}`}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? "w-8 bg-gold"
                  : "w-1 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
