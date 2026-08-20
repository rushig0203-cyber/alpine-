import { Edges, Float, PerspectiveCamera, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

const gold = "#c9a14a";

type TowerProps = {
  position: [number, number, number];
  height: number;
  width?: number;
};

/** A lightweight, data-inspired study of Astonia's two residential towers. */
export function ResidentialTower({ position, height, width = 1.18 }: TowerProps) {
  const levels = Array.from({ length: 14 }, (_, index) => -height / 2 + 0.22 + index * ((height - 0.32) / 13));
  const mullions = [-0.34, 0, 0.34];

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, 0.68]} />
        <meshPhysicalMaterial color="#d5d6d2" metalness={0.34} roughness={0.17} transparent opacity={0.82} />
        <Edges color="#eee2c8" threshold={18} />
      </mesh>
      <mesh position={[0, height + 0.05, 0]}>
        <boxGeometry args={[width + 0.12, 0.1, 0.78]} />
        <meshStandardMaterial color={gold} metalness={0.72} roughness={0.18} />
      </mesh>
      {levels.map((y, level) => (
        <group key={y} position={[0, y, 0.352]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width - 0.12, 0.125, 0.025]} />
            <meshStandardMaterial color="#263338" metalness={0.7} roughness={0.12} emissive="#0a1012" emissiveIntensity={0.24} />
          </mesh>
          <mesh position={[0, -0.105, 0]}>
            <boxGeometry args={[width + 0.1, 0.022, 0.09]} />
            <meshStandardMaterial color={level % 4 === 0 ? gold : "#ece3d2"} metalness={0.68} roughness={0.16} />
          </mesh>
          {mullions.map((x) => (
            <mesh key={x} position={[x, 0, 0.024]}>
              <boxGeometry args={[0.028, 0.19, 0.025]} />
              <meshStandardMaterial color="#e8dcc0" metalness={0.65} roughness={0.14} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[width / 2 + 0.05, height / 2, 0]}>
        <boxGeometry args={[0.11, height, 0.74]} />
        <meshStandardMaterial color="#b9aa87" metalness={0.38} roughness={0.25} />
      </mesh>
    </group>
  );
}

export function RetailPodium() {
  return (
    <group>
      <mesh position={[0, -0.72, 0]}>
        <boxGeometry args={[3.48, 0.62, 1.22]} />
        <meshStandardMaterial color="#202223" metalness={0.36} roughness={0.42} />
        <Edges color="#806735" threshold={16} />
      </mesh>
      {[-1.28, -0.64, 0, 0.64, 1.28].map((x, index) => (
        <group key={x} position={[x, -0.69, 0.618]}>
          <mesh>
            <boxGeometry args={[0.46, 0.36, 0.025]} />
            <meshStandardMaterial color={index === 2 ? "#b4872e" : "#293438"} metalness={0.62} roughness={0.13} emissive={index === 2 ? "#6b4b14" : "#071014"} emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.56, 0.025, 0.055]} />
            <meshStandardMaterial color={gold} metalness={0.65} roughness={0.17} />
          </mesh>
        </group>
      ))}
      {[-1.52, 1.52].map((x) => (
        <group key={x} position={[x, -0.38, 0.45]}>
          <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.035, 0.05, 0.28, 8]} /><meshStandardMaterial color="#6d5632" /></mesh>
          <mesh position={[0, 0.08, 0]}><sphereGeometry args={[0.16, 12, 12]} /><meshStandardMaterial color="#394d37" roughness={0.8} /></mesh>
        </group>
      ))}
    </group>
  );
}

function ArchitecturalForm() {
  const building = useRef<Group>(null);
  const { pointer, camera, size } = useThree();

  useFrame((state) => {
    if (!building.current) return;
    const scrollOffset = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    const compact = size.width < 768;
    const targetX = compact ? 0.38 : 1.55;
    const targetY = compact ? -0.62 : -0.82;
    const scale = compact ? 0.57 : 1;
    building.current.rotation.y += (pointer.x * (compact ? 0.1 : 0.18) + scrollOffset * 0.18 - building.current.rotation.y) * 0.025;
    building.current.rotation.x += (-pointer.y * 0.05 - building.current.rotation.x) * 0.025;
    building.current.position.x += (targetX - building.current.position.x) * 0.035;
    building.current.position.y = targetY + Math.sin(state.clock.elapsedTime * 0.45) * 0.035 - scrollOffset * (compact ? 0.08 : 0.18);
    building.current.scale.setScalar(scale);
    camera.position.x += ((compact ? 0 : scrollOffset * 0.34) - camera.position.x) * 0.018;
    camera.position.y += ((compact ? 0.35 : 0.35 + scrollOffset * 0.48) - camera.position.y) * 0.018;
    camera.lookAt(compact ? 0.2 : 0.7, 0.1 - scrollOffset * 0.2, 0);
  });

  return (
    <Float speed={0.55} rotationIntensity={0.08} floatIntensity={0.25}>
      <group ref={building} position={[1.55, -0.82, 0]} rotation={[0, -0.38, 0]}>
        <RetailPodium />
        <ResidentialTower position={[-0.7, -0.42, 0.02]} height={2.95} />
        <ResidentialTower position={[0.7, -0.42, -0.13]} height={3.15} width={1.12} />
        <mesh position={[0, -1.3, 0]}>
          <boxGeometry args={[3.35, 0.09, 2.25]} />
          <meshStandardMaterial color="#171717" metalness={0.25} roughness={0.68} />
          <Edges color="#705d35" threshold={12} />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.35, 6.2], fov: 39 }}
      className="h-full w-full"
    >
      <PerspectiveCamera makeDefault position={[0, 0.35, 6.2]} fov={39} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[4, 5, 4]} intensity={4.6} color="#fff6df" />
      <pointLight position={[-3, 1, 2]} intensity={9} color={gold} distance={8} />
      <pointLight position={[3, -1, 3]} intensity={3} color="#eef0f2" distance={5} />
      <ArchitecturalForm />
      <Sparkles count={80} scale={[8, 5, 4]} size={1.3} speed={0.18} opacity={0.42} color="#f8e4b5" />
    </Canvas>
  );
}
