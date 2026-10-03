# ode

An ode to myself. A night photograph as a wallpaper, a handful of folders, and
one lit window that is a door.

- **The desk** (`/`) — full-bleed photograph, no scroll, no scrollbar. Manila
  folders hinge open when you come near; `⌘K` (or `ctrl+K`) opens the one place
  the sections are named.
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
open and the page's name lifts out on a sheet of paper; click it and it becomes
the page. `⌘K` opens the one place the sections are written down.

Phones get the sunset photograph instead, and the four emblems printed along its
dark foot. No bar, no cards, no scroll.

The pointer is drawn in DOM — a dot at the exact position and a ring trailing it
on a spring, because the system cursor is hidden. Fireflies rise out of the
bottom of the screen, mostly keeping low over the dark end of the photograph. The
folders lean into the wind, which arrives in bursts.

## Sound

The room has a voice, and none of it is a sample: the wind, the insects and the
bursts are all synthesised in the browser, so there is no recording to license and
nothing to download.

- **Sound starts on the first gesture.** Browsers refuse audio before a visitor
  has done something, so the graph is built on the first click or keypress and
  faded up from silence over a couple of seconds. The speaker button in the pill
  mutes it, and that choice is remembered.
- **The wind is the same wind that moves the folders.** `src/audio/wind.ts` is
  driven every frame by the gust envelope in `src/lib/air.ts` — a low body, a
  narrow resonant whistle, and a hiss that only exists at the peak of a push.
  Measured: correlation of 0.79 between the gust and the 200–1200Hz band.
- **The night bed is a recording** picked by Kaleb, not a synthesiser:
  `src/audio/ambience.ts` loads, decodes and loops three minutes of it. The level
  is **measured from the file** rather than hand-picked, so swapping in a louder or
  quieter recording still lands in the same place. Measured alone: **−41 dBFS**,
  about 15dB under a track.
- **The player** is the pill, bottom right. Back, record, forward, speaker.
  Pressing the record plays and pauses, the speaker slides the volume bar out on
  approach, and the bar moves the master — so it moves everything. On a phone it
  rides above the emblem row instead of sitting on it.

Songs are **not** in the repository. `public/audio/` is gitignored, and
`scripts/fetch-music.sh` fetches them locally. YouTube bot-walls a datacenter IP,
so that script needs a cookies file from a signed-in browser.

If you already have the files — bought, ripped, whatever — use the other one:

```
./scripts/install-audio.sh ~/Downloads/*.mp3
./scripts/install-audio.sh ~/Downloads/track.m4a something-in-the-orange
```

It takes anything ffmpeg reads, works out which track it is from the filename
("Zach Bryan - Pink Skies (Lyrics).webm" finds its own slot), converts to mp3,
lifts any embedded cover art out as the album tile, rebuilds, and leaves anything
it cannot place in `public/audio/_unmatched/` rather than dropping it.

## Pages

- `/photography` — a justified gallery: rows solved to fill the width exactly, at
  each picture's own aspect ratio, nothing cropped, nothing squared. Hover: the
  tile grows 2% and tilts 5°, and names itself along its bottom edge. Click: it
  opens full-screen. Captions and the pixel dimensions live in
  `src/content/photography.ts` — change them there.
- `/code` — the year as a field of lit windows, live from GitHub, plus the real
  repositories.
- `/rosaria` — three screenshots of the app, and two links.
- `/about` — one paragraph, two links.

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
