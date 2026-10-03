import { subscribeAir } from "@/lib/air";
import { createAmbience } from "./ambience";
import { createWind } from "./wind";

/**
 * The room's audio, in one place.
 *
 * Browsers will not let a page make noise before the visitor has done something,
 * so nothing is built until the first gesture — and the whole graph is built at
 * once, then left running. Gusts, the night bed and music are separate buses
 * under one master, which is what the volume bar moves.
 *
 * The wind is the reason this is a module and not a hook: it reads the same gust
 * envelope that moves the folders, every frame, and a React re-render per frame
 * would be absurd.
 */

export interface SoundState {
  muted: boolean;
  volume: number;
}

const STORE_KEY = "ode:sound";

function load(): Pick<SoundState, "muted" | "volume"> {
  if (typeof localStorage === "undefined") return { muted: false, volume: 0.6 };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { muted: false, volume: 0.6 };
    const p = JSON.parse(raw) as Partial<SoundState>;
    return {
      muted: typeof p.muted === "boolean" ? p.muted : false,
      volume: typeof p.volume === "number" ? Math.min(1, Math.max(0, p.volume)) : 0.6,
    };
  } catch {
    return { muted: false, volume: 0.6 };
  }
}

let state: SoundState = load();
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambience: GainNode | null = null;
let musicBus: GainNode | null = null;
let wind: ReturnType<typeof createWind> | null = null;
let bed: ReturnType<typeof createAmbience> extends Promise<infer T> ? T | null : never = null;
let unsub: (() => void) | null = null;

const subs = new Set<() => void>();
const emit = () => {
  for (const fn of subs) fn();
};

export function subscribeSound(fn: () => void): () => void {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

export function getSound(): SoundState {
  return state;
}

function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ muted: state.muted, volume: state.volume }));
  } catch {
    /* private mode, no storage; the session still works */
  }
}

/** Build the graph and start the room. Safe to call repeatedly. */
export function unlockSound() {
  if (typeof window === "undefined") return;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return;

  if (!ctx) {
    ctx = new Ctor();
    master = ctx.createGain();
    // up from nothing, then faded in below, so the room never slams on
    master.gain.value = 0;
    master.connect(ctx.destination);

    ambience = ctx.createGain();
    ambience.gain.value = 0.9;
    ambience.connect(master);

    musicBus = ctx.createGain();
    musicBus.gain.value = 0.95;
    musicBus.connect(master);

    wind = createWind(ctx, ambience);
    // decoding is async; the bed arrives a beat after the wind does
    const bus = ambience;
    void createAmbience(ctx, bus).then((a) => {
      bed = a;
    });
    unsub = subscribeAir((air) => {
      if (ctx) wind?.follow(air.gust, ctx.currentTime);
    });
  }
  if (ctx.state === "suspended") void ctx.resume();
  // a couple of seconds up from silence, the way a room fills
  if (!state.muted) master?.gain.setTargetAtTime(state.volume, ctx.currentTime, 0.7);
}

/**
 * Route a media element through the master bus, so the volume bar moves the
 * music too. A media element can only be captured once; the WeakSet makes that
 * safe to call on every render.
 */
const captured = new WeakSet<HTMLMediaElement>();
export function attachMusic(el: HTMLMediaElement) {
  if (!ctx || !musicBus || captured.has(el)) return;
  captured.add(el);
  try {
    const src = ctx.createMediaElementSource(el);
    src.connect(musicBus);
  } catch {
    /* already captured by another context; the element still plays */
  }
}

export function setMuted(muted: boolean) {
  state = { ...state, muted };
  persist();
  if (ctx && master) master.gain.setTargetAtTime(state.muted ? 0 : state.volume, ctx.currentTime, 0.06);
  emit();
}

export function setVolume(volume: number) {
  state = { ...state, volume: Math.min(1, Math.max(0, volume)), muted: volume > 0 ? false : state.muted };
  persist();
  if (ctx && master) master.gain.setTargetAtTime(state.muted ? 0 : state.volume, ctx.currentTime, 0.05);
  emit();
}

export function teardownSound() {
  unsub?.();
  unsub = null;
  bed?.stop();
  bed = null;
  wind?.stop();
  wind = null;
  void ctx?.close();
  ctx = null;
  master = null;
  ambience = null;
  musicBus = null;
}
