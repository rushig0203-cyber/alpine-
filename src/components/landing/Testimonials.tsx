import { useRef } from "react";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";

const videos = [
  { id: "ClVGXWw7oa8", label: "Resident Story · 01" },
  { id: "uvV8GZtHKl8", label: "Resident Story · 02" },
  { id: "R9BwBPirLsQ", label: "Resident Story · 03" },
  { id: "J15VK3pWQLs", label: "Resident Story · 04" },
  { id: "OWIRzKyMtP4", label: "Resident Story · 05" },
];

export const Testimonials = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-vcard]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section className="overflow-hidden bg-secondary/40 py-24 md:py-36">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              <span className="hairline" /> Voices of Trust
            </p>
            <h2 className="mt-6 text-balance font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-foreground md:text-6xl">
              Home, in<br /><span className="text-gold-deep">their own words.</span>
            </h2>
            <p className="mt-5 max-w-lg text-muted-foreground">
              Hear directly from families who now call Alpine Astonia home.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Previous testimonial"
              className="flex h-12 w-12 items-center justify-center border border-border text-foreground transition-luxury hover:border-gold hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Next testimonial"
              className="flex h-12 w-12 items-center justify-center border border-border text-foreground transition-luxury hover:border-gold hover:text-gold"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-label="Resident testimonial videos. Use the arrow buttons to browse."
        className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 pl-[max(2rem,calc((100vw-1400px)/2+2rem))] pr-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((v, i) => (
          <article
            key={v.id}
            data-vcard
            className="group flex w-[82vw] flex-shrink-0 snap-start flex-col bg-background shadow-card-soft sm:w-[55vw] md:w-[42vw] lg:w-[32vw]"
          >
            <div className="relative aspect-video overflow-hidden bg-primary after:pointer-events-none after:absolute after:inset-0 after:border-[10px] after:border-background/10">
              <iframe
                src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`}
                title={v.label}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border p-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} · Alpine Astonia
                </p>
                <p className="mt-2 font-serif text-lg font-light text-foreground">
                  {v.label}
                </p>
              </div>
              <PlayCircle className="h-6 w-6 text-gold" strokeWidth={1.25} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
