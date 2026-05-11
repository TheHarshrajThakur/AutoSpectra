import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Droplets, Flame, Cog, Activity, Zap, Wind, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ACADEMY_DATA = [
  {
    id: 'thermodynamics',
    title: 'Thermodynamics',
    icon: Flame,
    color: '#ef4444',
    content: (
      <div className="study-content">
        <p className="lead-text">Thermodynamics governs the fundamental principles of energy conversion in mechanical systems. Understanding thermal efficiency is paramount for designing high-performance internal combustion engines and power plants.</p>

        <h3>1. The Laws of Thermodynamics</h3>
        <p>The foundation of all thermal engineering lies in the four laws, with the First and Second bearing the most significance in power generation.</p>
        <div className="grid-2">
          <div className="card-minor">
            <h4>First Law (Energy Conservation)</h4>
            <p>Energy cannot be created or destroyed, only altered in form.</p>
            <div className="formula-box">ΔU = Q - W</div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Where <strong>ΔU</strong> is change in internal energy, <strong>Q</strong> is heat added, and <strong>W</strong> is work done by the system.</p>
          </div>
          <div className="card-minor">
            <h4>Second Law (Entropy)</h4>
            <p>Total entropy of an isolated system can never decrease over time.</p>
            <div className="formula-box">ΔS ≥ 0</div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>This dictates that no engine can be 100% efficient; heat rejection is an absolute physical requirement.</p>
          </div>
        </div>

        <h3>2. The Carnot Cycle Limit</h3>
        <p>The Carnot cycle establishes the absolute theoretical maximum efficiency for any heat engine operating between two temperatures.</p>
        <div className="pro-tip">
          <strong>Engineer's Note</strong> While real engines use Otto or Diesel cycles, the Carnot efficiency (η = 1 - Tc/Th) dictates that raising combustion temperature (Th) and lowering exhaust temperature (Tc) are the only physical ways to increase maximum theoretical efficiency.
        </div>
      </div>
    )
  },
  {
    id: 'engine-cycles',
    title: 'IC Engine Cycles',
    icon: Activity,
    color: '#f97316',
    content: (
      <div className="study-content">
        <p className="lead-text">Internal Combustion (IC) engines rely on precise thermodynamic cycles to convert chemical potential energy into mechanical kinetic energy.</p>

        <h3>1. The Otto Cycle (Constant Volume Combustion)</h3>
        <p>The standard four-stroke cycle used in modern gasoline engines. It consists of two isentropic processes and two isochoric (constant volume) processes.</p>
        <ul>
          <li><strong>Intake (Isobaric expansion):</strong> Piston descends, drawing in the stoichiometric air-fuel mixture (14.7:1).</li>
          <li><strong>Compression (Isentropic compression):</strong> Piston rises, drastically increasing pressure and temperature while reducing volume.</li>
          <li><strong>Combustion & Power (Isochoric heat addition & Isentropic expansion):</strong> Spark plug fires, causing rapid pressure spike. Expanding gases force the piston down, delivering torque to the crankshaft.</li>
          <li><strong>Exhaust (Isochoric heat rejection & Isobaric compression):</strong> Exhaust valve opens, blowdown occurs, and the rising piston scavenges remaining gases.</li>
        </ul>

        <h3>2. Volumetric Efficiency (VE)</h3>
        <p>A critical metric measuring the actual volume of air-fuel mixture drawn into the cylinder compared to the cylinder's static geometric volume.</p>
        <div className="formula-box">VE = (Actual Mass of Air intake) / (Theoretical Mass) × 100%</div>
        <div className="pro-tip">
          <strong>Performance Tuning</strong> Naturally aspirated engines typically max out at ~85-90% VE. Forced induction (turbos/superchargers) can push VE well over 100%, forcing denser air charges into the combustion chamber.
        </div>
      </div>
    )
  },
  {
    id: 'engine-anatomy',
    title: 'Engine Anatomy',
    icon: Cog,
    color: '#8b5cf6',
    content: (
      <div className="study-content">
        <p className="lead-text">A high-performance engine is a symphony of precision-machined metallurgy, balancing immense dynamic forces and extreme thermal loads.</p>

        <h3>1. The Rotating Assembly</h3>
        <p>The heart of the mechanical conversion process, consisting of the crankshaft, connecting rods, and pistons. These components must withstand thousands of G-forces during operation.</p>
        <div className="stat-grid">
          <div className="stat-item">
            <span className="stat-label">Component</span>
            <span className="stat-value">Piston</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Primary Force</span>
            <span className="stat-value">Thermal / Inertial</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Ideal Material</span>
            <span className="stat-value">Forged 2618 Aluminum</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Component</span>
            <span className="stat-value">Connecting Rod</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Primary Force</span>
            <span className="stat-value">Tensile / Compressive</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Ideal Material</span>
            <span className="stat-value">Forged 4340 Steel / Titanium</span>
          </div>
        </div>

        <h3>2. Valvetrain Dynamics</h3>
        <p>The valvetrain controls the breathing of the engine. High RPM operation introduces the risk of <strong>Valve Float</strong>, where the valve spring fails to close the valve fast enough, causing it to lose contact with the camshaft lobe.</p>
        <div className="pro-tip">
          <strong>Design Consideration</strong> Desmodromic valves (used by Ducati) or pneumatic valve springs (used in F1) completely eliminate valve float, allowing engines to scream past 15,000 RPM reliably.
        </div>
      </div>
    )
  },
  {
    id: 'forced-induction',
    title: 'Forced Induction',
    icon: Wind,
    color: '#06b6d4',
    content: (
      <div className="study-content">
        <p className="lead-text">By artificially increasing the density of the intake air, forced induction allows an engine to burn more fuel and generate exponentially more power.</p>

        <h3>1. Turbocharger Thermodynamics</h3>
        <p>A turbocharger recovers waste thermal energy from the exhaust stream. It acts as an air compressor driven by an exhaust gas turbine.</p>
        <div className="formula-box">P_boost = P_manifold - P_atmospheric</div>
        <p>When air is compressed, its temperature increases dramatically (Ideal Gas Law). This necessitates charge cooling.</p>

        <h3>2. Charge Air Cooling (Intercooling)</h3>
        <p>An intercooler is a heat exchanger used to cool the compressed intake charge. Cooler air is denser (containing more oxygen molecules per volume) and drastically reduces the risk of pre-ignition (engine knock).</p>
        <div className="pro-tip">
          <strong>Thermal Efficiency</strong> Air-to-Water intercoolers offer superior thermal transfer rates and shorter intake tract routing compared to traditional Air-to-Air systems, heavily reducing turbo lag.
        </div>
      </div>
    )
  },
  {
    id: 'fluid-mechanics',
    title: 'Fluid Dynamics',
    icon: Droplets,
    color: '#3b82f6',
    content: (
      <div className="study-content">
        <p className="lead-text">Fluid dynamics governs lubrication, cooling, and aerodynamics—critical factors in mechanical longevity and performance.</p>

        <h3>1. Hydrodynamic Lubrication</h3>
        <p>In engine bearings (like main and rod bearings), the metal surfaces never actually touch. They ride on a micro-thin wedge of pressurized oil.</p>
        <div className="pro-tip">
          <strong>Cavitation Warning</strong> High-RPM oil pumps can suffer from cavitation—where low pressure causes oil to boil into vapor bubbles, imploding and destroying bearing surfaces. Dry sump systems mitigate this by actively scavenging oil.
        </div>

        <h3>2. Intake Port Boundary Layers</h3>
        <p>Air flowing through intake runners experiences drag against the port walls, creating a slow-moving boundary layer. <strong>Port polishing</strong> is often misunderstood; a slightly rough surface (like a golf ball) actually creates micro-turbulence that keeps fuel suspended in the air charge rather than puddling on the walls.</p>
      </div>
    )
  },
  {
    id: 'materials',
    title: 'Material Science',
    icon: BookOpen,
    color: '#10b981',
    content: (
      <div className="study-content">
        <p className="lead-text">The limits of mechanical engineering are strictly defined by metallurgy. Selecting the right alloy is the difference between championship performance and catastrophic failure.</p>

        <h3>1. Forged vs. Cast Metals</h3>
        <div className="grid-2">
          <div className="card-minor">
            <h4 style={{ color: '#f87171' }}>Casting</h4>
            <p>Molten metal poured into a mold. Random, porous grain structure. Brittle under immense shock loads, but inexpensive to mass-produce.</p>
          </div>
          <div className="card-minor">
            <h4 style={{ color: '#34d399' }}>Forging</h4>
            <p>Solid metal stamped under extreme pressure. Aligns the internal grain structure to follow the shape of the part, offering vastly superior tensile strength and fatigue resistance.</p>
          </div>
        </div>

        <h3>2. Exotic Superalloys</h3>
        <ul>
          <li><strong>Inconel:</strong> A nickel-chromium-based superalloy used in exhaust valves and turbocharger turbine wheels. It maintains structural integrity at extreme temperatures where steel would melt.</li>
          <li><strong>Beryllium-Copper:</strong> Used in high-end valve seats for its incredible thermal conductivity, rapidly pulling heat out of the extremely hot exhaust valves and transferring it to the cylinder head cooling jacket.</li>
        </ul>
      </div>
    )
  }
]

/**
 * Academy Component
 * A comprehensive educational interface providing technical modules on engineering subjects.
 * Includes a real-time search system and interactive content panels.
 */
export default function Academy() {
  const [activeTopic, setActiveTopic] = useState(ACADEMY_DATA[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filteredData = ACADEMY_DATA.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentData = ACADEMY_DATA.find(d => d.id === activeTopic) || ACADEMY_DATA[0]

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingTop: '100px', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>

        {/* Sidebar */}
        <div style={{ width: '100%', maxWidth: '300px', flexShrink: 0 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', cursor: 'pointer', fontWeight: 600,
              marginBottom: '2rem', transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} /> Return to Hub
          </button>

          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <input
              type="text"
              placeholder="Search modules..."
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredData.length > 0 ? filteredData.map((topic) => {
              const Icon = topic.icon
              const isActive = activeTopic === topic.id
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
                >
                  <Icon size={18} />
                  {topic.title}
                </button>
              )
            }) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                No modules found
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTopic}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 min-w-[250px] p-6 md:p-12 bg-[#14141499] rounded-3xl border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
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
        </motion.div>

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
