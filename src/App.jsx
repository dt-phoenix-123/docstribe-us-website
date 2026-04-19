import './App.css';
import ExplainerAgent from './components/ExplainerAgent';
import Shakti from './components/Shakti';

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Platform',  href: '#platform' },
  { label: 'Journey',   href: '#journey' },
  { label: 'Outcomes',  href: '#outcomes' },
  { label: 'Contact',   href: '#contact' },
];

const PROOF_STATS = [
  { value: '99%',    label: 'Clean claim rate' },
  { value: '+10%',   label: 'Charge capture uplift' },
  { value: '+0.05',  label: 'CMI uplift per discharge' },
  { value: 'AED 29M–51M', label: 'Projected annual impact' },
];

const SIGNALS = [
  'DRG optimization', 'CC/MCC capture', 'CDI workflows', 'Pre-bill defense',
  'Payer contracts', 'HCC recapture', 'Charge capture', 'Clinical documentation',
  'Inpatient coding', 'LOS monitoring', 'Discharge summary AI', 'DRG downgrade defense',
  'DRG optimization', 'CC/MCC capture', 'CDI workflows', 'Pre-bill defense',
  'Payer contracts', 'HCC recapture', 'Charge capture', 'Clinical documentation',
  'Inpatient coding', 'LOS monitoring', 'Discharge summary AI', 'DRG downgrade defense',
];

const JOURNEY_STAGES = [
  {
    id: 'front-end',
    accentColor: '#00cba8',
    title: 'H&P & Day 0 CDI — The Revenue Clock Starts Here',
    desc: 'The physician writes for clinical communication. The DRG grouper reads for financial classification. That gap is where all revenue leakage lives. Docstribe reads every H&P within minutes — extracting ICD-10 codes, computing the baseline DRG, and firing CDI queries on Day 0, not Day 3.',
    pills: [
      'H&P ingested within minutes of signing',
      'Baseline DRG computed via grouper',
      'CDI queries fired Day 0 — not Day 3',
      'ICD-10 extraction & MDC mapping',
      'DRG delta surfaced: e.g. AED 31K → AED 61K',
    ],
    products: [
      { label: 'CDI ENGINE' },
      { label: 'DRG GROUPER' },
    ],
    layout: 'text-left',
  },
  {
    id: 'mid-cycle',
    accentColor: '#4d8aff',
    title: 'Daily Rounding — DRG Recomputed Every 24 Hours',
    desc: 'Every progress note, lab result, and consult order is a revenue signal. Docstribe recomputes the DRG on every new clinical event — mapping labs to undocumented diagnoses, detecting LOS paradox when your patient outlasts GMLOS, and escalating documentation gaps before the window closes.',
    pills: [
      'DRG recomputed on every clinical signal',
      'Labs & orders mapped to undocumented DX',
      'LOS vs. GMLOS paradox detection',
      'Revenue delta tracked daily: e.g. +AED 15,400',
      'CDI query escalation before rounds close',
    ],
    products: [
      { label: 'LOS MONITOR' },
      { label: 'QUERY ENGINE' },
    ],
    layout: 'text-right',
  },
  {
    id: 'back-end',
    accentColor: '#ff7b4a',
    title: 'Discharge & Coding — Where 40–60% of DRG Value Is Lost',
    desc: 'Forty to sixty percent of DRG revenue is abandoned at the discharge summary. Physicians omit treated conditions. Confirmed diagnoses go unlisted. Docstribe cross-references the entire chart — every note, consult, order, and result — locks the final DRG, and generates a pre-bill defense brief before the claim drops.',
    pills: [
      'Entire chart cross-referenced at discharge',
      'Conditions treated but not listed — flagged',
      'Final DRG locked pre-submission',
      'Payer-specific pre-bill defense brief',
      'Per-physician CDI profile built over time',
    ],
    products: [
      { label: 'DISCHARGE AI' },
      { label: 'PRE-BILL BRIEF' },
    ],
    layout: 'text-left',
  },
];

const FOUNDATION_CARDS = [
  {
    title: 'Reads every clinical document the moment it is signed',
    body: 'H&P, progress notes, consults, labs, imaging orders — all ingested in real time. DRG recomputed on every new signal, not at the end of the stay.',
  },
  {
    title: 'Fires CDI queries on Day 0 — not Day 3',
    body: 'Traditional CDI reviews happen too late. Docstribe catches documentation gaps at admission — when the physician can still clarify, not after discharge when the DRG is already locked.',
  },
  {
    title: 'Prevents 40–60% of revenue lost at the discharge summary',
    body: 'Physicians omit treated conditions. Confirmed diagnoses go unlisted. Docstribe cross-references the entire chart at discharge and locks the correct DRG before the claim drops.',
  },
];

const OUTCOME_CARDS = [
  { value: 'Day 0',  title: 'First CDI query fired',           body: 'Not Day 3. Not at discharge. The revenue clock starts the moment the H&P is signed.' },
  { value: '24h',    title: 'DRG refresh cycle',               body: 'Every progress note, lab, and consult triggers a fresh DRG computation. Revenue delta tracked daily.' },
  { value: '100%',   title: 'Chart coverage at discharge',     body: 'Every note, consult, order, and result cross-referenced before the final DRG is locked.' },
  { value: '40–60%', title: 'Revenue loss prevented at DC',    body: 'The discharge summary is where DRG value dies. Docstribe closes that gap — systematically.' },
];

const CHECKPOINTS = [
  'Week 1: Epic connect, payer contract ingestion, baseline charge capture established',
  'Week 2: AI agents on live charts — missed charges, DRG gaps, HCC opportunities flagged',
  'Week 3: Side-by-side DRG accuracy comparison — charge capture delta per encounter',
  'Week 4: CCR, CMI, and charge capture deltas quantified — go/no-go recommendation',
];

/* ──────────────────────────────────────────────
   SVG ILLUSTRATIONS
   ────────────────────────────────────────────── */

/** Animated hero SVG — rotating rings with orbiting dots */
function HeroSVG() {
  const cx = 310, cy = 310;
  return (
    <svg viewBox="0 0 620 620" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      <defs>
        <radialGradient id="gCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00cba8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#00cba8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4d8aff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#4d8aff" stopOpacity="0" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softglow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Ambient glow pools */}
      <circle cx={cx} cy={cy} r="260" fill="url(#gCenter)" />
      <circle cx={cx} cy={cy} r="190" fill="url(#gBlue)" />

      {/* Outer ring — slow rotation */}
      <g className="ring-outer" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r="258" stroke="rgba(0,203,168,0.18)" strokeWidth="1.5" strokeDasharray="8 6" />
        {[0,45,90,135,180,225,270,315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = cx + 258 * Math.cos(rad);
          const y = cy + 258 * Math.sin(rad);
          const big = i % 2 === 0;
          return (
            <circle key={i} cx={x} cy={y} r={big ? 6 : 3.5}
              fill={big ? '#00cba8' : 'rgba(0,203,168,0.5)'}
              filter={big ? 'url(#glow)' : undefined} />
          );
        })}
      </g>

      {/* Middle ring — reverse */}
      <g className="ring-middle" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r="188" stroke="rgba(77,138,255,0.2)" strokeWidth="1.5" strokeDasharray="5 10" />
        {[22,112,202,292].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = cx + 188 * Math.cos(rad);
          const y = cy + 188 * Math.sin(rad);
          return (
            <circle key={i} cx={x} cy={y} r={5}
              fill="#4d8aff" opacity={0.85}
              filter="url(#glow)" />
          );
        })}
      </g>

      {/* Inner static ring */}
      <circle cx={cx} cy={cy} r="112" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Spoke lines */}
      {[0,60,120,180,240,300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={i} x1={cx} y1={cy}
            x2={cx + 235 * Math.cos(rad)} y2={cy + 235 * Math.sin(rad)}
            stroke="rgba(0,203,168,0.05)" strokeWidth="1" />
        );
      })}

      {/* Central card */}
      <rect x={cx - 130} y={cy - 90} width="260" height="180" rx="22"
        fill="rgba(10,20,16,0.95)"
        stroke="rgba(0,203,168,0.25)" strokeWidth="1.5" />
      {/* Subtle inner glow top */}
      <rect x={cx - 128} y={cy - 88} width="256" height="60" rx="20"
        fill="rgba(0,203,168,0.04)" />

      <text x={cx} y={cy - 52} textAnchor="middle"
        fill="rgba(0,203,168,0.75)" fontSize="10" fontWeight="700"
        fontFamily="Inter, sans-serif" letterSpacing="3">DOCSTRIBE</text>

      <text x={cx} y={cy - 22} textAnchor="middle"
        fill="rgba(240,247,244,0.97)" fontSize="22" fontWeight="800"
        fontFamily="Sora, sans-serif" letterSpacing="-0.8">Living Rulebook</text>

      {/* Divider */}
      <line x1={cx - 100} y1={cy - 4} x2={cx + 100} y2={cy - 4}
        stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

      {/* Three data nodes */}
      {[
        { label: 'H&P',       color: '#00cba8', dimColor: 'rgba(0,203,168,0.1)', borderColor: 'rgba(0,203,168,0.25)' },
        { label: 'DRG AI',   color: '#4d8aff', dimColor: 'rgba(77,138,255,0.1)', borderColor: 'rgba(77,138,255,0.25)' },
        { label: 'Clean Claim', color: '#ff7b4a', dimColor: 'rgba(255,123,74,0.1)', borderColor: 'rgba(255,123,74,0.25)' },
      ].map((node, i) => {
        const nx = cx - 82 + i * 82;
        return (
          <g key={i}>
            <rect x={nx - 33} y={cy + 10} width="66" height="30" rx="8"
              fill={node.dimColor} stroke={node.borderColor} strokeWidth="1" />
            <text x={nx} y={cy + 30} textAnchor="middle"
              fill={node.color} fontSize="10" fontWeight="700" fontFamily="Inter">{node.label}</text>
          </g>
        );
      })}

      {/* Status indicator bottom */}
      <g>
        <circle cx={cx - 8} cy={cy + 60} r="4" fill="#00cba8" filter="url(#glow)" />
        <text x={cx + 4} y={cy + 64} fill="rgba(240,247,244,0.6)"
          fontSize="10" fontWeight="600" fontFamily="Inter">DRG recomputed</text>
      </g>

      {/* ── FLOATING CARDS ── */}

      {/* Top-left — H&P INPUT */}
      <g style={{ animation: 'float-y 6s ease-in-out infinite' }}>
        <rect x="22" y="118" width="158" height="76" rx="14"
          fill="rgba(10,20,16,0.92)" stroke="rgba(0,203,168,0.22)" strokeWidth="1.5" />
        <text x="40" y="143" fill="rgba(0,203,168,0.75)"
          fontSize="9" fontWeight="700" fontFamily="Inter" letterSpacing="2">INPUT — DAY 0</text>
        <text x="40" y="165" fill="rgba(240,247,244,0.95)"
          fontSize="14" fontWeight="800" fontFamily="Sora">H&P Documents</text>
        <circle cx="148" cy="138" r="6" fill="#00cba8" filter="url(#glow)" />
      </g>

      {/* Top-right — CMI UPLIFT stat */}
      <g style={{ animation: 'float-y 9s ease-in-out 2s infinite' }}>
        <rect x="444" y="104" width="152" height="70" rx="14"
          fill="rgba(10,20,16,0.92)" stroke="rgba(77,138,255,0.22)" strokeWidth="1.5" />
        <text x="462" y="128" fill="rgba(77,138,255,0.75)"
          fontSize="9" fontWeight="700" fontFamily="Inter" letterSpacing="2">CMI UPLIFT</text>
        <text x="462" y="154" fill="rgba(240,247,244,0.95)"
          fontSize="20" fontWeight="800" fontFamily="Sora">+0.05</text>
      </g>

      {/* Bottom-right — OUTPUT */}
      <g style={{ animation: 'float-y-rev 7s ease-in-out infinite' }}>
        <rect x="444" y="430" width="152" height="76" rx="14"
          fill="rgba(10,20,16,0.92)" stroke="rgba(255,123,74,0.22)" strokeWidth="1.5" />
        <text x="462" y="455" fill="rgba(255,123,74,0.75)"
          fontSize="9" fontWeight="700" fontFamily="Inter" letterSpacing="2">OUTPUT</text>
        <text x="462" y="478" fill="rgba(240,247,244,0.95)"
          fontSize="14" fontWeight="800" fontFamily="Sora">Clean Claims</text>
        <circle cx="570" cy="450" r="6" fill="#ff7b4a" filter="url(#glow)" />
      </g>

      {/* Bottom-left — CLEAN RATE */}
      <g style={{ animation: 'float-y-rev 8s ease-in-out 1s infinite' }}>
        <rect x="22" y="432" width="152" height="70" rx="14"
          fill="rgba(10,20,16,0.92)" stroke="rgba(0,203,168,0.22)" strokeWidth="1.5" />
        <text x="40" y="456" fill="rgba(0,203,168,0.75)"
          fontSize="9" fontWeight="700" fontFamily="Inter" letterSpacing="2">CLEAN RATE</text>
        <text x="40" y="482" fill="rgba(240,247,244,0.95)"
          fontSize="20" fontWeight="800" fontFamily="Sora">99%</text>
      </g>

      {/* Connecting dotted lines from floating cards to central area */}
      <line x1="180" y1="156" x2={cx - 110} y2={cy - 50}
        stroke="rgba(0,203,168,0.15)" strokeWidth="1" strokeDasharray="5 5" />
      <line x1="444" y1="469" x2={cx + 110} y2={cy + 50}
        stroke="rgba(255,123,74,0.12)" strokeWidth="1" strokeDasharray="5 5" />
    </svg>
  );
}

/* ─── CONTRACT MOCKUP (Front End phone UI) ─── */
function ContractMockupSVG() {
  return (
    <svg viewBox="0 0 310 590" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 310 }}>
      {/* Phone body */}
      <rect x="3" y="3" width="304" height="584" rx="46"
        fill="#111" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5"/>
      {/* Screen */}
      <rect x="13" y="15" width="284" height="560" rx="38" fill="#0b1410"/>
      {/* Notch */}
      <rect x="103" y="15" width="104" height="24" rx="0" fill="#111"/>
      <rect x="113" y="18" width="84" height="16" rx="8" fill="#0b0b0b"/>
      {/* Status bar */}
      <text x="30" y="52" fill="rgba(255,255,255,0.65)" fontSize="12" fontWeight="600" fontFamily="Inter">3:51</text>
      {[0,1,2].map(i => (
        <rect key={i} x={256+i*7} y={40-i*3} width="5" height={8+i*3} rx="1.5"
          fill="rgba(255,255,255,0.65)"/>
      ))}
      {/* App title */}
      <text x="155" y="84" textAnchor="middle" fill="rgba(255,255,255,0.95)"
        fontSize="17" fontWeight="700" fontFamily="Sora">H&P Analysis</text>
      {/* Patient chip */}
      <rect x="28" y="96" width="254" height="42" rx="11"
        fill="rgba(0,203,168,0.1)" stroke="rgba(0,203,168,0.28)" strokeWidth="1"/>
      <text x="46" y="114" fill="rgba(0,203,168,0.75)"
        fontSize="8.5" fontWeight="700" fontFamily="Inter" letterSpacing="1.8">H&P DOCUMENT — DAY 0</text>
      <text x="46" y="130" fill="rgba(255,255,255,0.92)"
        fontSize="11" fontWeight="600" fontFamily="Inter">Jane Doe · Admit: Chest Pain / SOB</text>
      <circle cx="260" cy="117" r="9" fill="rgba(0,203,168,0.15)" stroke="rgba(0,203,168,0.4)" strokeWidth="1"/>
      <path d="M256 117 L259 120 L265 113" stroke="#00cba8" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"/>
      {/* H&P document card */}
      <rect x="28" y="148" width="254" height="196" rx="13"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
      <text x="40" y="170" fill="rgba(255,255,255,0.28)"
        fontSize="8" fontFamily="Inter" letterSpacing="1.2">ASSESSMENT & PLAN — PRINCIPAL DX</text>
      {/* Text lines — highlighted lines = ICD-10 codes extracted */}
      {[
        {w:208, hi:true},  {w:168, hi:false},
        {w:216, hi:false}, {w:188, hi:true},
        {w:202, hi:false}, {w:156, hi:false},
        {w:214, hi:true},  {w:184, hi:false},
        {w:196, hi:false}, {w:148, hi:false},
      ].map((ln, i) => {
        const y = 185 + i * 15;
        return (
          <g key={i}>
            {ln.hi && <rect x="38" y={y - 3} width={ln.w + 4} height="14" rx="3"
              fill="rgba(0,203,168,0.14)"/>}
            <line x1="40" y1={y + 5} x2={40 + ln.w} y2={y + 5}
              stroke={ln.hi ? 'rgba(0,203,168,0.7)' : 'rgba(255,255,255,0.1)'}
              strokeWidth={ln.hi ? 1.5 : 1} strokeLinecap="round"/>
          </g>
        );
      })}
      {/* DRG computed panel */}
      <rect x="28" y="356" width="254" height="168" rx="13"
        fill="rgba(8,18,14,0.9)" stroke="rgba(0,203,168,0.18)" strokeWidth="1"/>
      <text x="44" y="376" fill="rgba(0,203,168,0.7)"
        fontSize="8.5" fontWeight="700" fontFamily="Inter" letterSpacing="1.6">DRG COMPUTED — DELTA SURFACED</text>
      {[
        'DRG 195  →  AED 31,600  (baseline)',
        'DRG 871  →  AED 61,000  (if AKI coded) ✓',
        'CDI Query: AKI — creatinine 3.2 elevated',
        'Query sent to Dr. Smith · Day 0',
      ].map((rule, i) => (
        <g key={i}>
          <rect x="40" y={386 + i * 32} width="230" height="25" rx="7"
            fill={i === 1 ? 'rgba(0,203,168,0.1)' : 'rgba(0,203,168,0.05)'}
            stroke={i === 1 ? 'rgba(0,203,168,0.3)' : 'rgba(0,203,168,0.12)'} strokeWidth="0.8"/>
          <circle cx="52" cy={398.5 + i * 32} r="3.5" fill={i === 1 ? '#00cba8' : 'rgba(0,203,168,0.5)'}/>
          <text x="63" y={402.5 + i * 32} fill={i === 1 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.72)'}
            fontSize="10" fontFamily="Inter">{rule}</text>
        </g>
      ))}
      {/* Bottom stat pill */}
      <rect x="28" y="536" width="180" height="26" rx="8"
        fill="rgba(0,203,168,0.1)" stroke="rgba(0,203,168,0.2)" strokeWidth="0.8"/>
      <circle cx="44" cy="549" r="4" fill="#00cba8"/>
      <text x="54" y="553" fill="rgba(255,255,255,0.82)"
        fontSize="10.5" fontWeight="600" fontFamily="Inter">DRG delta: +AED 29,400 identified</text>
      {/* Home bar */}
      <rect x="113" y="566" width="84" height="4" rx="2" fill="rgba(255,255,255,0.18)"/>
    </svg>
  );
}

/* ─── CLINICAL MOCKUP (Mid Cycle dual-phone) ─── */
function ClinicalMockupSVG() {
  const wItems = [
    { team: 'UM Review',       note: 'Auth gap · Aetna rule 4.2', color: '#00cba8', status: 'URGENT' },
    { team: 'CDI Specialist',  note: 'DRG query — ICD mismatch',  color: '#4d8aff', status: 'OPEN'   },
    { team: 'Coding Review',   note: 'CPT modifier missing',       color: '#4d8aff', status: 'OPEN'   },
    { team: 'Billing',         note: 'Claim clean — release ready',color: 'rgba(255,255,255,0.25)', status: 'READY' },
  ];
  return (
    <svg viewBox="0 0 480 520" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 480 }}>
      {/* ── BACK PHONE (chart / recording) ── */}
      <rect x="6" y="32" width="248" height="452" rx="38"
        fill="#0d1a28" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
      <rect x="16" y="46" width="228" height="424" rx="30" fill="#0a1620"/>
      <text x="34" y="76" fill="rgba(255,255,255,0.38)" fontSize="11" fontFamily="Inter">8:41</text>
      <text x="130" y="104" textAnchor="middle" fill="rgba(255,255,255,0.92)"
        fontSize="14" fontWeight="700" fontFamily="Sora">Jane Doe</text>
      <text x="130" y="120" textAnchor="middle" fill="rgba(255,255,255,0.38)"
        fontSize="9" fontFamily="Inter">Chart Rev · Age 42 · F · Room 209</text>
      {/* Recording bar */}
      <rect x="26" y="130" width="208" height="34" rx="9"
        fill="rgba(77,138,255,0.12)" stroke="rgba(77,138,255,0.22)" strokeWidth="1"/>
      <circle cx="44" cy="147" r="7" fill="rgba(77,138,255,0.85)"/>
      <text x="57" y="151" fill="rgba(255,255,255,0.85)"
        fontSize="10" fontWeight="600" fontFamily="Inter">Recording</text>
      <text x="218" y="151" textAnchor="end" fill="rgba(255,255,255,0.6)"
        fontSize="13" fontWeight="700" fontFamily="Sora">3:47</text>
      {/* Waveform */}
      <rect x="26" y="174" width="208" height="42" rx="7" fill="rgba(255,255,255,0.02)"/>
      {Array.from({length: 22}).map((_, i) => {
        const hs = [14,22,12,28,18,16,26,10,22,18,14,28,20,12,26,16,10,20,14,12,24,18];
        return (
          <rect key={i} x={32 + i * 8.5} y={195 - hs[i]/2} width="5.5" height={hs[i]} rx="2.5"
            fill={`rgba(77,138,255,${0.35 + (i % 4) * 0.12})`}/>
        );
      })}
      {/* ICD/CPT */}
      <text x="26" y="236" fill="rgba(77,138,255,0.65)"
        fontSize="8" fontWeight="700" fontFamily="Inter" letterSpacing="1.6">ICD10 / CPT CODES</text>
      {[
        { code: 'Z87.820', desc: 'TBI history',       hi: true  },
        { code: 'G30.9',   desc: 'Alzheimer\'s',      hi: false },
        { code: '276.451', desc: 'R knee implant',    hi: false },
      ].map((c, i) => (
        <g key={i}>
          <rect x="26" y={246 + i * 36} width="208" height="28" rx="7"
            fill={c.hi ? 'rgba(77,138,255,0.12)' : 'rgba(255,255,255,0.03)'}
            stroke={c.hi ? 'rgba(77,138,255,0.24)' : 'rgba(255,255,255,0.05)'} strokeWidth="0.8"/>
          <text x="40" y={265 + i * 36}
            fill={c.hi ? 'rgba(77,138,255,0.9)' : 'rgba(255,255,255,0.55)'}
            fontSize="10" fontWeight="700" fontFamily="Inter">{c.code}</text>
          <text x="106" y={265 + i * 36} fill="rgba(255,255,255,0.38)"
            fontSize="9" fontFamily="Inter">{c.desc}</text>
        </g>
      ))}
      {/* Back phone home bar */}
      <rect x="96" y="458" width="68" height="3" rx="1.5" fill="rgba(255,255,255,0.14)"/>

      {/* ── FRONT PHONE (routing queue) ── */}
      <rect x="226" y="14" width="248" height="458" rx="38"
        fill="#0f1c12" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5"/>
      <rect x="236" y="28" width="228" height="430" rx="30" fill="#0c1710"/>
      {/* Notch */}
      <rect x="306" y="28" width="88" height="20" rx="0" fill="#0f1c12"/>
      <rect x="316" y="31" width="68" height="12" rx="6" fill="#0a100c"/>
      <text x="252" y="58" fill="rgba(255,255,255,0.38)" fontSize="11" fontFamily="Inter">8:41</text>
      <text x="350" y="88" textAnchor="middle" fill="rgba(255,255,255,0.92)"
        fontSize="14" fontWeight="700" fontFamily="Sora">Workitem Queue</text>
      {wItems.map((item, i) => {
        const isRgba = item.color.startsWith('rgba');
        const statusColor = item.status === 'URGENT' ? 'rgba(255,70,70,0.9)'
          : item.status === 'READY' ? '#00cba8' : 'rgba(77,138,255,0.9)';
        const statusBg = item.status === 'URGENT' ? 'rgba(255,70,70,0.12)'
          : item.status === 'READY' ? 'rgba(0,203,168,0.12)' : 'rgba(77,138,255,0.12)';
        return (
          <g key={i}>
            <rect x="248" y={102 + i * 74} width="208" height="62" rx="11"
              fill="rgba(255,255,255,0.04)"
              stroke={isRgba ? 'rgba(255,255,255,0.06)' : `${item.color}28`} strokeWidth="1"/>
            <rect x="248" y={102 + i * 74} width="4" height="62" rx="2"
              fill={isRgba ? 'rgba(255,255,255,0.12)' : item.color}/>
            <text x="262" y={122 + i * 74} fill="rgba(255,255,255,0.9)"
              fontSize="11" fontWeight="700" fontFamily="Sora">{item.team}</text>
            <text x="262" y={138 + i * 74} fill="rgba(255,255,255,0.4)"
              fontSize="9" fontFamily="Inter">{item.note}</text>
            <rect x="366" y={108 + i * 74} width="82" height="18" rx="5" fill={statusBg}/>
            <text x="407" y={121 + i * 74} textAnchor="middle"
              fill={statusColor} fontSize="8" fontWeight="700" fontFamily="Inter">{item.status}</text>
          </g>
        );
      })}
      {/* Front phone home bar */}
      <rect x="316" y="450" width="68" height="3" rx="1.5" fill="rgba(255,255,255,0.18)"/>
    </svg>
  );
}

/* ─── DENIAL MOCKUP (Back End dashboard) ─── */
function DenialMockupSVG() {
  const rows = [
    { condition: 'AKI — Acute Kidney Injury',   source: 'Lab: Creatinine 3.2',  delta: '+AED 15,400' },
    { condition: 'Protein Malnutrition',         source: 'Consult Note (Dietitian)', delta: '+AED 10,300' },
    { condition: 'CHF Acute Exacerbation',       source: 'Echo Report Day 2',    delta: '+AED 11,400' },
    { condition: 'Hypertensive Crisis',          source: 'Progress Note Day 3',  delta: '+AED 7,000' },
    { condition: 'Septicemia — Blood Culture +', source: 'Micro Report Day 1',   delta: '+AED 29,400' },
  ];
  return (
    <svg viewBox="0 0 540 448" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 540 }}>
      {/* Alert banner */}
      <rect x="48" y="12" width="400" height="54" rx="14"
        fill="rgba(255,123,74,0.1)" stroke="rgba(255,123,74,0.3)" strokeWidth="1.5"/>
      <circle cx="76" cy="39" r="12" fill="rgba(255,123,74,0.18)" stroke="rgba(255,123,74,0.45)" strokeWidth="1"/>
      <text x="73" y="44" textAnchor="middle" fill="rgba(255,123,74,0.9)"
        fontSize="13" fontWeight="700" fontFamily="Sora">!</text>
      <text x="97" y="36" fill="rgba(255,255,255,0.92)"
        fontSize="13" fontWeight="700" fontFamily="Sora">5 Conditions Found — Not Listed</text>
      <text x="97" y="53" fill="rgba(255,123,74,0.75)"
        fontSize="10" fontFamily="Inter">Discharge summary omits treated diagnoses · DRG impact: +AED 73,400</text>

      {/* Main card */}
      <rect x="12" y="76" width="516" height="360" rx="18"
        fill="rgba(8,14,10,0.98)" stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>
      {/* Table header stripe */}
      <rect x="12" y="76" width="516" height="44" rx="18" fill="rgba(255,255,255,0.04)"/>
      <rect x="12" y="98" width="516" height="22" fill="rgba(255,255,255,0.03)"/>
      <text x="52" y="115" fill="rgba(255,255,255,0.32)" fontSize="10" fontWeight="600" fontFamily="Inter">Condition (Treated — Not Listed)</text>
      <text x="310" y="115" fill="rgba(255,255,255,0.32)" fontSize="10" fontWeight="600" fontFamily="Inter">Evidence Source</text>
      <text x="500" y="115" textAnchor="end" fill="rgba(255,123,74,0.6)" fontSize="10" fontWeight="600" fontFamily="Inter">DRG Impact ↑</text>
      {/* Data rows */}
      {rows.map((row, i) => (
        <g key={i}>
          <rect x="12" y={122 + i * 42} width="516" height="42"
            fill={i % 2 === 0 ? 'rgba(255,255,255,0.012)' : 'transparent'}/>
          {/* Flag dot */}
          <circle cx="30" cy={143 + i * 42} r="5" fill="rgba(255,123,74,0.85)"/>
          <text x="44" y={147 + i * 42} fill="rgba(255,255,255,0.88)"
            fontSize="11" fontFamily="Inter">{row.condition}</text>
          <text x="310" y={147 + i * 42} fill="rgba(255,255,255,0.45)"
            fontSize="10" fontFamily="Inter">{row.source}</text>
          <text x="500" y={147 + i * 42} textAnchor="end" fill="#4ade80"
            fontSize="12" fontWeight="700" fontFamily="Sora">{row.delta}</text>
        </g>
      ))}
      {/* Lock Final DRG button */}
      <rect x="340" y="408" width="184" height="44" rx="12"
        fill="linear-gradient(135deg,#ff7b4a,#ff5722)" stroke="none"/>
      <rect x="340" y="408" width="184" height="44" rx="12" fill="#ff7b4a"/>
      <text x="432" y="435" textAnchor="middle" fill="white"
        fontSize="13" fontWeight="700" fontFamily="Sora">Lock Final DRG →</text>
      {/* Cursor */}
      <path d="M504 426 L504 450 L510 443 L515 453 L518 451 L513 441 L521 441 Z"
        fill="white" stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
    </svg>
  );
}

/** SVG for Front End lane */
function FrontEndSVG() {
  return (
    <svg viewBox="0 0 280 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="fe-grad" x1="0" y1="0" x2="280" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(0,203,168,0.08)" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
      <rect width="280" height="130" fill="url(#fe-grad)" />

      {/* Document stack */}
      <rect x="30" y="30" width="80" height="90" rx="8" fill="rgba(0,203,168,0.06)" stroke="rgba(0,203,168,0.2)" strokeWidth="1" />
      <rect x="36" y="22" width="80" height="90" rx="8" fill="rgba(0,203,168,0.06)" stroke="rgba(0,203,168,0.18)" strokeWidth="1" />
      <rect x="42" y="14" width="80" height="90" rx="8" fill="rgba(13,28,23,0.9)" stroke="rgba(0,203,168,0.25)" strokeWidth="1" />
      {/* Doc lines */}
      <line x1="57" y1="36" x2="108" y2="36" stroke="rgba(0,203,168,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="57" y1="48" x2="108" y2="48" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />
      <line x1="57" y1="58" x2="95" y2="58" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeLinecap="round" />
      <line x1="57" y1="68" x2="108" y2="68" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" />
      <line x1="57" y1="78" x2="90" y2="78" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" />
      {/* Badge on doc */}
      <rect x="57" y="88" width="48" height="12" rx="3"
        fill="rgba(0,203,168,0.15)" stroke="rgba(0,203,168,0.3)" strokeWidth="0.8" />
      <text x="81" y="98" textAnchor="middle" fill="rgba(0,203,168,0.9)"
        fontSize="6" fontWeight="700" fontFamily="Inter" letterSpacing="1">CONTRACT</text>

      {/* Arrow */}
      <path d="M 135 65 L 158 65" stroke="rgba(0,203,168,0.4)" strokeWidth="1.5"
        strokeDasharray="4 3" strokeLinecap="round" markerEnd="url(#arr-teal)" />
      <defs>
        <marker id="arr-teal" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill="rgba(0,203,168,0.6)" />
        </marker>
      </defs>

      {/* Rulebook output */}
      <rect x="164" y="32" width="90" height="66" rx="10"
        fill="rgba(13,28,23,0.9)" stroke="rgba(0,203,168,0.22)" strokeWidth="1" />
      <text x="209" y="56" textAnchor="middle" fill="rgba(0,203,168,0.6)"
        fontSize="7" fontWeight="700" fontFamily="Inter" letterSpacing="1">RULEBOOK</text>
      <line x1="178" y1="66" x2="240" y2="66" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Rows */}
      {[74, 82, 90].map((y, i) => (
        <g key={i}>
          <circle cx="183" cy={y} r="2.5" fill={['#00cba8','rgba(0,203,168,0.5)','rgba(0,203,168,0.3)'][i]} />
          <line x1="190" y1={y} x2={230 - i * 8} y2={y}
            stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

/** SVG for Mid Cycle lane */
function MidCycleSVG() {
  return (
    <svg viewBox="0 0 280 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="mc-grad" x1="0" y1="0" x2="280" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(77,138,255,0.08)" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
      <rect width="280" height="130" fill="url(#mc-grad)" />

      {/* Clinical notes card */}
      <rect x="14" y="20" width="110" height="90" rx="10"
        fill="rgba(13,28,23,0.9)" stroke="rgba(77,138,255,0.2)" strokeWidth="1" />
      <text x="69" y="40" textAnchor="middle" fill="rgba(77,138,255,0.7)"
        fontSize="7" fontWeight="700" fontFamily="Inter" letterSpacing="1">CLINICAL</text>
      {/* Bars chart */}
      {[50,70,45,85,60,75].map((h, i) => (
        <rect key={i} x={24 + i * 16} y={110 - h * 0.6} width="10" height={h * 0.6}
          rx="3"
          fill={i === 3 ? 'rgba(77,138,255,0.8)' : 'rgba(77,138,255,0.25)'}
          stroke={i === 3 ? 'rgba(77,138,255,0.4)' : 'none'} strokeWidth="0.8" />
      ))}

      {/* Check icons column */}
      {[48, 68, 88].map((y, i) => (
        <g key={i}>
          <circle cx="145" cy={y} r="9"
            fill={i === 0 ? 'rgba(0,203,168,0.15)' : 'rgba(255,255,255,0.05)'}
            stroke={i === 0 ? 'rgba(0,203,168,0.35)' : 'rgba(255,255,255,0.1)'}
            strokeWidth="1" />
          <text x="145" y={y + 4} textAnchor="middle"
            fill={i === 0 ? '#00cba8' : 'rgba(255,255,255,0.3)'}
            fontSize="9" fontWeight="700" fontFamily="Inter">✓</text>
        </g>
      ))}
      <line x1="145" y1="57" x2="145" y2="59" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="145" y1="77" x2="145" y2="79" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Arrow */}
      <path d="M 165 65 L 185 65" stroke="rgba(77,138,255,0.4)" strokeWidth="1.5"
        strokeDasharray="4 3" strokeLinecap="round" />

      {/* Route card */}
      <rect x="190" y="22" width="76" height="86" rx="10"
        fill="rgba(13,28,23,0.9)" stroke="rgba(77,138,255,0.2)" strokeWidth="1" />
      {['UM','CDI','Code','Bill'].map((label, i) => (
        <g key={i}>
          <rect x="198" y={34 + i * 18} width="60" height="13" rx="4"
            fill={i === 0 ? 'rgba(77,138,255,0.18)' : 'rgba(255,255,255,0.04)'}
            stroke={i === 0 ? 'rgba(77,138,255,0.3)' : 'rgba(255,255,255,0.06)'}
            strokeWidth="0.8" />
          <text x="228" y={34 + i * 18 + 9} textAnchor="middle"
            fill={i === 0 ? 'rgba(77,138,255,0.9)' : 'rgba(255,255,255,0.45)'}
            fontSize="7" fontWeight="700" fontFamily="Inter">{label}</text>
        </g>
      ))}
    </svg>
  );
}

/** SVG for Back End lane */
function BackEndSVG() {
  return (
    <svg viewBox="0 0 280 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="be-grad" x1="0" y1="0" x2="280" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,123,74,0.08)" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
      <rect width="280" height="130" fill="url(#be-grad)" />

      {/* Claim card */}
      <rect x="14" y="22" width="88" height="86" rx="10"
        fill="rgba(13,28,23,0.9)" stroke="rgba(255,123,74,0.2)" strokeWidth="1" />
      <text x="58" y="42" textAnchor="middle" fill="rgba(255,123,74,0.7)"
        fontSize="7" fontWeight="700" fontFamily="Inter" letterSpacing="1">CLAIM</text>
      {/* Status rows */}
      {[
        { label: 'Scored', color: 'rgba(0,203,168,0.7)' },
        { label: 'Checked', color: 'rgba(0,203,168,0.5)' },
        { label: 'Released', color: 'rgba(0,203,168,0.35)' },
      ].map((row, i) => (
        <g key={i}>
          <rect x="22" y={54 + i * 17} width="68" height="12" rx="3"
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
          <circle cx="30" cy={54 + i * 17 + 6} r="3" fill={row.color} />
          <text x="38" y={54 + i * 17 + 9}
            fill="rgba(255,255,255,0.55)"
            fontSize="6.5" fontWeight="600" fontFamily="Inter">{row.label}</text>
        </g>
      ))}

      {/* Circular arrow for loop */}
      <path d="M 136 38 A 32 32 0 1 1 136 92" stroke="rgba(255,123,74,0.4)"
        strokeWidth="1.5" fill="none" strokeDasharray="5 4"
        markerEnd="url(#arr-orange)" />
      <defs>
        <marker id="arr-orange" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill="rgba(255,123,74,0.7)" />
        </marker>
      </defs>
      <text x="136" y="68" textAnchor="middle" fill="rgba(255,123,74,0.6)"
        fontSize="8" fontWeight="700" fontFamily="Inter">LOOP</text>

      {/* ERA / Recovery panel */}
      <rect x="180" y="22" width="86" height="86" rx="10"
        fill="rgba(13,28,23,0.9)" stroke="rgba(255,123,74,0.2)" strokeWidth="1" />
      <text x="223" y="40" textAnchor="middle" fill="rgba(255,123,74,0.7)"
        fontSize="7" fontWeight="700" fontFamily="Inter" letterSpacing="1">REMIT</text>
      {/* ERA rows */}
      {['ERA match', 'Variance', 'Recovery'].map((t, i) => (
        <g key={i}>
          <rect x="188" y={48 + i * 18} width="70" height="13" rx="4"
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
          <text x="223" y={48 + i * 18 + 9} textAnchor="middle"
            fill="rgba(255,255,255,0.55)"
            fontSize="7" fontWeight="600" fontFamily="Inter">{t}</text>
        </g>
      ))}
      {/* Stat at bottom */}
      <text x="223" y="108" textAnchor="middle" fill="rgba(255,123,74,0.8)"
        fontSize="16" fontWeight="800" fontFamily="Sora">AED 103M+</text>
    </svg>
  );
}

/** Pipeline SVG connecting all 6 steps */
function PipelineSVG() {
  const cy = 60;
  const steps = [
    { num: '01', label: 'Contract',  x: 100,  color: '#00cba8', bg: 'rgba(0,203,168,0.14)' },
    { num: '02', label: 'Rulebook',  x: 270, color: '#00cba8', bg: 'rgba(0,203,168,0.08)' },
    { num: '03', label: 'Align',     x: 440, color: '#4d8aff', bg: 'rgba(77,138,255,0.14)' },
    { num: '04', label: 'Route',     x: 610, color: '#4d8aff', bg: 'rgba(77,138,255,0.08)' },
    { num: '05', label: 'Release',   x: 780, color: '#ff7b4a', bg: 'rgba(255,123,74,0.14)' },
    { num: '06', label: 'Recovery',  x: 950, color: '#ff7b4a', bg: 'rgba(255,123,74,0.08)' },
  ];

  const lanes = [
    { x1: 24,  x2: 355, label: 'FRONT END',  fill: 'rgba(0,203,168,0.06)',  stroke: 'rgba(0,203,168,0.2)',  labelColor: '#00cba8' },
    { x1: 365, x2: 695, label: 'MID CYCLE',  fill: 'rgba(77,138,255,0.06)', stroke: 'rgba(77,138,255,0.2)', labelColor: '#4d8aff' },
    { x1: 705, x2: 1032, label: 'BACK END',  fill: 'rgba(255,123,74,0.06)', stroke: 'rgba(255,123,74,0.2)', labelColor: '#ff7b4a' },
  ];

  return (
    <svg viewBox="0 0 1056 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', minWidth: 620 }}>
      <defs>
        <marker id="pipe-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 Z" fill="rgba(255,255,255,0.28)" />
        </marker>
        <filter id="node-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Lane backgrounds */}
      {lanes.map((lane, i) => (
        <g key={i}>
          <rect x={lane.x1} y="4" width={lane.x2 - lane.x1} height="92"
            rx="12" fill={lane.fill} stroke={lane.stroke} strokeWidth="1" />
          <text x={(lane.x1 + lane.x2) / 2} y="19" textAnchor="middle"
            fill={lane.labelColor} fontSize="8.5" fontWeight="700"
            fontFamily="Inter, sans-serif" letterSpacing="2">
            {lane.label}
          </text>
        </g>
      ))}

      {/* Horizontal connector line */}
      <line x1={steps[0].x} y1={cy} x2={steps[steps.length - 1].x} y2={cy}
        stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

      {/* Lane separator dashes */}
      {[360, 700].map((x, i) => (
        <line key={i} x1={x} y1="8" x2={x} y2="92"
          stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="4 4" />
      ))}

      {/* Steps */}
      {steps.map((step, i) => (
        <g key={i}>
          {/* Arrow to next */}
          {i < steps.length - 1 && (
            <line x1={step.x + 28} y1={cy} x2={steps[i+1].x - 28} y2={cy}
              stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"
              markerEnd="url(#pipe-arrow)" />
          )}
          {/* Outer glow ring */}
          <circle cx={step.x} cy={cy} r="26" fill={step.bg} />
          {/* Main circle */}
          <circle cx={step.x} cy={cy} r="24"
            fill="rgba(8,18,14,0.97)"
            stroke={step.color} strokeWidth="2"
            filter="url(#node-glow)" />
          {/* Step number */}
          <text x={step.x} y={cy - 5} textAnchor="middle"
            fill="rgba(255,255,255,0.65)"
            fontSize="8" fontWeight="700" fontFamily="Inter" letterSpacing="1">
            {step.num}
          </text>
          {/* Label */}
          <text x={step.x} y={cy + 8} textAnchor="middle"
            fill={step.color}
            fontSize="9.5" fontWeight="800" fontFamily="Sora, sans-serif">
            {step.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ──────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────── */
export default function App() {
  return (
    <div>

      {/* ── NAV ─────────────────────────────────── */}
      <header className="site-nav">
        <a className="brand" href="#top">
          <div className="brand-mark">D</div>
          <div>
            <span className="brand-name">Docstribe</span>
            <span className="brand-sub">Dynamic DRG Intelligence</span>
          </div>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href}>{l.label}</a>
          ))}
        </nav>

        <a className="nav-cta" href="mailto:akash@docstribe.com?subject=Docstribe Demo">
          Book a demo
        </a>
      </header>

      {/* ── HERO ────────────────────────────────── */}
      <section className="hero" id="top">
        <div className="hero-bg">
          <div className="orb orb-teal" />
          <div className="orb orb-blue" />
          <div className="orb orb-orange" />
        </div>

        <div className="wrap hero-inner">
          {/* Left copy — 60% */}
          <div className="hero-copy">
            <div className="announce-badge">
              <span className="announce-badge-dot" />
              Dynamic DRG Intelligence · Skilled AI for Inpatient Revenue
            </div>

            <h1>
              The AI layer between{' '}
              <span className="hero-highlight">your chart</span>
              {' '}and{' '}
              <span className="grad">your clean claim.</span>
            </h1>

            <p className="hero-tagline">Documentation AI is deployed. Denial AI is deployed against you.</p>

            <p className="hero-desc">
              Revenue integrity AI is the answer. 99% clean claim rate — guaranteed by outcomes.
            </p>

            <div className="hero-actions">
              <a className="btn-primary" href="#journey">
                See the journey →
              </a>
              <a className="btn-secondary" href="mailto:rishav@docstribe.com?subject=Docstribe Pilot">
                Start a pilot
              </a>
            </div>

            <div className="proof-row">
              {PROOF_STATS.map(s => (
                <div className="proof-item" key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right SVG visual — 40% */}
          <div className="hero-visual">
            <div className="hero-svg-wrap">
              <HeroSVG />
            </div>
          </div>
        </div>
      </section>

      {/* ── ANIMATED DIVIDER ─────────────────────── */}
      <div className="hero-divider" aria-hidden="true" />

      {/* ── MARQUEE ─────────────────────────────── */}
      <div className="marquee-section">
        <div className="marquee-label">Built for</div>
        <div className="marquee-track-wrap">
          <div className="marquee-track">
            {SIGNALS.map((s, i) => (
              <span className="marquee-chip" key={i}>
                <span className="marquee-chip-dot" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── JOURNEY (Commure vertical alternating) ── */}
      <section className="journey-section" id="journey">
        <div className="wrap">

          {/* ── Centered header ── */}
          <div className="journey-header">
            <div className="section-eyebrow">Dynamic DRG Intelligence</div>
            <h2 className="journey-section-title">
              AI reads every clinical document.{' '}
              <span className="title-grad">DRG recomputed in real time.</span>
            </h2>
            <p className="journey-section-sub">
              The physician writes for clinical communication. The DRG grouper reads for financial classification.
              That gap is where all revenue leakage lives. Docstribe sits exactly in that gap — from H&P to clean claim.
            </p>
          </div>

          {/* ── Vertical stages ── */}
          <div className="journey-stages">
            {JOURNEY_STAGES.map((stage, i) => (
              <div key={stage.id}>

                {/* Stage row */}
                <div className={`journey-stage${stage.layout === 'text-right' ? ' stage-flip' : ''}`}>

                  {/* Text side */}
                  <div className="stage-text">
                    <h2 className="stage-title">{stage.title}</h2>
                    <p className="stage-desc">{stage.desc}</p>

                    <div className="stage-pills">
                      {stage.pills.map(p => (
                        <span key={p} className="stage-pill">{p}</span>
                      ))}
                    </div>

                    <hr className="stage-divider" />

                    <div className="stage-products">
                      {stage.products.map(p => (
                        <a key={p.label} className="stage-product-btn" href="#contact">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <rect x="1" y="1" width="13" height="13" rx="3"
                              stroke="currentColor" strokeWidth="1.4"/>
                            <circle cx="5" cy="7.5" r="1.4" fill="currentColor"/>
                            <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor"/>
                            <circle cx="10" cy="7.5" r="1.4" fill="currentColor"/>
                          </svg>
                          {p.label} →
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Visual side */}
                  <div className="stage-visual">
                    {stage.id === 'front-end' && <ContractMockupSVG />}
                    {stage.id === 'mid-cycle' && <ClinicalMockupSVG />}
                    {stage.id === 'back-end'  && <DenialMockupSVG />}
                  </div>
                </div>

                {/* ── Connector between stages ── */}
                {i < JOURNEY_STAGES.length - 1 && (
                  <div className="stage-connector-wrap">
                    <svg className="stage-connector-svg" viewBox="0 0 1000 100"
                      fill="none" preserveAspectRatio="none">
                      <defs>
                        <marker id={`arr${i}`} markerWidth="7" markerHeight="7"
                          refX="3.5" refY="3.5" orient="auto">
                          <path d="M0,0 L0,7 L7,3.5 Z" fill="rgba(255,255,255,0.25)"/>
                        </marker>
                      </defs>
                      {/* dot at top */}
                      <circle cx="500" cy="2" r="5" fill="rgba(255,255,255,0.28)"/>
                      {i === 0
                        ? /* Stage 1→2 — bend right */
                          <path d="M500 2 L500 28 L972 28 L972 72 L500 72 L500 100"
                            stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
                            strokeDasharray="8 5" markerEnd={`url(#arr${i})`}/>
                        : /* Stage 2→3 — bend left */
                          <path d="M500 2 L500 28 L28 28 L28 72 L500 72 L500 100"
                            stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
                            strokeDasharray="8 5" markerEnd={`url(#arr${i})`}/>
                      }
                    </svg>
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FOUNDATION / PLATFORM ───────────────── */}
      <section className="section" id="platform">
        <div className="wrap">
          <div className="section-eyebrow">Platform</div>
          <h2 className="section-title" style={{ maxWidth: 680 }}>
            From H&P to clean claim — without a single documentation gap.
          </h2>
          <p className="section-sub">
            The goal is not another CDI dashboard. The goal is to make every clinical document work for the DRG grouper — automatically, from the moment the physician signs.
          </p>

          <div className="foundation-grid">
            {/* Statement card */}
            <div className="statement-card">
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal)' }}>
                  Why this changes the DRG
                </span>
                <h3>AI sits in the gap between the physician and the grouper.</h3>
                <p>Every clinical document carries DRG revenue that physicians never intended to leave behind. Docstribe reads those documents in real time, computes the DRG impact, and fires the right CDI query before the window closes.</p>
              </div>
              <div className="before-after">
                <div className="ba-item">
                  <span className="ba-label ba-label-before">Before</span>
                  <strong>CDI review on Day 3+, discharge summaries with omitted diagnoses, DRG locked too late</strong>
                </div>
                <div className="ba-item">
                  <span className="ba-label ba-label-after">After</span>
                  <strong>Day 0 CDI queries, 24h DRG refresh, 100% chart coverage at discharge</strong>
                </div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="foundation-cards-col">
              {FOUNDATION_CARDS.map((card, i) => (
                <div className="foundation-card" key={i}>
                  <div className="foundation-card-icon">
                    {i === 0 && (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 4h10M4 8h10M4 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                    {i === 1 && (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 3v2M9 13v2M3 9H1M17 9h-2M5.2 5.2 3.8 3.8M14.2 14.2l-1.4-1.4M5.2 12.8l-1.4 1.4M14.2 3.8l-1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    )}
                    {i === 2 && (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3 15V6l6-3 6 3v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="7" y="10" width="4" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    )}
                  </div>
                  <h4>{card.title}</h4>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SHAKTI WORKFLOW ─────────────────────── */}
      <Shakti />

      {/* ── OUTCOMES ────────────────────────────── */}
      <section className="section outcomes-section" id="outcomes">
        <div className="wrap">
          <div className="section-eyebrow">Outcomes</div>
          <h2 className="section-title" style={{ maxWidth: 600 }}>
            The DRG you deserved — but never got — until now.
          </h2>
          <p className="section-sub">
            These are the operating outcomes Docstribe delivers. The same AI that reads the H&P fires the CDI query, tracks the LOS paradox, and locks the final DRG at discharge.
          </p>

          <div className="outcomes-grid">
            {OUTCOME_CARDS.map(card => (
              <div className="outcome-card" key={card.title}>
                <div className="outcome-value">{card.value}</div>
                <div className="outcome-title">{card.title}</div>
                <div className="outcome-body">{card.body}</div>
              </div>
            ))}
          </div>

          <div className="quote-block">
            <span className="quote-mark">"</span>
            <p>
              The physician writes for clinical communication. The DRG grouper reads for financial classification. That gap is where all revenue leakage lives. Docstribe sits exactly in that gap.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section className="cta-section" id="contact">
        <div className="wrap">
          <div className="cta-shell">
            <div className="section-eyebrow" style={{ margin: '0 auto 0' }}>4-Week Pilot</div>
            <h2>Real charts. Real DRGs. Measured impact in 4 weeks.</h2>
            <p>
              Connect Epic, ingest payer contracts, deploy AI agents on live charts. In 4 weeks you get CCR, CMI, and charge capture deltas — quantified to the dollar, per encounter. Zero cost. Outcome-driven decision. If we don't deliver, there's nothing to pay.
            </p>

            <div className="cta-checkpoints">
              {CHECKPOINTS.map((c, i) => (
                <span className="cta-checkpoint" key={i}>{c}</span>
              ))}
            </div>

            <div className="cta-actions">
              <a className="btn-primary" href="mailto:akash@docstribe.com?subject=Docstribe Pilot">
                Start your pilot →
              </a>
              <a className="btn-secondary" href="https://docstribe.health" target="_blank" rel="noreferrer">
                Visit docstribe.health
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI EXPLAINER AGENT ──────────────────── */}
      <ExplainerAgent />

      {/* ── FOOTER ──────────────────────────────── */}
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <div className="footer-brand">
            <strong>Docstribe</strong>
            <span>Dynamic DRG Intelligence. Built for inpatient revenue teams.</span>
          </div>

          <div className="footer-links">
            <a href="mailto:akash@docstribe.com">akash@docstribe.com</a>
            <a href="mailto:rishav@docstribe.com">rishav@docstribe.com</a>
          </div>

          <span className="footer-copy">© 2026 Docstribe</span>
        </div>
      </footer>

    </div>
  );
}
