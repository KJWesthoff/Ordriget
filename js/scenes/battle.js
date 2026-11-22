import { W, H, text, sprite, heroCanvas, petCanvas, monsterCanvas, buildBattleBg, bar, box, ambient, shadow, glow } from '../gfx.js';
import { h, btn, setPanel, hud, dialog, modal } from '../ui.js';
import { save, persist } from '../state.js';
import { music, sfx, stopSpeech } from '../audio.js';
import { MONSTERS, MON_HP, MON_DMG, ITEMS, ABILITIES, heroStats } from '../data/game.js';
import { Session, makeQuestion, makeSieve, recordAnswer, missedWord } from '../learn.js';
import { ask, correction } from '../quiz.js';
import { tween, wait, floatText, burst, rise, shake, ease } from '../fx.js';
import { grantRewards } from '../flow.js';
import { SKILLS_INTRO } from '../data/story.js';

const HERO_X = 60, FLOOR = 152, MON_X = 188;

export class BattleScene {
  constructor(o) {
    this.o = o;
    this.ch = o.ch;
  }
  enter() {
    const o = this.o;
    this.bg = buildBattleBg(o.theme);
    music(o.boss ? 'boss' : 'battle');
    this.st = heroStats(save);
    this.hp = this.st.maxHp;
    this.mp = this.st.maxMp;
    this.freeHints = 3 + this.st.petHint;
    this.streak = 0; this.bestStreak = 0;
    this.shield = 0; this.counter = false; this.turn = 0;
    this.wave = 0; this.phase = 0;
    this.rewards = { xp: 0, gold: 0, correct: 0, total: 0 };
    this.hero = { ox: 0, oy: 0, flash: 0 };
    this.proj = null; this.bolt = 0; this.banner = null; this.slash = null; this.spin = 0; this.runeGlow = 0;
    this.session = new Session(o.main, o.review || []);
    this.spawn(o.waves[0], true);
    hud({ hp: this.hp, noMenu: true });
    this.run();
  }
  exit() { stopSpeech(); }

  spawn(key, instant = false) {
    const def = MONSTERS[key];
    const base = MON_HP[Math.min(this.ch, MON_HP.length - 1)];
    let hp = Math.round(base * (0.9 + Math.random() * 0.2));
    if (this.o.boss) hp = Math.round(base * (this.phase ? 2.4 : 3.5));
    if (this.o.training) hp = Math.round(base * 0.8);
    this.mon = { key, def, hp, maxHp: hp, ox: instant ? 0 : 120, oy: 0, flash: 0, alpha: 1, scale: this.o.boss ? 4 : 3 };
    if (!instant) return tween(450, p => { this.mon.ox = 120 * (1 - ease(p)); });
  }

  hint() {
    return {
      count: () => this.freeHints + (save.inv.fjer || 0),
      use: () => {
        if (this.freeHints > 0) { this.freeHints--; return true; }
        if ((save.inv.fjer || 0) > 0) { save.inv.fjer--; return true; }
        return false;
      },
    };
  }

  header() {
    const name = this.mon.def.name;
    return h('div', { class: 'b-head' },
      h('span', {}, this.o.boss ? '👑 ' + name : name + (this.o.waves.length > 1 ? ` (${this.wave + 1}/${this.o.waves.length})` : '')),
      h('span', { class: 'mp' }, '💠 ' + this.mp + '/' + this.st.maxMp),
      this.streak >= 2 ? h('span', { class: 'streak' }, '🔥x' + this.streak) : null,
    );
  }

  async run() {
    if (this.o.pre) await dialog(this.o.pre);
    for (;;) {
      const act = await this.chooseAction();
      if (act === 'flee') { this.o.onEnd(false); return; }
      if (act === 'item') continue;
      await this.perform(act);
      if (this.hp <= 0) { await this.defeat(); return; }
      if (this.mon.hp <= 0) {
        const more = await this.monsterDown();
        if (!more) { await this.victory(); return; }
        continue;
      }
      this.turn++;
      if (this.o.boss && this.turn % 4 === 0) {
        await this.bossSpecial();
        if (this.hp <= 0) { await this.defeat(); return; }
        if (this.mon.hp <= 0) { if (!(await this.monsterDown())) { await this.victory(); return; } }
      }
    }
  }

  chooseAction() {
    return new Promise(async resolve => {
      const unlocked = ABILITIES.filter(a => a.lvl <= save.lvl);
      const skills = unlocked.filter(a => a.kind === 'sword' && a.id !== 'hug');
      const magic = unlocked.filter(a => a.kind === 'magic');
      if (skills.length && !save.seen.skills) {
        save.seen.skills = true; persist();
        await dialog(SKILLS_INTRO);
      }
      const locked = (lbl, sub) => btn(h('span', {}, lbl, h('small', {}, sub)), () => {}, 'act', { disabled: true });
      const main = () => setPanel(
        this.header(),
        h('div', { class: 'actions four' },
          btn(h('span', {}, '⚔️ Sværdhug', h('small', {}, 'Vælg bogstavet · +💠')), () => resolve(ABILITIES[0]), 'act primary'),
          skills.length ? btn(h('span', {}, '🗡️ Teknikker', h('small', {}, 'Sværdkunst')), () => list('🗡️ Sværdteknikker', skills), 'act sword') : locked('🗡️ Teknikker', 'Låses op på Nv. 2'),
          magic.length ? btn(h('span', {}, '✨ Magi', h('small', {}, 'Skriv hele ord')), () => list('✨ Magi', magic), 'act magic') : locked('✨ Magi', 'Låses op på Nv. 2'),
          btn(h('span', {}, '🎒 Taske', h('small', {}, 'Drikke')), bag, 'act'),
        ),
        this.o.boss ? null : h('div', { class: 'row end' }, h('button', { class: 'link', onclick: () => { if (confirm('Flygte tilbage til kortet?')) resolve('flee'); } }, 'Flygt 🏃')),
      );
      const list = (title, abs) => setPanel(
        this.header(),
        h('div', { class: 'small dim' }, title + ' · koster livsenergi 💠'),
        h('div', { class: 'ab-list' }, abs.map(a => {
          const can = this.mp >= a.mp;
          return h('button', { class: 'ab' + (a.kind === 'sword' ? ' sword' : '') + (can ? '' : ' off'), disabled: can ? null : true, onclick: () => { sfx('select'); resolve(a); } },
            h('span', { class: 'ab-ico' }, a.icon),
            h('span', { class: 'ab-txt' }, h('b', {}, a.name), h('small', {}, a.desc)),
            h('span', { class: 'ab-mp' }, a.mp + '💠'));
        })),
        btn('◀ Tilbage', main, 'small'),
      );
      const bag = () => {
        const usable = ['drik', 'stordrik', 'magidrik'].filter(id => (save.inv[id] || 0) > 0);
        setPanel(
          this.header(),
          usable.length ? h('div', { class: 'ab-list' }, usable.map(id => h('button', { class: 'ab', onclick: () => { this.useItem(id); resolve('item'); } },
            h('span', { class: 'ab-ico' }, id === 'magidrik' ? '💠' : '🧪'), h('span', { class: 'ab-txt' }, h('b', {}, ITEMS[id].name), h('small', {}, ITEMS[id].desc)), h('span', { class: 'ab-mp' }, 'x' + save.inv[id])))) :
            h('p', { class: 'center dim' }, 'Tasken er tom. Køb drikke i landsbyen.'),
          h('p', { class: 'small dim center' }, `🪶 Ugle-fjer: ${this.freeHints} gratis + ${save.inv.fjer || 0} i tasken`),
          btn('◀ Tilbage', main, 'small'),
        );
      };
      main();
    });
  }

  useItem(id) {
    const it = ITEMS[id];
    save.inv[id]--;
    if (it.heal) { const before = this.hp; this.hp = Math.min(this.st.maxHp, this.hp + it.heal); floatText('+' + (this.hp - before), HERO_X, 100, '#58d854'); rise(HERO_X - 16, 120, 32, '#58d854'); sfx('heal'); }
    if (it.mana) { this.mp = this.st.maxMp; rise(HERO_X - 16, 120, 32, '#7cf0fc'); sfx('heal'); }
    persist();
    hud({ hp: this.hp, noMenu: true });
  }

  label(a) {
    return {
      hug: '⚔️ Vælg det rigtige',
      dobbelt: '🗡️ Dobbelthug',
      hvirvel: '🌀 Hvirvelhug: sæt bogstaverne i rækkefølge',
      modhug: '↩️ Modhug: find den rigtige',
      rune: '🔱 Runeklinge: drej hjulene',
      storm: '🌪️ Ordstorm: tryk på alle rigtige ord',
      heal: '💚 Helbred: skriv ordet',
      fire: '🔥 Ildkugle: skriv ordet',
      frost: '🛡️ Frostskjold: find den rigtige',
      bolt: '⚡ Lynkæde: ret stavefejlen',
      stars: '🌟 Stjerneregn',
    }[a.id];
  }

  // Livsenergi: et rigtigt ord giver energi. Er den fuld, strømmer den over og heler.
  gainEnergy(n) {
    if (n <= 0) return;
    const room = this.st.maxMp - this.mp;
    this.mp = Math.min(this.st.maxMp, this.mp + n);
    if (room > 0) { rise(HERO_X - 14, 128, 28, '#7cf0fc', 6 * Math.min(n, room)); }
    const over = n - Math.max(0, room);
    if (over > 0 && this.hp < this.st.maxHp) {
      const before = this.hp; this.hp = Math.min(this.st.maxHp, this.hp + over * 2);
      floatText('+' + (this.hp - before) + ' ❤', HERO_X - 12, 84, '#58d854', 8);
      hud({ hp: this.hp, noMenu: true });
    }
  }

  async perform(a) {
    this.mp -= a.mp;
    const times = a.multi || 1;
    for (let k = 0; k < times; k++) {
      const w = this.session.next();
      const q = a.q === 'sieve' ? makeSieve([w, ...Array.from({ length: 5 }, () => this.session.next())]) : makeQuestion(w, a.q);
      const lbl = this.label(a) + (times > 1 ? ` (${k + 1}/${times})` : '');
      const r = await ask(q, { header: this.header(), hint: this.hint(), label: a.q === 'sieve' ? null : lbl });
      recordAnswer(w, r);
      this.rewards.total++;
      persist();
      if (r.correct) {
        this.rewards.correct++;
        if (!r.hinted) { this.streak++; this.bestStreak = Math.max(this.bestStreak, this.streak); }
        this.rewards.xp += a.q === 'hug' || a.q === 'pick' ? 3 : 5;
        this.gainEnergy((r.hinted ? 0 : 1) + (a.id === 'hug' ? 1 : 0) + (this.streak === 5 ? 1 : 0));
        setPanel(this.header(), h('div', { class: 'praise' }, pickPraise(this.streak), h('div', { class: 'word ok' }, w.word)));
        await this.heroAct(a);
        if (this.mon.hp <= 0) return;
      } else {
        this.streak = 0;
        const mw = missedWord(w, r);
        this.session.miss(mw);
        await this.monsterAttack(1);
        await correction(mw, { typed: r.typed });
        if (this.hp <= 0 || this.mon.hp <= 0) return;
        if (a.multi) return;
      }
    }
  }

  dmg(mult) {
    let d = this.st.atk * mult * (0.9 + Math.random() * 0.2);
    if (this.streak >= 3) d *= 1.5;
    return Math.max(1, Math.round(d));
  }

  async hitMonster(d, color = '#fcfcfc') {
    this.mon.hp = Math.max(0, this.mon.hp - d);
    this.mon.flash = 0.18;
    sfx('hit'); shake(3);
    burst(MON_X, 120, color, 16);
    floatText(String(d), MON_X, 90, this.streak >= 3 ? '#f8b800' : '#fcfcfc', this.streak >= 3 ? 14 : 11);
    if (this.streak >= 3) this.banner = { text: 'SERIE x' + this.streak + '!', t: 1.2 };
    await wait(250);
  }

  async heroAct(a) {
    const hero = this.hero;
    if (a.id === 'heal') {
      const n = Math.round(this.st.maxHp * a.heal);
      const before = this.hp; this.hp = Math.min(this.st.maxHp, this.hp + n);
      sfx('heal'); rise(HERO_X - 16, 118, 32, '#58d854', 22);
      floatText('+' + (this.hp - before), HERO_X, 96, '#58d854', 12);
      hud({ hp: this.hp, noMenu: true });
      await wait(700);
      return;
    }
    if (a.id === 'fire') {
      sfx('fire');
      this.proj = { x: HERO_X + 20, y: 118, kind: 'fire' };
      await tween(380, p => { this.proj.x = HERO_X + 20 + (MON_X - HERO_X - 20) * p; this.proj.y = 118 - Math.sin(p * Math.PI) * 18; if (Math.random() < 0.7) burst(this.proj.x, this.proj.y, Math.random() < 0.5 ? '#f8b800' : '#e45c10', 1, 20, 0); });
      this.proj = null; shake(5);
      burst(MON_X, 118, '#e45c10', 30, 90);
      await this.hitMonster(this.dmg(a.mult), '#f8b800');
    } else if (a.id === 'bolt') {
      sfx('bolt');
      for (let i = 0; i < 3; i++) { this.bolt = 0.08; await wait(90); }
      shake(7);
      await this.hitMonster(this.dmg(a.mult), '#fcfc00');
    } else if (a.id === 'stars') {
      sfx('stars');
      this.proj = { x: MON_X, y: 0, kind: 'star' };
      await tween(300, p => { this.proj.y = p * 110; this.proj.x = MON_X - 30 + p * 30; });
      this.proj = null;
      await this.hitMonster(this.dmg(a.mult), '#f8b800');
    } else if (a.id === 'hvirvel') {
      sfx('spin');
      await tween(220, p => { hero.ox = 80 * ease(p); });
      await tween(420, p => { this.spin = p; if (Math.random() < 0.6) burst(MON_X - 10 + Math.random() * 20, 110 + Math.random() * 30, '#a4e4fc', 1, 50, 0); });
      this.spin = 0;
      await this.hitMonster(this.dmg(a.mult), '#a4e4fc');
      await tween(220, p => { hero.ox = 80 * (1 - p); });
    } else if (a.id === 'rune') {
      sfx('rune');
      await tween(500, p => { this.runeGlow = p; });
      await tween(140, p => { hero.ox = 74 * ease(p); });
      this.slash = { t: 0.35, color: '#f8d878', big: true };
      shake(6); burst(MON_X, 112, '#f8d878', 28, 80);
      await this.hitMonster(this.dmg(a.mult), '#f8d878');
      this.runeGlow = 0;
      await tween(200, p => { hero.ox = 74 * (1 - p); });
    } else if (a.id === 'storm') {
      sfx('storm');
      await tween(160, p => { hero.ox = 76 * ease(p); });
      for (let i = 0; i < 5; i++) { this.slash = { t: 0.16, color: i % 2 ? '#fcfcfc' : '#7cf0fc', angle: i }; sfx('hit'); burst(MON_X, 105 + i * 6, '#7cf0fc', 8, 70); await wait(110); }
      shake(8);
      await this.hitMonster(this.dmg(a.mult), '#7cf0fc');
      await tween(200, p => { hero.ox = 76 * (1 - p); });
    } else {
      // sværdhug, dobbelthug, modhug (og frostskjold)
      await tween(a.id === 'dobbelt' ? 100 : 140, p => { hero.ox = 70 * ease(p); });
      if (!a.shield) this.slash = { t: 0.2, color: '#fcfcfc', angle: this.turn };
      await this.hitMonster(this.dmg(a.mult));
      await tween(a.id === 'dobbelt' ? 140 : 200, p => { hero.ox = 70 * (1 - p); });
      if (a.shield) { this.shield = a.shield; sfx('shield'); floatText('SKJOLD!', HERO_X, 92, '#3cbcfc', 9); await wait(300); }
      if (a.counter) { this.counter = true; sfx('shield'); floatText('PARAT!', HERO_X, 92, '#f8d878', 9); await wait(300); }
    }
    if (this.st.petDmg && this.mon.hp > 0) {
      const d = this.st.petDmg + Math.floor(Math.random() * 2);
      await wait(120);
      this.mon.hp = Math.max(0, this.mon.hp - d);
      this.mon.flash = 0.12;
      floatText(String(d), MON_X + 14, 100, '#58d854', 9);
      sfx('hit');
      await wait(200);
    }
  }

  async monsterAttack(mult) {
    const M = this.mon;
    await tween(150, p => { M.ox = -60 * ease(p); });
    let d = Math.round(MON_DMG[Math.min(this.ch, MON_DMG.length - 1)] * (this.o.boss ? 1.3 : 1) * mult * (0.85 + Math.random() * 0.3)) - this.st.def;
    if (this.o.training) d = Math.round(d * 0.6);
    d = Math.max(1, d);
    if (this.counter) {
      this.counter = false;
      sfx('parry'); burst(HERO_X + 16, 116, '#f8d878', 20);
      this.slash = { t: 0.22, color: '#f8d878', angle: 1 };
      floatText('MODHUG!', HERO_X + 10, 88, '#f8d878', 9);
      await tween(100, p => { this.hero.ox = 30 * p; });
      const back = Math.max(1, Math.round(d * 1.5 + this.st.atk * 0.5));
      this.mon.hp = Math.max(0, this.mon.hp - back);
      this.mon.flash = 0.18; shake(4);
      floatText(String(back), MON_X, 90, '#f8d878', 12);
      await tween(160, p => { this.hero.ox = 30 * (1 - p); });
    } else if (this.shield > 0) {
      this.shield--;
      sfx('shield'); burst(HERO_X, 116, '#3cbcfc', 18);
      floatText('BLOKERET', HERO_X, 92, '#3cbcfc', 9);
    } else {
      this.hp = Math.max(0, this.hp - d);
      this.hero.flash = 0.25;
      sfx('hurt'); shake(6);
      floatText('-' + d, HERO_X, 92, '#f87858', 12);
      hud({ hp: this.hp, noMenu: true });
    }
    await tween(220, p => { M.ox = -60 * (1 - p); });
    await wait(250);
  }

  async bossSpecial() {
    this.banner = { text: this.mon.def.name.split(' ').pop().toUpperCase() + ' LADER OP!', t: 2.4, color: '#f87858' };
    burst(MON_X, 110, '#d800cc', 30, 40, -30);
    await wait(700);
    const w = this.session.next();
    const q = makeQuestion(w, 'pick');
    const r = await ask(q, { header: this.header(), hint: this.hint(), label: '🛡️ Forsvar dig! Vælg den rigtige stavning' });
    recordAnswer(w, r);
    this.rewards.total++;
    if (r.correct) {
      this.rewards.correct++; this.rewards.xp += 4;
      this.gainEnergy(r.hinted ? 0 : 1);
      sfx('shield'); burst(HERO_X + 20, 110, '#3cbcfc', 24);
      floatText('PARERET!', HERO_X + 10, 88, '#3cbcfc', 10);
      await wait(600);
    } else {
      this.session.miss(w);
      await this.monsterAttack(2);
      await correction(w, { typed: r.typed });
    }
    persist();
  }

  async monsterDown() {
    const M = this.mon;
    sfx('coin');
    burst(MON_X, 110, '#fcfcfc', 30, 70);
    await tween(400, p => { M.alpha = 1 - p; M.oy = p * 10; });
    const phases = this.o.boss && this.o.waves.length > 1;
    if (phases && this.phase < this.o.waves.length - 1) {
      this.phase++;
      if (this.o.phase2) await dialog(this.o.phase2);
      await this.spawn(this.o.waves[this.phase]);
      return true;
    }
    const gold = this.o.training ? 4 : 3 + 2 * this.ch + Math.floor(Math.random() * 4);
    const xp = 5 + 3 * this.ch;
    this.rewards.gold += gold * (this.o.boss ? 8 : 1);
    this.rewards.xp += xp * (this.o.boss ? 4 : 1);
    floatText('+' + gold * (this.o.boss ? 8 : 1) + ' 🪙', MON_X, 100, '#f8b800', 9);
    if (!phases) this.wave++;
    if (phases || this.wave >= this.o.waves.length) return false;
    await wait(300);
    await this.spawn(this.o.waves[this.wave]);
    return true;
  }

  summary(title) {
    const r = this.rewards;
    const pct = r.total ? Math.round(100 * r.correct / r.total) : 0;
    return [
      h('div', { class: 'modal-title' }, title),
      h('div', { class: 'sumgrid' },
        h('div', {}, '✏️ Rigtige ord'), h('b', {}, `${r.correct} / ${r.total} (${pct}%)`),
        h('div', {}, '🔥 Bedste serie'), h('b', {}, String(this.bestStreak)),
        h('div', {}, '⭐ Erfaring'), h('b', {}, '+' + r.xp),
        h('div', {}, '🪙 Guld'), h('b', {}, '+' + r.gold),
      ),
    ];
  }

  async victory() {
    sfx('victory');
    music('village');
    this.banner = { text: 'SEJR!', t: 99, color: '#f8b800' };
    await wait(600);
    await new Promise(res => setPanel(...this.summary('SEJR! 🏆'), btn('Fortsæt ▶', res, 'primary big')));
    await grantRewards({ xp: this.rewards.xp, gold: this.rewards.gold });
    this.o.onEnd(true);
  }

  async defeat() {
    sfx('defeat');
    this.banner = { text: 'Av...', t: 99, color: '#f87858' };
    await wait(800);
    await dialog([['ulla', 'Hu-hu! Jeg fløj dig i sikkerhed. Du beholder al den erfaring, du fik – hver gang du øver, bliver du stærkere. Prøv igen!']]);
    this.rewards.gold = Math.floor(this.rewards.gold / 2);
    await new Promise(res => setPanel(...this.summary('Du må prøve igen'), btn('Tilbage til kortet', res, 'primary')));
    await grantRewards({ xp: this.rewards.xp, gold: this.rewards.gold });
    this.o.onEnd(false);
  }

  update(dt) {
    if (this.mon && this.mon.flash > 0) this.mon.flash -= dt;
    if (this.hero.flash > 0) this.hero.flash -= dt;
    if (this.bolt > 0) this.bolt -= dt;
    if (this.slash) { this.slash.t -= dt; if (this.slash.t <= 0) this.slash = null; }
    if (this.banner && this.banner.t < 90) { this.banner.t -= dt; if (this.banner.t <= 0) this.banner = null; }
  }

  draw(ctx, t) {
    ctx.drawImage(this.bg, 0, 0, W, H);
    ambient(ctx, this.o.theme, t);
    const M = this.mon;
    if (M) {
      const spr = monsterCanvas(M.def, M.flash > 0 ? { silhouette: '#fcfcfc' } : null);
      const s = M.scale, w = spr.width * s, hh = spr.height * s;
      const bob = Math.round(Math.sin(t * 3) * 1.5);
      ctx.globalAlpha = M.alpha;
      shadow(ctx, MON_X + M.ox, FLOOR + 2, w * 0.36, 4);
      if (this.o.boss) glow(ctx, MON_X + M.ox, FLOOR - hh / 2, hh * 0.7, 'rgba(216,0,204,0.18)');
      ctx.drawImage(spr, Math.round(MON_X - w / 2 + M.ox), Math.round(FLOOR + 2 - hh + M.oy + bob), w, hh);
      ctx.globalAlpha = 1;
    }
    // helt
    const hs = 2;
    const hc = heroCanvas(save.look, this.hero.flash > 0 ? { silhouette: '#f87858' } : null);
    const hb = Math.round(Math.abs(Math.sin(t * 2.5)) * -1.5);
    const hx = Math.round(HERO_X - 24 + this.hero.ox), hy = FLOOR - 40 + hb;
    shadow(ctx, HERO_X + this.hero.ox, FLOOR + 1, 15, 3);
    if (this.runeGlow > 0) glow(ctx, hx + 36, hy + 14, 10 + this.runeGlow * 22, `rgba(248,216,120,${0.55 * this.runeGlow})`);
    if (this.spin > 0) {
      ctx.save(); ctx.translate(hx + 24, hy + 24); ctx.rotate(this.spin * Math.PI * 4);
      ctx.drawImage(hc, -24, -24, 24 * hs, 24 * hs); ctx.restore();
      ctx.globalAlpha = 0.5; ctx.strokeStyle = '#a4e4fc'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(hx + 24, hy + 24, 28, this.spin * 20, this.spin * 20 + 4); ctx.stroke(); ctx.globalAlpha = 1;
    } else ctx.drawImage(hc, hx, hy, 24 * hs, 24 * hs);
    if (this.counter) { ctx.globalAlpha = 0.5 + Math.sin(t * 8) * 0.2; text(ctx, '↩', hx + 40, hy - 6, { size: 10, color: '#f8d878' }); ctx.globalAlpha = 1; }
    if (save.look.pet) { const pc = petCanvas(save.look.pet); if (pc) { shadow(ctx, HERO_X - 38, FLOOR + 1, 6, 2); ctx.drawImage(pc, HERO_X - 46, FLOOR - 16 + Math.round(Math.sin(t * 5) * 2), 16, 16); } }
    if (this.shield > 0) {
      ctx.globalAlpha = 0.35 + Math.sin(t * 6) * 0.1;
      ctx.fillStyle = '#3cbcfc';
      ctx.fillRect(hx + 4, hy + 2, 40, 2); ctx.fillRect(hx, hy + 6, 2, 34); ctx.fillRect(hx + 46, hy + 6, 2, 34); ctx.fillRect(hx + 4, hy + 42, 40, 2);
      ctx.globalAlpha = 0.12; ctx.fillRect(hx + 2, hy + 4, 44, 38);
      ctx.globalAlpha = 1;
    }
    // sværdhug: en lysende bue over fjenden
    if (this.slash) {
      const sl = this.slash, life = sl.big ? 0.35 : 0.2, p = 1 - sl.t / life;
      const cx = MON_X - 4, cy = 112, r = sl.big ? 40 : 28;
      const a0 = -2.2 + (sl.angle || 0) % 2 * 0.9;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 3; k++) {
        ctx.globalAlpha = (1 - p) * (0.9 - k * 0.25);
        ctx.strokeStyle = k === 0 ? '#fcfcfc' : sl.color; ctx.lineWidth = (sl.big ? 5 : 3) - k;
        ctx.beginPath(); ctx.arc(cx, cy, r - k * 3, a0 + p * 0.6, a0 + 1.9 + p * 0.6); ctx.stroke();
      }
      ctx.restore();
    }
    // projektiler
    if (this.proj) {
      const p = this.proj;
      if (p.kind === 'fire') { glow(ctx, p.x, p.y, 16, 'rgba(248,140,0,0.5)'); ctx.fillStyle = '#e45c10'; ctx.fillRect(p.x - 5, p.y - 5, 10, 10); ctx.fillStyle = '#f8b800'; ctx.fillRect(p.x - 3, p.y - 3, 6, 6); ctx.fillStyle = '#fcfcfc'; ctx.fillRect(p.x - 1, p.y - 1, 2, 2); }
      if (p.kind === 'star') { for (let i = 0; i < 3; i++) { glow(ctx, p.x - 11 + i * 18, p.y + 9 - i * 14, 14, 'rgba(248,216,0,0.4)'); ctx.drawImage(sprite('star'), Math.round(p.x - 20 + i * 18), Math.round(p.y - i * 14), 18, 18); } }
    }
    if (this.bolt > 0) {
      ctx.fillStyle = '#fcfcfc'; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 0.6; ctx.fillStyle = '#000058'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
      ctx.fillStyle = '#fcfc00';
      let x = MON_X + 10, y = 0;
      while (y < 120) { const nx = x + (Math.random() - 0.5) * 24, ny = y + 12; for (let k = 0; k < 12; k++) ctx.fillRect(Math.round(x + (nx - x) * k / 12) - 1, Math.round(y + k), 3, 1); x = nx; y = ny; }
    }
    // statusbokse
    box(ctx, 2, 2, 110, 32, '#000058');
    text(ctx, save.name.slice(0, 10), 7, 6, { size: 7 });
    text(ctx, `${this.hp}/${this.st.maxHp}`, 108, 6, { size: 6, align: 'right', color: '#fce0a8' });
    bar(ctx, 7, 16, 100, 5, this.hp / this.st.maxHp, this.hp / this.st.maxHp < 0.3 ? '#d82800' : '#58d854');
    text(ctx, '💠', 6, 23, { size: 6, shadow: null });
    bar(ctx, 16, 25, 70, 4, this.mp / this.st.maxMp, '#3cd8fc', '#203048');
    text(ctx, `${this.mp}/${this.st.maxMp}`, 108, 24, { size: 5, align: 'right', color: '#a4e4fc' });
    if (M) {
      box(ctx, W - 122, 2, 120, 22, this.o.boss ? '#580000' : '#000058');
      text(ctx, M.def.name, W - 117, 6, { size: 6, color: this.o.boss ? '#f8b800' : '#fcfcfc' });
      bar(ctx, W - 117, 16, 110, 4, M.hp / M.maxHp, '#d82800');
    }
    if (this.banner) {
      const b = this.banner;
      const sz = b.text.length > 14 ? 8 : 12;
      text(ctx, b.text, W / 2, 44, { size: sz, color: b.color || '#f8b800', align: 'center' });
    }
  }
}

function pickPraise(streak) {
  const list = streak >= 5 ? ['UTROLIGT! 🔥', 'Ordmester! 🔥', 'Ustoppelig! 🔥'] : streak >= 3 ? ['Super serie!', 'Flot klaret!', 'Du er god!'] : ['Rigtigt!', 'Godt!', 'Ja!', 'Flot!'];
  return list[Math.floor(Math.random() * list.length)];
}
