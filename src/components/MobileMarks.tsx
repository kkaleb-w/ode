import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Emblem } from "@/components/Emblems";
import { DESK } from "@/content/site";

/**
 * Phones get the sunset, and four marks along the bottom.
 *
 * No bar, no cards, no labels, no scrolling — the picture is the page. Each mark
 * is the same emblem the folder carries on the desktop, printed straight onto
 * the dark band at the foot of the photograph so it looks like it belongs to the
 * image rather than sitting on top of it.
 */
export function MobileMarks({ settled }: { settled: boolean }) {
  return (
    <nav
      aria-label="Sections"
      className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-center gap-9 pb-[max(2.25rem,env(safe-area-inset-bottom))]"
    >
      {DESK.map((folder, i) => (
        <motion.div
          key={folder.key}
          initial={{ opacity: 0, y: 10 }}
          animate={settled ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            to={folder.to}
            aria-label={folder.name}
            className="block p-3 text-white/75 transition-colors duration-300 active:text-white focus-visible:text-white"
          >
            <Emblem kind={folder.key} className="block drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] [&>svg]:size-[30px]" />
          </Link>
        </motion.div>
      ))}
    </nav>
  );
}
