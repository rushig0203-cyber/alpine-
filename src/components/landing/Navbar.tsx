import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Why Us", href: "/#why" },
  { label: "Contact", href: "/#contact" },
];

export const Navbar = ({ variant = "overlay" }: { variant?: "overlay" | "solid" }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = variant === "solid" || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-luxury",
        solid
          ? "mx-3 mt-3 rounded-2xl border border-border bg-background/90 py-3 shadow-[0_10px_30px_-20px_hsl(218_25%_13%_/_0.35)] backdrop-blur-md"
          : "bg-transparent py-6"
      )}
    >
      <nav className="container flex items-center justify-between">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          aria-label="Alpine Landmarks — home"
          className="flex items-center"
        >
          <span
            className={cn(
              "font-serif text-lg tracking-[0.2em] uppercase transition-colors md:text-xl",
              solid ? "text-foreground" : "text-primary-foreground"
            )}
          >
            Alpine <span className="text-gold">Landmarks</span>
          </span>
        </Link>

        {/* Desktop nav with underline hover */}
        <ul className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={cn(
                  "group relative text-[11px] uppercase tracking-[0.28em] transition-colors hover:text-gold",
                  solid ? "text-foreground/80" : "text-primary-foreground/85"
                )}
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href={pathname === "/" ? "#contact" : "/#contact"}
            className={cn(
              "inline-flex items-center gap-2 border px-5 py-2.5 text-[11px] uppercase tracking-[0.28em] transition-luxury hover:border-gold hover:text-gold",
              solid ? "border-foreground/30 text-foreground" : "border-primary-foreground/40 text-primary-foreground"
            )}
          >
            Enquire
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className={cn(
            "flex h-10 w-10 items-center justify-center border md:hidden",
            open
              ? "border-gold bg-gold text-gold-foreground"
              : solid
              ? "border-foreground/30 text-foreground"
              : "border-primary-foreground/40 text-primary-foreground"
          )}
        >
          {open ? <X className="h-4 w-4" strokeWidth={1.5} /> : <Menu className="h-4 w-4" strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className={cn(
          "fixed inset-0 top-0 -z-10 bg-primary text-primary-foreground transition-luxury md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="container flex h-full flex-col justify-center pt-24 pb-16">
          <ul className="space-y-5">
            {links.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block font-serif text-4xl font-light text-primary-foreground transition-colors hover:text-gold"
                >
                  <span className="mr-3 text-[10px] tracking-[0.3em] text-gold/80">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-12 border-t border-primary-foreground/10 pt-8 text-sm text-primary-foreground/70">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50">Office</p>
            <p className="mt-3 leading-relaxed">
              Jai Ganesh Vision, Office No. 160/161,<br />B-Wing, Akurdi, Pune - 411035
            </p>
            <p className="mt-3">+91 98220 00000</p>
          </div>
        </div>
      </div>
    </header>
  );
};
