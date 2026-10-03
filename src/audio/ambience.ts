/**
 * The field, recorded.
 *
 * This was synthesised until a recording of it arrived, and the recording wins:
 * it is loaded, decoded and looped. Two things are worth knowing about how it is
 * played.
 *
 * The level is **measured, not guessed**. The buffer's own RMS is computed once
 * after decoding and the gain is set so the bed lands on TARGET_RMS whatever file
 * is dropped in — swap in a quieter or louder recording and it still sits under
 * the music instead of burying it. A hand-picked gain works exactly once.
 *
 * The loop is the decoded buffer's own, which is seamless. A recording this long
 * (a minute and a half) does not announce its seam the way a two-second one does,
 * and the wind moving over the top covers the rest.
 */

const URL = "/ambience/night.mp3";

/**
 * Where the bed should sit, ~-30 dBFS. A night recording has a low average and
 * occasional peaks — the crickets — so this is set low enough that the peaks
 * stay the loudest thing in the bed without rising over the music.
 */
const TARGET_RMS = 0.03;

/** The bed takes a moment to arrive, the way a room does. */
const FADE_IN = 1.6;

function rmsOf(buffer: AudioBuffer): number {
  let sum = 0;
  let n = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const d = buffer.getChannelData(c);
    // every 4th sample is plenty for a level estimate and 4x faster
    for (let i = 0; i < d.length; i += 4) {
      sum += d[i] * d[i];
      n++;
    }
  }
  return n ? Math.sqrt(sum / n) : 0;
}

export interface Ambience {
  stop: () => void;
}

export async function createAmbience(ctx: AudioContext, out: AudioNode): Promise<Ambience> {
  const silent: Ambience = { stop: () => {} };
  let buffer: AudioBuffer;
  try {
    const res = await fetch(URL);
    if (!res.ok) return silent;
    buffer = await ctx.decodeAudioData(await res.arrayBuffer());
    // the context can have been torn down while this was in flight
    if (ctx.state === "closed") return silent;
  } catch {
    return silent;
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;

  const gain = ctx.createGain();
  const rms = rmsOf(buffer);
  const level = rms > 0.0001 ? Math.min(12, TARGET_RMS / rms) : 1;
  gain.gain.value = 0;

  src.connect(gain);
  gain.connect(out);
  src.start(0);
  gain.gain.setTargetAtTime(level, ctx.currentTime, FADE_IN / 2);

  return {
    stop: () => {
      try {
        src.stop();
      } catch {
        /* already stopped */
      }
    },
  };
}
