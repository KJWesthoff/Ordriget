// Genererer oplæsning af alle ord, sætninger og historien med Piper (lokal, gratis TTS).
//
//   node tools/make_audio.mjs            # laver kun manglende filer
//   node tools/make_audio.mjs --all      # laver alt forfra
//
// Kræver Piper + dansk stemme i ~/.local/share/piper (eller sæt PIPER_DIR), samt ffmpeg.
// Se README.md for installation.
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORDLISTS, parseEntry } from '../js/data/words.js';
import { PROLOGUE, STORY, TRAINING_INTRO, SKILLS_INTRO, CHEST_INTRO, LORE_SAVED, LORE, loreLine } from '../js/data/story.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'audio');
const PIPER_DIR = process.env.PIPER_DIR || path.join(os.homedir(), '.local/share/piper');
const VOICE = 'da_DK-talesyntese-medium';
const PIPER = path.join(PIPER_DIR, 'piper/piper');
const MODEL = path.join(PIPER_DIR, VOICE + '.onnx');
const LENGTH_SCALE = '1.12'; // lidt langsommere end normalt – godt til diktat

// Samme nøgle som spillet bruger (js/audio.js: clipKey)
const clipKey = t => t.replace(/[«»"]/g, '').replace(/\s+/g, ' ').trim();
const fileFor = t => createHash('sha1').update(t).digest('hex').slice(0, 12) + '.mp3';

for (const f of [PIPER, MODEL]) if (!fs.existsSync(f)) { console.error('Mangler: ' + f + '\nSe README.md → "Oplæsning".'); process.exit(1); }

// ---- Saml alle tekster ----
const texts = new Set();
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
WORDLISTS.forEach((list, ch) => list.forEach(s => {
  const w = parseEntry(s, ch);
  texts.add(clipKey(w.word));
  if (w.sentence) texts.add(clipKey(cap(w.sentence.replace('___', w.word))));
}));
const story = [PROLOGUE, TRAINING_INTRO, SKILLS_INTRO, CHEST_INTRO, LORE_SAVED, ...STORY.flatMap(c => Object.values(c))];
// Krønikens skriftruller: som de læses i kisten og i menuen
for (const l of Object.values(LORE)) story.push([['brev', loreLine(l)], ['brev', l.text]]);
for (const lines of story) for (const [, t] of lines) if (!t.includes('{navn}')) texts.add(clipKey(t));

// ---- Generér ----
fs.mkdirSync(OUT, { recursive: true });
const all = process.argv.includes('--all');
const index = {};
const todo = [];
for (const t of texts) {
  const file = fileFor(t);
  index[t] = file;
  if (all || !fs.existsSync(path.join(OUT, file))) todo.push({ t, file });
}
console.log(`${texts.size} tekster, ${todo.length} skal laves.`);

if (todo.length) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'piper-'));
  const input = todo.map((x, i) => JSON.stringify({ text: x.t, output_file: path.join(tmp, i + '.wav') })).join('\n') + '\n';
  const r = spawnSync(PIPER, ['-m', MODEL, '--json-input', '--length_scale', LENGTH_SCALE, '--sentence_silence', '0.15', '-q'], {
    input, env: { ...process.env, LD_LIBRARY_PATH: path.join(PIPER_DIR, 'piper') }, maxBuffer: 1 << 26,
  });
  if (r.status !== 0) { console.error(String(r.stderr)); process.exit(1); }
  todo.forEach((x, i) => {
    // mono MP3 (virker overalt, også ældre iPhones), skær stilhed af i begge ender
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(tmp, i + '.wav'),
      '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse',
      '-ac', '1', '-b:a', '48k', path.join(OUT, x.file)]);
    if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${todo.length}`);
  });
  fs.rmSync(tmp, { recursive: true, force: true });
}

// ---- Ryd gamle filer op og skriv indeks ----
const keep = new Set(Object.values(index));
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.mp3') && !keep.has(f)) fs.unlinkSync(path.join(OUT, f));
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ voice: 'Piper ' + VOICE, files: index }));
const size = [...keep].reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`Færdig: ${keep.size} filer, ${(size / 1e6).toFixed(1)} MB i audio/`);
