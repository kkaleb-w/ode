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
import { DESK, greeting } from "@/content/site";
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
  { to: "/", label: "photography", icon: Aperture, accent: "#f5a623" },
  { to: "/code", label: "code", icon: GithubMark, accent: "#8fdc8f" },
  { to: "/rosaria", label: "rosaria", icon: Sparkles, accent: "#d9b8ff" },
  { to: "/about", label: "about", icon: HomeIcon, accent: "#e9e4da" },
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
          {/* ── top left: the only thing up here ─────────────────── */}
          <motion.h1
            initial={{ opacity: 0, y: -6 }}
            animate={settled ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: EASE }}
            className="absolute top-10 left-11 z-20 font-display text-[1.05rem] font-normal tracking-[0.02em] text-white lowercase"
          >
            ode to myself
          </motion.h1>

          {/* ── top right: the hour, and a way in ────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={settled ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            className="absolute top-10 right-11 z-20 flex items-center gap-4"
          >
            <span className="font-mono text-[0.66rem] tracking-[0.2em] text-white/55 lowercase">
              {formatHour(now)} · {greeting(now.getHours())}
            </span>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Look around"
              className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] px-2 py-1 font-mono text-[0.62rem] tracking-[0.18em] text-white/60 lowercase backdrop-blur-sm transition-colors duration-300 hover:border-white/35 hover:text-white"
            >
              <CommandIcon className="size-3" />
              k
            </button>
          </motion.div>

          {/* ── the folders, left where they were ────────────────── */}
          {DESK.map((folder, i) => (
            <div
              key={folder.key}
              className="absolute z-20 [@media(max-height:800px)]:scale-[0.86]"
              style={{ left: folder.left, top: folder.top }}
            >
              <FolderIcon folder={folder} index={i} breeze={breeze} settled={settled} />
            </div>
          ))}

          {/* ── one line of verse, low left ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={settled ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.3, delay: 0.5, ease: EASE }}
            className="absolute bottom-11 left-11 z-20 max-w-[36ch]"
          >
            <Epigraph order={now.getDate() % 6} />
          </motion.div>

          {/* ── the dock ─────────────────────────────────────────── */}
          <motion.nav
            initial={{ opacity: 0, y: 14 }}
            animate={settled ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
            aria-label="Sections"
            className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2"
          >
            <TooltipProvider delayDuration={200}>
              <ul className="flex items-end gap-1.5 rounded-2xl border border-white/10 bg-[#0a0b10]/55 px-2.5 py-2 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]">
                {DOCK_ITEMS.map(({ to, label, icon: Icon, accent }) => (
                  <li key={to}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          variant="ghost"
                          size="icon-lg"
                          className="rounded-xl text-white/75 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:text-white"
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
        </>
      ) : (
        <MobileHome now={now} onLookAround={() => setPaletteOpen(true)} />
      )}

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </motion.main>
  );
}
