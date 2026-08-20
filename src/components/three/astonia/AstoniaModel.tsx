import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, MeshStandardMaterial } from "three";
import { buildAstonia, type Box, PODIUM_D, PODIUM_HEIGHT, PODIUM_W } from "./geometry";

type SharedProps = {
  /** 0 → 1.25, how strongly interior + retail lighting glows. */
  windows: number;
};

function Boxes({
  items,
  children,
  castShadow = true,
  receiveShadow = true,
}: {
  items: Box[];
  children: React.ReactNode;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <Instances limit={items.length} range={items.length} castShadow={castShadow} receiveShadow={receiveShadow}>
      <boxGeometry />
      {children}
      {items.map((b, i) => (
        <Instance key={i} position={b.p} scale={b.s} rotation={b.r} />
      ))}
    </Instances>
  );
}

/** Warm interior glow. Kept unlit so bloom can pick it up cleanly. */
function LitPanels({ items, windows }: { items: Box[]; windows: number }) {
  const ref = useRef<MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    const k = 1 - Math.exp(-4 * Math.min(dt, 0.1));
    m.emissiveIntensity += (windows * 2.6 - m.emissiveIntensity) * k;
    m.opacity += (Math.min(1, 0.25 + windows) - m.opacity) * k;
  });
  return (
    <Boxes items={items} castShadow={false} receiveShadow={false}>
      <meshStandardMaterial
        ref={ref}
        color="#0d151d"
        emissive="#ffd9a4"
        emissiveIntensity={0}
        toneMapped={false}
        transparent
        opacity={0.3}
      />
    </Boxes>
  );
}

export function AstoniaModel({ windows }: SharedProps) {
  const g = useMemo(() => buildAstonia(), []);
  const group = useRef<Group>(null);
  const shopRef = useRef<MeshStandardMaterial>(null);
  const signRef = useRef<MeshStandardMaterial>(null);
  const lampRef = useRef<MeshStandardMaterial>(null);

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-4 * Math.min(dt, 0.1));
    if (shopRef.current) {
      shopRef.current.emissiveIntensity +=
        (0.25 + windows * 1.9 - shopRef.current.emissiveIntensity) * k;
    }
    if (signRef.current) {
      signRef.current.emissiveIntensity +=
        (0.4 + windows * 2.4 - signRef.current.emissiveIntensity) * k;
    }
    if (lampRef.current) {
      lampRef.current.emissiveIntensity += (windows * 3.4 - lampRef.current.emissiveIntensity) * k;
    }
  });

  return (
    <group ref={group} name="astonia">
      {/* ---------------------------------------------------------- ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[520, 520]} />
        <meshStandardMaterial color="#8f9298" roughness={0.96} metalness={0} />
      </mesh>
      {/* Approach road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, PODIUM_D / 2 + 24]} receiveShadow>
        <planeGeometry args={[300, 15]} />
        <meshStandardMaterial color="#3b3f45" roughness={0.85} />
      </mesh>
      {/* Landscaped forecourt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, PODIUM_D / 2 + 10]} receiveShadow>
        <planeGeometry args={[PODIUM_W + 22, 12]} />
        <meshStandardMaterial color="#5b7a52" roughness={0.95} />
      </mesh>
      {/* Plaza apron */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
        <planeGeometry args={[PODIUM_W + 26, PODIUM_D + 26]} />
        <meshStandardMaterial color="#b7b3ac" roughness={0.9} />
      </mesh>

      {/* ---------------------------------------------------------- podium */}
      <group>
        <Boxes items={g.podium}>
          <meshStandardMaterial color="#dedad2" roughness={0.62} metalness={0.05} />
        </Boxes>
        <Boxes items={g.shopGlass} castShadow={false}>
          <meshStandardMaterial
            ref={shopRef}
            color="#16232e"
            emissive="#ffcf94"
            emissiveIntensity={0.3}
            roughness={0.12}
            metalness={0.4}
            transparent
            opacity={0.94}
          />
        </Boxes>
        <Boxes items={g.shopSigns} castShadow={false}>
          <meshStandardMaterial
            ref={signRef}
            color="#0b1219"
            emissive="#9fd0ff"
            emissiveIntensity={0.5}
            toneMapped={false}
          />
        </Boxes>
      </group>

      {/* ------------------------------------------------------- amenities */}
      <Boxes items={g.deck}>
        <meshStandardMaterial color="#e2e4e2" roughness={0.7} metalness={0.03} />
      </Boxes>
      <Boxes items={g.lawn} castShadow={false}>
        <meshStandardMaterial color="#4f7a4a" roughness={0.95} />
      </Boxes>
      <Boxes items={g.court} castShadow={false}>
        <meshStandardMaterial color="#2f6a6d" roughness={0.85} />
      </Boxes>
      <Boxes items={g.pergola}>
        <meshStandardMaterial color="#9c7a52" roughness={0.7} metalness={0.15} />
      </Boxes>
      {/* Pool water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, PODIUM_HEIGHT + 0.74, 7]} receiveShadow>
        <planeGeometry args={[14.4, 8.4]} />
        <meshPhysicalMaterial
          color="#1d7fa2"
          roughness={0.03}
          metalness={0.15}
          clearcoat={1}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* ---------------------------------------------------------- towers */}
      <group>
        <Boxes items={g.slabs}>
          <meshStandardMaterial color="#eceae4" roughness={0.5} metalness={0.04} />
        </Boxes>
        <Boxes items={g.glass} castShadow={false}>
          <meshPhysicalMaterial
            color="#132430"
            roughness={0.06}
            metalness={0.35}
            transparent
            opacity={0.72}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={2.4}
          />
        </Boxes>
        <LitPanels items={g.litWindows} windows={windows} />
        <Boxes items={g.fins}>
          <meshStandardMaterial color="#a9b3bd" roughness={0.3} metalness={0.85} />
        </Boxes>
        <Boxes items={g.balconies}>
          <meshStandardMaterial color="#e6e3dc" roughness={0.55} />
        </Boxes>
        <Boxes items={g.rails} castShadow={false}>
          <meshPhysicalMaterial
            color="#9fd3e8"
            roughness={0.05}
            metalness={0.2}
            transparent
            opacity={0.35}
            envMapIntensity={2}
          />
        </Boxes>
        <Boxes items={g.cores}>
          <meshStandardMaterial color="#c8c2b6" roughness={0.72} />
        </Boxes>
        <Boxes items={g.parapets}>
          <meshStandardMaterial color="#b9c2c9" roughness={0.42} metalness={0.5} />
        </Boxes>
      </group>

      {/* ------------------------------------------------------------ site */}
      <Instances limit={g.trees.length} range={g.trees.length} castShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#3e6b46" roughness={0.95} flatShading />
        {g.trees.map((t, i) => (
          <Instance
            key={i}
            position={[t.p[0], t.p[1] + 3.4 * t.s, t.p[2]]}
            scale={[2.5 * t.s, 3.3 * t.s, 2.5 * t.s]}
          />
        ))}
      </Instances>
      <Instances limit={g.trees.length} range={g.trees.length} castShadow>
        <cylinderGeometry args={[0.18, 0.26, 1, 6]} />
        <meshStandardMaterial color="#5a4632" roughness={1} />
        {g.trees.map((t, i) => (
          <Instance key={i} position={[t.p[0], t.p[1] + 1.6 * t.s, t.p[2]]} scale={[t.s, 3.2 * t.s, t.s]} />
        ))}
      </Instances>

      <Boxes items={g.cars}>
        <meshStandardMaterial color="#d7d9db" roughness={0.28} metalness={0.5} />
      </Boxes>

      <Boxes items={g.streetLights} castShadow={false} receiveShadow={false}>
        <meshStandardMaterial
          ref={lampRef}
          color="#101418"
          emissive="#ffe6bd"
          emissiveIntensity={0}
          toneMapped={false}
        />
      </Boxes>
      <Instances limit={g.streetLights.length} range={g.streetLights.length}>
        <cylinderGeometry args={[0.11, 0.14, 1, 6]} />
        <meshStandardMaterial color="#6d757c" roughness={0.5} metalness={0.6} />
        {g.streetLights.map((s, i) => (
          <Instance key={i} position={[s.p[0], 4.3, s.p[2]]} scale={[1, 8.6, 1]} />
        ))}
      </Instances>

      {/* Boundary wall keeps the site legible from a distance. */}
      <Boxes
        items={[
          { p: [0, 0.75, -PODIUM_D / 2 - 17], s: [PODIUM_W + 30, 1.5, 0.5] },
          { p: [PODIUM_W / 2 + 15, 0.75, -8], s: [0.5, 1.5, PODIUM_D + 18] },
          { p: [-PODIUM_W / 2 - 15, 0.75, -8], s: [0.5, 1.5, PODIUM_D + 18] },
        ]}
      >
        <meshStandardMaterial color="#c2beb6" roughness={0.9} />
      </Boxes>
    </group>
  );
}

export default AstoniaModel;
