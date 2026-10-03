/**
 * The air in the room, and where the pointer is.
 *
 * One engine for the whole app, deliberately outside React: it runs at frame
 * rate, and anything that re-renders sixty times a second to move four folders
 * is a cost with no upside. Consumers subscribe and write straight to the DOM —
 * call the returned function when they unmount.
 *
 * Two forces act on the desk:
 *   lean — a steady, gentle pull toward where the pointer is
 *   gust — the wind. A draught never arrives as one long shove. It comes as a
 *          short train of pushes — "br br brr", each weaker or stronger than the
 *          last — and then nothing for a while. All of it is slight on purpose;
 *          the amplitude multipliers live at the consumers, not here.
 */
export interface Air {
  /** Exact pointer position, un-smoothed. */
  px: number;
  py: number;
  /** Smoothed lean from the pointer, -1..1 on each axis. */
  leanX: number;
  leanY: number;
  /** The wind. Signed, -1..1, zero most of the time. */
  gust: number;
  /** False until a real pointer has been seen. */
  seen: boolean;
}

const air: Air = { px: -200, py: -200, leanX: 0, leanY: 0, gust: 0, seen: false };

type Listener = (a: Air) => void;
const listeners = new Set<Listener>();
let running = false;

export function getAir(): Air {
  return air;
}

export function subscribeAir(fn: Listener): () => void {
  listeners.add(fn);
  start();
  return () => {
    listeners.delete(fn);
  };
}

/** How long the air stays still between trains of pushes. */
const REST_MIN = 3400;
const REST_SPAN = 5200;

function start() {
  if (running || typeof window === "undefined") return;
  running = true;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let last = performance.now();
  let leanX = 0;
  let leanY = 0;

  // the pulse train
  let gust = 0;
  let target = 0;
  let dir = 1;
  let pulsesLeft = 0;
  let pulseFor = 0;
  let gapFor = 0;
  let restFor = REST_MIN + Math.random() * REST_SPAN;

  const onMove = (e: PointerEvent) => {
    air.px = e.clientX;
    air.py = e.clientY;
    air.seen = true;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (reduced.matches) {
      leanX = 0;
      leanY = 0;
      gust = 0;
      target = 0;
    } else {
      const tx = (air.px / window.innerWidth) * 2 - 1;
      const ty = (air.py / window.innerHeight) * 2 - 1;
      leanX += (tx - leanX) * Math.min(1, dt * 4);
      leanY += (ty - leanY) * Math.min(1, dt * 4);

      // begin the next push in the train
      if (pulsesLeft > 0 && pulseFor <= 0 && gapFor <= 0) {
        pulsesLeft--;
        target = dir * (0.42 + Math.random() * 0.58);
        pulseFor = 120 + Math.random() * 170;
      }

      if (pulseFor > 0) {
        pulseFor -= dt * 1000;
        if (pulseFor <= 0) {
          target = 0;
          gapFor = 70 + Math.random() * 150;
        }
      } else if (gapFor > 0) {
        gapFor -= dt * 1000;
        if (gapFor <= 0 && pulsesLeft === 0) {
          restFor = REST_MIN + Math.random() * REST_SPAN;
        }
      } else if (pulsesLeft === 0) {
        restFor -= dt * 1000;
        if (restFor <= 0) {
          pulsesLeft = 2 + Math.floor(Math.random() * 3); // two to four pushes
          dir = Math.random() < 0.5 ? -1 : 1;
        }
      }

      // snappy on the way up, so a push reads as a push and not a swell
      gust += (target - gust) * Math.min(1, dt * 13);
    }

    air.leanX = leanX;
    air.leanY = leanY;
    air.gust = gust;
    for (const fn of listeners) fn(air);
    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
}
