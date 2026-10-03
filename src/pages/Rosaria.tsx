import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { LINKS } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const SHOTS = [
  { src: "/rosaria/01-home.webp", alt: "Rosaria home screen: prayer streak, today's mystery, weekly progress." },
  { src: "/rosaria/02-pray.webp", alt: "Rosaria pray screen: the beads drawn on screen." },
  { src: "/rosaria/03-praying.webp", alt: "Rosaria mid-prayer: the current decade in progress." },
];

const FACTS = [
  ["front end", "react · vite · chakra ui · pwa"],
  ["back end", "python · fastapi · mongodb"],
  ["what it does", "daily mystery, on-screen beads, streak, weekly progress"],
];

/**
 * The one that is still being made.
 */
export default function Rosaria() {
  return (
    <PageShell
      kicker="featured"
      title="rosaria"
      lede="The Rosary, with the beads on screen. It is the thing I actually use every day, which is the only reason I trust it."
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
          <p className="mt-5 font-mono text-[0.66rem] tracking-[0.16em] text-ash/72 uppercase">
            screenshots from the live app · 01 oct
          </p>
        </div>

        <div>
          <p className="max-w-[42ch] font-serif text-[1.05rem] leading-[1.75] text-bone/85">
            I wanted a rosary I could pray with one thumb, in the dark, without a
            notification deciding what I think about. So the mystery of the day
            picks itself, the beads are drawn on the glass, and the only number
            the app shows you is the streak — gently, once, at the top.
          </p>
          <p className="mt-5 max-w-[42ch] font-serif text-[1.05rem] leading-[1.75] text-bone/78">
            It is a real app, in real use, and it is still being worked on. The
            green squares on the other page are mostly this.
          </p>

          <dl className="mt-9 border-t border-bone/10">
            {FACTS.map(([k, v]) => (
              <div
                key={k}
                className="flex flex-col gap-1 border-b border-bone/10 py-3.5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <dt className="label-caps w-32 shrink-0 text-ash/72">{k}</dt>
                <dd className="font-mono text-[0.68rem] tracking-[0.12em] text-bone/85 lowercase">
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={LINKS.rosaria}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-4 py-2 font-mono text-[0.64rem] tracking-[0.2em] text-primary-foreground uppercase transition-transform duration-300 hover:-translate-y-0.5"
            >
              open rosaria.cc
              <ArrowUpRight className="size-3.5" />
            </a>
            <a
              href={LINKS.rosariaRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-b border-bone/25 pb-1 font-mono text-[0.64rem] tracking-[0.2em] text-bone/82 uppercase transition-colors hover:border-amber hover:text-bone"
            >
              the source
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
