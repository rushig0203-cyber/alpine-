import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import featured from "@/assets/astonia-dusk.jpg";
import { TiltFrame } from "@/components/landing/TiltFrame";

export const FeaturedProject = () => {
  return (
    <section className="relative overflow-hidden bg-background py-0 text-foreground">
      <div className="grid lg:grid-cols-2">
        <TiltFrame className="relative h-[58vh] overflow-hidden lg:order-2 lg:h-[92vh]">
          <img
            src={featured}
            alt="Alpine Astonia — featured residential landmark"
            loading="lazy"
            className="h-full w-full object-cover transition-luxury duration-[1500ms] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/45 to-transparent lg:bg-gradient-to-l lg:from-primary/20 lg:to-transparent" />
          <p className="absolute bottom-7 right-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-primary-foreground/75"><span className="h-px w-8 bg-gold" /> Kiwale, PCMC</p>
        </TiltFrame>

        <div className="relative flex items-center px-6 py-20 md:px-16 lg:order-1 lg:py-32">
          <span className="absolute left-0 top-0 h-px w-24 bg-gold lg:top-1/2 lg:w-16" />
          <div className="max-w-lg">
            <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
              <span className="hairline-gold" /> Featured Project
            </p>
            <h2 className="mt-6 text-balance font-serif text-5xl font-semibold leading-[0.92] tracking-[-0.06em] md:text-6xl lg:text-7xl">
              Alpine Astonia.
              <br />
              <span className="text-gold-deep">A new landmark in Kiwale.</span>
            </h2>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
              197 premium apartments rising above a 39-shop retail plaza, set across
              4,00,000 sqft of considered design. Our most ambitious address yet.
            </p>

            <dl className="mt-12 grid grid-cols-3 gap-4 border-y border-border py-7 md:gap-6">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Units</dt>
                <dd className="mt-2 font-serif text-2xl font-light">197</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Retail</dt>
                <dd className="mt-2 font-serif text-2xl font-light">39</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Built-up</dt>
                <dd className="mt-2 font-serif text-2xl font-light">4 L sqft</dd>
              </div>
            </dl>

            <Link
              to="/projects/alpine-astonia"
              className="group mt-12 inline-flex items-center gap-3 border-b border-gold pb-2 font-serif text-base font-semibold text-foreground transition-colors hover:text-gold-deep"
            >
              Explore the project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/projects/alpine-astonia/experience"
              className="ml-6 inline-flex items-center gap-2 border-b border-border pb-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-gold hover:text-gold-deep"
            >
              Explore in 3D <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
