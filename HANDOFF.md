# ode — handoff

State of play, and the things that cost time. Design rationale lives in
`DESIGN.md`; this file is for whoever picks the project up next, including me.

## What it is

A portfolio for Kaleb Wright. The desk at 1am: a full-bleed night photograph as
wallpaper, no scrolling on desktop, manila folders you hover and open. The
photograph is the only image; everything else is drawn.

## How to see it

```bash
cd /home/ubuntu/ode
npm run build                     # -> dist/
npx vite preview --port 4174 --host 127.0.0.1 --strictPort   # serves dist/
~/.local/bin/cloudflared tunnel --url http://127.0.0.1:4174  # public URL
```

`vite preview` serves **`dist/`**, and `public/` is only copied into `dist/` at
build time. Drop a file into `public/` and it is not served until you rebuild —
this catches people out with the audio every time.

A `npm run dev -- --host 0.0.0.0` on port 5173 was left running at one point. Vite
will serve any readable file on the box through `/@fs/`, so do not expose that port
publicly. The AWS security group (`launch-wizard-2`) has no inbound rule for it,
which is the only reason it was harmless.

## Repo

`github.com/kkaleb-w/ode`, branch `main`. Remotes must use the **`git@github.com:`
form** — the HTTPS form fails; the SSH key is already configured.

## Audio

Everything is one `AudioContext`, built on the first gesture (browsers refuse
audio before that) and faded up from silence.

| File | Job |
|---|---|
| `src/audio/engine.ts` | the context, the buses, mute/volume, persist |
| `src/audio/wind.ts` | synthesised wind, driven per-frame by the gust envelope |
| `src/audio/ambience.ts` | the recorded night bed, decoded and looped |
| `src/audio/noise.ts` | white/pink/brown noise buffers |
| `src/lib/air.ts` | pointer lean + the gust pulse train; wind reads this |
| `src/components/SoundPill.tsx` | the player |

Buses: `musicBus` and `ambience` both feed `master`; the volume bar moves `master`,
so it moves everything.

**Tuning constants, and what they measured:**

| Where | Constant | Value | Measured |
|---|---|---|---|
| `ambience.ts` | `TARGET_RMS` | `0.03` | bed lands ~−41 dBFS, ~15dB under a track |
| `Fireflies.tsx` | `DEPTH` | `32` | 288px lower on subpages; container clips, so much more empties the field |
| `FolderIcon.tsx` | sheet rest offset | `translate-y-[40px]` | 40px of travel in 380ms |
| `wind.ts` | gust multipliers | — | corr 0.79 between gust and the 200–1200Hz band |

The bed's gain is **derived from the decoded buffer's RMS**, not hand-picked, so
swapping the recording keeps the level right. The wind stays synthesised on
purpose: no loop can follow a gust that does not repeat.

The ambience file is committed (`public/ambience/night.mp3`). The songs are not —
`public/audio/` is gitignored, because they are commercial recordings. **So the
deployed site has no music and this local one does.** Undecided.

## Music

Fetched from Kaleb's Google Drive ("zach bryan music") with the Composio CLI. The
workflow is saved as the `composio-google-drive` skill — read that rather than
rediscovering `DOWNLOAD_FILE` returning an `s3url` instead of bytes.

To add tracks locally, either script:

```bash
./scripts/install-audio.sh ~/Downloads/song.m4a        # any format, guesses the track
./scripts/fetch-music.sh                               # needs a cookies file
```

`install-audio.sh` converts, lifts embedded cover art out as the album tile
(`artSrc` derives the tile from the mp3 path, so no per-track config), rebuilds,
and parks anything it cannot place in `public/audio/_unmatched/`.

YouTube bot-walls this box's IP for **every** player client — don't burn time on
`--extractor-args` tricks, they all return "Sign in to confirm you're not a bot."

Telegram caps incoming files at 20MB. The FLACs are 20–56MB, which is why three
attempts to send music arrived as nothing.

## Verification recipes

These are the ones that actually caught bugs. All run headless through
`browser_exec` + CDP.

**Occlusion — presence is not visibility.** The folder label bug: the element
existed, `visibility: visible`, right font, right size — and sat *behind the flap*.
Check the topmost element at the label's own points:

```js
const h = document.elementFromPoint(x, y);
const visible = h === label || label.contains(h) || h.contains(label);
```

Sample several points across the box, not just the centre.

**Audio output — tap the destination.** Wrap `AudioContext` at runtime *before* the
gesture (the engine reads `window.AudioContext` lazily) and return an analyser from
the `destination` getter, so all app output runs through it. Then read
`getFloatTimeDomainData` for RMS and `getFloatFrequencyData` for bands. The
`destination` getter lives on `BaseAudioContext.prototype`, not
`AudioContext.prototype` — walk the prototype chain. Used to prove the wind follows
the gust (r = 0.79) and that the volume bar really moves the level.

**Transitions — sample the animated rect, not the inline style.** Inline
`style.transform` is the target and is set instantly; it will happily report the
end state while nothing has moved. Read `getBoundingClientRect()` over time instead.

**A transition needs a committed start.** Setting `transition: none` and the target
in the same frame makes the browser jump to the end. Force a reflow
(`void el.offsetWidth`) in between.

**Headless reports `(hover: none)`**, so hover-gated CSS never fires. Un-gate by
walking `document.styleSheets` and re-injecting every rule inside a hover media
query. To test hover-dependent *logic*, inject a `matchMedia` patch with
`Page.enable` + `Page.addScriptToEvaluateOnNewDocument` — that combination works;
the script without `Page.enable` is silently ignored.

## Gotchas already paid for

- The flap only opens to −48°, which exposes a ~39px band. A name centred on a tall
  sheet cannot fit in that band however the paper is positioned. The name goes at
  the sheet's **top edge**.
- The swarm's height is a **position** (0 on the desk, lower elsewhere), not a reset
  with a remount — a remount needs a fade to hide it, and the fade is what looked
  wrong.
- `lucide-react` v1 dropped brand icons; `GithubMark` is a local SVG.
- shadcn v4 `CommandDialog` does not render the cmdk root — wrap the body in
  `<Command>` or the app throws a store-context `TypeError` and unmounts.
- The album art must be keyed by track id, or a 404 on one track leaves the drawn
  fallback showing for every track after it.
- Mobile: the four emblems span ~324px centred at the bottom, so the pill rides
  above them (`bottom-[calc(env(safe-area-inset-bottom)+5.75rem)]`).
- `public/audio/_unmatched/` is where `install-audio.sh` parks files it cannot
  place; check it rather than assuming a file was ignored.

## Open

1. **Songs on the deployed site** — local-only right now. Commit and deploy, or
   keep the repo clean?
2. **Folder detail** — four folders, four emblems. Does the desk want more?
3. **Photography** — five of six frames are still undeveloped. Real ones go in
   `src/content/photography.ts`, and `w`/`h` must match the actual file or the
   justified rows mis-tile.
4. **Reduced motion** — the global rule still kills the folder flap's feedback
   (fireflies, gust and cursor degrade correctly).
5. **JS is one 566KB chunk.** Code-splitting the heavy routes would help.
6. `night.ts` (the synthesised insects) was deleted when the recording arrived. It
   is in git history if the bed ever needs to go back to being synthetic.
