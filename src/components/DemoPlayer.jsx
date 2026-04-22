/**
 * DemoPlayer — Docstribe Board Demo
 * 11 scenes · one focal element at a time · VO synced with screen numbers
 * Board-level sales demo — ICD-10-CM · UAE · 60-day guarantee
 */

import { useState, useRef, useEffect, useCallback, Fragment } from 'react';

/* ─── CountUp ────────────────────────────────────────────────── */
function CountUp({ value, duration = 1100 }) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    setDisplay('');
    const v = String(value || '');
    const isNum = /^[+↑↓]?[\d.,]+[%KMd]?$/.test(v.trim());
    if (!isNum) {
      let i = 0;
      const iv = setInterval(() => { i++; setDisplay(v.slice(0, i)); if (i >= v.length) clearInterval(iv); }, 50);
      return () => clearInterval(iv);
    }
    const end = parseFloat(v.replace(/[^0-9.]/g, '')) || 0;
    const prefix = v.match(/^[+↑↓↓]/)?.[0] || '';
    const suffix = v.match(/[%KMd]+$/)?.[0] || '';
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const n = end * e;
      setDisplay(`${prefix}${n < 10 ? n.toFixed(2) : Math.round(n)}${suffix}`);
      if (p < 1) requestAnimationFrame(tick); else setDisplay(v);
    };
    requestAnimationFrame(tick);
  }, [value, duration]);
  return <>{display}</>;
}

/* ─── b64 WAV → ArrayBuffer ─────────────────────────────────── */
function b64ToArrayBuffer(b64) {
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return bytes.buffer.slice(0);
}

/* ─── Design tokens ─────────────────────────────────────────── */
const TEAL   = '#00a389';  // deepened slightly for light-bg contrast
const BLUE   = '#f8fafc';  // light surface (was dark #0d1526)
const AMBER  = '#d97706';  // deepened for light-bg contrast
const RED    = '#dc2626';
const GREEN  = '#059669';
const PURPLE = '#7c3aed';
const INDIGO = '#3b6fd4';  // deepened slightly for light-bg contrast
const TXT    = '#0f172a';  // dark slate (was light #e2e8f0)
const DIM    = '#475569';  // medium-dark (was light-muted #94a3b8)
const MUTED  = '#64748b';  // subdued (was very dark #475569)
const BORDER = 'rgba(0,0,0,0.09)';  // subtle dark border (was white)

/* ─── Spotlight: is this element the current focal point? ────── */
const spot = (p, from, to = Math.min(from + 0.20, 1)) => p >= from && p <= to;

/* ─── Glow card style — cinematic multi-layer ───────────────── */
function glow(active, color, extra = {}) {
  return {
    transition: 'all 0.55s cubic-bezier(0.34,1.2,0.64,1)',
    transform: active ? 'scale(1.035)' : 'scale(1)',
    border: active ? `1px solid ${color}80` : `1px solid rgba(0,0,0,0.09)`,
    boxShadow: active
      ? `0 0 0 1px ${color}20, 0 0 18px ${color}28, 0 0 40px ${color}12, 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 ${color}25`
      : '0 2px 8px rgba(0,0,0,0.08)',
    background: active
      ? `linear-gradient(135deg, ${color}14, ${color}06)`
      : 'rgba(255,255,255,0.80)',
    ...extra,
  };
}

/* ─── Split VO into sentences ────────────────────────────────── */
function splitSentences(text) {
  return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 3);
}

/* ─── Caption highlight: teal + bold + underline key terms ───── */
function highlightCaption(text) {
  if (!text) return null;
  // Split on key terms — capturing group keeps the matched parts at odd indices
  const pattern = /(twelve to eighteen|sixty to seventy|thirty percent|twenty-five percent|zero point fifteen|sixty.?day|one point four million|eighteen thousand four hundred|two hundred fourteen|four hundred twenty|one thousand nine hundred|ninety-one thousand|twenty-eight thousand five hundred|zero point nine four|one point three four|zero leakage|per payor.?per batch|personalized intelligence|built for you|one click to submit|one click|order entry|zero manual entry|CARC \d+|ICD-10-CM|NABIDH|DHA|IR-DRG weight|IR-DRG|CMI|NCCI|MUE|Docstribe|guaranteed|Nephrology referral|Nephrology|Jardiance|HbA1c|CDI query|referral|three actions|nothing missed|\d+(?:\.\d+)?%)/gi;
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <span key={i} style={{ color: TEAL, fontWeight: 900, textDecoration: 'underline', textUnderlineOffset: '3px' }}>{part}</span>
      : part
  );
}

/* ══════════════════ SCENE DATA ═════════════════════════════════ */
// 7 scenes — trimmed for 2:30 board demo
// Scenes 3, 5, 9, 11 removed; 5+6 merged into Clinical Intelligence; 8+9 merged into Denial & Recovery
const SCENES = [
  {
    id: 1, type: 'stat', color: TEAL,
    title: 'The Revenue Gap',
    vo: "In the UAE — twelve to eighteen percent of hospital claims are denied on first submission. That is three point five million dirhams in avoidable revenue loss per facility every year. World-class systems stay below five percent. Sixty-five percent of those denials are entirely preventable — caught before the claim ever leaves the building. Four root causes. Clinical documentation gaps. Missing authorizations. Coding errors. Claim edits that slip through unchecked. Eighty-seven percent of it is addressable. Someone has to close all four.",
    beats: [
      { at: 0.04, stat: '12–18%',       sub: 'UAE hospital claims denied on first submission' },
      { at: 0.38, stat: '60–70%',       sub: 'of those denials entirely preventable' },
      { at: 0.56, stat: '4 Gap Types',  sub: 'documentation · auth · coding · claim edits' },
      { at: 0.88, stat: 'Someone has to close.', sub: 'Docstribe is built precisely to solve all four.' },
    ],
  },
  {
    id: 2, type: 'kpi', color: TEAL,
    title: 'Introducing Docstribe',
    vo: "Docstribe is purpose-built to close this gap. Built by doctors with more than thirty years of grounded clinical experience — not software engineers guessing at medicine. A hundred hospitals. Ten million patient lives. This is a clinician-built intelligence engine. Denials drop by thirty percent. Clean claim rates reach ninety-nine percent. Case mix index rises by point fifteen. Sixty days. Contractually guaranteed.",
    beats: [
      { at: 0.04, stat: 'Docstribe',      sub: 'Clinical intelligence · clinician-built' },
      { at: 0.22, stat: '100+ Hospitals', sub: 'US · UAE · India · live deployments' },
      { at: 0.40, stat: '10M+ Lives',     sub: 'Patient population managed globally' },
      { at: 0.64, stat: '↓30% Denials',  sub: '60 days · contractually guaranteed' },
      { at: 0.73, stat: '99% Clean Rate', sub: 'first-pass claim submission' },
      { at: 0.83, stat: '+0.15',          sub: 'CMI · case mix index improvement · 60 days' },
    ],
  },
  {
    id: 4, type: 'product', color: GREEN,
    title: 'Pre-Visit Intelligence',
    breadcrumb: 'Eligibility & Pre-Authorisation',
    vo: "The moment a patient walks through your door, Docstribe is already running — connected through your hospital's existing payer API contracts. Coverage tier, co-pay, network status, active authorisations — all pulled live, before the patient reaches the consultation desk. No new payer contracts. No replacement systems. Just real-time eligibility through the APIs you already have.",
    beats: [
      { at: 0.10, stat: 'Profile mapped',  sub: 'coverage · co-pay · network · authorisations · live' },
      { at: 0.36, stat: 'Eligible ✓',      sub: 'Daman Enhanced · co-pay AED 25 · In-network' },
      { at: 0.62, stat: 'All confirmed',    sub: 'before they reach the consultation desk' },
      { at: 0.85, stat: 'Zero admin.',      sub: 'no calls · no lookups · no surprises' },
    ],
  },
  {
    id: 6, type: 'product', color: AMBER,
    title: 'Clinical Intelligence',
    breadcrumb: 'Ambient Scribe · CDI',
    vo: "While the doctor sees the patient, Docstribe is already working. Three signals mapped. Three gaps found. A Nephrology referral — not yet ordered. Jardiance — not yet prescribed. A follow-up HbA1c — not scheduled. The physician acts on each — one click, three actions captured before the patient leaves the room. Then the CDI query fires: is this diabetes controlled or uncontrolled? The physician responds in five seconds. The code corrects. Four thousand two hundred dirhams — captured right there, at point of care.",
    beats: [
      { at: 0.06, stat: 'Listens live',          sub: 'physician-patient encounter · ambient · passive' },
      { at: 0.28, stat: 'Holistic profile built', sub: 'risk · next steps · codes · governance · real time' },
      { at: 0.54, stat: 'CDI query auto-raised',  sub: 'gap detected · physician answers in real time' },
      { at: 0.78, stat: 'Charge capture ↑',       sub: 'documentation tightened · at point of care' },
    ],
  },
  {
    id: 7, type: 'product', color: PURPLE,
    title: 'AI-Powered Coding',
    breadcrumb: 'ICD-10-CM · Smart Coding Engine',
    vo: "Every diagnosis carries an ICD code. Every procedure, a CPT. Docstribe generates both automatically — zero manual entry. Together they drive your IR-DRG weight — the multiplier that decides what your hospital gets paid per admission. Every code is validated through NCCI and MUE checks. One click to submit. The weight lifts from zero point nine four to one point three four. Eighteen thousand four hundred dirhams — per case. That is what nothing missed looks like.",
    beats: [
      { at: 0.08, stat: 'NCCI + MUE applied',    sub: 'payer edits matched · codes validated before send' },
      { at: 0.36, stat: 'CC/MCC auto-captured',  sub: 'every complication documented before discharge' },
      { at: 0.60, stat: 'IR-DRG confirmed',       sub: 'DRG weight locked · before patient leaves' },
      { at: 0.86, stat: 'Uplift per case',        sub: 'DRG 0.94 → 1.34 · real-time · every admission' },
    ],
  },
  {
    id: 8, type: 'product', color: RED,
    title: 'Denial Prevention & Recovery',
    breadcrumb: 'Payer Contract Intelligence · Appeal Generator',
    // Merged denial intel + one-click recovery
    vo: "It doesn't stop here. We go deeper — into every payer's contract, every batch, every rule. Denials have patterns, and Docstribe maps every one of them. Between sixty-seven and ninety-one percent of what would be denied is caught and corrected before the claim goes out. And when one does slip through, a single click pulls the contract, matches the clause, and drafts the appeal. Thirty seconds — not three weeks.",
    beats: [
      { at: 0.08, stat: 'Per payer · per batch', sub: 'Daman · Thiqa · AXA Gulf · Oman Insurance' },
      { at: 0.46, stat: '67–91% recoverable',    sub: 'pre-submission · flagged before send' },
      { at: 0.70, stat: '1-click appeal',         sub: 'contract read · clause matched · letter built' },
      { at: 0.90, stat: '✅ 30 seconds',          sub: 'AED 1,900 recovered · vs. 3 weeks manual' },
    ],
  },
  {
    id: 10, type: 'product', color: INDIGO,
    title: 'Clinical Engagement & Closing',
    breadcrumb: 'Service Line Growth · Clinical Engagement',
    // Folds in closing sentiment from removed scene 11
    vo: "Four alerts. Surfaced automatically. Not from a template — from learning your hospital's case mix, your payer contracts, your denial patterns. Every department. Every physician. Every claim makes it sharper. Generic AI misses what is uniquely yours. The question worth asking: what revenue is your hospital not seeing right now?",
    beats: [
      { at: 0.10, stat: 'Ops queue · live',      sub: 'clinical signals → revenue action · Day Zero' },
      { at: 0.32, stat: '4 alerts · now',         sub: 'Respiratory · Cardiology · Neurology · Oncology' },
      { at: 0.54, stat: 'Not generic.',            sub: 'learns your case mix · your payer contracts · your physicians' },
      { at: 0.76, stat: 'What are you missing?',  sub: 'revenue your current system cannot see' },
    ],
  },
];

/* ─── PatientProfileCard — progressive cinematic reveal with clinical governance ─ */
function PatientProfileCard({ patient, progress, showFrom = 0 }) {
  const {
    name, initials, age, type, dept, mrn, payer, payerPlan,
    risk, diagnoses, vitals, governance, financial, aiProfile,
  } = patient;
  const riskColor = risk === 'CRITICAL' ? RED : risk === 'HIGH' ? AMBER : risk === 'MED' ? INDIGO : GREEN;

  if (progress < showFrom) return null;
  const r = progress - showFrom;

  // Each section of the card reveals at staggered intervals
  const showIdentity   = r >= 0;
  const showDiagnoses  = r >= 0.04;
  const showGovernance = r >= 0.09;
  const showProtocol   = r >= 0.13;
  const showAI         = r >= 0.17;

  // Governance section glows when it first appears
  const govActive = r >= 0.09 && r <= 0.22;
  // AI section glows when it first appears
  const aiActive  = r >= 0.17 && r <= 0.28;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      border: `1px solid ${riskColor}30`,
      borderRadius: 12, padding: '9px 13px',
      animation: 'dpSpringIn 0.55s cubic-bezier(0.34,1.4,0.64,1) both',
      flexShrink: 0,
      boxShadow: `0 0 0 1px ${riskColor}08, 0 4px 16px rgba(0,0,0,0.08)`,
      transition: 'border-color 0.4s ease',
    }}>

      {/* ── Row 1: Identity — appears immediately ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: showDiagnoses ? 7 : 0 }}>
        {/* Avatar */}
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${riskColor}20`, border: `2px solid ${riskColor}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 10px ${riskColor}30` }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: riskColor }}>{initials}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: TXT }}>{name}</span>
            <Pill text={type} color={type === 'OPD' ? INDIGO : type === 'IPD' ? TEAL : RED} size={7} />
            <span style={{ fontSize: 7, color: MUTED }}>{age} · {dept}</span>
          </div>
          <div style={{ fontSize: 7, color: MUTED, marginTop: 1 }}>MRN: {mrn} · {payer} {payerPlan}</div>
        </div>
        {/* AI Risk — highlighted with pulse on appear */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 6, color: MUTED, letterSpacing: 0.5, marginBottom: 1 }}>AI RISK</div>
          <div style={{ fontSize: 9, fontWeight: 900, color: riskColor, background: `${riskColor}18`, border: `1px solid ${riskColor}40`, borderRadius: 5, padding: '2px 7px', boxShadow: r < 0.06 ? `0 0 14px ${riskColor}60` : 'none', transition: 'box-shadow 0.8s ease' }}>{risk}</div>
        </div>
        {/* Financial stake */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 6, color: MUTED, letterSpacing: 0.5, marginBottom: 1 }}>AT STAKE</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: riskColor, fontFamily: 'Sora', letterSpacing: -0.5 }}>{financial.pending}</div>
        </div>
      </div>

      {/* ── Row 2: Diagnoses + vitals chips — staggered entry ── */}
      {showDiagnoses && (
        <div style={{ display: 'flex', gap: 5, marginBottom: 7, flexWrap: 'wrap', animation: 'dpRowBlurIn 0.45s ease both' }}>
          {diagnoses.map((d, i) => (
            <span key={i} style={{ fontSize: 7, fontWeight: 700, color: d.col, background: `${d.col}10`, border: `1px solid ${d.col}${r < 0.10 ? '45' : '25'}`, borderRadius: 4, padding: '2px 6px', boxShadow: r < 0.10 ? `0 0 8px ${d.col}30` : 'none', transition: 'box-shadow 0.8s ease, border-color 0.6s ease' }}>{d.code} · {d.label}</span>
          ))}
          {vitals.map((v, i) => (
            <span key={i} style={{ fontSize: 7, color: v.col, background: `${v.col}08`, border: `1px solid ${v.col}18`, borderRadius: 4, padding: '2px 5px', animation: `dpSpringIn 0.4s ease ${i * 0.06}s both` }}>{v.label}: <b style={{ color: v.col }}>{v.value}</b></span>
          ))}
        </div>
      )}

      {/* ── Row 3: Clinical Governance — glows when first active ── */}
      {showGovernance && (
        <div style={{
          background: govActive ? `linear-gradient(135deg,${TEAL}14,${INDIGO}09)` : 'rgba(0,0,0,0.04)',
          border: `1px solid ${govActive ? `${TEAL}45` : BORDER}`,
          borderRadius: 8, padding: '7px 10px', marginBottom: 6,
          boxShadow: govActive ? `0 0 20px ${TEAL}18, inset 0 0 12px ${TEAL}08` : 'none',
          transition: 'all 0.7s ease',
          animation: 'dpSpringIn 0.5s ease both',
        }}>
          <div style={{ fontSize: 6, fontWeight: 700, color: govActive ? TEAL : `${TEAL}70`, letterSpacing: 1.2, marginBottom: 5, textTransform: 'uppercase', transition: 'color 0.5s ease' }}>
            ◆ Clinical Governance
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Compliance badges — each one glows briefly on entry */}
            <div style={{ display: 'flex', gap: 4 }}>
              {[['NABIDH', INDIGO, governance.nabidh, 0], ['DHA', TEAL, governance.dha, 0.04], ['JAWDA', GREEN, governance.jawda, 0.08], ['Audit Ready', AMBER, governance.auditReady, 0.12]].map(([l, c, on, d]) => on ? (
                <span key={l} style={{ fontSize: 6, fontWeight: 800, color: c, background: `${c}${govActive ? '20' : '14'}`, border: `1px solid ${c}${govActive ? '50' : '35'}`, borderRadius: 3, padding: '2px 6px', transition: 'all 0.5s ease', animation: `dpSpringIn 0.4s ease ${d}s both`, boxShadow: govActive ? `0 0 8px ${c}40` : 'none' }}>{l} ✓</span>
              ) : null)}
            </div>
            {/* CDI + Doc score bars */}
            <div style={{ display: 'flex', gap: 6, flex: 1, minWidth: 120 }}>
              {[['CDI', governance.cdiScore, TEAL], ['Doc', governance.docScore, GREEN]].map(([l, v, c]) => (
                <div key={l} style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6, color: MUTED, marginBottom: 2 }}>
                    <span>{l} Score</span><span style={{ color: c, fontWeight: 700 }}>{v}%</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: govActive ? `${v}%` : '0%', background: `linear-gradient(90deg,${c},${c}99)`, borderRadius: 2, transition: 'width 1.2s cubic-bezier(0.34,1.2,0.64,1)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Clinical protocol — appears slightly after governance panel */}
          {showProtocol && governance.protocol && (
            <div style={{ marginTop: 5, fontSize: 6.5, color: `${PURPLE}${govActive ? 'cc' : '88'}`, fontStyle: 'italic', borderLeft: `2px solid ${PURPLE}${govActive ? '60' : '30'}`, paddingLeft: 6, lineHeight: 1.4, animation: 'dpRowBlurIn 0.5s ease both', transition: 'color 0.5s ease' }}>
              {governance.protocol}
            </div>
          )}
          {/* Auth ref */}
          {financial.authRef && (
            <div style={{ marginTop: 4, fontSize: 6.5, color: DIM }}>
              Prior auth: <span style={{ color: financial.authStatus === 'approved' ? GREEN : AMBER, fontWeight: 700 }}>{financial.authRef} {financial.authStatus === 'approved' ? '✓ Approved' : '⏳ Pending'}</span>
            </div>
          )}
        </div>
      )}

      {/* ── Row 4: AI intelligence — final layer, glows on entry ── */}
      {showAI && (
        <div style={{ display: 'flex', gap: 5, animation: 'dpSpringIn 0.5s ease both' }}>
          <div style={{ flex: 1, background: `${PURPLE}${aiActive ? '18' : '0c'}`, border: `1px solid ${PURPLE}${aiActive ? '45' : '22'}`, borderRadius: 5, padding: '5px 8px', transition: 'all 0.6s ease', boxShadow: aiActive ? `0 0 12px ${PURPLE}30` : 'none' }}>
            <div style={{ fontSize: 5.5, color: PURPLE, fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 }}>REFERRAL</div>
            <div style={{ fontSize: 7.5, color: aiActive ? TXT : DIM, fontWeight: 600, transition: 'color 0.5s ease' }}>{aiProfile.referral}</div>
          </div>
          <div style={{ flex: 1, background: `${AMBER}${aiActive ? '18' : '0c'}`, border: `1px solid ${AMBER}${aiActive ? '45' : '22'}`, borderRadius: 5, padding: '5px 8px', transition: 'all 0.6s ease', boxShadow: aiActive ? `0 0 12px ${AMBER}30` : 'none' }}>
            <div style={{ fontSize: 5.5, color: AMBER, fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 }}>NEXT STEP</div>
            <div style={{ fontSize: 7.5, color: aiActive ? TXT : DIM, fontWeight: 600, transition: 'color 0.5s ease' }}>{aiProfile.next}</div>
          </div>
          <div style={{ flex: 2, background: 'rgba(0,0,0,0.04)', border: `1px solid ${BORDER}`, borderRadius: 5, padding: '5px 8px' }}>
            <div style={{ fontSize: 5.5, color: MUTED, fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 }}>CLINICAL GUIDELINE</div>
            <div style={{ fontSize: 6.5, color: DIM, fontStyle: 'italic', lineHeight: 1.4 }}>{aiProfile.guideline}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ProductShell — cinematic SaaS chrome ───────────────────── */
function ProductShell({ breadcrumb, color, children }) {
  const nav = ['◉','⊞','◷','⚡','⚙'];
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', background: `linear-gradient(160deg,${color}07 0%,#f4f8ff 55%,#f0f5fb 100%)`, fontFamily: 'Sora,sans-serif' }}>
      {/* Sidebar — clinical blue panel */}
      <div style={{ width: 42, flexShrink: 0, background: 'linear-gradient(180deg,#d8e8f8 0%,#c8d9ef 100%)', borderRight: '1px solid rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 3 }}>
        {/* Logo with glow */}
        <div style={{ width: 24, height: 24, borderRadius: 7, marginBottom: 12, background: `linear-gradient(135deg,${color},${INDIGO})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff', boxShadow: `0 0 14px ${color}50` }}>D</div>
        {nav.map((ic, i) => (
          <div key={i} style={{ width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, opacity: i === 0 ? 1 : 0.35, background: i === 0 ? 'rgba(255,255,255,0.55)' : 'transparent', color: i === 0 ? color : '#4a6fa5', boxShadow: i === 0 ? `inset 2px 0 0 ${color}, 0 2px 8px rgba(0,0,0,0.10)` : 'none', position: 'relative' }}>
            {ic}
            {/* Micro glow dot on active nav item */}
            {i === 0 && <div style={{ position: 'absolute', right: 3, top: 3, width: 4, height: 4, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />}
          </div>
        ))}
      </div>
      {/* Main panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header bar with chrome shimmer */}
        <div style={{ height: 34, flexShrink: 0, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6, background: 'linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)', position: 'relative', overflow: 'hidden' }}>
          {/* Shimmer sweep */}
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '30%', background: 'linear-gradient(90deg,transparent,rgba(0,0,0,0.03),transparent)', animation: 'dpChromeShimmer 3.5s ease-in-out infinite', pointerEvents: 'none' }} />
          <span style={{ fontSize: 8, color: MUTED }}>Docstribe</span>
          <span style={{ fontSize: 8, color: '#94a3b8' }}>›</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: TXT }}>{breadcrumb}</span>
          <div style={{ flex: 1 }} />
          {/* Status dots */}
          {[color, INDIGO, '#e2e8f0'].map((c, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: c, boxShadow: i === 0 ? `0 0 6px ${c}` : 'none' }} />)}
        </div>
        {/* Content area */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Atoms ───────────────────────────────────────────────────── */
const Pill = ({ text, color, size = 9 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: 4, fontSize: size, fontWeight: 700, background: `${color}22`, color, letterSpacing: 0.3 }}>{text}</span>
);
const Badge = ({ text, color }) => (
  <span style={{ fontSize: 7, fontWeight: 800, color, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 4, padding: '2px 6px', letterSpacing: 0.3 }}>{text}</span>
);

/* ══════════════════ SCENE VISUALS ══════════════════════════════ */

/* Scene 1 — Revenue gap: Corporate executive, centered, timed to VO */
function StatScene({ scene, progress }) {
  const p = progress;

  // ── Timings aligned to VO beats (fractions of actual audio duration) ─
  // VO: "In the UAE — twelve to eighteen percent…" ≈83 words total
  const beat0Show    = p >= 0.05;   // "twelve to eighteen percent" (word 6/83 ≈ 0.07)
  const beat0Active  = p >= 0.12;   // stat activates red
  const showClaim    = p >= 0.15;   // denied claim card — illustrates "claims denied"
  const showCostCard = p >= 0.21;   // "three point five million dirhams" (word 19/83)
  const showGlobalCard = p >= 0.40; // "World-class systems stay below five percent" (word 35/83)
  const beat1Show    = p >= 0.44;   // "sixty-five percent" (word 38/83 ≈ 0.46)
  const beat1Active  = p >= 0.51;   // gauge sweeps after "entirely preventable"
  const beat2Show    = p >= 0.63;   // "Four root causes" (word 55/83 ≈ 0.66)
  const beat3Show    = p >= 0.85;   // "Eighty-seven percent" (word 73/83 ≈ 0.88)
  const phase = beat3Show ? 3 : beat2Show ? 2 : 1;

  const GAP_ITEMS = [
    { label: 'Clinical Documentation Gaps', pct: 38, sub: 'CC/MCC missed · DRG undercoded at discharge',  col: AMBER,  threshold: 0.67 },
    { label: 'Missing Authorizations',       pct: 27, sub: 'Auth not captured at point of order entry',     col: INDIGO, threshold: 0.72 },
    { label: 'Coding Errors',                pct: 22, sub: 'ICD/DRG mismatches · NCCI violations',         col: RED,    threshold: 0.76 },
    { label: 'Claim Edit Failures',          pct: 13, sub: 'Payer edit rules · MUE limits unmet',          col: PURPLE, threshold: 0.80 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#e8f2ff 0%,#f0f8f4 40%,#ece8ff 80%,#e8f0ff 100%)', display: 'flex', flexDirection: 'column', fontFamily: 'Sora, sans-serif', overflow: 'hidden' }}>

      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${TEAL}0b 0%, transparent 70%)`, animation: 'dpBreath 4s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(100,116,139,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(100,116,139,0.05) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* ── HEADER STRIP ── */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, opacity: p >= 0.02 ? 1 : 0, transition: 'opacity 0.8s', background: 'rgba(255,255,255,0.40)', backdropFilter: 'blur(6px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: RED, boxShadow: `0 0 6px ${RED}`, animation: 'dpPulse 1.2s ease-in-out infinite' }} />
          <span style={{ fontSize: 6, fontWeight: 700, color: MUTED, letterSpacing: 1.8, textTransform: 'uppercase' }}>UAE Healthcare · Revenue Intelligence Brief · 2024</span>
        </div>
        <div style={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
          {Array.from({length: 12}, (_, i) => {
            const denied = i === 3 || i === 9;
            return (
              <div key={i} style={{ width: denied ? 20 : 14, height: 6, borderRadius: 2, background: denied ? `${RED}18` : `${TEAL}10`, border: `1px solid ${denied ? RED + '45' : TEAL + '22'}`, boxShadow: denied && beat0Active ? `0 0 7px ${RED}50` : 'none', transition: 'box-shadow 0.4s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {denied && beat0Active && <span style={{ fontSize: 4, color: RED, fontWeight: 900 }}>✕</span>}
              </div>
            );
          })}
          <span style={{ fontSize: 5.5, fontWeight: 700, color: RED, marginLeft: 4, opacity: beat0Active ? 1 : 0, transition: 'opacity 0.6s' }}>≈2 in 12 denied</span>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ═══ PHASE 1: Stats — vertically centered in mid-screen ═══ */}
        {phase === 1 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 20px', gap: 10, overflow: 'hidden' }}>

            {/* Eyebrow label — centered */}
            {beat0Show && (
              <div style={{ animation: 'dpBeatIn 0.5s ease both', textAlign: 'center' }}>
                <span style={{ fontSize: 6, fontWeight: 700, color: MUTED, letterSpacing: 2, textTransform: 'uppercase' }}>First-Pass Denial Rate · UAE Private Hospitals</span>
              </div>
            )}

            {/* Hero stat — centered, dominant */}
            {beat0Show && (
              <div style={{ textAlign: 'center', animation: 'dpEmergeStat 0.9s cubic-bezier(0.34,1.2,0.64,1) both' }}>
                <div style={{ fontSize: beat1Show ? 40 : 58, fontWeight: 900, color: beat0Active ? RED : `${RED}45`, lineHeight: 1, letterSpacing: -2.5, transition: 'all 0.65s cubic-bezier(0.34,1.2,0.64,1)', fontFamily: 'Sora' }}>
                  <CountUp value="12–18%" duration={900} key={`b0-${beat0Show}`}/>
                </div>
                <div style={{ fontSize: 8.5, color: DIM, marginTop: 5, textAlign: 'center' }}>of UAE hospital claims denied on first submission</div>
              </div>
            )}

            {/* Context row: AED 3.5M (at "three point five million") + <5% (at "world-class") — hidden when 65% appears */}
            {showCostCard && !beat1Show && (
              <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 300, animation: 'dpBeatIn 0.5s ease both' }}>
                <div style={{ flex: 1, padding: '8px 10px', background: `${RED}0c`, border: `1px solid ${RED}22`, borderRadius: 9, textAlign: 'center' }}>
                  <div style={{ fontSize: 5.5, color: MUTED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Annual Revenue at Risk</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: RED, fontFamily: 'Sora', lineHeight: 1.1 }}>AED <CountUp value="3.5M+" duration={1100}/></div>
                  <div style={{ fontSize: 6, color: DIM, marginTop: 2 }}>per 350-bed facility</div>
                </div>
                {showGlobalCard && (
                  <div style={{ flex: 1, padding: '8px 10px', background: `${GREEN}08`, border: `1px solid ${GREEN}25`, borderRadius: 9, textAlign: 'center', animation: 'dpBeatIn 0.5s ease both' }}>
                    <div style={{ fontSize: 5.5, color: MUTED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Global Standard</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: GREEN, fontFamily: 'Sora', lineHeight: 1.1 }}>&lt; 5%</div>
                    <div style={{ fontSize: 6, color: DIM, marginTop: 2 }}>world-class denial rate</div>
                  </div>
                )}
              </div>
            )}

            {/* Denied claim — centered, compact (disappears before 65% stat) */}
            {showClaim && p < 0.38 && (
              <div style={{ borderRadius: 9, background: 'rgba(255,255,255,0.92)', border: `1.5px solid ${RED}40`, boxShadow: `0 3px 18px ${RED}10`, padding: '8px 12px', animation: 'dpSpringIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both', width: '100%', maxWidth: 260 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 6, fontWeight: 700, color: MUTED, letterSpacing: 0.5 }}>CLAIM · AE-24-8821</span>
                  <span style={{ fontSize: 9, fontWeight: 900, color: RED, letterSpacing: 1.5, border: `1.5px solid ${RED}`, borderRadius: 4, padding: '1px 6px', background: `${RED}08` }}>DENIED</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 12px' }}>
                  {[['Patient','F.H. · 42F'],['Payer','Daman'],['Amount','AED 2,450'],['Service','Endocrinology']].map(([k,v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 5.5, color: MUTED }}>{k}</span>
                      <span style={{ fontSize: 6.5, fontWeight: 700, color: TXT }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider between stats */}
            {beat1Show && (
              <div style={{ width: 48, height: 1, background: BORDER, animation: 'dpBeatIn 0.3s ease both' }} />
            )}

            {/* Beat 1: 60-70% preventable — centered */}
            {beat1Show && (
              <div style={{ textAlign: 'center', animation: 'dpBeatIn 0.6s ease both' }}>
                <div style={{ fontSize: 6, fontWeight: 700, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 }}>Of Those Denials — Entirely Preventable</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: beat1Active ? AMBER : `${AMBER}45`, lineHeight: 1, letterSpacing: -2, transition: 'color 0.6s', fontFamily: 'Sora' }}>
                  <CountUp value="60–70%" duration={900} key={`b1-${beat1Show}`}/>
                </div>
                <div style={{ fontSize: 8, color: DIM, marginTop: 5 }}>caught before the claim ever leaves the building</div>
                {/* Arc gauge — centered (appears when VO says "entirely preventable") */}
                {p >= 0.50 && (() => {
                  const R = 34, cx = 52, cy = 40, circ = Math.PI * R;
                  return (
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, animation: 'dpBeatIn 0.5s ease both' }}>
                      <svg width="104" height="50" viewBox="0 0 104 50" style={{ overflow: 'visible' }}>
                        <path d={`M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}`} fill="none" stroke={`${MUTED}22`} strokeWidth="7" strokeLinecap="round"/>
                        <path d={`M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}`} fill="none" stroke={AMBER} strokeWidth="7" strokeLinecap="round"
                          strokeDasharray={`${beat1Active ? circ * 0.65 : 0} ${circ}`}
                          style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.34,1.2,0.64,1) 0.2s', filter: `drop-shadow(0 0 5px ${AMBER}65)` }}/>
                        <text x={cx} y={cy - 6} fontSize="13" fontWeight="900" textAnchor="middle" fill={beat1Active ? AMBER : `${MUTED}45`} style={{ transition: 'fill 0.5s', fontFamily: 'Sora' }}>65%</text>
                      </svg>
                      <div style={{ display: 'flex', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: AMBER }} />
                          <span style={{ fontSize: 6.5, fontWeight: 700, color: AMBER }}>65% Preventable</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: `${MUTED}45` }} />
                          <span style={{ fontSize: 6.5, color: MUTED }}>35% Unavoidable</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ═══ PHASE 2: Timeline — full width, deep cards ═══ */}
        {phase === 2 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 20px', gap: 10, overflow: 'auto' }}>
            <div style={{ width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, animation: 'dpBeatIn 0.5s ease both' }}>
              <span style={{ fontSize: 8, fontWeight: 800, color: MUTED, letterSpacing: 1.5, textTransform: 'uppercase' }}>4 Root Causes · Same Pattern · Every Time</span>
              <div style={{ flex: 1, height: 1, background: BORDER }} />
            </div>
            {/* Full-width timeline */}
            <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
              {/* Vertical spine */}
              <div style={{ position: 'absolute', left: 14, top: 8, bottom: 8, width: 2, background: `linear-gradient(180deg,${AMBER}60,${INDIGO}60,${RED}60,${PURPLE}60)`, borderRadius: 2 }} />
              {GAP_ITEMS.map(({ label, pct, sub, col, threshold }, i) => {
                const visible = p >= threshold;
                if (!visible) return null;
                const barActive = p >= threshold + 0.03;
                return (
                  <div key={label} style={{ display: 'flex', gap: 14, marginBottom: 14, position: 'relative', alignItems: 'flex-start', animation: 'dpSpringIn 0.55s cubic-bezier(0.34,1.4,0.64,1) both' }}>
                    {/* Numbered node */}
                    <div style={{ flexShrink: 0, width: 28, display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: `0 0 14px ${col}60`, flexShrink: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 900, color: '#fff' }}>{i + 1}</span>
                      </div>
                    </div>
                    {/* Card */}
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.92)', border: `1px solid ${BORDER}`, borderLeft: `3px solid ${col}`, borderRadius: 10, padding: '10px 14px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: TXT, lineHeight: 1.25 }}>{label}</span>
                        <span style={{ fontSize: 24, fontWeight: 900, color: col, lineHeight: 1, flexShrink: 0, fontFamily: 'Sora' }}>{pct}%</span>
                      </div>
                      <div style={{ fontSize: 8, color: DIM, marginBottom: 6 }}>{sub}</div>
                      <div style={{ height: 4, borderRadius: 2, background: `${col}14`, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${col},${col}bb)`, width: barActive ? `${pct}%` : '0%', transition: 'width 1.1s cubic-bezier(0.34,1.2,0.64,1)', boxShadow: `0 0 6px ${col}55` }}/>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ PHASE 3: 87% → Bridge — triggered when all 4 roots shown ═══ */}
        {phase === 3 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 20px', animation: 'dpSpringIn 0.7s cubic-bezier(0.34,1.4,0.64,1) both' }}>
            {/* 87% hero number */}
            <div style={{ textAlign: 'center', animation: 'dpEmergeStat 0.8s cubic-bezier(0.34,1.2,0.64,1) both' }}>
              <div style={{ fontSize: 5.5, fontWeight: 700, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Total Addressable · Docstribe</div>
              <div style={{ fontSize: 62, fontWeight: 900, color: TEAL, fontFamily: 'Sora', lineHeight: 1, letterSpacing: -3, textShadow: `0 0 40px ${TEAL}40` }}>87%</div>
              <div style={{ fontSize: 9, color: DIM, marginTop: 5 }}>of denials are catchable before the claim leaves the building</div>
            </div>
            {/* Divider */}
            <div style={{ width: 40, height: 1.5, background: BORDER, borderRadius: 1, animation: 'dpBeatIn 0.4s ease 0.3s both' }} />
            {/* Resolution */}
            <div style={{ textAlign: 'center', animation: 'dpBeatIn 0.7s ease 0.35s both' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: TXT, letterSpacing: -0.5, lineHeight: 1.2 }}>Someone has to close all four.</div>
              <div style={{ fontSize: 10, color: TEAL, fontWeight: 700, marginTop: 6, animation: 'dpBeatIn 0.6s ease 0.6s both' }}>Docstribe is built precisely to solve all four.</div>
            </div>
            {/* Chips */}
            <div style={{ display: 'flex', gap: 8, animation: 'dpBeatIn 0.5s ease 0.5s both' }}>
              {[['CDI', AMBER], ['Auth', INDIGO], ['Coding', RED], ['Edits', PURPLE]].map(([label, col], i) => (
                <div key={i} style={{ padding: '7px 12px', background: `${col}12`, border: `1px solid ${col}35`, borderRadius: 8, animation: `dpSpringIn 0.5s cubic-bezier(0.34,1.4,0.64,1) ${0.55 + i * 0.08}s both`, textAlign: 'center' }}>
                  <div style={{ fontSize: 8, fontWeight: 800, color: col }}>{label}</div>
                  <div style={{ fontSize: 6, color: DIM, marginTop: 2 }}>Solved ✓</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* Scene 2 — Intro Docstribe (p<0.62), then KPI outcomes (p>=0.64) */
function KPIScene({ scene, progress }) {
  // VO: "purpose-built to close this gap…thirty years…hundred hospitals…ten million…denials drop…clean rate…CMI…sixty days"
  // ≈60 words: thirty years @word14 ≈0.23 · hundred hospitals @0.43 · denials drop @0.65 · clean rate @0.73 · CMI @0.83
  // intro fades out 0.60→0.68, outcomes fade in 0.62→0.70
  const introOpacity = progress < 0.60 ? 1 : progress > 0.68 ? 0 : 1 - (progress - 0.60) / 0.08;
  const kpiOpacity   = progress < 0.62 ? 0 : progress > 0.70 ? 1 : (progress - 0.62) / 0.08;
  const kpiBeats = scene.beats.slice(3); // beats 3,4,5 = ↓30%, 99%, +0.15 CMI
  const colors = [RED, GREEN, PURPLE];

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#e8f2ff 0%,#f0f8f4 40%,#ece8ff 80%,#e8f0ff 100%)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* ── PERSISTENT HEADER — always visible across both phases ── */}
      <div style={{ flexShrink: 0, position: 'relative', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, paddingBottom: 8, borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(6px)' }}>
        {/* Purposefully built eyebrow */}
        <div style={{ fontSize: 7.5, fontWeight: 700, color: TEAL, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, opacity: introOpacity > 0 ? 1 : 0.7, transition: 'opacity 0.5s' }}>
          {introOpacity > 0 ? 'Purposefully built to close the gap' : 'Clinical Intelligence · UAE'}
        </div>
        {/* Docstribe wordmark — always present, dpLogoReveal ends at opacity:1 (unlike dpBloom which fades out) */}
        <div style={{ fontSize: 48, fontWeight: 900, background: `linear-gradient(135deg,#0f172a 30%,${TEAL} 60%,${INDIGO})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1.5, lineHeight: 1, animation: 'dpLogoReveal 0.9s cubic-bezier(0.34,1.4,0.64,1) both' }}>
          Docstribe
        </div>
      </div>

      {/* ── Phase 1 content — scrolls below persistent header ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '12px 48px', opacity: introOpacity, transition: 'opacity 0.6s ease', pointerEvents: introOpacity < 0.1 ? 'none' : 'auto' }}>

        {/* Compliance trust strip — ambient, appears first while VO opens */}
        {progress >= 0.03 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'NABIDH Verified ✓',  color: TEAL   },
              { label: 'DHA Approved ✓',      color: GREEN  },
              { label: 'IR-DRG Optimised ✓',  color: INDIGO },
              { label: 'SOC 2 Compliant ✓',   color: PURPLE },
            ].map((b, i) => (
              <span key={i} style={{ fontSize: 7.5, fontWeight: 700, color: b.color, background: `${b.color}12`, border: `1px solid ${b.color}30`, borderRadius: 20, padding: '4px 11px', animation: `dpSpringIn 0.5s cubic-bezier(0.34,1.4,0.64,1) ${i*0.09}s both` }}>{b.label}</span>
            ))}
          </div>
        )}

        {/* 30+ Years — fires when VO says "thirty years" (word 14/60 ≈ 0.23) */}
        {progress >= 0.20 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: `${AMBER}10`, border: `1px solid ${AMBER}35`, borderRadius: 14, padding: '10px 20px', animation: 'dpSpringIn 0.7s cubic-bezier(0.34,1.4,0.64,1) both', width: '100%', maxWidth: 440 }}>
            <div style={{ fontSize: 38, fontWeight: 900, color: AMBER, lineHeight: 1, letterSpacing: -1, flexShrink: 0 }}>30<span style={{ fontSize: 18 }}>+</span></div>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: AMBER }}>Years of Grounded Clinical Experience</div>
              <div style={{ fontSize: 7, color: DIM, lineHeight: 1.5 }}>Built by doctors — not software engineers — who lived these problems before solving them</div>
            </div>
          </div>
        )}

        {/* Geographic network — fires before "A hundred hospitals" (word 26/60 ≈ 0.43) */}
        {progress >= 0.40 && (
          <div style={{ position: 'relative', width: 320, height: 72, animation: 'dpBeatIn 0.7s ease both', flexShrink: 0 }}>
            <svg width="320" height="72" viewBox="0 0 320 72" fill="none" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <path d="M 36 36 Q 120 10 160 36 Q 200 62 284 36" stroke={`${TEAL}35`} strokeWidth="1.5" strokeDasharray="6 5" fill="none"/>
              <circle cx="36"  cy="36" r="16" fill={`${TEAL}10`}  stroke={`${TEAL}30`}  strokeWidth="1"/>
              <circle cx="160" cy="36" r="16" fill={`${AMBER}10`} stroke={`${AMBER}30`} strokeWidth="1"/>
              <circle cx="284" cy="36" r="16" fill={`${INDIGO}10`} stroke={`${INDIGO}30`} strokeWidth="1"/>
            </svg>
            {[
              { x: 36,  color: TEAL,   label: 'USA',   hosp: '42+', delay: '0s'    },
              { x: 160, color: AMBER,  label: 'UAE',   hosp: '38+', delay: '0.14s' },
              { x: 284, color: INDIGO, label: 'India', hosp: '25+', delay: '0.28s' },
            ].map((city, i) => (
              <div key={i} style={{ position: 'absolute', top: 36, left: city.x, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, animation: `dpSpringIn 0.55s cubic-bezier(0.34,1.4,0.64,1) ${city.delay} both` }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: city.color, boxShadow: `0 0 10px ${city.color}80`, border: `2px solid rgba(255,255,255,0.9)`, zIndex: 1, animation: 'dpPulse 2s ease-in-out infinite' }}/>
                <div style={{ fontSize: 7.5, fontWeight: 800, color: city.color, whiteSpace: 'nowrap', marginTop: 16 }}>{city.label}</div>
                <div style={{ fontSize: 6, color: MUTED }}>{city.hosp} hospitals</div>
              </div>
            ))}
          </div>
        )}

        {/* Guarantee promise — appears near end of Phase 1, before KPI transition */}
        {progress >= 0.55 && (
          <div style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}35`, borderRadius: 12, padding: '8px 20px', animation: 'dpSpringIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both', textAlign: 'center' }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: GREEN, letterSpacing: 0.5 }}>CONTRACTUAL OUTCOMES · 60 DAYS</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: TXT, marginTop: 3 }}>↓30% Denials · 99% Clean Rate · +0.15 CMI</div>
          </div>
        )}
      </div>

      {/* ── Phase 2: KPI Outcomes ── */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '16px 28px', opacity: kpiOpacity, transition: 'opacity 0.6s ease', pointerEvents: kpiOpacity < 0.1 ? 'none' : 'auto' }}>

        <div style={{ textAlign: 'center', animation: 'dpBeatIn 0.5s ease both' }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, color: `${AMBER}90`, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>Closing those four gaps — contractually</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: TXT }}>Here's what changes in 60 days:</div>
        </div>

        {/* KPI cards — 3 columns, each with arc gauge showing industry vs Docstribe */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', width: '100%', maxWidth: 640 }}>
          {kpiBeats.map((b, i) => {
            const show = progress >= b.at;
            const active = spot(progress, b.at, b.at + 0.18);
            const c = colors[i];
            // Arc gauge params — semi-circle (180°) using SVG stroke-dasharray
            const R = 32, stroke = 8;
            const circ = Math.PI * R; // half circumference for 180° arc
            // industry and Docstribe percentages per KPI
            const indPct = i===0 ? 0.60 : i===1 ? 0.75 : 0.55;
            const dsPct  = i===0 ? 0.92 : i===1 ? 0.99 : 0.82;
            return (
              <div key={i} style={{ background: active ? `linear-gradient(160deg,${c}12,${c}04)` : 'rgba(255,255,255,0.95)', border: `1px solid ${c}${active ? '55' : show ? '22' : '10'}`, borderTop: `3px solid ${c}${active ? 'cc' : show ? '70' : '25'}`, borderRadius: 16, padding: '18px 16px', flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: show ? 1 : 0, animation: show ? `dpSpringIn 0.65s cubic-bezier(0.34,1.4,0.64,1) both` : 'none', boxShadow: active ? `0 0 0 2px ${c}40, 0 6px 24px ${c}20, 0 4px 12px rgba(0,0,0,0.07)` : '0 1px 6px rgba(0,0,0,0.07)', transform: active ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.4s ease, box-shadow 0.4s ease, background 0.4s ease', position: 'relative', overflow: 'hidden' }}>
                {active && <div style={{ position: 'absolute', inset: -16, pointerEvents: 'none', background: `radial-gradient(ellipse 80% 70% at 50% 50%,${c}20 0%,transparent 70%)`, animation: 'dpBloom 1.4s ease-out both', zIndex: 0 }}/>}
                {/* Semi-circle arc gauge — industry (gray) vs Docstribe (color) */}
                <div style={{ position: 'relative', width: 80, height: 44, flexShrink: 0, zIndex: 1 }}>
                  <svg width="80" height="50" viewBox="0 0 80 50" style={{ overflow: 'visible' }}>
                    {/* Background track */}
                    <path d={`M 8 44 A ${R} ${R} 0 0 1 72 44`} fill="none" stroke={`${MUTED}18`} strokeWidth={stroke} strokeLinecap="round"/>
                    {/* Industry arc (gray, slightly thinner) */}
                    <path d={`M 8 44 A ${R} ${R} 0 0 1 72 44`} fill="none" stroke={`${MUTED}45`} strokeWidth={stroke-2} strokeLinecap="round"
                      strokeDasharray={`${show ? indPct * circ : 0} ${circ}`} style={{ transition: 'stroke-dasharray 1.0s cubic-bezier(0.34,1.2,0.64,1)' }}/>
                    {/* Docstribe arc (color, full weight) */}
                    <path d={`M 8 44 A ${R} ${R} 0 0 1 72 44`} fill="none" stroke={c} strokeWidth={stroke} strokeLinecap="round"
                      strokeDasharray={`${show ? dsPct * circ : 0} ${circ}`} style={{ transition: `stroke-dasharray 1.2s cubic-bezier(0.34,1.2,0.64,1) 0.2s`, filter: `drop-shadow(0 0 4px ${c}80)` }}/>
                  </svg>
                  {/* Center label */}
                  <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center' }}>
                    <span style={{ fontSize: 7, fontWeight: 700, color: c }}>vs Industry</span>
                  </div>
                </div>
                {/* Big KPI number */}
                {i === 2 && <div style={{ fontSize: 8, fontWeight: 800, color: c, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.75, zIndex: 1 }}>CMI</div>}
                <div style={{ fontSize: 44, fontWeight: 900, color: c, fontFamily: 'Sora', lineHeight: 1, letterSpacing: -2, zIndex: 1 }}>
                  {show ? <CountUp value={b.stat} duration={700} key={`k${i}-${show}`}/> : b.stat}
                </div>
                <div style={{ width: 20, height: 2, borderRadius: 1, background: c, zIndex: 1 }}/>
                <div style={{ fontSize: 7.5, color: DIM, textAlign: 'center', lineHeight: 1.5, zIndex: 1 }}>{b.sub}</div>
              </div>
            );
          })}
        </div>

        {/* 60-Day Timeline — appears when VO says "Sixty days" (word 57/60 ≈ 0.95) */}
        {progress >= 0.93 && (
          <div style={{ width: '100%', maxWidth: 520, animation: 'dpBeatIn 0.6s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0 }}>
              {[
                { day: 'Day 0',  label: 'Deploy',         col: TEAL   },
                { day: 'Day 14', label: 'First results',  col: INDIGO },
                { day: 'Day 30', label: '50% lift',       col: PURPLE },
                { day: 'Day 60', label: 'Guaranteed ✓',   col: GREEN  },
              ].map((m, mi) => (
                <Fragment key={mi}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0, animation: `dpSpringIn 0.45s cubic-bezier(0.34,1.4,0.64,1) ${mi*0.10}s both` }}>
                    <div style={{ width: mi === 3 ? 14 : 10, height: mi === 3 ? 14 : 10, borderRadius: '50%', background: m.col, boxShadow: `0 0 ${mi===3?14:8}px ${m.col}80`, border: `2px solid rgba(255,255,255,0.9)`, animation: mi===3 ? 'dpPulse 1.5s ease-in-out infinite' : 'none' }}/>
                    <div style={{ fontSize: 7, fontWeight: 800, color: m.col }}>{m.day}</div>
                    <div style={{ fontSize: 6, color: mi===3 ? GREEN : MUTED, fontWeight: mi===3 ? 700 : 400, textAlign: 'center', maxWidth: 52 }}>{m.label}</div>
                  </div>
                  {mi < 3 && <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg,${m.col}55,${[INDIGO,PURPLE,GREEN][mi]}55)`, borderRadius: 1, alignSelf: 'flex-start', marginTop: 5, marginBottom: 24 }}/>}
                </Fragment>
              ))}
            </div>
            {progress >= 0.97 && (
              <div style={{ textAlign: 'center', marginTop: 8, fontSize: 8, color: MUTED, animation: 'dpBeatIn 0.5s ease both' }}>
                All outcomes contractual · auditable · <span style={{ color: GREEN, fontWeight: 700 }}>backed by Docstribe SLA</span>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

/* Scene 3 — Cases Workbench: opens with "agentic workforce" card, then encounter rows */
function CasesScreen({ progress }) {
  const encounters = [
    { init: 'F.H.', tag: 'OPD', dept: 'Endocrinology', dx: 'Type 2 DM + Hypertension', risk: 'HIGH', fin: 'AED 2,450', status: 'CDI Pending', statusCol: AMBER, col: INDIGO, show: 0.10 },
    { init: 'K.A.', tag: 'IPD', dept: 'Respiratory', dx: 'Pneumonia + COPD exacerbation', risk: 'CRITICAL', fin: 'AED 28,500', status: 'PA Approved', statusCol: GREEN, col: TEAL, show: 0.24 },
    { init: 'M.J.', tag: 'ER', dept: 'Emergency', dx: 'Chest Pain — ACS rule-out', risk: 'HIGH', fin: 'AED 5,800', status: 'Auth Pending', statusCol: RED, col: RED, show: 0.40 },
    { init: 'B.S.', tag: 'OPD', dept: 'Cardiology', dx: 'Post-MI follow-up · Statin review', risk: 'MED', fin: 'AED 1,900', status: 'Claim Ready', statusCol: GREEN, col: GREEN, show: 0.56 },
    { init: 'N.R.', tag: 'IPD', dept: 'Neurology', dx: 'Ischaemic CVA · Day 4', risk: 'CRITICAL', fin: 'AED 42,000', status: 'IR-DRG Optimised', statusCol: TEAL, col: PURPLE, show: 0.70 },
  ];
  return (
    <ProductShell breadcrumb="Cases Workbench" color={TEAL}>
      <div style={{ padding: '10px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* EMR integration banner — shows briefly at scene start */}
        {progress < 0.30 && (
          <div style={{ background: 'linear-gradient(90deg,rgba(0,203,168,0.08),rgba(77,138,255,0.06))', border: `1px solid ${TEAL}30`, borderRadius: 9, padding: '8px 14px', display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0, animation: 'dpRowBlurIn 0.5s ease both', opacity: progress < 0.24 ? 1 : 1 - (progress - 0.24) / 0.06, transition: 'opacity 0.5s' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: TEAL, letterSpacing: 1, marginBottom: 3 }}>CONNECTED SYSTEMS</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[['Epic', TEAL], ['Oracle', INDIGO], ['Cerner', GREEN], ['MEDITECH', AMBER]].map(([n, c]) => (
                  <span key={n} style={{ fontSize: 6.5, fontWeight: 800, color: c, background: `${c}14`, border: `1px solid ${c}28`, borderRadius: 3, padding: '2px 7px' }}>{n} ✓</span>
                ))}
              </div>
            </div>
            <div style={{ width: 1, background: BORDER, alignSelf: 'stretch', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: TXT, marginBottom: 3 }}>No rip and replace. Docstribe reads your EMR in real time.</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['Physician', INDIGO], ['Medical Coder', AMBER], ['Case Manager', TEAL]].map(([role, c]) => (
                  <span key={role} style={{ fontSize: 6.5, fontWeight: 700, color: c, background: `${c}12`, border: `1px solid ${c}25`, borderRadius: 3, padding: '2px 7px' }}>● {role}</span>
                ))}
              </div>
            </div>
            {progress >= 0.04 && (
              <div style={{ textAlign: 'center', flexShrink: 0, animation: 'dpBeatIn 0.4s ease both' }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: TEAL, fontFamily: 'Sora' }}>LIVE</div>
                <div style={{ fontSize: 6, color: DIM }}>HIS sync active</div>
              </div>
            )}
          </div>
        )}

        {/* Summary strip */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[['200', 'Active Cases', TEAL], ['139', 'OPD', INDIGO], ['45', 'IPD', TEAL], ['16', 'Emergency', RED]].map(([v, l, c], i) => (
            <div key={i} style={{ flex: 1, background: `${c}0e`, border: `1px solid ${c}22`, borderRadius: 8, padding: '8px 10px', animation: `dpRowIn 0.4s ease ${i * 0.06}s both` }}>
              <div style={{ fontSize: i === 0 ? 22 : 17, fontWeight: 900, color: c, fontFamily: 'Sora' }}>
                {progress > 0.04 ? <CountUp value={v} duration={500} key={v} /> : v}
              </div>
              <div style={{ fontSize: 8, color: DIM, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Column headers */}
        <div style={{ display: 'flex', gap: 0, padding: '0 10px', borderBottom: `1px solid ${BORDER}` }}>
          {['Patient', 'Department', 'Diagnosis', 'Risk', 'Financial', 'Status'].map((h, i) => (
            <div key={i} style={{ flex: i === 2 ? 2 : 1, fontSize: 7, color: MUTED, fontWeight: 700, letterSpacing: 0.5, padding: '4px 0' }}>{h}</div>
          ))}
        </div>
        {/* Encounter rows — one spotlit at a time */}
        {encounters.map((enc, i) => {
          const visible = progress >= enc.show;
          const active = spot(progress, enc.show, enc.show + 0.16);
          const pastFocus = progress > enc.show + 0.16;
          return (
            <div key={i} style={{
              ...glow(active, enc.col, { borderRadius: 8, padding: '8px 10px', display: 'flex', gap: 0, alignItems: 'center' }),
              opacity: visible ? (pastFocus ? 0.55 : 1) : 0,
              transform: visible ? (active ? 'scale(1.025)' : 'scale(1)') : 'translateY(12px)',
              transition: 'all 0.5s cubic-bezier(0.34,1.2,0.64,1)',
            }}>
              <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: `${enc.col}22`, border: `1.5px solid ${enc.col}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: enc.col }}>{enc.init}</span>
                </div>
                <Pill text={enc.tag} color={enc.col} />
              </div>
              <div style={{ flex: 1, fontSize: 9, color: active ? TXT : DIM, fontWeight: active ? 600 : 400 }}>{enc.dept}</div>
              <div style={{ flex: 2, fontSize: 9, color: TXT }}>{enc.dx}</div>
              <div style={{ flex: 1 }}>
                <Badge text={enc.risk} color={enc.risk === 'CRITICAL' ? RED : enc.risk === 'HIGH' ? AMBER : GREEN} />
              </div>
              <div style={{ flex: 1, fontSize: 10, fontWeight: 900, color: enc.col, fontFamily: 'Sora' }}>{enc.fin}</div>
              <div style={{ flex: 1 }}>
                <Badge text={enc.status} color={enc.statusCol} />
              </div>
            </div>
          );
        })}
        {progress >= 0.86 && (
          <div style={{ textAlign: 'center', animation: 'dpSpringIn 0.55s cubic-bezier(0.34,1.4,0.64,1) both' }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: TEAL, background: `${TEAL}12`, border: `1px solid ${TEAL}40`, borderRadius: 20, padding: '5px 18px', boxShadow: `0 0 20px ${TEAL}20`, textShadow: `0 0 10px ${TEAL}50` }}>
              ✦ Zero leakage — every encounter tracked end-to-end
            </span>
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Chip row — extracted as top-level to avoid 60fps remount-flicker */
function EligChipRow({ chips, apisActive, apiNames, p }) {
  return (
    <>
      {/* API call indicators */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 7, flexWrap: 'wrap' }}>
        {apiNames.map((api) => {
          const apiDone = p >= chips[0].show;
          return (
            <div key={api} style={{ display: 'flex', gap: 5, alignItems: 'center', background: `rgba(0,0,0,0.04)`, border: `1px solid ${apiDone ? TEAL + '35' : BORDER}`, borderRadius: 20, padding: '3px 10px', transition: 'border-color 0.4s', animation: 'dpBeatIn 0.4s ease both' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: apisActive ? TEAL : (apiDone ? GREEN : MUTED), animation: apisActive ? 'dpPulse 0.9s ease infinite' : 'none', boxShadow: apisActive ? `0 0 6px ${TEAL}` : 'none', transition: 'background 0.4s, box-shadow 0.4s' }} />
              <span style={{ fontSize: 7, fontWeight: 700, color: apisActive ? TEAL : (apiDone ? GREEN : DIM), transition: 'color 0.4s' }}>{api}</span>
              {apisActive && <span style={{ fontSize: 7, color: `${TEAL}80` }}>···</span>}
              {apiDone && !apisActive && <span style={{ fontSize: 7, color: GREEN }}>✓</span>}
            </div>
          );
        })}
      </div>
      {/* Result chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {chips.map((chip, i) => {
          const vis = p >= chip.show;
          return vis ? (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${chip.col}${chip.hero ? '1e' : '10'}`, border: `1px solid ${chip.col}${chip.hero ? '55' : '30'}`, borderRadius: chip.hero ? 8 : 20, padding: chip.hero ? '6px 14px' : '3px 10px', animation: `dpSpringIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both`, boxShadow: chip.hero ? `0 0 16px ${chip.col}30` : 'none' }}>
              <span style={{ fontSize: chip.hero ? 9 : 7, fontWeight: 900, color: chip.col }}>{chip.icon}</span>
              <span style={{ fontSize: chip.hero ? 9 : 7, color: MUTED, fontWeight: 600 }}>{chip.label}:</span>
              <span style={{ fontSize: chip.hero ? 10 : 7.5, fontWeight: chip.hero ? 900 : 700, color: chip.hero ? chip.col : TXT, fontFamily: chip.hero ? 'Sora' : 'inherit' }}>{chip.value}</span>
            </div>
          ) : null;
        })}
      </div>
    </>
  );
}

/* Scene 4 — Eligibility: animated flowchart journey, no patient names */
function EligibilityScreen({ progress }) {
  const p = progress;

  // OPD-only flow — 5 steps across the full screen
  const flow = [
    { label: 'Patient Arrives',  icon: '🏥', show: 0.04 },
    { label: 'EMR Auto-Fetch',   icon: '📋', show: 0.14, api: false },
    { label: 'Your Payer API',   icon: '🔗', show: 0.26, api: true  },
    { label: 'Eligibility Check',icon: '🔍', show: 0.38, api: false },
    { label: 'Cleared ✓',        icon: '✅', show: 0.52, api: false },
  ];

  const apiActive = p >= 0.26 && p < 0.38;
  const cleared   = p >= 0.52;

  // Status result cards — appear after API check, full-width tiles
  const results = [
    { label: 'Insurance Status', value: 'Active · Daman Enhanced',  icon: '✓',  col: GREEN,  show: 0.40, hero: false },
    { label: 'Network',          value: 'In-Network',                icon: '✓',  col: GREEN,  show: 0.43, hero: false },
    { label: 'Co-pay',           value: 'AED 50 / visit',            icon: '◎',  col: AMBER,  show: 0.46, hero: false },
    { label: 'Pre-auth',         value: 'Not Required ✓',            icon: '✓',  col: GREEN,  show: 0.49, hero: false },
    { label: 'Deductible',       value: 'AED 6,550 remaining',       icon: '◎',  col: INDIGO, show: 0.52, hero: false },
    { label: 'Coverage',         value: 'DM · HTN · CKD — Covered',  icon: '✓',  col: TEAL,   show: 0.55, hero: false },
  ];

  return (
    <ProductShell breadcrumb="Eligibility & Pre-Authorisation" color={GREEN}>
      <div style={{ padding: '14px 18px', height: '100%', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>

        {/* Change 5g — Integration Context Banner */}
        {progress>=0.01 && (
          <div style={{background:`${TEAL}08`,border:`1px solid ${TEAL}25`,borderRadius:9,padding:'7px 12px',display:'flex',gap:10,alignItems:'center',flexShrink:0,animation:'dpRowBlurIn 0.5s ease both'}}>
            <div style={{flexShrink:0,width:22,height:22,borderRadius:6,background:`${TEAL}18`,border:`1px solid ${TEAL}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11}}>🔌</div>
            <div>
              <div style={{fontSize:8,fontWeight:800,color:TEAL,marginBottom:1}}>Connects to your existing Payer APIs — no new contracts needed</div>
              <div style={{fontSize:6.5,color:DIM}}>Works with Daman, AXA Gulf, Bupa Arabia, Neuron Health &amp; any FHIR-compliant endpoint your hospital already uses</div>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN, boxShadow: `0 0 10px ${GREEN}`, animation: 'dpPulse 1s ease infinite' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: GREEN, letterSpacing: 0.5 }}>ELIGIBILITY ENGINE LIVE</span>
          <span style={{ fontSize: 9, color: MUTED }}>· Via your existing Payer APIs · NABIDH · DHA</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 8, color: MUTED }}>19 Apr 2025 · 09:12 GST</span>
        </div>

        {/* ── Patient byte ── */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(0,0,0,0.04)', border: `1px solid ${cleared ? GREEN + '40' : BORDER}`, borderRadius: 14, padding: '14px 18px', transition: 'border-color 0.6s', flexShrink: 0 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${GREEN}22`, border: `2.5px solid ${GREEN}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: `0 0 18px ${GREEN}30`, flexShrink: 0 }}>🩺</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: TXT, marginBottom: 3 }}>F · 42 yrs · Endocrinology OPD</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: GREEN, background: `${GREEN}14`, border: `1px solid ${GREEN}30`, borderRadius: 20, padding: '2px 10px' }}>Daman Enhanced</span>
              <span style={{ fontSize: 10, color: MUTED }}>MRN: UH-2024-4821</span>
            </div>
          </div>
        </div>

        {/* ── Journey flowchart — full width, large nodes ── */}
        <div style={{ flexShrink: 0, padding: '10px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {flow.flatMap((step, i) => {
              const vis    = p >= step.show;
              const next   = flow[i + 1];
              const active = vis && next && p < next.show;
              const isLast = i === flow.length - 1;
              const lineOn = next && p >= next.show;

              const nodeEl = (
                <div key={`n${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, opacity: vis ? 1 : 0.18, transition: 'opacity 0.45s, transform 0.4s', transform: vis ? 'scale(1)' : 'scale(0.78)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, background: vis ? (active ? `${GREEN}28` : `${GREEN}14`) : 'rgba(0,0,0,0.03)', border: `2.5px solid ${vis ? (active ? GREEN : GREEN + '60') : BORDER}`, boxShadow: active ? `0 0 24px ${GREEN}55, 0 0 50px ${GREEN}18` : 'none', transition: 'all 0.4s ease' }}>
                    {step.icon}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, fontWeight: active ? 800 : 600, color: vis ? (active ? GREEN : `${GREEN}cc`) : DIM, whiteSpace: 'nowrap', transition: 'color 0.4s' }}>{step.label}</div>
                    {step.api && vis && (
                      <div style={{ fontSize: 8, color: apiActive ? TEAL : `${GREEN}90`, fontWeight: 700, marginTop: 2 }}>{apiActive ? '⟳ connecting via your API…' : '✓ live data returned'}</div>
                    )}
                  </div>
                </div>
              );

              if (isLast) return [nodeEl];

              const arrowEl = (
                <div key={`a${i}`} style={{ flex: 1, height: 3, borderRadius: 2, background: lineOn ? `linear-gradient(90deg,${GREEN}60,${GREEN}28)` : `${BORDER}40`, margin: '0 6px', marginBottom: 28, transition: 'background 0.55s ease', position: 'relative', overflow: 'hidden' }}>
                  {lineOn && <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg,transparent,${GREEN}80,transparent)`, animation: 'dpChromeShimmer 1.4s ease-out both' }} />}
                </div>
              );

              return [nodeEl, arrowEl];
            })}
          </div>
        </div>

        {/* ── Status result tiles ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
          {results.some(r => p >= r.show) && (
            <div style={{ fontSize: 9, fontWeight: 700, color: DIM, letterSpacing: 0.5, flexShrink: 0 }}>OPD ELIGIBILITY RESULTS · REAL-TIME</div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, alignContent: 'start' }}>
            {results.map((r, i) => p >= r.show && (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: `${r.col}10`, border: `1px solid ${r.col}30`, borderRadius: 10, padding: '10px 14px', animation: 'dpSpringIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: r.col, flexShrink: 0 }}>{r.icon}</span>
                <div>
                  <div style={{ fontSize: 8, color: MUTED, fontWeight: 600, marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: r.col }}>{r.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cleared banner ── */}
        {cleared && (
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', animation: 'dpSpringIn 0.7s cubic-bezier(0.34,1.4,0.64,1) both' }}>
            <div style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}55`, borderRadius: 30, padding: '10px 28px', boxShadow: `0 0 28px ${GREEN}28`, display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: GREEN, boxShadow: `0 0 12px ${GREEN}`, animation: 'dpPulse 1.5s ease-in-out infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 900, color: GREEN }}>✅ Eligibility cleared · No authorisation needed · Visit confirmed</span>
            </div>
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 5 — Ambient Scribe: single patient, elements highlight with VO */
function AmbientScreen({ progress }) {
  const p = progress;

  const micOpacity  = p < 0.11 ? 1 : p > 0.17 ? 0 : 1 - (p - 0.11) / 0.06;
  const splitOpacity = p < 0.13 ? 0 : p > 0.19 ? 1 : (p - 0.13) / 0.06;

  // What element to highlight at each progress stage
  const highlightTranscript   = p >= 0.10 && p < 0.40;
  const highlightEntities     = p >= 0.38 && p < 0.58;
  const highlightICD          = p >= 0.56 && p < 0.80;
  const highlightGovernance   = p >= 0.72;

  const patient = {
    name: 'Fatima Hassan', initials: 'FH', age: 'F/42', type: 'OPD', dept: 'Endocrinology',
    mrn: 'UH-2024-4821', payer: 'Daman', payerPlan: 'Enhanced',
    risk: 'HIGH',
    diagnoses: [
      { code: 'E11.65', label: 'T2DM uncontrolled', col: RED },
      { code: 'N18.3',  label: 'CKD Stage 3',       col: INDIGO },
      { code: 'I10',    label: 'Hypertension',       col: AMBER },
    ],
    vitals: [
      { label: 'HbA1c', value: '9.1% ↑', col: RED },
      { label: 'BP',    value: '142/88',  col: AMBER },
      { label: 'eGFR',  value: '68 ↓',   col: INDIGO },
    ],
    governance: {
      nabidh: true, dha: true, jawda: true, auditReady: false,
      cdiScore: 62, docScore: 74,
      protocol: 'ADA 2024 §10.3: HbA1c >9% → intensify + nephrology if eGFR <60',
    },
    financial: { pending: 'AED 2,450', authRef: 'DM-2024-01', authStatus: 'approved' },
    aiProfile: {
      referral: 'Nephrology consult',
      next: 'Jardiance Rx + CDI query',
      guideline: 'ADA 2024: eGFR 60→45 stage transition warrants SGLT2 initiation + nephrology co-management',
    },
  };

  const isListening   = p >= 0.10 && p < 0.48;
  const isStructuring = p >= 0.46 && p < 0.58;
  const isComplete    = p >= 0.56;
  const phaseLabel    = isListening ? 'LISTENING' : isStructuring ? 'STRUCTURING' : isComplete ? 'NOTE READY' : 'READY';
  const phaseColor    = isListening ? RED : isStructuring ? AMBER : isComplete ? GREEN : MUTED;

  const lines = [
    { text: '"HbA1c nine point one — definitely uncontrolled. She needs intensification."',               show: 0.12 },
    { text: 'BP one forty two over eighty eight. eGFR sixty eight — CKD Stage 3 territory.',            show: 0.22 },
    { text: 'Adjusting Metformin, adding Jardiance ten milligrams. Nephrology referral flagged.',        show: 0.34 },
  ];
  const entities = [
    { label: 'HbA1c',      value: '9.1% ↑',    col: RED,    show: 0.14 },
    { label: 'BP',         value: '142/88 ↑',   col: AMBER,  show: 0.24 },
    { label: 'eGFR',       value: '68 ↓ CKD3',  col: INDIGO, show: 0.36 },
    { label: 'qSOFA',      value: 'Normal',     col: GREEN,  show: 0.40 },
  ];
  const codes = [
    { code: 'E11.65', desc: 'Type 2 DM — uncontrolled (hyperglycaemia)',  col: RED,    show: 0.54, rank: 1 },
    { code: 'I10',    desc: 'Essential hypertension',                       col: AMBER,  show: 0.60, rank: 2 },
    { code: 'N18.3',  desc: 'Chronic kidney disease — Stage 3',            col: INDIGO, show: 0.66, rank: 3 },
  ];

  return (
    <ProductShell breadcrumb="Ambient Scribe — Live Session" color={INDIGO}>

      {/* ── Mic intro phase ── */}
      {micOpacity > 0.01 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'radial-gradient(ellipse 70% 60% at 50% 45%,#e8f0ff 0%,#f0f5ff 100%)', opacity: micOpacity, transition: 'opacity 0.4s ease', zIndex: 10, pointerEvents: micOpacity < 0.05 ? 'none' : 'auto' }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 50% 40% at 50% 50%,${INDIGO}08 0%,transparent 70%)`, animation: 'dpBreath 3s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg,${INDIGO}30,${TEAL}18)`, border: `2px solid ${INDIGO}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'dpPulse 1.4s ease-in-out infinite', boxShadow: `0 0 40px ${INDIGO}40, 0 0 80px ${INDIGO}20` }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="12" rx="3" fill={INDIGO} opacity="0.9" />
                <path d="M5 11a7 7 0 0 0 14 0" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <line x1="12" y1="18" x2="12" y2="22" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="9" y1="22" x2="15" y2="22" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ position: 'absolute', inset: -8 * i - 8, borderRadius: '50%', border: `1px solid ${INDIGO}${30 - i * 8}`, animation: `dpStatRing ${1.6 + i * 0.4}s ease-out ${i * 0.3}s infinite`, pointerEvents: 'none' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: `${RED}12`, border: `1px solid ${RED}35`, borderRadius: 20, padding: '4px 14px', animation: 'dpBeatIn 0.4s ease 0.3s both', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: RED, boxShadow: `0 0 6px ${RED}`, animation: 'dpPulse 1s ease infinite' }} />
            <span style={{ fontSize: 8, fontWeight: 800, color: RED, letterSpacing: 0.8 }}>AMBIENT SESSION LIVE</span>
          </div>
          <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 22, position: 'relative', zIndex: 1 }}>
            {Array.from({ length: 32 }, (_, i) => (
              <div key={i} style={{ width: 3, background: `linear-gradient(180deg,${INDIGO},${TEAL}60)`, borderRadius: 2, opacity: 0.7, height: `${20 + Math.sin(i * 0.9 + p * 45) * 70}%`, transition: 'height 0.08s ease' }} />
            ))}
          </div>
          <div style={{ fontSize: 10, color: DIM, letterSpacing: 0.5, position: 'relative', zIndex: 1 }}>Physician voice → structured clinical note</div>
          <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 1, animation: 'dpBeatIn 0.4s ease 0.6s both' }}>
            {[['NABIDH ✓', INDIGO], ['DHA Licensed ✓', TEAL], ['HL7 FHIR ✓', GREEN]].map(([l, c]) => (
              <span key={l} style={{ fontSize: 7, fontWeight: 700, color: c, background: `${c}12`, border: `1px solid ${c}30`, borderRadius: 4, padding: '2px 8px' }}>{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Single patient view ── */}
      <div style={{ padding: '7px 11px', height: '100%', display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden', opacity: splitOpacity, transition: 'opacity 0.5s ease' }}>

        {/* Session bar */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, paddingBottom: 5, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: isListening ? RED : isComplete ? GREEN : MUTED, animation: isListening ? 'dpPulse 1.1s ease infinite' : 'none', boxShadow: isListening ? `0 0 7px ${RED}` : 'none', transition: 'background 0.4s' }} />
            <span style={{ fontSize: 8, fontWeight: 800, color: isListening ? RED : isComplete ? GREEN : MUTED, letterSpacing: 0.5 }}>
              {isListening ? 'SESSION LIVE' : isComplete ? 'NOTE READY' : 'READY'}
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 7, color: MUTED }}>19 Apr 2025 · 09:14 GST</span>
          <span style={{ fontSize: 7, fontWeight: 700, color: INDIGO, background: `${INDIGO}14`, border: `1px solid ${INDIGO}28`, borderRadius: 4, padding: '2px 6px' }}>NABIDH ✓</span>
        </div>

        {/* Patient card — full width, highlighted when governance section is spoken */}
        <div style={{ flexShrink: 0, transition: 'all 0.5s ease', boxShadow: highlightGovernance ? `0 0 20px ${INDIGO}25` : 'none' }}>
          <PatientProfileCard patient={patient} progress={p} showFrom={0.06} />
        </div>

        {/* Phase indicator */}
        <div style={{ display: 'flex', gap: 3, alignItems: 'center', background: `${phaseColor}12`, border: `1px solid ${phaseColor}28`, borderRadius: 6, padding: '3px 8px', flexShrink: 0, transition: 'all 0.4s' }}>
          {isListening && <div style={{ width: 4, height: 4, borderRadius: '50%', background: RED, animation: 'dpPulse 1s ease infinite' }} />}
          <span style={{ fontSize: 7, fontWeight: 800, color: phaseColor, letterSpacing: 0.3 }}>{phaseLabel}</span>
          {isListening && <span style={{ fontSize: 6, color: MUTED, marginLeft: 4 }}>Physician voice → structured note in real time</span>}
        </div>

        {/* Main two-column area */}
        <div style={{ display: 'flex', gap: 10, flex: 1, overflow: 'hidden', minHeight: 0 }}>

          {/* Left: Live transcript + entities */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>

            {/* Live transcript — highlights when being spoken */}
            <div style={{ background: `rgba(0,0,0,0.04)`, border: `1px solid ${highlightTranscript ? `${INDIGO}50` : BORDER}`, borderRadius: 7, padding: '7px 9px', flexShrink: 0, transition: 'border-color 0.5s', boxShadow: highlightTranscript ? `0 0 12px ${INDIGO}15` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <div style={{ fontSize: 7, fontWeight: 700, color: highlightTranscript ? INDIGO : MUTED, letterSpacing: 0.4, transition: 'color 0.4s' }}>LIVE TRANSCRIPT</div>
                {highlightTranscript && <div style={{ fontSize: 6, fontWeight: 700, color: RED, animation: 'dpPulse 1s ease infinite' }}>● REC</div>}
              </div>
              <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 12, marginBottom: 6 }}>
                {Array.from({ length: 26 }, (_, i) => (
                  <div key={i} style={{ flex: 1, background: INDIGO, borderRadius: 1, opacity: isListening ? 0.75 : 0.15, height: isListening ? `${20 + Math.sin(i * 1.2 + p * 42) * 68}%` : '15%', transition: 'height 0.1s ease, opacity 0.5s' }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {lines.map((line, i) => (
                  <div key={i} style={{ fontSize: 7.5, color: p >= line.show ? (p >= line.show + 0.12 ? `${TXT}90` : TXT) : 'transparent', lineHeight: 1.5, fontStyle: 'italic', transition: 'color 0.5s ease' }}>
                    {p >= line.show ? line.text : ' '}
                  </div>
                ))}
                {isListening && <span style={{ display: 'inline-block', width: 2, height: 10, background: INDIGO, borderRadius: 1, animation: 'dpPulse 0.75s step-end infinite', verticalAlign: 'bottom' }} />}
              </div>
            </div>

            {/* AI Entities — highlights when entities section is active */}
            {p >= 0.14 && (
              <div style={{ animation: 'dpEnterScene 0.45s ease-out both', flexShrink: 0 }}>
                <div style={{ fontSize: 7, fontWeight: 700, color: highlightEntities ? TEAL : MUTED, letterSpacing: 0.4, marginBottom: 5, transition: 'color 0.4s' }}>
                  {highlightEntities ? '◉ AI-EXTRACTED ENTITIES — LIVE' : 'AI-EXTRACTED ENTITIES'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {entities.map((e, i) => p >= e.show && (
                    <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center', background: `${e.col}${highlightEntities ? '18' : '10'}`, border: `1px solid ${e.col}${highlightEntities ? '50' : '28'}`, borderRadius: 7, padding: '3px 9px', animation: 'dpSpringIn 0.4s ease both', boxShadow: highlightEntities ? `0 0 8px ${e.col}25` : 'none', transition: 'all 0.5s' }}>
                      <span style={{ fontSize: 7, color: MUTED }}>{e.label}:</span>
                      <span style={{ fontSize: 8, fontWeight: 900, color: e.col }}>{e.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: ICD codes + compliance */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>

            {/* ICD codes — highlights when coding section is active */}
            {p >= 0.54 && (
              <div style={{ animation: 'dpEnterScene 0.5s ease-out both', flex: 1 }}>
                <div style={{ fontSize: 7, fontWeight: 800, color: highlightICD ? `${GREEN}ee` : `${GREEN}80`, letterSpacing: 0.4, marginBottom: 5, transition: 'color 0.4s' }}>
                  {highlightICD ? '✓ ICD-10-CM AUTO-CODED — RANKED' : '✓ ICD-10-CM CODED'}
                </div>
                {codes.map((c, i) => p >= c.show && (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 9px', marginBottom: 4, borderRadius: 7, background: `${c.col}${highlightICD ? '14' : '0a'}`, border: `1px solid ${c.col}${highlightICD ? '40' : '22'}`, animation: 'dpSpringIn 0.4s ease both', boxShadow: highlightICD ? `0 0 10px ${c.col}20` : 'none', transition: 'all 0.5s' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${c.col}20`, border: `1px solid ${c.col}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 7, fontWeight: 900, color: c.col }}>{c.rank}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 900, color: c.col, fontFamily: 'Sora', width: 46, flexShrink: 0 }}>{c.code}</span>
                    <span style={{ fontSize: 8, color: TXT, flex: 1, lineHeight: 1.3 }}>{c.desc}</span>
                    <span style={{ fontSize: 9, color: GREEN, fontWeight: 900 }}>✓</span>
                  </div>
                ))}
                {isComplete && (
                  <div style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}30`, borderRadius: 6, padding: '5px 9px', animation: 'dpBeatIn 0.4s ease both' }}>
                    <div style={{ fontSize: 7, color: GREEN, fontWeight: 700 }}>✓ Claim-ready · Sent to NABIDH</div>
                    <div style={{ fontSize: 6.5, color: DIM, marginTop: 1 }}>ICD-10-CM verified · DHA compliant</div>
                  </div>
                )}
              </div>
            )}

            {/* Compliance footer */}
            {p >= 0.68 && (
              <div style={{ background: `linear-gradient(90deg,${INDIGO}12,${TEAL}12)`, border: `1px solid ${highlightGovernance ? TEAL + '45' : TEAL + '25'}`, borderRadius: 7, padding: '6px 10px', animation: 'dpBeatIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both', flexShrink: 0, boxShadow: highlightGovernance ? `0 0 16px ${TEAL}18` : 'none', transition: 'box-shadow 0.5s' }}>
                <div style={{ fontSize: 7, fontWeight: 800, color: highlightGovernance ? TEAL : `${TEAL}80`, marginBottom: 4, transition: 'color 0.4s' }}>CLINICAL GOVERNANCE — ACTIVE</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[['NABIDH ✓', INDIGO], ['DHA Licensed ✓', TEAL], ['HL7 FHIR ✓', GREEN]].map(([l, c]) => (
                    <div key={l} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: c, boxShadow: highlightGovernance ? `0 0 6px ${c}` : 'none', transition: 'box-shadow 0.4s' }} />
                      <span style={{ fontSize: 7, fontWeight: 700, color: c }}>{l}</span>
                    </div>
                  ))}
                </div>
                {p >= 0.78 && (
                  <div style={{ marginTop: 4, fontSize: 6.5, color: `${PURPLE}cc`, fontStyle: 'italic', borderLeft: `2px solid ${PURPLE}50`, paddingLeft: 6, animation: 'dpRowBlurIn 0.4s ease both' }}>
                    ADA 2024 §10.3: HbA1c 9.1% → uncontrolled DM. Nephrology at eGFR &lt;60.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProductShell>
  );
}

/* CDI query card — top-level to prevent 60fps remount-flicker */
function CDIQueryCard({ col, title, sub, question, guidelinePills, opts, answered, locked, codeFrom, codeTo, codeLabel, drgFrom, drgTo, delta }) {
  return (
    <div style={{ flex: 1, background: locked ? `${GREEN}08` : `${col}08`, border: `1px solid ${locked ? GREEN + '40' : col + '45'}`, borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, animation: 'dpSpringIn 0.55s cubic-bezier(0.34,1.4,0.64,1) both', transition: 'border-color 0.5s, background 0.5s' }}>
      {/* Card header */}
      <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${col}20`, border: `1px solid ${col}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10 }}>⚡</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 8.5, fontWeight: 800, color: col }}>{title}</div>
          <div style={{ fontSize: 6.5, color: DIM }}>{sub}</div>
        </div>
        {locked && <span style={{ fontSize: 7, fontWeight: 800, color: GREEN, background: `${GREEN}18`, border: `1px solid ${GREEN}35`, borderRadius: 4, padding: '2px 8px', animation: 'dpBeatIn 0.35s ease both', flexShrink: 0 }}>🔒 Locked · E-signed</span>}
      </div>
      {/* Question */}
      <div style={{ fontSize: 10, fontWeight: 700, color: TXT, lineHeight: 1.4 }}>{question}</div>
      {/* Guideline pills */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {guidelinePills.map(([label, c]) => (
          <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${c}12`, border: `1px solid ${c}30`, borderRadius: 20, padding: '3px 10px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />
            <span style={{ fontSize: 7, fontWeight: 700, color: c }}>{label}</span>
          </div>
        ))}
      </div>
      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        {opts.map((opt, j) => {
          const selected = j === 0 && (answered || locked);
          return (
            <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 11px', borderRadius: 7, background: selected ? `${GREEN}14` : 'rgba(0,0,0,0.03)', border: `1px solid ${selected ? GREEN + '50' : BORDER}`, transition: 'all 0.4s ease' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${selected ? GREEN : MUTED}`, background: selected ? GREEN : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}>
                {selected && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
              </div>
              <span style={{ fontSize: 8, fontWeight: selected ? 700 : 400, color: selected ? TXT : DIM, transition: 'all 0.3s' }}>{opt}</span>
            </div>
          );
        })}
      </div>
      {/* Code + IR-DRG reveal */}
      {locked && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', animation: 'dpBeatIn 0.35s ease both', borderTop: `1px solid ${GREEN}25`, paddingTop: 7 }}>
          <span style={{ fontSize: 7, color: RED, textDecoration: 'line-through' }}>{codeFrom}</span>
          <span style={{ fontSize: 7, color: MUTED }}>→</span>
          <span style={{ fontSize: 8.5, fontWeight: 900, color: GREEN }}>{codeTo}</span>
          <span style={{ fontSize: 7, color: DIM }}>· {codeLabel}</span>
          <span style={{ fontSize: 6, color: MUTED }}>·</span>
          <span style={{ fontSize: 7.5, fontWeight: 800, color: PURPLE }}>IR-DRG {drgFrom} → {drgTo}</span>
          <span style={{ fontSize: 6, color: MUTED }}>·</span>
          <span style={{ fontSize: 9, fontWeight: 900, color: GREEN, fontFamily: 'Sora' }}>{delta}</span>
        </div>
      )}
    </div>
  );
}

/* Scene 6 — Clinical Intelligence: mic → patient profile → risk/governance → OPD CDI drawer */
function CDIScreen({ progress }) {
  const p = progress;

  // Phase 1: mic animation (0-0.16 visible, fades by 0.20)
  // Phase 2: patient profile + risk + governance (0.16-0.54)
  // Phase 3: CDI drawer slides in from left (0.54+), OPD only
  const micOpacity     = p < 0.10 ? 1 : p > 0.18 ? 0 : 1 - (p - 0.10) / 0.08;
  const contentOpacity = p < 0.15 ? 0 : p > 0.22 ? 1 : (p - 0.15) / 0.07;
  const isListening    = p >= 0.06 && p < 0.18;

  const signalShow = p >= 0.22;       // signal assessment grid
  const opp1Show   = p >= 0.35;       // Nephrology referral card
  const opp2Show   = p >= 0.43;       // Jardiance order card
  const opp3Show   = p >= 0.51;       // HbA1c retest card

  const opp1Click  = p >= 0.41;       // Nephrology → Referral Sent ✓
  const opp2Click  = p >= 0.49;       // Jardiance → Ordered ✓
  const opp3Click  = p >= 0.55;       // HbA1c → Scheduled ✓
  const oppCount   = opp3Click ? 3 : opp2Click ? 2 : opp1Click ? 1 : 0;

  const drawerOpen = p >= 0.61;
  const answered   = p >= 0.67;
  const locked     = p >= 0.78;

  const enhancements = [
    { from: 'E11.9', to: 'E11.65', label: 'T2DM Uncontrolled — HbA1c 9.1%', badge: 'CC captured', col: RED,  show: answered },
    { from: 'CPT 99214', to: '99214 + 83036', label: 'HbA1c lab — MUE ✓ separate', badge: '+CPT',    col: TEAL, show: locked },
  ];

  // Physician note lines (build during CDI phase)
  const noteLines = [
    { text: '"HbA1c nine point one. Definitely uncontrolled. Needs intensification."', show: 0.56 },
    { text: 'BP 142/88. eGFR 68 — CKD Stage 3. Adding Jardiance. Nephrology referral.', show: 0.63 },
    { text: 'Impression: Type 2 DM — hyperglycaemia.', show: 0.68, cursor: true },
  ];

  const patient = {
    name: 'Fatima Hassan', initials: 'FH', age: 'F/42', type: 'OPD', dept: 'Endocrinology',
    mrn: 'UH-2024-4821', payer: 'Daman', payerPlan: 'Enhanced',
    risk: 'HIGH',
    diagnoses: [
      { code: 'E11.65', label: 'T2DM uncontrolled', col: RED },
      { code: 'N18.3',  label: 'CKD Stage 3',       col: INDIGO },
      { code: 'I10',    label: 'Hypertension',       col: AMBER },
    ],
    vitals: [
      { label: 'HbA1c', value: '9.1% ↑', col: RED },
      { label: 'BP',    value: '142/88',  col: AMBER },
      { label: 'eGFR',  value: '68 ↓',   col: INDIGO },
    ],
    governance: {
      nabidh: true, dha: true, jawda: true, auditReady: false,
      cdiScore: 62, docScore: 74,
      protocol: 'ADA 2024 §10.3: HbA1c >9% → intensify + nephrology if eGFR <60',
    },
    financial: { pending: 'AED 2,450', authRef: 'DM-2024-01', authStatus: 'approved' },
    aiProfile: {
      referral: 'Nephrology consult',
      next: 'Jardiance Rx + CDI query pending',
      guideline: 'ADA 2024: SGLT2 at eGFR 60→45 + nephrology co-management',
    },
  };

  return (
    <ProductShell breadcrumb="Ambient Scribe · CDI" color={AMBER}>

      {/* ── Phase 1: Mic intro ── */}
      {micOpacity > 0.01 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, background: 'radial-gradient(ellipse 70% 60% at 50% 45%,#e8f0ff 0%,#f0f5ff 100%)', opacity: micOpacity, transition: 'opacity 0.35s ease', zIndex: 10, pointerEvents: micOpacity < 0.05 ? 'none' : 'auto' }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 50% 40% at 50% 50%,${INDIGO}08 0%,transparent 70%)`, animation: 'dpBreath 3s ease-in-out infinite', pointerEvents: 'none' }} />
          {/* Mic with pulse rings */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${INDIGO}30,${TEAL}18)`, border: `2px solid ${INDIGO}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'dpPulse 1.4s ease-in-out infinite', boxShadow: `0 0 40px ${INDIGO}45, 0 0 80px ${INDIGO}20` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="12" rx="3" fill={INDIGO} opacity="0.9" />
                <path d="M5 11a7 7 0 0 0 14 0" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <line x1="12" y1="18" x2="12" y2="22" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
                <line x1="9" y1="22" x2="15" y2="22" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ position: 'absolute', inset: -10 * i - 10, borderRadius: '50%', border: `1px solid ${INDIGO}${30 - i * 8}`, animation: `dpStatRing ${1.6 + i * 0.4}s ease-out ${i * 0.3}s infinite`, pointerEvents: 'none' }} />
            ))}
          </div>
          {/* Live badge */}
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', background: `${RED}12`, border: `1px solid ${RED}35`, borderRadius: 20, padding: '5px 16px', animation: 'dpBeatIn 0.4s ease 0.3s both', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: RED, boxShadow: `0 0 6px ${RED}`, animation: 'dpPulse 1s ease infinite' }} />
            <span style={{ fontSize: 9, fontWeight: 800, color: RED, letterSpacing: 0.8 }}>AMBIENT SESSION LIVE</span>
          </div>
          {/* Waveform bars */}
          <div style={{ display: 'flex', gap: 2.5, alignItems: 'flex-end', height: 26, position: 'relative', zIndex: 1 }}>
            {Array.from({ length: 32 }, (_, i) => (
              <div key={i} style={{ width: 3.5, background: `linear-gradient(180deg,${INDIGO},${TEAL}60)`, borderRadius: 2, opacity: isListening ? 0.8 : 0.2, height: `${20 + Math.sin(i * 0.9 + p * 45) * 70}%`, transition: 'height 0.08s ease, opacity 0.4s ease' }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: DIM, letterSpacing: 0.5, position: 'relative', zIndex: 1 }}>Physician voice → structured clinical note</div>
          <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 1, animation: 'dpBeatIn 0.4s ease 0.6s both' }}>
            {[['NABIDH ✓', INDIGO], ['DHA Licensed ✓', TEAL], ['HL7 FHIR ✓', GREEN]].map(([l, c]) => (
              <span key={l} style={{ fontSize: 8.5, fontWeight: 700, color: c, background: `${c}12`, border: `1px solid ${c}30`, borderRadius: 5, padding: '3px 10px' }}>{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Phase 2+3: Patient view + CDI drawer ── */}
      <div style={{ padding: '10px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden', opacity: contentOpacity, transition: 'opacity 0.5s ease' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: AMBER, letterSpacing: 0.8, textTransform: 'uppercase' }}>Clinical Intelligence · Ambient Scribe + CDI</div>
            <div style={{ fontSize: 8, color: DIM, marginTop: 1 }}>
              {drawerOpen ? 'CDI query surfaced automatically — ICD captured at point of care' : opp1Show ? '3 clinical gaps surfaced · referral · medication · follow-up' : signalShow ? 'Signals assessed · risk mapped · gaps being surfaced…' : 'Patient profile live · reading clinical signals…'}
            </div>
          </div>
          {/* IR-DRG badge */}
          <div style={{ background: locked ? `${PURPLE}18` : 'rgba(0,0,0,0.04)', border: `1px solid ${locked ? PURPLE + '50' : BORDER}`, borderRadius: 10, padding: '5px 16px', textAlign: 'center', flexShrink: 0, transition: 'all 0.6s' }}>
            <div style={{ fontSize: 7.5, color: MUTED, letterSpacing: 0.8, marginBottom: 1 }}>IR-DRG</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: locked ? PURPLE : DIM, fontFamily: 'Sora', lineHeight: 1, transition: 'color 0.8s', textShadow: 'none' }}>
              {locked ? <CountUp value={locked ? '1.04' : '0.82'} duration={600} key={locked ? 'locked' : 'base'} /> : '0.82'}
            </div>
            {locked && <div style={{ fontSize: 8, color: GREEN, fontWeight: 700, marginTop: 2, animation: 'dpBeatIn 0.4s ease both' }}>+AED 4,200</div>}
          </div>
        </div>

        {/* Patient profile card — prominent, bigger */}
        <div style={{ flexShrink: 0 }}>
          <PatientProfileCard patient={patient} progress={p} showFrom={0.16} />
        </div>

        {/* ── Below-patient: two columns when opp cards appear ── */}
        {!drawerOpen && signalShow && (
          <div style={{ flex: 1, display: 'flex', gap: 10, overflow: 'hidden' }}>

            {/* LEFT — Clinical signals */}
            <div style={{ width: opp1Show ? '42%' : '100%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6, transition: 'width 0.5s ease', overflow: 'hidden' }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: AMBER, letterSpacing: 0.8, textTransform: 'uppercase', flexShrink: 0 }}>Clinical Signals</div>
              {[
                { label: 'HbA1c', value: '9.1% ↑', col: RED,    risk: 'HIGH'     },
                { label: 'eGFR',  value: '68 ↓',   col: INDIGO, risk: 'WATCH'    },
                { label: 'BP',    value: '142/88',  col: AMBER,  risk: 'ELEVATED' },
              ].map((sig, i) => (
                <div key={i} style={{ background: `${sig.col}0c`, border: `1px solid ${sig.col}30`, borderRadius: 8, padding: '7px 10px', animation: `dpSpringIn 0.5s ease ${i * 0.1}s both`, flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 6, color: MUTED, letterSpacing: 0.5, marginBottom: 2 }}>{sig.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: sig.col, fontFamily: 'Sora', lineHeight: 1 }}>{sig.value}</div>
                    </div>
                    <span style={{ fontSize: 6, fontWeight: 800, color: sig.col, background: `${sig.col}18`, border: `1px solid ${sig.col}25`, borderRadius: 4, padding: '2px 5px' }}>{sig.risk}</span>
                  </div>
                </div>
              ))}
              <div style={{ background: `${RED}10`, border: `2px solid ${RED}40`, borderRadius: 8, padding: '7px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: 6, fontWeight: 700, color: MUTED, letterSpacing: 0.5 }}>COMPOSITE RISK</div>
                  <div style={{ fontSize: 6, color: DIM, marginTop: 1 }}>Multi-comorbidity · 3 signals</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 900, color: RED }}>HIGH</div>
              </div>
            </div>

            {/* RIGHT — Physician actionables */}
            {opp1Show && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, overflow: 'auto', animation: 'dpSlideInLeft 0.5s ease both' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: AMBER, letterSpacing: 0.6 }}>PHYSICIAN ACTIONABLES</span>
                  <span key={oppCount} style={{ fontSize: 7, fontWeight: 800, color: oppCount > 0 ? GREEN : AMBER, background: oppCount > 0 ? `${GREEN}14` : `${AMBER}18`, border: `1px solid ${oppCount > 0 ? GREEN + '40' : AMBER + '40'}`, borderRadius: 10, padding: '2px 9px', animation: 'dpSpringIn 0.4s cubic-bezier(0.34,1.6,0.64,1) both', transition: 'all 0.4s' }}>{oppCount} of 3 actioned</span>
                </div>
                {[
                  {
                    show: opp1Show, clicked: opp1Click,
                    icon: '🔵', title: 'Nephrology Consult',        type: 'Inter-dept Referral',
                    status: 'NOT ORDERED',    statusCol: RED,
                    guideline: 'KDIGO 2024',  guidelineCol: INDIGO,
                    reason: 'eGFR 68 — CKD Stage 3 requires nephrology co-management',
                    col: INDIGO, actionLabel: 'Send Referral', doneLabel: 'Referral Sent ✓',
                  },
                  {
                    show: opp2Show, clicked: opp2Click,
                    icon: '💊', title: 'Jardiance (Empagliflozin)', type: 'Missing Order',
                    status: 'NOT PRESCRIBED', statusCol: RED,
                    guideline: 'AHA/ACC 2023', guidelineCol: TEAL,
                    reason: 'SGLT2 inhibitor indicated for T2DM + CKD Stage 3',
                    col: TEAL, actionLabel: 'Order Now', doneLabel: 'Ordered ✓',
                  },
                  {
                    show: opp3Show, clicked: opp3Click,
                    icon: '🔬', title: 'HbA1c Retest in 3 Months', type: 'Follow-up Required',
                    status: 'NOT SCHEDULED', statusCol: AMBER,
                    guideline: 'ADA 2024 §6.1', guidelineCol: PURPLE,
                    reason: 'Protocol mandates recheck after treatment intensification',
                    col: PURPLE, actionLabel: 'Schedule', doneLabel: 'Scheduled ✓',
                  },
                ].filter(opp => opp.show).map((opp, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 12px', borderRadius: 10, background: opp.clicked ? `${opp.col}10` : `${opp.col}0a`, border: `1px solid ${opp.clicked ? opp.col + '50' : opp.col + '30'}`, animation: 'dpRowBlurIn 0.45s ease both', flexShrink: 0, transition: 'background 0.4s, border-color 0.4s' }}>
                    <div style={{ fontSize: 16, flexShrink: 0, filter: opp.clicked ? `drop-shadow(0 0 4px ${opp.col}80)` : 'none', transition: 'filter 0.4s' }}>{opp.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 8, fontWeight: 700, color: opp.col }}>{opp.title}</span>
                        <span style={{ fontSize: 6.5, fontWeight: 800, color: opp.clicked ? opp.col : opp.statusCol, background: opp.clicked ? `${opp.col}12` : `${opp.statusCol}12`, border: `1px solid ${opp.clicked ? opp.col + '30' : opp.statusCol + '30'}`, borderRadius: 4, padding: '1px 6px', flexShrink: 0, transition: 'all 0.4s' }}>
                          {opp.clicked ? '✓ DONE' : opp.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
                        <span style={{ fontSize: 6.5, color: MUTED }}>{opp.type}</span>
                        <span style={{ fontSize: 6.5, fontWeight: 700, color: opp.guidelineCol, background: `${opp.guidelineCol}10`, border: `1px solid ${opp.guidelineCol}25`, borderRadius: 10, padding: '1px 7px' }}>{opp.guideline}</span>
                      </div>
                      <div style={{ fontSize: 7, color: DIM, marginBottom: 6 }}>{opp.reason}</div>
                      <div key={opp.clicked ? 'done' : 'idle'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '5px 10px', borderRadius: 6, background: opp.clicked ? `${opp.col}18` : `${opp.col}10`, border: `1px solid ${opp.clicked ? opp.col + '60' : opp.col + '35'}`, cursor: 'default', animation: opp.clicked ? 'dpClickPop 0.4s ease both' : 'dpSpringIn 0.4s ease both', transition: 'background 0.35s, border-color 0.35s', boxShadow: opp.clicked ? `0 0 10px ${opp.col}30` : 'none' }}>
                        {!opp.clicked && <div style={{ width: 5, height: 5, borderRadius: '50%', background: opp.col, animation: 'dpPulse 1s ease-in-out infinite', flexShrink: 0 }} />}
                        <span style={{ fontSize: 7.5, fontWeight: 800, color: opp.clicked ? opp.col : `${opp.col}cc`, letterSpacing: 0.3 }}>
                          {opp.clicked ? opp.doneLabel : opp.actionLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Phase 3: Main workspace with CDI drawer ── */}
        {drawerOpen && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', borderRadius: 12, border: `1px solid ${AMBER}30`, background: 'rgba(255,255,255,0.60)', minHeight: 0 }}>

            {/* ── LEFT DRAWER — CDI Query ── */}
            <div style={{
              width: '46%', flexShrink: 0, overflow: 'hidden',
              borderRight: `1px solid ${AMBER}30`,
              background: `linear-gradient(170deg,${AMBER}08 0%,rgba(255,250,240,0.97) 100%)`,
              animation: 'dpSlideInLeft 0.6s cubic-bezier(0.34,1.05,0.64,1) both',
            }}>
              <div style={{ padding: '14px 16px', height: '100%', display: 'flex', flexDirection: 'column', gap: 11, overflowY: 'auto', boxSizing: 'border-box' }}>
                {/* Header */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${AMBER}1c`, border: `1.5px solid ${AMBER}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15 }}>⚡</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: AMBER }}>CDI Query — Code Doesn't Match Clinical Picture</div>
                    <div style={{ fontSize: 8, color: DIM, marginTop: 1 }}>OPD · in-note · auto-surfaced · no disruption</div>
                  </div>
                  {locked && <span style={{ fontSize: 8, fontWeight: 800, color: GREEN, background: `${GREEN}1c`, border: `1px solid ${GREEN}45`, borderRadius: 6, padding: '3px 10px', animation: 'dpSpringIn 0.5s ease both', flexShrink: 0 }}>🔒 E-signed</span>}
                </div>

                {/* Question */}
                <div style={{ fontSize: 14, fontWeight: 700, color: TXT, lineHeight: 1.45, borderLeft: `3px solid ${AMBER}`, paddingLeft: 12 }}>
                  Is this Type 2 DM controlled or uncontrolled?
                </div>

                {/* Guideline */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${PURPLE}12`, border: `1px solid ${PURPLE}30`, borderRadius: 20, padding: '5px 14px' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: PURPLE }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: PURPLE }}>ADA 2024 §6.1</span>
                  </div>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['E11.65 — Uncontrolled (HbA1c 9.1%)', 'E11.9 — Controlled / no complications'].map((opt, j) => {
                    const sel = j === 0 && (answered || locked);
                    return (
                      <div key={sel ? 'sel' : `opt-${j}`} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', padding: '11px 14px', borderRadius: 10, background: sel ? `${GREEN}12` : 'rgba(0,0,0,0.03)', border: `1px solid ${sel ? GREEN + '45' : BORDER}`, transition: 'all 0.45s ease', animation: sel ? 'dpClickPop 0.4s ease both' : undefined }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${sel ? GREEN : BORDER}`, background: sel ? GREEN : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.35s' }}>
                          {sel && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: sel ? 700 : 400, color: sel ? TXT : DIM, lineHeight: 1.4, transition: 'all 0.35s' }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Physician response time */}
                {answered && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, animation: 'dpBeatIn 0.35s ease both' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: GREEN }} />
                    <span style={{ fontSize: 7, fontWeight: 700, color: GREEN }}>Physician responded · 4.7s</span>
                  </div>
                )}

                {/* Code enhancement */}
                {enhancements.some(e => e.show) && (
                  <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 8, fontWeight: 800, color: GREEN, letterSpacing: 1, textTransform: 'uppercase' }}>Code Enhancement</div>
                    {enhancements.filter(e => e.show).map((e, i) => (
                      <div key={i} style={{ padding: '10px 13px', borderRadius: 10, background: `${e.col}0a`, border: `1px solid ${e.col}22`, animation: 'dpSpringIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: `${RED}bb`, textDecoration: 'line-through', fontFamily: 'Sora' }}>{e.from}</span>
                          <span style={{ fontSize: 12, color: MUTED }}>→</span>
                          <span style={{ fontSize: 14, fontWeight: 900, color: GREEN, fontFamily: 'Sora' }}>{e.to}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 7.5, fontWeight: 800, color: e.col, background: `${e.col}18`, border: `1px solid ${e.col}30`, borderRadius: 5, padding: '2px 8px', flexShrink: 0 }}>{e.badge}</span>
                        </div>
                        <div style={{ fontSize: 8.5, color: DIM }}>{e.label}</div>
                      </div>
                    ))}
                    {locked && (
                      <div style={{ textAlign: 'center', paddingTop: 4, animation: 'dpSpringIn 0.7s cubic-bezier(0.34,1.4,0.64,1) both' }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: GREEN, fontFamily: 'Sora', letterSpacing: -1.5, lineHeight: 1, textShadow: 'none' }}>+AED 4,200</div>
                        <div style={{ fontSize: 9, color: DIM, marginTop: 4 }}>captured at point of care</div>
                      </div>
                    )}
                    {locked && (
                      <div style={{ borderTop: `1px solid ${GREEN}25`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6, animation: 'dpBeatIn 0.5s ease 0.2s both' }}>
                        <div style={{ fontSize: 7, fontWeight: 800, color: GREEN, letterSpacing: 0.6 }}>OUTCOMES CAPTURED AT POINT OF CARE</div>
                        {[
                          { label: 'Nephrology referral sent',      col: INDIGO },
                          { label: 'Jardiance order placed',         col: TEAL   },
                          { label: 'HbA1c retest scheduled',         col: PURPLE },
                          { label: 'Code E11.65 locked · E-signed',  col: GREEN  },
                        ].map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', animation: `dpRowBlurIn 0.4s ease ${i * 0.08}s both` }}>
                            <div style={{ width: 14, height: 14, borderRadius: '50%', background: `${item.col}20`, border: `1.5px solid ${item.col}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ fontSize: 7, fontWeight: 900, color: item.col }}>✓</span>
                            </div>
                            <span style={{ fontSize: 7.5, fontWeight: 600, color: TXT }}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT — Physician note (building live) ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 16px', gap: 10, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: AMBER, animation: 'dpPulse 1.3s ease-in-out infinite', flexShrink: 0 }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: `${TXT}80`, letterSpacing: 0.6 }}>OPD PHYSICIAN NOTE · IN PROGRESS</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {noteLines.map((line, i) => p >= line.show && (
                  <div key={i} style={{ fontSize: 12, color: line.cursor ? `${TXT}d5` : TXT, lineHeight: 1.7, animation: 'dpRowBlurIn 0.55s ease both' }}>
                    {line.text}
                    {line.cursor && !answered && (
                      <span style={{ color: AMBER, animation: 'dpPulse 1s ease-in-out infinite' }}> ▌</span>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {!locked && drawerOpen && (
                  <div style={{ display: 'flex', gap: 7, alignItems: 'center', animation: 'dpBeatIn 0.3s ease both' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: AMBER, boxShadow: `0 0 9px ${AMBER}` }} />
                    <span style={{ fontSize: 9, color: AMBER, fontWeight: 700 }}>Gap detected → CDI query surfaced ←</span>
                  </div>
                )}
                {locked && (
                  <div style={{ display: 'flex', gap: 7, alignItems: 'center', animation: 'dpBeatIn 0.3s ease both' }}>
                    <span style={{ fontSize: 10, color: GREEN, fontWeight: 700 }}>✓ Query answered · note updated · charge captured</span>
                  </div>
                )}
                {p >= 0.86 && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', borderTop: `1px solid ${BORDER}`, paddingTop: 8, animation: 'dpBeatIn 0.5s ease both' }}>
                    {[['NABIDH ✓', INDIGO], ['DHA ✓', TEAL], ['FHIR R4 ✓', GREEN]].map(([l, c]) => (
                      <div key={l} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />
                        <span style={{ fontSize: 8.5, fontWeight: 700, color: c }}>{l}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 7 — AI Coding: IPD-focused, inpatient ICD sequencing + live IR-DRG + big fonts */
function CodingScreen({ progress }) {
  const p = progress;

  const typeColor = (t) => t === 'Principal' ? TEAL : t === 'MCC' ? RED : t === 'CC' ? AMBER : MUTED;

  // IPD patient: Pneumonia + COPD + comorbidities
  const ipdICD = [
    { code: 'J18.9', desc: 'Pneumonia — unspecified organism',  type: 'Principal', conf: 97, col: RED,    show: 0.06 },
    { code: 'J44.1', desc: 'COPD with acute exacerbation',       type: 'MCC',      conf: 94, col: AMBER,  show: 0.20 },
    { code: 'I10',   desc: 'Essential hypertension',              type: 'CC',       conf: 90, col: TEAL,   show: 0.33 },
    { code: 'E11.9', desc: 'Type 2 DM — without complications',   type: 'CC',       conf: 81, col: PURPLE, show: 0.44 },
  ];

  const showDRG    = p >= 0.54;
  const showSubmit = p >= 0.70;
  const submitted  = p >= 0.80;
  const showImpact = p >= 0.76;

  const ipdCPT = [
    { code: '99233', desc: 'Subsequent hospital care — high complexity', col: PURPLE, show: 0.14 },
    { code: '71046', desc: 'Chest X-ray — 2 views',                      col: INDIGO, show: 0.26 },
    { code: '94640', desc: 'Respiratory treatment — nebulizer therapy',   col: TEAL,   show: 0.38 },
    { code: '85025', desc: 'CBC with differential',                       col: AMBER,  show: 0.49 },
  ];

  return (
    <ProductShell breadcrumb="AI Coding · IR-DRG Engine" color={PURPLE}>
      <div style={{ padding: '12px 16px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: PURPLE, letterSpacing: 1, textTransform: 'uppercase' }}>Inpatient AI Coding · IR-DRG Live</div>
            <div style={{ fontSize: 8.5, color: DIM, marginTop: 2 }}>K.A. · 58 yrs · Respiratory IPD · Thiqa SEHA · MRN: UH-2024-5512</div>
          </div>
          <div style={{ background: showDRG ? `${PURPLE}18` : 'rgba(0,0,0,0.03)', border: `1px solid ${showDRG ? PURPLE + '50' : BORDER}`, borderRadius: 10, padding: '6px 18px', textAlign: 'center', flexShrink: 0, transition: 'all 0.7s' }}>
            <div style={{ fontSize: 8, color: MUTED, letterSpacing: 0.8, marginBottom: 1 }}>IR-DRG WEIGHT</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: showDRG ? PURPLE : DIM, fontFamily: 'Sora', lineHeight: 1, transition: 'color 0.8s', textShadow: showDRG ? `0 0 26px ${PURPLE}70` : 'none' }}>
              {showDRG ? <CountUp value="1.34" duration={800} key="drg" /> : '0.94'}
            </div>
            <div style={{ fontSize: 7.5, color: showDRG ? GREEN : DIM, marginTop: 2, fontWeight: 700 }}>{showDRG ? '+42% uplift · vs. baseline' : 'baseline · CCs unmapped'}</div>
          </div>
        </div>

        {/* Two-column: ICD list | DRG computation */}
        <div style={{ display: 'flex', gap: 12, flex: 1, overflow: 'hidden' }}>

          {/* ── LEFT: IPD ICD-10-CM + CPT ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: PURPLE, letterSpacing: 0.6 }}>ICD-10-CM + CPT</span>
              <span style={{ fontSize: 6.5, fontWeight: 800, color: GREEN, background: `${GREEN}12`, border: `1px solid ${GREEN}30`, borderRadius: 10, padding: '2px 8px', animation: 'dpBeatIn 0.4s ease both' }}>AUTO-GENERATED · 0 MANUAL ENTRY</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {ipdICD.map((c, i) => {
                const vis = p >= c.show;
                const act = p >= c.show && p < c.show + 0.12;
                return vis ? (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 13px', borderRadius: 10, background: act ? `${c.col}16` : `${c.col}08`, border: `1px solid ${act ? c.col + '55' : c.col + '22'}`, transition: 'all 0.45s ease', animation: 'dpRowBlurIn 0.45s ease both', boxShadow: act ? `0 0 18px ${c.col}28` : 'none' }}>
                    {/* Sequence number */}
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: `${c.col}22`, border: `1.5px solid ${c.col}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: c.col }}>{i + 1}</span>
                    </div>
                    {/* Code */}
                    <span style={{ fontSize: 15, fontWeight: 900, color: c.col, fontFamily: 'Sora', flexShrink: 0, letterSpacing: -0.5 }}>{c.code}</span>
                    {/* Description */}
                    <span style={{ fontSize: 10, color: act ? TXT : `${TXT}cc`, flex: 1, lineHeight: 1.4 }}>{c.desc}</span>
                    {/* Type badge */}
                    <span style={{ fontSize: 8, fontWeight: 800, color: typeColor(c.type), background: `${typeColor(c.type)}18`, border: `1px solid ${typeColor(c.type)}35`, borderRadius: 5, padding: '3px 9px', flexShrink: 0 }}>{c.type}</span>
                    {/* Confidence bar */}
                    <div style={{ width: 56, display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                      <div style={{ height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${c.conf}%`, background: c.col, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 8, fontWeight: 700, color: c.col, textAlign: 'right' }}>{c.conf}%</span>
                    </div>
                  </div>
                ) : null;
              })}
            </div>

            {/* ── CPT — Procedures (appear early, synced to VO "Every procedure, a CPT") ── */}
            {p >= 0.12 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ fontSize: 8, fontWeight: 800, color: INDIGO, letterSpacing: 0.6, flexShrink: 0, marginTop: 4, borderTop: `1px solid ${BORDER}`, paddingTop: 6 }}>CPT — PROCEDURES</div>
                {ipdCPT.map((c, i) => {
                  const vis = p >= c.show;
                  return vis ? (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', borderRadius: 8, background: `${c.col}08`, border: `1px solid ${c.col}22`, animation: 'dpRowBlurIn 0.4s ease both' }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: c.col, fontFamily: 'Sora', flexShrink: 0, letterSpacing: -0.5 }}>{c.code}</span>
                      <span style={{ fontSize: 8.5, color: TXT, flex: 1, lineHeight: 1.4 }}>{c.desc}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* ── DIVIDER ── */}
          <div style={{ width: 1, background: BORDER, flexShrink: 0 }} />

          {/* ── RIGHT: IR-DRG weight computation ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: MUTED, letterSpacing: 0.6, flexShrink: 0 }}>IR-DRG WEIGHT — LIVE COMPUTATION</div>

            {showDRG ? (
              <>
                {/* Before / After tiles */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ flex: 1, background: `${RED}0c`, border: `1px solid ${RED}28`, borderRadius: 12, padding: '14px 12px', textAlign: 'center', animation: 'dpBeatIn 0.4s ease both' }}>
                    <div style={{ fontSize: 9, color: MUTED, marginBottom: 5, letterSpacing: 0.5 }}>BEFORE CDI</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: RED, fontFamily: 'Sora', lineHeight: 1 }}>0.94</div>
                    <div style={{ fontSize: 8, color: DIM, marginTop: 4 }}>J18.9 only · CCs missed</div>
                  </div>
                  <div style={{ fontSize: 24, color: PURPLE, flexShrink: 0 }}>→</div>
                  <div style={{ flex: 1, background: `${PURPLE}12`, border: `1px solid ${PURPLE}45`, borderRadius: 12, padding: '14px 12px', textAlign: 'center', boxShadow: `0 0 24px ${PURPLE}22`, animation: 'dpSpringIn 0.55s ease both' }}>
                    <div style={{ fontSize: 9, color: MUTED, marginBottom: 5, letterSpacing: 0.5 }}>AFTER CDI</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: PURPLE, fontFamily: 'Sora', lineHeight: 1, textShadow: `0 0 30px ${PURPLE}70` }}>
                      <CountUp value="1.34" duration={700} key="drg-after" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4, alignItems: 'center' }}>
                      <div style={{ fontSize: 8, color: DIM }}>All comorbidities captured ✓</div>
                      <span style={{ fontSize: 9, fontWeight: 800, color: GREEN, background: `${GREEN}14`, border: `1px solid ${GREEN}30`, borderRadius: 8, padding: '2px 8px', animation: 'dpSpringIn 0.6s ease both' }}>+42% DRG uplift</span>
                    </div>
                  </div>
                </div>

                {/* CC/MCC breakdown pills */}
                <div style={{ display: 'flex', gap: 7 }}>
                  {[
                    { label: 'Base DRG',   val: '0.94',  col: MUTED },
                    { label: 'MCC (J44.1)',val: '+0.22', col: RED },
                    { label: 'CC (I10)',   val: '+0.10', col: AMBER },
                    { label: 'CC (E11.9)',  val: '+0.08', col: TEAL },
                  ].map(({ label, val, col }) => (
                    <div key={label} style={{ flex: 1, background: `${col}0a`, border: `1px solid ${col}25`, borderRadius: 8, padding: '7px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: col, fontFamily: 'Sora' }}>{val}</div>
                      <div style={{ fontSize: 7, color: DIM, marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* NCCI/MUE mini check */}
                <div style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}25`, borderRadius: 9, padding: '9px 12px', animation: 'dpBeatIn 0.4s ease both' }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: GREEN, letterSpacing: 0.5, marginBottom: 5 }}>NCCI / MUE EDITS — PRE-SUBMISSION</div>
                  {[
                    { check: 'Principal + MCC pairing', status: 'Validated ✓', col: GREEN },
                    { check: 'CC combination (I10 + E11.9)', status: 'Allowed ✓', col: GREEN },
                    { check: 'MUE unit limits', status: 'Within policy ✓', col: TEAL },
                  ].map((e, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: i < 2 ? 4 : 0 }}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: e.col, flexShrink: 0 }}>{e.status}</span>
                      <span style={{ fontSize: 9, color: DIM, flex: 1 }}>{e.check}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, opacity: 0.4 }}>
                <div style={{ fontSize: 13, color: DIM }}>Mapping comorbidities…</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: PURPLE, animation: `dpPulse 1.2s ease ${i * 0.3}s infinite` }} />)}
                </div>
              </div>
            )}

            {/* One-click submission button */}
            {showSubmit && (
              <div style={{ animation: 'dpBeatIn 0.5s ease both' }}>
                <div
                  key={submitted ? 'submitted' : 'ready'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px 16px', borderRadius: 10,
                    background: submitted ? `${GREEN}14` : `${PURPLE}14`,
                    border: `1.5px solid ${submitted ? GREEN + '55' : PURPLE + '55'}`,
                    cursor: 'default',
                    animation: submitted ? 'dpClickPop 0.4s ease both' : 'dpSpringIn 0.55s cubic-bezier(0.34,1.4,0.64,1) both',
                    transition: 'background 0.4s, border-color 0.4s',
                    boxShadow: submitted ? `0 0 18px ${GREEN}30` : `0 0 14px ${PURPLE}20`,
                  }}
                >
                  {submitted ? (
                    <>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${GREEN}25`, border: `1.5px solid ${GREEN}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 8, color: GREEN, fontWeight: 900 }}>✓</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 9.5, fontWeight: 800, color: GREEN }}>Submitted to Payer</div>
                        <div style={{ fontSize: 7, color: DIM, marginTop: 1 }}>Response received · 3.2s · NCCI/MUE cleared</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: PURPLE, animation: 'dpPulse 1.1s ease-in-out infinite', flexShrink: 0 }} />
                      <span style={{ fontSize: 9.5, fontWeight: 800, color: PURPLE }}>Submit Codes to Payer →</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Revenue impact */}
            {showImpact && (
              <div style={{ textAlign: 'center', animation: 'dpSpringIn 0.7s cubic-bezier(0.34,1.4,0.64,1) both', paddingTop: 4 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: GREEN, fontFamily: 'Sora', letterSpacing: -2, lineHeight: 1, textShadow: `0 0 50px ${GREEN}80` }}>+AED 18,400</div>
                <div style={{ fontSize: 9, color: DIM, marginTop: 4 }}>per case · captured live while patient is admitted</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProductShell>
  );
}

/* Scene 8 — Denial Intelligence: per payor per batch, % view, recoverable surfaced */
function DenialScreen({ progress }) {
  const payors = [
    { name: 'Daman',     batch: '#B-2847', denial: '23%', trend: [28, 25, 23], topReason: 'Medical Necessity', code: 'CARC 50', recoverable: '67%', recCol: AMBER, col: RED,    show: 0.06 },
    { name: 'Thiqa',     batch: '#B-1923', denial: '18%', trend: [24, 21, 18], topReason: 'Auth Missing',      code: 'CARC 15', recoverable: '82%', recCol: GREEN, col: AMBER,  show: 0.22 },
    { name: 'AXA Gulf',  batch: '#B-0441', denial: '31%', trend: [35, 33, 31], topReason: 'Bundled Service',   code: 'CARC 97', recoverable: '54%', recCol: AMBER, col: PURPLE, show: 0.38 },
    { name: 'Oman Ins.', batch: '#B-3301', denial: '12%', trend: [18, 15, 12], topReason: 'Code Modifier',     code: 'CARC 4',  recoverable: '91%', recCol: GREEN, col: GREEN,  show: 0.54 },
  ];
  const summaryShow = progress >= 0.68;
  return (
    <ProductShell breadcrumb="Payer Contract Intelligence" color={RED}>
      <div style={{ padding: '10px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, fontSize: 8, color: MUTED, fontWeight: 700, letterSpacing: 0.5 }}>DENIAL PATTERN ANALYSIS · PER PAYER · PER BATCH</div>
          {progress >= 0.04 && (
            <div style={{ fontSize: 7, color: RED, fontWeight: 700, background: `${RED}12`, border: `1px solid ${RED}30`, borderRadius: 4, padding: '2px 8px', animation: 'dpBeatIn 0.3s ease both' }}>● LIVE — Current Cycle</div>
          )}
        </div>

        {/* Column headers */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', borderBottom: `1px solid ${BORDER}` }}>
          {['Payor · Batch', 'Denial %', 'Trend (3 batches)', 'Top Denial Reason', '% Recoverable'].map((h, i) => (
            <div key={i} style={{ flex: i === 2 ? 1.4 : i === 3 ? 1.8 : 1, fontSize: 7, color: MUTED, fontWeight: 700, letterSpacing: 0.3, padding: '3px 0' }}>{h}</div>
          ))}
        </div>

        {/* Payor rows — one spotlit at a time */}
        {payors.map((p, i) => {
          const visible = progress >= p.show;
          const active = spot(progress, p.show, p.show + 0.16);
          const past = progress > p.show + 0.16;
          return (
            <div key={i} style={{ ...glow(active, p.col, { borderRadius: 8, padding: '9px 12px', display: 'flex', alignItems: 'center' }), opacity: visible ? (past ? 0.6 : 1) : 0, transform: visible ? (active ? 'scale(1.02)' : 'scale(1)') : 'translateY(10px)', transition: 'all 0.5s cubic-bezier(0.34,1.2,0.64,1)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: active ? p.col : TXT, transition: 'color 0.3s' }}>{p.name}</div>
                <div style={{ fontSize: 7, color: DIM, marginTop: 1 }}>{p.batch} · {p.code}</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: p.col, fontFamily: 'Sora', lineHeight: 1 }}>{p.denial}</div>
                <div style={{ fontSize: 6, color: DIM }}>this batch</div>
              </div>
              <div style={{ flex: 1.4, paddingRight: 8 }}>
                <svg width="100%" height="26" viewBox="0 0 62 26" preserveAspectRatio="none">
                  <polyline points={p.trend.map((v, j) => `${j * 30},${24 - (v / 40) * 20}`).join(' ')} fill="none" stroke={p.col} strokeWidth="2" strokeLinejoin="round" opacity="0.9" />
                  {p.trend.map((v, j) => <circle key={j} cx={j * 30} cy={24 - (v / 40) * 20} r={j === 2 ? 3 : 2} fill={p.col} opacity={j === 2 ? 1 : 0.4} />)}
                  <text x="0" y="26" fontSize="5" fill="#475569">B1</text>
                  <text x="25" y="26" fontSize="5" fill="#475569">B2</text>
                  <text x="51" y="26" fontSize="5" fill="#475569">B3↓</text>
                </svg>
              </div>
              <div style={{ flex: 1.8 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: active ? TXT : DIM }}>{p.topReason}</div>
                <div style={{ fontSize: 7, color: DIM, marginTop: 1 }}>flagged pre-submission</div>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: p.recCol, fontFamily: 'Sora' }}>{p.recoverable}</div>
                <div style={{ fontSize: 6, color: DIM }}>recoverable</div>
              </div>
            </div>
          );
        })}

        {/* Summary row */}
        {summaryShow && (
          <div style={{ display: 'flex', gap: 8, animation: 'dpBeatIn 0.5s ease both' }}>
            <div style={{ flex: 1, background: `${GREEN}10`, border: `1px solid ${GREEN}30`, borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 8, color: MUTED, marginBottom: 2 }}>Recoverable this cycle</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: GREEN, fontFamily: 'Sora', lineHeight: 1 }}>AED 214K</div>
              <div style={{ fontSize: 7, color: DIM, marginTop: 2 }}>flagged pre-submission · 4 payors</div>
            </div>
            <div style={{ flex: 1, background: `${TEAL}10`, border: `1px solid ${TEAL}30`, borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 8, color: MUTED, marginBottom: 2 }}>Batch-over-batch trend</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: TEAL, fontFamily: 'Sora', lineHeight: 1 }}>↓ 30%</div>
              <div style={{ fontSize: 7, color: DIM, marginTop: 2 }}>denial rate reduction · systemic</div>
            </div>
          </div>
        )}

        {/* ── Appeal Snapshot — product transition showing one-click recovery ── */}
        {progress >= 0.76 && (
          <div style={{ position: 'relative', background: 'rgba(0,0,0,0.03)', border: `1px solid ${TEAL}30`, borderRadius: 10, padding: '10px 14px', animation: 'dpSpringIn 0.65s cubic-bezier(0.34,1.2,0.64,1) both', overflow: 'hidden' }}>
            {/* Subtle shimmer sweep */}
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent 0%, ${TEAL}08 50%, transparent 100%)`, animation: 'dpChromeShimmer 2.4s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ fontSize: 7.5, fontWeight: 800, color: TEAL, letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' }}>One-Click Recovery · Patient F.H. · Daman CARC 97</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {[
                { label: 'Denial Parsed',     detail: 'CARC 97 · bundling',    col: RED,    done: progress >= 0.76 },
                { label: 'Contract Read',      detail: '847 clauses · 0.3s',   col: TEAL,   done: progress >= 0.82 },
                { label: 'Clause Matched',     detail: 'Clause 4.1.2 cited',   col: GREEN,  done: progress >= 0.88 },
                { label: 'Appeal Generated',   detail: 'Letter ready · filed', col: AMBER,  done: progress >= 0.94 },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', border: `1.5px solid ${s.done ? s.col : MUTED + '30'}`, background: s.done ? `${s.col}20` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s ease', boxShadow: s.done ? `0 0 12px ${s.col}40` : 'none' }}>
                    <span style={{ fontSize: 10, color: s.done ? s.col : MUTED + '40', transition: 'all 0.4s' }}>{s.done ? '✓' : String(i + 1)}</span>
                  </div>
                  <div style={{ fontSize: 6.5, fontWeight: 700, color: s.done ? TXT : DIM, textAlign: 'center', transition: 'color 0.4s' }}>{s.label}</div>
                  <div style={{ fontSize: 5.5, color: DIM, textAlign: 'center' }}>{s.detail}</div>
                  {i < 3 && <div style={{ position: 'absolute', top: 14, left: `${25 * i + 14}%`, width: '12%', height: 1, background: s.done && progress >= 0.76 + (i + 1) * 0.06 ? `${s.col}50` : `${BORDER}` }} />}
                </div>
              ))}
            </div>
            {progress >= 0.96 && (
              <div style={{ marginTop: 8, textAlign: 'center', animation: 'dpSpringIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both' }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: GREEN }}>✅ AED 1,900 Recovered · 30 seconds · vs. 3 weeks manual</span>
              </div>
            )}
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 9 — Claim Recovery: step-by-step appeal generation, clause citation, letter preview */
function ClaimScreen({ progress }) {
  const step1 = progress >= 0.14; // denial parsed
  const step2 = progress >= 0.28; // contract searched
  const step3 = progress >= 0.42; // clause matched
  const step4 = progress >= 0.58; // letter generated
  const recovered = progress >= 0.74;
  const steps = [
    { label: 'Denial parsed',     detail: 'CARC 97 · Bundled service · Daman batch #B-2847', done: step1, col: INDIGO },
    { label: 'Contract searched', detail: 'Daman Benefit Schedule 2024 · 847 clauses scanned in 0.3s', done: step2, col: TEAL },
    { label: 'Clause matched',    detail: 'Clause 4.1.2 — standalone DM with HbA1c review', done: step3, col: GREEN },
    { label: 'Appeal generated',  detail: 'Letter drafted · supporting docs attached · ready to file', done: step4, col: AMBER },
  ];
  return (
    <ProductShell breadcrumb="Claim Recovery — Appeal Generator" color={TEAL}>
      <div style={{ padding: '11px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 9 }}>

        {/* Denied claim header */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: `${RED}0a`, border: `1px solid ${RED}28`, borderRadius: 9, padding: '9px 13px', flexShrink: 0, animation: 'dpRowIn 0.4s ease both' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
              <Badge text="DENIED · CARC 97" color={RED} />
              <Pill text="OPD" color={INDIGO} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: TXT }}>F.H. · Daman Enhanced · DM Management Visit</div>
            <div style={{ fontSize: 8, color: DIM, marginTop: 2 }}>Bundled service — standalone DM visit with HbA1c review denied under office visit bundling rule</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: RED, fontFamily: 'Sora', lineHeight: 1 }}>AED 1,900</div>
            <div style={{ fontSize: 7, color: DIM }}>at risk</div>
          </div>
        </div>

        {/* Two-panel: builder steps + appeal letter */}
        <div style={{ flex: 1, display: 'flex', gap: 10, minHeight: 0 }}>

          {/* Left: Appeal builder steps */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 8, color: MUTED, fontWeight: 700, letterSpacing: 0.5, flexShrink: 0 }}>APPEAL BUILDER · ONE CLICK</div>
            {steps.map((s, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center', padding: '8px 10px', background: s.done ? `${s.col}12` : 'rgba(0,0,0,0.02)', border: `1px solid ${s.done ? s.col + '40' : BORDER}`, borderRadius: 8, transition: 'all 0.5s ease' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `1.5px solid ${s.done ? s.col : MUTED}`, background: s.done ? `${s.col}22` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.4s ease' }}>
                  <span style={{ fontSize: 9, color: s.done ? s.col : MUTED, fontWeight: 800 }}>{s.done ? '✓' : i + 1}</span>
                </div>
                <div style={{ opacity: s.done ? 1 : 0.35, transition: 'opacity 0.4s' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: s.done ? TXT : MUTED }}>{s.label}</div>
                  <div style={{ fontSize: 7, color: DIM, marginTop: 1 }}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Auto-generated appeal letter */}
          <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: 6, background: `${TEAL}07`, border: `1px solid ${step4 ? TEAL + '45' : step1 ? TEAL + '18' : BORDER}`, borderRadius: 10, padding: '11px 13px', transition: 'border-color 0.6s ease', overflow: 'hidden' }}>
            <div style={{ fontSize: 7, color: TEAL, fontWeight: 800, letterSpacing: 1, flexShrink: 0 }}>AUTO-GENERATED APPEAL LETTER</div>

            <div style={{ flex: 1, fontSize: 8, color: DIM, lineHeight: 1.75, overflow: 'hidden' }}>
              <div style={{ fontSize: 9, color: TXT, fontWeight: 700, marginBottom: 5 }}>RE: Claim #DM-2847-FH · CARC 97 Dispute</div>
              {step1 && (
                <div style={{ animation: 'dpBeatIn 0.3s ease both' }}>
                  Dear Daman Medical Claims Review,<br />
                  We formally dispute the denial of claim #DM-2847-FH dated 14 Dec 2024.
                </div>
              )}
              {step3 && (
                <div style={{ margin: '7px 0', background: `${GREEN}14`, border: `1px solid ${GREEN}35`, borderRadius: 6, padding: '6px 9px', animation: 'dpBeatIn 0.35s ease both' }}>
                  <div style={{ fontSize: 7, color: GREEN, fontWeight: 800, marginBottom: 3 }}>CONTRACT CLAUSE CITED</div>
                  <div style={{ fontSize: 8, color: TXT, lineHeight: 1.6 }}>
                    Daman Benefit Schedule 2024, <span style={{ color: GREEN, fontWeight: 800 }}>Clause 4.1.2</span> — standalone DM management with documented HbA1c review is <span style={{ color: GREEN, fontWeight: 800 }}>not bundled</span> under office visit codes.
                  </div>
                </div>
              )}
              {step4 && (
                <div style={{ animation: 'dpBeatIn 0.3s ease both' }}>
                  Supporting docs attached: physician notes, HbA1c report, DHA guidelines Ref. <span style={{ color: TEAL }}>DHA-CDI-2024-11</span>.
                </div>
              )}
            </div>

            {recovered && (
              <div style={{ background: `${GREEN}1a`, border: `1px solid ${GREEN}55`, borderRadius: 7, padding: '8px 11px', animation: 'dpBeatIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: GREEN }}>✅ Appeal Filed · AED 1,900 in Recovery</div>
                <div style={{ fontSize: 7, color: DIM, marginTop: 2 }}>30 seconds · vs. 3–6 weeks manual · 100% contract-cited</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProductShell>
  );
}

/* Scene 10 — AI Agent Workforce: clinical signals → multi-agent processing → revenue + referral actions */
function TowerScreen({ progress }) {
  const p = progress;

  // Clinical signals — raw EMR data feeding into AI
  const signals = [
    { id: 'dk', init: 'D.K.', dept: 'Respiratory', risk: 'HIGH',     col: TEAL,   show: 0.08,
      signal: 'SpO₂ 94→88% over 4h',    agent: 'CDI Agent',       action: 'DRG Escalation',    referral: 'ICU consult triggered',   uplift: '+AED 18K', guideline: 'ATS/ERS: SpO₂ <90% → ICU review' },
    { id: 'nm', init: 'N.M.', dept: 'Cardiology',  risk: 'CRITICAL', col: RED,    show: 0.26,
      signal: 'BNP risen 3× — HF likely', agent: 'Coding Agent',   action: 'MCC documented',    referral: 'Cardiology specialist',   uplift: '+AED 32K', guideline: 'ACC/AHA: BNP >500 → specialist pathway' },
    { id: 'ar', init: 'A.R.', dept: 'Neurology',   risk: 'HIGH',     col: INDIGO, show: 0.44,
      signal: 'GCS Δ Day 2 · LOS ext.',  agent: 'CDI Agent',       action: 'CC query opened',   referral: 'Neuro CDI team',          uplift: '+AED 14K', guideline: 'AAN: GCS Day 2 → MCC eligible' },
    { id: 'bs', init: 'B.S.', dept: 'Oncology',    risk: 'MED',      col: PURPLE, show: 0.62,
      signal: 'ECOG 1→2 · chemo eligible', agent: 'PA Agent',      action: 'Pre-auth filed',    referral: 'Systemic therapy pathway', uplift: '+AED 27K', guideline: 'ESMO: ECOG 1→2 → systemic therapy' },
  ];

  // AI Agent types shown in center hub
  const agents = [
    { name: 'CDI Agent',    icon: '📋', col: AMBER,  active: p >= 0.10 },
    { name: 'Coding Agent', icon: '🔢', col: PURPLE, active: p >= 0.28 },
    { name: 'PA Agent',     icon: '📤', col: GREEN,  active: p >= 0.46 },
    { name: 'Ops Agent',    icon: '📊', col: TEAL,   active: p >= 0.64 },
  ];

  const summaryShow = p >= 0.80;
  const logoShow    = p >= 0.90;

  return (
    <ProductShell breadcrumb="AI Agent Workforce · Clinical Intelligence" color={INDIGO}>
      <div style={{ padding: '10px 14px 38px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, color: INDIGO, letterSpacing: 1, textTransform: 'uppercase' }}>AI Agent Workforce</div>
            <div style={{ fontSize: 8, color: DIM, marginTop: 2 }}>Clinical signals → disease progression mapped → referrals + revenue surfaced · Day Zero</div>
          </div>
          {p >= 0.06 && (
            <div style={{ background: `${INDIGO}15`, border: `1px solid ${INDIGO}40`, borderRadius: 10, padding: '6px 16px', textAlign: 'center', animation: 'dpSpringIn 0.5s ease both', flexShrink: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: INDIGO, fontFamily: 'Sora', lineHeight: 1 }}>4</div>
              <div style={{ fontSize: 7, color: DIM }}>agents active</div>
            </div>
          )}
        </div>

        {/* ── 3-column flow: Clinical Signals | AI Agents | Revenue Actions ── */}
        <div style={{ flex: 1, display: 'flex', gap: 8, overflow: 'hidden' }}>

          {/* ── LEFT: Clinical Signal Feed ── */}
          <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, color: MUTED, letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' }}>Clinical Signals</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {signals.map((s, i) => {
                const vis  = p >= s.show;
                const act  = spot(p, s.show, s.show + 0.18);
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 10px', borderRadius: 9, background: act ? `${s.col}12` : vis ? `${s.col}06` : 'rgba(0,0,0,0.02)', border: `1px solid ${act ? s.col + '45' : vis ? s.col + '20' : BORDER}`, opacity: vis ? 1 : 0.2, transform: vis ? 'translateX(0)' : 'translateX(-12px)', transition: 'all 0.55s cubic-bezier(0.34,1.2,0.64,1)', boxShadow: act ? `0 0 18px ${s.col}20` : 'none' }}>
                    <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 3 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${s.col}20`, border: `1.5px solid ${s.col}45`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 8, fontWeight: 900, color: s.col }}>{s.init}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: act ? s.col : TXT }}>{s.dept}</div>
                        <span style={{ fontSize: 6.5, fontWeight: 800, color: s.risk === 'CRITICAL' ? RED : s.risk === 'HIGH' ? AMBER : GREEN }}>{s.risk}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 9, color: act ? TXT : DIM, lineHeight: 1.4, fontWeight: act ? 600 : 400 }}>{s.signal}</div>
                    <div style={{ fontSize: 6.5, color: `${s.col}90`, marginTop: 3, fontStyle: 'italic' }}>{s.guideline}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── CENTER: AI Agent Hub ── */}
          <div style={{ width: 90, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 24 }}>
            <div style={{ fontSize: 6.5, fontWeight: 700, color: MUTED, letterSpacing: 0.8, textAlign: 'center', textTransform: 'uppercase', marginBottom: 2 }}>AI Agents</div>
            {agents.map((ag, i) => (
              <div key={i} style={{ width: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: ag.active ? 1 : 0.25, transition: 'opacity 0.5s, transform 0.5s', transform: ag.active ? 'scale(1)' : 'scale(0.88)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: ag.active ? `${ag.col}20` : 'rgba(0,0,0,0.04)', border: `1.5px solid ${ag.active ? ag.col + '60' : BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: ag.active ? `0 0 16px ${ag.col}35` : 'none', transition: 'all 0.5s', animation: ag.active ? 'dpPulse 2s ease-in-out infinite' : 'none' }}>
                  {ag.icon}
                </div>
                <div style={{ fontSize: 6.5, fontWeight: 700, color: ag.active ? ag.col : DIM, textAlign: 'center', letterSpacing: 0.3 }}>{ag.name}</div>
                {/* Flow arrows left + right */}
                {ag.active && (
                  <>
                    <div style={{ position: 'absolute', left: 0, width: '100%', height: 1 }} />
                  </>
                )}
              </div>
            ))}
            {/* Central pulse */}
            {p >= 0.18 && (
              <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                <div style={{ fontSize: 6, color: INDIGO, fontWeight: 700, letterSpacing: 0.5 }}>PROCESSING</div>
                <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: INDIGO, animation: `dpPulse 1.2s ease-in-out ${i * 0.3}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Revenue & Referral Actions ── */}
          <div style={{ flex: 1.15, display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, color: MUTED, letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' }}>Revenue Actions</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {signals.map((s, i) => {
                const vis  = p >= s.show + 0.08;
                const act  = spot(p, s.show + 0.08, s.show + 0.28);
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 10px', borderRadius: 9, background: act ? `${s.col}12` : vis ? `${s.col}06` : 'rgba(0,0,0,0.02)', border: `1px solid ${act ? s.col + '45' : vis ? s.col + '20' : BORDER}`, opacity: vis ? 1 : 0.15, transform: vis ? 'translateX(0)' : 'translateX(12px)', transition: 'all 0.55s cubic-bezier(0.34,1.2,0.64,1)', boxShadow: act ? `0 0 18px ${s.col}20` : 'none' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 7, fontWeight: 800, color: s.col, background: `${s.col}18`, border: `1px solid ${s.col}35`, borderRadius: 4, padding: '2px 8px', flexShrink: 0 }}>{s.action}</span>
                      <div style={{ fontSize: 7, color: DIM, flex: 1 }}>{s.agent}</div>
                    </div>
                    <div style={{ fontSize: 8.5, color: act ? TXT : DIM, fontWeight: 600, marginBottom: 2 }}>{s.referral}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: s.col, fontFamily: 'Sora', lineHeight: 1, letterSpacing: -0.5 }}>{s.uplift}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Measurable outcome strip ── */}
        {summaryShow && (
          <div style={{ display: 'flex', gap: 7, flexShrink: 0, animation: 'dpSpringIn 0.65s cubic-bezier(0.34,1.2,0.64,1) both' }}>
            <div style={{ flex: 1, background: `${INDIGO}12`, border: `1px solid ${INDIGO}30`, borderRadius: 9, padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: INDIGO, fontFamily: 'Sora', letterSpacing: -1 }}>AED 91K</div>
              <div style={{ fontSize: 7, color: DIM, marginTop: 1 }}>revenue surfaced · 4 patients · live</div>
            </div>
            <div style={{ flex: 1, background: `${TEAL}10`, border: `1px solid ${TEAL}28`, borderRadius: 9, padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: TEAL, fontFamily: 'Sora' }}>Day 0</div>
              <div style={{ fontSize: 7, color: DIM, marginTop: 1 }}>signal → action · no lag · no reports</div>
            </div>
            <div style={{ flex: 1.4, background: `${PURPLE}10`, border: `1px solid ${PURPLE}28`, borderRadius: 9, padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: PURPLE, marginBottom: 2 }}>Predictable Revenue Pipeline</div>
              <div style={{ fontSize: 7, color: DIM }}>clinical intelligence → referral triage → admission potential → DRG uplift — automated end to end</div>
            </div>
          </div>
        )}

        {/* ── Docstribe closing wordmark ── */}
        {logoShow && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse 85% 75% at 50% 50%, rgba(248,250,252,0.97) 0%, rgba(241,245,249,0.92) 100%)', zIndex: 30, animation: 'dpLogoReveal 1.4s cubic-bezier(0.34,1.1,0.64,1) both', backdropFilter: 'blur(8px)', borderRadius: 8, pointerEvents: 'none', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 52, fontWeight: 900, fontFamily: 'Sora', background: `linear-gradient(135deg,#0f172a 20%,${TEAL} 55%,${INDIGO})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -2.5, lineHeight: 1 }}>Docstribe</div>
            <div style={{ fontSize: 12, color: DIM, fontWeight: 600, letterSpacing: 0.4, marginTop: 12, opacity: 0.92, fontStyle: 'italic', maxWidth: 480, textAlign: 'center', lineHeight: 1.6 }}>Not a generic system. Built specifically for your hospital's case mix, physicians, and payer contracts.</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['↓30% Denials', '99% Clean Claim Rate', 'CMI +0.15', '60-Day Guarantee'].map((t, i) => (
                <span key={i} style={{ fontSize: 8.5, fontWeight: 700, color: TEAL, background: `${TEAL}14`, border: `1px solid ${TEAL}35`, borderRadius: 20, padding: '5px 14px', animation: `dpSpringIn 0.5s cubic-bezier(0.34,1.4,0.64,1) ${0.12 + i * 0.1}s both` }}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 11 — RCM Intelligence Partner: personalized framework positioning */
function DashboardScreen({ progress }) {
  const headerShow = progress >= 0.04;
  const intelligenceLayers = [
    {
      icon: '🏥',
      label: 'Your Payer Intelligence',
      detail: 'Daman · Thiqa · AXA Gulf · contract-calibrated denial prevention per batch',
      metric: '4 payors · 847 rules loaded',
      col: TEAL,
      show: 0.06,
    },
    {
      icon: '🩺',
      label: 'Your Physician Patterns',
      detail: 'CDI queries tuned to your top 20 physicians — specialty-specific, not generic',
      metric: '20 physicians profiled',
      col: INDIGO,
      show: 0.20,
    },
    {
      icon: '📊',
      label: 'Your Case Mix Intelligence',
      detail: 'IR-DRG optimization calibrated to your service line mix and payer contracts',
      metric: '6 service lines · live CMI tracking',
      col: PURPLE,
      show: 0.36,
    },
    {
      icon: '⚡',
      label: 'Your Clinical Signals',
      detail: 'Deterioration triggers tuned to your patient population — surfaces Day 0',
      metric: 'Real-time · no lag · no reports',
      col: AMBER,
      show: 0.52,
    },
  ];
  const brandShow = progress >= 0.72;
  const closingShow = progress >= 0.88;

  return (
    <ProductShell breadcrumb="Your RCM Intelligence Framework" color={TEAL}>
      <div style={{ padding: '10px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Brand wordmark — always at the TOP so it never overlaps the stat strip */}
        {headerShow && (
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, animation: 'dpBeatIn 0.9s cubic-bezier(0.34,1.2,0.64,1) both' }}>
            <div style={{ fontSize: 30, fontWeight: 900, fontFamily: 'Sora', background: `linear-gradient(135deg,#0f172a 20%,${TEAL} 55%,${INDIGO})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1.5, lineHeight: 1 }}>Docstribe</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[['Clinical Intelligence', TEAL], ['Financial Integrity', INDIGO], ['Built for You', PURPLE]].map(([t, c], i) => (
                <span key={i} style={{ fontSize: 8, fontWeight: 700, color: c, background: `${c}14`, border: `1px solid ${c}30`, borderRadius: 20, padding: '3px 10px' }}>{t}</span>
              ))}
            </div>
            <div style={{ fontSize: 9, color: DIM, textAlign: 'center', lineHeight: 1.4, maxWidth: 260 }}>
              Not a generic platform — a framework built around{' '}
              <span style={{ color: TEAL, fontWeight: 700 }}>your</span> payors, physicians, and case mix.
            </div>
          </div>
        )}

        {/* Intelligence layer cards — appear one by one */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
          {intelligenceLayers.map((layer, i) => {
            const show = progress >= layer.show;
            const active = spot(progress, layer.show, layer.show + 0.13);
            return (
              <div
                key={i}
                style={{
                  ...glow(active, layer.col, { borderRadius: 9, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 12 }),
                  opacity: show ? 1 : 0,
                  transform: show ? (active ? 'scale(1.03)' : 'scale(1)') : 'translateX(-18px) scale(0.95)',
                  transition: 'all 0.55s cubic-bezier(0.34,1.4,0.64,1)',
                  filter: show && !active ? 'brightness(0.72)' : 'brightness(1)',
                  flexShrink: 0,
                }}
              >
                {/* Icon bubble */}
                <div style={{ width: 34, height: 34, borderRadius: 8, background: `${layer.col}1a`, border: `1px solid ${layer.col}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {layer.icon}
                </div>
                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: layer.col, fontFamily: 'Sora', lineHeight: 1.2 }}>{layer.label}</div>
                  <div style={{ fontSize: 8, color: DIM, marginTop: 2, lineHeight: 1.4 }}>{layer.detail}</div>
                </div>
                {/* Metric badge */}
                <div style={{ background: `${layer.col}18`, border: `1px solid ${layer.col}30`, borderRadius: 6, padding: '4px 8px', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: layer.col, whiteSpace: 'nowrap' }}>{layer.metric}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing question — leaves the audience thinking */}
        {closingShow && (
          <div style={{ flexShrink: 0, paddingBottom: 6, animation: 'dpSpringIn 0.8s cubic-bezier(0.34,1.4,0.64,1) both' }}>
            <div style={{ background: `linear-gradient(135deg,${INDIGO}0d,${TEAL}08)`, border: `1px solid ${INDIGO}35`, borderRadius: 12, padding: '12px 20px', boxShadow: `0 0 24px ${INDIGO}12`, textAlign: 'center' }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: INDIGO, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 }}>Generic AI misses what is uniquely yours</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: TXT, lineHeight: 1.35, animation: 'dpEmergeStat 0.7s ease 0.3s both' }}>
                What revenue is your hospital{' '}
                <span style={{ color: INDIGO, textShadow: `0 0 18px ${INDIGO}55` }}>not seeing right now?</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* ─── Scene router ───────────────────────────────────────────── */
// Active scene IDs: 1(stat) 2(kpi) 4(eligibility) 6(ambient+CDI) 7(coding) 8(denial+recovery) 10(tower)
// Removed: 3(cases) 5(ambient standalone) 9(claim standalone) 11(dashboard)
function SceneVisual({ scene, progress }) {
  switch (scene.type) {
    case 'stat':      return <StatScene scene={scene} progress={progress} />;
    case 'kpi':       return <KPIScene  scene={scene} progress={progress} />;
    case 'dashboard': return <DashboardScreen progress={progress} />;
    case 'product':
      switch (scene.id) {
        case 4:  return <EligibilityScreen progress={progress} />;
        case 6:  return <CDIScreen         progress={progress} />;
        case 7:  return <CodingScreen      progress={progress} />;
        case 8:  return <DenialScreen      progress={progress} />;
        case 10: return <TowerScreen       progress={progress} />;
        default: return null;
      }
    default: return null;
  }
}

/* ─── Intro Splash ───────────────────────────────────────────── */
function Splash({ onPlay }) {
  return (
    <div onClick={onPlay} style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'radial-gradient(ellipse 90% 80% at 50% 45%,#e6f2ff 0%,#edf8f4 35%,#ece8ff 70%,#f0f5ff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(100,116,139,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(100,116,139,0.07) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      {/* Breathing ambient */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 55% 45% at 50% 50%,${TEAL}07 0%,transparent 70%)`, animation: 'dpBreath 4s ease-in-out infinite' }} />

      {/* Change 1 — 4 floating ambient orbs at corners */}
      {[
        { w:180, h:180, top:'8%',    left:'6%',   color:TEAL,   delay:'0s',   opacity:0.10 },
        { w:140, h:140, top:'12%',   right:'8%',  color:INDIGO, delay:'1.3s', opacity:0.09 },
        { w:220, h:220, bottom:'14%',left:'10%',  color:PURPLE, delay:'0.7s', opacity:0.07 },
        { w:160, h:160, bottom:'10%',right:'5%',  color:TEAL,   delay:'2s',   opacity:0.08 },
      ].map((orb,i) => (
        <div key={i} style={{
          position:'absolute',width:orb.w,height:orb.h,borderRadius:'50%',
          background:`radial-gradient(circle,${orb.color} 0%,transparent 70%)`,
          opacity:orb.opacity,top:orb.top,left:orb.left,right:orb.right,bottom:orb.bottom,
          animation:`dpBreath 4s ease-in-out ${orb.delay} infinite`,
          pointerEvents:'none',zIndex:0,
        }}/>
      ))}

      {/* Change 2 — Hospital network SVG: NY · Dubai · Mumbai */}
      <div style={{
        position:'absolute',bottom:'18%',left:'50%',transform:'translateX(-50%)',
        width:320,height:90,pointerEvents:'none',zIndex:1,opacity:0.55,
        animation:'dpBeatIn 1.2s ease 0.5s both',
      }}>
        <svg width="320" height="90" viewBox="0 0 320 90" fill="none" style={{overflow:'visible'}}>
          <path d="M 40 45 Q 130 5 210 45"  stroke={TEAL}   strokeWidth="1" strokeDasharray="4 5" opacity="0.5"/>
          <path d="M 210 45 Q 250 15 280 45" stroke={INDIGO} strokeWidth="1" strokeDasharray="4 5" opacity="0.5"/>
          <path d="M 40 45 Q 160 -5 280 45"  stroke={PURPLE} strokeWidth="0.8" strokeDasharray="3 7" opacity="0.22"/>
          {[
            {cx:40,  color:TEAL,  label:'USA',   hosp:'42+', delay:'0s'   },
            {cx:210, color:AMBER, label:'UAE',   hosp:'38+', delay:'0.4s' },
            {cx:280, color:INDIGO,label:'India', hosp:'25+', delay:'0.8s' },
          ].map((city,i) => (
            <g key={i}>
              <circle cx={city.cx} cy="45" r="9" fill={city.color} opacity="0.16"/>
              <circle cx={city.cx} cy="45" r="5" fill={city.color} opacity="0.9">
                <animate attributeName="r"       values="5;6.5;5"   dur={`${2.8+i*0.3}s`} begin={city.delay} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.9;1;0.9" dur={`${2.8+i*0.3}s`} begin={city.delay} repeatCount="indefinite"/>
              </circle>
              <text x={city.cx} y="62" textAnchor="middle" fontSize="7" fontWeight="700"
                    fontFamily="Sora,sans-serif" fill={TXT} opacity="0.7">{city.label}</text>
              <text x={city.cx} y="72" textAnchor="middle" fontSize="6"
                    fontFamily="Sora,sans-serif" fill={MUTED} opacity="0.6">{city.hosp} hosp</text>
            </g>
          ))}
        </svg>
      </div>

      <div style={{ fontSize: 9, fontWeight: 700, color: `${TEAL}90`, letterSpacing: 3, textTransform: 'uppercase', position: 'relative', zIndex: 2 }}>Clinical Intelligence Platform</div>
      {/* Change 3 — animated wordmark entrance */}
      <div style={{ fontSize: 44, fontWeight: 900, background: `linear-gradient(135deg,#0f172a 40%,${TEAL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1.5, lineHeight: 1, animation: 'dpLogoReveal 1.1s cubic-bezier(0.34,1.2,0.64,1) 0.2s both', position: 'relative', zIndex: 2 }}>Docstribe</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: TXT, textAlign: 'center', maxWidth: 460, lineHeight: 1.65 }}>
        Deployed across the US, UAE &amp; India — personalized clinical intelligence<br />
        for every patient, every payer, every physician.
      </div>
      {/* Feature pills */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 440 }}>
        {[['Clinical Intelligence', INDIGO], ['Patient Profiling', TEAL], ['60-Day Guarantee', AMBER]].map(([t, c]) => (
          <span key={t} style={{ fontSize: 9, fontWeight: 700, color: c, background: `${c}16`, border: `1px solid ${c}30`, borderRadius: 20, padding: '4px 12px' }}>{t}</span>
        ))}
      </div>
      {/* Change 4 — CountUp credential pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 440, position: 'relative', zIndex: 2 }}>
        {[
          { label:'US · UAE · India',   color:INDIGO, count:null },
          { label:' Hospitals',         color:TEAL,   count:'100', plus:true },
          { label:' Lives',             color:PURPLE, count:'10M', plus:true },
          { label:'30 Yrs Clinical Exp',color:AMBER,  count:null },
        ].map((item,i) => (
          <span key={i} style={{
            fontSize:8, fontWeight:700, color:item.color,
            background:`${item.color}12`, border:`1px solid ${item.color}28`,
            borderRadius:20, padding:'3px 10px', letterSpacing:0.3,
            animation:`dpSpringIn 0.6s cubic-bezier(0.34,1.4,0.64,1) ${i*0.12}s both`,
          }}>
            {item.count
              ? <><CountUp value={item.count} duration={1400}/>{item.plus&&'+'}{item.label}</>
              : item.label}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 8, padding: '13px 34px', borderRadius: 30, background: `linear-gradient(135deg,${TEAL},${INDIGO})`, color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 0.5, boxShadow: `0 0 40px ${TEAL}40`, display: 'flex', alignItems: 'center', gap: 8, animation: 'dpPulseScale 2s ease-in-out infinite' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
        Watch the Platform Demo
      </div>
    </div>
  );
}

/* ─── Scene stat strip — cinematic glass pill ─────────────────── */
function SceneStatStrip({ scene, progress }) {
  // Stat pill removed from all screens — each scene surface has its own inline context
  return null;
  const fired = (scene.beats || []).slice().reverse().find(b => progress >= b.at);
  if (!fired) return null;
  return (
    <div
      key={fired.stat}
      style={{
        position: 'absolute', bottom: 44, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 15,
        display: 'flex', gap: 10, alignItems: 'center',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        padding: '8px 22px',
        border: `1px solid ${scene.color}40`,
        boxShadow: `0 0 0 1px ${scene.color}15, 0 4px 16px ${scene.color}18, 0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)`,
        pointerEvents: 'none',
        animation: 'dpSpringIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both',
        maxWidth: '76%', whiteSpace: 'nowrap',
      }}
    >
      {/* Bloom dot */}
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: scene.color, boxShadow: `0 0 12px ${scene.color}, 0 0 24px ${scene.color}80`, flexShrink: 0, animation: 'dpPulse 1.6s ease-in-out infinite' }} />
      {/* Stat — hero scale */}
      <span style={{ fontSize: 18, fontWeight: 900, color: scene.color, fontFamily: 'Sora', letterSpacing: -0.5 }}>
        {fired.stat}
      </span>
      {fired.sub && <span style={{ fontSize: 9, color: DIM, overflow: 'hidden', textOverflow: 'ellipsis' }}>· {fired.sub}</span>}
    </div>
  );
}

/* ─── Sentence caption — sits at very bottom, above nav ─────── */
/* Caption now renders BELOW the video — no overlap with any screen */
function Caption({ sentence }) {
  return (
    <div key={sentence} style={{ textAlign: 'center', fontSize: 11, fontFamily: 'Sora', color: 'rgba(0,0,0,0.50)', fontStyle: 'italic', lineHeight: 1.55, animation: 'dpFadeCaption 0.35s ease both' }}>
      {highlightCaption(sentence)}
    </div>
  );
}

/* ═══════════════════ MAIN DEMO PLAYER ══════════════════════════ */
export default function DemoPlayer() {
  const [splashDone, setSplashDone] = useState(false);
  const [idx,        setIdx]        = useState(0);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [started,    setStarted]    = useState(false);
  const [exitIdx,    setExitIdx]    = useState(null);
  const [sentIdx,    setSentIdx]    = useState(0);
  const [clickHint,  setClickHint]  = useState(null); // 'play' | 'pause' | null

  const audioCtxRef    = useRef(null);
  const analyserRef    = useRef(null);
  const sourceRef      = useRef(null);
  const rafRef         = useRef(null);
  const t0Ref          = useRef(0);
  const durRef         = useRef(0);
  const firedRef       = useRef(new Set());
  const clickHintTimer = useRef(null);
  const audioCacheRef  = useRef(new Map()); // sceneId → decoded AudioBuffer

  const scene     = SCENES[idx];
  const sentences = splitSentences(scene.vo);

  const stopAudio = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (sourceRef.current) { try { sourceRef.current.stop(); } catch {} sourceRef.current = null; }
    setIsPlaying(false);
    setProgress(0);
    firedRef.current = new Set();
  }, []);

  useEffect(() => () => { cancelAnimationFrame(rafRef.current); if (sourceRef.current) try { sourceRef.current.stop(); } catch {} }, []);

  const goTo = useCallback((newIdx) => {
    stopAudio();
    setExitIdx(idx);
    setTimeout(() => setExitIdx(null), 550);
    setIdx(newIdx);
    setProgress(0);
    setSentIdx(0);
  }, [idx, stopAudio]);

  const autoAdvance = useCallback(() => {
    setTimeout(() => {
      setIdx(prev => {
        if (prev < SCENES.length - 1) {
          setExitIdx(prev);
          setTimeout(() => setExitIdx(null), 550);
          setProgress(0);
          setSentIdx(0);
          firedRef.current = new Set();
          return prev + 1;
        }
        return prev;
      });
    }, 800);
  }, []);

  const prefetchScene = useCallback(async (sceneIdx) => {
    if (sceneIdx >= SCENES.length) return;
    const s = SCENES[sceneIdx];
    if (audioCacheRef.current.has(s.id)) return; // already cached
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
    try {
      const res = await fetch('/api/demo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sceneId: s.id }),
      });
      if (!res.ok) return;
      const { audio } = await res.json();
      const buf = await audioCtxRef.current.decodeAudioData(b64ToArrayBuffer(audio));
      audioCacheRef.current.set(s.id, buf);
    } catch {} // best-effort — silent failure is fine
  }, []);

  const playScene = useCallback(async (sceneIdx) => {
    const s = SCENES[sceneIdx];
    const cached = audioCacheRef.current.get(s.id);
    if (!cached) setLoading(true); // only show spinner when we must fetch
    setStarted(true);
    firedRef.current = new Set();
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const an  = ctx.createAnalyser();
        an.fftSize = 256;
        an.connect(ctx.destination);
        audioCtxRef.current = ctx;
        analyserRef.current = an;
      }
      if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();

      let buf = cached;
      if (!buf) {
        const res = await fetch('/api/demo', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sceneId: s.id }),
        });
        if (!res.ok) throw new Error('audio fetch failed');
        const { audio } = await res.json();
        buf = await audioCtxRef.current.decodeAudioData(b64ToArrayBuffer(audio));
        audioCacheRef.current.set(s.id, buf); // store for instant replay
      }

      if (sourceRef.current) { try { sourceRef.current.stop(); } catch {} }
      cancelAnimationFrame(rafRef.current);

      const src  = audioCtxRef.current.createBufferSource();
      src.buffer = buf;
      src.connect(analyserRef.current);
      durRef.current = buf.duration;
      t0Ref.current  = audioCtxRef.current.currentTime;
      src.start(0);
      sourceRef.current = src;
      setLoading(false);
      setIsPlaying(true);

      const scSentences = splitSentences(s.vo);
      // Pre-compute cumulative word-count fractions so each sentence
      // gets screen time proportional to how long it takes to speak
      const scWordCounts = scSentences.map(s => s.split(/\s+/).length);
      const scTotalWords = scWordCounts.reduce((a, b) => a + b, 0);
      const scCumFracs   = scWordCounts.reduce((acc, wc) => {
        acc.push((acc[acc.length - 1] || 0) + wc / scTotalWords);
        return acc;
      }, []);

      const tick = () => {
        const elapsed = audioCtxRef.current.currentTime - t0Ref.current;
        const p = Math.min(elapsed / durRef.current, 1);
        setProgress(p);
        // Find which sentence p falls into using word-count fractions
        let si = scSentences.length - 1;
        for (let j = 0; j < scCumFracs.length; j++) {
          if (p <= scCumFracs[j]) { si = j; break; }
        }
        setSentIdx(si);
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
        else { setIsPlaying(false); autoAdvance(); }
      };
      rafRef.current = requestAnimationFrame(tick);
      // Prefetch next scene in background so it's ready instantly
      prefetchScene(sceneIdx + 1);
    } catch (err) {
      console.error('DemoPlayer error:', err);
      setLoading(false); setIsPlaying(false);
    }
  }, [autoAdvance, prefetchScene]);

  useEffect(() => {
    if (started && !isPlaying && !loading) playScene(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const handleFirstPlay = () => { setSplashDone(true); playScene(0); };
  const togglePlay = () => { if (isPlaying) stopAudio(); else playScene(idx); };

  const handleViewportClick = () => {
    if (!splashDone || !started || loading) return;
    const hint = isPlaying ? 'pause' : 'play';
    setClickHint(hint);
    clearTimeout(clickHintTimer.current);
    clickHintTimer.current = setTimeout(() => setClickHint(null), 900);
    togglePlay();
  };

  const totalPct = ((idx + progress) / SCENES.length) * 100;
  const currentSentence = sentences[sentIdx] || '';

  return (
    <section id="demo" style={{ background: 'linear-gradient(180deg,#000004 0%,#060810 100%)', padding: '64px 20px 72px', fontFamily: 'Sora,sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: TEAL, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 }}>Platform Demo</div>
        <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: -0.5, lineHeight: 1.15 }}>See Docstribe in Action</h2>
        <p style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>Clinical Intelligence · RCM · OPD · IPD · Denial Prevention · 60-Day Guarantee</p>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: -2, borderRadius: 14, boxShadow: `0 0 40px ${scene.color}18, 0 8px 30px rgba(0,0,0,0.08)`, pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden', border: `1px solid rgba(0,0,0,0.08)`, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', background: '#f8fafc' }}>
          <div style={{ position: 'absolute', inset: 0, cursor: splashDone && started ? 'pointer' : 'default' }} onClick={handleViewportClick}>
            {!splashDone && <Splash onPlay={handleFirstPlay} />}

            {exitIdx !== null && (
              <div key={`exit-${exitIdx}`} style={{ position: 'absolute', inset: 0, zIndex: 1, animation: 'dpExitScene 0.5s ease-in both' }}>
                <SceneVisual scene={SCENES[exitIdx]} progress={0} />
              </div>
            )}

            <div key={`sc-${idx}`} style={{ position: 'absolute', inset: 0, zIndex: 2, animation: started ? 'dpEnterScene 0.5s ease-out both' : 'none' }}>
              <SceneVisual scene={scene} progress={progress} />
            </div>

            <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.05) 100%)', pointerEvents: 'none' }} />

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 25, background: 'rgba(0,0,0,0.10)' }}>
              <div style={{ height: '100%', width: `${totalPct}%`, background: `linear-gradient(90deg,${scene.color},${INDIGO})`, transition: 'width 0.15s linear' }} />
            </div>

            <SceneStatStrip scene={scene} progress={progress} />

            {/* Click-to-pause flash icon */}
            {clickHint && (
              <div key={clickHint + Date.now()} style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', animation: 'dpClickHintFade 0.9s ease-out both' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${scene.color}30, 0 8px 32px rgba(0,0,0,0.6)` }}>
                  {clickHint === 'pause'
                    ? <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    : <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3 }}><polygon points="5,3 19,12 5,21" /></svg>
                  }
                </div>
              </div>
            )}

            {/* Loading spinner overlay */}
            {loading && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 45, width: 36, height: 36, borderRadius: '50%', border: `3px solid ${scene.color}28`, borderTopColor: scene.color, animation: 'dpSpin 0.7s linear infinite', pointerEvents: 'none' }} />
            )}

            {/* Nav buttons — bottom right, no play/pause */}
            <div style={{ position: 'absolute', bottom: 16, right: 14, zIndex: 25, display: 'flex', gap: 5 }} onClick={e => e.stopPropagation()}>
              <button onClick={() => idx > 0 && goTo(idx - 1)} disabled={idx === 0} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.88)', color: idx === 0 ? '#cbd5e1' : DIM, fontSize: 15, cursor: idx === 0 ? 'default' : 'pointer', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}>‹</button>
              <button onClick={() => idx < SCENES.length - 1 && goTo(idx + 1)} disabled={idx === SCENES.length - 1} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.88)', color: idx === SCENES.length - 1 ? '#cbd5e1' : DIM, fontSize: 15, cursor: idx === SCENES.length - 1 ? 'default' : 'pointer', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}>›</button>
            </div>
          </div>
        </div>

        {/* ── Subtitle bar — below video, never overlaps screen content ── */}
        <div style={{ minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px 28px', marginTop: 6 }}>
          {isPlaying && currentSentence && <Caption sentence={currentSentence} />}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 4, flexWrap: 'wrap' }}>
          {SCENES.map((s, i) => {
            const active = i === idx;
            const past   = i < idx;
            return (
              <button key={i} onClick={() => goTo(i)} title={s.title} style={{ height: 5, width: active ? 20 : 5, borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer', background: active ? s.color : past ? `${s.color}55` : 'rgba(0,0,0,0.15)', boxShadow: active ? `0 0 8px ${s.color}80` : 'none', transition: 'all 0.3s ease', flexShrink: 0 }} />
            );
          })}
        </div>

        <p style={{ textAlign: 'center', marginTop: 22, fontSize: 11, color: MUTED }}>
          Ready to see this on your hospital data?{' '}
          <a href="mailto:arcus@docstribe.com" style={{ color: TEAL, fontWeight: 700, textDecoration: 'none' }}>arcus@docstribe.com</a>
        </p>
      </div>

      <style>{`
        @keyframes dpEnterScene {
          from { opacity:0; transform:scale(1.04); filter:blur(8px); }
          to   { opacity:1; transform:scale(1);    filter:blur(0); }
        }
        @keyframes dpExitScene {
          from { opacity:1; transform:scale(1);    filter:blur(0); }
          to   { opacity:0; transform:scale(0.97); filter:blur(6px); }
        }
        @keyframes dpBeatIn {
          from { opacity:0; transform:translateY(10px) scale(0.92); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes dpRowIn {
          from { opacity:0; transform:translateY(9px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes dpPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:0.35; transform:scale(1.6); }
        }
        @keyframes dpPulseScale {
          0%,100% { transform:scale(1);    box-shadow:0 0 40px rgba(0,203,168,0.4); }
          50%     { transform:scale(1.03); box-shadow:0 0 60px rgba(0,203,168,0.7); }
        }
        @keyframes dpSpin { to { transform:rotate(360deg); } }
        @keyframes dpFadeCaption {
          from { opacity:0; }
          to   { opacity:1; }
        }
        /* ── Cinematic additions ── */
        @keyframes dpEmergeStat {
          0%   { opacity:0; transform:scale(0.82) translateY(22px); filter:blur(18px); }
          60%  { opacity:1; filter:blur(2px); }
          100% { opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
        }
        @keyframes dpBloom {
          0%   { opacity:0; }
          12%  { opacity:1; }
          100% { opacity:0; }
        }
        @keyframes dpBreath {
          0%,100% { opacity:0.6; transform:scale(1); }
          50%     { opacity:1;   transform:scale(1.06); }
        }
        @keyframes dpRowBlurIn {
          from { opacity:0; transform:translateX(-14px); filter:blur(6px); }
          to   { opacity:1; transform:translateX(0);     filter:blur(0); }
        }
        @keyframes dpGridBreathe {
          0%,100% { opacity:0.028; }
          50%     { opacity:0.055; }
        }
        @keyframes dpChromeShimmer {
          0%   { transform:translateX(-200%); }
          100% { transform:translateX(400%); }
        }
        @keyframes dpSlideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes dpClickPop {
          0%   { transform: scale(1);    }
          25%  { transform: scale(0.88); }
          65%  { transform: scale(1.05); }
          100% { transform: scale(1);    }
        }
        @keyframes dpStatRing {
          0%   { transform:scale(0.5); opacity:0.7; }
          100% { transform:scale(2.8); opacity:0; }
        }
        @keyframes dpSpringIn {
          0%   { opacity:0; transform:scale(0.6) translateY(30px); }
          55%  { opacity:1; transform:scale(1.08) translateY(-4px); }
          75%  { transform:scale(0.97) translateY(1px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes dpClickHintFade {
          0%   { opacity:0; transform:scale(0.75); }
          18%  { opacity:1; transform:scale(1.05); }
          55%  { opacity:1; transform:scale(1); }
          100% { opacity:0; transform:scale(1.15); }
        }
        @keyframes dpLogoReveal {
          0%   { opacity:0; transform:scale(0.92) translateY(18px); filter:blur(16px); }
          55%  { opacity:1; filter:blur(2px); }
          100% { opacity:1; transform:scale(1) translateY(0); filter:blur(0); }
        }
      `}</style>
    </section>
  );
}
