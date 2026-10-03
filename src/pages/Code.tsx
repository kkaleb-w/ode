import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import contributionsSnapshot from "@/content/contributions.snapshot.json";
import reposSnapshot from "@/content/repos.snapshot.json";
import { LINKS } from "@/content/site";
import { cn } from "@/lib/utils";

interface Day {
  date: string;
  count: number;
  level: number;
}
interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
}

const SNAPSHOT_DAYS = contributionsSnapshot.contributions as Day[];
/** Bundled so the page is never empty; replaced live when the API answers. */
const SNAPSHOT_REPOS = reposSnapshot as unknown as Repo[];

const CELL = [
  "bg-bone/[0.05] ring-1 ring-inset ring-bone/[0.06]",
  "bg-moss/25",
  "bg-moss/45",
  "bg-moss/70",
  "bg-moss/95 shadow-[0_0_8px_rgba(143,220,143,0.45)]",
];

/**
 * The year, drawn as a field of small lit windows. Same squares GitHub gives
 * you, but they belong to the rest of the page: unlit frames are dark glass,
 * the lit ones glow, and a slow chase light walks the weeks so you can see
 * where "now" is without reading a single label.
 */
function Field({ days }: { days: Day[] }) {
  const weeks = useMemo(() => {
    const out: (Day | null)[][] = [];
    let current: (Day | null)[] = [];
    days.forEach((d, i) => {
      const dow = new Date(`${d.date}T00:00:00Z`).getUTCDay();
      if (i === 0 && dow > 0) {
        for (let k = 0; k < dow; k++) current.push(null);
      }
      current.push(d);
      if (dow === 6) {
        out.push(current);
        current = [];
      }
    });
    if (current.length) out.push(current);
    return out;
  }, [days]);

  const [hover, setHover] = useState<Day | null>(null);
  const total = days.reduce((a, d) => a + d.count, 0);

  return (
    <div className="rounded-3xl border border-bone/10 bg-[#08090d]/70 p-4 backdrop-blur-md md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="label-caps text-ash/88">this year, so far</p>
        <p className="font-mono text-[0.66rem] tracking-[0.18em] text-ash/88 uppercase">
          {total} contributions
        </p>
      </div>

      <div className="relative mt-5">
        <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative inline-flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week[di];
                  if (!day) return <span key={di} className="size-[11px]" />;
                  return (
                    <button
                      key={di}
                      type="button"
                      onMouseEnter={() => setHover(day)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(day)}
                      onBlur={() => setHover(null)}
                      title={`${day.date} · ${day.count}`}
                      aria-label={`${day.date}: ${day.count} contributions`}
                      className={cn(
                        "size-[11px] rounded-[2px] transition-transform duration-200 hover:scale-[1.35] focus-visible:scale-[1.35] focus-visible:outline-none",
                        CELL[Math.min(day.level, 4)],
                      )}
                    />
                  );
                })}
              </div>
            ))}
            {/* the chase light — one slow pass, then rest */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-[46px] bg-[linear-gradient(90deg,transparent,rgba(245,166,35,0.16),transparent)]"
              initial={{ left: "-10%" }}
              animate={{ left: ["-10%", "100%"] }}
              transition={{ duration: 11, repeat: Infinity, repeatDelay: 7, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="h-4 font-mono text-[0.68rem] tracking-[0.16em] text-bone/82 uppercase">
          {hover ? `${hover.date} · ${hover.count} time${hover.count === 1 ? "" : "s"}` : ""}
        </p>
        <div className="flex items-center gap-1.5 font-mono text-[0.66rem] tracking-[0.16em] text-ash/72 uppercase">
          less
          {CELL.map((c, i) => (
            <span key={i} className={cn("size-[9px] rounded-[2px]", c)} />
          ))}
          more
        </div>
      </div>
    </div>
  );
}

function RepoRow({ repo }: { repo: Repo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 border-t border-bone/10 py-5 transition-colors duration-300 hover:border-bone/20 sm:flex-row sm:items-baseline sm:gap-6"
    >
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="font-mono text-[0.8rem] tracking-[0.02em] text-bone lowercase">
          {repo.name}
        </span>
        <ArrowUpRight className="size-3.5 text-ash transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-amber" />
      </div>
      <p className="min-w-0 flex-1 font-serif text-[0.95rem] leading-snug text-bone/82 italic">
        {repo.description ?? "no description yet"}
      </p>
      <div className="flex shrink-0 items-center gap-4 font-mono text-[0.68rem] tracking-[0.16em] text-ash/82 uppercase">
        {repo.language && <span>{repo.language}</span>}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <Star className="size-3" />
            {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <GitFork className="size-3" />
            {repo.forks_count}
          </span>
        )}
      </div>
    </a>
  );
}

export default function Code() {
  const [days, setDays] = useState<Day[]>(SNAPSHOT_DAYS);
  const [repos, setRepos] = useState<Repo[]>(SNAPSHOT_REPOS);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://github-contributions-api.jogruber.de/v4/${LINKS.githubUser}?y=last`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { contributions: Day[] }) => {
        if (!cancelled && Array.isArray(d.contributions) && d.contributions.length) {
          setDays(d.contributions);
          setLive(true);
        }
      })
      .catch(() => {});
    fetch(`https://api.github.com/users/${LINKS.githubUser}/repos?per_page=100&sort=pushed`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: unknown) => {
        if (!cancelled && Array.isArray(d) && d.length) setRepos(d as Repo[]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageShell
      kicker="code"
      title="the work"
      lede="Small, deliberate software. Most of it is one app I care about and a few things I built to learn something."
    >
      <Field days={days} />

      <div className="mt-14">
        <div className="flex items-baseline justify-between">
          <p className="label-caps text-ash/88">repositories</p>
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-ash/82 uppercase">
            {live ? "live from github" : "saved snapshot"}
          </p>
        </div>
        <div className="mt-3">
          {repos.map((r) => (
            <RepoRow key={r.name} repo={r} />
          ))}
          <a
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 border-b border-amber/40 pb-1 font-mono text-[0.66rem] tracking-[0.2em] text-amber uppercase transition-colors hover:border-amber"
          >
            all of it on github
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </PageShell>
  );
}
