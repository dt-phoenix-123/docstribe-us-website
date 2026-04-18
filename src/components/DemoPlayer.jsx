/**
 * DemoPlayer — "Explain Docstribe"
 * Sales-grade cinematic product demo  •  11 scenes  •  ~2m 30s
 *
 * Design principles:
 *  - Sales video, NOT a technical tutorial — big moments, clean screens
 *  - Elements "spotlight" (hover glow) as the VO speaks about them
 *  - No centre-overlay beat card — content IS the demo
 *  - ICD-10-CM throughout (UAE standard)
 *  - OPD / IPD split in CDI and Ambient
 *  - NABIDH / DHA compliance visible in Ambient Scribe
 *  - AED currency everywhere
 */

import { useState, useRef, useEffect, useCallback } from 'react';

/* ─── CountUp ─────────────────────────────────────────────────── */
function CountUp({ value, duration = 1100 }) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    setDisplay('');
    const v = String(value || '');
    const isNum = /^[+↑↓]?[\d.,]+[%KM]?$/.test(v.trim());
    if (!isNum) {
      let i = 0;
      const iv = setInterval(() => { i++; setDisplay(v.slice(0, i)); if (i >= v.length) clearInterval(iv); }, 50);
      return () => clearInterval(iv);
    }
    const end = parseFloat(v.replace(/[^0-9.]/g, '')) || 0;
    const prefix = v.match(/^[+↑↓]/)?.[0] || '';
    const suffix = v.match(/[%KM]+$/)?.[0] || '';
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

/* ─── b64 WAV → ArrayBuffer ──────────────────────────────────── */
function b64ToArrayBuffer(b64) {
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return bytes.buffer.slice(0);
}

/* ─── Design tokens ──────────────────────────────────────────── */
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

/* ─── Spotlight helper: is this element "in focus" right now? ── */
const spot = (p, from, to = Math.min(from + 0.22, 1)) => p >= from && p <= to;

/* ─── Glowing card style when spotlighted ───────────────────── */
function glow(active, color, extra = {}) {
  return {
    transition: 'all 0.5s cubic-bezier(0.34,1.2,0.64,1)',
    transform: active ? 'scale(1.028)' : 'scale(1)',
    border: active ? `1px solid ${color}65` : `1px solid rgba(255,255,255,0.07)`,
    boxShadow: active ? `0 0 32px ${color}28, 0 4px 20px rgba(0,0,0,0.5)` : '0 2px 8px rgba(0,0,0,0.25)',
    background: active ? `${color}14` : `${color}06`,
    ...extra,
  };
}

/* ─── Split VO into display sentences ────────────────────────── */
function splitSentences(text) {
  return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 3);
}

/* ──────────────────────────── Scene data ────────────────────── */
const SCENES = [
  {
    id: 1, type: 'stat', color: TEAL,
    title: 'The Revenue Gap',
    vo: 'Too much earned revenue never reaches your accounts. In UAE hospitals, first-submission denials are a persistent, largely preventable drain — documentation written for care, read by payers for compliance. That gap is where the money disappears. Docstribe sits precisely there, closing it before it opens.',
    beats: [
      { at: 0.04, stat: '12–18%',           sub: 'UAE claims denied on first submission' },
      { at: 0.52, stat: '70%',               sub: 'of those denials are preventable' },
      { at: 0.82, stat: 'Revenue earned.',   sub: 'The system lost it.' },
    ],
  },
  {
    id: 2, type: 'kpi', color: TEAL,
    title: 'Proven Outcomes',
    vo: 'Within sixty days of going live, hospitals see a measurable drop in first-submission denials. A significant uplift in revenue capture. A Case Mix Index that rises to reflect the full clinical complexity of your patients. And accounts receivable days that fall to where they should have been all along. Auditable, contractually committed outcomes — delivered inside two months.',
    beats: [
      { at: 0.06, stat: '60 days',  sub: 'to measurable, committed outcomes' },
      { at: 0.24, stat: '↓30%',     sub: 'Claim denial reduction' },
      { at: 0.42, stat: '+25%',     sub: 'Revenue capture uplift' },
      { at: 0.60, stat: '+0.15',    sub: 'CMI uplift per discharge' },
      { at: 0.78, stat: '32 days',  sub: 'AR days (down from 45)' },
    ],
  },
  {
    id: 3, type: 'product', color: TEAL,
    title: 'One Unified Workspace',
    breadcrumb: 'Cases Workbench',
    vo: 'Every patient encounter — outpatient consultation, inpatient ward round, emergency presentation — flows into one unified workspace. Clinical context and financial status in the same view. Every gap visible. Every action trackable. From first appointment to final payment.',
    beats: [
      { at: 0.20, stat: '200 active cases', sub: 'OPD · IPD · Emergency — unified' },
      { at: 0.65, stat: 'Zero leakage',     sub: 'every encounter tracked end-to-end' },
    ],
  },
  {
    id: 4, type: 'product', color: GREEN,
    title: 'Pre-Visit Intelligence',
    breadcrumb: 'Eligibility & Pre-Authorisation',
    vo: 'By the time a patient arrives, every coverage decision is already made. Eligibility verified. Pre-authorisation triggered — at order entry, not at discharge — across all UAE insurance partners. What used to be a weeks-long manual process becomes a background event your team never has to chase.',
    beats: [
      { at: 0.18, stat: 'Pre-auth at order entry', sub: 'not at discharge — both OPD and IPD' },
      { at: 0.72, stat: '✅ PA APPROVED',           sub: 'AED 0 front-door write-off risk' },
    ],
  },
  {
    id: 5, type: 'product', color: INDIGO,
    title: 'Ambient Clinical Intelligence',
    breadcrumb: 'Ambient Scribe — OPD & IPD',
    vo: 'The platform listens to every encounter and builds a complete, structured clinical note automatically — ICD-10-CM coded, compliance-stamped, and ready for data exchange. Fully compliant with NABIDH requirements and DHA-licensed. Your physicians focus entirely on care. The documentation is simply done.',
    beats: [
      { at: 0.15, stat: 'OPD note built — live',   sub: 'DM · HTN consult · auto-structured from voice' },
      { at: 0.50, stat: 'IPD H&P captured in full', sub: 'Pneumonia · COPD · ward round — complete' },
      { at: 0.78, stat: 'NABIDH ✓  DHA ✓',          sub: 'structured output · compliant data exchange' },
    ],
  },
  {
    id: 6, type: 'product', color: AMBER,
    title: 'CDI — Closing the Gap',
    breadcrumb: 'Clinical Documentation Intelligence',
    vo: 'For outpatient encounters, medical necessity is confirmed before a claim is built — one tap from the physician. For inpatients, it fires gap-closure queries while the patient is still admitted, securing the right clinical classification before discharge. Every response is e-signed. Every query is an audit trail.',
    beats: [
      { at: 0.12, stat: 'OPD — Medical Necessity',  sub: 'physician confirms with one tap' },
      { at: 0.52, stat: 'IPD — IR-DRG gap closed',  sub: 'admission status · diagnosis sequence locked' },
      { at: 0.82, stat: 'DHA Compliant · Audit Ready', sub: 'e-signed · timestamped · defensible' },
    ],
  },
  {
    id: 7, type: 'product', color: PURPLE,
    title: 'AI-Powered Coding',
    breadcrumb: 'ICD-10-CM · Smart Coding Engine',
    vo: 'Clinical notes are converted into the most defensible, highest-weight ICD-10-CM codes the documentation supports. Symptom-only codes are suppressed. Comorbidities are captured and ranked. The IR-DRG weight — and the revenue attached to it — reflects what your clinical team actually delivered.',
    beats: [
      { at: 0.15, stat: 'Notes → ICD-10-CM',       sub: 'diagnoses ranked, symptoms suppressed' },
      { at: 0.50, stat: 'IR-DRG 1.34 confirmed',    sub: 'up from 0.94 — weight maximised' },
      { at: 0.80, stat: 'Claim-ready in seconds',   sub: 'zero manual coding backlog' },
    ],
  },
  {
    id: 8, type: 'product', color: RED,
    title: 'Denial Intelligence',
    breadcrumb: 'Payor Contract Intelligence',
    vo: 'Before any claim is submitted, denial risk is scored against each insurer\'s specific patterns. Substantial recoverable revenue surfaces that would otherwise have been lost quietly — denied, delayed, and never followed up. That cycle ends here.',
    beats: [
      { at: 0.15, stat: 'AED 214,600',        sub: 'recoverable revenue identified' },
      { at: 0.55, stat: '4 denial drivers',    sub: 'flagged and scored pre-submission' },
      { at: 0.80, stat: 'Denial rate ↓ 30%',  sub: 'systemic reduction, not one-off fixes' },
    ],
  },
  {
    id: 9, type: 'product', color: TEAL,
    title: 'One-Click Recovery',
    breadcrumb: 'Claim Recovery — OPD Bundling Dispute',
    vo: 'When a denial arrives, a contract-grounded appeal is assembled and ready in one click — citing the exact policy terms that support recovery. What used to take your team three weeks takes the platform thirty seconds. Revenue that was lost is found.',
    beats: [
      { at: 0.22, stat: 'AED 1,900 denied', sub: 'OPD · bundling dispute · recoverable' },
      { at: 0.68, stat: '1-click appeal',   sub: 'contract clauses cited · recovery in progress' },
    ],
  },
  {
    id: 10, type: 'product', color: INDIGO,
    title: '30-Day Revenue Pipeline',
    breadcrumb: 'Case Management Control Tower',
    vo: 'Finance gains a rolling thirty-day revenue forecast by service line — driven not by historical averages, but by live clinical signals from the moment of admission. Surgical candidates identified early. Pre-auth holds tracked in real time. Revenue predicted at admission, not estimated at month end.',
    beats: [
      { at: 0.18, stat: 'AED 1.4M forecast', sub: 'next 30 days · IR-DRG weighted' },
      { at: 0.55, stat: 'Surgical candidate', sub: 'flagged at ED — theatre planned from Day 1' },
      { at: 0.80, stat: 'Clinical signals', sub: 'not averages — live, predictive, actionable' },
    ],
  },
  {
    id: 11, type: 'dashboard', color: TEAL,
    title: 'One Platform. Zero Leakage.',
    breadcrumb: 'Executive Revenue Dashboard',
    vo: 'Everything your board needs in one view. Denial trends, IR-DRG movement, payer variance, recovery pipeline. Every dirham accounted for. Docstribe: one platform, built for UAE healthcare, delivering measurable financial outcomes within sixty days of going live. arcus@docstribe.com — let\'s begin.',
    beats: [
      { at: 0.12, stat: 'Every dirham accounted for',  sub: 'denials · IR-DRG · variance · recovery — live' },
      { at: 0.50, stat: 'CMI +0.15 · AR 32 days',     sub: 'measurable uplift · within 60 days of go-live' },
      { at: 0.78, stat: 'One platform. Zero leakage.', sub: 'arcus@docstribe.com' },
    ],
  },
];

/* ──────────────── EQ Canvas ─────────────────────────────────── */
function EQCanvas({ analyser }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!analyser || !ref.current) return;
    let raf;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const data = new Uint8Array(analyser.frequencyBinCount);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);
      const bars = 60;
      const bw = Math.max(1, Math.floor(W / bars) - 1);
      for (let i = 0; i < bars; i++) {
        const v = data[Math.floor(i * data.length / bars)] / 255;
        const h = Math.max(1, v * H);
        ctx.fillStyle = `hsla(${162 + i * 3},70%,58%,${0.3 + v * 0.7})`;
        ctx.fillRect(i * (bw + 1), H - h, bw, h);
      }
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [analyser]);
  return <canvas ref={ref} width={900} height={22} style={{ width: '100%', height: 22, display: 'block' }} />;
}

/* ──────────── ProductShell — SaaS chrome wrapper ───────────── */
function ProductShell({ breadcrumb, color, children }) {
  const nav = ['◉','⊞','◷','⚡','⚙'];
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', background: BLUE, fontFamily: 'Sora,sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 42, flexShrink: 0, background: '#070b15', borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 3 }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, marginBottom: 12, background: `linear-gradient(135deg,${color},${INDIGO})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff' }}>D</div>
        {nav.map((ic, i) => (
          <div key={i} style={{ width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, opacity: i === 0 ? 1 : 0.22, background: i === 0 ? `${color}22` : 'transparent', color: i === 0 ? color : DIM }}>{ic}</div>
        ))}
      </div>
      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
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

/* ── Atom helpers ────────────────────────────────────────────── */
const Pill = ({ text, color, size = 9 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: 4, fontSize: size, fontWeight: 700, background: `${color}22`, color, letterSpacing: 0.3 }}>{text}</span>
);

/* ══════════════════ SCENE VISUALS ══════════════════════════════ */

/* Scene 1 — Revenue gap (stat cold open) */
function StatScene({ scene, progress }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 45%,#040a18 0%,#000 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <div style={{ position: 'absolute', bottom: 14, right: 18, fontSize: 8, fontWeight: 800, color: `${TEAL}45`, letterSpacing: 2, fontFamily: 'Sora' }}>DOCSTRIBE</div>
      {scene.beats.map((b, i) => {
        const show = progress >= b.at;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(22px)', transition: 'all 0.8s cubic-bezier(0.34,1.2,0.64,1)' }}>
            <div style={{ fontSize: i === 0 ? 88 : i === 1 ? 70 : 22, fontWeight: 900, letterSpacing: -2, fontFamily: 'Sora', lineHeight: 1.0, color: i === 2 ? DIM : '#fff', textShadow: i < 2 ? `0 0 60px ${TEAL}50` : 'none' }}>
              {show ? <CountUp value={b.stat} duration={900} key={`${i}-${show}`} /> : b.stat}
            </div>
            <div style={{ fontSize: i === 2 ? 16 : 12, color: i === 2 ? TXT : DIM, fontFamily: 'Sora', textAlign: 'center', maxWidth: 460, letterSpacing: 0.2, fontWeight: i === 2 ? 500 : 400 }}>{b.sub}</div>
            {i < 2 && show && <div style={{ width: 28, height: 1, background: `${TEAL}60`, margin: '2px 0' }} />}
          </div>
        );
      })}
    </div>
  );
}

/* Scene 2 — KPI outcomes */
function KPIScene({ scene, progress }) {
  const colors = [TEAL, GREEN, AMBER, INDIGO, PURPLE];
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 35%,#081228 0%,#000 80%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '0 36px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: DIM, letterSpacing: 2.5, textTransform: 'uppercase', fontFamily: 'Sora' }}>Measurable · Auditable · Guaranteed</div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 900 }}>
        {scene.beats.map((b, i) => {
          const show = progress >= b.at;
          const active = spot(progress, b.at, b.at + 0.20);
          const c = colors[i];
          return (
            <div key={i} style={{ background: `linear-gradient(135deg,${c}12,${c}06)`, border: `1px solid ${c}${active ? '50' : '22'}`, borderRadius: 14, padding: '18px 22px', minWidth: 130, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: show ? 1 : 0, transform: show ? `scale(${active ? 1.05 : 1})` : 'translateY(28px) scale(0.85)', transition: 'all 0.55s cubic-bezier(0.34,1.4,0.64,1)', boxShadow: active ? `0 0 36px ${c}24` : show ? `0 0 20px ${c}0e` : 'none' }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: c, fontFamily: 'Sora', lineHeight: 1, letterSpacing: -0.5 }}>
                {show ? <CountUp value={b.stat} duration={700} key={`k${i}-${show}`} /> : b.stat}
              </div>
              <div style={{ width: 28, height: 2, borderRadius: 1, background: c }} />
              <div style={{ fontSize: 9, color: DIM, textAlign: 'center', fontFamily: 'Sora', lineHeight: 1.4 }}>{b.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Scene 3 — Cases Workbench (board-level: no patient names, category view) */
function CasesScreen({ progress }) {
  const categories = [
    { tag: 'OPD', dept: 'Endocrinology',   cases: 24, risk: 3,  status: '2 need auth',   col: INDIGO, show: 0.08 },
    { tag: 'IPD', dept: 'Respiratory',      cases: 12, risk: 4,  status: '4 high priority', col: RED,  show: 0.22 },
    { tag: 'ER',  dept: 'Emergency',        cases: 16, risk: 6,  status: '6 pending auth', col: AMBER, show: 0.40 },
    { tag: 'OPD', dept: 'Cardiology',       cases: 31, risk: 1,  status: '1 in review',   col: GREEN,  show: 0.55 },
    { tag: 'IPD', dept: 'Neurology',        cases: 9,  risk: 2,  status: '2 escalated',   col: PURPLE, show: 0.68 },
    { tag: 'OPD', dept: 'Orthopaedics',     cases: 18, risk: 0,  status: 'All on track',  col: TEAL,   show: 0.78 },
  ];
  const riskColor = { HIGH: RED, MED: AMBER, LOW: GREEN };
  return (
    <ProductShell breadcrumb="Cases Workbench" color={TEAL}>
      <div style={{ padding: '10px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Summary strip */}
        <div style={{ display: 'flex', gap: 8, animation: 'dpRowIn 0.4s ease both' }}>
          {[['200', 'Active Cases', TEAL], ['139', 'OPD', INDIGO], ['45', 'IPD', TEAL], ['16', 'Emergency', RED]].map(([v, l, c], i) => (
            <div key={i} style={{ flex: 1, background: `${c}0e`, border: `1px solid ${c}22`, borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: i === 0 ? 22 : 17, fontWeight: 900, color: c, fontFamily: 'Sora' }}>
                {progress > 0.05 ? <CountUp value={v} duration={500} key={v} /> : v}
              </div>
              <div style={{ fontSize: 8, color: DIM, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Department category cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, flex: 1 }}>
          {categories.map((r, i) => {
            const visible = progress >= r.show;
            const active  = spot(progress, r.show, r.show + 0.18);
            return (
              <div key={i} style={{ ...glow(active, r.col, { borderRadius: 9, padding: '9px 11px' }), opacity: visible ? 1 : 0, transform: visible ? (active ? 'scale(1.03)' : 'scale(1)') : 'translateY(14px) scale(0.92)', transition: 'all 0.5s cubic-bezier(0.34,1.2,0.64,1)' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 5 }}>
                  <Pill text={r.tag} color={r.col} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: TXT }}>{r.dept}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 900, color: r.col }}>{r.cases}</span>
                </div>
                <div style={{ fontSize: 9, color: r.risk > 2 ? RED : r.risk > 0 ? AMBER : GREEN, fontWeight: 600 }}>{r.status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </ProductShell>
  );
}

/* Scene 4 — Eligibility (process flow, no patient names) */
function EligibilityScreen({ progress }) {
  const paApproved = progress >= 0.72;
  const opdActive  = spot(progress, 0.05, 0.42);
  const ipdActive  = spot(progress, 0.42, 0.95);
  return (
    <ProductShell breadcrumb="Eligibility & Pre-Authorisation" color={GREEN}>
      <div style={{ padding: '12px 14px', height: '100%', display: 'flex', gap: 12 }}>
        {/* OPD flow */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ ...glow(opdActive, INDIGO, { borderRadius: 10, padding: '10px 13px' }), animation: 'dpRowIn 0.4s ease 0.05s both' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
              <Pill text="OPD" color={INDIGO} size={10} />
              <span style={{ fontSize: 12, fontWeight: 700, color: TXT }}>Outpatient Visits</span>
            </div>
            {[
              { label: 'Insurance query sent',      show: 0.05, done: true },
              { label: 'Terms of Benefits verified', show: 0.15, done: true },
              { label: 'Coverage limit confirmed',  show: 0.25, done: true },
            ].map((step, i) => (
              progress >= step.show && (
                <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${BORDER}`, animation: 'dpBeatIn 0.4s ease both' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${GREEN}`, background: `${GREEN}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 8, color: GREEN }}>✓</span>
                  </div>
                  <span style={{ fontSize: 9, color: TXT, fontWeight: 600 }}>{step.label}</span>
                </div>
              )
            ))}
          </div>
          {progress >= 0.32 && (
            <div style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}30`, borderRadius: 8, padding: '12px 14px', textAlign: 'center', animation: 'dpBeatIn 0.4s ease both' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: GREEN, fontFamily: 'Sora' }}>✓ Visit Cleared</div>
              <div style={{ fontSize: 9, color: DIM, marginTop: 4 }}>No auth required · claim pre-validated · zero risk</div>
            </div>
          )}
        </div>
        {/* Divider */}
        <div style={{ width: 1, background: BORDER, flexShrink: 0 }} />
        {/* IPD flow */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ ...glow(ipdActive, TEAL, { borderRadius: 10, padding: '10px 13px' }), animation: 'dpRowIn 0.4s ease 0.12s both' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
              <Pill text="IPD" color={TEAL} size={10} />
              <span style={{ fontSize: 12, fontWeight: 700, color: TXT }}>Inpatient Admissions</span>
            </div>
            {[
              { label: 'Admission trigger detected',   show: 0.42, done: true },
              { label: 'Clinical docs auto-attached',  show: 0.54, done: true },
              { label: 'PA submitted to insurer',      show: 0.62, done: true },
              { label: 'Pre-authorisation approved',   show: 0.72, done: paApproved },
            ].map((step, i) => (
              progress >= step.show && (
                <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${BORDER}`, animation: 'dpBeatIn 0.4s ease both' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${step.done ? GREEN : AMBER}`, background: step.done ? `${GREEN}20` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {step.done && <span style={{ fontSize: 8, color: GREEN }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 9, color: step.done ? TXT : AMBER, fontWeight: step.done ? 600 : 400 }}>{step.label}</span>
                </div>
              )
            ))}
          </div>
          {paApproved && (
            <div style={{ background: `${GREEN}12`, border: `1px solid ${GREEN}35`, borderRadius: 9, padding: '14px', textAlign: 'center', animation: 'dpBeatIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>✅</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: GREEN, fontFamily: 'Sora' }}>PA APPROVED</div>
              <div style={{ fontSize: 8, color: DIM, marginTop: 4 }}>At order entry · not at discharge · zero write-off</div>
            </div>
          )}
        </div>
      </div>
    </ProductShell>
  );
}

/* Scene 5 — Ambient Scribe (OPD + IPD + NABIDH/DHA) */
function AmbientScreen({ progress }) {
  const nabidh = progress >= 0.78;
  const opdFields = [
    { label: 'Chief Complaint',          val: 'Routine DM + HTN review, HbA1c follow-up', show: 0.10 },
    { label: 'Diagnoses extracted',       val: 'Type 2 Diabetes · Hypertension', show: 0.22 },
    { label: 'Medications reconciled',    val: 'Metformin 1g · Amlodipine 5mg · aligned', show: 0.32 },
    { label: 'Note complete — CDI ready', val: 'ICD-10-CM auto-coded · billable · structured', show: 0.45 },
  ];
  const ipdFields = [
    { label: 'H&P captured',             val: 'Fever × 5d · SpO₂ 91% · bilateral crackles', show: 0.50 },
    { label: 'Primary diagnosis',         val: 'Pneumonia — ICD-10-CM J18.9', show: 0.60 },
    { label: 'Comorbidities identified',  val: 'COPD · Type 2 Diabetes — documented', show: 0.68 },
    { label: 'IR-DRG input ready',        val: 'All diagnoses coded · weight validated', show: 0.76 },
  ];
  return (
    <ProductShell breadcrumb="Ambient Scribe — OPD & IPD" color={INDIGO}>
      <div style={{ padding: '10px 12px', height: '100%', display: 'flex', gap: 10, flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 10, flex: 1 }}>
          {/* OPD column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
              <Pill text="OPD" color={INDIGO} />
              <span style={{ fontSize: 10, fontWeight: 700, color: TXT }}>Outpatient</span>
              <span style={{ fontSize: 8, color: MUTED }}>DM · HTN consult</span>
              {progress >= 0.10 && progress < 0.45 && (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 4, animation: 'dpBeatIn 0.3s ease both' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: RED, animation: 'dpPulse 1.2s ease infinite' }} />
                  <span style={{ fontSize: 7, color: RED, fontWeight: 700 }}>LIVE</span>
                </div>
              )}
            </div>
            {opdFields.map((f, i) => {
              const visible = progress >= f.show;
              const active  = spot(progress, f.show, f.show + 0.13);
              return (
                <div key={i} style={{ ...glow(active, INDIGO, { borderRadius: 7, padding: '8px 10px' }), opacity: visible ? 1 : 0, transition: 'all 0.5s ease', animation: `dpRowIn 0.4s ease ${i * 0.08}s both` }}>
                  <div style={{ fontSize: 8, color: visible ? INDIGO : MUTED, fontWeight: 700, marginBottom: 2 }}>{visible ? '✓ ' : ''}{f.label}</div>
                  <div style={{ fontSize: 10, color: visible ? TXT : 'transparent' }}>{f.val}</div>
                </div>
              );
            })}
          </div>
          {/* Divider */}
          <div style={{ width: 1, background: BORDER, flexShrink: 0 }} />
          {/* IPD column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
              <Pill text="IPD" color={TEAL} />
              <span style={{ fontSize: 10, fontWeight: 700, color: TXT }}>Inpatient</span>
              <span style={{ fontSize: 8, color: MUTED }}>Pneumonia · ward round</span>
              {progress >= 0.50 && progress < 0.76 && (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 4, animation: 'dpBeatIn 0.3s ease both' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: RED, animation: 'dpPulse 1.2s ease infinite' }} />
                  <span style={{ fontSize: 7, color: RED, fontWeight: 700 }}>LIVE</span>
                </div>
              )}
            </div>
            {ipdFields.map((f, i) => {
              const visible = progress >= f.show;
              const active  = spot(progress, f.show, f.show + 0.13);
              return (
                <div key={i} style={{ ...glow(active, TEAL, { borderRadius: 7, padding: '8px 10px' }), opacity: visible ? 1 : 0, transition: 'all 0.5s ease', animation: `dpRowIn 0.4s ease ${0.4 + i * 0.08}s both` }}>
                  <div style={{ fontSize: 8, color: visible ? TEAL : MUTED, fontWeight: 700, marginBottom: 2 }}>{visible ? '✓ ' : ''}{f.label}</div>
                  <div style={{ fontSize: 10, color: visible ? TXT : 'transparent' }}>{f.val}</div>
                </div>
              );
            })}
          </div>
        </div>
        {/* NABIDH / DHA compliance banner */}
        {nabidh && (
          <div style={{ background: `linear-gradient(90deg,${INDIGO}12,${TEAL}12)`, border: `1px solid ${TEAL}35`, borderRadius: 9, padding: '10px 14px', display: 'flex', gap: 18, alignItems: 'center', animation: 'dpBeatIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both', flexShrink: 0 }}>
            {[['NABIDH ✓', INDIGO, 'National Unified Medical Record'], ['DHA Licensed ✓', TEAL, 'Dubai Health Authority'], ['HL7 FHIR ✓', GREEN, 'Data exchange ready']].map(([label, c, sub]) => (
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

/* Scene 6 — CDI: OPD Medical Necessity + IPD IR-DRG split */
function CDIScreen({ progress }) {
  const auditReady = progress >= 0.82;

  // OPD queries: medical necessity, one-tap checkboxes
  const opdQueries = [
    { q: 'Is this DM follow-up medically necessary per DHA guidelines?', opts: ['Yes — medically necessary', 'Routine monitoring only'], answer: 0, show: 0.08 },
    { q: 'Document HbA1c result — is DM controlled or uncontrolled?',    opts: ['Uncontrolled (HbA1c 9.1%)', 'Controlled (HbA1c < 7%)'],   answer: 0, show: 0.25 },
    { q: 'Is additional diagnostic workup clinically indicated?',          opts: ['Clinically indicated', 'Routine screening'],             answer: 0, show: 0.38 },
  ];

  // IPD queries: IR-DRG gap closure
  const ipdQueries = [
    { q: 'Confirm admission status — Inpatient vs. Observation?', opts: ['Confirm inpatient admission', 'Maintain observation status'], answer: 0, show: 0.50 },
    { q: 'Does the clinical picture meet Sepsis-3 criteria?',     opts: ['Sepsis confirmed — Sepsis-3',   'Infection without sepsis'],      answer: 0, show: 0.64 },
    { q: 'Principal diagnosis — Pneumonia or COPD exacerbation?', opts: ['J18.9 — Pneumonia (primary)',   'J44.9 — COPD (primary)'],        answer: 0, show: 0.74 },
  ];

  return (
    <ProductShell breadcrumb="Clinical Documentation Intelligence" color={AMBER}>
      <div style={{ padding: '10px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Header row */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', animation: 'dpRowIn 0.4s ease both' }}>
          <Pill text="OPD" color={INDIGO} />
          <span style={{ fontSize: 9, color: DIM }}>Medical Necessity Queries</span>
          <div style={{ flex: 1 }} />
          <Pill text="IPD" color={TEAL} />
          <span style={{ fontSize: 9, color: DIM }}>IR-DRG Gap Closure</span>
          {auditReady && <span style={{ marginLeft: 10, fontSize: 8, fontWeight: 700, color: GREEN, background: `${GREEN}18`, border: `1px solid ${GREEN}30`, borderRadius: 4, padding: '2px 7px', animation: 'dpBeatIn 0.4s ease both' }}>✓ DHA Compliant · Audit Ready</span>}
        </div>

        <div style={{ display: 'flex', gap: 10, flex: 1 }}>
          {/* OPD CDI */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: INDIGO, letterSpacing: 0.5, marginBottom: 2 }}>OPD — Medical Necessity</div>
            {opdQueries.map((q, i) => {
              const visible = progress >= q.show;
              const active  = spot(progress, q.show, q.show + 0.14);
              const ticked  = progress >= q.show + 0.10;
              return (
                <div key={i} style={{ ...glow(active, INDIGO, { borderRadius: 8, padding: '9px 11px' }), opacity: visible ? 1 : 0, transform: visible ? (active ? 'scale(1.025)' : 'scale(1)') : 'translateY(10px)', transition: 'all 0.5s ease' }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: TXT, lineHeight: 1.4, marginBottom: 6 }}>{q.q}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {q.opts.map((o, j) => (
                      <div key={j} style={{ flex: 1, display: 'flex', gap: 5, alignItems: 'center', padding: '5px 8px', borderRadius: 5, background: j === q.answer && ticked ? `${INDIGO}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${j === q.answer && ticked ? INDIGO : BORDER}40`, transition: 'all 0.4s ease' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', border: `1.5px solid ${j === q.answer && ticked ? INDIGO : MUTED}`, background: j === q.answer && ticked ? INDIGO : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s ease' }}>
                          {j === q.answer && ticked && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <span style={{ fontSize: 8, color: j === q.answer && ticked ? TXT : DIM, lineHeight: 1.3 }}>{o}</span>
                      </div>
                    ))}
                  </div>
                  {ticked && <div style={{ fontSize: 7, color: GREEN, marginTop: 5, fontWeight: 700, animation: 'dpBeatIn 0.3s ease both' }}>✓ E-signed · compliant</div>}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: BORDER, flexShrink: 0 }} />

          {/* IPD CDI */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: TEAL, letterSpacing: 0.5, marginBottom: 2 }}>IPD — IR-DRG Gap Closure</div>
            {ipdQueries.map((q, i) => {
              const visible = progress >= q.show;
              const active  = spot(progress, q.show, q.show + 0.14);
              const ticked  = progress >= q.show + 0.10;
              const c = i === 0 ? RED : i === 1 ? AMBER : INDIGO;
              return (
                <div key={i} style={{ ...glow(active, c, { borderRadius: 8, padding: '9px 11px' }), opacity: visible ? 1 : 0, transform: visible ? (active ? 'scale(1.025)' : 'scale(1)') : 'translateY(10px)', transition: 'all 0.5s ease' }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: TXT, lineHeight: 1.4, marginBottom: 6 }}>{q.q}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {q.opts.map((o, j) => (
                      <div key={j} style={{ flex: 1, display: 'flex', gap: 5, alignItems: 'center', padding: '5px 8px', borderRadius: 5, background: j === q.answer && ticked ? `${c}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${j === q.answer && ticked ? c : BORDER}40`, transition: 'all 0.4s ease' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', border: `1.5px solid ${j === q.answer && ticked ? c : MUTED}`, background: j === q.answer && ticked ? c : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s ease' }}>
                          {j === q.answer && ticked && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <span style={{ fontSize: 8, color: j === q.answer && ticked ? TXT : DIM, lineHeight: 1.3 }}>{o}</span>
                      </div>
                    ))}
                  </div>
                  {ticked && <div style={{ fontSize: 7, color: GREEN, marginTop: 5, fontWeight: 700, animation: 'dpBeatIn 0.3s ease both' }}>✓ E-signed · IR-DRG impact secured</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProductShell>
  );
}

/* Scene 7 — AI Coding (simplified flow, not a code dump) */
function CodingScreen({ progress }) {
  const steps = [
    { icon: '📄', label: 'Clinical notes in',       sub: 'physician dictation + nursing notes', show: 0.08 },
    { icon: '🧠', label: 'AI reads + ranks',         sub: 'diagnoses ordered · symptoms suppressed', show: 0.30 },
    { icon: '✅', label: 'ICD-10-CM codes out',      sub: 'optimal, defensible, claim-ready', show: 0.52 },
  ];
  const drgPre  = spot(progress, 0.55, 0.78);
  const drgPost = progress >= 0.75;
  return (
    <ProductShell breadcrumb="ICD-10-CM · Smart Coding Engine" color={PURPLE}>
      <div style={{ padding: '12px 16px', height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* 3-step flow */}
        <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
          {steps.map((s, i) => {
            const visible = progress >= s.show;
            const active  = spot(progress, s.show, s.show + 0.22);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ ...glow(active, PURPLE, { borderRadius: 10, padding: '12px 10px', flex: 1, textAlign: 'center' }), opacity: visible ? 1 : 0, transform: visible ? (active ? 'scale(1.06)' : 'scale(1)') : 'scale(0.82)', transition: 'all 0.55s cubic-bezier(0.34,1.2,0.64,1)' }}>
                  <div style={{ fontSize: 22, marginBottom: 5 }}>{s.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: active ? PURPLE : TXT, marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontSize: 8, color: DIM, lineHeight: 1.4 }}>{s.sub}</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 14, color: progress >= steps[i + 1].show ? PURPLE : MUTED, transition: 'color 0.4s' }}>→</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Before / After DRG weight example */}
        {progress >= 0.55 && (
          <div style={{ animation: 'dpBeatIn 0.5s ease both' }}>
            <div style={{ fontSize: 9, color: MUTED, letterSpacing: 0.5, marginBottom: 8, fontWeight: 700 }}>MARK BROWN — IR-DRG WEIGHT IMPACT</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {/* Before */}
              <div style={{ flex: 1, background: `${RED}0a`, border: `1px solid ${RED}22`, borderRadius: 9, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: MUTED, marginBottom: 4 }}>BEFORE</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: RED, fontFamily: 'Sora' }}>0.94</div>
                <div style={{ fontSize: 8, color: DIM, marginTop: 3 }}>Pneumonia only · CC missed</div>
              </div>
              {/* Arrow */}
              <div style={{ fontSize: 22, color: PURPLE, flexShrink: 0 }}>→</div>
              {/* After */}
              <div style={{ ...glow(drgPre, PURPLE, { flex: 1, borderRadius: 9, padding: '12px 14px', textAlign: 'center' }), opacity: drgPost ? 1 : 0, transition: 'all 0.6s cubic-bezier(0.34,1.4,0.64,1)' }}>
                <div style={{ fontSize: 8, color: MUTED, marginBottom: 4 }}>AFTER</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: PURPLE, fontFamily: 'Sora' }}>
                  {drgPost ? <CountUp value="1.34" duration={700} key="drg" /> : '1.34'}
                </div>
                <div style={{ fontSize: 8, color: DIM, marginTop: 3 }}>Pneumonia + COPD + DM · all documented</div>
              </div>
            </div>
            {drgPost && (
              <div style={{ marginTop: 8, textAlign: 'center', animation: 'dpBeatIn 0.4s ease both' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: GREEN }}>↑ AED 18,400 additional revenue · per case</span>
              </div>
            )}
          </div>
        )}

        {/* Claim status */}
        {progress >= 0.85 && (
          <div style={{ background: `${GREEN}0c`, border: `1px solid ${GREEN}30`, borderRadius: 8, padding: '9px 12px', display: 'flex', gap: 10, alignItems: 'center', animation: 'dpBeatIn 0.4s ease both' }}>
            <span style={{ fontSize: 16 }}>✅</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: GREEN }}>Claim-ready in seconds</div>
              <div style={{ fontSize: 8, color: DIM }}>ICD-10-CM coded · zero manual backlog · pre-validated</div>
            </div>
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 8 — Denial Intelligence (simplified, revenue-focused) */
function DenialScreen({ progress }) {
  const drivers = [
    { label: 'Authorisation gap',     amt: 'AED 78,600',  pct: '37%', col: RED,    show: 0.15 },
    { label: 'Bundling mismatch',     amt: 'AED 56,200',  pct: '26%', col: AMBER,  show: 0.30 },
    { label: 'Medical necessity gap', amt: 'AED 48,300',  pct: '22%', col: AMBER,  show: 0.45 },
    { label: 'Modifier deficiency',   amt: 'AED 31,500',  pct: '15%', col: GREEN,  show: 0.60 },
  ];
  const bigNum = progress >= 0.12;
  return (
    <ProductShell breadcrumb="Payor Contract Intelligence" color={RED}>
      <div style={{ padding: '12px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Big recoverable number */}
        <div style={{ ...glow(bigNum && spot(progress, 0.10, 0.38), RED, { borderRadius: 12, padding: '16px', textAlign: 'center' }), opacity: bigNum ? 1 : 0, transition: 'all 0.6s ease', animation: 'dpRowIn 0.4s ease both' }}>
          <div style={{ fontSize: 9, color: MUTED, letterSpacing: 1, marginBottom: 4, fontWeight: 700 }}>TOTAL RECOVERABLE REVENUE</div>
          <div style={{ fontSize: 38, fontWeight: 900, color: RED, fontFamily: 'Sora', lineHeight: 1 }}>
            {bigNum ? <CountUp value="214600" duration={700} key="rec" /> : 'AED 214,600'}
          </div>
          <div style={{ fontSize: 11, color: DIM, marginTop: 4 }}>AED · identified across 4 UAE payors · current cycle</div>
        </div>
        {/* Denial drivers */}
        <div style={{ fontSize: 9, color: MUTED, letterSpacing: 0.5, fontWeight: 700 }}>TOP DENIAL DRIVERS — FLAGGED PRE-SUBMISSION</div>
        {drivers.map((d, i) => {
          const visible = progress >= d.show;
          const active  = spot(progress, d.show, d.show + 0.16);
          return (
            <div key={i} style={{ ...glow(active, d.col, { borderRadius: 8, padding: '10px 13px', borderLeft: `3px solid ${d.col}` }), opacity: visible ? 1 : 0, transform: visible ? (active ? 'scale(1.025)' : 'scale(1)') : 'translateY(12px)', transition: 'all 0.5s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: TXT, flex: 1 }}>{d.label}</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: d.col, fontFamily: 'Sora' }}>{d.amt}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: d.col, background: `${d.col}18`, padding: '2px 8px', borderRadius: 5 }}>{d.pct}</span>
              </div>
            </div>
          );
        })}
        {/* Trend line */}
        {progress >= 0.78 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, animation: 'dpBeatIn 0.4s ease both' }}>
            <span style={{ fontSize: 9, color: MUTED }}>Denial rate:</span>
            <div style={{ flex: 1, height: 22 }}>
              <svg width="100%" height="22" viewBox="0 0 240 22" preserveAspectRatio="none">
                <polyline points="0,19 40,17 80,14 120,10 160,7 200,4 240,3" fill="none" stroke={GREEN} strokeWidth="2" />
                <circle cx="240" cy="3" r="3" fill={GREEN} />
              </svg>
            </div>
            <span style={{ fontSize: 12, color: GREEN, fontWeight: 800 }}>↓ 30%</span>
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 9 — One-click Recovery */
function ClaimScreen({ progress }) {
  const letterGen = progress >= 0.65;
  const recovered = progress >= 0.85;
  return (
    <ProductShell breadcrumb="Claim Recovery — OPD Bundling Dispute" color={TEAL}>
      <div style={{ padding: '12px 16px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Claim status header */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', animation: 'dpRowIn 0.4s ease both' }}>
          <Pill text="OPD" color={INDIGO} />
          <span style={{ fontSize: 13, fontWeight: 700, color: TXT }}>Outpatient Claim</span>
          <span style={{ fontSize: 8, color: MUTED }}>bundling dispute</span>
          <span style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 900, color: TEAL, fontFamily: 'Sora' }}>AED 1,900</span>
        </div>

        {/* Before / After */}
        <div style={{ display: 'flex', gap: 10, flex: 1 }}>
          {/* Denied card */}
          <div style={{ flex: 1, background: `${RED}0a`, border: `1px solid ${RED}25`, borderRadius: 10, padding: '14px', display: 'flex', flexDirection: 'column', gap: 8, animation: 'dpRowIn 0.4s ease 0.1s both' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: 1 }}>DENIED</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: RED, fontFamily: 'Sora' }}>CARC 97</div>
            <div style={{ fontSize: 9, color: DIM, lineHeight: 1.5 }}>Procedure bundled by payer — claim rejected without modifier</div>
            <div style={{ fontSize: 8, color: MUTED, marginTop: 'auto' }}>Processing time without platform: 3–6 weeks</div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 20, color: letterGen ? TEAL : MUTED, transition: 'color 0.5s ease' }}>→</div>
          </div>

          {/* Recovered card */}
          <div style={{ ...glow(letterGen, TEAL, { flex: 1, borderRadius: 10, padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }), opacity: letterGen ? 1 : 0, transition: 'all 0.6s cubic-bezier(0.34,1.4,0.64,1)', animation: 'dpRowIn 0.4s ease 0.2s both' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: 1 }}>RECOVERED</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: TEAL, fontFamily: 'Sora' }}>1 Click</div>
            <div style={{ fontSize: 9, color: DIM, lineHeight: 1.5 }}>Contract-grounded appeal generated — policy clauses cited automatically</div>
            {recovered && (
              <div style={{ fontSize: 11, fontWeight: 800, color: GREEN, marginTop: 'auto', animation: 'dpBeatIn 0.4s ease both' }}>
                ✅ AED 1,900 recovery in progress
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 9, color: DIM, animation: 'dpRowIn 0.4s ease 0.4s both' }}>
          From denial to appeal: <span style={{ color: TEAL, fontWeight: 700 }}>seconds, not weeks</span>
        </div>
      </div>
    </ProductShell>
  );
}

/* Scene 10 — 30-Day Pipeline */
function TowerScreen({ progress }) {
  const lines = [
    { name: 'Respiratory',   val: 'AED 380K', bar: 72, col: TEAL,   show: 0.15 },
    { name: 'Cardiology',    val: 'AED 290K', bar: 55, col: INDIGO,  show: 0.28 },
    { name: 'Orthopaedics',  val: 'AED 240K', bar: 46, col: PURPLE,  show: 0.42 },
    { name: 'Neurology',     val: 'AED 190K', bar: 36, col: AMBER,   show: 0.56 },
    { name: 'Endocrinology', val: 'AED 140K', bar: 27, col: GREEN,   show: 0.68 },
    { name: 'Emergency',     val: 'AED 160K', bar: 30, col: RED,     show: 0.78 },
  ];
  return (
    <ProductShell breadcrumb="Case Management Control Tower" color={INDIGO}>
      <div style={{ padding: '12px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Big forecast */}
        <div style={{ ...glow(spot(progress, 0.10, 0.32), INDIGO, { borderRadius: 10, padding: '14px', textAlign: 'center' }), animation: 'dpRowIn 0.4s ease both' }}>
          <div style={{ fontSize: 9, color: MUTED, letterSpacing: 1, marginBottom: 4 }}>30-DAY REVENUE FORECAST</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: INDIGO, fontFamily: 'Sora', lineHeight: 1 }}>
            {progress > 0.10 ? <CountUp value="1400000" duration={700} key="pipe" /> : 'AED 1.4M'}
          </div>
          <div style={{ fontSize: 9, color: DIM, marginTop: 3 }}>IR-DRG weighted · live clinical signals · 6 service lines</div>
        </div>
        {/* Service lines */}
        <div style={{ fontSize: 9, color: MUTED, fontWeight: 700, letterSpacing: 0.5 }}>BY SERVICE LINE</div>
        {lines.map((l, i) => {
          const visible = progress >= l.show;
          const active  = spot(progress, l.show, l.show + 0.14);
          return (
            <div key={i} style={{ opacity: visible ? 1 : 0, transition: 'all 0.45s ease', animation: `dpRowIn 0.4s ease ${0.08 + i * 0.07}s both` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 90, fontSize: 9, color: active ? TXT : DIM, fontWeight: active ? 700 : 400, transition: 'color 0.3s' }}>{l.name}</span>
                <div style={{ flex: 1, height: active ? 8 : 5, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden', transition: 'height 0.3s ease' }}>
                  <div style={{ height: '100%', width: `${l.bar}%`, background: l.col, borderRadius: 4, boxShadow: active ? `0 0 10px ${l.col}60` : 'none', transition: 'box-shadow 0.3s ease' }} />
                </div>
                <span style={{ width: 54, fontSize: 9, fontWeight: 700, color: l.col, textAlign: 'right' }}>{l.val}</span>
              </div>
            </div>
          );
        })}
        {progress >= 0.88 && (
          <div style={{ textAlign: 'center', fontSize: 9, color: DIM, animation: 'dpBeatIn 0.4s ease both' }}>
            Clinical signals, not averages — <span style={{ color: INDIGO, fontWeight: 700 }}>revenue predicted at admission</span>
          </div>
        )}
      </div>
    </ProductShell>
  );
}

/* Scene 11 — Executive Dashboard */
function DashboardScreen({ progress }) {
  const logoShow = progress >= 0.76;
  const metrics = [
    { label: 'Expected', val: 'AED 1.4M', col: TXT,   show: 0.08 },
    { label: 'Paid',     val: 'AED 1.1M', col: GREEN,  show: 0.14 },
    { label: 'Variance', val: 'AED 296K', col: AMBER,  show: 0.20 },
    { label: 'Recoverable', val: 'AED 214K', col: RED, show: 0.28 },
  ];
  const kpis = [
    { m: '+0.15', l: 'CMI',          c: TEAL,   show: 0.42 },
    { m: '↑20%',  l: 'IR-DRG',      c: INDIGO,  show: 0.50 },
    { m: '94%',   l: 'First-pass',  c: GREEN,   show: 0.58 },
    { m: '32d',   l: 'AR Days',     c: PURPLE,  show: 0.65 },
  ];
  return (
    <ProductShell breadcrumb="Executive Revenue Dashboard" color={TEAL}>
      <div style={{ padding: '10px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Revenue cards */}
        <div style={{ display: 'flex', gap: 8 }}>
          {metrics.map((m, i) => {
            const visible = progress >= m.show;
            const active  = spot(progress, m.show, m.show + 0.14);
            return (
              <div key={i} style={{ ...glow(active, m.col, { flex: 1, borderRadius: 9, padding: '10px 12px' }), opacity: visible ? 1 : 0, transform: visible ? (active ? 'scale(1.04)' : 'scale(1)') : 'translateY(14px)', transition: 'all 0.5s ease' }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: m.col, fontFamily: 'Sora' }}>
                  {visible ? <CountUp value={m.val.replace(/[^0-9.MK]/g, '')} duration={600} key={m.val} /> : m.val}
                </div>
                <div style={{ fontSize: 8, color: DIM, marginTop: 3 }}>{m.label}</div>
              </div>
            );
          })}
        </div>

        {/* KPI mini-metrics */}
        <div style={{ display: 'flex', gap: 8 }}>
          {kpis.map((k, i) => {
            const visible = progress >= k.show;
            const active  = spot(progress, k.show, k.show + 0.12);
            return (
              <div key={i} style={{ ...glow(active, k.c, { flex: 1, borderRadius: 8, padding: '10px 8px', textAlign: 'center' }), opacity: visible ? 1 : 0, transform: visible ? (active ? 'scale(1.06)' : 'scale(1)') : 'scale(0.82)', transition: 'all 0.5s cubic-bezier(0.34,1.4,0.64,1)' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: k.c, fontFamily: 'Sora' }}>{k.m}</div>
                <div style={{ fontSize: 8, color: DIM, marginTop: 2 }}>{k.l}</div>
              </div>
            );
          })}
        </div>

        {/* Payor bars */}
        <div style={{ animation: 'dpRowIn 0.4s ease 0.35s both' }}>
          <div style={{ fontSize: 8, color: MUTED, marginBottom: 6, letterSpacing: 0.5, fontWeight: 700 }}>4 PAYORS — LIVE INTELLIGENCE</div>
          {[['UAE Insurer A', 'AED 78.6K', 37, RED], ['UAE Insurer B', 'AED 56.2K', 26, AMBER], ['UAE Insurer C', 'AED 48.3K', 22, AMBER], ['UAE Insurer D', 'AED 31.5K', 15, GREEN]].map(([n, v, b, c], i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ width: 92, fontSize: 8, color: DIM }}>{n}</span>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${b}%`, background: c, borderRadius: 2, transition: 'width 0.8s ease' }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: c, width: 56, textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Closing brand */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: logoShow ? 1 : 0, transform: logoShow ? 'scale(1)' : 'scale(0.82)', transition: 'all 0.9s cubic-bezier(0.34,1.2,0.64,1)' }}>
          <div style={{ fontSize: 22, fontWeight: 900, fontFamily: 'Sora', background: `linear-gradient(135deg,${TEAL},${INDIGO})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -0.5 }}>Docstribe</div>
          <div style={{ fontSize: 10, color: DIM, marginTop: 4 }}>One platform · Zero leakage · UAE healthcare</div>
          <div style={{ fontSize: 10, color: TEAL, marginTop: 5, fontWeight: 700 }}>arcus@docstribe.com</div>
        </div>
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
        case 3:  return <CasesScreen     progress={progress} />;
        case 4:  return <EligibilityScreen progress={progress} />;
        case 5:  return <AmbientScreen   progress={progress} />;
        case 6:  return <CDIScreen       progress={progress} />;
        case 7:  return <CodingScreen    progress={progress} />;
        case 8:  return <DenialScreen    progress={progress} />;
        case 9:  return <ClaimScreen     progress={progress} />;
        case 10: return <TowerScreen     progress={progress} />;
        default: return null;
      }
    default: return null;
  }
}

/* ─── Intro Splash ───────────────────────────────────────────── */
function Splash({ onPlay }) {
  return (
    <div onClick={onPlay} style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: 'radial-gradient(ellipse 80% 60% at 50% 45%, #06102a 0%, #000 70%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 18, cursor: 'pointer', fontFamily: 'Sora, sans-serif',
    }}>
      {/* Ambient grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(0,203,168,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,203,168,0.3) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      <div style={{ fontSize: 9, fontWeight: 700, color: `${TEAL}90`, letterSpacing: 3, textTransform: 'uppercase' }}>Platform Intelligence · UAE Healthcare</div>
      <div style={{ fontSize: 42, fontWeight: 900, background: `linear-gradient(135deg,#fff 40%,${TEAL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1.5, lineHeight: 1 }}>Docstribe</div>
      <div style={{ fontSize: 12, color: DIM, textAlign: 'center', maxWidth: 340, lineHeight: 1.5 }}>
        Clinical Intelligence · RCM · Denial Prevention<br/>
        11 scenes · ~2m 30s · live voice-over
      </div>
      <div style={{ marginTop: 10, padding: '12px 32px', borderRadius: 30, background: `linear-gradient(135deg,${TEAL},${INDIGO})`, color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 0.5, boxShadow: `0 0 40px ${TEAL}40`, display: 'flex', alignItems: 'center', gap: 8, animation: 'dpPulseScale 2s ease-in-out infinite' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        Watch the Platform Demo
      </div>
    </div>
  );
}

/* ─── Scene stat strip (replaces EQ bars) ───────────────────── */
function SceneStatStrip({ scene, progress }) {
  // Stat/KPI scenes render beats inline — no strip needed there
  if (scene.type === 'stat' || scene.type === 'kpi') return null;
  const fired = (scene.beats || []).slice().reverse().find(b => progress >= b.at);
  if (!fired) return null;
  return (
    <div key={fired.stat} style={{
      position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
      zIndex: 15, display: 'flex', gap: 8, alignItems: 'center',
      background: 'rgba(3,7,20,0.88)', backdropFilter: 'blur(14px)',
      borderRadius: 20, padding: '5px 16px',
      border: `1px solid ${scene.color}35`,
      pointerEvents: 'none',
      animation: 'dpBeatIn 0.45s ease both',
      maxWidth: '75%',
    }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: scene.color, boxShadow: `0 0 8px ${scene.color}`, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 900, color: scene.color, fontFamily: 'Sora', whiteSpace: 'nowrap', letterSpacing: -0.3 }}>{fired.stat}</span>
      {fired.sub && <span style={{ fontSize: 8, color: DIM, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>· {fired.sub}</span>}
    </div>
  );
}

/* ─── Sentence caption ───────────────────────────────────────── */
function Caption({ sentence }) {
  return (
    <div key={sentence} style={{
      position: 'absolute', bottom: 46, left: '6%', right: '6%', zIndex: 12,
      textAlign: 'center', fontSize: 11, fontFamily: 'Sora',
      color: 'rgba(255,255,255,0.52)', fontStyle: 'italic', lineHeight: 1.5,
      textShadow: '0 1px 10px rgba(0,0,0,1)',
      animation: 'dpFadeCaption 0.4s ease both',
    }}>
      {sentence}
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

  /* ── Stop audio ────────────────────────────────────────────── */
  const stopAudio = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (sourceRef.current) { try { sourceRef.current.stop(); } catch {} sourceRef.current = null; }
    setIsPlaying(false);
    setProgress(0);
    firedRef.current = new Set();
  }, []);

  /* ── Cleanup ───────────────────────────────────────────────── */
  useEffect(() => () => { cancelAnimationFrame(rafRef.current); if (sourceRef.current) try { sourceRef.current.stop(); } catch {} }, []);

  /* ── Navigate ──────────────────────────────────────────────── */
  const goTo = useCallback((newIdx) => {
    stopAudio();
    setExitIdx(idx);
    setTimeout(() => setExitIdx(null), 550);
    setIdx(newIdx);
    setProgress(0);
    setSentIdx(0);
  }, [idx, stopAudio]);

  /* ── Auto advance ──────────────────────────────────────────── */
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

  /* ── Play a scene ──────────────────────────────────────────── */
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

      // Re-read sentences from SCENES to avoid stale closure
      const scSentences = splitSentences(s.vo);

      const tick = () => {
        const elapsed = audioCtxRef.current.currentTime - t0Ref.current;
        const p       = Math.min(elapsed / durRef.current, 1);
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

  /* ── Auto-play on idx change (if already started) ─────────── */
  useEffect(() => {
    if (started && !isPlaying && !loading) playScene(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  /* ── First play (from splash) ──────────────────────────────── */
  const handleFirstPlay = () => { setSplashDone(true); playScene(0); };

  /* ── Toggle play/pause ─────────────────────────────────────── */
  const togglePlay = () => { if (isPlaying) stopAudio(); else playScene(idx); };

  /* ── Progress bar ──────────────────────────────────────────── */
  const totalPct = ((idx + progress) / SCENES.length) * 100;
  const currentSentence = sentences[sentIdx] || '';

  return (
    <section id="demo" style={{ background: 'linear-gradient(180deg,#000004 0%,#060810 100%)', padding: '64px 20px 72px', fontFamily: 'Sora,sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: TEAL, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8 }}>Platform Demo</div>
        <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: -0.5, lineHeight: 1.15 }}>See Docstribe in Action</h2>
        <p style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>Clinical Intelligence · RCM · OPD · IPD · Denial Prevention · UAE</p>
      </div>

      {/* Stage container */}
      <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative' }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', inset: -2, borderRadius: 14, boxShadow: `0 0 80px ${scene.color}14, 0 0 140px rgba(0,0,0,0.7)`, pointerEvents: 'none', zIndex: 0 }} />

        {/* 16:9 stage */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.06)`, boxShadow: '0 24px 80px rgba(0,0,0,0.75)', background: '#000' }}>
          <div style={{ position: 'absolute', inset: 0 }}>

            {/* Splash */}
            {!splashDone && <Splash onPlay={handleFirstPlay} />}

            {/* Exit scene */}
            {exitIdx !== null && (
              <div key={`exit-${exitIdx}`} style={{ position: 'absolute', inset: 0, zIndex: 1, animation: 'dpExitScene 0.5s ease-in both' }}>
                <SceneVisual scene={SCENES[exitIdx]} progress={0} />
              </div>
            )}

            {/* Active scene */}
            <div key={`sc-${idx}`} style={{ position: 'absolute', inset: 0, zIndex: 2, animation: started ? 'dpEnterScene 0.5s ease-out both' : 'none' }}>
              <SceneVisual scene={scene} progress={progress} />
            </div>

            {/* Vignette */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.45) 100%)', pointerEvents: 'none' }} />

            {/* Top progress bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 25, background: 'rgba(0,0,0,0.3)' }}>
              <div style={{ height: '100%', width: `${totalPct}%`, background: `linear-gradient(90deg,${scene.color},${INDIGO})`, transition: 'width 0.15s linear' }} />
            </div>

            {/* Caption */}
            {isPlaying && <Caption sentence={currentSentence} />}

            {/* Scene stat strip — shows latest key metric as VO progresses */}
            <SceneStatStrip scene={scene} progress={progress} />

            {/* Controls */}
            <div style={{ position: 'absolute', bottom: 26, right: 14, zIndex: 25, display: 'flex', gap: 5 }}>
              <button onClick={() => idx > 0 && goTo(idx - 1)} disabled={idx === 0} style={{ width: 26, height: 26, borderRadius: 5, border: `1px solid ${BORDER}`, background: 'rgba(0,0,0,0.6)', color: idx === 0 ? '#1e293b' : DIM, fontSize: 13, cursor: idx === 0 ? 'default' : 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
              <button onClick={togglePlay} disabled={loading} style={{ height: 26, padding: '0 14px', borderRadius: 5, border: `1px solid ${scene.color}40`, background: isPlaying ? 'rgba(248,113,113,0.12)' : `linear-gradient(135deg,${scene.color}1e,${INDIGO}16)`, color: isPlaying ? '#f87171' : scene.color, fontSize: 10, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 5, boxShadow: !isPlaying && !loading ? `0 0 14px ${scene.color}20` : 'none', transition: 'all 0.2s' }}>
                {loading
                  ? <div style={{ width: 9, height: 9, borderRadius: '50%', border: `2px solid ${scene.color}40`, borderTopColor: scene.color, animation: 'dpSpin 0.7s linear infinite' }} />
                  : isPlaying
                    ? <><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>Pause</>
                    : <><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>{started ? 'Play' : '▶ Play Demo'}</>}
              </button>
              <button onClick={() => idx < SCENES.length - 1 && goTo(idx + 1)} disabled={idx === SCENES.length - 1} style={{ width: 26, height: 26, borderRadius: 5, border: `1px solid ${BORDER}`, background: 'rgba(0,0,0,0.6)', color: idx === SCENES.length - 1 ? '#1e293b' : DIM, fontSize: 13, cursor: idx === SCENES.length - 1 ? 'default' : 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            </div>
          </div>
        </div>

        {/* Scene navigation dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 14, flexWrap: 'wrap' }}>
          {SCENES.map((s, i) => {
            const active = i === idx;
            const past   = i < idx;
            return (
              <button key={i} onClick={() => goTo(i)} title={s.title} style={{ height: 5, width: active ? 20 : 5, borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer', background: active ? s.color : past ? `${s.color}55` : 'rgba(255,255,255,0.12)', boxShadow: active ? `0 0 8px ${s.color}80` : 'none', transition: 'all 0.3s ease', flexShrink: 0 }} />
            );
          })}
        </div>

        {/* CTA */}
        <p style={{ textAlign: 'center', marginTop: 22, fontSize: 11, color: MUTED }}>
          Ready to see this on your hospital data?{' '}
          <a href="mailto:arcus@docstribe.com" style={{ color: TEAL, fontWeight: 700, textDecoration: 'none' }}>arcus@docstribe.com</a>
        </p>
      </div>

      {/* Keyframes */}
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
          50%      { opacity:0.35; transform:scale(1.6); }
        }
        @keyframes dpPulseScale {
          0%,100% { transform:scale(1);    box-shadow:0 0 40px rgba(0,203,168,0.4); }
          50%      { transform:scale(1.03); box-shadow:0 0 60px rgba(0,203,168,0.7); }
        }
        @keyframes dpSpin {
          to { transform:rotate(360deg); }
        }
        @keyframes dpFadeCaption {
          from { opacity:0; }
          to   { opacity:1; }
        }
      `}</style>
    </section>
  );
}
