import { useEffect, useState } from "react";

/** The visitor's local hour, refreshed on the minute. */
export function useClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 20_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function formatHour(d: Date): string {
  let h = d.getHours() % 12;
  if (h === 0) h = 12;
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = d.getHours() < 12 ? "am" : "pm";
  return `${h}:${m} ${ampm}`;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** True once the first paint has settled — used to let the desk breathe in. */
export function useSettled(delay = 120): boolean {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setSettled(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);
  return settled;
}

/** Normalised pointer position (-1..1 on each axis) for the breeze. */
export function useBreeze(enable: boolean): { x: number; y: number } {
  const [p, setP] = useState({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (!enable || reduced) return;
    let raf = 0;
    let target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
      if (!raf) raf = window.requestAnimationFrame(tick);
    };
    let cur = { x: 0, y: 0 };
    const tick = () => {
      cur = { x: cur.x + (target.x - cur.x) * 0.06, y: cur.y + (target.y - cur.y) * 0.06 };
      setP(cur);
      if (Math.abs(target.x - cur.x) > 0.001 || Math.abs(target.y - cur.y) > 0.001) {
        raf = window.requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [enable, reduced]);
  return p;
}
