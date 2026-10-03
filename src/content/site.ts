/**
 * The desk. Every folder on the wallpaper is one entry here.
 * `peek` is what slides out of the folder when the lid lifts: either a
 * photograph, a small drawn figure, or a line of verse.
 */
export type FolderKey = "photography" | "code" | "rosaria" | "about";

export interface DeskFolder {
  key: FolderKey;
  /** Paper label, set in mono. Two lines, like a real folder tab. */
  label: string;
  sub: string;
  to: string;
  accent: string;
  /** One line that peeks out with the lid. */
  peek: string;
  peekKind: "photo" | "graph" | "rosary" | "window";
  /** Grid placement in the desktop cluster: col / row. */
  col: number;
  row: number;
  /** Degrees of rest rotation of the label, for a desk that a person uses. */
  tilt: number;
}

export const DESK: DeskFolder[] = [
  {
    key: "photography",
    label: "photography",
    sub: "roll 01 · night",
    to: "/photography",
    accent: "#f5a623",
    peek: "one frame developed, five still in the dark",
    peekKind: "photo",
    col: 1,
    row: 1,
    tilt: -1.6,
  },
  {
    key: "code",
    label: "code",
    sub: "kkaleb-w",
    to: "/code",
    accent: "#8fdc8f",
    peek: "152 times this year, and counting",
    peekKind: "graph",
    col: 2,
    row: 1,
    tilt: 1.1,
  },
  {
    key: "rosaria",
    label: "rosaria",
    sub: "a rosary, slowly",
    to: "/rosaria",
    accent: "#d9b8ff",
    peek: "the one that is still being made",
    peekKind: "rosary",
    col: 1,
    row: 2,
    tilt: 1.9,
  },
  {
    key: "about",
    label: "about me",
    sub: "who left the light on",
    to: "/about",
    accent: "#e9e4da",
    peek: "a person, and what he is reading",
    peekKind: "window",
    col: 2,
    row: 2,
    tilt: -2.2,
  },
];

/**
 * Verse. Every line is a real, short, attributed quotation. The page is an ode,
 * so it borrows other people's odes rather than writing its own.
 */
export interface Verse {
  text: string;
  source: string;
}

export const VERSES: Verse[] = [
  { text: "Season of mists and mellow fruitfulness.", source: "Keats, To Autumn" },
  { text: "Heard melodies are sweet, but those unheard are sweeter.", source: "Keats, Ode on a Grecian Urn" },
  { text: "and there's a light on in the kitchen — somebody's still awake", source: "after Zach Bryan" },
  { text: "Already with thee! tender is the night.", source: "Keats, Ode to a Nightingale" },
  { text: "we'll be alright, kid.", source: "after Zach Bryan" },
  { text: "Beauty is truth, truth beauty,—that is all ye know on earth, and all ye need to know.", source: "Keats, Ode on a Grecian Urn" },
];

export const LINKS = {
  github: "https://github.com/kkaleb-w",
  githubUser: "kkaleb-w",
  rosariaRepo: "https://github.com/kkaleb-w/Rosaria",
  rosaria: "https://rosaria.cc",
  email: "kalebrwright@gmail.com",
};

/**
 * The hour decides the sentence. The photograph is always night, so the desk
 * answers by admitting what time it is where you are.
 */
export function greeting(hour: number): string {
  if (hour < 4) return "it is late where you are";
  if (hour < 6) return "nearly morning there";
  if (hour < 12) return "morning, still dark here";
  if (hour < 17) return "afternoon on your street";
  if (hour < 21) return "evening where you are";
  return "night again";
}
