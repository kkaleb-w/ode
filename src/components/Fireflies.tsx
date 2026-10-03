import { memo, useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { subscribeAir } from "@/lib/air";

/**
 * How much lower the swarm sits on a page that is not the desk, in viewport
 * height. Enough to read as settling rather than a nudge, small enough that the
 * field still fills the lower half of the screen instead of emptying off the
 * bottom of it — the container clips, so anything pushed past the edge is gone.
 */
const DEPTH = 32;

interface Bug {
  left: string;
  tx: string;
  ty: string;
  core: number;
  dur: number;
  delay: number;
  growDur: number;
  flickDur: number;
  hue: string;
}

/** A cheap deterministic hash so the swarm is identical on every load. */
function rand(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Where each one goes.
 *
 * Not a column of risers — they fan out. Most head up and outward at 15-58° off
 * vertical, some cross almost level, and a few climb the whole frame at an angle.
 * Distance is measured in viewport height on both axes so the fan survives a
 * resize: a sideways one travels a fraction of the screen, not a fixed number of
 * pixels.
 */
function heading(i: number): { deg: number; dist: number } {
  const roll = rand(i, 1);
  if (roll < 0.62) return { deg: (rand(i, 2) - 0.5) * 116, dist: 14 + rand(i, 3) * 26 };
  if (roll < 0.86) {
    const side = rand(i, 4) < 0.5 ? -1 : 1;
    return { deg: side * (58 + rand(i, 5) * 40), dist: 12 + rand(i, 6) * 24 };
  }
  return { deg: (rand(i, 7) - 0.5) * 100, dist: 74 + rand(i, 8) * 42 };
}

function makeBugs(): Bug[] {
  return Array.from({ length: 34 }, (_, i) => {
    const { deg, dist } = heading(i);
    const a = (deg * Math.PI) / 180;
    const core = 2.4 + rand(i, 9) * 3.2;
    return {
      left: `${2 + rand(i, 15) * 96}%`,
      // sin across, -cos up: 0° is straight up, past 90° starts to sink
      tx: `${(Math.sin(a) * dist).toFixed(2)}vh`,
      ty: `${(-Math.cos(a) * dist).toFixed(2)}vh`,
      core,
      // slower the further it has to travel
      dur: 17 + dist * 0.34 + rand(i, 10) * 8,
      // negative: every one is already mid-flight on load
      delay: -rand(i, 11) * 36,
      growDur: 2.1 + rand(i, 12) * 2.6,
      flickDur: 3.4 + rand(i, 13) * 4.2,
      hue: rand(i, 14) < 0.35 ? "#ffe066" : "#ffc400",
    };
  });
}

const Swarm = memo(function Swarm({ bugs }: { bugs: Bug[] }) {
  return (
    <>
      {bugs.map((b, i) => (
        <span
          key={i}
          className="ff-travel absolute bottom-0"
          style={{
            left: b.left,
            ["--tx" as string]: b.tx,
            ["--ty" as string]: b.ty,
            ["--dur" as string]: `${b.dur}s`,
            ["--delay" as string]: `${b.delay}s`,
          }}
        >
          <span className="ff-grow block" style={{ ["--grow-dur" as string]: `${b.growDur}s` }}>
            {/* no halo and no shadow — just the insect, at the size it is */}
            <span
              className="ff-flicker block rounded-full"
              style={{
                width: b.core,
                height: b.core,
                marginLeft: -b.core / 2,
                marginTop: -b.core / 2,
                background: `radial-gradient(closest-side, #fff9d4 80%, ${b.hue} 100%)`,
                ["--flick-dur" as string]: `${b.flickDur}s`,
              }}
            />
          </span>
        </span>
      ))}
    </>
  );
});

/**
 * Fireflies.
 *
 * They come up out of the bottom edge, but not all the same way: the swarm fans
 * across the frame, most heading up and outward, some crossing almost level, a
 * few climbing the whole height at an angle. Each one is a bare dot with no halo
 * that breathes between smaller and larger, and every few seconds breaks into a
 * burst of flickers before going steady again.
 *
 * Three nested animations — travel, size, flicker — so no two cycles line up.
 */
export function Fireflies() {
  const reduced = usePrefersReducedMotion();
  const bugs = useMemo(() => makeBugs(), []);
  const { pathname } = useLocation();
  const swarm = useRef<HTMLDivElement>(null);
  const descend = useRef<HTMLDivElement>(null);
  const seen = useRef(false);

  useEffect(() => {
    const el = swarm.current;
    if (!el || reduced) return;
    return subscribeAir((air) => {
      el.style.transform = `translate3d(${(air.gust * 7).toFixed(2)}px, 0, 0)`;
    });
  }, [reduced]);

  /**
   * Where the swarm sits depends on how deep you are.
   *
   * The desk is home, and there the fireflies sit where they sit. Open a page and
   * the whole field settles lower and stays there; come back to the desk and it
   * rises to exactly the place it came from. It is one position that moves, not a
   * reset — so nothing fades, nothing remounts, and the swarm you left is the
   * swarm you come back to, a little lower than it was.
   */
  useEffect(() => {
    const el = descend.current;
    if (!el || reduced) return;
    const first = !seen.current;
    seen.current = true;
    const target = pathname === "/" ? 0 : DEPTH;
    // the first paint is a position, not a journey
    el.style.transition = first ? "none" : "transform 3.6s cubic-bezier(0.45, 0, 0.55, 1)";
    el.style.transform = `translateY(${target}vh)`;
  }, [pathname, reduced]);

  if (reduced) {
    // no travel and no flicker: a few steady lights, scattered up the frame
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        {bugs.slice(0, 10).map((b, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: b.left,
              bottom: `${rand(i, 21) * 48}%`,
              width: b.core,
              height: b.core,
              background: b.hue,
              opacity: 0.55,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <div ref={descend} className="absolute inset-0 will-change-transform">
        <div ref={swarm} className="absolute inset-0 will-change-transform">
          <Swarm bugs={bugs} />
        </div>
      </div>
    </div>
  );
}
