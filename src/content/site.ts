/**
 * The desk. Every folder on the wallpaper is one entry here.
 *
 * There is no text on a folder any more. Each one carries a drawn emblem
 * instead — the emblem is the label. `name` exists for screen readers and for
 * the command palette, never for the wallpaper.
 */
export type FolderKey = "photography" | "code" | "rosaria" | "about";

export interface DeskFolder {
  key: FolderKey;
  /** Spoken name. Not rendered on the desk. */
  name: string;
  to: string;
  /** Where it was left on the desk: viewport %. */
  left: string;
  top: string;
  /** Degrees of rest rotation, for a desk a person actually uses. */
  tilt: number;
}

export const DESK: DeskFolder[] = [
  { key: "photography", name: "photography", to: "/photography", left: "7%", top: "17%", tilt: -1.6 },
  { key: "code", name: "code", to: "/code", left: "33%", top: "17%", tilt: 1.1 },
  { key: "rosaria", name: "rosaria", to: "/rosaria", left: "7%", top: "57%", tilt: 1.9 },
  { key: "about", name: "about", to: "/about", left: "58%", top: "57%", tilt: -2.2 },
];

export const LINKS = {
  github: "https://github.com/kkaleb-w",
  githubUser: "kkaleb-w",
  rosariaRepo: "https://github.com/kkaleb-w/Rosaria",
  rosaria: "https://rosaria.cc",
  email: "kalebrwright@gmail.com",
};

/** The hour, said plainly. The desk is a place, not a host. */
export function greeting(hour: number): string {
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}
