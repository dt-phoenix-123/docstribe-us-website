const reasons = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 5-5" />
      </svg>
    ),
    label: 'Rising denial rates',
    body: 'US hospitals face escalating payer complexity and growing denial rates across commercial and government payers.',
    color: '#f97316',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    label: 'Chronic RCM labor shortage',
    body: 'Skilled RCM professionals are scarce. Hospitals need automation to maintain throughput without ballooning headcount.',
    color: '#0ea5e9',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    label: 'AI adoption acceleration',
    body: 'Health systems are actively seeking AI platforms that deliver measurable financial returns — in weeks, not years.',
    color: '#6366f1',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    label: 'AED 100B+ UAE healthcare market',
    body: '3–5% of net hospital revenue is lost annually to preventable RCM failures — a staggering, recoverable opportunity.',
    color: '#10b981',
  },
];

export default function WhyNow() {
  return (
    <section style={{
      padding: '100px 24px',
      background: 'linear-gradient(180deg, #07091a 0%, #06080f 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Left text */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '5px 14px', borderRadius: '100px',
              border: '1px solid rgba(249,115,22,0.2)',
              background: 'rgba(249,115,22,0.05)',
              fontSize: '12px', fontWeight: '600', color: '#fdba74',
              letterSpacing: '1px', textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
              Why The UAE. Why Now.
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 3.5vw, 48px)',
              fontWeight: '800', letterSpacing: '-1.5px',
              color: '#f0f9ff', lineHeight: '1.1',
              fontFamily: '"Inter Display", Inter, sans-serif',
              marginBottom: '20px',
            }}>
              UAE Hospitals Lose{' '}
              <span style={{
                background: 'linear-gradient(135deg, #fb923c, #f97316)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>3–5% of Net Revenue</span>{' '}
              Every Year
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.7', marginBottom: '32px' }}>
              To preventable revenue cycle failures. That's billions of dollars leaking from a broken system. Docstribe enters with a proven platform, a compliance-ready stack, and a commercial model that removes all adoption risk.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {['DHA & NABIDH Compliant — UAE data exchange standards', 'IR-DRG Certified — UAE inpatient grouper expertise', 'SOC 2 Type II — enterprise-grade data security'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right grid of reasons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {reasons.map(r => (
              <div key={r.label} style={{
                background: 'rgba(13,21,37,0.6)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '24px 20px',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = r.color + '30';
                  e.currentTarget.style.background = `${r.color}08`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.background = 'rgba(13,21,37,0.6)';
                }}
              >
                <div style={{ color: r.color, marginBottom: '12px' }}>{r.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0', marginBottom: '8px', lineHeight: '1.3' }}>
                  {r.label}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                  {r.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
