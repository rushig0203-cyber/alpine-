# Alpine Landmarks

Luxury real-estate marketing website built with Vite, React, TypeScript and Tailwind.

## 3D experience

The hero uses React Three Fiber and drei to render a small procedural architectural composition. It intentionally does not download a model, so the first 3D iteration stays light and easy to maintain.

- `src/components/three/HeroScene.tsx` owns all WebGL code.
- `src/components/landing/Hero.tsx` lazy-loads that scene after initial paint and preserves the existing `hero-luxury.jpg` as the LCP-friendly fallback.
- WebGL is skipped for mobile widths, reduced-motion users, and unsupported browsers. The underlying hero content stays usable in every case.
- Project and featured-project imagery use `TiltFrame`, a mouse-only CSS perspective enhancement that does nothing for touch and reduced-motion users.

### Replacing the procedural building

When a final architectural `.glb` is available, place a Draco-compressed file in `src/assets/models/` and replace the `ArchitecturalForm` meshes in `HeroScene.tsx` with drei's `useGLTF`. Keep it below roughly 1 MB for the hero where possible, load it inside the existing lazy boundary, and retain the static image fallback.

The 3D dependencies are `three`, `@react-three/fiber`, and `@react-three/drei`. They are pinned to the React 18-compatible Fiber 8 line because this project currently uses React 18.
