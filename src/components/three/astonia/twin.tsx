import { Html, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { FLOOR_HEIGHT, PODIUM_HEIGHT, TOWER_D, TOWER_W, TOWER_X } from "./geometry";

export type TwinView = {
  pos: [number, number, number];
  target: [number, number, number];
};

/**
 * Flies the camera to the selected view and then hands control back to the
 * user the moment they touch the scene.
 */
export function TwinRig({
  view,
  controls,
  autoRotate,
}: {
  view: TwinView;
  controls: React.MutableRefObject<OrbitControlsImpl | null>;
  autoRotate: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const flying = useRef(true);
  const goal = useRef(new Vector3());

  useEffect(() => {
    flying.current = true;
  }, [view]);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const stop = () => {
      flying.current = false;
    };
    c.addEventListener("start", stop);
    return () => c.removeEventListener("start", stop);
  }, [controls]);

  useFrame((_, delta) => {
    const c = controls.current;
    if (!c) return;
    c.autoRotate = autoRotate && !flying.current;
    if (!flying.current) return;
    const dt = Math.min(delta, 0.1);
    easing.damp3(camera.position, view.pos, 0.75, dt);
    easing.damp3(c.target, view.target, 0.75, dt);
    if (camera.position.distanceTo(goal.current.set(...view.pos)) < 0.8) flying.current = false;
  });

  return null;
}

/** Glowing band around the selected floor, with a floating label. */
export function FloorHighlight({ floor }: { floor: number | null }) {
  const y = floor === null ? 0 : PODIUM_HEIGHT + (floor - 1) * FLOOR_HEIGHT + FLOOR_HEIGHT / 2;
  if (floor === null) return null;
  return (
    <group>
      {[-TOWER_X, TOWER_X].map((x) => (
        <mesh key={x} position={[x, y, 0]}>
          <boxGeometry args={[TOWER_W + 2.6, FLOOR_HEIGHT - 0.2, TOWER_D + 2.6]} />
          <meshBasicMaterial color="#7fd4ff" transparent opacity={0.16} toneMapped={false} />
        </mesh>
      ))}
      <Html position={[TOWER_X + TOWER_W / 2 + 4, y, TOWER_D / 2]} center distanceFactor={62}>
        <div className="whitespace-nowrap rounded-full border border-white/25 bg-black/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
          Floor {floor} · {(PODIUM_HEIGHT + (floor - 1) * FLOOR_HEIGHT).toFixed(0)} m
        </div>
      </Html>
    </group>
  );
}

export function Hotspot({
  position,
  label,
  active,
  onSelect,
}: {
  position: [number, number, number];
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <Html position={position} center distanceFactor={90} zIndexRange={[20, 0]}>
      <button
        type="button"
        onClick={onSelect}
        className={`group flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] backdrop-blur-md transition-all duration-300 ${
          active
            ? "border-white bg-white text-[#0b1524]"
            : "border-white/30 bg-black/45 text-white/80 hover:border-white hover:text-white"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full transition-colors ${
            active ? "bg-[#0b1524]" : "bg-white/70"
          }`}
        />
        {label}
      </button>
    </Html>
  );
}

export function TwinControls({
  controls,
}: {
  controls: React.MutableRefObject<OrbitControlsImpl | null>;
}) {
  return (
    <OrbitControls
      ref={controls as never}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      enablePan={false}
      autoRotateSpeed={0.35}
      minDistance={38}
      maxDistance={260}
      minPolarAngle={Math.PI / 7}
      maxPolarAngle={Math.PI / 2.12}
    />
  );
}
