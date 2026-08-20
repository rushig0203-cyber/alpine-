import { ArrowUpRight, Box } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollChoreography } from "@/components/landing/ScrollChoreography";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { projects } from "@/data/projects";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Residential", "Commercial & Retail", "Kiwale & Ravet", "Moshi & Chikhali", "Chinchwad"] as const;
type Filter = (typeof FILTERS)[number];

const matches = (filter: Filter, type: string, location: string) => {
  switch (filter) {
    case "All":
      return true;
    case "Residential":
      return /resid|apartment|homes/i.test(type);
    case "Commercial & Retail":
      return /commercial|retail|mixed/i.test(type);
    case "Kiwale & Ravet":
      return /kiwale|ravet/i.test(location);
    case "Moshi & Chikhali":
      return /moshi|chikhali/i.test(location);
    case "Chinchwad":
      return /chinchwad/i.test(location);
    default:
      return true;
  }
};

const ProjectsIndex = () => {
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Projects — ${SITE.name}`;
  }, []);

  const visible = useMemo(
    () => projects.filter((p) => matches(filter, p.type, p.location)),
    [filter],
  );

  return (
    <main className="min-h-screen bg-background">
      <ScrollChoreography />
      <Navbar />

      <section
        data-nav-dark
        className="relative overflow-hidden bg-primary pb-20 pt-36 text-primary-foreground md:pb-28 md:pt-44"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:5rem_5rem] [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]" />
        <div className="container relative">
          <p className="flex items-center gap-4 text-[10px] uppercase tracking-[0.34em] text-white/50">
            <span className="h-px w-10 bg-gold" /> {projects.length} landmarks · {SITE.region}
          </p>
          <h1 className="mt-7 max-w-4xl text-balance font-serif text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.06em]">
            Every address
            <br />
            <span className="text-white/55">we have signed.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/60">
            Twenty years of residences, retail plazas and mixed-use landmarks across
            Pimpri-Chinchwad — 1.3 million sq.ft. delivered and 1100+ families settled in.
          </p>
        </div>
      </section>

      <section className="sticky top-[4.5rem] z-20 border-y border-border bg-background/85 backdrop-blur-md md:top-[5rem]">
        <div className="container flex gap-2 overflow-x-auto py-4 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container">
          {visible.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              No projects in this category yet.
            </p>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} ratio="aspect-[4/5]" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-secondary/50 py-20">
        <div className="container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">
              <span className="hairline-gold" /> Not sure where to start?
            </p>
            <h2 className="mt-5 max-w-xl font-serif text-3xl font-semibold tracking-[-0.045em] text-foreground md:text-4xl">
              Walk through Alpine Astonia in real-time 3D.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/projects/alpine-astonia/experience"
              className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-gold"
            >
              <Box className="h-3.5 w-3.5" strokeWidth={1.6} /> Enter the 3D twin
            </Link>
            <Link
              to="/#contact"
              className="group inline-flex items-center gap-2.5 rounded-full border border-border px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              Talk to us
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default ProjectsIndex;
