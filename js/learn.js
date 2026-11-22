// Læringsmotor: Leitner-kasser (spaced repetition), ordvalg og forkerte stavemåder.
import { WORDLISTS, parseEntry } from './data/words.js';
import { save, today } from './state.js';

export const WORDS = WORDLISTS.map((list, ch) => list.map(s => parseEntry(s, ch)));
const DAY = 864e5;
const INTERVALS = [0, 1, 3, 7, 14, 30]; // dage pr. kasse

export function customWords() {
  return (save.custom || []).filter(s => s.trim()).map(s => parseEntry(s, 'c'));
}

export function wstat(id) { return save.words[id]; }

export function record(w, correct, clean) {
  let s = save.words[w.id];
  if (!s) s = save.words[w.id] = { b: 0, due: 0, c: 0, x: 0 };
  if (correct) {
    s.c++;
    if (clean) s.b = Math.min(5, s.b + 1);
    s.due = Date.now() + INTERVALS[s.b] * DAY - 3600e3; // lidt tidligere end præcis et døgn
  } else {
    s.x++;
    s.b = 0;
    s.due = 0;
  }
  s.last = Date.now();
  save.stats.answers++;
  if (correct) save.stats.correct++;
  const d = today();
  const day = save.stats.days[d] || (save.stats.days[d] = { n: 0, c: 0 });
  day.n++; if (correct) day.c++;
}

export function isDue(w) { const s = save.words[w.id]; return !s || s.due <= Date.now(); }

// Ord fra tidligere områder, som skal repeteres nu
export function reviewPool(beforeCh) {
  const out = [];
  for (let c = 0; c < Math.min(beforeCh, WORDS.length); c++)
    for (const w of WORDS[c]) { const s = save.words[w.id]; if (s && s.due <= Date.now()) out.push(w); }
  return out.concat(customWords());
}

export function trainingPool() {
  const all = [];
  for (let c = 0; c <= Math.min(save.ch, WORDS.length - 1); c++) all.push(...WORDS[c]);
  const due = all.filter(w => save.words[w.id] && save.words[w.id].due <= Date.now());
  const weak = all.filter(w => save.words[w.id] && save.words[w.id].x > 0 && !due.includes(w));
  let pool = due.concat(weak);
  if (pool.length < 8) pool = pool.concat(shuffle(all.filter(w => !pool.includes(w))).slice(0, 8 - pool.length));
  return pool.concat(customWords());
}

export function mastery(ch) {
  const list = WORDS[ch];
  let seen = 0, solid = 0;
  for (const w of list) { const s = save.words[w.id]; if (s) { seen++; if (s.b >= 3) solid++; } }
  return { total: list.length, seen, solid };
}

export class Session {
  constructor(main, review = []) {
    this.main = main.length ? main : review;
    this.review = review;
    this.recent = [];
    this.retry = [];
    this.count = 0;
  }
  next() {
    this.count++;
    const r = this.retry.findIndex(x => x.at <= this.count);
    if (r >= 0) { const w = this.retry.splice(r, 1)[0].w; this.mark(w, this.main); return w; }
    const pool = (this.review.length && Math.random() < 0.25) ? this.review : this.main;
    const w = this.pick(pool);
    this.mark(w, pool);
    return w;
  }
  mark(w, pool) {
    this.recent.push(w.id);
    const keep = Math.max(1, Math.min(8, Math.floor(pool.length * 0.6)));
    while (this.recent.length > keep) this.recent.shift();
  }
  miss(w) { this.retry.push({ w, at: this.count + 3 }); }
  pick(pool) {
    const now = Date.now();
    const cands = pool.filter(w => !this.recent.includes(w.id));
    const list = cands.length ? cands : pool;
    let best = list[0], bs = Infinity;
    for (const w of list) {
      const s = save.words[w.id];
      let sc;
      if (!s) sc = 1 + Math.random() * 2;                                        // nyt ord
      else if (s.due <= now) sc = s.b * 0.5 + Math.random() * 1.5 - (s.x > s.c ? 1 : 0); // skal repeteres
      else sc = 3.5 + s.b + Math.random() * 2;                                   // sidder fast
      if (sc < bs) { bs = sc; best = w; }
    }
    return best;
  }
}

export function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const SWAP = { e: ['æ', 'i', 'a'], 'æ': ['e', 'a'], i: ['e', 'y'], y: ['ø', 'i', 'u'], 'ø': ['y', 'u', 'o'], u: ['o', 'ø'], o: ['å', 'u'], 'å': ['o', 'u', 'oa'], a: ['æ'] };
export const VOW = 'aeiouyæøå';

// Typiske stavefejl for et ord. De mest "lærerige" først.
export function misspellings(w) {
  const word = w.word;
  const first = [], rest = new Set();
  if (w.opts) for (const o of w.opts) if (o !== w.ans) first.push(w.pre + o + w.post);
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (SWAP[ch]) for (const alt of SWAP[ch]) rest.add(word.slice(0, i) + alt + word.slice(i + 1));
    // dobbelt -> enkelt
    if (i > 0 && ch === word[i - 1] && !VOW.includes(ch)) rest.add(word.slice(0, i) + word.slice(i + 1));
    // enkelt -> dobbelt efter kort vokal
    if (i > 0 && !VOW.includes(ch) && VOW.includes(word[i - 1]) && word[i + 1] !== ch) rest.add(word.slice(0, i) + ch + word.slice(i));
  }
  if (/^h[vj]/.test(word)) rest.add(word.slice(1));
  if (/[nlr]d/.test(word)) rest.add(word.replace(/([nlr])d/, '$1'));
  if (word.endsWith('er')) rest.add(word.slice(0, -1));
  else if (word.endsWith('e')) rest.add(word + 'r');
  if (/k[aoulr]/.test(word)) rest.add(word.replace(/k([aoulr])/, 'c$1'));
  if (word.startsWith('v')) rest.add('w' + word.slice(1));
  if (VOW.includes(word[word.length - 1]) && word.length <= 4) rest.add(word + 'h');
  const out = [...new Set(first)].filter(s => s !== word);
  for (const s of shuffle([...rest])) if (s !== word && !out.includes(s)) out.push(s);
  return out;
}

// Laver et spørgsmål. kind: hug | pick | type | fix | scramble | wheel | vowel
// (sieve bygges med makeSieve, fordi den bruger flere ord)
export function makeQuestion(w, kind) {
  if (kind === 'scramble') return { type: 'scramble', w };
  if (kind === 'wheel') return makeWheel(w) || makeQuestion(w, 'pick');
  if (kind === 'vowel') return [...w.word].some(c => VOW.includes(c)) ? { type: 'vowel', w } : makeQuestion(w, 'pick');
  if (kind === 'hug') kind = (w.opts && Math.random() < 0.65) ? 'choice' : 'pick';
  if (kind === 'choice' && !w.opts) kind = 'pick';
  if (kind === 'choice') return { type: 'choice', w, opts: shuffle(w.opts) };
  if (kind === 'pick') {
    const ms = misspellings(w);
    const firsts = ms.slice(0, w.opts ? w.opts.length - 1 : 0);
    const others = shuffle(ms.slice(firsts.length));
    const d = firsts.concat(others).slice(0, 3);
    return { type: 'pick', w, opts: shuffle([w.word, ...d]) };
  }
  if (kind === 'fix') { const ms = misspellings(w); return { type: 'fix', w, wrong: ms[0] || w.word.split('').reverse().join('') }; }
  return { type: 'type', w };
}

export function sentenceWith(w, fill) {
  if (!w.sentence) return '';
  let s = w.sentence.replace('___', fill);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Bogstavhjul-lås: ordets svære del bliver et hjul, plus evt. et ekstra vokalhjul.
// units: [{ s }] faste bogstaver og [{ opts, ans }] hjul.
export function makeWheel(w) {
  const units = [];
  if (w.opts) {
    for (const c of w.pre) units.push({ s: c });
    units.push({ opts: w.opts.slice(), ans: w.ans });
    for (const c of w.post) units.push({ s: c });
  } else {
    for (const c of w.word) units.push({ s: c });
  }
  const wheels = () => units.filter(u => u.opts).length;
  const cands = units.map((u, i) => i).filter(i => units[i].s && SWAP[units[i].s] && !(units[i - 1] && units[i - 1].opts) && !(units[i + 1] && units[i + 1].opts));
  for (const i of shuffle(cands)) {
    if (wheels() >= 2) break;
    const c = units[i].s;
    units[i] = { opts: [c, ...SWAP[c].filter(x => x.length === 1)].slice(0, 3), ans: c };
  }
  if (!wheels()) return null;
  // hjulene starter på et forkert bogstav
  for (const u of units) if (u.opts) {
    const wrong = u.opts.map((o, k) => k).filter(k => u.opts[k] !== u.ans);
    u.cur = wrong.length ? wrong[Math.floor(Math.random() * wrong.length)] : 0;
  }
  return { type: 'wheel', w, units };
}

// Sandhedens lås / Ordstorm: find alle rigtigt stavede ord blandt nogle forkerte.
export function makeSieve(words) {
  const seen = new Set(), ws = [];
  for (const w of words) if (!seen.has(w.word) && ws.length < 6) { seen.add(w.word); ws.push(w); }
  const nBad = Math.max(1, Math.min(3, Math.floor(ws.length / 2)));
  const bad = new Set(shuffle(ws.map((w, i) => i)).slice(0, nBad));
  const items = ws.map((w, i) => {
    if (!bad.has(i)) return { w, text: w.word, ok: true };
    const m = misspellings(w)[0];
    return m ? { w, text: m, ok: false } : { w, text: w.word, ok: true };
  });
  return { type: 'sieve', w: ws[0], items: shuffle(items) };
}

// Gem et svar. Spørgsmål med flere ord (sieve) giver r.results.
export function recordAnswer(w, r, clean = true) {
  if (r.results) for (const x of r.results) record(x.w, x.correct, x.correct && !r.hinted && clean);
  else record(w, r.correct, r.correct && !r.hinted && clean);
}
// Det ord, der skal vises i "Se – Dæk – Skriv – Tjek" efter en fejl
export const missedWord = (w, r) => (r.results && (r.results.find(x => !x.correct) || {}).w) || w;
