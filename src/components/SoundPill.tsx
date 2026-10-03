import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { TRACKS, type Track } from "@/content/music";
import { attachMusic, getSound, setMuted, setVolume, subscribeSound, unlockSound } from "@/audio/engine";
import { useMedia } from "@/lib/useMedia";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function initials(t: Track): string {
  return t.title
    .replace(/[^A-Za-z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * The album picture.
 *
 * If there is a real cover at `track.art` it is used; otherwise the tile is drawn
 * here from the track's own accent colour. That means the player never shows a
 * broken image, and it never ships somebody else's artwork either.
 */
function AlbumArt({ track, playing }: { track: Track; playing: boolean }) {
  const [broken, setBroken] = useState(false);

  if (track.art && !broken) {
    return (
      <img
        src={track.art}
        alt=""
        className="absolute inset-0 size-full object-cover"
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: `linear-gradient(142deg, ${track.accent} 0%, #1a1613 72%)` }}
    >
      <span className="font-display text-[0.58rem] leading-none tracking-[0.04em] text-white/85">
        {initials(track)}
      </span>
      {playing && (
        <span
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: `inset 0 0 0 1px ${track.accent}` }}
        />
      )}
    </span>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
    >
      {children}
    </button>
  );
}

/**
 * The pill.
 *
 * A black capsule at the foot of the screen. Back, the record, forward, and the
 * volume. Pressing the record is the play button — the thing you want to press is
 * the thing that is playing. The volume bar slides out of the speaker on approach
 * rather than sitting there taking up the width, and on a touch screen, where
 * there is no hover to approach with, it is simply already out.
 */
export function SoundPill() {
  const sound = useSyncExternalStore(subscribeSound, getSound, getSound);
  const canHover = useMedia("(hover: hover)");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const [open, setOpen] = useState(false);

  const el = useRef<HTMLAudioElement>(null);
  const track = TRACKS[index];

  // Browsers only allow audio after a gesture. The first click or keypress
  // anywhere builds the graph, and the room comes up under it.
  useEffect(() => {
    const go = () => {
      unlockSound();
      if (el.current) attachMusic(el.current);
    };
    window.addEventListener("pointerdown", go, { once: true });
    window.addEventListener("keydown", go, { once: true });
    return () => {
      window.removeEventListener("pointerdown", go);
      window.removeEventListener("keydown", go);
    };
  }, []);

  // Is the file actually there? Under a dev server a missing path answers 200
  // with HTML, so trust the content type, not the status.
  useEffect(() => {
    let alive = true;
    setMissing(false);
    fetch(track.src, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (alive && !(r.ok && type.startsWith("audio"))) setMissing(true);
      })
      .catch(() => alive && setMissing(true));
    return () => {
      alive = false;
    };
  }, [track.src]);

  const play = useCallback(async () => {
    const a = el.current;
    if (!a) return;
    unlockSound();
    attachMusic(a);
    try {
      await a.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, []);

  const wasPlaying = useRef(false);
  useEffect(() => {
    wasPlaying.current = playing;
  }, [playing]);

  // changing track keeps it playing
  useEffect(() => {
    if (wasPlaying.current) void play();
  }, [track.src, play]);

  const goTo = useCallback((n: number) => {
    setMissing(false);
    setIndex(((n % TRACKS.length) + TRACKS.length) % TRACKS.length);
  }, []);

  const toggle = useCallback(() => {
    const a = el.current;
    if (!a) return;
    if (a.paused) void play();
    else a.pause();
  }, [play]);

  const barOut = open || !canHover;
  const silent = sound.muted || sound.volume === 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-3 md:bottom-6">
      <div className="pointer-events-auto group flex items-center gap-0.5 rounded-full border border-white/10 bg-black/78 px-1.5 py-1.5 shadow-[0_12px_34px_rgba(0,0,0,0.6)] backdrop-blur-md">
        <IconButton label="Previous track" onClick={() => goTo(index - 1)}>
          <SkipBack className="size-[15px]" strokeWidth={1.7} />
        </IconButton>

        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="relative size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/15 transition-transform duration-300 hover:scale-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <AlbumArt track={track} playing={playing} />
          <span
            className="absolute inset-0 grid place-items-center bg-black/45 transition-opacity duration-300"
            style={{ opacity: playing ? 0 : 1 }}
          >
            <svg viewBox="0 0 10 12" className="size-2.5 fill-white/90" aria-hidden>
              <path d="M0 0l10 6-10 6z" />
            </svg>
          </span>
        </button>

        <IconButton label="Next track" onClick={() => goTo(index + 1)}>
          <SkipForward className="size-[15px]" strokeWidth={1.7} />
        </IconButton>

        <span aria-hidden className="mx-1 h-4 w-px bg-white/12" />

        <div
          className="flex items-center"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div
            className="overflow-hidden transition-all duration-400"
            style={{
              width: barOut ? 88 : 0,
              opacity: barOut ? 1 : 0,
              transitionTimingFunction: EASE,
            }}
          >
            <div className="px-2">
              <Slider
                aria-label="Volume"
                value={[Math.round(sound.volume * 100)]}
                onValueChange={(v) => setVolume((v[0] ?? 0) / 100)}
                max={100}
                step={1}
                className="[&_[role=slider]]:size-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white/85"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMuted(!sound.muted)}
            onFocus={() => setOpen(true)}
            aria-label={silent ? "Unmute" : "Mute"}
            className="grid size-8 place-items-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            {silent ? (
              <VolumeX className="size-[15px]" strokeWidth={1.7} />
            ) : (
              <Volume2 className="size-[15px]" strokeWidth={1.7} />
            )}
          </button>
        </div>
      </div>

      {/* the name, only when you reach for the pill — the desk keeps its two lines */}
      <span
        className="pointer-events-none font-mono text-[0.58rem] tracking-[0.14em] lowercase transition-opacity duration-300"
        style={{ color: "rgba(233,228,218,0.5)", opacity: 0 }}
      >
        {missing ? "not downloaded yet" : `${track.title} — ${track.artist}`}
      </span>

      <audio
        ref={el}
        src={track.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setMissing(true);
          setPlaying(false);
        }}
      />
    </div>
  );
}
