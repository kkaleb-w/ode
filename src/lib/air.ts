/**
 * The air in the room, and where the pointer is.
 *
 * One engine for the whole app, deliberately outside React: it runs at frame
 * rate, and anything that re-renders sixty times a second to move four folders
 * is a cost with no upside. Consumers subscribe and write straight to the DOM —
 * `dispose` when they unmount.
 *
 * Two forces act on the desk:
 *   lean — a steady, gentle pull toward where the pointer is
 *   gust — the wind, which arrives in bursts: a fast push, a short hold, a long
 *          let-go, then nothing for a few seconds
 */
export interface Air {
  /** Exact pointer position, un-smoothed. */
  px: number;
  py: number;
  /** Smoothed lean from the pointer, -1..1 on each axis. */
  leanX: number;
  leanY: number;
  /** A gust, signed, -1..1, zero most of the time. */
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

const REST_MIN = 2600;
const REST_SPAN = 4200;

function start() {
  if (running || typeof window === "undefined") return;
  running = true;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let last = performance.now();
  let phase: "rest" | "attack" | "hold" | "decay" = "rest";
  let sign = 1;
  let until = 900;
  let restFor = REST_MIN + Math.random() * REST_SPAN;
  let gust = 0;
  let leanX = 0;
  let leanY = 0;

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
    } else {
      const tx = (air.px / window.innerWidth) * 2 - 1;
      const ty = (air.py / window.innerHeight) * 2 - 1;
      leanX += (tx - leanX) * Math.min(1, dt * 4);
      leanY += (ty - leanY) * Math.min(1, dt * 4);

      if (phase === "rest") {
        gust += (0 - gust) * Math.min(1, dt * 3);
        restFor -= dt * 1000;
        if (restFor <= 0) {
          phase = "attack";
          sign = Math.random() < 0.5 ? -1 : 1;
          until = 380 + Math.random() * 420;
        }
      } else if (phase === "attack") {
        gust += (sign - gust) * Math.min(1, dt * 7);
        until -= dt * 1000;
        if (until <= 0) {
          phase = "hold";
          until = 320 + Math.random() * 900;
        }
      } else if (phase === "hold") {
        until -= dt * 1000;
        if (until <= 0) {
          phase = "decay";
          until = 900 + Math.random() * 1100;
        }
      } else {
        gust += (0 - gust) * Math.min(1, dt * 1.6);
        until -= dt * 1000;
        if (until <= 0) {
          phase = "rest";
          restFor = REST_MIN + Math.random() * REST_SPAN;
        }
      }
    }

    air.leanX = leanX;
    air.leanY = leanY;
    air.gust = gust;
    for (const fn of listeners) fn(air);
    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
}
