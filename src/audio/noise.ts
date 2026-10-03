/**
 * Noise sources.
 *
 * Wind is not a tone and not white noise: it is a broadband hiss whose energy
 * sits low and moves around. Pink noise gets the slope right, brown gets the
 * weight, and a resonant band around whichever one you use is what makes it read
 * as air moving rather than as a broken tape.
 */

export function white(ctx: AudioContext, secs: number): AudioBuffer {
  const n = Math.floor(ctx.sampleRate * secs);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/** Paul Kellet's filter: -3dB per octave, the slope of real wind. */
export function pink(ctx: AudioContext, secs: number): AudioBuffer {
  const n = Math.floor(ctx.sampleRate * secs);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    b3 = 0,
    b4 = 0,
    b5 = 0,
    b6 = 0;
  for (let i = 0; i < n; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.969 * b2 + w * 0.153852;
    b3 = 0.8665 * b3 + w * 0.3104856;
    b4 = 0.55 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.016898;
    d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  return buf;
}

/** Leaky integrate of white: the low rumble under everything. */
export function brown(ctx: AudioContext, secs: number): AudioBuffer {
  const n = Math.floor(ctx.sampleRate * secs);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < n; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02;
    d[i] = last * 3.5;
  }
  return buf;
}
