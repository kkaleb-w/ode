import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Wallpaper } from "@/components/Wallpaper";
import { Grain } from "@/components/Grain";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Every page but the desk. The photograph stays fixed behind the sheet, dimmed,
 * so you never quite leave the room.
 */
export function PageShell({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative min-h-[100dvh] w-full bg-background/60"
    >
      <Wallpaper dim blur />
      <Grain />

      <div className="relative z-20 mx-auto w-full max-w-5xl px-6 pb-24 md:px-10">
        <header className="flex items-center justify-between py-7">
          <Link
            to="/"
            className="group flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-white/60 lowercase transition-colors duration-300 hover:text-white"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            desk
          </Link>
          {kicker && <span className="label-caps text-white/35">{kicker}</span>}
        </header>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
        >
          <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1] font-normal tracking-[-0.01em] text-white lowercase">
            {title}
          </h1>
          {lede && (
            <p className="mt-4 max-w-[40ch] font-serif text-[1.05rem] leading-relaxed text-white/65 italic">
              {lede}
            </p>
          )}
        </motion.div>

        <div className="mt-12">{children}</div>
      </div>
    </motion.main>
  );
}
