import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Aperture, Command as CommandIcon, Home as HomeIcon, Sparkles } from "lucide-react";
import { GithubMark } from "@/components/icons";
import { Wallpaper } from "@/components/Wallpaper";
import { FolderIcon } from "@/components/FolderIcon";
import { Epigraph } from "@/components/Epigraph";
import { Grain } from "@/components/Grain";
import { CommandPalette, usePalette } from "@/components/CommandPalette";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DESK, greeting, LINKS } from "@/content/site";
import { formatHour, useBreeze, useClock, useSettled } from "@/lib/hooks";
import { useMedia } from "@/lib/useMedia";
import { cn } from "@/lib/utils";
import { MobileHome } from "@/components/MobileHome";

const EASE = [0.22, 1, 0.36, 1] as const;

const DOCK_ITEMS: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
}[] = [
  { to: "/", label: "the desk", icon: HomeIcon, accent: "#e9e4da" },
  { to: "/photography", label: "photography", icon: Aperture, accent: "#f5a623" },
  { to: "/code", label: "code", icon: GithubMark, accent: "#8fdc8f" },
  { to: "/rosaria", label: "rosaria", icon: Sparkles, accent: "#d9b8ff" },
];

export default function Home() {
  const now = useClock();
  const isDesk = useMedia("(min-width: 900px)");
  const breeze = useBreeze(isDesk);
  const settled = useSettled(180);
  const [paletteOpen, setPaletteOpen] = usePalette();

  // The desk is a fixed frame: nothing to scroll past.
  useEffect(() => {
    document.documentElement.classList.add("desk-locked");
    return () => document.documentElement.classList.remove("desk-locked");
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className={cn("relative w-full bg-background", isDesk ? "h-[100dvh] overflow-hidden" : "min-h-[100dvh]")}
    >
      <Wallpaper dim={!isDesk} blur={!isDesk} withDoor={isDesk} />
      <Grain />

      {isDesk ? (
        <>
          {/* ── menu bar ─────────────────────────────────────────── */}
          <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-9 py-7">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={settled ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, ease: EASE }}
              className="flex items-center gap-2.5"
            >
              <span className="size-1.5 rounded-full bg-amber shadow-[0_0_10px_2px_rgba(245,166,35,0.5)]" />
              <span className="font-mono text-[0.66rem] tracking-[0.28em] text-bone/78 lowercase">
                ode
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={settled ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
              className="flex items-center gap-4"
            >
              <span
                className="font-mono text-[0.66rem] tracking-[0.2em] text-ash/88 lowercase"
                title="your local time, not mine"
              >
                {formatHour(now)} · {greeting(now.getHours())}
              </span>
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="group flex items-center gap-1.5 rounded-full border border-bone/12 bg-bone/[0.03] px-2.5 py-1 font-mono text-[0.64rem] tracking-[0.18em] text-ash/88 uppercase backdrop-blur-sm transition-colors duration-300 hover:border-amber/40 hover:text-bone"
              >
                <CommandIcon className="size-3" />
                look around
              </button>
            </motion.div>
          </header>

          {/* ── the left column: who, what, and the folders ──────── */}
          <div className="absolute top-1/2 left-[5vw] z-20 w-[min(440px,42vw)] -translate-y-1/2 [@media(max-height:800px)]:scale-[0.88]">
            <motion.div
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={settled ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 1.4, ease: EASE }}
            >
              <p className="label-caps text-ash/82">an ode to myself</p>
              <h1 className="mt-4 font-serif text-[clamp(3.6rem,6.2vw,5.4rem)] leading-[0.9] font-extralight tracking-[-0.03em] text-bone">
                ode
              </h1>
              <div className="mt-5 h-px w-14 bg-bone/20" />
              <p className="mt-4 max-w-[34ch] font-mono text-[0.66rem] leading-[1.9] tracking-[0.18em] text-ash/88 uppercase">
                kaleb wright · photography, software,
                <br />
                and one window left on
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={settled ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
              className="mt-9 border-l border-bone/10 pl-5"
            >
              <Epigraph order={now.getDate() % 6} />
            </motion.div>

            <div className="mt-11 grid grid-cols-2 gap-x-7 gap-y-5">
              {DESK.map((folder, i) => (
                <FolderIcon key={folder.key} folder={folder} index={i} breeze={breeze} settled={settled} />
              ))}
            </div>
          </div>

          {/* ── the dock ─────────────────────────────────────────── */}
          <motion.nav
            initial={{ opacity: 0, y: 14 }}
            animate={settled ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
            aria-label="Sections"
            className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2"
          >
            <TooltipProvider delayDuration={200}>
              <ul className="flex items-end gap-1.5 rounded-2xl border border-bone/10 bg-[#0a0b10]/55 px-2.5 py-2 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]">
                {DOCK_ITEMS.map(({ to, label, icon: Icon, accent }) => (
                  <li key={to}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon-lg"
                          className="rounded-xl text-bone/78 transition-all duration-300 hover:-translate-y-1 hover:bg-bone/[0.06] hover:text-bone"
                        >
                          <Link to={to} aria-label={label}>
                            <Icon className="size-[1.15rem]" style={{ color: accent }} />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="label-caps">
                        {label}
                      </TooltipContent>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </TooltipProvider>
          </motion.nav>

          {/* ── the wink ─────────────────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={settled ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="absolute right-9 bottom-8 z-20 max-w-[22ch] text-right font-mono text-[0.68rem] leading-[2] tracking-[0.18em] text-ash/72 uppercase"
          >
            this page does not scroll.
            <br />
            open something instead.
          </motion.p>

          <motion.a
            initial={{ opacity: 0 }}
            animate={settled ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 1.3 }}
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-9 top-1/2 z-20 hidden -translate-y-1/2 [writing-mode:vertical-rl] font-mono text-[0.68rem] tracking-[0.28em] text-ash/82 uppercase transition-colors duration-300 hover:text-amber xl:block"
          >
            github.com/kkaleb-w
          </motion.a>
        </>
      ) : (
        <MobileHome now={now} onLookAround={() => setPaletteOpen(true)} />
      )}

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </motion.main>
  );
}
