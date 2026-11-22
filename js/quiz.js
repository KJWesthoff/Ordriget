// Spørgsmål: valg af bogstav, valg af stavemåde, diktat, ret fejlen, ordpuslespil
// og "Se – Dæk – Skriv – Tjek" efter en fejl.
import { h, btn, setPanel, keyboard, detachKeyboard } from './ui.js';
import { speak, canSay, sfx, stopSpeech } from './audio.js';
import { sentenceWith, shuffle, VOW } from './learn.js';
import { tipFor } from './data/words.js';
import { save } from './state.js';

const show = s => (s === '' ? '(intet)' : s);

const wordParts = w => (w.sentence ? [w.word, sentenceWith(w, w.word)] : [w.word]);
export function sayWord(w) {
  if (!save.settings.voice) return false;
  return speak(wordParts(w));
}
// Kan netop dette ord læses op (indspillet klip eller enhedens danske stemme)?
export const canSpeak = w => save.settings.voice && canSay(wordParts(w));

function sentenceEl(w, len = 6) {
  const blank = '_'.repeat(len);
  if (!w.sentence) return h('div', { class: 'sentence' }, 'Stav ordet:');
  const [a, b] = w.sentence.split('___');
  const cap = !a;
  return h('div', { class: 'sentence' }, a ? a.charAt(0).toUpperCase() + a.slice(1) : '', h('span', { class: 'blank' + (cap ? ' cap' : '') }, blank), b || '');
}

function topRow(w, { hints, onHint, label }) {
  return h('div', { class: 'q-top' },
    h('div', { class: 'q-label' }, label || ''),
    canSpeak(w) ? h('button', { class: 'icon-btn', onclick: () => sayWord(w), title: 'Hør igen' }, '🔊') : null,
    onHint ? h('button', { class: 'icon-btn hint', onclick: onHint, disabled: hints <= 0 ? true : null }, '🪶', h('small', {}, String(hints))) : null,
  );
}

// header: elementer der skal vises over selve spørgsmålet (fx kamp-info)
// hint: { count, use() } – use() returnerer false hvis der ikke er flere
export function ask(q, { header = null, hint = null, label = '' } = {}) {
  window.__q = q; // bruges af automatiske tests
  if (q.type === 'choice') return askChoice(q, header, hint, label);
  if (q.type === 'pick') return askPick(q, header, hint, label);
  if (q.type === 'scramble') return askScramble(q, header, hint, label);
  if (q.type === 'wheel') return askWheel(q, header, hint, label);
  if (q.type === 'vowel') return askVowel(q, header, hint, label);
  if (q.type === 'sieve') return askSieve(q, header, hint, label);
  return askType(q, header, hint, label);
}

function askChoice(q, header, hint, label) {
  return new Promise(resolve => {
    const w = q.w; let done = false, hinted = false;
    const slot = h('span', { class: 'slot pulse' }, '?');
    const wordEl = h('div', { class: 'word' }, w.pre, slot, w.post);
    const btns = q.opts.map(o => h('button', { class: 'btn opt', onclick: () => choose(o, btns[q.opts.indexOf(o)]) }, show(o)));
    const onHint = hint ? () => {
      if (done || !hint.use()) return;
      hinted = true;
      const wrong = btns.filter((b, i) => q.opts[i] !== w.ans && !b.disabled);
      if (wrong.length) { wrong[0].disabled = true; wrong[0].classList.add('gone'); }
      render();
    } : null;
    function render() {
      setPanel(header, topRow(w, { hints: hint ? hint.count() : 0, onHint, label: label || 'Vælg det rigtige bogstav' }), sentenceEl(w, w.pre.length + 1 + w.post.length), wordEl, h('div', { class: 'opts' }, btns));
    }
    function choose(o, b) {
      if (done) return; done = true;
      const ok = o === w.ans;
      slot.classList.remove('pulse');
      slot.textContent = o === '' ? '' : o;
      slot.classList.add(ok ? 'good' : 'bad');
      if (o === '') slot.classList.add('empty');
      b.classList.add(ok ? 'good' : 'bad');
      sfx(ok ? 'correct' : 'wrong');
      setTimeout(() => resolve({ correct: ok, hinted }), ok ? 550 : 800);
    }
    render();
    sayWord(w);
  });
}

function askPick(q, header, hint, label) {
  return new Promise(resolve => {
    const w = q.w; let done = false, hinted = false;
    const btns = q.opts.map((o, i) => h('button', { class: 'btn pick', onclick: () => choose(i) }, o));
    const onHint = hint ? () => {
      if (done || !hint.use()) return;
      hinted = true;
      const wrong = btns.filter((b, i) => q.opts[i] !== w.word && !b.disabled);
      if (wrong.length) { const b = wrong[Math.floor(Math.random() * wrong.length)]; b.disabled = true; b.classList.add('gone'); }
      render();
    } : null;
    function render() {
      setPanel(header, topRow(w, { hints: hint ? hint.count() : 0, onHint, label: label || 'Hvilket ord er stavet rigtigt?' }), sentenceEl(w), h('div', { class: 'picks' }, btns));
    }
    function choose(i) {
      if (done) return; done = true;
      const ok = q.opts[i] === w.word;
      btns[i].classList.add(ok ? 'good' : 'bad');
      if (!ok) btns[q.opts.indexOf(w.word)].classList.add('good');
      sfx(ok ? 'correct' : 'wrong');
      setTimeout(() => resolve({ correct: ok, hinted }), ok ? 550 : 1000);
    }
    render();
    sayWord(w);
  });
}

// Diktat (type) og "ret fejlen" (fix)
function askType(q, header, hint, label) {
  return new Promise(resolve => {
    const w = q.w; let typed = '', done = false, hinted = false, revealed = 0;
    const voice = canSpeak(w);
    const slotsEl = h('div', { class: 'slots' });
    const msg = h('div', { class: 'q-msg' });
    function drawSlots(state) {
      slotsEl.replaceChildren(...w.word.split('').map((c, i) => {
        const ch = typed[i] || '';
        let cls = 'ls';
        if (state === 'check') cls += ch === c ? ' good' : ' bad';
        else if (i === typed.length) cls += ' cur';
        return h('span', { class: cls }, ch);
      }), typed.length > w.word.length ? h('span', { class: 'ls bad' }, '+' + (typed.length - w.word.length)) : '');
    }
    const kb = keyboard({
      onKey: c => { if (done || typed.length >= w.word.length + 2) return; typed += c; drawSlots(); },
      onBack: () => { if (done || typed.length <= revealed) return; typed = typed.slice(0, -1); drawSlots(); },
      onEnter: () => submit(),
    });
    function submit() {
      if (done) return;
      if (!typed.length) { msg.textContent = 'Skriv ordet først 🙂'; return; }
      done = true; kb.detach();
      const ok = typed === w.word;
      drawSlots('check');
      sfx(ok ? 'correct' : 'wrong');
      setTimeout(() => resolve({ correct: ok, hinted, typed }), ok ? 600 : 1100);
    }
    const onHint = hint ? () => {
      if (done || !hint.use()) return;
      hinted = true;
      // ret det skrevne til og med næste rigtige bogstav
      let i = 0; while (i < typed.length && typed[i] === w.word[i]) i++;
      typed = w.word.slice(0, Math.min(w.word.length, i + 1));
      revealed = typed.length;
      drawSlots(); renderTop();
    } : null;
    const topHolder = h('div');
    function renderTop() {
      topHolder.replaceChildren(topRow(w, { hints: hint ? hint.count() : 0, onHint, label: label || (q.type === 'fix' ? 'Ret Vrøvls stavefejl!' : voice ? 'Lyt og skriv ordet' : 'Husk ordet og skriv det') }));
    }
    renderTop();
    const fixEl = q.type === 'fix' ? h('div', { class: 'wrongword' }, h('s', {}, q.wrong)) : null;
    function startTyping() {
      drawSlots();
      setPanel(header, topHolder, sentenceEl(w), fixEl, slotsEl, msg, kb);
    }
    if (q.type === 'type' && !voice) {
      // Uden stemme: vis ordet kort, så det skal huskes (Se – Dæk – Skriv)
      const flash = h('div', { class: 'word flash' }, w.word);
      setPanel(header, topHolder, h('div', { class: 'sentence' }, sentenceWith(w, w.word)), flash, h('div', { class: 'q-msg' }, 'Kig godt... ordet forsvinder om lidt!'));
      setTimeout(startTyping, 2600);
    } else {
      startTyping();
      sayWord(w);
    }
  });
}

// Ordpuslespil: sæt bogstaverne i rækkefølge
function askScramble(q, header, hint, label) {
  return new Promise(resolve => {
    const w = q.w; let done = false, hinted = false;
    let letters = shuffle(w.word.split(''));
    if (letters.join('') === w.word && w.word.length > 1) letters = letters.reverse();
    const tiles = letters.map((c, i) => ({ c, i, used: false }));
    const picked = [];
    const area = h('div');
    function render() {
      const slots = h('div', { class: 'slots' }, w.word.split('').map((_, i) => {
        const t = picked[i];
        return h('span', { class: 'ls tap' + (i === picked.length ? ' cur' : ''), onclick: () => { if (done || !t || t.locked) return; picked.splice(i, 1); t.used = false; render(); } }, t ? t.c : '');
      }));
      const pool = h('div', { class: 'tiles' }, tiles.map(t => h('button', { class: 'tile' + (t.used ? ' used' : ''), disabled: t.used ? true : null, onclick: () => { if (done || t.used) return; sfx('type'); t.used = true; picked.push(t); render(); if (picked.length === w.word.length) check(); } }, t.c)));
      const onHint = hint ? () => {
        if (done || !hint.use()) return;
        hinted = true;
        // fjern forkerte og læg det næste rigtige bogstav
        let i = 0; while (i < picked.length && picked[i].c === w.word[i]) i++;
        picked.splice(i).forEach(t => (t.used = false));
        const nxt = tiles.find(t => !t.used && t.c === w.word[i]);
        if (nxt) { nxt.used = true; nxt.locked = true; picked.push(nxt); }
        render();
      } : null;
      area.replaceChildren(topRow(w, { hints: hint ? hint.count() : 0, onHint, label: label || 'Sæt bogstaverne i rækkefølge' }), sentenceEl(w), slots, pool);
    }
    function check() {
      done = true;
      const ok = picked.map(t => t.c).join('') === w.word;
      sfx(ok ? 'correct' : 'wrong');
      area.querySelectorAll('.slots .ls').forEach((el, i) => el.classList.add(picked[i].c === w.word[i] ? 'good' : 'bad'));
      setTimeout(() => resolve({ correct: ok, hinted }), ok ? 600 : 1100);
    }
    setPanel(header, area);
    render();
    sayWord(w);
  });
}

// Bogstavhjul: drej hjulene, til ordet er stavet rigtigt, og tryk "Prøv låsen"
function askWheel(q, header, hint, label) {
  return new Promise(resolve => {
    const w = q.w; let done = false, hinted = false;
    const units = q.units.map(u => ({ ...u }));
    const area = h('div');
    const shown = o => (o === '' ? '·' : o);
    const spin = (u, d) => { if (done || u.locked) return; sfx('type'); u.cur = (u.cur + d + u.opts.length) % u.opts.length; render(); };
    const onHint = hint ? () => {
      if (done) return;
      const u = units.find(x => x.opts && !x.locked && x.opts[x.cur] !== x.ans) || units.find(x => x.opts && !x.locked);
      if (!u || !hint.use()) return;
      hinted = true; u.cur = u.opts.indexOf(u.ans); u.locked = true; render();
    } : null;
    function render(state) {
      const row = h('div', { class: 'wheels' }, units.map(u => u.opts
        ? h('div', { class: 'wheel' + (u.locked ? ' locked' : '') + (state ? (u.opts[u.cur] === u.ans ? ' good' : ' bad') : '') },
          h('button', { class: 'wh-btn', onclick: () => spin(u, -1), 'aria-label': 'Op' }, '▲'),
          h('div', { class: 'wh-win' },
            h('span', { class: 'wh-ghost' }, shown(u.opts[(u.cur - 1 + u.opts.length) % u.opts.length])),
            h('span', { class: 'wh-cur' }, shown(u.opts[u.cur])),
            h('span', { class: 'wh-ghost' }, shown(u.opts[(u.cur + 1) % u.opts.length]))),
          h('button', { class: 'wh-btn', onclick: () => spin(u, 1), 'aria-label': 'Ned' }, '▼'))
        : h('div', { class: 'wh-fix' }, u.s)));
      area.replaceChildren(
        topRow(w, { hints: hint ? hint.count() : 0, onHint, label: label || '🔒 Drej hjulene, så ordet staves rigtigt' }),
        sentenceEl(w, w.word.length), row,
        btn('🔑 Prøv låsen', check, 'primary', { disabled: done ? true : null }),
      );
    }
    function check() {
      if (done) return; done = true;
      const ok = units.map(u => (u.opts ? u.opts[u.cur] : u.s)).join('') === w.word;
      sfx(ok ? 'correct' : 'wrong');
      render(true);
      setTimeout(() => resolve({ correct: ok, hinted, typed: units.map(u => (u.opts ? u.opts[u.cur] : u.s)).join('') }), ok ? 600 : 1100);
    }
    setPanel(header, area);
    render();
    sayWord(w);
  });
}

// Vokal-lås: konsonanterne står der – sæt de rigtige vokaler ind
const VOWEL_KEYS = 'aeiouyæøå';
function askVowel(q, header, hint, label) {
  return new Promise(resolve => {
    const w = q.w; let done = false, hinted = false;
    const chars = [...w.word];
    const gaps = chars.map((c, i) => (VOW.includes(c) ? i : -1)).filter(i => i >= 0);
    const fill = {}; const locked = new Set();
    const area = h('div');
    const nextGap = () => gaps.find(i => fill[i] == null);
    const put = v => { if (done) return; const i = nextGap(); if (i == null) return; sfx('type'); fill[i] = v; render(); if (nextGap() == null) check(); };
    const back = () => { if (done) return; const filled = gaps.filter(i => fill[i] != null && !locked.has(i)); if (!filled.length) return; delete fill[filled[filled.length - 1]]; render(); };
    const onHint = hint ? () => {
      if (done) return;
      const i = gaps.find(k => !locked.has(k) && fill[k] !== chars[k]);
      if (i == null || !hint.use()) return;
      hinted = true;
      for (const k of gaps) if (!locked.has(k) && k > i) delete fill[k];
      fill[i] = chars[i]; locked.add(i); render();
    } : null;
    function render(state) {
      const cur = nextGap();
      const slots = h('div', { class: 'slots' }, chars.map((c, i) => {
        if (!gaps.includes(i)) return h('span', { class: 'ls fixed' }, c);
        let cls = 'ls vgap';
        if (state) cls += fill[i] === c ? ' good' : ' bad';
        else if (i === cur) cls += ' cur';
        return h('span', { class: cls, onclick: () => { if (done || locked.has(i) || fill[i] == null) return; delete fill[i]; render(); } }, fill[i] || '');
      }));
      area.replaceChildren(
        topRow(w, { hints: hint ? hint.count() : 0, onHint, label: label || '🔒 Sæt de rigtige vokaler ind' }),
        sentenceEl(w, w.word.length), slots,
        h('div', { class: 'tiles vowels' }, [...VOWEL_KEYS].map(v => h('button', { class: 'tile' + ('æøå'.includes(v) ? ' dk' : ''), onclick: () => put(v) }, v)),
          h('button', { class: 'tile back', onclick: back }, '⌫')),
      );
    }
    function check() {
      done = true;
      const typed = chars.map((c, i) => (gaps.includes(i) ? fill[i] : c)).join('');
      const ok = typed === w.word;
      sfx(ok ? 'correct' : 'wrong');
      render(true);
      setTimeout(() => resolve({ correct: ok, hinted, typed }), ok ? 600 : 1100);
    }
    setPanel(header, area);
    render();
    sayWord(w);
  });
}

// Sandhedens lås: tryk på ALLE de rigtigt stavede ord
function askSieve(q, header, hint, label) {
  return new Promise(resolve => {
    let done = false, hinted = false;
    const items = q.items.map(x => ({ ...x, on: false, gone: false }));
    const need = items.filter(x => x.ok).length;
    const area = h('div');
    const onHint = hint ? () => {
      if (done) return;
      const bad = items.filter(x => !x.ok && !x.gone);
      if (!bad.length || !hint.use()) return;
      hinted = true; const b = bad[Math.floor(Math.random() * bad.length)]; b.gone = true; b.on = false; render();
    } : null;
    function render(state) {
      area.replaceChildren(
        h('div', { class: 'q-top' }, h('div', { class: 'q-label' }, label || `🔒 Tryk på alle ${need} rigtigt stavede ord`),
          onHint ? h('button', { class: 'icon-btn hint', onclick: onHint, disabled: hint.count() <= 0 ? true : null }, '🪶', h('small', {}, String(hint.count()))) : null),
        h('div', { class: 'note' }, items.map(x => h('button', {
          class: 'chip' + (x.on ? ' on' : '') + (x.gone ? ' gone' : '') + (state ? (x.ok === x.on ? ' good' : ' bad') : ''),
          disabled: x.gone || done ? true : null,
          onclick: () => { if (done) return; sfx('type'); x.on = !x.on; render(); },
        }, x.text))),
        h('div', { class: 'q-msg' }, `Valgt: ${items.filter(x => x.on).length}`),
        btn('✔ Tjek', check, 'primary', { disabled: done ? true : null }),
      );
    }
    function check() {
      if (done) return;
      if (!items.some(x => x.on)) { sfx('wrong'); return; }
      done = true;
      const results = items.map(x => ({ w: x.w, correct: x.on === x.ok }));
      const ok = results.every(x => x.correct);
      sfx(ok ? 'correct' : 'wrong');
      render(true);
      setTimeout(() => resolve({ correct: ok, hinted, results }), ok ? 650 : 1500);
    }
    setPanel(header, area);
    render();
  });
}

// Efter en fejl: Se – Dæk – Skriv – Tjek
export function correction(w, { typed = null } = {}) {
  window.__lastCorr = w.word; // bruges af automatiske tests
  return new Promise(resolve => {
    let tries = 0;
    const wordEl = () => h('div', { class: 'word big' },
      w.custom ? w.word : [w.pre, w.ans === '' ? h('s', { class: 'ghost' }, w.opts.find(o => o) || '') : h('span', { class: 'hl' }, w.ans), w.post]);
    function look() {
      stopSpeech();
      setPanel(
        h('div', { class: 'corr-head' }, tries ? 'Næsten! Kig en gang til:' : 'Det rigtige ord er:'),
        wordEl(),
        typed && !tries ? h('div', { class: 'q-msg' }, 'Du skrev: ', h('s', {}, typed)) : null,
        w.sentence ? h('div', { class: 'sentence' }, sentenceWith(w, w.word)) : null,
        w.en ? h('div', { class: 'bridge' }, h('span', { class: 'flag' }, 'EN'), ' ' + w.en, ' → ', h('b', {}, w.word)) : null,
        h('div', { class: 'tip' }, '💡 ' + tipFor(w)),
        h('div', { class: 'row' },
          canSpeak(w) ? h('button', { class: 'icon-btn', onclick: () => sayWord(w) }, '🔊') : null,
          btn('Jeg har kigget godt ✓', cover, 'primary grow'),
        ),
      );
      sayWord(w);
    }
    function cover() {
      let typedNow = '';
      const slotsEl = h('div', { class: 'slots' });
      const draw = st => slotsEl.replaceChildren(...w.word.split('').map((c, i) => h('span', { class: 'ls' + (st ? (typedNow[i] === c ? ' good' : ' bad') : i === typedNow.length ? ' cur' : '') }, typedNow[i] || '')));
      const kb = keyboard({
        onKey: c => { if (typedNow.length < w.word.length + 2) { typedNow += c; draw(); } },
        onBack: () => { typedNow = typedNow.slice(0, -1); draw(); },
        onEnter: () => {
          if (!typedNow) return;
          kb.detach();
          const ok = typedNow === w.word;
          draw(true);
          sfx(ok ? 'correct' : 'wrong');
          tries++;
          setTimeout(() => {
            if (ok) { resolve(true); }
            else if (tries >= 2) { detachKeyboard(); resolve(false); }
            else look();
          }, ok ? 500 : 900);
        },
      });
      draw();
      setPanel(h('div', { class: 'corr-head' }, 'Skriv ordet uden at kigge:'), w.sentence ? sentenceEl(w) : null, slotsEl, kb);
    }
    look();
  });
}
