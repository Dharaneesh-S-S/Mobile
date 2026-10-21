// Procedural ConvolverNode impulse response generator for realistic reverb without external audio files
export function createReverbImpulse(
  ctx: AudioContext,
  duration: number = 2.0,
  decay: number = 2.0,
  reverse: boolean = false
): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const length = sampleRate * duration
  const impulse = ctx.createBuffer(2, length, sampleRate)
  const left = impulse.getChannelData(0)
  const right = impulse.getChannelData(1)

  for (let i = 0; i < length; i++) {
    const n = reverse ? length - 1 - i : i
    // Exponential decay with slight noise modulation
    const envelope = Math.pow(1 - n / length, decay)
    left[i] = (Math.random() * 2 - 1) * envelope
    right[i] = (Math.random() * 2 - 1) * envelope
  }

  return impulse
}

export function getReverbBuffer(ctx: AudioContext, type: 'small' | 'hall' | 'stadium'): AudioBuffer {
  switch (type) {
    case 'small':
      return createReverbImpulse(ctx, 0.8, 3.5)
    case 'hall':
      return createReverbImpulse(ctx, 2.2, 2.0)
    case 'stadium':
      return createReverbImpulse(ctx, 4.0, 1.4)
    default:
      return createReverbImpulse(ctx, 0.1, 10.0)
  }
}
