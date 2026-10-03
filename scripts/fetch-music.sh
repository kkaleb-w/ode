#!/usr/bin/env bash
#
# Fetch the tracks listed in src/content/music.ts as mp3 into public/audio/.
#
#   ./scripts/fetch-music.sh                # everything that is missing
#   ./scripts/fetch-music.sh heading-south  # just one
#   ./scripts/fetch-music.sh --list         # what it knows about
#
# WHY THIS NEEDS A COOKIES FILE
# YouTube answers an unauthenticated datacenter IP with "Sign in to confirm you're
# not a bot" — for every player client, including the ones that usually dodge it.
# So the request has to carry the cookies of a signed-in browser:
#
#   put a Netscape-format cookies.txt at ~/cookies.txt
#   or point ODE_COOKIES at wherever yours lives
#
# Anything in public/audio/ is gitignored on purpose — it is somebody else's
# recording, and this repository is public.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/public/audio"
VENV="${ODE_VENV:-/home/ubuntu/.hermes/cache/scratch/audio-venv}"
YTDLP="${YTDLP:-$VENV/bin/yt-dlp}"
COOKIES="${ODE_COOKIES:-$HOME/cookies.txt}"
QUALITY="${ODE_QUALITY:-192K}"

# slug|search query
TRACKS=(
  "lucky-enough|Zach Bryan Lucky Enough poem"
  "fear-and-fridays|Zach Bryan Fear and Fridays poem"
  "something-in-the-orange|Zach Bryan Something in the Orange"
  "heading-south|Zach Bryan Heading South"
  "sun-to-me|Zach Bryan Sun to Me"
  "oklahoma-smokeshow|Zach Bryan Oklahoma Smokeshow"
  "burn-burn-burn|Zach Bryan Burn Burn Burn"
  "pink-skies|Zach Bryan Pink Skies"
)

if [[ "${1:-}" == "--list" ]]; then
  printf '%s\n' "${TRACKS[@]}" | cut -d'|' -f1
  exit 0
fi

if [[ ! -x "$YTDLP" ]]; then
  echo "yt-dlp not found at $YTDLP" >&2
  echo "set YTDLP=/path/to/yt-dlp, or install it: pip install yt-dlp" >&2
  exit 1
fi

COOKIE_ARGS=()
if [[ -f "$COOKIES" ]]; then
  COOKIE_ARGS=(--cookies "$COOKIES")
else
  echo "no cookies file at $COOKIES" >&2
  echo "YouTube will very likely refuse. See the header of this script." >&2
fi

mkdir -p "$OUT"
only=("$@")

for entry in "${TRACKS[@]}"; do
  slug="${entry%%|*}"
  query="${entry#*|}"

  if ((${#only[@]})); then
    wanted=0
    for want in "${only[@]}"; do
      [[ "$want" == "$slug" ]] && wanted=1
    done
    ((wanted)) || continue
  fi

  if [[ -s "$OUT/$slug.mp3" ]]; then
    echo "have  $slug"
    continue
  fi

  echo "fetch $slug"
  if "$YTDLP" \
    "${COOKIE_ARGS[@]}" \
    -x --audio-format mp3 --audio-quality "$QUALITY" \
    --no-playlist --no-warnings --no-overwrites \
    --write-thumbnail --convert-thumbnails jpg \
    --embed-metadata \
    -o "$OUT/$slug.%(ext)s" \
    "ytsearch1:$query"; then
    # yt-dlp names the artwork after the video id or the title; normalise it
    for f in "$OUT"/$slug.*; do
      case "$f" in
        *.jpg) mv -f "$f" "$OUT/$slug.jpg" ;;
      esac
    done
  else
    echo "FAILED $slug (bot wall, or the search found nothing)" >&2
  fi
done

echo
echo "in $OUT:"
ls -la "$OUT" 2>/dev/null | tail -n +2 || true
