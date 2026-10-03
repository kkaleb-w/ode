import { motion } from "motion/react";
import { PageShell } from "@/components/PageShell";
import { ROLL_01 } from "@/content/photography";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The photographs, butted together.
 *
 * Square tiles, sharp corners, no gaps, no borders, no captions at rest — the
 * pictures touch each other and nothing frames them. Come near one and it lifts
 * forward a little, leans five degrees, and says what it is along its bottom
 * edge.
 *
 * The grid is capped at 1280 wide on purpose: that is the long edge of the
 * source frames, so no tile is ever asked to show a photograph larger than it
 * actually is.
 */
export default function Photography() {
  return (
    <PageShell title="photography" bleed>
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-2 md:grid-cols-3">
        {ROLL_01.map((frame, i) => (
          <motion.figure
            key={frame.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.05 + i * 0.05, ease: EASE }}
            className="group relative aspect-square hover:z-10"
            style={{ WebkitBackfaceVisibility: "hidden" }}
          >
            {frame.developed ? (
              <img
                src={frame.src}
                alt={frame.caption}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] group-hover:rotate-[5deg]"
              />
            ) : (
              /* An unexposed frame: nothing in it, and the page says so by
                 showing nothing — a dark square with the grease-pencil ring you
                 draw so you can find it again. */
              <span className="absolute inset-0 bg-[#07080b]">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
                  <ellipse
                    cx="50"
                    cy="50"
                    rx="30"
                    ry="36"
                    fill="none"
                    stroke="rgba(233,228,218,0.13)"
                    strokeWidth="1.1"
                    strokeDasharray="6 5"
                    transform="rotate(-6 50 50)"
                  />
                </svg>
              </span>
            )}

            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-1.5 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3 pt-6 pb-2 font-mono text-[0.6rem] tracking-[0.12em] text-white/0 lowercase transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:text-white/90">
              {frame.caption}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </PageShell>
  );
}
