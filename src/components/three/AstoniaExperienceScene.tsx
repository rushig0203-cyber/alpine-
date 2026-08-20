import { ContactShadows, Html, OrbitControls, Sparkles } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { RetailPodium, ResidentialTower } from "@/components/three/HeroScene";
import { useEffect } from "react";

export type AstoniaZone = "residences" | "retail" | "amenities" | "plans";

type SceneProps = {
  active: AstoniaZone;
  onSelect: (zone: AstoniaZone) => void;
};

function Hotspot({ label, zone, position, active, onSelect, showLabel }: {
  label: string;
  zone: AstoniaZone;
  position: [number, number, number];
  active: boolean;
  onSelect: (zone: AstoniaZone) => void;
  showLabel: boolean;
}) {
  return (
    <group position={position} onClick={(event) => { event.stopPropagation(); onSelect(zone); }}>
      <mesh>
        <sphereGeometry args={[active ? 0.12 : 0.085, 20, 20]} />
        <meshStandardMaterial color={active ? "#f1c65d" : "#c9a14a"} emissive="#c9a14a" emissiveIntensity={active ? 1.7 : 0.65} />
      </mesh>
      {showLabel && <Html distanceFactor={9} center position={[0, 0.28, 0]}>
        <button
          type="button"
          onClick={() => onSelect(zone)}
          className={`whitespace-nowrap border px-2.5 py-1.5 text-[9px] uppercase tracking-[0.2em] backdrop-blur-md transition-colors ${active ? "border-gold bg-primary text-gold" : "border-white/25 bg-primary/60 text-white/80 hover:border-gold"}`}
        >
          {label}
        </button>
      </Html>}
    </group>
  );
}

function DigitalTwin({ active, onSelect }: SceneProps) {
  const { size, camera } = useThree();
  const compact = size.width < 768;

  useEffect(() => {
    if (compact) {
      camera.position.set(1.1, 1.1, 7.4);
      camera.lookAt(0, -0.05, 0);
    } else {
      camera.position.set(4.6, 2.6, 6);
      camera.lookAt(0, 0.15, 0);
    }
  }, [camera, compact]);

  return (
    <>
      <ambientLight intensity={1.2} />
      <hemisphereLight color="#f8ebc8" groundColor="#121313" intensity={1.1} />
      <directionalLight position={[5, 6, 4]} intensity={4.4} color="#fff3d5" castShadow />
      <pointLight position={[-4, 2, 4]} intensity={10} color="#c9a14a" distance={8} />
      <group position={[0, compact ? -1.3 : -1.22, 0]} rotation={[0, -0.5, 0]} scale={compact ? 0.68 : 1.2}>
        <RetailPodium />
        <ResidentialTower position={[-0.7, -0.42, 0.02]} height={2.95} />
        <ResidentialTower position={[0.7, -0.42, -0.13]} height={3.15} width={1.12} />
        <Hotspot label="Residences" zone="residences" position={[-0.7, 1.1, 0.55]} active={active === "residences"} onSelect={onSelect} showLabel={!compact} />
        <Hotspot label="Retail plaza" zone="retail" position={[0, -0.58, 0.72]} active={active === "retail"} onSelect={onSelect} showLabel={!compact} />
        <Hotspot label="Amenities" zone="amenities" position={[0.88, 1.35, 0.35]} active={active === "amenities"} onSelect={onSelect} showLabel={!compact} />
        <Hotspot label="Floor plans" zone="plans" position={[-1.25, 0.08, 0.6]} active={active === "plans"} onSelect={onSelect} showLabel={!compact} />
      </group>
      <ContactShadows position={[0, compact ? -1.92 : -2.27, 0]} opacity={0.7} scale={compact ? 7 : 11} blur={2.5} far={4.5} color="#000000" />
      <Sparkles count={compact ? 25 : 65} scale={[8, 5, 4]} size={1.25} speed={0.16} opacity={0.38} color="#f8e4b5" />
      <OrbitControls enablePan={false} minDistance={compact ? 5.8 : 4.7} maxDistance={compact ? 9 : 8.2} minPolarAngle={Math.PI / 3.4} maxPolarAngle={Math.PI / 2.02} autoRotate={!compact} autoRotateSpeed={0.2} />
    </>
  );
}

export default function AstoniaExperienceScene(props: SceneProps) {
  return (
    <Canvas dpr={[1, 1.5]} shadows camera={{ position: [4.6, 2.6, 6], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <DigitalTwin {...props} />
    </Canvas>
  );
}
