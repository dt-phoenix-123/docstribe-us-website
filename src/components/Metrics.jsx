import { useEffect, useRef, useState } from 'react';

const metrics = [
  {
    val: 25, suffix: '%', label: 'Revenue Leakage Recovered',
    desc: 'Charge capture gaps and underpayments recovered within 60 days',
    color: '#10b981', icon: '💰',
  },
  {
    val: 50, suffix: '%', label: 'Avoidable Denial Dollar Reduction',
    desc: 'Denials driven by authorization, eligibility, and medical necessity',
    color: '#0ea5e9', icon: '🛡️',
  },
  {
    val: 20, suffix: '%', label: 'Fewer DRG & OBS Downgrades',
    desc: 'Observation status and DRG optimization through AI co-pilot',
    color: '#a855f7', icon: '📋',
  },
  {
    val: 98, suffix: '%', label: 'Clean Claim Rate',
    desc: 'Near-perfect first-pass clean claims that accelerate cash flow',
    color: '#f97316', icon: '✅',
  },
];

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
}

function MetricCard({ m }) {
  const [count, ref] = useCountUp(m.val);
  const [hovered, setHovered] = useState(false);

  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `linear-gradient(135deg, ${m.color}10, ${m.color}05)` : 'rgba(13,21,37,0.6)',
        border: `1px solid ${hovered ? m.color + '35' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '20px',
        padding: '40px 32px',
        transition: 'all 0.35s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? `0 0 50px ${m.color}20` : 'none',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
      }}>
      {/* Big number */}
      <div style={{
        fontSize: 'clamp(60px, 8vw, 88px)',
        fontWeight: '900', lineHeight: '1',
        color: m.color,
        fontFamily: '"Inter Display", Inter, sans-serif',
        letterSpacing: '-3px',
        textShadow: `0 0 40px ${m.color}50`,
        marginBottom: '8px',
      }}>
        {count}{m.suffix}
      </div>

      <div style={{
        width: '40px', height: '2px',
        background: `linear-gradient(90deg, transparent, ${m.color}, transparent)`,
        margin: '0 auto 16px',
        opacity: 0.6,
      }} />

      <h3 style={{
        fontSize: '16px', fontWeight: '700',
        color: '#e2e8f0', marginBottom: '10px',
        lineHeight: '1.3', letterSpacing: '-0.2px',
      }}>{m.label}</h3>
      <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
        {m.desc}
      </p>
    </div>
  );
}

export default function Metrics() {
  return (
    <section id="outcomes" style={{
      padding: '100px 24px',
      background: '#06080f',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow background */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '800px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(14,165,233,0.04) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section header */}
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
            Guaranteed Outcomes in 60 Days
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: '800', letterSpacing: '-1.5px',
            color: '#f0f9ff', lineHeight: '1.1',
            fontFamily: '"Inter Display", Inter, sans-serif',
            marginBottom: '16px',
          }}>
            The Proof Is in the Numbers
          </h2>
          <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '540px', margin: '0 auto', lineHeight: '1.6' }}>
            These aren't aspirational targets. They're contractual commitments, backed by a pay-only-on-success commercial model.
          </p>
        </div>

        {/* Metric cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '48px',
        }}>
          {metrics.map(m => <MetricCard key={m.label} m={m} />)}
        </div>

        {/* Bottom callout */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(99,102,241,0.08))',
          border: '1px solid rgba(14,165,233,0.15)',
          borderRadius: '16px',
          padding: '32px 40px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            color: '#e2e8f0', fontWeight: '500',
            fontStyle: 'italic',
            lineHeight: '1.6',
            maxWidth: '700px', margin: '0 auto',
          }}>
            "The question is not whether these outcomes are possible.{' '}
            <span style={{ color: '#38bdf8', fontStyle: 'normal', fontWeight: '700' }}>
              The question is: why would you pay for an RCM platform that doesn't guarantee them?
            </span>"
          </p>
        </div>

        {/* 10M lives, 100+ hospitals, $100M+ revenue */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px', marginTop: '48px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {[
            { val: '100+', label: 'Hospitals Deployed', sub: 'India, USA & UAE' },
            { val: '10M+', label: 'Lives Managed', sub: 'Active patient population' },
            { val: 'AED 370M+', label: 'Revenue Growth Attributable', sub: 'Across all deployments' },
          ].map((s) => (
            <div key={s.label} style={{
              padding: '36px 24px', textAlign: 'center',
              background: 'rgba(13,21,37,0.5)',
            }}>
              <div style={{
                fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: '800',
                color: '#f0f9ff', lineHeight: '1',
                fontFamily: '"Inter Display", Inter, sans-serif',
                letterSpacing: '-1.5px', marginBottom: '8px',
              }}>{s.val}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '12px', color: '#475569' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
