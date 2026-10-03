/**
 * Photography. Roll 01 is one real photograph (the wallpaper frame) and five
 * frames that have not been developed yet. Nothing here is a stock image and
 * nothing pretends to be a photograph Kaleb did not take.
 *
 * To add your own: drop the file in `public/photos/`, then set `src` and
 * `developed: true` for that frame. Order is the contact sheet order.
 */
export interface Frame {
  id: string;
  /** Caption, read as the strip caption. */
  caption: string;
  place: string;
  /** ISO-ish stamp, printed in the strip margin. */
  stamp: string;
  src: string;
  developed: boolean;
  /** Lens / body note, printed in the margin like a real contact sheet. */
  note: string;
}

export const ROLL_01: Frame[] = [
  {
    id: "01",
    caption: "the window left on",
    place: "somewhere out past the last streetlight",
    stamp: "2026 · 21:04",
    src: "/night.jpg",
    developed: true,
    note: "35mm · pushed one stop",
  },
  {
    id: "02",
    caption: "undeveloped",
    place: "—",
    stamp: "",
    src: "",
    developed: false,
    note: "frame 02",
  },
  {
    id: "03",
    caption: "undeveloped",
    place: "—",
    stamp: "",
    src: "",
    developed: false,
    note: "frame 03",
  },
  {
    id: "04",
    caption: "undeveloped",
    place: "—",
    stamp: "",
    src: "",
    developed: false,
    note: "frame 04",
  },
  {
    id: "05",
    caption: "undeveloped",
    place: "—",
    stamp: "",
    src: "",
    developed: false,
    note: "frame 05",
  },
  {
    id: "06",
    caption: "undeveloped",
    place: "—",
    stamp: "",
    src: "",
    developed: false,
    note: "frame 06",
  },
];
