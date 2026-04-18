import { useState, useRef, useEffect, useCallback } from 'react';

// ── Phase keyword detection (drives Shakti highlight on the page) ─────────────
const PHASE_KEYWORDS = [
  // Phase 0 — H&P & Day 0 CDI
  ['h&p', 'admission', 'day 0', 'day zero', 'icd-10', 'icd10', 'mdc', 'principal dx',
   'principal diagnosis', 'baseline drg', 'cdi query', 'grouper', 'h and p'],
  // Phase 1 — Daily Rounding & LOS
  ['daily round', 'rounding', '24h', '24 hour', 'progress note', 'soap', 'los',
   'gmlos', 'los paradox', 'lab', 'creatinine', 'aki', 'revenue delta', 'signal',
   'cdi', 'coding', 'drg', 'cc mcc', 'hcc', 'charge capture', 'documentation'],
  // Phase 2 — Discharge & Coding
  ['discharge', 'discharge summary', 'pre-bill', 'pre bill', 'final drg', 'coding',
   'claim', 'pre-bill brief', 'denial', 'appeal', 'clean claim', 'physician profile'],
];

function detectPhase(words, index) {
  const window = words.slice(Math.max(0, index - 4), index + 6).join(' ').toLowerCase();
  for (let i = 0; i < PHASE_KEYWORDS.length; i++) {
    if (PHASE_KEYWORDS[i].some(kw => window.includes(kw))) return i;
  }
  return null;
}

function emitPhase(phase) {
  window.dispatchEvent(new CustomEvent('rudra-phase', { detail: { phase } }));
}

// ── Tour trigger detection ────────────────────────────────────────────────────
const TOUR_RE = /\b(walk me through|show me (how|the|all|it)|the (whole |full |patient |revenue |drg )(workflow|journey|cycle|process|lifecycle)|how does it (all |)work|full overview|explain (everything|the process|how it all|the drg|the lifecycle)|give me (an |the )(overview|tour)|drg lifecycle|h&p to (claim|discharge|coding))\b/i;

const TOUR_PHASE_COLORS = ['#00cba8', '#4d8aff', '#ff7b4a'];
const TOUR_PHASE_LABELS = ['H&P & Day 0 CDI', 'Daily Rounding', 'Discharge & Coding'];

// ── Constants ─────────────────────────────────────────────────────────────────
const ROLES = [
  { id: 'cfo',       label: 'CFO / CEO',          sub: 'Revenue, margin & financial strategy',    abbr: 'CFO' },
  { id: 'cdi',       label: 'CDI Director',        sub: 'Documentation quality & DRG optimization', abbr: 'CDI' },
  { id: 'rcm',       label: 'RCM Director',        sub: 'Revenue cycle operations',                 abbr: 'RCM' },
  { id: 'physician', label: 'Physician / CMO',     sub: 'Clinical documentation workflow',          abbr: 'MD'  },
  { id: 'coder',     label: 'Coding / HIM Manager', sub: 'DRG accuracy & claim integrity',          abbr: 'HIM' },
  { id: 'investor',  label: 'Investor / Partner',  sub: 'Market opportunity & growth thesis',       abbr: '$'   },
];


// ── EQ Canvas visualizer ──────────────────────────────────────────────────────
function EQCanvas({ analyserRef, isPlaying }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const BAR_COUNT = 42;
    const GAP = 3;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const barW = (W - GAP * (BAR_COUNT - 1)) / BAR_COUNT;

      if (isPlaying && analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        for (let i = 0; i < BAR_COUNT; i++) {
          const binIndex = Math.floor(i * data.length / BAR_COUNT);
          const value = data[binIndex] / 255;
          const barH = Math.max(3, value * (H - 6));
          const x = i * (barW + GAP);
          const y = H - barH;
          const t = i / BAR_COUNT;
          // teal (#00cba8) → indigo (#4d8aff)
          const r = Math.round(0  + t * 77);
          const g = Math.round(203 - t * 65);
          const b = Math.round(168 + t * 87);
          const a = 0.65 + value * 0.35;
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
          ctx.fillRect(x, y, barW, barH);
          // bright cap
          ctx.fillStyle = `rgba(${r},${g},${b},1)`;
          ctx.fillRect(x, y, barW, 2);
        }
      } else {
        // idle: gentle breathing
        for (let i = 0; i < BAR_COUNT; i++) {
          const x = i * (barW + GAP);
          const wave = Math.sin(Date.now() / 700 + i * 0.35) * 0.5 + 0.5;
          const barH = 2 + wave * 5;
          ctx.fillStyle = 'rgba(0,203,168,0.22)';
          ctx.fillRect(x, H - barH, barW, barH);
        }
      }
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, [analyserRef, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={68}
      style={{ width: '100%', height: '68px', display: 'block' }}
    />
  );
}

// ── Outcomes visual (4-stat grid — shown for intro / general questions) ───────
function OutcomesVisual({ visible }) {
  const stats = [
    { value: 'Day 0',  label: 'First CDI query fired',        color: '#00cba8' },
    { value: '24h',    label: 'DRG refresh cycle',            color: '#4d8aff' },
    { value: '100%',   label: 'Chart coverage at discharge',  color: '#ff7b4a' },
    { value: '40–60%', label: 'Revenue loss prevented at DC', color: '#a78bfa' },
  ];
  return (
    <div style={{ padding: '4px 24px 4px' }}>
      <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '2.5px', color: '#334155', marginBottom: '10px', fontFamily: 'Sora, sans-serif' }}>
        GUARANTEED OUTCOMES
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' }}>
        {stats.map(({ value, label, color }, i) => (
          <div key={label} style={{
            padding: '12px 14px', borderRadius: '12px',
            border: `1px solid ${color}30`, background: `${color}0d`,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 0.45s ${i * 0.1}s ease, transform 0.45s ${i * 0.1}s ease`,
          }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color, fontFamily: 'Sora, sans-serif', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '4px', lineHeight: '1.3' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Phase flow visual (3-phase animated diagram — shown during tour) ───────────
function PhaseFlowVisual({ activePhase, visible }) {
  const phases = [
    { label: 'H&P & Day 0 CDI',    sub: 'Revenue Clock Starts',      color: '#00cba8', steps: ['H&P Ingested in Minutes', 'ICD-10 Extracted', 'Baseline DRG Set', 'CDI Query Day 0'] },
    { label: 'Daily Rounding',      sub: '24-Hour DRG Refresh',       color: '#4d8aff', steps: ['DRG Recomputed on Signal', 'Lab-to-DX Mapping', 'LOS Paradox Alert', 'Revenue Delta Tracked'] },
    { label: 'Discharge & Coding',  sub: '40–60% Value Locked Here',  color: '#ff7b4a', steps: ['Full Chart Cross-Referenced', 'Omitted DX Surfaced', 'Final DRG Locked', 'Pre-Bill Brief Generated'] },
  ];
  return (
    <div style={{ padding: '4px 24px 4px', opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '2.5px', color: '#334155', marginBottom: '10px', fontFamily: 'Sora, sans-serif' }}>
        REVENUE CYCLE FLOW
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {phases.map((phase, i) => {
          const isActive = activePhase === i;
          return (
            <div key={i}>
              <div style={{
                borderRadius: '11px',
                border: `1px solid ${isActive ? phase.color + '55' : phase.color + '18'}`,
                background: isActive ? `${phase.color}10` : `${phase.color}04`,
                padding: '10px 13px',
                transition: 'all 0.45s ease',
                boxShadow: isActive ? `0 0 18px ${phase.color}22` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: isActive ? '8px' : 0 }}>
                  <div style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: phase.color,
                    boxShadow: isActive ? `0 0 9px ${phase.color}` : 'none',
                    transition: 'box-shadow 0.4s', flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: isActive ? phase.color : '#64748b', transition: 'color 0.4s', lineHeight: 1 }}>{phase.label}</div>
                    <div style={{ fontSize: '10px', color: '#334155', marginTop: '2px' }}>{phase.sub}</div>
                  </div>
                </div>
                {isActive && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {phase.steps.map((s, j) => (
                      <span key={j} style={{
                        fontSize: '9.5px', padding: '3px 8px', borderRadius: '20px',
                        background: `${phase.color}18`, border: `1px solid ${phase.color}30`,
                        color: phase.color, fontWeight: '500',
                        animation: `rudraFadeIn 0.3s ${j * 0.07}s both ease`,
                      }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
              {i < 2 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0' }}>
                  <svg width="10" height="8" viewBox="0 0 24 16" fill="none" stroke={phases[i].color + '35'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 2 12 12 18 2" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tool: Stats Grid ─────────────────────────────────────────────────────────
function StatsGrid({ data, progress = 0, playing = false }) {
  const stats = data?.stats || [];
  return (
    <div>
      {data?.title && (
        <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '2.5px', color: '#334155', marginBottom: '10px', fontFamily: 'Sora, sans-serif' }}>
          {data.title.toUpperCase()}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {stats.map(({ label, value, delta, color }, i) => {
          const state    = getItemState(i, stats.length, progress, playing);
          const isActive = state === 'active';
          const isPast   = state === 'past';
          const c        = color || '#00cba8';
          return (
            <div key={i} style={{
              padding: '11px 13px', borderRadius: '11px',
              border: `1px solid ${isActive ? c + '60' : c + '30'}`,
              background: isActive ? `${c}18` : `${c}0d`,
              boxShadow: isActive ? `0 0 14px ${c}40` : 'none',
              opacity: playing && state === 'future' ? 0.15 : isPast ? 0.6 : 1,
              transform: isActive ? 'scale(1.03)' : 'scale(1)',
              transition: 'all 0.35s ease',
              animation: !playing ? `rudraFadeIn 0.4s ${i * 0.09}s both ease` : 'none',
            }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: isActive ? c : isPast ? c + 'aa' : c + '55', fontFamily: 'Sora, sans-serif', letterSpacing: '-0.5px', lineHeight: 1, transition: 'color 0.3s ease' }}>{value}</div>
              <div style={{ fontSize: '10px', color: isActive ? '#94a3b8' : '#475569', marginTop: '3px', lineHeight: '1.3' }}>{label}</div>
              {delta && <div style={{ fontSize: '9.5px', color: '#4ade80', marginTop: '4px', fontWeight: '700' }}>{delta}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tool: Comparison Table ────────────────────────────────────────────────────
function ComparisonTable({ data, progress = 0, playing = false }) {
  const rows = data?.rows || [];
  return (
    <div>
      {data?.title && (
        <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '2.5px', color: '#334155', marginBottom: '10px', fontFamily: 'Sora, sans-serif' }}>
          {data.title.toUpperCase()}
        </div>
      )}
      <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', background: 'rgba(255,255,255,0.03)', padding: '7px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: '9px', color: '#475569', fontWeight: '700', letterSpacing: '1px' }}>METRIC</span>
          <span style={{ fontSize: '9px', color: '#f87171', fontWeight: '700', letterSpacing: '1px', textAlign: 'center' }}>BEFORE</span>
          <span style={{ fontSize: '9px', color: '#4ade80', fontWeight: '700', letterSpacing: '1px', textAlign: 'center' }}>AFTER</span>
        </div>
        {rows.map((row, i) => {
          const state    = getItemState(i, rows.length, progress, playing);
          const isActive = state === 'active';
          const isPast   = state === 'past';
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
              padding: '7px 12px',
              borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              background: isActive ? 'rgba(14,165,233,0.06)' : 'transparent',
              opacity: playing && state === 'future' ? 0.15 : isPast ? 0.6 : 1,
              transition: 'all 0.35s ease',
              animation: !playing ? `rudraFadeIn 0.35s ${i * 0.07}s both ease` : 'none',
            }}>
              <span style={{ fontSize: '11px', color: isActive ? '#e2e8f0' : '#94a3b8', lineHeight: '1.3' }}>{row.metric}</span>
              <span style={{ fontSize: '11px', color: '#f87171', textAlign: 'center', fontWeight: '600' }}>{row.before}</span>
              <span style={{ fontSize: '11px', color: '#4ade80', textAlign: 'center', fontWeight: '600' }}>{row.after}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tool: Phase Breakdown ─────────────────────────────────────────────────────
function PhaseBreakdown({ data, progress = 0, playing = false }) {
  const phaseColors = ['#00cba8', '#4d8aff', '#ff7b4a'];
  const color = phaseColors[data?.phase] || '#00cba8';
  const steps = data?.steps || [];
  const tags  = data?.tags  || [];
  return (
    <div>
      <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '2.5px', color: '#334155', marginBottom: '10px', fontFamily: 'Sora, sans-serif' }}>
        {(data?.phaseName || 'PHASE DETAIL').toUpperCase()}
      </div>
      <div style={{ borderRadius: '11px', border: `1px solid ${color}40`, background: `${color}08`, padding: '12px 14px' }}>
        {data?.problem && (
          <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px', lineHeight: '1.55', fontStyle: 'italic' }}>
            {data.problem}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: steps.length ? '10px' : 0 }}>
          {steps.map((step, i) => {
            const state    = getItemState(i, steps.length, progress, playing);
            const isActive = state === 'active';
            const isPast   = state === 'past';
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px',
                opacity: playing && state === 'future' ? 0.15 : isPast ? 0.6 : 1,
                transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                transition: 'all 0.35s ease',
                animation: !playing ? `rudraFadeIn 0.3s ${i * 0.07}s both ease` : 'none',
              }}>
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: isActive ? color : isPast ? color + '88' : color + '30',
                  marginTop: '5px', flexShrink: 0,
                  boxShadow: isActive ? `0 0 8px ${color}` : 'none',
                  transition: 'all 0.3s ease',
                }} />
                <span style={{ fontSize: '11.5px', color: isActive ? '#e2e8f0' : '#94a3b8', lineHeight: '1.45', transition: 'color 0.3s ease' }}>{step}</span>
              </div>
            );
          })}
        </div>
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px', marginBottom: data?.outcome ? '10px' : 0 }}>
            {tags.map((tag, i) => (
              <span key={i} style={{ fontSize: '9.5px', padding: '3px 8px', borderRadius: '20px', background: `${color}18`, border: `1px solid ${color}30`, color, fontWeight: '600' }}>{tag}</span>
            ))}
          </div>
        )}
        {data?.outcome && (
          <div style={{ padding: '8px 10px', borderRadius: '8px', background: `${color}14`, border: `1px solid ${color}28`, fontSize: '11px', color, fontWeight: '600', lineHeight: '1.45' }}>
            ✦ {data.outcome}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tool: Workflow (step-by-step process) ─────────────────────────────────────
function WorkflowArtifact({ data, progress = 0, playing = false }) {
  const steps = data?.steps || [];
  return (
    <div>
      {data?.title && (
        <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '2.5px', color: '#334155', marginBottom: '12px', fontFamily: 'Sora, sans-serif' }}>
          {data.title.toUpperCase()}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {steps.map((step, i) => {
          const state = getItemState(i, steps.length, progress, playing);
          const color = step.color || '#00cba8';
          const isActive = state === 'active';
          const isPast   = state === 'past';
          return (
            <div key={i} style={{
              display: 'flex', gap: '0',
              opacity: state === 'future' ? 0.2 : 1,
              transition: 'opacity 0.4s ease, transform 0.3s ease',
              transform: isActive ? 'translateX(3px)' : 'translateX(0)',
              animation: !playing ? `rudraFadeIn 0.35s ${i * 0.1}s both ease` : 'none',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0 }}>
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: isActive ? `${color}30` : isPast ? `${color}10` : `${color}08`,
                  border: `1.5px solid ${isActive ? color : color + '30'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: '800', color: isActive ? color : isPast ? color + 'aa' : color + '44',
                  fontFamily: 'Sora, sans-serif', flexShrink: 0,
                  boxShadow: isActive ? `0 0 10px ${color}60` : 'none',
                  transition: 'all 0.4s ease',
                }}>{step.num}</div>
                {i < steps.length - 1 && (
                  <div style={{ width: '1.5px', flex: 1, minHeight: '12px', background: isPast ? `${color}60` : `${color}20`, transition: 'background 0.4s ease' }} />
                )}
              </div>
              <div style={{ paddingLeft: '10px', paddingBottom: i < steps.length - 1 ? '14px' : 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: isActive ? color : isPast ? color + 'aa' : '#334155', lineHeight: 1, marginBottom: '3px', transition: 'color 0.3s ease' }}>{step.label}</div>
                <div style={{ fontSize: '11px', color: isActive ? '#94a3b8' : '#475569', lineHeight: '1.5', transition: 'color 0.3s ease' }}>{step.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tool: DRG Delta (before → after DRG with conditions) ──────────────────────
function DRGDeltaArtifact({ data, progress = 0, playing = false }) {
  const conditions = data?.conditions || [];
  // Sequence: baseline(0) → conditions(1..N) → optimized(N+1)
  const totalSlots = conditions.length + 2;
  const baseState  = getItemState(0, totalSlots, progress, playing);
  const optState   = getItemState(totalSlots - 1, totalSlots, progress, playing);

  return (
    <div>
      {data?.title && (
        <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '2.5px', color: '#334155', marginBottom: '12px', fontFamily: 'Sora, sans-serif' }}>
          {data.title.toUpperCase()}
        </div>
      )}
      {/* DRG before → after */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        {/* Baseline */}
        <div style={{
          flex: 1, padding: '10px 12px', borderRadius: '10px',
          background: baseState === 'active' ? 'rgba(248,113,113,0.12)' : 'rgba(248,113,113,0.06)',
          border: `1px solid ${baseState === 'active' ? 'rgba(248,113,113,0.5)' : 'rgba(248,113,113,0.2)'}`,
          boxShadow: baseState === 'active' ? '0 0 14px rgba(248,113,113,0.3)' : 'none',
          opacity: playing && baseState === 'future' ? 0.2 : 1,
          transition: 'all 0.4s ease',
        }}>
          <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(248,113,113,0.7)', letterSpacing: '1.5px', marginBottom: '4px' }}>BASELINE</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#f87171', fontFamily: 'Sora, sans-serif' }}>{data?.baseline?.drg}</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.3' }}>{data?.baseline?.label}</div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#cbd5e1', marginTop: '5px', fontFamily: 'Sora, sans-serif' }}>{data?.baseline?.value}</div>
        </div>
        <div style={{ fontSize: '18px', color: '#334155' }}>→</div>
        {/* Optimized */}
        <div style={{
          flex: 1, padding: '10px 12px', borderRadius: '10px',
          background: optState === 'active' ? 'rgba(0,203,168,0.14)' : 'rgba(0,203,168,0.08)',
          border: `${optState === 'active' ? '1.5px' : '1px'} solid ${optState === 'active' ? 'rgba(0,203,168,0.6)' : 'rgba(0,203,168,0.3)'}`,
          boxShadow: optState === 'active' ? '0 0 18px rgba(0,203,168,0.4)' : 'none',
          opacity: playing && optState === 'future' ? 0.2 : 1,
          transition: 'all 0.4s ease',
        }}>
          <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(0,203,168,0.8)', letterSpacing: '1.5px', marginBottom: '4px' }}>OPTIMIZED</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#00cba8', fontFamily: 'Sora, sans-serif' }}>{data?.optimized?.drg}</div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.3' }}>{data?.optimized?.label}</div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#4ade80', marginTop: '5px', fontFamily: 'Sora, sans-serif' }}>{data?.optimized?.value}</div>
        </div>
      </div>
      {/* Conditions */}
      {conditions.length > 0 && (
        <div>
          <div style={{ fontSize: '8.5px', fontWeight: '700', color: '#475569', letterSpacing: '1.5px', marginBottom: '6px' }}>CONDITIONS DOCUMENTED</div>
          {conditions.map((c, i) => {
            const cState = getItemState(i + 1, totalSlots, progress, playing);
            const isActive = cState === 'active';
            const isPast   = cState === 'past';
            return (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '6px 10px', borderRadius: '7px', marginBottom: '4px',
                background: isActive ? 'rgba(0,203,168,0.1)' : 'rgba(0,203,168,0.04)',
                border: `1px solid ${isActive ? 'rgba(0,203,168,0.35)' : 'rgba(0,203,168,0.12)'}`,
                boxShadow: isActive ? '0 0 10px rgba(0,203,168,0.2)' : 'none',
                opacity: playing && cState === 'future' ? 0.15 : isPast ? 0.6 : 1,
                transform: isActive ? 'translateX(3px)' : 'translateX(0)',
                transition: 'all 0.35s ease',
                animation: !playing ? `rudraFadeIn 0.3s ${i * 0.08}s both ease` : 'none',
              }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: isActive ? '#e2e8f0' : '#cbd5e1' }}>{c.name}</div>
                  <div style={{ fontSize: '9.5px', color: '#475569' }}>{c.source}</div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: isActive ? '#4ade80' : '#4ade8088', fontFamily: 'Sora, sans-serif', flexShrink: 0, marginLeft: '8px' }}>{c.delta}</div>
              </div>
            );
          })}
          {data?.totalDelta && (
            <div style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '9px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>Total DRG Uplift</span>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#4ade80', fontFamily: 'Sora, sans-serif' }}>{data.totalDelta}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Tool: Lifecycle (full H&P → discharge overview) ───────────────────────────
function LifecycleArtifact({ data, progress = 0, playing = false }) {
  const phases = data?.phases || [];
  return (
    <div>
      {data?.title && (
        <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '2.5px', color: '#334155', marginBottom: '12px', fontFamily: 'Sora, sans-serif' }}>
          {data.title.toUpperCase()}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {phases.map((phase, i) => {
          const state    = getItemState(i, phases.length, progress, playing);
          const isActive = state === 'active';
          const isPast   = state === 'past';
          return (
            <div key={i} style={{
              display: 'flex', gap: '0',
              opacity: state === 'future' && playing ? 0.15 : 1,
              transition: 'opacity 0.4s ease',
              animation: !playing ? `rudraFadeIn 0.4s ${i * 0.12}s both ease` : 'none',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30px', flexShrink: 0 }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: isActive ? phase.color : isPast ? phase.color + '88' : phase.color + '30',
                  boxShadow: isActive ? `0 0 12px ${phase.color}, 0 0 24px ${phase.color}60` : 'none',
                  flexShrink: 0,
                  transition: 'all 0.4s ease',
                }} />
                {i < phases.length - 1 && <div style={{ width: '1.5px', flex: 1, minHeight: '14px', background: isPast ? `${phase.color}60` : `${phase.color}25`, marginTop: '3px', transition: 'background 0.4s ease' }} />}
              </div>
              <div style={{ paddingLeft: '8px', paddingBottom: i < phases.length - 1 ? '10px' : 0, flex: 1 }}>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: isActive ? phase.color : isPast ? phase.color + 'aa' : '#334155', marginBottom: '5px', lineHeight: 1, transition: 'color 0.3s ease' }}>{phase.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {(phase.steps || []).map((step, j) => (
                    <span key={j} style={{
                      fontSize: '9px', padding: '2px 7px', borderRadius: '20px',
                      background: isActive ? `${phase.color}20` : `${phase.color}08`,
                      border: `1px solid ${isActive ? phase.color + '50' : phase.color + '18'}`,
                      color: isActive ? phase.color : phase.color + '55',
                      fontWeight: isActive ? '600' : '400',
                      transition: 'all 0.3s ease',
                    }}>{step}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tool router — renders the right component from AI tool call ────────────────
function ToolOutput({ tool, progress = 0, playing = false }) {
  if (!tool?.type) return null;
  const d = tool.data;
  if (!d) return null;
  const p = { progress, playing };
  if (tool.type === 'workflow')          return <WorkflowArtifact  data={d} {...p} />;
  if (tool.type === 'drg_delta')         return <DRGDeltaArtifact  data={d} {...p} />;
  if (tool.type === 'lifecycle')         return <LifecycleArtifact data={d} {...p} />;
  if (tool.type === 'stats_grid')        return <StatsGrid         data={d} {...p} />;
  if (tool.type === 'comparison_table')  return <ComparisonTable   data={d} {...p} />;
  if (tool.type === 'phase_breakdown')   return <PhaseBreakdown    data={d} {...p} />;
  return null;
}

// ── Audio-sync helper — determines how each artifact item should render ─────────
// i: item index, total: total items, progress: 0–1 audio progress, playing: bool
function getItemState(i, total, progress, playing) {
  if (!playing || progress <= 0) return 'idle';
  const start = i / total;
  const end   = (i + 1) / total;
  if (progress >= end)   return 'past';
  if (progress >= start) return 'active';
  return 'future';
}

// ── Role selection step ───────────────────────────────────────────────────────
function RoleStep({ onSelect }) {
  return (
    <div style={{ padding: '28px 24px 32px' }}>
      <h2 style={{ fontSize: '21px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
        Now — who are you?
      </h2>
      <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 24px' }}>
        I'll show you exactly what this means for your work.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {ROLES.map(role => (
          <button
            key={role.id}
            className="rudra-card"
            onClick={() => onSelect(role.id)}
            style={{
              padding: '18px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(14,165,233,0.12)',
              background: 'rgba(14,165,233,0.03)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              gridColumn: role.id === 'exploring' ? 'span 2' : undefined,
            }}
          >
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'rgba(14,165,233,0.09)',
              border: '1px solid rgba(14,165,233,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700', color: '#38bdf8',
              marginBottom: '10px', fontFamily: 'Sora, sans-serif',
            }}>
              {role.abbr}
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#e2e8f0', lineHeight: '1.35' }}>
              {role.label}
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>
              {role.sub}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Pain point selection step ─────────────────────────────────────────────────
function PainStep({ onSelect, onBack }) {
  return (
    <div style={{ padding: '28px 24px 32px' }}>
      <h2 style={{ fontSize: '21px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
        What's keeping you up?
      </h2>
      <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 24px' }}>
        Pick the problem that hits hardest.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {PAINS.map(pain => (
          <button
            key={pain.id}
            className="rudra-chip"
            onClick={() => onSelect(pain.id)}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: `1px solid ${pain.color}2e`,
              background: pain.bg,
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              gridColumn: pain.id === 'all' ? 'span 2' : undefined,
            }}
          >
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: pain.color,
              marginBottom: '8px',
              boxShadow: `0 0 8px ${pain.color}`,
            }} />
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>
              {pain.label}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={onBack}
        style={{
          marginTop: '20px', background: 'none', border: 'none',
          color: '#475569', fontSize: '13px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>
    </div>
  );
}

// ── Generating screen ─────────────────────────────────────────────────────────
function GeneratingStep() {
  return (
    <div style={{ padding: '52px 24px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '36px' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            inset: `${-(i + 1) * 16}px`,
            borderRadius: '50%',
            border: `1px solid rgba(14,165,233,${0.28 - i * 0.07})`,
            animation: `rudraPulse ${1.6 + i * 0.55}s ease-in-out ${i * 0.22}s infinite`,
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px',
          boxShadow: '0 0 50px rgba(14,165,233,0.55)',
        }}>ॐ</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: '600', color: '#e2e8f0', marginBottom: '10px' }}>
          Synthesizing your briefing
        </div>
        <div style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '8px', height: '8px', borderRadius: '50%', background: '#0ea5e9',
              animation: `rudraDot 1.4s ${i * 0.2}s ease-in-out infinite`,
            }} />
          ))}
        </div>
        <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '14px' }}>
          RUDRA is analyzing your revenue cycle context…
        </div>
      </div>
    </div>
  );
}

// ── Individual chat message (RUDRA or user) ───────────────────────────────────
function ChatMessage({ msg, isCurrentlyPlaying, words, wordIndex, analyserRef, progress }) {
  if (msg.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <div style={{
          maxWidth: '82%', padding: '10px 15px',
          borderRadius: '18px 18px 4px 18px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
          fontSize: '13.5px', color: '#fff', lineHeight: '1.6',
          wordBreak: 'break-word',
        }}>
          {msg.content}
        </div>
      </div>
    );
  }

  // RUDRA assistant message
  const displayWords = words || msg.content.split(' ');
  return (
    <div style={{ marginBottom: '22px' }}>
      {/* Speaker row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '9px' }}>
        <div style={{
          width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px',
          boxShadow: isCurrentlyPlaying ? '0 0 10px rgba(14,165,233,0.5)' : 'none',
          transition: 'box-shadow 0.4s',
        }}>ॐ</div>
        <span style={{ fontSize: '9.5px', fontWeight: '700', color: '#38bdf8', letterSpacing: '2px', fontFamily: 'Sora, sans-serif' }}>
          RUDRA
        </span>
        {isCurrentlyPlaying && (
          <span style={{ display: 'flex', gap: '3px', alignItems: 'center', marginLeft: '2px' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: '3px', height: '3px', borderRadius: '50%',
                background: '#38bdf8',
                animation: `rudraDot 1.2s ${i * 0.15}s ease-in-out infinite`,
              }} />
            ))}
          </span>
        )}
      </div>

      {/* Visual tool card — embedded inline per message */}
      {msg.visual && (
        <div style={{
          marginBottom: '8px', padding: '14px',
          borderRadius: '14px',
          border: `1px solid ${isCurrentlyPlaying ? 'rgba(14,165,233,0.25)' : 'rgba(14,165,233,0.1)'}`,
          background: 'rgba(0,0,0,0.28)',
          animation: 'rudraFadeIn 0.4s ease',
          boxShadow: isCurrentlyPlaying ? '0 0 20px rgba(14,165,233,0.08)' : 'none',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        }}>
          {isCurrentlyPlaying && (
            <div style={{ marginBottom: '10px' }}>
              <EQCanvas analyserRef={analyserRef} isPlaying={isCurrentlyPlaying} />
            </div>
          )}
          <ToolOutput tool={msg.visual} progress={progress} playing={isCurrentlyPlaying} />
        </div>
      )}

      {/* Message text — karaoke when currently playing */}
      <div style={{
        padding: '11px 15px',
        borderRadius: '4px 18px 18px 18px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.05)',
        fontSize: '13.5px', lineHeight: '1.75', color: '#94a3b8',
        wordBreak: 'break-word',
      }}>
        {isCurrentlyPlaying ? (
          displayWords.map((word, i) => (
            <span key={i} style={{
              color: i <= wordIndex ? '#e2e8f0' : '#475569',
              fontWeight: i === wordIndex ? '600' : '400',
              transition: 'color 0.1s ease',
              borderBottom: i === wordIndex ? '1px solid rgba(14,165,233,0.55)' : 'none',
            }}>{word}{' '}</span>
          ))
        ) : (
          msg.content
        )}
      </div>
    </div>
  );
}

// ── Audio player / chat interface ─────────────────────────────────────────────
function PlayingStep({
  words, wordIndex, isPlaying, muted, progress,
  analyserRef, briefingAudio,
  onPlay, onStop, onMute, onRestart, onReset,
  chatMessages, chatInput, chatLoading, onChatInput, onChatSend,
  onVoiceStart, voiceActive,
  isTour, tourStep,
  visual, visualPhase,
  toolOutput,
}) {
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Last assistant message index — receives karaoke highlighting
  const lastAssistantIdx = chatMessages.reduce((acc, m, i) => m.role === 'assistant' ? i : acc, -1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

      {/* ── Compact audio strip — visible whenever there's audio ── */}
      {briefingAudio && (
        <div style={{ padding: '10px 20px 0', flexShrink: 0 }}>
          <div style={{
            borderRadius: '12px',
            background: 'rgba(0,0,0,0.32)',
            border: '1px solid rgba(14,165,233,0.08)',
            padding: '7px 12px 5px',
          }}>
            <EQCanvas analyserRef={analyserRef} isPlaying={isPlaying} />
            {/* Progress + controls inline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
              <div style={{ flex: 1, height: '2px', borderRadius: '2px', background: 'rgba(14,165,233,0.1)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '2px', background: 'linear-gradient(90deg,#00cba8,#4d8aff)', width: `${progress * 100}%`, transition: 'width 0.1s linear' }} />
              </div>
              <span style={{ fontSize: '10px', color: '#334155', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {Math.round(progress * 100)}%
              </span>
              {/* Play/Pause */}
              <button onClick={isPlaying ? onStop : onPlay} style={{
                width: '28px', height: '28px', borderRadius: '50%', border: 'none', flexShrink: 0,
                background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isPlaying
                  ? <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                  : <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                }
              </button>
              {/* Restart */}
              <button onClick={onRestart} title="Replay" style={{
                width: '26px', height: '26px', borderRadius: '50%', border: '1px solid rgba(14,165,233,0.2)',
                background: 'rgba(14,165,233,0.06)', color: '#38bdf8', cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
              {/* Mute */}
              <button onClick={onMute} title={muted ? 'Unmute' : 'Mute'} style={{
                width: '26px', height: '26px', borderRadius: '50%',
                border: `1px solid ${muted ? 'rgba(239,68,68,0.3)' : 'rgba(14,165,233,0.2)'}`,
                background: muted ? 'rgba(239,68,68,0.08)' : 'rgba(14,165,233,0.06)',
                color: muted ? '#f87171' : '#38bdf8', cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {muted
                  ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                  : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tour phase indicator ── */}
      {isTour && tourStep && (
        <div style={{
          margin: '8px 20px 0', padding: '8px 14px', borderRadius: '10px', flexShrink: 0,
          background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ fontSize: '8.5px', fontWeight: '700', color: '#6366f1', letterSpacing: '2px', fontFamily: 'Sora, sans-serif', flexShrink: 0 }}>
            GUIDED TOUR
          </span>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {Array.from({ length: tourStep.total }).map((_, i) => (
              <div key={i} style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: i + 1 <= tourStep.current ? TOUR_PHASE_COLORS[i] : 'rgba(255,255,255,0.08)',
                boxShadow: i + 1 === tourStep.current ? `0 0 8px ${TOUR_PHASE_COLORS[i]}` : 'none',
                transition: 'all 0.4s ease',
              }} />
            ))}
          </div>
          <span style={{ fontSize: '10.5px', color: TOUR_PHASE_COLORS[tourStep.current - 1], fontWeight: '600' }}>
            {TOUR_PHASE_LABELS[tourStep.current - 1]}
          </span>
        </div>
      )}

      {/* ── Tour visual (phase flow — separate from chat messages) ── */}
      {isTour && toolOutput && (
        <div style={{ margin: '10px 20px 0', padding: '14px', borderRadius: '14px', flexShrink: 0, border: `1px solid ${isPlaying ? 'rgba(14,165,233,0.25)' : 'rgba(14,165,233,0.1)'}`, background: 'rgba(0,0,0,0.28)', transition: 'border-color 0.4s ease' }}>
          {isPlaying && (
            <div style={{ marginBottom: '10px' }}>
              <EQCanvas analyserRef={analyserRef} isPlaying={isPlaying} />
            </div>
          )}
          <ToolOutput tool={toolOutput} progress={progress} playing={isPlaying} />
        </div>
      )}

      {/* ── Chat message list ── */}
      <div
        className="rudra-scroll"
        style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 8px', minHeight: 0 }}
      >
        {chatMessages.map((msg, i) => (
          <ChatMessage
            key={i}
            msg={msg}
            isCurrentlyPlaying={isPlaying && i === lastAssistantIdx}
            words={i === lastAssistantIdx ? words : undefined}
            wordIndex={wordIndex}
            analyserRef={analyserRef}
            progress={isPlaying && i === lastAssistantIdx ? progress : 0}
          />
        ))}

        {chatLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px',
            }}>ॐ</div>
            <div style={{ display: 'flex', gap: '5px', padding: '8px 12px', borderRadius: '4px 14px 14px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0ea5e9', animation: `rudraDot 1.4s ${i * 0.2}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ── Write-back input — prominent ── */}
      <div style={{ padding: '10px 20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <textarea
            className="rudra-input"
            value={chatInput}
            onChange={e => onChatInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onChatSend(); } }}
            placeholder={voiceActive ? 'Listening… speak now' : 'Ask about DRG phases, CDI workflow, or pilot structure…'}
            rows={2}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: voiceActive ? 'rgba(0,203,168,0.04)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${voiceActive ? 'rgba(0,203,168,0.4)' : 'rgba(14,165,233,0.18)'}`,
              borderRadius: '14px', padding: '11px 90px 11px 15px',
              color: '#e2e8f0', fontSize: '13.5px', lineHeight: '1.55',
              resize: 'none', fontFamily: 'Inter, sans-serif',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          />
          {/* Mic button */}
          <button
            onClick={onVoiceStart}
            title={voiceActive ? 'Stop listening' : 'Speak to RUDRA'}
            style={{
              position: 'absolute', right: '50px', bottom: '10px',
              width: '34px', height: '34px', borderRadius: '10px', border: 'none',
              background: voiceActive
                ? 'rgba(0,203,168,0.18)'
                : 'rgba(14,165,233,0.08)',
              color: voiceActive ? '#00cba8' : '#38bdf8',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              animation: voiceActive ? 'rudraPulse 1.2s ease-in-out infinite' : 'none',
            }}
          >
            {voiceActive
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="9" width="4" height="12" rx="1"/><rect x="10" y="5" width="4" height="16" rx="1"/><rect x="16" y="7" width="4" height="14" rx="1"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            }
          </button>
          {/* Send button */}
          <button
            onClick={onChatSend}
            disabled={!chatInput.trim() || chatLoading}
            style={{
              position: 'absolute', right: '10px', bottom: '10px',
              width: '34px', height: '34px', borderRadius: '10px', border: 'none',
              background: chatInput.trim() && !chatLoading
                ? 'linear-gradient(135deg,#0ea5e9,#6366f1)'
                : 'rgba(14,165,233,0.08)',
              color: '#fff', cursor: chatInput.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '9px' }}>
          <button onClick={onReset} style={{
            background: 'none', border: 'none', color: '#334155', fontSize: '12px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: 0,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            New briefing
          </button>
          <span style={{ fontSize: '10px', color: '#1e3a5f' }}>
            <span style={{ background: 'linear-gradient(90deg,#4285F4,#EA4335,#FBBC04,#34A853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: '600' }}>Gemini</span>
            {' · Docstribe AI © 2026'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ExplainerAgent() {
  const [step, setStep] = useState('idle');        // idle | role | pain | generating | playing
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPain, setSelectedPain] = useState(null);
  const [briefingText, setBriefingText] = useState('');
  const [briefingAudio, setBriefingAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(-1);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [isTour, setIsTour] = useState(false);
  const [tourStep, setTourStep] = useState(null); // { current: 1, total: 3 }
  const [visual, setVisual] = useState(null);       // null | 'outcomes' | 'phase-flow' | 'phase-0' | 'phase-1' | 'phase-2'
  const [visualPhase, setVisualPhase] = useState(null); // null | 0 | 1 | 2 (for tour)
  const [toolOutput, setToolOutput] = useState(null); // AI-chosen visual tool: { type, data }
  const onAudioEndRef = useRef(null); // called when current audio playback finishes
  const [voiceActive, setVoiceActive] = useState(false);
  const recognitionRef = useRef(null);

  // Refs for audio engine
  const audioCtxRef     = useRef(null);
  const sourceRef       = useRef(null);
  const analyserRef     = useRef(null);
  const rafRef          = useRef(null);
  const startTimeRef    = useRef(null);
  const durationRef     = useRef(0);
  const briefingTextRef = useRef('');   // for RAF closure (avoids stale state)
  const mutedRef        = useRef(false);
  const tourCancelRef   = useRef(false);

  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => { briefingTextRef.current = briefingText; }, [briefingText]);

  // ── AudioContext ─────────────────────────────────────────────────────────
  const ensureCtx = useCallback(async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  // ── Stop audio ───────────────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    tourCancelRef.current = true; // cancel any running tour
    if (sourceRef.current) { try { sourceRef.current.stop(); } catch {} sourceRef.current = null; }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    setIsPlaying(false);
    setProgress(0);
    setWordIndex(-1);
    emitPhase(null); // clear Shakti highlight
  }, []);

  // ── Voice input (Web Speech API) ─────────────────────────────────────────
  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; setVoiceActive(false); return; }
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onstart = () => setVoiceActive(true);
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      setChatInput(transcript);
    };
    rec.onerror = () => { setVoiceActive(false); recognitionRef.current = null; };
    rec.onend = () => { setVoiceActive(false); recognitionRef.current = null; };
    recognitionRef.current = rec;
    rec.start();
  }, []);

  // ── Run guided visual tour (3 phases, sequential audio + Shakti highlight) ──
  const runTour = useCallback(async (segments, roleLabel) => {
    tourCancelRef.current = false;
    setIsTour(true);
    setStep('playing');
    setVisual('phase-flow');
    setChatMessages([]);

    for (let i = 0; i < segments.length; i++) {
      if (tourCancelRef.current) break;
      const seg = segments[i];
      setTourStep({ current: i + 1, total: segments.length });
      setVisualPhase(seg.phase);         // highlight phase INSIDE the panel
      briefingTextRef.current = seg.text;
      setBriefingText(seg.text);
      setBriefingAudio(seg.audio);
      emitPhase(seg.phase); // also sync Shakti page section (if visible)

      await new Promise(async (resolve) => {
        if (!seg.audio || mutedRef.current) {
          setTimeout(resolve, 3500);
          return;
        }
        try {
          const ctx = await ensureCtx();
          if (sourceRef.current) { try { sourceRef.current.stop(); } catch {} sourceRef.current = null; }
          if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }

          const bytes = atob(seg.audio);
          const buf = new ArrayBuffer(bytes.length);
          const view = new Uint8Array(buf);
          for (let j = 0; j < bytes.length; j++) view[j] = bytes.charCodeAt(j);
          const audioBuffer = await ctx.decodeAudioData(buf);
          durationRef.current = audioBuffer.duration;

          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;

          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(analyser);
          analyser.connect(ctx.destination);
          sourceRef.current = source;
          startTimeRef.current = ctx.currentTime;

          setIsPlaying(true);
          setProgress(0);
          setWordIndex(0);

          const track = () => {
            if (!audioCtxRef.current || !startTimeRef.current) return;
            const elapsed = audioCtxRef.current.currentTime - startTimeRef.current;
            const p = Math.min(elapsed / durationRef.current, 1);
            setProgress(p);
            const wds = briefingTextRef.current.split(' ');
            setWordIndex(Math.floor(p * wds.length));
            if (p < 1) rafRef.current = requestAnimationFrame(track);
          };

          source.onended = () => {
            setIsPlaying(false);
            setProgress(1);
            cancelAnimationFrame(rafRef.current);
            setTimeout(resolve, 600); // pause between phases
          };
          source.start();
          rafRef.current = requestAnimationFrame(track);
        } catch (err) {
          console.warn('Tour segment error:', err);
          resolve();
        }
      });
    }

    emitPhase(null);
    setIsTour(false);
    setTourStep(null);
    setVisualPhase(null);
  }, [ensureCtx]);

  // ── Play WAV base64 ──────────────────────────────────────────────────────
  const playAudio = useCallback(async (wavBase64) => {
    if (!wavBase64 || mutedRef.current) return;
    try {
      const ctx = await ensureCtx();
      stopAudio();

      const bytes = atob(wavBase64);
      const buf = new ArrayBuffer(bytes.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i++) view[i] = bytes.charCodeAt(i);
      const audioBuffer = await ctx.decodeAudioData(buf);
      durationRef.current = audioBuffer.duration;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      sourceRef.current = source;
      startTimeRef.current = ctx.currentTime;

      setIsPlaying(true);
      setProgress(0);
      setWordIndex(0);

      let lastPhase = undefined;
      const track = () => {
        if (!audioCtxRef.current || !startTimeRef.current) return;
        const elapsed = audioCtxRef.current.currentTime - startTimeRef.current;
        const p = Math.min(elapsed / durationRef.current, 1);
        setProgress(p);
        const wds = briefingTextRef.current.split(' ');
        const wi = Math.floor(p * wds.length);
        setWordIndex(wi);
        // Drive Shakti diagram highlight
        const phase = detectPhase(wds, wi);
        if (phase !== lastPhase) { lastPhase = phase; emitPhase(phase); }
        if (p < 1) rafRef.current = requestAnimationFrame(track);
      };

      source.onended = () => {
        setIsPlaying(false);
        setProgress(1);
        cancelAnimationFrame(rafRef.current);
        emitPhase(null); // clear Shakti highlight
        if (onAudioEndRef.current) { onAudioEndRef.current(); onAudioEndRef.current = null; }
      };
      source.start();
      rafRef.current = requestAnimationFrame(track);
    } catch (err) {
      console.warn('Playback error:', err);
      setIsPlaying(false);
    }
  }, [ensureCtx, stopAudio]);

  // ── Fetch personalized briefing ──────────────────────────────────────────
  const fetchBriefing = useCallback(async (roleId, painId) => {
    setStep('generating');
    const role      = ROLES.find(r => r.id === roleId)?.label  || roleId;
    const painPoint = PAINS.find(p => p.id === painId)?.label  || painId;

    // "Walk Me Through Everything" → full DRG lifecycle guided visual tour
    if (painId === 'all') {
      try {
        const res = await fetch('/api/tour', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { segments } = await res.json();
        await ensureCtx();
        runTour(segments, role);
      } catch (err) {
        console.error('Tour failed:', err);
        setStep('pain');
      }
      return;
    }

    // Map pain → visual type
    const painVisualMap = {
      drg:       'phase-0',
      cdi:       'phase-0',
      los:       'phase-1',
      discharge: 'phase-2',
      charge:    'phase-1',
      exploring: 'outcomes',
    };
    const painVisual = painVisualMap[painId] || 'outcomes';
    setVisual(painVisual);

    try {
      const res = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, painPoint }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { text, audio, visual: toolVis } = await res.json();
      briefingTextRef.current = text;
      setBriefingText(text);
      setBriefingAudio(audio);
      if (toolVis) setToolOutput(toolVis);
      // Briefing becomes first chat message — visual embedded inline
      setChatMessages([{ role: 'assistant', content: text, audio, visual: toolVis || null }]);
      setStep('playing');
      setTimeout(() => playAudio(audio), 80);
    } catch (err) {
      console.error('Briefing fetch failed:', err);
      setStep('pain');
    }
  }, [playAudio, runTour, ensureCtx]);

  // ── Fetch powerful intro (plays immediately on widget open) ───────────────
  const fetchIntro = useCallback(async () => {
    setStep('intro');
    try {
      const res = await fetch('/api/intro', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { text, audio, artifact } = await res.json();
      briefingTextRef.current = text;
      setBriefingText(text);
      setBriefingAudio(audio);
      if (artifact) setToolOutput(artifact);
      setChatMessages([{ role: 'assistant', content: text, audio, visual: artifact || null }]);
      // After intro audio ends → show who-are-you
      onAudioEndRef.current = () => setStep('who-are-you');
      await ensureCtx();
      setTimeout(() => playAudio(audio), 80);
    } catch (err) {
      console.error('Intro fetch failed:', err);
      setStep('who-are-you');
    }
  }, [playAudio, ensureCtx]);

  // ── Fetch role-specific greeting after user identifies themselves ──────────
  const fetchRoleGreeting = useCallback(async (roleId) => {
    setSelectedRole(roleId);
    setStep('generating');

    const greetText = `Welcome! I am Rudra, and I can answer most of your questions about Dynamic DRG Intelligence. How may I help you today?`;

    try {
      // Generate TTS for the static greeting in parallel with no artifact needed
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: greetText }),
      });
      const { audio } = res.ok ? await res.json() : { audio: null };
      briefingTextRef.current = greetText;
      setBriefingText(greetText);
      setBriefingAudio(audio);
      setChatMessages(prev => [...prev, { role: 'assistant', content: greetText, audio, visual: null }]);
      setStep('playing');
      if (audio) setTimeout(() => playAudio(audio), 80);
    } catch (err) {
      console.error('Role greeting TTS failed:', err);
      briefingTextRef.current = greetText;
      setBriefingText(greetText);
      setChatMessages(prev => [...prev, { role: 'assistant', content: greetText, audio: null, visual: null }]);
      setStep('playing');
    }
  }, [playAudio]);

  // ── Follow-up chat ───────────────────────────────────────────────────────
  const sendFollowUp = useCallback(async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading) return;
    // Stop any playing audio immediately — user is taking over
    stopAudio();
    onAudioEndRef.current = null;
    setChatInput('');

    // Detect tour intent — trigger visual guided tour instead of text response
    if (TOUR_RE.test(trimmed)) {
      setChatLoading(true);
      const role = ROLES.find(r => r.id === selectedRole)?.label || 'healthcare professional';
      try {
        const res = await fetch('/api/tour', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        });
        const { segments } = await res.json();
        setChatLoading(false);
        await ensureCtx();
        runTour(segments, role);
      } catch (err) {
        console.error('Tour failed:', err);
        setChatLoading(false);
      }
      return;
    }

    setChatLoading(true);
    setChatMessages(prev => [...prev, { role: 'user', content: trimmed }]);

    const history = chatMessages.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history,
          pageContext: `Visitor role: ${selectedRole}, focus: ${selectedPain}`,
        }),
      });
      const { text, audio, visual: toolVis } = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: text, audio, visual: toolVis || null }]);
      setChatLoading(false);
      if (toolVis) setToolOutput(toolVis);
      if (audio && !mutedRef.current) {
        briefingTextRef.current = text;
        setBriefingText(text);
        stopAudio();
        setTimeout(() => playAudio(audio), 80);
      }
    } catch {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: "Let me connect you with our team directly — email akash@docstribe.com",
      }]);
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, chatMessages, selectedRole, selectedPain, stopAudio, playAudio]);

  // ── Reset wizard ─────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    tourCancelRef.current = true;
    stopAudio();
    setStep('idle');
    onAudioEndRef.current = null;
    setSelectedRole(null);
    setSelectedPain(null);
    setBriefingText('');
    briefingTextRef.current = '';
    setBriefingAudio(null);
    setChatMessages([]);
    setChatInput('');
    setProgress(0);
    setWordIndex(-1);
    setIsTour(false);
    setTourStep(null);
    setVisual(null);
    setVisualPhase(null);
    setToolOutput(null);
    emitPhase(null);
  }, [stopAudio]);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const words = briefingText.split(' ');
  const open  = step !== 'idle';

  return (
    <>
      <style>{`
        @keyframes fabPulse {
          0%, 100% { box-shadow: 0 4px 28px rgba(14,165,233,0.5), 0 0 0 0 rgba(14,165,233,0.35); }
          50%       { box-shadow: 0 4px 28px rgba(14,165,233,0.5), 0 0 0 12px rgba(14,165,233,0); }
        }
        @keyframes rudraPulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50%       { opacity: 0.3;  transform: scale(1.06); }
        }
        @keyframes rudraDot {
          0%, 80%, 100% { transform: scale(0.55); opacity: 0.35; }
          40%           { transform: scale(1);    opacity: 1;    }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: scale(0.93) translateY(14px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes rudraFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }
        .rudra-card  { transform: translateY(0); }
        .rudra-card:hover  { border-color: rgba(14,165,233,0.45) !important; background: rgba(14,165,233,0.07) !important; transform: translateY(-2px) !important; }
        .rudra-chip  { transform: translateY(0); }
        .rudra-chip:hover  { transform: translateY(-2px) !important; filter: brightness(1.15); }
        .rudra-input:focus { border-color: rgba(14,165,233,0.45) !important; outline: none; box-shadow: 0 0 0 3px rgba(14,165,233,0.07); }
        .rudra-scroll::-webkit-scrollbar       { width: 3px; }
        .rudra-scroll::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.18); border-radius: 3px; }
      `}</style>

      {/* ── FAB ── */}
      {!open && (
        <button
          onClick={() => { ensureCtx(); fetchIntro(); }}
          style={{
            position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999,
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '0 22px 0 9px', height: '56px',
            borderRadius: '100px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
            border: 'none', cursor: 'pointer',
            animation: 'fabPulse 3s ease-in-out infinite',
          }}
        >
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', color: '#fff',
          }}>ॐ</div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' }}>
            Ask RUDRA
          </span>
        </button>
      )}

      {/* ── Overlay ── */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(2,5,12,0.78)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            animation: 'overlayIn 0.22s ease',
          }}
          onClick={e => { if (e.target === e.currentTarget) reset(); }}
        >
          {/* Panel */}
          <div
            style={{
              width: '100%', maxWidth: '560px',
              height: 'calc(100vh - 48px)',
              maxHeight: '760px',
              borderRadius: '24px',
              background: 'rgba(6,10,18,0.98)',
              border: '1px solid rgba(14,165,233,0.16)',
              boxShadow: '0 48px 130px rgba(0,0,0,0.88), 0 0 0 1px rgba(14,165,233,0.03), 0 0 80px rgba(14,165,233,0.04)',
              backdropFilter: 'blur(24px)',
              display: 'flex', flexDirection: 'column',
              animation: 'panelIn 0.3s cubic-bezier(0.34,1.4,0.64,1)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px 16px',
              borderBottom: '1px solid rgba(14,165,233,0.07)',
              display: 'flex', alignItems: 'center', gap: '14px',
              flexShrink: 0,
            }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', flexShrink: 0,
                boxShadow: '0 0 22px rgba(14,165,233,0.38)',
              }}>ॐ</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px', fontWeight: '800', color: '#f0f9ff',
                  letterSpacing: '3.5px', fontFamily: 'Sora, sans-serif',
                }}>RUDRA</div>
                <div style={{ fontSize: '11px', color: '#1e3a5f', marginTop: '3px' }}>
                  Dynamic DRG Intelligence · Powered by Gemini
                </div>
              </div>
              <button
                onClick={reset}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                  background: 'rgba(255,255,255,0.04)',
                  borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.06)',
                  color: '#475569', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Step content — fills remaining panel height */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: step === 'playing' ? 'hidden' : 'auto' }}>
            {step === 'intro' && (
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '16px 20px', gap: '12px' }}>

                {/* ── Outcome cards — highlight in sequence with audio ── */}
                {(() => {
                  // 3 paragraphs map to 3 progress bands
                  // Para 1 (gap)    0.00 – 0.38
                  // Para 2 (fix)    0.38 – 0.68
                  // Para 3 (result) 0.68 – 1.00
                  const band = progress < 0.38 ? 0 : progress < 0.68 ? 1 : 2;
                  const spoken = progress > 0.01; // audio has started

                  const CARDS = [
                    {
                      icon: '⚠️',
                      stat: '$8–14M',
                      label: 'Revenue lost per hospital / year',
                      sub: 'Physician ↔ grouper language gap',
                      color: '#f87171',
                      glow: 'rgba(248,113,113,0.35)',
                      border: 'rgba(248,113,113,0.5)',
                    },
                    {
                      icon: '⚡',
                      stat: 'Day 0 → 24h → DC',
                      label: 'Three-point DRG intervention',
                      sub: 'H&P · Rounding · Discharge lock',
                      color: '#38bdf8',
                      glow: 'rgba(56,189,248,0.35)',
                      border: 'rgba(56,189,248,0.5)',
                    },
                    {
                      icon: '✅',
                      stat: '99% · +0.05 · +10%',
                      label: 'Clean claim · CMI uplift · Charges',
                      sub: 'Guaranteed by outcomes',
                      color: '#4ade80',
                      glow: 'rgba(74,222,128,0.35)',
                      border: 'rgba(74,222,128,0.5)',
                    },
                  ];

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      {CARDS.map((c, i) => {
                        const isActive = spoken && band === i;
                        const isPast   = spoken && band > i;
                        return (
                          <div key={i} style={{
                            borderRadius: '12px',
                            border: `1px solid ${isActive ? c.border : isPast ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                            background: isActive
                              ? `radial-gradient(ellipse at left, ${c.glow} 0%, rgba(0,0,0,0.5) 70%)`
                              : isPast ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.2)',
                            padding: '10px 14px',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            transition: 'all 0.4s ease',
                            transform: isActive ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: isActive ? `0 0 18px ${c.glow}` : 'none',
                            opacity: !spoken ? 0.35 : isPast ? 0.5 : 1,
                          }}>
                            <div style={{ fontSize: '20px', flexShrink: 0 }}>{c.icon}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: '15px', fontWeight: 700, letterSpacing: '-0.3px',
                                color: isActive ? c.color : isPast ? '#64748b' : '#334155',
                                transition: 'color 0.3s ease',
                                fontFamily: 'monospace',
                              }}>{c.stat}</div>
                              <div style={{ fontSize: '11px', color: isActive ? '#cbd5e1' : '#475569', marginTop: '1px' }}>{c.label}</div>
                              <div style={{ fontSize: '10px', color: isActive ? '#64748b' : '#1e293b', marginTop: '1px' }}>{c.sub}</div>
                            </div>
                            {isActive && (
                              <div style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: c.color,
                                boxShadow: `0 0 8px ${c.color}`,
                                animation: 'pulse 1s infinite',
                                flexShrink: 0,
                              }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* ── EQ visualizer ── */}
                <div style={{ flexShrink: 0 }}>
                  <EQCanvas analyserRef={analyserRef} isPlaying={isPlaying} />
                </div>

                {/* ── Skip ── */}
                <button onClick={() => { stopAudio(); onAudioEndRef.current = null; setStep('who-are-you'); }} style={{
                  alignSelf: 'flex-end', flexShrink: 0,
                  background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)',
                  color: '#38bdf8', fontSize: '12px', padding: '7px 16px', borderRadius: '8px',
                  cursor: 'pointer',
                }}>
                  Skip intro →
                </button>
              </div>
            )}
            {step === 'who-are-you' && (
              <RoleStep onSelect={id => fetchRoleGreeting(id)} />
            )}
            {step === 'generating' && <GeneratingStep />}
            {step === 'playing' && (
              <PlayingStep
                briefingText={briefingText}
                words={words}
                wordIndex={wordIndex}
                isPlaying={isPlaying}
                muted={muted}
                progress={progress}
                analyserRef={analyserRef}
                briefingAudio={briefingAudio}
                onPlay={() => playAudio(briefingAudio)}
                onStop={stopAudio}
                onMute={() => { setMuted(m => !m); if (isPlaying) stopAudio(); }}
                onRestart={() => { stopAudio(); setTimeout(() => playAudio(briefingAudio), 80); }}
                onReset={reset}
                chatMessages={chatMessages}
                chatInput={chatInput}
                chatLoading={chatLoading}
                onChatInput={setChatInput}
                onChatSend={sendFollowUp}
                onVoiceStart={startVoice}
                voiceActive={voiceActive}
                isTour={isTour}
                tourStep={tourStep}
                visual={visual}
                visualPhase={visualPhase}
                toolOutput={toolOutput}
              />
            )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
