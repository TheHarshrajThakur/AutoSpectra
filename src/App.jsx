import React, { useEffect, Suspense, useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ArrowRight, Award } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import Lenis from 'lenis'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import ModelViewer from './components/sections/ModelViewer'
import ComponentGallery from './components/sections/ComponentGallery'
import DetailPanel from './components/sections/DetailPanel'
import Academy from './components/sections/Academy'
import { AnimatedLogo } from './components/3d/Models'

import BackgroundGlow from './components/layout/BackgroundGlow'
import HandGestureController from './components/utils/HandGestureController'
import { useStore } from './store/useStore'

import { useTranslation } from 'react-i18next'

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

  const platformLinks = [
    { label: t('footer.link_forge'), href: '#360' },
    { label: t('footer.link_library'), href: '#inventory' },
    { label: t('footer.link_academy'), href: '/academy' },
    { label: 'V8 Builder Assessment', href: '/assessment' },
    { label: t('footer.link_schematics'), href: '#inventory' }
  ]

  const resourceLinks = [
    { label: t('footer.link_docs'), href: '#' },
    { label: t('footer.link_community'), href: '#' },
    { label: t('footer.link_status'), href: '#' },
    { label: t('footer.link_changelog'), href: '#' }
  ]

  return (
    <div ref={containerRef} style={{ background: '#050505', color: '#fff', minHeight: '100vh', position: 'relative' }}>
      <BackgroundGlow />
      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa)',
          transformOrigin: '0%', scaleX, zIndex: 1000
        }}
      />

      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/part/:id" element={<DetailPanel />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/assessment" element={<Academy initialMode="assessment" />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '6rem 1.5rem 3rem', borderTop: '1px solid rgba(255,255,255,0.05)',
        background: '#050505', position: 'relative'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
            {/* Branding Column */}
            <div className="col-span-1 sm:col-span-2 mobile-center">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', height: '2.8rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
                  <span className="text-icy">Auto Spectra</span>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '400px' }}>
                {t('footer.desc')}
              </p>
            </div>

            {/* Quick Links */}
            <div className="mobile-center">
              <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('footer.platform_title')}</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {platformLinks.map(link => (
                  <li key={link.label}><a href={link.href} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>{link.label}</a></li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="mobile-center">
              <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{t('footer.resources_title')}</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resourceLinks.map(link => (
                  <li key={link.label}><a href={link.href} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}>{link.label}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mobile-center" style={{ paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', fontWeight: 500 }}>
              {t('footer.copyright')}
            </span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
