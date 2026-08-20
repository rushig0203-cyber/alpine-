import { Environment, Lightformer, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BackSide, Color, DirectionalLight, Fog, HemisphereLight, ShaderMaterial } from "three";
import { TIME_PRESETS, type TimeKey } from "./time";

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  varying vec3 vDir;
  void main() {
    float h = normalize(vDir).y;
    float t = smoothstep(-0.10, 0.46, h);
    vec3 c = mix(uHorizon, uTop, t);
    // A faint band just above the horizon keeps the gradient from banding.
    c += 0.03 * exp(-pow((h - 0.02) * 9.0, 2.0));
    gl_FragColor = vec4(c, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/**
 * Sky dome, sun rig and fog. Every property is damped toward the active
 * time-of-day preset so switching from Day to Dusk plays as a dissolve.
 */
export function Atmosphere({ timeKey, quality }: { timeKey: TimeKey; quality: "high" | "low" }) {
  const preset = TIME_PRESETS[timeKey];
  const sun = useRef<DirectionalLight>(null);
  const hemi = useRef<HemisphereLight>(null);
  const scene = useThree((s) => s.scene);

  const skyMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTop: { value: new Color(preset.skyTop) },
          uHorizon: { value: new Color(preset.skyHorizon) },
        },
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
        side: BackSide,
        depthWrite: false,
        fog: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const targets = useMemo(
    () => ({
      sunColor: new Color(),
      ambient: new Color(),
      bounce: new Color(),
      top: new Color(),
      horizon: new Color(),
      fog: new Color(),
    }),
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const k = 1 - Math.exp(-2.6 * dt);

    targets.sunColor.set(preset.sunColor);
    targets.ambient.set(preset.ambient);
    targets.bounce.set(preset.bounce);
    targets.top.set(preset.skyTop);
    targets.horizon.set(preset.skyHorizon);
    targets.fog.set(preset.fog);

    if (sun.current) {
      sun.current.color.lerp(targets.sunColor, k);
      sun.current.intensity += (preset.sunIntensity - sun.current.intensity) * k;
      sun.current.position.x += (preset.sun[0] - sun.current.position.x) * k;
      sun.current.position.y += (preset.sun[1] - sun.current.position.y) * k;
      sun.current.position.z += (preset.sun[2] - sun.current.position.z) * k;
    }
    if (hemi.current) {
      hemi.current.color.lerp(targets.ambient, k);
      hemi.current.groundColor.lerp(targets.bounce, k);
      hemi.current.intensity += (preset.ambientIntensity - hemi.current.intensity) * k;
    }

    (skyMaterial.uniforms.uTop.value as Color).lerp(targets.top, k);
    (skyMaterial.uniforms.uHorizon.value as Color).lerp(targets.horizon, k);

    if (!scene.fog) scene.fog = new Fog(preset.fog, preset.fogNear, preset.fogFar);
    const fog = scene.fog as Fog;
    fog.color.lerp(targets.fog, k);
    fog.near += (preset.fogNear - fog.near) * k;
    fog.far += (preset.fogFar - fog.far) * k;
  });

  const night = timeKey === "night";

  return (
    <>
      <mesh scale={400} material={skyMaterial} frustumCulled={false}>
        <sphereGeometry args={[1, 32, 16]} />
      </mesh>

      <hemisphereLight
        ref={hemi}
        color={preset.ambient}
        groundColor={preset.bounce}
        intensity={preset.ambientIntensity}
      />
      <directionalLight
        ref={sun}
        position={preset.sun}
        color={preset.sunColor}
        intensity={preset.sunIntensity}
        castShadow={quality === "high"}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.6}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
        shadow-camera-near={1}
        shadow-camera-far={320}
      />
      {/* Cool fill from the opposite side keeps the glass from going flat. */}
      <directionalLight position={[-40, 30, -60]} intensity={night ? 0.5 : 0.7} color="#9fc4ff" />

      {night && <Stars radius={260} depth={60} count={1400} factor={5} saturation={0} fade speed={0.4} />}

      {/* Procedural reflection probe — no HDR download, so it always works offline. */}
      <Environment key={timeKey} resolution={quality === "high" ? 256 : 128} frames={1}>
        <Lightformer
          intensity={preset.envIntensity * 2.2}
          color={preset.skyTop}
          rotation-x={Math.PI / 2}
          position={[0, 60, 0]}
          scale={[120, 120, 1]}
        />
        <Lightformer
          intensity={preset.envIntensity * 1.6}
          color={preset.skyHorizon}
          rotation-y={Math.PI / 2}
          position={[-90, 14, 0]}
          scale={[90, 40, 1]}
        />
        <Lightformer
          intensity={preset.envIntensity * 1.2}
          color={preset.sunColor}
          rotation-y={-Math.PI / 2}
          position={[90, 20, 0]}
          scale={[90, 40, 1]}
        />
        <Lightformer
          intensity={preset.envIntensity * 0.6}
          color={preset.bounce}
          rotation-x={-Math.PI / 2}
          position={[0, -30, 0]}
          scale={[120, 120, 1]}
        />
      </Environment>
    </>
  );
}
