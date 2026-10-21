import { Track, UserSettings, RepeatMode } from '../types/music'
import { getReverbBuffer } from './impulseResponse'

export const EQ_FREQUENCIES = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]

export class AudioEngine {
  private static instance: AudioEngine | null = null

  public audio: HTMLAudioElement
  public ctx: AudioContext | null = null
  private source: MediaElementAudioSourceNode | null = null

  // Nodes in chain
  public eqFilters: BiquadFilterNode[] = []
  public bassFilter: BiquadFilterNode | null = null
  public compressor: DynamicsCompressorNode | null = null
  public panner: StereoPannerNode | null = null
  public masterGain: GainNode | null = null
  public preampGain: GainNode | null = null
  public analyser: AnalyserNode | null = null

  // Reverb nodes
  public convolver: ConvolverNode | null = null
  public reverbDryGain: GainNode | null = null
  public reverbWetGain: GainNode | null = null

  // State
  public currentTrack: Track | null = null
  public isPlaying: boolean = false
  public volume: number = 0.85
  public isMuted: boolean = false
  public speed: number = 1.0

  // A-B Repeat
  public markerA: number | null = null
  public markerB: number | null = null
  public isAbRepeatActive: boolean = false

  // Playback tracking
  private playLogged: boolean = false
  private currentObjectUrl: string | null = null

  // Sleep timer fading
  private sleepFadeInterval: number | null = null

  // Listeners
  public onTimeUpdate?: (currentTime: number, duration: number) => void
  public onTrackEnd?: () => void
  public onStateChange?: (isPlaying: boolean) => void
  public onError?: (msg: string) => void
  public onPlayCountThresholdReached?: (track: Track) => void

  private constructor() {
    this.audio = new Audio()
    this.audio.preload = 'auto'
    this.audio.crossOrigin = 'anonymous'

    this.setupAudioListeners()
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine()
    }
    return AudioEngine.instance
  }

  public initContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioContextClass()
      this.buildAudioGraph()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  private buildAudioGraph(): void {
    if (!this.ctx) return

    // 1. Source
    try {
      this.source = this.ctx.createMediaElementSource(this.audio)
    } catch (e) {
      console.warn('[AuraBeat] MediaElementSource init warning:', e)
      return
    }

    // 2. Preamp Gain
    this.preampGain = this.ctx.createGain()
    this.preampGain.gain.value = 1.0

    // 3. 10-Band Graphic Equalizer
    this.eqFilters = EQ_FREQUENCIES.map((freq) => {
      const filter = this.ctx!.createBiquadFilter()
      filter.type = 'peaking'
      filter.frequency.value = freq
      filter.Q.value = 1.414
      filter.gain.value = 0
      return filter
    })

    // 4. Bass Boost (LowShelf at 80Hz)
    this.bassFilter = this.ctx.createBiquadFilter()
    this.bassFilter.type = 'lowshelf'
    this.bassFilter.frequency.value = 80
    this.bassFilter.gain.value = 0

    // 5. Loudness Dynamics Compressor
    this.compressor = this.ctx.createDynamicsCompressor()
    this.compressor.threshold.value = -20
    this.compressor.knee.value = 30
    this.compressor.ratio.value = 4
    this.compressor.attack.value = 0.003
    this.compressor.release.value = 0.25

    // 6. Stereo Panner
    if (this.ctx.createStereoPanner) {
      this.panner = this.ctx.createStereoPanner()
      this.panner.pan.value = 0
    }

    // 7. Master Gain
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = this.volume

    // 8. Analyser for Visualizer
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = 512
    this.analyser.smoothingTimeConstant = 0.8

    // 9. Reverb Network (Dry/Wet)
    this.convolver = this.ctx.createConvolver()
    this.reverbDryGain = this.ctx.createGain()
    this.reverbWetGain = this.ctx.createGain()
    this.reverbDryGain.gain.value = 1.0
    this.reverbWetGain.gain.value = 0.0

    // Connect Chain:
    // source -> preamp -> EQ[0..9] -> bassFilter -> compressor
    let prevNode: AudioNode = this.source
    prevNode.connect(this.preampGain)
    prevNode = this.preampGain

    for (const filter of this.eqFilters) {
      prevNode.connect(filter)
      prevNode = filter
    }

    prevNode.connect(this.bassFilter)
    prevNode = this.bassFilter

    prevNode.connect(this.compressor)
    prevNode = this.compressor

    // Split for Reverb (Dry + Wet)
    prevNode.connect(this.reverbDryGain)
    prevNode.connect(this.convolver)
    this.convolver.connect(this.reverbWetGain)

    // Merge Reverb outputs into Panner
    const postReverbGain = this.ctx.createGain()
    this.reverbDryGain.connect(postReverbGain)
    this.reverbWetGain.connect(postReverbGain)

    if (this.panner) {
      postReverbGain.connect(this.panner)
      this.panner.connect(this.masterGain)
    } else {
      postReverbGain.connect(this.masterGain)
    }

    this.masterGain.connect(this.analyser)
    this.analyser.connect(this.ctx.destination)
  }

  private setupAudioListeners(): void {
    this.audio.addEventListener('timeupdate', () => {
      const cur = this.audio.currentTime
      const dur = this.audio.duration || this.currentTrack?.duration || 0

      // A-B Repeat logic
      if (this.isAbRepeatActive && this.markerA !== null && this.markerB !== null) {
        if (cur >= this.markerB) {
          this.audio.currentTime = this.markerA
          return
        }
      }

      // Check play count threshold (after 30 seconds or 50% played)
      if (!this.playLogged && this.currentTrack && dur > 0) {
        if (cur >= 30 || cur >= dur * 0.5) {
          this.playLogged = true
          this.onPlayCountThresholdReached?.(this.currentTrack)
        }
      }

      this.onTimeUpdate?.(cur, dur)
    })

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false
      this.onStateChange?.(false)
      this.onTrackEnd?.()
    })

    this.audio.addEventListener('play', () => {
      this.isPlaying = true
      this.onStateChange?.(true)
    })

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false
      this.onStateChange?.(false)
    })

    this.audio.addEventListener('error', (e) => {
      console.error('[AuraBeat] Audio error:', e)
      this.isPlaying = false
      this.onStateChange?.(false)
      this.onError?.('Failed to play track. File format may be unsupported or permission revoked.')
    })
  }

  // Load and play track
  public async playTrack(track: Track, startTime: number = 0, crossfadeSec: number = 0): Promise<void> {
    this.initContext()

    // Clean up previous blob URL
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl)
      this.currentObjectUrl = null
    }

    this.currentTrack = track
    this.playLogged = false

    // Reset A-B repeat for new track
    this.isAbRepeatActive = false
    this.markerA = null
    this.markerB = null

    // Determine Audio Source URL
    let srcUrl = ''
    if (track.audioBlob) {
      this.currentObjectUrl = URL.createObjectURL(track.audioBlob)
      srcUrl = this.currentObjectUrl
    } else if (track.filePath.startsWith('http') || track.filePath.startsWith('blob:')) {
      srcUrl = track.filePath
    }

    if (!srcUrl) {
      this.onError?.(`Audio file unavailable for "${track.title}"`)
      return
    }

    // Crossfade: gentle fade-in if requested
    if (crossfadeSec > 0 && this.masterGain && this.ctx) {
      const now = this.ctx.currentTime
      this.masterGain.gain.setValueAtTime(0.001, now)
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.volume, now + Math.min(crossfadeSec, 4))
    } else if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume
    }

    this.audio.src = srcUrl
    this.audio.playbackRate = this.speed
    if ('preservesPitch' in this.audio) {
      (this.audio as any).preservesPitch = true
    }

    this.audio.currentTime = startTime

    try {
      await this.audio.play()
      this.isPlaying = true
      this.onStateChange?.(true)
    } catch (err) {
      console.warn('[AuraBeat] play() error:', err)
      this.isPlaying = false
      this.onStateChange?.(false)
    }
  }

  public async resume(): Promise<void> {
    this.initContext()
    try {
      await this.audio.play()
      this.isPlaying = true
      this.onStateChange?.(true)
    } catch (err) {
      console.warn('[AuraBeat] resume() error:', err)
    }
  }

  public pause(): void {
    this.audio.pause()
    this.isPlaying = false
    this.onStateChange?.(false)
  }

  public togglePlayPause(): void {
    if (this.isPlaying) {
      this.pause()
    } else {
      this.resume()
    }
  }

  public seek(seconds: number): void {
    if (this.audio.duration) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration))
    }
  }

  public seekRelative(secondsOffset: number): void {
    if (this.audio.duration) {
      this.seek(this.audio.currentTime + secondsOffset)
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol))
    if (this.masterGain && !this.isMuted) {
      this.masterGain.gain.value = this.volume
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume
    }
    return this.isMuted
  }

  public setSpeed(speed: number): void {
    this.speed = Math.max(0.5, Math.min(2.0, speed))
    this.audio.playbackRate = this.speed
  }

  // A-B Repeat methods
  public setMarkerA(time?: number): void {
    this.markerA = typeof time === 'number' ? time : this.audio.currentTime
    if (this.markerB !== null && this.markerB <= this.markerA) {
      this.markerB = null
      this.isAbRepeatActive = false
    }
  }

  public setMarkerB(time?: number): void {
    const b = typeof time === 'number' ? time : this.audio.currentTime
    if (this.markerA !== null && b > this.markerA) {
      this.markerB = b
      this.isAbRepeatActive = true
    }
  }

  public clearAbRepeat(): void {
    this.markerA = null
    this.markerB = null
    this.isAbRepeatActive = false
  }

  // Equalizer & Sound settings apply
  public applySettings(settings: UserSettings): void {
    this.initContext()
    if (!this.ctx) return

    const enabled = settings.soundEffectsEnabled

    // 1. EQ Bands
    // If disabled, reset to 0
    // EQ presets can be applied directly to eqFilters
    // 2. Bass Boost
    if (this.bassFilter) {
      this.bassFilter.gain.value = enabled ? (settings.bassBoost / 100) * 12 : 0
    }

    // 3. Preamp
    if (this.preampGain) {
      const mult = Math.pow(10, (enabled ? settings.preamp : 0) / 20)
      this.preampGain.gain.value = mult
    }

    // 4. Stereo Panner
    if (this.panner) {
      this.panner.pan.value = enabled ? settings.balance : 0
    }

    // 5. Loudness Normalization
    if (this.compressor) {
      this.compressor.threshold.value = enabled && settings.loudnessNorm ? -20 : 0
    }

    // 6. Reverb Preset
    if (this.convolver && this.reverbWetGain && this.reverbDryGain) {
      if (enabled && settings.reverbPreset !== 'none') {
        this.convolver.buffer = getReverbBuffer(this.ctx, settings.reverbPreset)
        this.reverbWetGain.gain.value = 0.35
        this.reverbDryGain.gain.value = 0.85
      } else {
        this.reverbWetGain.gain.value = 0
        this.reverbDryGain.gain.value = 1.0
      }
    }

    // 7. Mono Audio
    if (this.ctx.destination) {
      this.ctx.destination.channelCount = settings.mono ? 1 : 2
    }

    // 8. Playback speed
    if (settings.playbackSpeed) {
      this.setSpeed(settings.playbackSpeed)
    }
  }

  // Set individual EQ filter band
  public setEqBandGain(bandIndex: number, gainDb: number): void {
    if (this.eqFilters[bandIndex]) {
      this.eqFilters[bandIndex].gain.value = Math.max(-12, Math.min(12, gainDb))
    }
  }

  public setAllEqBands(gains: number[]): void {
    gains.forEach((gain, idx) => {
      this.setEqBandGain(idx, gain)
    })
  }

  // Frequency response calculation for Canvas drawing
  public getFrequencyResponse(freqs: Float32Array): { mag: Float32Array; phase: Float32Array } {
    const mag = new Float32Array(freqs.length).fill(1)
    const phase = new Float32Array(freqs.length).fill(0)

    if (this.eqFilters.length === 0) return { mag, phase }

    const tempMag = new Float32Array(freqs.length)
    const tempPhase = new Float32Array(freqs.length)

    for (const filter of this.eqFilters) {
      filter.getFrequencyResponse(freqs, tempMag, tempPhase)
      for (let i = 0; i < freqs.length; i++) {
        mag[i] *= tempMag[i]
      }
    }

    if (this.bassFilter) {
      this.bassFilter.getFrequencyResponse(freqs, tempMag, tempPhase)
      for (let i = 0; i < freqs.length; i++) {
        mag[i] *= tempMag[i]
      }
    }

    return { mag, phase }
  }

  // Sleep timer gentle fade out over last 30 seconds
  public startSleepFade(totalSeconds: number, onComplete: () => void): void {
    if (this.sleepFadeInterval) clearInterval(this.sleepFadeInterval)

    const startTime = Date.now()
    const targetEnd = startTime + totalSeconds * 1000
    const fadeStart = targetEnd - 30 * 1000

    this.sleepFadeInterval = window.setInterval(() => {
      const now = Date.now()
      if (now >= targetEnd) {
        clearInterval(this.sleepFadeInterval!)
        this.sleepFadeInterval = null
        this.pause()
        this.setVolume(this.volume) // restore volume
        onComplete()
      } else if (now >= fadeStart && this.masterGain) {
        const remainingFade = (targetEnd - now) / 30000
        this.masterGain.gain.value = Math.max(0.001, this.volume * remainingFade)
      }
    }, 1000)
  }

  public cancelSleepTimer(): void {
    if (this.sleepFadeInterval) {
      clearInterval(this.sleepFadeInterval)
      this.sleepFadeInterval = null
      if (this.masterGain) {
        this.masterGain.gain.value = this.isMuted ? 0 : this.volume
      }
    }
  }

  // Visualizer data methods
  public getFrequencyData(array: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array)
    }
  }

  public getTimeDomainData(array: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array)
    }
  }
}

export const audioEngine = AudioEngine.getInstance()
