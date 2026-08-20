import { Button } from "@/components/ui/button";

export const CTA = () => {
  return (
    <section className="relative overflow-hidden bg-accent py-24 text-accent-foreground md:py-32">
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(hsl(218_25%_13%_/_0.5)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="container relative flex flex-col items-center gap-9 text-center">
        <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-foreground/65">
          <span className="hairline" /> Private Preview <span className="hairline" />
        </p>
        <h2 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-tight tracking-[-0.05em] md:text-5xl">
          See the address<br /><span className="text-foreground/70">before it becomes yours.</span>
        </h2>
        <p className="max-w-xl text-foreground/70">
          Walk through a show residence with our team. We host private viewings every
          day of the week.
        </p>
        <Button variant="dark" size="lg" asChild>
          <a href="#contact">Enquire Now</a>
        </Button>
      </div>
    </section>
  );
};
