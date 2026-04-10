export default function Footer() {
  return (
    <footer style={{
      background: '#040608',
      borderTop: '1px solid rgba(14,165,233,0.08)',
      padding: '60px 24px 32px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: '800', color: 'white',
                boxShadow: '0 0 15px rgba(14,165,233,0.3)',
              }}>D</div>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#f0f9ff', letterSpacing: '-0.3px' }}>
                Docstribe<span style={{ color: '#0ea5e9' }}> AI</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7', maxWidth: '280px', marginBottom: '20px' }}>
              The AI Operating System for Revenue Assurance. Guaranteed by Outcomes. Serving 100+ hospitals across India, USA & UAE.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['HITRUST', 'HIPAA', 'SOC 2 Type II'].map(badge => (
                <span key={badge} style={{
                  padding: '4px 10px', borderRadius: '6px',
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.15)',
                  fontSize: '11px', fontWeight: '600', color: '#6ee7b7',
                }}>{badge}</span>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Platform
            </div>
            {['UM Control Tower', 'CDI Co-Pilot', 'Denials Tower', 'Contract Yield Engine'].map(link => (
              <div key={link} style={{ marginBottom: '10px' }}>
                <a href="#platform" style={{ fontSize: '13px', color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.target.style.color = '#94a3b8'; }}
                  onMouseLeave={e => { e.target.style.color = '#475569'; }}
                >{link}</a>
              </div>
            ))}
          </div>

          {/* Company links */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Company
            </div>
            {['About Us', 'Our Team', 'Outcomes', 'Careers'].map(link => (
              <div key={link} style={{ marginBottom: '10px' }}>
                <a href="#" style={{ fontSize: '13px', color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.target.style.color = '#94a3b8'; }}
                  onMouseLeave={e => { e.target.style.color = '#475569'; }}
                >{link}</a>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="mailto:akash@docstribe.com" style={{ fontSize: '13px', color: '#475569', textDecoration: 'none' }}>
                akash@docstribe.com
              </a>
              <a href="mailto:rishav@docstribe.com" style={{ fontSize: '13px', color: '#475569', textDecoration: 'none' }}>
                rishav@docstribe.com
              </a>
              <a href="https://docstribe.health" target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#0ea5e9', textDecoration: 'none' }}>
                www.docstribe.health ↗
              </a>
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>India · USA · UAE</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)', marginBottom: '24px' }} />

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontSize: '13px', color: '#2d3748' }}>
            © 2026 Docstribe AI. All rights reserved.
          </div>
          <div style={{
            fontSize: '13px', color: '#374151', fontStyle: 'italic',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            fontWeight: '600',
          }}>
            Thynk Growth = Thynk Docstribe
          </div>
        </div>
      </div>
    </footer>
  );
}
