# ode — design

The world: **a desk at night with the light still on.** One photograph as the
ground, manila folders lying on it, and no words except two. The page never
scrolls, because a wallpaper doesn't.

## Tokens

Defined once in `src/index.css` (Tailwind v4 `@theme` + `:root`). Nothing is
allowed a colour outside this list.

| Token | Value | What it is for |
|---|---|---|
| `--background` | `#06070a` | the dark the photograph sits in |
| `--foreground` / `bone` | `#e9e4da` | the voice |
| `ash` | `#8b8578` | secondary chrome |
| `amber` | `#f5a623` | one accent, used sparingly — a link underline, the fireflies |
| `kraft` / `kraft-deep` | `#c4b094` / `#a08a6c` | manila paper: the folders |
| `--color-kraft-shade` | `#6f5c43` | the cut edge of the paper |
| `--color-ink-brown` | `#2e2619` | anything printed on the paper |
| `moss` | `#8fdc8f` | contribution squares — and nothing else |

Folder gradients are hard-coded hex inside `FolderIcon.tsx` (three of them per
folder: back panel, tab, flap) because they are a single object's shading, not
theme values. Everything else goes through a token.

## Type

| Face | Use | Why |
|---|---|---|
| **Endless** 400 | the site's face: title, page names, the palette | Kaleb's own face, supplied for this site. 94 codepoints — ASCII only, so nothing set in it uses an em dash, a curly quote or an ellipsis. |
| **Fragment Mono** 400 | measurement only: the hour, contribution count, photograph captions | data and timestamps, never prose. |

Self-hosted: Endless from `public/fonts/`, Fragment Mono through `@fontsource`.
No external font host at runtime.

Spectral is still installed for pages that want a reading voice, but the desk and
the current page set are all Endless. There is almost no text left for a second
face to do.

## Materials and motion

- **Film grain** at 15% soft-light over everything, and a vignette *under* the
  furniture so the corners go quiet without dimming words.
- **Fireflies**: 14 amber specks drifting up-left on 26–48s loops. The only
  ambient motion on the desk; stops entirely under `prefers-reduced-motion`.
- **Breeze**: pointer position tilts the folder and shifts it up to 2.4px.
  Smoothed at 6% per frame; off for reduced motion.
- **The folder**: manila, not glass. One silhouette — a tab standing proud on the
  left, a body below it, a flap hinged along its bottom edge that swings to
  `rotateX(-34deg)` on hover and lets a paper sheet lift out. Emblem printed on
  the flap, because there is no label. A blurred contact shadow sits under it so
  it rests on the desk instead of floating over it.
- **The pointer** is a 1990s arrow drawn pixel by pixel in `public/cursors/`
  (11×19 and 13×18, plus 2× for retina via `image-set`), with a pointing hand over
  anything pressable.
- **The window** on `/` is a hotspot mapped to the pixel: `useCoverBox` computes
  where an `object-fit: cover` image lands, so the door sits on the real lit
  window at 67.5% / 35.4% of the photograph at any viewport shape. Nothing is
  drawn on it — no glow, no label, only a hairline ring on hover.
- **The chase light** on `/code`: one 11s sweep every 18s across the year grid,
  so "now" is visible without reading a label.

## Composition

**Desktop (`≥900px`, `/`)**: fixed night photograph; two lines of text — the title
top-left, the hour and the `⌘K` keytop-right; four manila folders in two aligned
rows (7% / 33% / 58% across, 17% and 57% down) carrying drawn emblems instead of
names; the lit window as the way to About. No dock, no footer, no scrollbar
(`html.desk-locked`).

**Mobile (`<900px`)**: the sunset photograph, full bleed, not dimmed. The same two
lines of text. Four emblems printed along the dark foot of the photograph. No
cards, no bar, no scroll.

**Pages** keep the night photograph behind, dimmed and slightly blurred, so you
never quite leave the room. Each page carries exactly two pieces of interface:
the way back, and its name.

**Photography** is the exception to the page column: square tiles butted together
with no gaps, no borders, no rounding, capped at 1280px so no photograph is ever
shown larger than its source.

## Rules

1. The desk carries two lines of text. Anything else on it is an object or a
   drawing.
2. Emblems name the folders. Never add labels back.
3. Paper, not glass. Cards are not furniture.
4. Depth is an offset plus a blur, plus a contact shadow. A zero-offset halo is
   decoration.
5. Text on the photograph sits at white/72 or above — measured 6.5:1 at worst.
6. Nothing is claimed that isn't true — see `ASSETS.md` for every raster.
