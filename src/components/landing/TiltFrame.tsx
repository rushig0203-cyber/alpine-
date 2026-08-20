import { type CSSProperties, type ReactNode, useState } from "react";

type TiltFrameProps = {
  children: ReactNode;
  className?: string;
};

/** A pointer-only enhancement: content remains fully usable without the transform. */
export function TiltFrame({ children, className = "" }: TiltFrameProps) {
  const [tilt, setTilt] = useState<CSSProperties>({});

  const reset = () => setTilt({});

  return (
    <div
      className={`tilt-frame ${className}`}
      style={tilt}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        setTilt({ transform: `perspective(1200px) rotateX(${-y * 3.5}deg) rotateY(${x * 3.5}deg) translateZ(0)` });
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </div>
  );
}
