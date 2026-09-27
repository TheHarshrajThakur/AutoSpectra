import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gauge, Zap, Flame, Timer, Play, Square, RotateCcw, Volume2, ShieldAlert, Award, Power, AlertCircle } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { engineAudio } from '../../utils/engineAudioSynthesizer'

export default function SpectraDynoBench() {
  const isEngineIgnited = useStore(state => state.isEngineIgnited)
  const setIsEngineIgnited = useStore(state => state.setIsEngineIgnited)

  const [rpm, setRpm] = useState(isEngineIgnited ? 850 : 0)
  const [throttle, setThrottle] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [maxRecordedHp, setMaxRecordedHp] = useState(0)
  const [maxRecordedTorque, setMaxRecordedTorque] = useState(0)

  // Drag sprint state
  const [dragStage, setDragStage] = useState('idle') // 'idle' | 'staging' | 'running' | 'finished'
  const [sprintTime, setSprintTime] = useState(0)
  const [sprintSpeed, setSprintSpeed] = useState(0)
  const [quarterMileTime, setQuarterMileTime] = useState(null)
  const [peakGForce, setPeakGForce] = useState(0)

  const dynoCanvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const dragAnimRef = useRef(null)

  // Keep internal RPM synced with isEngineIgnited
  useEffect(() => {
    if (isEngineIgnited) {
      if (rpm === 0) setRpm(850)
    } else {
      setRpm(0)
      setThrottle(0)
      setIsPulling(false)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (dragAnimRef.current) cancelAnimationFrame(dragAnimRef.current)
    }
  }, [isEngineIgnited])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (dragAnimRef.current) cancelAnimationFrame(dragAnimRef.current)
      engineAudio.stop()
    }
  }, [])

  // Start Engine Action
  const handleStartEngine = () => {
    setIsEngineIgnited(true)
    engineAudio.start()
    setRpm(850)
  }

  // End Engine Action
  const handleEndEngine = () => {
    setIsEngineIgnited(false)
    engineAudio.stop()
    setRpm(0)
    setThrottle(0)
    setIsPulling(false)
  }

  // Power Calculations based on V8 volumetric efficiency curve
  const calculatePower = (currentRpm) => {
    if (!isEngineIgnited || currentRpm < 200) {
      return { hp: 0, torque: 0 }
    }
    const norm = currentRpm / 8500
    const baseTorque = 420
    const peakTorqueBoost = 220 * Math.sin(Math.min(Math.PI, norm * Math.PI * 1.3))
    const torque = Math.max(120, Math.round(baseTorque + peakTorqueBoost))
    const hp = Math.max(0, Math.round((torque * currentRpm) / 5252))
    return { hp, torque }
  }

  const { hp, torque } = calculatePower(rpm)

  // Keep track of peaks
  useEffect(() => {
    if (isEngineIgnited) {
      if (hp > maxRecordedHp) setMaxRecordedHp(hp)
      if (torque > maxRecordedTorque) setMaxRecordedTorque(torque)
    }
  }, [hp, torque, isEngineIgnited])

  // Sync with audio engine
  const handleThrottleChange = (val) => {
    if (!isEngineIgnited) {
      if (val > 0.02) {
        handleStartEngine()
      } else {
        return
      }
    }
    setThrottle(val)
    const calculatedRpm = Math.round(850 + val * (8500 - 850))
    setRpm(calculatedRpm)
    engineAudio.setThrottle(val)
  }

  // Automated Full Dyno Pull (0% to 100% sweep)
  const runFullDynoPull = () => {
    if (isPulling) return
    if (!isEngineIgnited) {
      handleStartEngine()
    }
    setIsPulling(true)
    engineAudio.start()

    let start = null
    const duration = 5000 // 5 second pull

    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min(1, (timestamp - start) / duration)

      // Throttle curve ramps up to 100% then drops
      const tVal = progress < 0.8 ? progress / 0.8 : 1 - (progress - 0.8) / 0.2
      setThrottle(tVal)
      const curRpm = Math.round(850 + tVal * (8500 - 850))
      setRpm(curRpm)
      engineAudio.setThrottle(tVal)

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step)
      } else {
        setIsPulling(false)
        setThrottle(0)
        setRpm(850)
        engineAudio.setThrottle(0)
      }
    }
    animFrameRef.current = requestAnimationFrame(step)
  }

  // Draw Dynamic Dyno Graph
  useEffect(() => {
    const canvas = dynoCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
    ctx.lineWidth = 1
    for (let x = 40; x < width; x += 60) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height - 25)
      ctx.stroke()
    }
    for (let y = 10; y < height - 25; y += 40) {
      ctx.beginPath()
      ctx.moveTo(40, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // RPM X-Axis Labels
    ctx.fillStyle = '#64748b'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'center'
    for (let r = 1000; r <= 8000; r += 1000) {
      const xPos = 40 + (r / 8500) * (width - 60)
      ctx.fillText(`${r / 1000}k`, xPos, height - 8)
    }

    // Y-Axis Labels
    ctx.textAlign = 'right'
    ctx.fillText('700', 32, 20)
    ctx.fillText('350', 32, (height - 25) / 2)
    ctx.fillText('0', 32, height - 28)

    if (isEngineIgnited && rpm > 200) {
      // Plot Curves up to current RPM
      const maxSweepRpm = Math.max(1200, rpm)

      // 1. Torque Curve (Cyan / Blue)
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 3
      ctx.beginPath()
      for (let r = 850; r <= maxSweepRpm; r += 50) {
        const p = calculatePower(r)
        const x = 40 + (r / 8500) * (width - 60)
        const y = height - 25 - (p.torque / 750) * (height - 45)
        if (r === 850) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // 2. Horsepower Curve (Red / Amber)
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.beginPath()
      for (let r = 850; r <= maxSweepRpm; r += 50) {
        const p = calculatePower(r)
        const x = 40 + (r / 8500) * (width - 60)
        const y = height - 25 - (p.hp / 750) * (height - 45)
        if (r === 850) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Current RPM Indicator Line
      const curX = 40 + (rpm / 8500) * (width - 60)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(curX, 0)
      ctx.lineTo(curX, height - 25)
      ctx.stroke()
      ctx.setLineDash([])

      // Marker Points
      const curHpY = height - 25 - (hp / 750) * (height - 45)
      const curTqY = height - 25 - (torque / 750) * (height - 45)

      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(curX, curHpY, 5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#38bdf8'
      ctx.beginPath()
      ctx.arc(curX, curTqY, 5, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Engine Off message on canvas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.font = '12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('ENGINE HALTED — CLICK START ENGINE TO INITIALIZE DYNO', width / 2, height / 2)
    }

  }, [rpm, hp, torque, isEngineIgnited])

  // Drag Strip Launch Simulation
  const startDragSprint = () => {
    if (dragStage === 'running' || dragStage === 'staging') return
    if (!isEngineIgnited) {
      handleStartEngine()
    }
    setDragStage('staging')
    setSprintTime(0)
    setSprintSpeed(0)
    setQuarterMileTime(null)

    // Staging countdown lights
    setTimeout(() => {
      setDragStage('running')
      engineAudio.start()
      engineAudio.setThrottle(1)
      setThrottle(1)

      const startTime = performance.now()
      let peakG = 0

      const sprintLoop = (time) => {
        const elapsed = (time - startTime) / 1000
        setSprintTime(elapsed.toFixed(2))

        // V8 650hp acceleration physics: v(t) = v_max * (1 - e^(-k*t))
        const speedKmh = Math.min(265, Math.round(270 * (1 - Math.exp(-0.28 * elapsed))))
        setSprintSpeed(speedKmh)

        // Estimated RPM during gear shifts
        const virtualRpm = 4500 + Math.min(3800, (speedKmh % 60) * 60)
        setRpm(virtualRpm)
        engineAudio.setRpm(virtualRpm)

        // G-force calculation: a = dv/dt
        const gForce = Math.max(0.2, +(1.25 * Math.exp(-0.2 * elapsed)).toFixed(2))
        if (gForce > peakG) peakG = gForce
        setPeakGForce(peakG)

        // Quarter mile reached (~402 meters)
        if (elapsed >= 10.4 && !quarterMileTime) {
          setQuarterMileTime(elapsed.toFixed(2))
        }

        if (elapsed >= 11.5) {
          setDragStage('finished')
          engineAudio.setThrottle(0)
          setThrottle(0)
          setRpm(850)
        } else {
          dragAnimRef.current = requestAnimationFrame(sprintLoop)
        }
      }
      dragAnimRef.current = requestAnimationFrame(sprintLoop)
    }, 1800)
  }

  // Exhaust manifold glow calculation
  const manifoldTemp = isEngineIgnited
    ? Math.min(1020, Math.round(350 + (rpm / 8500) * 670))
    : 24
  const glowIntensity = isEngineIgnited
    ? Math.max(0, (manifoldTemp - 550) / 470)
    : 0

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '1rem 1.5rem 2rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="section-label" style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
          <span>SpectraDyno Bench</span>
        </div>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
          fontWeight: 900,
          color: '#fff',
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.03em',
          margin: 0
        }}>
          Virtual V8 <span className="text-gradient-blue">Dyno Bench & Drag Strip</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '680px', margin: '0.75rem auto 0', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Live procedural acoustics, real-time Horsepower/Torque sweep plots, exhaust thermal glow modeling, and automated 0–100 km/h quarter-mile launch physics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left Card: Live Dyno Plot & Telemetry HUD */}
        <div style={{
          background: 'rgba(12, 14, 22, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Gauge size={20} color="#38bdf8" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Live Power & Torque Curves
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.75rem', fontWeight: 700 }}>
              <span style={{ color: '#ef4444' }}>■ Horsepower (HP)</span>
              <span style={{ color: '#38bdf8' }}>■ Torque (lb-ft)</span>
            </div>
          </div>

          {/* Canvas Plot */}
          <div style={{ position: 'relative', width: '100%', height: '220px', background: 'rgba(5, 7, 12, 0.85)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <canvas
              ref={dynoCanvasRef}
              width={560}
              height={220}
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
          </div>

          {/* Real-time Telemetry Readouts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '1.25rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Current RPM</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: isEngineIgnited ? '#fff' : '#64748b', fontFamily: 'monospace' }}>
                {isEngineIgnited ? rpm : 'OFF'}
              </div>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.08)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase' }}>BHP</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444', fontFamily: 'monospace' }}>{hp}</div>
            </div>
            <div style={{ background: 'rgba(56,189,248,0.08)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(56,189,248,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Torque</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>{torque}</div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>Boost</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>
                {isEngineIgnited ? (throttle * 14.2).toFixed(1) : '0.0'} <span style={{ fontSize: '0.8rem' }}>psi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Interactive Gas Pedal & Ignition Buttons */}
        <div style={{
          background: 'rgba(12, 14, 22, 0.8)',
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
                <Flame size={20} color={glowIntensity > 0.4 ? '#ef4444' : '#f59e0b'} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Dyno Engine Station
                </h3>
              </div>

              {/* Direct Start / End Button in Dyno Bench */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={isEngineIgnited ? handleEndEngine : handleStartEngine}
                  style={{
                    background: isEngineIgnited
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                      : 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '0.45rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: isEngineIgnited ? '0 0 12px rgba(239,68,68,0.4)' : '0 0 12px rgba(16,185,129,0.4)'
                  }}
                >
                  <Power size={13} />
                  {isEngineIgnited ? 'END / CUT ENGINE' : 'START ENGINE'}
                </button>

                <button
                  onClick={runFullDynoPull}
                  disabled={isPulling}
                  style={{
                    background: isPulling ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '0.45rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#fff',
                    cursor: isPulling ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Play size={12} fill="#fff" />
                  {isPulling ? 'Sweeping...' : 'Auto Sweep'}
                </button>
              </div>
            </div>

            {/* Simulated Exhaust Manifold Pipe Glowing Red-Hot */}
            <div style={{
              height: '75px',
              borderRadius: '0.75rem',
              background: '#0a0d14',
              border: '1px solid rgba(255,255,255,0.08)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: '1.5rem'
            }}>
              {/* Glowing header pipe graphic */}
              <div style={{
                width: '80%',
                height: '24px',
                borderRadius: '12px',
                background: `linear-gradient(90deg, #1e293b 0%, rgba(${Math.round(200 + glowIntensity * 55)}, ${Math.round(40 + glowIntensity * 140)}, ${Math.round(20 + glowIntensity * 30)}, 0.95) 50%, #1e293b 100%)`,
                boxShadow: glowIntensity > 0.2 ? `0 0 ${glowIntensity * 40}px rgba(239, 68, 68, ${glowIntensity * 0.9}), 0 0 ${glowIntensity * 20}px #f97316` : 'none',
                transition: 'all 0.3s ease'
              }} />
              <div style={{ position: 'absolute', right: '15px', top: '8px', fontSize: '0.75rem', color: glowIntensity > 0.5 ? '#f87171' : '#94a3b8', fontWeight: 800 }}>
                EGT: {manifoldTemp}°C
              </div>
              <div style={{ position: 'absolute', left: '15px', bottom: '8px', fontSize: '0.7rem', color: '#64748b' }}>
                Exhaust Headers: {glowIntensity > 0.6 ? 'HOT (Cherry Red Glow)' : isEngineIgnited ? 'Warm (Idle)' : 'Cold (Off)'}
              </div>
            </div>

            {/* Interactive Gas Pedal Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700 }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Gas Pedal Position</span>
                <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>
                  {isEngineIgnited ? `${Math.round(throttle * 100)}% Throttle` : 'Engine Off (Drag to Start)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={throttle}
                onChange={(e) => handleThrottleChange(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#ef4444',
                  cursor: 'pointer',
                  height: '8px',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          {/* Quick Rev Preset Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
            {[
              { label: 'Idle (850)', t: 0 },
              { label: 'Cruise (2500)', t: 0.22 },
              { label: 'Power (5500)', t: 0.6 },
              { label: 'REDLINE (8500)', t: 1.0 }
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => handleThrottleChange(preset.t)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#38bdf8'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drag Strip Sprint Simulator Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30,58,138,0.3) 0%, rgba(15,23,42,0.6) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '1.5rem',
        padding: '2rem 2.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '520px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            <Timer size={16} /> 0–100 km/h & 1/4 Mile Drag Sprint
          </div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem 0', fontFamily: "'Outfit', sans-serif" }}>
            Virtual Drag Strip Launch Control
          </h3>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Simulate launch control torque converter staging, dual-clutch transmission shifts, and compute elapsed quarter-mile times and peak lateral G-forces.
          </p>
        </div>

        {/* Live Drag Meter Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Speed</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>
              {sprintSpeed} <span style={{ fontSize: '1rem', color: '#64748b' }}>km/h</span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>0–100 Time</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: sprintSpeed >= 100 ? '#10b981' : '#f87171', fontFamily: 'monospace' }}>
              {sprintTime}s
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Peak G-Force</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'monospace' }}>
              {peakGForce}G
            </div>
          </div>

          <button
            onClick={startDragSprint}
            disabled={dragStage === 'running' || dragStage === 'staging'}
            style={{
              background: dragStage === 'staging' ? '#f59e0b' : dragStage === 'running' ? '#10b981' : 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              borderRadius: '0.85rem',
              padding: '0.9rem 1.6rem',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: dragStage === 'running' || dragStage === 'staging' ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Zap size={18} fill="#fff" />
            {dragStage === 'staging' ? 'STAGING...' : dragStage === 'running' ? 'LAUNCHED!' : 'Launch Sprint'}
          </button>
        </div>
      </div>
    </div>
  )
}
