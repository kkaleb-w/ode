import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { LINKS } from "@/content/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const READING = [
  { title: "The Odes", who: "Keats" },
  { title: "Zach Bryan", who: "on repeat" },
  { title: "the night sky", who: "most nights" },
];

/**
 * The window, opened. Everything on this page is meant to be edited by hand —
 * it is a first draft of a person, not a generated résumé.
 */
export default function About() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <PageShell
      kicker=""
      title="about"
      lede="I build quiet things, mostly at night."
    >
      <div className="grid gap-12 md:grid-cols-[1fr_0.72fr] md:gap-16">
        <div className="max-w-[54ch]">
          <p className="font-serif text-[1.1rem] leading-[1.8] text-white/80">
            My name is Kaleb Wright. I make software the way I take photographs:
            slowly, at night, and mostly of things that are about to be empty. I
            care about the feeling of a thing more than the feature list.
          </p>

          <h2 id="reading" className="label-caps mt-14 scroll-mt-24 text-white/45">
            what is on
          </h2>
          <ul className="mt-4 border-t border-white/10">
            {READING.map((r) => (
              <li key={r.title} className="flex flex-wrap items-baseline gap-x-3 border-b border-white/10 py-4">
                <span className="font-display text-[1rem] text-white/85 lowercase">{r.title}</span>
                <span className="font-mono text-[0.6rem] tracking-[0.18em] text-white/40 lowercase">
                  {r.who}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="md:pt-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="rounded-3xl border border-bone/10 bg-[#08090d]/70 p-5 backdrop-blur-md"
          >
            <div
              aria-hidden
              className="h-28 w-full rounded-2xl border border-bone/10"
              style={{
                backgroundImage: "url(/night.jpg)",
                backgroundSize: "520% 520%",
                backgroundPosition: "67.5% 35.4%",
                boxShadow: "inset 0 0 60px 12px rgba(245,166,35,0.3)",
              }}
            />
            <p className="mt-4 font-serif text-[1rem] leading-snug text-bone/82 italic">
              &ldquo;Already with thee! tender is the night.&rdquo;
            </p>
            <p className="mt-2 font-mono text-[0.66rem] tracking-[0.2em] text-ash/72 uppercase">
              keats · ode to a nightingale
            </p>
          </motion.div>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={`mailto:${LINKS.email}`}
              className="group flex items-center justify-between rounded-2xl border border-bone/10 px-4 py-3.5 transition-colors duration-300 hover:border-amber/40"
            >
              <span>
                <span className="label-caps block text-ash/72">write to me</span>
                <span className="mt-1 block font-mono text-[0.7rem] text-bone/85">
                  {LINKS.email}
                </span>
              </span>
              <ArrowUpRight className="size-4 text-ash transition-colors group-hover:text-amber" />
            </a>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-bone/10 px-4 py-3.5 transition-colors duration-300 hover:border-amber/40"
            >
              <span>
                <span className="label-caps block text-ash/72">the commits</span>
                <span className="mt-1 block font-mono text-[0.7rem] text-bone/85">
                  github.com/{LINKS.githubUser}
                </span>
              </span>
              <ArrowUpRight className="size-4 text-ash transition-colors group-hover:text-amber" />
            </a>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
