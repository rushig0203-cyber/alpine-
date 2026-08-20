import ReactThreeTestRenderer from "@react-three/test-renderer";
import { describe, expect, it } from "vitest";
import { AstoniaModel } from "@/components/three/astonia/AstoniaModel";
import { buildAstonia, FLOORS, PODIUM_HEIGHT, ROOF_Y } from "@/components/three/astonia/geometry";
import { TIME_ORDER, TIME_PRESETS } from "@/components/three/astonia/time";

describe("Alpine Astonia model", () => {
  it("describes both towers, the podium and the amenity deck", () => {
    const g = buildAstonia();
    // 13 floors × 2 towers of slabs and glazing.
    expect(g.slabs).toHaveLength(FLOORS * 2);
    expect(g.glass).toHaveLength(FLOORS * 2);
    expect(g.floorMarkers).toHaveLength(FLOORS * 2);
    expect(g.litWindows.length).toBeGreaterThan(40);
    expect(g.shopGlass.length).toBeGreaterThan(10);
    expect(g.lawn.length).toBeGreaterThan(0);
    expect(g.trees.length).toBeGreaterThan(10);

    // Nothing may sink below the plinth or fly above the crown.
    for (const box of [...g.slabs, ...g.glass, ...g.balconies, ...g.deck]) {
      expect(box.p[1]).toBeGreaterThan(0);
      expect(box.p[1]).toBeLessThan(ROOF_Y + 6);
    }
    // The amenity deck sits on top of the retail podium.
    for (const box of g.lawn) expect(box.p[1]).toBeGreaterThan(PODIUM_HEIGHT);
  });

  it("keeps the amenity deck clear of the tower footprints", () => {
    const g = buildAstonia();
    // Towers span |x| = 8.5 → 24.5; deck planting must stay in the gap.
    for (const box of [...g.lawn, ...g.pergola]) {
      expect(Math.abs(box.p[0]) + box.s[0] / 2).toBeLessThan(8.6);
    }
  });

  it("has a smooth value for every time of day", () => {
    TIME_ORDER.forEach((key) => {
      const preset = TIME_PRESETS[key];
      expect(preset.sunIntensity).toBeGreaterThan(0);
      expect(preset.fogFar).toBeGreaterThan(preset.fogNear);
      expect(preset.windows).toBeGreaterThanOrEqual(0);
    });
  });

  // Note: the reflection probe (drei <Environment>) needs a real WebGL context,
  // so the scene-graph check mounts the model on its own.
  it("builds a valid three.js scene graph", async () => {
    const renderer = await ReactThreeTestRenderer.create(<AstoniaModel windows={1} />);
    const meshes = renderer.scene.findAllByType("Mesh");
    const instanced = renderer.scene.findAllByType("InstancedMesh");
    expect(meshes.length + instanced.length).toBeGreaterThan(10);
    await renderer.advanceFrames(2, 0.016);
    await renderer.unmount();
  });
});
