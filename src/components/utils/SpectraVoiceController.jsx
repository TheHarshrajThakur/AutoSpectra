import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, Terminal, ChevronUp, ChevronDown } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { engineAudio } from '../../utils/engineAudioSynthesizer'

export default function SpectraVoiceController() {
  const isVoiceActive = useStore(state => state.isVoiceActive)
  const setVoiceActive = useStore(state => state.setVoiceActive)
  const voiceFeedbackText = useStore(state => state.voiceFeedbackText)
  const setVoiceFeedbackText = useStore(state => state.setVoiceFeedbackText)
  const lastSpokenCommand = useStore(state => state.lastSpokenCommand)
  const setLastSpokenCommand = useStore(state => state.setLastSpokenCommand)

  const setVisionMode = useStore(state => state.setVisionMode)
  const setIsEngineIgnited = useStore(state => state.setIsEngineIgnited)
  const setMainExplosionFactor = useStore(state => state.setMainExplosionFactor)
  const setActiveFault = useStore(state => state.setActiveFault)
  const setDynoRpm = useStore(state => state.setDynoRpm)
  const setViewerSource = useStore(state => state.setViewerSource)

  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechMuted, setSpeechMuted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [transcript, setTranscript] = useState('')

  const recognitionRef = useRef(null)

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        let currentTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const finalCmd = event.results[i][0].transcript.trim()
            handleCommand(finalCmd)
            setTranscript(finalCmd)
          } else {
            currentTranscript += event.results[i][0].transcript
            setTranscript(currentTranscript)
          }
        }
      }

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition error:', event.error)
        }
      }

      recognition.onend = () => {
        if (isListening) {
          try {
            recognition.start()
          } catch (e) {
            // Already started or restart handled
          }
        }
      }

      recognitionRef.current = recognition
    }
  }, [isListening])

  const speakFeedback = (text) => {
    setVoiceFeedbackText(text)
    if (speechMuted || !window.speechSynthesis) return

    window.speechSynthesis.cancel() // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.05
    utterance.pitch = 0.95 // Crisp tactical telemetry tone

    // Try to pick a crisp English voice
    const voices = window.speechSynthesis.getVoices()
    const techVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Samantha')))
    if (techVoice) utterance.voice = techVoice

    window.speechSynthesis.speak(utterance)
  }

  const toggleListening = () => {
    if (!isSupported) {
      speakFeedback("Browser speech recognition not detected. Quick action chips are available below.")
      setIsOpen(true)
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      setVoiceActive(false)
      speakFeedback("SpectraVoice copilot stand by.")
    } else {
      try {
        recognitionRef.current?.start()
        setIsListening(true)
        setVoiceActive(true)
        speakFeedback("SpectraVoice online. Ready for command.")
      } catch (err) {
        console.warn("Could not start recognition:", err)
      }
    }
  }

  const handleCommand = (rawText) => {
    const text = rawText.toLowerCase()
    setLastSpokenCommand(rawText)

    if (text.includes('ignite') || text.includes('start engine') || text.includes('start lab') || (text.includes('start') && !text.includes('dyno'))) {
      setIsEngineIgnited(true)
      engineAudio.start()
      engineAudio.setThrottle(0)
      speakFeedback("Ignition confirmed. SpectraLab online and V8 idle stabilized at 850 RPM.")
    } else if (text.includes('stop engine') || text.includes('end lab') || text.includes('cut ignition') || text.includes('shut down') || text.includes('kill engine')) {
      setIsEngineIgnited(false)
      engineAudio.stop()
      speakFeedback("SpectraLab ended. Ignition cut and V8 rotating assembly halted.")
    } else if (text.includes('explode') || text.includes('disassemble') || text.includes('break apart')) {
      setMainExplosionFactor(1)
      setIsEngineIgnited(false)
      speakFeedback("Exploded assembly mode engaged. Subsystems displaced.")
    } else if (text.includes('assemble') || text.includes('collapse') || text.includes('put together') || text.includes('rebuild')) {
      setMainExplosionFactor(0)
      speakFeedback("Core block assembled. Tolerance alignment nominal.")
    } else if (text.includes('thermal') || text.includes('infrared') || text.includes('heat')) {
      setVisionMode('thermal')
      speakFeedback("FLIR Thermal mode active. Combustion chamber peak 950 degrees Celsius.")
    } else if (text.includes('x-ray') || text.includes('x ray') || text.includes('hologram') || text.includes('wireframe')) {
      setVisionMode('xray')
      speakFeedback("Holographic X-Ray telemetry engaged.")
    } else if (text.includes('standard') || text.includes('realistic') || text.includes('normal')) {
      setVisionMode('standard')
      speakFeedback("High-fidelity realistic PBR vision restored.")
    } else if (text.includes('cycle') || text.includes('combustion') || text.includes('four stroke')) {
      setVisionMode('cycle')
      speakFeedback("720-degree 4-stroke combustion kinematics visualizer loaded.")
    } else if (text.includes('redline') || text.includes('dyno') || text.includes('rev')) {
      setIsEngineIgnited(true)
      engineAudio.start()
      engineAudio.setRpm(8200)
      setDynoRpm(8200)
      speakFeedback("Executing maximum RPM dyno sweep to 8,200 RPM.")
      setTimeout(() => {
        engineAudio.setRpm(850)
        setDynoRpm(850)
      }, 4000)
    } else if (text.includes('knock') || text.includes('rod knock')) {
      setIsEngineIgnited(true)
      setActiveFault('rod_knock')
      engineAudio.start()
      engineAudio.injectFault('rod_knock')
      speakFeedback("Warning: Spun rod bearing injected. High acoustic harmonics detected.")
    } else if (text.includes('misfire')) {
      setIsEngineIgnited(true)
      setActiveFault('misfire')
      engineAudio.start()
      engineAudio.injectFault('misfire')
      speakFeedback("Alert: Cylinder 4 ignition misfire simulated. DTC code P0304 logged.")
    } else if (text.includes('v6') || text.includes('sketchfab') || text.includes('cad') || text.includes('reference engine')) {
      setViewerSource('reference')
      speakFeedback("Switched to V6 Rigged and Animated CAD Engine by AhmedSaleh.")
    } else if (text.includes('v8') || text.includes('native') || text.includes('procedural')) {
      setViewerSource('native')
      speakFeedback("Switched to procedural Spectra V8 Engine.")
    } else if (text.includes('clear') || text.includes('fix') || text.includes('nominal')) {
      setActiveFault('none')
      engineAudio.clearFaults()
      speakFeedback("All diagnostic fault codes cleared. Calibration restored.")
    } else {
      speakFeedback(`Command '${rawText}' logged. Try saying: start lab, end lab, thermal mode, or dyno redline.`)
    }
  }

  const QUICK_COMMANDS = [
    { label: "🏎️ Show V6 CAD", cmd: "v6 engine" },
    { label: "⚡ Show Spectra V8", cmd: "v8 engine" },
    { label: "🟢 Start Lab", cmd: "start lab" },
    { label: "🛑 End Lab", cmd: "end lab" },
    { label: "🚀 Ignite Engine", cmd: "start engine" },
    { label: "💥 Explode Assembly", cmd: "explode engine" },
    { label: "🔄 Assemble Core", cmd: "assemble engine" },
    { label: "🔥 FLIR Thermal", cmd: "thermal mode" },
    { label: "✨ X-Ray Hologram", cmd: "x-ray mode" },
    { label: "⏱️ 720° Cycle", cmd: "cycle mode" },
    { label: "🏎️ Dyno Redline", cmd: "dyno redline" },
    { label: "⚠️ Inject Rod Knock", cmd: "rod knock" }
  ]

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 999 }}>
      {/* Expanded Voice Command Tray */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              bottom: '75px',
              left: 0,
              width: '340px',
              background: 'rgba(10, 12, 18, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '1.25rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.15)',
              padding: '1.25rem',
              fontFamily: "'Inter', sans-serif",
              color: '#fff',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} color="#60a5fa" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#93c5fd' }}>
                  SpectraVoice Copilot
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  onClick={() => setSpeechMuted(!speechMuted)}
                  title={speechMuted ? "Unmute AI Voice" : "Mute AI Voice"}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px',
                    cursor: 'pointer',
                    color: speechMuted ? '#ef4444' : '#60a5fa'
                  }}
                >
                  {speechMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.4)'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* AI Speech Bubble / Feedback */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                <Terminal size={12} /> AI Telemetry Response:
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                {voiceFeedbackText || (isListening ? "Listening... speak any command below." : "Mic idle. Click mic to speak or use quick action chips.")}
              </p>
            </div>

            {/* Live Transcript */}
            {transcript && (
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', marginBottom: '1rem', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                "{transcript}"
              </div>
            )}

            {/* Quick Action Chips */}
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Instant Voice Commands (1-Click Fallback)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {QUICK_COMMANDS.map(item => (
                  <button
                    key={item.cmd}
                    onClick={() => {
                      setTranscript(item.cmd)
                      handleCommand(item.cmd)
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 0.6rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#e2e8f0',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'
                      e.currentTarget.style.borderColor = '#3b82f6'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Orb Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <motion.button
          onClick={toggleListening}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          title={isListening ? "Listening... Click to pause" : "Click to speak voice commands"}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: isListening
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #1e40af, #3b82f6)',
            border: isListening ? '2px solid #fca5a5' : '2px solid rgba(96, 165, 250, 0.6)',
            boxShadow: isListening
              ? '0 0 25px rgba(239, 68, 68, 0.7), 0 10px 20px rgba(0,0,0,0.5)'
              : '0 0 25px rgba(59, 130, 246, 0.5), 0 10px 20px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            position: 'relative'
          }}
        >
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <Mic size={22} />
            </motion.div>
          ) : (
            <Mic size={22} />
          )}

          {/* Pulse Ring when listening */}
          {isListening && (
            <motion.div
              animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                position: 'absolute',
                inset: -2,
                borderRadius: '50%',
                border: '2px solid #ef4444',
                pointerEvents: 'none'
              }}
            />
          )}
        </motion.button>

        {/* Drawer Toggle Pill */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.04 }}
          style={{
            background: 'rgba(15, 18, 28, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '100px',
            padding: '0.45rem 0.85rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 700,
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
          }}
        >
          <Sparkles size={13} color="#60a5fa" />
          <span>{isListening ? 'Listening' : 'SpectraVoice'}</span>
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </motion.button>
      </div>
    </div>
  )
}
