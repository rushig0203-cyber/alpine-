import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Image that degrades to a branded tile instead of a broken icon.
 * Some project renders are served from an external asset host; if that host
 * is unreachable the page should still look finished.
 */
export function AssetImage({
  src,
  alt,
  className,
  wrapperClassName,
  label,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  label?: string;
  loading?: "lazy" | "eager";
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-3 bg-secondary px-6 text-center",
          wrapperClassName,
        )}
      >
        <span className="h-px w-8 bg-gold" />
        <span className="font-serif text-base font-medium tracking-[-0.02em] text-foreground/70">
          {label ?? alt}
        </span>
        <span className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
          Visual on request
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
