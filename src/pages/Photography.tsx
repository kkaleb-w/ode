import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { PageShell } from "@/components/PageShell";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ROLL_01, type Frame } from "@/content/photography";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Tile {
  frame: Frame;
  ar: number;
}
interface Row {
  tiles: Tile[];
  height: number;
}

/**
 * A justified gallery: every row is solved so it fills the full width exactly,
 * with the pictures kept at their own aspect ratio and nothing between them.
 * Nothing is cropped and nothing is squared off.
 *
 * `target` is the height a row would like to be. Walk the frames adding aspect
 * ratios; once the ratio sum implies a row shorter than the target, close it and
 * let the height be whatever fills the width. The last row keeps the target
 * height and simply does not reach the right edge — that ragged tail is what
 * tells you these are their own shapes rather than one crop repeated.
 */
function justify(frames: Frame[], width: number, target: number): Row[] {
  if (width <= 0) return [];
  const rows: Row[] = [];
  let tiles: Tile[] = [];
  let sum = 0;

  for (const frame of frames) {
    const ar = frame.w / frame.h;
    tiles.push({ frame, ar });
    sum += ar;
    const implied = width / sum;
    if (implied <= target) {
      rows.push({ tiles, height: implied });
      tiles = [];
      sum = 0;
    }
  }
  if (tiles.length) rows.push({ tiles, height: target });
  return rows;
}

export default function Photography() {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [open, setOpen] = useState<Frame | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const target = useMemo(() => {
    const vh = typeof window === "undefined" ? 900 : window.innerHeight;
    return Math.max(150, Math.min(width * 0.34, vh * 0.36, 420));
  }, [width]);

  const rows = useMemo(() => justify(ROLL_01, width, target), [width, target]);
  const lastIndex = rows.length - 1;

  return (
    <PageShell title="photography" bleed>
      <div ref={wrap} className="w-full">
        {rows.map((row, ri) => {
          const sum = row.tiles.reduce((a, t) => a + t.ar, 0);
          const ragged = ri === lastIndex && sum * row.height < width - 1;
          return (
            <div key={ri} className="flex w-full items-stretch" style={{ height: row.height }}>
              {row.tiles.map((tile, ti) => {
                const f = tile.frame;
                return (
                  <motion.figure
                    key={f.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.05 + (ri * 3 + ti) * 0.04, ease: EASE }}
                    className="group relative hover:z-10"
                    style={
                      ragged ? { flex: "none", width: row.height * tile.ar } : { flex: `${tile.ar} 0 0` }
                    }
                  >
                    {f.developed ? (
                      <button
                        type="button"
                        onClick={() => setOpen(f)}
                        aria-label={`Open ${f.caption}`}
                        className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-inset"
                      >
                        <img
                          src={f.src}
                          alt={f.caption}
                          loading="lazy"
                          decoding="async"
                          className="block h-full w-full object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] group-hover:rotate-[5deg]"
                        />
                      </button>
                    ) : (
                      /* nothing in it yet, and the page says so by showing
                         nothing: a dark frame with the grease-pencil ring you
                         draw on a strip so you can find it again */
                      <span className="absolute inset-0 bg-[#07080b]">
                        <svg
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                          className="absolute inset-0 h-full w-full"
                          aria-hidden
                        >
                          <ellipse
                            cx="50"
                            cy="50"
                            rx="30"
                            ry="33"
                            fill="none"
                            stroke="rgba(233,228,218,0.13)"
                            strokeWidth="1"
                            strokeDasharray="6 5"
                            transform="rotate(-5 50 50)"
                          />
                        </svg>
                      </span>
                    )}

                    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-1.5 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3 pt-6 pb-2 font-mono text-[0.6rem] tracking-[0.12em] text-white/0 lowercase transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:text-white/90">
                      {f.caption}
                    </figcaption>
                  </motion.figure>
                );
              })}
            </div>
          );
        })}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent
          className="max-w-[96vw] border-0 bg-[#05060a]/93 p-0 backdrop-blur-sm sm:max-w-[96vw]"
          showCloseButton
        >
          <DialogTitle className="sr-only">{open?.caption ?? "Photograph"}</DialogTitle>
          {open && (
            <figure className="flex flex-col items-center">
              <img
                src={open.src}
                alt={open.caption}
                className="block max-h-[86vh] w-auto max-w-full object-contain"
              />
              <figcaption className="w-full px-4 py-3 font-mono text-[0.62rem] tracking-[0.14em] text-white/70 lowercase">
                {open.caption}
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
