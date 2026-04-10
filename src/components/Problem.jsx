export default function Problem() {
  const silos = [
    { name: 'UM Team', tool: 'System A', color: '#ef4444' },
    { name: 'CDI Team', tool: 'System B', color: '#f97316' },
    { name: 'Billing Team', tool: 'System C', color: '#eab308' },
    { name: 'Appeals Team', tool: 'System D', color: '#f43f5e' },
  ];

  return (
    <section style={{
      padding: '100px 24px',
      background: 'linear-gradient(180deg, #06080f 0%, #070a18 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Left: Visual of broken silos */}
          <div style={{ position: 'relative' }}>
            {/* Broken silo visualization */}
            <div style={{
              background: 'rgba(13,21,37,0.6)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px', padding: '32px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#ef4444', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                The Fragmented Reality
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {silos.map(s => (
                  <div key={s.name} style={{
                    padding: '16px', borderRadius: '10px',
                    background: `${s.color}08`,
                    border: `1px solid ${s.color}20`,
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: s.color, marginBottom: '4px' }}>{s.name}</div>
                    <div style={{ fontSize: '11px', color: '#475569' }}>{s.tool}</div>
                    <div style={{ fontSize: '11px', color: '#374151', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444' }} />
                      Disconnected
                    </div>
                  </div>
                ))}
              </div>
              {/* Broken connection lines */}
              <div style={{ textAlign: 'center', padding: '16px 0 0', fontSize: '13px', color: '#374151' }}>
                No shared data · No real-time visibility · Revenue leaks silently
              </div>
            </div>

            {/* Arrow down to solution */}
            <div style={{ textAlign: 'center', margin: '8px 0', color: '#0ea5e9', fontSize: '20px' }}>↓</div>

            {/* Unified model */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(99,102,241,0.08))',
              border: '1px solid rgba(14,165,233,0.25)',
              borderRadius: '20px', padding: '28px',
              boxShadow: '0 0 30px rgba(14,165,233,0.1)',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                The Docstribe Way
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                marginBottom: '12px',
              }}>
                {['Auth/UM', 'Care', 'Claim', 'Cash'].map((s, i, arr) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      padding: '8px 12px', borderRadius: '8px',
                      background: 'rgba(14,165,233,0.12)',
                      border: '1px solid rgba(14,165,233,0.2)',
                      fontSize: '12px', fontWeight: '600', color: '#38bdf8', whiteSpace: 'nowrap',
                    }}>{s}</div>
                    {i < arr.length - 1 && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(13,21,37,0.6)',
                border: '1px solid rgba(14,165,233,0.1)',
                fontSize: '12px', fontWeight: '500', color: '#64748b',
                textAlign: 'center',
              }}>
                Single unified data model · Real-time intelligence · Zero leakage
              </div>
            </div>
          </div>

          {/* Right: Problem text */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '5px 14px', borderRadius: '100px',
              border: '1px solid rgba(239,68,68,0.2)',
              background: 'rgba(239,68,68,0.05)',
              fontSize: '12px', fontWeight: '600', color: '#fca5a5',
              letterSpacing: '1px', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              The Problem
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 3.5vw, 48px)',
              fontWeight: '800', letterSpacing: '-1.5px',
              color: '#f0f9ff', lineHeight: '1.1',
              fontFamily: '"Inter Display", Inter, sans-serif',
              marginBottom: '20px',
            }}>
              Revenue Leaks Because<br />
              <span style={{
                background: 'linear-gradient(135deg, #fca5a5, #ef4444)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Systems Don't Talk</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.75', marginBottom: '24px' }}>
              Revenue cycle management was not a single problem — it was a chain of disconnected decisions. Utilization management in one silo. Clinical documentation in another. Coding in a third. Contract compliance in a fourth.
            </p>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.75', marginBottom: '32px' }}>
              Each function had its own team, its own tools, and its own blind spots. The result: charge capture gaps, documentation deficiencies, denied days, underpayments, and DRG downgrades — all compounding silently.
            </p>
            <div style={{
              padding: '20px 24px', borderRadius: '12px',
              background: 'rgba(14,165,233,0.05)',
              border: '1px solid rgba(14,165,233,0.15)',
              borderLeft: '3px solid #0ea5e9',
              fontSize: '15px', color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.6',
            }}>
              "The problem was never a lack of effort. It was a{' '}
              <span style={{ color: '#38bdf8', fontStyle: 'normal', fontWeight: '600' }}>lack of connection.</span>"
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
