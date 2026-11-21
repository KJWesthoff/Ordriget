// Chiptune-lyd (WebAudio) og dansk oplæsning (speechSynthesis).
let ctx = null, master, musicGain, sfxGain;
const prefs = { music: true, sfx: true };

export function initAudio() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
  musicGain = ctx.createGain(); musicGain.gain.value = prefs.music ? 0.32 : 0; musicGain.connect(master);
  sfxGain = ctx.createGain(); sfxGain.gain.value = 0.6; sfxGain.connect(master);
  setInterval(schedule, 40);
  if (pending) { const p = pending; pending = null; curName = null; music(p); }
}

export function setAudioPrefs(p) {
  Object.assign(prefs, p);
  if (musicGain) musicGain.gain.value = prefs.music ? 0.32 : 0;
}

const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function freq(n) {
  const m = n.match(/^([A-G])(#|b)?(\d)$/);
  if (!m) return 0;
  let semi = NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (Number(m[3]) + 1) * 12;
  return 440 * Math.pow(2, (semi - 69) / 12);
}

function tone(f, start, dur, type = 'square', vol = 0.2, dest = sfxGain, slideTo = 0) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, start);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
  g.gain.setValueAtTime(vol, start);
  g.gain.setValueAtTime(vol, start + dur * 0.6);
  g.gain.exponentialRampToValueAtTime(0.0008, start + dur);
  o.connect(g); g.connect(dest);
  o.start(start); o.stop(start + dur + 0.03);
}

let noiseBuf = null;
function noise(start, dur, vol = 0.2) {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = ctx.createBufferSource(), g = ctx.createGain();
  s.buffer = noiseBuf;
  g.gain.setValueAtTime(vol, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  s.connect(g); g.connect(sfxGain);
  s.start(start); s.stop(start + dur);
}

function seq(notes, step = 0.08, type = 'square', vol = 0.15) {
  const t = ctx.currentTime;
  notes.forEach((n, i) => { if (n) tone(freq(n), t + i * step, step * 1.1, type, vol); });
}

export function sfx(name) {
  if (!ctx || !prefs.sfx) return;
  const t = ctx.currentTime;
  switch (name) {
    case 'select': tone(880, t, 0.05, 'square', 0.08); break;
    case 'type': tone(660, t, 0.03, 'square', 0.05); break;
    case 'correct': seq(['E5', 'G5', 'C6'], 0.07); break;
    case 'wrong': tone(220, t, 0.25, 'square', 0.12, sfxGain, 110); break;
    case 'hit': noise(t, 0.15, 0.25); tone(300, t, 0.12, 'square', 0.12, sfxGain, 80); break;
    case 'hurt': noise(t, 0.25, 0.3); tone(160, t, 0.25, 'sawtooth', 0.1, sfxGain, 60); break;
    case 'coin': tone(988, t, 0.06, 'square', 0.1); tone(1319, t + 0.06, 0.2, 'square', 0.1); break;
    case 'fire': noise(t, 0.4, 0.2); tone(200, t, 0.4, 'sawtooth', 0.1, sfxGain, 900); break;
    case 'bolt': for (let i = 0; i < 4; i++) noise(t + i * 0.07, 0.06, 0.3); tone(1200, t, 0.3, 'square', 0.08, sfxGain, 200); break;
    case 'heal': seq(['C5', 'E5', 'G5', 'C6', 'E6'], 0.06, 'triangle', 0.2); break;
    case 'shield': tone(400, t, 0.3, 'triangle', 0.2, sfxGain, 1200); break;
    case 'stars': seq(['C6', 'G5', 'E6', 'C6', 'G6'], 0.05, 'square', 0.08); break;
    case 'levelup': seq(['C5', 'E5', 'G5', 'C6', null, 'G5', 'C6', 'E6', 'G6'], 0.09, 'square', 0.12); break;
    case 'victory': seq(['G5', 'G5', 'G5', 'E5', null, 'F5', null, 'G5', null, null, 'C6'], 0.1, 'square', 0.12); break;
    case 'defeat': seq(['G4', 'F4', 'E4', 'D4', 'C4'], 0.18, 'triangle', 0.2); break;
    case 'open': seq(['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'], 0.05, 'square', 0.1); break;
    case 'step': tone(140, t, 0.03, 'triangle', 0.1); break;
  }
}

// ---------- Musik ----------
// Hver tone er en 1/8. '-' forlænger, '.' er pause.
const TRACKS = {
  title: { bpm: 100,
    mel: 'C5 - E5 - G5 - C6 - B5 - G5 - A5 - - - F5 - A5 - C6 - E6 - D6 - C6 - B5 - - - A5 - G5 - F5 - E5 - D5 - E5 - C5 - - - - - - -',
    bas: 'C3 - - - G2 - - - F2 - - - G2 - - - F2 - - - A2 - - - G2 - - - G2 - - - F2 - - - G2 - - - C3 - - - C3 - - -' },
  map: { bpm: 132,
    mel: 'E5 . G5 . C6 - B5 A5 G5 - E5 . F5 G5 A5 - G5 . E5 . C5 - D5 E5 F5 - E5 D5 C5 - - . A4 . C5 . F5 - E5 D5 C5 - A4 . B4 C5 D5 - G4 . B4 . D5 - C5 B4 C5 - - - - .',
    bas: 'C3 . G3 . C3 . G3 . A2 . E3 . A2 . E3 . F2 . C3 . F2 . C3 . G2 . D3 . G2 . D3 . F2 . C3 . F2 . C3 . D3 . A3 . D3 . A3 . G2 . D3 . G2 . D3 . C3 . G3 . C3 - - .' },
  battle: { bpm: 160,
    mel: 'A4 . A4 C5 E5 . A5 . G5 . E5 . D5 E5 C5 . A4 . A4 C5 E5 . G5 . F5 - E5 - D5 - . . F4 . F4 A4 C5 . F5 . E5 . C5 . B4 C5 A4 . G4 . B4 D5 G5 . F5 . E5 - D5 - E5 - . .',
    bas: 'A2 A3 A2 A3 A2 A3 A2 A3 A2 A3 A2 A3 A2 A3 A2 A3 F2 F3 F2 F3 F2 F3 F2 F3 G2 G3 G2 G3 E2 E3 E2 E3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 G2 G3 G2 G3 G2 G3 G2 G3 E2 E3 E2 E3 E2 E3 E2 E3' },
  boss: { bpm: 176,
    mel: 'D5 D5 . D5 F5 . E5 D5 C#5 - D5 - . . A4 . D5 D5 . D5 G5 . F5 E5 F5 - G5 - A5 - . . Bb5 - A5 - G5 - F5 - E5 - F5 - D5 - . . Bb4 - C5 - D5 - E5 - C#5 - - - A4 - - -',
    bas: 'D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 D2 D3 Bb1 Bb2 Bb1 Bb2 Bb1 Bb2 Bb1 Bb2 C2 C3 C2 C3 C2 C3 C2 C3 G1 G2 G1 G2 G1 G2 G1 G2 A1 A2 A1 A2 A1 A2 A1 A2 Bb1 Bb2 Bb1 Bb2 C2 C3 C2 C3 A1 A2 A1 A2 A1 A2 A1 A2' },
  village: { bpm: 104,
    mel: 'F5 - A5 - C6 - A5 - G5 - E5 - C5 - - - D5 - F5 - A5 - G5 - F5 - E5 - F5 - - - A4 - C5 - F5 - E5 - D5 - Bb4 - C5 - - - G4 - Bb4 - E5 - D5 - C5 - E5 - F5 - - -',
    bas: 'F2 . C3 . F2 . C3 . C2 . G2 . C2 . G2 . Bb1 . F2 . Bb1 . F2 . C2 . G2 . F2 . C3 . D2 . A2 . D2 . A2 . Bb1 . F2 . C2 . G2 . G1 . D2 . C2 . G2 . F2 . C3 . F2 . . .' },
  puzzle: { bpm: 96,
    mel: 'E5 . . B4 . . G5 . F#5 . . D5 . . B4 . E5 . . B4 . . A5 . G5 . F#5 . E5 - - . C5 . . G4 . . E5 . D5 . . B4 . . G4 . D#5 . . B4 . . F#5 . E5 - - - - - - .',
    bas: 'E2 - - - - - - - B1 - - - - - - - E2 - - - - - - - C2 - - - - - - - A1 - - - - - - - G1 - - - - - - - B1 - - - - - - - E2 - - - - - - -' },
};

function parseLine(s) {
  const toks = s.trim().split(/\s+/);
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t === '.' || t === '-') { out.push(null); continue; }
    let len = 1;
    while (toks[i + len] === '-') len++;
    out.push({ f: freq(t), len });
  }
  return out;
}
const PARSED = {};
for (const k in TRACKS) PARSED[k] = { bpm: TRACKS[k].bpm, mel: parseLine(TRACKS[k].mel), bas: parseLine(TRACKS[k].bas) };

let cur = null, curName = null, step = 0, nextTime = 0, pending = null;
export function music(name) {
  if (!ctx) { pending = name; return; }
  if (curName === name) return;
  curName = name; cur = PARSED[name] || null; step = 0;
  nextTime = ctx.currentTime + 0.1;
}
function schedule() {
  if (!cur || !ctx || ctx.state !== 'running') return;
  const dt = 60 / cur.bpm / 2;
  while (nextTime < ctx.currentTime + 0.25) {
    const m = cur.mel[step % cur.mel.length], b = cur.bas[step % cur.bas.length];
    if (m && m.f) tone(m.f, nextTime, dt * m.len * 0.95, 'square', 0.09, musicGain);
    if (b && b.f) tone(b.f, nextTime, dt * b.len * 0.9, 'triangle', 0.22, musicGain);
    step++;
    nextTime += dt;
  }
}

// ---------- Tale ----------
let daVoice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  const da = vs.filter(v => /^da([-_]|$)/i.test(v.lang));
  daVoice = da.find(v => /premium|enhanced|forbedret/i.test(v.name)) || da.find(v => /sara/i.test(v.name)) || da[0] || null;
}
if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}
export function voiceName() { pickVoice(); return daVoice ? daVoice.name : null; }
export function hasVoice() { if (!daVoice) pickVoice(); return !!daVoice; }

let rate = 0.85;
export function setRate(r) { rate = r; }

export function unlockSpeech() {
  if (!('speechSynthesis' in window)) return;
  try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* ignorer */ }
}

// ---------- Indspillede klip (Piper) ----------
// audio/index.json: { voice, files: { "tekst": "abc123.mp3" } } – laves af tools/make_audio.mjs
let clips = null, clipVoice = null;
const bufCache = new Map();
let voiceGain = null, playing = [], seqId = 0;
const clipKey = t => String(t).replace(/[«»"]/g, '').replace(/\s+/g, ' ').trim();

export async function loadClips() {
  try {
    const r = await fetch('audio/index.json');
    if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    clips = j.files || {}; clipVoice = j.voice || null;
  } catch (e) { clips = {}; }
}
export function clipVoiceName() { return clips && Object.keys(clips).length ? clipVoice : null; }
const hasClips = parts => !!clips && parts.every(p => clips[clipKey(p)]);

// Kan spillet læse disse tekster op – enten med klip eller enhedens danske stemme?
export function canSay(parts) { parts = [].concat(parts); return hasClips(parts) || hasVoice(); }

function getBuf(file) {
  if (!bufCache.has(file)) {
    bufCache.set(file, fetch('audio/' + file).then(r => r.arrayBuffer())
      .then(b => new Promise((res, rej) => ctx.decodeAudioData(b, res, rej)))
      .catch(e => { bufCache.delete(file); throw e; }));
  }
  return bufCache.get(file);
}

async function playClips(parts) {
  const id = ++seqId;
  let bufs;
  try { bufs = await Promise.all(parts.map(p => getBuf(clips[clipKey(p)]))); }
  catch (e) { if (id === seqId) speakTTS(parts); return; }
  if (id !== seqId) return;
  if (ctx.state === 'suspended') ctx.resume();
  if (!voiceGain) { voiceGain = ctx.createGain(); voiceGain.gain.value = 1; voiceGain.connect(ctx.destination); }
  // tempo-skyderen: 0.85 = normal. Små ændringer, så stemmen ikke bliver for dyb/lys.
  const pr = Math.min(1.15, Math.max(0.8, rate / 0.85));
  let t = ctx.currentTime + 0.05;
  if (musicGain && prefs.music) musicGain.gain.setTargetAtTime(0.08, ctx.currentTime, 0.05);
  for (const b of bufs) {
    const src = ctx.createBufferSource();
    src.buffer = b; src.playbackRate.value = pr;
    src.connect(voiceGain);
    src.start(t);
    playing.push(src);
    t += b.duration / pr + 0.45;
  }
  const end = t;
  setTimeout(() => { if (id === seqId) restoreMusic(); }, (end - ctx.currentTime) * 1000);
}
function restoreMusic() { if (musicGain) musicGain.gain.setTargetAtTime(prefs.music ? 0.32 : 0, ctx.currentTime, 0.2); }

export function speak(parts) {
  parts = [].concat(parts).filter(Boolean);
  stopSpeech();
  if (ctx && hasClips(parts)) { playClips(parts); return true; }
  return speakTTS(parts);
}

function speakTTS(parts) {
  if (!hasVoice()) return false;
  speechSynthesis.cancel();
  for (const p of parts) {
    const u = new SpeechSynthesisUtterance(p);
    u.voice = daVoice; u.lang = daVoice.lang; u.rate = rate;
    speechSynthesis.speak(u);
  }
  return true;
}

export function stopSpeech() {
  seqId++;
  for (const s of playing) { try { s.stop(); } catch (e) { /* allerede stoppet */ } }
  playing = [];
  if (ctx) restoreMusic();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
