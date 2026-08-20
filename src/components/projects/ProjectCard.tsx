import { ArrowUpRight, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { TiltFrame } from "@/components/landing/TiltFrame";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  index,
  className,
  ratio = "aspect-[3/4]",
}: {
  project: Project;
  index?: number;
  className?: string;
  ratio?: string;
}) {
  const has3D = project.slug === "alpine-astonia";

  return (
    <Link
      to={`/projects/${project.slug}`}
      aria-label={`View ${project.name}, ${project.location}`}
      className={cn(
        "group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className,
      )}
    >
      <TiltFrame strength={3} lift={14}>
        <figure className="relative overflow-hidden rounded-2xl bg-primary">
          <div className={cn("overflow-hidden", ratio)}>
            <img
              src={project.cover}
              alt={`${project.name}, ${project.location}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform [transition-duration:1400ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,14,24,0.32)_0%,rgba(6,14,24,0)_35%,rgba(6,14,24,0.78)_100%)]" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-primary">
              {project.status}
            </span>
            {has3D && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white">
                <Box className="h-3 w-3" strokeWidth={1.8} /> 3D
              </span>
            )}
          </div>

          {index !== undefined && (
            <span className="absolute right-4 top-4 font-serif text-sm text-white/55">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}

          <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <p className="text-[10px] uppercase tracking-[0.26em] text-white/60">
              {project.location}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.04em] text-white md:text-[1.7rem]">
              {project.name}
            </h3>
            <p className="mt-1.5 line-clamp-1 text-xs text-white/60">{project.type}</p>
            <span className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/0 transition-colors duration-500 group-hover:text-white">
              View project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </figcaption>
        </figure>
      </TiltFrame>
    </Link>
  );
}
