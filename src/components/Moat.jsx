const moats = [
  {
    num: '01',
    title: 'The Single Data Model',
    subtitle: 'Intelligence without silos',
    color: '#0ea5e9',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <circle cx="19" cy="5" r="2" />
        <circle cx="19" cy="19" r="2" />
        <circle cx="5" cy="12" r="2" />
        <line x1="10.6" y1="10.6" x2="7" y2="12" />
        <line x1="13.4" y1="10.6" x2="17.3" y2="6.7" />
        <line x1="13.4" y1="13.4" x2="17.3" y2="17.3" />
      </svg>
    ),
    body: 'Most RCM platforms operate on disconnected data silos. Docstribe collapses them into one unified data model where every clinical event, authorization decision, coding output, and payer interaction lives in one connected layer.',
    highlight: 'Revenue leakage is intercepted at the point of origin, not discovered months later.',
  },
  {
    num: '02',
    title: 'Outcome-Guaranteed Commercial Model',
    subtitle: 'Pay only on success',
    color: '#10b981',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    body: '60-day free pilot with proof of value. Outcome-backed ROI. Pay-only-on-success pricing. Hospitals pay nothing unless Docstribe delivers measurable financial improvement.',
    highlight: 'This is not a marketing claim — it is the contractual structure.',
  },
  {
    num: '03',
    title: 'Battle-Tested at Scale',
    subtitle: 'Proven, not prototype',
    color: '#a855f7',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    body: 'Deployed across 100+ hospitals in India and the GCC, managing 10M+ lives. Driving service-line growth in Cardiac, Oncology, Nephrology, Neurology & Orthopedics with an average 18x ROI.',
    highlight: 'We are not entering the US to learn. We are entering the US to deliver.',
  },
];

export default function Moat() {
  return (
    <section style={{
      padding: '100px 24px',
      background: 'linear-gradient(180deg, #06080f 0%, #07091a 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative line */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '1px', height: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(14,165,233,0.08), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '100px',
            border: '1px solid rgba(168,85,247,0.2)',
            background: 'rgba(168,85,247,0.05)',
            fontSize: '12px', fontWeight: '600', color: '#d8b4fe',
            letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#a855f7', display: 'inline-block' }} />
            Structural Advantages
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: '800', letterSpacing: '-1.5px',
            color: '#f0f9ff', lineHeight: '1.1',
            fontFamily: '"Inter Display", Inter, sans-serif',
            marginBottom: '16px',
          }}>
            What Makes Docstribe<br />
            <span style={{
              background: 'linear-gradient(135deg, #d8b4fe, #a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Structurally Different</span>
          </h2>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '540px', margin: '0 auto', lineHeight: '1.6' }}>
            The US RCM market is full of point solutions. Docstribe's moat is not incremental — it's architectural.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {moats.map(m => (
            <div key={m.num} style={{
              background: 'rgba(13,21,37,0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px', padding: '36px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = m.color + '35';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 0 50px ${m.color}15`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Top number */}
              <div style={{
                position: 'absolute', top: '20px', right: '24px',
                fontSize: '80px', fontWeight: '900', color: m.color,
                opacity: 0.04, lineHeight: '1',
                fontFamily: '"Inter Display", Inter, sans-serif',
                letterSpacing: '-4px',
              }}>{m.num}</div>

              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: `${m.color}15`,
                border: `1px solid ${m.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: m.color, marginBottom: '24px',
              }}>
                {m.icon}
              </div>

              <div style={{ fontSize: '11px', fontWeight: '700', color: m.color, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                Moat {m.num} · {m.subtitle}
              </div>
              <h3 style={{
                fontSize: '20px', fontWeight: '700', color: '#f0f9ff',
                marginBottom: '16px', letterSpacing: '-0.3px', lineHeight: '1.3',
              }}>{m.title}</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.7', marginBottom: '20px' }}>
                {m.body}
              </p>
              <div style={{
                padding: '14px 16px', borderRadius: '10px',
                background: `${m.color}08`,
                border: `1px solid ${m.color}20`,
                borderLeft: `3px solid ${m.color}`,
                fontSize: '13px', fontWeight: '500',
                color: '#94a3b8', fontStyle: 'italic', lineHeight: '1.5',
              }}>
                {m.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
