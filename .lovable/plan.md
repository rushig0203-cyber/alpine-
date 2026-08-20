# Redesign the Projects Viewing Experience

## Goal
Make the Projects section feel more premium and informative while keeping the horizontal scroll interaction that was requested earlier.

## Decisions (defaults chosen for you)
- **Layout:** Keep horizontal scrolling, but upgrade the card design and scroll affordances.
- **Card content:** Show project photo, name, and a small location/type caption.
- **Interaction:** Click a card to open the existing project detail page; hover reveals a subtle overlay prompt.

## Implementation
1. Update `src/components/landing/Projects.tsx`:
   - Redesign each card to a taller, cinematic aspect ratio with a clean bottom gradient.
   - Display project name in Cormorant Garamond and location/type in small uppercase sans-serif.
   - Add a soft hover state that slightly scales the image and shows a "View Project" prompt.
   - Improve the horizontal scroll track with better spacing, snap points, and optional scroll arrows.
2. Update `src/data/projects.ts` if needed to ensure every project has a clean `location` and `type` string.
3. Verify responsiveness on mobile and tablet.

## Out of scope
- No changes to project detail pages.
- No changes to routing or data schema beyond adding display labels.
