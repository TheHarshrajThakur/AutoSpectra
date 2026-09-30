import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, X, Palette, MonitorSpeaker, Zap, Moon, ChevronRight, Check } from 'lucide-react'
import { useStore, THEME_PALETTES } from '../../store/useStore'

const QUALITY_LEVELS = [
  { id: 'low', label: 'Low', desc: 'Best FPS on older GPUs' },
  { id: 'medium', label: 'Medium', desc: 'Balanced performance' },
  { id: 'high', label: 'High', desc: 'Maximum visual fidelity' },
]

export default function SettingsPanel() {
  const isSettingsOpen = useStore(s => s.isSettingsOpen)
  const toggleSettings = useStore(s => s.toggleSettings)
  const themePalette = useStore(s => s.themePalette)
  const setThemePalette = useStore(s => s.setThemePalette)
  const reducedMotion = useStore(s => s.reducedMotion)
  const setReducedMotion = useStore(s => s.setReduccedMotion)
  const renderQuality = useStore(s => s.renderQuality)
  const setRenderQuality = useStore(s => s.setRenderQuality)
  const [activeTab, setActiveTab] = useState('theme')

  const palettes = Object.values(THEME_PALETTES)

  return (
    <>
      {/* Floating Settings Button */}
      <motion.button
        onClick={toggleSettings}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        animate={isSettingsOpen ? { rotate: 180 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        aria-label="Open Settings"
        className="settings-floating-btn"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 200,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--color-primary, #3b82f6)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: `0 8px 32px rgba(var(--color-primary-rgb, 59,130,246), 0.4), 0 0 0 4px rgba(var(--color-primary-rgb, 59,130,246), 0.15)`,
        }}
      >
        <Settings size={22} />
      </motion.button>

      <style>{`
        @media (max-width: 640px) {
          .settings-floating-btn {
            bottom: 14px !important;
            right: 12px !important;
            width: 44px !important;
            height: 44px !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
          }
        }
      `}</style>

      {/* Backdrop */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={toggleSettings}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 201,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(420px, 92vw)',
              zIndex: 202,
              background: 'var(--color-surface, #050505)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: '-0.03em',
                  color: '#fff',
                  margin: 0,
                }}>
                  Settings
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>
                  Customize your experience
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSettings}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.75rem',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Tab Nav */}
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              padding: '0.75rem 1.75rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {[
                { id: 'theme', label: 'Theme', icon: Palette },
                { id: 'performance', label: 'Performance', icon: Zap },
                { id: 'display', label: 'Display', icon: MonitorSpeaker },
              ].map(tab => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.5rem',
                    borderRadius: '0.75rem',
                    background: activeTab === tab.id ? 'rgba(var(--color-primary-rgb, 59,130,246), 0.15)' : 'transparent',
                    border: activeTab === tab.id ? '1px solid rgba(var(--color-primary-rgb, 59,130,246), 0.3)' : '1px solid transparent',
                    color: activeTab === tab.id ? 'var(--color-primary, #3b82f6)' : 'var(--color-text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div data-lenis-prevent style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.75rem' }}>
              <AnimatePresence mode="wait">
                {activeTab === 'theme' && (
                  <motion.div
                    key="theme"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'var(--color-text-muted)',
                      marginBottom: '1rem',
                    }}>
                      Color Palette
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {palettes.map(p => {
                        const isActive = themePalette === p.id
                        return (
                          <motion.button
                            key={p.id}
                            onClick={() => setThemePalette(p.id)}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              position: 'relative',
                              padding: '1rem',
                              borderRadius: '1rem',
                              background: isActive
                                ? `linear-gradient(135deg, ${p.surface}, rgba(${hexToRgbInline(p.primary)}, 0.1))`
                                : 'rgba(255,255,255,0.03)',
                              border: isActive
                                ? `2px solid ${p.primary}`
                                : '2px solid rgba(255,255,255,0.06)',
                              cursor: 'pointer',
                              textAlign: 'left',
                              color: '#fff',
                              transition: 'border-color 0.3s',
                              overflow: 'hidden',
                            }}
                          >
                            {/* Color dots preview */}
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '0.75rem' }}>
                              {[p.primary, p.primaryLight, p.accent, p.accentLight].map((c, i) => (
                                <div key={i} style={{
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  background: c,
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  boxShadow: `0 0 8px ${c}40`,
                                }} />
                              ))}
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.15rem' }}>
                              {p.icon} {p.name}
                            </div>

                            {/* Active check */}
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{
                                  position: 'absolute',
                                  top: '0.5rem',
                                  right: '0.5rem',
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '50%',
                                  background: p.primary,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Check size={12} strokeWidth={3} />
                              </motion.div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'performance' && (
                  <motion.div
                    key="performance"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'var(--color-text-muted)',
                      marginBottom: '1rem',
                    }}>
                      3D Render Quality
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                      {QUALITY_LEVELS.map(q => {
                        const isActive = renderQuality === q.id
                        return (
                          <motion.button
                            key={q.id}
                            onClick={() => setRenderQuality(q.id)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '1rem 1.25rem',
                              borderRadius: '1rem',
                              background: isActive ? 'rgba(var(--color-primary-rgb, 59,130,246), 0.1)' : 'rgba(255,255,255,0.03)',
                              border: isActive ? '1px solid rgba(var(--color-primary-rgb, 59,130,246), 0.3)' : '1px solid rgba(255,255,255,0.06)',
                              cursor: 'pointer',
                              color: '#fff',
                              textAlign: 'left',
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{q.label}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>{q.desc}</div>
                            </div>
                            {isActive && (
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: 'var(--color-primary, #3b82f6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}>
                                <Check size={14} strokeWidth={3} />
                              </div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>

                    <p style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'var(--color-text-muted)',
                      marginBottom: '1rem',
                    }}>
                      Animations
                    </p>

                    {/* Reduced Motion Toggle */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.25rem',
                      borderRadius: '1rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Moon size={18} color="var(--color-text-secondary)" />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Reduced Motion</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>Disable heavy animations</div>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setReducedMotion(!reducedMotion)}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          width: '44px',
                          height: '26px',
                          borderRadius: '13px',
                          background: reducedMotion ? 'var(--color-primary, #3b82f6)' : 'rgba(255,255,255,0.12)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: reducedMotion ? 'flex-end' : 'flex-start',
                          transition: 'background 0.3s, justify-content 0.3s',
                        }}
                      >
                        <motion.div
                          layout
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#fff',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                          }}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'display' && (
                  <motion.div
                    key="display"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'var(--color-text-muted)',
                      marginBottom: '1rem',
                    }}>
                      Quick Info
                    </p>

                    <div style={{
                      padding: '1.25rem',
                      borderRadius: '1rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      marginBottom: '1rem',
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                          { label: 'Device DPR', value: window.devicePixelRatio.toFixed(1) },
                          { label: 'Screen', value: `${window.screen.width}×${window.screen.height}` },
                          { label: 'Color Depth', value: `${window.screen.colorDepth}-bit` },
                          { label: 'GPU', value: (() => { try { const c = document.createElement('canvas'); const g = c.getContext('webgl'); const d = g?.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL).split('/')[0]?.substring(0, 35) : 'Unknown' } catch { return 'N/A' } })() },
                        ].map(item => (
                          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.label}</span>
                            <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{
                      padding: '1.25rem',
                      borderRadius: '1rem',
                      background: 'rgba(var(--color-primary-rgb, 59,130,246), 0.06)',
                      border: '1px solid rgba(var(--color-primary-rgb, 59,130,246), 0.12)',
                    }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                        <strong style={{ color: '#fff' }}>AutoSpectra v1.0</strong>
                        <br />
                        Built with React, Three.js, Framer Motion & Zustand. 
                        Settings are automatically saved to your browser.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1rem 1.75rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <button
                onClick={() => {
                  setThemePalette('midnight')
                  setRenderQuality('high')
                  setReducedMotion(false)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                }}
              >
                Reset to Defaults
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={toggleSettings}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '0.75rem',
                  background: 'var(--color-primary, #3b82f6)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                }}
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function hexToRgbInline(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '59, 130, 246'
}
