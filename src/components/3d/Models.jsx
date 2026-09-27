import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Float, useAnimations, Html, Center } from '@react-three/drei'
import * as THREE from 'three'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../store/useStore'

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

function EngineLabel({ 
  position, 
  title, 
  fullName, 
  category = 'Mechanical Subsystem', 
  description, 
  spec, 
  color = '#3b82f6', 
  active,
  id
}) {
  const [hovered, setHovered] = useState(false)
  const setHoveredEnginePart = useStore(state => state.setHoveredEnginePart)
  const selectedEnginePart = useStore(state => state.selectedEnginePart)
  const setSelectedEnginePart = useStore(state => state.setSelectedEnginePart)

  if (!active) return null

  const isPinned = selectedEnginePart?.id === id
  const isVisible = hovered || isPinned

  const handleMouseEnter = () => {
    setHovered(true)
    if (setHoveredEnginePart) {
      setHoveredEnginePart({
        id,
        title,
        fullName: fullName || title,
        category,
        description,
        spec,
        color
      })
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    if (setHoveredEnginePart && !selectedEnginePart) {
      setHoveredEnginePart(null)
    }
  }

  const handleTogglePin = (e) => {
    e.stopPropagation()
    if (isPinned) {
      if (setSelectedEnginePart) setSelectedEnginePart(null)
      if (setHoveredEnginePart) setHoveredEnginePart(null)
    } else {
      const partData = {
        id,
        title,
        fullName: fullName || title,
        category,
        description,
        spec,
        color
      }
      if (setSelectedEnginePart) setSelectedEnginePart(partData)
      if (setHoveredEnginePart) setHoveredEnginePart(partData)
    }
  }

  return (
    <Html position={position} center distanceFactor={7} style={{ pointerEvents: 'none' }}>
      <div 
        style={{ 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          zIndex: isVisible ? 999 : 50,
          pointerEvents: 'auto'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Pulse Dot & Badge Container */}
        <div 
          onClick={handleTogglePin}
          title={isPinned ? "Click to unlock" : "Click to lock telemetry inspection"}
          style={{
            background: isVisible ? 'rgba(10, 15, 26, 0.98)' : 'rgba(7, 10, 18, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1.5px solid ${isVisible ? color : 'rgba(59, 130, 246, 0.35)'}`,
            padding: '5px 12px',
            borderRadius: '30px',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: "'Outfit', 'Inter', sans-serif",
            whiteSpace: 'nowrap',
            boxShadow: isVisible 
              ? `0 0 25px ${color}99, 0 8px 24px rgba(0,0,0,0.85)` 
              : '0 4px 15px rgba(0,0,0,0.6), 0 0 10px rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            transform: isVisible ? 'scale(1.08)' : 'scale(1)',
            transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            userSelect: 'none'
          }}
        >
          {/* Pulsing Core Ring */}
          <div style={{ position: 'relative', width: '8px', height: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: color,
              opacity: isVisible ? 0.9 : 0.6,
              animation: 'ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} />
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 8px ${color}`
            }} />
          </div>
          
          <span style={{ letterSpacing: '0.02em', color: isVisible ? '#fff' : 'rgba(255,255,255,0.92)' }}>
            {title}
          </span>

          {isPinned && (
            <span style={{
              fontSize: '8px',
              background: color,
              color: '#000',
              fontWeight: 900,
              padding: '1px 5px',
              borderRadius: '10px',
              letterSpacing: '0.05em'
            }}>
              LOCKED
            </span>
          )}
        </div>

        {/* CAD Schematic Pointer Stem */}
        <div style={{
          width: '1.5px',
          height: '14px',
          background: `linear-gradient(to bottom, ${isVisible ? color : 'rgba(59,130,246,0.6)'}, transparent)`,
          transition: 'background 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: isVisible ? color : 'rgba(59,130,246,0.8)' }} />
        </div>
      </div>
    </Html>
  )
}

function ThermalLabel({ position, temp, title, subtitle, color = '#ef4444' }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Html position={position} center distanceFactor={6}>
      <div 
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 120, cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{
          background: 'rgba(10, 10, 15, 0.95)',
          border: `1px solid ${color}`,
          padding: '4px 10px',
          borderRadius: '20px',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 800,
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: `0 0 15px ${color}66, 0 4px 12px rgba(0,0,0,0.8)`
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
          <span>{temp}</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '9px' }}>{title}</span>
        </div>
        {hovered && (
          <div style={{
            position: 'absolute',
            top: '32px',
            width: '180px',
            background: 'rgba(15, 18, 25, 0.96)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '6px',
            padding: '6px 10px',
            color: '#cbd5e1',
            fontSize: '10px',
            lineHeight: 1.4,
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(0,0,0,0.8)'
          }}>
            {subtitle}
          </div>
        )}
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
  const originalMaterials = useRef(new Map())
  const thermalMaterials = useRef(new Map())
  const xrayMaterials = useRef(new Map())
  const meshNodes = useRef([])
  const wasExploded = useRef(false)

  const visionMode = useStore(state => state.visionMode)
  const crankAngle = useStore(state => state.crankAngle)

  // Cache original coordinates and materials on load
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
        if (!originalMaterials.current.has(child.uuid)) {
          originalMaterials.current.set(child.uuid, child.material)

          // Precompute FLIR Thermal Material based on vertical height Y
          const y = child.position.y
          let thermalColor = '#f97316' // Orange (mid block ~400°C)
          let heatTemp = '420°C'
          if (y > 0.35) {
            thermalColor = '#ef4444' // Cherry red / White hot (~920°C heads)
            heatTemp = '920°C'
          } else if (y < -0.3) {
            thermalColor = '#3b82f6' // Blue / Cyan (~85°C oil pan)
            heatTemp = '85°C'
          }

          thermalMaterials.current.set(child.uuid, new THREE.MeshStandardMaterial({
            color: thermalColor,
            emissive: thermalColor,
            emissiveIntensity: 0.45,
            metalness: 0.3,
            roughness: 0.4
          }))

          // Precompute Hologram X-Ray Material
          xrayMaterials.current.set(child.uuid, new THREE.MeshStandardMaterial({
            color: '#06b6d4',
            emissive: '#0891b2',
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.38,
            wireframe: false,
            metalness: 0.8,
            roughness: 0.2
          }))
        }
      }
    })
    meshNodes.current = list
  }, [scene])

  // Material Swapper based on visionMode
  useEffect(() => {
    if (meshNodes.current.length === 0) return

    meshNodes.current.forEach((mesh) => {
      if (visionMode === 'thermal') {
        const mat = thermalMaterials.current.get(mesh.uuid)
        if (mat) mesh.material = mat
      } else if (visionMode === 'xray') {
        const mat = xrayMaterials.current.get(mesh.uuid)
        if (mat) mesh.material = mat
      } else {
        // Standard / Cycle -> restore original
        const origMat = originalMaterials.current.get(mesh.uuid)
        if (origMat) mesh.material = origMat
      }
    })
  }, [visionMode])

  // Play rotation animation when not exploded & not in manual crank cycle mode
  useEffect(() => {
    if (names.length > 0) {
      if (animated && explosionFactor === 0 && visionMode !== 'cycle') {
        actions[names[0]]?.reset().fadeIn(0.5).play()
      } else {
        actions[names[0]]?.fadeOut(0.2)
      }
    }
  }, [animated, explosionFactor, visionMode, actions, names])

  // Apply explosion offsets and crank rotation per frame
  useFrame(() => {
    if (visionMode === 'cycle' && group.current) {
      group.current.rotation.y = (crankAngle * Math.PI) / 360
    }

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

  // Subsystem Label Coordinates - visible whenever showLabels is true in standard mode
  const labelsActive = showLabels && visionMode === 'standard'
  const isCombustionFiring = visionMode === 'cycle' && (crankAngle >= 350 && crankAngle <= 430)
  
  return (
    <group ref={group} {...props}>
      <primitive object={scene} />

      {/* Internal Combustion Flash Light for 720° Cycle Mode */}
      {isCombustionFiring && (
        <pointLight position={[0, 0.4, 0]} color="#f97316" intensity={18} distance={4} decay={2} />
      )}

      {/* FLIR Thermal Hotspot Telemetry Probes */}
      {visionMode === 'thermal' && (
        <>
          <ThermalLabel 
            position={[0, 1.9, 0]} 
            temp="68°C" 
            title="Supercharger" 
            subtitle="Intercooled forced induction charge air"
            color="#38bdf8"
          />
          <ThermalLabel 
            position={[-1.4, 0.9, 0.2]} 
            temp="942°C" 
            title="Left Head" 
            subtitle="Primary combustion flame front & exhaust ports"
            color="#ef4444"
          />
          <ThermalLabel 
            position={[1.4, 0.9, 0.2]} 
            temp="938°C" 
            title="Right Head" 
            subtitle="High thermal flux zone near spark plug tips"
            color="#ef4444"
          />
          <ThermalLabel 
            position={[0, 0.1, -0.3]} 
            temp="185°C" 
            title="Engine Block" 
            subtitle="Jacketed cast aluminum water passages"
            color="#f97316"
          />
          <ThermalLabel 
            position={[0, -0.9, 0]} 
            temp="88°C" 
            title="Oil Sump" 
            subtitle="Lubricant reservoir within ideal operating range"
            color="#3b82f6"
          />
        </>
      )}
      
      {/* Subsystem interactive overlay markers */}
      <EngineLabel 
        id="supercharger"
        position={[0, 2.1 + explosionFactor * 1.5, 0.1]} 
        title={t('models_labels.supercharger_title', { defaultValue: 'Supercharger / Intake' })} 
        fullName={t('models_labels.supercharger_fullName', { defaultValue: 'Twin-Screw Roots Supercharger & Induction Plenum' })}
        category={t('models_labels.supercharger_category', { defaultValue: 'Forced Induction' })}
        description={t('models_labels.supercharger_desc')}
        spec={t('models_labels.supercharger_spec', { defaultValue: 'Peak Boost: 1.4 Bar (20.3 PSI) | Dual Screw Rotors' })}
        color="#38bdf8"
        active={labelsActive}
      />
      <EngineLabel 
        id="left_head"
        position={[-1.9 - explosionFactor * 1.3, 1.15 + explosionFactor * 0.9, 0.1]} 
        title={t('models_labels.left_head_title', { defaultValue: 'Left Cylinder Head' })} 
        fullName={t('models_labels.left_head_fullName', { defaultValue: 'Bank 1 (Left) DOHC 24V Cylinder Head & Valvetrain' })}
        category={t('models_labels.left_head_category', { defaultValue: 'Valvetrain & Combustion' })}
        description={t('models_labels.left_head_desc')}
        spec={t('models_labels.left_head_spec', { defaultValue: 'DOHC 4-Valves/Cyl | Variable Cam Phasing (VVT)' })}
        color="#f43f5e"
        active={labelsActive}
      />
      <EngineLabel 
        id="right_head"
        position={[1.9 + explosionFactor * 1.3, 1.15 + explosionFactor * 0.9, 0.1]} 
        title={t('models_labels.right_head_title', { defaultValue: 'Right Cylinder Head' })} 
        fullName={t('models_labels.right_head_fullName', { defaultValue: 'Bank 2 (Right) DOHC 24V Cylinder Head & Valvetrain' })}
        category={t('models_labels.right_head_category', { defaultValue: 'Valvetrain & Combustion' })}
        description={t('models_labels.right_head_desc')}
        spec={t('models_labels.right_head_spec', { defaultValue: 'Compression Ratio: 10.5:1 | Cross-Flow Pent-Roof' })}
        color="#f43f5e"
        active={labelsActive}
      />
      <EngineLabel 
        id="fuel_rail"
        position={[-0.85 - explosionFactor * 0.5, 1.65 + explosionFactor * 1.1, 0.2]} 
        title={t('models_labels.fuel_rail_title', { defaultValue: 'Direct Fuel Rail' })} 
        fullName={t('models_labels.fuel_rail_fullName', { defaultValue: 'High-Pressure Direct Fuel Injection Rail & Injectors' })}
        category={t('models_labels.fuel_rail_category', { defaultValue: 'Fuel Delivery' })}
        description={t('models_labels.fuel_rail_desc', { defaultValue: 'Delivers atomized fuel at up to 250 bar directly into combustion chambers with multi-stage micro-burst injection cycles.' })}
        spec={t('models_labels.fuel_rail_spec', { defaultValue: 'Rail Pressure: 250 Bar | Multi-Hole Laser Nozzles' })}
        color="#f97316"
        active={labelsActive}
      />
      <EngineLabel 
        id="block_core"
        position={[0, 0.15 + explosionFactor * 0.3, 0.85]} 
        title={t('models_labels.block_core_title', { defaultValue: 'Engine Block Core' })} 
        fullName={t('models_labels.block_core_fullName', { defaultValue: 'Crossplane Deep-Skirt Engine Block Core & Liners' })}
        category={t('models_labels.block_core_category', { defaultValue: 'Structural Core' })}
        description={t('models_labels.block_core_desc')}
        spec={t('models_labels.block_core_spec', { defaultValue: 'Cast A319 Aluminum | Cross-Bolted 6-Bolt Mains' })}
        color="#10b981"
        active={labelsActive}
      />
      <EngineLabel 
        id="timing_belt"
        position={[0, -0.55, 1.05 + explosionFactor * 1.2]} 
        title={t('models_labels.timing_belt_title', { defaultValue: 'Timing Belt & Pulleys' })} 
        fullName={t('models_labels.timing_belt_fullName', { defaultValue: 'Front Serpentine Timing Belt & Pulley System' })}
        category={t('models_labels.timing_belt_category', { defaultValue: 'Timing & Auxiliary Drive' })}
        description={t('models_labels.timing_belt_desc')}
        spec={t('models_labels.timing_belt_spec', { defaultValue: 'Kevlar-Reinforced Belt | Torsional Vibration Damper' })}
        color="#a855f7"
        active={labelsActive}
      />
      <EngineLabel 
        id="crankshaft"
        position={[-0.95 - explosionFactor * 0.5, -1.1 - explosionFactor * 0.8, 0.1]} 
        title={t('models_labels.crankshaft_title', { defaultValue: 'Crankshaft Assembly' })} 
        fullName={t('models_labels.crankshaft_fullName', { defaultValue: '4340 Forged Steel Crossplane Crankshaft' })}
        category={t('models_labels.crankshaft_category', { defaultValue: 'Rotating Assembly' })}
        description={t('models_labels.crankshaft_desc')}
        spec={t('models_labels.crankshaft_spec', { defaultValue: '4340 Forged Steel | Micro-Polished Journals | 8,200 RPM' })}
        color="#eab308"
        active={labelsActive}
      />
      <EngineLabel 
        id="oil_pan"
        position={[0, -1.9 - explosionFactor * 1.2, 0]} 
        title={t('models_labels.oil_pan_title', { defaultValue: 'Deep Sump Oil Pan' })} 
        fullName={t('models_labels.oil_pan_fullName', { defaultValue: 'Baffled Deep Sump Oil Pan & Scavenge Reservoir' })}
        category={t('models_labels.oil_pan_category', { defaultValue: 'Lubrication System' })}
        description={t('models_labels.oil_pan_desc', { defaultValue: 'Stores high-viscosity synthetic lubricant with internal anti-slosh trap doors to guarantee oil pickup under high lateral G-forces.' })}
        spec={t('models_labels.oil_pan_spec', { defaultValue: 'Capacity: 6.8 Liters | Anti-Surge Directional Baffling' })}
        color="#06b6d4"
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

export const V8_ANIMATED_URL = '/models/v8_anii.glb'

export function AnimatedV8Model({ isAnimated = true, speed = 1, ...props }) {
  const group = useRef()
  const { scene, animations } = useGLTF(V8_ANIMATED_URL)
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (clone) {
      clone.traverse((child) => {
        if (child.isMesh && child.material) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material.isMeshStandardMaterial) {
            child.material.envMapIntensity = 1.2
            child.material.roughness = Math.min(child.material.roughness ?? 0.35, 0.45)
            child.material.metalness = Math.max(child.material.metalness ?? 0.6, 0.6)
            child.material.needsUpdate = true
          }
        }
      })
    }
  }, [clone])

  useEffect(() => {
    const action = actions['Take 001']
    if (action) {
      action.setEffectiveTimeScale(speed)
      if (isAnimated) {
        action.paused = false
        if (!action.isRunning()) {
          action.reset().fadeIn(0.2).play()
        }
      } else {
        action.paused = true
      }
    }
    return () => {
      if (action) action.fadeOut(0.2)
    }
  }, [actions, isAnimated, speed])

  return (
    <group ref={group} {...props}>
      <Center>
        <primitive object={clone} scale={0.0035} />
      </Center>
    </group>
  )
}

useGLTF.preload(V8_ANIMATED_URL)

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
