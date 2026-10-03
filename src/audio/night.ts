import { brown, white } from "./noise";

/**
 * The field at night.
 *
 * Not a loop of somebody's field recording: cricket and grasshopper calls built
 * from the same parts the real insects use. A cricket chirp is a broadband click
 * shaped by a sharp resonance — a noise burst through a high-Q bandpass gives the
 * woody tick that a sine wave never does — repeated in short groups at each
 * insect's own pitch, tempo and position across the stereo field. Two
 * grasshoppers rasp underneath, and a brown-noise bed gives the whole thing a
 * floor so it does not sit on top of the music.
 *
 * No birds. Birds are dawn; this is the other end of the night.
 *
 * Everything is scheduled ahead of time against the audio clock rather than fired
 * from a timer, so the rhythm never jitters when the main thread is busy. The
 * group lengths are randomised per call, which is what stops it sounding like a
 * loop after a minute.
 */

interface Voice {
  next: number;
  period: number;
  jitter: number;
  emit: (t: number) => void;
}

const CRICKETS = [
  { freq: 4300, period: 0.62, pulses: 4, gain: 0.16, pan: -0.72, len: 0.03 },
  { freq: 4700, period: 0.48, pulses: 3, gain: 0.13, pan: 0.55, len: 0.026 },
  { freq: 3900, period: 0.94, pulses: 5, gain: 0.18, pan: -0.25, len: 0.032 },
  { freq: 5100, period: 0.37, pulses: 3, gain: 0.1, pan: 0.85, len: 0.022 },
  { freq: 3600, period: 1.21, pulses: 4, gain: 0.19, pan: 0.2, len: 0.036 },
  { freq: 4450, period: 0.71, pulses: 4, gain: 0.11, pan: -0.9, len: 0.028 },
  { freq: 4900, period: 0.55, pulses: 3, gain: 0.09, pan: 0.05, len: 0.024 },
];

const RASPERS = [
  { freq: 3200, period: 4.4, dur: 1.15, gain: 0.055, pan: 0.72, rattle: 11 },
  { freq: 2600, period: 6.9, dur: 1.6, gain: 0.045, pan: -0.62, rattle: 8.5 },
];

export function createNight(ctx: AudioContext, out: AudioNode) {
  const clicks = white(ctx, 1.5);
  const hiss = white(ctx, 2.5);
  const voices: Voice[] = [];
  const live: AudioScheduledSourceNode[] = [];

  /** One click: noise through a narrow resonance, with a fast wooden envelope. */
  const pulse = (t: number, freq: number, gain: number, pan: number, len: number) => {
    const src = ctx.createBufferSource();
    src.buffer = clicks;
    src.playbackRate.value = 0.85 + Math.random() * 0.3;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = freq;
    bp.Q.value = 16;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.0025);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);

    const p = ctx.createStereoPanner();
    p.pan.value = pan;

    src.connect(bp);
    bp.connect(g);
    g.connect(p);
    p.connect(out);
    src.start(t, Math.random() * 0.8, len + 0.05);
    src.stop(t + len + 0.06);
  };

  for (const c of CRICKETS) {
    voices.push({
      next: 0,
      period: c.period,
      jitter: 0.18,
      emit: (t) => {
        const n = c.pulses + (Math.random() < 0.35 ? 1 : 0);
        const gap = 0.024 + Math.random() * 0.012;
        const detune = 1 + (Math.random() - 0.5) * 0.05;
        for (let i = 0; i < n; i++) {
          pulse(t + i * gap, c.freq * detune, c.gain * (0.75 + Math.random() * 0.5), c.pan, c.len);
        }
      },
    });
  }

  for (const r of RASPERS) {
    voices.push({
      next: 0,
      period: r.period,
      jitter: 0.4,
      emit: (t) => {
        const src = ctx.createBufferSource();
        src.buffer = hiss;
        src.loop = true;

        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = r.freq * (0.92 + Math.random() * 0.16);
        bp.Q.value = 2.4;

        const g = ctx.createGain();
        const peak = r.gain * (0.7 + Math.random() * 0.6);
        const dur = r.dur * (0.7 + Math.random() * 0.7);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(peak, t + 0.07);
        g.gain.setValueAtTime(peak, t + dur - 0.14);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        // the rattle that makes it a grasshopper and not a hiss
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(r.rattle * (0.85 + Math.random() * 0.3), t);
        const lg = ctx.createGain();
        lg.gain.value = peak * 0.85;
        lfo.connect(lg);
        lg.connect(g.gain);

        const p = ctx.createStereoPanner();
        p.pan.value = r.pan;

        src.connect(bp);
        bp.connect(g);
        g.connect(p);
        p.connect(out);

        src.start(t);
        lfo.start(t);
        src.stop(t + dur + 0.05);
        lfo.stop(t + dur + 0.05);
      },
    });
  }

  // the floor the field stands on
  const bed = ctx.createBufferSource();
  bed.buffer = brown(ctx, 4);
  bed.loop = true;
  const bedLp = ctx.createBiquadFilter();
  bedLp.type = "lowpass";
  bedLp.frequency.value = 240;
  const bedGain = ctx.createGain();
  bedGain.gain.value = 0.075;
  bed.connect(bedLp);
  bedLp.connect(bedGain);
  bedGain.connect(out);
  bed.start();
  live.push(bed);

  const now = ctx.currentTime;
  for (const v of voices) v.next = now + Math.random() * v.period;

  const LOOKAHEAD = 0.6;
  const tick = () => {
    const until = ctx.currentTime + LOOKAHEAD;
    for (const v of voices) {
      let guard = 0;
      while (v.next < until && guard++ < 8) {
        if (v.next > ctx.currentTime) v.emit(v.next);
        v.next += v.period * (1 - v.jitter + Math.random() * v.jitter * 2);
      }
    }
  };
  tick();
  const timer = window.setInterval(tick, 150);

  return {
    stop() {
      window.clearInterval(timer);
      for (const s of live) {
        try {
          s.stop();
        } catch {
          /* already stopped */
        }
      }
    },
  };
}
