import { Suspense, useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { useStore } from '../../store/useStore'
import { CrankshaftModel, PistonModel, SparkPlugModel, InternalsModel, EngineBlockModel, AnimatedV8Model } from '../3d/Models'
import { ArrowUpRight, Maximize2, Hand } from 'lucide-react'
import ErrorBoundary from '../utils/ErrorBoundary'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HandControls from '../utils/HandControls'
import HandGestureController from '../utils/HandGestureController'

export const COMPONENTS = [
  {
    id: 1, name: 'Forged Crankshaft', type: 'crankshaft', color: '#60a5fa', spec: 'Forged Steel',
    description: 'A forged crankshaft is a high-strength engine component manufactured by compressing heated steel under extremely high pressure into the required shape. It acts as the mechanical heart of the engine, converting the up-and-down reciprocating motion of the pistons into the rotational motion that drives the vehicle.',
    extendedDescription: 'Forged crankshafts are the standard in high-performance applications—ranging from racing cars to heavy-duty industrial machinery. Unlike cast alternatives, the forging process ensures superior structural integrity, better grain flow alignment, and exceptional fatigue resistance against extreme torsional stress.',
    features: [
      'Closed-die forging process',
      'Multi-stage heat treatment',
      'Ultrasonic crack inspection',
      'Roller burnished fillets for fatigue resistance',
      'High torsional strength and wear resistance'
    ],
    specs: [
      { label: 'Reference ID', value: 'FCS-240410-AAF-02' },
      { label: 'Net Weight', value: '10–330 kg' },
      { label: 'Core Material', value: 'SAE 4340 / 4140 Steel' },
      { label: 'Hardness', value: '55–62 HRC (Surface)' },
      { label: 'Thermal Range', value: '-40°C to 300°C' },
      { label: 'Certification', value: 'ASTM A983/A983M' }
    ]
  },
  {
    id: 2, name: 'Performance Piston', type: 'piston', color: '#f87171', spec: 'Forged Alloy',
    description: 'A performance piston is a high-strength engine piston specifically designed for high-speed, high-compression, turbocharged, or racing engines.',
    extendedDescription: 'Unlike standard cast pistons, performance pistons are usually forged from aluminum alloys to withstand extreme combustion pressure, high temperatures, and rapid engine acceleration. These pistons improve engine efficiency, durability, and power output while reducing the risk of cracking or deformation under heavy loads.',
    features: [
      'CNC-machined crown design',
      'Anti-friction skirt coating',
      'Hard anodized ring grooves',
      'Lightweight floating wrist pin design',
      'High compression ratio support',
      'Optimized oil drainage channels',
      'Reinforced piston crown for turbo/supercharged engines'
    ],
    specs: [
      { label: 'Reference ID', value: 'PP-2610-FRG-884' },
      { label: 'Net Weight', value: '150–1200 g' },
      { label: 'Core Material', value: 'Alloy 2618 / 4032' },
      { label: 'Hardness', value: '95–140 HB' },
      { label: 'Thermal Range', value: '-40°C to 350°C' },
      { label: 'Certification', value: 'ASTM B209, FIA' }
    ]
  },
  {
    id: 3, name: 'Iridium Spark Plug', type: 'spark_plug', color: '#34d399', spec: '0.4mm Tip',
    description: 'An iridium spark plug is a high-performance ignition component used in internal combustion engines to ignite the air-fuel mixture inside the combustion chamber.',
    extendedDescription: 'It uses an extremely hard and heat-resistant iridium metal tip on the center electrode, allowing better spark efficiency, longer lifespan, and improved combustion compared to copper or platinum spark plugs. Iridium spark plugs are commonly used in modern cars, motorcycles, racing vehicles, and high-performance engines because they provide stable ignition under high temperature and pressure conditions.',
    features: [
      'Fine-wire iridium center electrode',
      'Improved fuel combustion efficiency',
      'Faster engine starting',
      'Better throttle response',
      'Reduced electrode wear',
      'Longer service life (often 80,000–120,000 km)',
      'High resistance to carbon fouling and corrosion'
    ],
    specs: [
      { label: 'Reference ID', value: 'ISP-IX24B-IR-90919' },
      { label: 'Net Weight', value: '20–70 g' },
      { label: 'Core Material', value: 'Iridium Tip / Copper Core' },
      { label: 'Hardness', value: '~650–700 HV' },
      { label: 'Thermal Range', value: '-40°C to 1000°C' },
      { label: 'Certification', value: 'ISO 9001, SAE' }
    ]
  },
  {
    id: 4, name: 'V8 Engine Internals', type: 'internals', color: '#f59e0b', spec: 'Complete Set',
    description: 'A V8 engine is an internal combustion engine configuration that uses eight cylinders arranged in a V-shape around a common crankshaft.',
    extendedDescription: 'The internal components of a V8 engine work together to convert fuel combustion into rotational power. This complex assembly includes the crankshaft, pistons, connecting rods, camshaft, valves, and timing systems, meticulously balanced for high-performance operation.',
    features: [
      'High-torque power delivery',
      'Cross-plane or flat-plane configurations',
      'DOHC or OHV valve train systems',
      'Precision-balanced rotating assembly',
      'Multi-layer steel head gaskets',
      'Advanced lubrication and cooling passages',
      'Performance-oriented combustion chamber'
    ],
    specs: [
      { label: 'Reference ID', value: 'V8-INT-5500-DOHC-908' },
      { label: 'Net Weight', value: '80–300 kg' },
      { label: 'Core Material', value: 'Forged Steel / Titanium' },
      { label: 'Hardness', value: '28–62 HRC' },
      { label: 'Thermal Range', value: '-40°C to 350°C' },
      { label: 'Certification', value: 'SAE, ISO 9001, API' }
    ]
  },
  {
    id: 5, name: 'V8 Engine Block', type: 'engine', color: '#c084fc', spec: '6.2L V8',
    description: 'A V8 engine block is the main structural body of a V8 engine that houses the cylinders, crankshaft, and other critical internal components.',
    extendedDescription: 'As the foundation of the engine, the block supports the rotating assembly while maintaining structural alignment under extreme combustion pressures. It is precision-engineered with integrated coolant jackets and oil galleries for thermal management.',
    features: [
      'Integrated coolant jackets',
      'Precision-machined cylinder bores',
      'Reinforced main bearing caps',
      'Cross-bolted block designs',
      'Dry sump or wet sump compatibility',
      'High-strength deck surfaces',
      'Turbo and supercharger ready'
    ],
    specs: [
      { label: 'Reference ID', value: 'V8-BLK-LSX-6200-ALF' },
      { label: 'Net Weight', value: '35–150 kg' },
      { label: 'Core Material', value: 'Aluminum Alloy / Cast Iron' },
      { label: 'Hardness', value: '95–260 HB' },
      { label: 'Thermal Range', value: '-40°C to 250°C' },
      { label: 'Certification', value: 'SAE, ASTM A48, ISO 9001' }
    ]
  },
  {
    id: 6,
    name: 'V6 Rigged & Animated Engine',
    type: 'v6_sketchfab',
    color: '#38bdf8',
    spec: 'V6 Twin-Turbo CAD',
    description: 'A fully rigged and animated 6-cylinder internal combustion engine showcasing synchronized valvetrain, pistons, connecting rods, and twin-turbo induction.',
    extendedDescription: 'This comprehensive 3D CAD engineering reference displays complete mechanical synchronization of a high-performance V6 power plant. Crafted and rigged by AhmedSaleh on Sketchfab, it allows deep 360° inspection of internal reciprocating kinematics.',
    features: [
      'Fully rigged reciprocating assembly & pistons',
      'Synchronized double overhead camshafts (DOHC)',
      'Twin-turbocharger plumbing and exhaust runners',
      'Detailed cylinder head & valvetrain kinematics',
      'Real-time continuous animated motion cycle'
    ],
    specs: [
      { label: 'Reference ID', value: 'V6-RIG-AS-CD09' },
      { label: 'Engine Configuration', value: '60° V6 Bi-Turbo' },
      { label: 'Valvetrain Type', value: '24-Valve DOHC' },
      { label: 'Author Credit', value: 'AhmedSaleh (Sketchfab)' },
      { label: 'Rigging Status', value: 'Fully Rigged & Animated' },
      { label: 'Interactive 3D', value: 'WebGL / WebXR' }
    ],
    sketchfabId: 'cd09ed2b8a8e4f2792c68f952b0949de',
    author: 'AhmedSaleh',
    sketchfabUrl: 'https://sketchfab.com/3d-models/v6-car-engine-fully-rigged-and-animated-cd09ed2b8a8e4f2792c68f952b0949de',
    authorUrl: 'https://sketchfab.com/AhmedSaleh'
  },
  {
    id: 7,
    name: 'Kinematic Animated V8 Assembly',
    type: 'v8_animated',
    color: '#06b6d4',
    spec: 'Full Kinematic Cycle',
    description: 'A fully animated 8-cylinder mechanical powertrain assembly showcasing real-time synchronized reciprocating pistons, crankshaft rotation, and serpentine belt drive.',
    extendedDescription: 'This high-fidelity kinematic V8 assembly demonstrates the complete mechanical power transmission cycle in real time. Every piston stroke, connecting rod oscillation, crankshaft throw rotation, and harmonic damper pulley motion is mathematically synchronized into a continuous operating loop.',
    features: [
      'Real-time continuous piston reciprocating kinematics',
      'Synchronized 90° crossplane crankshaft rotation',
      'Front harmonic pulley & serpentine belt animation',
      'Interactive 360° orbital zoom & rotational inspection',
      'Optimized high-performance 128-part GLTF mesh assembly'
    ],
    specs: [
      { label: 'Reference ID', value: 'V8-KIN-ANI-331CH' },
      { label: 'Engine Architecture', value: '90° V8 Kinematic' },
      { label: 'Animated Channels', value: '331 Rigged Samplers' },
      { label: 'Reciprocating Units', value: '8 Balanced Pistons' },
      { label: 'Auxiliary System', value: 'Serpentine Drive Belt' },
      { label: 'Interactive Engine', value: 'WebGL / Three.js Native' }
    ]
  }
]

export const getLocalizedComponents = (t) => {
  if (!t) return COMPONENTS;
  return [
    {
      ...COMPONENTS[0],
      name: t('components.crankshaft.name', { defaultValue: COMPONENTS[0].name }),
      typeName: t('components.crankshaft.type', { defaultValue: COMPONENTS[0].type }),
      spec: t('components.crankshaft.spec', { defaultValue: COMPONENTS[0].spec }),
      description: t('components.crankshaft.desc', { defaultValue: COMPONENTS[0].description }),
      extendedDescription: t('components.crankshaft.extendedDesc', { defaultValue: COMPONENTS[0].extendedDescription }),
    },
    {
      ...COMPONENTS[1],
      name: t('components.piston.name', { defaultValue: COMPONENTS[1].name }),
      typeName: t('components.piston.type', { defaultValue: COMPONENTS[1].type }),
      spec: t('components.piston.spec', { defaultValue: COMPONENTS[1].spec }),
      description: t('components.piston.desc', { defaultValue: COMPONENTS[1].description }),
      extendedDescription: t('components.piston.extendedDesc', { defaultValue: COMPONENTS[1].extendedDescription }),
    },
    {
      ...COMPONENTS[2],
      name: t('components.spark_plug.name', { defaultValue: COMPONENTS[2].name }),
      typeName: t('components.spark_plug.type', { defaultValue: COMPONENTS[2].type }),
      spec: t('components.spark_plug.spec', { defaultValue: COMPONENTS[2].spec }),
      description: t('components.spark_plug.desc', { defaultValue: COMPONENTS[2].description }),
      extendedDescription: t('components.spark_plug.extendedDesc', { defaultValue: COMPONENTS[2].extendedDescription }),
    },
    {
      ...COMPONENTS[3],
      name: t('components.internals.name', { defaultValue: COMPONENTS[3].name }),
      typeName: t('components.internals.type', { defaultValue: COMPONENTS[3].type }),
      spec: t('components.internals.spec', { defaultValue: COMPONENTS[3].spec }),
      description: t('components.internals.desc', { defaultValue: COMPONENTS[3].description }),
      extendedDescription: t('components.internals.extendedDesc', { defaultValue: COMPONENTS[3].extendedDescription }),
    },
    {
      ...COMPONENTS[4],
      name: t('components.engine_block.name', { defaultValue: COMPONENTS[4].name }),
      typeName: t('components.engine_block.type', { defaultValue: COMPONENTS[4].type }),
      spec: t('components.engine_block.spec', { defaultValue: COMPONENTS[4].spec }),
      description: t('components.engine_block.desc', { defaultValue: COMPONENTS[4].description }),
      extendedDescription: t('components.engine_block.extendedDesc', { defaultValue: COMPONENTS[4].extendedDescription }),
    },
    {
      ...COMPONENTS[5],
      name: t('components.v6_engine.name', { defaultValue: COMPONENTS[5].name }),
      typeName: t('components.v6_engine.type', { defaultValue: 'V6 CAD RIG' }),
      spec: t('components.v6_engine.spec', { defaultValue: COMPONENTS[5].spec }),
      description: t('components.v6_engine.desc', { defaultValue: COMPONENTS[5].description }),
      extendedDescription: t('components.v6_engine.extendedDesc', { defaultValue: COMPONENTS[5].extendedDescription }),
    },
    {
      ...COMPONENTS[6],
      name: t('components.v8_animated.name', { defaultValue: COMPONENTS[6].name }),
      typeName: t('components.v8_animated.type', { defaultValue: 'V8 KINEMATICS' }),
      spec: t('components.v8_animated.spec', { defaultValue: COMPONENTS[6].spec }),
      description: t('components.v8_animated.desc', { defaultValue: COMPONENTS[6].description }),
      extendedDescription: t('components.v8_animated.extendedDesc', { defaultValue: COMPONENTS[6].extendedDescription }),
    },
  ];
};

function ModelCard({ comp, onClick, index, t }) {
  const [isHovered, setIsHovered] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef(null)
  const controlsRef = useRef(null)
  const isInView = useInView(ref, { margin: "600px 0px" })
  const isHandTracking = useStore(state => state.isHandTracking)
  const setHandTracking = useStore(state => state.setHandTracking)

  useEffect(() => {
    if (isInView && !hasLoaded) {
      setHasLoaded(true)
    }
  }, [isInView, hasLoaded])
  
  const Model = comp.type === 'crankshaft' ? CrankshaftModel : 
                comp.type === 'piston' ? PistonModel : 
                comp.type === 'spark_plug' ? SparkPlugModel : 
                comp.type === 'engine' ? EngineBlockModel :
                comp.type === 'v8_animated' ? AnimatedV8Model :
                InternalsModel

  const toggleFullscreen = (e) => {
    e.stopPropagation()
    const viewer = document.getElementById(`viewer-${comp.id}`);
    if (!document.fullscreenElement) {
      viewer.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
      whileHover={{ 
        scale: 1.03, 
        y: -10, 
        rotateX: 2, 
        rotateY: -2,
        boxShadow: '0 30px 60px -15px rgba(59,130,246,0.25)',
        borderColor: 'rgba(59,130,246,0.6)'
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      className="gallery-card"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transformStyle: 'preserve-3d',
      }}
    >
      <div id={`viewer-${comp.id}`} className="gallery-card-viewer">
        {isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}` && <HandGestureController />}
        {hasLoaded && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: isInView ? 1 : 0 }} 
            transition={{ duration: 0.8 }}
            style={{ width: '100%', height: '100%', pointerEvents: isInView ? 'auto' : 'none' }}
          >
            <ErrorBoundary>
              {comp.type === 'v6_sketchfab' ? (
                <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <iframe
                    title="V6 Car Engine - Fully Rigged and Animated"
                    src="https://sketchfab.com/models/cd09ed2b8a8e4f2792c68f952b0949de/embed?autostart=1&ui_infos=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&preload=1&transparent=1&dnt=1"
                    frameBorder="0"
                    allowFullScreen
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    xr-spatial-tracking="true"
                    execution-while-out-of-viewport="true"
                    execution-while-not-rendered="true"
                    web-share="true"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      background: '#09090b',
                      pointerEvents: isHovered ? 'auto' : 'none'
                    }}
                  />
                  {!isHovered && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.2) 60%, transparent 100%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      pointerEvents: 'none'
                    }}>
                      <span style={{
                        fontSize: '10px',
                        color: '#38bdf8',
                        fontWeight: 700,
                        background: 'rgba(56,189,248,0.15)',
                        padding: '4px 10px',
                        borderRadius: '100px',
                        border: '1px solid rgba(56,189,248,0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        ⚡ Hover to Interact • 3D CAD Rig
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Canvas
                    dpr={1}
                    frameloop={comp.type === 'v8_animated' ? "always" : "demand"}
                    gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <color attach="background" args={['#000000']} />
                    <Suspense fallback={null}>
                      <Stage intensity={0.5} environment="city" adjustCamera={1.2} shadows={false}>
                        <Model color={comp.color} isAnimated={true} speed={1} />
                      </Stage>
                    </Suspense>
                    <OrbitControls ref={controlsRef} enableZoom={true} enablePan={false} />
                    <HandControls controlsRef={controlsRef} targetId={`comp-${comp.id}`} />
                  </Canvas>
                  {comp.type === 'v8_animated' && (
                    <div style={{
                      position: 'absolute', bottom: '12px', left: '12px', zIndex: 4,
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(6, 182, 212, 0.18)',
                      border: '1px solid rgba(6, 182, 212, 0.4)',
                      padding: '4px 10px', borderRadius: '100px', pointerEvents: 'none'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4', boxShadow: '0 0 8px #06b6d4' }} />
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#67e8f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        ⚡ Real-Time Kinematics
                      </span>
                    </div>
                  )}
                </>
              )}
            </ErrorBoundary>
          </motion.div>
        )}

        {/* Type chip */}
        <div style={{
          position: 'absolute', top: '1rem', left: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.25rem 0.6rem', borderRadius: '1rem',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: comp.color }} />
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{comp.typeName || comp.type}</span>
        </div>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            width: '32px', height: '32px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.8)',
            transition: 'all 0.2s'
          }}
          title={t ? t('viewer.tooltip_fullscreen') : 'Fullscreen'}
        >
          <Maximize2 size={14} />
        </button>

        {/* Hand Toggle */}
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            const isCurrentTarget = isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}`;
            setHandTracking(!isCurrentTarget, `comp-${comp.id}`); 
          }}
          style={{
            position: 'absolute', top: '1rem', right: '3.5rem',
            width: '32px', height: '32px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: (isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}`) ? 'rgba(16, 185, 129, 0.9)' : 'rgba(255, 255, 255, 0.05)',
            border: (isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}`) ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer', color: (isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}`) ? '#fff' : 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          title={(isHandTracking && useStore.getState().handControlTarget === `comp-${comp.id}`) ? (t ? t('viewer.tooltip_hand_disable') : "Disable Hand Control") : (t ? t('viewer.tooltip_hand_enable') : "Enable Hand Control")}
        >
          <Hand size={14} />
        </button>
      </div>

      {/* Info */}
      <div style={{
        padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'transparent',
        display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '1.15rem', fontWeight: 800, color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              marginBottom: '0.4rem'
            }}>
              {comp.name}
            </h3>
          </div>
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '0.5rem', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease', color: '#fff'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#3b82f6' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
          >
            <ArrowUpRight size={14} color="currentColor" />
          </div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)'
        }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t ? t('gallery.grade_a1') : 'Grade A1'}</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: comp.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{comp.spec}</span>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * ComponentGallery Component
 * Renders a searchable and filterable grid of engineering components.
 * Each component is displayed in a ModelCard with 3D preview and gesture controls.
 */
export default function ComponentGallery() {
  const { t } = useTranslation()
  const setActiveModel = useStore(state => state.setActiveModel)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = [
    { id: 'All', label: t('gallery.cat_all') },
    { id: 'Engine', label: t('gallery.cat_engine') },
    { id: 'Ignition', label: t('gallery.cat_ignition') },
    { id: 'Drivetrain', label: t('gallery.cat_drivetrain') }
  ]

  const localizedComponents = getLocalizedComponents(t)

  const filteredComponents = localizedComponents.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comp.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || 
                            (activeCategory === 'Engine' && (comp.type === 'engine' || comp.type === 'piston' || comp.type === 'v6_sketchfab')) ||
                            (activeCategory === 'Ignition' && comp.type === 'spark_plug') ||
                            (activeCategory === 'Drivetrain' && (comp.type === 'crankshaft' || comp.type === 'internals'))
    return matchesSearch && matchesCategory
  })

  const handleCardClick = (comp) => {
    setActiveModel(comp)
    navigate(`/part/${comp.id}`)
  }

  return (
    <section id="inventory" style={{ padding: 'clamp(3rem, 5vw, 6rem) clamp(1rem, 4vw, 5vw)', background: '#050505', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header Area */}
        <div style={{ marginBottom: 'clamp(2rem, 3.5vw, 4rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div className="section-label">
                <span>{t('gallery.badge')}</span>
              </div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900,
                  color: '#ffffff',
                  fontFamily: "'Outfit', sans-serif", lineHeight: 1.1,
                  letterSpacing: '-0.02em'
                }}
              >
                {t('gallery.title_part1')} <span style={{ color: '#3b82f6' }}>{t('gallery.title_part2')}</span>
              </motion.h2>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder={t('gallery.search_placeholder')} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '0.75rem 1.25rem', borderRadius: '2rem',
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                    width: '100%', maxWidth: '300px', fontSize: '0.85rem', outline: 'none',
                    color: '#fff',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '2rem',
                  background: activeCategory === cat.id ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat.id ? '#fff' : 'rgba(255,255,255,0.6)',
                  border: '1px solid',
                  borderColor: activeCategory === cat.id ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  fontSize: '0.8rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: activeCategory === cat.id ? '0 10px 20px -5px rgba(59,130,246,0.4)' : 'none',
                  flexShrink: 0
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Area */}
        <div style={{ position: 'relative', minHeight: '300px' }}>
          {filteredComponents.length > 0 ? (
            <motion.div 
              layout
              style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                gap: 'clamp(1rem, 2.5vw, 2.5rem)' 
              }}
            >
              {filteredComponents.map((comp, i) => (
                <div key={comp.id} style={{ width: 'min(100%, 360px)' }}>
                  <ModelCard comp={comp} index={i} onClick={() => handleCardClick(comp)} t={t} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '5rem 0', color: '#9ca3af' }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('gallery.no_components')}</h3>
              <p>{t('gallery.no_components_sub')}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
