import { AdaptiveDpr } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, SMAA, Vignette } from "@react-three/postprocessing";
import { Suspense, useRef, type MutableRefObject, type ReactNode } from "react";
import { ACESFilmicToneMapping } from "three";
import { AstoniaModel } from "./AstoniaModel";
import { CinematicRig, type CameraKey } from "./CinematicRig";
import { Atmosphere } from "./Atmosphere";
import { TIME_PRESETS, type TimeKey } from "./time";

type BloomHandle = { intensity: number } | null;

/** Damps bloom strength so day → night doesn't pop. */
function Effects({ timeKey, quality }: { timeKey: TimeKey; quality: "high" | "low" }) {
  const bloom = useRef<BloomHandle>(null);
  const target = TIME_PRESETS[timeKey].bloom;

  useFrame((_, delta) => {
    const b = bloom.current;
    if (!b) return;
    b.intensity += (target - b.intensity) * (1 - Math.exp(-2.4 * Math.min(delta, 0.1)));
  });

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom
        ref={bloom as never}
        intensity={target}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.28}
        mipmapBlur
        radius={0.72}
      />
      <Vignette offset={0.24} darkness={0.62} eskil={false} />
      {quality === "high" ? <SMAA /> : <></>}
    </EffectComposer>
  );
}

/** Keeps interior lighting in sync with the active hour. */
function Scene({ timeKey, quality }: { timeKey: TimeKey; quality: "high" | "low" }) {
  return (
    <>
      <Atmosphere timeKey={timeKey} quality={quality} />
      <AstoniaModel windows={TIME_PRESETS[timeKey].windows} />
    </>
  );
}

export type RigConfig = {
  keys: CameraKey[];
  progress: MutableRefObject<number>;
  parallax?: number;
  smoothing?: number;
};

export function AstoniaCanvas({
  timeKey,
  quality,
  rig,
  children,
  frameloop = "always",
  interactive = false,
  className,
  camera = { position: [95, 46, 120] as [number, number, number], fov: 34 },
}: {
  timeKey: TimeKey;
  quality: "high" | "low";
  /** Scroll-driven camera choreography, kept in this chunk so the landing
      page never downloads three.js until the scene is actually needed. */
  rig?: RigConfig;
  children?: ReactNode;
  frameloop?: "always" | "demand" | "never";
  interactive?: boolean;
  className?: string;
  camera?: { position: [number, number, number]; fov: number };
}) {
  return (
    <Canvas
      className={className}
      frameloop={frameloop}
      shadows={quality === "high"}
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      performance={{ min: 0.4 }}
      gl={{
        antialias: quality === "high",
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        stencil: false,
        depth: true,
      }}
      camera={{ position: camera.position, fov: camera.fov, near: 1, far: 900 }}
      style={{ pointerEvents: interactive ? "auto" : "none", touchAction: interactive ? "none" : "auto" }}
    >
      <Suspense fallback={null}>
        <Scene timeKey={timeKey} quality={quality} />
        {rig && <CinematicRig {...rig} />}
        {children}
        <Effects timeKey={timeKey} quality={quality} />
      </Suspense>
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}

export default AstoniaCanvas;
