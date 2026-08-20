import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Manifesto } from "@/components/landing/Manifesto";
import { ProjectAtlas } from "@/components/landing/ProjectAtlas";
import { ScrollChoreography } from "@/components/landing/ScrollChoreography";
import { Projects } from "@/components/landing/Projects";
import { About } from "@/components/landing/About";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { FeaturedProject } from "@/components/landing/FeaturedProject";
import { Testimonials } from "@/components/landing/Testimonials";

import { CTA } from "@/components/landing/CTA";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <ScrollChoreography />
      <Navbar />
      <Hero />
      <div data-reveal-section><Stats /></div>
      <div data-reveal-section><Manifesto /></div>
      <div data-reveal-section><Projects /></div>
      <div data-reveal-section><ProjectAtlas /></div>
      <div data-reveal-section><About /></div>
      <div id="why" data-reveal-section>
        <WhyChooseUs />
      </div>
      <div data-reveal-section><FeaturedProject /></div>
      <div data-reveal-section><Testimonials /></div>
      <div data-reveal-section><CTA /></div>
      <div data-reveal-section><Contact /></div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default Index;
