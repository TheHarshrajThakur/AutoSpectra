import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sliders, Zap, Calculator, Gauge, Award, Sparkles, RotateCcw } from 'lucide-react'

const LEGENDARY_ENGINES = [
  {
    name: 'Chevy LS3 6.2L V8',
    cyl: 8,
    bore: 103.25,
    stroke: 92.0,
    cr: 10.7,
    boost: 0,
    cam: 220,
    redline: 6600,
    tag: 'American Pushrod'
  },
  {
    name: 'Ferrari 458 F136 4.5L V8',
    cyl: 8,
    bore: 94.0,
    stroke: 81.0,
    cr: 12.5,
    boost: 0,
    cam: 284,
    redline: 9000,
    tag: 'Flat-Plane Screamer'
  },
  {
    name: 'Ford Coyote 5.0L DOHC V8',
    cyl: 8,
    bore: 93.0,
    stroke: 92.7,
    cr: 12.0,
    boost: 0,
    cam: 240,
    redline: 7500,
    tag: 'Modern Quad-Cam'
  },
  {
    name: 'McLaren M840T 4.0L Twin-Turbo',
    cyl: 8,
    bore: 93.0,
    stroke: 73.5,
    cr: 8.7,
    boost: 18.5,
    cam: 250,
    redline: 8500,
    tag: 'Twin-Turbocharged'
  }
]

export default function SpecForgeBuilder() {
  const [cylinders, setCylinders] = useState(8)
  const [bore, setBore] = useState(103.2) // mm
  const [stroke, setStroke] = useState(92.0) // mm
  const [cr, setCr] = useState(10.7) // Compression ratio
  const [boost, setBoost] = useState(0) // psi
  const [cam, setCam] = useState(224) // duration
  const [redline, setRedline] = useState(7000) // RPM

  // Automotive Engineering Calculations
  // 1. Total Displacement: V = (pi/4) * bore^2 * stroke * num_cylinders
  const singleCylCc = (Math.PI / 4) * Math.pow(bore / 10, 2) * (stroke / 10)
  const totalCc = Math.round(singleCylCc * cylinders)
  const displacementLiters = (totalCc / 1000).toFixed(2)

  // 2. Bore-to-Stroke Ratio
  const bsRatio = (bore / stroke).toFixed(2)
  const architectureType =
    bsRatio > 1.05 ? 'Oversquare (High-RPM / Low Friction)' : bsRatio < 0.95 ? 'Undersquare (High Torque)' : 'Square (Balanced)'

  // 3. Mean Piston Speed: Sp = 2 * L * N (m/s)
  const meanPistonSpeed = ((2 * (stroke / 1000) * redline) / 60).toFixed(1)

  // 4. Otto Cycle Theoretical Efficiency: eta = 1 - (1 / cr^(gamma - 1)), gamma = 1.4 for air
  const ottoEfficiency = Math.round((1 - 1 / Math.pow(cr, 0.4)) * 100)

  // 5. Estimated Peak Horsepower & Torque
  // NA volumetric power ~ 80-115 hp/liter based on cam duration and redline
  const camFactor = 0.8 + (cam - 200) * 0.0035
  const redlineFactor = redline / 6500
  const boostPressureMultiplier = 1 + boost / 14.7 // Atmospheric pressure = 14.7 psi
  const baseHpPerLiter = 72 * camFactor * redlineFactor
  const estimatedHp = Math.round(displacementLiters * baseHpPerLiter * boostPressureMultiplier)
  const estimatedTorque = Math.round((estimatedHp * 5252) / (redline * 0.72))

  const loadPreset = (engine) => {
    setCylinders(engine.cyl)
    setBore(engine.bore)
    setStroke(engine.stroke)
    setCr(engine.cr)
    setBoost(engine.boost)
    setCam(engine.cam)
    setRedline(engine.redline)
  }

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
          <span>SpecForge Lab</span>
        </div>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
          fontWeight: 900,
          color: '#fff',
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '-0.03em',
          margin: 0
        }}>
          Custom Engine <span className="text-gradient-blue">Architect & Physics Calculator</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '680px', margin: '0.75rem auto 0', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Calibrate bore, stroke, compression ratio, boost pressure, and camshaft dynamics. Calculate real thermodynamic Otto efficiencies, mean piston speeds, and estimated dyno horsepower.
        </p>
      </div>

      {/* Preset Engine Chips */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, alignSelf: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Compare With Legendary Presets:
        </span>
        {LEGENDARY_ENGINES.map(eng => (
          <button
            key={eng.name}
            onClick={() => loadPreset(eng)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px',
              padding: '0.45rem 1rem',
              color: '#e2e8f0',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(59,130,246,0.2)'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            <Sparkles size={13} color="#60a5fa" />
            {eng.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Left: Parameter Tuning Sliders */}
        <div style={{
          background: 'rgba(12, 15, 24, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1.5rem',
          padding: '1.5rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
            <Sliders size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Engine Geometry & Induction Parameters
            </h3>
          </div>

          {/* Bore */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Cylinder Bore Diameter</span>
              <span style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 800, fontFamily: 'monospace' }}>{bore} mm</span>
            </div>
            <input
              type="range"
              min="75"
              max="110"
              step="0.1"
              value={bore}
              onChange={e => setBore(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
          </div>

          {/* Stroke */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Crankshaft Stroke Length</span>
              <span style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 800, fontFamily: 'monospace' }}>{stroke} mm</span>
            </div>
            <input
              type="range"
              min="70"
              max="110"
              step="0.1"
              value={stroke}
              onChange={e => setStroke(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
          </div>

          {/* Compression Ratio */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Static Compression Ratio</span>
              <span style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 800, fontFamily: 'monospace' }}>{cr}:1</span>
            </div>
            <input
              type="range"
              min="8.0"
              max="14.0"
              step="0.1"
              value={cr}
              onChange={e => setCr(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>

          {/* Forced Induction Boost */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Forced Induction Boost (PSI)</span>
              <span style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: 800, fontFamily: 'monospace' }}>{boost > 0 ? `+${boost} PSI (Boosted)` : '0 PSI (N/A)'}</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={boost}
              onChange={e => setBoost(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer' }}
            />
          </div>

          {/* Cam Duration */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Camshaft Duration (@ 0.050")</span>
              <span style={{ fontSize: '0.9rem', color: '#a855f7', fontWeight: 800, fontFamily: 'monospace' }}>{cam}°</span>
            </div>
            <input
              type="range"
              min="200"
              max="300"
              step="1"
              value={cam}
              onChange={e => setCam(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
            />
          </div>

          {/* Redline */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Engine Redline</span>
              <span style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: 800, fontFamily: 'monospace' }}>{redline} RPM</span>
            </div>
            <input
              type="range"
              min="5500"
              max="9500"
              step="100"
              value={redline}
              onChange={e => setRedline(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Right: Calculated Thermodynamic & Output Metrics */}
        <div style={{
          background: 'rgba(12, 15, 24, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <Calculator size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Computed Engineering Telemetry
              </h3>
            </div>

            {/* Big Output Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase' }}>Estimated Output</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ef4444', fontFamily: 'monospace', lineHeight: 1.1, marginTop: '0.25rem' }}>
                  {estimatedHp} <span style={{ fontSize: '1rem', color: '#fca5a5' }}>BHP</span>
                </div>
              </div>

              <div style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Estimated Torque</div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', lineHeight: 1.1, marginTop: '0.25rem' }}>
                  {estimatedTorque} <span style={{ fontSize: '1rem', color: '#93c5fd' }}>lb-ft</span>
                </div>
              </div>
            </div>

            {/* Key Calculated Specifications Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Displacement (Calculated)</span>
                <span style={{ color: '#fff', fontWeight: 800, fontFamily: 'monospace' }}>{displacementLiters}L ({totalCc} cc)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Bore / Stroke Ratio</span>
                <span style={{ color: '#38bdf8', fontWeight: 800, fontFamily: 'monospace' }}>{bsRatio}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Engine Geometry Class</span>
                <span style={{ color: '#cbd5e1', fontWeight: 700, fontSize: '0.82rem' }}>{architectureType}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Mean Piston Speed @ Redline</span>
                <span style={{ color: meanPistonSpeed > 24 ? '#ef4444' : '#10b981', fontWeight: 800, fontFamily: 'monospace' }}>
                  {meanPistonSpeed} m/s {meanPistonSpeed > 24 ? '(EXTREME STRESS)' : '(SAFE)'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Otto Cycle Thermal Efficiency</span>
                <span style={{ color: '#f59e0b', fontWeight: 800, fontFamily: 'monospace' }}>{ottoEfficiency}%</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Formula Applied:
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontFamily: 'monospace', lineHeight: 1.5 }}>
              Sp = 2 · L · N &nbsp;|&nbsp; η = 1 - (1 / CR^0.4) &nbsp;|&nbsp; Vd = (π/4)·B²·S·Ncyl
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
