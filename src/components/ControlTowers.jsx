import { useState } from 'react';

const towers = [
  {
    num: '01',
    name: 'UM Control Tower',
    tagline: 'Prevent denials before admission',
    color: '#0ea5e9',
    glow: 'rgba(14,165,233,0.2)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    description: 'Manages the full case management workflow — concurrent review, denied days reduction, and UM approval turnaround time.',
    capabilities: [
      'Concurrent & retrospective review',
      'Denied days management',
      'UM approval turnaround',
      'Real-time authorization tracking',
      'Medical necessity validation',
    ],
    metric: { val: '2x', desc: 'UM Approval Speed' },
  },
  {
    num: '02',
    name: 'CDI & Med Necessity Co-Pilot',
    tagline: 'AI alongside every physician',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.2)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    description: 'An AI-powered clinical documentation integrity engine that works alongside physicians during the encounter, flagging gaps and ensuring charge capture.',
    capabilities: [
      'Real-time documentation gaps',
      'Medical necessity justification',
      'OBS/IP status optimization',
      'DRG downgrade prevention',
      'Complete charge capture',
    ],
    metric: { val: '20%', desc: 'Fewer DRG Downgrades' },
  },
  {
    num: '03',
    name: 'Denials Control Tower',
    tagline: 'Root-cause denial resolution',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.2)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
    description: 'Identifies and resolves avoidable denials at root cause. Automates appeal generation, tracks clean claim rates, and surfaces underpayment patterns.',
    capabilities: [
      'Automated appeal generation',
      'Clean claim tracking',
      'Payer underpayment analysis',
      'Root cause categorization',
      'Appeal cycle optimization',
    ],
    metric: { val: '50%', desc: 'Denial Dollar Reduction' },
  },
  {
    num: '04',
    name: 'Contract Yield Engine',
    tagline: 'Get paid exactly what you\'re owed',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.2)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8h2M12 8h5M7 12h5M14 12h3" />
      </svg>
    ),
    description: 'Audits every payment against the contracted rate grid. Detects payment variance, recovers underpayments, and accelerates dispute resolution.',
    capabilities: [
      'Payment vs contract audit',
      'Variance detection & alerting',
      'Dispute resolution acceleration',
      'Payer-specific rate grid engine',
      'Underpayment recovery',
    ],
    metric: { val: '25%', desc: 'Revenue Recovered' },
  },
];

export default function ControlTowers() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="platform" style={{
      padding: '100px 24px',
      background: 'linear-gradient(180deg, #06080f 0%, #080d1a 50%, #06080f 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(14,165,233,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '100px',
            border: '1px solid rgba(99,102,241,0.2)',
            background: 'rgba(99,102,241,0.05)',
            fontSize: '12px', fontWeight: '600', color: '#a5b4fc',
            letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            The Platform
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: '800', letterSpacing: '-1.5px',
            color: '#f0f9ff', lineHeight: '1.1',
            fontFamily: '"Inter Display", Inter, sans-serif',
            marginBottom: '16px',
          }}>
            Four Control Towers.<br />
            <span style={{
              background: 'linear-gradient(135deg, #a5b4fc, #6366f1)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>One Unified Platform.</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '540px', margin: '0 auto', lineHeight: '1.6' }}>
            Each module shares a single data model, so insights from Auth flow downstream to Claims — automatically.
          </p>
        </div>

        {/* Tower cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {towers.map((t, i) => (
            <div key={t.num}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === i
                  ? `linear-gradient(135deg, ${t.color}10, ${t.color}05)`
                  : 'rgba(13,21,37,0.6)',
                border: `1px solid ${hovered === i ? t.color + '40' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '16px',
                padding: '32px 28px',
                transition: 'all 0.35s ease',
                cursor: 'default',
                boxShadow: hovered === i ? `0 0 40px ${t.glow}` : 'none',
                transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
                backdropFilter: 'blur(10px)',
              }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: `${t.color}15`,
                  border: `1px solid ${t.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: t.color,
                  boxShadow: hovered === i ? `0 0 20px ${t.color}30` : 'none',
                  transition: 'box-shadow 0.3s',
                }}>
                  {t.icon}
                </div>
                <div style={{
                  fontSize: '11px', fontWeight: '700', color: t.color,
                  background: `${t.color}10`,
                  border: `1px solid ${t.color}25`,
                  padding: '4px 10px', borderRadius: '6px',
                  letterSpacing: '0.5px',
                }}>
                  {t.num}
                </div>
              </div>

              <h3 style={{
                fontSize: '17px', fontWeight: '700', color: '#f0f9ff',
                marginBottom: '6px', lineHeight: '1.3', letterSpacing: '-0.3px',
              }}>{t.name}</h3>
              <p style={{ fontSize: '13px', color: t.color, fontWeight: '500', marginBottom: '16px' }}>
                {t.tagline}
              </p>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
                {t.description}
              </p>

              {/* Capabilities */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {t.capabilities.map(cap => (
                  <div key={cap} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: t.color, flexShrink: 0, opacity: 0.8,
                    }} />
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{cap}</span>
                  </div>
                ))}
              </div>

              {/* Metric pill */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '10px',
                background: `${t.color}08`,
                border: `1px solid ${t.color}20`,
              }}>
                <span style={{
                  fontSize: '24px', fontWeight: '800', color: t.color,
                  fontFamily: '"Inter Display", Inter, sans-serif',
                  letterSpacing: '-0.5px',
                  textShadow: `0 0 15px ${t.color}50`,
                }}>{t.metric.val}</span>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{t.metric.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
