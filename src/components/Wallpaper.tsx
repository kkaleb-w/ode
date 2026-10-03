import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useCoverBox } from "@/lib/useMedia";

const NIGHT = { src: "/night.jpg", aspect: 1280 / 853 };
const SUNSET = { src: "/sunset.jpg", aspect: 960 / 1280 };

/**
 * The photograph, full bleed.
 *
 * Nothing is drawn on top of it — no glow, no invented light, and no hotspot
 * either. The picture is the ground, and that is all it is asked to be.
 */
export function Wallpaper({
  variant = "night",
  dim = false,
  blur = false,
}: {
  variant?: "night" | "sunset";
  dim?: boolean;
  blur?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const image = variant === "sunset" ? SUNSET : NIGHT;
  useCoverBox(ref, image.aspect);

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
    </div>
  );
}
