import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Journey', href: '#journey' },
  { label: 'Outcomes', href: '#outcomes' },
  { label: 'Team', href: '#team' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(6, 8, 15, 0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(14,165,233,0.1)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '800', color: 'white',
              boxShadow: '0 0 20px rgba(14,165,233,0.4)',
            }}>D</div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#f0f9ff', letterSpacing: '-0.3px' }}>
              Docstribe<span style={{ color: '#0ea5e9' }}> AI</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} style={{
                padding: '8px 16px', borderRadius: '8px', color: '#94a3b8',
                textDecoration: 'none', fontSize: '14px', fontWeight: '500',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.target.style.color = '#f0f9ff'; e.target.style.background = 'rgba(14,165,233,0.08)'; }}
                onMouseLeave={e => { e.target.style.color = '#94a3b8'; e.target.style.background = 'transparent'; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href="#contact" style={{
              display: 'none',
              padding: '8px 20px', borderRadius: '8px',
              border: '1px solid rgba(14,165,233,0.3)',
              color: '#38bdf8', fontSize: '14px', fontWeight: '500',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
              className="md:block"
              onMouseEnter={e => { e.target.style.borderColor = '#0ea5e9'; e.target.style.background = 'rgba(14,165,233,0.08)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(14,165,233,0.3)'; e.target.style.background = 'transparent'; }}
            >
              Log in
            </a>
            <a href="#pilot" style={{
              padding: '9px 22px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              color: 'white', fontSize: '14px', fontWeight: '600',
              textDecoration: 'none', transition: 'all 0.2s',
              boxShadow: '0 0 20px rgba(14,165,233,0.3)',
            }}
              onMouseEnter={e => { e.target.style.boxShadow = '0 0 30px rgba(14,165,233,0.5)'; e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.boxShadow = '0 0 20px rgba(14,165,233,0.3)'; e.target.style.transform = 'translateY(0)'; }}
            >
              Free 60-Day Pilot
            </a>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden"
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                ) : (
                  <>
                    <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
                    <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
                    <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            borderTop: '1px solid rgba(14,165,233,0.1)',
            padding: '16px 0',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}
            className="md:hidden"
          >
            {navLinks.map(link => (
              <a key={link.label} href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '12px 16px', borderRadius: '8px', color: '#94a3b8',
                  textDecoration: 'none', fontSize: '15px', fontWeight: '500',
                  transition: 'all 0.2s',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
