import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/alpine-logo-mark.png";
import logoLight from "@/assets/alpine-logo-light.png";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { label: "Projects", href: "/projects" },
  { label: "Astonia 3D", href: "/projects/alpine-astonia/experience" },
  { label: "About", href: "/#about" },
  { label: "Why Us", href: "/#why" },
  { label: "Contact", href: "/#contact" },
];

/**
 * A single navbar for the whole site.
 * It switches to a light treatment while it sits over a dark hero — any
 * element marked `data-nav-dark` defines that region.
 */
export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const measure = () => {
      const hero = document.querySelector<HTMLElement>("[data-nav-dark]");
      const y = window.scrollY;
      setScrolled(y > 16);
      setOnDark(hero ? y < hero.offsetTop + hero.offsetHeight - 96 : false);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [pathname, hash]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname, hash]);

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", href);
      } else {
        navigate("/", { state: { scrollTo: id } });
      }
      return;
    }
    navigate(href);
  };

  const light = onDark && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="container">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 md:px-5",
            scrolled
              ? light
                ? "glass-dark border border-white/10"
                : "glass-light border border-border shadow-card-soft"
              : "border border-transparent",
          )}
        >
          <button
            type="button"
            onClick={() => go("/")}
            aria-label={`${SITE.name} — home`}
            className="flex items-center gap-3"
          >
            <img
              src={light ? logoLight : logo}
              alt={SITE.name}
              width={880}
              height={475}
              className="h-8 w-auto md:h-9"
            />
          </button>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <button
                  type="button"
                  onClick={() => go(l.href)}
                  className={cn(
                    "group relative text-[11px] uppercase tracking-[0.24em] transition-colors",
                    light ? "text-white/75 hover:text-white" : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${SITE.phoneRaw}`}
              className={cn(
                "hidden items-center gap-2 rounded-full px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors sm:inline-flex",
                light
                  ? "border border-white/25 text-white hover:border-white/70"
                  : "border border-border text-foreground hover:border-foreground/40",
              )}
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={1.6} />
              {SITE.phone}
            </a>
            <button
              type="button"
              onClick={() => go("/#contact")}
              className={cn(
                "hidden rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors md:inline-flex",
                light ? "bg-white text-primary hover:bg-white/85" : "bg-primary text-primary-foreground hover:bg-gold",
              )}
            >
              Enquire
            </button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden",
                open
                  ? "border-white/30 bg-white text-primary"
                  : light
                  ? "border-white/25 text-white"
                  : "border-border text-foreground",
              )}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-0 -z-10 bg-primary text-primary-foreground transition-all duration-500 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="container flex h-full flex-col justify-center pb-16 pt-28">
          <ul className="space-y-4">
            {links.map((l, i) => (
              <li key={l.href}>
                <button
                  type="button"
                  onClick={() => go(l.href)}
                  className="flex items-baseline gap-4 font-serif text-4xl font-semibold tracking-[-0.05em] text-primary-foreground transition-colors hover:text-white/60"
                >
                  <span className="text-[10px] font-normal tracking-[0.3em] text-white/40">
                    0{i + 1}
                  </span>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-14 space-y-2 border-t border-white/15 pt-8 text-sm text-white/70">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Office</p>
            <p className="leading-relaxed">{SITE.address}</p>
            <p className="pt-2">
              <a href={`tel:${SITE.phoneRaw}`} className="hover:text-white">{SITE.phone}</a>
            </p>
            <p>
              <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
