/**
 * render_video.mjs — Docstribe demo offline video renderer
 *
 * Pipeline:
 *   1. For each scene: puppeteer steps p 0→1 at 30fps, screenshots every frame
 *   2. ffmpeg: PNG frames + WAV audio → scene MP4
 *   3. ffmpeg: concatenate all scenes → docstribe_demo_YYYYMMDD.mp4
 *
 * Prerequisites:
 *   npm install -D puppeteer          (run once)
 *   brew install ffmpeg               (run once)
 *   npm run build                     (rebuild React app)
 *
 * Usage:
 *   # Terminal 1 — static file server (serves the built app)
 *   npx serve dist -p 4173 --no-clipboard
 *
 *   # Terminal 2 — audio API server
 *   node server/index.js
 *
 *   # Terminal 3 — run the renderer
 *   node scripts/render_video.mjs
 *
 * Options (env vars):
 *   SCENES=1,2,4       render only specific scenes (default: all)
 *   FPS=30             frames per second (default: 30)
 *   WIDTH=1920         output width  (default: 1280)
 *   HEIGHT=1080        output height (default: 720)
 *   KEEP_FRAMES=1      keep PNG frames after encoding (default: deleted)
 *   OUT_DIR=./output   custom output directory
 */

import puppeteer from 'puppeteer';
import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT   = path.resolve(__dirname, '..');

// ─── Config ──────────────────────────────────────────────────────────────────
const FPS         = parseInt(process.env.FPS    || '30');
const WIDTH       = parseInt(process.env.WIDTH  || '1280');
const HEIGHT      = parseInt(process.env.HEIGHT || '720');
const VITE_URL    = process.env.VITE_URL   || 'http://localhost:4173';
const API_URL     = process.env.API_URL    || 'http://localhost:3001';
const KEEP_FRAMES = process.env.KEEP_FRAMES === '1';
const OUT_DIR     = path.resolve(process.env.OUT_DIR || path.join(PROJECT, 'render_output'));

// All scene IDs in presentation order (matches DemoPlayer SCENES array)
const ALL_SCENES  = [1, 2, 4, 6, 7, 8, 10];
const SCENE_IDS   = process.env.SCENES
  ? process.env.SCENES.split(',').map(Number)
  : ALL_SCENES;

// Frames directory (cleaned between runs unless KEEP_FRAMES)
const FRAMES_DIR  = path.join(OUT_DIR, 'frames');

// ─── Helpers ─────────────────────────────────────────────────────────────────
function log(msg)   { process.stdout.write(`${msg}\n`); }
function tick(msg)  { process.stdout.write(`\r  ${msg}`.padEnd(60)); }

function checkTool(cmd, hint) {
  const result = spawnSync(cmd, ['--version'], { stdio: 'pipe' });
  if (result.error) {
    log(`\n❌ "${cmd}" not found. ${hint}`);
    process.exit(1);
  }
}

function ffmpeg(...args) {
  const result = spawnSync('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) {
    log(`\n❌ ffmpeg error:\n${result.stderr?.toString()}`);
    process.exit(1);
  }
  return result;
}

function ffprobe(...args) {
  const result = spawnSync('ffprobe', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  return result.stdout?.toString().trim();
}

async function waitFor(page, condition, timeout = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const ok = await page.evaluate(condition).catch(() => false);
    if (ok) return;
    await delay(100);
  }
  throw new Error(`waitFor timed out: ${condition}`);
}

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// Two rAF cycles — enough for React to commit a state update
const waitRAF = (page) =>
  page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));

// ─── Get audio duration for a scene ──────────────────────────────────────────
async function getSceneAudio(sceneId) {
  // Check if the decoded WAV is already cached on disk
  const cachedWav = path.join(FRAMES_DIR, `audio_scene_${sceneId}.wav`);
  if (fs.existsSync(cachedWav)) {
    const dur = parseFloat(ffprobe(
      '-v', 'quiet', '-show_entries', 'format=duration',
      '-of', 'csv=p=0', cachedWav,
    ));
    return { wavPath: cachedWav, duration: dur };
  }

  // Check if the .b64 file exists locally (fastest path — no network)
  const b64Path = path.join(PROJECT, 'server', 'audio', `scene-${sceneId}.wav.b64`);
  let wavBuf;
  if (fs.existsSync(b64Path)) {
    log(`  ↳ reading audio from cache: scene-${sceneId}.wav.b64`);
    wavBuf = Buffer.from(fs.readFileSync(b64Path, 'utf8').trim(), 'base64');
  } else {
    // Fall back to API (will generate + cache the audio server-side)
    log(`  ↳ fetching audio from API for scene ${sceneId}…`);
    const res  = await fetch(`${API_URL}/api/demo`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ sceneId }),
    });
    if (!res.ok) throw new Error(`API returned ${res.status} for scene ${sceneId}`);
    const { audio } = await res.json();
    wavBuf = Buffer.from(audio, 'base64');
  }

  fs.mkdirSync(path.dirname(cachedWav), { recursive: true });
  fs.writeFileSync(cachedWav, wavBuf);

  const dur = parseFloat(ffprobe(
    '-v', 'quiet', '-show_entries', 'format=duration',
    '-of', 'csv=p=0', cachedWav,
  ));
  return { wavPath: cachedWav, duration: dur };
}

// ─── Render one scene ─────────────────────────────────────────────────────────
async function renderScene(browser, sceneId) {
  log(`\n┌── Scene ${sceneId} ─────────────────────────────────────────────`);

  const { wavPath, duration } = await getSceneAudio(sceneId);
  const totalFrames = Math.ceil(duration * FPS);
  log(`│  Audio: ${duration.toFixed(3)}s  →  ${totalFrames} frames at ${FPS}fps`);

  // Create frames subdirectory for this scene
  const sceneFrameDir = path.join(FRAMES_DIR, `scene_${sceneId}`);
  fs.mkdirSync(sceneFrameDir, { recursive: true });

  // ── Open page ──
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

  // Silence console noise from the app
  page.on('console', () => {});
  page.on('pageerror', () => {});

  const url = `${VITE_URL}/?render=1&scene=${sceneId}`;
  log(`│  Loading: ${url}`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for the React render control to be ready
  await waitFor(page, () => window.__renderReady === true);
  log(`│  Render control ready`);

  // Extra settle time so initial CSS animations have a baseline frame
  await delay(300);

  // ── Capture frames ──
  log(`│  Capturing frames…`);
  for (let i = 0; i <= totalFrames; i++) {
    const p = i === totalFrames ? 1 : i / totalFrames;

    // Advance progress
    await page.evaluate((prog) => window.__renderSetP(prog), p);

    // Let React commit + one more rAF for CSS
    await waitRAF(page);

    // Screenshot
    const framePath = path.join(sceneFrameDir, `frame_${String(i).padStart(6, '0')}.png`);
    await page.screenshot({ path: framePath, type: 'png' });

    if (i % FPS === 0 || i === totalFrames) {
      tick(`frame ${i}/${totalFrames}  (${((i / totalFrames) * 100).toFixed(0)}%)`);
    }
  }
  log(`\n│  ✓ ${totalFrames + 1} frames captured`);
  await page.close();

  // ── FFmpeg: frames + audio → scene MP4 ──
  const sceneOut = path.join(OUT_DIR, `scene_${String(ALL_SCENES.indexOf(sceneId) + 1).padStart(2, '0')}_id${sceneId}.mp4`);
  log(`│  Encoding → ${path.basename(sceneOut)}`);

  ffmpeg(
    '-y',
    '-r',     String(FPS),
    '-i',     path.join(sceneFrameDir, 'frame_%06d.png'),
    '-i',     wavPath,
    '-c:v',   'libx264',
    '-preset','fast',
    '-crf',   '18',            // near-lossless quality
    '-pix_fmt','yuv420p',      // broad compatibility
    '-c:a',   'aac',
    '-b:a',   '192k',
    '-shortest',               // trim to audio length
    '-movflags','+faststart',  // web-optimised MP4
    sceneOut,
  );

  log(`└── ✓ ${path.basename(sceneOut)}`);

  // Clean frames to save disk space (unless KEEP_FRAMES)
  if (!KEEP_FRAMES) {
    fs.rmSync(sceneFrameDir, { recursive: true, force: true });
  }

  return sceneOut;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // ── Pre-flight checks ──
  checkTool('ffmpeg',  'Install with: brew install ffmpeg');
  checkTool('ffprobe', 'Install with: brew install ffmpeg');

  // Verify servers are reachable
  log('\n⏳  Checking servers…');
  try {
    const viteCheck = await fetch(VITE_URL).catch(() => null);
    if (!viteCheck?.ok) throw new Error('Vite server not responding');
    log(`  ✓ Vite  at ${VITE_URL}`);
  } catch {
    log(`\n❌ Vite server not found at ${VITE_URL}`);
    log('   Run:  npx serve dist -p 4173 --no-clipboard');
    process.exit(1);
  }
  try {
    const apiCheck = await fetch(`${API_URL}/api/demo`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sceneId: 999 }),
    }).catch(() => null);
    // A 400/500 response is fine — the server is up
    if (!apiCheck) throw new Error('API server not responding');
    log(`  ✓ API   at ${API_URL}`);
  } catch {
    log(`\n❌ API server not found at ${API_URL}`);
    log('   Run:  node server/index.js');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR,   { recursive: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  // ── Launch browser ──
  log('\n🌐  Launching Chromium…');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',   // prevent /dev/shm overflow on Linux
      '--disable-gpu',
      `--window-size=${WIDTH},${HEIGHT}`,
      '--font-render-hinting=none',  // crisper fonts in headless
    ],
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
  });

  // ── Render each scene ──
  const sceneFiles = [];
  log(`\n🎬  Rendering ${SCENE_IDS.length} scene(s): [${SCENE_IDS.join(', ')}]`);
  log(`    Resolution: ${WIDTH}×${HEIGHT}  FPS: ${FPS}`);

  for (const sid of SCENE_IDS) {
    if (!ALL_SCENES.includes(sid)) {
      log(`\n⚠️  Unknown scene ID ${sid} — skipping`);
      continue;
    }
    sceneFiles.push(await renderScene(browser, sid));
  }

  await browser.close();

  if (sceneFiles.length === 0) {
    log('\n⚠️  No scenes rendered.');
    process.exit(0);
  }

  // ── FFmpeg: concatenate all scenes ──
  const dateStr  = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const finalOut = path.join(OUT_DIR, `docstribe_demo_${dateStr}.mp4`);

  if (sceneFiles.length === 1) {
    fs.copyFileSync(sceneFiles[0], finalOut);
  } else {
    log('\n🔗  Concatenating scenes…');
    const concatTxt = path.join(OUT_DIR, '_concat.txt');
    fs.writeFileSync(concatTxt, sceneFiles.map(f => `file '${f}'`).join('\n'));
    ffmpeg(
      '-y',
      '-f',     'concat',
      '-safe',  '0',
      '-i',     concatTxt,
      '-c',     'copy',
      '-movflags', '+faststart',
      finalOut,
    );
    fs.unlinkSync(concatTxt);
  }

  // ── Done ──
  const sizeMB = (fs.statSync(finalOut).size / 1024 / 1024).toFixed(1);
  log(`\n✅  Final video: ${finalOut}`);
  log(`    Size: ${sizeMB} MB  |  Scenes: ${sceneFiles.length}  |  ${WIDTH}×${HEIGHT} @ ${FPS}fps`);
  log(`\n    Open: open "${finalOut}"\n`);
}

main().catch(err => {
  console.error('\n❌ Render failed:', err.message);
  process.exit(1);
});
