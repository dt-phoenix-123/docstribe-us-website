const team = [
  {
    name: 'Akash Manu Srivastava',
    role: 'Co-founder & CEO',
    background: 'rgba(14,165,233,0.06)',
    border: 'rgba(14,165,233,0.15)',
    accent: '#0ea5e9',
    initials: 'AM',
    bio: '15+ years building and scaling healthcare technology businesses. Former HIT executive driving enterprise health systems transformation.',
    badges: ['Healthcare Tech', '15+ Years', 'CEO'],
  },
  {
    name: 'Rishav Sharma',
    role: 'Co-founder & CTO',
    background: 'rgba(99,102,241,0.06)',
    border: 'rgba(99,102,241,0.15)',
    accent: '#6366f1',
    initials: 'RS',
    bio: 'Architect behind Docstribe\'s AI infrastructure and unified data model. Expert in healthcare data systems and ML-powered clinical workflows.',
    badges: ['AI Architecture', 'Data Systems', 'CTO'],
  },
  {
    name: 'Dr. Angeline',
    role: 'Chief Clinical Advisor',
    background: 'rgba(168,85,247,0.06)',
    border: 'rgba(168,85,247,0.15)',
    accent: '#a855f7',
    initials: 'Dr.A',
    bio: 'Former Joint Director, Government of India. JIPMER & RCS alumna with 25+ years of frontline clinical and health system leadership.',
    badges: ['Clinical Advisor', 'JIPMER', 'Govt. India'],
  },
  {
    name: 'Dr. Amir Bacchus',
    role: 'Clinical Strategy Advisor',
    background: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.15)',
    accent: '#10b981',
    initials: 'Dr.AB',
    bio: 'Founder of P3 Health. 25+ years of frontline clinical leadership across hospital systems. Pioneer in value-based care and clinical operations.',
    badges: ['P3 Health Founder', 'Value-Based Care', 'Clinical Ops'],
  },
];

export default function Team() {
  return (
    <section id="team" style={{
      padding: '100px 24px',
      background: '#06080f',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '100px',
            border: '1px solid rgba(16,185,129,0.2)',
            background: 'rgba(16,185,129,0.05)',
            fontSize: '12px', fontWeight: '600', color: '#6ee7b7',
            letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            The Team
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: '800', letterSpacing: '-1.5px',
            color: '#f0f9ff', lineHeight: '1.1',
            fontFamily: '"Inter Display", Inter, sans-serif',
            marginBottom: '16px',
          }}>
            30+ Years of Business.<br />
            <span style={{
              background: 'linear-gradient(135deg, #6ee7b7, #10b981)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>50+ Years of Clinical.</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: '1.6' }}>
            We didn't build software and go looking for a problem. We lived the problem — and then built the software.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {team.map(member => (
            <div key={member.name} style={{
              background: member.background,
              border: `1px solid ${member.border}`,
              borderRadius: '20px',
              padding: '32px 28px',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 0 40px ${member.accent}20`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${member.accent}30, ${member.accent}10)`,
                border: `2px solid ${member.accent}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: '700', color: member.accent,
                marginBottom: '20px',
                boxShadow: `0 0 20px ${member.accent}20`,
              }}>
                {member.initials}
              </div>

              <div style={{ fontSize: '11px', fontWeight: '700', color: member.accent, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>
                {member.role}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#f0f9ff', marginBottom: '12px', letterSpacing: '-0.2px', lineHeight: '1.3' }}>
                {member.name}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.65', marginBottom: '20px' }}>
                {member.bio}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {member.badges.map(b => (
                  <span key={b} style={{
                    padding: '4px 10px', borderRadius: '6px',
                    background: `${member.accent}10`,
                    border: `1px solid ${member.accent}20`,
                    fontSize: '11px', fontWeight: '500', color: member.accent,
                  }}>{b}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
