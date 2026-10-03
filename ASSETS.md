# Assets — where every raster came from

Nothing here is stock and nothing is generated. If a frame is empty, it says so.

| File | Origin | Notes |
|---|---|---|
| `public/fonts/Endless.ttf` | **Endless**, supplied by Kaleb (Behance download) | 97 glyphs / 94 codepoints; A–Z, a–z, 0–9, ASCII punctuation only — no em dash, curly quotes, ellipsis or accents, so copy set in it avoids those characters |
| `public/night.jpg` | **Kaleb Wright's own photograph**, supplied by him for this site | 1280×853. The site's ground. The lit window at 67.5% / 35.4% is the About door. |
| `public/rosaria/01-home.webp` | Screenshot of the live Rosaria app (`rosaria.cc`), captured 2026-10-01 | resized to 585×1266, webp q82 |
| `public/rosaria/02-pray.webp` | Screenshot of the live Rosaria app, captured 2026-10-01 | resized to 585×1266, webp q82 |
| `public/rosaria/03-praying.webp` | Screenshot of the live Rosaria app, captured 2026-10-01 | resized to 585×1266, webp q82 |

## Not yet real, and marked as such in the UI

- **Photography, frames 02–06** — undeveloped. The page states "1 of 6
  developed" and prints an empty frame with a grease-pencil mark rather than
  faking a photograph. Add real ones as described in `src/content/photography.ts`.
- **The contribution field's peek figure** in the code folder is a drawn
  miniature, not a chart of real data; the real numbers come from the live
  GitHub API on `/code`.

## Live data

`/code` fetches from `github-contributions-api.jogruber.de` and
`api.github.com/users/kkaleb-w/repos`, and falls back to
`src/content/*.snapshot.json` (captured 2026-10-03) if either is unreachable.
