import React, { useEffect, Suspense, useRef, lazy } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Award, Gauge, ShieldAlert, Cpu, Sparkles, Sliders } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import Lenis from 'lenis'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import ModelViewer from './components/sections/ModelViewer'
import ComponentGallery from './components/sections/ComponentGallery'
import DetailPanel from './components/sections/DetailPanel'
import SpectraVoiceController from './components/utils/SpectraVoiceController'
import { AnimatedLogo } from './components/3d/Models'

import BackgroundGlow from './components/layout/BackgroundGlow'
import ThemeProvider from './components/layout/ThemeProvider'
import SettingsPanel from './components/layout/SettingsPanel'
import HandGestureController from './components/utils/HandGestureController'
import { useStore, THEME_PALETTES } from './store/useStore'

import { useTranslation } from 'react-i18next'

// Lazy-load heavy route components for faster initial load
const Academy = lazy(() => import('./components/sections/Academy'))
const SpectraLabHub = lazy(() => import('./components/sections/SpectraLabHub'))

// Full-page loading spinner for lazy routes
function PageLoader() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '80vh', gap: '1.25rem'
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.08)',
          borderTopColor: 'var(--color-primary, #3b82f6)',
        }}
      />
      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Loading Module…
      </span>
    </div>
  )
}

function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const academyTeaserModules = [
    {
      id: 'thermodynamics',
      title: t('academy_modules.thermodynamics.title', { defaultValue: 'Thermodynamics' }),
      desc: t('academy_modules.thermodynamics.desc', { defaultValue: 'Governing principles of energy conversion, thermal efficiency, and the Carnot cycle limit in real-world power plants.' }),
      tag: t('home_academy.tag_advanced', { defaultValue: 'Advanced' })
    },
    {
      id: 'engine-cycles',
      title: t('academy_modules.engine_cycles.title', { defaultValue: 'IC Engine Cycles' }),
      desc: t('academy_modules.engine_cycles.desc', { defaultValue: 'Deep dive into the Otto and Diesel thermodynamic cycles, volumetric efficiency, and combustion phase dynamics.' }),
      tag: t('home_academy.tag_core', { defaultValue: 'Core Module' })
    },
    {
      id: 'engine-anatomy',
      title: t('academy_modules.engine_anatomy.title', { defaultValue: 'Engine Anatomy' }),
      desc: t('academy_modules.engine_anatomy.desc', { defaultValue: 'Precision metallurgy of the rotating assembly, valvetrain dynamics, and mitigation of high-RPM valve float.' }),
      tag: t('home_academy.tag_chapters', { defaultValue: '12 Chapters' })
    },
    {
      id: 'forced-induction',
      title: t('academy_modules.forced_induction.title', { defaultValue: 'Forced Induction' }),
      desc: t('academy_modules.forced_induction.desc', { defaultValue: 'Turbocharger thermodynamics, adiabatic efficiency, and charge air cooling strategies for extreme power gains.' }),
      tag: t('home_academy.tag_specialized', { defaultValue: 'Specialized' })
    },
    {
      id: 'fluid-mechanics',
      title: t('academy_modules.fluid_mechanics.title', { defaultValue: 'Fluid Dynamics' }),
      desc: t('academy_modules.fluid_mechanics.desc', { defaultValue: 'Hydrodynamic lubrication states, boundary layer behavior in intake runners, and high-G cavitation prevention.' }),
      tag: t('home_academy.tag_modules', { defaultValue: '8 Modules' })
    },
    {
      id: 'materials',
      title: t('academy_modules.materials.title', { defaultValue: 'Material Science' }),
      desc: t('academy_modules.materials.desc', { defaultValue: 'Crystalline grain structures in forged alloys, and the application of exotic superalloys like Inconel and Titanium.' }),
      tag: t('home_academy.tag_metallurgy', { defaultValue: 'Metallurgy' })
    }
  ]

  return (
    <>
      <Hero />
      <ModelViewer />

      {/* SpectraLab Engineering Suite Featured Section */}
      <section id="spectralab" style={{ padding: '6rem 0', background: 'transparent', position: 'relative' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 5vw', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="section-label"
              style={{ display: 'inline-flex', marginBottom: '0.75rem' }}
            >
              <span>SpectraLab Engineering Suite</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                fontFamily: "'Outfit', sans-serif",
                margin: 0
              }}
            >
              Real-Time <span className="text-gradient-blue">Acoustics, Dyno & Diagnostics</span>
            </motion.h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '640px', margin: '0.75rem auto 0', fontSize: '1rem', lineHeight: 1.6 }}>
              Experience features never before seen in an automotive platform: pure mathematical sound synthesis, live dyno power pulls, acoustic knock injection, and custom thermodynamic architecture.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {/* Card 1: Dyno */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate('/dyno')}
              className="glass-card card-hover"
              style={{
                background: 'rgba(15, 18, 28, 0.7)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '1.5rem',
                padding: '2rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
              }}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid rgba(59,130,246,0.3)' }}>
                  <Gauge size={24} color="#60a5fa" />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
                  SpectraDyno Bench
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  Procedural Web Audio API V8 acoustics up to 8,500 RPM, live dyno sweep curves, cherry-red manifold glow, and 0–100 drag strip launch control.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 700, marginTop: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Launch Dyno Pull <ArrowRight size={16} />
              </div>
            </motion.div>

            {/* Card 2: Diagnostics */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate('/diagnostics')}
              className="glass-card card-hover"
              style={{
                background: 'rgba(15, 18, 28, 0.7)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '1.5rem',
                padding: '2rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
              }}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <ShieldAlert size={24} color="#f87171" />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
                  Acoustic OBD-II Lab
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  Inject mechanical failure modes: spun rod knock, cylinder misfires, and pre-ignition detonation. Inspect real-time FFT frequency spectrum spikes and DTC codes.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontSize: '0.85rem', fontWeight: 700, marginTop: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Open Diagnostics <ArrowRight size={16} />
              </div>
            </motion.div>

            {/* Card 3: SpecForge */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate('/builder')}
              className="glass-card card-hover"
              style={{
                background: 'rgba(15, 18, 28, 0.7)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '1.5rem',
                padding: '2rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
              }}
            >
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid rgba(168,85,247,0.3)' }}>
                  <Sliders size={24} color="#c084fc" />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
                  SpecForge Architect
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  Customize cylinder bore, stroke, compression ratio, and forced induction boost. Compute mean piston speeds, theoretical Otto cycle thermal efficiency, and peak BHP.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.85rem', fontWeight: 700, marginTop: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Build Custom V8 <ArrowRight size={16} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ComponentGallery />

      {/* Learn / Academy Section */}
      <section id="academy" style={{ padding: '8rem 0', background: 'transparent', position: 'relative' }}>
        <div className="bg-dot" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5vw', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="section-label"
          >
            <span>{t('home_academy.badge')}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30, rotateX: -20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif", marginBottom: '3rem', perspective: '1000px' }}
          >
            {t('home_academy.title_part1')} <span className="text-gradient-blue">{t('home_academy.title_part2')}</span>
          </motion.h2>

          {/* Assessment Featured Banner */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={() => navigate('/assessment')}
            style={{
              padding: '2rem 2.5rem',
              borderRadius: '1.5rem',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(59,130,246,0.15) 100%)',
              border: '1px solid rgba(239,68,68,0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              marginBottom: '3rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
            className="card-hover"
          >
            <div style={{ maxWidth: '650px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                <Award size={15} /> Comprehensive Assessment & Certification
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: '0 0 0.5rem 0', fontFamily: "'Outfit', sans-serif" }}>
                V8 Engine Builder & Calibration Certification
              </h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Assess your technical knowledge across 5 progressive tiers — from bore/stroke geometry to bearing oil clearances and forced induction. Earn your verified Certificate of Competence.
              </p>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 1.75rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontWeight: 800, fontSize: '0.95rem', boxShadow: '0 10px 20px rgba(239,68,68,0.3)' }}>
              <span>Launch Assessment</span>
              <ArrowRight size={16} />
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
            {academyTeaserModules.map((module, i) => (
              <motion.div
                key={module.id}
                onClick={() => navigate('/academy')}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  rotateX: 5,
                  rotateY: -5,
                  boxShadow: '0 25px 50px -12px rgba(59,130,246,0.3)',
                  borderColor: 'rgba(59,130,246,0.5)'
                }}
                className="glass-card card-hover"
                style={{
                  padding: '2.5rem', borderRadius: '1.5rem', cursor: 'pointer', transformStyle: 'preserve-3d',
                  width: 'min(100%, 360px)', height: '280px',
                  background: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 15px 35px -5px rgba(0,0,0,0.8), 0 0 15px rgba(59,130,246,0.05)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                      display: 'inline-block', padding: '0.4rem 0.8rem', borderRadius: '0.5rem',
                      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                      fontSize: '0.65rem', fontWeight: 800, color: '#3b82f6',
                      textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem',
                      alignSelf: 'flex-start'
                    }}
                  >
                    {module.tag}
                  </motion.div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                    {module.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6, flexGrow: 1 }}>
                    {module.desc}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 700, marginTop: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('home_academy.explore_module')} <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '8rem 0', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="bg-grid"
          style={{ position: 'absolute', inset: -1000, opacity: 0.15, transformOrigin: 'center' }}
        />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5vw', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="section-label"
            >
              <span>{t('about.badge')}</span>
            </motion.div>
          </div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif", marginBottom: '2rem' }}
          >
            {t('about.title_part1')} <span className="text-gradient-blue">{t('about.title_part2')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '800px', margin: '0 auto' }}
          >
            {t('about.desc')}
          </motion.p>
        </div>
      </section>
    </>
  )
}

export default function App() {
  const { t } = useTranslation()
  const location = useLocation()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const isHandTracking = useStore(state => state.isHandTracking)

  useEffect(() => {
    const lenis = new Lenis({ 
      duration: 1.0, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      prevent: (node) => node?.hasAttribute?.('data-lenis-prevent') || !!node?.closest?.('[data-lenis-prevent]'),
    })
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
    const id = requestAnimationFrame(raf)
    return () => { lenis.destroy() }
  }, [])

  const containerRef = useRef(null)

  return (
    <div ref={containerRef} style={{ background: 'var(--color-surface, #050505)', color: 'var(--color-text, #fff)', minHeight: '100vh', position: 'relative' }}>
      <ThemeProvider />
      <BackgroundGlow />
      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
          background: 'var(--color-gradient, linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa))',
          transformOrigin: '0%', scaleX, zIndex: 1000
        }}
      />

      <Navbar />
      <SpectraVoiceController />
      <SettingsPanel />

      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/part/:id" element={<DetailPanel />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/assessment" element={<Academy initialMode="assessment" />} />
            <Route path="/lab" element={<SpectraLabHub />} />
            <Route path="/dyno" element={<SpectraLabHub initialTab="dyno" />} />
            <Route path="/diagnostics" element={<SpectraLabHub initialTab="diagnostics" />} />
            <Route path="/builder" element={<SpectraLabHub initialTab="builder" />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer - Only shown on Home page */}
      {location.pathname === '/' && <Footer />}
    </div>
  )
}
