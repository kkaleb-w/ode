import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Wallpaper } from "@/components/Wallpaper";
import { Grain } from "@/components/Grain";
import { LINKS } from "@/content/site";

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

      <div className="relative z-20 mx-auto w-full max-w-5xl px-6 pb-32 md:px-10">
        <header className="flex items-center justify-between py-7">
          <Link
            to="/"
            className="group flex items-center gap-2 font-mono text-[0.64rem] tracking-[0.2em] text-ash/88 uppercase transition-colors duration-300 hover:text-bone"
          >
            <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            back to the desk
          </Link>
          <span className="label-caps text-ash/72">{kicker}</span>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
        >
          <h1 className="font-serif text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.95] font-extralight tracking-[-0.02em] text-bone">
            {title}
          </h1>
          {lede && (
            <p className="mt-5 max-w-[46ch] font-serif text-[1.05rem] leading-relaxed text-bone/78 italic">
              {lede}
            </p>
          )}
        </motion.div>

        <div className="mt-14">{children}</div>

        <footer className="mt-24 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-bone/10 pt-6 font-mono text-[0.68rem] tracking-[0.18em] uppercase">
          <Link to="/" className="text-ash/88 transition-colors hover:text-bone">
            the desk
          </Link>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ash/88 transition-colors hover:text-bone"
          >
            github
          </a>
          <a href={`mailto:${LINKS.email}`} className="text-ash/88 transition-colors hover:text-bone">
            email
          </a>
          <span className="ml-auto text-ash/72">ode · built by kaleb wright</span>
        </footer>
      </div>
    </motion.main>
  );
}
