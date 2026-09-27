import { Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Settings, ShieldCheck, Cpu, Hand, Maximize2, ExternalLink } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import { useParams, useNavigate } from 'react-router-dom'
import { CrankshaftModel, PistonModel, SparkPlugModel, InternalsModel, EngineBlockModel, AnimatedV8Model } from '../3d/Models'
import ErrorBoundary from '../utils/ErrorBoundary'
import { getLocalizedComponents } from './ComponentGallery'
import HandControls from '../utils/HandControls'
import HandGestureController from '../utils/HandGestureController'
import { useStore } from '../../store/useStore'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

function DetailModel({ id, type, color }) {
  const controlsRef = useRef(null)

  if (type === 'v6_sketchfab') {
    return (
      <div className="sketchfab-embed-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
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
          style={{ width: '100%', height: '100%', border: 'none', background: '#09090b' }}
        />
      </div>
    )
  }

  const Model = type === 'crankshaft' ? CrankshaftModel :
    type === 'piston' ? PistonModel :
      type === 'spark_plug' ? SparkPlugModel :
        type === 'engine' ? EngineBlockModel :
          type === 'v8_animated' ? AnimatedV8Model :
            InternalsModel

  return (
    <ErrorBoundary>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={type === 'v8_animated' ? "always" : "demand"}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Stage intensity={0.5} environment="city" adjustCamera={1.2} shadows={false}>
            <Model color={color} isAnimated={true} speed={1} />
          </Stage>
        </Suspense>
        <OrbitControls ref={controlsRef} enableZoom={true} enablePan={false} />
        <HandControls controlsRef={controlsRef} targetId={`detail-${id}`} />
      </Canvas>
    </ErrorBoundary>
  )
}

export default function DetailPanel() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const isHandTracking = useStore(state => state.isHandTracking)
  const handControlTarget = useStore(state => state.handControlTarget)
  const setHandTracking = useStore(state => state.setHandTracking)

  const localizedComponents = getLocalizedComponents(t)
  const activeModel = localizedComponents.find(c => c.id === parseInt(id))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!activeModel) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>{t('detail.not_found')}</h2>
          <button onClick={() => navigate('/')} style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 700 }}>
            {t('detail.return_home')}
          </button>
        </div>
      </div>
    )
  }

  const getSpecLabel = (label) => {
    switch (label) {
      case 'Reference ID': return t('detail.spec_ref_id', { defaultValue: 'Reference ID' });
      case 'Net Weight': return t('detail.spec_net_weight', { defaultValue: 'Net Weight' });
      case 'Core Material': return t('detail.spec_core_material', { defaultValue: 'Core Material' });
      case 'Hardness': return t('detail.spec_hardness', { defaultValue: 'Hardness' });
      case 'Thermal Range': return t('detail.spec_thermal_range', { defaultValue: 'Thermal Range' });
      case 'Certification': return t('detail.spec_certification', { defaultValue: 'Certification' });
      default: return label;
    }
  };

  const handleDownload = () => {
    const specsText = (activeModel.specs || [
      { label: 'Reference ID', value: `MC-2026-X0${activeModel.id}` },
      { label: 'Net Weight', value: '3.85 kg' },
      { label: 'Core Material', value: 'Titanium-G5' },
      { label: 'Hardness', value: '45 HRC' },
      { label: 'Thermal Range', value: '-60°C to 450°C' },
      { label: 'Certification', value: 'ISO-9001 Pro' }
    ]).map(s => `${getSpecLabel(s.label)}: ${s.value}`).join('\n');

    const featuresText = (activeModel.features || [
      'Industrial grade material',
      'High-precision manufacturing',
      'Validated for extreme conditions'
    ]).map(f => `- ${f}`).join('\n');

    const content = `
=========================================
AUTO SPECTRA TECHNICAL DATA SHEET
=========================================
Component: ${activeModel.name}
Category: ${(activeModel.typeName || activeModel.type).toUpperCase()}
Status: VALIDATED (A1 GRADE)

-----------------------------------------
1. DESCRIPTION
-----------------------------------------
${activeModel.description}

${activeModel.extendedDescription || ''}

-----------------------------------------
2. TECHNICAL SPECIFICATIONS
-----------------------------------------
${specsText}

-----------------------------------------
3. ENGINEERING HIGHLIGHTS
-----------------------------------------
${featuresText}

-----------------------------------------
DATA AUTHENTICITY
Generated via Auto Spectra CAD Portal
Timestamp: ${new Date().toLocaleString()}
=========================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeModel.name.replace(/\s+/g, '_').toLowerCase()}_technical_data.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Auto Spectra | ${activeModel.name}`,
      text: `${activeModel.name}: ${activeModel.description}\n\nExplore this component and its technical specifications in high-fidelity 3D on Auto Spectra.`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(t('detail.link_copied'));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 5vw', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

        {/* Back Button */}
        <div className="mobile-center">
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1.25rem', borderRadius: '0.75rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', cursor: 'pointer', fontWeight: 600,
              fontSize: '0.9rem', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >
            <ArrowLeft size={16} /> {t('detail.back_btn')}
          </button>
        </div>

        <div className="detail-grid">

          {/* Left Column: 3D Viewer & Actions */}
          <div className="detail-sidebar">
            <motion.div
              id={`viewer-detail-${activeModel.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'relative',
                height: '70vh', minHeight: '500px',
                background: '#0a0a0a', borderRadius: '1.5rem',
                border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.05)'
              }}
            >
              {/* Controls Overlay */}
              <div style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem',
                zIndex: 10, display: 'flex', gap: '12px'
              }}>
                {activeModel.type !== 'v6_sketchfab' && (
                  <button
                    onClick={() => {
                      const targetId = `detail-${activeModel.id}`;
                      const currentlyActive = isHandTracking && handControlTarget === targetId;
                      setHandTracking(!currentlyActive, targetId);
                    }}
                    style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: (isHandTracking && handControlTarget === `detail-${activeModel.id}`) ? 'rgba(16, 185, 129, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                      border: (isHandTracking && handControlTarget === `detail-${activeModel.id}`) ? '1px solid #10b981' : '1px solid #e5e7eb',
                      cursor: 'pointer', color: (isHandTracking && handControlTarget === `detail-${activeModel.id}`) ? '#fff' : '#374151',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'all 0.2s'
                    }}
                    title={(isHandTracking && handControlTarget === `detail-${activeModel.id}`) ? t('viewer.tooltip_hand_disable') : t('viewer.tooltip_hand_enable')}
                  >
                    <Hand size={18} />
                  </button>
                )}
                <button
                  onClick={() => {
                    const viewer = document.getElementById(`viewer-detail-${activeModel.id}`);
                    if (!document.fullscreenElement) {
                      viewer.requestFullscreen().catch(err => console.log(err));
                    } else {
                      document.exitFullscreen();
                    }
                  }}
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e5e7eb',
                    cursor: 'pointer', color: '#374151',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'all 0.2s'
                  }}
                  title={t('viewer.tooltip_fullscreen')}
                >
                  <Maximize2 size={18} />
                </button>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{ width: '100%', height: '100%' }}
              >
                <DetailModel id={activeModel.id} type={activeModel.type} color={activeModel.color} />
              </motion.div>
              {isHandTracking && handControlTarget === `detail-${activeModel.id}` && (
                <>
                  <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.9)', padding: '8px 12px', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', pointerEvents: 'none' }}>
                    <Hand size={16} color="#10b981" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{t('viewer.hand_control_active')}</span>
                  </div>
                  <HandGestureController />
                </>
              )}
            </motion.div>

            {/* Actions & Quality Below Viewer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div className="mobile-stack" style={{ gap: '1rem' }}>
                <motion.button 
                  onClick={handleDownload}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    flex: 1, padding: '1.25rem', borderRadius: '1.25rem', background: '#111827', 
                    color: '#fff', border: '1px solid rgba(255,255,255,0.05)', fontWeight: 800, fontSize: '0.95rem', 
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                  }}
                >
                  <Download size={20} />
                  {t('detail.download_cad')}
                </motion.button>
                <motion.button 
                  onClick={handleShare}
                  whileHover={{ scale: 1.02, y: -2, background: '#f3f4f6' }}
                  whileTap={{ scale: 0.98 }}
                  style={{ 
                    padding: '1.25rem 2.5rem', borderRadius: '1.25rem', background: '#fff', 
                    border: '1px solid #e5e7eb', color: '#111827', fontWeight: 800, 
                    cursor: 'pointer', fontSize: '0.95rem'
                  }}
                >
                  {t('detail.share_data')}
                </motion.button>
              </div>

              <div style={{ 
                padding: '1.5rem', borderRadius: '1.25rem', background: 'rgba(59,130,246,0.04)', 
                border: '1px solid rgba(59,130,246,0.1)', display: 'flex', gap: '1.25rem',
                alignItems: 'center'
              }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                  <ShieldCheck size={24} color="#3b82f6" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', marginBottom: '0.25rem', letterSpacing: '-0.01em' }}>{t('detail.grade_badge')}</div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                    {t('detail.grade_desc')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mobile-center"
            style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
          >
            <div>
              <div className="mobile-center" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.35rem 0.75rem', borderRadius: '1rem',
                background: '#eff6ff', color: '#2563eb',
                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                marginBottom: '1.5rem'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
                {activeModel.typeName || activeModel.type}
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 800,
                color: '#ffffff', fontFamily: "'Inter', sans-serif",
                lineHeight: 1.1, marginBottom: '0.5rem'
              }}>
                {activeModel.name}
              </h1>

              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {t('detail.serial')}: MC-2026-X0{activeModel.id}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontSize: '1.1rem', fontWeight: 400 }}>
                {activeModel.description}
              </p>
              {activeModel.extendedDescription && (
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                  {activeModel.extendedDescription}
                </p>
              )}
            </div>

            {activeModel.type === 'v6_sketchfab' && (
              <div style={{
                background: 'rgba(56,189,248,0.06)',
                borderRadius: '1.25rem',
                padding: '1.5rem',
                border: '1px solid rgba(56,189,248,0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <ExternalLink size={15} /> 3D CAD Attribution & Source
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  <a href="https://sketchfab.com/3d-models/v6-car-engine-fully-rigged-and-animated-cd09ed2b8a8e4f2792c68f952b0949de" target="_blank" rel="nofollow noopener noreferrer" style={{ fontWeight: 'bold', color: '#38bdf8', textDecoration: 'none' }}>
                    V6 Car Engine - Fully Rigged and Animated
                  </a>
                  {' '}by{' '}
                  <a href="https://sketchfab.com/AhmedSaleh" target="_blank" rel="nofollow noopener noreferrer" style={{ fontWeight: 'bold', color: '#38bdf8', textDecoration: 'none' }}>
                    AhmedSaleh
                  </a>
                  {' '}on{' '}
                  <a href="https://sketchfab.com" target="_blank" rel="nofollow noopener noreferrer" style={{ fontWeight: 'bold', color: '#38bdf8', textDecoration: 'none' }}>
                    Sketchfab
                  </a>.
                </p>
              </div>
            )}

            {activeModel.features && (
              <div style={{ background: 'rgba(59,130,246,0.05)', borderRadius: '1.25rem', padding: '2rem', border: '1px solid rgba(59,130,246,0.1)' }}>
                <h3 className="mobile-center-text" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#60a5fa', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={20} /> {t('detail.highlights')}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {activeModel.features.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', marginTop: '0.4rem', flexShrink: 0 }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Specification Table */}
            <div style={{
              background: 'rgba(255,255,255,0.02)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)'
            }}>
              <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Cpu size={18} color="#3b82f6" />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', letterSpacing: '-0.01em' }}>{t('detail.tech_specs')}</span>
              </div>
              <div className="detail-specs-grid">
                {(activeModel.specs || [
                  { label: 'Reference ID', value: `MC-2026-X0${activeModel.id}` },
                  { label: 'Net Weight', value: '3.85 kg' },
                  { label: 'Core Material', value: 'Titanium-G5' },
                  { label: 'Hardness', value: '45 HRC' },
                  { label: 'Thermal Range', value: '-60°C to 450°C' },
                  { label: 'Certification', value: 'ISO-9001 Pro' },
                ]).map((spec, i) => (
                  <div key={spec.label} className="detail-spec-item">
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{getSpecLabel(spec.label)}</div>
                    <div style={{ color: '#ffffff', fontWeight: 800 }}>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
