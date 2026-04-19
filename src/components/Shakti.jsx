import { useEffect, useRef, useState, useCallback } from 'react';

/* ── Data ────────────────────────────────────────────────────────────────────── */
const PHASES = [
  {
    num: '01',
    tag: 'H&P — DAY 0',
    title: 'Dynamic DRG Intelligence',
    sub: 'CDI Queries at Admission',
    color: '#00cba8',
    dim: 'rgba(0,203,168,0.08)',
    border: 'rgba(0,203,168,0.28)',
    glow: 'rgba(0,203,168,0.5)',
    steps: [
      'Ingest H&P within minutes of physician signature',
      'Extract ICD-10 codes; compute baseline DRG via grouper',
      'Fire CDI queries Day 0 — not Day 3 like traditional CDI',
      'Surface DRG delta: e.g. AED 8.6K → AED 16.6K if AKI documented',
    ],
    products: ['CDI ENGINE', 'DRG GROUPER'],
  },
  {
    num: '02',
    tag: 'DAILY ROUNDING',
    title: '24-Hour DRG Refresh',
    sub: 'LOS & Revenue Delta Tracking',
    color: '#4d8aff',
    dim: 'rgba(77,138,255,0.08)',
    border: 'rgba(77,138,255,0.28)',
    glow: 'rgba(77,138,255,0.5)',
    steps: [
      'Recompute DRG on every clinical signal — notes, labs, consults',
      'Map lab values to undocumented diagnoses (e.g. AKI, malnutrition)',
      'Detect LOS paradox when patient outlasts GMLOS — alert fired',
      'Track revenue delta in real time: e.g. +AED 4,200 from new CC/MCC',
    ],
    products: ['LOS MONITOR', 'QUERY ENGINE'],
  },
  {
    num: '03',
    tag: 'DISCHARGE',
    title: 'Final DRG Locked',
    sub: '40–60% Revenue Loss Prevented',
    color: '#ff7b4a',
    dim: 'rgba(255,123,74,0.08)',
    border: 'rgba(255,123,74,0.28)',
    glow: 'rgba(255,123,74,0.5)',
    steps: [
      'Cross-reference entire chart — every note, consult, lab, order',
      'Surface conditions treated but not listed in discharge summary',
      'Lock final DRG with full clinical picture — maximum reimbursement',
      'Generate payer-specific pre-bill defense brief before claim drops',
    ],
    products: ['DISCHARGE AI', 'PRE-BILL BRIEF'],
  },
];

/* ── Arrow connector ─────────────────────────────────────────────────────────── */
function Connector({ color, delay, visible }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      height: '52px', position: 'relative', zIndex: 1,
      opacity: visible ? 1 : 0,
      transition: `opacity 0.5s ${delay}s ease`,
    }}>
      {/* Dashed line */}
      <div style={{
        width: '1.5px',
        flex: 1,
        background: `repeating-linear-gradient(to bottom, ${color}55 0px, ${color}55 5px, transparent 5px, transparent 9px)`,
        position: 'relative',
      }}>
        {/* Traveling dot */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          width: '6px', height: '6px', borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px ${color}`,
          animation: visible ? `shaktiTravel 1.8s ${delay + 0.3}s ease-in-out infinite` : 'none',
        }} />
      </div>
      {/* Arrowhead */}
      <div style={{
        width: 0, height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: `8px solid ${color}66`,
        marginTop: '-1px',
      }} />
    </div>
  );
}

/* ── Phase card ──────────────────────────────────────────────────────────────── */
function PhaseCard({ phase, index, visible, isActive, cardRef }) {
  const delay = 0.15 + index * 0.35;
  return (
    <div ref={cardRef} style={{
      position: 'relative',
      borderRadius: '20px',
      border: isActive ? `1.5px solid ${phase.color}` : `1px solid ${phase.border}`,
      background: isActive
        ? `linear-gradient(135deg, ${phase.dim.replace('0.08', '0.15')}, rgba(6,10,18,0.95))`
        : `linear-gradient(135deg, ${phase.dim}, rgba(6,10,18,0.95))`,
      padding: '28px 28px 22px',
      overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transform: visible ? (isActive ? 'scale(1.01)' : 'scale(1)') : 'translateY(20px)',
      transition: `opacity 0.6s ${delay}s ease, transform 0.4s ease, border 0.3s ease, box-shadow 0.4s ease`,
      boxShadow: isActive
        ? `0 0 70px ${phase.glow.replace('0.5', '0.3')}, 0 0 0 1px ${phase.color}60`
        : visible ? `0 0 40px ${phase.dim}` : 'none',
    }}>
      {/* Corner accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '80px', height: '80px',
        background: `radial-gradient(circle at 0 0, ${phase.color}18, transparent 70%)`,
        borderRadius: '20px 0 0 0',
        pointerEvents: 'none',
      }} />

      {/* Active scan-line sweep */}
      {isActive && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${phase.color}12 50%, transparent 100%)`,
          animation: 'shaktiScan 1.8s ease-in-out infinite',
          pointerEvents: 'none', borderRadius: '20px',
        }} />
      )}

      {/* Active indicator bar at top */}
      {isActive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${phase.color}, transparent)`,
          animation: 'shaktiPulse 1.2s ease-in-out infinite',
          borderRadius: '20px 20px 0 0',
        }} />
      )}

      {/* Top row: number badge + phase tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
          background: `${phase.color}18`,
          border: `1px solid ${phase.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: '800', color: phase.color,
          fontFamily: 'Sora, sans-serif', letterSpacing: '0.5px',
        }}>{phase.num}</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '10px', fontWeight: '700', color: phase.color,
            letterSpacing: '2.5px', fontFamily: 'Sora, sans-serif',
          }}>{phase.tag}</div>
        </div>
        {/* Pulse dot */}
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: phase.color,
          boxShadow: `0 0 12px ${phase.glow}`,
          animation: 'shaktiPulse 2s ease-in-out infinite',
        }} />
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '20px', fontWeight: '700', color: '#f1f5f9',
        fontFamily: 'Sora, sans-serif', margin: '0 0 4px',
        letterSpacing: '-0.3px',
      }}>{phase.title}</h3>
      <p style={{ fontSize: '13px', color: phase.color, margin: '0 0 18px', opacity: 0.8 }}>
        {phase.sub}
      </p>

      {/* Divider */}
      <div style={{
        height: '1px', marginBottom: '16px',
        background: `linear-gradient(90deg, ${phase.color}30, transparent)`,
      }} />

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '20px' }}>
        {phase.steps.map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            opacity: visible ? 1 : 0,
            transition: `opacity 0.5s ${delay + 0.1 + i * 0.07}s ease`,
          }}>
            <div style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: phase.color, flexShrink: 0,
              marginTop: '6px', boxShadow: `0 0 6px ${phase.color}`,
            }} />
            <span style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>{step}</span>
          </div>
        ))}
      </div>

      {/* Product tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {phase.products.map(tag => (
          <span key={tag} style={{
            padding: '3px 10px',
            borderRadius: '100px',
            fontSize: '9px', fontWeight: '700', letterSpacing: '1.5px',
            fontFamily: 'Sora, sans-serif',
            color: phase.color,
            border: `1px solid ${phase.color}35`,
            background: `${phase.color}0d`,
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main Shakti component ───────────────────────────────────────────────────── */
export default function Shakti() {
  const [visible, setVisible] = useState(false);
  const [activePhase, setActivePhase] = useState(null); // 0 | 1 | 2 | null
  const sectionRef = useRef(null);
  const cardRefs = useRef([null, null, null]);

  // Phase highlight — no page scroll (visual update only; RUDRA panel handles the flow sketch)
  // scrollIntoView intentionally removed to prevent page jumping while RUDRA overlay is open

  // Listen for RUDRA voiceover phase events
  useEffect(() => {
    const handler = (e) => setActivePhase(e.detail?.phase ?? null);
    window.addEventListener('rudra-phase', handler);
    return () => window.removeEventListener('rudra-phase', handler);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="shakti" style={{
      padding: '100px 24px',
      background: 'linear-gradient(180deg, #050a08 0%, #060c0a 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow blobs */}
      <div style={{
        position: 'absolute', top: '20%', left: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,203,168,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(77,138,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="wrap" style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Section header */}
        <div style={{
          textAlign: 'center', marginBottom: '56px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 16px', borderRadius: '100px',
            background: 'rgba(0,203,168,0.07)',
            border: '1px solid rgba(0,203,168,0.18)',
            fontSize: '10px', fontWeight: '700', color: '#00cba8',
            letterSpacing: '3px', fontFamily: 'Sora, sans-serif',
            marginBottom: '20px',
          }}>
            {/* Shakti Om symbol */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#00cba8" strokeWidth="1.5" strokeOpacity="0.5"/>
              <circle cx="12" cy="12" r="4" fill="#00cba8" fillOpacity="0.6"/>
            </svg>
            SHAKTI
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: '800',
            color: '#f1f5f9', margin: '0 0 14px',
            fontFamily: 'Sora, sans-serif', letterSpacing: '-0.5px',
          }}>
            DRG Lifecycle — H&P to Clean Claim
          </h2>
          <p style={{
            fontSize: '15px', color: '#475569', maxWidth: '460px', margin: '0 auto',
            lineHeight: '1.7',
          }}>
            AI reads every clinical document the moment it is signed. DRG recomputed in real time. CDI queries on Day 0.
          </p>
        </div>

        {/* START NODE */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: '0',
          opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 22px', borderRadius: '100px',
            border: '1px solid rgba(148,163,184,0.18)',
            background: 'rgba(255,255,255,0.03)',
          }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#94a3b8', boxShadow: '0 0 10px rgba(148,163,184,0.5)',
            }} />
            <span style={{
              fontSize: '11px', fontWeight: '700', color: '#64748b',
              letterSpacing: '2.5px', fontFamily: 'Sora, sans-serif',
            }}>PATIENT ENCOUNTER</span>
          </div>
        </div>

        {/* Phase 1 */}
        <Connector color="#00cba8" delay={0.05} visible={visible} />
        <PhaseCard phase={PHASES[0]} index={0} visible={visible} isActive={activePhase === 0} cardRef={el => cardRefs.current[0] = el} />

        {/* Living Rulebook bridge */}
        <div style={{ position: 'relative' }}>
          <Connector color="#4d8aff" delay={0.4} visible={visible} />
          {/* Living Rulebook badge - centered on the connector */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s 0.45s ease',
          }}>
            <div style={{
              padding: '5px 14px', borderRadius: '100px',
              background: 'rgba(6,10,18,0.95)',
              border: '1px solid rgba(99,102,241,0.4)',
              fontSize: '9px', fontWeight: '700', color: '#6366f1',
              letterSpacing: '1.5px', fontFamily: 'Sora, sans-serif',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 20px rgba(99,102,241,0.15)',
            }}>
              ⚡ LIVING RULEBOOK
            </div>
          </div>
        </div>

        {/* Phase 2 */}
        <PhaseCard phase={PHASES[1]} index={1} visible={visible} isActive={activePhase === 1} cardRef={el => cardRefs.current[1] = el} />

        {/* Connector with Living Rulebook badge */}
        <div style={{ position: 'relative' }}>
          <Connector color="#ff7b4a" delay={0.75} visible={visible} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s 0.8s ease',
          }}>
            <div style={{
              padding: '5px 14px', borderRadius: '100px',
              background: 'rgba(6,10,18,0.95)',
              border: '1px solid rgba(99,102,241,0.4)',
              fontSize: '9px', fontWeight: '700', color: '#6366f1',
              letterSpacing: '1.5px', fontFamily: 'Sora, sans-serif',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 20px rgba(99,102,241,0.15)',
            }}>
              ⚡ LIVING RULEBOOK
            </div>
          </div>
        </div>

        {/* Phase 3 */}
        <PhaseCard phase={PHASES[2]} index={2} visible={visible} isActive={activePhase === 2} cardRef={el => cardRefs.current[2] = el} />

        {/* Final arrow */}
        <Connector color="#10b981" delay={1.1} visible={visible} />

        {/* END NODE */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s 1.2s ease',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 28px', borderRadius: '100px',
            border: '1px solid rgba(16,185,129,0.35)',
            background: 'rgba(16,185,129,0.07)',
            boxShadow: '0 0 30px rgba(16,185,129,0.12)',
          }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#10b981', boxShadow: '0 0 14px rgba(16,185,129,0.8)',
            }} />
            <span style={{
              fontSize: '12px', fontWeight: '700', color: '#10b981',
              letterSpacing: '2px', fontFamily: 'Sora, sans-serif',
            }}>REVENUE RECOVERED</span>
          </div>
        </div>

        {/* Closed-loop feedback note */}
        <div style={{
          marginTop: '40px', padding: '20px 24px',
          borderRadius: '16px',
          border: '1px dashed rgba(99,102,241,0.25)',
          background: 'rgba(99,102,241,0.04)',
          display: 'flex', alignItems: 'flex-start', gap: '16px',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s 1.35s ease',
        }}>
          {/* Closed loop icon */}
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </div>
          <div>
            <div style={{
              fontSize: '12px', fontWeight: '700', color: '#6366f1',
              letterSpacing: '1.5px', fontFamily: 'Sora, sans-serif', marginBottom: '5px',
            }}>CLOSED-LOOP FEEDBACK</div>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.6' }}>
              Every denial, underpayment, and variance is fed back into the Living Rulebook — so the same revenue leak never happens twice. The system gets smarter with every claim.
            </p>
          </div>
        </div>

        {/* Stat strip */}
        <div style={{
          marginTop: '48px',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px',
          borderRadius: '16px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s 1.5s ease',
        }}>
          {[
            { val: '18×', label: 'Average ROI', color: '#00cba8' },
            { val: 'AED 100M+', label: 'Revenue recovered', color: '#4d8aff' },
            { val: '60 days', label: 'Pilot to live rulebook', color: '#ff7b4a' },
          ].map(({ val, label, color }) => (
            <div key={label} style={{
              padding: '24px 20px', textAlign: 'center',
              background: 'rgba(255,255,255,0.02)',
              borderRight: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{
                fontSize: '26px', fontWeight: '800', color,
                fontFamily: 'Sora, sans-serif', marginBottom: '6px',
              }}>{val}</div>
              <div style={{ fontSize: '12px', color: '#334155' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shaktiPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes shaktiTravel {
          0%   { top: 0%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        @keyframes shaktiScan {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}
