import { useMemo } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Two layers, deliberately split:
 *  - the vignette sits UNDER the furniture, so the corners of the photograph go
 *    quiet without dimming the words that live in them;
 *  - the grain sits OVER everything, low opacity, so the desk reads as one
 *    photograph rather than a UI laid on top of one.
 * Decorative only; the motes stop for reduced motion.
 */
export function Grain() {
  const reduced = usePrefersReducedMotion();

  const motes = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: (i * 37 + 11) % 100,
        top: (i * 53 + 7) % 100,
        size: 1 + ((i * 7) % 3) * 0.6,
        dur: 26 + ((i * 13) % 22),
        delay: -(i * 4.5),
        drift: 30 + ((i * 19) % 60),
      })),
    [],
  );

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_92%_at_70%_44%,transparent_38%,rgba(3,4,7,0.55)_100%)]" />
      </div>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        <div className="grain absolute inset-0 opacity-[0.15] mix-blend-soft-light" />
        {!reduced &&
          motes.map((m) => (
            <span
              key={m.id}
              className="mote absolute rounded-full bg-amber/40 shadow-[0_0_6px_rgba(245,166,35,0.5)]"
              style={{
                left: `${m.left}%`,
                top: `${m.top}%`,
                width: `${m.size}px`,
                height: `${m.size}px`,
                animationDuration: `${m.dur}s`,
                animationDelay: `${m.delay}s`,
                ["--drift" as string]: `${m.drift}px`,
              }}
            />
          ))}
      </div>
    </>
  );
}
