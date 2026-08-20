import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const PILLARS = [
  {
    k: "Design",
    v: "Elevations that hold up in twenty years, not twenty months.",
  },
  {
    k: "Delivery",
    v: "12+ projects handed over on the date we committed to.",
  },
  {
    k: "Transparency",
    v: "MahaRERA registered, clear paperwork, no hidden cost.",
  },
];

export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-36">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">
              <span className="hairline-gold" /> The Alpine way
            </p>
            <p className="mt-8 max-w-4xl text-balance font-serif text-[clamp(2.1rem,4.6vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-foreground">
              Since 2006 we have shaped Pimpri-Chinchwad one address at a time —
              buildings that feel <span className="text-gold">inevitable</span> rather
              than merely built.
            </p>
          </div>
          <div className="lg:col-span-4 lg:pb-3">
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Alpine Landmarks LLP is a family-run developer working across Pradhikaran,
              Chinchwad, Ravet, Moshi, Chikhali and Kiwale. Everything we put our name on is
              built to be lived in for a generation.
            </p>
            <Link
              to="/projects"
              className="group mt-8 inline-flex items-center gap-3 border-b border-gold pb-2 text-[11px] uppercase tracking-[0.24em] text-foreground transition-colors hover:text-gold"
            >
              View the portfolio
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <dl className="mt-20 grid gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.k} className="bg-background px-7 py-9">
              <dt className="text-[10px] uppercase tracking-[0.3em] text-gold">{p.k}</dt>
              <dd className="mt-4 font-serif text-xl font-medium leading-snug tracking-[-0.03em] text-foreground">
                {p.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
