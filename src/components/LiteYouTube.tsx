import { Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Click-to-load YouTube facade.
 * Loading five real iframes on a landing page costs megabytes and dozens of
 * requests before anyone presses play — this only pulls a thumbnail.
 */
export function LiteYouTube({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden bg-primary", className)}>
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-primary/25 transition-colors group-hover:bg-primary/10" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-soft transition-transform duration-500 group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={0} />
          </span>
        </button>
      )}
    </div>
  );
}
