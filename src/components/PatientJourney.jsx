import { useState } from 'react';

const phases = [
  {
    number: '01',
    phase: 'Auth / UM',
    title: 'Authorization & Utilization Management',
    subtitle: 'Before Admission',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(14,165,233,0.05))',
    border: 'rgba(14,165,233,0.3)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    tower: 'UM Control Tower',
    features: ['Prior Authorization', 'Concurrent Review', 'Medical Necessity', 'Denied Days Reduction'],
    stat: { val: '2x', label: 'UM Approval Speed' },
  },
  {
    number: '02',
    phase: 'Care',
    title: 'Clinical Documentation & CDI',
    subtitle: 'During Encounter',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))',
    border: 'rgba(168,85,247,0.3)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
    tower: 'CDI & Med Necessity Co-Pilot',
    features: ['AI-Assisted Documentation', 'Charge Capture', 'OBS/IP Optimization', 'DRG Accuracy'],
    stat: { val: '20%', label: 'DRG Upgrade Rate' },
  },
  {
    number: '03',
    phase: 'Claim',
    title: 'Claims Submission & Denial Defense',
    subtitle: 'Post Encounter',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))',
    border: 'rgba(249,115,22,0.3)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
    tower: 'Denials & Underpayment Control Tower',
    features: ['Clean Claim Submission', 'Automated Appeal Generation', 'Root Cause Analysis', 'Underpayment Detection'],
    stat: { val: '98%', label: 'Clean Claim Rate' },
  },
  {
    number: '04',
    phase: 'Cash',
    title: 'Revenue Recovery & Contract Yield',
    subtitle: 'Post Payment',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
    border: 'rgba(16,185,129,0.3)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    tower: 'Contract Yield Engine',
    features: ['Payment vs Contract Audit', 'Variance Detection', 'Dispute Resolution', 'Rate Grid Compliance'],
    stat: { val: '25%', label: 'Revenue Recovered' },
  },
];

export default function PatientJourney() {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <section id="journey" style={{ padding: '100px 24px', background: '#06080f', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(14,165,233,0.04) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '100px',
            border: '1px solid rgba(14,165,233,0.2)',
            background: 'rgba(14,165,233,0.05)',
            fontSize: '12px', fontWeight: '600', color: '#38bdf8',
            letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#0ea5e9', display: 'inline-block' }} />
            Patient Revenue Journey
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: '800', letterSpacing: '-1.5px',
            color: '#f0f9ff', lineHeight: '1.1',
            fontFamily: '"Inter Display", Inter, sans-serif',
            marginBottom: '16px',
          }}>
            From Authorization to Cash —<br />
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Every Dollar Accounted For</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: '1.6' }}>
            A single connected data model intercepts revenue leakage at every stage of the clinical and billing workflow.
          </p>
        </div>

        {/* Journey Flow - Top connector line */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          {/* Horizontal flow line */}
          <div style={{
            position: 'absolute', top: '60px', left: '12.5%', right: '12.5%',
            height: '2px',
            background: 'linear-gradient(90deg, #0ea5e9, #a855f7, #f97316, #10b981)',
            opacity: 0.3,
            zIndex: 0,
          }} />

          {/* Phase cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}>
            {phases.map((p, i) => (
              <button key={p.phase}
                onClick={() => setActivePhase(i)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                  padding: '0',
                  position: 'relative', zIndex: 1,
                }}
              >
                {/* Phase circle */}
                <div style={{
                  width: '88px', height: '88px', borderRadius: '50%',
                  border: `2px solid ${activePhase === i ? p.color : 'rgba(255,255,255,0.06)'}`,
                  background: activePhase === i ? p.gradient : 'rgba(13,21,37,0.8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: activePhase === i ? p.color : '#475569',
                  transition: 'all 0.3s',
                  boxShadow: activePhase === i ? `0 0 30px ${p.color}30` : 'none',
                  flexShrink: 0,
                }}>
                  {p.icon}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px',
                    color: activePhase === i ? p.color : '#475569',
                    textTransform: 'uppercase', marginBottom: '4px',
                    transition: 'color 0.3s',
                  }}>{p.phase}</div>
                  <div style={{
                    fontSize: '13px', fontWeight: '500',
                    color: activePhase === i ? '#e2e8f0' : '#475569',
                    transition: 'color 0.3s',
                  }}>{p.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Phase Detail Card */}
        <div style={{
          marginTop: '32px',
          background: phases[activePhase].gradient,
          border: `1px solid ${phases[activePhase].border}`,
          borderRadius: '20px',
          padding: '40px',
          transition: 'all 0.4s ease',
          boxShadow: `0 0 60px ${phases[activePhase].color}15`,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '40px',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '5px 12px', borderRadius: '100px',
              border: `1px solid ${phases[activePhase].color}40`,
              background: `${phases[activePhase].color}10`,
              fontSize: '12px', fontWeight: '600', color: phases[activePhase].color,
              marginBottom: '16px', letterSpacing: '0.5px',
            }}>
              Phase {phases[activePhase].number} · {phases[activePhase].tower}
            </div>

            <h3 style={{
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: '700', color: '#f0f9ff',
              letterSpacing: '-0.5px', lineHeight: '1.2',
              marginBottom: '24px',
              fontFamily: '"Inter Display", Inter, sans-serif',
            }}>{phases[activePhase].title}</h3>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {phases[activePhase].features.map(f => (
                <div key={f} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', borderRadius: '8px',
                  background: 'rgba(13,21,37,0.6)',
                  border: `1px solid ${phases[activePhase].color}20`,
                  fontSize: '13px', fontWeight: '500', color: '#94a3b8',
                }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: phases[activePhase].color, flexShrink: 0,
                  }} />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Stat callout */}
          <div style={{
            textAlign: 'center', padding: '32px 40px',
            background: 'rgba(13,21,37,0.6)',
            borderRadius: '16px',
            border: `1px solid ${phases[activePhase].color}25`,
            minWidth: '160px',
          }}>
            <div style={{
              fontSize: '56px', fontWeight: '800',
              color: phases[activePhase].color,
              lineHeight: '1',
              textShadow: `0 0 30px ${phases[activePhase].color}60`,
              fontFamily: '"Inter Display", Inter, sans-serif',
              letterSpacing: '-2px',
            }}>
              {phases[activePhase].stat.val}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', fontWeight: '500' }}>
              {phases[activePhase].stat.label}
            </div>
          </div>
        </div>

        {/* Phase navigation dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {phases.map((p, i) => (
            <button key={i} onClick={() => setActivePhase(i)} style={{
              width: activePhase === i ? '28px' : '8px',
              height: '8px', borderRadius: '4px',
              background: activePhase === i ? p.color : '#1e3a5f',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {/* Bottom label */}
        <div style={{
          textAlign: 'center', marginTop: '48px',
          padding: '20px',
          background: 'rgba(13,21,37,0.5)',
          border: '1px solid rgba(14,165,233,0.08)',
          borderRadius: '12px',
          fontSize: '15px', color: '#64748b', fontStyle: 'italic',
        }}>
          <span style={{ color: '#38bdf8', fontStyle: 'normal', fontWeight: '600' }}>One data model.</span>{' '}
          End-to-end RCM automation. From authorization to cash.
        </div>
      </div>
    </section>
  );
}
