/**
 * DemoPlayer — Docstribe Board Demo
 * 11 scenes · one focal element at a time · VO synced with screen numbers
 * Board-level sales demo — ICD-10-CM · UAE · 60-day guarantee
 */

import { useState, useRef, useEffect, useCallback } from 'react';

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
const TEAL   = '#00cba8';
const BLUE   = '#0d1526';
const AMBER  = '#f59e0b';
const RED    = '#ef4444';
const GREEN  = '#10b981';
const PURPLE = '#a855f7';
const INDIGO = '#4d8aff';
const TXT    = '#e2e8f0';
const DIM    = '#94a3b8';
const MUTED  = '#475569';
const BORDER = 'rgba(255,255,255,0.07)';

/* ─── Spotlight: is this element the current focal point? ────── */
const spot = (p, from, to = Math.min(from + 0.20, 1)) => p >= from && p <= to;

/* ─── Glow card style — cinematic multi-layer ───────────────── */
function glow(active, color, extra = {}) {
  return {
    transition: 'all 0.55s cubic-bezier(0.34,1.2,0.64,1)',
    transform: active ? 'scale(1.035)' : 'scale(1)',
    border: active ? `1px solid ${color}80` : `1px solid rgba(255,255,255,0.07)`,
    boxShadow: active
      ? `0 0 0 1px ${color}20, 0 0 22px ${color}35, 0 0 60px ${color}18, 0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 ${color}25`
      : '0 2px 8px rgba(0,0,0,0.25)',
    background: active
      ? `linear-gradient(135deg, ${color}18, ${color}08)`
      : `${color}06`,
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
  const pattern = /(twelve to eighteen|sixty to seventy|thirty percent|twenty-five percent|zero point fifteen|sixty.?day|one point four million|eighteen thousand four hundred|two hundred fourteen|four hundred twenty|one thousand nine hundred|ninety-one thousand|twenty-eight thousand five hundred|zero point nine four|one point three four|zero leakage|per payor.?per batch|personalized intelligence|built for you|one click|order entry|CARC \d+|ICD-10-CM|NABIDH|DHA|IR-DRG|CMI|Docstribe|guaranteed|\d+(?:\.\d+)?%)/gi;
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <span key={i} style={{ color: TEAL, fontWeight: 900, textDecoration: 'underline', textUnderlineOffset: '3px' }}>{part}</span>
      : part
  );
}

/* ══════════════════ SCENE DATA ═════════════════════════════════ */
// VOs crafted by Gemini 2.5 Flash Lite — board-level, screen-precise
const SCENES = [
  {
    id: 1, type: 'stat', color: TEAL,
    title: 'The Revenue Gap',
    // 15w + 7w + 9w + 4w + 6w = 41w — beat fracs 0.04, 0.38, 0.56, 0.88
    // Breakdown cards appear at p>=0.56 synced to "four gaps" beat
    vo: "In the UAE, twelve to eighteen percent of every hospital claim is denied. Sixty to seventy percent — entirely preventable. Four gaps: documentation, authorization, coding, claim edits. Docstribe closes every one. Before a single claim goes out.",
    beats: [
      { at: 0.04, stat: '12–18%',       sub: 'UAE hospital claims denied on first submission' },
      { at: 0.38, stat: '60–70%',       sub: 'of those denials entirely preventable' },
      { at: 0.56, stat: '4 Gap Types',  sub: 'documentation · auth · coding · claim edits' },
      { at: 0.88, stat: 'Zero leakage.', sub: 'Docstribe closes all four — before claims go out' },
    ],
  },
  {
    id: 2, type: 'kpi', color: TEAL,
    title: 'Introducing Docstribe',
    // S1:25w credentials S2:7w outcomes S3:1w = 33w — beat fracs 0.26 0.46 0.62 0.76 0.90
    vo: "This is Docstribe. Built by clinicians — thirty years of practice. A hundred hospitals across the US, UAE, and India. Ten million lives. That gap you just saw — the twelve to eighteen percent — we close it. Contractually. Denials fall thirty percent. Clean claim rate ninety-nine percent. CMI up by zero point one five. Sixty days. Guaranteed.",
    beats: [
      { at: 0.04, stat: 'Docstribe',      sub: 'Clinical intelligence platform · clinician-built' },
      { at: 0.22, stat: '100+ Hospitals', sub: 'US · UAE · India · live deployments' },
      { at: 0.34, stat: '10M+ Lives',     sub: 'Patient population managed globally' },
      { at: 0.50, stat: '↓30%',          sub: 'Denial rate reduction · 60 days · guaranteed' },
      { at: 0.64, stat: '99%',           sub: 'Clean claim rate · first-pass submission' },
      { at: 0.78, stat: '+0.15 CMI',     sub: 'Case mix index improvement · 60 days' },
    ],
  },
  {
    id: 3, type: 'product', color: TEAL,
    title: 'One Unified Workspace',
    breadcrumb: 'Cases Workbench',
    // S1:15w S2:8w = 23w — beat fracs 0.65 1.00; zero leakage at word 14 = 0.61
    vo: "Docstribe connects with your existing EMR and HIS — no rip and replace. It builds a unified case workbench for physicians, medical coders, and case managers across OPD, IPD, and Emergency. Two hundred live encounters. Every case tracked from order to final payment. Nothing falls through.",
    beats: [
      { at: 0.04, stat: 'EMR / HIS Connected', sub: 'Epic · Oracle · Cerner · MEDITECH — live link' },
      { at: 0.28, stat: '3 Roles · 1 View',   sub: 'physicians · coders · case managers — unified' },
      { at: 0.52, stat: '200 live cases',      sub: 'OPD · IPD · Emergency — all tracked' },
      { at: 0.78, stat: 'Zero leakage',        sub: 'order to payment — nothing falls through' },
    ],
  },
  {
    id: 4, type: 'product', color: GREEN,
    title: 'Pre-Visit Intelligence',
    breadcrumb: 'Eligibility & Pre-Authorisation',
    // flowchart: patient in → EMR auto-fetch → payer API → status chips → cleared
    vo: "A patient walks in. Docstribe pulls their insurance profile automatically — coverage, co-pay, network status — direct from the payer API. Eligibility confirmed before they reach the desk. For the inpatient needing pre-authorisation — PA filed at order entry, approved before care begins. No forms. No delays.",
    beats: [
      { at: 0.10, stat: 'Auto-fetched',    sub: 'insurance profile pulled · no manual entry' },
      { at: 0.33, stat: 'Eligible ✓',      sub: 'co-pay · network · coverage confirmed' },
      { at: 0.72, stat: 'PA filed · 0.3s', sub: 'auto-submitted at order entry' },
      { at: 0.86, stat: 'PA APPROVED',     sub: 'AED 28,500 authorised · admission cleared' },
    ],
  },
  {
    id: 5, type: 'product', color: INDIGO,
    title: 'Ambient Clinical Intelligence',
    breadcrumb: 'Ambient Scribe — OPD & IPD',
    // S1:18w S2:13w = 31w — beat fracs 0.58 1.00; NABIDH at S2 word 5 = 0.74
    vo: "The physician speaks. The structured clinical note builds in real time — vital signs, ICD codes, comorbidities, all captured automatically. Feeding directly into NABIDH and DHA. The doctor never looks up from the patient. Documentation already done.",
    beats: [
      { at: 0.06, stat: 'OPD note built live', sub: 'DM · HTN · auto-coded from voice' },
      { at: 0.60, stat: 'NABIDH ✓  DHA ✓',    sub: 'compliant · structured · exchange-ready' },
      { at: 0.84, stat: 'Physicians in care',  sub: 'documentation automated · zero burden' },
    ],
  },
  {
    id: 6, type: 'product', color: AMBER,
    title: 'CDI — Closing the Gap',
    breadcrumb: 'Clinical Documentation Intelligence',
    // CDI narrative: physician note → query auto-surfaces → guideline → tap → locked+esigned
    vo: "While the physician is in the note, Docstribe surfaces a query — automatically, grounded in clinical guidelines. One answer. The documentation is locked and e-signed. Code corrected at the point of care. For inpatient — principal diagnosis confirmed before discharge. IR-DRG weight locked. Revenue that would have been lost, isn't.",
    beats: [
      { at: 0.06, stat: 'Query auto-surfaces',    sub: 'while physician is in the note' },
      { at: 0.42, stat: '✓ Locked · E-signed',    sub: 'ICD corrected · charge captured at point of care' },
      { at: 0.62, stat: 'IPD DRG locked',          sub: 'principal Dx confirmed before discharge' },
    ],
  },
  {
    id: 7, type: 'product', color: PURPLE,
    title: 'AI-Powered Coding',
    breadcrumb: 'ICD-10-CM · Smart Coding Engine',
    // OPD: ICD ranked + NCCI/MUE payer match → less denials; IPD: live IR-DRG while admitted
    vo: "Every OPD claim — diagnoses ranked, procedure codes checked against payer NCCI and MUE edits before anything goes out. That cuts denials at source. For inpatient, the IR-DRG recalculates live while the patient is admitted — every complication captured today reflects in the DRG weight immediately. AED eighteen thousand four hundred more. Per case.",
    beats: [
      { at: 0.06, stat: 'ICD-10-CM ranked',      sub: 'OPD diagnoses · symbols suppressed' },
      { at: 0.28, stat: 'NCCI + MUE validated',  sub: 'payer edits matched · denials cut at source' },
      { at: 0.58, stat: 'IR-DRG live',            sub: 'recalculates while patient is admitted' },
      { at: 0.88, stat: '+AED 18,400',            sub: 'per case · zero manual backlog' },
    ],
  },
  {
    id: 8, type: 'product', color: RED,
    title: 'Denial Intelligence',
    breadcrumb: 'Payer Contract Intelligence',
    // Bridge: system doesn't stop at coding → goes deeper into claim language payer by payer
    vo: "The system does not stop there. It goes deeper — reading the claim language, payer by payer, batch by batch. Every denial has a pattern. Docstribe maps it. Up to ninety-one percent recoverable before the claim goes out. That is how the denial rate falls — not by chasing. By never losing.",
    beats: [
      { at: 0.08, stat: 'Per payer · per batch', sub: 'Daman · Thiqa · AXA Gulf · Oman Insurance' },
      { at: 0.60, stat: '67–91% recoverable',    sub: 'pre-submission · flagged before send' },
      { at: 0.84, stat: 'Denial rate ↓ 30%',    sub: 'batch over batch · systemic improvement' },
    ],
  },
  {
    id: 9, type: 'product', color: TEAL,
    title: 'One-Click Recovery',
    breadcrumb: 'Claim Recovery — Appeal Generator',
    // S1:12w S2:2w S3:15w S4:3w S5:2w = 34w — fracs 0.35 0.41 0.85 0.94 1.00
    vo: "A denial lands. Historically, three weeks of follow-up. Now — one click. Docstribe reads the contract, finds the clause, writes the appeal letter. The whole thing. Thirty seconds. AED nineteen hundred in recovery.",
    beats: [
      { at: 0.06, stat: 'AED 1,900 denied', sub: 'Daman · bundling dispute · appeal pending' },
      { at: 0.42, stat: '1-click appeal',   sub: 'contract read · clause matched · letter built' },
      { at: 0.92, stat: '✅ 30 seconds',    sub: 'AED 1,900 recovered · vs. 3 weeks manual' },
    ],
  },
  {
    id: 10, type: 'product', color: INDIGO,
    title: 'Service Line Growth',
    breadcrumb: 'Service Line Growth · Clinical Engagement',
    // S1:7w S2:2w S3:11w S4:14w S5:2w = 36w — fracs 0.19 0.25 0.56 0.95 1.00
    vo: "Your ops team cannot watch every chart. Docstribe does. Oxygen dropping. Labs flagging a DRG escalation. Pre-auth ready for systemic therapy. Four patients — AED ninety-one thousand — surfaced as a live action list. Clinical signals, turned into revenue. Day Zero.",
    beats: [
      { at: 0.10, stat: 'Ops engagement queue', sub: 'clinical signals → revenue action · live' },
      { at: 0.32, stat: '4 alerts · live now',   sub: 'Respiratory · Cardiology · Neurology · Oncology' },
      { at: 0.55, stat: 'AED 91K opportunity',   sub: '4 patients · surfaced live · Day Zero' },
    ],
  },
  {
    id: 11, type: 'dashboard', color: TEAL,
    title: 'Your RCM Intelligence Partner',
    breadcrumb: 'Your RCM Intelligence Framework',
    // S1:7w S2:22w S3:9w = 38w — fracs 0.18 0.76 1.00
    vo: "This is not a generic platform. It is an intelligence framework that learns your hospital — your payers, your physicians, your case mix — and gets smarter with every claim, every signal, every patient. Clinical intelligence. Built for you.",
    beats: [
      { at: 0.06, stat: 'Your intelligence',      sub: 'payors · physicians · case mix — personalized' },
      { at: 0.20, stat: 'Personalized framework',  sub: 'evolves with your hospital · not a generic tool' },
      { at: 0.78, stat: 'Built for you.',          sub: 'Clinical Intelligence · Financial Integrity' },
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
      background: 'linear-gradient(135deg,rgba(4,8,20,0.97),rgba(6,12,28,0.94))',
      border: `1px solid ${riskColor}35`,
      borderRadius: 12, padding: '9px 13px',
      animation: 'dpSpringIn 0.55s cubic-bezier(0.34,1.4,0.64,1) both',
      flexShrink: 0,
      boxShadow: `0 0 0 1px ${riskColor}10, 0 4px 24px rgba(0,0,0,0.45)`,
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
          background: govActive ? `linear-gradient(135deg,${TEAL}14,${INDIGO}09)` : 'rgba(0,0,0,0.35)',
          border: `1px solid ${govActive ? `${TEAL}45` : 'rgba(255,255,255,0.05)'}`,
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
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
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
          <div style={{ flex: 2, background: 'rgba(0,0,0,0.2)', border: `1px solid ${BORDER}`, borderRadius: 5, padding: '5px 8px' }}>
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
    <div style={{ position: 'absolute', inset: 0, display: 'flex', background: BLUE, fontFamily: 'Sora,sans-serif' }}>
      {/* Sidebar — frosted glass with gradient */}
      <div style={{ width: 42, flexShrink: 0, background: 'linear-gradient(180deg,rgba(4,8,20,0.98) 0%,rgba(6,10,22,0.95) 100%)', borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 3, backdropFilter: 'blur(20px)' }}>
        {/* Logo with glow */}
        <div style={{ width: 24, height: 24, borderRadius: 7, marginBottom: 12, background: `linear-gradient(135deg,${color},${INDIGO})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff', boxShadow: `0 0 14px ${color}50` }}>D</div>
        {nav.map((ic, i) => (
          <div key={i} style={{ width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, opacity: i === 0 ? 1 : 0.22, background: i === 0 ? `${color}28` : 'transparent', color: i === 0 ? color : DIM, boxShadow: i === 0 ? `inset 2px 0 0 ${color}` : 'none', position: 'relative' }}>
            {ic}
            {/* Micro glow dot on active nav item */}
            {i === 0 && <div style={{ position: 'absolute', right: 3, top: 3, width: 4, height: 4, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />}
          </div>
        ))}
      </div>
      {/* Main panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header bar with chrome shimmer */}
        <div style={{ height: 34, flexShrink: 0, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6, background: 'linear-gradient(180deg,rgba(4,8,20,0.92) 0%,rgba(8,14,32,0.82) 100%)', position: 'relative', overflow: 'hidden' }}>
          {/* Shimmer sweep */}
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '30%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)', animation: 'dpChromeShimmer 3.5s ease-in-out infinite', pointerEvents: 'none' }} />
          <span style={{ fontSize: 8, color: MUTED }}>Docstribe</span>
          <span style={{ fontSize: 8, color: '#1e293b' }}>›</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: TXT }}>{breadcrumb}</span>
          <div style={{ flex: 1 }} />
          {/* Status dots */}
          {[color, INDIGO, '#1e293b'].map((c, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: c, boxShadow: i === 0 ? `0 0 6px ${c}` : 'none' }} />)}
        </div>
        {/* Content area with scan-line texture */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.055) 2px,rgba(0,0,0,0.055) 4px)', backgroundSize: '100% 4px' }} />
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

/* Scene 1 — Revenue gap: BIG numbers, one at a time — cinematic */
function StatScene({ scene, progress }) {
  const anyActive = scene.beats.some(b => spot(progress, b.at, b.at + 0.28));
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 65% at 50% 45%,#030816 0%,#000 75%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
      {/* Breathing ambient glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 60% 50% at 50% 50%,${TEAL}08 0%,transparent 70%)`, animation: 'dpBreath 4s ease-in-out infinite' }} />
      {/* Animated grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,203,168,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,203,168,0.5) 1px,transparent 1px)', backgroundSize: '56px 56px', animation: 'dpGridBreathe 6s ease-in-out infinite' }} />
      {/* Beat bloom flash */}
      {anyActive && (
        <div key={`bloom-${progress.toFixed(1)}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 60% 40% at 50% 50%,${TEAL}18 0%,transparent 60%)`, animation: 'dpBloom 1.8s ease-out both', zIndex: 1 }} />
      )}
      <div style={{ position: 'absolute', bottom: 14, right: 18, fontSize: 8, fontWeight: 800, color: `${TEAL}45`, letterSpacing: 2, fontFamily: 'Sora', zIndex: 2 }}>DOCSTRIBE</div>

      {/* Missed opportunity breakdown — synced to "4 Gap Types" beat at 0.56 */}
      {progress >= 0.56 && (
        <div style={{ position: 'absolute', bottom: 52, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 2 }}>
          {[
            { label: 'CDI Documentation', pct: '38%', sub: 'CC/MCC missing · DRG undercoded', col: AMBER },
            { label: 'Prior Auth Failures', pct: '27%', sub: 'Auth missed at order entry', col: INDIGO },
            { label: 'ICD / DRG Errors', pct: '22%', sub: 'Coding gaps · NCCI failures', col: RED },
            { label: 'Claim Edit Failures', pct: '13%', sub: 'Payer edit rules · MUE limits', col: PURPLE },
          ].map(({ label, pct, sub, col }, i) => (
            <div key={label} style={{ background: `${col}10`, border: `1px solid ${col}30`, borderRadius: 9, padding: '8px 13px', textAlign: 'center', minWidth: 88, animation: `dpSpringIn 0.55s cubic-bezier(0.34,1.4,0.64,1) ${i * 0.08}s both` }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: col, fontFamily: 'Sora', lineHeight: 1.1 }}>{pct}</div>
              <div style={{ fontSize: 6.5, fontWeight: 800, color: col, marginTop: 2, marginBottom: 2, letterSpacing: 0.2 }}>{label}</div>
              <div style={{ fontSize: 6, color: DIM, lineHeight: 1.35 }}>{sub}</div>
            </div>
          ))}
        </div>
      )}
      {/* Big stat numbers — beats 0,1 = big numbers; beat 2 = breakdown label (visually replaced by cards); beat 3 = Zero leakage */}
      {scene.beats.map((b, i) => {
        const show = progress >= b.at;
        const active = spot(progress, b.at, b.at + 0.28);
        // Beat 2 ("4 Gap Types") is represented by breakdown cards — skip its big-number render
        if (i === 2) return null;
        const isLast = i === scene.beats.length - 1; // "Zero leakage." = index 3
        const fontSize = i === 0 ? 96 : i === 1 ? 76 : 28;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: show ? 1 : 0, animation: show ? `dpEmergeStat 0.9s cubic-bezier(0.34,1.2,0.64,1) both` : 'none', filter: show && !active && !isLast ? 'brightness(0.5)' : 'brightness(1)', position: 'relative', zIndex: 2 }}>
            {/* Emanating ring on active big stats */}
            {active && !isLast && (
              <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', border: `2px solid ${TEAL}55`, animation: 'dpStatRing 1.4s ease-out infinite', pointerEvents: 'none', zIndex: 0 }} />
            )}
            <div style={{ fontSize, fontWeight: 900, letterSpacing: isLast ? -0.5 : -2, fontFamily: 'Sora', lineHeight: 1.0, color: isLast ? TEAL : '#fff', textShadow: active ? `0 0 40px ${TEAL}cc, 0 0 100px ${TEAL}50, 0 0 180px ${TEAL}20` : !isLast ? `0 0 40px ${TEAL}30` : 'none', transition: 'text-shadow 0.5s ease', background: isLast && active ? `linear-gradient(135deg,${TEAL},${INDIGO})` : 'none', WebkitBackgroundClip: isLast && active ? 'text' : 'unset', WebkitTextFillColor: isLast && active ? 'transparent' : 'unset', position: 'relative', zIndex: 1 }}>
              {show ? <CountUp value={b.stat} duration={900} key={`${i}-${show}`} /> : b.stat}
            </div>
            <div style={{ fontSize: isLast ? 14 : 11, color: isLast ? TXT : DIM, fontFamily: 'Sora', textAlign: 'center', maxWidth: 480, letterSpacing: 0.2, fontWeight: isLast ? 500 : 400 }}>{b.sub}</div>
            {!isLast && show && <div style={{ width: 32, height: 2, background: active ? TEAL : `${TEAL}40`, borderRadius: 1, transition: 'background 0.5s' }} />}
          </div>
        );
      })}
    </div>
  );
}

/* Scene 2 — Intro Docstribe (p<0.46), then KPI outcomes (p>=0.48) */
function KPIScene({ scene, progress }) {
  // intro fades out 0.38→0.46, outcomes fade in 0.40→0.48
  // Phase 1: credential intro (beats 0-2). Phase 2: 3 KPI outcome cards (beats 3-5)
  const introOpacity = progress < 0.38 ? 1 : progress > 0.46 ? 0 : 1 - (progress - 0.38) / 0.08;
  const kpiOpacity   = progress < 0.40 ? 0 : progress > 0.48 ? 1 : (progress - 0.40) / 0.08;
  const kpiBeats = scene.beats.slice(3); // beats 3,4,5 = ↓30%, 99%, +0.15 CMI
  const colors = [RED, GREEN, PURPLE];

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%,#060f24 0%,#000 75%)', overflow: 'hidden' }}>

      {/* ── Phase 1: Introducing Docstribe ── */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 48px', opacity: introOpacity, transition: 'opacity 0.6s ease', pointerEvents: introOpacity < 0.1 ? 'none' : 'auto' }}>

        <div style={{ fontSize: 9, fontWeight: 700, color: `${TEAL}80`, letterSpacing: 3, textTransform: 'uppercase' }}>Clinical Intelligence · Proven at Scale</div>

        <div style={{ fontSize: 54, fontWeight: 900, background: `linear-gradient(135deg,#fff 35%,${TEAL} 65%,${INDIGO})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1.5, lineHeight: 1, animation: 'dpSpringIn 0.8s cubic-bezier(0.34,1.4,0.64,1) both' }}>
          Docstribe
        </div>

        <div style={{ fontSize: 13, color: TXT, textAlign: 'center', maxWidth: 540, lineHeight: 1.75, fontWeight: 500, opacity: progress >= 0.06 ? 1 : 0, transition: 'opacity 0.7s ease' }}>
          Clinical intelligence platform deployed across the{' '}
          <span style={{ color: TEAL, fontWeight: 800 }}>US, UAE &amp; India</span>{' '}
          — across <span style={{ color: AMBER, fontWeight: 800 }}>100+ hospitals</span>,
          managing <span style={{ color: INDIGO, fontWeight: 800 }}>10M+ lives</span>,
          driven by clinicians with{' '}
          <span style={{ color: PURPLE, fontWeight: 800 }}>30+ years experience</span>.
        </div>

        {progress >= 0.12 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['US · UAE · India', INDIGO], ['100+ Hospitals', TEAL], ['10M+ Lives', PURPLE], ['30 Yrs Clinical Exp', AMBER]].map(([l, c], i) => (
              <div key={l} style={{ fontSize: 10, fontWeight: 700, color: c, background: `${c}16`, border: `1px solid ${c}30`, borderRadius: 20, padding: '6px 16px', animation: `dpSpringIn 0.6s cubic-bezier(0.34,1.4,0.64,1) ${i * 0.07}s both` }}>{l}</div>
            ))}
          </div>
        )}

        {progress >= 0.26 && (
          <div style={{ fontSize: 10, color: DIM, animation: 'dpBeatIn 0.5s ease both', textAlign: 'center' }}>
            NABIDH · DHA · IR-DRG · Per-patient AI profiling · 60-day outcomes, <span style={{ color: TEAL, fontWeight: 700 }}>guaranteed</span>
          </div>
        )}
      </div>

      {/* ── Phase 2: KPI Outcomes ── */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 28px', opacity: kpiOpacity, transition: 'opacity 0.6s ease', pointerEvents: kpiOpacity < 0.1 ? 'none' : 'auto' }}>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, color: `${AMBER}90`, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>That 12–18% denial gap you just saw</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: TXT }}>Here's what Docstribe guarantees — in 60 days:</div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 920 }}>
          {kpiBeats.map((b, i) => {
            const show = progress >= b.at;
            const active = spot(progress, b.at, b.at + 0.16);
            const c = colors[i];
            return (
              <div key={i} style={{ background: `linear-gradient(135deg,${c}18,${c}08)`, border: `1px solid ${c}${active ? '70' : show ? '28' : '10'}`, borderRadius: 16, padding: '22px 20px', minWidth: 130, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: show ? 1 : 0, animation: show ? `dpSpringIn 0.65s cubic-bezier(0.34,1.4,0.64,1) both` : 'none', boxShadow: active ? `0 0 0 1px ${c}20, 0 0 48px ${c}40, 0 0 80px ${c}18, 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 ${c}25` : '0 2px 12px rgba(0,0,0,0.3)', filter: show && !active ? 'brightness(0.65)' : 'brightness(1)', transform: active ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.4s ease, filter 0.4s ease, box-shadow 0.4s ease', position: 'relative', overflow: 'hidden' }}>
                {/* Active bloom behind number */}
                {active && (
                  <div style={{ position: 'absolute', inset: -20, pointerEvents: 'none', background: `radial-gradient(ellipse 80% 80% at 50% 50%,${c}25 0%,transparent 70%)`, animation: 'dpBloom 1.5s ease-out both', borderRadius: 24, zIndex: 0 }} />
                )}
                <div style={{ fontSize: 48, fontWeight: 900, color: c, fontFamily: 'Sora', lineHeight: 1, letterSpacing: -2, position: 'relative', zIndex: 1, textShadow: active ? `0 0 30px ${c}80` : 'none' }}>
                  {show ? <CountUp value={b.stat} duration={700} key={`k${i}-${show}`} /> : b.stat}
                </div>
                <div style={{ width: 22, height: 2, borderRadius: 1, background: c, position: 'relative', zIndex: 1 }} />
                <div style={{ fontSize: 8, color: DIM, textAlign: 'center', lineHeight: 1.5, position: 'relative', zIndex: 1 }}>{b.sub}</div>
              </div>
            );
          })}
        </div>

        {progress >= 0.88 && (
          <div style={{ fontSize: 10, color: DIM, animation: 'dpBeatIn 0.5s ease both', textAlign: 'center' }}>
            All outcomes contractual · auditable · <span style={{ color: TEAL, fontWeight: 700 }}>backed by Docstribe SLA · 60-day guarantee</span>
          </div>
        )}
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
            <div key={api} style={{ display: 'flex', gap: 5, alignItems: 'center', background: `rgba(0,0,0,0.22)`, border: `1px solid ${apiDone ? TEAL + '35' : BORDER}`, borderRadius: 20, padding: '3px 10px', transition: 'border-color 0.4s', animation: 'dpBeatIn 0.4s ease both' }}>
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
  const ipdPhase = p >= 0.48;

  // Flow steps for OPD and IPD journeys
  const opdFlow = [
    { label: 'Patient In',     icon: '🏥', show: 0.02 },
    { label: 'EMR Auto-Fetch', icon: '📋', show: 0.10, api: false },
    { label: 'Payer API',      icon: '🔗', show: 0.18, api: true  },
    { label: 'Eligibility',    icon: '🔍', show: 0.26, api: false },
    { label: 'Cleared ✓',      icon: '✅', show: 0.40, api: false },
  ];
  const ipdFlow = [
    { label: 'Patient In',     icon: '🏥', show: 0.50 },
    { label: 'EMR Auto-Fetch', icon: '📋', show: 0.57, api: false },
    { label: 'Payer API',      icon: '🔗', show: 0.63, api: true  },
    { label: 'PA Filed',       icon: '📤', show: 0.72, api: false },
    { label: 'PA Approved',    icon: '✅', show: 0.84, api: false },
  ];

  // Status result chips (OPD)
  const opdResults = [
    { label: 'Insurance',  value: 'Active',              icon: '✓', col: GREEN,  show: 0.28 },
    { label: 'Network',    value: 'In-Network',           icon: '✓', col: GREEN,  show: 0.30 },
    { label: 'Co-pay',     value: 'AED 50 / visit',       icon: '◎', col: AMBER,  show: 0.32 },
    { label: 'Pre-auth',   value: 'Not Required ✓',       icon: '✓', col: GREEN,  show: 0.34 },
    { label: 'Deductible', value: 'AED 6,550 remaining',  icon: '◎', col: INDIGO, show: 0.36 },
    { label: 'Coverage',   value: 'DM + HTN Covered',     icon: '✓', col: TEAL,   show: 0.38 },
  ];
  // Status result chips (IPD)
  const ipdResults = [
    { label: 'Insurance',  value: 'Active',                   icon: '✓',  col: GREEN,  show: 0.64 },
    { label: 'Network',    value: 'SEHA Network',              icon: '✓',  col: GREEN,  show: 0.66 },
    { label: 'Admission',  value: 'Inpatient eligible',        icon: '✓',  col: TEAL,   show: 0.68 },
    { label: 'Pre-auth',   value: 'REQUIRED — AED 28,500',     icon: '⚠',  col: AMBER,  show: 0.72, hero: true },
    { label: 'PA Filed',   value: 'THQ-2024-189234 · 0.3s',   icon: '→',  col: INDIGO, show: 0.78 },
    { label: 'PA Status',  value: 'APPROVED',                  icon: '✅', col: GREEN,  show: 0.84, hero: true },
  ];

  const flow     = ipdPhase ? ipdFlow    : opdFlow;
  const results  = ipdPhase ? ipdResults : opdResults;
  const col      = ipdPhase ? AMBER      : GREEN;
  const cleared  = ipdPhase ? p >= 0.84  : p >= 0.40;
  const apiActive = ipdPhase ? (p >= 0.63 && p < 0.72) : (p >= 0.18 && p < 0.26);

  return (
    <ProductShell breadcrumb="Eligibility & Pre-Authorisation" color={GREEN}>
      <div style={{ padding: '10px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>

        {/* Live header */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, boxShadow: `0 0 8px ${GREEN}`, animation: 'dpPulse 1s ease infinite' }} />
          <span style={{ fontSize: 8, fontWeight: 700, color: GREEN, letterSpacing: 0.5 }}>ELIGIBILITY ENGINE LIVE</span>
          <span style={{ fontSize: 7, color: MUTED }}>· Payer API · NABIDH · DHA Benefits Registry</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 7, color: MUTED }}>19 Apr 2025 · 09:12 GST</span>
        </div>

        {/* Phase tabs */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', background: !ipdPhase ? `${GREEN}14` : 'rgba(0,0,0,0.14)', border: `1px solid ${!ipdPhase ? GREEN + '40' : BORDER}`, borderRadius: 20, padding: '3px 11px', transition: 'all 0.5s' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: !ipdPhase ? GREEN : DIM, transition: 'background 0.4s' }} />
            <span style={{ fontSize: 7, fontWeight: 800, color: !ipdPhase ? GREEN : DIM }}>OPD · Endocrinology</span>
            <span style={{ fontSize: 6.5, color: MUTED }}> · Daman Enhanced</span>
            {p >= 0.40 && <span style={{ fontSize: 7, color: GREEN }}>✓</span>}
          </div>
          {p >= 0.48 && (
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', background: `${AMBER}14`, border: `1px solid ${AMBER}40`, borderRadius: 20, padding: '3px 11px', animation: 'dpBeatIn 0.4s ease both' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: AMBER, animation: 'dpPulse 1.2s ease-in-out infinite' }} />
              <span style={{ fontSize: 7, fontWeight: 800, color: AMBER }}>IPD · Respiratory</span>
              <span style={{ fontSize: 6.5, color: MUTED }}> · Thiqa SEHA</span>
              {p >= 0.84 && <span style={{ fontSize: 7, color: GREEN }}>✓</span>}
            </div>
          )}
        </div>

        {/* ── Journey card ── */}
        <div style={{ flexShrink: 0, background: 'rgba(0,0,0,0.18)', border: `1px solid ${cleared ? col + '38' : BORDER}`, borderRadius: 12, padding: '10px 14px', transition: 'border-color 0.6s ease', boxShadow: cleared ? `0 0 20px ${col}10` : 'none' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>

            {/* Patient byte — small info card, no name */}
            <div key={ipdPhase ? 'ipd' : 'opd'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0, animation: 'dpSpringIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${col}22`, border: `2px solid ${col}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, boxShadow: `0 0 14px ${col}30` }}>
                {ipdPhase ? '🫁' : '🩺'}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: TXT }}>{ipdPhase ? 'M · 58 yrs' : 'F · 42 yrs'}</div>
                <div style={{ fontSize: 6.5, color: DIM }}>{ipdPhase ? 'Respiratory · IPD' : 'Endocrinology · OPD'}</div>
                <div style={{ marginTop: 3, background: `${col}14`, border: `1px solid ${col}30`, borderRadius: 4, padding: '2px 7px' }}>
                  <span style={{ fontSize: 6.5, fontWeight: 800, color: col }}>{ipdPhase ? 'Thiqa SEHA' : 'Daman Enhanced'}</span>
                </div>
              </div>
            </div>

            {/* Flow nodes + animated connectors */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              {flow.flatMap((step, i) => {
                const vis    = p >= step.show;
                const next   = flow[i + 1];
                const active = vis && next && p < next.show;
                const isLast = i === flow.length - 1;
                const lineOn = next && p >= next.show;

                const nodeEl = (
                  <div key={`n${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0, opacity: vis ? 1 : 0.15, transition: 'opacity 0.4s, transform 0.35s', transform: vis ? 'scale(1)' : 'scale(0.82)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: vis ? (active ? `${col}24` : `${col}12`) : 'rgba(255,255,255,0.03)', border: `2px solid ${vis ? (active ? col : col + '55') : BORDER}`, boxShadow: active ? `0 0 18px ${col}45, 0 0 40px ${col}15` : 'none', transition: 'all 0.4s ease' }}>
                      {step.icon}
                    </div>
                    <span style={{ fontSize: 5.5, fontWeight: active ? 800 : 600, color: vis ? (active ? col : `${col}bb`) : DIM, whiteSpace: 'nowrap', transition: 'color 0.4s' }}>
                      {step.label}
                    </span>
                    {step.api && vis && (
                      <span style={{ fontSize: 6, color: apiActive ? TEAL : `${GREEN}80`, fontWeight: 700, lineHeight: 1 }}>
                        {apiActive ? '⟳ ···' : '✓'}
                      </span>
                    )}
                  </div>
                );

                if (isLast) return [nodeEl];

                const arrowEl = (
                  <div key={`a${i}`} style={{ flex: 1, height: 2, borderRadius: 1, background: lineOn ? `linear-gradient(90deg,${col}55,${col}25)` : `${BORDER}35`, margin: '0 3px', marginBottom: 18, transition: 'background 0.5s ease', position: 'relative', overflow: 'hidden' }}>
                    {lineOn && (
                      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg,transparent 0%,${col}70 50%,transparent 100%)`, animation: 'dpChromeShimmer 1.2s ease-out both' }} />
                    )}
                  </div>
                );

                return [nodeEl, arrowEl];
              })}
            </div>
          </div>
        </div>

        {/* ── Status results ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
          {results.some(r => p >= r.show) && (
            <div style={{ fontSize: 7, fontWeight: 700, color: DIM, letterSpacing: 0.4, flexShrink: 0 }}>
              {ipdPhase ? 'IPD ELIGIBILITY · PRE-AUTH RESULTS' : 'OPD ELIGIBILITY RESULTS'} · REAL-TIME
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignContent: 'flex-start' }}>
            {results.map((r, i) => p >= r.show && (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${r.col}${r.hero ? '1e' : '10'}`, border: `1px solid ${r.col}${r.hero ? '55' : '28'}`, borderRadius: r.hero ? 8 : 20, padding: r.hero ? '6px 14px' : '4px 11px', animation: 'dpSpringIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both', boxShadow: r.hero ? `0 0 18px ${r.col}35, 0 0 50px ${r.col}12` : 'none', flexShrink: 0 }}>
                <span style={{ fontSize: r.hero ? 9 : 7.5, fontWeight: 900, color: r.col }}>{r.icon}</span>
                <span style={{ fontSize: r.hero ? 8 : 7, color: MUTED, fontWeight: 600 }}>{r.label}:</span>
                <span style={{ fontSize: r.hero ? 10 : 8, fontWeight: r.hero ? 900 : 700, color: r.hero ? r.col : TXT, fontFamily: r.hero ? 'Sora' : 'inherit' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cleared / Approved banner ── */}
        {cleared && (
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', animation: 'dpSpringIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both' }}>
            <div style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}55`, borderRadius: 24, padding: '6px 22px', boxShadow: `0 0 24px ${GREEN}25, 0 0 60px ${GREEN}08`, display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN, boxShadow: `0 0 10px ${GREEN}`, animation: 'dpPulse 1.5s ease-in-out infinite' }} />
              <span style={{ fontSize: 9, fontWeight: 900, color: GREEN }}>
                {ipdPhase ? '✅ PA Approved · AED 28,500 authorised · Admission cleared' : '✅ Eligibility cleared · No authorisation needed · Visit confirmed'}
              </span>
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
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'radial-gradient(ellipse 70% 60% at 50% 45%,#04091e 0%,#000 80%)', opacity: micOpacity, transition: 'opacity 0.4s ease', zIndex: 10, pointerEvents: micOpacity < 0.05 ? 'none' : 'auto' }}>
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
            <div style={{ background: `rgba(0,0,0,0.28)`, border: `1px solid ${highlightTranscript ? `${INDIGO}50` : BORDER}`, borderRadius: 7, padding: '7px 9px', flexShrink: 0, transition: 'border-color 0.5s', boxShadow: highlightTranscript ? `0 0 12px ${INDIGO}15` : 'none' }}>
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
            <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 11px', borderRadius: 7, background: selected ? `${GREEN}14` : 'rgba(255,255,255,0.04)', border: `1px solid ${selected ? GREEN + '50' : BORDER + '30'}`, transition: 'all 0.4s ease' }}>
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

/* Scene 6 — CDI: narrative physician-note → query auto-surfaces → guideline → tap → locked */
function CDIScreen({ progress }) {
  const p = progress;

  const ipdPhase      = p >= 0.50;
  const opdQueryShows = p >= 0.18;
  const opdAnswered   = p >= 0.33;
  const opdLocked     = p >= 0.42;
  const ipdQueryShows = p >= 0.60;
  const ipdAnswered   = p >= 0.76;
  const ipdLocked     = p >= 0.84;
  const drgValue      = ipdLocked ? '1.34' : opdLocked ? '1.04' : '0.82';
  const totalCapture  = ipdLocked ? '+AED 14,000' : opdLocked ? '+AED 4,200' : '';

  const opdNoteLines = [
    { text: 'Chief complaint: Poorly controlled blood sugars, fatigue ×3 months', show: 0.04 },
    { text: 'Lab: HbA1c 9.1% ↑ · BP 142/88 · eGFR 68 mL/min', show: 0.09 },
    { text: 'Impression: Type 2 DM — hyperglycaemia', show: 0.15, cursor: true },
  ];
  const ipdNoteLines = [
    { text: 'Admission: Shortness of breath · SpO₂ 88% on arrival', show: 0.52 },
    { text: 'PMH: COPD (FEV1 52%) · smoker 30 pack-years', show: 0.56 },
    { text: 'CXR: Right-lower-lobe opacity — Pneumonia', show: 0.60 },
    { text: 'Primary impression: COPD exacerbation', show: 0.64, cursor: true },
  ];

  return (
    <ProductShell breadcrumb="Clinical Documentation Intelligence" color={AMBER}>
      <div style={{ padding: '8px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 7, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 7.5, fontWeight: 700, color: AMBER, letterSpacing: 0.5 }}>CDI — DOCUMENTATION INTELLIGENCE</div>
            <div style={{ fontSize: 7, color: DIM, marginTop: 1 }}>Queries surface automatically · grounded in clinical guidelines · physician confirms in-note</div>
          </div>
          {/* Live IR-DRG badge */}
          <div style={{ background: `${PURPLE}12`, border: `1px solid ${PURPLE}35`, borderRadius: 8, padding: '5px 14px', textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 6.5, color: MUTED, marginBottom: 1 }}>IR-DRG WEIGHT</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: opdLocked ? PURPLE : DIM, fontFamily: 'Sora', lineHeight: 1, transition: 'color 0.8s, text-shadow 0.8s', textShadow: opdLocked ? `0 0 20px ${PURPLE}80` : 'none' }}>
              {opdLocked ? <CountUp value={drgValue} duration={600} key={drgValue} /> : '0.82'}
            </div>
            {totalCapture && <div style={{ fontSize: 6.5, color: GREEN, fontWeight: 700, marginTop: 2, animation: 'dpBeatIn 0.4s ease both' }}>{totalCapture}</div>}
          </div>
        </div>

        {/* Two-column: note | query */}
        <div style={{ display: 'flex', gap: 10, flex: 1, overflow: 'hidden' }}>

          {/* LEFT — physician note */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: DIM, letterSpacing: 0.4 }}>
              {ipdPhase ? 'IPD PHYSICIAN NOTE · IN PROGRESS' : 'OPD PHYSICIAN NOTE · IN PROGRESS'}
            </div>
            <div style={{ background: 'rgba(0,0,0,0.22)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 11px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(ipdPhase ? ipdNoteLines : opdNoteLines).map((line, i) => p >= line.show && (
                <div key={i} style={{ fontSize: 7.5, color: line.cursor ? `${TXT}cc` : TXT, lineHeight: 1.65, animation: 'dpRowBlurIn 0.4s ease both' }}>
                  {line.text}
                  {line.cursor && !(ipdPhase ? ipdAnswered : opdAnswered) && (
                    <span style={{ color: AMBER, fontWeight: 900, animation: 'dpPulse 1s ease-in-out infinite' }}> ▌</span>
                  )}
                </div>
              ))}
              {/* Docstribe watching indicator */}
              {(ipdPhase ? (p >= 0.54 && !ipdQueryShows) : (p >= 0.06 && !opdQueryShows)) && (
                <div style={{ marginTop: 6, display: 'flex', gap: 5, alignItems: 'center', animation: 'dpBeatIn 0.4s ease both' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: AMBER, animation: 'dpPulse 1.2s ease-in-out infinite' }} />
                  <span style={{ fontSize: 6.5, color: `${AMBER}90` }}>Docstribe reading note in real time…</span>
                </div>
              )}
              {/* Query surfaced indicator */}
              {(ipdPhase ? ipdQueryShows : opdQueryShows) && !(ipdPhase ? ipdLocked : opdLocked) && (
                <div style={{ marginTop: 6, display: 'flex', gap: 5, alignItems: 'center', animation: 'dpBeatIn 0.3s ease both' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: AMBER, boxShadow: `0 0 6px ${AMBER}` }} />
                  <span style={{ fontSize: 6.5, color: AMBER, fontWeight: 700 }}>Documentation gap detected → query surfaced</span>
                </div>
              )}
              {(ipdPhase ? ipdLocked : opdLocked) && (
                <div style={{ marginTop: 6, display: 'flex', gap: 5, alignItems: 'center', animation: 'dpBeatIn 0.3s ease both' }}>
                  <span style={{ fontSize: 6.5, color: GREEN, fontWeight: 700 }}>✓ Query answered · note updated · charge captured at point of care</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — CDI query */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: DIM, letterSpacing: 0.4 }}>DOCSTRIBE CDI QUERY</div>

            {!ipdPhase && (opdQueryShows ? (
              <CDIQueryCard
                col={AMBER}
                title="Documentation Gap Detected"
                sub="Auto-surfaced · OPD · in-note · no disruption"
                question="Is this Type 2 DM controlled or uncontrolled?"
                guidelinePills={[['ADA 2024 §6.1', PURPLE]]}
                opts={['E11.65 — Uncontrolled (HbA1c 9.1%)', 'E11.9 — Controlled / no complications']}
                answered={opdAnswered}
                locked={opdLocked}
                codeFrom="E11.9"
                codeTo="E11.65"
                codeLabel="CC captured"
                drgFrom="0.82"
                drgTo="1.04"
                delta="+AED 4,200"
              />
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${AMBER}12`, border: `1px solid ${AMBER}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, animation: 'dpPulse 2s ease-in-out infinite' }}>⚡</div>
                <div style={{ fontSize: 7.5, color: DIM, textAlign: 'center', lineHeight: 1.6 }}>Scanning note in real time…<br/>Query will surface automatically</div>
              </div>
            ))}

            {ipdPhase && (ipdQueryShows ? (
              <CDIQueryCard
                col={TEAL}
                title="Principal Diagnosis Query"
                sub="Auto-surfaced · IPD · sequencing conflict detected"
                question="What was the primary reason for this admission?"
                guidelinePills={[['ATS/IDSA CAP 2019', PURPLE], ['Thiqa SEHA Policy', TEAL]]}
                opts={['J18.9 — Pneumonia (primary reason for admission)', 'J44.1 — COPD exacerbation (pre-existing)']}
                answered={ipdAnswered}
                locked={ipdLocked}
                codeFrom="J44.1 principal"
                codeTo="J18.9 principal"
                codeLabel="MCC locked"
                drgFrom="0.94"
                drgTo="1.34"
                delta="+AED 9,800"
              />
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, animation: 'dpBeatIn 0.4s ease both' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${TEAL}12`, border: `1px solid ${TEAL}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, animation: 'dpPulse 2s ease-in-out infinite' }}>⚡</div>
                <div style={{ fontSize: 7.5, color: DIM, textAlign: 'center', lineHeight: 1.6 }}>Reading IPD note in real time…<br/>Query will surface automatically</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProductShell>
  );
}

/* Scene 7 — AI Coding: ICD-10-CM, CPT, NCCI/MUE edits, IR-DRG scoring */
function CodingScreen({ progress }) {
  const showOPD    = progress >= 0.06;
  const showIPD    = progress >= 0.30;
  const showCPT    = progress >= 0.22;
  const showNCCI   = progress >= 0.38;
  const showDRG    = progress >= 0.48;
  const showImpact = progress >= 0.68;

  const opdICD = [
    { code: 'E11.65', desc: 'Type 2 DM — uncontrolled hyperglycaemia', type: 'Principal', conf: 96, col: RED,    show: 0.08 },
    { code: 'I10',    desc: 'Essential (primary) hypertension',          type: 'CC',       conf: 92, col: AMBER,  show: 0.13 },
    { code: 'N18.3',  desc: 'CKD — Stage 3 (creatinine 1.4)',            type: 'CC',       conf: 84, col: INDIGO, show: 0.18 },
  ];
  const opdCPT = [
    { code: '99214', desc: 'E/M Office Visit — Level 4 (complex)', units: 1, mueLimit: 1, ncci: 'Standalone — no conflict', col: TEAL,   show: 0.24 },
    { code: '83036', desc: 'HbA1c measurement (laboratory)',         units: 1, mueLimit: 1, ncci: 'Allowed with 99214 — separate service', col: AMBER,  show: 0.28 },
    { code: '82570', desc: 'Creatinine — serum (renal function)',     units: 1, mueLimit: 1, ncci: 'Allowed with 83036 — different analyte', col: INDIGO, show: 0.33 },
  ];
  const ipdICD = [
    { code: 'J18.9', desc: 'Pneumonia — unspecified organism (principal)', type: 'Principal', conf: 97, col: RED,    show: 0.32 },
    { code: 'J44.1', desc: 'COPD with acute exacerbation',                  type: 'MCC',      conf: 94, col: AMBER,  show: 0.37 },
    { code: 'I10',   desc: 'Essential hypertension',                         type: 'CC',       conf: 90, col: TEAL,   show: 0.42 },
    { code: 'E11.9', desc: 'Type 2 DM — without complications',              type: 'CC',       conf: 81, col: PURPLE, show: 0.46 },
  ];
  const typeColor = (t) => t === 'Principal' ? TEAL : t === 'MCC' ? RED : t === 'CC' ? AMBER : MUTED;

  return (
    <ProductShell breadcrumb="ICD-10-CM · Smart Coding Engine" color={PURPLE}>
      <div style={{ padding: '10px 13px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Two-column layout: OPD left, IPD right */}
        <div style={{ display: 'flex', gap: 10, flex: 1, overflow: 'hidden' }}>

          {/* ── OPD Column ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, overflow: 'hidden' }}>

            {/* OPD ICD-10-CM */}
            {showOPD && (
              <div style={{ animation: 'dpBeatIn 0.4s ease both' }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, color: PURPLE, letterSpacing: 0.5, marginBottom: 5 }}>F.H. (OPD) — ICD-10-CM RANKED</div>
                {opdICD.map((c, i) => {
                  const vis = progress >= c.show;
                  const act = progress >= c.show && progress < c.show + 0.10;
                  return vis ? (
                    <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'center', padding: '4px 8px', marginBottom: 3, borderRadius: 7, background: act ? `${c.col}14` : `${c.col}07`, border: `1px solid ${act ? c.col + '50' : BORDER}`, transition: 'all 0.4s ease', animation: 'dpBeatIn 0.4s ease both' }}>
                      <div style={{ display: 'flex', flex: 1, gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: c.col, fontFamily: 'Sora', width: 46, flexShrink: 0 }}>{c.code}</span>
                        <span style={{ fontSize: 7.5, color: TXT, flex: 1, lineHeight: 1.3 }}>{c.desc}</span>
                      </div>
                      <span style={{ fontSize: 6, fontWeight: 800, color: typeColor(c.type), background: `${typeColor(c.type)}18`, border: `1px solid ${typeColor(c.type)}30`, borderRadius: 3, padding: '1px 5px', flexShrink: 0 }}>{c.type}</span>
                      <div style={{ width: 52, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                        <div style={{ height: '100%', width: `${c.conf}%`, background: c.col, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 7, fontWeight: 700, color: c.col, width: 28, textAlign: 'right' }}>{c.conf}%</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* CPT codes */}
            {showCPT && (
              <div style={{ animation: 'dpBeatIn 0.4s ease both' }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, color: TEAL, letterSpacing: 0.5, marginBottom: 5 }}>CPT PROCEDURE CODES</div>
                {opdCPT.map((c, i) => {
                  const vis = progress >= c.show;
                  return vis ? (
                    <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '4px 8px', marginBottom: 3, borderRadius: 7, background: `${c.col}08`, border: `1px solid ${BORDER}`, animation: 'dpBeatIn 0.4s ease both' }}>
                      <span style={{ fontSize: 10, fontWeight: 900, color: c.col, fontFamily: 'Sora', width: 46, flexShrink: 0 }}>{c.code}</span>
                      <span style={{ fontSize: 7.5, color: TXT, flex: 1 }}>{c.desc}</span>
                      <span style={{ fontSize: 6, color: GREEN, fontWeight: 700, background: `${GREEN}12`, border: `1px solid ${GREEN}25`, borderRadius: 3, padding: '1px 6px' }}>×{c.units} · MUE ✓</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* NCCI edits */}
            {showNCCI && (
              <div style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}28`, borderRadius: 8, padding: '7px 10px', animation: 'dpSpringIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both' }}>
                <div style={{ fontSize: 7, fontWeight: 700, color: GREEN, letterSpacing: 0.5, marginBottom: 4 }}>NCCI / MUE EDIT RESULTS</div>
                {[
                  { pair: '99214 + 83036', status: 'Allowed', detail: 'Distinct service — no bundling conflict', col: GREEN },
                  { pair: '83036 + 82570', status: 'Allowed', detail: 'Different analytes — permitted together', col: GREEN },
                  { pair: '99214 units',   status: 'MUE Pass', detail: '1 unit claimed · limit: 1/day · within policy', col: TEAL },
                ].map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: i < 2 ? 3 : 0 }}>
                    <span style={{ fontSize: 7.5, fontWeight: 700, color: e.col, fontFamily: 'Sora', flexShrink: 0 }}>{e.status}</span>
                    <span style={{ fontSize: 7, color: MUTED, fontWeight: 700, flexShrink: 0 }}>{e.pair}</span>
                    <span style={{ fontSize: 6.5, color: DIM, flex: 1 }}>{e.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div style={{ width: 1, background: BORDER, flexShrink: 0 }} />

          {/* ── IPD Column ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, overflow: 'hidden' }}>

            {/* IPD ICD-10-CM */}
            {showIPD && (
              <div style={{ animation: 'dpBeatIn 0.5s ease both' }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, color: PURPLE, letterSpacing: 0.5, marginBottom: 5 }}>K.A. (IPD) — ICD-10-CM SEQUENCED</div>
                {ipdICD.map((c, i) => {
                  const vis = progress >= c.show;
                  const act = progress >= c.show && progress < c.show + 0.10;
                  return vis ? (
                    <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'center', padding: '4px 8px', marginBottom: 3, borderRadius: 7, background: act ? `${c.col}14` : `${c.col}07`, border: `1px solid ${act ? c.col + '50' : BORDER}`, transition: 'all 0.4s ease', animation: 'dpBeatIn 0.4s ease both' }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: `${c.col}20`, border: `1px solid ${c.col}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 6, fontWeight: 900, color: c.col }}>{i + 1}</span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 900, color: c.col, fontFamily: 'Sora', width: 46, flexShrink: 0 }}>{c.code}</span>
                      <span style={{ fontSize: 7.5, color: TXT, flex: 1, lineHeight: 1.3 }}>{c.desc}</span>
                      <span style={{ fontSize: 6, fontWeight: 800, color: typeColor(c.type), background: `${typeColor(c.type)}18`, border: `1px solid ${typeColor(c.type)}30`, borderRadius: 3, padding: '1px 5px', flexShrink: 0 }}>{c.type}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* IR-DRG weight computation */}
            {showDRG && (
              <div style={{ animation: 'dpBeatIn 0.5s ease both' }}>
                <div style={{ fontSize: 7.5, fontWeight: 700, color: MUTED, letterSpacing: 0.5, marginBottom: 6 }}>IR-DRG WEIGHT COMPUTATION</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 7 }}>
                  <div style={{ flex: 1, background: `${RED}0a`, border: `1px solid ${RED}25`, borderRadius: 8, padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 7, color: MUTED, marginBottom: 3 }}>BEFORE CDI</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: RED, fontFamily: 'Sora', lineHeight: 1 }}>0.94</div>
                    <div style={{ fontSize: 6.5, color: DIM, marginTop: 2 }}>J18.9 only · CCs missed</div>
                  </div>
                  <div style={{ fontSize: 20, color: PURPLE, flexShrink: 0 }}>→</div>
                  <div style={{ flex: 1, background: `${PURPLE}10`, border: `1px solid ${PURPLE}40`, borderRadius: 8, padding: '10px', textAlign: 'center', boxShadow: `0 0 20px ${PURPLE}20` }}>
                    <div style={{ fontSize: 7, color: MUTED, marginBottom: 3 }}>AFTER CDI</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: PURPLE, fontFamily: 'Sora', lineHeight: 1 }}>
                      <CountUp value="1.34" duration={700} key="drg-after" />
                    </div>
                    <div style={{ fontSize: 6.5, color: DIM, marginTop: 2 }}>J18.9 + J44.1 MCC + 2× CC</div>
                  </div>
                </div>
                {/* CC/MCC contribution breakdown */}
                <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}>
                  {[
                    { label: 'Base DRG', val: '0.94', col: MUTED },
                    { label: 'MCC (J44.1)', val: '+0.22', col: RED },
                    { label: 'CC (I10)', val: '+0.10', col: AMBER },
                    { label: 'CC (E11.9)', val: '+0.08', col: TEAL },
                  ].map(({ label, val, col }) => (
                    <div key={label} style={{ flex: 1, background: `${col}08`, border: `1px solid ${col}20`, borderRadius: 5, padding: '4px 6px', textAlign: 'center' }}>
                      <div style={{ fontSize: 8.5, fontWeight: 900, color: col, fontFamily: 'Sora' }}>{val}</div>
                      <div style={{ fontSize: 5.5, color: DIM, marginTop: 1 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Revenue impact */}
            {showImpact && (
              <div style={{ textAlign: 'center', animation: 'dpSpringIn 0.65s cubic-bezier(0.34,1.4,0.64,1) both' }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: GREEN, fontFamily: 'Sora', letterSpacing: -1.5, lineHeight: 1, textShadow: `0 0 50px ${GREEN}80` }}>+AED 18,400</div>
                <div style={{ fontSize: 7, color: DIM, marginTop: 3, letterSpacing: 0.3 }}>additional revenue · per case · on every case</div>
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
              <div key={i} style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center', padding: '8px 10px', background: s.done ? `${s.col}12` : 'rgba(255,255,255,0.02)', border: `1px solid ${s.done ? s.col + '40' : BORDER}`, borderRadius: 8, transition: 'all 0.5s ease' }}>
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

/* Scene 10 — Service Line Growth: clinical deterioration signals → ops engagement queue */
function TowerScreen({ progress }) {
  const patients = [
    { init: 'D.K.', dept: 'Respiratory', signal: 'SpO₂ 94→88% over 4h · deteriorating',    opportunity: 'IR-DRG escalation window open',         action: 'CDI Alert',  actionCol: AMBER,  uplift: '+AED 18K', risk: 'HIGH',     col: TEAL,   show: 0.10, profile: { referral: 'Pulm ICU consult',       next: 'Escalate IR-DRG',         guideline: 'ATS/ERS: SpO₂ <90% → ICU review' } },
    { init: 'N.M.', dept: 'Cardiology',  signal: 'BNP risen 3× — heart failure likely',     opportunity: 'Complex DRG candidate · MCC qualifies', action: 'Ops Engage', actionCol: RED,    uplift: '+AED 32K', risk: 'CRITICAL', col: RED,    show: 0.28, profile: { referral: 'Cardiology specialist',  next: 'BNP-triggered CDI query', guideline: 'ACC/AHA HF: BNP >500 → specialist' } },
    { init: 'A.R.', dept: 'Neurology',   signal: 'GCS change Day 2 — LOS extension likely', opportunity: 'CDI query pending · CC documentation',  action: 'CDI Query',  actionCol: INDIGO, uplift: '+AED 14K', risk: 'HIGH',     col: INDIGO, show: 0.46, profile: { referral: 'Neuro CDI team',         next: 'CC documentation query',  guideline: 'AAN: GCS Δ Day 2 → MCC eligible' } },
    { init: 'B.S.', dept: 'Oncology',   signal: 'ECOG progressing — chemo eligible',        opportunity: 'Pre-auth for systemic therapy ready',   action: 'PA Ready',   actionCol: GREEN,  uplift: '+AED 27K', risk: 'MED',      col: PURPLE, show: 0.62, profile: { referral: 'Oncology PA pathway',    next: 'Systemic therapy pre-auth', guideline: 'ESMO: ECOG 1→2 → systemic eligible' } },
  ];
  return (
    <ProductShell breadcrumb="Service Line Growth · Clinical Engagement" color={INDIGO}>
      <div style={{ padding: '10px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Header */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 8, color: MUTED, fontWeight: 700, letterSpacing: 0.5 }}>CLINICAL DETERIORATION SIGNALS → OPS ENGAGEMENT QUEUE</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: TXT, marginTop: 2 }}>Docstribe reads patient deterioration and surfaces revenue engagement opportunities in real time — no lag, no reports</div>
          </div>
          {progress >= 0.06 && (
            <div style={{ background: `${INDIGO}15`, border: `1px solid ${INDIGO}40`, borderRadius: 8, padding: '6px 14px', textAlign: 'center', animation: 'dpBeatIn 0.4s ease both', flexShrink: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: INDIGO, fontFamily: 'Sora', lineHeight: 1 }}>4</div>
              <div style={{ fontSize: 6, color: DIM }}>patients flagged</div>
            </div>
          )}
        </div>

        {/* Column headers */}
        <div style={{ display: 'flex', padding: '0 8px', borderBottom: `1px solid ${BORDER}` }}>
          {[['Patient', 1], ['AI Profile', 2], ['Clinical Signal', 2], ['Revenue Opportunity', 2], ['Action', 1], ['Uplift', 1]].map(([h, f], i) => (
            <div key={i} style={{ flex: f, fontSize: 7, color: i === 1 ? PURPLE : MUTED, fontWeight: 700, padding: '3px 0', letterSpacing: 0.3 }}>{h}</div>
          ))}
        </div>

        {/* Patient rows — one spotlit at a time */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {patients.map((p, i) => {
            const visible = progress >= p.show;
            const active = spot(progress, p.show, p.show + 0.18);
            const past = progress > p.show + 0.18;
            return (
              <div key={i} style={{ ...glow(active, p.col, { borderRadius: 8, padding: '9px 10px', display: 'flex', alignItems: 'center' }), opacity: visible ? (past ? 0.55 : 1) : 0, transform: visible ? (active ? 'scale(1.02)' : 'scale(1)') : 'translateY(10px)', transition: 'all 0.5s cubic-bezier(0.34,1.2,0.64,1)' }}>
                <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: `${p.col}20`, border: `1.5px solid ${p.col}45`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 8, fontWeight: 900, color: p.col }}>{p.init}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: active ? p.col : TXT }}>{p.dept}</div>
                    <Badge text={p.risk} color={p.risk === 'CRITICAL' ? RED : p.risk === 'HIGH' ? AMBER : GREEN} />
                  </div>
                </div>
                {/* AI Profile column */}
                <div style={{ flex: 2, paddingRight: 6 }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: 6, fontWeight: 800, color: p.risk === 'CRITICAL' ? RED : p.risk === 'HIGH' ? AMBER : GREEN, background: `${p.risk === 'CRITICAL' ? RED : p.risk === 'HIGH' ? AMBER : GREEN}18`, borderRadius: 3, padding: '1px 4px', flexShrink: 0 }}>{p.risk}</span>
                    <span style={{ fontSize: 7, color: PURPLE, fontWeight: 600 }}>{p.profile.referral}</span>
                  </div>
                  <div style={{ fontSize: 6.5, color: DIM, marginBottom: 1 }}>→ {p.profile.next}</div>
                  <div style={{ fontSize: 6, color: `${PURPLE}90`, fontStyle: 'italic' }}>{p.profile.guideline}</div>
                </div>
                <div style={{ flex: 2, fontSize: 9, color: active ? TXT : DIM, fontWeight: active ? 600 : 400, paddingRight: 6 }}>{p.signal}</div>
                <div style={{ flex: 2, fontSize: 8, color: DIM, paddingRight: 6 }}>{p.opportunity}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 7, fontWeight: 800, color: p.actionCol, background: `${p.actionCol}18`, border: `1px solid ${p.actionCol}35`, borderRadius: 4, padding: '2px 7px' }}>{p.action}</span>
                </div>
                <div style={{ flex: 1, textAlign: 'right', fontSize: 11, fontWeight: 900, color: p.col, fontFamily: 'Sora' }}>{p.uplift}</div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {progress >= 0.78 && (
          <div style={{ display: 'flex', gap: 8, animation: 'dpBeatIn 0.4s ease both' }}>
            <div style={{ flex: 1, background: `${INDIGO}10`, border: `1px solid ${INDIGO}25`, borderRadius: 8, padding: '7px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: INDIGO, fontFamily: 'Sora' }}>AED 91K</div>
              <div style={{ fontSize: 7, color: DIM }}>revenue opportunity · 4 patients · live</div>
            </div>
            <div style={{ flex: 1, background: `${TEAL}10`, border: `1px solid ${TEAL}25`, borderRadius: 8, padding: '7px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: TEAL, fontFamily: 'Sora' }}>Day 0</div>
              <div style={{ fontSize: 7, color: DIM }}>clinical signal → ops team · no lag · no reports</div>
            </div>
            <div style={{ flex: 1, background: `${PURPLE}10`, border: `1px solid ${PURPLE}25`, borderRadius: 8, padding: '7px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: PURPLE, fontFamily: 'Sora', marginBottom: 2 }}>AI Profiles</div>
              <div style={{ fontSize: 7, color: DIM }}>per-patient intelligence · risk · referral opportunity · clinical guidelines</div>
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
            <div style={{ fontSize: 30, fontWeight: 900, fontFamily: 'Sora', background: `linear-gradient(135deg,#fff 20%,${TEAL} 55%,${INDIGO})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1.5, lineHeight: 1 }}>Docstribe</div>
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

        {/* Closing tagline — sits above stat strip with bottom padding */}
        {closingShow && (
          <div style={{ flexShrink: 0, paddingBottom: 6, animation: 'dpSpringIn 0.7s cubic-bezier(0.34,1.4,0.64,1) both' }}>
            <div style={{ background: `linear-gradient(135deg,${TEAL}1a,${INDIGO}10)`, border: `1px solid ${TEAL}40`, borderRadius: 10, padding: '9px 18px', boxShadow: `0 0 30px ${TEAL}14` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: TXT, textAlign: 'center' }}>
                Not a tool you configure once.{' '}
                <span style={{ color: TEAL, textShadow: `0 0 14px ${TEAL}60` }}>A partner that learns your hospital.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* ─── Scene router ───────────────────────────────────────────── */
function SceneVisual({ scene, progress }) {
  switch (scene.type) {
    case 'stat':      return <StatScene scene={scene} progress={progress} />;
    case 'kpi':       return <KPIScene  scene={scene} progress={progress} />;
    case 'dashboard': return <DashboardScreen progress={progress} />;
    case 'product':
      switch (scene.id) {
        case 3:  return <CasesScreen       progress={progress} />;
        case 4:  return <EligibilityScreen progress={progress} />;
        case 5:  return <AmbientScreen     progress={progress} />;
        case 6:  return <CDIScreen         progress={progress} />;
        case 7:  return <CodingScreen      progress={progress} />;
        case 8:  return <DenialScreen      progress={progress} />;
        case 9:  return <ClaimScreen       progress={progress} />;
        case 10: return <TowerScreen       progress={progress} />;
        default: return null;
      }
    default: return null;
  }
}

/* ─── Intro Splash ───────────────────────────────────────────── */
function Splash({ onPlay }) {
  return (
    <div onClick={onPlay} style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'radial-gradient(ellipse 80% 60% at 50% 45%, #06102a 0%, #000 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(0,203,168,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,203,168,0.3) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      {/* Breathing ambient */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 55% 45% at 50% 50%,${TEAL}07 0%,transparent 70%)`, animation: 'dpBreath 4s ease-in-out infinite' }} />
      <div style={{ fontSize: 9, fontWeight: 700, color: `${TEAL}90`, letterSpacing: 3, textTransform: 'uppercase' }}>Clinical Intelligence Platform</div>
      <div style={{ fontSize: 44, fontWeight: 900, background: `linear-gradient(135deg,#fff 40%,${TEAL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1.5, lineHeight: 1 }}>Docstribe</div>
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
      {/* Credential pills — smaller row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 440 }}>
        {[['US · UAE · India', INDIGO], ['100+ Hospitals', TEAL], ['10M+ Lives', PURPLE], ['30 Yrs Clinical Exp', AMBER]].map(([t, c]) => (
          <span key={t} style={{ fontSize: 8, fontWeight: 700, color: c, background: `${c}12`, border: `1px solid ${c}28`, borderRadius: 20, padding: '3px 10px', letterSpacing: 0.3 }}>{t}</span>
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
        background: 'linear-gradient(135deg,rgba(2,5,18,0.96),rgba(6,10,28,0.92))',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        padding: '8px 22px',
        border: `1px solid ${scene.color}60`,
        boxShadow: `0 0 0 1px ${scene.color}20, 0 0 28px ${scene.color}30, 0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 ${scene.color}20`,
        pointerEvents: 'none',
        animation: 'dpSpringIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both',
        maxWidth: '76%', whiteSpace: 'nowrap',
      }}
    >
      {/* Bloom dot */}
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: scene.color, boxShadow: `0 0 12px ${scene.color}, 0 0 24px ${scene.color}80`, flexShrink: 0, animation: 'dpPulse 1.6s ease-in-out infinite' }} />
      {/* Stat — hero scale */}
      <span style={{ fontSize: 18, fontWeight: 900, color: scene.color, fontFamily: 'Sora', letterSpacing: -0.5, textShadow: `0 0 20px ${scene.color}80` }}>
        {fired.stat}
      </span>
      {fired.sub && <span style={{ fontSize: 9, color: DIM, overflow: 'hidden', textOverflow: 'ellipsis' }}>· {fired.sub}</span>}
    </div>
  );
}

/* ─── Sentence caption — sits at very bottom, above nav ─────── */
function Caption({ sentence }) {
  return (
    <div key={sentence} style={{ position: 'absolute', bottom: 10, left: '6%', right: '6%', zIndex: 12, textAlign: 'center', fontSize: 11, fontFamily: 'Sora', color: 'rgba(255,255,255,0.52)', fontStyle: 'italic', lineHeight: 1.5, textShadow: '0 1px 10px rgba(0,0,0,1)', animation: 'dpFadeCaption 0.4s ease both' }}>
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

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef   = useRef(null);
  const rafRef      = useRef(null);
  const t0Ref       = useRef(0);
  const durRef      = useRef(0);
  const firedRef    = useRef(new Set());

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

  const playScene = useCallback(async (sceneIdx) => {
    const s = SCENES[sceneIdx];
    setLoading(true);
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

      const res = await fetch('/api/demo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sceneId: s.id }),
      });
      if (!res.ok) throw new Error('audio fetch failed');
      const { audio } = await res.json();
      const buf = await audioCtxRef.current.decodeAudioData(b64ToArrayBuffer(audio));

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
    } catch (err) {
      console.error('DemoPlayer error:', err);
      setLoading(false); setIsPlaying(false);
    }
  }, [autoAdvance]);

  useEffect(() => {
    if (started && !isPlaying && !loading) playScene(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const handleFirstPlay = () => { setSplashDone(true); playScene(0); };
  const togglePlay = () => { if (isPlaying) stopAudio(); else playScene(idx); };

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
        <div style={{ position: 'absolute', inset: -2, borderRadius: 14, boxShadow: `0 0 80px ${scene.color}14, 0 0 140px rgba(0,0,0,0.7)`, pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.06)`, boxShadow: '0 24px 80px rgba(0,0,0,0.75)', background: '#000' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            {!splashDone && <Splash onPlay={handleFirstPlay} />}

            {exitIdx !== null && (
              <div key={`exit-${exitIdx}`} style={{ position: 'absolute', inset: 0, zIndex: 1, animation: 'dpExitScene 0.5s ease-in both' }}>
                <SceneVisual scene={SCENES[exitIdx]} progress={0} />
              </div>
            )}

            <div key={`sc-${idx}`} style={{ position: 'absolute', inset: 0, zIndex: 2, animation: started ? 'dpEnterScene 0.5s ease-out both' : 'none' }}>
              <SceneVisual scene={scene} progress={progress} />
            </div>

            <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 25, background: 'rgba(0,0,0,0.3)' }}>
              <div style={{ height: '100%', width: `${totalPct}%`, background: `linear-gradient(90deg,${scene.color},${INDIGO})`, transition: 'width 0.15s linear' }} />
            </div>

            {isPlaying && <Caption sentence={currentSentence} />}
            <SceneStatStrip scene={scene} progress={progress} />

            <div style={{ position: 'absolute', bottom: 26, right: 14, zIndex: 25, display: 'flex', gap: 5 }}>
              <button onClick={() => idx > 0 && goTo(idx - 1)} disabled={idx === 0} style={{ width: 26, height: 26, borderRadius: 5, border: `1px solid ${BORDER}`, background: 'rgba(0,0,0,0.6)', color: idx === 0 ? '#1e293b' : DIM, fontSize: 13, cursor: idx === 0 ? 'default' : 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
              <button onClick={togglePlay} disabled={loading} style={{ height: 26, padding: '0 14px', borderRadius: 5, border: `1px solid ${scene.color}40`, background: isPlaying ? 'rgba(248,113,113,0.12)' : `linear-gradient(135deg,${scene.color}1e,${INDIGO}16)`, color: isPlaying ? '#f87171' : scene.color, fontSize: 10, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 5, boxShadow: !isPlaying && !loading ? `0 0 14px ${scene.color}20` : 'none', transition: 'all 0.2s' }}>
                {loading
                  ? <div style={{ width: 9, height: 9, borderRadius: '50%', border: `2px solid ${scene.color}40`, borderTopColor: scene.color, animation: 'dpSpin 0.7s linear infinite' }} />
                  : isPlaying
                    ? <><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>Pause</>
                    : <><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>{started ? 'Play' : '▶ Play Demo'}</>}
              </button>
              <button onClick={() => idx < SCENES.length - 1 && goTo(idx + 1)} disabled={idx === SCENES.length - 1} style={{ width: 26, height: 26, borderRadius: 5, border: `1px solid ${BORDER}`, background: 'rgba(0,0,0,0.6)', color: idx === SCENES.length - 1 ? '#1e293b' : DIM, fontSize: 13, cursor: idx === SCENES.length - 1 ? 'default' : 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 14, flexWrap: 'wrap' }}>
          {SCENES.map((s, i) => {
            const active = i === idx;
            const past   = i < idx;
            return (
              <button key={i} onClick={() => goTo(i)} title={s.title} style={{ height: 5, width: active ? 20 : 5, borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer', background: active ? s.color : past ? `${s.color}55` : 'rgba(255,255,255,0.12)', boxShadow: active ? `0 0 8px ${s.color}80` : 'none', transition: 'all 0.3s ease', flexShrink: 0 }} />
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
      `}</style>
    </section>
  );
}
