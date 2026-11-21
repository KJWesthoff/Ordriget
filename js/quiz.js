// Spørgsmål: valg af bogstav, valg af stavemåde, diktat, ret fejlen, ordpuslespil
// og "Se – Dæk – Skriv – Tjek" efter en fejl.
import { h, btn, setPanel, keyboard, detachKeyboard } from './ui.js';
import { speak, canSay, sfx, stopSpeech } from './audio.js';
import { sentenceWith, shuffle } from './learn.js';
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

function sentenceEl(w, blank = '______') {
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
      setPanel(header, topRow(w, { hints: hint ? hint.count() : 0, onHint, label: label || 'Vælg det rigtige bogstav' }), sentenceEl(w), wordEl, h('div', { class: 'opts' }, btns));
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
