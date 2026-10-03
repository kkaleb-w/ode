import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import type { DeskFolder } from "@/content/site";
import { Emblem } from "@/components/Emblems";

/**
 * A folder on the desk, built like a folder rather than a card.
 *
 * It is manila stock with a printed emblem, not glass — the wall behind it is a
 * photograph of a fence at night, and a piece of paper lying on a dark desk is
 * the thing that actually belongs there. One silhouette: a tab standing proud on
 * the left, the body below it, and a front flap hinged along its bottom edge.
 *
 * Come near and the flap swings down, the paper inside lifts out, and the whole
 * folder leans into the breeze.
 */
export function FolderIcon({
  folder,
  index,
  breeze,
  settled,
}: {
  folder: DeskFolder;
  index: number;
  breeze: { x: number; y: number };
  settled: boolean;
}) {
  const reduced = useReducedMotion();
  const bx = reduced ? 0 : breeze.x;
  const by = reduced ? 0 : breeze.y;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={settled ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1.1, delay: 0.35 + index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: `perspective(1000px) rotateX(${by * -2}deg) rotateY(${bx * 2.4}deg)`,
        transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)",
      }}
      className="group relative"
    >
      <Link
        to={folder.to}
        aria-label={folder.name}
        title={folder.name}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-kraft focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
      >
        <div
          className="relative h-[136px] w-[176px] [perspective:1000px]"
          style={{ transform: `rotate(${folder.tilt}deg) translateX(${bx * 2.4}px)` }}
        >
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

          {/* ── the sheet inside, behind the flap ── */}
          <div className="absolute inset-x-[16px] top-[26px] h-[74px] overflow-hidden">
            <div className="translate-y-5 opacity-0 transition-all duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-1 group-hover:opacity-100 group-focus-visible:translate-y-1 group-focus-visible:opacity-100">
              <Inner kind={folder.key} />
            </div>
          </div>

          {/* ── the flap, hinged along its bottom edge ── */}
          <div
            className="absolute inset-x-0 bottom-0 top-[26px] origin-bottom rounded-t-[2px] rounded-b-[3px] border border-kraft-shade/55 bg-gradient-to-b from-[#b09d80] to-[#8e7a5b] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_18px_-12px_rgba(0,0,0,0.9)] transition-transform duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:rotateX(-34deg)] group-focus-visible:[transform:rotateX(-34deg)]"
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          >
            {/* paper tooth */}
            <span className="grain pointer-events-none absolute inset-0 rounded-[3px] opacity-[0.16] mix-blend-multiply" aria-hidden />
            {/* the printed emblem — the only thing naming this folder */}
            <span className="absolute inset-0 flex items-center justify-center text-ink-brown/70 transition-colors duration-500 group-hover:text-ink-brown">
              <Emblem kind={folder.key} className="block [&>svg]:size-[46px]" />
            </span>
            {/* a hairline pressed around the flap */}
            <span className="pointer-events-none absolute inset-[5px] rounded-[2px] border border-ink-brown/[0.09]" aria-hidden />
            {/* darkening off the near edge, so it sits under the desk light */}
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

/** What is actually kept in each folder. Drawn, never written. */
function Inner({ kind }: { kind: DeskFolder["key"] }) {
  const sheet =
    "rounded-[2px] border border-ink-brown/25 bg-[#ded3bb] shadow-[0_8px_16px_-8px_rgba(0,0,0,0.85)]";
  if (kind === "photography") {
    return (
      <div className={sheet + " flex h-[74px] items-center gap-2 p-2"}>
        <span className="block h-[58px] w-[42px] overflow-hidden rounded-[1px] border border-ink-brown/30">
          <img src="/night.jpg" alt="" className="h-full w-full object-cover" />
        </span>
        <span className="block h-[58px] w-[42px] rounded-[1px] border border-dashed border-ink-brown/30" />
        <span className="block h-[58px] w-[42px] rounded-[1px] border border-dashed border-ink-brown/30" />
      </div>
    );
  }
  if (kind === "code") {
    return (
      <div className={sheet + " flex h-[74px] flex-col justify-center gap-[5px] p-2"}>
        {[0, 1, 2].map((row) => (
          <div key={row} className="grid grid-cols-[repeat(26,1fr)] gap-[2px]">
            {Array.from({ length: 26 }, (_, i) => {
              const v = (i * 7 + row * 5 + 3) % 11;
              const lvl = v > 8 ? 4 : v > 6 ? 3 : v > 3 ? 2 : v > 1 ? 1 : 0;
              return (
                <span
                  key={i}
                  className="h-[13px] rounded-[0.5px]"
                  style={{ background: lvl === 0 ? "rgba(63,50,34,0.14)" : `rgba(46,68,40,${0.18 + lvl * 0.2})` }}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }
  if (kind === "rosaria") {
    return (
      <div className={sheet + " flex h-[74px] items-center justify-center"}>
        <svg viewBox="0 0 40 52" className="h-[62px] w-[48px]" aria-hidden>
          <line x1="20" y1="2" x2="20" y2="16" stroke="rgba(63,50,34,0.5)" strokeWidth="1" />
          <line x1="16.6" y1="2" x2="23.4" y2="2" stroke="rgba(63,50,34,0.65)" strokeWidth="1.2" />
          <line x1="20" y1="0.4" x2="20" y2="4.6" stroke="rgba(63,50,34,0.65)" strokeWidth="1.2" />
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
            return (
              <circle
                key={i}
                cx={20 + Math.cos(a) * 11}
                cy={32 + Math.sin(a) * 11}
                r="2.3"
                fill="none"
                stroke="rgba(63,50,34,0.6)"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>
    );
  }
  return (
    <div className={sheet + " flex h-[74px] items-center justify-center"}>
      <svg viewBox="0 0 48 48" className="h-[58px] w-[58px]" aria-hidden>
        <rect x="9" y="8" width="30" height="32" rx="1" fill="none" stroke="rgba(63,50,34,0.6)" strokeWidth="1.2" />
        <path d="M24 8v32M9 20h30" stroke="rgba(63,50,34,0.4)" strokeWidth="1" />
        <rect x="12" y="11" width="9" height="8" fill="rgba(224,160,60,0.85)" />
      </svg>
    </div>
  );
}
