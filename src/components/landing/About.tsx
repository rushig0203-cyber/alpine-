import interior from "@/assets/interior-living.jpg";
import { SITE } from "@/lib/site";

export const About = () => {
  return (
    <section id="about" className="bg-background py-24 md:py-32">
      <div className="container grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
          <div className="absolute -left-5 -top-5 h-[78%] w-[78%] rounded-2xl border border-gold/40 md:-left-7 md:-top-7" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-soft">
            <img
              src={interior}
              alt="Interior of an Alpine Landmarks residence"
              loading="lazy"
              className="h-full w-full object-cover transition-transform [transition-duration:1800ms] hover:scale-105"
            />
          </div>
          <p className="absolute -bottom-5 right-4 rounded-full bg-primary px-5 py-3 text-[10px] uppercase tracking-[0.24em] text-primary-foreground shadow-soft">
            A life well considered
          </p>
        </div>

        <div>
          <p className="eyebrow">
            <span className="hairline-gold" /> About us
          </p>
          <h2 className="mt-6 max-w-2xl text-balance font-serif text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-foreground">
            Built with a <span className="text-gold">longer view.</span>
          </h2>

          <div className="mt-8 space-y-5 text-muted-foreground md:text-lg">
            <p>
              {SITE.name} was founded in {SITE.founded} by{" "}
              <span className="text-foreground">{SITE.founder}</span> with a single conviction —
              that the homes we build outlive us. For close to two decades we have shaped the
              Pimpri-Chinchwad region with residences and commercial landmarks built on quality,
              transparency and on-time delivery.
            </p>
            <p>
              From Pradhikaran and Chinchwad to Ravet, Moshi, Chikhali and Kiwale, every Alpine
              address balances contemporary architecture, green surroundings and practical
              amenities. We don't just build structures — we build communities.
            </p>
          </div>

          <div className="mt-12 grid gap-8 border-t border-border pt-10 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Our vision</p>
              <p className="mt-3 font-serif text-lg font-medium leading-snug tracking-[-0.03em] text-foreground">
                A leading Pune real-estate brand known for innovation, integrity and
                community-focused developments.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Our mission</p>
              <p className="mt-3 font-serif text-lg font-medium leading-snug tracking-[-0.03em] text-foreground">
                High-quality, value-driven real estate that elevates urban living — with
                transparency at the core.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
