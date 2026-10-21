import { Track } from '../types/music'

// Helper to create an audio WAV blob using OfflineAudioContext
async function renderSynthesizedWav(type: 'synthwave' | 'lofi' | 'acoustic' | 'cyber', durationSec: number = 18): Promise<Blob> {
  const sampleRate = 44100
  const totalSamples = Math.floor(sampleRate * durationSec)
  const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate)

  const masterGain = offlineCtx.createGain()
  masterGain.gain.setValueAtTime(0.7, 0)
  masterGain.gain.setValueAtTime(0.7, durationSec - 2)
  masterGain.gain.linearRampToValueAtTime(0.001, durationSec)
  masterGain.connect(offlineCtx.destination)

  if (type === 'synthwave') {
    // Synthwave: Bass pulses (C2, Eb2, F2, G2) + arpeggiated lead + rhythmic kick/hi-hat
    const bassNotes = [65.41, 77.78, 87.31, 98.00]
    for (let t = 0; t < durationSec; t += 0.5) {
      const note = bassNotes[Math.floor(t / 2) % bassNotes.length]
      const osc = offlineCtx.createOscillator()
      const oscGain = offlineCtx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(note, t)

      const filter = offlineCtx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800, t)
      filter.frequency.exponentialRampToValueAtTime(150, t + 0.45)

      oscGain.gain.setValueAtTime(0.35, t)
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.48)

      osc.connect(filter)
      filter.connect(oscGain)
      oscGain.connect(masterGain)
      osc.start(t)
      osc.stop(t + 0.5)
    }

    // Lead arpeggio
    const arpNotes = [261.63, 311.13, 392.00, 523.25, 466.16, 392.00]
    for (let t = 0; t < durationSec; t += 0.25) {
      const freq = arpNotes[Math.floor(t * 4) % arpNotes.length]
      const leadOsc = offlineCtx.createOscillator()
      const leadGain = offlineCtx.createGain()
      leadOsc.type = 'square'
      leadOsc.frequency.setValueAtTime(freq, t)
      leadGain.gain.setValueAtTime(0.12, t)
      leadGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
      leadOsc.connect(leadGain)
      leadGain.connect(masterGain)
      leadOsc.start(t)
      leadOsc.stop(t + 0.24)
    }
  } else if (type === 'lofi') {
    // Warm Lo-Fi electric piano chords & smooth sub bass
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ]
    for (let c = 0; c < durationSec; c += 2.0) {
      const chord = chords[Math.floor(c / 2) % chords.length]
      chord.forEach((freq) => {
        const osc = offlineCtx.createOscillator()
        const g = offlineCtx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, c)
        g.gain.setValueAtTime(0.12, c)
        g.gain.exponentialRampToValueAtTime(0.005, c + 1.9)
        osc.connect(g)
        g.connect(masterGain)
        osc.start(c)
        osc.stop(c + 1.95)
      })
    }
  } else if (type === 'acoustic') {
    // Plucked acoustic harmonics (D, F#, A, B, E)
    const pluckFreqs = [293.66, 369.99, 440.00, 493.88, 659.25, 587.33, 440.00]
    for (let t = 0; t < durationSec; t += 0.35) {
      const freq = pluckFreqs[Math.floor(t * 3) % pluckFreqs.length]
      const osc = offlineCtx.createOscillator()
      const g = offlineCtx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      g.gain.setValueAtTime(0.25, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6)
      osc.connect(g)
      g.connect(masterGain)
      osc.start(t)
      osc.stop(t + 0.65)
    }
  } else {
    // Cyber Pulse: 4-on-the-floor kick + rising resonance sweep
    for (let t = 0; t < durationSec; t += 0.5) {
      const kick = offlineCtx.createOscillator()
      const kickG = offlineCtx.createGain()
      kick.frequency.setValueAtTime(130, t)
      kick.frequency.exponentialRampToValueAtTime(35, t + 0.2)
      kickG.gain.setValueAtTime(0.6, t)
      kickG.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
      kick.connect(kickG)
      kickG.connect(masterGain)
      kick.start(t)
      kick.stop(t + 0.28)
    }
    // High hat
    for (let t = 0.25; t < durationSec; t += 0.5) {
      const osc = offlineCtx.createOscillator()
      const g = offlineCtx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(8000, t)
      g.gain.setValueAtTime(0.08, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
      osc.connect(g)
      g.connect(masterGain)
      osc.start(t)
      osc.stop(t + 0.1)
    }
  }

  const renderedBuffer = await offlineCtx.startRendering()
  return bufferToWave(renderedBuffer, totalSamples)
}

// Convert AudioBuffer to WAV Blob
function bufferToWave(abuffer: AudioBuffer, totalSamples: number): Blob {
  const numOfChan = abuffer.numberOfChannels
  const length = totalSamples * numOfChan * 2 + 44
  const outBuffer = new ArrayBuffer(length)
  const view = new DataView(outBuffer)
  let pos = 0

  function setUint16(data: number) {
    view.setUint16(pos, data, true)
    pos += 2
  }
  function setUint32(data: number) {
    view.setUint32(pos, data, true)
    pos += 4
  }

  // RIFF identifier
  view.setUint32(pos, 0x46464952, true) // "RIFF"
  pos += 4
  setUint32(length - 8)
  view.setUint32(pos, 0x45564157, true) // "WAVE"
  pos += 4
  view.setUint32(pos, 0x20746d66, true) // "fmt "
  pos += 4
  setUint32(16) // Subchunk1Size (16 for PCM)
  setUint16(1)  // AudioFormat (1 for PCM)
  setUint16(numOfChan)
  setUint32(abuffer.sampleRate)
  setUint32(abuffer.sampleRate * 2 * numOfChan) // byte rate
  setUint16(numOfChan * 2) // block align
  setUint16(16) // bits per sample

  view.setUint32(pos, 0x61746164, true) // "data"
  pos += 4
  setUint32(length - pos - 4)

  // Write interleaved PCM samples
  const channels: Float32Array[] = []
  for (let i = 0; i < numOfChan; i++) {
    channels.push(abuffer.getChannelData(i))
  }

  for (let i = 0; i < totalSamples; i++) {
    for (let ch = 0; ch < numOfChan; ch++) {
      let sample = Math.max(-1, Math.min(1, channels[ch][i]))
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0
      view.setInt16(pos, sample, true)
      pos += 2
    }
  }

  return new Blob([outBuffer], { type: 'audio/wav' })
}

// Generate stylish procedural SVG album arts
export function createGradientCover(title: string, artist: string, fromColor: string, toColor: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${fromColor}" />
        <stop offset="100%" stop-color="${toColor}" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
    <!-- Vinyl record rings -->
    <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
    <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
    <circle cx="200" cy="200" r="75" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
    <!-- Center Label -->
    <circle cx="200" cy="200" r="42" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.25)" stroke-width="2" />
    <circle cx="200" cy="200" r="10" fill="#ffffff" />
    <!-- Sound Waves Icon -->
    <path d="M 175 140 Q 185 125 195 140 T 215 140 T 235 140" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8" />
    <!-- Typography -->
    <text x="200" y="320" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="1">${title}</text>
    <text x="200" y="348" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="500" font-size="13" fill="rgba(255,255,255,0.8)" letter-spacing="2">${artist.toUpperCase()}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export async function generateDemoTracks(): Promise<Track[]> {
  const cover1 = createGradientCover('Neon Horizon', 'Aura Soundscapes', '#8b5cf6', '#ec4899')
  const cover2 = createGradientCover('Midnight Lofi', 'Echo Drift', '#06b6d4', '#3b82f6')
  const cover3 = createGradientCover('Acoustic Sunrise', 'Solar Strings', '#f59e0b', '#ef4444')
  const cover4 = createGradientCover('Cyber Pulse', 'HyperWave', '#10b981', '#06b6d4')

  const [blob1, blob2, blob3, blob4] = await Promise.all([
    renderSynthesizedWav('synthwave', 22),
    renderSynthesizedWav('lofi', 24),
    renderSynthesizedWav('acoustic', 20),
    renderSynthesizedWav('cyber', 21),
  ])

  const demo1: Track = {
    id: 'demo-track-1',
    title: 'Neon Horizon',
    artist: 'Aura Soundscapes',
    album: 'Retrograde Dreams',
    albumArtist: 'Aura Soundscapes',
    genre: 'Synthwave',
    year: 2026,
    trackNo: 1,
    discNo: 1,
    duration: 22,
    coverArt: cover1,
    lyrics: `[00:00.00] (Instrumental Synthwave Intro)
[00:02.00] In the glow of the neon light
[00:06.00] Chasing the horizon into the digital night
[00:10.50] Analog rhythms calling our name
[00:15.00] Echoes of the future, always the same
[00:19.00] (Synthwave Outro)`,
    syncedLyrics: [
      { time: 0, text: '(Instrumental Synthwave Intro)' },
      { time: 2.0, text: 'In the glow of the neon light' },
      { time: 6.0, text: 'Chasing the horizon into the digital night' },
      { time: 10.5, text: 'Analog rhythms calling our name' },
      { time: 15.0, text: 'Echoes of the future, always the same' },
      { time: 19.0, text: '(Synthwave Outro)' },
    ],
    filePath: 'internal://demo/Neon Horizon.wav',
    fileName: 'Neon Horizon.wav',
    fileSize: blob1.size,
    fileFormat: 'wav',
    bitrate: 1411,
    sampleRate: 44100,
    channels: 2,
    dateAdded: new Date(Date.now() - 86400000 * 3).toISOString(),
    playCount: 14,
    lastPlayed: new Date(Date.now() - 3600000 * 2).toISOString(),
    isFavorite: true,
    audioBlob: blob1,
    isDemo: true,
  }

  const demo2: Track = {
    id: 'demo-track-2',
    title: 'Midnight Lofi',
    artist: 'Echo Drift',
    album: 'Coffee & Cassettes',
    albumArtist: 'Echo Drift',
    genre: 'Lo-Fi Chill',
    year: 2026,
    trackNo: 2,
    discNo: 1,
    duration: 24,
    coverArt: cover2,
    lyrics: `[00:00.00] (Vinyl crackle & Warm Rhodes)
[00:04.00] Soft rain outside the window sill
[00:08.50] Time stands still in the midnight chill
[00:13.00] A mellow sub-bass warms the room
[00:18.00] Chasing away the winter gloom
[00:22.00] (Gentle Fade)`,
    syncedLyrics: [
      { time: 0, text: '(Vinyl crackle & Warm Rhodes)' },
      { time: 4.0, text: 'Soft rain outside the window sill' },
      { time: 8.5, text: 'Time stands still in the midnight chill' },
      { time: 13.0, text: 'A mellow sub-bass warms the room' },
      { time: 18.0, text: 'Chasing away the winter gloom' },
      { time: 22.0, text: '(Gentle Fade)' },
    ],
    filePath: 'internal://demo/Midnight Lofi.wav',
    fileName: 'Midnight Lofi.wav',
    fileSize: blob2.size,
    fileFormat: 'wav',
    bitrate: 1411,
    sampleRate: 44100,
    channels: 2,
    dateAdded: new Date(Date.now() - 86400000 * 2).toISOString(),
    playCount: 9,
    lastPlayed: new Date(Date.now() - 3600000 * 6).toISOString(),
    isFavorite: true,
    audioBlob: blob2,
    isDemo: true,
  }

  const demo3: Track = {
    id: 'demo-track-3',
    title: 'Acoustic Sunrise',
    artist: 'Solar Strings',
    album: 'Golden Hour Sessions',
    albumArtist: 'Solar Strings',
    genre: 'Acoustic',
    year: 2025,
    trackNo: 1,
    discNo: 1,
    duration: 20,
    coverArt: cover3,
    lyrics: `[00:00.00] (Acoustic Plucked Intro)
[00:03.00] First golden ray touches the hill
[00:07.50] Morning breeze, quiet and still
[00:12.00] Melody dancing on wooden frets
[00:16.50] New beginnings with no regrets`,
    syncedLyrics: [
      { time: 0, text: '(Acoustic Plucked Intro)' },
      { time: 3.0, text: 'First golden ray touches the hill' },
      { time: 7.5, text: 'Morning breeze, quiet and still' },
      { time: 12.0, text: 'Melody dancing on wooden frets' },
      { time: 16.5, text: 'New beginnings with no regrets' },
    ],
    filePath: 'internal://demo/Acoustic Sunrise.wav',
    fileName: 'Acoustic Sunrise.wav',
    fileSize: blob3.size,
    fileFormat: 'wav',
    bitrate: 1411,
    sampleRate: 44100,
    channels: 2,
    dateAdded: new Date(Date.now() - 86400000 * 1).toISOString(),
    playCount: 6,
    lastPlayed: new Date(Date.now() - 3600000 * 14).toISOString(),
    isFavorite: false,
    audioBlob: blob3,
    isDemo: true,
  }

  const demo4: Track = {
    id: 'demo-track-4',
    title: 'Cyber Pulse',
    artist: 'HyperWave',
    album: 'Overdrive Metropolis',
    albumArtist: 'HyperWave',
    genre: 'Electronic',
    year: 2026,
    trackNo: 4,
    discNo: 1,
    duration: 21,
    coverArt: cover4,
    lyrics: `[00:00.00] (4-on-the-floor Beat)
[00:04.00] Bassline pumping through the wire
[00:08.00] Cybernetic electric fire
[00:12.50] Jump to the pulse and feel the drive
[00:17.00] In the machine we come alive`,
    syncedLyrics: [
      { time: 0, text: '(4-on-the-floor Beat)' },
      { time: 4.0, text: 'Bassline pumping through the wire' },
      { time: 8.0, text: 'Cybernetic electric fire' },
      { time: 12.5, text: 'Jump to the pulse and feel the drive' },
      { time: 17.0, text: 'In the machine we come alive' },
    ],
    filePath: 'internal://demo/Cyber Pulse.wav',
    fileName: 'Cyber Pulse.wav',
    fileSize: blob4.size,
    fileFormat: 'wav',
    bitrate: 1411,
    sampleRate: 44100,
    channels: 2,
    dateAdded: new Date().toISOString(),
    playCount: 19,
    lastPlayed: new Date().toISOString(),
    isFavorite: true,
    audioBlob: blob4,
    isDemo: true,
  }

  return [demo1, demo2, demo3, demo4]
}
