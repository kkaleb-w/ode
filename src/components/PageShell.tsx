import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Wallpaper } from "@/components/Wallpaper";
import { Grain } from "@/components/Grain";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Every page but the desk. The photograph stays behind, dimmed, so you never
 * quite leave the room.
 *
 * Two pieces of interface here and no more: the way back, and the name of the
 * page. No kicker above the title, no lede beneath it, no footer.
 */
export function PageShell({
  title,
  bleed = false,
  children,
}: {
  title: string;
  /** Photography wants the full width; everything else reads in a column. */
  bleed?: boolean;
  children: ReactNode;
}) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="relative min-h-[100dvh] w-full"
    >
      <Wallpaper dim blur />
      <Grain />

      <div className="relative z-20 flex min-h-[100dvh] flex-col">
        <header className="flex items-baseline justify-between px-6 py-6 md:px-9">
          <Link
            to="/"
            className="group flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.18em] text-white/72 lowercase transition-colors duration-300 hover:text-white"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            desk
          </Link>
          <h1 className="font-display text-[0.82rem] tracking-[0.02em] text-white/85 lowercase">
            {title}
          </h1>
        </header>

        {bleed ? (
          children
        ) : (
          <div className="mx-auto w-full max-w-[46rem] px-6 pb-24 md:px-9">{children}</div>
        )}
      </div>
    </motion.main>
  );
}
