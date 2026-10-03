# ode

An ode to myself. A night photograph as a wallpaper, a handful of folders, and
one lit window that is a door.

- **The desk** (`/`) — full-bleed photograph, no scroll, no scrollbar. Manila
  folders hinge open when you come near; the lit window in the picture opens the
  about page. `⌘K` (or `ctrl+K`) opens the one place the sections are named.
- **Phones** get a different room, not a smaller one: the sunset photograph, and
  four emblems along its foot.
- `/photography` — square tiles butted together, no gaps or borders.
- `/code` — the year as a field of lit windows, plus the real repositories.
- `/rosaria` — the app that gets used every day.
- `/about` — the window, opened.

## Run it

```bash
npm install
npm run dev
```

## The desk

Nothing on it is a card. Two lines of text — the title top-left, the hour
top-right — and four manila folders carrying a drawn emblem each (aperture,
branch, beads, window) instead of a name. Hover a folder and its flap hinges
open; click it and it becomes the page. The single lit window in the night
photograph is the way to About. `⌘K` opens the one place the sections are
written down.

Phones get the sunset photograph instead, and the four emblems printed along its
dark foot. No bar, no cards, no scroll.

The pointer is a pixel arrow drawn in `public/cursors/`. The folders lean into
the breeze. There are fireflies.

## Pages

- `/photography` — square tiles butted together, no gaps or borders. Hover: the
  tile grows 2% and tilts 5°, and names itself along its bottom edge. Captions
  live in `src/content/photography.ts` — change them there.
- `/code` — the year as a field of lit windows, live from GitHub, plus the real
  repositories.
- `/rosaria` — three screenshots of the app, and two links.
- `/about` — the window, opened. One paragraph, two links.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · shadcn/ui (radix, nova) ·
Motion · React Router. Fonts: Spectral and Fragment Mono, self-hosted through
`@fontsource` — no external font host at runtime.

GitHub data comes from the public contributions API and the public repos API,
each with a bundled snapshot in `src/content/*.snapshot.json` as a fallback, so
the page never renders empty.

## Editing

- `src/content/site.ts` — the folders, the verse, the links, the greeting.
- `src/content/photography.ts` — the contact sheet. Drop a file in
  `public/photos/`, set `src` and `developed: true`.
- `PRODUCT.md` — what this is for. `DESIGN.md` — the world it lives in.

## Deploy

Vercel-ready (`vercel.json` rewrites every route to `index.html` for the
client-side router):

```bash
npx vercel --prod
```
