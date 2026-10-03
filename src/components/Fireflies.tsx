import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { subscribeAir } from "@/lib/air";

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
  const [epoch, setEpoch] = useState(0);
  const seen = useRef(pathname);

  useEffect(() => {
    const el = swarm.current;
    if (!el || reduced) return;
    return subscribeAir((air) => {
      el.style.transform = `translate3d(${(air.gust * 7).toFixed(2)}px, 0, 0)`;
    });
  }, [reduced]);

  /**
   * Changing page, the swarm moves.
   *
   * Down when you go deeper into the site, up when you come back to the desk:
   * the fireflies sink away from a page you are leaving and rise back into the
   * one you are returning to. Either way the loop then starts over, so the next
   * page's swarm arrives from the edge it was sent to rather than appearing
   * wherever it happened to be. Five seconds, and nothing happens on the first
   * load because the first load is not a departure from anywhere.
   */
  useEffect(() => {
    const el = descend.current;
    if (!el || reduced) return;
    if (seen.current === pathname) return;
    seen.current = pathname;

    // home is up, everything else is down
    const toHome = pathname === "/";
    const travel = toHome ? "translateY(-78vh)" : "translateY(76vh)";

    el.style.transition = "none";
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
    // Force the start state to be committed. Without this the browser sees one
    // style change in the same frame as the transition and simply jumps to the
    // end — the swarm teleports instead of moving.
    void el.offsetWidth;

    const raf = requestAnimationFrame(() => {
      el.style.transition = "transform 4.6s cubic-bezier(0.45, 0, 0.55, 1), opacity 1.5s ease-in 3.1s";
      el.style.transform = travel;
      el.style.opacity = "0";
    });
    const done = window.setTimeout(() => {
      el.style.transition = "none";
      el.style.transform = "translateY(0)";
      el.style.opacity = "0";
      setEpoch((n) => n + 1); // remount: every one starts over
      void el.offsetWidth;
      // and come back in rather than appearing
      requestAnimationFrame(() => {
        el.style.transition = "opacity 1.2s ease-out";
        el.style.opacity = "1";
      });
    }, 4700);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
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
          <Swarm key={epoch} bugs={bugs} />
        </div>
      </div>
    </div>
  );
}
