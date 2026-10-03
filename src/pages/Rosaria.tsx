import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { LINKS } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const SHOTS = [
  { src: "/rosaria/01-home.webp", alt: "Rosaria home screen." },
  { src: "/rosaria/02-pray.webp", alt: "Rosaria pray screen." },
  { src: "/rosaria/03-praying.webp", alt: "Rosaria mid-prayer." },
];

/**
 * The one that is still being made.
 */
export default function Rosaria() {
  return (
    <PageShell
      kicker=""
      title="rosaria"
      lede="The Rosary, with the beads on screen."
    >
      <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
        <div>
          <div className="flex gap-3 md:gap-4">
            {SHOTS.map((shot, i) => (
              <motion.figure
                key={shot.src}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: EASE }}
                className="flex-1"
              >
                <div className="overflow-hidden rounded-[1.6rem] border border-bone/12 bg-[#08090d] p-1 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.95)]">
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    loading="lazy"
                    className="aspect-[585/1266] w-full rounded-[1.3rem] object-cover"
                  />
                </div>
                <figcaption className="mt-2.5 font-mono text-[0.64rem] tracking-[0.16em] text-ash/82 uppercase">
                  {i === 0 ? "home" : i === 1 ? "the beads" : "mid-decade"}
                </figcaption>
              </motion.figure>
            ))}
          </div>
          <p className="mt-5 font-mono text-[0.6rem] tracking-[0.16em] text-white/30 lowercase">
            screenshots from the live app
          </p>
        </div>

        <div>
          <p className="max-w-[40ch] font-serif text-[1.05rem] leading-[1.75] text-white/75">
            A rosary I can pray with one thumb, in the dark, without a
            notification deciding what I think about. The mystery of the day
            picks itself; the beads are drawn on the glass.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={LINKS.rosaria}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-4 py-2 font-mono text-[0.62rem] tracking-[0.2em] text-primary-foreground lowercase transition-transform duration-300 hover:-translate-y-0.5"
            >
              rosaria.cc
              <ArrowUpRight className="size-3.5" />
            </a>
            <a
              href={LINKS.rosariaRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-b border-white/25 pb-1 font-mono text-[0.62rem] tracking-[0.2em] text-white/70 lowercase transition-colors hover:border-amber hover:text-white"
            >
              source
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
