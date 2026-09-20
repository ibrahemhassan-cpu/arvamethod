# ARVAmethod — Landing Page, three directions

React 19 + Vite + Tailwind CSS v4. Animation: GSAP (ScrollTrigger, SplitText), Lenis smooth scroll,
Motion (menu only, lazy-loaded) and OGL/WebGL (version 3 only, lazy-loaded).

```bash
npm install
npm run dev      # http://localhost:5173  (dev mode — slower, StrictMode double-renders)
npm run prod     # production build + preview on http://localhost:4173 — judge performance here
npm run images   # re-compress everything in public/images
```

## The four editions

| # | Link | Name | Direction |
|---|------|------|-----------|
| 1 | `/` (default) | **Harmony** | Editorial's storytelling with the Kinetic ticker, Immersive testimonials and glass footer |
| 2 | `/kinetic` | **Kinetic** | Light paper, oversized type that drifts, horizontal ribbon, hover accordion |
| 3 | `/immersive` | **Immersive** | WebGL: the logo built from ~14k particles, live shader gradient, 3D carousel, depth tunnel |
| 4 | `/editorial` | **Editorial** | Dark espresso, cinematic photography, typographic scroll storytelling |

The bare domain serves Harmony; `/harmony` also works and settles back to `/`. Change
`DEFAULT_EDITION` in `src/variants/registry.ts` to promote a different cut.

Editions are defined in `src/variants/registry.ts` — an edition is a base version plus a per-section mix,
so new named cuts are a few lines there.

Each edition is a real path, so every link can be sent on its own and opens straight into that cut.
They live only in the nav menu (**Design versions**, at the foot) — deliberately small, so nobody reads
them as part of the design. Keys `1`–`4` also jump between them while presenting.

Deep links need an SPA rewrite on the host: `public/_redirects` (Netlify) and `vercel.json` (Vercel) are
included; on Nginx/Apache point every unknown path at `index.html`.
- **Mix** (inside the menu, collapsed until asked for) picks a version per section; the page recomposes
  live and **Copy link** gives back either the named edition or `/custom?v=2&mix=hero-3.stories-1`.
- Legacy `?v=…` links still resolve and rewrite themselves to the path form.
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
