export const KNOWLEDGE_BASE = `
DOCSTRIBE AI — PRODUCT KNOWLEDGE BASE (Grounded Context for Agent)

═══════════════════════════════════════
OVERVIEW
═══════════════════════════════════════
Docstribe AI is the Skilled AI Workforce for Revenue Integrity — Guaranteed by Outcomes.
Core product: Dynamic DRG Intelligence — AI reads every clinical document at the moment it is signed. DRG recomputed in real time. CDI queries on Day 0.
Website: www.docstribe.health | India · USA · UAE
Scale: 100+ hospitals deployed, 10M+ lives managed
US market proposition: Prepared for health systems like Houston Methodist, Tenet, HCA
Compliance: HITRUST Certified · HIPAA Compliant · SOC 2 Type II · Epic-native connector

═══════════════════════════════════════
THE CORE INSIGHT — THE DOCUMENTATION GAP
═══════════════════════════════════════
"The physician writes for clinical communication. The DRG grouper reads for financial classification.
That gap is where all revenue leakage lives. Docstribe sits exactly in that gap."

Documentation AI is deployed. (Ambient AI, DAX, Nuance — note quality is solved.)
Denial AI is deployed against you. (Payer AI systems are actively fighting your claims.)
Revenue integrity AI — the layer that converts clinical documentation into correct DRG assignment — is the missing piece.

US hospital payer landscape:
- 15.1% average denial rate at major health systems
- 57% DRG downgrade surge year-over-year
- $4.7B payer AI recovery (payers using AI to challenge your DRGs)
- 65% of denials are never reworked
- $44 cost per denial appeal

═══════════════════════════════════════
THE PROBLEM WE SOLVE
═══════════════════════════════════════
Hospital revenue cycle management has been structurally broken for years.
UM (Utilization Management) lives in one silo. Clinical documentation in another.
Coding in a third. Contract compliance in a fourth. Each team has its own tools,
its own blind spots. The result: charge capture gaps, denied days, DRG downgrades,
and underpayments — all compounding silently.

US hospitals lose 3-5% of net revenue annually to preventable RCM failures —
that's $42-70 billion across a $1.4 trillion hospital market.

The problem was never a lack of effort. It was a lack of connection.

═══════════════════════════════════════
DYNAMIC DRG INTELLIGENCE — 6-PHASE LIFECYCLE
═══════════════════════════════════════
Docstribe operates in real time across the entire inpatient encounter, not just at discharge.

PHASE 0–1: ADMISSION & H&P (Day 0)
CLINICAL EVENT: Admission & H&P signed. ED note often vague — SOB, chest pain. Assessment & Plan sets principal diagnosis. Principal DX locks MDC and DRG family.
DOCSTRIBE ACTION: Reads H&P within minutes. Extracts provisional ICD-10 codes. Computes baseline DRG via grouper. Fires CDI queries on Day 0 (not Day 3). Shows delta: e.g. DRG 195 ($8.6K) → DRG 871 ($16.6K) if AKI is documented.
MILESTONE: First DRG baseline set.

PHASE 2–3: DAILY ROUNDING CYCLE (24-hour refresh)
CLINICAL EVENT: Progress note signed (SOAP). New orders: labs, imaging, consults. Results return throughout the day. CDI queries answered by physician.
DOCSTRIBE ACTION: Recomputes DRG on every new signal. Delta ICD codes vs. yesterday. Maps orders to undocumented diagnoses. Example: Lab creatinine 3.2 → AKI? Document it. Revenue delta tracked: e.g. +$4,200 today.
MILESTONE: DRG recomputed daily — revenue visibility in real time.

PHASE 4: LOS vs. GMLOS MONITOR
CLINICAL EVENT: If LOS > GMLOS → patient is likely under-coded. Clinical complexity exceeds documentation.
DOCSTRIBE ACTION: LOS Paradox Detection. Day 4 / GMLOS 2.5 — 1.5 days past. Alert: document complexity or expedite discharge to protect margin.
MILESTONE: Documentation gap alert fired before the stay becomes a loss.

PHASE 5: DISCHARGE SUMMARY (Where 40–60% of DRG value is lost)
CLINICAL EVENT: Discharge summary signed. 40–60% of DRG value is lost here. Physicians omit treated conditions. Confirmed diagnoses never formally listed.
DOCSTRIBE ACTION: Cross-references entire chart — all notes, consults, orders, results. Surfaces conditions treated but not documented. Computes final DRG. Generates pre-bill defense brief.
MILESTONE: Final DRG locked. Clean claim ready.

PHASE 6: CODING & CLAIM SUBMISSION
CLINICAL EVENT: Clean chart → clean code → clean claim.
DOCSTRIBE ACTION: Physician pattern learning. Per-physician CDI profile built. Accuracy improves with every admission. System learns which physicians under-document which DX categories.
MILESTONE: 99% clean claim rate. CMI improves over time.

KEY STATS FROM THE DRG LIFECYCLE:
- Day 0: First CDI query fired (vs. industry standard Day 3+)
- 24h: DRG refresh cycle
- 100%: Chart coverage at discharge
- 40–60%: Revenue loss prevented at discharge summary

═══════════════════════════════════════
THE SOLUTION — 4 CONTROL TOWERS ON ONE DATA MODEL
═══════════════════════════════════════
The core insight: collapse every silo into one unified data model.
Auth/UM → Care → Claim → Cash — one connected thread.

CONTROL TOWER 01: UM Control Tower (Utilization Management)
- Manages the full case management workflow end-to-end
- Concurrent & retrospective review automation
- Denied days identification and reduction
- UM approval turnaround optimization (real-time tracking)
- Ensures every admission is properly authorized before it becomes a denial
- Prevents downstream denials at the point of origin
- Key outcome: 2x UM approval speed

CONTROL TOWER 02: CDI & Medical Necessity Co-Pilot (Clinical Documentation Integrity)
- AI engine working alongside physicians during the actual encounter
- Real-time documentation gap detection and flagging
- Medical necessity justification support
- Observation vs. inpatient status optimization
- DRG downgrade prevention
- Complete charge capture assurance
- Reduces physician documentation burden while improving accuracy
- Key outcome: 20% fewer DRG downgrades

CONTROL TOWER 03: Denials & Underpayment Control Tower
- Root-cause denial analysis (not just surface-level categorization)
- Automated appeal letter generation — no human drafting needed
- Clean claim rate tracking across all payers
- Underpayment pattern detection across payer portfolios
- Appeal cycle time reduction
- Targets the 3 biggest denial drivers: authorization issues, eligibility/COB, medical necessity
- Key outcome: 50% reduction in avoidable denial dollars

CONTROL TOWER 04: Contract Yield Engine
- Audits 100% of payments against contracted rate grids (no sampling)
- Payment variance detection and alerting
- Dispute resolution acceleration
- Payer-specific rule enforcement
- Systematic underpayment recovery
- Ensures hospitals are paid exactly what they contracted for — every time
- Key outcome: 25% of leaked revenue recovered

═══════════════════════════════════════
PATIENT REVENUE JOURNEY
═══════════════════════════════════════
Auth/UM → Care → Claim → Cash

Phase 1 (Auth/UM): Is this admission properly authorized? Is medical necessity documented?
Phase 2 (Care): Is clinical documentation capturing the full clinical picture?
Phase 3 (Claim): Is the claim going out clean? Will it get denied?
Phase 4 (Cash): Was the payment correct? Are we leaving money on the table?

Docstribe's single data model connects all four — so a flag raised in Phase 1
automatically informs Phase 3 coding and Phase 4 auditing.

═══════════════════════════════════════
GUARANTEED OUTCOMES — 4-WEEK PILOT COMMITMENT
═══════════════════════════════════════
These are not aspirational targets. They are measurable commitments proven in production.

DRG-specific outcomes:
- 99%  Clean Claim Rate (all care settings, all payers — first-pass)
- +10% Charge Capture Uplift (outpatient — missed charges, under-coded E&M, bundling errors caught)
- +0.05 CMI Uplift per discharge (inpatient — CC/MCC gaps, DRG weight optimization)
- $8–14M Projected annual impact at major health system scale (conservative estimate)

Legacy outcomes (India/UAE deployments):
- 25%  Revenue Leakage Recovered (charge capture + underpayments)
- 50%  Reduction in Avoidable Denial Dollars
- 20%  Reduction in DRG & OBS Downgrades
- 18x  Average ROI across all hospital deployments

4-WEEK PILOT STRUCTURE:
Week 1: Epic staging connect, payer contract ingestion, baseline charge capture rate
Week 2: AI agents on live charts — missed charges, DRG gaps, HCC recapture flagged
Week 3: Side-by-side comparison — DRG accuracy on IP sample, charge capture delta
Week 4: CCR, CMI, and charge capture deltas quantified — go/no-go recommendation
Cost: Zero. Outcome-driven decision. What HM provides: Epic staging access + chart samples + payer contract data.

═══════════════════════════════════════
COMMERCIAL MODEL — PAY ONLY ON SUCCESS
═══════════════════════════════════════
This is the most important commercial innovation in the RCM market:
- 60-day FREE pilot — zero cost to start, zero commitment
- Pay ONLY when Docstribe delivers measurable financial improvement
- No license fees. No per-user fees. No upfront costs.
- ROI is contractually guaranteed — not a marketing claim
- This model eliminates ALL adoption risk for the hospital

Why this matters: Hospitals have been burned by vendors who over-promise and
under-deliver. Docstribe removes that risk entirely. We only win if you win.

═══════════════════════════════════════
PROVEN AT SCALE — NOT A PROTOTYPE
═══════════════════════════════════════
- 100+ hospitals across India, USA & UAE
- 10M+ lives actively managed on the platform
- $100M+ in attributable revenue growth for hospital partners
- Service-line growth delivered in: Cardiac, Oncology, Nephrology, Neurology, Orthopedics
- Average 18x ROI across all deployments
- Battle-tested across diverse health systems, payer environments, regulatory frameworks

We are NOT entering the US market to learn. We are entering to deliver.

═══════════════════════════════════════
THE STRUCTURAL MOAT
═══════════════════════════════════════
MOAT 1 — Single Data Model:
Every clinical event, authorization decision, coding output, and payer interaction
in ONE connected layer. Insights from UM review (Phase 1) automatically inform coding
(Phase 3) and contract auditing (Phase 4). Revenue leakage is intercepted at origin.

MOAT 2 — Outcome-Guaranteed Commercial Model:
Pay-on-success removes all adoption friction. No other RCM vendor offers this at scale.

MOAT 3 — Battle-Tested at Scale:
Not a startup pitching slides. Deployed, running, delivering results. 100+ hospitals.

═══════════════════════════════════════
FOUNDING TEAM
═══════════════════════════════════════
Akash Manu Srivastava — Co-founder & CEO
  15+ years building healthcare technology businesses.
  Scaled multiple healthcare IT platforms across India and GCC.
  Contact: akash@docstribe.com

Rishav Sharma — Co-founder & CTO
  Architect behind Docstribe's AI infrastructure and unified data model.
  Expert in healthcare data systems, ML-powered clinical workflows.
  Contact: rishav@docstribe.com

Dr. Angeline — Chief Clinical Advisor
  Former Joint Director, Government of India. JIPMER & RCS alumna.
  25+ years frontline clinical leadership.

Dr. Amir Bacchus — Clinical Strategy Advisor
  Founder of P3 Health. 25+ years clinical operations, value-based care pioneer.

Combined team: 30+ years business leadership, 50+ years clinical expertise.

The team didn't build software and go looking for a problem. They lived the problem —
and then built the software.

═══════════════════════════════════════
WHY THE US MARKET, WHY NOW
═══════════════════════════════════════
- US hospitals face rising denial rates, growing payer complexity
- Chronic shortage of skilled RCM labor — automation is a necessity, not a luxury
- AI adoption in healthcare is accelerating — health systems need ROI in weeks, not years
- Docstribe enters with: proven platform + compliance stack + pay-on-success model
- HITRUST, HIPAA, SOC 2 Type II — ready for US enterprise health systems on day one

═══════════════════════════════════════
SERVICE LINES WHERE DOCSTRIBE EXCELS
═══════════════════════════════════════
Proven growth in: Cardiac · Oncology · Nephrology · Neurology · Orthopedics
These are high-acuity, documentation-intensive service lines where CDI and UM
accuracy have the highest revenue impact.

═══════════════════════════════════════
THE LONG-TERM VISION
═══════════════════════════════════════
Revenue Cycle. On Autopilot.

A future where every clinical encounter is automatically documented with the right
level of specificity. Every authorization is proactively managed. Every claim is
submitted clean on the first pass. Every payment is audited against contracted rates.
Every variance is resolved without human intervention.

This is not a distant aspiration — it's the direction every module is building toward.

Thynk Growth = Thynk Docstribe.
`;

export default KNOWLEDGE_BASE;
