import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { About } from "@/components/landing/About";
import { CinematicStage } from "@/components/landing/CinematicStage";
import { Contact } from "@/components/landing/Contact";
import { FeaturedProject } from "@/components/landing/FeaturedProject";
import { Footer } from "@/components/landing/Footer";
import { Manifesto } from "@/components/landing/Manifesto";
import { Navbar } from "@/components/landing/Navbar";
import { Projects } from "@/components/landing/Projects";
import { ScrollChoreography } from "@/components/landing/ScrollChoreography";
import { Stats } from "@/components/landing/Stats";
import { Testimonials } from "@/components/landing/Testimonials";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const Index = () => {
  const location = useLocation();

  /* Support "/#contact" style links arriving from another route. */
  useEffect(() => {
    const target =
      (location.state as { scrollTo?: string } | null)?.scrollTo ??
      (location.hash ? location.hash.slice(1) : null);
    if (!target) return;
    const scroll = () =>
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    const timer = window.setTimeout(scroll, 120);
    return () => window.clearTimeout(timer);
  }, [location]);

  return (
    <main className="min-h-screen bg-background">
      <ScrollChoreography />
      <Navbar />

      <div data-nav-dark>
        <CinematicStage />
      </div>

      {/* The editorial half of the site rides over the 3D stage. */}
      <div className="relative z-10 rounded-t-[2rem] bg-background shadow-[0_-30px_60px_-30px_rgba(6,12,20,0.65)]">
        <Stats />
        <div data-reveal-section>
          <Manifesto />
        </div>
        <div data-reveal-section>
          <Projects />
        </div>
        <div data-reveal-section>
          <FeaturedProject />
        </div>
        <div data-reveal-section>
          <About />
        </div>
        <div data-reveal-section>
          <WhyChooseUs />
        </div>
        <div data-reveal-section>
          <Testimonials />
        </div>
        <div data-reveal-section>
          <Contact />
        </div>
        <Footer />
      </div>

      <WhatsAppButton />
    </main>
  );
};

export default Index;
