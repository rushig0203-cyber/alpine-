import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { projects } from "@/data/projects";

const positions = [
  { x: 68, y: 25 }, { x: 43, y: 33 }, { x: 76, y: 48 }, { x: 35, y: 53 },
  { x: 63, y: 59 }, { x: 23, y: 68 }, { x: 47, y: 75 }, { x: 78, y: 80 },
];

export function ProjectAtlas() {
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <section className="bg-background px-0 py-0">
      <div className="relative isolate overflow-hidden bg-primary py-20 text-primary-foreground md:py-28">
        <div className="absolute inset-0 transition-opacity duration-700" aria-hidden="true">
          <img src={project.cover} alt="" loading="lazy" className="h-full w-full object-cover opacity-[0.20] grayscale" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,transparent_0%,hsl(0_0%_7%_/_0.55)_50%,hsl(0_0%_7%_/_0.96)_100%)]" />
        </div>
        <div className="container relative">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-gold"><span className="h-px w-10 bg-gold" /> Alpine Atlas</p>
              <h2 className="mt-6 font-serif text-5xl font-semibold leading-[0.92] tracking-[-0.06em] md:text-6xl">
                Every landmark<br /><span className="text-gold">has a coordinate.</span>
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-primary-foreground/60">
                Explore a connected portfolio of considered addresses across PCMC.
              </p>
            </div>

            <div className="hidden aspect-[1.5/1] rounded-full border border-primary-foreground/15 p-10 lg:block">
              <div className="atlas-field relative h-full rounded-full border border-primary-foreground/10">
                <span className="absolute left-1/2 top-0 h-full w-px bg-primary-foreground/[0.07]" />
                <span className="absolute left-0 top-1/2 h-px w-full bg-primary-foreground/[0.07]" />
                {projects.map((item, index) => {
                  const position = positions[index];
                  const selected = index === active;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      aria-label={`Show ${item.name}`}
                      aria-pressed={selected}
                      onFocus={() => setActive(index)}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => setActive(index)}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                      style={{ left: `${position.x}%`, top: `${position.y}%` }}
                    >
                      <span className={`relative flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-500 ${selected ? "border-gold bg-gold shadow-[0_0_0_8px_hsl(211_34%_45%_/_0.14)]" : "border-primary-foreground/40 bg-primary hover:border-gold"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full transition-colors ${selected ? "bg-primary" : "bg-primary-foreground/50 group-hover:bg-gold"}`} />
                      </span>
                      <span className={`pointer-events-none absolute left-5 top-1/2 w-max -translate-y-1/2 text-[9px] uppercase tracking-[0.22em] transition-all duration-500 ${selected ? "translate-x-0 text-primary-foreground" : "-translate-x-2 text-primary-foreground/0 group-hover:translate-x-0 group-hover:text-primary-foreground/70"}`}>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-8 border-t border-primary-foreground/15 pt-7 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-gold">{String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {project.location}</p>
              <h3 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{project.name}</h3>
              <p className="mt-3 text-sm text-primary-foreground/60">{project.type}</p>
            </div>
            <Link to={`/projects/${project.slug}`} className="group inline-flex items-center gap-3 border-b border-gold pb-2 text-sm text-gold transition-colors hover:text-primary-foreground">
              Explore this landmark <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-9 flex gap-2 overflow-x-auto pb-2 lg:hidden" aria-label="Select a landmark">
            {projects.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={active === index}
                className={`whitespace-nowrap border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors ${active === index ? "border-gold bg-gold text-gold-foreground" : "border-primary-foreground/20 text-primary-foreground/65"}`}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
