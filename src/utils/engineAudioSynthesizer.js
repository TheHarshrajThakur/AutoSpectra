/**
 * SpectraAudio: Web Audio API Procedural V8 Sound Synthesizer
 * 
 * Generates pure mathematical acoustics for an internal combustion V8 engine:
 * - Cylinder firing fundamental frequency: f = (RPM * 8) / 120
 * - Cross-plane crank sub-harmonics (rumble & lope)
 * - Waveshaper non-linear manifold distortion (exhaust rasp)
 * - Roots supercharger whine oscillator (pitch-tracked to pulley ratio)
 * - Turbo blow-off valve (BOV) flutter upon rapid throttle lift
 * - Mechanical fault sounds: Rod knock metallic impact & detonation ping
 * - AnalyserNode for real-time FFT frequency spectrum analysis
 */

class EngineAudioSynthesizer {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.analyser = null

    // Oscillators & Gains
    this.firingOsc = null
    this.firingGain = null
    this.subBassOsc = null
    this.subBassGain = null
    this.superchargerOsc = null
    this.superchargerGain = null
    this.exhaustShaper = null
    this.exhaustFilter = null

    // Fault sound generator
    this.knockIntervalId = null
    this.activeFault = 'none'

    this.isRunning = false
    this.currentRpm = 0
    this.targetRpm = 0
    this.throttle = 0 // 0 to 1
    this.lastThrottle = 0

    // Animation frame for smooth RPM lerping
    this.rafId = null
  }

  init() {
    if (this.ctx) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return

    this.ctx = new AudioContext()

    // Master Gain: MUST BE 0 INITIALLY SO NO SOUND PLAYS BEFORE IGNITION
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime)

    // Analyser Node for FFT Visualizer
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = 512
    this.analyser.smoothingTimeConstant = 0.8
    this.masterGain.connect(this.analyser)
    this.analyser.connect(this.ctx.destination)

    // Non-linear Waveshaper for exhaust rasp
    this.exhaustShaper = this.ctx.createWaveShaper()
    this.exhaustShaper.curve = this._makeDistortionCurve(18)
    this.exhaustShaper.oversample = '2x'

    // Low-pass / Band-pass filter for exhaust cavity resonance
    this.exhaustFilter = this.ctx.createBiquadFilter()
    this.exhaustFilter.type = 'lowpass'
    this.exhaustFilter.frequency.setValueAtTime(800, this.ctx.currentTime)
    this.exhaustFilter.Q.setValueAtTime(2.5, this.ctx.currentTime)

    this.exhaustShaper.connect(this.exhaustFilter)
    this.exhaustFilter.connect(this.masterGain)

    // 1. Primary Cylinder Firing Oscillator
    this.firingOsc = this.ctx.createOscillator()
    this.firingOsc.type = 'sawtooth'
    this.firingGain = this.ctx.createGain()
    this.firingGain.gain.setValueAtTime(0, this.ctx.currentTime)
    this.firingOsc.connect(this.firingGain)
    this.firingGain.connect(this.exhaustShaper)
    this.firingOsc.start()

    // 2. Sub-Bass Crankshaft Rumble Oscillator
    this.subBassOsc = this.ctx.createOscillator()
    this.subBassOsc.type = 'sine'
    this.subBassGain = this.ctx.createGain()
    this.subBassGain.gain.setValueAtTime(0, this.ctx.currentTime)
    this.subBassOsc.connect(this.subBassGain)
    this.subBassGain.connect(this.masterGain)
    this.subBassOsc.start()

    // 3. Roots Supercharger Whine
    this.superchargerOsc = this.ctx.createOscillator()
    this.superchargerOsc.type = 'triangle'
    this.superchargerGain = this.ctx.createGain()
    this.superchargerGain.gain.setValueAtTime(0, this.ctx.currentTime)
    
    const scFilter = this.ctx.createBiquadFilter()
    scFilter.type = 'bandpass'
    scFilter.frequency.setValueAtTime(1600, this.ctx.currentTime)
    scFilter.Q.setValueAtTime(6.0, this.ctx.currentTime)

    this.superchargerOsc.connect(this.superchargerGain)
    this.superchargerGain.connect(scFilter)
    scFilter.connect(this.masterGain)
    this.superchargerOsc.start()

    // Immediately suspend until start() is explicitly invoked
    try {
      if (this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {})
      }
    } catch (e) {}

    this._startPhysicsLoop()
  }

  _makeDistortionCurve(amount = 20) {
    const k = typeof amount === 'number' ? amount : 50
    const n_samples = 44100
    const curve = new Float32Array(n_samples)
    const deg = Math.PI / 180
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
    }
    return curve
  }

  start() {
    if (!this.ctx) this.init()
    if (!this.ctx) return

    this.isRunning = true
    if (this.currentRpm < 850) {
      this.currentRpm = 850
    }
    this.targetRpm = 850 + this.throttle * (8500 - 850)

    const applyMasterGain = () => {
      if (!this.ctx || !this.isRunning || !this.masterGain) return
      const now = this.ctx.currentTime
      try {
        this.masterGain.gain.cancelScheduledValues(now)
        this.masterGain.gain.setValueAtTime(0, now)
        this.masterGain.gain.linearRampToValueAtTime(0.35, now + 0.08)
      } catch (e) {
        this.masterGain.gain.setValueAtTime(0.35, now)
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(applyMasterGain).catch(() => {})
    } else {
      applyMasterGain()
    }
  }

  stop() {
    this.isRunning = false
    this.targetRpm = 0
    this.currentRpm = 0
    this.clearFaults()

    if (this.ctx) {
      const now = this.ctx.currentTime
      // Immediately cancel all scheduled ramps and zero out master + individual oscillator gains
      try {
        if (this.masterGain) {
          this.masterGain.gain.cancelScheduledValues(now)
          this.masterGain.gain.setValueAtTime(0, now)
        }
        if (this.firingGain) {
          this.firingGain.gain.cancelScheduledValues(now)
          this.firingGain.gain.setValueAtTime(0, now)
        }
        if (this.subBassGain) {
          this.subBassGain.gain.cancelScheduledValues(now)
          this.subBassGain.gain.setValueAtTime(0, now)
        }
        if (this.superchargerGain) {
          this.superchargerGain.gain.cancelScheduledValues(now)
          this.superchargerGain.gain.setValueAtTime(0, now)
        }
      } catch (e) {}

      // Immediately suspend audio context for 100% hardware silence
      try {
        if (this.ctx.state !== 'suspended') {
          this.ctx.suspend().catch(() => {})
        }
      } catch (e) {}
    }
  }

  setRpm(rpm) {
    if (!this.isRunning) return
    this.targetRpm = Math.max(0, Math.min(8800, rpm))
  }

  setThrottle(val) {
    this.throttle = Math.max(0, Math.min(1, val))
    if (this.isRunning) {
      this.targetRpm = 850 + this.throttle * (8500 - 850)
    }
  }

  _startPhysicsLoop() {
    const loop = () => {
      if (this.ctx && this.firingGain && this.isRunning && this.currentRpm > 100) {
        // Inertia Lerp
        const lerpRate = this.targetRpm > this.currentRpm ? 0.12 : 0.04
        this.currentRpm += (this.targetRpm - this.currentRpm) * lerpRate

        const now = this.ctx.currentTime

        // V8 4-stroke firing frequency: (RPM * 8) / 120
        const fundamentalFreq = (this.currentRpm * 8) / 120
        this.firingOsc.frequency.setTargetAtTime(fundamentalFreq, now, 0.03)
        this.subBassOsc.frequency.setTargetAtTime(Math.max(25, fundamentalFreq * 0.5), now, 0.03)

        const scFreq = Math.max(300, (this.currentRpm / 60) * 2.1 * 16)
        this.superchargerOsc.frequency.setTargetAtTime(scFreq, now, 0.03)

        const filterFreq = 400 + (this.currentRpm / 8500) * 3200
        this.exhaustFilter.frequency.setTargetAtTime(filterFreq, now, 0.03)

        // Volume dynamics
        const loadFactor = (this.currentRpm - 850) / 7650
        const firingVol = 0.22 + loadFactor * 0.35
        const subBassVol = 0.35 + (1 - loadFactor * 0.5) * 0.2
        const scVol = loadFactor * 0.08

        this.firingGain.gain.setTargetAtTime(firingVol, now, 0.04)
        this.subBassGain.gain.setTargetAtTime(subBassVol, now, 0.04)
        this.superchargerGain.gain.setTargetAtTime(scVol, now, 0.04)

        // Blow-off valve on rapid lift
        if (this.lastThrottle > 0.6 && this.throttle < 0.2) {
          this.playBovFlutter()
        }
        this.lastThrottle = this.throttle
      }
      this.rafId = requestAnimationFrame(loop)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  // Blow-off Valve (BOV) Flutter
  playBovFlutter() {
    if (!this.ctx || !this.isRunning || this.ctx.state !== 'running' || !this.masterGain) return
    const now = this.ctx.currentTime

    const bufferSize = this.ctx.sampleRate * 0.5
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12))
    }

    const whiteNoise = this.ctx.createBufferSource()
    whiteNoise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(2200, now)
    filter.Q.setValueAtTime(5.0, now)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

    whiteNoise.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    whiteNoise.start(now)
  }

  // Inject Simulated Fault Sound
  injectFault(faultType) {
    this.clearFaults()
    this.activeFault = faultType
    if (!this.ctx || !this.isRunning || this.ctx.state !== 'running') return

    if (faultType === 'rod_knock') {
      const knockFreqMs = Math.max(45, (60 / Math.max(850, this.currentRpm)) * 1000)
      this.knockIntervalId = setInterval(() => {
        if (!this.isRunning || !this.ctx || this.ctx.state !== 'running') return
        this._playMetallicKnock(1800, 0.4)
      }, knockFreqMs)
    } else if (faultType === 'detonation') {
      this.knockIntervalId = setInterval(() => {
        if (!this.isRunning || !this.ctx || this.ctx.state !== 'running') return
        this._playMetallicKnock(4500 + Math.random() * 1200, 0.25)
      }, 70 + Math.random() * 50)
    } else if (faultType === 'misfire') {
      this.knockIntervalId = setInterval(() => {
        if (!this.isRunning || !this.ctx || this.ctx.state !== 'running') return
        const stumble = (Math.random() - 0.5) * 200
        this.currentRpm = Math.max(500, this.currentRpm + stumble)
      }, 120)
    }
  }

  _playMetallicKnock(freq = 2000, volume = 0.3) {
    if (!this.ctx || !this.isRunning || this.ctx.state !== 'running' || !this.masterGain) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04)

    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 0.06)
  }

  clearFaults() {
    if (this.knockIntervalId) {
      clearInterval(this.knockIntervalId)
      this.knockIntervalId = null
    }
    this.activeFault = 'none'
  }

  getSpectrumData() {
    if (!this.analyser || !this.isRunning || !this.ctx || this.ctx.state !== 'running') return new Uint8Array(128)
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(dataArray)
    return dataArray
  }

  getWaveformData() {
    if (!this.analyser || !this.isRunning || !this.ctx || this.ctx.state !== 'running') return new Uint8Array(128)
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteTimeDomainData(dataArray)
    return dataArray
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.clearFaults()
    if (this.ctx) {
      this.ctx.close().catch(() => {})
      this.ctx = null
    }
  }
}

export const engineAudio = new EngineAudioSynthesizer()
