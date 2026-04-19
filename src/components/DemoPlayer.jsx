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
    // S1:12w S2:7w S3:2w S4:4w = 25w — beat fracs 0.48 0.76 0.84 1.00
    vo: "In the UAE, twelve to eighteen percent of claims are denied. Sixty to seventy percent of those? Entirely preventable. Docstribe closes that gap.",
    beats: [
      { at: 0.04, stat: '12–18%',        sub: 'UAE claims denied on first submission' },
      { at: 0.49, stat: '60–70%',        sub: 'of those denials are entirely preventable' },
      { at: 0.85, stat: 'Zero leakage.', sub: 'Docstribe closes the gap before it opens' },
    ],
  },
  {
    id: 2, type: 'kpi', color: TEAL,
    title: 'Introducing Docstribe',
    // S1:11w S2:16w S3:7w = 34w — beat fracs 0.32 0.79 1.00
    vo: "Meet Docstribe — an AI agentic workforce built for UAE healthcare. Denials drop thirty percent, revenue goes up twenty-five percent, CMI improves by zero point fifteen. We guarantee it within sixty days.",
    beats: [
      { at: 0.04, stat: 'Docstribe',  sub: 'AI agentic workforce — UAE healthcare' },
      { at: 0.38, stat: '↓30%',       sub: 'Fewer denials on first submission' },
      { at: 0.54, stat: '+25%',       sub: 'Revenue capture uplift' },
      { at: 0.70, stat: '+0.15 CMI',  sub: 'Case mix index uplift per discharge' },
      { at: 0.80, stat: '60 days',    sub: 'Guaranteed from go-live · contractual SLA' },
    ],
  },
  {
    id: 3, type: 'product', color: TEAL,
    title: 'One Unified Workspace',
    breadcrumb: 'Cases Workbench',
    // S1:15w S2:8w = 23w — beat fracs 0.65 1.00; zero leakage at word 14 = 0.61
    vo: "Here you can see two hundred live cases — OPD, IPD, Emergency — with zero leakage. Every encounter tracked from diagnosis to final payment.",
    beats: [
      { at: 0.06, stat: '200 active cases', sub: 'OPD · IPD · Emergency — unified' },
      { at: 0.62, stat: 'Zero leakage',     sub: 'every encounter tracked end-to-end' },
    ],
  },
  {
    id: 4, type: 'product', color: GREEN,
    title: 'Pre-Visit Intelligence',
    breadcrumb: 'Eligibility & Pre-Authorisation',
    // S1:4w S2:11w S3:18w = 33w — beat fracs 0.12 0.45 1.00; Daman at S2 word 6 = 0.30
    vo: "Watch what happens here. Before the OPD patient arrives, Daman eligibility is confirmed automatically. For this IPD admission, Thiqa pre-approval for AED twenty-eight thousand five hundred fires at order entry, not discharge.",
    beats: [
      { at: 0.14, stat: 'Daman eligible',  sub: 'OPD · confirmed before arrival' },
      { at: 0.46, stat: '✅ PA APPROVED',   sub: 'AED 28,500 · Thiqa · order entry not discharge' },
    ],
  },
  {
    id: 5, type: 'product', color: INDIGO,
    title: 'Ambient Clinical Intelligence',
    breadcrumb: 'Ambient Scribe — OPD & IPD',
    // S1:18w S2:13w = 31w — beat fracs 0.58 1.00; NABIDH at S2 word 5 = 0.74
    vo: "As the physician talks, our AI builds the structured note in real time — vital signs, diagnoses, ICD codes. It connects directly to NABIDH and DHA, so the doctor stays focused on care.",
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
    // S1:16w S2:13w = 29w — beat fracs 0.55 1.00; AED at word 13 = 0.45; Pneumonia at S2 word 5 = 0.72
    vo: "One tap from the physician confirms medical necessity — that's AED four hundred twenty captured right there. Here for the IPD patient, confirming Pneumonia closes the IR-DRG gap before discharge.",
    beats: [
      { at: 0.06, stat: 'OPD — Medical Necessity', sub: 'physician confirms with one tap' },
      { at: 0.42, stat: '+AED 420',                sub: 'medical necessity captured · billed' },
      { at: 0.60, stat: 'IPD — IR-DRG gap closed', sub: 'Pneumonia confirmed · DRG optimised' },
    ],
  },
  {
    id: 7, type: 'product', color: PURPLE,
    title: 'AI-Powered Coding',
    breadcrumb: 'ICD-10-CM · Smart Coding Engine',
    // S1:11w S2:25w = 36w — beat fracs 0.31 1.00; IR-DRG at S2 word 3 = 0.36; AED at S2 word 18 = 0.81
    vo: "The AI reads clinical notes and surfaces ranked ICD codes instantly. Watch the IR-DRG weight move from zero point nine four to one point three four — that jump alone recovers AED eighteen thousand four hundred per case.",
    beats: [
      { at: 0.06, stat: 'Notes → ICD-10-CM',   sub: 'diagnoses ranked · symptoms suppressed' },
      { at: 0.34, stat: 'IR-DRG 0.94 → 1.34', sub: 'weight maximised · revenue recovered' },
      { at: 0.80, stat: '+AED 18,400',          sub: 'per case · zero manual backlog' },
    ],
  },
  {
    id: 8, type: 'product', color: RED,
    title: 'Denial Intelligence',
    breadcrumb: 'Payor Contract Intelligence',
    // S1:7w S2:9w S3:1w S4:8w S5:6w = 31w — fracs 0.23 0.52 0.55 0.81 1.00
    vo: "Docstribe pulls denials per payor, per batch. Daman: twenty-three percent denial rate, AXA Gulf: thirty-one. Recoverable? Sixty-seven to ninety-one percent — pre-submission. Denial rate drops thirty percent.",
    beats: [
      { at: 0.10, stat: 'Per payor · per batch', sub: 'Daman · Thiqa · AXA Gulf · Oman Insurance' },
      { at: 0.54, stat: '67–91% recoverable',    sub: 'pre-submission · flagged before send' },
      { at: 0.82, stat: 'Denial rate ↓ 30%',    sub: 'batch over batch · systemic improvement' },
    ],
  },
  {
    id: 9, type: 'product', color: TEAL,
    title: 'One-Click Recovery',
    breadcrumb: 'Claim Recovery — Appeal Generator',
    // S1:12w S2:17w S3:2w = 31w — fracs 0.39 0.94 1.00; one click at S2 word 2 = 0.42
    vo: "CARC 97 — bundling denial, AED one thousand nine hundred at risk. One click: Docstribe searches the Daman contract, finds Clause four point one point two, builds the appeal. Thirty seconds.",
    beats: [
      { at: 0.06, stat: 'AED 1,900 denied', sub: 'CARC 97 · Daman · bundling dispute' },
      { at: 0.40, stat: '1-click appeal',   sub: 'contract searched · clause cited · letter built' },
      { at: 0.90, stat: '✅ 30 seconds',    sub: 'AED 1,900 recovered · vs. 3 weeks manual' },
    ],
  },
  {
    id: 10, type: 'product', color: INDIGO,
    title: 'Service Line Growth',
    breadcrumb: 'Service Line Growth · Clinical Engagement',
    // S1:12w S2:12w S3:10w = 34w — fracs 0.35 0.71 1.00
    vo: "Docstribe turns clinical deterioration into an ops team action list. Oxygen falling, BNP rising — revenue windows surfaced in real time. Four patients, AED ninety-one thousand in uplift, Day Zero.",
    beats: [
      { at: 0.10, stat: 'Ops engagement queue', sub: 'clinical deterioration → revenue action · live' },
      { at: 0.36, stat: 'AED 91K opportunity',  sub: '4 patients · surfaced live · Day Zero' },
    ],
  },
  {
    id: 11, type: 'dashboard', color: TEAL,
    title: 'Your RCM Intelligence Partner',
    breadcrumb: 'Your RCM Intelligence Framework',
    // S1:7w S2:22w S3:9w = 38w — fracs 0.18 0.76 1.00
    vo: "Docstribe is not a generic platform. It builds a personalized intelligence framework — your payors, your physicians, your case mix — and it evolves with your hospital. Clinical intelligence, financial integrity, built for you.",
    beats: [
      { at: 0.06, stat: 'Your intelligence',      sub: 'payors · physicians · case mix — personalized' },
      { at: 0.20, stat: 'Personalized framework',  sub: 'evolves with your hospital · not a generic tool' },
      { at: 0.78, stat: 'Built for you.',          sub: 'Clinical Intelligence · Financial Integrity' },
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
            <div style={{ fontSize: i === 0 ? 96 : i === 1 ? 76 : 28, fontWeight: 900, letterSpacing: i < 2 ? -2 : -0.5, fontFamily: 'Sora', lineHeight: 1.0, color: i === 2 ? TEAL : '#fff', textShadow: active ? `0 0 80px ${TEAL}80` : i < 2 ? `0 0 40px ${TEAL}30` : 'none', transition: 'text-shadow 0.5s ease', background: i === 2 && active ? `linear-gradient(135deg,${TEAL},${INDIGO})` : 'none', WebkitBackgroundClip: i === 2 && active ? 'text' : 'unset', WebkitTextFillColor: i === 2 && active ? 'transparent' : 'unset' }}>
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

/* Scene 2 — Intro Docstribe (p<0.46), then KPI outcomes (p>=0.48) */
function KPIScene({ scene, progress }) {
  // intro fades out 0.30→0.40, kpis fade in 0.32→0.42
  // VO: "thirty percent" at fraction 0.35 — KPI phase aligns with ↓30% beat
  const introOpacity = progress < 0.30 ? 1 : progress > 0.40 ? 0 : 1 - (progress - 0.30) / 0.10;
  const kpiOpacity   = progress < 0.32 ? 0 : progress > 0.42 ? 1 : (progress - 0.32) / 0.10;
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
              <div key={i} style={{ background: `linear-gradient(135deg,${c}18,${c}08)`, border: `1px solid ${c}${active ? '65' : show ? '28' : '10'}`, borderRadius: 16, padding: '22px 20px', minWidth: 130, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: show ? 1 : 0, transform: show ? `scale(${active ? 1.09 : 1})` : 'translateY(32px) scale(0.78)', transition: 'all 0.55s cubic-bezier(0.34,1.4,0.64,1)', boxShadow: active ? `0 0 48px ${c}35, 0 8px 32px rgba(0,0,0,0.4)` : '0 2px 12px rgba(0,0,0,0.3)', filter: show && !active ? 'brightness(0.65)' : 'brightness(1)' }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: c, fontFamily: 'Sora', lineHeight: 1, letterSpacing: -1 }}>
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
  const paApproved = progress >= 0.58;
  const opdActive = spot(progress, 0.05, 0.40);
  const ipdActive = spot(progress, 0.40, 0.92);
  const opdSteps = [
    { label: 'Member verified — Daman Enhanced', sub: 'Member ID: ***-4821 · Comprehensive Plus · active', show: 0.08 },
    { label: 'Coverage active · no auth required', sub: 'DM + HTN consult · AED 6,550 remaining · valid Dec 2025', show: 0.22 },
  ];
  const ipdSteps = [
    { label: 'Admission trigger — docs auto-attached', sub: 'K.A. · Respiratory · J18.9 Pneumonia · J44.1 COPD', show: 0.40 },
    { label: 'PA submitted to Thiqa / SEHA', sub: 'REF: THQ-2024-189234 · AED 28,500 requested', show: 0.50 },
    { label: 'Pre-authorisation approved', sub: 'THQ-2024-189234 · AED 28,500 authorised ✓', show: 0.58, highlight: true },
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
          {progress >= 0.28 && (
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

/* Scene 5 — Ambient Scribe: realistic product screen with live transcript, entity extraction, ICD coding */
function AmbientScreen({ progress }) {
  const p = progress;

  // OPD phases (compressed for shorter VO)
  const opdListening   = p >= 0.06 && p < 0.36;
  const opdStructuring = p >= 0.34 && p < 0.44;
  const opdComplete    = p >= 0.42;
  const opdPhaseLabel  = opdListening ? 'LISTENING' : opdStructuring ? 'STRUCTURING' : opdComplete ? 'NOTE READY' : 'STANDBY';
  const opdPhaseColor  = opdListening ? RED : opdStructuring ? AMBER : opdComplete ? GREEN : MUTED;

  // IPD phases (compressed)
  const ipdListening   = p >= 0.42 && p < 0.64;
  const ipdStructuring = p >= 0.62 && p < 0.70;
  const ipdComplete    = p >= 0.68;
  const ipdPhaseLabel  = ipdListening ? 'LISTENING' : ipdStructuring ? 'STRUCTURING' : ipdComplete ? 'NOTE READY' : p < 0.42 ? 'QUEUED' : 'STANDBY';
  const ipdPhaseColor  = ipdListening ? RED : ipdStructuring ? AMBER : ipdComplete ? GREEN : MUTED;

  // OPD transcript lines — 3 lines, compressed
  const opdLines = [
    { text: '"HbA1c nine point one — definitely uncontrolled."', show: 0.08 },
    { text: 'BP one forty two over eighty eight. eGFR sixty eight — CKD Stage 3.', show: 0.17 },
    { text: 'Adjusting Metformin, adding Jardiance. Nephrology referral flagged.', show: 0.28 },
  ];

  // OPD AI entities — 3 entities
  const opdEntities = [
    { label: 'HbA1c', value: '9.1% ↑', col: RED,    show: 0.10 },
    { label: 'BP',    value: '142/88 ↑', col: AMBER, show: 0.18 },
    { label: 'eGFR',  value: '68 ↓ CKD3', col: INDIGO, show: 0.28 },
  ];

  // OPD ICD codes — 2 codes
  const opdCodes = [
    { code: 'E11.65', desc: 'Type 2 DM with hyperglycaemia', col: RED,   show: 0.42 },
    { code: 'I10',    desc: 'Essential hypertension',         col: AMBER, show: 0.50 },
  ];

  // IPD transcript lines — 3 lines, compressed
  const ipdLines = [
    { text: '"Sats ninety one on room air. Bilateral crackles at both bases."', show: 0.44 },
    { text: 'CRP one forty eight. Chest X-ray: consolidation left base. qSOFA two.', show: 0.52 },
    { text: 'Pneumonia on COPD background. Tazocin IV. Sepsis bundle initiated.', show: 0.60 },
  ];

  // IPD AI entities — 3 entities
  const ipdEntities = [
    { label: 'SpO₂',  value: '91% ↓',               col: RED,    show: 0.46 },
    { label: 'CRP',   value: '148 mg/L ↑',           col: AMBER,  show: 0.54 },
    { label: 'qSOFA', value: 'Score 2 · Sepsis risk', col: PURPLE, show: 0.62 },
  ];

  // IPD ICD codes — 2 codes
  const ipdCodes = [
    { code: 'J18.9', desc: 'Pneumonia, unspecified organism', col: RED,   show: 0.68 },
    { code: 'J44.1', desc: 'COPD with acute exacerbation',    col: AMBER, show: 0.74 },
  ];

  const sessionLive = p >= 0.06 && p < 0.68;

  return (
    <ProductShell breadcrumb="Ambient Scribe — Live Session" color={INDIGO}>
      <div style={{ padding: '9px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>

        {/* ── Session bar ── */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, paddingBottom: 6, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: sessionLive ? RED : p >= 0.72 ? GREEN : MUTED, animation: sessionLive ? 'dpPulse 1.1s ease infinite' : 'none', boxShadow: sessionLive ? `0 0 7px ${RED}` : 'none', transition: 'background 0.4s' }} />
            <span style={{ fontSize: 8, fontWeight: 800, color: sessionLive ? RED : p >= 0.72 ? GREEN : MUTED, letterSpacing: 0.5 }}>
              {sessionLive ? 'SESSION LIVE' : p >= 0.72 ? 'SESSION COMPLETE' : 'READY'}
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 7, color: MUTED }}>19 Apr 2025 · 09:14 GST</span>
          <div style={{ fontSize: 7, fontWeight: 700, color: INDIGO, background: `${INDIGO}14`, border: `1px solid ${INDIGO}28`, borderRadius: 4, padding: '2px 6px' }}>NABIDH ✓</div>
          <div style={{ fontSize: 7, fontWeight: 700, color: TEAL, background: `${TEAL}14`, border: `1px solid ${TEAL}28`, borderRadius: 4, padding: '2px 6px' }}>DHA Licensed</div>
        </div>

        {/* ── Two columns: OPD | IPD ── */}
        <div style={{ display: 'flex', gap: 10, flex: 1, overflow: 'hidden', minHeight: 0 }}>

          {/* ── OPD Column ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, overflow: 'hidden' }}>

            {/* Patient card — always visible from p=0 */}
            <div style={{ background: `${INDIGO}10`, border: `1px solid ${INDIGO}${opdListening ? '55' : opdStructuring ? '40' : opdComplete ? '28' : '1a'}`, borderRadius: 9, padding: '8px 11px', flexShrink: 0, transition: 'border-color 0.5s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5, gap: 6 }}>
                <Pill text="OPD" color={INDIGO} />
                <span style={{ fontSize: 10, fontWeight: 700, color: TXT }}>F.H. · Fatima Hassan</span>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', gap: 3, alignItems: 'center', background: `${opdPhaseColor}15`, border: `1px solid ${opdPhaseColor}30`, borderRadius: 10, padding: '2px 8px', transition: 'all 0.4s' }}>
                  {opdListening && <div style={{ width: 4, height: 4, borderRadius: '50%', background: RED, animation: 'dpPulse 1s ease infinite' }} />}
                  <span style={{ fontSize: 7, fontWeight: 800, color: opdPhaseColor, letterSpacing: 0.3 }}>{opdPhaseLabel}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                {[['Specialty','Endocrinology'],['Physician','Dr. Al-Rashid'],['Enc ID','OPD-0891']].map(([k,v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 7, color: MUTED }}>{k}</div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: DIM }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live transcript panel — always visible, waveform activates with voice */}
            <div style={{ background: 'rgba(0,0,0,0.28)', border: `1px solid ${opdListening ? `${INDIGO}40` : BORDER}`, borderRadius: 8, padding: '8px 10px', flexShrink: 0, transition: 'border-color 0.5s' }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: MUTED, letterSpacing: 0.4, marginBottom: 6 }}>LIVE TRANSCRIPT</div>
              {/* Animated waveform */}
              <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 14, marginBottom: 7 }}>
                {Array.from({ length: 26 }, (_, i) => (
                  <div key={i} style={{ flex: 1, background: INDIGO, borderRadius: 1, opacity: opdListening ? 0.72 : 0.18, height: opdListening ? `${20 + Math.sin(i * 1.2 + p * 42) * 68}%` : '18%', transition: 'height 0.1s ease, opacity 0.5s' }} />
                ))}
              </div>
              {/* Transcript lines — appear progressively */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minHeight: 36 }}>
                {opdLines.map((line, i) => (
                  <div key={i} style={{ fontSize: 8, color: p >= line.show ? (p >= line.show + 0.12 ? `${TXT}99` : TXT) : 'transparent', lineHeight: 1.45, fontStyle: 'italic', transition: 'color 0.5s ease' }}>
                    {p >= line.show ? line.text : ' '}
                  </div>
                ))}
                {opdListening && <span style={{ display: 'inline-block', width: 2, height: 11, background: INDIGO, borderRadius: 1, animation: 'dpPulse 0.75s step-end infinite', verticalAlign: 'bottom' }} />}
              </div>
            </div>

            {/* AI entity tags */}
            {p >= 0.12 && (
              <div style={{ animation: 'dpEnterScene 0.45s ease-out both', flexShrink: 0 }}>
                <div style={{ fontSize: 7, fontWeight: 700, color: MUTED, letterSpacing: 0.4, marginBottom: 5 }}>AI-EXTRACTED ENTITIES</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {opdEntities.map((e, i) => p >= e.show && (
                    <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center', background: `${e.col}12`, border: `1px solid ${e.col}30`, borderRadius: 8, padding: '3px 9px', animation: 'dpBeatIn 0.4s ease both' }}>
                      <span style={{ fontSize: 7, color: MUTED }}>{e.label}:</span>
                      <span style={{ fontSize: 8, fontWeight: 800, color: e.col }}>{e.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ICD-10-CM coded note */}
            {opdComplete && (
              <div style={{ animation: 'dpEnterScene 0.5s ease-out both', flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 7, fontWeight: 800, color: `${GREEN}cc`, letterSpacing: 0.4, marginBottom: 5 }}>✓ ICD-10-CM AUTO-CODED · CLAIM READY</div>
                {opdCodes.map((c, i) => p >= c.show && (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', marginBottom: 4, borderRadius: 8, background: `${c.col}0d`, border: `1px solid ${c.col}28`, animation: 'dpBeatIn 0.4s ease both' }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: c.col, fontFamily: 'Sora', width: 46, flexShrink: 0 }}>{c.code}</span>
                    <span style={{ fontSize: 9, color: TXT, flex: 1, lineHeight: 1.3 }}>{c.desc}</span>
                    <span style={{ fontSize: 9, color: GREEN, fontWeight: 800 }}>✓</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div style={{ width: 1, background: BORDER, flexShrink: 0 }} />

          {/* ── IPD Column ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, overflow: 'hidden' }}>

            {/* Patient card — always visible */}
            <div style={{ background: `${TEAL}0d`, border: `1px solid ${TEAL}${ipdListening ? '50' : ipdStructuring ? '38' : ipdComplete ? '28' : '18'}`, borderRadius: 9, padding: '8px 11px', flexShrink: 0, transition: 'border-color 0.5s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5, gap: 6 }}>
                <Pill text="IPD" color={TEAL} />
                <span style={{ fontSize: 10, fontWeight: 700, color: TXT }}>K.A. · Khalid Al-Mansoori</span>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', gap: 3, alignItems: 'center', background: `${ipdPhaseColor}15`, border: `1px solid ${ipdPhaseColor}30`, borderRadius: 10, padding: '2px 8px', transition: 'all 0.4s' }}>
                  {ipdListening && <div style={{ width: 4, height: 4, borderRadius: '50%', background: RED, animation: 'dpPulse 1s ease infinite' }} />}
                  <span style={{ fontSize: 7, fontWeight: 800, color: ipdPhaseColor, letterSpacing: 0.3 }}>{ipdPhaseLabel}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                {[['Ward','Respiratory · Bay 4'],['Physician','Dr. Farooqi'],['Enc ID','IPD-0234']].map(([k,v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 7, color: MUTED }}>{k}</div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: DIM }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live transcript / queued state */}
            <div style={{ background: 'rgba(0,0,0,0.28)', border: `1px solid ${ipdListening ? `${TEAL}40` : BORDER}`, borderRadius: 8, padding: '8px 10px', flexShrink: 0, transition: 'border-color 0.5s' }}>
              <div style={{ fontSize: 7, fontWeight: 700, color: MUTED, letterSpacing: 0.4, marginBottom: 6 }}>
                {p < 0.46 ? 'NEXT SESSION — WARD ROUND 09:28 GST' : 'LIVE TRANSCRIPT'}
              </div>
              {/* Waveform */}
              <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 14, marginBottom: 7 }}>
                {Array.from({ length: 26 }, (_, i) => (
                  <div key={i} style={{ flex: 1, background: TEAL, borderRadius: 1, opacity: ipdListening ? 0.72 : 0.16, height: ipdListening ? `${20 + Math.sin(i * 1.35 + p * 40) * 68}%` : '16%', transition: 'height 0.1s ease, opacity 0.5s' }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minHeight: 36 }}>
                {p < 0.46 ? (
                  <div style={{ fontSize: 8, color: MUTED, fontStyle: 'italic', lineHeight: 1.45 }}>
                    Ambient session queued · Dr. Farooqi completing ward round...
                  </div>
                ) : (
                  <>
                    {ipdLines.map((line, i) => (
                      <div key={i} style={{ fontSize: 8, color: p >= line.show ? (p >= line.show + 0.12 ? `${TXT}99` : TXT) : 'transparent', lineHeight: 1.45, fontStyle: 'italic', transition: 'color 0.5s ease' }}>
                        {p >= line.show ? line.text : ' '}
                      </div>
                    ))}
                    {ipdListening && <span style={{ display: 'inline-block', width: 2, height: 11, background: TEAL, borderRadius: 1, animation: 'dpPulse 0.75s step-end infinite', verticalAlign: 'bottom' }} />}
                  </>
                )}
              </div>
            </div>

            {/* AI entity tags */}
            {p >= 0.50 && (
              <div style={{ animation: 'dpEnterScene 0.45s ease-out both', flexShrink: 0 }}>
                <div style={{ fontSize: 7, fontWeight: 700, color: MUTED, letterSpacing: 0.4, marginBottom: 5 }}>AI-EXTRACTED ENTITIES</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {ipdEntities.map((e, i) => p >= e.show && (
                    <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center', background: `${e.col}12`, border: `1px solid ${e.col}30`, borderRadius: 8, padding: '3px 9px', animation: 'dpBeatIn 0.4s ease both' }}>
                      <span style={{ fontSize: 7, color: MUTED }}>{e.label}:</span>
                      <span style={{ fontSize: 8, fontWeight: 800, color: e.col }}>{e.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ICD-10-CM coded note */}
            {ipdComplete && (
              <div style={{ animation: 'dpEnterScene 0.5s ease-out both', flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 7, fontWeight: 800, color: `${GREEN}cc`, letterSpacing: 0.4, marginBottom: 5 }}>✓ ICD-10-CM AUTO-CODED · CLAIM READY</div>
                {ipdCodes.map((c, i) => p >= c.show && (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', marginBottom: 4, borderRadius: 8, background: `${c.col}0d`, border: `1px solid ${c.col}28`, animation: 'dpBeatIn 0.4s ease both' }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: c.col, fontFamily: 'Sora', width: 46, flexShrink: 0 }}>{c.code}</span>
                    <span style={{ fontSize: 9, color: TXT, flex: 1, lineHeight: 1.3 }}>{c.desc}</span>
                    <span style={{ fontSize: 9, color: GREEN, fontWeight: 800 }}>✓</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Compliance banner ── */}
        {p >= 0.68 && (
          <div style={{ background: `linear-gradient(90deg,${INDIGO}12,${TEAL}12)`, border: `1px solid ${TEAL}38`, borderRadius: 8, padding: '8px 14px', display: 'flex', gap: 22, alignItems: 'center', animation: 'dpBeatIn 0.6s cubic-bezier(0.34,1.4,0.64,1) both', flexShrink: 0 }}>
            {[['NABIDH ✓', INDIGO, 'Unified Medical Record'],['DHA Licensed ✓', TEAL, 'Dubai Health Authority'],['HL7 FHIR ✓', GREEN, 'Exchange-ready structured note']].map(([label, c, sub]) => (
              <div key={label} style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${c}`, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: c }}>{label}</div>
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
  const auditReady = progress >= 0.82;
  const opdQueries = [
    { q: 'Is this DM follow-up medically necessary per DHA guidelines?', opts: ['Yes — medically necessary', 'Routine monitoring only'], answer: 0, show: 0.08, impact: '+AED 420 / claim · E11.65 unlocks higher code weight' },
    { q: 'HbA1c 9.1% — document DM as controlled or uncontrolled?', opts: ['Uncontrolled (HbA1c 9.1%)', 'Controlled (HbA1c < 7%)'], answer: 0, show: 0.24, impact: 'E11.65 + N18.3 (CKD Stg 3) · both billable' },
  ];
  const ipdQueries = [
    { q: 'Confirm inpatient admission — Inpatient or Observation?', opts: ['Confirm inpatient admission', 'Maintain observation status'], answer: 0, show: 0.44, impact: 'Full IR-DRG weight applied · vs observation rate' },
    { q: 'Principal diagnosis — Pneumonia or COPD exacerbation?', opts: ['J18.9 — Pneumonia (primary)', 'J44.1 — COPD exacerbation (primary)'], answer: 0, show: 0.62, impact: 'Sequencing locks IR-DRG · +0.18 weight' },
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
  const showCodes = progress >= 0.10;
  const showIPD = progress >= 0.22;
  const drgReveal = progress >= 0.38;
  const drgAfter = progress >= 0.50;
  const showImpact = progress >= 0.68;
  const opdCodes = [
    { code: 'E11.65', desc: 'Type 2 DM with hyperglycemia', spec: 95, col: RED, show: 0.12 },
    { code: 'I10', desc: 'Essential (primary) hypertension', spec: 90, col: AMBER, show: 0.18 },
    { code: 'N18.3', desc: 'Chronic kidney disease — Stage 3', spec: 78, col: INDIGO, show: 0.24 },
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
    <ProductShell breadcrumb="Payor Contract Intelligence" color={RED}>
      <div style={{ padding: '10px 14px', height: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, fontSize: 8, color: MUTED, fontWeight: 700, letterSpacing: 0.5 }}>DENIAL PATTERN ANALYSIS · PER PAYOR · PER BATCH</div>
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
    { init: 'D.K.', dept: 'Respiratory', signal: 'SpO₂ 94→88% over 4h · deteriorating',    opportunity: 'IR-DRG escalation window open',         action: 'CDI Alert',  actionCol: AMBER,  uplift: '+AED 18K', risk: 'HIGH',     col: TEAL,   show: 0.10 },
    { init: 'N.M.', dept: 'Cardiology',  signal: 'BNP risen 3× — heart failure likely',     opportunity: 'Complex DRG candidate · MCC qualifies', action: 'Ops Engage', actionCol: RED,    uplift: '+AED 32K', risk: 'CRITICAL', col: RED,    show: 0.28 },
    { init: 'A.R.', dept: 'Neurology',   signal: 'GCS change Day 2 — LOS extension likely', opportunity: 'CDI query pending · CC documentation',  action: 'CDI Query',  actionCol: INDIGO, uplift: '+AED 14K', risk: 'HIGH',     col: INDIGO, show: 0.46 },
    { init: 'B.S.', dept: 'Oncology',   signal: 'ECOG progressing — chemo eligible',        opportunity: 'Pre-auth for systemic therapy ready',   action: 'PA Ready',   actionCol: GREEN,  uplift: '+AED 27K', risk: 'MED',      col: PURPLE, show: 0.62 },
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
          {['Patient', 'Clinical Signal', 'Revenue Opportunity', 'Action', 'Uplift'].map((h, i) => (
            <div key={i} style={{ flex: i === 1 || i === 2 ? 2 : 1, fontSize: 7, color: MUTED, fontWeight: 700, padding: '3px 0', letterSpacing: 0.3 }}>{h}</div>
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
      label: 'Your Payor Intelligence',
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

        {/* Header — partner positioning */}
        {headerShow && (
          <div style={{ background: `linear-gradient(135deg,${TEAL}18,${INDIGO}0d)`, border: `1px solid ${TEAL}40`, borderRadius: 10, padding: '10px 16px', animation: 'dpBeatIn 0.7s cubic-bezier(0.34,1.4,0.64,1) both', flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: TXT, fontFamily: 'Sora' }}>
              Docstribe doesn't give you a platform. It builds{' '}
              <span style={{ color: TEAL }}>your</span> intelligence framework.
            </div>
            <div style={{ fontSize: 8, color: DIM, marginTop: 4, lineHeight: 1.5 }}>
              Every layer is calibrated to your payors, your physicians, your case mix — and evolves as your hospital evolves.
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

        {/* Brand close */}
        {brandShow && (
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, animation: 'dpBeatIn 0.9s cubic-bezier(0.34,1.2,0.64,1) both', paddingTop: 4 }}>
            <div style={{ fontSize: 32, fontWeight: 900, fontFamily: 'Sora', background: `linear-gradient(135deg,#fff 20%,${TEAL} 55%,${INDIGO})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1.5, lineHeight: 1 }}>Docstribe</div>
            <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[['Clinical Intelligence', TEAL], ['Financial Integrity', INDIGO], ['Built for You', PURPLE]].map(([t, c], i) => (
                <span key={i} style={{ fontSize: 8, fontWeight: 700, color: c, background: `${c}14`, border: `1px solid ${c}30`, borderRadius: 20, padding: '3px 10px' }}>{t}</span>
              ))}
            </div>
            {closingShow && (
              <div style={{ background: `linear-gradient(135deg,${TEAL}1a,${INDIGO}10)`, border: `1px solid ${TEAL}40`, borderRadius: 10, padding: '7px 18px', animation: 'dpBeatIn 0.6s ease both' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: TXT, textAlign: 'center' }}>
                  Not a tool you configure once.{' '}
                  <span style={{ color: TEAL }}>A partner that learns your hospital.</span>
                </div>
              </div>
            )}
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

/* ─── Scene stat strip — centered, sits just above the caption ── */
function SceneStatStrip({ scene, progress }) {
  if (scene.type === 'stat' || scene.type === 'kpi') return null;
  const fired = (scene.beats || []).slice().reverse().find(b => progress >= b.at);
  if (!fired) return null;
  return (
    <div key={fired.stat} style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', zIndex: 15, display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(3,7,20,0.92)', backdropFilter: 'blur(14px)', borderRadius: 20, padding: '6px 18px', border: `1px solid ${scene.color}45`, pointerEvents: 'none', animation: 'dpBeatIn 0.45s ease both', maxWidth: '76%', whiteSpace: 'nowrap' }}>
      <div style={{ width: 7, height: 7, borderRadius: '50%', background: scene.color, boxShadow: `0 0 10px ${scene.color}`, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 900, color: scene.color, fontFamily: 'Sora', letterSpacing: -0.3 }}>{fired.stat}</span>
      {fired.sub && <span style={{ fontSize: 8, color: DIM, overflow: 'hidden', textOverflow: 'ellipsis' }}>· {fired.sub}</span>}
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
      `}</style>
    </section>
  );
}
