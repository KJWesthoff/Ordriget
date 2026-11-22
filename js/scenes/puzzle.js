import { W, H, text, sprite, heroCanvas, rng, glow, shadow } from '../gfx.js';
import { h, btn, setPanel, hud, dialog } from '../ui.js';
import { save, persist } from '../state.js';
import { music, sfx, stopSpeech } from '../audio.js';
import { ITEMS, CHAPTERS } from '../data/game.js';
import { Session, makeQuestion, record, recordAnswer, missedWord, misspellings, shuffle } from '../learn.js';
import { ask, correction } from '../quiz.js';
import { tween, wait, burst, floatText, shake } from '../fx.js';
import { grantRewards } from '../flow.js';

const RUNES = ['Æ', 'Ø', 'Å', 'H', 'R', 'K'];

export class PuzzleScene {
  constructor(o) { this.o = o; this.ch = o.ch; }
  enter() {
    music('puzzle');
    hud({ noMenu: true });
    this.lit = 0; this.open = 0; this.chest = 0;
    this.freeHints = 3;
    this.xp = 0; this.correct = 0; this.total = 0;
    this.session = new Session(this.o.main, this.o.review);
    // statisk baggrund
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); const r = rng(9 + this.ch);
    g.fillStyle = '#202020'; g.fillRect(0, 0, W, H);
    for (let y = 0; y < 140; y += 8) for (let x = (y / 8) % 2 ? -8 : 0; x < W; x += 16) {
      g.fillStyle = r() < 0.15 ? '#585858' : '#404040'; g.fillRect(x + 1, y + 1, 14, 6);
    }
    g.fillStyle = '#503000'; g.fillRect(0, 140, W, H - 140);
    for (let i = 0; i < 120; i++) { g.fillStyle = r() < 0.5 ? '#3a2400' : '#6a4400'; g.fillRect(Math.floor(r() * W), 140 + Math.floor(r() * 52), 2, 1); }
    this.bg = c;
    this.run();
  }
  exit() { stopSpeech(); }

  hint() {
    return {
      count: () => this.freeHints + (save.inv.fjer || 0),
      use: () => { if (this.freeHints > 0) { this.freeHints--; return true; } if ((save.inv.fjer || 0) > 0) { save.inv.fjer--; return true; } return false; },
    };
  }
  header(label) {
    return h('div', { class: 'b-head' }, h('span', {}, '🚪 Runedøren'), h('span', {}, '✨ ' + this.lit + '/4 runer'), label ? h('span', {}, label) : null);
  }

  async run() {
    if (!save.seen.puzzle) {
      save.seen.puzzle = true; persist();
      await dialog([['ulla', 'En runedør! Hver rune lyser, når du løser en ordgåde. Tænd alle fire, så åbner døren.'], ['ulla', 'Her slår ingen monstre – så tag dig god tid.']]);
    }
    // fire runer: to faste opgaver og to tilfældige fra de nye gåder
    const extra = shuffle(['scramble', 'wheel', 'vowel']);
    const tasks = [extra[0], 'finderror', extra[1], 'bridge'];
    for (const tk of tasks) {
      let ok = false;
      while (!ok) ok = await this[tk]();
      this.lit++;
      sfx('coin');
      burst(108 + (this.lit - 1) * 13 + 4, 70, '#3cbcfc', 16, 40);
      await wait(400);
    }
    sfx('open');
    await tween(900, p => { this.open = p; });
    shake(3);
    await tween(500, p => { this.chest = p; });
    await this.reward();
  }

  async one(w, kind, label) {
    const q = makeQuestion(w, kind);
    const r = await ask(q, { header: this.header(), hint: this.hint(), label });
    recordAnswer(w, r);
    this.total++;
    persist();
    if (r.correct) { this.correct++; this.xp += 4; floatText('+4', 128, 60, '#3cbcfc'); return true; }
    const mw = missedWord(w, r);
    this.session.miss(mw);
    await correction(mw, { typed: r.typed });
    return false;
  }

  scramble() { return this.one(this.session.next(), 'scramble', '🧩 Sæt bogstaverne i rækkefølge'); }
  wheel() { return this.one(this.session.next(), 'wheel', '🎡 Runehjulene: drej, så ordet staves rigtigt'); }
  vowel() { return this.one(this.session.next(), 'vowel', '🔤 Runen mangler vokalerne – sæt dem ind'); }

  async bridge() {
    let stones = 0;
    while (stones < 3) {
      const ok = await this.one(this.session.next(), 'pick', `🪨 Byg broen: vælg den rigtige sten (${stones + 1}/3)`);
      if (ok) stones++;
    }
    return true;
  }

  finderror() {
    return new Promise(resolve => {
      const ws = []; const seen = new Set();
      for (let k = 0; k < 12 && ws.length < 4; k++) { const w = this.session.next(); if (!seen.has(w.word)) { seen.add(w.word); ws.push(w); } }
      const bad = Math.floor(Math.random() * ws.length);
      const target = ws[bad];
      const wrong = misspellings(target)[0] || target.word + target.word.slice(-1);
      let tries = 0;
      const render = msg => setPanel(
        this.header(),
        h('div', { class: 'q-label' }, '📜 Vrøvl har skrevet en seddel. Ét ord er stavet forkert – tryk på det!'),
        h('div', { class: 'note' }, ws.map((w, i) => h('button', { class: 'chip', onclick: e => tap(i, e.currentTarget) }, i === bad ? wrong : w.word))),
        msg ? h('div', { class: 'q-msg' }, msg) : null,
      );
      const tap = async (i, el) => {
        if (i !== bad) {
          tries++;
          sfx('wrong');
          el.classList.add('shake', 'okword');
          el.disabled = true;
          return;
        }
        sfx('correct');
        el.classList.add('good');
        await wait(500);
        const r = await ask({ type: 'fix', w: target, wrong }, { header: this.header(), hint: this.hint(), label: '✏️ Skriv ordet rigtigt' });
        record(target, r.correct, r.correct && !r.hinted && tries === 0);
        this.total++;
        persist();
        if (r.correct) { this.correct++; this.xp += 5; resolve(true); }
        else { this.session.miss(target); await correction(target, { typed: r.typed }); resolve(false); }
      };
      render();
    });
  }

  async reward() {
    const ch = this.ch;
    const gold = 15 + 12 * ch + Math.floor(Math.random() * 10);
    const items = [];
    const pool = Object.entries(ITEMS).filter(([id, it]) => it.price > 0 && (it.ch || 0) <= ch && it.slot !== 'use' && it.slot !== 'weapon' && it.slot !== 'shield' && !save.owned.includes(id));
    if (pool.length && Math.random() < 0.35) items.push(pool[Math.floor(Math.random() * pool.length)][0]);
    else { items.push('fjer', 'drik'); }
    sfx('victory');
    await new Promise(res => setPanel(
      h('div', { class: 'modal-title' }, '🎁 Skattekisten!'),
      h('div', { class: 'sumgrid' },
        h('div', {}, '✏️ Rigtige'), h('b', {}, `${this.correct} / ${this.total}`),
        h('div', {}, '⭐ Erfaring'), h('b', {}, '+' + this.xp),
        h('div', {}, '🪙 Guld'), h('b', {}, '+' + gold),
      ),
      h('div', { class: 'loot' }, items.map(id => h('div', {}, '🎁 ' + ITEMS[id].name))),
      btn('Fortsæt ▶', res, 'primary big'),
    ));
    await grantRewards({ xp: this.xp, gold, items });
    this.o.onEnd(true);
  }

  draw(ctx, t) {
    ctx.drawImage(this.bg, 0, 0);
    // fakler
    for (const tx of [52, 196]) {
      ctx.fillStyle = '#503000'; ctx.fillRect(tx, 70, 4, 14);
      const f = Math.round(Math.sin(t * 13 + tx) * 1.5);
      glow(ctx, tx + 2, 64, 30 + f * 2, 'rgba(248,140,40,.32)');
      ctx.fillStyle = '#e45c10'; ctx.fillRect(tx - 2, 60 + f, 8, 10);
      ctx.fillStyle = '#f8b800'; ctx.fillRect(tx, 63 + f, 4, 6);
    }
    // dør
    const dx = 100, dy = 46, dw = 56, dh = 94;
    ctx.fillStyle = '#7c7c7c'; ctx.fillRect(dx - 6, dy - 6, dw + 12, dh + 6);
    ctx.fillStyle = '#000'; ctx.fillRect(dx, dy, dw, dh);
    const ow = Math.round((dw / 2) * this.open);
    ctx.fillStyle = '#ac7c00';
    ctx.fillRect(dx, dy, dw / 2 - ow, dh); ctx.fillRect(dx + dw / 2 + ow, dy, dw / 2 - ow, dh);
    ctx.fillStyle = '#503000';
    for (let x = dx + 6; x < dx + dw; x += 8) { if (x < dx + dw / 2 - ow || x > dx + dw / 2 + ow) ctx.fillRect(x, dy, 1, dh); }
    if (this.open < 0.5) {
      for (let i = 0; i < 4; i++) {
        const rx = dx + 4 + i * 13, ry = 64;
        const on = i < this.lit;
        ctx.fillStyle = '#000'; ctx.fillRect(rx - 1, ry - 1, 12, 14);
        ctx.fillStyle = on ? (Math.sin(t * 6 + i) > 0 ? '#3cbcfc' : '#a4e4fc') : '#201030';
        ctx.fillRect(rx, ry, 10, 12);
        text(ctx, RUNES[(this.ch + i) % RUNES.length], rx + 5, ry + 2, { size: 8, color: on ? '#fcfcfc' : '#503060', align: 'center', shadow: null });
      }
    }
    // kiste
    if (this.chest > 0) {
      const cy = 118 + Math.round((1 - this.chest) * 20);
      ctx.globalAlpha = this.chest;
      ctx.fillStyle = '#000'; ctx.fillRect(113, cy - 1, 30, 22);
      ctx.fillStyle = '#ac7c00'; ctx.fillRect(114, cy, 28, 20);
      ctx.fillStyle = '#f8b800'; ctx.fillRect(114, cy + 7, 28, 3); ctx.fillRect(126, cy + 5, 4, 7);
      ctx.globalAlpha = 1;
      if (Math.random() < 0.3) burst(128, cy, '#f8b800', 1, 30, 20);
    }
    for (let i = 0; i < this.lit; i++) if (this.open < 0.5) glow(ctx, 100 + 4 + i * 13 + 5, 70, 12, 'rgba(60,188,252,.4)');
    if (this.open > 0) glow(ctx, 128, 92, 50 * this.open, `rgba(252,240,180,${0.4 * this.open})`);
    shadow(ctx, 54, 167, 15, 3);
    ctx.drawImage(heroCanvas(save.look), 30, 120 + Math.round(Math.sin(t * 2.5)), 48, 48);
    ctx.drawImage(sprite('owl'), 196, 110 + Math.round(Math.sin(t * 4) * 3), 32, 32);
    text(ctx, CHAPTERS[this.ch].name + ' · Runedøren', W / 2, 8, { size: 7, align: 'center', color: '#fce0a8' });
  }
}
