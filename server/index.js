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
- You are a senior healthcare technology strategist with 10+ years in revenue cycle transformation
- Tone: incisive, confident, warm — you've seen hospitals hemorrhage revenue and you know exactly how to stop it
- Natural, direct — like a trusted advisor who respects the visitor's time
- Never sound like a call center script or a product brochure read aloud
- Never use hollow phrases like "absolutely!", "great question!", "certainly!"
- Keep responses concise: 2-4 sentences max unless the visitor asks for detail
- Always end with a natural conversation hook — a question, or an offer to go deeper

KNOWLEDGE BASE (only cite from this — never hallucinate metrics or features):
${KNOWLEDGE_BASE}

CURRENT PAGE CONTEXT:
${pageContext || 'Visitor is on the Docstribe AI website homepage.'}

CONVERSATION RULES:
1. Start broad (what brings you here?), then tailor as you learn more
2. Adapt depth: elevator pitch → detailed → technical based on signals
3. When someone asks about pricing: explain the pay-only-on-success model, 60-day free pilot
4. When someone is skeptical: use proof points (100+ hospitals, 18x ROI, $100M+ revenue growth)
5. When someone asks for a demo or meeting: tell them to email akash@docstribe.com or rishav@docstribe.com
6. If you don't know something: say "I'd connect you with our team for that — they'll have the specifics"
7. NEVER fabricate features, metrics, or case study details not in the knowledge base

RESPONSE FORMAT:
Plain conversational text only. No markdown headers, no bullet lists, no asterisks.
Speak like a human, not like a document.
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
        generationConfig: { temperature: 0.75, maxOutputTokens: 700 },
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

  // Priority order: auth → CDI/DRG → denial/underpay → ROI → default
  // Auth checked BEFORE denial because denial text often mentions "auth" incidentally
  if (/prior auth|auth delay|eligib|front.?end|payor|intake/i.test(ctxOnly) ||
      (/prior auth|authorization|eligib/i.test(textOnly) && !/denial|underpay|back.?end/i.test(ctxOnly))) {
    type = 'phase_breakdown';
    data = {
      phase: 0, phaseName: 'Front End — Payor Intelligence',
      problem: 'Authorization failures and eligibility gaps block revenue before the encounter even begins.',
      steps: [
        'Parse every payor contract into plan-specific prior auth rule sets',
        'Validate medical necessity criteria per visit type before admission',
        'Real-time eligibility verification at scheduling and check-in',
        'Fee schedule loaded per payer — no write-off surprises at payment',
      ],
      tags: ['Living Rulebook', 'Prior Auth Engine', 'Eligibility Check', 'Contract Parser'],
      outcome: 'Auth-related denials drop 60%+ in the first 60 days of deployment.',
    };
  } else if (/cdi|coding|drg|cpt|modifier|mid.?cycle|documentation|charge|claim/i.test(ctxOnly) ||
             /cdi|drg|coding gap|cpt|modifier/i.test(textOnly)) {
    type = 'phase_breakdown';
    data = {
      phase: 1, phaseName: 'Mid Cycle — Clinical Intelligence',
      problem: 'Coding gaps and DRG downgrades leave significant revenue on the table at every encounter.',
      steps: [
        'Validate every clinical note against ICD-10, CPT, DRG rules before bill drops',
        'Auto-suggest CDI queries to physicians for missing diagnoses',
        'Flag high-risk DRG pairs likely to trigger auditor scrutiny',
        'Route work packets to UM, CDI, Coding & Billing queues with context',
      ],
      tags: ['CDI Engine', 'DRG Optimizer', 'CPT / Modifier Edit', 'Charge Capture'],
      outcome: 'Case mix index improves 0.15–0.25 points; coding accuracy hits 98%+.',
    };
  } else if (/denial|appeal|remit|underpay|reconcil|back.?end|recovery/i.test(ctxOnly) ||
             /denial|appeal|underpayment|reconcil/i.test(textOnly)) {
    type = 'phase_breakdown';
    data = {
      phase: 2, phaseName: 'Back End — Revenue Integrity',
      problem: 'Denials and underpayments silently erode collected revenue every month.',
      steps: [
        'ERA reconciliation vs. contract-owed amounts',
        'Auto-flag underpayments with contract clause citations',
        'AI-generated denial appeal letters with payer evidence attached',
        'Variance fed back to Living Rulebook — same leak never recurs',
      ],
      tags: ['Living Rulebook', 'ERA Reconcile', 'Denial Appeals', 'Underpayment Recovery'],
      outcome: 'Hospitals recover $100M+ in previously lost revenue within 12 months.',
    };
  } else if (/roi|return|invest|18x|outcome|result|pilot|60.?day/i.test(ctx)) {
    type = 'stats_grid';
    data = {
      title: 'Guaranteed Outcomes',
      stats: [
        { label: 'Average ROI',          value: '18×',    delta: 'vs. cost of deployment', color: '#00cba8' },
        { label: 'Revenue Recovered',    value: '$100M+', delta: 'across live deployments', color: '#4d8aff' },
        { label: 'Pilot to Live',        value: '60 Days', delta: 'no long implementation', color: '#ff7b4a' },
        { label: 'Hospitals Deployed',   value: '100+',   delta: 'live production systems', color: '#a78bfa' },
      ],
    };
  } else {
    // Default: before/after comparison
    type = 'comparison_table';
    data = {
      title: 'Before vs. After Docstribe',
      rows: [
        { metric: 'Denial Rate',          before: '12–18%',  after: '<4%'       },
        { metric: 'Days to First Payment', before: '45–60d',  after: '18–22d'    },
        { metric: 'Coding Accuracy',       before: '82%',     after: '98%+'      },
        { metric: 'Auth Approval Rate',    before: '71%',     after: '94%+'      },
        { metric: 'Net Revenue Uplift',    before: 'baseline', after: '+18× ROI' },
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
    "I'm RUDRA — Docstribe's AI intelligence layer. I can walk you through exactly how our revenue assurance platform works, share real ROI numbers from live hospital deployments, or help you figure out if this is the right fit for your situation. What brings you here today?";

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
    `You are briefing a ${role}. Give a sharp, personalized 3-4 sentence overview of how Docstribe AI ` +
    `directly solves "${painPoint}" for health systems. Be specific — reference real mechanisms like the ` +
    `Living Rulebook, the four control towers (UM, CDI, Coding, Claims), the 60-day pilot model, 18x ROI, ` +
    `or $100M+ in recovered revenue. Close with one clear, natural question to continue the conversation.`;

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
      prompt: `You are narrating the FRONT END phase of a revenue cycle diagram to a ${role}. In exactly 2 crisp sentences: explain that Docstribe reads every payor contract, builds plan-specific prior auth and medical necessity rules, and catches authorization problems before a single claim is submitted. Be specific, not generic. No bullet points.`,
    },
    {
      phase: 1,
      prompt: `You are narrating the MID CYCLE phase of a revenue cycle diagram to a ${role}. In exactly 2 crisp sentences: explain that Docstribe validates every clinical note and order against the living rulebook, edits CPT, DRG, and modifier codes before the bill drops, and routes precise work packets to UM, CDI, coding, and billing. Be specific.`,
    },
    {
      phase: 2,
      prompt: `You are narrating the BACK END phase of a revenue cycle diagram to a ${role}. In exactly 2 crisp sentences: explain that Docstribe reconciles every remittance against what the contract owed, surfaces underpayments automatically, generates denial appeal letters with payer evidence attached, and feeds every variance back into the living rulebook so the same leak never happens twice. Mention the $100M+ recovered if natural.`,
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
