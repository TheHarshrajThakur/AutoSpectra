import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Float, useAnimations } from '@react-three/drei'

const ENGINE_URL = '/models/Web.glb'

export function MainEngine({ animated = true, ...props }) {
  const group = useRef()
  const { scene, animations } = useGLTF(ENGINE_URL)
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    if (animated && names.length > 0) {
      // Play all animations found in the GLB
      names.forEach((name) => {
        actions[name]?.reset().fadeIn(0.5).play()
      })
    }
  }, [animated, actions, names])

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
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
