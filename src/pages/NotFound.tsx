import { ArrowLeft, Home } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SITE } from "@/lib/site";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = `Page not found — ${SITE.name}`;
    console.warn("404: no route for", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-primary px-6 text-center text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.34em] text-white/45">Error 404</p>
        <h1 className="mt-6 font-serif text-[clamp(4rem,14vw,10rem)] font-semibold leading-none tracking-[-0.07em]">
          Off the plan.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-white/60">
          This address doesn't exist in our portfolio. Let's get you back to something we've
          actually built.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-primary transition-colors hover:bg-white/85"
          >
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-white transition-colors hover:border-white/70"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Browse projects
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
