# ARVAmethod — Landing Page, three directions

React 19 + Vite + Tailwind CSS v4. Animation: GSAP (ScrollTrigger, SplitText), Lenis smooth scroll,
Motion (menu only, lazy-loaded) and OGL/WebGL (version 3 only, lazy-loaded).

```bash
npm install
npm run dev      # http://localhost:5173  (dev mode — slower, StrictMode double-renders)
npm run prod     # production build + preview on http://localhost:4173 — judge performance here
npm run images   # re-compress everything in public/images
```

## The three versions

| # | Name | Direction |
|---|------|-----------|
| 1 | **Editorial** | Dark espresso, cinematic photography, typographic scroll storytelling |
| 2 | **Kinetic** | Light paper, oversized type that drifts, horizontal ribbon, hover accordion |
| 3 | **Immersive** | WebGL: the logo built from ~14k particles, live shader gradient, 3D carousel, depth tunnel |

Switch with the console at the bottom of the screen, or press `1` / `2` / `3`. `M` toggles Mix mode.

- `?v=2` opens a version directly.
- **Mix** picks a version per section; the page recomposes live and **Share** copies a link such as
  `?v=2&mix=hero-3.stories-1` that reproduces that exact cut.
- A version only re-imagines the sections it has something to say about; anything else falls back to
  version 1 (V2 reuses V1 for the signature session, manifesto, breathe and social; V3 reuses V1 for
  manifesto, breathe and social).

## Where things live

- `src/lib/content.ts` — all copy, links and images. Set `HERO_VIDEO` for a background video in the V1 hero.
- `src/variants/registry.ts` — section ids, the three variant modules, lazy loading and fallback rules.
- `src/variants/VariantProvider.tsx` — current version, mix map, URL sync, keyboard shortcuts.
- `src/sections/*` — V1 sections; `src/sections/v2/*`, `src/sections/v3/*` — the other directions.
- `src/lib/webgl/useRenderer.ts` — OGL renderer bound to the GSAP ticker, paused when off-screen.
- `src/components/Preloader.tsx` — the logo assembles from slices, then flies into the header.

Append `?slowmo` in dev to watch every animation at 1/6 speed.

## Performance notes

- Scroll effects animate only `transform` / `opacity` (no per-frame clip-path, width, radius or
  backdrop-filter over large areas).
- Each version is its own chunk; WebGL (OGL) only loads with version 3. Marquees, the breathing orb
  and every WebGL scene pause while off-screen.
- All motion respects `prefers-reduced-motion`; pinned/horizontal/3D effects are desktop-only (≥768px).
