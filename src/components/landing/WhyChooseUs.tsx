import { Clock, Hammer, Heart, MapPin, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site";

const points = [
  {
    icon: Hammer,
    title: "Quality construction",
    body: "Audited materials, ethical practices and uncompromising structural standards on every floor we pour.",
  },
  {
    icon: Clock,
    title: "Timely delivery",
    body: "A consistent record of on-time possession across 12+ delivered projects. Your timeline is our promise.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent dealings",
    body: "MahaRERA registered, clear pricing and honest paperwork at every stage. No hidden costs — ever.",
  },
  {
    icon: MapPin,
    title: "Strategic PCMC locations",
    body: "Hand-picked addresses across Pradhikaran, Ravet, Moshi, Chikhali, Kiwale and Chinchwad.",
  },
  {
    icon: Heart,
    title: "Customer satisfaction",
    body: "1100+ families and dedicated post-possession support. We are built on relationships, not transactions.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section id="why" className="bg-secondary/50 py-24 md:py-32">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow">
              <span className="hairline-gold" /> Why choose us
            </p>
            <h2 className="mt-6 text-balance font-serif text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-foreground">
              A reputation
              <br />
              <span className="text-gold">you can inhabit.</span>
            </h2>
          </div>
          <p className="text-muted-foreground md:pb-3">
            Led by {SITE.founder} — a developer with two decades of local insight into PCMC's
            most promising neighbourhoods.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-2 lg:grid-cols-5">
          {points.map((p, index) => (
            <div
              key={p.title}
              className="group relative flex min-h-[260px] flex-col justify-between bg-background p-7 transition-colors duration-500 hover:bg-primary lg:min-h-[320px]"
            >
              <div className="flex items-start justify-between">
                <p.icon
                  className="h-6 w-6 text-foreground transition-colors duration-500 group-hover:text-white"
                  strokeWidth={1.25}
                />
                <span className="text-[10px] tracking-[0.24em] text-muted-foreground transition-colors duration-500 group-hover:text-white/40">
                  0{index + 1}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold leading-tight tracking-[-0.035em] text-foreground transition-colors duration-500 group-hover:text-white">
                  {p.title}
                </h3>
                <div className="mt-4 h-px w-7 bg-gold transition-all duration-500 group-hover:w-14" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-white/60">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
