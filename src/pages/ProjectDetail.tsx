import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Box,
  Check,
  Download,
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { AssetImage } from "@/components/AssetImage";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollChoreography } from "@/components/landing/ScrollChoreography";
import { LiteYouTube } from "@/components/LiteYouTube";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { findProject, projects } from "@/data/projects";
import { SITE, waLink } from "@/lib/site";

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = slug ? findProject(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (project) document.title = `${project.name}, ${project.location} — ${SITE.name}`;
  }, [slug, project]);

  if (!project) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="container flex min-h-screen flex-col items-center justify-center py-32 text-center">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Project not found
          </p>
          <h1 className="mt-6 font-serif text-5xl font-semibold tracking-[-0.05em] text-foreground">
            That address isn't ours.
          </h1>
          <p className="mt-5 max-w-md text-muted-foreground">
            The project you're looking for may have been renamed. Here is everything we've built.
          </p>
          <Link
            to="/projects"
            className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-gold"
          >
            View all projects <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);
  const has3D = project.slug === "alpine-astonia";

  return (
    <main className="min-h-screen bg-background">
      <ScrollChoreography />
      <Navbar />

      {/* ------------------------------------------------------------ banner */}
      <section data-nav-dark className="relative h-[86svh] min-h-[560px] w-full overflow-hidden">
        <img
          src={project.banner}
          alt={`${project.name} in ${project.location}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative z-10 flex h-full flex-col justify-end pb-14 pt-32">
          <Link
            to="/projects"
            className="mb-8 inline-flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> All projects
          </Link>
          <p className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/70">
            <MapPin className="h-3 w-3" /> {project.location}
            <span className="h-1 w-1 rounded-full bg-white/40" />
            {project.status}
            {project.configurations && (
              <>
                <span className="h-1 w-1 rounded-full bg-white/40" />
                {project.configurations.join(" · ")}
              </>
            )}
          </p>
          <h1 className="mt-5 font-serif text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-white">
            {project.name}
          </h1>
          <p className="mt-4 max-w-xl text-white/70">{project.type}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-primary transition-colors hover:bg-gold hover:text-white"
            >
              Enquire now
            </a>
            {has3D && (
              <Link
                to="/projects/alpine-astonia/experience"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/30 px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-white transition-colors hover:border-white"
              >
                <Box className="h-3.5 w-3.5" strokeWidth={1.6} /> Explore in 3D
              </Link>
            )}
            {project.brochureUrl && (
              <a
                href={project.brochureUrl}
                download={`${project.name} Brochure.pdf`}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/30 px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-white transition-colors hover:border-white"
              >
                <Download className="h-3.5 w-3.5" /> Brochure
              </a>
            )}
            <a
              href="#overview"
              className="inline-flex items-center gap-2 px-2 py-3.5 text-[11px] uppercase tracking-[0.22em] text-white/60 transition-colors hover:text-white"
            >
              Details <ArrowDown className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- quick facts */}
      {project.quickFacts && project.quickFacts.length > 0 && (
        <section className="border-b border-border bg-background">
          <div className="container">
            <dl className="grid grid-cols-2 divide-x divide-y divide-border border-x border-border md:grid-cols-4 md:divide-y-0">
              {project.quickFacts.map((f) => (
                <div key={f.label} className="px-5 py-8 md:px-8 md:py-10">
                  <dt className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="mt-3 font-serif text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- overview */}
      <section id="overview" className="bg-background py-24 md:py-32">
        <div className="container grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">
              <span className="hairline-gold" /> Overview
            </p>
            <h2 className="mt-6 font-serif text-3xl font-semibold tracking-[-0.045em] text-foreground md:text-4xl">
              An address with quiet conviction.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">{project.overview}</p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- highlights */}
      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container">
          <p className="eyebrow">
            <span className="hairline-gold" /> Key highlights
          </p>
          <h2 className="mt-6 font-serif text-3xl font-semibold tracking-[-0.045em] text-foreground md:text-4xl">
            Designed in the details.
          </h2>
          <ul className="mt-12 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-4 border-t border-border pt-6">
                <Check className="mt-1 h-4 w-4 flex-shrink-0 text-gold" strokeWidth={2} />
                <span className="text-foreground md:text-lg">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------- amenities */}
      <section className="bg-background py-24 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center">
              <span className="hairline-gold" /> Amenities <span className="hairline-gold" />
            </p>
            <h2 className="mt-6 font-serif text-3xl font-semibold tracking-[-0.045em] text-foreground md:text-4xl">
              A life of considered convenience.
            </h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 md:grid-cols-3">
            {project.amenities.map((a) => (
              <div key={a} className="bg-background px-7 py-9 text-center">
                <div className="mx-auto h-px w-7 bg-gold" />
                <p className="mt-5 font-serif text-lg font-medium tracking-[-0.03em] text-foreground">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- amenity gallery */}
      {project.amenityGallery && project.amenityGallery.length > 0 && (
        <section className="bg-secondary/50 py-24 md:py-32">
          <div className="container">
            <p className="eyebrow">
              <span className="hairline-gold" /> Amenity gallery
            </p>
            <h2 className="mt-6 font-serif text-3xl font-semibold tracking-[-0.045em] text-foreground md:text-4xl">
              Every day, a little more considered.
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-2 lg:grid-cols-3">
              {project.amenityGallery.map((a) => (
                <figure key={a.label} className="group relative bg-background">
                  <div className="aspect-[4/3] overflow-hidden">
                    <AssetImage
                      src={a.image}
                      alt={`${a.label} at ${project.name}`}
                      label={a.label}
                      className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="flex items-center gap-3 border-t border-border px-6 py-5">
                    <span className="h-px w-6 flex-shrink-0 bg-gold" />
                    <span className="font-serif text-base font-medium tracking-[-0.03em] text-foreground">
                      {a.label}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------- gallery */}
      <section className="bg-background py-24 md:py-28">
        <div className="container">
          <p className="eyebrow">
            <span className="hairline-gold" /> Gallery
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {project.gallery.map((src, i) => (
              <div
                key={src + i}
                className={`relative overflow-hidden rounded-2xl ${
                  i === 0 ? "aspect-[21/10] md:col-span-2" : "aspect-[4/3]"
                }`}
              >
                <img
                  src={src}
                  alt={`${project.name} gallery ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- walkthrough */}
      {project.walkthroughVideoId && (
        <section className="bg-primary py-24 text-primary-foreground md:py-32">
          <div className="container">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="flex items-center gap-4 text-[10px] uppercase tracking-[0.32em] text-white/50">
                  <span className="h-px w-10 bg-gold" /> Walkthrough
                </p>
                <h2 className="mt-6 font-serif text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
                  Step inside {project.name}.
                </h2>
              </div>
              <p className="max-w-sm text-sm text-white/55">
                A cinematic tour through the residences, amenities and the address.
              </p>
            </div>
            <div className="mt-12 overflow-hidden rounded-2xl border border-white/10">
              <LiteYouTube
                id={project.walkthroughVideoId}
                title={`${project.name} walkthrough`}
              />
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- testimonials */}
      {project.testimonialVideoIds && project.testimonialVideoIds.length > 0 && (
        <section className="bg-secondary/50 py-24 md:py-32">
          <div className="container">
            <p className="eyebrow">
              <span className="hairline-gold" /> Resident testimonials
            </p>
            <h2 className="mt-6 font-serif text-3xl font-semibold tracking-[-0.045em] text-foreground md:text-4xl">
              Heard from the homes themselves.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {project.testimonialVideoIds.map((vid, i) => (
                <div
                  key={vid}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-card-soft"
                >
                  <LiteYouTube id={vid} title={`${project.name} testimonial ${i + 1}`} />
                  <div className="border-t border-border p-5">
                    <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} · Resident story
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------- floor plans */}
      {project.floorPlans && project.floorPlans.length > 0 && (
        <section className="bg-background py-24 md:py-32">
          <div className="container">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">
                  <span className="hairline-gold" /> Floor plans
                </p>
                <h2 className="mt-6 font-serif text-3xl font-semibold tracking-[-0.045em] text-foreground md:text-4xl">
                  Plans built around the way you live.
                </h2>
              </div>
              {has3D && (
                <Link
                  to="/projects/alpine-astonia/experience"
                  className="group inline-flex items-center gap-2.5 self-start rounded-full border border-border px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:border-gold hover:text-gold"
                >
                  <Box className="h-3.5 w-3.5" /> See it in 3D
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {project.floorPlans.map((fp) => (
                <div key={fp.label} className="rounded-2xl border border-border bg-card p-6">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-white">
                    <AssetImage
                      src={fp.image}
                      alt={fp.label}
                      label={fp.label}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Configuration
                  </p>
                  <p className="mt-2 font-serif text-lg font-medium tracking-[-0.03em] text-foreground">
                    {fp.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- map */}
      <section className="bg-secondary/50 py-24 md:py-32">
        <div className="container">
          <p className="eyebrow">
            <span className="hairline-gold" /> Location
          </p>
          <h2 className="mt-6 font-serif text-3xl font-semibold tracking-[-0.045em] text-foreground md:text-4xl">
            {project.location}
          </h2>
          <div className="mt-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border md:aspect-[21/9]">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                project.mapCoords || project.mapQuery || `${project.name}, ${project.location}`,
              )}&t=m&z=16&hl=en&output=embed`}
              title={`${project.name} location map`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full grayscale transition-all duration-700 hover:grayscale-0"
            />
          </div>
          <a
            href={
              project.mapUrl ||
              `https://www.google.com/maps?q=${encodeURIComponent(project.location)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-gold transition-colors hover:text-gold-deep"
          >
            Open in Google Maps <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </section>

      <Contact projectName={project.name} />

      {/* ------------------------------------------------------------ related */}
      <section className="bg-background py-24">
        <div className="container">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-2xl font-semibold tracking-[-0.04em] text-foreground md:text-3xl">
              More Alpine addresses
            </h2>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 whitespace-nowrap text-[10px] uppercase tracking-[0.24em] text-foreground transition-colors hover:text-gold"
            >
              All projects
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProjectCard key={p.slug} project={p} ratio="aspect-[4/3]" />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Sticky mobile action bar — the fastest path to a call. */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-border bg-background/95 p-3 backdrop-blur-md md:hidden">
        <a
          href={`tel:${SITE.phoneRaw}`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-3 text-[10px] uppercase tracking-[0.2em] text-foreground"
        >
          <Phone className="h-3.5 w-3.5" /> Call
        </a>
        <a
          href={waLink(`Hello Alpine Landmarks, I'd like to know more about ${project.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-[10px] uppercase tracking-[0.2em] text-primary-foreground"
        >
          Enquire
        </a>
      </div>

      <WhatsAppButton raised />
    </main>
  );
};

export default ProjectDetail;
