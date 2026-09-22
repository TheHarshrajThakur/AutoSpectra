import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Float, useAnimations, Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const ENGINE_URL = '/models/Web.glb'

function getDisplacementDirection(originalPos) {
  const { x, y, z } = originalPos
  
  // 1. Intake / supercharger system (moves straight up)
  if (y > 0.4 && Math.abs(x) < 0.25) {
    return new THREE.Vector3(0, 1.8, 0)
  }
  // 2. Right Cylinder Head (moves up and right)
  if (y > 0.3 && x > 0.2) {
    return new THREE.Vector3(1.2, 1.0, 0)
  }
  // 3. Left Cylinder Head (moves up and left)
  if (y > 0.3 && x < -0.2) {
    return new THREE.Vector3(-1.2, 1.0, 0)
  }
  // 4. Oil Pan / Lower parts (moves down)
  if (y < -0.4) {
    return new THREE.Vector3(0, -1.5, 0)
  }
  // 5. Front Pulleys / Timing gear (moves forward)
  if (z > 0.4) {
    return new THREE.Vector3(0, 0, 1.5)
  }
  // 6. Rear Flywheel / clutch (moves backward)
  if (z < -0.4) {
    return new THREE.Vector3(0, 0, -1.5)
  }
  
  // 7. Core block & internal rotating assembly (radial offset)
  const radial = new THREE.Vector3(x, 0, z).normalize()
  radial.y = y * 0.4
  return radial.multiplyScalar(0.8)
}

function EngineLabel({ position, title, description, active }) {
  const [hovered, setHovered] = useState(false)
  
  if (!active) return null
  
  return (
    <Html position={position} center distanceFactor={6}>
      <div 
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 100 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          background: 'rgba(5, 5, 5, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          padding: '6px 12px',
          borderRadius: '20px',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 15px rgba(0,0,0,0.6), 0 0 10px rgba(59, 130, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.2s ease-in-out'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
          {title}
        </div>
        
        {/* Tooltip Description */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                top: '35px',
                width: '240px',
                background: 'rgba(10, 10, 15, 0.96)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '10px 14px',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '11px',
                lineHeight: 1.5,
                fontFamily: "'Inter', sans-serif",
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                pointerEvents: 'none'
              }}
            >
              {description}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Html>
  )
}

export function MainEngine({ animated = true, explosionFactor = 0, showLabels = true, ...props }) {
  const { t } = useTranslation()
  const group = useRef()
  const { scene, animations } = useGLTF(ENGINE_URL)
  const { actions, names } = useAnimations(animations, group)
  
  const originalPositions = useRef(new Map())
  const meshNodes = useRef([])
  const wasExploded = useRef(false)

  // Cache original coordinates on load
  useEffect(() => {
    const list = []
    scene.traverse((child) => {
      if (child.isMesh) {
        list.push(child)
        if (!originalPositions.current.has(child.uuid)) {
          originalPositions.current.set(child.uuid, {
            position: child.position.clone(),
            rotation: child.rotation.clone(),
            scale: child.scale.clone(),
            displacement: getDisplacementDirection(child.position)
          })
        }
      }
    })
    meshNodes.current = list
  }, [scene])

  // Play rotation animation when not exploded
  useEffect(() => {
    if (names.length > 0) {
      if (animated && explosionFactor === 0) {
        actions[names[0]]?.reset().fadeIn(0.5).play()
      } else {
        actions[names[0]]?.fadeOut(0.2)
      }
    }
  }, [animated, explosionFactor, actions, names])

  // Apply explosion offsets per frame
  useFrame(() => {
    if (meshNodes.current.length === 0) return

    const factor = explosionFactor
    
    // Only update meshes if we are exploding OR if we just finished collapsing
    if (factor > 0.001 || wasExploded.current) {
      meshNodes.current.forEach((mesh) => {
        const data = originalPositions.current.get(mesh.uuid)
        if (!data) return

        // Calculate exploded position
        const targetPos = data.position.clone().addScaledVector(data.displacement, factor)
        mesh.position.copy(targetPos)
      })

      wasExploded.current = factor > 0.001
    }
  })

  // Subsystem Label Coordinates
  const labelsActive = showLabels && explosionFactor > 0.5
  
  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
      
      {/* Subsystem interactive overlay markers */}
      <EngineLabel 
        position={[0, 1.8 + explosionFactor * 2.0, 0]} 
        title={t('models_labels.supercharger_title')} 
        description={t('models_labels.supercharger_desc')}
        active={labelsActive}
      />
      <EngineLabel 
        position={[-1.5 - explosionFactor * 1.5, 0.8 + explosionFactor * 1.2, 0.2]} 
        title={t('models_labels.left_head_title')} 
        description={t('models_labels.left_head_desc')}
        active={labelsActive}
      />
      <EngineLabel 
        position={[1.5 + explosionFactor * 1.5, 0.8 + explosionFactor * 1.2, 0.2]} 
        title={t('models_labels.right_head_title')} 
        description={t('models_labels.right_head_desc')}
        active={labelsActive}
      />
      <EngineLabel 
        position={[0, -0.6 - explosionFactor * 1.8, 0]} 
        title={t('models_labels.crankshaft_title')} 
        description={t('models_labels.crankshaft_desc')}
        active={labelsActive}
      />
      <EngineLabel 
        position={[0, 0.3, 0.6 + explosionFactor * 1.8]} 
        title={t('models_labels.timing_belt_title')} 
        description={t('models_labels.timing_belt_desc')}
        active={labelsActive}
      />
      <EngineLabel 
        position={[0, 0.1, -0.2]} 
        title={t('models_labels.block_core_title')} 
        description={t('models_labels.block_core_desc')}
        active={labelsActive}
      />
    </group>
  )
}

useGLTF.preload(ENGINE_URL)

const CRANKSHAFT_URL = '/models/crankshaft_baked_anim__anim_vilebrequin.glb'
const PISTON_URL = '/models/piston.glb'
const SPARK_PLUG_URL = '/models/spark_plug.glb'
const INTERNALS_URL = '/models/v8_engine_internals.glb'

export function CrankshaftModel({ ...props }) {
  const { scene } = useGLTF(CRANKSHAFT_URL)
  return <primitive object={scene.clone()} {...props} />
}

export function PistonModel({ ...props }) {
  const { scene } = useGLTF(PISTON_URL)
  return <primitive object={scene.clone()} {...props} />
}

export function SparkPlugModel({ ...props }) {
  const { scene } = useGLTF(SPARK_PLUG_URL)
  return <primitive object={scene.clone()} {...props} />
}

export function InternalsModel({ ...props }) {
  const { scene } = useGLTF(INTERNALS_URL)
  return <primitive object={scene.clone()} {...props} />
}

useGLTF.preload(CRANKSHAFT_URL)
useGLTF.preload(PISTON_URL)
useGLTF.preload(SPARK_PLUG_URL)
useGLTF.preload(INTERNALS_URL)

const ENGINE_BLOCK_URL = '/models/v8_engine_block.glb'

export function EngineBlockModel({ ...props }) {
  const { scene } = useGLTF(ENGINE_BLOCK_URL)
  return <primitive object={scene.clone()} {...props} />
}

useGLTF.preload(ENGINE_BLOCK_URL)

export function AnimatedLogo({ speed = 0.5, reverse = false, phase = 0, ...props }) {
  const group = useRef()
  
  useFrame((state) => {
    if (group.current && speed !== 0) {
      const direction = reverse ? 1 : -1
      // Rotate the gear around its central Y axis, plus the initial phase
      group.current.rotation.y = (direction * state.clock.getElapsedTime() * speed) + phase
    }
  })

  // Colors based on the provided 3D image
  const lightMetal = "#f8fafc" // Bright silver
  const darkMetal = "#0f172a"  // Deep dark gunmetal
  const medMetal = "#475569"   // Medium steel

  return (
    // Base rotation so the face is towards the camera, but tilted to match the provided image
    <group rotation={[Math.PI/2 - 0.3, 0.2, 0]} {...props}>
      <group ref={group} scale={1.2}>
        
        {/* Outer gear body */}
        <mesh>
          <cylinderGeometry args={[0.7, 0.7, 0.15, 24]} />
          <meshStandardMaterial color={medMetal} metalness={0.7} roughness={0.2} />
        </mesh>
        
        {/* Recessed middle ring (darker) */}
        <mesh position={[0, 0.076, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
          <meshStandardMaterial color={darkMetal} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.076, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
          <meshStandardMaterial color={darkMetal} metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Raised inner ring */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.22, 32]} />
          <meshStandardMaterial color={lightMetal} metalness={0.6} roughness={0.1} />
        </mesh>

        {/* Center hole cutout illusion */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 32]} />
          <meshStandardMaterial color="#000" />
        </mesh>

        {/* Gear Teeth (12 teeth) */}
        {[...Array(12)].map((_, i) => (
          <mesh key={i} rotation={[0, (i * Math.PI * 2) / 12, 0]}>
            <boxGeometry args={[1.65, 0.15, 0.16]} />
            <meshStandardMaterial color={medMetal} metalness={0.7} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function GearModel({ speed = 0.5, reverse = false, phase = 0, ...props }) {
  const group = useRef()
  
  useFrame((state) => {
    if (group.current && speed !== 0) {
      const direction = reverse ? 1 : -1
      group.current.rotation.z = (direction * state.clock.getElapsedTime() * speed) + phase
    }
  })

  const lightMetal = "#f8fafc" 
  const darkMetal = "#0f172a"  
  const medMetal = "#475569"   

  return (
    <group {...props}>
      <group ref={group}>
        <group rotation={[Math.PI/2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.7, 0.7, 0.15, 24]} />
            <meshStandardMaterial color={medMetal} metalness={0.7} roughness={0.2} />
          </mesh>
          
          <mesh position={[0, 0.076, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
            <meshStandardMaterial color={darkMetal} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.076, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
            <meshStandardMaterial color={darkMetal} metalness={0.8} roughness={0.3} />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.22, 32]} />
            <meshStandardMaterial color={lightMetal} metalness={0.6} roughness={0.1} />
          </mesh>

          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 32]} />
            <meshStandardMaterial color="#000" />
          </mesh>

          {[...Array(12)].map((_, i) => (
            <mesh key={i} rotation={[0, (i * Math.PI * 2) / 12, 0]}>
              <boxGeometry args={[1.65, 0.15, 0.16]} />
              <meshStandardMaterial color={medMetal} metalness={0.7} roughness={0.2} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}
