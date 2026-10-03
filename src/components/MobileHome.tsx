import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Aperture, ArrowRight, ChevronDown, Command as CommandIcon, Mail, Sparkles } from "lucide-react";
import { GithubMark } from "@/components/icons";
import { Epigraph } from "@/components/Epigraph";
import { DESK, greeting, LINKS } from "@/content/site";
import { formatHour } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const BAR = [
  { to: "/photography", label: "photos", icon: Aperture },
  { to: "/code", label: "code", icon: GithubMark },
  { to: "/rosaria", label: "rosaria", icon: Sparkles },
];

/**
 * Phones get a different room, not a smaller one: the drawer of paper tabs, and
 * the one lit window lifted out of the photograph and set down in the page.
 */
export function MobileHome({ now, onLookAround }: { now: Date; onLookAround: () => void }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="relative z-20 flex min-h-[100dvh] flex-col px-6 pt-8 pb-28">
      <header className="flex items-baseline justify-between">
        <h1 className="font-display text-[1rem] tracking-[0.02em] text-white lowercase">
          ode to myself
        </h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.6rem] tracking-[0.18em] text-white/50 lowercase">
            {formatHour(now)} · {greeting(now.getHours())}
          </span>
          <button
            type="button"
            onClick={onLookAround}
            aria-label="Look around"
            className="rounded-full border border-white/15 p-1.5 text-white/55 transition-colors active:border-white/40 active:text-white"
          >
            <CommandIcon className="size-3.5" />
          </button>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
        className="mt-10 border-l border-white/10 pl-5"
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
          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0a0b10]/45 p-3 backdrop-blur-md transition-colors duration-300 active:border-amber/40"
        >
          <span
            aria-hidden
            className="size-14 shrink-0 rounded-xl border border-white/10"
            style={{
              backgroundImage: "url(/night.jpg)",
              backgroundSize: "640% 640%",
              backgroundPosition: "67.5% 35.4%",
              boxShadow: "inset 0 0 30px 6px rgba(245,166,35,0.35)",
            }}
          />
          <span className="font-display text-[0.95rem] text-white/85 lowercase">about</span>
          <ArrowRight className="ml-auto size-4 shrink-0 text-white/40 transition-transform duration-300 group-active:translate-x-1" />
        </Link>
      </motion.div>

      {/* the drawer */}
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.35, ease: EASE }}
        className="mt-10 flex flex-col gap-2.5"
      >
        {DESK.map((folder) => {
          const isOpen = open === folder.key;
          return (
            <li
              key={folder.key}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0b10]/45 backdrop-blur-md"
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
                <span className="min-w-0 flex-1 font-display text-[0.95rem] text-white/90 lowercase">
                  {folder.label}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-white/40 transition-transform duration-300",
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
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <div className="flex items-center gap-4 border-t border-white/10 px-4 py-4">
                      <p className="min-w-0 flex-1 font-serif text-[0.95rem] leading-snug text-white/65 italic">
                        {folder.peek}
                      </p>
                      <Link
                        to={folder.to}
                        aria-label={`Open ${folder.label}`}
                        className="shrink-0 rounded-full border border-amber/35 p-1.5 text-amber"
                      >
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </motion.ul>

      {/* thumb bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#07080c]/80 backdrop-blur-xl">
        <ul className="flex items-stretch justify-around px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {BAR.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-label={label}
                className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-white/55 active:text-white"
              >
                <Icon className="size-[1.15rem]" />
                <span className="font-mono text-[0.5rem] tracking-[0.14em] lowercase">{label}</span>
              </Link>
            </li>
          ))}
          <li className="flex-1">
            <a
              href={`mailto:${LINKS.email}`}
              aria-label="Email"
              className="flex flex-col items-center gap-1 rounded-xl py-1.5 text-white/55 active:text-white"
            >
              <Mail className="size-[1.15rem]" />
              <span className="font-mono text-[0.5rem] tracking-[0.14em] lowercase">email</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
