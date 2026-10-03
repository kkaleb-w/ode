# ode

An ode to myself. A night photograph as a wallpaper, a handful of folders, and
one lit window that is a door.

- **The desk** (`/`) — full-bleed photograph, no scroll, no scrollbar. Folders
  hinge open when you come near; the lit window in the picture opens the about
  page. `⌘K` (or `ctrl+K`) opens "look around".
- **Phones** get a different room, not a smaller one: a drawer of paper tabs and
  the window lifted out of the photograph as a card.
- `/photography` — roll 01, as a contact sheet.
- `/code` — the year as a field of lit windows, plus the real repositories.
- `/rosaria` — the app that gets used every day.
- `/about` — the window, opened.

## Run it

```bash
npm install
npm run dev
```

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
