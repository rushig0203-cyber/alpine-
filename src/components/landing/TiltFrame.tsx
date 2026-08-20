import { useEffect, useRef, type ReactNode } from "react";

type TiltFrameProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  strength?: number;
  /** Lift the element toward the viewer on hover. */
  lift?: number;
};

/**
 * Pointer-only 3D tilt. Written straight to the DOM inside a rAF loop so it
 * never triggers a React render, and it is a no-op for touch and
 * reduced-motion users.
 */
export function TiltFrame({ children, className = "", strength = 4, lift = 0 }: TiltFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0, z: 0 });
  const current = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let running = true;

    const loop = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * 0.12;
      c.y += (t.y - c.y) * 0.12;
      c.z += (t.z - c.z) * 0.12;
      if (Math.abs(c.x) + Math.abs(c.y) + Math.abs(c.z) < 0.001) {
        el.style.transform = "";
      } else {
        el.style.transform = `perspective(1400px) rotateX(${c.y.toFixed(3)}deg) rotateY(${c.x.toFixed(
          3,
        )}deg) translate3d(0,0,${c.z.toFixed(2)}px)`;
      }
      if (running) raf = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = el.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      target.current = { x: x * strength * 2, y: -y * strength * 2, z: lift };
    };
    const onLeave = () => {
      target.current = { x: 0, y: 0, z: 0 };
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointercancel", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointercancel", onLeave);
    };
  }, [strength, lift]);

  return (
    <div ref={ref} className={`tilt-frame ${className}`}>
      {children}
    </div>
  );
}
