#!/usr/bin/env bash
#
# Wire an audio file into the player, whatever it is called and wherever it is.
#
#   ./scripts/install-audio.sh ~/Downloads/song.m4a
#   ./scripts/install-audio.sh ~/Downloads/song.m4a something-in-the-orange
#   ./scripts/install-audio.sh https://example.com/track.mp3
#   ./scripts/install-audio.sh ~/Music/*.mp3            # a whole folder at once
#
# With no slug it guesses from the filename, so "Zach Bryan - Something In The
# Orange (Official Video).webm" lands on the right track by itself. Anything it
# cannot place is written to public/audio/_unmatched/ and listed at the end
# rather than silently dropped.
#
# It converts whatever you have (m4a, webm, opus, wav, flac, anything ffmpeg
# reads) to mp3, lifts any embedded cover art out as the album tile, and rebuilds
# — because public/ is only copied into dist/ at build time.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/public/audio"
UNMATCHED="$OUT/_unmatched"
QUALITY="${ODE_QUALITY:-192K}"

# slug|title, in the order they appear in src/content/music.ts
TRACKS=(
  "lucky-enough|Lucky Enough"
  "fear-and-fridays|Fear and Friday's"
  "something-in-the-orange|Something in the Orange"
  "heading-south|Heading South"
  "sun-to-me|Sun to Me"
  "oklahoma-smokeshow|Oklahoma Smokeshow"
  "burn-burn-burn|Burn, Burn, Burn"
  "pink-skies|Pink Skies"
)

command -v ffmpeg >/dev/null || { echo "ffmpeg not found" >&2; exit 1; }

# "Zach Bryan - Pink Skies (Lyrics).mp3" -> "zach-bryan-pink-skies-lyrics"
canon() {
  printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -e 's/\.[a-z0-9]*$//' -e "s/['\u2019]//g" \
    | tr -cs 'a-z0-9' '-' \
    | sed -e 's/^-*//' -e 's/-*$//'
}

guess() {
  local c="$1" slug title words w hit
  # exact slug inside the name first
  for entry in "${TRACKS[@]}"; do
    slug="${entry%%|*}"
    case "$c" in *"$slug"*) printf '%s' "$slug"; return 0 ;; esac
  done
  # then every word of the title, in any order
  for entry in "${TRACKS[@]}"; do
    slug="${entry%%|*}"; title="${entry#*|}"
    hit=1
    while read -r w; do
      [ -z "$w" ] && continue
      case "$c" in *"$w"*) ;; *) hit=0 ;; esac
    done < <(printf '%s' "$(canon "$title")" | tr '-' '\n')
    if [ "$hit" = 1 ]; then printf '%s' "$slug"; return 0; fi
  done
  return 1
}

install_one() {
  local src="$1" slug="${2:-}" base canon_name tmp
  base="$(basename "$src")"
  if [ -z "$slug" ]; then
    canon_name="$(canon "$base")"
    if ! slug="$(guess "$canon_name")"; then
      mkdir -p "$UNMATCHED"
      mv -f "$src" "$UNMATCHED/"
      echo "  ?  $base  ->  could not place it, left in public/audio/_unmatched/"
      return 0
    fi
  fi
  mkdir -p "$OUT"
  tmp="$(mktemp -t ode-audio-XXXXXX).mp3"
  ffmpeg -hide_banner -loglevel error -i "$src" -vn -codec:a libmp3lame -b:a "$QUALITY" -y "$tmp"
  mv -f "$tmp" "$OUT/$slug.mp3"
  # embedded cover art, if the file has any
  if ffmpeg -hide_banner -loglevel error -i "$src" -an -map 0:v -c:v copy -y "$OUT/$slug.jpg" 2>/dev/null; then
    echo "  +  $base  ->  $slug.mp3 (+ cover art)"
  else
    rm -f "$OUT/$slug.jpg"
    echo "  +  $base  ->  $slug.mp3"
  fi
  [ "$src" != "$OUT/$slug.mp3" ] && rm -f "$src" 2>/dev/null || true
}

sources=()
for arg in "$@"; do
  case "$arg" in
    http://*|https://*)
      dl="$(mktemp -t ode-dl-XXXXXX)"
      echo "  v  downloading $arg"
      curl -fsSL --retry 2 -o "$dl" "$arg" || { echo "  !  download failed: $arg" >&2; rm -f "$dl"; continue; }
      sources+=("$dl")
      ;;
    *) sources+=("$arg") ;;
  esac
done

[ ${#sources[@]} -gt 0 ] || { echo "usage: $0 <file-or-url> [...]" >&2; exit 1; }

# a slug given as the second argument applies to a single input only
if [ ${#sources[@]} -eq 1 ] && [ $# -eq 2 ] && [ -n "${2:-}" ] && [[ " ${TRACKS[*]} " == *" $2 "* ]]; then
  install_one "${sources[0]}" "$2"
else
  for s in "${sources[@]}"; do install_one "$s"; done
fi

echo
echo "in $OUT:"
ls -1 "$OUT" 2>/dev/null | sed 's/^/  /'
if [ -d "$UNMATCHED" ]; then
  echo
  echo "unplaced (rename or pass a slug):"
  ls -1 "$UNMATCHED" 2>/dev/null | sed 's/^/  /'
fi

echo
echo "rebuilding so they are served..."
(cd "$ROOT" && npm run build >/dev/null 2>&1) && echo "done. reload the page and press play."
