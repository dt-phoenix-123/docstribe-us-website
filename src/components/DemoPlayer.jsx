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

/* ─── Glow card style ────────────────────────────────────────── */
function glow(active, color, extra = {}) {
  return {
    transition: 'all 0.5s cubic-bezier(0.34,1.2,0.64,1)',
    transform: active ? 'scale(1.03)' : 'scale(1)',
    border: active ? `1px solid ${color}70` : `1px solid rgba(255,255,255,0.07)`,
    boxShadow: active ? `0 0 28px ${color}30, 0 4px 20px rgba(0,0,0,0.5)` : '0 2px 8px rgba(0,0,0,0.25)',
    background: active ? `${color}16` : `${color}07`,
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
  const pattern = /(twelve to eighteen percent|sixty to seventy percent|thirty percent|twenty-five percent|zero point fifteen|twenty percent|sixty days|thirty-two days|forty-five days|zero leakage|ICD-10-CM|NABIDH|DHA licensed|DHA|IR-DRG|CMI|Docstribe|guaranteed|\d+(?:\.\d+)?%|arcus@docstribe\.com)/gi;
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <span key={i} style={{ color: TEAL, fontWeight: 900, textDecoration: 'underline', textUnderlineOffset: '3px' }}>{part}</span>
      : part
  );
}

/* ══════════════════ SCENE DATA ═════════════════════════════════ */
const SCENES = [
  {
    id: 1, type: 'stat', color: TEAL,
    title: 'The Revenue Gap',
    vo: 'In UAE hospitals, twelve to eighteen percent of all claims are denied on first submission. Sixty to seventy percent of those denials are entirely preventable — not clinical failures, but documentation gaps. What physicians write for care is read by payers for compliance. That gap is where your revenue disappears. Docstribe closes it before it opens.',
    beats: [
      { at: 0.04, stat: '12–18%',         sub: 'UAE claims denied on first submission' },
      { at: 0.22, stat: '60–70%',         sub: 'of those denials are entirely preventable' },
      { at: 0.78, stat: 'Zero leakage.',  sub: 'Docstribe closes the gap before it opens' },
    ],
  },
  {
    id: 2, type: 'kpi', color: TEAL,
    title: 'Introducing Docstribe',
    vo: 'Docstribe is a skilled AI agentic workforce — purpose-built for UAE healthcare. It listens to every clinical signal, every financial trigger, and every insurer pattern, then acts on them in real time. The result? Within sixty days of going live — guaranteed: thirty percent fewer claim denials. Twenty-five percent more revenue captured. CMI up by zero point fifteen. Accounts receivable down from forty-five to thirty-two days.',
    beats: [
      { at: 0.04, stat: 'Docstribe',  sub: 'AI agentic workforce — UAE healthcare' },
      { at: 0.30, stat: '60 days',    sub: 'Guaranteed from go-live · contractual SLA' },
      { at: 0.44, stat: '↓30%',       sub: 'Fewer denials on first submission' },
      { at: 0.58, stat: '+25%',       sub: 'Revenue capture uplift' },
      { at: 0.72, stat: '+0.15',      sub: 'CMI uplift per discharge' },
      { at: 0.86, stat: '32 days',    sub: 'AR days — down from 45' },
    ],
  },
  {
    id: 3, type: 'product', color: TEAL,
    title: 'One Unified Workspace',
    breadcrumb: 'Cases Workbench',
    vo: 'Every patient encounter — outpatient, inpatient, emergency — flows into one unified workspace. Clinical context and financial status in the same view. From first appointment to final payment, every gap is visible and every action is trackable.',
    beats: [
      { at: 0.12, stat: '200 active cases',   sub: 'OPD · IPD · Emergency — unified' },
      { at: 0.52, stat: 'Zero leakage',        sub: 'every encounter tracked end-to-end' },
    ],
  },
  {
    id: 4, type: 'product', color: GREEN,
    title: 'Pre-Visit Intelligence',
    breadcrumb: 'Eligibility & Pre-Authorisation',
    vo: 'By the time a patient arrives, every coverage decision is already made. Eligibility verified. Pre-authorisation triggered at order entry — not at discharge — across all UAE insurance partners. No chasing. No write-offs. No surprises.',
    beats: [
      { at: 0.18, stat: 'Auth at order entry', sub: 'not at discharge — OPD and IPD' },
      { at: 0.72, stat: '✅ PA APPROVED',       sub: 'Zero front-door write-off risk' },
    ],
  },
  {
    id: 5, type: 'product', color: INDIGO,
    title: 'Ambient Clinical Intelligence',
    breadcrumb: 'Ambient Scribe — OPD & IPD',
    vo: 'The platform builds a complete structured clinical note from every encounter automatically — ICD-10-CM coded, compliance-stamped, and ready for billing. Fully NABIDH-compliant and DHA licensed. Physicians focus entirely on care. The documentation is simply done.',
    beats: [
      { at: 0.12, stat: 'OPD note built live',    sub: 'DM · HTN · auto-coded from voice' },
      { at: 0.50, stat: 'IPD H&P complete',        sub: 'Pneumonia · COPD · ward round done' },
      { at: 0.78, stat: 'NABIDH ✓  DHA ✓',        sub: 'compliant · structured · exchange-ready' },
    ],
  },
  {
    id: 6, type: 'product', color: AMBER,
    title: 'CDI — Closing the Gap',
    breadcrumb: 'Clinical Documentation Intelligence',
    vo: 'Clinical documentation intelligence fires in real time. For outpatients, medical necessity is confirmed before the claim is built. For inpatients, it closes the IR-DRG gap while the patient is still admitted. Every physician response is e-signed and timestamped — every query is an audit trail.',
    beats: [
      { at: 0.10, stat: 'OPD — Medical Necessity',    sub: 'physician confirms with one tap' },
      { at: 0.52, stat: 'IPD — IR-DRG gap closed',    sub: 'diagnosis sequence locked at admission' },
      { at: 0.84, stat: 'DHA Compliant · Audit Ready', sub: 'e-signed · timestamped · defensible' },
    ],
  },
  {
    id: 7, type: 'product', color: PURPLE,
    title: 'AI-Powered Coding',
    breadcrumb: 'ICD-10-CM · Smart Coding Engine',
    vo: 'Clinical notes are converted into the most defensible, highest-weight ICD-10-CM codes the documentation supports. Comorbidities are captured and ranked. Symptom-only codes are suppressed. The IR-DRG weight — and the revenue it carries — reflects what your team actually delivered.',
    beats: [
      { at: 0.14, stat: 'Notes → ICD-10-CM',    sub: 'diagnoses ranked · symptoms suppressed' },
      { at: 0.52, stat: 'IR-DRG 0.94 → 1.34',  sub: 'weight maximised · revenue recovered' },
      { at: 0.82, stat: '+AED 18,400',           sub: 'per case · zero manual backlog' },
    ],
  },
  {
    id: 8, type: 'product', color: RED,
    title: 'Denial Intelligence',
    breadcrumb: 'Payor Contract Intelligence',
    vo: 'Before any claim is submitted, denial risk is scored against each insurer\'s specific patterns. Recoverable revenue surfaces before it disappears. Four denial drivers are flagged and resolved pre-submission. The denial rate drops by thirty percent — not through appeals, but through prevention.',
    beats: [
      { at: 0.12, stat: 'AED 214,600',       sub: 'recoverable revenue identified' },
      { at: 0.48, stat: '4 denial drivers',   sub: 'flagged and resolved pre-submission' },
      { at: 0.80, stat: 'Denial rate ↓ 30%', sub: 'systemic prevention, not one-off fixes' },
    ],
  },
  {
    id: 9, type: 'product', color: TEAL,
    title: 'One-Click Recovery',
    breadcrumb: 'Claim Recovery — Bundling Dispute',
    vo: 'When a denial does arrive, a contract-grounded appeal is assembled and ready in one click — policy terms cited, clinical evidence attached. What used to take your team three weeks takes the platform thirty seconds. Revenue that was lost is found.',
    beats: [
      { at: 0.20, stat: 'AED 1,900 denied', sub: 'OPD · bundling · CARC 97 · recoverable' },
      { at: 0.68, stat: '1-click appeal',   sub: 'contract clauses cited · recovery underway' },
    ],
  },
  {
    id: 10, type: 'product', color: INDIGO,
    title: '30-Day Revenue Pipeline',
    breadcrumb: 'Case Management Control Tower',
    vo: 'Finance gains a rolling thirty-day revenue forecast by service line — driven by live clinical signals from the moment of admission. Surgical candidates identified early. Revenue predicted at admission, not estimated at month end.',
    beats: [
      { at: 0.15, stat: 'AED 1.4M forecast',    sub: 'next 30 days · IR-DRG weighted · live' },
      { at: 0.60, stat: 'Clinical signals',      sub: 'not averages — predictive from admission' },
    ],
  },
  {
    id: 11, type: 'dashboard', color: TEAL,
    title: 'One Platform. Zero Leakage.',
    breadcrumb: 'Executive Revenue Dashboard',
    vo: 'Everything your board needs in one view. Thirty percent fewer denials. Twenty-five percent more revenue captured. CMI up by zero point fifteen. Accounts receivable at thirty-two days. Zero leakage. These outcomes are guaranteed within sixty days of going live. One platform. Docstribe.',
    beats: [
      { at: 0.10, stat: '↓30% · +25%',               sub: 'denial reduction · revenue capture — guaranteed' },
      { at: 0.48, stat: '+0.15 CMI · 32d AR',          sub: 'complexity uplift · AR days — within 60 days' },
      { at: 0.80, stat: 'One platform. Zero leakage.', sub: 'Clinical Intelligence · Financial Integrity' },
    ],
  },
];

/* ─── ProductShell — SaaS chrome wrapper ─────────────────────── */
function ProductShell({ breadcrumb, color, children }) {
  const nav = ['◉','⊞','◷','⚡','⚙'];
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', background: BLUE, fontFamily: 'Sora,sans-serif' }}>
      <div style={{ width: 42, flexShrink: 0, background: '#060b14', borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 3 }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, marginBottom: 12, background: `linear-gradient(135deg,${color},${INDIGO})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff' }}>D</div>
        {nav.map((ic, i) => (
          <div key={i} style={{ width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, opacity: i === 0 ? 1 : 0.22, background: i === 0 ? `${color}22` : 'transparent', color: i === 0 ? color : DIM }}>{ic}</div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 34, flexShrink: 0, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6, background: 'rgba(0,0,0,0.35)' }}>
          <span style={{ fontSize: 8, color: MUTED }}>Docstribe</span>
          <span style={{ fontSize: 8, color: '#1e293b' }}>›</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: TXT }}>{breadcrumb}</span>
          <div style={{ flex: 1 }} />
          {[color, INDIGO, '#1e293b'].map((c, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{children}</div>
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

/* Scene 1 — Revenue gap: BIG numbers, one at a time */
function StatScene({ scene, progress }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 45%,#040a18 0%,#000 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(rgba(0,203,168,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,203,168,0.5) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
      <div style={{ position: 'absolute', bottom: 14, right: 18, fontSize: 8, fontWeight: 800, color: `${TEAL}45`, letterSpacing: 2, fontFamily: 'Sora' }}>DOCSTRIBE</div>
      {scene.beats.map((b, i) => {
        const show = progress >= b.at;
        const active = spot(progress, b.at, b.at + 0.28);
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(24px)', transition: 'all 0.9s cubic-bezier(0.34,1.2,0.64,1)', filter: show && !active && i < 2 ? 'brightness(0.5)' : 'brightness(1)' }}>
            <div style={{ fontSize: i === 0 ? 96 : i === 1 ? 76 : 20, fontWeight: 900, letterSpacing: -2, fontFamily: 'Sora', lineHeight: 1.0, color: i === 2 ? DIM : '#fff', textShadow: active ? `0 0 80px ${TEAL}80` : i < 2 ? `0 0 40px ${TEAL}30` : 'none', transition: 'text-shadow 0.5s ease' }}>
              {show ? <CountUp value={b.stat} duration={900} key={`${i}-${show}`} /> : b.stat}
            </div>
            <div style={{ fontSize: i === 2 ? 14 : 11, color: i === 2 ? TXT : DIM, fontFamily: 'Sora', textAlign: 'center', maxWidth: 480, letterSpacing: 0.2, fontWeight: i === 2 ? 500 : 400 }}>{b.sub}</div>
            {i < 2 && show && <div style={{ width: 32, height: 2, background: active ? TEAL : `${TEAL}40`, borderRadius: 1, transition: 'background 0.5s' }} />}
          </div>
        );
      })}
    </div>
  );
}

/* Scene 2 — Intro Docstribe (p<0.30), then KPI outcomes (p>=0.28) */
function KPIScene({ scene, progress }) {
  // intro fades out 0.24→0.34, kpis fade in 0.26→0.36
  const introOpacity = progress < 0.24 ? 1 : progress > 0.34 ? 0 : 1 - (progress - 0.24) / 0.10;
  const kpiOpacity   = progress < 0.26 ? 0 : progress > 0.36 ? 1 : (progress - 0.26) / 0.10;
  const kpiBeats = scene.beats.slice(1); // skip first beat (Docstribe) — shown in intro phase
  const colors = [TEAL, GREEN, AMBER, INDIGO, PURPLE];

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 40%,#060f24 0%,#000 75%)', overflow: 'hidden' }}>

      {/* ── Phase 1: Introducing Docstribe ── */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 48px', opacity: introOpacity, transition: 'opacity 0.6s ease', pointerEvents: introOpacity < 0.1 ? 'none' : 'auto' }}>

        <div style={{ fontSize: 9, fontWeight: 700, color: `${TEAL}80`, letterSpacing: 3, textTransform: 'uppercase' }}>The Solution</div>

        <div style={{ fontSize: 54, fontWeight: 900, background: `linear-gradient(135deg,#fff 35%,${TEAL} 65%,${INDIGO})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1.5, lineHeight: 1, animation: 'dpBeatIn 0.7s cubic-bezier(0.34,1.4,0.64,1) both' }}>
          Docstribe
        </div>

        <div style={{ fontSize: 14, color: TXT, textAlign: 'center', maxWidth: 520, lineHeight: 1.7, fontWeight: 500, opacity: progress >= 0.08 ? 1 : 0, transition: 'opacity 0.6s ease' }}>
          A skilled <span style={{ color: TEAL, fontWeight: 800 }}>AI agentic workforce</span> that listens to every clinical signal,<br />every financial trigger, and every insurer pattern — and acts in real time.
        </div>

        {progress >= 0.14 && (
          <div style={{ display: 'flex', gap: 12, animation: 'dpBeatIn 0.5s ease both', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['📋 Clinical Intelligence', INDIGO], ['💰 Financial Signals', TEAL], ['🔒 Insurer Patterns', PURPLE]].map(([l, c]) => (
              <div key={l} style={{ fontSize: 10, fontWeight: 700, color: c, background: `${c}16`, border: `1px solid ${c}30`, borderRadius: 20, padding: '6px 16px' }}>{l}</div>
            ))}
          </div>
        )}

        {progress >= 0.20 && (
          <div style={{ fontSize: 10, color: DIM, animation: 'dpBeatIn 0.5s ease both', textAlign: 'center' }}>
            Built for UAE healthcare · NABIDH · DHA · IR-DRG · 60-day outcomes, <span style={{ color: TEAL, fontWeight: 700 }}>guaranteed</span>
          </div>
        )}
      </div>

      {/* ── Phase 2: KPI Outcomes ── */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 28px', opacity: kpiOpacity, transition: 'opacity 0.6s ease', pointerEvents: kpiOpacity < 0.1 ? 'none' : 'auto' }}>

        <div style={{ fontSize: 9, fontWeight: 700, color: `${TEAL}80`, letterSpacing: 3, textTransform: 'uppercase' }}>60-Day Outcome Guarantee · Contractual · Auditable</div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 920 }}>
          {kpiBeats.map((b, i) => {
            const show = progress >= b.at;
            const active = spot(progress, b.at, b.at + 0.16);
            const c = colors[i];
            return (
              <div key={i} style={{ background: `linear-gradient(135deg,${c}14,${c}07)`, border: `1px solid ${c}${active ? '55' : show ? '25' : '10'}`, borderRadius: 14, padding: '18px 20px', minWidth: 120, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: show ? 1 : 0, transform: show ? `scale(${active ? 1.07 : 1})` : 'translateY(28px) scale(0.82)', transition: 'all 0.55s cubic-bezier(0.34,1.4,0.64,1)', boxShadow: active ? `0 0 36px ${c}28` : 'none', filter: show && !active ? 'brightness(0.7)' : 'brightness(1)' }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: c, fontFamily: 'Sora', lineHeight: 1, letterSpacing: -0.5 }}>
                  {show ? <CountUp value={b.stat} duration={700} key={`k${i}-${show}`} /> : b.stat}
                </div>
                <div style={{ width: 22, height: 2, borderRadius: 1, background: c }} />
                <div style={{ fontSize: 8, color: DIM, textAlign: 'center', lineHeight: 1.5 }}>{b.sub}</div>
              </div>
            );
          })}
        </div>

        {progress >= 0.90 && (
          <div style={{ fontSize: 10, color: DIM, animation: 'dpBeatIn 0.5s ease both' }}>
            Auditable against your pre-integration baseline · <span style={{ color: TEAL, fontWeight: 700 }}>backed by Docstribe SLA</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* Scene 3 — Cases Workbench: opens with "agentic workforce" card, then encounter rows */
function CasesScreen({ progress }) {
  const agentCardShow = progress < 0.14;
  const workbenchShow = progress >= 0.08;
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

        {/* Agentic workforce opening card — fades out as workbench loads */}
        {agentCardShow && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: BLUE, padding: 32, animation: progress > 0.08 ? 'dpExitScene 0.5s ease-in both' : 'dpEnterScene 0.5s ease-out both' }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: `${TEAL}80`, letterSpacing: 3, textTransform: 'uppercase' }}>Docstribe Intelligence</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', textAlign: 'center', lineHeight: 1.3, maxWidth: 480 }}>
              A skilled <span style={{ color: TEAL }}>AI agentic workforce</span> that listens to every clinical and financial signal
            </div>
            <div style={{ fontSize: 11, color: DIM, textAlign: 'center', maxWidth: 420, lineHeight: 1.7 }}>
              Every patient signal · Every insurer pattern · Every documentation gap —<br />
              captured, processed, and acted on in real time. <span style={{ color: TEAL, fontWeight: 700 }}>Putting you ahead in the RCM game.</span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {[['📋 Clinical', INDIGO], ['💰 Financial', TEAL], ['🧠 Predictive', PURPLE]].map(([l, c]) => (
                <div key={l} style={{ fontSize: 9, fontWeight: 700, color: c, background: `${c}16`, border: `1px solid ${c}30`, borderRadius: 20, padding: '5px 14px' }}>{l}</div>
              ))}
            </div>
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
          <div style={{ textAlign: 'center', fontSize: 9, color: TEAL, fontWeight: 700, animation: 'dpBeatIn 0.4s ease both' }}>
            Zero leakage — every encounter tracked from admission to payment
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 4 — Eligibility: UAE payer names, step-by-step reveal */
function EligibilityScreen({ progress }) {
  const paApproved = progress >= 0.72;
  const opdActive = spot(progress, 0.05, 0.46);
  const ipdActive = spot(progress, 0.46, 0.95);
  const opdSteps = [
    { label: 'Member verified — Daman Enhanced', sub: 'Member ID: ***-4821 · Plan: Comprehensive Plus', show: 0.08 },
    { label: 'Coverage active · AED 6,550 remaining', sub: 'Benefit limit: AED 15,000 · valid Dec 2025', show: 0.18 },
    { label: 'No prior authorisation required', sub: 'DM + HTN consult — benefit included', show: 0.30 },
  ];
  const ipdSteps = [
    { label: 'Admission trigger detected', sub: 'K.A. · Respiratory · IPD Day 1', show: 0.46 },
    { label: 'Clinical docs auto-attached', sub: 'J18.9 Pneumonia · J44.1 COPD — uploaded', show: 0.56 },
    { label: 'PA submitted to Thiqa / SEHA', sub: 'REF: THQ-2024-189234 · AED 28,500 requested', show: 0.64 },
    { label: 'Pre-authorisation approved', sub: 'THQ-2024-189234 · AED 28,500 authorised ✓', show: 0.72, highlight: true },
  ];
  return (
    <ProductShell breadcrumb="Eligibility & Pre-Authorisation" color={GREEN}>
      <div style={{ padding: '12px 14px', height: '100%', display: 'flex', gap: 12 }}>
        {/* OPD flow */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ ...glow(opdActive, INDIGO, { borderRadius: 10, padding: '10px 13px' }), animation: 'dpRowIn 0.4s ease both' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
              <Pill text="OPD" color={INDIGO} size={10} />
              <span style={{ fontSize: 11, fontWeight: 700, color: TXT }}>Outpatient Encounter</span>
              <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: INDIGO }}>F.H. · Endo</span>
            </div>
            <div style={{ background: `${INDIGO}0a`, borderRadius: 7, padding: '8px 10px', marginBottom: 8 }}>
              <div style={{ fontSize: 8, color: DIM }}>Payer: <span style={{ color: TXT, fontWeight: 700 }}>Daman Enhanced (Abu Dhabi)</span></div>
              <div style={{ fontSize: 8, color: DIM, marginTop: 2 }}>Diagnosis: <span style={{ color: TXT }}>Type 2 DM + Hypertension · Annual review</span></div>
            </div>
            {opdSteps.map((step, i) => (
              progress >= step.show && (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0', borderBottom: `1px solid ${BORDER}`, animation: 'dpBeatIn 0.4s ease both' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${GREEN}`, background: `${GREEN}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 9, color: GREEN }}>✓</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: TXT, fontWeight: 600 }}>{step.label}</div>
                    <div style={{ fontSize: 7, color: DIM, marginTop: 1 }}>{step.sub}</div>
                  </div>
                </div>
              )
            ))}
          </div>
          {progress >= 0.36 && (
            <div style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}35`, borderRadius: 9, padding: '12px 14px', textAlign: 'center', animation: 'dpBeatIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: GREEN, fontFamily: 'Sora' }}>✓ Visit Cleared</div>
              <div style={{ fontSize: 8, color: DIM, marginTop: 4 }}>No auth required · pre-validated · zero financial risk</div>
            </div>
          )}
        </div>
        <div style={{ width: 1, background: BORDER, flexShrink: 0 }} />
        {/* IPD flow */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ ...glow(ipdActive, TEAL, { borderRadius: 10, padding: '10px 13px' }), animation: 'dpRowIn 0.4s ease 0.1s both' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
              <Pill text="IPD" color={TEAL} size={10} />
              <span style={{ fontSize: 11, fontWeight: 700, color: TXT }}>Inpatient Admission</span>
              <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: TEAL }}>K.A. · Resp Day 3</span>
            </div>
            <div style={{ background: `${TEAL}0a`, borderRadius: 7, padding: '8px 10px', marginBottom: 8 }}>
              <div style={{ fontSize: 8, color: DIM }}>Payer: <span style={{ color: TXT, fontWeight: 700 }}>Thiqa / SEHA (Abu Dhabi)</span></div>
              <div style={{ fontSize: 8, color: DIM, marginTop: 2 }}>Diagnosis: <span style={{ color: TXT }}>Pneumonia J18.9 + COPD J44.1</span></div>
            </div>
            {ipdSteps.map((step, i) => (
              progress >= step.show && (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0', borderBottom: `1px solid ${BORDER}`, animation: 'dpBeatIn 0.4s ease both' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: `1.5px solid ${step.highlight ? GREEN : TEAL}`, background: `${step.highlight ? GREEN : TEAL}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 9, color: step.highlight ? GREEN : TEAL }}>✓</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: step.highlight ? GREEN : TXT, fontWeight: step.highlight ? 800 : 600 }}>{step.label}</div>
                    <div style={{ fontSize: 7, color: DIM, marginTop: 1 }}>{step.sub}</div>
                  </div>
                </div>
              )
            ))}
          </div>
          {paApproved && (
            <div style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}40`, borderRadius: 9, padding: '14px', textAlign: 'center', animation: 'dpBeatIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>✅</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: GREEN, fontFamily: 'Sora' }}>PA APPROVED</div>
              <div style={{ fontSize: 8, color: DIM, marginTop: 4 }}>Ref: THQ-2024-189234 · AED 28,500 authorised · at order entry</div>
            </div>
          )}
        </div>
      </div>
    </ProductShell>
  );
}

/* Scene 5 — Ambient Scribe: concise snippets — voice → AI → structured note */
function AmbientScreen({ progress }) {
  const nabidh = progress >= 0.80;

  // OPD phases (snippets only)
  const opdVoice      = progress >= 0.06 && progress < 0.40;
  const opdProcessing = progress >= 0.38 && progress < 0.48;
  const opdNote       = progress >= 0.46;

  // IPD phases (snippets only)
  const ipdVoice      = progress >= 0.50 && progress < 0.68;
  const ipdProcessing = progress >= 0.66 && progress < 0.73;
  const ipdNote       = progress >= 0.71;

  // Snippet text — just one key line, not the full transcript
  const opdSnippet = '"HbA1c nine point one — uncontrolled. BP one forty two over eighty eight. eGFR sixty eight..."';
  const ipdSnippet = '"Sats ninety one on room air. Bilateral crackles. CRP one forty eight. Query COPD on pneumonia..."';

  const opdEntities = ['HbA1c 9.1% ↑', 'BP 142/88', 'eGFR 68', 'E11.65'];
  const ipdEntities = ['SpO₂ 91% ↓', 'CRP 148', 'Bilateral crackles', 'J18.9'];

  const opdCodes = [
    { code: 'E11.65', desc: 'Type 2 DM with hyperglycemia', col: RED,   show: 0.48 },
    { code: 'I10',    desc: 'Essential hypertension',        col: AMBER, show: 0.54 },
    { code: 'N18.3',  desc: 'CKD Stage 3 (eGFR 68)',        col: INDIGO,show: 0.60 },
  ];
  const ipdCodes = [
    { code: 'J18.9', desc: 'Pneumonia, unspecified',          col: RED,   show: 0.73 },
    { code: 'J44.1', desc: 'COPD with acute exacerbation',    col: AMBER, show: 0.78 },
    { code: 'E11.9', desc: 'Type 2 DM without complications', col: TEAL,  show: 0.83 },
  ];

  const AmbientCol = ({ tag, color, name, voiceActive, processingActive, noteActive, snippet, entities, codes }) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <Pill text={tag} color={color} />
        <span style={{ fontSize: 10, fontWeight: 700, color: TXT }}>{name}</span>
        {voiceActive && (
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: RED, animation: 'dpPulse 1s ease infinite' }} />
            <span style={{ fontSize: 7, color: RED, fontWeight: 800, letterSpacing: 0.5 }}>LISTENING</span>
          </div>
        )}
        {processingActive && <Badge text="⚙ STRUCTURING" color={color} />}
        {noteActive && <Badge text="✓ NOTE READY" color={GREEN} />}
      </div>

      {/* Voice snippet card */}
      {(voiceActive || processingActive) && (
        <div style={{ background: `${color}0b`, border: `1px solid ${processingActive ? color : BORDER}55`, borderRadius: 10, padding: '12px 14px', transition: 'border-color 0.4s ease', animation: 'dpBeatIn 0.4s ease both' }}>
          {/* Mini waveform */}
          <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 14, marginBottom: 10 }}>
            {Array.from({ length: 22 }, (_, i) => (
              <div key={i} style={{ flex: 1, background: color, borderRadius: 2, opacity: voiceActive ? 0.65 : 0.25, height: voiceActive ? `${28 + Math.sin(i * 1.3 + progress * 38) * 55}%` : '25%', transition: 'height 0.12s ease, opacity 0.5s' }} />
            ))}
          </div>
          {/* One-line voice snippet */}
          <div style={{ fontSize: 9, color: DIM, lineHeight: 1.5, fontStyle: 'italic', marginBottom: processingActive ? 10 : 0 }}>
            {snippet}
          </div>
          {/* Entity tags appear when processing */}
          {processingActive && (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', animation: 'dpBeatIn 0.4s ease both' }}>
              <span style={{ fontSize: 7, color: MUTED }}>AI extracting →</span>
              {entities.map(t => (
                <span key={t} style={{ fontSize: 7, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 10, padding: '2px 7px' }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Structured note snippet */}
      {noteActive && (
        <div style={{ animation: 'dpEnterScene 0.5s ease-out both' }}>
          <div style={{ fontSize: 7, fontWeight: 800, color: MUTED, letterSpacing: 0.5, marginBottom: 6 }}>ICD-10-CM AUTO-CODED · CLAIM READY</div>
          {codes.map((c, i) => (
            progress >= c.show && (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', marginBottom: 4, borderRadius: 8, background: `${c.col}0e`, border: `1px solid ${c.col}25`, animation: 'dpBeatIn 0.4s ease both' }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: c.col, fontFamily: 'Sora', width: 46, flexShrink: 0 }}>{c.code}</span>
                <span style={{ fontSize: 9, color: TXT, flex: 1 }}>{c.desc}</span>
                <span style={{ fontSize: 8, color: GREEN, fontWeight: 800 }}>✓</span>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ProductShell breadcrumb="Ambient Scribe — OPD & IPD" color={INDIGO}>
      <div style={{ padding: '12px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* How it works — brief label */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', animation: 'dpRowIn 0.4s ease both' }}>
          {[['🎤 Voice', INDIGO], ['→', MUTED], ['🧠 AI processes', TEAL], ['→', MUTED], ['📋 Structured Note', GREEN]].map(([t, c], i) => (
            <span key={i} style={{ fontSize: 9, fontWeight: i % 2 === 0 ? 700 : 400, color: c }}>{t}</span>
          ))}
        </div>

        {/* OPD + IPD columns */}
        <div style={{ display: 'flex', gap: 12, flex: 1 }}>
          <AmbientCol
            tag="OPD" color={INDIGO} name="F.H. · Endocrinology"
            voiceActive={opdVoice} processingActive={opdProcessing} noteActive={opdNote}
            snippet={opdSnippet} entities={opdEntities} codes={opdCodes}
          />
          <div style={{ width: 1, background: BORDER, flexShrink: 0 }} />
          <AmbientCol
            tag="IPD" color={TEAL} name="K.A. · Respiratory"
            voiceActive={ipdVoice} processingActive={ipdProcessing} noteActive={ipdNote}
            snippet={ipdSnippet} entities={ipdEntities} codes={ipdCodes}
          />
        </div>

        {/* NABIDH / DHA compliance banner */}
        {nabidh && (
          <div style={{ background: `linear-gradient(90deg,${INDIGO}14,${TEAL}14)`, border: `1px solid ${TEAL}40`, borderRadius: 9, padding: '10px 14px', display: 'flex', gap: 20, alignItems: 'center', animation: 'dpBeatIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both', flexShrink: 0 }}>
            {[['NABIDH ✓', INDIGO, 'National Unified Medical Record'], ['DHA Licensed ✓', TEAL, 'Dubai Health Authority'], ['HL7 FHIR ✓', GREEN, 'Structured data exchange']].map(([label, c, sub]) => (
              <div key={label} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${c}` }} />
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: c }}>{label}</div>
                  <div style={{ fontSize: 7, color: DIM }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 6 — CDI: one query at a time, physician taps answer */
function CDIScreen({ progress }) {
  const auditReady = progress >= 0.84;
  const opdQueries = [
    { q: 'Is this DM follow-up medically necessary per DHA guidelines?', opts: ['Yes — medically necessary', 'Routine monitoring only'], answer: 0, show: 0.08, impact: '+AED 420 / claim with E11.65 vs E11.9' },
    { q: 'HbA1c 9.1% — document DM as controlled or uncontrolled?', opts: ['Uncontrolled (HbA1c 9.1%)', 'Controlled (HbA1c < 7%)'], answer: 0, show: 0.24, impact: 'E11.65 unlocks higher-weight code set' },
    { q: 'Is additional diagnostic workup clinically indicated?', opts: ['Clinically indicated — eGFR 68', 'Routine screening only'], answer: 0, show: 0.38, impact: 'N18.3 (CKD Stg 3) — billable comorbidity' },
  ];
  const ipdQueries = [
    { q: 'Confirm admission status — Inpatient or Observation?', opts: ['Confirm inpatient admission', 'Maintain observation status'], answer: 0, show: 0.50, impact: 'Inpatient = full IR-DRG weight applied' },
    { q: 'Does clinical picture meet Sepsis-3 criteria? qSOFA: 2', opts: ['Sepsis confirmed — Sepsis-3', 'Infection without organ dysfunction'], answer: 0, show: 0.64, impact: '+0.18 IR-DRG weight if Sepsis coded' },
    { q: 'Principal diagnosis — Pneumonia or COPD exacerbation?', opts: ['J18.9 — Pneumonia (primary)', 'J44.1 — COPD exacerbation (primary)'], answer: 0, show: 0.74, impact: 'Sequencing determines IR-DRG assignment' },
  ];
  return (
    <ProductShell breadcrumb="Clinical Documentation Intelligence" color={AMBER}>
      <div style={{ padding: '10px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', animation: 'dpRowIn 0.4s ease both' }}>
          <Pill text="OPD" color={INDIGO} /><span style={{ fontSize: 9, color: DIM }}>Medical Necessity Queries · F.H.</span>
          <div style={{ flex: 1 }} />
          <Pill text="IPD" color={TEAL} /><span style={{ fontSize: 9, color: DIM }}>IR-DRG Gap Closure · K.A.</span>
          {auditReady && <span style={{ marginLeft: 8, fontSize: 8, fontWeight: 700, color: GREEN, background: `${GREEN}18`, border: `1px solid ${GREEN}30`, borderRadius: 4, padding: '2px 7px', animation: 'dpBeatIn 0.4s ease both' }}>✓ DHA Compliant · Audit Ready</span>}
        </div>
        <div style={{ display: 'flex', gap: 10, flex: 1 }}>
          {/* OPD CDI */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: INDIGO, letterSpacing: 0.5 }}>OPD — Medical Necessity</div>
            {opdQueries.map((q, i) => {
              const visible = progress >= q.show;
              const active = spot(progress, q.show, q.show + 0.16);
              const ticked = progress >= q.show + 0.12;
              return (
                <div key={i} style={{ ...glow(active, INDIGO, { borderRadius: 8, padding: '9px 11px' }), opacity: visible ? 1 : 0, transform: visible ? (active ? 'scale(1.025)' : 'scale(1)') : 'translateY(10px)', transition: 'all 0.5s ease' }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: TXT, lineHeight: 1.4, marginBottom: 6 }}>{q.q}</div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: ticked ? 5 : 0 }}>
                    {q.opts.map((o, j) => (
                      <div key={j} style={{ flex: 1, display: 'flex', gap: 5, alignItems: 'center', padding: '5px 8px', borderRadius: 5, background: j === q.answer && ticked ? `${INDIGO}22` : 'rgba(255,255,255,0.03)', border: `1px solid ${j === q.answer && ticked ? INDIGO : BORDER}40`, transition: 'all 0.35s ease' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', border: `1.5px solid ${j === q.answer && ticked ? INDIGO : MUTED}`, background: j === q.answer && ticked ? INDIGO : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s ease' }}>
                          {j === q.answer && ticked && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <span style={{ fontSize: 8, color: j === q.answer && ticked ? TXT : DIM, lineHeight: 1.3 }}>{o}</span>
                      </div>
                    ))}
                  </div>
                  {ticked && <div style={{ fontSize: 7, color: TEAL, fontWeight: 700, animation: 'dpBeatIn 0.3s ease both' }}>✓ E-signed · {q.impact}</div>}
                </div>
              );
            })}
          </div>
          <div style={{ width: 1, background: BORDER, flexShrink: 0 }} />
          {/* IPD CDI */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: TEAL, letterSpacing: 0.5 }}>IPD — IR-DRG Gap Closure</div>
            {ipdQueries.map((q, i) => {
              const visible = progress >= q.show;
              const active = spot(progress, q.show, q.show + 0.12);
              const ticked = progress >= q.show + 0.10;
              const c = i === 0 ? RED : i === 1 ? AMBER : INDIGO;
              return (
                <div key={i} style={{ ...glow(active, c, { borderRadius: 8, padding: '9px 11px' }), opacity: visible ? 1 : 0, transform: visible ? (active ? 'scale(1.025)' : 'scale(1)') : 'translateY(10px)', transition: 'all 0.5s ease' }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: TXT, lineHeight: 1.4, marginBottom: 6 }}>{q.q}</div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: ticked ? 5 : 0 }}>
                    {q.opts.map((o, j) => (
                      <div key={j} style={{ flex: 1, display: 'flex', gap: 5, alignItems: 'center', padding: '5px 8px', borderRadius: 5, background: j === q.answer && ticked ? `${c}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${j === q.answer && ticked ? c : BORDER}40`, transition: 'all 0.35s ease' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', border: `1.5px solid ${j === q.answer && ticked ? c : MUTED}`, background: j === q.answer && ticked ? c : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s ease' }}>
                          {j === q.answer && ticked && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <span style={{ fontSize: 8, color: j === q.answer && ticked ? TXT : DIM }}>{o}</span>
                      </div>
                    ))}
                  </div>
                  {ticked && <div style={{ fontSize: 7, color: GREEN, fontWeight: 700, animation: 'dpBeatIn 0.3s ease both' }}>✓ E-signed · {q.impact}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProductShell>
  );
}

/* Scene 7 — AI Coding: note → ranked ICD-10-CM → DRG weight */
function CodingScreen({ progress }) {
  const showCodes = progress >= 0.14;
  const showIPD = progress >= 0.38;
  const drgReveal = progress >= 0.52;
  const drgAfter = progress >= 0.65;
  const showImpact = progress >= 0.80;
  const opdCodes = [
    { code: 'E11.65', desc: 'Type 2 DM with hyperglycemia', spec: 95, col: RED, show: 0.18 },
    { code: 'I10', desc: 'Essential (primary) hypertension', spec: 90, col: AMBER, show: 0.26 },
    { code: 'N18.3', desc: 'Chronic kidney disease — Stage 3', spec: 78, col: INDIGO, show: 0.34 },
  ];
  return (
    <ProductShell breadcrumb="ICD-10-CM · Smart Coding Engine" color={PURPLE}>
      <div style={{ padding: '12px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* 3-step header */}
        <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
          {[
            { icon: '📋', label: 'Clinical notes in', sub: 'physician dictation + nursing', show: 0.04 },
            { icon: '🧠', label: 'AI ranks diagnoses', sub: 'comorbidities · symptoms suppressed', show: 0.14 },
            { icon: '✅', label: 'ICD-10-CM codes out', sub: 'defensible · claim-ready', show: 0.28 },
          ].map((s, i) => {
            const visible = progress >= s.show;
            const active = spot(progress, s.show, s.show + 0.18);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ ...glow(active, PURPLE, { borderRadius: 9, padding: '10px 8px', flex: 1, textAlign: 'center' }), opacity: visible ? 1 : 0.25, transition: 'all 0.5s ease' }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: active ? PURPLE : TXT }}>{s.label}</div>
                  <div style={{ fontSize: 7, color: DIM, marginTop: 2 }}>{s.sub}</div>
                </div>
                {i < 2 && <div style={{ width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 14, color: progress >= [0.14,0.28][i] ? PURPLE : MUTED, transition: 'color 0.4s' }}>→</div>
                </div>}
              </div>
            );
          })}
        </div>

        {/* OPD codes */}
        {showCodes && (
          <div style={{ animation: 'dpBeatIn 0.4s ease both' }}>
            <div style={{ fontSize: 8, color: MUTED, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>F.H. (OPD) — RANKED ICD-10-CM OUTPUT</div>
            {opdCodes.map((c, i) => {
              const visible = progress >= c.show;
              const active = spot(progress, c.show, c.show + 0.12);
              return visible ? (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '5px 8px', marginBottom: 4, borderRadius: 7, background: active ? `${c.col}14` : `${c.col}07`, border: `1px solid ${active ? c.col : BORDER}${active ? '50' : ''}`, transition: 'all 0.4s ease', animation: 'dpBeatIn 0.4s ease both' }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: c.col, fontFamily: 'Sora', width: 48, flexShrink: 0 }}>{c.code}</span>
                  <span style={{ fontSize: 9, color: TXT, flex: 1 }}>{c.desc}</span>
                  <div style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ height: '100%', width: `${c.spec}%`, background: c.col, borderRadius: 3, boxShadow: active ? `0 0 8px ${c.col}60` : 'none', transition: 'box-shadow 0.3s' }} />
                  </div>
                  <span style={{ fontSize: 8, fontWeight: 700, color: c.col, width: 28, textAlign: 'right' }}>{c.spec}%</span>
                </div>
              ) : null;
            })}
          </div>
        )}

        {/* IPD IR-DRG before/after */}
        {showIPD && (
          <div style={{ animation: 'dpBeatIn 0.5s ease both' }}>
            <div style={{ fontSize: 8, color: MUTED, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>K.A. (IPD) — IR-DRG WEIGHT IMPACT</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1, background: `${RED}0a`, border: `1px solid ${RED}25`, borderRadius: 9, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: MUTED, marginBottom: 4 }}>BEFORE CDI</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: RED, fontFamily: 'Sora' }}>0.94</div>
                <div style={{ fontSize: 8, color: DIM, marginTop: 3 }}>J18.9 only · COPD + DM missed</div>
              </div>
              <div style={{ fontSize: 22, color: PURPLE, flexShrink: 0 }}>→</div>
              <div style={{ ...glow(drgReveal, PURPLE, { flex: 1, borderRadius: 9, padding: '12px', textAlign: 'center' }), opacity: drgAfter ? 1 : 0, transition: 'all 0.6s cubic-bezier(0.34,1.4,0.64,1)' }}>
                <div style={{ fontSize: 8, color: MUTED, marginBottom: 4 }}>AFTER CDI</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: PURPLE, fontFamily: 'Sora' }}>
                  {drgAfter ? <CountUp value="1.34" duration={700} key="drg" /> : '1.34'}
                </div>
                <div style={{ fontSize: 8, color: DIM, marginTop: 3 }}>J18.9 + J44.1 + E11.9 · all captured</div>
              </div>
            </div>
            {showImpact && (
              <div style={{ marginTop: 8, textAlign: 'center', animation: 'dpBeatIn 0.4s ease both' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: GREEN }}>↑ +AED 18,400 additional revenue · per case</span>
              </div>
            )}
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 8 — Denial Intelligence: payer-specific, one driver at a time */
function DenialScreen({ progress }) {
  const drivers = [
    { label: 'Medical Necessity — Daman',  code: 'CARC 50', amt: 'AED 78,600', pct: '37%', col: RED,    show: 0.15 },
    { label: 'Auth Required — Thiqa',      code: 'CARC 15', amt: 'AED 56,200', pct: '26%', col: AMBER,  show: 0.32 },
    { label: 'Bundled Service — AXA Gulf', code: 'CARC 97', amt: 'AED 48,300', pct: '22%', col: AMBER,  show: 0.48 },
    { label: 'Code Modifier — Oman Ins.',  code: 'CARC 4',  amt: 'AED 31,500', pct: '15%', col: GREEN,  show: 0.63 },
  ];
  const bigNum = progress >= 0.12;
  return (
    <ProductShell breadcrumb="Payor Contract Intelligence" color={RED}>
      <div style={{ padding: '12px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Big recoverable total */}
        <div style={{ ...glow(spot(progress, 0.10, 0.30), RED, { borderRadius: 12, padding: '14px 16px', textAlign: 'center' }), opacity: bigNum ? 1 : 0, transition: 'all 0.6s ease', animation: 'dpRowIn 0.4s ease both' }}>
          <div style={{ fontSize: 9, color: MUTED, letterSpacing: 1, marginBottom: 4, fontWeight: 700 }}>TOTAL RECOVERABLE REVENUE · CURRENT CYCLE</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: RED, fontFamily: 'Sora', lineHeight: 1 }}>
            {bigNum ? <CountUp value="214600" duration={700} key="rec" /> : '214,600'}
          </div>
          <div style={{ fontSize: 10, color: DIM, marginTop: 4 }}>AED · across 4 UAE payors · pre-submission identified</div>
        </div>

        <div style={{ fontSize: 9, color: MUTED, fontWeight: 700, letterSpacing: 0.5 }}>DENIAL DRIVERS — FLAGGED & RESOLVED PRE-SUBMISSION</div>

        {drivers.map((d, i) => {
          const visible = progress >= d.show;
          const active = spot(progress, d.show, d.show + 0.16);
          const pastFocus = progress > d.show + 0.16;
          return (
            <div key={i} style={{ ...glow(active, d.col, { borderRadius: 8, padding: '10px 13px', borderLeft: `3px solid ${d.col}` }), opacity: visible ? (pastFocus ? 0.6 : 1) : 0, transform: visible ? (active ? 'scale(1.025)' : 'scale(1)') : 'translateY(12px)', transition: 'all 0.5s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: TXT }}>{d.label}</span>
                  <div style={{ fontSize: 8, color: DIM, marginTop: 2 }}>{d.code} · flagged before submission</div>
                </div>
                <span style={{ fontSize: 16, fontWeight: 900, color: d.col, fontFamily: 'Sora' }}>{d.amt}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: d.col, background: `${d.col}18`, padding: '2px 8px', borderRadius: 5 }}>{d.pct}</span>
              </div>
            </div>
          );
        })}

        {progress >= 0.80 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, animation: 'dpBeatIn 0.4s ease both' }}>
            <span style={{ fontSize: 9, color: MUTED }}>Denial rate trend:</span>
            <div style={{ flex: 1, height: 22 }}>
              <svg width="100%" height="22" viewBox="0 0 240 22" preserveAspectRatio="none">
                <polyline points="0,20 40,17 80,14 120,10 160,7 200,4 240,3" fill="none" stroke={GREEN} strokeWidth="2.5" />
                <circle cx="240" cy="3" r="3.5" fill={GREEN} />
              </svg>
            </div>
            <span style={{ fontSize: 13, color: GREEN, fontWeight: 900 }}>↓ 30%</span>
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 9 — One-click recovery: denied → appeal → recovered */
function ClaimScreen({ progress }) {
  const letterGen = progress >= 0.62;
  const recovered = progress >= 0.82;
  return (
    <ProductShell breadcrumb="Claim Recovery — Bundling Dispute" color={TEAL}>
      <div style={{ padding: '12px 16px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Claim header */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', animation: 'dpRowIn 0.4s ease both' }}>
          <Pill text="OPD" color={INDIGO} />
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: TXT }}>F.H. · Daman Enhanced</span>
            <span style={{ fontSize: 8, color: MUTED, marginLeft: 6 }}>DM management visit · 14 Dec 2024</span>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 900, color: TEAL, fontFamily: 'Sora' }}>AED 1,900</span>
        </div>

        <div style={{ display: 'flex', gap: 10, flex: 1 }}>
          {/* Denied */}
          <div style={{ flex: 1, background: `${RED}0a`, border: `1px solid ${RED}28`, borderRadius: 10, padding: '14px', display: 'flex', flexDirection: 'column', gap: 8, animation: 'dpRowIn 0.4s ease 0.1s both' }}>
            <Badge text="DENIED" color={RED} />
            <div style={{ fontSize: 22, fontWeight: 900, color: RED, fontFamily: 'Sora' }}>CARC 97</div>
            <div style={{ fontSize: 9, color: DIM, lineHeight: 1.6 }}>Bundled service — DM management billed as standalone CPT</div>
            <div style={{ background: `${RED}0a`, borderRadius: 6, padding: '8px', marginTop: 'auto' }}>
              <div style={{ fontSize: 8, color: MUTED }}>Without platform:</div>
              <div style={{ fontSize: 9, color: RED, fontWeight: 700 }}>3–6 weeks manual chase</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 24, color: letterGen ? TEAL : MUTED, transition: 'color 0.5s ease' }}>→</div>
          </div>

          {/* Recovered */}
          <div style={{ ...glow(letterGen, TEAL, { flex: 1, borderRadius: 10, padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }), opacity: letterGen ? 1 : 0, transition: 'all 0.7s cubic-bezier(0.34,1.4,0.64,1)' }}>
            <Badge text="APPEAL GENERATED" color={TEAL} />
            <div style={{ fontSize: 22, fontWeight: 900, color: TEAL, fontFamily: 'Sora' }}>1 Click</div>
            <div style={{ background: `${TEAL}0a`, borderRadius: 7, padding: '8px 10px' }}>
              <div style={{ fontSize: 8, color: DIM, marginBottom: 4 }}>CONTRACT CLAUSE CITED AUTOMATICALLY</div>
              <div style={{ fontSize: 9, color: TXT, lineHeight: 1.5 }}>Daman Benefit Schedule, Clause 4.1.2 — standalone DM management with documented HbA1c review is <span style={{ color: TEAL, fontWeight: 700 }}>not bundled</span> under office visit</div>
            </div>
            {recovered && (
              <div style={{ fontSize: 12, fontWeight: 800, color: GREEN, animation: 'dpBeatIn 0.4s ease both' }}>
                ✅ AED 1,900 recovery in progress · 30 seconds
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 9, color: DIM }}>
          Denial to appeal: <span style={{ color: TEAL, fontWeight: 700 }}>seconds, not weeks</span>
        </div>
      </div>
    </ProductShell>
  );
}

/* Scene 10 — 30-Day Pipeline: 3 clean "clinical signal → revenue" cards */
function TowerScreen({ progress }) {
  const signals = [
    {
      icon: '🫁', dept: 'Respiratory',
      signal: '3 surgical candidates identified at ED admission',
      detail: 'Pre-auth secured · theatre slot flagged',
      forecast: 'AED 380K', col: TEAL, show: 0.18,
    },
    {
      icon: '❤️', dept: 'Cardiology',
      signal: '2 cath lab bookings confirmed',
      detail: 'Complex cases · PA pre-approved · IR-DRG weighted',
      forecast: 'AED 290K', col: INDIGO, show: 0.42,
    },
    {
      icon: '⚡', dept: 'Cross-Specialty Pipeline',
      signal: '6 service lines active · 45 inpatient cases',
      detail: 'Each tracked from admission signal to discharge revenue',
      forecast: 'AED 730K', col: PURPLE, show: 0.65,
    },
  ];

  return (
    <ProductShell breadcrumb="Case Management Control Tower" color={INDIGO}>
      <div style={{ padding: '14px 16px', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Big headline number */}
        <div style={{ ...glow(spot(progress, 0.06, 0.22), INDIGO, { borderRadius: 12, padding: '14px 18px', textAlign: 'center' }), animation: 'dpRowIn 0.4s ease both' }}>
          <div style={{ fontSize: 9, color: MUTED, letterSpacing: 1.5, marginBottom: 4, fontWeight: 700 }}>30-DAY REVENUE PIPELINE · IR-DRG WEIGHTED</div>
          <div style={{ fontSize: 44, fontWeight: 900, color: INDIGO, fontFamily: 'Sora', lineHeight: 1 }}>
            {progress > 0.06 ? <CountUp value="1400000" duration={800} key="pipe" /> : 'AED 1.4M'}
          </div>
          <div style={{ fontSize: 9, color: DIM, marginTop: 4 }}>Driven by live clinical signals · from the moment of admission</div>
        </div>

        {/* 3 signal cards — one spotlit at a time */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {signals.map((s, i) => {
            const visible = progress >= s.show;
            const active = spot(progress, s.show, s.show + 0.22);
            const past = progress > s.show + 0.22;
            return (
              <div key={i} style={{ ...glow(active, s.col, { borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center' }), opacity: visible ? (past ? 0.6 : 1) : 0, transform: visible ? (active ? 'scale(1.02)' : 'scale(1)') : 'translateY(16px)', transition: 'all 0.55s cubic-bezier(0.34,1.2,0.64,1)' }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: active ? s.col : TXT, transition: 'color 0.3s' }}>{s.dept}</span>
                    {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.col, boxShadow: `0 0 8px ${s.col}`, animation: 'dpPulse 1.2s ease infinite' }} />}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: TXT, marginBottom: 3 }}>{s.signal}</div>
                  <div style={{ fontSize: 8, color: DIM }}>{s.detail}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.col, fontFamily: 'Sora' }}>
                    {visible ? <CountUp value={s.forecast.replace(/[^0-9K]/g, '')} duration={600} key={`f${i}`} /> : s.forecast}
                  </div>
                  <div style={{ fontSize: 7, color: DIM, marginTop: 2 }}>forecasted</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        {progress >= 0.88 && (
          <div style={{ textAlign: 'center', fontSize: 9, color: DIM, animation: 'dpBeatIn 0.4s ease both' }}>
            Clinical signal → revenue forecast · at admission · <span style={{ color: INDIGO, fontWeight: 700 }}>not at month-end</span>
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 11 — Executive Dashboard: 60-day guarantee front and centre */
function DashboardScreen({ progress }) {
  const guaranteeShow = progress >= 0.04;
  const kpiTimes = [0.14, 0.28, 0.42, 0.57];
  const guaranteeKPIs = [
    { val: '↓30%', label: 'First-submission denials', sub: 'vs. pre-integration baseline', col: TEAL },
    { val: '+25%', label: 'Net revenue capture', sub: 'incremental · measurable', col: GREEN },
    { val: '+0.15', label: 'CMI per discharge', sub: 'complexity-adjusted uplift', col: INDIGO },
    { val: '32d', label: 'Accounts receivable', sub: 'down from 45 days', col: PURPLE },
  ];
  const timelineShow = progress >= 0.68;
  const payorShow = progress >= 0.76;
  const brandShow = progress >= 0.88;

  return (
    <ProductShell breadcrumb="Executive Revenue Dashboard" color={TEAL}>
      <div style={{ padding: '10px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* 60-Day Guarantee Banner */}
        {guaranteeShow && (
          <div style={{ background: `linear-gradient(135deg,${TEAL}1a,${INDIGO}12)`, border: `1px solid ${TEAL}50`, borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, animation: 'dpBeatIn 0.7s cubic-bezier(0.34,1.4,0.64,1) both', flexShrink: 0 }}>
            <div style={{ background: `linear-gradient(135deg,${TEAL},${INDIGO})`, borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 900, color: '#fff', fontFamily: 'Sora', flexShrink: 0, whiteSpace: 'nowrap' }}>
              60-Day Guarantee
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: TXT }}>Every metric below, delivered within 60 days of go-live. Contractually committed.</div>
              <div style={{ fontSize: 8, color: DIM, marginTop: 1 }}>Auditable against your pre-integration baseline · backed by Docstribe SLA</div>
            </div>
          </div>
        )}

        {/* Committed KPI cards — appear one by one */}
        <div style={{ display: 'flex', gap: 8 }}>
          {guaranteeKPIs.map((k, i) => {
            const show = progress >= kpiTimes[i];
            const active = spot(progress, kpiTimes[i], kpiTimes[i] + 0.14);
            return (
              <div key={i} style={{ ...glow(active, k.col, { flex: 1, borderRadius: 10, padding: '14px 10px', textAlign: 'center' }), opacity: show ? 1 : 0, transform: show ? (active ? 'scale(1.08)' : 'scale(1)') : 'translateY(22px) scale(0.82)', transition: 'all 0.6s cubic-bezier(0.34,1.4,0.64,1)', filter: show && !active ? 'brightness(0.75)' : 'brightness(1)' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: k.col, fontFamily: 'Sora', lineHeight: 1 }}>
                  {show ? <CountUp value={k.val} duration={700} key={`dk${i}`} /> : k.val}
                </div>
                <div style={{ width: 20, height: 2, borderRadius: 1, background: k.col, margin: '6px auto' }} />
                <div style={{ fontSize: 9, fontWeight: 700, color: TXT, lineHeight: 1.3 }}>{k.label}</div>
                <div style={{ fontSize: 7, color: DIM, marginTop: 2, lineHeight: 1.3 }}>{k.sub}</div>
              </div>
            );
          })}
        </div>

        {/* 60-day integration timeline */}
        {timelineShow && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '10px 14px', animation: 'dpBeatIn 0.5s ease both', flexShrink: 0 }}>
            <div style={{ fontSize: 8, color: MUTED, fontWeight: 700, marginBottom: 8, letterSpacing: 0.5 }}>60-DAY INTEGRATION PATHWAY · CONTRACTUAL MILESTONES</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[
                { day: 'Day 0', label: 'Go-Live', col: TEAL },
                { day: 'Day 14', label: 'CDI Active', col: INDIGO },
                { day: 'Day 30', label: 'Denials ↓', col: GREEN },
                { day: 'Day 60', label: '✓ All Outcomes', col: AMBER },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: t.col, fontFamily: 'Sora' }}>{t.day}</div>
                    <div style={{ fontSize: 7, color: DIM, marginTop: 2 }}>{t.label}</div>
                  </div>
                  {i < 3 && <div style={{ width: 16, height: 2, background: `linear-gradient(90deg,${t.col}60,${[TEAL,INDIGO,GREEN,AMBER][i+1]}60)`, flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live payer first-pass rates */}
        {payorShow && (
          <div style={{ animation: 'dpBeatIn 0.5s ease both', flexShrink: 0 }}>
            <div style={{ fontSize: 8, color: MUTED, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>LIVE PAYOR FIRST-PASS CLAIM RATE</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['Daman', '94%', GREEN], ['Thiqa', '91%', TEAL], ['AXA Gulf', '89%', AMBER], ['Oman Ins.', '96%', GREEN]].map(([name, rate, col], i) => (
                <div key={i} style={{ flex: 1, background: `${col}09`, border: `1px solid ${col}22`, borderRadius: 7, padding: '7px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: col, fontFamily: 'Sora' }}>{rate}</div>
                  <div style={{ fontSize: 7, color: DIM, marginTop: 2 }}>{name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brand close */}
        {brandShow && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'dpBeatIn 0.9s cubic-bezier(0.34,1.2,0.64,1) both' }}>
            <div style={{ fontSize: 26, fontWeight: 900, fontFamily: 'Sora', background: `linear-gradient(135deg,${TEAL},${INDIGO})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -0.5 }}>Docstribe</div>
            <div style={{ fontSize: 9, color: DIM, marginTop: 4, textAlign: 'center' }}>One platform · Zero leakage · UAE healthcare</div>
            <div style={{ fontSize: 10, color: TXT, marginTop: 6, textAlign: 'center', lineHeight: 1.5, maxWidth: 320 }}>A skilled AI agentic workforce — delivering measurable financial outcomes, <span style={{ color: TEAL, fontWeight: 700 }}>guaranteed within 60 days</span></div>
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
    <div onClick={onPlay} style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'radial-gradient(ellipse 80% 60% at 50% 45%, #06102a 0%, #000 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(0,203,168,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,203,168,0.3) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      <div style={{ fontSize: 9, fontWeight: 700, color: `${TEAL}90`, letterSpacing: 3, textTransform: 'uppercase' }}>UAE Healthcare · AI-Native RCM Platform</div>
      <div style={{ fontSize: 44, fontWeight: 900, background: `linear-gradient(135deg,#fff 40%,${TEAL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1.5, lineHeight: 1 }}>Docstribe</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: TXT, textAlign: 'center', maxWidth: 480, lineHeight: 1.6 }}>
        A skilled AI agentic workforce that listens to every clinical and financial signal —
        and puts your hospital ahead in the RCM game.
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 420 }}>
        {[['Clinical Signals', INDIGO], ['Financial Intelligence', TEAL], ['60-Day Guarantee', AMBER]].map(([t, c]) => (
          <span key={t} style={{ fontSize: 9, fontWeight: 700, color: c, background: `${c}16`, border: `1px solid ${c}30`, borderRadius: 20, padding: '4px 12px' }}>{t}</span>
        ))}
      </div>
      <div style={{ marginTop: 10, padding: '13px 34px', borderRadius: 30, background: `linear-gradient(135deg,${TEAL},${INDIGO})`, color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 0.5, boxShadow: `0 0 40px ${TEAL}40`, display: 'flex', alignItems: 'center', gap: 8, animation: 'dpPulseScale 2s ease-in-out infinite' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
        Watch the Platform Demo
      </div>
    </div>
  );
}

/* ─── Scene stat strip (bottom pill — shows latest fired beat) ── */
function SceneStatStrip({ scene, progress }) {
  if (scene.type === 'stat' || scene.type === 'kpi') return null;
  const fired = (scene.beats || []).slice().reverse().find(b => progress >= b.at);
  if (!fired) return null;
  return (
    <div key={fired.stat} style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 15, display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(3,7,20,0.90)', backdropFilter: 'blur(14px)', borderRadius: 20, padding: '5px 16px', border: `1px solid ${scene.color}38`, pointerEvents: 'none', animation: 'dpBeatIn 0.45s ease both', maxWidth: '78%' }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: scene.color, boxShadow: `0 0 8px ${scene.color}`, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 900, color: scene.color, fontFamily: 'Sora', whiteSpace: 'nowrap', letterSpacing: -0.3 }}>{fired.stat}</span>
      {fired.sub && <span style={{ fontSize: 8, color: DIM, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>· {fired.sub}</span>}
    </div>
  );
}

/* ─── Sentence caption with teal key-term highlights ─────────── */
function Caption({ sentence }) {
  return (
    <div key={sentence} style={{ position: 'absolute', bottom: 46, left: '6%', right: '6%', zIndex: 12, textAlign: 'center', fontSize: 11, fontFamily: 'Sora', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', lineHeight: 1.5, textShadow: '0 1px 10px rgba(0,0,0,1)', animation: 'dpFadeCaption 0.4s ease both' }}>
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
      const tick = () => {
        const elapsed = audioCtxRef.current.currentTime - t0Ref.current;
        const p = Math.min(elapsed / durRef.current, 1);
        setProgress(p);
        const si = Math.min(Math.floor(p * scSentences.length), scSentences.length - 1);
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
      `}</style>
    </section>
  );
}
