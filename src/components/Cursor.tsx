import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { getAir, subscribeAir } from "@/lib/air";

/**
 * The pointer, drawn.
 *
 * Two parts, because one part cannot do both jobs. A dot sits exactly where the
 * pointer is, so aiming and dragging never lose precision. A ring trails behind
 * it on a spring — pushed toward the pointer, overshooting slightly, settling —
 * which is the whole of the feel: you drag it, it follows.
 *
 * Over anything pressable the ring grows and brightens. A gust pushes it a few
 * pixels, because the wind moves everything else too.
 *
 * The system cursor is hidden in index.css. On a coarse pointer this renders
 * nothing and the CSS hands the native cursor back.
 */
export function Cursor() {
  const reduced = usePrefersReducedMotion();
  const dot = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const [coarse, setCoarse] = useState(false);
  const [hot, setHot] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const on = () => setCoarse(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (coarse) return;

    const air = getAir();
    let x = air.px;
    let y = air.py;
    let vx = 0;
    let vy = 0;
    let seen = false;

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      setHot(!!t?.closest?.("a, button, [role='button'], input, select, textarea, label, summary"));
    };

    const stop = subscribeAir((a) => {
      const tx = a.px;
      const ty = a.py;

      if (!seen && a.seen) {
        x = tx;
        y = ty;
        seen = true;
        setVisible(true);
      }

      if (reduced) {
        x = tx;
        y = ty;
      } else {
        // spring: accelerate toward the pointer, then bleed the velocity off.
        // k small enough to lag behind, damping high enough that it settles
        // instead of circling the thing you are trying to click.
        vx = (vx + (tx - x) * 0.14) * 0.66;
        vy = (vy + (ty - y) * 0.14) * 0.66;
        x += vx;
        y += vy;
      }

      const g = a.gust * 1.5;
      const d = dot.current;
      const r = ring.current;
      if (d) d.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      if (r) r.style.transform = `translate3d(${x + g}px, ${y}px, 0)`;
    });

    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerleave", () => setVisible(false), { passive: true });
    return () => {
      stop();
      window.removeEventListener("pointerover", onOver);
    };
  }, [coarse, reduced]);

  if (coarse) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms linear" }}
    >
      {/* the ring: trails, grows over anything pressable */}
      <span
        ref={ring}
        className="absolute top-0 left-0 block rounded-full border transition-[width,height,margin,border-color,background-color] duration-200 ease-out"
        style={{
          width: hot ? 46 : 26,
          height: hot ? 46 : 26,
          marginLeft: hot ? -23 : -13,
          marginTop: hot ? -23 : -13,
          borderWidth: 1.5,
          borderColor: hot ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.38)",
          backgroundColor: hot ? "rgba(255,255,255,0.08)" : "transparent",
        }}
      />
      {/* the dot: exact, so precision is never given up for the effect */}
      <span
        ref={dot}
        className="absolute top-0 left-0 block size-[5px] rounded-full bg-white shadow-[0_0_6px_rgba(0,0,0,0.75)]"
        style={{ marginLeft: -2.5, marginTop: -2.5 }}
      />
    </div>
  );
}
