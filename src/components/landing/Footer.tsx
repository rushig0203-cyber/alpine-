import { Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary py-16 text-primary-foreground/70">
      <div className="container grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl tracking-[0.2em] uppercase text-primary-foreground">
            Alpine <span className="text-gold">Landmarks</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            We build your dreams. A trusted PCMC real estate developer since 2006,
            led by Mr. Rajesh Patni.
          </p>
          <div className="mt-6 flex gap-4">
            {[
              { label: "Instagram", Icon: Instagram, href: "https://www.instagram.com/alpineastonia/" },
              { label: "Facebook", Icon: Facebook, href: "https://www.facebook.com/share/1DQubrufqL/" },
            ].map(({ label, Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:text-gold transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const w = window.open(href, "_blank", "noopener,noreferrer");
                  if (!w) window.top!.location.href = href;
                }}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-primary-foreground">Quick Links</div>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li><a href="/" className="hover:text-gold transition-colors">Home</a></li>
            <li><a href="/#projects" className="hover:text-gold transition-colors">Projects</a></li>
            <li><a href="/#about" className="hover:text-gold transition-colors">About</a></li>
            <li><a href="/#contact" className="hover:text-gold transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-primary-foreground">Contact</div>
          <p className="mt-5 text-sm leading-relaxed">
            Jai Ganesh Vision, Office No. 160/161, B-Wing,<br />Akurdi, Pune - 411035, India
          </p>
          <p className="mt-3 text-sm">+91 84213 37090</p>
          <p className="text-sm">alpinelandmarks26@gmail.com</p>
        </div>
      </div>
      <div className="container mt-12 flex flex-col items-start justify-between gap-3 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/50 md:flex-row">
        <span>© {new Date().getFullYear()} Alpine Landmarks LLP. All rights reserved.</span>
        <span>RERA Registered · PCMC, Pune</span>
      </div>
    </footer>
  );
};
