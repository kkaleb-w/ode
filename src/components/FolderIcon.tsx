import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import type { DeskFolder } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * A folder on the desk. Shut, it is a dark glass wallet with a paper label.
 * Come near and the lid hinges open, the label leans into the breeze, and
 * whatever is inside peeks out.
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
  const tilt = reduced ? 0 : folder.tilt;
  const bx = reduced ? 0 : breeze.x;
  const by = reduced ? 0 : breeze.y;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={settled ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1.1, delay: 0.35 + index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: `perspective(900px) rotateX(${by * -2.2}deg) rotateY(${bx * 2.6}deg)`,
        transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)",
      }}
      className="group relative"
    >
      <Link
        to={folder.to}
        aria-label={folder.label}
        className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-amber/70 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
      >
        <div className="relative h-[132px] w-[172px] [perspective:900px]">
          {/* back panel — the same object as the tab, one silhouette */}
          <div className="absolute inset-x-0 top-[20px] bottom-0 rounded-t-[3px] rounded-b-[11px] border border-white/[0.09] bg-[#0d0e14]/78 shadow-[0_20px_42px_-18px_rgba(0,0,0,0.95)]" />
          {/* tab — raised block on the left, same fill, so it reads as one folder */}
          <div
            className="absolute top-0 left-0 h-[20px] w-[104px] rounded-t-[9px] border border-b-0 border-white/[0.11] bg-[#0d0e14]/78"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
          />
          <div className="absolute top-[6px] left-[13px] font-mono text-[0.62rem] tracking-[0.18em] text-ash/70 uppercase">
            {folder.key === "photography" ? "roll 01" : folder.key === "code" ? "kkaleb-w" : ""}
          </div>
          {/* what is inside, behind the lid */}
          <div className="absolute inset-x-[14px] top-[20px] h-[62px] overflow-hidden">
            <div className="translate-y-4 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <Peek folder={folder} />
            </div>
          </div>

          {/* lid, hinged at the bottom */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 top-[24px] origin-bottom rounded-t-[5px] rounded-b-[11px]",
              "border border-white/[0.11] bg-gradient-to-b from-[#15171f]/96 to-[#0a0b10]/96",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]",
              "transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover:[transform:rotateX(-30deg)] group-focus-visible:[transform:rotateX(-30deg)]",
            )}
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
          >
            {/* the paper label */}
            <div
              className="absolute top-[13px] left-[16px] w-[126px] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:translateY(-3px)_rotate(0.4deg)]"
              style={{
                transform: `rotate(${tilt}deg) translateX(${bx * 2.2}px)`,
              }}
            >
              <div className="relative rounded-[3px] bg-paper px-[10px] py-[8px] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.8)]">
                <div className="font-display text-[0.86rem] leading-none tracking-[0.01em] text-ink lowercase">
                  {folder.label}
                </div>
                <span
                  className="absolute -top-[3px] left-1/2 h-[6px] w-[26px] -translate-x-1/2 rounded-[1px] bg-ink/10"
                  aria-hidden
                />
              </div>
            </div>
            {/* rim light that wakes on hover */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[11px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ boxShadow: `inset 0 0 0 1px ${folder.accent}40, 0 0 34px -6px ${folder.accent}55` }}
              aria-hidden
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Peek({ folder }: { folder: DeskFolder }) {
  if (folder.peekKind === "photo") {
    return (
      <div className="flex h-full items-center gap-3">
        <div className="h-[52px] w-[38px] overflow-hidden rounded-[2px] border border-white/15 shadow-lg">
          <img src="/night.jpg" alt="" className="h-full w-full object-cover" />
        </div>
        <p className="max-w-[92px] font-serif text-[0.72rem] leading-tight text-bone/82 italic">
          {folder.peek}
        </p>
      </div>
    );
  }
  if (folder.peekKind === "graph") {
    return (
      <div className="flex h-full flex-col justify-center gap-2">
        <MiniField />
        <p className="font-serif text-[0.72rem] leading-tight text-bone/82 italic">{folder.peek}</p>
      </div>
    );
  }
  if (folder.peekKind === "rosary") {
    return (
      <div className="flex h-full items-center gap-3">
        <RosaryMark />
        <p className="max-w-[92px] font-serif text-[0.72rem] leading-tight text-bone/82 italic">
          {folder.peek}
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full items-center gap-3">
      <WarmWindow />
      <p className="max-w-[92px] font-serif text-[0.72rem] leading-tight text-bone/82 italic">
        {folder.peek}
      </p>
    </div>
  );
}

/** 26 weeks of contribution squares, drawn small. */
function MiniField() {
  const cells = Array.from({ length: 26 }, (_, i) => {
    const v = (i * 7 + 3) % 11;
    return v > 8 ? 3 : v > 6 ? 2 : v > 3 ? 1 : 0;
  });
  const shades = ["bg-white/8", "bg-moss/30", "bg-moss/55", "bg-moss/85"];
  return (
    <div className="grid w-[120px] grid-cols-[repeat(26,1fr)] gap-[2px]">
      {cells.map((c, i) => (
        <span key={i} className={cn("h-[9px] rounded-[1px]", shades[c])} />
      ))}
    </div>
  );
}

function RosaryMark() {
  return (
    <svg viewBox="0 0 40 56" className="h-[52px] w-[38px]" aria-hidden>
      <line x1="20" y1="4" x2="20" y2="20" stroke="rgba(217,184,255,0.5)" strokeWidth="1" />
      <circle cx="20" cy="3" r="2.2" fill="none" stroke="rgba(233,228,218,0.85)" strokeWidth="1" />
      <g fill="none" stroke="rgba(233,228,218,0.55)" strokeWidth="1">
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
          return <circle key={i} cx={20 + Math.cos(a) * 11} cy={34 + Math.sin(a) * 11} r="2.1" />;
        })}
      </g>
      <line x1="20" y1="45" x2="20" y2="53" stroke="rgba(233,228,218,0.55)" strokeWidth="1" />
      <rect x="18.4" y="52.4" width="3.2" height="3.2" fill="rgba(245,166,35,0.7)" />
    </svg>
  );
}

function WarmWindow() {
  return (
    <div className="relative h-[52px] w-[38px] rounded-[2px] border border-white/12 bg-[#0a0b10]">
      <div className="absolute inset-[7px] rounded-[1px] bg-amber/70 shadow-[0_0_16px_4px_rgba(245,166,35,0.45)]" />
    </div>
  );
}
