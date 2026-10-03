/**
 * Photography.
 *
 * Each frame carries its own pixel size, because the gallery lays the pictures
 * out at their real aspect ratio and fits them together by solving for the row
 * height that makes each row exactly fill the width. Nothing is cropped and
 * nothing is squared off. `w`/`h` are the source dimensions — swap in a
 * different file and update them to match, or the rows will not tile.
 *
 * To add your own: drop the file in `public/photos/`, set `src`, `w`, `h` and
 * `developed`. `caption` is the label that appears along the bottom edge of the
 * picture on hover.
 */
export interface Frame {
  id: string;
  /** Shown along the bottom edge of the picture on hover. */
  caption: string;
  src: string;
  /** Source pixel dimensions. The layout needs the ratio, not the size. */
  w: number;
  h: number;
  developed: boolean;
}

export const ROLL_01: Frame[] = [
  { id: "01", caption: "the window left on", src: "/night.jpg", w: 1280, h: 853, developed: true },
  { id: "02", caption: "untitled", src: "", w: 1280, h: 853, developed: false },
  { id: "03", caption: "untitled", src: "", w: 1280, h: 853, developed: false },
  { id: "04", caption: "untitled", src: "", w: 853, h: 1280, developed: false },
  { id: "05", caption: "untitled", src: "", w: 853, h: 1280, developed: false },
  { id: "06", caption: "untitled", src: "", w: 1280, h: 853, developed: false },
];
