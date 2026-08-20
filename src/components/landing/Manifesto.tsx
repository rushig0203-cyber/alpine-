import dusk from "@/assets/astonia-dusk.jpg";

export function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-secondary/60 py-24 text-foreground md:py-36">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 opacity-25 lg:block">
        <img src={dusk} alt="" loading="lazy" className="h-full w-full object-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-l from-secondary/10 via-secondary/75 to-secondary" />
      </div>
      <div className="container relative grid gap-14 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-3">
          <p className="text-[10px] uppercase tracking-[0.42em] text-gold">01 / The Alpine way</p>
          <p className="mt-8 max-w-[15rem] text-sm leading-relaxed text-muted-foreground">
            Since 2006, each address has been conceived as a lasting part of the city.
          </p>
        </div>
        <div className="lg:col-span-7">
          <p className="max-w-3xl font-serif text-[clamp(2.5rem,5vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.06em]">
            Places that feel <span className="text-gold-deep">inevitable</span> — not merely built.
          </p>
        </div>
        <div className="flex items-center gap-4 lg:col-span-2 lg:justify-end">
          <span className="h-px w-10 bg-gold" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">PCMC · Pune</span>
        </div>
      </div>
      <div className="architectural-rule absolute bottom-0 left-0 right-0" />
    </section>
  );
}
