# ode — design

The world: **a machine left on at 1am.** One photograph as the ground, one warm
light that belongs to a window, and furniture made of glass and paper. The page
never scrolls, because a wallpaper doesn't.

## Tokens

Defined once in `src/index.css` (Tailwind v4 `@theme` + `:root`). Nothing is
allowed a colour outside this list.

| Token | Value | What it is for |
|---|---|---|
| `--background` | `#06070a` | the dark the photograph sits in |
| `--foreground` / `bone` | `#e9e4da` | the voice — headings, prose, labels |
| `ash` | `#8b8578` | chrome: meta lines, captions, hints |
| `amber` | `#f5a623` | the window. The only actionable colour, and the only one that glows |
| `paper` | `#ddd6c6` | folder labels, contact-sheet paper |
| `ink` | `#16171c` | text on paper |
| `moss` | `#8fdc8f` | contribution squares — and nothing else |
| `rosary` | `#d9b8ff` | the rosaria folder dot only |

`--radius: 0.7rem`. Every surface is either furniture (folder, dock, sheet) or
paper (label, contact sheet, panel).

## Type

| Face | Use | Why |
|---|---|---|
| **Endless** 400 | the site's face: wordmark, page titles, folder names, nav, prose labels | Kaleb's own face, supplied for this site. 94 codepoints — ASCII only, so nothing set in it uses an em dash, a curly quote or an ellipsis. |
| **Spectral** 200/300/400 + italic | the verse only | an ode reads as poetry; the serif is reserved so the quotation always lands as a different voice from the interface. |
| **Fragment Mono** 400 | technical margin notes only: timestamps, frame numbers, contact-sheet captions, folder tabs | keeps the photographic marginalia separate from the site's voice. |

Self-hosted: Endless from `public/fonts/`, the others through `@fontsource`. No external font host at runtime.

Type scale is not a scale: the wordmark is `1.05rem` and page titles are
`clamp(2.2rem, 5vw, 3.6rem)`; everything else is 0.5–1.1rem. Hierarchy is carried
by scale contrast and tracking, not by weight — Endless ships one weight.

## Materials and motion

- **Film grain** at 15% soft-light over everything, and a vignette *under* the
  furniture so corners go quiet without dimming words.
- **Dust motes**: 14 amber specks drifting up-left on 26–48s loops. The only
  ambient motion on the desk; stops entirely under `prefers-reduced-motion`.
- **Breeze**: pointer position tilts the whole folder cluster ±2.6° and shifts
  each paper label by up to 2px. Smoothed at 6% per frame; off on touch and for
  reduced motion.
- **The folder**: a tab rising 20px above a back panel, a lid hinged at the
  bottom (`rotateX(-30deg)` on hover/focus) that reveals a peek behind it, and a
  paper label that lifts and leans. 600ms, `cubic-bezier(0.22, 1, 0.36, 1)`.
- **The window**: a hotspot mapped to the pixel. `useCoverBox` computes where an
  `object-fit: cover` image lands, so the door sits on the real lit window at
  67.5% / 35.4% of the photograph at any viewport shape.
- **The chase light** on `/code`: one 11s amber sweep every 18s across the year
  grid, so "now" is visible without reading a label.

## Composition

**Desktop (`≥900px`, `/`)**: fixed photograph; menu bar (mark left, local hour +
greeting + `look around` right); a left column vertically centred with wordmark,
verse epigraph and a 2×2 folder grid; a glass dock bottom-centre; a wink
bottom-right; a vertical GitHub spine on `≥1280px`. Nothing scrolls and no
scrollbar is rendered (`html.desk-locked`).

**Mobile (`<900px`)**: the same world, a different room. The photograph stays
fixed and dimmed, the lit window is lifted out of it and set as a card, the
folder grid becomes a drawer of paper tabs that open in place, and a thumb bar
holds the sections. Scrolling is allowed because the sheet is long.

**Pages** keep the photograph behind, dimmed and slightly blurred, so you never
quite leave the room.

## Rules

1. Amber means "you can press this". If it isn't actionable, it isn't amber.
2. Green belongs to commits. Purple belongs to rosaria. Neither spreads.
3. No cards. Furniture (folder, dock, sheet, strip) or paper. Never a card grid.
4. Every page opens with a serif sentence that could stand alone as a line.
5. Nothing is claimed that isn't true — see `ASSETS.md` for every raster.
