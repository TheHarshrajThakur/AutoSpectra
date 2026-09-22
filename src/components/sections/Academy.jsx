import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BookOpen, Droplets, Flame, Cog, Activity, Zap, Wind, Search, CheckCircle2, AlertTriangle, RefreshCw, Award, ArrowRight } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import V8AssessmentHub from './V8AssessmentHub'

export const getLocalizedAcademyData = (t) => [
  {
    id: 'thermodynamics',
    title: t ? t('academy_modules.thermodynamics.title', { defaultValue: 'Thermodynamics' }) : 'Thermodynamics',
    icon: Flame,
    color: '#ef4444',
    content: (
      <div className="study-content">
        <p className="lead-text">{t ? t('academy_modules.thermodynamics.lead') : 'Thermodynamics governs the fundamental principles of energy conversion in mechanical systems. Understanding thermal efficiency is paramount for designing high-performance internal combustion engines and power plants.'}</p>

        <h3>{t ? t('academy_modules.thermodynamics.sec1_title') : '1. The Laws of Thermodynamics'}</h3>
        <p>{t ? t('academy_modules.thermodynamics.sec1_p') : 'The foundation of all thermal engineering lies in the four laws, with the First and Second bearing the most significance in power generation.'}</p>
        <div className="grid-2">
          <div className="card-minor">
            <h4>{t ? t('academy_modules.thermodynamics.law1_title') : 'First Law (Energy Conservation)'}</h4>
            <p>{t ? t('academy_modules.thermodynamics.law1_desc') : 'Energy cannot be created or destroyed, only altered in form.'}</p>
            <div className="formula-box">ΔU = Q - W</div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{t ? t('academy_modules.thermodynamics.law1_formula_sub') : 'Where ΔU is change in internal energy, Q is heat added, and W is work done by the system.'}</p>
          </div>
          <div className="card-minor">
            <h4>{t ? t('academy_modules.thermodynamics.law2_title') : 'Second Law (Entropy)'}</h4>
            <p>{t ? t('academy_modules.thermodynamics.law2_desc') : 'Total entropy of an isolated system can never decrease over time.'}</p>
            <div className="formula-box">ΔS ≥ 0</div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{t ? t('academy_modules.thermodynamics.law2_formula_sub') : 'This dictates that no engine can be 100% efficient; heat rejection is an absolute physical requirement.'}</p>
          </div>
        </div>

        <h3>{t ? t('academy_modules.thermodynamics.sec2_title') : '2. The Carnot Cycle Limit'}</h3>
        <p>{t ? t('academy_modules.thermodynamics.sec2_p') : 'The Carnot cycle establishes the absolute theoretical maximum efficiency for any heat engine operating between two temperatures.'}</p>
        <div className="pro-tip">
          <strong>{t ? t('academy.engineers_note') : "Engineer's Note"}</strong> {t ? t('academy_modules.thermodynamics.carnot_note') : 'While real engines use Otto or Diesel cycles, the Carnot efficiency (η = 1 - Tc/Th) dictates that raising combustion temperature (Th) and lowering exhaust temperature (Tc) are the only physical ways to increase maximum theoretical efficiency.'}
        </div>
      </div>
    ),
    quiz: {
      question: t ? t('academy_modules.thermodynamics.question') : "Which thermodynamic state function represents the measure of a system's thermal energy per unit temperature that is unavailable for doing useful work?",
      options: t ? [
        t('academy_modules.thermodynamics.opt0'),
        t('academy_modules.thermodynamics.opt1'),
        t('academy_modules.thermodynamics.opt2'),
        t('academy_modules.thermodynamics.opt3')
      ] : [
        "Enthalpy (H)",
        "Internal Energy (U)",
        "Gibbs Free Energy (G)",
        "Entropy (S)"
      ],
      answerIndex: 3,
      explanation: t ? t('academy_modules.thermodynamics.explanation') : "Entropy is a measure of molecular disorder or randomness. The Second Law of Thermodynamics dictates that energy naturally disperses, making a portion of the system's thermal energy unavailable for conversion into useful work."
    }
  },
  {
    id: 'engine-cycles',
    title: t ? t('academy_modules.engine_cycles.title', { defaultValue: 'IC Engine Cycles' }) : 'IC Engine Cycles',
    icon: Activity,
    color: '#f97316',
    content: (
      <div className="study-content">
        <p className="lead-text">{t ? t('academy_modules.engine_cycles.lead') : 'Internal Combustion (IC) engines rely on precise thermodynamic cycles to convert chemical potential energy into mechanical kinetic energy.'}</p>

        <h3>{t ? t('academy_modules.engine_cycles.sec1_title') : '1. The Otto Cycle (Constant Volume Combustion)'}</h3>
        <p>{t ? t('academy_modules.engine_cycles.sec1_p') : 'The standard four-stroke cycle used in modern gasoline engines. It consists of two isentropic processes and two isochoric (constant volume) processes.'}</p>
        <ul>
          <li>{t ? t('academy_modules.engine_cycles.step_intake') : 'Intake (Isobaric expansion): Piston descends, drawing in the stoichiometric air-fuel mixture (14.7:1).'}</li>
          <li>{t ? t('academy_modules.engine_cycles.step_compression') : 'Compression (Isentropic compression): Piston rises, drastically increasing pressure and temperature while reducing volume.'}</li>
          <li>{t ? t('academy_modules.engine_cycles.step_combustion') : 'Combustion & Power (Isochoric heat addition & Isentropic expansion): Spark plug fires, causing rapid pressure spike. Expanding gases force the piston down, delivering torque to the crankshaft.'}</li>
          <li>{t ? t('academy_modules.engine_cycles.step_exhaust') : 'Exhaust (Isochoric heat rejection & Isobaric compression): Exhaust valve opens, blowdown occurs, and the rising piston scavenges remaining gases.'}</li>
        </ul>

        <h3>{t ? t('academy_modules.engine_cycles.sec2_title') : '2. Volumetric Efficiency (VE)'}</h3>
        <p>{t ? t('academy_modules.engine_cycles.sec2_p') : "A critical metric measuring the actual volume of air-fuel mixture drawn into the cylinder compared to the cylinder's static geometric volume."}</p>
        <div className="formula-box">VE = (Actual Mass of Air intake) / (Theoretical Mass) × 100%</div>
        <div className="pro-tip">
          <strong>{t ? t('academy.performance_tuning') : 'Performance Tuning'}</strong> {t ? t('academy_modules.engine_cycles.tuning_note') : 'Naturally aspirated engines typically max out at ~85-90% VE. Forced induction (turbos/superchargers) can push VE well over 100%, forcing denser air charges into the combustion chamber.'}
        </div>
      </div>
    ),
    quiz: {
      question: t ? t('academy_modules.engine_cycles.question') : "In a standard four-stroke gasoline engine (Otto cycle), during which process does the spark-ignition-driven heat addition theoretically occur?",
      options: t ? [
        t('academy_modules.engine_cycles.opt0'),
        t('academy_modules.engine_cycles.opt1'),
        t('academy_modules.engine_cycles.opt2'),
        t('academy_modules.engine_cycles.opt3')
      ] : [
        "Constant pressure expansion (Isobaric)",
        "Constant volume heat addition (Isochoric)",
        "Isentropic compression",
        "Polytropic blowdown"
      ],
      answerIndex: 1,
      explanation: t ? t('academy_modules.engine_cycles.explanation') : "In the ideal Otto cycle, combustion occurs instantaneously while the piston is at Top Dead Center (TDC), meaning volume remains constant (isochoric heat addition). In real engines, this is approximated by rapid spark ignition."
    }
  },
  {
    id: 'engine-anatomy',
    title: t ? t('academy_modules.engine_anatomy.title', { defaultValue: 'Engine Anatomy' }) : 'Engine Anatomy',
    icon: Cog,
    color: '#8b5cf6',
    content: (
      <div className="study-content">
        <p className="lead-text">{t ? t('academy_modules.engine_anatomy.lead') : 'A high-performance engine is a symphony of precision-machined metallurgy, balancing immense dynamic forces and extreme thermal loads.'}</p>

        <h3>{t ? t('academy_modules.engine_anatomy.sec1_title') : '1. The Rotating Assembly'}</h3>
        <p>{t ? t('academy_modules.engine_anatomy.sec1_p') : 'The heart of the mechanical conversion process, consisting of the crankshaft, connecting rods, and pistons. These components must withstand thousands of G-forces during operation.'}</p>
        <div className="stat-grid">
          <div className="stat-item">
            <span className="stat-label">{t ? t('academy_modules.engine_anatomy.stat_comp') : 'Component'}</span>
            <span className="stat-value">{t ? t('academy_modules.engine_anatomy.piston_val') : 'Piston'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t ? t('academy_modules.engine_anatomy.stat_force') : 'Primary Force'}</span>
            <span className="stat-value">{t ? t('academy_modules.engine_anatomy.piston_force') : 'Thermal / Inertial'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t ? t('academy_modules.engine_anatomy.stat_mat') : 'Ideal Material'}</span>
            <span className="stat-value">{t ? t('academy_modules.engine_anatomy.piston_mat') : 'Forged 2618 Aluminum'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t ? t('academy_modules.engine_anatomy.stat_comp') : 'Component'}</span>
            <span className="stat-value">{t ? t('academy_modules.engine_anatomy.rod_val') : 'Connecting Rod'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t ? t('academy_modules.engine_anatomy.stat_force') : 'Primary Force'}</span>
            <span className="stat-value">{t ? t('academy_modules.engine_anatomy.rod_force') : 'Tensile / Compressive'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t ? t('academy_modules.engine_anatomy.stat_mat') : 'Ideal Material'}</span>
            <span className="stat-value">{t ? t('academy_modules.engine_anatomy.rod_mat') : 'Forged 4340 Steel / Titanium'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t ? t('academy_modules.engine_anatomy.stat_comp') : 'Component'}</span>
            <span className="stat-value">{t ? t('academy_modules.engine_anatomy.crank_val') : 'Crankshaft'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t ? t('academy_modules.engine_anatomy.stat_force') : 'Primary Force'}</span>
            <span className="stat-value">{t ? t('academy_modules.engine_anatomy.crank_force') : 'Torsional / Bending'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t ? t('academy_modules.engine_anatomy.stat_mat') : 'Ideal Material'}</span>
            <span className="stat-value">{t ? t('academy_modules.engine_anatomy.crank_mat') : 'Forged Billet 4340 Steel'}</span>
          </div>
        </div>

        <h3>{t ? t('academy_modules.engine_anatomy.sec2_title') : '2. Valvetrain Dynamics'}</h3>
        <p>{t ? t('academy_modules.engine_anatomy.sec2_p') : 'At high RPM, standard valve springs can fail to close the valve quickly enough, leading to valve float where the piston strikes the open valve. Modern performance engines use stiffer dual valve springs, titanium retainers, or desmodromic systems to eliminate float.'}</p>
      </div>
    ),
    quiz: {
      question: t ? t('academy_modules.engine_anatomy.question') : "Which destructive phenomenon occurs at high RPM when valve springs cannot keep the lifter in contact with the camshaft lobe, risking piston-to-valve collision?",
      options: t ? [
        t('academy_modules.engine_anatomy.opt0'),
        t('academy_modules.engine_anatomy.opt1'),
        t('academy_modules.engine_anatomy.opt2'),
        t('academy_modules.engine_anatomy.opt3')
      ] : [
        "Hydraulic lockup",
        "Valve float",
        "Cavitational resonance",
        "Pre-ignition detonation"
      ],
      answerIndex: 1,
      explanation: t ? t('academy_modules.engine_anatomy.explanation') : "Valve float occurs when the inertia of the valve assembly overcomes the spring's return force, allowing the valve to remain partially open when it should be closed. This causes severe power loss and catastrophic engine contact."
    }
  },
  {
    id: 'forced-induction',
    title: t ? t('academy_modules.forced_induction.title', { defaultValue: 'Forced Induction' }) : 'Forced Induction',
    icon: Wind,
    color: '#06b6d4',
    content: (
      <div className="study-content">
        <p className="lead-text">{t ? t('academy_modules.forced_induction.lead') : 'Forced induction compresses ambient intake air, increasing oxygen density in the combustion chamber to burn more fuel and generate massive power output.'}</p>

        <h3>{t ? t('academy_modules.forced_induction.sec1_title') : '1. Turbocharger vs. Supercharger'}</h3>
        <div className="grid-2">
          <div className="card-minor">
            <h4>{t ? t('academy_modules.forced_induction.turbo_title') : 'Turbochargers'}</h4>
            <p>{t ? t('academy_modules.forced_induction.turbo_desc') : 'Driven by waste exhaust gas enthalpy. Highly efficient since they recover energy normally lost to atmosphere, but suffer from spool latency (turbo lag).'}</p>
          </div>
          <div className="card-minor">
            <h4>{t ? t('academy_modules.forced_induction.super_title') : 'Superchargers'}</h4>
            <p>{t ? t('academy_modules.forced_induction.super_desc') : 'Driven directly by the crankshaft via a belt or gear. Instant throttle response across the RPM band, but introduces parasitic mechanical drag on the engine.'}</p>
          </div>
        </div>

        <h3>{t ? t('academy_modules.forced_induction.sec2_title') : '2. Adiabatic Efficiency & Intercooling'}</h3>
        <p>{t ? t('academy_modules.forced_induction.sec2_p') : 'Compressing air heats it up according to the Ideal Gas Law (PV=nRT). Hot intake air reduces air density and drastically increases the risk of engine knock (detonation). Intercoolers remove this heat, restoring charge density and engine safety.'}</p>
      </div>
    ),
    quiz: {
      question: t ? t('academy_modules.forced_induction.question') : "Why is an intercooler essential after compressing air through a turbocharger compressor wheel?",
      options: t ? [
        t('academy_modules.forced_induction.opt0'),
        t('academy_modules.forced_induction.opt1'),
        t('academy_modules.forced_induction.opt2'),
        t('academy_modules.forced_induction.opt3')
      ] : [
        "To lubricate the intake valves with cooled oil vapor",
        "To decrease air density and reduce engine octane requirements",
        "To cool the compressed air, increasing oxygen density and preventing detonation",
        "To increase backpressure on the turbine wheel for quicker spooling"
      ],
      answerIndex: 2,
      explanation: t ? t('academy_modules.forced_induction.explanation') : "Compressing air increases its temperature. Hot air is less dense (less oxygen per volume) and promotes premature detonation (engine knock). An intercooler cools the charge air, making it denser and chemically safer for high-boost combustion."
    }
  },
  {
    id: 'fluid-mechanics',
    title: t ? t('academy_modules.fluid_mechanics.title', { defaultValue: 'Fluid Dynamics' }) : 'Fluid Dynamics',
    icon: Droplets,
    color: '#3b82f6',
    content: (
      <div className="study-content">
        <p className="lead-text">{t ? t('academy_modules.fluid_mechanics.lead') : 'Fluids—both liquids (oil, coolant, fuel) and gases (intake air, exhaust)—dictate engine survival and efficiency through complex Navier-Stokes behaviors.'}</p>

        <h3>{t ? t('academy_modules.fluid_mechanics.sec1_title') : '1. Hydrodynamic Lubrication'}</h3>
        <p>{t ? t('academy_modules.fluid_mechanics.sec1_p') : 'In engine bearings (like main and rod bearings), the metal surfaces never actually touch. They ride on a micro-thin wedge of pressurized oil.'}</p>
        <div className="pro-tip">
          <strong>{t ? t('academy.cavitation_warning') : 'Cavitation Warning'}</strong> {t ? t('academy_modules.fluid_mechanics.cavitation_note') : 'High-RPM oil pumps can suffer from cavitation—where low pressure causes oil to boil into vapor bubbles, imploding and destroying bearing surfaces. Dry sump systems mitigate this by actively scavenging oil.'}
        </div>

        <h3>{t ? t('academy_modules.fluid_mechanics.sec2_title') : '2. Intake Port Boundary Layers'}</h3>
        <p>{t ? t('academy_modules.fluid_mechanics.sec2_p') : 'Air flowing through intake runners experiences drag against the port walls, creating a slow-moving boundary layer. Port polishing is often misunderstood; a slightly rough surface creates micro-turbulence that keeps fuel suspended in the air charge rather than puddling on the walls.'}</p>
      </div>
    ),
    quiz: {
      question: t ? t('academy_modules.fluid_mechanics.question') : "In high-RPM engine lubrication systems, what destructive event is caused by vapor bubbles forming and imploding against bearings due to localized pressure drops?",
      options: t ? [
        t('academy_modules.fluid_mechanics.opt0'),
        t('academy_modules.fluid_mechanics.opt1'),
        t('academy_modules.fluid_mechanics.opt2'),
        t('academy_modules.fluid_mechanics.opt3')
      ] : [
        "Hydrodynamic shearing",
        "Cavitation",
        "Viscous drag friction",
        "Boundary layer stagnation"
      ],
      answerIndex: 1,
      explanation: t ? t('academy_modules.fluid_mechanics.explanation') : "Cavitation occurs when local pressure in the fluid drops below its vapor pressure, causing vapor bubbles to form. When these bubbles move to high-pressure zones, they collapse violently, sending micro-jets of fluid that erode bearing metal."
    }
  },
  {
    id: 'materials',
    title: t ? t('academy_modules.materials.title', { defaultValue: 'Material Science' }) : 'Material Science',
    icon: BookOpen,
    color: '#10b981',
    content: (
      <div className="study-content">
        <p className="lead-text">{t ? t('academy_modules.materials.lead') : 'The limits of mechanical engineering are strictly defined by metallurgy. Selecting the right alloy is the difference between championship performance and catastrophic failure.'}</p>

        <h3>{t ? t('academy_modules.materials.sec1_title') : '1. Forged vs. Cast Metals'}</h3>
        <div className="grid-2">
          <div className="card-minor">
            <h4 style={{ color: '#f87171' }}>{t ? t('academy_modules.materials.cast_title') : 'Casting'}</h4>
            <p>{t ? t('academy_modules.materials.cast_desc') : 'Molten metal poured into a mold. Random, porous grain structure. Brittle under immense shock loads, but inexpensive to mass-produce.'}</p>
          </div>
          <div className="card-minor">
            <h4 style={{ color: '#34d399' }}>{t ? t('academy_modules.materials.forge_title') : 'Forging'}</h4>
            <p>{t ? t('academy_modules.materials.forge_desc') : 'Solid metal stamped under extreme pressure. Aligns the internal grain structure to follow the shape of the part, offering vastly superior tensile strength and fatigue resistance.'}</p>
          </div>
        </div>

        <h3>{t ? t('academy_modules.materials.sec2_title') : '2. Exotic Superalloys'}</h3>
        <ul>
          <li>{t ? t('academy_modules.materials.inconel_desc') : 'Inconel: A nickel-chromium-based superalloy used in exhaust valves and turbocharger turbine wheels. It maintains structural integrity at extreme temperatures where steel would melt.'}</li>
          <li>{t ? t('academy_modules.materials.beryllium_desc') : 'Beryllium-Copper: Used in high-end valve seats for its incredible thermal conductivity, rapidly pulling heat out of the extremely hot exhaust valves and transferring it to the cylinder head cooling jacket.'}</li>
        </ul>
      </div>
    ),
    quiz: {
      question: t ? t('academy_modules.materials.question') : "Which high-performance nickel-chromium-based superalloy is typically chosen for exhaust valves and turbine wheels to prevent failure under extreme heat?",
      options: t ? [
        t('academy_modules.materials.opt0'),
        t('academy_modules.materials.opt1'),
        t('academy_modules.materials.opt2'),
        t('academy_modules.materials.opt3')
      ] : [
        "Inconel",
        "2618 Aluminum Alloy",
        "Carbon-Carbon Matrix",
        "SAE 4340 Steel"
      ],
      answerIndex: 0,
      explanation: t ? t('academy_modules.materials.explanation') : "Inconel maintains structural strength, creep resistance, and oxidation resistance at extreme temperatures (above 800°C) where standard steel or titanium would suffer mechanical fatigue or thermal oxidation."
    }
  }
];

const ACADEMY_DATA = getLocalizedAcademyData(null);

/**
 * Academy Component
 * A comprehensive educational interface providing technical modules on engineering subjects.
 * Includes a real-time search system and interactive content panels.
 */
function KnowledgeCheck({ topicId, quiz, color, isValidated, onValidate, t }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasChecked, setHasChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Reset local quiz state when the topic changes
  useEffect(() => {
    setSelectedOption(null)
    setHasChecked(false)
    setIsCorrect(false)
  }, [topicId])

  const handleCheckAnswer = () => {
    if (selectedOption === null) return
    const correct = selectedOption === quiz.answerIndex
    setIsCorrect(correct)
    setHasChecked(true)
    if (correct) {
      onValidate()
    }
  }

  const handleRetry = () => {
    setSelectedOption(null)
    setHasChecked(false)
    setIsCorrect(false)
  }

  return (
    <div 
      style={{
        marginTop: '4rem',
        padding: '2.5rem',
        background: 'rgba(255,255,255,0.02)',
        border: `1px dashed ${isValidated ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '1.5rem',
        boxShadow: isValidated ? '0 0 30px rgba(16,185,129,0.03)' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Glow */}
      <div 
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${isValidated ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.01)'} 0%, transparent 70%)`,
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          padding: '0.35rem 0.75rem',
          borderRadius: '100px',
          fontSize: '0.65rem',
          fontWeight: 800,
          background: isValidated ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isValidated ? '#10b981' : 'rgba(255,255,255,0.15)'}`,
          color: isValidated ? '#10b981' : 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em'
        }}>
          {isValidated ? (t ? t('academy.validated_badge') : 'Validated') : (t ? t('academy.knowledge_check') : 'Knowledge Check')}
        </div>
      </div>

      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
        {quiz.question}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {quiz.options.map((option, idx) => {
          const isSelected = selectedOption === idx
          let optionBorder = 'rgba(255,255,255,0.08)'
          let optionBg = 'rgba(255,255,255,0.01)'
          let optionColor = 'rgba(255,255,255,0.7)'

          if (isSelected) {
            optionBorder = color
            optionBg = `rgba(${hexToRgb(color)}, 0.05)`
            optionColor = '#fff'
          }

          if (hasChecked) {
            if (idx === quiz.answerIndex) {
              optionBorder = '#10b981'
              optionBg = 'rgba(16, 185, 129, 0.08)'
              optionColor = '#34d399'
            } else if (isSelected && !isCorrect) {
              optionBorder = '#ef4444'
              optionBg = 'rgba(239, 68, 68, 0.08)'
              optionColor = '#f87171'
            }
          }

          return (
            <button
              key={idx}
              disabled={hasChecked}
              onClick={() => setSelectedOption(idx)}
              style={{
                width: '100%',
                padding: '1.25rem 1.5rem',
                borderRadius: '0.75rem',
                background: optionBg,
                border: `1px solid ${optionBorder}`,
                color: optionColor,
                textAlign: 'left',
                fontSize: '0.95rem',
                fontWeight: isSelected || (hasChecked && idx === quiz.answerIndex) ? 600 : 500,
                cursor: hasChecked ? 'default' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <span>{option}</span>
              {hasChecked && idx === quiz.answerIndex && (
                <CheckCircle2 size={18} style={{ flexShrink: 0, color: '#10b981' }} />
              )}
              {hasChecked && isSelected && !isCorrect && (
                <AlertTriangle size={18} style={{ flexShrink: 0, color: '#ef4444' }} />
              )}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {!hasChecked ? (
          <motion.button
            key="check-btn"
            disabled={selectedOption === null}
            onClick={handleCheckAnswer}
            whileHover={selectedOption !== null ? { scale: 1.02 } : {}}
            whileTap={selectedOption !== null ? { scale: 0.98 } : {}}
            style={{
              padding: '0.85rem 2rem',
              borderRadius: '0.75rem',
              background: selectedOption === null ? 'rgba(255,255,255,0.03)' : '#fff',
              color: selectedOption === null ? 'rgba(255,255,255,0.2)' : '#000',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: selectedOption === null ? 'default' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {t ? t('academy.submit_answer') : 'Submit Answer'}
          </motion.button>
        ) : (
          <motion.div
            key="result-pane"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              padding: '1.5rem',
              background: isCorrect ? 'rgba(16, 185, 129, 0.03)' : 'rgba(239, 68, 68, 0.03)',
              border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}`,
              borderRadius: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isCorrect ? (
                <>
                  <CheckCircle2 size={20} color="#10b981" />
                  <span style={{ fontWeight: 700, color: '#34d399', fontSize: '1rem' }}>{t ? t('academy.correct_msg') : 'Correct Answer! Module Validated.'}</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={20} color="#ef4444" />
                  <span style={{ fontWeight: 700, color: '#f87171', fontSize: '1rem' }}>{t ? t('academy.incorrect_msg') : 'Incorrect Answer. Try again.'}</span>
                </>
              )}
            </div>
            
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>
              {quiz.explanation}
            </p>

            {!isCorrect && (
              <button
                onClick={handleRetry}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  alignSelf: 'flex-start',
                  transition: 'all 0.2s'
                }}
              >
                <RefreshCw size={14} /> {t ? t('academy.retry_question', { defaultValue: 'Retry Question' }) : 'Retry Question'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Academy Component
 * A comprehensive educational interface providing technical modules on engineering subjects.
 * Includes a real-time search system and interactive content panels.
 */
export default function Academy({ initialMode = 'modules' }) {
  const { t } = useTranslation()
  const ACADEMY_DATA = getLocalizedAcademyData(t)
  const [activeTopic, setActiveTopic] = useState(ACADEMY_DATA[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const [viewMode, setViewMode] = useState(() => {
    if (location.pathname === '/assessment') return 'assessment'
    return initialMode
  })

  useEffect(() => {
    if (location.pathname === '/assessment') {
      setViewMode('assessment')
    }
  }, [location.pathname])

  const [validatedTopics, setValidatedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('autospectra_validated_topics')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const handleTopicValidated = (topicId) => {
    if (!validatedTopics.includes(topicId)) {
      const newTopics = [...validatedTopics, topicId]
      setValidatedTopics(newTopics)
      try {
        localStorage.setItem('autospectra_validated_topics', JSON.stringify(newTopics))
      } catch (err) {
        console.error(err)
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filteredData = ACADEMY_DATA.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentData = ACADEMY_DATA.find(d => d.id === activeTopic) || ACADEMY_DATA[0]

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingTop: '100px', position: 'relative', zIndex: 10 }} className="academy-page-wrapper">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }} className="academy-main-container">

        {/* Top Control Bar with Segmented Mode Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.1rem', borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} /> {t('academy.return_hub')}
          </button>

          {/* Segmented Mode Selector */}
          <div style={{ display: 'flex', background: 'rgba(20,24,35,0.8)', padding: '0.35rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <button
              onClick={() => {
                setViewMode('modules')
                if (location.pathname === '/assessment') navigate('/academy')
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.25rem', borderRadius: '0.5rem',
                background: viewMode === 'modules' ? '#3b82f6' : 'transparent',
                border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer',
                fontSize: '0.9rem', transition: 'all 0.2s',
                boxShadow: viewMode === 'modules' ? '0 0 15px rgba(59,130,246,0.3)' : 'none'
              }}
            >
              <BookOpen size={16} />
              <span>Technical Curriculum</span>
            </button>
            <button
              onClick={() => setViewMode('assessment')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 1.25rem', borderRadius: '0.5rem',
                background: viewMode === 'assessment' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'transparent',
                border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer',
                fontSize: '0.9rem', transition: 'all 0.2s',
                boxShadow: viewMode === 'assessment' ? '0 0 15px rgba(239,68,68,0.4)' : 'none'
              }}
            >
              <Award size={16} />
              <span>V8 Builder Assessment</span>
            </button>
          </div>
        </div>

        {viewMode === 'assessment' ? (
          <V8AssessmentHub onBackToModules={() => setViewMode('modules')} />
        ) : (
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {/* Sidebar */}
            <div style={{ width: '100%', maxWidth: '300px', flexShrink: 0 }} className="academy-sidebar-wrapper">
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder={t('academy.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '0.9rem', outline: 'none'
                  }}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="academy-sidebar-list">
                {filteredData.length > 0 ? filteredData.map((topic) => {
                  const Icon = topic.icon
                  const isActive = activeTopic === topic.id
                  const isValidated = validatedTopics.includes(topic.id)
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopic(topic.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '1rem', borderRadius: '0.75rem', cursor: 'pointer',
                        background: isActive ? `rgba(${hexToRgb(topic.color)}, 0.15)` : 'transparent',
                        border: isActive ? `1px solid ${topic.color}` : '1px solid transparent',
                        color: isActive ? topic.color : 'rgba(255,255,255,0.6)',
                        fontWeight: isActive ? 700 : 500,
                        textAlign: 'left', transition: 'all 0.2s',
                        boxShadow: isActive ? `0 0 20px rgba(${hexToRgb(topic.color)}, 0.1)` : 'none'
                      }}
                      className="sidebar-topic-btn"
                    >
                      <Icon size={18} />
                      <span style={{ flexGrow: 1 }}>{topic.title}</span>
                      {isValidated && (
                        <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0 }} />
                      )}
                    </button>
                  )
                }) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                    {t('academy.no_modules')}
                  </div>
                )}
              </div>

              {/* Assessment Promo Card in Sidebar */}
              <div
                onClick={() => setViewMode('assessment')}
                style={{
                  marginTop: '2rem',
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(59,130,246,0.12))',
                  border: '1px solid rgba(239,68,68,0.3)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  <Award size={14} /> V8 Certification
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
                  Take the Builder Exam
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                  Test your knowledge across 5 tiers & earn your engineering certificate.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 700 }}>
                  <span>Launch Assessment</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <motion.div
              key={activeTopic}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 min-w-[250px] p-6 md:p-12 bg-[#14141499] rounded-3xl border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] academy-content-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: `rgba(${hexToRgb(currentData.color)}, 0.2)`, color: currentData.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <currentData.icon size={24} />
                </div>
                <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", margin: 0, color: currentData.color }}>
                  {currentData.title}
                </h1>
              </div>

              <div style={{ lineHeight: 1.8, fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>
                {currentData.content}
              </div>

              {currentData.quiz && (
                <KnowledgeCheck 
                  topicId={currentData.id}
                  quiz={currentData.quiz}
                  color={currentData.color}
                  isValidated={validatedTopics.includes(currentData.id)}
                  onValidate={() => handleTopicValidated(currentData.id)}
                  t={t}
                />
              )}
            </motion.div>
          </div>
        )}

      </div>


      <style>{`
        .study-content .lead-text {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.9);
          border-left: 3px solid #3b82f6;
          padding-left: 1.5rem;
          margin-bottom: 3rem;
          font-style: italic;
          letter-spacing: 0.02em;
        }
        .study-content h3 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #fff;
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.02em;
        }
        .study-content h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.75rem;
        }
        .study-content p {
          margin-bottom: 1.5rem;
          color: rgba(255,255,255,0.7);
        }
        .study-content ul {
          list-style-type: none;
          padding-left: 0;
          margin-bottom: 2.5rem;
        }
        .study-content li {
          background: rgba(255,255,255,0.02);
          padding: 1.25rem 1.5rem;
          border-radius: 0.75rem;
          margin-bottom: 0.75rem;
          border-left: 2px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
        }
        .study-content li strong {
          color: #fff;
          font-weight: 700;
        }
        .study-content strong {
          color: #e2e8f0;
        }
        .formula-box {
          background: rgba(0,0,0,0.4);
          padding: 1.5rem;
          border-radius: 0.75rem;
          font-family: 'Courier New', monospace;
          font-weight: 700;
          font-size: 1.35rem;
          color: #60a5fa;
          text-align: center;
          margin: 2rem 0;
          border: 1px solid rgba(59,130,246,0.3);
          box-shadow: inset 0 0 20px rgba(59,130,246,0.05);
          letter-spacing: 0.05em;
        }
        .pro-tip {
          background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02));
          border-left: 4px solid #10b981;
          padding: 1.5rem;
          border-radius: 0 0.75rem 0.75rem 0;
          margin: 2.5rem 0;
          color: rgba(255,255,255,0.8);
          font-size: 0.95rem;
          line-height: 1.7;
        }
        .pro-tip strong {
          color: #34d399;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.85rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }
        .card-minor {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 1.5rem;
          border-radius: 1rem;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          overflow: hidden;
          margin: 2.5rem 0;
        }
        .stat-item {
          background: rgba(20,20,20,0.9);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.4);
          font-weight: 700;
        }
        .stat-value {
          font-size: 1rem;
          color: #fff;
          font-weight: 600;
        }
        
        .academy-content-card {
          padding: 3rem !important; /* 48px padding for desktop view */
          border-radius: 2rem !important;
        }
        
        .academy-main-container {
          padding: 0 2rem !important;
        }
        
        /* Mobile Layout & Padding Optimizations */
        @media (max-width: 768px) {
          .academy-page-wrapper {
            padding-top: 110px !important;
          }
          .academy-main-container {
            padding: 0 1rem !important;
            gap: 1.5rem !important;
          }
          .academy-sidebar-wrapper {
            max-width: 100% !important;
            margin-bottom: 0.5rem !important;
            display: flex;
            flex-direction: column;
            width: 100%;
          }
          .academy-sidebar-list {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            padding-bottom: 0.75rem !important;
            gap: 0.5rem !important;
            width: 100% !important;
            scrollbar-width: none; /* Firefox */
            -webkit-overflow-scrolling: touch;
          }
          .academy-sidebar-list::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
          }
          .sidebar-topic-btn {
            flex-shrink: 0 !important;
            white-space: nowrap !important;
            padding: 0.75rem 1.25rem !important;
            font-size: 0.85rem !important;
          }
          .academy-content-card {
            padding: 1.5rem !important;
            border-radius: 1.5rem !important;
          }
          .formula-box {
            font-size: 0.95rem !important;
            padding: 1rem !important;
            margin: 1.5rem 0 !important;
            white-space: nowrap;
            overflow-x: auto;
            scrollbar-width: thin;
          }
          .study-content li {
            padding: 1rem !important;
            margin-bottom: 0.5rem !important;
            font-size: 0.9rem !important;
          }
          .pro-tip {
            padding: 1rem !important;
            margin: 1.5rem 0 !important;
            font-size: 0.85rem !important;
          }
          .grid-2 {
            margin: 1.5rem 0 !important;
            gap: 1rem !important;
          }
          .card-minor {
            padding: 1rem !important;
          }
          .study-content h3 {
            font-size: 1.35rem !important;
            margin-top: 2rem !important;
            margin-bottom: 1rem !important;
          }
          .study-content .lead-text {
            font-size: 1rem !important;
            padding-left: 1rem !important;
            margin-bottom: 2rem !important;
          }
          .stat-grid {
            margin: 1.5rem 0 !important;
          }
          .stat-item {
            padding: 0.75rem !important;
          }
          .stat-value {
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  )
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255,255,255';
}
