import { useState } from "react";
import { motion } from "motion/react";
import { PageShell } from "@/components/PageShell";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ROLL_01, type Frame } from "@/content/photography";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The contact sheet. One frame was worth keeping; the rest are still in the dark,
 * drawn the way an unexposed frame actually looks on a strip — with the grease
 * pencil mark you make so you can find it again later.
 */
export default function Photography() {
  const [loupe, setLoupe] = useState<Frame | null>(null);

  return (
    <PageShell
      kicker="roll 01"
      title="photography"
      lede="I take photographs at night, mostly of places that are about to be empty. One frame from this roll has been developed."
    >
      <div className="overflow-hidden rounded-3xl border border-bone/10 bg-[#08090d]/70 p-3 backdrop-blur-md md:p-5">
        {/* sprockets */}
        <div className="mb-3 flex justify-between px-1" aria-hidden>
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} className="h-1.5 w-3 rounded-[1px] bg-bone/[0.07]" />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3">
          {ROLL_01.map((frame, i) => (
            <motion.div
              key={frame.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: EASE }}
            >
              {frame.developed ? (
                <button
                  type="button"
                  onClick={() => setLoupe(frame)}
                  className="group relative block aspect-[3/4] w-full overflow-hidden rounded-sm ring-1 ring-bone/12 outline-none focus-visible:ring-2 focus-visible:ring-amber"
                  aria-label={`Open ${frame.caption}`}
                >
                  <img
                    src={frame.src}
                    alt={frame.caption}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                  <span className="absolute inset-0 bg-amber/0 transition-colors duration-500 group-hover:bg-amber/[0.06]" />
                  <span className="absolute bottom-2 left-2 font-mono text-[0.5rem] tracking-[0.18em] text-bone/70 uppercase">
                    {frame.note}
                  </span>
                </button>
              ) : (
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#040507] ring-1 ring-bone/[0.07]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(233,228,218,0.045),transparent_70%)]" />
                  <span className="absolute top-2 left-2 font-mono text-[0.5rem] tracking-[0.18em] text-ash/35 uppercase">
                    {frame.note}
                  </span>
                  {/* grease pencil circle around an undeveloped frame */}
                  <svg viewBox="0 0 100 133" className="absolute inset-0 h-full w-full" aria-hidden>
                    <ellipse
                      cx="50"
                      cy="66"
                      rx="33"
                      ry="44"
                      fill="none"
                      stroke="rgba(245,166,35,0.22)"
                      strokeWidth="1.2"
                      strokeDasharray="7 5"
                      transform="rotate(-6 50 66)"
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between px-1 font-mono text-[0.5rem] tracking-[0.18em] text-ash/50 uppercase">
          <span>roll 01 · night · 35mm</span>
          <span>1 of 6 developed</span>
        </div>
      </div>

      <p className="mt-8 max-w-[52ch] font-mono text-[0.58rem] leading-[2.1] tracking-[0.14em] text-ash/65 uppercase">
        the undeveloped frames are real — there is nothing in them yet. add a
        photograph by dropping the file in <span className="text-bone/80">public/photos/</span> and
        setting its <span className="text-bone/80">src</span> in
        <span className="text-bone/80"> src/content/photography.ts</span>.
      </p>

      <Dialog open={!!loupe} onOpenChange={(o) => !o && setLoupe(null)}>
        <DialogContent
          className="max-w-3xl border-bone/12 bg-[#08090d]/95 p-3 backdrop-blur-2xl"
          showCloseButton
        >
          <DialogTitle className="sr-only">{loupe?.caption ?? "Photograph"}</DialogTitle>
          {loupe && (
            <figure>
              <img
                src={loupe.src}
                alt={loupe.caption}
                className={cn("w-full rounded-md object-cover ring-1 ring-bone/10")}
              />
              <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 px-1 font-mono text-[0.55rem] tracking-[0.18em] text-ash/70 uppercase">
                <span className="text-bone/85">{loupe.stamp}</span>
                <span>{loupe.note}</span>
                <span className="ml-auto">{loupe.place}</span>
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
