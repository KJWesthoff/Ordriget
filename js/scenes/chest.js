// Låst skattekiste: hver lås er en stavegåde. Belønning: guld, en skriftrulle til Krøniken og måske en livskrystal.
import { W, H, text, sprite, heroCanvas, buildBattleBg, ambient, shadow, glow } from '../gfx.js';
import { h, btn, setPanel, hud, dialog } from '../ui.js';
import { save, persist } from '../state.js';
import { music, sfx, stopSpeech } from '../audio.js';
import { ITEMS, CHAPTERS, LOCK_NAMES } from '../data/game.js';
import { LORE, CHEST_INTRO, LORE_SAVED, loreLine } from '../data/story.js';
import { Session, makeQuestion, makeSieve, recordAnswer, missedWord } from '../learn.js';
import { ask, correction } from '../quiz.js';
import { tween, wait, burst, floatText, shake } from '../fx.js';
import { grantRewards } from '../flow.js';

const CX = 128, CY = 128; // kistens midte forneden
const IRON = { h: '#7c7c88', H: '#404050', y: '#d8d8e8', Y: '#fcfcfc' };

export class ChestScene {
  constructor(o) { this.o = o; this.ch = o.ch; this.k = o.k; this.def = CHAPTERS[o.ch].chests[o.k]; }
  enter() {
    music('puzzle');
    hud({ noMenu: true });
    this.bg = buildBattleBg(CHAPTERS[this.ch].theme);
    this.locks = this.def.locks.map(kind => ({ kind, off: 0, done: false }));
    this.lid = 0; this.shake = 0;
    this.freeHints = 3;
    this.xp = 0; this.correct = 0; this.total = 0;
    this.session = new Session(this.o.main, this.o.review);
    this.run();
  }
  exit() { stopSpeech(); }

  hint() {
    return {
      count: () => this.freeHints + (save.inv.fjer || 0),
      use: () => { if (this.freeHints > 0) { this.freeHints--; return true; } if ((save.inv.fjer || 0) > 0) { save.inv.fjer--; return true; } return false; },
    };
  }
  header() {
    const left = this.locks.filter(l => !l.done).length;
    return h('div', { class: 'b-head' }, h('span', {}, '🧰 ' + this.def.name), h('span', {}, '🔒 ' + left + ' lås' + (left === 1 ? '' : 'e') + ' tilbage'));
  }

  async run() {
    if (!save.seen.chest) { save.seen.chest = true; persist(); await dialog(CHEST_INTRO); }
    for (const lock of this.locks) {
      let ok = false;
      while (!ok) ok = await this.solve(lock.kind);
      lock.done = true;
      sfx('unlock');
      await tween(500, p => { lock.off = p; });
      burst(this.lockX(this.locks.indexOf(lock)), CY - 22, '#f8d878', 14, 50);
      await wait(250);
    }
    sfx('open');
    shake(3);
    await tween(700, p => { this.lid = p; });
    for (let i = 0; i < 3; i++) { burst(CX, CY - 30, ['#f8b800', '#fcfcfc', '#7cf0fc'][i], 20, 80, 40); await wait(120); }
    await this.reward();
  }

  async solve(kind) {
    const w = this.session.next();
    const q = kind === 'sieve' ? makeSieve([w, ...Array.from({ length: 5 }, () => this.session.next())]) : makeQuestion(w, kind);
    const r = await ask(q, { header: this.header(), hint: this.hint(), label: kind === 'sieve' ? null : LOCK_NAMES[kind] + ': ' + (kind === 'wheel' ? 'drej hjulene' : 'sæt vokalerne ind') });
    recordAnswer(w, r);
    this.total++;
    persist();
    if (r.correct) { this.correct++; this.xp += 5; floatText('+5', CX, 70, '#7cf0fc'); return true; }
    sfx('clunk');
    this.shake = 0.4;
    const mw = missedWord(w, r);
    this.session.miss(mw);
    await correction(mw, { typed: r.typed });
    return false;
  }

  async reward() {
    const ch = this.ch, id = ch + '-' + this.k;
    const gold = 25 + 15 * ch + Math.floor(Math.random() * 10) + (this.k ? 20 : 0);
    const items = [];
    if (this.k === 1) items.push('energikrystal');
    else {
      const pool = Object.entries(ITEMS).filter(([iid, it]) => it.price > 0 && (it.ch || 0) <= ch && ['tunic', 'hat', 'cape'].includes(it.slot) && !save.owned.includes(iid));
      if (pool.length) items.push(pool[Math.floor(Math.random() * pool.length)][0]);
      else items.push('magidrik');
    }
    items.push('fjer');
    const first = !save.chests[id];
    save.chests[id] = true;
    const lore = LORE[id];
    if (lore && !save.lore.includes(id)) save.lore.push(id);
    persist();
    sfx('victory');
    await new Promise(res => setPanel(
      h('div', { class: 'modal-title' }, '🧰 ' + this.def.name + ' er åben!'),
      h('div', { class: 'sumgrid' },
        h('div', {}, '✏️ Rigtige'), h('b', {}, `${this.correct} / ${this.total}`),
        h('div', {}, '⭐ Erfaring'), h('b', {}, '+' + this.xp),
        h('div', {}, '🪙 Guld'), h('b', {}, '+' + gold),
      ),
      h('div', { class: 'loot' },
        items.map(iid => h('div', {}, (iid === 'energikrystal' ? '💠 ' : '🎁 ') + ITEMS[iid].name + (iid === 'energikrystal' ? ' – +1 maks livsenergi!' : ''))),
        lore ? h('div', {}, '📜 Skriftrulle: ' + lore.title) : null),
      btn('Læs skriftrullen ▶', res, 'primary big'),
    ));
    await grantRewards({ xp: this.xp, gold: first ? gold : 0, items });
    if (lore) await dialog([['brev', loreLine(lore)], ...LORE_SAVED]);
    this.o.onEnd(true);
  }

  lockX(i) { const n = this.locks.length; return CX - (n - 1) * 13 + i * 26; }

  update(dt) { if (this.shake > 0) this.shake -= dt; }

  draw(ctx, t) {
    ctx.drawImage(this.bg, 0, 0, W, H);
    ambient(ctx, CHAPTERS[this.ch].theme, t);
    const jig = this.shake > 0 ? Math.round(Math.sin(t * 60) * 2) : 0;
    const iron = this.k === 1;
    const x = CX - 32 + jig, y = CY - 40;
    shadow(ctx, CX, CY + 2, 38, 5);
    if (this.lid > 0) glow(ctx, CX, y + 4, 30 + this.lid * 30, `rgba(248,216,120,${0.5 * this.lid})`);
    ctx.drawImage(sprite('chest', iron ? IRON : null), x, y, 64, 40);
    // låg
    const lidY = y - Math.round(this.lid * 14);
    ctx.globalAlpha = 1 - this.lid * 0.6;
    ctx.drawImage(sprite('chestLid', iron ? IRON : null), x, lidY - 18, 64, 20);
    ctx.globalAlpha = 1;
    // låse
    this.locks.forEach((l, i) => {
      if (l.off >= 1) return;
      const lx = this.lockX(i) + jig, ly = y + 12 + Math.round(l.off * 30);
      ctx.globalAlpha = 1 - l.off;
      const spr = sprite('padlock', { a: l.kind === 'wheel' ? '#f8b800' : l.kind === 'vowel' ? '#bcbcbc' : '#7cf0fc' });
      ctx.drawImage(spr, lx - 8, ly - 10, 16, 20);
      ctx.globalAlpha = 1;
    });
    ctx.drawImage(heroCanvas(save.look), 24, 112 + Math.round(Math.sin(t * 2.5)), 48, 48);
    ctx.drawImage(sprite('owl'), 200, 100 + Math.round(Math.sin(t * 4) * 3), 32, 32);
    text(ctx, CHAPTERS[this.ch].name + ' · ' + this.def.name, W / 2, 8, { size: 7, align: 'center', color: '#fce0a8' });
  }
}
