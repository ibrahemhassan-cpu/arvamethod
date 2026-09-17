# ARVAmethod — Landing Page

React 19 + Vite + Tailwind CSS v4, animated with GSAP (ScrollTrigger, SplitText), Lenis smooth scroll and Motion (menu only, lazy-loaded).

```bash
npm install
npm run dev      # http://localhost:5173  (dev mode — slower, StrictMode double-renders)
npm run prod     # production build + preview on http://localhost:4173 — judge performance here
npm run images   # re-compress everything in public/images
```

Append `?slowmo` to the dev URL to watch every animation at 1/6 speed.

## Where things live

- `src/lib/content.ts` — all copy, links and images. Set `HERO_VIDEO` to use a background video in the hero.
- `src/components/Preloader.tsx` — the opening: the logo assembles from slices, then flies into the header.
- `src/sections/*` — one file per page section, each owning its scroll animation.
- `src/lib/useReveals.ts` — shared `data-lines` / `data-fade` / `data-clip` / `data-parallax` reveals.
- `src/lib/useTilt.ts` — pointer 3D tilt for `[data-tilt]` cards.

## Performance notes

- Scroll effects animate only `transform` / `opacity` (no per-frame clip-path, width, border-radius or backdrop-filter on large areas).
- Marquees and the breathing orb pause while off-screen; the menu (and Motion) load on demand.
- All motion respects `prefers-reduced-motion`; pinned/horizontal effects are desktop-only (≥768px).
