import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Activity, CheckCircle2, Wrench, AlertTriangle, RefreshCw, Terminal, Cpu, Power } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { engineAudio } from '../../utils/engineAudioSynthesizer'

const FAULT_DEFINITIONS = {
  rod_knock: {
    id: 'rod_knock',
    name: 'Spun Rod Bearing (Rod Knock)',
    severity: 'CRITICAL',
    dtc: 'P0524',
    dtcDesc: 'Engine Oil Pressure Too Low / Bearing Clearance Out of Spec',
    audioChar: 'Rhythmic, load-dependent metallic impact (1.8–2.2 kHz)',
    symptoms: 'Loss of hydrodynamic wedge, metal shavings in oil filter, catastrophic crankshaft scoring risk.',
    fix: 'Remove oil pan, inspect rod journal with Plastigage, machine crankshaft 0.25mm undersize, replace with tri-metal race bearings.'
  },
  misfire: {
    id: 'misfire',
    name: 'Cylinder 4 Ignition Misfire',
    severity: 'HIGH',
    dtc: 'P0304',
    dtcDesc: 'Cylinder 4 Misfire Detected (Unburned Fuel Discharge)',
    audioChar: 'Engine stumble, missing exhaust acoustic pulse every 720° cycle',
    symptoms: 'Catalytic converter overheating, uneven torque delivery, rich fuel trim compensation.',
    fix: 'Inspect cylinder 4 coil pack with multimeter (target 0.8Ω primary resistance), check spark plug gap (0.8mm), run injector balance test.'
  },
  detonation: {
    id: 'detonation',
    name: 'Pre-Ignition / Detonation Knock',
    severity: 'CRITICAL',
    dtc: 'P0325',
    dtcDesc: 'Knock Sensor Circuit / Acoustic Detonation Spike Detected',
    audioChar: 'High-frequency pinging acoustic waveform (4.5–6.0 kHz)',
    symptoms: 'Peak cylinder pressure spikes 200+ bar before TDC, piston ring land fracture, thermal crown melting.',
    fix: 'Retard ignition timing by 4° BTDC, increase fuel octane rating (switch to 98/E85), check intake air charge temp, clean carbon deposits from chamber.'
  },
  head_gasket: {
    id: 'head_gasket',
    name: 'Blown Cylinder Head Gasket',
    severity: 'SEVERE',
    dtc: 'P0217',
    dtcDesc: 'Coolant Over-Temperature Condition & Combustion Gas Ingress',
    audioChar: 'Combustion pressure leaking into coolant passages, coolant reservoir bubbling',
    symptoms: 'Thermal runaway past 125°C, compression loss across adjacent cylinders, white exhaust steam.',
    fix: 'Perform combustion leak block test (chemical fluid color change), mill head deck to < 0.05mm flatness, install Multi-Layer Steel (MLS) gasket with ARP head studs.'
  }
}

export default function SpectraDiagnosticLab() {
  const activeFault = useStore(state => state.activeFault)
  const setActiveFault = useStore(state => state.setActiveFault)
  const isEngineIgnited = useStore(state => state.isEngineIgnited)
  const setIsEngineIgnited = useStore(state => state.setIsEngineIgnited)

  const fftCanvasRef = useRef(null)
  const animRef = useRef(null)

  // Live sensor readings simulated based on fault state
  const getTelemetry = () => {
    if (!isEngineIgnited) {
      return { oilPress: '0.0 BAR', coolantTemp: '24.0°C', afr: 'OFF', knockVolt: '0.00 V', status: 'ENGINE HALTED' }
    }
    switch (activeFault) {
      case 'rod_knock':
        return { oilPress: '0.9 BAR', coolantTemp: '98.5°C', afr: '14.7', knockVolt: '3.85 V', status: 'CRITICAL WARNING' }
      case 'misfire':
        return { oilPress: '4.1 BAR', coolantTemp: '94.2°C', afr: '17.2', knockVolt: '0.45 V', status: 'MISFIRE ACTIVE' }
      case 'detonation':
        return { oilPress: '3.9 BAR', coolantTemp: '104.8°C', afr: '13.8', knockVolt: '4.92 V', status: 'DETONATION DETECTED' }
      case 'head_gasket':
        return { oilPress: '2.8 BAR', coolantTemp: '128.4°C', afr: '14.9', knockVolt: '1.20 V', status: 'THERMAL RUNAWAY' }
      default:
        return { oilPress: '4.3 BAR', coolantTemp: '91.0°C', afr: '14.7', knockVolt: '0.22 V', status: 'NOMINAL (CALIBRATED)' }
    }
  }

  const telemetry = getTelemetry()

  const handleInjectFault = (faultKey) => {
    setIsEngineIgnited(true)
    setActiveFault(faultKey)
    engineAudio.start()
    engineAudio.injectFault(faultKey)
  }

  const handleClearFaults = () => {
    setActiveFault('none')
    engineAudio.clearFaults()
  }

  const toggleEngine = () => {
    if (isEngineIgnited) {
      setIsEngineIgnited(false)
      engineAudio.stop()
      setActiveFault('none')
    } else {
      setIsEngineIgnited(true)
      engineAudio.start()
    }
  }

  // Draw Real-time FFT Audio Spectrum & Waveform Oscilloscope
  useEffect(() => {
    const canvas = fftCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    const draw = () => {
      const spectrum = engineAudio.getSpectrumData()
      const waveform = engineAudio.getWaveformData()

      ctx.clearRect(0, 0, width, height)

      // Background Grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // 1. FFT Frequency Bars
      const barWidth = (width / (spectrum.length / 2)) * 1.5
      let x = 0

      for (let i = 0; i < spectrum.length / 2; i++) {
        const val = spectrum[i]
        const barHeight = (val / 255) * (height - 30)

        // Color shifts to red if high harmonic fault is detected
        const isSpike = activeFault !== 'none' && i > 15 && val > 120
        ctx.fillStyle = isSpike ? '#ef4444' : 'rgba(56, 189, 248, 0.7)'

        ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight)
        x += barWidth
      }

      // 2. Waveform Oscilloscope Line
      ctx.strokeStyle = activeFault !== 'none' ? '#f43f5e' : '#10b981'
      ctx.lineWidth = 2
      ctx.beginPath()
      const sliceWidth = width / waveform.length
      let waveX = 0

      for (let i = 0; i < waveform.length; i++) {
        const v = waveform[i] / 128.0 // 0 to 2
        const waveY = (v * height) / 2

        if (i === 0) ctx.moveTo(waveX, waveY)
        else ctx.lineTo(waveX, waveY)

        waveX += sliceWidth
      }
      ctx.stroke()

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [activeFault])

  // Guarantee audio and faults stop on unmount
  useEffect(() => {
    return () => {
      engineAudio.stop()
      engineAudio.clearFaults()
    }
  }, [])

  const selectedFaultInfo = FAULT_DEFINITIONS[activeFault]

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="section-label" style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
          <span>SpectraDiagnostic Lab</span>
        </div>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
          fontWeight: 900,
          color: '#fff',
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.03em',
          margin: 0
        }}>
          Acoustic Knock & <span className="text-gradient-blue">OBD-II Fault Lab</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '680px', margin: '0.75rem auto 0', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Inject authentic internal mechanical engine failures, analyze live Web Audio FFT frequency harmonics, inspect diagnostic trouble codes (DTC), and review engineering repair solutions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left: Live FFT Spectrum & Telemetry Scanner */}
        <div style={{
          background: 'rgba(12, 15, 24, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Activity size={20} color={activeFault !== 'none' ? '#ef4444' : '#10b981'} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Acoustic FFT Spectrum & Oscilloscope
              </h3>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 800,
              background: activeFault !== 'none' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
              color: activeFault !== 'none' ? '#f87171' : '#34d399',
              border: `1px solid ${activeFault !== 'none' ? '#ef4444' : '#10b981'}`
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeFault !== 'none' ? '#ef4444' : '#10b981' }} />
              {telemetry.status}
            </div>
          </div>

          {/* Canvas Spectrum */}
          <div style={{ position: 'relative', width: '100%', height: '220px', background: '#05070c', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <canvas
              ref={fftCanvasRef}
              width={560}
              height={220}
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
            <div style={{ position: 'absolute', bottom: '8px', left: '12px', fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>
              0 Hz ───────── 2.5 kHz (Detonation Window) ───────── 10 kHz
            </div>
          </div>

          {/* Live OBD-II Telemetry Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '1.25rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Oil Pressure</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: activeFault === 'rod_knock' ? '#ef4444' : '#fff', fontFamily: 'monospace' }}>
                {telemetry.oilPress}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Coolant Temp</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: activeFault === 'head_gasket' ? '#ef4444' : '#fff', fontFamily: 'monospace' }}>
                {telemetry.coolantTemp}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Air-Fuel (AFR)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: activeFault === 'misfire' ? '#fbbf24' : '#fff', fontFamily: 'monospace' }}>
                {telemetry.afr}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Knock Sensor</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: activeFault === 'detonation' ? '#ef4444' : '#38bdf8', fontFamily: 'monospace' }}>
                {telemetry.knockVolt}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Fault Injection Matrix */}
        <div style={{
          background: 'rgba(12, 15, 24, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Cpu size={20} color="#3b82f6" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Fault Injection Switchboard
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={toggleEngine}
                  style={{
                    background: isEngineIgnited
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                      : 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: isEngineIgnited ? '0 0 10px rgba(239,68,68,0.4)' : '0 0 10px rgba(16,185,129,0.4)'
                  }}
                >
                  <Power size={12} />
                  {isEngineIgnited ? 'End Engine' : 'Start Engine'}
                </button>

                {activeFault !== 'none' && (
                  <button
                    onClick={handleClearFaults}
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10b981',
                      borderRadius: '100px',
                      padding: '0.4rem 0.9rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#34d399',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <CheckCircle2 size={13} />
                    Restore Nominal
                  </button>
                )}
              </div>
            </div>

            {/* 4 Fault Injection Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.values(FAULT_DEFINITIONS).map(fault => {
                const isSelected = activeFault === fault.id
                return (
                  <div
                    key={fault.id}
                    onClick={() => handleInjectFault(fault.id)}
                    style={{
                      background: isSelected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? '#ef4444' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: '0.75rem',
                      padding: '0.85rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#f87171' : '#fff' }}>
                        {fault.name}
                      </div>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        color: isSelected ? '#ef4444' : '#64748b',
                        background: 'rgba(0,0,0,0.4)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        DTC: {fault.dtc}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.35rem' }}>
                      {fault.dtcDesc}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1rem', fontStyle: 'italic', textAlign: 'center' }}>
            *Click any fault to immediately hear the acoustic signature and observe the FFT waveform.
          </div>
        </div>
      </div>

      {/* Engineering Diagnostic & Remediation Report */}
      {selectedFaultInfo && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(15,23,42,0.8) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '1.5rem',
            padding: '2rem 2.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            <Wrench size={16} /> Engineering Diagnostic & Remediation Guide
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0 0 1rem 0' }}>
            Failure Analysis: {selectedFaultInfo.name} ({selectedFaultInfo.dtc})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Acoustic Frequency Signature
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#fca5a5', lineHeight: 1.5 }}>
                {selectedFaultInfo.audioChar}
              </p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Mechanical Symptoms
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {selectedFaultInfo.symptoms}
              </p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Recommended Mechanical Repair
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#86efac', lineHeight: 1.5 }}>
                {selectedFaultInfo.fix}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
