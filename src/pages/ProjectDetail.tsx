import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Check, ArrowDown, ExternalLink, Download } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Contact } from "@/components/landing/Contact";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { findProject } from "@/data/projects";

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = slug ? findProject(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-light">Project not found</h1>
          <Button variant="dark" asChild className="mt-6">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <img
          src={project.banner}
          alt={`${project.name} in ${project.location}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative z-10 flex h-full flex-col justify-end pb-16 pt-32">
          <Link
            to="/#projects"
            className="mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-primary-foreground/80 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Projects
          </Link>
          <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-primary-foreground/80">
            <MapPin className="h-3 w-3" /> {project.location} · {project.status}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light text-primary-foreground md:text-7xl">
            {project.name}
          </h1>
          <p className="mt-3 text-lg text-primary-foreground/80">{project.type}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button variant="light" size="lg" asChild>
              <a href="#contact">Enquire about {project.name}</a>
            </Button>
            <Button variant="outlineLight" size="lg" asChild>
              <a href="#overview" className="inline-flex items-center gap-2">
                Explore details <ArrowDown className="h-4 w-4" />
              </a>
            </Button>
            {project.slug === "alpine-astonia" && (
              <Button variant="outlineLight" size="lg" asChild>
                <Link to="/projects/alpine-astonia/experience" className="inline-flex items-center gap-2">
                  Explore in 3D <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {project.brochureUrl && (
              <Button variant="outlineLight" size="lg" asChild>
                <a
                  href={project.brochureUrl}
                  download={`${project.name} Brochure.pdf`}
                  className="inline-flex items-center gap-2"
                >
                  <Download className="h-4 w-4" /> Download Brochure
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Quick facts strip */}
      {project.quickFacts && project.quickFacts.length > 0 && (
        <section className="border-b border-border bg-background">
          <div className="container">
            <dl className="grid divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
              {project.quickFacts.map((f) => (
                <div key={f.label} className="px-2 py-8 md:px-8">
                  <dt className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="mt-3 font-serif text-2xl font-light text-foreground">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Overview */}
      <section id="overview" className="bg-background py-28">
        <div className="container grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              <span className="hairline" /> Overview
            </p>
            <h2 className="mt-6 font-serif text-3xl font-light text-foreground md:text-4xl">
              An address with quiet conviction.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted-foreground">{project.overview}</p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-secondary/40 py-28">
        <div className="container">
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span className="hairline" /> Key Highlights
          </p>
          <h2 className="mt-6 font-serif text-3xl font-light text-foreground md:text-4xl">
            Designed in the details.
          </h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-4 border-t border-border pt-6">
                <Check className="mt-1 h-4 w-4 flex-shrink-0 text-gold" strokeWidth={2} />
                <span className="text-foreground md:text-lg">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-background py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              <span className="hairline" /> Amenities <span className="hairline" />
            </p>
            <h2 className="mt-6 font-serif text-3xl font-light text-foreground md:text-4xl">
              A life of considered convenience.
            </h2>
          </div>
          <div className="mt-16 grid gap-px bg-border md:grid-cols-3">
            {project.amenities.map((a) => (
              <div key={a} className="bg-background px-8 py-10 text-center">
                <div className="mx-auto h-px w-8 bg-gold" />
                <p className="mt-5 font-serif text-xl font-light text-foreground">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenity gallery */}
      {project.amenityGallery && project.amenityGallery.length > 0 && (
        <section className="bg-secondary/40 py-28">
          <div className="container">
            <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              <span className="hairline" /> Amenity Gallery
            </p>
            <h2 className="mt-6 font-serif text-3xl font-light text-foreground md:text-4xl">
              Every day, a little more considered.
            </h2>
            <div className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
              {project.amenityGallery.map((a) => (
                <figure key={a.label} className="group relative overflow-hidden bg-background">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={a.image}
                      alt={`${a.label} at ${project.name}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-luxury duration-[1200ms] group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="flex items-center gap-3 border-t border-border px-6 py-5">
                    <span className="h-px w-6 flex-shrink-0 bg-gold" />
                    <span className="font-serif text-lg font-light text-foreground">{a.label}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      <section className="bg-background pb-28">
        <div className="container">
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span className="hairline" /> Gallery
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {project.gallery.map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden ${i === 0 ? "md:col-span-2 aspect-[21/10]" : "aspect-[4/3]"}`}
              >
                <img src={src} alt={`${project.name} gallery ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-luxury hover:scale-105 duration-[1200ms]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Walkthrough video */}
      {project.walkthroughVideoId && (
        <section className="bg-primary py-28 text-primary-foreground">
          <div className="container">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-primary-foreground/60">
                  <span className="hairline-gold" /> Walkthrough
                </p>
                <h2 className="mt-6 font-serif text-3xl font-light md:text-4xl">
                  Step inside {project.name}.
                </h2>
              </div>
              <p className="max-w-sm text-sm text-primary-foreground/60">
                A cinematic tour through the residences, amenities and the address.
              </p>
            </div>
            <div className="mt-12 aspect-video w-full overflow-hidden border border-primary-foreground/10 bg-background">
              <iframe
                src={`https://www.youtube.com/embed/${project.walkthroughVideoId}?rel=0&modestbranding=1`}
                title={`${project.name} walkthrough`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="h-full w-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* Resident testimonial videos */}
      {project.testimonialVideoIds && project.testimonialVideoIds.length > 0 && (
        <section className="bg-secondary/40 py-28">
          <div className="container">
            <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              <span className="hairline" /> Resident Testimonials
            </p>
            <h2 className="mt-6 font-serif text-3xl font-light text-foreground md:text-4xl">
              Heard from the homes themselves.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {project.testimonialVideoIds.map((vid, i) => (
                <div key={vid} className="bg-background shadow-card-soft">
                  <div className="aspect-video overflow-hidden bg-primary">
                    <iframe
                      src={`https://www.youtube.com/embed/${vid}?rel=0&modestbranding=1`}
                      title={`${project.name} testimonial ${i + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="border-t border-border p-5">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} · Resident Story
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floor Plans */}
      {project.floorPlans && project.floorPlans.length > 0 && (
        <section className="bg-secondary/40 py-28">
          <div className="container">
            <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
              <span className="hairline" /> Floor Plans
            </p>
            <h2 className="mt-6 font-serif text-3xl font-light text-foreground md:text-4xl">
              Plans built around the way you live.
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {project.floorPlans.map((fp) => (
                <div key={fp.label} className="bg-background p-6">
                  <div className="aspect-[4/3] overflow-hidden bg-white">
                    <img src={fp.image} alt={fp.label} loading="lazy" className="h-full w-full object-contain" />
                  </div>
                  <p className="mt-5 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Configuration</p>
                  <p className="mt-2 font-serif text-xl font-light text-foreground">{fp.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Map */}
      <section className="bg-background py-28">
        <div className="container">
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span className="hairline" /> Location
          </p>
          <h2 className="mt-6 font-serif text-3xl font-light text-foreground md:text-4xl">
            {project.location}
          </h2>
          <div className="mt-12 aspect-[21/9] w-full overflow-hidden border border-border">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                project.mapCoords || project.mapQuery || `${project.name}, ${project.location}`
              )}&t=m&z=16&hl=en&output=embed`}
              title={`${project.name} location map`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full grayscale hover:grayscale-0 transition-all duration-700"
            />

          </div>
          <a
            href={project.mapUrl || `https://www.google.com/maps?q=${encodeURIComponent(project.location)}`}
            className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-gold transition-colors hover:text-gold/80"
          >
            Open in Google Maps <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </section>

      <Contact projectName={project.name} />
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default ProjectDetail;
