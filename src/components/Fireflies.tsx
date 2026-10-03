import { memo, useEffect, useMemo, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { subscribeAir } from "@/lib/air";

interface Bug {
  left: string;
  core: number;
  rise: string;
  dur: number;
  delay: number;
  sway: number;
  swayDur: number;
  blinkDur: number;
  hue: string;
}

/** A cheap deterministic hash so the swarm is the same on every load. */
function rand(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function makeBugs(): Bug[] {
  return Array.from({ length: 34 }, (_, i) => {
    // most of the swarm keeps low, over the dark grass at the foot of the
    // photograph; a few get all the way up into the trees
    const band = rand(i, 1);
    const riseVh =
      band < 0.5 ? 14 + rand(i, 2) * 22 : band < 0.84 ? 38 + rand(i, 3) * 34 : 84 + rand(i, 4) * 30;

    const core = 2.6 + rand(i, 5) * 3.6;
    return {
      left: `${2 + rand(i, 6) * 96}%`,
      core,
      rise: `${riseVh.toFixed(1)}vh`,
      // a long climb; the higher it goes the longer it takes
      dur: 20 + riseVh * 0.42 + rand(i, 7) * 6,
      // negative delay: every firefly is already mid-flight on load
      delay: -rand(i, 8) * 40,
      sway: 7 + rand(i, 9) * 26,
      swayDur: 5 + rand(i, 10) * 7,
      blinkDur: 3 + rand(i, 11) * 5,
      hue: core > 4.6 ? "#ffd98a" : "#f5a623",
    };
  });
}

const Swarm = memo(function Swarm({ bugs }: { bugs: Bug[] }) {
  return (
    <>
      {bugs.map((b, i) => (
        <span
          key={i}
          className="ff-rise absolute bottom-0"
          style={{
            left: b.left,
            ["--rise" as string]: b.rise,
            ["--dur" as string]: `${b.dur}s`,
            ["--delay" as string]: `${b.delay}s`,
          }}
        >
          <span
            className="ff-sway block"
            style={{ ["--sway" as string]: `${b.sway}px`, ["--sway-dur" as string]: `${b.swayDur}s` }}
          >
            {/* the halo — what you actually notice from across the room */}
            <span
              className="ff-core block rounded-full"
              style={{
                width: b.core * 4.2,
                height: b.core * 4.2,
                marginLeft: -(b.core * 4.2) / 2,
                marginTop: -(b.core * 4.2) / 2,
                background: `radial-gradient(closest-side, ${b.hue}59, ${b.hue}1f 46%, transparent 74%)`,
                ["--blink-dur" as string]: `${b.blinkDur}s`,
              }}
            />
            {/* the insect itself */}
            <span
              className="absolute rounded-full"
              style={{
                width: b.core,
                height: b.core,
                marginLeft: -b.core / 2,
                marginTop: -b.core / 2,
                background: `radial-gradient(closest-side, #fff6e0, ${b.hue} 58%, transparent)`,
                boxShadow: `0 0 ${b.core * 3}px ${b.core * 0.9}px ${b.hue}66`,
              }}
            />
          </span>
        </span>
      ))}
    </>
  );
});

/**
 * Fireflies over the dark end of the photograph.
 *
 * They come up out of the bottom edge — that is where the swarm lives — and only
 * a handful travel the whole height. Each one runs three nested animations
 * (climb, sway, blink) so no two cycles look alike, and the whole swarm drifts
 * sideways when a gust passes.
 */
export function Fireflies() {
  const reduced = usePrefersReducedMotion();
  const bugs = useMemo(() => makeBugs(), []);
  const swarm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = swarm.current;
    if (!el || reduced) return;
    return subscribeAir((air) => {
      el.style.transform = `translate3d(${(air.gust * 30).toFixed(2)}px, 0, 0)`;
    });
  }, [reduced]);

  if (reduced) {
    // no drift, no blink: a few steady lights, scattered up the frame
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        {bugs.slice(0, 10).map((b, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: b.left,
              bottom: `${rand(i, 20) * 46}%`,
              width: b.core,
              height: b.core,
              background: b.hue,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <div ref={swarm} className="absolute inset-0 will-change-transform">
        <Swarm bugs={bugs} />
      </div>
    </div>
  );
}
