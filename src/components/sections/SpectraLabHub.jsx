import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gauge, ShieldAlert, Wrench, Sparkles, Sliders, ChevronLeft, Play, Square, Power, PowerOff, Zap, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SpectraDynoBench from './SpectraDynoBench'
import SpectraDiagnosticLab from './SpectraDiagnosticLab'
import SpecForgeBuilder from './SpecForgeBuilder'
import { useStore } from '../../store/useStore'
import { engineAudio } from '../../utils/engineAudioSynthesizer'

export default function SpectraLabHub({ initialTab = 'dyno' }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const navigate = useNavigate()

  const isEngineIgnited = useStore(state => state.isEngineIgnited)
  const setIsEngineIgnited = useStore(state => state.setIsEngineIgnited)
  const setActiveFault = useStore(state => state.setActiveFault)

  // Start engine lab
  const handleStartLab = () => {
    setIsEngineIgnited(true)
    engineAudio.start()
  }

  // End engine lab / cut engine
  const handleEndLab = () => {
    setIsEngineIgnited(false)
    engineAudio.stop()
    setActiveFault('none')
  }

  // Ensure audio stops and ignition cuts if user navigates away from lab
  useEffect(() => {
    return () => {
      engineAudio.stop()
      setIsEngineIgnited(false)
      setActiveFault('none')
    }
  }, [])

  const tabs = [
    { id: 'dyno', label: 'SpectraDyno & Audio', icon: Gauge },
    { id: 'diagnostics', label: 'Acoustic OBD-II Lab', icon: ShieldAlert },
    { id: 'builder', label: 'SpecForge Engine Builder', icon: Sliders }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#05070c', color: '#fff', paddingTop: '7rem', paddingBottom: '6rem' }}>
      {/* Top Header & Navigation Bar */}
      <div style={{ maxWidth: '1240px', margin: '0 auto 1.5rem', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Left: Back Link & Lab Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px',
              padding: '0.5rem 1.1rem',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <ChevronLeft size={16} /> 3D Showcase
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              SpectraLab <span className="text-gradient-blue">Workspace</span>
            </span>
          </div>
        </div>

        {/* Center: Tab Switcher Pills */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 18, 28, 0.9)',
          padding: '0.35rem',
          borderRadius: '100px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          gap: '0.3rem'
        }}>
          {tabs.map(tab => {
            const isSelected = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)' : 'none',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '0.55rem 1.15rem',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 15px rgba(59,130,246,0.4)' : 'none'
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Right: Master START & END Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* START BUTTON */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleStartLab}
            style={{
              background: isEngineIgnited
                ? 'rgba(16, 185, 129, 0.15)'
                : 'linear-gradient(135deg, #10b981, #059669)',
              border: isEngineIgnited ? '1px solid #10b981' : '1px solid #34d399',
              borderRadius: '100px',
              padding: '0.6rem 1.3rem',
              color: isEngineIgnited ? '#34d399' : '#fff',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: isEngineIgnited
                ? '0 0 15px rgba(16,185,129,0.3)'
                : '0 0 20px rgba(16,185,129,0.4), 0 4px 12px rgba(0,0,0,0.4)',
              transition: 'all 0.25s'
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isEngineIgnited ? '#10b981' : '#fff',
              boxShadow: isEngineIgnited ? '0 0 8px #10b981' : 'none'
            }} />
            {isEngineIgnited ? 'RUNNING (850 RPM)' : 'START LAB'}
          </motion.button>

          {/* END BUTTON */}
          <motion.button
            whileHover={isEngineIgnited ? { scale: 1.04 } : {}}
            whileTap={isEngineIgnited ? { scale: 0.96 } : {}}
            onClick={handleEndLab}
            disabled={!isEngineIgnited}
            style={{
              background: isEngineIgnited
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'rgba(255,255,255,0.04)',
              border: isEngineIgnited ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '100px',
              padding: '0.6rem 1.2rem',
              color: isEngineIgnited ? '#fff' : 'rgba(255,255,255,0.3)',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: isEngineIgnited ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: isEngineIgnited ? '0 0 15px rgba(239,68,68,0.4)' : 'none',
              transition: 'all 0.25s'
            }}
          >
            <Square size={13} fill={isEngineIgnited ? '#fff' : 'rgba(255,255,255,0.3)'} />
            END LAB
          </motion.button>
        </div>
      </div>

      {/* Global Status Banner when Lab is Stopped */}
      {!isEngineIgnited && (
        <div style={{ maxWidth: '1240px', margin: '0 auto 1.5rem', padding: '0 1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '1rem',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#93c5fd' }}>
              <AlertCircle size={16} color="#60a5fa" />
              <span>
                <strong>Engine Standby:</strong> Click <strong>START LAB</strong> to initiate procedural V8 sound synthesis and activate dyno & diagnostic telemetry.
              </span>
            </div>
            <button
              onClick={handleStartLab}
              style={{
                background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                border: 'none',
                borderRadius: '100px',
                padding: '0.4rem 1rem',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Start Engine Now
            </button>
          </motion.div>
        </div>
      )}

      {/* Active Tab View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'dyno' && <SpectraDynoBench />}
          {activeTab === 'diagnostics' && <SpectraDiagnosticLab />}
          {activeTab === 'builder' && <SpecForgeBuilder />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
