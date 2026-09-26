# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio/CV for Isaque Santos, a static Astro site in PT-BR and EN-US. It deploys to GitHub Pages at <https://isaqueafs.github.io/cv>. The README and commit messages are in Portuguese.

## Commands

- `npm run dev`: dev server at `localhost:4321/cv/`
- `npm run dev:envkit`: dev server used by the local EnvKit site `cv2` (binds `127.0.0.1:5170`, allows host `cv2.dev`; open <https://cv2.dev/cv/>)
- `npm run build`: static build to `./dist/`, the same command CI runs
- `npm run preview`: serve the built `dist/`
- `npx astro check`: type-check `.astro` files (tsconfig extends `astro/tsconfigs/strict`); needs `@astrojs/check` + `typescript`, which are not installed yet

Node >= 22.12 is required. There is no test suite and no linter. Run `npm run build` to verify a change.

## Architecture

- **Base path `/cv`**: `astro.config.mjs` sets `site` and `base: '/cv'` (GitHub Pages serves the repo `isaqueafs/cv` there; the local folder and EnvKit site are still named `cv2`). Internal links and assets must never be hardcoded. Each page, layout and component that links internally builds a `base` from `import.meta.env.BASE_URL.replace(/\/$/, '')` and uses it as `` href={`${base}/en/`} ``.
- **i18n is duplication, not a library**: `src/pages/index.astro` (PT-BR) and `src/pages/en/index.astro` (EN-US) are near-identical copies with translated text. Experience and skills are data arrays in each page's frontmatter. A content or structure change to one page must be mirrored in the other. Each page passes `lang` (and optionally `title`/`description`) to the layout.
- **404 is bilingual in a single page** (`src/pages/404.astro`). GitHub Pages serves only one `404.html`, so an `en/404` page would never be used.
  - Both versions are rendered, and an inline script sets `<html lang>` before paint: English under `/cv/en/`, otherwise the browser language decides (Portuguese → PT, anything else → EN).
  - Elements carry `data-lang-variant="pt-BR|en"`, and a global rule in `global.css` hides the variant that doesn't match `<html lang>`. Without JavaScript, PT is shown.
- **Layout** (`src/layouts/Base.astro`): holds all `<head>` concerns (SEO/OG/Twitter meta built from props, canonical URL and `hreflang` alternates from `Astro.site`, Google Fonts) and an inline anti-flash theme script. That script reads a `theme` cookie (default `dark`) and sets `data-theme` on `<html>` before paint.
- **Page layout**:
  - The container is `max-w-6xl`.
  - From `lg` it becomes a two-column grid: a main column (about + experience) and a `20rem` `<aside>` (skills, education, languages).
  - Below `lg` everything stacks in DOM order, and the aside becomes a 2-column grid on `sm`.
  - Contact links appear in the header and the footer via `src/components/ContactLinks.astro`.
- **Topographic background**: `src/lib/topography.ts` builds contour-line path data. The look blends the rounded contours of the game *Hell Is Us* with a more organic, irregular flow.
  - The pipeline is 2-octave Perlin noise with domain warp, then marching squares, then one Chaikin pass, then Ramer–Douglas–Peucker simplification, output as Catmull-Rom cubic Béziers with 1-decimal coordinates. Integer coordinates and plain polylines looked jagged when the background is highlighted.
  - Levels sit 70% of the way from linear (p2–p98) toward quantile, so bands tighten and open up naturally without leaving empty areas.
  - The defaults were tuned for look vs. cost (~30ms, ~45KB of path data).
  - A client script in `Base.astro` calls it with a random seed on every page load, in `requestIdleCallback` so it stays off the critical path.
  - It draws into the fixed `.topo-bg` layer as an inline SVG stroked with `currentColor`, i.e. the accent color.
  - The long side is fixed at 1600 units so the cost doesn't grow on tall phones.
  - Opacity comes from `--topo-opacity` per theme. Light mode is capped at 0.10 so muted text crossing a line stays ≥4.5:1.
  - The background is intentionally static. A slow drift and an evolving 3D-noise terrain were both tried and rejected: the moving contours felt psychedelic and could cause motion discomfort. Don't reintroduce background animation unless asked.
- **TopoInfo** (`src/components/TopoInfo.astro`): a round floating button, fixed bottom-right, that opens a popover explaining the background (inspiration, how it's built, and the unique seed code).
  - Each page renders it: index pages pass their language, and the 404 passes `lang="auto"`, which renders every text in both languages as `data-lang-variant` spans and syncs the `aria-label`s with `<html lang>` in its script.
  - It uses the native `popover` attribute, and its script anchors the popover above the button.
  - While the popover is open, `html.topo-focus` fades the page content to 12% and raises the background to `--topo-focus-opacity`, so the terrain takes the stage. The button and popover are excluded from the fade.
  - `Base.astro` publishes the seed via `html[data-topo-seed]` and the `topo:drawn` event, and listens for `topo:redraw`, which the "gerar outro relevo" button fires to regenerate without a reload.
  - The button stays `hidden` until a seed exists, so it never appears without JavaScript.
- **HeaderControls** (`src/components/HeaderControls.astro`): the language nav and theme toggle shared by both pages.
  - The toggle renders with `hidden` and its script reveals it, so it never appears without JavaScript.
  - The script flips `data-theme`, adds `theme-ready` (this enables the color transitions), writes the cookie, and keeps the toggle's `aria-label` in sync.
- **Styling** (`src/styles/global.css`): Tailwind v4 through `@tailwindcss/vite`. There is no `tailwind.config`. Design tokens live in `@theme`:
  - colors: `canvas`, `surface`, `surface-raised`, `border`, `text`, `soft` (reading text), `muted` (metadata), `accent`, `accent-dim`
  - type roles: `text-body` (15px/1.7, reading copy) and `text-meta` (13px, section headings, dates, chips)
  - fonts: `font-display` (Bebas Neue) and DM Mono

  Light mode overrides the same variables under `html[data-theme="light"]`. Use token classes rather than raw colors so both themes work. Every text/background pair meets WCAG AA (4.5:1) in both themes, including the card hover state, so recheck contrast whenever a color changes.
- **Icons**: `src/components/Icon.astro` inlines the Tabler outline SVG paths the site uses (`<Icon name="mail" />`). There is no icon webfont. To add an icon, copy its paths from the `@tabler/icons` package into the map.
- **Touch targets** use the `pointer-coarse:` variant to reach 44px on touch devices without changing the desktop look.

## Deploy / CI

- `.github/workflows/deploy.yml`: every push to `main` runs `npm ci && npm run build` and publishes `dist/` to GitHub Pages.
- `.github/workflows/claude.yml` and `claude-code-review.yml`: Claude Code GitHub Actions (PR assistant and automated review).
