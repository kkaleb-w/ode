import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Aperture, ArrowRight, ChevronDown, Command as CommandIcon, Home as HomeIcon, Mail, Sparkles } from "lucide-react";
import { GithubMark } from "@/components/icons";
import { Epigraph } from "@/components/Epigraph";
import { DESK, greeting, LINKS } from "@/content/site";
import { formatHour } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const BAR = [
  { to: "/", label: "desk", icon: HomeIcon },
  { to: "/photography", label: "photos", icon: Aperture },
  { to: "/code", label: "code", icon: GithubMark },
  { to: "/rosaria", label: "rosaria", icon: Sparkles },
];

/**
 * Phones get a different room, not a smaller one: the desktop's spatial folder
 * grid becomes a drawer of paper tabs you pull open in place, and the one lit
 * window is lifted out of the photograph and set in the page as a card.
 */
export function MobileHome({ now, onLookAround }: { now: Date; onLookAround: () => void }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="relative z-20 flex min-h-[100dvh] flex-col px-6 pt-8 pb-32">
      <header className="flex items-center justify-between">
        <span className="font-mono text-[0.66rem] tracking-[0.28em] text-bone/70 lowercase">ode</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.56rem] tracking-[0.18em] text-ash/80 lowercase">
            {formatHour(now)} · {greeting(now.getHours())}
          </span>
          <button
            type="button"
            onClick={onLookAround}
            aria-label="Look around"
            className="rounded-full border border-bone/12 p-1.5 text-ash/80 transition-colors hover:border-amber/40 hover:text-bone"
          >
            <CommandIcon className="size-3.5" />
          </button>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
        className="mt-14"
      >
        <p className="label-caps text-ash/75">an ode to myself</p>
        <h1 className="mt-3 font-serif text-[3.4rem] leading-[0.9] font-extralight tracking-[-0.03em] text-bone">
          ode
        </h1>
        <div className="mt-4 h-px w-12 bg-bone/20" />
        <p className="mt-4 max-w-[30ch] font-mono text-[0.58rem] leading-[2] tracking-[0.16em] text-ash/80 uppercase">
          kaleb wright · photography, software, and one window left on
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
        className="mt-10 border-l border-bone/10 pl-5"
      >
        <Epigraph order={now.getDate() % 6} interval={11_000} />
      </motion.div>

      {/* the window, lifted out of the photograph */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.25, ease: EASE }}
        className="mt-12"
      >
        <Link
          to="/about"
          className="group flex items-center gap-4 rounded-2xl border border-bone/10 bg-[#0a0b10]/45 p-3 backdrop-blur-md transition-colors duration-300 active:border-amber/40"
        >
          <span
            aria-hidden
            className="size-16 shrink-0 rounded-xl border border-bone/10"
            style={{
              backgroundImage: "url(/night.jpg)",
              backgroundSize: "640% 640%",
              backgroundPosition: "67.5% 35.4%",
              boxShadow: "inset 0 0 30px 6px rgba(245,166,35,0.35)",
            }}
          />
          <span className="min-w-0">
            <span className="block font-mono text-[0.56rem] tracking-[0.2em] text-amber/85 uppercase">
              someone&apos;s still up
            </span>
            <span className="mt-1 block font-serif text-[1.05rem] leading-snug text-bone/90 italic">
              the window is the door to the about page
            </span>
          </span>
          <ArrowRight className="ml-auto size-4 shrink-0 text-ash transition-transform duration-300 group-active:translate-x-1" />
        </Link>
      </motion.div>

      {/* the drawer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.35, ease: EASE }}
        className="mt-12"
      >
        <p className="label-caps mb-4 text-ash/70">open a folder</p>
        <ul className="flex flex-col gap-2.5">
          {DESK.map((folder) => {
            const isOpen = open === folder.key;
            return (
              <li
                key={folder.key}
                className="overflow-hidden rounded-2xl border border-bone/10 bg-[#0a0b10]/45 backdrop-blur-md"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : folder.key)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span
                    aria-hidden
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: folder.accent, boxShadow: `0 0 10px 1px ${folder.accent}66` }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.72rem] tracking-[0.02em] text-bone lowercase">
                      {folder.label}
                    </span>
                    <span className="mt-0.5 block font-mono text-[0.52rem] tracking-[0.18em] text-ash/70 uppercase">
                      {folder.sub}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-ash transition-transform duration-400",
                      isOpen && "rotate-180 text-amber",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <div className="border-t border-bone/8 px-4 py-4">
                        <p className="font-serif text-[1rem] leading-snug text-bone/80 italic">
                          {folder.peek}
                        </p>
                        <Link
                          to={folder.to}
                          className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber/35 px-3 py-1.5 font-mono text-[0.56rem] tracking-[0.2em] text-amber uppercase"
                        >
                          open {folder.label}
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </motion.div>

      <footer className="mt-12 flex items-center gap-4 pb-4 font-mono text-[0.56rem] tracking-[0.18em] uppercase">
        <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="text-ash/75">
          github
        </a>
        <a href={`mailto:${LINKS.email}`} className="text-ash/75">
          email
        </a>
        <span className="ml-auto text-ash/40">no scroll on desktop</span>
      </footer>

      {/* thumb bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-bone/10 bg-[#07080c]/80 backdrop-blur-xl">
        <ul className="flex items-stretch justify-around px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {BAR.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-ash/75 active:text-bone"
              >
                <Icon className="size-[1.15rem]" />
                <span className="font-mono text-[0.5rem] tracking-[0.16em] uppercase">{label}</span>
              </Link>
            </li>
          ))}
          <li className="flex-1">
            <a
              href={`mailto:${LINKS.email}`}
              className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-ash/75 active:text-bone"
            >
              <Mail className="size-[1.15rem]" />
              <span className="font-mono text-[0.5rem] tracking-[0.16em] uppercase">write</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
