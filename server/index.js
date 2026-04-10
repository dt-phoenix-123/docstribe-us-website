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
        generationConfig: { temperature: 0.75 },
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

// ── LLM-powered artifact generator ────────────────────────────────────────────
// Asks Gemini to pick the best visual artifact type AND populate it from the KB.
// Runs in parallel with TTS — zero added latency.
async function generateArtifact(question, spokenText, role) {
  if (!GEMINI_API_KEY) return null;

  const prompt = `Based on this exchange, generate the BEST visual artifact to accompany RUDRA's explanation.

QUESTION / CONTEXT: "${question}"
RUDRA'S RESPONSE: "${spokenText.slice(0, 800)}"
VISITOR ROLE: ${role || 'healthcare professional'}

RESPOND WITH ONLY VALID JSON — no markdown code fences, no explanation, just the raw JSON object.

Choose ONE artifact type and populate it with SPECIFIC, ACCURATE data from the Docstribe DRG knowledge base:

TYPE "workflow" — for step-by-step process explanations (how Day 0 CDI works, rounding cycle, etc.)
{"type":"workflow","data":{"title":"...","steps":[{"num":"01","label":"...","detail":"...","color":"#00cba8"},{"num":"02","label":"...","detail":"...","color":"#4d8aff"},{"num":"03","label":"...","detail":"...","color":"#ff7b4a"},{"num":"04","label":"...","detail":"...","color":"#a78bfa"}]}}

TYPE "drg_delta" — for DRG computation examples with revenue impact (specific dollar amounts)
{"type":"drg_delta","data":{"title":"...","baseline":{"drg":"DRG XXX","label":"...","value":"$X,XXX"},"optimized":{"drg":"DRG XXX","label":"...","value":"$X,XXX"},"conditions":[{"name":"...","source":"...","delta":"+$X,XXX"},{"name":"...","source":"...","delta":"+$X,XXX"}],"totalDelta":"+$X,XXX"}}

TYPE "stats_grid" — for outcome metrics (CCR, CMI, charge capture, ROI questions)
{"type":"stats_grid","data":{"title":"...","stats":[{"label":"...","value":"...","delta":"...","color":"#00cba8"},{"label":"...","value":"...","delta":"...","color":"#4d8aff"},{"label":"...","value":"...","delta":"...","color":"#ff7b4a"},{"label":"...","value":"...","delta":"...","color":"#a78bfa"}]}}

TYPE "comparison_table" — for before/after or Docstribe vs current state questions
{"type":"comparison_table","data":{"title":"...","rows":[{"metric":"...","before":"...","after":"..."},{"metric":"...","before":"...","after":"..."},{"metric":"...","before":"...","after":"..."},{"metric":"...","before":"...","after":"..."},{"metric":"...","before":"...","after":"..."}]}}

TYPE "phase_breakdown" — for deep-diving ONE specific DRG lifecycle phase
{"type":"phase_breakdown","data":{"phase":0,"phaseName":"...","problem":"...","steps":["...","...","...","...","..."],"tags":["...","...","...","..."],"outcome":"..."}}

TYPE "lifecycle" — for full DRG overview (H&P to discharge, how it all works questions)
{"type":"lifecycle","data":{"title":"Dynamic DRG Intelligence","phases":[{"label":"H&P & Day 0 CDI","color":"#00cba8","steps":["...","...","...","..."]},{"label":"Daily Rounding","color":"#4d8aff","steps":["...","...","...","..."]},{"label":"Discharge & Coding","color":"#ff7b4a","steps":["...","...","...","..."]}]}}

SELECTION RULES:
- workflow → explaining HOW a process works step by step
- drg_delta → questions about DRG examples, specific revenue numbers, CC/MCC impact
- stats_grid → outcomes, ROI, pilot metrics, what will we measure
- comparison_table → before/after, what changes, competitive positioning
- phase_breakdown → deep dive on one specific phase of the lifecycle
- lifecycle → overview questions, intro-level, "how does it all work", "walk me through"

Use SPECIFIC numbers from the knowledge base. Never use placeholder text like "Step 1 description here". Populate every field with real, compelling DRG intelligence content.`;

  try {
    const res = await fetch(
      `${GEMINI_BASE}/${GEMINI_TEXT_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.25, maxOutputTokens: 2500 },
        }),
      }
    );
    const json = await res.json();
    let raw = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Strip markdown code fences if model wraps output
    raw = raw.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim();
    // Extract JSON object if there's surrounding text
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) raw = match[0];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Artifact generation failed (non-fatal):', err.message);
    return null;
  }
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
    const [audio, artifact] = await Promise.all([
      generateAudio(text).catch(() => null),
      generateArtifact(message, text, pageContext).catch(() => null),
    ]);

    res.json({ text, audio, visual: artifact });
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

// ── /api/intro ────────────────────────────────────────────────────────────────
// Powerful opening statement played immediately on widget open — no LLM needed
app.post('/api/intro', async (req, res) => {
  const introText = `Here's the problem no ambient AI has solved. The physician writes for clinical communication. The DRG grouper reads for financial classification. That gap — between what the doctor documents and what the payer pays — is where hospitals lose billions every year. Forty to sixty percent of DRG revenue evaporates at the discharge summary alone. Conditions treated but never listed. Diagnoses confirmed but never formally documented. Docstribe is the AI that sits exactly in that gap. Reading every H&P the moment it is signed. Recomputing the DRG every twenty-four hours on every new clinical signal. Firing CDI queries on Day 0, not Day 3 when the physician has already moved on. And at discharge, cross-referencing the entire chart — every note, every consult, every lab result — to lock the final DRG before the claim drops. The result: ninety-nine percent clean claim rate, point-zero-five CMI uplift per discharge, ten percent more charge capture. That is Dynamic DRG Intelligence. Live across a hundred-plus hospitals. Guaranteed by outcomes.`;

  const artifact = {
    type: 'lifecycle',
    data: {
      title: 'Dynamic DRG Intelligence',
      phases: [
        { label: 'H&P & Day 0 CDI',   color: '#00cba8', steps: ['H&P ingested within minutes', 'Baseline DRG computed via grouper', 'CDI queries fired Day 0 — not Day 3', 'ICD-10 extraction & MDC mapping'] },
        { label: 'Daily Rounding',     color: '#4d8aff', steps: ['DRG recomputed every 24 hours', 'Labs mapped to undocumented diagnoses', 'LOS paradox detection vs. GMLOS', 'Revenue delta tracked per signal'] },
        { label: 'Discharge & Coding', color: '#ff7b4a', steps: ['Entire chart cross-referenced', 'Omitted diagnoses surfaced', 'Final DRG locked pre-submission', 'Pre-bill defense brief generated'] },
      ],
    },
  };

  try {
    const audio = await generateAudio(introText);
    res.json({ text: introText, audio, artifact });
  } catch (err) {
    res.json({ text: introText, audio: null, artifact });
  }
});

// ── /api/role-greeting ────────────────────────────────────────────────────────
// Tailored greeting after user identifies their role — leads directly into chat
app.post('/api/role-greeting', async (req, res) => {
  const { role = 'healthcare professional' } = req.body;

  const greetingPrompt = `A ${role} just watched Docstribe's Dynamic DRG Intelligence intro. ` +
    `In 3-5 sentences, speak directly to them. Acknowledge what DRG intelligence means for their specific role. ` +
    `Reference one specific mechanism that is most relevant to their work — for a CDI Director it might be Day 0 queries and physician pattern learning; ` +
    `for a CFO it might be the CMI uplift and charge capture delta; for a physician it might be how the CDI query arrives before rounds and specifically what triggers it. ` +
    `Close with one sharp open question about their current situation or biggest challenge. ` +
    `Speak like a peer, not a vendor. No filler phrases.`;

  try {
    const text = await generateText(greetingPrompt, [], `New visitor: ${role}`);
    const [audio, artifact] = await Promise.all([
      generateAudio(text).catch(() => null),
      generateArtifact(`${role} role introduction`, text, role).catch(() => null),
    ]);
    res.json({ text, audio, artifact });
  } catch (err) {
    console.error('Role greeting error:', err.message);
    res.status(500).json({ error: err.message });
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
    const [audio, artifact] = await Promise.all([
      generateAudio(text).catch(() => null),
      generateArtifact(painPoint, text, role).catch(() => null),
    ]);

    res.json({ text, audio, visual: artifact });
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
        const [audio, artifact] = await Promise.all([
          generateAudio(text).catch(e => { console.warn(`Tour phase ${phase} TTS failed:`, e.message); return null; }),
          generateArtifact(`DRG phase ${phase} explanation`, text, role).catch(() => null),
        ]);
        return { phase, text, audio, artifact };
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
