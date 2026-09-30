import { useState, Suspense, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stage, View, PerspectiveCamera } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import * as THREE from 'three'
import { MainEngine, AnimatedV8Model } from '../3d/Models'
import { Maximize2, Zap, Layers, RefreshCcw, Network, X, Hand, Eye, Flame, Activity, Sparkles, Gauge, ExternalLink, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import ErrorBoundary from '../utils/ErrorBoundary'
import { useStore } from '../../store/useStore'
import HandGestureController from '../utils/HandGestureController'
import HandControls from '../utils/HandControls'
import { engineAudio } from '../../utils/engineAudioSynthesizer'

function AnimatedV8Scene({ isAnimated, speed = 1 }) {
  const controlsRef = useRef(null);
  const isHandTracking = useStore(state => state.isHandTracking);

  return (
    <ErrorBoundary>
      <Canvas
        shadows={false}
        dpr={[1, 1.2]}
        gl={{ 
          antialias: true, 
          alpha: false, 
          preserveDrawingBuffer: false, 
          powerPreference: "high-performance"
        }}
        camera={{ position: [0, 0, 7], fov: 45 }}
        style={{ width: '100%', height: '100%', background: '#09090b' }}
      >
        <color attach="background" args={['#09090b']} />
        <ambientLight intensity={1.8} />
        <directionalLight position={[10, 15, 10]} intensity={2.5} />
        <directionalLight position={[-10, 10, -10]} intensity={1.5} color="#93c5fd" />
        <directionalLight position={[0, -10, 5]} intensity={0.8} color="#06b6d4" />
        <Suspense fallback={null}>
          <Stage intensity={0.65} environment="city" adjustCamera={1.25} shadows={false}>
            <AnimatedV8Model isAnimated={isAnimated} speed={speed} />
          </Stage>
        </Suspense>
        <OrbitControls 
          ref={controlsRef}
          enableZoom={true} 
          enablePan={false} 
          makeDefault 
          autoRotate={isAnimated && !(isHandTracking && useStore.getState().handControlTarget === 'main')}
          autoRotateSpeed={1.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
        />
        <HandControls controlsRef={controlsRef} targetId="main" />
      </Canvas>
    </ErrorBoundary>
  )
}

function EngineScene({ isAnimated, explosionFactor, showLabels }) {
  const controlsRef = useRef(null);
  const isHandTracking = useStore(state => state.isHandTracking);

  return (
    <ErrorBoundary>
      <Canvas
        shadows={false}
        dpr={[1, 1.2]}
        gl={{ 
          antialias: false, 
          alpha: false, 
          preserveDrawingBuffer: false, 
          powerPreference: "high-performance",
          stencil: false
        }}
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ width: '100%', height: '100%', background: '#09090b' }}
      >
        <color attach="background" args={['#09090b']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 15, 10]} intensity={2.5} />
        <directionalLight position={[-10, 10, -10]} intensity={1.5} color="#93c5fd" />
        <directionalLight position={[0, -10, 5]} intensity={0.8} color="#f97316" />
        <Suspense fallback={null}>
          <Stage intensity={0.8} environment={null} adjustCamera={true} shadows={false}>
            <MainEngine animated={isAnimated} explosionFactor={explosionFactor} showLabels={showLabels} />
          </Stage>
        </Suspense>
        <OrbitControls 
          ref={controlsRef}
          enableZoom={true} 
          enablePan={false} 
          makeDefault 
          autoRotate={isAnimated && explosionFactor === 0 && !(isHandTracking && useStore.getState().handControlTarget === 'main')}
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        <HandControls controlsRef={controlsRef} targetId="main" />
      </Canvas>
    </ErrorBoundary>
  )
}

const MIND_MAP_CONNECTIONS = [
  { from: 'ecu', to: 'core', color: '#06b6d4' },
  { from: 'ecu', to: 'valvetrain', color: '#06b6d4' },
  { from: 'ecu', to: 'intake', color: '#06b6d4' },
  { from: 'intake', to: 'core', color: '#3b82f6' },
  { from: 'valvetrain', to: 'core', color: '#f43f5e' },
  { from: 'core', to: 'exhaust', color: '#ef4444' },
  { from: 'core', to: 'rotating', color: '#ef4444' },
  { from: 'rotating', to: 'lubrication', color: '#eab308' },
  { from: 'core', to: 'thermal', color: '#ef4444' },
  { from: 'lubrication', to: 'thermal', color: '#f59e0b' }
];

function EngineMindMap({ onClose }) {
  const { t } = useTranslation();
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    { id: 'ecu', title: t('mindmap_nodes.ecu_title'), desc: t('mindmap_nodes.ecu_desc'), x: '50%', y: '16%', color: '#06b6d4' },
    { id: 'valvetrain', title: t('mindmap_nodes.valvetrain_title'), desc: t('mindmap_nodes.valvetrain_desc'), x: '80%', y: '28%', color: '#f43f5e' },
    { id: 'intake', title: t('mindmap_nodes.intake_title'), desc: t('mindmap_nodes.intake_desc'), x: '80%', y: '55%', color: '#3b82f6' },
    { id: 'exhaust', title: t('mindmap_nodes.exhaust_title'), desc: t('mindmap_nodes.exhaust_desc'), x: '80%', y: '82%', color: '#8b5cf6' },
    { id: 'core', title: t('mindmap_nodes.core_title'), desc: t('mindmap_nodes.core_desc'), x: '50%', y: '48%', color: '#ef4444' },
    { id: 'lubrication', title: t('mindmap_nodes.lubrication_title'), desc: t('mindmap_nodes.lubrication_desc'), x: '50%', y: '80%', color: '#f59e0b' },
    { id: 'rotating', title: t('mindmap_nodes.rotating_title'), desc: t('mindmap_nodes.rotating_desc'), x: '20%', y: '48%', color: '#eab308' },
    { id: 'thermal', title: t('mindmap_nodes.thermal_title'), desc: t('mindmap_nodes.thermal_desc'), x: '20%', y: '75%', color: '#10b981' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999,
        background: 'rgba(10, 10, 14, 0.98)', 
        overflow: 'hidden'
      }}
    >
      
      {/* Static Subtle Glow */}
      <div style={{ position: 'absolute', top: '10%', left: '20%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Grid Background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px', opacity: 0.6
      }} />

      <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', zIndex: 30, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
        <X size={22} />
      </button>

      {/* Title */}
      <div style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 25, borderLeft: '3px solid #3b82f6', paddingLeft: '15px' }}>
        <h3 style={{ color: '#fff', margin: 0, fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>{t('viewer.mind_map_title')}</h3>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.8rem', fontWeight: 500, marginTop: '4px' }}>{t('viewer.mind_map_subtitle')}</p>
      </div>

      {/* Specifications Panel */}
      <div style={{ position: 'absolute', bottom: '30px', left: '30px', zIndex: 25, fontFamily: "'Inter', sans-serif", color: '#94a3b8', fontSize: '0.8rem', background: 'rgba(20,20,25,0.8)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: '280px' }}>
        <div style={{ color: '#fff', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>{t('viewer.global_specs')}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>{t('viewer.spec_core_temp')}</span> <span style={{ color: '#f8fafc' }}>94.2°C</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>{t('viewer.spec_oil_pressure')}</span> <span style={{ color: '#f8fafc' }}>4.2 BAR</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>{t('viewer.spec_manifold_abs')}</span> <span style={{ color: '#f8fafc' }}>102 kPa</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{t('viewer.spec_telemetry_freq')}</span> <span style={{ color: '#f8fafc' }}>1000 Hz</span></div>
      </div>

      {/* SVG Connections */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
        {MIND_MAP_CONNECTIONS.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          const isHighlighted = activeNode ? (activeNode === conn.from || activeNode === conn.to) : false;
          
          return (
            <motion.line
              key={`conn-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isHighlighted ? '#fff' : 'rgba(255,255,255,0.2)'}
              strokeWidth={isHighlighted ? "2" : "1"}
              strokeDasharray={isHighlighted ? "none" : "4 4"}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeNode ? (isHighlighted ? 1 : 0.1) : 0.6 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          variants={nodeVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.1 + (i * 0.05), ease: 'easeOut' }}
          onMouseEnter={() => setActiveNode(node.id)}
          onMouseLeave={() => setActiveNode(null)}
          style={{
            position: 'absolute', top: node.y, left: node.x,
            transform: 'translate(-50%, -50%)',
            zIndex: activeNode === node.id ? 50 : 20,
            opacity: activeNode && activeNode !== node.id ? 0.3 : 1,
            transition: 'opacity 0.3s ease'
          }}
        >
          <div
            style={{
              background: activeNode === node.id ? 'rgba(30,30,35,0.95)' : 'rgba(20,20,25,0.9)',
              border: `1px solid ${activeNode === node.id ? node.color : 'rgba(255,255,255,0.1)'}`,
              padding: '1.25rem', borderRadius: '6px', width: '250px',
              boxShadow: activeNode === node.id ? `0 8px 30px rgba(0,0,0,0.5)` : '0 4px 20px rgba(0,0,0,0.4)',
              transition: 'all 0.2s ease', cursor: 'pointer'
            }}
          >
            {/* Node Decorator */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: node.color, borderTopLeftRadius: '6px', borderTopRightRadius: '6px', opacity: activeNode === node.id ? 1 : 0.5, transition: 'opacity 0.2s' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', marginTop: '0.25rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: node.color }} />
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, margin: 0, fontFamily: "'Inter', sans-serif" }}>{node.title}</h4>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>
              {node.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

const ENGINE_SUBSYSTEMS = [
  { id: 'supercharger', name: 'Supercharger', fullName: 'Twin-Screw Roots Supercharger & Induction Plenum', category: 'Forced Induction', desc: 'Forces compressed air into the combustion chambers at up to 1.4 bar boost, dramatically raising volumetric efficiency and instantaneous torque.', spec: 'Peak Boost: 1.4 Bar (20.3 PSI) | Dual Screw Rotors', color: '#38bdf8' },
  { id: 'left_head', name: 'Left Head', fullName: 'Bank 1 (Left) DOHC 24V Cylinder Head & Valvetrain', category: 'Valvetrain & Combustion', desc: 'CNC-machined aluminum cylinder head housing dual overhead camshafts, four valves per cylinder, and precision sodium-cooled exhaust valves.', spec: 'DOHC 4-Valves/Cyl | Variable Cam Phasing (VVT)', color: '#f43f5e' },
  { id: 'right_head', name: 'Right Head', fullName: 'Bank 2 (Right) DOHC 24V Cylinder Head & Valvetrain', category: 'Valvetrain & Combustion', desc: 'Houses combustion chambers and spark plugs with optimized pent-roof quench zones for rapid, complete flame propagation.', spec: 'Compression Ratio: 10.5:1 | Cross-Flow Pent-Roof', color: '#f43f5e' },
  { id: 'fuel_rail', name: 'Fuel Rail', fullName: 'High-Pressure Direct Fuel Injection Rail & Injectors', category: 'Fuel Delivery', desc: 'Delivers atomized fuel at up to 250 bar directly into combustion chambers with multi-stage micro-burst injection cycles.', spec: 'Rail Pressure: 250 Bar | Multi-Hole Laser Nozzles', color: '#f97316' },
  { id: 'block_core', name: 'Block Core', fullName: 'Crossplane Deep-Skirt Engine Block Core & Liners', category: 'Structural Core', desc: 'Deep-skirt cast aluminum engine block with cast-iron cylinder liners, cross-bolted main bearing caps, and high-flow coolant jackets.', spec: 'Cast A319 Aluminum | Cross-Bolted 6-Bolt Mains', color: '#10b981' },
  { id: 'timing_belt', name: 'Timing Belt', fullName: 'Front Serpentine Timing Belt & Pulley System', category: 'Timing & Auxiliary Drive', desc: 'Synchronizes crankshaft rotation with dual camshafts via tensioned multi-rib belt while driving the water pump, alternator, and oil pump.', spec: 'Kevlar-Reinforced Belt | Torsional Vibration Damper', color: '#a855f7' },
  { id: 'crankshaft', name: 'Crankshaft', fullName: '4340 Forged Steel Crossplane Crankshaft', category: 'Rotating Assembly', desc: 'Precision-counterweighted 90° crossplane crankshaft designed to withstand extreme cylinder pressures with minimal torsional harmonic vibration.', spec: '4340 Forged Steel | Micro-Polished Journals | 8,200 RPM', color: '#eab308' },
  { id: 'oil_pan', name: 'Oil Pan', fullName: 'Baffled Deep Sump Oil Pan & Scavenge Reservoir', category: 'Lubrication System', desc: 'Stores high-viscosity synthetic lubricant with internal anti-slosh trap doors to guarantee oil pickup under high lateral G-forces.', spec: 'Capacity: 6.8 Liters | Anti-Surge Directional Baffling', color: '#06b6d4' }
];

/**
 * ModelViewer Component
 * The featured 3D showcase section. Supports native 3D rendering and external engineering references.
 * Features system architecture mind-mapping and hand gesture interaction.
 */
export default function ModelViewer() {
  const { t } = useTranslation();
  const viewerSource = useStore(state => state.viewerSource);
  const setViewerSource = useStore(state => state.setViewerSource);
  const source = viewerSource || 'native'; // 'native' or 'reference'
  const setSource = setViewerSource;
  const [showMindMap, setShowMindMap] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);
  const [isTelemetryCollapsed, setIsTelemetryCollapsed] = useState(false);

  // Global store states
  const visionMode = useStore(state => state.visionMode);
  const setVisionMode = useStore(state => state.setVisionMode);
  const crankAngle = useStore(state => state.crankAngle);
  const setCrankAngle = useStore(state => state.setCrankAngle);
  const isEngineIgnited = useStore(state => state.isEngineIgnited);
  const setIsEngineIgnited = useStore(state => state.setIsEngineIgnited);
  const mainExplosionFactor = useStore(state => state.mainExplosionFactor);
  const setMainExplosionFactor = useStore(state => state.setMainExplosionFactor);
  const hoveredEnginePart = useStore(state => state.hoveredEnginePart);
  const setHoveredEnginePart = useStore(state => state.setHoveredEnginePart);
  const selectedEnginePart = useStore(state => state.selectedEnginePart);
  const setSelectedEnginePart = useStore(state => state.setSelectedEnginePart);
  const activeInspectionPart = hoveredEnginePart || selectedEnginePart;
  const isPartPinned = !!selectedEnginePart && activeInspectionPart?.id === selectedEnginePart?.id;

  const [explosionFactor, setExplosionFactor] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [animatedSpeed, setAnimatedSpeed] = useState(1);
  const [isAnimatedPlaying, setIsAnimatedPlaying] = useState(true);

  // Sync external voice command explosion changes
  useEffect(() => {
    setIsExploded(mainExplosionFactor > 0.5);
  }, [mainExplosionFactor]);
  
  const isHandTracking = useStore(state => state.isHandTracking);
  const setHandTracking = useStore(state => state.setHandTracking);

  // Guarantee engineAudio halts on component unmount
  useEffect(() => {
    return () => {
      engineAudio.stop();
    };
  }, []);

  const REF_URL =
    'https://sketchfab.com/models/cd09ed2b8a8e4f2792c68f952b0949de/embed?autostart=1&ui_infos=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&preload=1&transparent=1&dnt=1'

  // Animate explosion factor smoothly
  useEffect(() => {
    let animationFrameId;
    const target = isExploded ? 1 : 0;
    
    const animate = () => {
      setExplosionFactor((prev) => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.005) {
          return target;
        }
        animationFrameId = requestAnimationFrame(animate);
        return prev + diff * 0.12; // Lerp step
      });
    };
    
    animate();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isExploded]);

  const toggleFullscreen = () => {
    const viewer = document.getElementById('engine-viewer');
    if (!document.fullscreenElement) {
      viewer.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
        @media (max-width: 768px) {
          .engine-hud-panel {
            position: absolute !important;
            top: auto !important;
            bottom: 75px !important;
            left: 10px !important;
            right: 10px !important;
            width: auto !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
            padding: 0.75rem !important;
          }
          .engine-hud-panel > div {
            flex: 1 1 calc(50% - 0.5rem) !important;
          }
        }
      `}</style>

      <AnimatePresence>
        {showMindMap && <EngineMindMap onClose={() => setShowMindMap(false)} />}
      </AnimatePresence>

      <section
        id="showcase"
        style={{ padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 3vw, 1.5rem)', background: '#050505', position: 'relative' }}
      >
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>

        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <div className="section-label">
            <span>{t('viewer.badge')}</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#ffffff',
            fontFamily: "'Inter', sans-serif", marginBottom: '0.4rem'
          }}>
            {t('viewer.title')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.85rem, 1.5vw, 1rem)' }}>
            {t('viewer.subtitle')}
          </p>
        </div>

        {/* Engine Model Switcher Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem', width: '100%', overflowX: 'auto', padding: '0 0.25rem' }} className="no-scrollbar">
          <div style={{
            display: 'inline-flex',
            padding: '4px',
            background: 'rgba(15, 18, 28, 0.75)',
            backdropFilter: 'blur(12px)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            gap: '6px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            flexShrink: 0
          }}>
            <button
              onClick={() => setSource('native')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: source === 'native' ? 'rgba(59, 130, 246, 0.5)' : 'transparent',
                background: source === 'native' ? 'linear-gradient(135deg, rgba(37,99,235,0.3) 0%, rgba(59,130,246,0.2) 100%)' : 'transparent',
                color: source === 'native' ? '#93c5fd' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: source === 'native' ? '0 0 15px rgba(59,130,246,0.25)' : 'none',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <Zap size={15} color={source === 'native' ? '#60a5fa' : '#64748b'} />
              <span>Spectra V8 (Interactive Physics)</span>
            </button>
            <button
              onClick={() => setSource('animated')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: source === 'animated' ? 'rgba(6, 182, 212, 0.5)' : 'transparent',
                background: source === 'animated' ? 'linear-gradient(135deg, rgba(8,145,178,0.3) 0%, rgba(6,182,212,0.2) 100%)' : 'transparent',
                color: source === 'animated' ? '#67e8f9' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: source === 'animated' ? '0 0 15px rgba(6,182,212,0.25)' : 'none',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <Activity size={15} color={source === 'animated' ? '#06b6d4' : '#64748b'} />
              <span>Kinematic V8 (Live Animated)</span>
            </button>
            <button
              onClick={() => setSource('reference')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: source === 'reference' ? 'rgba(56, 189, 248, 0.5)' : 'transparent',
                background: source === 'reference' ? 'linear-gradient(135deg, rgba(2,132,199,0.3) 0%, rgba(56,189,248,0.2) 100%)' : 'transparent',
                color: source === 'reference' ? '#7dd3fc' : '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: source === 'reference' ? '0 0 15px rgba(56,189,248,0.25)' : 'none',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
            >
              <Sparkles size={15} color={source === 'reference' ? '#38bdf8' : '#64748b'} />
              <span>Rigged V6 Model (AhmedSaleh CAD)</span>
            </button>
          </div>
        </div>

        {/* Main Viewer Box */}
        <motion.div
          id="engine-viewer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="h-[360px] sm:h-[480px] lg:h-[650px] w-full"
          style={{
            position: 'relative',
            background: '#09090b',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 30px rgba(59,130,246,0.1)'
          }}
        >
          {/* 360 Indicator */}
          <div style={{
            position: 'absolute', top: '20px', left: '20px',
            zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(10, 10, 15, 0.75)', padding: '8px 12px',
            borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            pointerEvents: 'none'
          }}>
            <RefreshCcw size={16} color="#3b82f6" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{t('viewer.view_360')}</span>
          </div>

          {/* Engine Dashboard Control Panel */}
          {source === 'native' && isHudCollapsed && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsHudCollapsed(false)}
              title="Expand HUD Diagnostics"
              aria-label="Expand HUD Diagnostics"
              style={{
                position: 'absolute',
                top: '80px',
                left: '20px',
                zIndex: 10,
                background: 'rgba(10, 10, 15, 0.88)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                padding: '8px 14px',
                borderRadius: '20px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 15px rgba(59,130,246,0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(20, 25, 40, 0.95)'
                e.currentTarget.style.borderColor = '#3b82f6'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(10, 10, 15, 0.88)'
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: isEngineIgnited && explosionFactor < 0.1 ? '#10b981' : '#3b82f6',
                boxShadow: isEngineIgnited && explosionFactor < 0.1 ? '0 0 8px #10b981' : '0 0 6px #3b82f6'
              }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#93c5fd' }}>
                {t('viewer.hud_diagnostics')}
              </span>
              <ChevronRight size={14} color="#60a5fa" />
            </motion.button>
          )}

          {source === 'native' && !isHudCollapsed && (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="engine-hud-panel"
                style={{
                  position: 'absolute', top: '80px', left: '20px', zIndex: 10,
                  background: 'rgba(10, 10, 15, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.25rem', borderRadius: '12px',
                  width: '260px',
                  fontFamily: "'Inter', sans-serif",
                  color: '#fff',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={14} color="#3b82f6" />
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94a3b8' }}>{t('viewer.hud_diagnostics')}</span>
                  </div>
                  <button
                    onClick={() => setIsHudCollapsed(true)}
                    title="Collapse HUD Panel"
                    aria-label="Collapse HUD Panel"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#94a3b8',
                      fontSize: '10px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(59,130,246,0.2)'
                      e.currentTarget.style.borderColor = '#3b82f6'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                      e.currentTarget.style.color = '#94a3b8'
                    }}
                  >
                    <span>Hide</span>
                    <ChevronLeft size={13} />
                  </button>
                </div>
              
              {/* Ignition Switch with Procedural Sound */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t('viewer.power_source')}</label>
                <button
                  onClick={() => {
                    if (isEngineIgnited) {
                      setIsEngineIgnited(false);
                      engineAudio.stop();
                    } else {
                      setIsExploded(false); // Collapse before starting
                      setMainExplosionFactor(0);
                      setIsEngineIgnited(true);
                      engineAudio.start();
                    }
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isEngineIgnited && explosionFactor < 0.1 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                    background: isEngineIgnited && explosionFactor < 0.1 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: isEngineIgnited && explosionFactor < 0.1 ? '#10b981' : '#ef4444',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    boxShadow: isEngineIgnited && explosionFactor < 0.1 ? '0 0 15px rgba(16,185,129,0.15)' : 'none'
                  }}
                >
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: isEngineIgnited && explosionFactor < 0.1 ? '#10b981' : '#ef4444',
                    boxShadow: isEngineIgnited && explosionFactor < 0.1 ? '0 0 8px #10b981' : 'none',
                    animation: isEngineIgnited && explosionFactor < 0.1 ? 'pulse 1.5s infinite' : 'none'
                  }} />
                  {isEngineIgnited && explosionFactor < 0.1 ? t('viewer.engine_running') : t('viewer.engine_stopped')}
                </button>
              </div>

              {/* Exploded View Toggle & Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t('viewer.exploded_config')}</label>
                  <button
                    onClick={() => {
                      if (isExploded) {
                        setIsExploded(false);
                        setMainExplosionFactor(0);
                      } else {
                        setIsEngineIgnited(false);
                        engineAudio.stop();
                        setIsExploded(true);
                        setMainExplosionFactor(1);
                      }
                    }}
                    style={{
                      background: isExploded ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isExploded ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
                      color: isExploded ? '#60a5fa' : '#94a3b8',
                      padding: '2px 8px', borderRadius: '4px',
                      fontSize: '9px', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {isExploded ? t('viewer.collapse') : t('viewer.explode')}
                  </button>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={explosionFactor}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setExplosionFactor(val);
                      setMainExplosionFactor(val);
                      if (val > 0.001) {
                        setIsEngineIgnited(false);
                        engineAudio.stop();
                        setIsExploded(val > 0.5);
                      } else {
                        setIsExploded(false);
                      }
                    }}
                    style={{
                      flex: 1,
                      accentColor: '#3b82f6',
                      background: 'rgba(255,255,255,0.1)',
                      height: '4px',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '10px', color: '#94a3b8', width: '28px', textAlign: 'right', fontFamily: 'monospace' }}>
                    {Math.round(explosionFactor * 100)}%
                  </span>
                </div>
              </div>

              {/* SpectraVision Modes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  SpectraVision Shaders
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  {[
                    { id: 'standard', label: 'Standard PBR', icon: Eye },
                    { id: 'thermal', label: 'FLIR Thermal', icon: Flame },
                    { id: 'xray', label: 'X-Ray Glass', icon: Sparkles },
                    { id: 'cycle', label: '720° Cycle', icon: Activity }
                  ].map(mode => {
                    const isSelected = visionMode === mode.id;
                    const IconComponent = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setVisionMode(mode.id)}
                        style={{
                          background: isSelected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isSelected ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                          color: isSelected ? '#93c5fd' : '#94a3b8',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <IconComponent size={12} color={isSelected ? '#60a5fa' : '#64748b'} />
                        {mode.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Subsystem Labels Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t('viewer.subsystem_labels')}</span>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  style={{
                    background: showLabels ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${showLabels ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
                    color: showLabels ? '#60a5fa' : '#94a3b8',
                    padding: '2px 8px', borderRadius: '4px',
                    fontSize: '9px', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {showLabels ? t('viewer.visible') : t('viewer.hidden')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Controls Overlay */}
          <div style={{
            position: 'absolute', bottom: '20px', right: '20px',
            zIndex: 10, display: 'flex', gap: '10px'
          }}>
            <button
              onClick={() => setShowMindMap(true)}
              title={t('viewer.tooltip_mind_map')}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.9)', border: '1px solid #3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#ffffff',
                boxShadow: '0 4px 15px rgba(59,130,246,0.5)', transition: 'all 0.2s'
              }}
            >
              <Network size={18} />
            </button>
            {(source === 'native' || source === 'animated') && (
              <>
                <button
                  onClick={() => {
                    const currentlyActive = isHandTracking && useStore.getState().handControlTarget === 'main';
                    setHandTracking(!currentlyActive, 'main');
                  }}
                  title={isHandTracking && useStore.getState().handControlTarget === 'main' ? t('viewer.tooltip_hand_disable') : t('viewer.tooltip_hand_enable')}
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: (isHandTracking && useStore.getState().handControlTarget === 'main') ? 'rgba(16, 185, 129, 0.9)' : 'rgba(10, 10, 15, 0.75)', 
                    border: (isHandTracking && useStore.getState().handControlTarget === 'main') ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#ffffff',
                    boxShadow: (isHandTracking && useStore.getState().handControlTarget === 'main') ? '0 4px 15px rgba(16,185,129,0.5)' : '0 2px 5px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Hand size={18} />
                </button>
                <button
                  onClick={() => {
                    if (source === 'animated') {
                      setIsAnimatedPlaying(!isAnimatedPlaying);
                    } else {
                      if (isEngineIgnited) {
                        setIsEngineIgnited(false);
                        engineAudio.stop();
                      } else {
                        setIsEngineIgnited(true);
                        engineAudio.start();
                      }
                    }
                  }}
                  title={
                    source === 'animated'
                      ? (isAnimatedPlaying ? 'Pause Kinematic Animation' : 'Play Kinematic Animation')
                      : (isEngineIgnited ? t('viewer.tooltip_rotate_pause') : t('viewer.tooltip_rotate_start'))
                  }
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(10, 10, 15, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    color: (source === 'animated' ? isAnimatedPlaying : isEngineIgnited) ? (source === 'animated' ? '#06b6d4' : '#3b82f6') : '#94a3b8',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)', transition: 'all 0.2s'
                  }}
                >
                  <Zap size={18} />
                </button>
              </>
            )}
            
            <button
              onClick={() => {
                if (source === 'native') setSource('animated');
                else if (source === 'animated') setSource('reference');
                else setSource('native');
              }}
              title="Cycle Engine Model"
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(10, 10, 15, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)', transition: 'all 0.2s'
              }}
            >
              <Layers size={18} />
            </button>

            <button
              onClick={toggleFullscreen}
              title={t('viewer.tooltip_fullscreen')}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(10, 10, 15, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)', transition: 'all 0.2s'
              }}
            >
              <Maximize2 size={18} />
            </button>
          </div>

          {/* 720° Combustion Cycle Kinematics Scrubber Bar */}
          {visionMode === 'cycle' && source === 'native' && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '280px',
              zIndex: 15,
              background: 'rgba(10, 12, 18, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={15} color="#38bdf8" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#93c5fd' }}>
                    720° 4-Stroke Kinematics:
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: crankAngle < 180 ? 'rgba(59,130,246,0.2)' : crankAngle < 360 ? 'rgba(234,179,8,0.2)' : crankAngle < 540 ? 'rgba(239,68,68,0.25)' : 'rgba(168,85,247,0.2)',
                    color: crankAngle < 180 ? '#60a5fa' : crankAngle < 360 ? '#facc15' : crankAngle < 540 ? '#f87171' : '#c084fc',
                    border: `1px solid ${crankAngle < 180 ? '#3b82f6' : crankAngle < 360 ? '#eab308' : crankAngle < 540 ? '#ef4444' : '#a855f7'}`
                  }}>
                    {crankAngle < 180 ? '1. Intake (0°-180°)' : crankAngle < 360 ? '2. Compression (180°-360°)' : crankAngle < 540 ? '🔥 3. Power Stroke (360°-540°)' : '4. Exhaust (540°-720°)'}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>
                  {crankAngle}° Crank
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="range"
                  min="0"
                  max="720"
                  step="1"
                  value={crankAngle}
                  onChange={(e) => setCrankAngle(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: '#38bdf8',
                    cursor: 'pointer',
                    height: '5px'
                  }}
                />
                <button
                  onClick={() => {
                    // Auto-step slow-motion cycle
                    let current = crankAngle;
                    const interval = setInterval(() => {
                      current = (current + 5) % 720;
                      setCrankAngle(current);
                    }, 40);
                    setTimeout(() => clearInterval(interval), 5000);
                  }}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid #3b82f6',
                    borderRadius: '4px',
                    color: '#93c5fd',
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    cursor: 'pointer'
                  }}
                >
                  Slow-Mo 5s
                </button>
              </div>
            </div>
          )}

          {/* Subsystem Telemetry Inspector (Top-Right Docked, Zero Engine Occlusion) */}
          {source === 'native' && isTelemetryCollapsed && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsTelemetryCollapsed(false)}
              title="Expand Subsystem Telemetry Inspector"
              aria-label="Expand Subsystem Telemetry Inspector"
              style={{
                position: 'absolute',
                top: '80px',
                right: '20px',
                zIndex: 15,
                background: 'rgba(10, 10, 15, 0.88)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                padding: '8px 14px',
                borderRadius: '20px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 15px rgba(59,130,246,0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(20, 25, 40, 0.95)'
                e.currentTarget.style.borderColor = '#3b82f6'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(10, 10, 15, 0.88)'
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.35)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Activity size={14} color="#38bdf8" />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#93c5fd' }}>
                Subsystem Telemetry
              </span>
              <ChevronLeft size={14} color="#60a5fa" />
            </motion.button>
          )}

          {source === 'native' && !isTelemetryCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'absolute',
                top: '80px',
                right: '20px',
                width: '350px',
                maxWidth: 'calc(100% - 40px)',
                zIndex: 15,
                background: 'rgba(8, 12, 22, 0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: activeInspectionPart 
                  ? `1px solid ${activeInspectionPart.color || '#3b82f6'}66` 
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '16px',
                boxShadow: activeInspectionPart
                  ? `0 20px 40px rgba(0,0,0,0.85), 0 0 25px ${activeInspectionPart.color || '#3b82f6'}25`
                  : '0 15px 35px rgba(0,0,0,0.6)',
                fontFamily: "'Inter', sans-serif",
                color: '#fff',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: activeInspectionPart ? `${activeInspectionPart.color || '#3b82f6'}22` : 'rgba(59, 130, 246, 0.15)',
                    color: activeInspectionPart ? (activeInspectionPart.color || '#60a5fa') : '#93c5fd',
                    border: `1px solid ${activeInspectionPart ? (activeInspectionPart.color || '#3b82f6') : '#3b82f6'}44`
                  }}>
                    {activeInspectionPart?.category || 'SUBSYSTEM TELEMETRY'}
                  </span>
                  <span style={{
                    fontSize: '9px',
                    color: isPartPinned ? '#38bdf8' : activeInspectionPart ? '#10b981' : '#64748b',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isPartPinned ? '#38bdf8' : activeInspectionPart ? '#10b981' : '#64748b',
                      boxShadow: isPartPinned ? '0 0 8px #38bdf8' : activeInspectionPart ? '0 0 8px #10b981' : 'none'
                    }} />
                    {isPartPinned ? 'PINNED' : activeInspectionPart ? 'ACTIVE SCAN' : 'STANDBY'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isPartPinned && (
                    <button
                      onClick={() => {
                        setSelectedEnginePart(null);
                        setHoveredEnginePart(null);
                      }}
                      title="Release Pinned Inspection"
                      style={{
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        color: '#fca5a5',
                        fontSize: '9px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Unpin
                    </button>
                  )}
                  <button
                    onClick={() => setIsTelemetryCollapsed(true)}
                    title="Collapse Inspector"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#94a3b8',
                      fontSize: '10px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <span>Hide</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {/* Dynamic Subsystem Content or Standby Prompt */}
              {activeInspectionPart ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#ffffff',
                    fontFamily: "'Outfit', sans-serif",
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em'
                  }}>
                    {activeInspectionPart.fullName}
                  </div>
                  <p style={{
                    fontSize: '11.5px',
                    color: 'rgba(255,255,255,0.82)',
                    margin: 0,
                    lineHeight: 1.5
                  }}>
                    {activeInspectionPart.description}
                  </p>
                  {activeInspectionPart.spec && (
                    <div style={{
                      marginTop: '4px',
                      padding: '8px 10px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '10.5px',
                      color: '#93c5fd',
                      fontFamily: 'monospace',
                      fontWeight: 600
                    }}>
                      <span style={{ color: activeInspectionPart.color || '#3b82f6' }}>⚙</span>
                      <span>{activeInspectionPart.spec}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', fontFamily: "'Outfit', sans-serif" }}>
                    Interactive Engine Explorer
                  </div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Hover or click any subsystem callout marker on the 3D engine to inspect CAD telemetry, materials, and internal dynamics.
                  </p>
                </div>
              )}

              {/* Quick Subsystem Selector Navigator */}
              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Subsystem Quick Select:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {ENGINE_SUBSYSTEMS.map((sub) => {
                    const isSubActive = activeInspectionPart?.id === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          if (selectedEnginePart?.id === sub.id) {
                            setSelectedEnginePart(null);
                            setHoveredEnginePart(null);
                          } else {
                            const data = {
                              id: sub.id,
                              title: sub.name,
                              fullName: sub.fullName,
                              category: sub.category,
                              description: sub.desc,
                              spec: sub.spec,
                              color: sub.color
                            };
                            setSelectedEnginePart(data);
                            setHoveredEnginePart(data);
                          }
                        }}
                        onMouseEnter={() => {
                          if (!selectedEnginePart) {
                            setHoveredEnginePart({
                              id: sub.id,
                              title: sub.name,
                              fullName: sub.fullName,
                              category: sub.category,
                              description: sub.desc,
                              spec: sub.spec,
                              color: sub.color
                            });
                          }
                        }}
                        onMouseLeave={() => {
                          if (!selectedEnginePart) {
                            setHoveredEnginePart(null);
                          }
                        }}
                        style={{
                          background: isSubActive ? `${sub.color}25` : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isSubActive ? sub.color : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '6px',
                          padding: '3px 8px',
                          color: isSubActive ? '#fff' : '#94a3b8',
                          fontSize: '10px',
                          fontWeight: isSubActive ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Kinematic Animated V8 HUD & Telemetry Overlay */}
          {source === 'animated' && isHudCollapsed && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsHudCollapsed(false)}
              title="Expand Kinematic Telemetry"
              aria-label="Expand Kinematic Telemetry"
              style={{
                position: 'absolute',
                top: '80px',
                left: '20px',
                zIndex: 10,
                background: 'rgba(10, 12, 18, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                padding: '8px 14px',
                borderRadius: '20px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 15px rgba(6, 182, 212, 0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(15, 25, 35, 0.95)'
                e.currentTarget.style.borderColor = '#06b6d4'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(10, 12, 18, 0.9)'
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.35)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: isAnimatedPlaying ? '#06b6d4' : '#64748b',
                boxShadow: isAnimatedPlaying ? '0 0 8px #06b6d4' : 'none'
              }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#67e8f9' }}>
                Kinematics Telemetry
              </span>
              <ChevronRight size={14} color="#06b6d4" />
            </motion.button>
          )}

          {source === 'animated' && !isHudCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="engine-hud-panel"
              style={{
                position: 'absolute',
                top: '80px',
                left: '20px',
                zIndex: 10,
                background: 'rgba(10, 12, 18, 0.92)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                padding: '1.25rem',
                borderRadius: '14px',
                width: '310px',
                fontFamily: "'Inter', sans-serif",
                color: '#fff',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(6, 182, 212, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: isAnimatedPlaying ? '#06b6d4' : '#64748b',
                    boxShadow: isAnimatedPlaying ? '0 0 8px #06b6d4' : 'none'
                  }} />
                  <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#67e8f9' }}>
                    Kinematics Telemetry
                  </span>
                </div>
                <button
                  onClick={() => setIsHudCollapsed(true)}
                  title="Collapse HUD Panel"
                  aria-label="Collapse HUD Panel"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#94a3b8',
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <span>Hide</span>
                  <ChevronLeft size={13} />
                </button>
              </div>

              <div>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px 0', lineHeight: 1.3 }}>
                  Kinematic Animated V8 Assembly
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.5, margin: 0 }}>
                  High-fidelity 8-cylinder mechanical assembly with 331 synchronized animation channels driving pistons, connecting rods, crankshaft, and serpentine belts.
                </p>
              </div>

              {/* Status Indicator & Play/Pause */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: '8px',
                background: isAnimatedPlaying ? 'rgba(6, 182, 212, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${isAnimatedPlaying ? 'rgba(6, 182, 212, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: isAnimatedPlaying ? '#06b6d4' : '#ef4444',
                    boxShadow: isAnimatedPlaying ? '0 0 6px #06b6d4' : 'none'
                  }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: isAnimatedPlaying ? '#67e8f9' : '#f87171' }}>
                    {isAnimatedPlaying ? 'Cycle: RUNNING' : 'Cycle: PAUSED'}
                  </span>
                </div>
                <button
                  onClick={() => setIsAnimatedPlaying(!isAnimatedPlaying)}
                  style={{
                    background: isAnimatedPlaying ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isAnimatedPlaying ? 'Pause' : 'Resume'}
                </button>
              </div>

              {/* Kinematic Speed Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Kinematic Speed</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#06b6d4', fontFamily: 'monospace' }}>{animatedSpeed}x</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                  {[0.5, 1, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setAnimatedSpeed(spd)}
                      style={{
                        padding: '5px 0',
                        borderRadius: '6px',
                        background: animatedSpeed === spd ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${animatedSpeed === spd ? '#06b6d4' : 'rgba(255,255,255,0.08)'}`,
                        color: animatedSpeed === spd ? '#67e8f9' : '#94a3b8',
                        fontSize: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Engineering Specs Grid */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Architecture</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>90° V8 Kinematic</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Rigged Channels</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>331 Samplers (Continuous)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Reciprocating Array</span>
                  <span style={{ color: '#06b6d4', fontWeight: 600 }}>8 Pistons & Connecting Rods</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* V6 Sketchfab Reference HUD & Attribution Overlay */}
          {source === 'reference' && isHudCollapsed && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsHudCollapsed(false)}
              title="Expand CAD Reference Info"
              aria-label="Expand CAD Reference Info"
              style={{
                position: 'absolute',
                top: '80px',
                left: '20px',
                zIndex: 10,
                background: 'rgba(10, 12, 18, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                padding: '8px 14px',
                borderRadius: '20px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 15px rgba(56,189,248,0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)'
                e.currentTarget.style.borderColor = '#38bdf8'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(10, 12, 18, 0.9)'
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#7dd3fc' }}>
                CAD Reference Info
              </span>
              <ChevronRight size={14} color="#38bdf8" />
            </motion.button>
          )}

          {source === 'reference' && !isHudCollapsed && (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="engine-hud-panel"
                style={{
                  position: 'absolute',
                  top: '80px',
                  left: '20px',
                  zIndex: 10,
                  background: 'rgba(10, 12, 18, 0.9)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  padding: '1.25rem',
                  borderRadius: '14px',
                  width: '310px',
                  fontFamily: "'Inter', sans-serif",
                  color: '#fff',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(56,189,248,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
                    <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7dd3fc' }}>
                      CAD Engineering Reference
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9px', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, border: '1px solid rgba(56,189,248,0.3)' }}>
                      Twin-Turbo
                    </span>
                    <button
                      onClick={() => setIsHudCollapsed(true)}
                      title="Collapse HUD Panel"
                      aria-label="Collapse HUD Panel"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#94a3b8',
                        fontSize: '10px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(56,189,248,0.2)'
                        e.currentTarget.style.borderColor = '#38bdf8'
                        e.currentTarget.style.color = '#fff'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                        e.currentTarget.style.color = '#94a3b8'
                      }}
                    >
                      <span>Hide</span>
                      <ChevronLeft size={13} />
                    </button>
                  </div>
                </div>

              <div>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px 0', lineHeight: 1.3 }}>
                  V6 Car Engine - Fully Rigged and Animated
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.5, margin: 0 }}>
                  High-fidelity 6-cylinder powerplant featuring synchronized rotating assembly, crankshaft, connecting rods, and DOHC valvetrain.
                </p>
              </div>

              {/* Engineering Specs Grid */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Architecture</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>60° V6 Twin-Turbo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Valvetrain</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>24-Valve DOHC Rigged</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Kinematics</span>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>Fully Animated Cycle</span>
                </div>
              </div>

              {/* Attribution Line */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>
                  By{' '}
                  <a
                    href="https://sketchfab.com/AhmedSaleh"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}
                  >
                    AhmedSaleh
                  </a>
                  {' '}on{' '}
                  <a
                    href="https://sketchfab.com/3d-models/v6-car-engine-fully-rigged-and-animated-cd09ed2b8a8e4f2792c68f952b0949de"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}
                  >
                    Sketchfab
                  </a>
                </span>
                <a
                  href="https://sketchfab.com/3d-models/v6-car-engine-fully-rigged-and-animated-cd09ed2b8a8e4f2792c68f952b0949de"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#38bdf8',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  Inspect <ExternalLink size={11} />
                </a>
              </div>
            </motion.div>
          )}

          {/* 3D Scene / Iframe */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            {source === 'native' ? (
              <Suspense fallback={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: '14px' }}>
                  {t('viewer.loading_model')}
                </div>
              }>
                {isHandTracking && useStore.getState().handControlTarget === 'main' && <HandGestureController />}
                <EngineScene isAnimated={isEngineIgnited} explosionFactor={explosionFactor} showLabels={showLabels} />
              </Suspense>
            ) : source === 'animated' ? (
              <Suspense fallback={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: '14px' }}>
                  {t('viewer.loading_model')}
                </div>
              }>
                {isHandTracking && useStore.getState().handControlTarget === 'main' && <HandGestureController />}
                <AnimatedV8Scene isAnimated={isAnimatedPlaying} speed={animatedSpeed} />
              </Suspense>
            ) : (
              <div className="sketchfab-embed-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
                <iframe
                  title="V6 Car Engine - Fully Rigged and Animated"
                  src={REF_URL}
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
                    width: '100%', height: '100%',
                    border: 'none', background: '#09090b'
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
    </>
  )
}

