export default function CTA() {
  return (
    <section id="pilot" style={{
      padding: '100px 24px',
      background: '#06080f',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Large ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(14,165,233,0.1) 0%, rgba(99,102,241,0.05) 50%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(99,102,241,0.08) 50%, rgba(16,185,129,0.05) 100%)',
          border: '1px solid rgba(14,165,233,0.2)',
          borderRadius: '28px',
          padding: 'clamp(40px, 6vw, 72px)',
          textAlign: 'center',
          boxShadow: '0 0 80px rgba(14,165,233,0.08)',
          backdropFilter: 'blur(20px)',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            border: '1px solid rgba(16,185,129,0.3)',
            background: 'rgba(16,185,129,0.08)',
            fontSize: '13px', fontWeight: '600', color: '#6ee7b7',
            marginBottom: '28px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
            Zero-Risk Pilot Program
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 60px)',
            fontWeight: '900', letterSpacing: '-2px',
            color: '#f0f9ff', lineHeight: '1.05',
            fontFamily: '"Inter Display", Inter, sans-serif',
            marginBottom: '20px',
          }}>
            Revenue Cycle.<br />
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 40%, #6366f1 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>On Autopilot.</span>
          </h2>

          <p style={{
            fontSize: '17px', color: '#64748b',
            maxWidth: '480px', margin: '0 auto 40px',
            lineHeight: '1.65',
          }}>
            Start with a free 60-day pilot. No commitment. No license fees. Pay only when we deliver measurable financial improvement to your hospital.
          </p>

          {/* Pilot terms */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap',
            marginBottom: '40px',
          }}>
            {[
              { val: '60', unit: 'Days', label: 'Free pilot period' },
              { val: '0', unit: 'Upfront', label: 'Zero cost to start' },
              { val: '18x', unit: 'Avg ROI', label: 'Average return' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '36px', fontWeight: '800',
                  color: '#f0f9ff', lineHeight: '1',
                  fontFamily: '"Inter Display", Inter, sans-serif',
                  letterSpacing: '-1px',
                }}>
                  {item.val}
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#0ea5e9', marginLeft: '4px' }}>{item.unit}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <a href="mailto:akash@docstribe.com" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '16px 40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              color: 'white', fontSize: '16px', fontWeight: '700',
              textDecoration: 'none', transition: 'all 0.3s',
              boxShadow: '0 0 30px rgba(14,165,233,0.4)',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 50px rgba(14,165,233,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(14,165,233,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start Your Free Pilot
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a href="mailto:rishav@docstribe.com" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '16px 32px', borderRadius: '12px',
              border: '1px solid rgba(14,165,233,0.25)',
              background: 'rgba(14,165,233,0.05)',
              color: '#e2e8f0', fontSize: '16px', fontWeight: '500',
              textDecoration: 'none', transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.5)'; e.currentTarget.style.background = 'rgba(14,165,233,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.25)'; e.currentTarget.style.background = 'rgba(14,165,233,0.05)'; }}
            >
              Talk to the Team
            </a>
          </div>

          {/* Contact info */}
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'CEO', email: 'akash@docstribe.com' },
              { label: 'CTO', email: 'rishav@docstribe.com' },
            ].map(c => (
              <a key={c.email} href={`mailto:${c.email}`} style={{
                fontSize: '13px', color: '#475569',
                textDecoration: 'none', transition: 'color 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#38bdf8'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span style={{ fontWeight: '600' }}>{c.label}:</span> {c.email}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
