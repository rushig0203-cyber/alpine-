import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useRef } from "react";
import { LiteYouTube } from "@/components/LiteYouTube";

const videos = [
  { id: "ClVGXWw7oa8", label: "Resident story · 01" },
  { id: "uvV8GZtHKl8", label: "Resident story · 02" },
  { id: "R9BwBPirLsQ", label: "Resident story · 03" },
  { id: "J15VK3pWQLs", label: "Resident story · 04" },
  { id: "OWIRzKyMtP4", label: "Resident story · 05" },
];

export const Testimonials = () => {
  const scroller = useRef<HTMLDivElement>(null);

  const step = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-vcard]");
    el.scrollBy({ left: ((card?.offsetWidth ?? el.clientWidth * 0.8) + 24) * dir, behavior: "smooth" });
  }, []);

  return (
    <section className="overflow-hidden bg-background py-24 md:py-32">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">
              <span className="hairline-gold" /> Voices of trust
            </p>
            <h2 className="mt-6 text-balance font-serif text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-foreground">
              Home, in
              <br />
              <span className="text-gold">their own words.</span>
            </h2>
            <p className="mt-5 max-w-lg text-muted-foreground">
              Families who already have the keys to an Alpine address.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-label="Resident testimonial videos"
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 pl-[max(2rem,calc((100vw-1400px)/2+2rem))] pr-8"
      >
        {videos.map((v, i) => (
          <article
            key={v.id}
            data-vcard
            className="w-[82vw] flex-shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft sm:w-[55vw] md:w-[42vw] lg:w-[31vw]"
          >
            <LiteYouTube id={v.id} title={v.label} />
            <div className="flex items-center justify-between gap-4 border-t border-border p-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")} · Alpine Astonia
                </p>
                <p className="mt-2 font-serif text-lg font-medium tracking-[-0.03em] text-foreground">
                  {v.label}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
