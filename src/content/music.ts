/**
 * What the pill plays.
 *
 * `src` points into `public/audio/`, which is deliberately **not committed** to
 * the repository — see `scripts/fetch-music.sh`. Drop the files in and they play;
 * leave them out and the pill says so instead of failing silently.
 *
 * `art` is optional on purpose. If the file is not there the pill draws its own
 * tile from `accent`, so the player never shows a broken image and never ships
 * somebody else's cover art.
 */
export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  art?: string;
  accent: string;
  /** The line the row carries when nothing is playing yet. */
  note?: string;
}

export const TRACKS: Track[] = [
  {
    id: "lucky-enough",
    title: "Lucky Enough (Poem)",
    artist: "Zach Bryan",
    src: "/audio/lucky-enough.mp3",
    accent: "#c8a24a",
    note: "a poem, to open with",
  },
  {
    id: "fear-and-fridays",
    title: "Fear and Friday's (Poem)",
    artist: "Zach Bryan",
    src: "/audio/fear-and-fridays.mp3",
    accent: "#b4763f",
    note: "a poem",
  },
  {
    id: "something-in-the-orange",
    title: "Something in the Orange",
    artist: "Zach Bryan",
    src: "/audio/something-in-the-orange.mp3",
    accent: "#d9822b",
  },
  {
    id: "sun-to-me",
    title: "Sun to Me",
    artist: "Zach Bryan",
    src: "/audio/sun-to-me.mp3",
    accent: "#d9a441",
  },
  {
    id: "i-remember-everything",
    title: "I Remember Everything",
    artist: "Zach Bryan & Kacey Musgraves",
    src: "/audio/i-remember-everything.mp3",
    accent: "#9a6fa0",
  },
];

export const slugOf = (t: Track) => t.src.split("/").pop() ?? t.id;

/**
 * Where the album tile comes from.
 *
 * `scripts/install-audio.sh` lifts any embedded cover art out of the file it is
 * given and writes it next to the mp3, so the tile is simply the track's own path
 * with a .jpg on the end. If that file is not there, nothing breaks — the player
 * falls back to a tile drawn from `accent`, which is why this can be a guess.
 */
export const artSrc = (t: Track) => t.art ?? t.src.replace(/\.[a-z0-9]+$/i, ".jpg");
