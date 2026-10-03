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

/**
 * The wind and the pointer live in `src/lib/air.ts`, deliberately outside React:
 * they change every frame, and the consumers (folders, fireflies, cursor) write
 * straight to the DOM through `subscribeAir` instead of re-rendering sixty times
 * a second.
 */
