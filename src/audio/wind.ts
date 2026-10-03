import { pink } from "./noise";

/**
 * The wind.
 *
 * A burst of wind is not one sound, it is three arriving together, which is why
 * a single noise loop never convinces: a low body that swells, a narrow resonant
 * band that climbs as the gust builds (the "whoo"), and a hiss that only exists
 * at the peak — the air tearing at the edges. All three are driven from the gust
 * envelope that moves the folders, so what you hear and what you see are the same
 * event rather than two effects that happen to be on together.
 *
 * The whole voice is built once and left running; gusts only move gains and
 * filter cutoffs, so there is nothing to allocate when the wind actually starts.
 */
export function createWind(ctx: AudioContext, out: AudioNode) {
  const src = ctx.createBufferSource();
  src.buffer = pink(ctx, 4);
  src.loop = true;

  // the body
  const body = ctx.createBiquadFilter();
  body.type = "bandpass";
  body.frequency.value = 420;
  body.Q.value = 0.9;
  const bodyGain = ctx.createGain();
  bodyGain.gain.value = 0;

  // the whistle, narrow enough to have a pitch of its own
  const whistle = ctx.createBiquadFilter();
  whistle.type = "bandpass";
  whistle.frequency.value = 900;
  whistle.Q.value = 7;
  const whistleGain = ctx.createGain();
  whistleGain.gain.value = 0;

  // the hiss, only at the top of a push
  const hiss = ctx.createBiquadFilter();
  hiss.type = "highpass";
  hiss.frequency.value = 2600;
  const hissGain = ctx.createGain();
  hissGain.gain.value = 0;

  src.connect(body).connect(bodyGain).connect(out);
  src.connect(whistle).connect(whistleGain).connect(out);
  src.connect(hiss).connect(hissGain).connect(out);
  src.start();

  let lastDir = 1;

  return {
    /** Follow the gust envelope. Called every frame from the air engine. */
    follow(gust: number, now: number) {
      const m = Math.abs(gust);
      if (m > 0.02) lastDir = Math.sign(gust) || 1;

      // a hair of air always moving, so the room is never dead
      bodyGain.gain.setTargetAtTime(0.015 + m * 0.5, now, 0.05);
      whistleGain.gain.setTargetAtTime(Math.max(0, m - 0.25) * 0.16, now, 0.07);
      hissGain.gain.setTargetAtTime(Math.max(0, m - 0.5) * 0.22, now, 0.035);

      // the pitch climbs with the gust and comes back down after it
      body.frequency.setTargetAtTime(360 + m * 780, now, 0.08);
      whistle.frequency.setTargetAtTime(760 + m * 1100, now, 0.09);
      hiss.frequency.setTargetAtTime(2400 + m * 1400, now, 0.06);
    },
    /** +1 or -1: which way the last real gust was going. */
    get direction() {
      return lastDir;
    },
    stop() {
      try {
        src.stop();
      } catch {
        /* already stopped */
      }
    },
  };
}
