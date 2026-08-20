import { ArrowUpRight, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logoLight from "@/assets/alpine-logo-light.png";
import { projects } from "@/data/projects";
import { SITE } from "@/lib/site";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary pt-20 text-primary-foreground/70">
      <div className="container grid gap-14 pb-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <img src={logoLight} alt={SITE.name} width={880} height={475} className="h-11 w-auto" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            {SITE.tagline}. A trusted {SITE.region} developer since {SITE.founded}, led by{" "}
            {SITE.founder}.
          </p>
          <div className="mt-7 flex gap-3">
            {[
              { label: "Instagram", Icon: Instagram, href: SITE.social.instagram },
              { label: "Facebook", Icon: Facebook, href: SITE.social.facebook },
            ].map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-white/50 hover:text-white"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="text-[10px] uppercase tracking-[0.28em] text-primary-foreground">
            Projects
          </div>
          <ul className="mt-5 space-y-2.5 text-sm">
            {projects.slice(0, 5).map((p) => (
              <li key={p.slug}>
                <Link to={`/projects/${p.slug}`} className="transition-colors hover:text-white">
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/projects"
                className="group inline-flex items-center gap-1.5 text-white/90 transition-colors hover:text-white"
              >
                All projects
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.28em] text-primary-foreground">
            Company
          </div>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link to="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/#about" className="transition-colors hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link to="/#why" className="transition-colors hover:text-white">
                Why us
              </Link>
            </li>
            <li>
              <Link
                to="/projects/alpine-astonia/experience"
                className="transition-colors hover:text-white"
              >
                Astonia in 3D
              </Link>
            </li>
            <li>
              <Link to="/#contact" className="transition-colors hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.28em] text-primary-foreground">
            Contact
          </div>
          <p className="mt-5 text-sm leading-relaxed">{SITE.address}</p>
          <p className="mt-3 text-sm">
            <a href={`tel:${SITE.phoneRaw}`} className="hover:text-white">
              {SITE.phone}
            </a>
          </p>
          <p className="text-sm">
            <a href={`mailto:${SITE.email}`} className="break-all hover:text-white">
              {SITE.email}
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 text-xs text-primary-foreground/45 md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {SITE.name}. All rights reserved.
          </span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a
              href={SITE.rera.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              {SITE.rera.authority} · Alpine Astonia {SITE.rera.astonia}
            </a>
            <span>{SITE.region}</span>
          </span>
        </div>
        <div className="container pb-8">
          <p className="max-w-4xl text-[10px] leading-relaxed text-primary-foreground/30">
            Disclaimer: the 3D model on this site is an artistic, real-time representation
            created for visualisation and is not a construction drawing. Images, plans and
            specifications are indicative. Please refer to the {SITE.rera.authority}-registered
            documents and the sale agreement for final details.
          </p>
        </div>
      </div>
    </footer>
  );
};
