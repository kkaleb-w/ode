/**
 * The desk. Every folder on the wallpaper is one entry here.
 * `peek` is what slides out of the folder when the lid lifts: either a
 * photograph, a small drawn figure, or a line of verse.
 */
export type FolderKey = "photography" | "code" | "rosaria" | "about";

export interface DeskFolder {
  key: FolderKey;
  /** Paper label. One word, lowercase. */
  label: string;
  to: string;
  accent: string;
  /** One line that peeks out with the lid. Short on purpose. */
  peek: string;
  peekKind: "photo" | "graph" | "rosary" | "window";
  /** Where it was left on the desk: [left, top] in viewport %. */
  left: string;
  top: string;
  /** Degrees of rest rotation, for a desk a person actually uses. */
  tilt: number;
}

export const DESK: DeskFolder[] = [
  {
    key: "photography",
    label: "photography",
    to: "/photography",
    accent: "#f5a623",
    peek: "only one frame came out",
    peekKind: "photo",
    left: "6.5%",
    top: "24%",
    tilt: -1.6,
  },
  {
    key: "code",
    label: "code",
    to: "/code",
    accent: "#8fdc8f",
    peek: "everything I have written",
    peekKind: "graph",
    left: "34%",
    top: "9%",
    tilt: 1.1,
  },
  {
    key: "rosaria",
    label: "rosaria",
    to: "/rosaria",
    accent: "#d9b8ff",
    peek: "the one I still use",
    peekKind: "rosary",
    left: "9%",
    top: "60%",
    tilt: 1.9,
  },
  {
    key: "about",
    label: "about",
    to: "/about",
    accent: "#e9e4da",
    peek: "who left the light on",
    peekKind: "window",
    left: "58%",
    top: "62%",
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
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}
