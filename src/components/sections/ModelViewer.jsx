import { useState, Suspense, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stage, View, PerspectiveCamera } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import * as THREE from 'three'
import { MainEngine } from '../3d/Models'
import { Maximize2, Zap, Layers, RefreshCcw, Network, X, Hand } from 'lucide-react'
import ErrorBoundary from '../utils/ErrorBoundary'
import { useStore } from '../../store/useStore'
import HandGestureController from '../utils/HandGestureController'
import HandControls from '../utils/HandControls'

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
        <Suspense fallback={null}>
          <Stage intensity={0.5} environment="city" adjustCamera={true} shadows={false}>
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

/**
 * ModelViewer Component
 * The featured 3D showcase section. Supports native 3D rendering and external engineering references.
 * Features system architecture mind-mapping and hand gesture interaction.
 */
export default function ModelViewer() {
  const { t } = useTranslation();
  const [source, setSource] = useState('native'); // 'native' or 'reference'
  const [showMindMap, setShowMindMap] = useState(false);
  const [isAnimated, setIsAnimated] = useState(true); // functions as 'running' state
  const [explosionFactor, setExplosionFactor] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  
  const isHandTracking = useStore(state => state.isHandTracking);
  const setHandTracking = useStore(state => state.setHandTracking);

  const REF_URL =
    'https://sketchfab.com/models/eea9d9252ab14298b50699a471dc2cee/embed?autostart=1&ui_infos=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_stop=0&preload=1&transparent=1&dnt=1'

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
        style={{ padding: '4rem 1.5rem', background: '#050505', position: 'relative' }}
      >
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>

        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div className="section-label">
            <span>{t('viewer.badge')}</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '2rem', fontWeight: 700, color: '#ffffff',
            fontFamily: "'Inter', sans-serif", marginBottom: '0.5rem'
          }}>
            {t('viewer.title')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>
            {t('viewer.subtitle')}
          </p>
        </div>

        {/* Main Viewer Box */}
        <motion.div
          id="engine-viewer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="h-[500px] sm:h-[550px] lg:h-[650px] w-full"
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
          {source === 'native' && (
            <div className="engine-hud-panel" style={{
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
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                <Zap size={14} color="#3b82f6" />
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94a3b8' }}>{t('viewer.hud_diagnostics')}</span>
              </div>
              
              {/* Ignition Switch */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{t('viewer.power_source')}</label>
                <button
                  onClick={() => {
                    if (isAnimated) {
                      setIsAnimated(false);
                    } else {
                      setIsExploded(false); // Collapse before starting
                      setIsAnimated(true);
                    }
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isAnimated && explosionFactor < 0.1 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                    background: isAnimated && explosionFactor < 0.1 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: isAnimated && explosionFactor < 0.1 ? '#10b981' : '#ef4444',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    boxShadow: isAnimated && explosionFactor < 0.1 ? '0 0 15px rgba(16,185,129,0.15)' : 'none'
                  }}
                >
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: isAnimated && explosionFactor < 0.1 ? '#10b981' : '#ef4444',
                    boxShadow: isAnimated && explosionFactor < 0.1 ? '0 0 8px #10b981' : 'none',
                    animation: isAnimated && explosionFactor < 0.1 ? 'pulse 1.5s infinite' : 'none'
                  }} />
                  {isAnimated && explosionFactor < 0.1 ? t('viewer.engine_running') : t('viewer.engine_stopped')}
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
                      } else {
                        setIsAnimated(false); // Stop running before explosion
                        setIsExploded(true);
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
                      if (val > 0.001) {
                        setIsAnimated(false); // Pause rotation/animation on slide
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
            </div>
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
            {source === 'native' && (
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
                onClick={() => setIsAnimated(!isAnimated)}
                title={isAnimated ? t('viewer.tooltip_rotate_pause') : t('viewer.tooltip_rotate_start')}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(10, 10, 15, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: isAnimated ? '#3b82f6' : '#94a3b8',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.3)', transition: 'all 0.2s'
                }}
              >
                <Zap size={18} />
              </button>
              </>
            )}
            
            <button
              onClick={() => setSource(source === 'native' ? 'reference' : 'native')}
              title={source === 'native' ? t('viewer.tooltip_ref_model') : t('viewer.tooltip_native_model')}
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

          {/* 3D Scene / Iframe */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            {source === 'native' ? (
              <Suspense fallback={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: '14px' }}>
                  {t('viewer.loading_model')}
                </div>
              }>
                {isHandTracking && useStore.getState().handControlTarget === 'main' && <HandGestureController />}
                <EngineScene isAnimated={isAnimated} explosionFactor={explosionFactor} showLabels={showLabels} />
              </Suspense>
            ) : (
              <iframe
                title="Internal Engineering Reference"
                src={REF_URL}
                frameBorder="0"
                allowFullScreen
                allow="autostart; autoplay; fullscreen; xr-spatial-tracking"
                style={{
                  width: '100%', height: '100%',
                  border: 'none', background: '#09090b'
                }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
    </>
  )
}

