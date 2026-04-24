# Hero asset slot

Place your hero 3D scene here so the homepage picks it up automatically.

Expected filename: `scene.webp` (PNG also works if you rename the Image `src`).

Recommended specs:
- Format: WEBP (best compression) or PNG (transparency)
- Dimensions: 1280 × 1040 px (2× retina target for a ~640 × 520 render)
- Weight target: ≤ 350 KB
- Background: transparent (recommended) — the left-side black backdrop is
  already handled by the hero container CSS.

The `<Image>` is already wired with `priority` + `fill` + `object-contain`
so the file will render pixel-perfectly as soon as it exists.

If `scene.webp` is missing at runtime, the component falls back to the
React Three Fiber WebGL scene — the site never renders a broken slot.
