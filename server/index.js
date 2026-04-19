import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import KNOWLEDGE_BASE from './knowledge.js'; // default export = UAE_KNOWLEDGE + KNOWLEDGE_BASE

config();

// ── Persistent audio cache directory ──────────────────────────────────────────
// Audio files are saved to disk on first generation and loaded on every restart.
// This means TTS is only called ONCE per text, not on every server start.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.join(__dirname, 'audio');
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

function audioCachePath(name) {
  return path.join(AUDIO_DIR, `${name}.wav.b64`);
}

function loadAudioFromDisk(name) {
  const p = audioCachePath(name);
  if (fs.existsSync(p)) {
    return fs.readFileSync(p, 'utf8');
  }
  return null;
}

function saveAudioToDisk(name, b64wav) {
  fs.writeFileSync(audioCachePath(name), b64wav, 'utf8');
}

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
- Be specific and data-forward — name the mechanism, name the number, stop
- One idea per response. Say it sharp, say it once, then invite the next question

CORE NARRATIVE (lead with this when relevant):
"Documentation AI is deployed. Denial AI is deployed against you. Revenue integrity AI — the layer that converts clinical documentation into the correct IR-DRG — is what's missing. That's exactly what Docstribe delivers. Dynamic IR-DRG Intelligence — UAE Market."

UAE MARKET CONTEXT:
- Say "IR-DRG" not "DRG" — UAE uses Inpatient Refined DRG system
- Use "ICD-10-CM" for coding — the standard used in UAE hospitals
- Reference NABIDH (Dubai health data exchange) and Malaffi (Abu Dhabi) for interoperability context
- Compliance: NABIDH, DHA, SOC 2, HIPAA
- Key UAE payers: Daman, AXA Gulf, Bupa Arabia, Neuron Health
- Regulatory: DHA (Dubai Health Authority), DOH (Abu Dhabi Department of Health)
- UAE denial rate: 12–18% first submission denials, 60–70% preventable
- Never say "US hospitals" or reference CMS — this is UAE market
- Reference arcus@docstribe.com for UAE contact

THE PHYSICIAN-GROUPER GAP:
The physician writes for clinical communication. The DRG grouper reads for financial classification.
That gap is where all revenue leakage lives. Docstribe sits exactly in that gap — reading every clinical document at the moment it is signed, recomputing the DRG in real time, firing CDI queries on Day 0.

KNOWLEDGE BASE (only cite from this — never hallucinate metrics or features):
${KNOWLEDGE_BASE}

CURRENT PAGE CONTEXT:
${pageContext || 'Visitor is on the Docstribe Dynamic DRG Intelligence website.'}

CONVERSATION RULES:
1. Answer every question about Docstribe, UAE RCM, IR-DRG, OPD/IPD workflows, payer rules, CDI, coding, denials, and revenue integrity — you know all of this from the knowledge base above
2. When explaining any platform feature: name the mechanism, give the number, explain the UAE context — be concrete
3. CDI questions: Day 0 queries, 24h IR-DRG refresh, physician pattern learning — specific and sharp
4. Pilot questions: 4 weeks, HIS connect, NABIDH integration, IR-DRG delta measured, zero cost
5. Pricing: zero cost pilot, pay only on proven financial improvement — outcome-based
6. Skeptical visitor: give one proof number from the UAE deployment data, then invite a specific question
7. Demo or meeting requests: "Reach our UAE team at arcus@docstribe.com"
8. ONLY use "I'd connect you with our team" for questions genuinely outside Docstribe's scope (legal, clinical advice, specific patient data) — NOT for any product, platform, or RCM question
9. NEVER fabricate metrics — only cite numbers from the knowledge base above

RESPONSE FORMAT:
3–5 sentences maximum. Every sentence must carry a fact, a mechanism, or a number — no filler.
You MAY use **bold** to highlight one key term or number per response. Separate distinct points with a blank line (\\n\\n). For lists of 3+ items use "- item" bullets.
Lead with the sharpest point. End with one question or offer to go deeper — not both.
If the answer needs more than 5 sentences, it means you're covering too much — pick the most important thing and say that.
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

  // Gemini requires strictly alternating user/model turns.
  // Merge consecutive same-role messages (e.g. intro + greeting = two model turns).
  const rawTurns = history.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    text: m.content,
  }));
  const merged = [];
  for (const turn of rawTurns) {
    if (merged.length && merged[merged.length - 1].role === turn.role) {
      merged[merged.length - 1].text += '\n\n' + turn.text; // merge consecutive
    } else {
      merged.push({ ...turn });
    }
  }
  // Gemini contents must start with a user turn
  const filteredTurns = merged[0]?.role === 'model' ? merged.slice(1) : merged;

  const contents = [
    ...filteredTurns.map(t => ({ role: t.role, parts: [{ text: t.text }] })),
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
// styleInstruction: optional string to guide voice delivery (modulation, pacing)
async function ttsChunk(sentence, styleInstruction) {
  const body = {
    contents: [{ parts: [{ text: sentence }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
      },
    },
  };
  // Gemini TTS honours system instructions for delivery style
  if (styleInstruction) {
    body.systemInstruction = { parts: [{ text: styleInstruction }] };
  }
  const res = await fetch(
    `${GEMINI_BASE}/${GEMINI_TTS_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data?.error?.message || `HTTP ${res.status}`);
  const pcmBase64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!pcmBase64) throw new Error('No PCM data in TTS response');
  return Buffer.from(pcmBase64, 'base64');
}

// ── TTS generation — sentence-split + sequential PCM concatenation ───────────
// Sequential (not parallel) to stay within Gemini TTS rate limits.
// styleInstruction: optional — if the TTS model rejects the system instruction,
// we automatically retry that sentence without it.
async function generateAudio(text, styleInstruction) {
  if (!GEMINI_API_KEY) return null;
  const sentences = splitSentences(text);
  const pcmBuffers = [];
  try {
    for (const sentence of sentences) {
      let buf;
      try {
        buf = await ttsChunk(sentence, styleInstruction);
      } catch (chunkErr) {
        // If style instruction caused the failure, retry without it
        if (styleInstruction) {
          buf = await ttsChunk(sentence);
        } else {
          throw chunkErr;
        }
      }
      pcmBuffers.push(buf);
    }
    const allPcm = Buffer.concat(pcmBuffers);
    return pcmBase64ToWavBase64(allPcm.toString('base64'));
  } catch (err) {
    console.warn('TTS failed (non-fatal):', err.message);
    return null;
  }
}

// Demo scenes use a richer delivery style for cinematic effect
const DEMO_TTS_STYLE = `You are the narrator for a premium healthcare technology product demonstration.
Speak with measured authority and quiet confidence — like a trusted advisor, not a salesperson.
Let statistics breathe: pause briefly after each number to let it land.
Vary your pace: slow down for key outcomes and financial numbers, keep transitions crisp.
Do not rush. Every sentence should feel intentional.`;

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

// ── /api/tts — lightweight TTS-only endpoint ──────────────────────────────────
app.post('/api/tts', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });
  try {
    const audio = await generateAudio(text);
    res.json({ audio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Static intro — pre-generated at startup ────────────────────────────────────
const INTRO_TEXT = `12 to 18 percent of UAE hospital claims are denied on first submission. 60 to 70 percent of those are preventable — wrong code, missing qualifier, or a payer edit that was never checked. Docstribe is the intelligence layer that closes every one of those gaps — from the moment the patient registers, through the clinical encounter, all the way to the recovered claim. Tell me your role — I'll show you exactly what this means for you.`;

const INTRO_ARTIFACT = {
  type: 'workflow',
  data: {
    title: 'WHERE DOCSTRIBE OPERATES',
    steps: [
      { num: '01', label: 'Pre-Visit',      detail: 'Eligibility, ToB, pre-auth at order entry — Daman, AXA Gulf, Bupa Arabia',  color: '#00cba8' },
      { num: '02', label: 'OPD Encounter',  detail: 'CDI → ICD-10-CM / CPT coding → NCCI / MUE payer edit scrubbing',           color: '#38bdf8' },
      { num: '03', label: 'IPD Stay',       detail: 'Ambient scribe, CDI Day 0, IR-DRG daily refresh, LOS optimisation',         color: '#4d8aff' },
      { num: '04', label: 'Claim & Appeal', detail: 'CARC / RARC denial intelligence, one-click appeal, 30-day pipeline view',   color: '#a78bfa' },
    ],
  },
};

// ── /api/demo — UAE 11-scene pre-curated demonstration ───────────────────────
// Defined here (before the startup IIFE) so it is initialized before the async
// startup code references it synchronously.
const UAE_DEMO_SCENES = [
  {
    id: 1, timecode: '0:00–0:10', journeyStage: 'opening',
    title: 'The Revenue Gap',
    voText: 'In the UAE, twelve to eighteen percent of every hospital claim is denied. Sixty to seventy percent — entirely preventable. Four gaps: documentation, authorization, coding, claim edits. Docstribe closes every one. Before a single claim goes out.',
  },
  {
    id: 2, timecode: '0:10–0:22', journeyStage: 'outcomes',
    title: 'Introducing Docstribe',
    voText: 'This is Docstribe. Built by clinicians — thirty years of practice. A hundred hospitals across the US, UAE, and India. Ten million lives. That gap you just saw — the twelve to eighteen percent — we close it. Contractually. Denials fall thirty percent. Clean claim rate ninety-nine percent. CMI up by zero point one five. Sixty days. Guaranteed.',
  },
  {
    id: 3, timecode: '0:22–0:32', journeyStage: 'platform',
    title: 'One Unified Workspace',
    voText: 'Docstribe connects with your existing EMR and HIS — no rip and replace. It builds a unified case workbench across OPD, IPD, and Emergency — for physicians, medical coders, and case managers. Two hundred live encounters. Every case tracked from order to payment. Zero leakage.',
  },
  {
    id: 4, timecode: '0:32–0:42', journeyStage: 'pre-visit',
    title: 'Pre-Visit Intelligence',
    voText: 'Before Fatima walks in, eligibility is already confirmed — coverage active, no auth required. For Khalid\'s admission, Thiqa pre-authorisation for AED twenty-eight thousand five hundred fires at order entry, not discharge. Approved before care begins.',
  },
  {
    id: 5, timecode: '0:42–0:52', journeyStage: 'in-visit',
    title: 'Ambient Clinical Intelligence',
    voText: 'The physician speaks. The structured clinical note builds in real time — vital signs, ICD codes, comorbidities, all captured automatically. Feeding directly into NABIDH and DHA. The doctor never looks up from the patient. Documentation already done.',
  },
  {
    id: 6, timecode: '0:52–1:02', journeyStage: 'cdi',
    title: 'CDI — Closing the Gap',
    voText: 'One tap. The physician confirms medical necessity — four hundred twenty dirhams, captured. For the inpatient — confirming Pneumonia as principal diagnosis locks the IR-DRG gap before discharge. Revenue that would have been lost, isn\'t.',
  },
  {
    id: 7, timecode: '1:02–1:14', journeyStage: 'coding',
    title: 'AI-Powered Coding',
    voText: 'Clinical notes in. Ranked ICD codes out — instantly. The IR-DRG weight moves from zero point nine four to one point three four. That jump alone recovers AED eighteen thousand four hundred. Per case. On every case.',
  },
  {
    id: 8, timecode: '1:14–1:24', journeyStage: 'denial-intel',
    title: 'Denial Intelligence',
    voText: 'Every denial has a pattern. Docstribe maps it — payer by payer, batch by batch. Most is preventable. Up to ninety-one percent recoverable before the claim goes out. That is how the denial rate falls — not by chasing. By never losing.',
  },
  {
    id: 9, timecode: '1:24–1:33', journeyStage: 'recovery',
    title: 'One-Click Recovery',
    voText: 'A denial lands. Historically, three weeks of follow-up. Now — one click. Docstribe reads the contract, finds the clause, writes the appeal letter. The whole thing. Thirty seconds. AED nineteen hundred in recovery.',
  },
  {
    id: 10, timecode: '1:33–1:44', journeyStage: 'service-line',
    title: 'Service Line Growth',
    voText: 'Your ops team cannot watch every chart. Docstribe does. Oxygen dropping. Labs flagging a DRG escalation. Pre-auth ready for systemic therapy. Four patients — AED ninety-one thousand — surfaced as a live action list. Clinical signals, turned into revenue. Day Zero.',
  },
  {
    id: 11, timecode: '1:44–1:58', journeyStage: 'dashboard',
    title: 'Your RCM Intelligence Partner',
    voText: 'This is not a generic platform. It is an intelligence framework that learns your hospital — your payers, your physicians, your case mix — and gets smarter with every claim, every signal, every patient. Clinical intelligence. Built for you.',
  },
];

// ── Audio cache — in-memory (loaded from disk on startup) ─────────────────────
let cachedIntroAudio = null;
const cachedDemoAudios = new Map(); // sceneId → base64 WAV

// ── Startup: load all audio from disk, only call TTS for missing files ─────────
(async () => {
  // 1. Intro audio
  const introDisk = loadAudioFromDisk('intro');
  if (introDisk) {
    cachedIntroAudio = introDisk;
    console.log('🎙️  Intro audio loaded from disk ✅');
  } else {
    console.log('🎙️  Generating intro audio (first run)...');
    let audio = null;
    for (let attempt = 1; attempt <= 3 && !audio; attempt++) {
      if (attempt > 1) await new Promise(r => setTimeout(r, 3000 * (attempt - 1)));
      audio = await generateAudio(INTRO_TEXT);
    }
    if (audio) {
      cachedIntroAudio = audio;
      saveAudioToDisk('intro', audio);
      console.log('🎙️  Intro audio generated and saved ✅');
    } else {
      console.warn('⚠️  Intro audio generation failed.');
    }
  }

  // 2. Demo scenes — load from disk if available, generate missing ones
  const missing = [];
  for (const scene of UAE_DEMO_SCENES) {
    const disk = loadAudioFromDisk(`scene-${scene.id}`);
    if (disk) {
      cachedDemoAudios.set(scene.id, disk);
    } else {
      missing.push(scene);
    }
  }

  const loaded = UAE_DEMO_SCENES.length - missing.length;
  if (loaded > 0) console.log(`🎬  Loaded ${loaded} / ${UAE_DEMO_SCENES.length} demo scenes from disk ✅`);

  if (missing.length === 0) {
    console.log('🎬  All demo scenes ready — served from disk.');
    return;
  }

  // Generate missing scenes sequentially (rate-limit safe)
  console.log(`🎬  Generating ${missing.length} missing scene(s) — will save to disk for future restarts...`);
  for (const scene of missing) {
    let audio = null;
    for (let attempt = 1; attempt <= 3 && !audio; attempt++) {
      if (attempt > 1) {
        console.log(`   🔄  Retrying scene ${scene.id} (attempt ${attempt})...`);
        await new Promise(r => setTimeout(r, 3000 * (attempt - 1)));
      }
      audio = await generateAudio(scene.voText, DEMO_TTS_STYLE);
    }
    if (audio) {
      cachedDemoAudios.set(scene.id, audio);
      saveAudioToDisk(`scene-${scene.id}`, audio);
      console.log(`   ✅  Scene ${scene.id} generated & saved: ${scene.title}`);
    } else {
      console.warn(`   ⚠️  Scene ${scene.id} failed — will generate on demand`);
    }
    await new Promise(r => setTimeout(r, 1500)); // rate limit gap
  }
  console.log(`🎬  Demo audio ready: ${cachedDemoAudios.size} / ${UAE_DEMO_SCENES.length} scenes cached.`);
})();

// ── /api/intro ────────────────────────────────────────────────────────────────
app.post('/api/intro', async (req, res) => {
  // Serve cached audio instantly — no wait on click
  if (cachedIntroAudio) {
    return res.json({ text: INTRO_TEXT, audio: cachedIntroAudio, artifact: INTRO_ARTIFACT });
  }
  // Fallback: generate on demand, then save to disk
  try {
    const audio = await generateAudio(INTRO_TEXT);
    if (audio) { cachedIntroAudio = audio; saveAudioToDisk('intro', audio); }
    res.json({ text: INTRO_TEXT, audio, artifact: INTRO_ARTIFACT });
  } catch (err) {
    res.json({ text: INTRO_TEXT, audio: null, artifact: INTRO_ARTIFACT });
  }
});


app.post('/api/demo', async (req, res) => {
  const { sceneId } = req.body;

  if (sceneId !== undefined) {
    const scene = UAE_DEMO_SCENES.find(s => s.id === sceneId);
    if (!scene) return res.status(404).json({ error: 'Scene not found' });

    // Serve from in-memory cache (already loaded from disk at startup)
    let audio = cachedDemoAudios.get(sceneId) || null;
    if (!audio) {
      // Last-resort: generate on demand and save to disk so it's ready next restart
      console.log(`⚡ Generating demo scene ${sceneId} on demand (not yet cached)...`);
      audio = await generateAudio(scene.voText, DEMO_TTS_STYLE).catch(() => null);
      if (audio) {
        cachedDemoAudios.set(sceneId, audio);
        saveAudioToDisk(`scene-${sceneId}`, audio);
      }
    }
    return res.json({ ...scene, audio });
  }

  // Return all scenes with cached audio status
  res.json({
    scenes: UAE_DEMO_SCENES,
    cachedScenes: [...cachedDemoAudios.keys()],
  });
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
