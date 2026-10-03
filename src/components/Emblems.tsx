import type { FolderKey } from "@/content/site";

/**
 * The emblems. With the paper labels gone, these are the only thing naming a
 * folder on the desk, so they are drawn rather than borrowed from an icon font:
 * one 24-unit grid, one stroke weight, one ink, no fills. They read as something
 * printed or stamped on the folder, not as UI icons.
 */
const common = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.35,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Aperture() {
  return (
    <svg {...common} aria-hidden>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="4.6" strokeWidth="0.9" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={12 + Math.cos(a) * 4.6}
            y1={12 + Math.sin(a) * 4.6}
            x2={12 + Math.cos(a + 0.9) * 8.4}
            y2={12 + Math.sin(a + 0.9) * 8.4}
            strokeWidth="0.9"
          />
        );
      })}
      <circle cx="12" cy="3.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Branch() {
  return (
    <svg {...common} aria-hidden>
      <path d="M7 6.2v12.2" />
      <path d="M7 11.6h5.2a4.6 4.6 0 0 0 4.6-4.6V6.4" />
      <circle cx="7" cy="4.4" r="1.7" />
      <circle cx="7" cy="20" r="1.7" />
      <circle cx="16.8" cy="4.6" r="1.7" />
    </svg>
  );
}

function Beads() {
  return (
    <svg {...common} aria-hidden>
      <path d="M12 3.1v5.2" />
      <line x1="9.7" y1="3.1" x2="14.3" y2="3.1" />
      <line x1="12" y1="1.5" x2="12" y2="4.7" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        return <circle key={i} cx={12 + Math.cos(a) * 6.6} cy={16 + Math.sin(a) * 6.6} r="1.5" />;
      })}
      <path d="M12 8.3v1.1" />
    </svg>
  );
}

function Window() {
  return (
    <svg {...common} aria-hidden>
      <rect x="5.4" y="4.6" width="13.2" height="15.8" rx="0.6" />
      <path d="M12 4.6v15.8M5.4 12.5h13.2" strokeWidth="0.9" />
      <rect x="7.1" y="6.3" width="3.6" height="4.4" fill="currentColor" stroke="none" opacity="0.75" />
      <path d="M9.4 20.4v2.1h5.2v-2.1" strokeWidth="0.9" />
    </svg>
  );
}

export function Emblem({ kind, className }: { kind: FolderKey; className?: string }) {
  const map = { photography: Aperture, code: Branch, rosaria: Beads, about: Window };
  const Mark = map[kind];
  return (
    <span className={className}>
      <Mark />
    </span>
  );
}
