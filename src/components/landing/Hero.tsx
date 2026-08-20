import heroImg from "@/assets/hero-luxury.jpg";
import brochure from "@/assets/alpine-astonia-brochure.pdf.asset.json";
import { ArrowDown, Box, Download } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

function canRender3D() {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  // Keep the visual hero on capable phones; low-power devices stay on the photograph fallback.
  if (window.innerWidth < 768 && (cores < 4 || memory < 3)) return false;
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}

export const Hero = () => {
  const [showScene, setShowScene] = useState(false);
  const [sceneAvailable, setSceneAvailable] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const loadScene = () => {
      const available = canRender3D();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setSceneAvailable(available);
      setReducedMotion(reduced);
      if (available && !reduced) setShowScene(true);
    };
    const idle = window.setTimeout(loadScene, 800);
    return () => window.clearTimeout(idle);
  }, []);

  return (
    <section className="hero-stage relative min-h-[760px] w-full overflow-hidden md:h-[100svh]">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Warm marble texture"
          width={1920}
          height={1080}
          className="h-full w-full object-cover opacity-90"
        />
      </div>
      {showScene && (
        <div className="pointer-events-none absolute inset-0 z-[1] opacity-80 md:opacity-100" aria-hidden="true">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(0_0%_4%_/_0.88)_0%,hsl(0_0%_4%_/_0.54)_42%,hsl(0_0%_4%_/_0.18)_100%)]" />
      <div className="architectural-grid absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="container relative z-10 flex min-h-[760px] flex-col justify-center pb-24 pt-32 md:h-full md:min-h-0 md:py-28">
        <p className="hero-enter text-[10px] uppercase tracking-[0.44em] text-gold">Alpine Landmarks · Est. 2006</p>
        <h1 className="hero-enter hero-title mt-7 max-w-4xl text-balance font-serif text-[clamp(3.7rem,8.4vw,9.3rem)] font-semibold leading-[0.82] tracking-[-0.075em] text-primary-foreground" style={{ animationDelay: "100ms" }}>
          Crafted for<br />
          <span className="text-gold">the horizon.</span>
        </h1>
        <p className="hero-enter mt-8 max-w-sm text-sm leading-relaxed text-primary-foreground/65 md:ml-2 md:text-base" style={{ animationDelay: "200ms" }}>
          Landmarks with a sense of permanence — shaped by clarity, craftsmanship and a deep understanding of home.
        </p>
        <div className="hero-enter mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: "280ms" }}>
          <Button variant="light" size="lg" asChild>
            <a href="#projects">View Projects</a>
          </Button>
          <Button variant="outlineLight" size="lg" asChild>
            <Link to="/projects/alpine-astonia/experience" className="inline-flex items-center gap-2">
              <Box className="h-4 w-4" /> Explore Astonia in 3D
            </Link>
          </Button>
          <Button variant="outlineLight" size="lg" asChild>
            <a
              href={brochure.url}
              download="Alpine Astonia Brochure.pdf"
              className="inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Download Brochure
            </a>
          </Button>
        </div>
        {sceneAvailable && reducedMotion && !showScene && (
          <button
            type="button"
            onClick={() => setShowScene(true)}
            className="hero-enter mt-5 inline-flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-gold transition-colors hover:text-primary-foreground"
            style={{ animationDelay: "320ms" }}
          >
            <Box className="h-3.5 w-3.5" strokeWidth={1.25} /> View 3D study
          </button>
        )}
        <p className="hero-enter mt-8 text-[9px] uppercase tracking-[0.34em] text-primary-foreground/45 md:hidden" style={{ animationDelay: "340ms" }}>
          Interactive architectural study
        </p>
      </div>

      <div className="absolute bottom-10 left-0 z-10 hidden md:block">
        <div className="container">
          <p className="flex items-center gap-4 text-[10px] uppercase tracking-[0.32em] text-primary-foreground/50"><span className="h-px w-12 bg-gold" /> A new perspective on Pune living</p>
        </div>
      </div>

      {/* Circular scroll indicator */}
      <a
        href="#projects"
        aria-label="Scroll to projects"
        className="group absolute bottom-7 right-6 z-10 flex items-center gap-4 text-primary-foreground md:bottom-10 md:right-12"
      >
        <span className="hidden text-[10px] uppercase tracking-[0.4em] text-primary-foreground/70 transition-colors group-hover:text-gold md:inline">
          Discover
        </span>
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/70 transition-luxury group-hover:border-gold md:h-16 md:w-16">
          <ArrowDown className="h-4 w-4 animate-bounce text-gold" strokeWidth={1.5} />
        </span>
      </a>
    </section>
  );
};
