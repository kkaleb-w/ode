import { useEffect, useState } from "react";

export function useMedia(query: string, fallback = false): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? fallback : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return matches;
}

/**
 * Where a `object-fit: cover` image actually lands inside its box.
 * The lit window in the wallpaper has to sit over the same pixel no matter
 * how the viewport is shaped, so we do the arithmetic ourselves.
 */
export interface CoverBox {
  offX: number;
  offY: number;
  width: number;
  height: number;
}

export function useCoverBox(ref: React.RefObject<HTMLElement | null>, aspect: number): CoverBox {
  const [box, setBox] = useState<CoverBox>({ offX: 0, offY: 0, width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      const containerAspect = w / h;
      if (containerAspect > aspect) {
        const width = h * aspect;
        setBox({ offX: (w - width) / 2, offY: 0, width, height: h });
      } else {
        const height = w / aspect;
        setBox({ offX: 0, offY: (h - height) / 2, width: w, height });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", measure);
    };
  }, [ref, aspect]);
  return box;
}
