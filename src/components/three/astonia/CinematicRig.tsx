import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useMemo, type MutableRefObject } from "react";
import { Vector3 } from "three";

export type CameraKey = {
  pos: [number, number, number];
  target: [number, number, number];
  fov?: number;
};

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Interpolates the camera along a list of keyframes using a scroll progress
 * ref (0 → 1), then damps toward it. Damping is what makes a scroll-driven
 * camera feel like a crane shot instead of a scrubbing timeline.
 */
export function CinematicRig({
  keys,
  progress,
  parallax = 1,
  smoothing = 0.55,
}: {
  keys: CameraKey[];
  progress: MutableRefObject<number>;
  parallax?: number;
  smoothing?: number;
}) {
  const camera = useThree((s) => s.camera);
  const pointer = useThree((s) => s.pointer);

  const scratch = useMemo(
    () => ({ pos: new Vector3(), target: new Vector3(), current: new Vector3() }),
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const p = Math.max(0, Math.min(1, progress.current));
    const span = keys.length - 1;
    const scaled = p * span;
    const index = Math.min(span - 1, Math.floor(scaled));
    const t = smooth(scaled - index);
    const a = keys[index];
    const b = keys[index + 1] ?? a;

    scratch.pos.set(
      a.pos[0] + (b.pos[0] - a.pos[0]) * t,
      a.pos[1] + (b.pos[1] - a.pos[1]) * t,
      a.pos[2] + (b.pos[2] - a.pos[2]) * t,
    );
    scratch.target.set(
      a.target[0] + (b.target[0] - a.target[0]) * t,
      a.target[1] + (b.target[1] - a.target[1]) * t,
      a.target[2] + (b.target[2] - a.target[2]) * t,
    );

    // Gentle pointer parallax — never enough to fight the scroll.
    scratch.pos.x += pointer.x * 4.5 * parallax;
    scratch.pos.y += pointer.y * 2.4 * parallax;

    easing.damp3(camera.position, scratch.pos, smoothing, dt);
    easing.damp3(scratch.current, scratch.target, smoothing, dt);
    camera.lookAt(scratch.current);

    const fov = a.fov ?? 34;
    const nextFov = fov + ((b.fov ?? 34) - fov) * t;
    const cam = camera as typeof camera & { fov: number };
    if (Math.abs(cam.fov - nextFov) > 0.01) {
      cam.fov += (nextFov - cam.fov) * (1 - Math.exp(-3 * dt));
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
