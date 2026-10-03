import { useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCoverBox } from "@/lib/useMedia";

const NIGHT = { src: "/night.jpg", aspect: 1280 / 853 };
const SUNSET = { src: "/sunset.jpg", aspect: 960 / 1280 };

/** The lit window in the night photograph, in image-relative fractions. */
export const WINDOW = { cx: 0.675, cy: 0.354, w: 0.115, h: 0.16 };

/**
 * The photograph, full bleed. Nothing is drawn on top of it — no glow, no
 * invented light. The picture already has one lit window in it and that is the
 * only thing the page needs it to do.
 *
 * `withDoor` turns that window into the way to the about page. The hotspot is
 * computed from where `object-fit: cover` actually lands the image, so it sits
 * on the real window at any viewport shape.
 */
export function Wallpaper({
  variant = "night",
  dim = false,
  blur = false,
  withDoor = false,
}: {
  variant?: "night" | "sunset";
  dim?: boolean;
  blur?: boolean;
  withDoor?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const image = variant === "sunset" ? SUNSET : NIGHT;
  const box = useCoverBox(ref, image.aspect);

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
        src={image.src}
        alt={
          variant === "sunset"
            ? "A sunset over a row of standing stones, framed by maple leaves in shadow."
            : "A wooden fence at night, trees behind it, and one small window still lit."
        }
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center",
          dim && "brightness-[0.55] saturate-[0.85]",
          blur && "blur-[3px]",
        )}
        fetchPriority="high"
        decoding="async"
      />

      {withDoor && variant === "night" && (
        <Link
          to="/about"
          aria-label="The lit window — about"
          className="group absolute rounded-[2px] outline-none"
          style={doorStyle}
        >
          <span className="absolute inset-0 rounded-[2px] ring-1 ring-white/0 transition-[box-shadow,--tw-ring-color] duration-500 group-hover:ring-white/45 group-focus-visible:ring-white/60" />
        </Link>
      )}
    </div>
  );
}
