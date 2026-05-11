import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

function Loader() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#050505', gap: '16px'
    }}>
      <div style={{
        width: '60px', height: '2px', background: '#111',
        borderRadius: '1px', overflow: 'hidden'
      }}>
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
          animation: 'shimmer 1.5s linear infinite',
          backgroundSize: '200% auto'
        }} />
      </div>
      <span style={{
        fontSize: '9px', fontWeight: 900,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.4em', textTransform: 'uppercase'
      }}>
        Loading Asset
      </span>
    </div>
  )
}

export default function Scene({ children, style, ...props }) {
  return (
    <div style={{ position: 'absolute', inset: 0, ...style }}>
      <Canvas
        shadows
        dpr={[1, 1.2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 8], fov: 45 }}
        {...props}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}
