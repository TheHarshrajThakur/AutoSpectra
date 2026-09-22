/**
 * V8 Engine Builder Assessment Curriculum & Question Bank
 * Comprehensive curriculum covering engine fundamentals through advanced V8 blueprinting,
 * precision machining tolerances, and dyno calibration.
 */

export const V8_TIERS = [
  {
    id: 'tier-1',
    tierNumber: 1,
    title: 'Engine Fundamentals & Geometry',
    level: 'Basics',
    color: '#3b82f6',
    description: 'Thermodynamic cycles, bore x stroke relations, displacement, compression ratio, and piston velocity.'
  },
  {
    id: 'tier-2',
    tierNumber: 2,
    title: 'V8 Architecture, Balancing & Firing Orders',
    level: 'Intermediate',
    color: '#06b6d4',
    description: '90-degree V-block geometry, cross-plane vs. flat-plane crankshafts, counterweighting, and primary/secondary harmonics.'
  },
  {
    id: 'tier-3',
    tierNumber: 3,
    title: 'Valvetrain, Camshafts & Airflow Dynamics',
    level: 'Intermediate-Advanced',
    color: '#8b5cf6',
    description: 'OHV pushrod vs. DOHC configurations, camshaft duration @ 0.050", lift, LSA, valve overlap, and valve float mitigation.'
  },
  {
    id: 'tier-4',
    tierNumber: 4,
    title: 'Precision Machining, Tolerances & Blueprinting',
    level: 'Advanced Engine Building',
    color: '#f59e0b',
    description: 'Bearing oil clearances, piston ring end gaps (NA vs Boost), cylinder honing cross-hatch angles, deck surface RA, and rod bolt stretch.'
  },
  {
    id: 'tier-5',
    tierNumber: 5,
    title: 'Thermodynamics, Forced Induction & Dyno Tuning',
    level: 'Mastery',
    color: '#ef4444',
    description: 'BMEP, stoichiometric vs. power lambda, knock limit, supercharger parasitic drag, intercooler thermal efficiency, and horsepower math.'
  }
];

export const V8_QUESTIONS = [
  // ==========================================
  // TIER 1: ENGINE FUNDAMENTALS & GEOMETRY
  // ==========================================
  {
    id: 'q1',
    tierId: 'tier-1',
    topic: 'Displacement Calculation',
    difficulty: 'Basic',
    formula: 'V_d = (\\pi / 4) \\times \\text{Bore}^2 \\times \\text{Stroke} \\times N',
    question: 'A V8 engine has a cylinder bore of 4.000 inches (101.6 mm) and a crankshaft stroke of 3.480 inches (88.39 mm). What is the total swept engine displacement?',
    options: [
      '302 cubic inches (4.9 Liters)',
      '350 cubic inches (5.7 Liters)',
      '383 cubic inches (6.3 Liters)',
      '427 cubic inches (7.0 Liters)'
    ],
    answerIndex: 1,
    explanation: 'Swept volume per cylinder = (π / 4) × 4.000² × 3.480 = 0.7854 × 16 × 3.480 ≈ 43.73 cu in. For 8 cylinders: 43.73 × 8 = 349.85 cu in (~350 CID / 5.7L), the classic small block V8 geometry.'
  },
  {
    id: 'q2',
    tierId: 'tier-1',
    topic: 'Compression Ratio',
    difficulty: 'Basic',
    formula: 'CR = (V_d + V_c) / V_c',
    question: 'If a single cylinder has a swept volume (Vd) of 750 cc and a total combustion chamber clearance volume (Vc) of 75 cc at Top Dead Center, what is its static compression ratio?',
    options: [
      '10.0:1',
      '11.0:1',
      '12.0:1',
      '9.5:1'
    ],
    answerIndex: 1,
    explanation: 'Static Compression Ratio = (Vd + Vc) / Vc = (750 + 75) / 75 = 825 / 75 = 11.0:1.'
  },
  {
    id: 'q3',
    tierId: 'tier-1',
    topic: 'Piston Mean Speed',
    difficulty: 'Basic-Intermediate',
    formula: 'S_p = 2 \\times \\text{Stroke} \\times \\text{RPM} / 60',
    question: 'An engine with a 3.622-inch (92 mm) stroke revs to 7,000 RPM. What is the mean piston speed, and why is ~25 m/s considered an engineering threshold for production hyper-alloys?',
    options: [
      '15.2 m/s; lubrication breakdown limit',
      '21.5 m/s; structural limit of wrist pin & rod tensile fatigue',
      '28.9 m/s; sonic shockwave ignition in the cylinder',
      '11.8 m/s; catalytic converter melting limit'
    ],
    answerIndex: 1,
    explanation: 'Mean Piston Speed = 2 × 0.092 m × (7000 / 60) ≈ 21.47 m/s. High-performance forged assemblies safely handle 21-25 m/s; past 25-26 m/s, inertial tensile forces at Top Dead Center on exhaust stroke can cause connecting rod or wrist pin fatigue failure.'
  },
  {
    id: 'q4',
    tierId: 'tier-1',
    topic: 'Rod-to-Stroke Ratio',
    difficulty: 'Intermediate',
    formula: 'R_{ratio} = L_{rod} / \\text{Stroke}',
    question: 'How does a higher connecting rod-to-stroke ratio (e.g. 1.75:1 vs. 1.50:1) fundamentally affect piston motion and cylinder wall thrust forces?',
    options: [
      'It increases maximum cylinder wall side-load and accelerates cylinder bore scuffing',
      'It decreases piston dwell time at Top Dead Center, requiring more aggressive ignition timing',
      'It reduces angular rod deflection, diminishing lateral piston skirt thrust and friction against cylinder walls',
      'It eliminates the need for crankshaft counterweights entirely'
    ],
    answerIndex: 2,
    explanation: 'A longer rod for a given stroke reduces the maximum angular tilt of the connecting rod during the power stroke. This substantially decreases the lateral side thrust force pushed against the cylinder wall, lowering frictional losses and bore wear.'
  },

  // ==========================================
  // TIER 2: V8 ARCHITECTURE & BALANCING
  // ==========================================
  {
    id: 'q5',
    tierId: 'tier-2',
    topic: 'Crankshaft Configuration',
    difficulty: 'Intermediate',
    formula: '90^\\circ \\text{ V-Angle} \\implies 720^\\circ / 8 = 90^\\circ \\text{ Firing Interval}',
    question: 'What is the structural and mechanical distinction between a Cross-Plane V8 crankshaft and a Flat-Plane V8 crankshaft?',
    options: [
      'Cross-plane throws are spaced at 180° in one plane; Flat-plane throws are spaced at 90° in perpendicular planes',
      'Cross-plane throws are spaced at 90° across two perpendicular planes; Flat-plane throws are arranged 180° apart in a single flat plane',
      'Cross-plane cranks do not require counterweights, whereas flat-plane cranks require heavy tungsten bobweights',
      'Cross-plane cranks only work with two valves per cylinder'
    ],
    answerIndex: 1,
    explanation: 'In a Cross-plane V8 (traditional American/German luxury V8s), the crankpins are arranged in four 90-degree planes forming a cross. In a Flat-plane V8 (Ferrari, Corvette Z06), crankpins sit 180 degrees apart in a single plane like two inline-4 engines joined together.'
  },
  {
    id: 'q6',
    tierId: 'tier-2',
    topic: 'Harmonics & Balancing',
    difficulty: 'Intermediate-Advanced',
    formula: '\\text{Secondary Imbalance} \\propto \\cos(2\\theta)',
    question: 'Why does a cross-plane V8 have superior secondary balance compared to a flat-plane V8, but require significantly heavier crankshaft counterweights?',
    options: [
      'Cross-plane cranks eliminate secondary shaking couples by staggering piston motions at 90°, but require heavy counterweights to balance 1st-order rotating/reciprocating couples',
      'Flat-plane cranks have perfect secondary balance but suffer from massive torsional crankshaft twist',
      'Cross-plane cranks run at higher RPM where counterweights act as gyroscopic stabilizers',
      'Cross-plane engines fire two cylinders simultaneously on the right bank'
    ],
    answerIndex: 0,
    explanation: 'In a cross-plane V8, piston motion is staggered in 90° increments, inherently canceling out secondary vertical vibration forces. However, this creates an end-to-end rocking couple that requires large counterweights on the outer throws (often with heavy metal/Mallory tungsten).'
  },
  {
    id: 'q7',
    tierId: 'tier-2',
    topic: 'V8 Firing Order & Exhaust Pulses',
    difficulty: 'Intermediate',
    formula: '\\text{Common Firing Order: } 1-8-4-3-6-5-7-2',
    question: 'In a traditional cross-plane V8 with firing order 1-8-4-3-6-5-7-2, why does the exhaust sound have a distinct, burbling rumble?',
    options: [
      'The turbocharger introduces an acoustic fluttering frequency in the downpipe',
      'Two consecutive cylinders in the same bank fire 90 degrees apart (e.g. Cyl 8 then 4, and Cyl 5 then 7), causing uneven exhaust pulse intervals per collector',
      'Because fuel injectors deliver fuel at alternating pressures between left and right banks',
      'Because the intake manifold alternates between wet and dry plenum chambers'
    ],
    answerIndex: 1,
    explanation: 'Cross-plane V8s inevitably fire two cylinders consecutively on the same bank (90 degrees apart). This sends unevenly spaced exhaust pulses into a 4-into-1 header (e.g. 90°-180°-270°-180°), creating the iconic acoustic syncopated burble.'
  },
  {
    id: 'q8',
    tierId: 'tier-2',
    topic: 'Bank Offset & Connecting Rod Journals',
    difficulty: 'Intermediate',
    formula: '\\text{Bank Offset } = \\text{Rod Journal Width} + \\text{Crank Web Thickness}',
    question: 'Why are the cylinder banks of a 90° V8 engine offset longitudinally (one bank slightly forward of the other)?',
    options: [
      'To provide clearance for unequal length intake runners',
      'Because two connecting rods share a single crankpin journal side-by-side, offsetting the cylinder centerlines',
      'To equalize coolant flow between the front and rear cylinders',
      'To balance the steering rack geometry of the vehicle chassis'
    ],
    answerIndex: 1,
    explanation: 'In virtually all production V8 engines, opposing cylinders on the left and right banks share a common crankpin. Because two connecting rods are mounted side-by-side on each journal, the cylinder bores of one bank must be offset forward by the width of one rod big-end plus clearance.'
  },

  // ==========================================
  // TIER 3: VALVETRAIN & AIRFLOW DYNAMICS
  // ==========================================
  {
    id: 'q9',
    tierId: 'tier-3',
    topic: 'Camshaft Duration & Overlap',
    difficulty: 'Intermediate-Advanced',
    formula: '\\text{Overlap} = (\\text{Intake Open BTDC}) + (\\text{Exhaust Close ATDC})',
    question: 'If a camshaft opens the intake valve 28° BTDC and closes the exhaust valve 24° ATDC, what is the valve overlap, and how does excessive overlap affect low-RPM idle stability?',
    options: [
      '4° overlap; causes extreme lean condition at wide open throttle',
      '52° overlap; causes exhaust gas reversion into the intake at low RPM, reducing idle vacuum and stability',
      '26° overlap; increases idle manifold vacuum above 20 in-Hg',
      '104° overlap; causes mechanical piston-to-valve collision at idle'
    ],
    answerIndex: 1,
    explanation: 'Valve Overlap = 28° + 24° = 52°. During overlap, both intake and exhaust valves are open simultaneously. At high RPM, exhaust inertia scavenges fresh charge into the chamber; at low RPM, slow exhaust velocity allows burnt exhaust gases to back-pulse into the intake runner, reducing manifold vacuum and causing a lumpy idle.'
  },
  {
    id: 'q10',
    tierId: 'tier-3',
    topic: 'Valve Float & Spring Resonance',
    difficulty: 'Intermediate-Advanced',
    formula: 'F_{spring} > m_{valvetrain} \\times a_{max}',
    question: 'What dynamic phenomenon causes "valve float" at high engine speeds, and what is the primary engineering remedy in high-RPM performance V8 engines?',
    options: [
      'The oil pump cavitates, dropping hydraulic lifter pressure; remedy is a larger oil pan',
      'Valve assembly inertia overcomes the valve spring return force, causing the lifter to bounce off the cam lobe; remedy is higher seated/open spring load, titanium retainers, or dual springs with friction dampers',
      'The intake charge pressure forces the valve backwards into the port; remedy is smaller throttle bodies',
      'The spark plug spark arc blows open the exhaust valve prematurely'
    ],
    answerIndex: 1,
    explanation: 'As RPM increases, the deceleration force required to control the valve over the nose of the camshaft exceeds the spring force. The valve lifter separates from the cam lobe and bounces on the valve seat. Stiffer dual valve springs, lightweight titanium retainers, and light hollow-stem valves raise the natural resonance frequency to eliminate float.'
  },
  {
    id: 'q11',
    tierId: 'tier-3',
    topic: 'OHV Pushrod vs DOHC Valvetrains',
    difficulty: 'Intermediate',
    formula: '\\text{Mass}_{reciprocating} \\text{ in OHV} \\gg \\text{Mass}_{DOHC}',
    question: 'Why do high-displacement American V8 engines (such as the GM LT / LS series) frequently retain pushrod (OHV) architecture over Double Overhead Cam (DOHC)?',
    options: [
      'OHV engines have superior volumetric efficiency above 8,500 RPM',
      'OHV engines feature significantly more compact exterior package dimensions, lower center of gravity, fewer moving parts, and massive low-end torque',
      'DOHC cylinder heads cannot fit spark plugs on a V8',
      'OHV engines do not require timing chains'
    ],
    answerIndex: 1,
    explanation: 'With a single camshaft nested deep in the engine block and small, compact cylinder heads, an OHV pushrod V8 is vastly smaller in height and width than a DOHC 32-valve V8 of identical displacement. This allows a 6.2L pushrod V8 to fit into tighter engine bays with a lower center of gravity.'
  },

  // ==========================================
  // TIER 4: PRECISION MACHINING & BLUEPRINTING
  // ==========================================
  {
    id: 'q12',
    tierId: 'tier-4',
    topic: 'Main & Rod Bearing Clearances',
    difficulty: 'Advanced',
    formula: '\\text{Rule of Thumb: } 0.0010\" \\text{ per } 1.000\" \\text{ of Journal Diameter}',
    question: 'For a forged steel crankshaft with a 2.100-inch rod journal diameter operating in a high-stress endurance racing V8, what is the ideal hydrodynamic oil clearance range when measuring with a dial bore gauge and micrometer?',
    options: [
      '0.0003\" – 0.0008\" (0.007 – 0.020 mm)',
      '0.0021\" – 0.0026\" (0.053 – 0.066 mm)',
      '0.0065\" – 0.0090\" (0.165 – 0.228 mm)',
      '0.0150\" – 0.0200\" (0.380 – 0.508 mm)'
    ],
    answerIndex: 1,
    explanation: 'Using the fundamental engine building guideline of ~0.0010" per inch of journal diameter: 2.100" × 0.0010" = 0.0021" to 0.0026" (for high RPM and thermal expansion of forged steel/aluminum). Too tight (<0.0015") will cause oil starvation and spun bearings; too loose (>0.0035") will cause excessive oil bleed-off and low pressure.'
  },
  {
    id: 'q13',
    tierId: 'tier-4',
    topic: 'Piston Ring End Gaps for Boosted Applications',
    difficulty: 'Advanced',
    formula: '\\text{Gap}_{top} = \\text{Bore} \\times 0.0055\" \\text{ (NA) vs } \\text{Bore} \\times 0.0070\" \\text{ (Boosted)}',
    question: 'Why must the top compression piston ring end gap be opened up significantly when converting a naturally aspirated V8 to a turbocharged or supercharged build?',
    options: [
      'To allow excessive fuel blow-by into the oil pan to cool the crankshaft',
      'Because higher combustion heat causes greater thermal expansion of the ring; if end gaps butt together, the ring will buckle and shatter the piston ring land',
      'To reduce oil consumption during high-vacuum deceleration',
      'To lower the mechanical compression ratio of the cylinder'
    ],
    answerIndex: 1,
    explanation: 'Forced induction dramatically increases cylinder peak temperatures. The top steel/ductile iron ring expands circumferentially. If the end gap is set too tight for boost, the ring ends butt solid together into a continuous hoop, causing severe cylinder bore gouging or immediate fracture of the piston ring land.'
  },
  {
    id: 'q14',
    tierId: 'tier-4',
    topic: 'Cylinder Honing & Cross-Hatch Angle',
    difficulty: 'Advanced',
    formula: '\\text{Target Angle: } 40^\\circ - 45^\\circ \\text{ Cross-Hatch Intersect}',
    question: 'During final cylinder block machining on a torque-plate-honed V8, why is a 40°–45° plateau cross-hatch angle critical for modern molybdenum/plasma-faced piston rings?',
    options: [
      'It creates deep channels to funnel unburnt hydrocarbons into the catalytic converter',
      'It provides microscopic reservoirs that retain just enough oil to lubricate the ring face while allowing the ring to wipe the bore dry without oil burning',
      'It prevents the piston wrist pin from sliding out of the piston pin boss',
      'It aligns the crystal magnetic field of the cast iron cylinder wall'
    ],
    answerIndex: 1,
    explanation: 'A 40°-45° cross-hatch intersect produces microscopic valleys that store an ultra-thin film of oil for hydrodynamic lubrication of the piston rings. The plateau hone step shears off sharp micro-peaks so the rings seat quickly with minimal wear and optimal gas sealing.'
  },
  {
    id: 'q15',
    tierId: 'tier-4',
    topic: 'Connecting Rod Fastener Preload',
    difficulty: 'Advanced',
    formula: '\\text{Bolt Stretch: } \\Delta L = (F_{clamp} \\times L) / (A \\times E)',
    question: 'Why do elite engine builders measure connecting rod bolt stretch with a rod bolt stretch gauge rather than relying exclusively on a clicker torque wrench?',
    options: [
      'Because torque wrenches cannot fit inside the oil pan',
      'Frictional resistance between bolt threads and under-head flanges varies wildly (up to 30%), whereas bolt stretch directly measures actual clamping preload force',
      'Because stretch gauges measure the hardness of the rod bearing',
      'Because rod bolts are designed to stay completely rigid with zero elongation'
    ],
    answerIndex: 1,
    explanation: 'Friction between threads and bolt heads can consume 80-90% of applied torque. Lube variations produce inconsistent clamping loads. Measuring physical bolt stretch (e.g. 0.0055"–0.0060" elongation on an ARP 2000 bolt) directly measures elastic tensile preload and guarantees true clamping force.'
  },

  // ==========================================
  // TIER 5: THERMODYNAMICS & DYNO TUNING
  // ==========================================
  {
    id: 'q16',
    tierId: 'tier-5',
    topic: 'Horsepower & Torque Relationship',
    difficulty: 'Intermediate',
    formula: '\\text{HP} = (\\text{Torque [lb-ft]} \\times \\text{RPM}) / 5252',
    question: 'On an engine dynamometer graph plotting horsepower and torque (in lb-ft), at what exact engine speed must the two numerical curves always cross on the graph, and why?',
    options: [
      '3,000 RPM; because volumetric efficiency peaks at this speed',
      '5,252 RPM; because 1 Horsepower is mathematically defined as 33,000 ft-lb/min, and 33,000 / (2 × π) ≈ 5252',
      '6,500 RPM; the standard redline of a V8 engine',
      '7,200 RPM; the sonic resonance limit of intake runners'
    ],
    answerIndex: 1,
    explanation: 'Horsepower = (Torque × RPM) / 5252. When RPM = 5252, HP = Torque × (5252 / 5252) = Torque. Therefore, on any dyno graph scaled in standard units (HP and lb-ft), the lines must intersect exactly at 5,252 RPM.'
  },
  {
    id: 'q17',
    tierId: 'tier-5',
    topic: 'Pre-Ignition vs. Detonation (Knock)',
    difficulty: 'Advanced',
    formula: 'P_{peak} \\text{ Detonation Spike} > 200 \\text{ BAR in } < 0.1 \\text{ ms}',
    question: 'What is the critical mechanical distinction between pre-ignition and detonation (engine knock)?',
    options: [
      'Pre-ignition is caused by cold spark plugs; detonation is caused by hot oil',
      'Pre-ignition is premature ignition of the charge BEFORE the spark plug fires (from hot spots/glowing carbon); detonation is uncontrolled auto-ignition of the remaining unburnt end-gas AFTER spark ignition',
      'Detonation only occurs on the exhaust stroke; pre-ignition only occurs on the intake stroke',
      'There is no difference; they are interchangeable terms for the same event'
    ],
    answerIndex: 1,
    explanation: 'Pre-ignition is ignition prior to the spark plug firing, caused by a glowing carbon deposit or overheated exhaust valve—this causes catastrophic rapid cylinder pressure buildup while the piston is still rising. Detonation occurs when the advancing flame front from the spark plug compresses and heats the remaining unburnt "end-gas" until it spontaneously explodes at sonic velocities.'
  },
  {
    id: 'q18',
    tierId: 'tier-5',
    topic: 'Air-Fuel Ratio & Lambda Tuning',
    difficulty: 'Advanced',
    formula: '\\lambda = \\text{Actual AFR} / \\text{Stoichiometric AFR} \\ (\\text{Gasoline: 14.7:1})',
    question: 'On a supercharged 6.2L V8 running 14 PSI (0.96 bar) of boost on pump premium fuel, what is the ideal target Wideband Lambda (AFR) at peak torque to prevent detonation and maintain exhaust gas temperature safety?',
    options: [
      'Lambda 1.05 (15.4:1 AFR — Lean burn)',
      'Lambda 1.00 (14.7:1 AFR — Stoichiometric)',
      'Lambda 0.78 – 0.82 (11.5:1 – 12.0:1 AFR — Rich for charge cooling & flame speed)',
      'Lambda 0.60 (8.8:1 AFR — Flooded mixture)'
    ],
    answerIndex: 2,
    explanation: 'Under forced induction boost, excess gasoline acts as a vital in-cylinder chemical coolant. A rich Lambda of 0.78 to 0.82 (approx 11.5:1 to 12.0:1 AFR on gasoline) maximizes flame velocity, lowers combustion temperatures, and dramatically suppresses detonation tendencies.'
  },
  {
    id: 'q19',
    tierId: 'tier-5',
    topic: 'Brake Mean Effective Pressure (BMEP)',
    difficulty: 'Mastery',
    formula: '\\text{BMEP [psi]} = (150.8 \\times \\text{Torque [lb-ft]}) / \\text{Displacement [cu in]}',
    question: 'A 5.0L (305 cu in) V8 produces 400 lb-ft of torque at 4,800 RPM. What is its Brake Mean Effective Pressure (BMEP), and what does this metric evaluate?',
    options: [
      '~198 psi; it measures the average theoretical pressure exerted on piston crowns throughout the power stroke, independent of engine displacement',
      '~450 psi; it measures fuel rail injection pressure',
      '~85 psi; it measures crankcase vacuum pressure',
      '~305 psi; it matches the cubic inch displacement exactly'
    ],
    answerIndex: 0,
    explanation: 'BMEP = (150.8 × 400) / 305 ≈ 197.8 psi. BMEP is the ultimate indicator of engine efficiency—it represents the average effective cylinder pressure pushing on the pistons regardless of whether the engine is a 2.0L 4-cylinder or a 6.2L V8.'
  },
  {
    id: 'q20',
    tierId: 'tier-5',
    topic: 'Supercharger Parasitic Loss vs. Intercooling',
    difficulty: 'Mastery',
    formula: 'P_{parasitic} = \\tau_{drive} \\times \\omega',
    question: 'A positive displacement Roots/Twin-Screw supercharger on a V8 consumes 80 HP of crankshaft mechanical power at 6,500 RPM to compress intake air. Why is an air-to-water intercooler placed inside the intake manifold plenum directly beneath the supercharger rotors?',
    options: [
      'To warm the intake air so fuel evaporates instantly',
      'Compressing air heats it adiabatically (often exceeding 120°C / 250°F); the intercooler immediately strips thermal energy before cylinder entry to restore oxygen density and prevent immediate engine knock',
      'To lubricate the supercharger lobes with condensed moisture',
      'To muffle the supercharger whine to meet legal sound ordinances'
    ],
    answerIndex: 1,
    explanation: 'Adiabatic air compression generates massive heat (Gay-Lussac and Charles laws). Hot air has lower density (fewer oxygen molecules) and promotes premature detonation. Placing a compact water-to-air core directly beneath the rotors inside the V-valley cools charge air by 50-80°C before entering the intake ports.'
  }
];

export const V8_RANKS = [
  {
    minScore: 90,
    rank: 'Master V8 Engine Builder & Calibrator',
    grade: 'A1 Master Guild',
    badgeColor: '#3b82f6',
    titleColor: '#60a5fa',
    summary: 'Exceptional mastery across all disciplines of engine geometry, V8 architecture, precision blueprinting tolerances, and advanced thermodynamic calibration.'
  },
  {
    minScore: 75,
    rank: 'Senior Powertrain Development Specialist',
    grade: 'Grade A2 Specialist',
    badgeColor: '#10b981',
    titleColor: '#34d399',
    summary: 'Strong comprehensive engineering aptitude. Proficient in V8 assembly clearances, dynamic harmonics, and airflow calibration.'
  },
  {
    minScore: 60,
    rank: 'Certified Engine Assembly Technician',
    grade: 'Grade B1 Certified',
    badgeColor: '#f59e0b',
    titleColor: '#fbbf24',
    summary: 'Solid foundational understanding of engine cycles and mechanical parts. Minor refinement needed in precision tolerance measurement and dyno science.'
  },
  {
    minScore: 0,
    rank: 'Apprentice Engine Assembler',
    grade: 'Apprentice Tier',
    badgeColor: '#ef4444',
    titleColor: '#f87171',
    summary: 'Fundamental principles established. Recommended to review V8 cross-plane mechanics, bearing clearance math, and valvetrain geometry.'
  }
];

export const getQuestionsByTier = (tierId) => {
  return V8_QUESTIONS.filter(q => q.tierId === tierId);
};

export const getRandomExamQuestions = (count = 15) => {
  const shuffled = [...V8_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, V8_QUESTIONS.length));
};

export const getRankForScore = (percentage) => {
  for (const rank of V8_RANKS) {
    if (percentage >= rank.minScore) {
      return rank;
    }
  }
  return V8_RANKS[V8_RANKS.length - 1];
};

