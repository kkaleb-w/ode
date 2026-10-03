# Assets — where every raster came from

Nothing here is stock and nothing is generated. If a frame is empty, it says so.

| File | Origin | Notes |
|---|---|---|
| `public/night.jpg` | **Kaleb Wright's own photograph**, supplied by him for this site | 1280×853. The desktop ground. |
| `public/sunset.jpg` | **Kaleb Wright's own photograph**, supplied by him for this site | 960×1280, portrait. The mobile wallpaper. |
| `public/fonts/Endless.ttf` | **Endless**, supplied by Kaleb (Behance download) | 97 glyphs / 94 codepoints; A–Z, a–z, 0–9, ASCII punctuation only — no em dash, curly quotes, ellipsis or accents, so copy set in it avoids those characters |
| `public/rosaria/01-home.webp` | Screenshot of the live Rosaria app (`rosaria.cc`), captured 2026-10-01 | resized to 585×1266, webp q82 |
| `public/rosaria/02-pray.webp` | Screenshot of the live Rosaria app, captured 2026-10-01 | resized to 585×1266, webp q82 |
| `public/rosaria/03-praying.webp` | Screenshot of the live Rosaria app, captured 2026-10-01 | resized to 585×1266, webp q82 |

## Not yet real, and marked as such in the UI

- **Photography, frames 02–06** — undeveloped. The page shows an empty square
  with the grease-pencil ring you draw on a strip, rather than faking a
  photograph. Add real ones as described in `src/content/photography.ts`.

## Live data

`/code` fetches from `github-contributions-api.jogruber.de` and
`api.github.com/users/kkaleb-w/repos`, and falls back to
`src/content/*.snapshot.json` (captured 2026-10-03) if either is unreachable.
