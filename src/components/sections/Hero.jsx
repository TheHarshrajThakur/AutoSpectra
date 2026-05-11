import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { Environment, Float, View, PerspectiveCamera } from '@react-three/drei'
import { GearModel } from '../3d/Models'
import { Suspense } from 'react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
}

function GearboxSystem() {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      {/* 
        Rotate the ENTIRE system so it faces the camera at an angle.
        Since GearModel already rotates by Math.PI/2 internally to face the camera, 
        we only need the small aesthetic tilt here!
      */}
      <group rotation={[-0.3, 0.4, 0]} position={[0, 0, 0]} scale={0.9}>
        {/* Main Center Gear - Slightly larger as in image */}
        <GearModel speed={0.4} position={[0, 0, 0]} scale={1.3} />
        
        {/* Top Right Gear */}
        <GearModel speed={0.4} reverse position={[1.35, 1.35, 0]} scale={1.2} phase={Math.PI/12} />
        
        {/* Bottom Left Gear */}
        <GearModel speed={0.4} reverse position={[-1.35, -1.35, 0]} scale={1.2} phase={Math.PI/12} />
        
        {/* Top Left Gear */}
        <GearModel speed={0.4} reverse position={[-1.35, 1.35, 0]} scale={1.2} phase={Math.PI/12} />
        
        {/* Bottom Right Gear */}
        <GearModel speed={0.4} reverse position={[1.35, -1.35, 0]} scale={1.2} phase={Math.PI/12} />
      </group>
    </Float>
  )
}

export default function Hero() {
  return (
    <section
      id="home"
      style={{
        minHeight: '100vh', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#000', overflow: 'hidden',
        padding: '8rem 5vw 4rem',
      }}
    >
      {/* Grid Background */}
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

      {/* Static Accent Glow (Performance Optimized) */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 60%)',
        borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none'
      }} />

      {/* Main Content Grid */}
      <div 
        className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center w-full max-w-[1200px] relative z-10"
      >
        
        {/* Left Column: Text */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mobile-center"
          style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
          {/* Badge */}
          <motion.div variants={item} className="section-label mobile-center" style={{ justifyContent: 'flex-start' }}>
            <span>Engineering The Future</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={item} style={{
            fontSize: 'clamp(2.5rem, 5vw, 5rem)',
            fontWeight: 800, lineHeight: 0.95,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif"
          }}>
            <span className="text-icy" style={{ display: 'block' }}>Auto</span>
            <span className="text-icy" style={{ display: 'block' }}>Spectra</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={item} style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
            color: '#94a3b8',
            fontWeight: 400, lineHeight: 1.7,
            maxWidth: '500px', marginBottom: '2.5rem'
          }}>
            The ultimate platform for mechanical engineers. Interact with high-fidelity 3D models and visualize complex mechanical systems in a true 360° environment.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="mobile-center" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            <motion.a
              href="#showcase"
              className="btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
            >
              Enter 360° Forge
              <ArrowRight size={16} />
            </motion.a>
            <motion.a
              href="#inventory"
              className="btn-ghost"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
            >
              Browse Catalog
            </motion.a>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            variants={item}
            className="stats-strip"
          >
            {[
              { value: '15+', label: 'INTERACTIVE MODELS' },
              { value: '360°', label: 'FULL INSPECTION' },
              { value: '4K', label: 'MESH FIDELITY' },
            ].map((stat, i) => (
              <div key={i} className="stats-item">
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: 3D Gearbox */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-[400px] lg:h-[700px] w-full relative"
        >
          {/* Decorative Background Glow for 3D area */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(50px)', zIndex: 0
          }} />
          
          <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
            <Canvas 
              camera={{ position: [0, 0, 8.5], fov: 45 }} 
              dpr={[1, 1.2]}
              gl={{ 
                antialias: false, 
                powerPreference: "high-performance",
                stencil: false,
                depth: true
              }}
            >
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 10]} intensity={2.5} />
              <directionalLight position={[-10, -10, -10]} intensity={0.5} />
              <Suspense fallback={null}>
                <GearboxSystem />
                <Environment preset="city" />
              </Suspense>
            </Canvas>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
