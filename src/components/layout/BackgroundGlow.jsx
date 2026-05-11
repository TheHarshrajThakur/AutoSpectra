import { motion } from 'framer-motion'

export default function BackgroundGlow() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Deep Blue Orb */}
      <motion.div
        animate={{
          x: ['-20%', '20%', '-10%', '-20%'],
          y: ['-10%', '20%', '5%', '-10%'],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '10%', left: '10%', width: '30vw', height: '30vw',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 80%)',
          borderRadius: '50%', filter: 'blur(20px)',
          willChange: 'transform'
        }}
      />
      
      {/* Purple Orb */}
      <motion.div
        animate={{
          x: ['20%', '-20%', '10%', '20%'],
          y: ['20%', '-10%', '30%', '20%'],
          scale: [0.9, 1.1, 1, 0.9],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '40%', right: '10%', width: '35vw', height: '35vw',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, rgba(0,0,0,0) 80%)',
          borderRadius: '50%', filter: 'blur(20px)',
          willChange: 'transform'
        }}
      />

      {/* Cyan/Teal Orb */}
      <motion.div
        animate={{
          x: ['10%', '-10%', '-20%', '10%'],
          y: ['-20%', '10%', '-10%', '-20%'],
          scale: [1.1, 0.9, 1.2, 1.1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', bottom: '-10%', left: '30%', width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, rgba(0,0,0,0) 80%)',
          borderRadius: '50%', filter: 'blur(20px)',
          willChange: 'transform'
        }}
      />
    </div>
  )
}
