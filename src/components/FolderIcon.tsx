import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import type { DeskFolder } from "@/content/site";
import { Emblem } from "@/components/Emblems";
import { subscribeAir } from "@/lib/air";

/**
 * A folder on the desk, built like a folder rather than a card.
 *
 * Manila stock with a printed emblem, not glass — the ground behind it is a
 * photograph of a fence at night, and a piece of paper lying on a dark desk is
 * the thing that belongs there. One silhouette: a tab standing proud on the
 * left, the body below it, a flap hinged along its bottom edge.
 *
 * Come near and the flap swings down, a sheet lifts out carrying the page's
 * name, and the whole folder leans into the wind.
 */
export function FolderIcon({
  folder,
  index,
  settled,
}: {
  folder: DeskFolder;
  index: number;
  settled: boolean;
}) {
  const reduced = useReducedMotion();
  const body = useRef<HTMLDivElement>(null);

  // The wind is written straight to the DOM, not through React state: it changes
  // every frame, and re-rendering four folders sixty times a second to move them
  // a few pixels is a cost with nothing to show for it.
  useEffect(() => {
    if (reduced) return;
    const el = body.current;
    if (!el) return;
    const base = `rotate(${folder.tilt}deg)`;
    return subscribeAir((air) => {
      el.style.transform =
        `perspective(1000px) rotateX(${(air.leanY * -1.6).toFixed(3)}deg) ` +
        `rotateY(${(air.leanX * 1.8).toFixed(3)}deg) ` +
        `translate3d(${(air.leanX * 1.8 + air.gust * 1.6).toFixed(3)}px, ${(air.gust * 0.5).toFixed(3)}px, 0) ` +
        `${base} rotate(${(air.gust * 0.55).toFixed(3)}deg)`;
    });
  }, [folder.tilt, reduced]);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={settled ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1.1, delay: 0.35 + index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      style={{ transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)" }}
    >
      <Link
        to={folder.to}
        aria-label={folder.name}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-kraft focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
      >
        <div ref={body} className="relative h-[136px] w-[176px] [perspective:1000px]">
          {/* the shadow it casts on the desk, so it sits rather than floats */}
          <span
            aria-hidden
            className="absolute -bottom-[7px] left-[6%] h-[14px] w-[88%] rounded-[50%] bg-black/55 blur-[7px]"
          />
          {/* ── the back of the folder, one silhouette with the tab ── */}
          <div className="absolute inset-x-0 top-[22px] bottom-0 rounded-t-[2px] rounded-b-[3px] border border-kraft-shade/50 bg-gradient-to-b from-[#9d8a6d] to-[#877453] shadow-[0_1px_2px_rgba(0,0,0,0.85),0_14px_24px_-10px_rgba(0,0,0,0.9),0_32px_54px_-26px_rgba(0,0,0,0.9)]" />
          {/* tab */}
          <div className="absolute top-0 left-0 h-[23px] w-[112px] rounded-t-[3px] border border-b-0 border-kraft-shade/50 bg-gradient-to-b from-[#ab9779] to-[#93805f]">
            <span className="absolute inset-x-0 top-0 h-px bg-white/25" aria-hidden />
          </div>
          {/* the fold where tab meets body */}
          <div className="absolute inset-x-0 top-[22px] h-px bg-kraft-shade/35" />
          {/* pressed crease down the flap's edge — the detail that says paper */}
          <div className="absolute inset-x-0 top-[22px] bottom-0 rounded-t-[2px] rounded-b-[3px] opacity-[0.5] [background:linear-gradient(180deg,transparent_0_2px,rgba(63,50,34,0.10)_2px_3px,transparent_3px)]" />

          {/* ── the sheet, sitting in the folder, sliding up to be read ──
               It starts pushed right down inside the folder where the closed flap
               covers it completely, and slides up into the opening on hover. No
               fade: the flap is what hides it, so it can be a real 40px of travel
               rather than a 16px hop with an opacity trick over the top. */}
          <div className="absolute inset-x-[15px] top-[22px]">
            <div className="translate-y-[40px] transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
              <div className="flex h-[74px] flex-col items-center rounded-[2px] border border-ink-brown/25 bg-[#ded3bb] pt-2 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.9)]">
                <span className="font-display text-[1.05rem] leading-none tracking-[0.01em] text-ink-brown/85 lowercase">
                  {folder.name}
                </span>
              </div>
            </div>
          </div>

          {/* ── the flap, hinged along its bottom edge ── */}
          <div
            className="absolute inset-x-0 bottom-0 top-[26px] origin-bottom rounded-t-[2px] rounded-b-[3px] border border-kraft-shade/55 bg-gradient-to-b from-[#b09d80] to-[#8e7a5b] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_18px_-12px_rgba(0,0,0,0.9)] transition-transform duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:rotateX(-48deg)] group-focus-visible:[transform:rotateX(-48deg)]"
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          >
            <span className="grain pointer-events-none absolute inset-0 rounded-[3px] opacity-[0.16] mix-blend-multiply" aria-hidden />
            {/* the printed emblem — on the flap, which is what you see at rest */}
            <span className="absolute inset-0 flex items-center justify-center text-ink-brown/70 transition-colors duration-500 group-hover:text-ink-brown">
              <Emblem kind={folder.key} className="block [&>svg]:size-[46px]" />
            </span>
            <span className="pointer-events-none absolute inset-[5px] rounded-[2px] border border-ink-brown/[0.09]" aria-hidden />
            <span
              className="pointer-events-none absolute inset-0 rounded-[3px] bg-gradient-to-t from-ink-brown/[0.22] to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
