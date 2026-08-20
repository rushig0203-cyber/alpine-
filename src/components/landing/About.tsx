import interior from "@/assets/interior-living.jpg";

export const About = () => {
  return (
    <section id="about" className="bg-secondary/40 py-24 md:py-36">
      <div className="container grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="relative mx-auto w-full max-w-lg lg:mx-0">
          <div className="absolute -left-5 -top-5 h-[80%] w-[80%] border border-gold/60 md:-left-8 md:-top-8" />
          <div className="relative aspect-[4/5] overflow-hidden shadow-[24px_28px_0_hsl(0_0%_11%)]">
          <img
            src={interior}
            alt="Alpine Landmarks design philosophy"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1800ms] hover:scale-105"
          />
          </div>
          <p className="absolute -bottom-6 right-0 bg-primary px-5 py-4 text-[10px] uppercase tracking-[0.28em] text-primary-foreground">A life well considered</p>
        </div>
        <div>
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span className="hairline" /> About Us
          </p>
          <h2 className="mt-6 max-w-2xl text-balance font-serif text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground md:text-6xl">
            Built with a <span className="text-gold-deep">longer view.</span>
          </h2>
          <div className="mt-8 space-y-5 text-muted-foreground md:text-lg">
            <p>
              Alpine Landmarks LLP was founded in 2006 by <span className="text-foreground">Mr. Rajesh Patni</span> with
              a single conviction — that the homes we build outlive us. For nearly two decades we have shaped the
              Pimpri-Chinchwad region with residences and commercial landmarks built on quality, transparency and on-time delivery.
            </p>
            <p>
              From Pradhikaran and Chinchwad to Ravet, Moshi, Chikhali and Kiwale — every Alpine address is designed
              to balance modern architecture, green surroundings and practical lifestyle amenities. We don't just build
              structures; we build communities and deliver dreams.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Our Vision</p>
              <p className="mt-3 font-serif text-lg text-foreground">
                A leading Pune real estate brand known for innovation, integrity and community-focused developments.
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Our Mission</p>
              <p className="mt-3 font-serif text-lg text-foreground">
                High-quality, value-driven real estate that elevates urban living — with transparency at the core.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
