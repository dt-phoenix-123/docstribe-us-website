import { useEffect, useRef } from 'react';

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#0ea5e9' : '#6366f1',
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#0ea5e9';
            ctx.globalAlpha = (1 - dist / 120) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(14,165,233,0.12) 0%, transparent 70%), #06080f',
    }}>
      {/* Particle Canvas */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none',
      }} />

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Radial glow blobs */}
      <div style={{
        position: 'absolute', top: '20%', left: '15%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '30%', right: '15%',
        width: '250px', height: '250px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            border: '1px solid rgba(14,165,233,0.3)',
            background: 'rgba(14,165,233,0.06)',
            fontSize: '13px', fontWeight: '500', color: '#38bdf8',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#10b981', display: 'inline-block',
              boxShadow: '0 0 8px #10b981',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            Live across 100+ hospitals · India, USA & UAE
          </div>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 80px)',
          fontWeight: '900',
          lineHeight: '1.05',
          letterSpacing: '-2px',
          marginBottom: '24px',
          fontFamily: '"Inter Display", Inter, sans-serif',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>The AI Operating System</span>
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 40%, #6366f1 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>for Revenue Assurance</span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 22px)',
          color: '#94a3b8', fontWeight: '400',
          maxWidth: '640px', margin: '0 auto 16px',
          lineHeight: '1.6',
        }}>
          One unified platform. From Authorization to Cash.
          Stopping revenue leakage before it happens — not chasing it after.
        </p>

        <p style={{
          fontSize: '15px', fontWeight: '600', color: '#0ea5e9',
          letterSpacing: '0.5px', marginBottom: '48px',
          textTransform: 'uppercase',
        }}>
          Guaranteed by Outcomes
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '72px' }}>
          <a href="#pilot" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '16px 36px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            color: 'white', fontSize: '16px', fontWeight: '600',
            textDecoration: 'none', transition: 'all 0.3s',
            boxShadow: '0 0 30px rgba(14,165,233,0.35)',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 50px rgba(14,165,233,0.55)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(14,165,233,0.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Start Free 60-Day Pilot
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a href="#platform" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '16px 36px', borderRadius: '12px',
            border: '1px solid rgba(14,165,233,0.25)',
            background: 'rgba(14,165,233,0.05)',
            color: '#e2e8f0', fontSize: '16px', fontWeight: '500',
            textDecoration: 'none', transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.5)'; e.currentTarget.style.background = 'rgba(14,165,233,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(14,165,233,0.25)'; e.currentTarget.style.background = 'rgba(14,165,233,0.05)'; }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polygon points="5,3 19,12 5,21" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            See the Platform
          </a>
        </div>

        {/* Metrics Row */}
        <div style={{
          display: 'flex', gap: '0', justifyContent: 'center', flexWrap: 'wrap',
          background: 'rgba(13,21,37,0.8)',
          border: '1px solid rgba(14,165,233,0.12)',
          borderRadius: '16px', overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          maxWidth: '800px', margin: '0 auto',
        }}>
          {[
            { val: '25%', label: 'Revenue Recovered', color: '#10b981' },
            { val: '50%', label: 'Denial Reduction', color: '#0ea5e9' },
            { val: '98%', label: 'Clean Claim Rate', color: '#6366f1' },
            { val: '18x', label: 'Average ROI', color: '#f97316' },
          ].map((m, i, arr) => (
            <div key={m.label} style={{
              flex: '1 1 160px',
              padding: '28px 24px',
              textAlign: 'center',
              borderRight: i < arr.length - 1 ? '1px solid rgba(14,165,233,0.08)' : 'none',
            }}>
              <div style={{
                fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800',
                color: m.color, lineHeight: '1',
                fontFamily: '"Inter Display", Inter, sans-serif',
                letterSpacing: '-1px',
                textShadow: `0 0 20px ${m.color}50`,
              }}>{m.val}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', fontWeight: '500', letterSpacing: '0.3px' }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Compliance badges */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '32px' }}>
          {['HITRUST Certified', 'HIPAA Compliant', 'SOC 2 Type II'].map(badge => (
            <div key={badge} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '6px',
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.15)',
              fontSize: '12px', fontWeight: '500', color: '#6ee7b7',
              letterSpacing: '0.3px',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        animation: 'bounce 2s infinite',
      }}>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(14,165,233,0.5), transparent)' }} />
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#0ea5e9', boxShadow: '0 0 8px #0ea5e9',
        }} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  );
}
