import { useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCoverBox } from "@/lib/useMedia";
import { usePrefersReducedMotion } from "@/lib/hooks";

const ASPECT = 1280 / 853;

/** The lit window in the photograph, in image-relative fractions. */
export const WINDOW = { cx: 0.675, cy: 0.354, w: 0.115, h: 0.16 };

/**
 * The photograph. Full bleed, never scrolling, and — the point of the whole
 * page — the one lit window in it is a door.
 */
export function Wallpaper({
  dim = false,
  blur = false,
  withDoor = false,
}: {
  dim?: boolean;
  blur?: boolean;
  withDoor?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const box = useCoverBox(ref, ASPECT);
  const reduced = usePrefersReducedMotion();

  const doorStyle =
    box.width > 0
      ? {
          left: box.offX + box.width * WINDOW.cx - (box.width * WINDOW.w) / 2,
          top: box.offY + box.height * WINDOW.cy - (box.height * WINDOW.h) / 2,
          width: box.width * WINDOW.w,
          height: box.height * WINDOW.h,
        }
      : { opacity: 0 };

  return (
    <div ref={ref} className="fixed inset-0 overflow-hidden">
      <img
        src="/night.jpg"
        alt="A wooden fence at night, trees behind it, and one small window still lit."
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center",
          "transition-[filter,transform] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          dim && "brightness-[0.42] saturate-[0.75]",
          !dim && "brightness-[1.08] contrast-[1.03] saturate-[1.05]",
          blur && "blur-[3px]",
        )}
        fetchPriority="high"
        decoding="async"
      />

      {/* the light in the window, breathing under the pixels */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute",
          !reduced && "motion-safe:animate-[breathe-glow_9s_ease-in-out_infinite]",
        )}
        style={doorStyle}
      >
        <div className="h-full w-full rounded-[2px] bg-[radial-gradient(closest-side,rgba(245,166,35,0.55),rgba(245,166,35,0)_78%)] blur-[6px]" />
      </div>

      {withDoor && (
        <Link
          to="/about"
          aria-label="The lit window — who left the light on"
          className="group absolute rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-amber/80"
          style={doorStyle}
        >
          <span className="absolute inset-0 rounded-[2px] ring-0 transition-shadow duration-500 group-hover:shadow-[0_0_44px_10px_rgba(245,166,35,0.42)] group-focus-visible:shadow-[0_0_44px_10px_rgba(245,166,35,0.5)]" />
          <span
            className={cn(
              "absolute -bottom-9 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap",
              "font-mono text-[0.58rem] tracking-[0.2em] text-amber/0 uppercase",
              "transition-all duration-500 group-hover:translate-y-0 group-hover:text-amber/85",
              "group-focus-visible:translate-y-0 group-focus-visible:text-amber/85",
            )}
          >
            someone&apos;s still up
          </span>
        </Link>
      )}
    </div>
  );
}
