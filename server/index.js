import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { KNOWLEDGE_BASE } from './knowledge.js';

config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
const GEMINI_TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// ── System prompt ──────────────────────────────────────────────────────────────
const buildSystemPrompt = (pageContext) => `
You are RUDRA, Docstribe AI's intelligent product guide embedded on the website.
RUDRA stands for Revenue Understanding & Decision-support Reasoning Agent — but your presence is more than the acronym.
Named after Shiva's fierce, transformative aspect, you cut through complexity and reveal truth.

PERSONA:
- You are a senior healthcare technology strategist with deep expertise in DRG optimization, CDI workflows, and inpatient revenue integrity
- You understand the physician-documentation gap at a clinical level: you know what a CC/MCC means for DRG weight, what LOS paradox looks like, and why discharge summaries are where 40–60% of DRG value dies
- Tone: incisive, confident, warm — you've seen hospitals lose millions in DRG downgrades and you know exactly how to stop it
- Natural, direct — like a trusted revenue integrity advisor who respects the visitor's time
- Never sound like a call center script or a product brochure read aloud
- Never use hollow phrases like "absolutely!", "great question!", "certainly!"
- When explaining processes, be specific and thorough — walk through the mechanism, the clinical signal, and the revenue impact
- Always end with a natural conversation hook — a question, or an offer to go deeper on a specific phase

CORE NARRATIVE (lead with this when relevant):
"Documentation AI is deployed. Denial AI is deployed against you. Revenue integrity AI — the layer that converts clinical documentation into the correct DRG — is what's missing. That's exactly what Docstribe delivers."

THE PHYSICIAN-GROUPER GAP:
The physician writes for clinical communication. The DRG grouper reads for financial classification.
That gap is where all revenue leakage lives. Docstribe sits exactly in that gap — reading every clinical document at the moment it is signed, recomputing the DRG in real time, firing CDI queries on Day 0.

KNOWLEDGE BASE (only cite from this — never hallucinate metrics or features):
${KNOWLEDGE_BASE}

CURRENT PAGE CONTEXT:
${pageContext || 'Visitor is on the Docstribe Dynamic DRG Intelligence website.'}

CONVERSATION RULES:
1. Lead with the DRG gap narrative when someone asks what Docstribe does
2. When explaining the DRG lifecycle, walk through phases: H&P → Daily Rounding → LOS Monitor → Discharge → Coding — be specific about what Docstribe does at each phase
3. When someone asks about CDI: explain Day 0 queries, 24h DRG refresh, physician pattern learning
4. When someone asks about the pilot: explain the 4-week structure — Epic connect, live charts, DRG accuracy comparison, quantified delta
5. When someone asks about pricing: zero cost pilot, pay only on measurable financial improvement
6. When someone is skeptical: use specific proof — Day 0 CDI queries catch what Day 3 misses, discharge cross-reference prevents 40–60% value loss
7. When someone asks for a demo or meeting: tell them to email akash@docstribe.com or rishav@docstribe.com
8. If you don't know something: say "I'd connect you with our team for that — they'll have the specifics"
9. NEVER fabricate features, metrics, or case study details not in the knowledge base

RESPONSE FORMAT:
Plain conversational text only. No markdown headers, no bullet lists, no asterisks.
Speak like a human, not like a document.
Explain processes fully — don't truncate your answer mid-thought. If a process has multiple steps, walk through all of them.
`.trim();

// ── PCM → WAV conversion ───────────────────────────────────────────────────────
function pcmBase64ToWavBase64(pcmBase64, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const pcmBuffer = Buffer.from(pcmBase64, 'base64');
  const dataLength = pcmBuffer.length;
  const wavBuffer = Buffer.alloc(44 + dataLength);
  let o = 0;

  wavBuffer.write('RIFF', o); o += 4;
  wavBuffer.writeUInt32LE(36 + dataLength, o); o += 4;
  wavBuffer.write('WAVE', o); o += 4;
  wavBuffer.write('fmt ', o); o += 4;
  wavBuffer.writeUInt32LE(16, o); o += 4;          // chunk size
  wavBuffer.writeUInt16LE(1, o); o += 2;            // PCM format
  wavBuffer.writeUInt16LE(channels, o); o += 2;
  wavBuffer.writeUInt32LE(sampleRate, o); o += 4;
  wavBuffer.writeUInt32LE(sampleRate * channels * (bitsPerSample / 8), o); o += 4;
  wavBuffer.writeUInt16LE(channels * (bitsPerSample / 8), o); o += 2;
  wavBuffer.writeUInt16LE(bitsPerSample, o); o += 2;
  wavBuffer.write('data', o); o += 4;
  wavBuffer.writeUInt32LE(dataLength, o); o += 4;
  pcmBuffer.copy(wavBuffer, o);

  return wavBuffer.toString('base64');
}

// ── Text generation ────────────────────────────────────────────────────────────
async function generateText(message, history, pageContext) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');

  const contents = [
    ...history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const res = await fetch(
    `${GEMINI_BASE}/${GEMINI_TEXT_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(pageContext) }] },
        contents,
        generationConfig: { temperature: 0.75, maxOutputTokens: 1500 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini text error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No text in Gemini response');
  return text.trim();
}

// ── Sentence splitter ──────────────────────────────────────────────────────────
// Splits text at sentence boundaries so each TTS chunk stays within Gemini's
// audio-generation budget — prevents mid-sentence cutoff.
function splitSentences(text) {
  // Match sequences ending in . ! ? (including ellipsis …) followed by space or end
  const raw = text.match(/[^.!?…]+[.!?…]+\s*/g) || [text];
  // Merge very short fragments (<25 chars) with the next sentence for natural pacing
  const merged = [];
  let carry = '';
  for (const s of raw) {
    carry += s;
    if (carry.trim().length >= 25) { merged.push(carry.trim()); carry = ''; }
  }
  if (carry.trim()) merged.push(carry.trim());
  return merged.filter(Boolean);
}

// ── Single TTS chunk → raw PCM Buffer ─────────────────────────────────────────
async function ttsChunk(sentence) {
  const res = await fetch(
    `${GEMINI_BASE}/${GEMINI_TTS_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: sentence }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
          },
        },
      }),
    }
  );
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data?.error?.message || `HTTP ${res.status}`);
  const pcmBase64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!pcmBase64) throw new Error('No PCM data in TTS response');
  return Buffer.from(pcmBase64, 'base64');
}

// ── TTS generation — sentence-split + PCM concatenation ───────────────────────
// Each sentence is synthesised separately (guaranteeing completion), then the
// raw L16 PCM buffers are concatenated before wrapping in a single WAV header.
async function generateAudio(text) {
  if (!GEMINI_API_KEY) return null;

  const sentences = splitSentences(text);
  try {
    // Parallel synthesis — one request per sentence, all within budget
    const pcmBuffers = await Promise.all(sentences.map(s => ttsChunk(s)));
    const allPcm = Buffer.concat(pcmBuffers);          // raw L16 concatenation
    return pcmBase64ToWavBase64(allPcm.toString('base64'));
  } catch (err) {
    console.warn('TTS failed (non-fatal):', err.message);
    return null;
  }
}

// ── Visual tool-call generator ─────────────────────────────────────────────────
// Asks Gemini to pick the best visual widget and populate its data from the spoken text.
// Runs in parallel with TTS so it adds zero perceived latency.
async function generateVisualTool(spokenText, context) {
  if (!GEMINI_API_KEY) return null;

  // Use explicit pain-point context as primary signal (high confidence),
  // fall back to keyword scanning the spoken text for chat responses.
  const ctxOnly  = context.toLowerCase();          // "Pain point: Prior Auth Delays" etc.
  const textOnly = spokenText.toLowerCase();
  const ctx      = ctxOnly + ' ' + textOnly;       // combined for fallback matching
  let type, data;

  // Priority: DRG/H&P/CDI → Daily Rounding/LOS → Discharge/Coding → Outcomes/Pilot → default
  if (/h&p|admission|day 0|cdi query|day zero|h&p phase|baseline drg|icd.?10|principal dx|mdc/i.test(ctxOnly) ||
      /h&p|day 0|cdi query|baseline drg/i.test(textOnly)) {
    type = 'phase_breakdown';
    data = {
      phase: 0, phaseName: 'H&P & Day 0 CDI — Revenue Clock Starts',
      problem: 'The physician writes for clinical communication. The DRG grouper reads for financial classification. That gap costs hospitals millions per year.',
      steps: [
        'H&P ingested within minutes of physician signature',
        'Provisional ICD-10 codes extracted; MDC and DRG family locked',
        'Baseline DRG computed via grouper — revenue baseline established',
        'CDI queries fired Day 0 — not Day 3 like traditional CDI workflows',
        'DRG delta surfaced immediately: e.g. DRG 195 ($8.6K) → DRG 871 ($16.6K) if AKI documented',
      ],
      tags: ['Day 0 CDI', 'DRG Grouper', 'ICD-10 Extraction', 'CDI Query Engine'],
      outcome: 'First DRG baseline set on admission day. Revenue opportunity identified before the next rounds.',
    };
  } else if (/daily round|24h|24.hour|rounding|los|gmlos|los paradox|progress note|soap|signal/i.test(ctxOnly) ||
             /daily round|rounding|24h|los paradox|gmlos/i.test(textOnly)) {
    type = 'phase_breakdown';
    data = {
      phase: 1, phaseName: 'Daily Rounding — 24-Hour DRG Refresh',
      problem: 'Every clinical event that goes undocumented is revenue left behind. DRG accuracy compounds daily across the entire stay.',
      steps: [
        'DRG recomputed on every new clinical signal — progress notes, labs, consults',
        'Delta ICD codes compared vs. prior day — new diagnoses surfaced automatically',
        'Lab values mapped to undocumented diagnoses (e.g. creatinine 3.2 → AKI query)',
        'Revenue delta tracked in real time — e.g. +$4,200 today from newly documented CC',
        'LOS Paradox Detection: if LOS > GMLOS, alert fired — document complexity or expedite discharge',
      ],
      tags: ['24h DRG Refresh', 'LOS Monitor', 'Lab-to-DX Mapping', 'CDI Escalation'],
      outcome: 'DRG recomputed daily. Revenue delta visible. No more end-of-stay surprises.',
    };
  } else if (/discharge|coding|pre.bill|cdi profile|chart coverage|discharge summary|final drg/i.test(ctxOnly) ||
             /discharge|discharge summary|pre.bill|final drg/i.test(textOnly)) {
    type = 'phase_breakdown';
    data = {
      phase: 2, phaseName: 'Discharge & Coding — Locking the Final DRG',
      problem: '40–60% of DRG value is lost at the discharge summary. Physicians omit treated conditions. Confirmed diagnoses go unlisted. Docstribe closes this gap.',
      steps: [
        'Entire chart cross-referenced at discharge: all notes, consults, orders, results',
        'Conditions treated but not listed surfaced — e.g. 5 diagnoses treated, 3 documented',
        'Final DRG computed with full clinical picture — maximum defensible reimbursement',
        'Payer-specific pre-bill defense brief generated before claim drops',
        'Per-physician CDI profile built — accuracy improves with every admission',
      ],
      tags: ['Discharge AI', 'Pre-Bill Brief', 'CDI Profile', '100% Chart Coverage'],
      outcome: '40–60% of DRG revenue loss at discharge prevented. 99% clean claim rate.',
    };
  } else if (/cdi|coding|drg downgrade|cmr|cc.mcc|hcc|charge capture|coding gap/i.test(ctxOnly) ||
             /cdi|drg downgrade|cc.mcc|hcc|charge capture/i.test(textOnly)) {
    type = 'phase_breakdown';
    data = {
      phase: 1, phaseName: 'CDI & DRG Optimization — Mid-Stay',
      problem: 'DRG downgrades and CC/MCC capture gaps represent the single largest avoidable revenue loss in inpatient settings.',
      steps: [
        'Real-time CDI query generation — targeted to physician, diagnosis, and payer',
        'CC/MCC gap detection across every active inpatient encounter',
        'DRG weight prediction per documentation scenario presented to CDI team',
        'HCC recapture for Medicare Advantage lives — RAF score optimization',
        'Charge capture validation: missed charges, under-coded E&M, bundling errors caught pre-bill',
      ],
      tags: ['CDI Engine', 'CC/MCC Capture', 'HCC Recapture', 'DRG Optimizer'],
      outcome: '+0.05 CMI uplift per discharge. +10% charge capture. 57% reduction in DRG downgrades.',
    };
  } else if (/denial|appeal|underpay|reconcil|payer ai|payer recovery/i.test(ctxOnly) ||
             /denial|appeal|underpayment|reconcil/i.test(textOnly)) {
    type = 'comparison_table';
    data = {
      title: 'Docstribe vs. Payer AI — Who Wins',
      rows: [
        { metric: 'DRG Defense',         before: 'Payer AI challenges at adjudication', after: 'Pre-bill brief defends before claim drops' },
        { metric: 'CDI Timing',          before: 'Day 3+ CDI review (too late)',         after: 'Day 0 CDI queries — physician still available' },
        { metric: 'Discharge Summary',   before: '40–60% of DRG value abandoned',        after: '100% chart cross-reference, full DRG locked' },
        { metric: 'Denial Rate',         before: '15.1% industry average',               after: '99% clean claim rate target' },
        { metric: 'CMI Uplift',          before: 'Baseline',                             after: '+0.05 per discharge at scale' },
      ],
    };
  } else if (/roi|outcome|result|pilot|4.week|cmi|ccr|charge capture|impact|8.14m|projected/i.test(ctx)) {
    type = 'stats_grid';
    data = {
      title: 'Pilot Outcome Commitments',
      stats: [
        { label: 'Clean Claim Rate',    value: '99%',    delta: 'all payers, all care settings', color: '#00cba8' },
        { label: 'Charge Capture',      value: '+10%',   delta: 'outpatient — missed charges caught', color: '#4d8aff' },
        { label: 'CMI Uplift',          value: '+0.05',  delta: 'per discharge — CC/MCC gaps closed', color: '#ff7b4a' },
        { label: 'Annual Impact',       value: '$8–14M', delta: 'conservative estimate at HM scale',  color: '#a78bfa' },
      ],
    };
  } else {
    // Default: DRG lifecycle comparison
    type = 'comparison_table';
    data = {
      title: 'Before vs. After Docstribe DRG Intelligence',
      rows: [
        { metric: 'CDI Timing',          before: 'Day 3+ (too late to fix)',    after: 'Day 0 — H&P ingested within minutes' },
        { metric: 'DRG Refresh',         before: 'Once at discharge',           after: 'Every 24 hours on every new signal'   },
        { metric: 'Discharge Summary',   before: '40–60% revenue abandoned',    after: '100% chart cross-referenced, DRG locked' },
        { metric: 'LOS Paradox',         before: 'Not detected until billing',  after: 'Flagged in real time with action prompt' },
        { metric: 'Clean Claim Rate',    before: '82–85% industry average',     after: '99% target — pre-bill defense brief'  },
      ],
    };
  }

  return { type, data };
}

// ── /api/chat ──────────────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, history = [], pageContext = '' } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const text = await generateText(message, history, pageContext);

    // Audio + visual tool call in parallel — zero extra latency
    const [audio, visual] = await Promise.all([
      generateAudio(text).catch(() => null),
      generateVisualTool(text, `Chat: "${message}" | Context: ${pageContext}`).catch(() => null),
    ]);

    res.json({ text, audio, visual });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── /api/greet ─────────────────────────────────────────────────────────────────
// Pre-generate the opening greeting (called once on widget open)
app.post('/api/greet', async (req, res) => {
  const { pageContext = '' } = req.body;

  const greeting =
    "I'm RUDRA — Docstribe's Dynamic DRG Intelligence agent. Here's the core problem I solve: the physician writes for clinical communication, the DRG grouper reads for financial classification — and that gap is where your revenue leaks. Docstribe sits exactly in that gap, reading every clinical document the moment it's signed, recomputing the DRG in real time, and firing CDI queries on Day 0 — not Day 3 when it's too late to act. What would you like to understand first — the H&P phase, the daily rounding cycle, or what happens at discharge where forty to sixty percent of DRG value is typically abandoned?";

  try {
    const audio = await generateAudio(greeting);
    res.json({ text: greeting, audio });
  } catch {
    res.json({ text: greeting, audio: null });
  }
});

// ── /api/briefing ─────────────────────────────────────────────────────────────
// Personalized opening briefing based on role + pain point (wizard step 3)
app.post('/api/briefing', async (req, res) => {
  const { role = 'healthcare professional', painPoint = 'revenue cycle challenges' } = req.body;

  const personalizedPrompt =
    `You are briefing a ${role} about Docstribe's Dynamic DRG Intelligence platform. ` +
    `Give a sharp, personalized 4-6 sentence overview of how Docstribe directly solves "${painPoint}" for health systems. ` +
    `Lead with the core insight: the physician writes for clinical communication, the DRG grouper reads for financial classification — that gap is where all revenue leakage lives. ` +
    `Be specific — reference real mechanisms like Day 0 CDI queries, the 24-hour DRG refresh cycle, LOS paradox detection, discharge summary cross-referencing, ` +
    `per-physician CDI profile learning, and the 4-week pilot structure (Epic connect → live charts → DRG accuracy comparison → quantified delta). ` +
    `Reference real proof points: 99% clean claim rate, +0.05 CMI uplift, +10% charge capture, $8-14M projected impact at scale. ` +
    `Close with one clear, natural question that invites them to go deeper on a specific phase of the DRG lifecycle.`;

  try {
    const text = await generateText(
      personalizedPrompt,
      [],
      `Visitor is a ${role} focused on: ${painPoint}`
    );

    // Audio + visual tool call in parallel
    const [audio, visual] = await Promise.all([
      generateAudio(text).catch(() => null),
      generateVisualTool(text, `Role: ${role} | Pain point: ${painPoint}`).catch(() => null),
    ]);

    res.json({ text, audio, visual });
  } catch (err) {
    console.error('Briefing error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── /api/tour ─────────────────────────────────────────────────────────────────
// Returns 3 sequential narration segments — one per revenue cycle phase
// Frontend plays them one-by-one while Shakti highlights each phase
app.post('/api/tour', async (req, res) => {
  const { role = 'healthcare professional' } = req.body;

  const phasePrompts = [
    {
      phase: 0,
      prompt: `You are narrating Phase 1 of Docstribe's Dynamic DRG Intelligence platform to a ${role}. This phase covers Admission and H&P — the moment the revenue clock starts. Explain clearly and fully: when a physician signs the H&P, Docstribe reads it within minutes, extracts provisional ICD-10 codes, computes the baseline DRG through the grouper, and fires CDI queries on Day 0 — not Day 3 like traditional CDI. Walk through a real example: an ED note says SOB and chest pain. The Assessment and Plan sets heart failure as the principal diagnosis. Docstribe immediately sees the baseline DRG at one reimbursement level, but detects that if AKI is documented, the DRG shifts to a significantly higher value. The CDI query goes to the physician the same day. Speak naturally and thoroughly, as if walking the visitor through the actual clinical moment. No bullet points. End with what happens next — the daily rounding phase.`,
    },
    {
      phase: 1,
      prompt: `You are narrating Phase 2 of Docstribe's Dynamic DRG Intelligence platform to a ${role}. This phase covers Daily Rounding — the 24-hour DRG refresh cycle that runs throughout the entire inpatient stay. Explain clearly: every time a new progress note is signed, a lab comes back, an imaging order is placed, or a consult note lands — Docstribe recomputes the DRG. It maps orders to undocumented diagnoses. A creatinine of 3.2 triggers a CDI query for AKI. A consult note mentioning protein malnutrition triggers a query for that secondary diagnosis. Each documented condition shifts the DRG weight and the revenue delta is tracked in real time. Also explain LOS Paradox Detection: when a patient's length of stay exceeds their geometric mean LOS, Docstribe fires an alert — the patient is likely under-coded. Clinical complexity is exceeding documentation. The system prompts: either document the complexity or expedite discharge. Speak naturally. No bullet points. End with what happens at discharge.`,
    },
    {
      phase: 2,
      prompt: `You are narrating Phase 3 of Docstribe's Dynamic DRG Intelligence platform to a ${role}. This phase covers Discharge Summary and Coding — where forty to sixty percent of DRG value is silently abandoned. Explain this clearly and with impact: when a physician writes the discharge summary, they write for clinical communication. They omit conditions that were treated but were incidental to the primary story. They leave out confirmed diagnoses that appear in consult notes. Those omissions cost the hospital real DRG revenue. Docstribe cross-references the entire chart at discharge — every progress note, every consult, every lab, every imaging result, every order. It surfaces the conditions that were treated but not formally listed. It computes the final correct DRG. It generates a pre-bill defense brief — a payer-specific document that justifies the DRG before the claim drops. And then it does something long-term: it builds a per-physician CDI profile, so over time the system learns which physicians under-document which diagnosis categories, and the queries get more targeted with every admission. Speak naturally and fully. No bullet points.`,
    },
  ];

  try {
    const segments = await Promise.all(
      phasePrompts.map(async ({ phase, prompt }) => {
        const text = await generateText(prompt, [], `Visitor is a ${role}`);
        let audio = null;
        try { audio = await generateAudio(text); } catch (e) {
          console.warn(`Tour phase ${phase} TTS failed:`, e.message);
        }
        return { phase, text, audio };
      })
    );
    res.json({ segments });
  } catch (err) {
    console.error('Tour error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    apiKey: GEMINI_API_KEY ? 'set' : 'MISSING — add GEMINI_API_KEY to .env',
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🤖 Docstribe Agent Server running at http://localhost:${PORT}`);
  console.log(`   Gemini key: ${GEMINI_API_KEY ? '✅ set' : '❌ MISSING — create .env'}\n`);
});
