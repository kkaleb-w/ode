import { useEffect, useMemo, useState } from "react";
import { VERSES, type Verse } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * The epigraph. One line of verse at a time, breathing between them.
 * Lines are real quotations, attributed in the margin.
 */
export function Epigraph({
  className,
  interval = 14_000,
  order,
}: {
  className?: string;
  interval?: number;
  /** Deterministic first line (so a reload does not reshuffle the poem). */
  order?: number;
}) {
  const sequence = useMemo(() => {
    if (order === undefined) return VERSES;
    return [...VERSES.slice(order), ...VERSES.slice(0, order)];
  }, [order]);
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => {
      setShown(false);
      window.setTimeout(() => {
        setI((v) => (v + 1) % sequence.length);
        setShown(true);
      }, 900);
    }, interval);
    return () => window.clearInterval(id);
  }, [interval, sequence.length]);

  const verse: Verse = sequence[i];

  return (
    <figure className={cn("group/epigraph", className)}>
      <blockquote
        className={cn(
          "font-serif text-[clamp(1.15rem,1.5vw,1.6rem)] leading-[1.5] font-light text-bone/90 italic",
          "transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          shown ? "opacity-100" : "opacity-0",
        )}
      >
        {verse.text}
      </blockquote>
      <figcaption
        className={cn(
          "mt-3 font-mono text-[0.62rem] tracking-[0.22em] text-ash uppercase",
          "transition-opacity duration-700",
          shown ? "opacity-100" : "opacity-0",
        )}
      >
        {verse.source}
      </figcaption>
    </figure>
  );
}
