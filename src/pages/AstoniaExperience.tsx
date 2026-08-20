import { ArrowLeft, ArrowUpRight, Building2, ChevronLeft, ChevronRight, Layers3, MapPin, Sparkles, Store } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { findProject } from "@/data/projects";
import type { AstoniaZone } from "@/components/three/AstoniaExperienceScene";

const ExperienceScene = lazy(() => import("@/components/three/AstoniaExperienceScene"));
const astonia = findProject("alpine-astonia")!;

const zones: Record<AstoniaZone, { eyebrow: string; title: string; detail: string; icon: typeof Building2 }> = {
  residences: { eyebrow: "197 apartments · two towers", title: "A view made for living.", detail: "Two residential towers rise above the podium, with 2 and 3 BHK homes, private balconies and considered everyday proportions.", icon: Building2 },
  retail: { eyebrow: "39 ground-level shops", title: "The life below the towers.", detail: "A curated retail podium brings daily convenience right to the address, creating a more connected street-level experience.", icon: Store },
  amenities: { eyebrow: "Lifestyle across the podium", title: "Spaces that extend the day.", detail: "From the pool and gym to rooftop yoga, landscaped gardens and play spaces, every zone is designed for a different pace of life.", icon: Sparkles },
  plans: { eyebrow: "2 BHK · 3 BHK", title: "Find your own rhythm.", detail: "Explore the available home configurations, shaped around light, flow and room to grow.", icon: Layers3 },
};

export default function AstoniaExperience() {
  const [active, setActive] = useState<AstoniaZone>("residences");
  const [sceneReady, setSceneReady] = useState(false);
  const zone = zones[active];
  const ZoneIcon = zone.icon;

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = window.setTimeout(() => setSceneReady(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#0a0b0b] text-primary-foreground">
      <section className="relative min-h-[100svh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_44%,hsl(211_34%_45%_/_0.18),transparent_32%),linear-gradient(125deg,#10233f_0%,#07101d_62%,#0d1b2d_100%)]" />
        {sceneReady && (
          <div className="absolute inset-0">
            <Suspense fallback={null}><ExperienceScene active={active} onSelect={setActive} /></Suspense>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,hsl(0_0%_5%_/_0.96)_0%,hsl(0_0%_5%_/_0.68)_33%,transparent_68%),linear-gradient(0deg,hsl(0_0%_5%_/_0.8)_0%,transparent_30%)]" />

        <header className="relative z-10 flex items-center justify-between px-5 py-5 md:px-9 md:py-7">
          <Link to="/" className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-primary-foreground/70 transition-colors hover:text-gold"><ArrowLeft className="h-3.5 w-3.5" /> Alpine Landmarks</Link>
          <Link to="/projects/alpine-astonia" className="text-[10px] uppercase tracking-[0.26em] text-gold transition-colors hover:text-primary-foreground">Project details</Link>
        </header>

        <div className="relative z-10 flex min-h-[calc(100svh-88px)] flex-col justify-end px-5 pb-8 pt-20 md:px-9 md:pb-10 lg:pb-14">
          <div className="max-w-md">
            <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.36em] text-gold"><span className="h-px w-9 bg-gold" /> Digital twin · Astonia</p>
            <h1 className="mt-5 font-serif text-[clamp(3.1rem,6vw,6.2rem)] font-semibold leading-[0.88] tracking-[-0.06em]">Astonia,<br /><span className="text-gold">in your hands.</span></h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/65">A spatial study of Alpine Astonia’s two towers and retail podium. Drag to orbit, scroll to move closer, or select a point of interest.</p>
          </div>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(zones) as AstoniaZone[]).map((item) => (
              <button key={item} type="button" onClick={() => setActive(item)} className={`border px-3 py-3 text-left text-[9px] uppercase tracking-[0.16em] transition-colors ${active === item ? "border-gold bg-gold text-gold-foreground" : "border-primary-foreground/20 bg-primary/25 text-primary-foreground/75 hover:border-gold"}`}>{zones[item].eyebrow.split(" · ")[0]}</button>
            ))}
          </div>
        </div>

        <aside className="relative z-10 border-t border-primary-foreground/15 bg-primary/80 px-5 py-6 backdrop-blur-xl md:absolute md:bottom-0 md:right-0 md:w-[25rem] md:border-l md:border-t-0 md:px-8 md:py-8">
          <div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold/60 text-gold"><ZoneIcon className="h-4 w-4" strokeWidth={1.25} /></span><div><p className="text-[10px] uppercase tracking-[0.28em] text-gold">{zone.eyebrow}</p><h2 className="mt-2 font-serif text-2xl font-light">{zone.title}</h2></div></div>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/65">{zone.detail}</p>
          {active === "plans" && astonia.floorPlans && <div className="mt-5 flex gap-3">{astonia.floorPlans.map((plan) => <img key={plan.label} src={plan.image} alt={plan.label} className="h-20 w-24 border border-primary-foreground/15 bg-white object-contain p-1" />)}</div>}
          <div className="mt-6 flex items-center justify-between border-t border-primary-foreground/15 pt-5"><span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-primary-foreground/50"><MapPin className="h-3 w-3" /> Kiwale, PCMC</span><Link to="/projects/alpine-astonia#contact" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold hover:text-primary-foreground">Enquire <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
        </aside>

        <div className="pointer-events-none absolute bottom-5 right-5 z-10 hidden items-center gap-2 text-[9px] uppercase tracking-[0.26em] text-primary-foreground/40 md:flex"><ChevronLeft className="h-3 w-3" /> Drag to explore <ChevronRight className="h-3 w-3" /></div>
      </section>

      <section className="border-t border-primary-foreground/10 bg-[#0a0b0b] px-5 py-16 md:px-9 md:py-24">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-9 md:flex-row md:items-end"><div><p className="text-[10px] uppercase tracking-[0.34em] text-gold">The real address</p><h2 className="mt-4 font-serif text-4xl font-light leading-tight md:text-5xl">From spatial study<br />to the life around it.</h2></div><Button variant="outlineLight" asChild><Link to="/projects/alpine-astonia">See plans, amenities &amp; details <ArrowUpRight /></Link></Button></div>
      </section>
    </main>
  );
}
