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
- **Fireflies**: 34 of them, coming up out of the bottom edge — but not in a
  column. They fan: most head up and outward at 15–58° off vertical, some cross
  almost level, a few climb the whole frame at an angle. Distance is in viewport
  height on both axes, so the fan survives a resize (measured spread: x from
  −17vh to +28vh against y from −1.5vh to −36vh). Each one is a **bare dot with
  no halo and no shadow** that breathes between scale 0.72 and 1.3, and every few
  seconds breaks into a **burst of flickers** — five quick dips inside an 18%
  window of the cycle — before going steady again. Three nested animations, so no
  two cycles line up.
- **The wind**: `src/lib/air.ts`. A steady lean toward the pointer, and a gust
  that arrives as a **train of pushes**, never one shove: two to four pushes of
  differing strength (120–290ms each) separated by 70–220ms, then 3.4–8.6s of
  nothing. Everything about it is slight — measured over 12.8s, the folder's own
  rotation peaked at **0.43°** with a mean push of 0.22°, in three separate pushes
  per burst.
- **The pointer**: the system cursor is hidden and drawn in DOM — a dot at the
  exact position (so aiming and dragging never lose precision) plus a ring that
  trails on a spring: `v += (target − x) · 0.14`, then `v ×= 0.66`. It lagged
  300px behind a 700px flick and settled with a 1px overshoot. It grows to 46px
  over anything pressable, and a gust nudges it 1.5px.
- **The folder**: manila, not glass. One silhouette — a tab standing proud on the
  left, a body below it, a flap hinged along its bottom edge that swings to
  `rotateX(-34deg)` on hover and lets a sheet lift out carrying the page's name
  in Endless. A blurred contact shadow sits under it so it rests on the desk.
- **The chase light** on `/code`: one 11s sweep every 18s across the year grid,
  so "now" is visible without reading a label.
- **Nothing is drawn on the photograph.** No glow, no invented light, and no
  hotspot either: the lit window is not a door any more.

The wind, the swarm and the cursor all read `src/lib/air.ts` and write straight to
the DOM. None of them goes through React state — moving four folders by re-rendering
sixty times a second is a cost with nothing to show for it.

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

**Photography** is the exception to the page column: a justified gallery. Every
row is solved so it fills the full width exactly, at the pictures' own aspect
ratios, with nothing between them and nothing cropped. The last row keeps the
target height and simply stops short of the right edge. Verified at 1440: row 1
three frames at ratio 1.501, 320px tall, summing to exactly 1440 with 0px of gap;
row 2 the two portraits at 0.666 plus one landscape, ragged at 918 of 1440.

## Sound

Everything the room says is synthesised in the browser. There is not one sample in
the repository, which is why there is nothing to license, nothing to load, and
nothing that loops audibly after the second minute.

- **One context, built on the first gesture.** Browsers refuse audio until the
  visitor has done something, so nothing is constructed before that — no suspended
  context sitting around waiting to be scolded. The graph comes up on the first
  click or keypress and the master ramps from zero, so the room fills rather than
  switches on.
- **The wind is driven by the gust envelope itself** — the same numbers that move
  the folders, read every frame in `src/audio/wind.ts`. Three layers, each doing a
  different job: a low body that swells, a narrow resonance that climbs in pitch as
  the push builds, and a hiss that appears only at the top of one. That is why a
  gust sounds like a gust and not like a noise gate opening. Measured correlation
  between the gust and the 200–1200Hz band: **0.79**.
- **The insects are calls, not a recording.** `src/audio/night.ts`. A cricket chirp
  is a broadband click shaped by a sharp resonance — noise through a high-Q bandpass
  — which is how a real one makes its woody tick; seven of them at their own pitch,
  tempo and stereo position, two grasshoppers rasping under a tremolo, and a
  brown-noise bed for a floor. No birds, because birds are dawn. Measured
  correlation with the gust: **0.18** — they are independent, which is what makes
  the field sound alive rather than reactive.
- **Scheduling is against the audio clock**, not a timer, so the crickets keep
  their rhythm when the main thread is busy. Group lengths are randomised per call
  so it never settles into a loop.
- **The player** routes a media element through the master bus, so the volume
  bar moves the songs as well as the room. One `WeakSet` guards against capturing
  an element twice, which is an exception you can only throw once.

## Rules

1. The desk carries two lines of text. Anything else on it is an object or a
   drawing.
2. Emblems name the folders. The sheet inside spells it out on hover. Never add
   a label back to the desk.
3. Paper, not glass. Cards are not furniture.
4. Depth is an offset plus a blur, plus a contact shadow. A zero-offset halo is
   decoration.
5. Text on the photograph sits at white/72 or above — measured 6.5:1 at worst.
6. The photograph is the ground. Nothing is drawn over it.
7. Motion that runs every frame lives in `src/lib/air.ts` and writes to the DOM.
8. Photography is never cropped and never squared. If a frame's layout looks
   wrong, `w`/`h` in `src/content/photography.ts` do not match the file.
9. Sound is synthesised, never sampled. A recording is a licence to check and a
   loop the visitor hears twice.
10. Nothing makes a noise before the visitor has touched the page, and the room
    comes up from silence rather than switching on.
11. The wind and the insect bed are separate voices. If one starts tracking the
    other, the field reads as an effect instead of a place.
