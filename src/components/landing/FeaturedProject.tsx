import { ArrowUpRight, Box, Download, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import featured from "@/assets/astonia-dusk.jpg";
import { TiltFrame } from "@/components/landing/TiltFrame";
import brochure from "@/assets/alpine-astonia-brochure.pdf.asset.json";
import { SITE } from "@/lib/site";

const FACTS = [
  ["197", "Apartments"],
  ["39", "Retail shops"],
  ["4 L", "Built-up sq.ft."],
  ["2 & 3", "BHK homes"],
];

export const FeaturedProject = () => {
  return (
    <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground md:py-32">
      <div className="container">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p className="flex items-center gap-4 text-[10px] uppercase tracking-[0.34em] text-white/50">
              <span className="h-px w-10 bg-gold" /> Featured project
            </p>
            <h2 className="mt-7 text-balance font-serif text-[clamp(2.5rem,5.2vw,4.6rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
              Alpine Astonia.
              <br />
              <span className="text-white/55">A landmark in Kiwale.</span>
            </h2>
            <p className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/45">
              <MapPin className="h-3.5 w-3.5" /> Kiwale, Ravet · PCMC, Pune
            </p>

            <p className="mt-8 max-w-lg text-base leading-relaxed text-white/65">
              197 premium residences rising above a 39-shop retail plaza, across 4,00,000 sq.ft.
              of built-up area — and the one address on this site you can walk through in
              real-time 3D before you visit.
            </p>

            <dl className="mt-11 grid max-w-xl grid-cols-2 gap-y-8 border-y border-white/15 py-8 sm:grid-cols-4">
              {FACTS.map(([value, label]) => (
                <div key={label}>
                  <dt className="font-serif text-3xl font-semibold tracking-[-0.04em]">{value}</dt>
                  <dd className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-white/45">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/projects/alpine-astonia/experience"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-primary transition-colors hover:bg-gold hover:text-white"
              >
                <Box className="h-3.5 w-3.5" strokeWidth={1.6} /> Enter the 3D twin
              </Link>
              <Link
                to="/projects/alpine-astonia"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-white transition-colors hover:border-white/70"
              >
                Plans & amenities
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <a
                href={brochure.url}
                download="Alpine Astonia Brochure.pdf"
                className="inline-flex items-center gap-2.5 rounded-full border border-transparent px-2 py-3.5 text-[11px] uppercase tracking-[0.22em] text-white/60 transition-colors hover:text-white"
              >
                <Download className="h-3.5 w-3.5" /> Brochure
              </a>
            </div>

            <p className="mt-8 text-[10px] uppercase tracking-[0.22em] text-white/35">
              {SITE.rera.authority} · {SITE.rera.astonia}
            </p>
          </div>

          <TiltFrame strength={3} lift={18} className="relative">
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src={featured}
                alt="Alpine Astonia at dusk"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,14,24,0)_45%,rgba(6,14,24,0.7)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.26em] text-white/60">Possession</p>
                  <p className="mt-1.5 font-serif text-xl">Ready to move</p>
                </div>
                <span className="rounded-full border border-white/30 px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-white/80">
                  2 & 3 BHK
                </span>
              </div>
            </div>
          </TiltFrame>
        </div>
      </div>
    </section>
  );
};
