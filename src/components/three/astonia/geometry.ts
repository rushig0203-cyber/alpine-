/**
 * Procedural geometry description of Alpine Astonia (Kiwale, PCMC).
 *
 * The real project is two residential towers of 2 & 3 BHK homes sitting on a
 * ground-level retail plaza, with an amenity podium deck between the towers.
 * Everything below is data only — the renderer turns each list into a single
 * instanced draw call, which is what keeps the scene smooth on modest hardware.
 */

export type Box = {
  p: [number, number, number];
  s: [number, number, number];
  r?: [number, number, number];
};

/** Deterministic RNG so the "lit windows" pattern is stable between renders. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export const FLOOR_HEIGHT = 3.3;
export const FLOORS = 13;
export const PODIUM_HEIGHT = 8.2;
export const PODIUM_W = 62;
export const PODIUM_D = 34;
export const TOWER_W = 16;
export const TOWER_D = 14;
export const TOWER_H = FLOORS * FLOOR_HEIGHT;
export const TOWER_X = 16.5;
export const ROOF_Y = PODIUM_HEIGHT + TOWER_H;

export type AstoniaGeometry = {
  slabs: Box[];
  glass: Box[];
  fins: Box[];
  balconies: Box[];
  rails: Box[];
  litWindows: Box[];
  cores: Box[];
  parapets: Box[];
  podium: Box[];
  shopGlass: Box[];
  shopSigns: Box[];
  deck: Box[];
  lawn: Box[];
  court: Box[];
  pergola: Box[];
  trees: { p: [number, number, number]; s: number }[];
  cars: Box[];
  streetLights: Box[];
  /** Per-floor centre points, used for the floor selector in the twin view. */
  floorMarkers: { floor: number; y: number; x: number }[];
};

function tower(
  cx: number,
  out: AstoniaGeometry,
  random: () => number,
  mirror: number,
) {
  const halfW = TOWER_W / 2;
  const halfD = TOWER_D / 2;

  // Vertical fins run the full height of the tower on the long facades.
  const bays = 5;
  for (let i = 0; i <= bays; i++) {
    const x = cx - halfW + (i * TOWER_W) / bays;
    for (const z of [halfD + 0.28, -halfD - 0.28]) {
      out.fins.push({
        p: [x, PODIUM_HEIGHT + TOWER_H / 2, z],
        s: [0.34, TOWER_H + 0.6, 0.62],
      });
    }
  }
  for (const x of [cx - halfW - 0.28, cx + halfW + 0.28]) {
    for (const z of [TOWER_D / 4 + 0.6, -TOWER_D / 4 - 0.6]) {
      out.fins.push({
        p: [x, PODIUM_HEIGHT + TOWER_H / 2, z],
        s: [0.62, TOWER_H + 0.6, TOWER_D / 2.4],
      });
    }
  }

  for (let f = 0; f < FLOORS; f++) {
    const y = PODIUM_HEIGHT + f * FLOOR_HEIGHT;

    // Projecting floor slab — the horizontal rhythm of the elevation.
    out.slabs.push({
      p: [cx, y + 0.22, 0],
      s: [TOWER_W + 1.5, 0.44, TOWER_D + 1.5],
    });

    // Glazed volume between slabs.
    out.glass.push({
      p: [cx, y + FLOOR_HEIGHT / 2 + 0.2, 0],
      s: [TOWER_W, FLOOR_HEIGHT - 0.55, TOWER_D],
    });

    // Balconies alternate side to side, giving the towers a woven look.
    const front = f % 2 === 0 ? 1 : -1;
    const bz = front * (halfD + 1.55);
    for (const off of [-TOWER_W / 4, TOWER_W / 4]) {
      out.balconies.push({
        p: [cx + off, y + 0.3, bz],
        s: [TOWER_W / 2.35, 0.3, 3.1],
      });
      out.rails.push({
        p: [cx + off, y + 0.95, bz + front * 1.5],
        s: [TOWER_W / 2.35, 1.2, 0.1],
      });
      out.rails.push({
        p: [cx + off - (TOWER_W / 4.7) * 1, y + 0.95, bz],
        s: [0.1, 1.2, 3.1],
      });
    }

    // Warm interior light for a stable, random subset of homes.
    for (let b = 0; b < 4; b++) {
      const x = cx - halfW + TOWER_W * (0.16 + b * 0.225);
      for (const side of [1, -1]) {
        if (random() > 0.55) continue;
        out.litWindows.push({
          p: [x, y + FLOOR_HEIGHT / 2 + 0.2, side * (halfD + 0.06)],
          s: [2.1, 1.7, 0.06],
        });
      }
    }

    out.floorMarkers.push({ floor: f + 1, y: y + FLOOR_HEIGHT / 2, x: cx });
  }

  // Service / lift core expressed as a solid stone shaft.
  out.cores.push({
    p: [cx + mirror * (halfW - 2.4), PODIUM_HEIGHT + TOWER_H / 2 + 1.4, -halfD - 1.3],
    s: [5.4, TOWER_H + 3.6, 3],
  });

  // Crown: parapet ring plus a slim pergola on the terrace.
  const top = ROOF_Y;
  out.parapets.push({ p: [cx, top + 0.35, 0], s: [TOWER_W + 2.2, 0.7, TOWER_D + 2.2] });
  out.parapets.push({ p: [cx, top + 1.5, halfD + 0.9], s: [TOWER_W + 2, 1.6, 0.22] });
  out.parapets.push({ p: [cx, top + 1.5, -halfD - 0.9], s: [TOWER_W + 2, 1.6, 0.22] });
  for (let i = 0; i < 7; i++) {
    out.parapets.push({
      p: [cx - 6 + i * 2, top + 3.1, 0],
      s: [0.22, 0.22, TOWER_D - 2],
    });
  }
  out.parapets.push({ p: [cx, top + 3.25, 0], s: [13, 0.16, 0.3] });
}

export function buildAstonia(): AstoniaGeometry {
  const random = rng(20260420);
  const out: AstoniaGeometry = {
    slabs: [],
    glass: [],
    fins: [],
    balconies: [],
    rails: [],
    litWindows: [],
    cores: [],
    parapets: [],
    podium: [],
    shopGlass: [],
    shopSigns: [],
    deck: [],
    lawn: [],
    court: [],
    pergola: [],
    trees: [],
    cars: [],
    streetLights: [],
    floorMarkers: [],
  };

  tower(-TOWER_X, out, random, -1);
  tower(TOWER_X, out, random, 1);

  /* ---------------------------------------------------------------- podium */
  out.podium.push({ p: [0, PODIUM_HEIGHT / 2, 0], s: [PODIUM_W, PODIUM_HEIGHT, PODIUM_D] });
  // Overhanging canopy slab that caps the retail level.
  out.podium.push({ p: [0, PODIUM_HEIGHT + 0.3, 0], s: [PODIUM_W + 3.4, 0.6, PODIUM_D + 3.4] });
  // Plinth.
  out.podium.push({ p: [0, 0.35, 0], s: [PODIUM_W + 5, 0.7, PODIUM_D + 5] });
  // Entrance portal — piers and a lintel rather than a solid slab, so the
  // double-height lobby glazing stays visible from the approach.
  for (const x of [-7.6, 7.6]) {
    out.podium.push({ p: [x, 5.2, PODIUM_D / 2 + 2.6], s: [2.2, 10.4, 1.4] });
  }
  out.podium.push({ p: [0, 10.9, PODIUM_D / 2 + 2.6], s: [17.4, 1.4, 1.8] });
  out.podium.push({ p: [0, 0.5, PODIUM_D / 2 + 3.4], s: [19, 0.4, 5.2] });

  const shops = 11;
  for (let i = 0; i < shops; i++) {
    const x = -PODIUM_W / 2 + (PODIUM_W / shops) * (i + 0.5);
    if (Math.abs(x) < 8) continue; // main lobby sits in the middle
    for (const side of [1, -1]) {
      out.shopGlass.push({
        p: [x, 3.1, side * (PODIUM_D / 2 + 0.08)],
        s: [PODIUM_W / shops - 1.1, 5.4, 0.1],
      });
      out.shopSigns.push({
        p: [x, 6.6, side * (PODIUM_D / 2 + 0.14)],
        s: [PODIUM_W / shops - 2.4, 0.5, 0.08],
      });
    }
  }
  for (let i = 0; i < 4; i++) {
    const z = -PODIUM_D / 2 + (PODIUM_D / 4) * (i + 0.5);
    for (const side of [1, -1]) {
      out.shopGlass.push({
        p: [side * (PODIUM_W / 2 + 0.08), 3.1, z],
        s: [0.1, 5.4, PODIUM_D / 4 - 1.4],
      });
    }
  }
  // Glazed double-height lobby.
  out.shopGlass.push({ p: [0, 4.2, PODIUM_D / 2 + 0.1], s: [13.4, 7.4, 0.12] });

  /* ------------------------------------------------------- amenity podium  */
  // The towers occupy x = ±8.5 → ±24.5, so the amenity deck lives in the
  // central strip between them plus the two end strips.
  const deckY = PODIUM_HEIGHT + 0.62;

  // Pool with a stone coping.
  out.deck.push({ p: [0, deckY + 0.07, 7], s: [15.4, 0.18, 9.4] });
  // Loungers along the pool.
  for (let i = 0; i < 4; i++) {
    out.deck.push({ p: [-5.4 + i * 3.6, deckY + 0.32, 12.6], s: [1.9, 0.52, 0.85] });
  }
  // Lawn.
  out.lawn.push({ p: [0, deckY + 0.06, -6], s: [15, 0.14, 9.6] });
  // Multipurpose court at each end of the deck.
  for (const x of [-28.2, 28.2]) {
    out.court.push({ p: [x, deckY + 0.06, 0], s: [5.4, 0.14, 22] });
  }
  // Pergola over the lawn.
  for (let i = 0; i < 8; i++) {
    out.pergola.push({ p: [-6.3 + i * 1.8, deckY + 3.15, -6], s: [0.16, 0.16, 9.8] });
  }
  out.pergola.push({ p: [0, deckY + 1.65, -10.7], s: [15.4, 3.3, 0.2] });
  out.pergola.push({ p: [0, deckY + 1.65, -1.3], s: [15.4, 3.3, 0.2] });
  out.pergola.push({ p: [0, deckY + 3.32, -10.6], s: [15.8, 0.2, 0.4] });
  out.pergola.push({ p: [0, deckY + 3.32, -1.4], s: [15.8, 0.2, 0.4] });
  // Clubhouse pavilion at the rear of the deck.
  out.deck.push({ p: [0, deckY + 2.1, -14], s: [16, 4.2, 5.4] });

  // Perimeter glass balustrade.
  for (const z of [PODIUM_D / 2 - 0.4, -PODIUM_D / 2 + 0.4]) {
    out.rails.push({ p: [0, deckY + 0.75, z], s: [PODIUM_W - 1, 1.4, 0.1] });
  }
  for (const x of [PODIUM_W / 2 - 0.4, -PODIUM_W / 2 + 0.4]) {
    out.rails.push({ p: [x, deckY + 0.75, 0], s: [0.1, 1.4, PODIUM_D - 1] });
  }

  /* ---------------------------------------------------------------- site   */
  // Perimeter planting, with the front approach deliberately left open.
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2;
    const x = Math.cos(angle) * (58 + (i % 3) * 7);
    const z = Math.sin(angle) * (40 + (i % 4) * 5);
    if (z > 12 && Math.abs(x) < 34) continue;
    out.trees.push({ p: [x, 0, z], s: 1 + (i % 4) * 0.16 });
  }
  // Avenue along the approach road.
  for (let i = 0; i < 8; i++) {
    const x = -52 + i * 15;
    if (Math.abs(x) < 12) continue;
    out.trees.push({ p: [x, 0, PODIUM_D / 2 + 13], s: 0.9 });
  }
  // Deck planting along the pool edge.
  for (const x of [-7.2, 7.2]) {
    for (let i = 0; i < 3; i++) {
      out.trees.push({ p: [x, deckY, 3 + i * 4.2], s: 0.45 });
    }
  }

  for (let i = 0; i < 12; i++) {
    const x = -55 + i * 10;
    const z = PODIUM_D / 2 + 22 + (i % 2) * 4.6;
    out.cars.push({ p: [x, 0.6, z], s: [4.4, 1.2, 2] });
    out.cars.push({ p: [x - 0.2, 1.45, z], s: [2.4, 0.8, 1.8] });
  }
  for (let i = 0; i < 8; i++) {
    out.streetLights.push({
      p: [-52 + i * 15, 8.6, PODIUM_D / 2 + 16],
      s: [0.7, 0.22, 0.7],
    });
  }

  return out;
}
