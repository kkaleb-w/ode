import { useEffect } from "react";
import { motion } from "motion/react";
import { Command as CommandIcon } from "lucide-react";
import { Wallpaper } from "@/components/Wallpaper";
import { FolderIcon } from "@/components/FolderIcon";
import { Grain } from "@/components/Grain";
import { CommandPalette, usePalette } from "@/components/CommandPalette";
import { MobileMarks } from "@/components/MobileMarks";
import { DESK, greeting } from "@/content/site";
import { formatHour, useBreeze, useClock, useSettled } from "@/lib/hooks";
import { useMedia } from "@/lib/useMedia";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The desk.
 *
 * Two lines of text live on this page: the title, and the hour. Everything else
 * on the wallpaper is a thing you can pick up. The folders carry drawn emblems
 * instead of names, the lit window in the photograph is the door, and the dock
 * that used to sit along the bottom is gone — the desk is the navigation.
 */
export default function Home() {
  const now = useClock();
  const isDesk = useMedia("(min-width: 900px)");
  const breeze = useBreeze(isDesk);
  const settled = useSettled(180);
  const [paletteOpen, setPaletteOpen] = usePalette();

  // The desk is a fixed frame: nothing to scroll past, and no scrollbar.
  useEffect(() => {
    document.documentElement.classList.add("desk-locked");
    return () => document.documentElement.classList.remove("desk-locked");
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn("relative w-full bg-background", isDesk ? "h-[100dvh] overflow-hidden" : "h-[100dvh]")}
    >
      <Wallpaper variant={isDesk ? "night" : "sunset"} withDoor={isDesk} />
      <Grain />

      <motion.h1
        initial={{ opacity: 0, y: -6 }}
        animate={settled ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute top-9 left-8 z-20 font-display text-[1.02rem] font-normal tracking-[0.02em] text-white lowercase md:top-10 md:left-11"
      >
        ode to myself
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={settled ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.1, ease: EASE }}
        className="absolute top-9 right-8 z-20 flex items-center gap-3 md:top-10 md:right-11"
      >
        <span className="font-mono text-[0.64rem] tracking-[0.18em] text-white/78 lowercase">
          {formatHour(now)} · {greeting(now.getHours())}
        </span>
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Look around"
          className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] px-2 py-1 font-mono text-[0.6rem] tracking-[0.16em] text-white/78 lowercase transition-colors duration-300 hover:border-white/40 hover:text-white"
        >
          <CommandIcon className="size-3" />
          k
        </button>
      </motion.div>

      {isDesk ? (
        DESK.map((folder, i) => (
          <div
            key={folder.key}
            className="absolute z-20 [@media(max-height:800px)]:scale-[0.84]"
            style={{ left: folder.left, top: folder.top }}
          >
            <FolderIcon folder={folder} index={i} breeze={breeze} settled={settled} />
          </div>
        ))
      ) : (
        <MobileMarks settled={settled} />
      )}

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </motion.main>
  );
}
