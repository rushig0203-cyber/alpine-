import { Hammer, Clock, ShieldCheck, Heart, MapPin } from "lucide-react";

const points = [
  {
    icon: Hammer,
    title: "Quality Construction",
    body: "Engineered with audited materials, ethical practices and uncompromising structural standards across every project.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    body: "A consistent track record of on-time possession across 12+ delivered projects — your timeline is our promise.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Dealings",
    body: "Clear pricing, honest paperwork and full disclosure at every stage. No hidden costs, no surprises — ever.",
  },
  {
    icon: MapPin,
    title: "Strategic PCMC Locations",
    body: "Hand-picked addresses across Pradhikaran, Ravet, Moshi, Chikhali, Kiwale and Chinchwad — Pune's fastest-growing zones.",
  },
  {
    icon: Heart,
    title: "Customer Satisfaction",
    body: "1100+ happy families and dedicated post-possession support. We're built on relationships, not transactions.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="bg-background py-24 md:py-36">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
          <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            <span className="hairline" /> Why Choose Us
          </p>
          <h2 className="mt-6 text-balance font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-foreground md:text-6xl">
            A reputation<br /><span className="text-gold-deep">you can inhabit.</span>
          </h2>
          </div>
          <p className="mt-6 text-muted-foreground">
            Led by Mr. Rajesh Patni — a visionary with deep local insight into PCMC's most promising neighbourhoods.
          </p>
        </div>

        <div className="mt-16 grid border-l border-t border-border md:grid-cols-2 lg:grid-cols-5">
          {points.map((p, index) => (
            <div key={p.title} className="group min-h-[265px] border-b border-r border-border p-6 transition-colors duration-500 hover:bg-primary md:p-7 lg:min-h-[330px]">
              <div className="flex items-start justify-between">
                <p.icon className="h-7 w-7 text-foreground transition-colors duration-500 group-hover:text-gold" strokeWidth={1.25} />
                <span className="text-[10px] tracking-[0.24em] text-muted-foreground transition-colors group-hover:text-primary-foreground/45">0{index + 1}</span>
              </div>
              <h3 className="mt-16 font-serif text-2xl font-normal leading-[1.05] text-foreground transition-colors duration-500 group-hover:text-primary-foreground">{p.title}</h3>
              <div className="mt-5 h-px w-8 bg-gold" />
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-primary-foreground/60">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
