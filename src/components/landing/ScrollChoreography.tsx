import { useEffect } from "react";

/** Adds a single, accessible reveal language to the editorial sections. */
export function ScrollChoreography() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = [...document.querySelectorAll<HTMLElement>("[data-reveal-section]")];
    document.documentElement.classList.add("motion-ready");
    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.setAttribute("data-revealed", ""));
      return () => document.documentElement.classList.remove("motion-ready");
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
