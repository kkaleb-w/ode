import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DESK, LINKS } from "@/content/site";
import { ArrowUpRight, CornerDownLeft } from "lucide-react";

/**
 * ⌘K — "look around". The whole site in one list, for people who would rather
 * type than hunt for a folder in the dark.
 */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Look around">
      <CommandInput placeholder="look around…" />
      <CommandList>
        <CommandEmpty>Nothing here by that name.</CommandEmpty>
        <CommandGroup heading="the desk">
          {DESK.map((f) => (
            <CommandItem
              key={f.key}
              value={`${f.label} ${f.sub} ${f.peek}`}
              onSelect={() => {
                onOpenChange(false);
                navigate(f.to);
              }}
            >
              <span
                className="mr-1 size-1.5 rounded-full"
                style={{ background: f.accent }}
                aria-hidden
              />
              <span>{f.label}</span>
              <span className="ml-auto font-mono text-[0.6rem] tracking-widest text-muted-foreground uppercase">
                {f.sub}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="elsewhere">
          <CommandItem
            value="github repository source code"
            onSelect={() => window.open(LINKS.github, "_blank", "noopener")}
          >
            github <ArrowUpRight className="ml-auto size-3.5 opacity-60" />
          </CommandItem>
          <CommandItem
            value="rosaria live app rosary"
            onSelect={() => window.open(LINKS.rosaria, "_blank", "noopener")}
          >
            rosaria.cc <ArrowUpRight className="ml-auto size-3.5 opacity-60" />
          </CommandItem>
          <CommandItem
            value="email write to kaleb"
            onSelect={() => window.open(`mailto:${LINKS.email}`, "_self")}
          >
            write to me <ArrowUpRight className="ml-auto size-3.5 opacity-60" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <div className="flex items-center gap-2 border-t border-border/70 px-3 py-2 font-mono text-[0.58rem] tracking-[0.18em] text-muted-foreground uppercase">
        <CornerDownLeft className="size-3" />
        open · esc close
      </div>
    </CommandDialog>
  );
}

/** Binds ⌘K / ctrl+K and returns the open state. */
export function usePalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return [open, setOpen] as const;
}
