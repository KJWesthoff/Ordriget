import { W, H, text, sprite, heroCanvas, petCanvas, buildMap, box, shadow, glow } from '../gfx.js';
import { h, btn, setPanel, hud, dialog, toast } from '../ui.js';
import { save, persist, isDone, isUnlocked } from '../state.js';
import { music, sfx } from '../audio.js';
import { CHAPTERS, MONSTERS } from '../data/game.js';
import { STORY } from '../data/story.js';
import { mastery } from '../learn.js';
import { tween } from '../fx.js';
import { startNode, toMap, startTraining, startChest } from '../flow.js';

const ICON = { battle: 'icoBattle', puzzle: 'icoPuzzle', village: 'icoVillage', boss: 'icoBoss' };
const COLOR = { battle: '#d82800', puzzle: '#f8b800', village: '#00a800', boss: '#940084' };

export function nodeName(c, n, i) {
  if (n.type === 'battle') return 'Kamp ' + (c.nodes.slice(0, i + 1).filter(x => x.type === 'battle').length);
  if (n.type === 'puzzle') return 'Runedøren';
  if (n.type === 'village') return c.village;
  return MONSTERS[c.boss.key].name;
}
function nodeDesc(c, n) {
  if (n.type === 'battle') return 'Monstre spærrer vejen! Stav rigtigt for at slå dem.';
  if (n.type === 'puzzle') return 'En magisk dør med fire runer. Løs ordgåderne og find skatten.';
  if (n.type === 'village') return 'Køb udstyr, snak med ' + c.npc + ' og få gode stavetips.';
  return 'BOSS! ' + MONSTERS[c.boss.key].name + ' vogter ' + c.shard + '.';
}

function disc(ctx, cx, cy, r, col) {
  for (let y = -r; y <= r; y++) {
    const w = Math.round(Math.sqrt(r * r - y * y));
    ctx.fillStyle = '#000'; ctx.fillRect(cx - w - 1, cy + y, w * 2 + 2, 1);
  }
  ctx.fillRect(cx - Math.round(r * 0.6), cy - r - 1, Math.round(r * 1.2), r * 2 + 2);
  for (let y = -r + 1; y <= r - 1; y++) {
    const w = Math.round(Math.sqrt((r - 1) * (r - 1) - y * y));
    ctx.fillStyle = col; ctx.fillRect(cx - w, cy + y, w * 2, 1);
  }
}

export class MapScene {
  constructor(ch) {
    this.ch = Math.min(ch, save.ch);
    this.c = CHAPTERS[this.ch];
    this.m = buildMap(this.ch, this.c);
    this.cur = save.mapPos[this.ch] || 0;
    const n = this.c.nodes.length;
    let first = 0; while (first < n - 1 && isDone(this.ch, first)) first++;
    this.sel = isUnlocked(this.ch, this.cur) ? (isDone(this.ch, this.cur) && this.cur < first ? first : this.cur) : 0;
    const p = this.m.points[this.m.nodeIdx[this.cur]];
    this.hx = p[0] * 16 + 8; this.hy = p[1] * 16 + 8;
    this.flip = false;
    this.walking = false;
  }
  async enter() {
    music('map');
    hud();
    this.panel();
    if (!save.seen['intro' + this.ch]) {
      save.seen['intro' + this.ch] = true; persist();
      await dialog(STORY[this.ch].intro);
      if (!this.inMenu) this.panel();
    }
    if (this.sel !== this.cur) this.walkTo(this.sel);
  }
  chestState(k) {
    const cd = this.c.chests[k];
    if (save.chests[this.ch + '-' + k]) return 'open';
    return isDone(this.ch, cd.after) ? 'ready' : 'locked';
  }
  click(x, y) {
    if (this.walking || this.inMenu) return;
    const k = this.m.chests.findIndex(p => Math.abs(p.x * 16 + 8 - x) < 10 && Math.abs(p.y * 16 + 8 - y) < 10);
    if (k >= 0) {
      const st = this.chestState(k);
      if (st === 'locked') { sfx('wrong'); toast('Kisten er låst fast med torne – klar ' + nodeName(this.c, this.c.nodes[this.c.chests[k].after], this.c.chests[k].after) + ' først'); return; }
      sfx('select');
      this.selChest = k;
      this.panel();
      return;
    }
    const i = this.c.nodes.findIndex(n => Math.abs(n.x * 16 + 8 - x) < 11 && Math.abs(n.y * 16 + 8 - y) < 11);
    if (i < 0) return;
    if (!isUnlocked(this.ch, i)) { sfx('wrong'); toast('Låst – klar de tidligere steder først'); return; }
    sfx('select');
    const wasChest = this.selChest != null;
    this.selChest = null;
    if (i === this.sel && i === this.cur) { if (wasChest) { this.panel(); return; } startNode(this.ch, i); return; }
    this.sel = i;
    this.panel();
    this.walkTo(i);
  }
  async walkTo(i) {
    if (this.walking) return;
    this.walking = true;
    const a = this.m.nodeIdx[this.cur], b = this.m.nodeIdx[i];
    const dir = Math.sign(b - a);
    for (let k = a; k !== b; k += dir) {
      const [x2, y2] = this.m.points[k + dir];
      const sx = this.hx, sy = this.hy, tx = x2 * 16 + 8, ty = y2 * 16 + 8;
      if (tx !== sx) this.flip = tx < sx;
      const dist = Math.abs(tx - sx) + Math.abs(ty - sy);
      await tween(dist * 9, p => { this.hx = sx + (tx - sx) * p; this.hy = sy + (ty - sy) * p; });
      sfx('step');
    }
    this.cur = i;
    save.mapPos[this.ch] = i; persist();
    this.walking = false;
    if (!this.inMenu) this.panel();
  }
  chestPanel(k) {
    const cd = this.c.chests[k], open = this.chestState(k) === 'open';
    const ico = h('canvas', { width: 30, height: 30, class: 'pix node-ico' });
    const g = ico.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(sprite(open ? 'mapChestOpen' : 'mapChest'), 3, 5, 24, 20);
    setPanel(
      h('div', { class: 'area-head' }, h('span', { class: 'spacer' }), h('div', { class: 'area-title' }, h('div', { class: 'area-name' }, this.c.name)), h('span', { class: 'spacer' })),
      h('div', { class: 'node-card chest' },
        ico,
        h('div', { class: 'grow' }, h('div', { class: 'node-name' }, cd.name, open ? ' ✅' : ''),
          h('div', { class: 'node-desc' }, open ? 'Kisten er tom. Skriftrullen ligger i Krøniken (☰).' : `En gammel kiste med ${cd.locks.length} stavelåse. Indeni: guld, en skriftrulle` + (k === 1 ? ' og en livskrystal 💠.' : ' og en skat.'))),
      ),
      open ? null : btn('🔑 Prøv låsene', () => startChest(this.ch, k), 'primary big'),
      btn('◀ Tilbage til stien', () => { this.selChest = null; this.panel(); }, 'small'),
    );
  }
  panel() {
    if (this.selChest != null) return this.chestPanel(this.selChest);
    const c = this.c, n = c.nodes[this.sel], i = this.sel;
    const mm = mastery(this.ch);
    const done = isDone(this.ch, i);
    const ready = this.cur === i && !this.walking;
    const ico = h('canvas', { width: 30, height: 30, class: 'pix node-ico' });
    const g = ico.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(sprite(ICON[n.type]), 0, 0, 30, 30);
    const prevOk = this.ch > 0, nextOk = this.ch < save.ch;
    setPanel(
      h('div', { class: 'area-head' },
        prevOk ? h('button', { class: 'icon-btn', onclick: () => toMap(this.ch - 1) }, '◀') : h('span', { class: 'spacer' }),
        h('div', { class: 'area-title' }, h('div', { class: 'area-name' }, c.name), h('div', { class: 'area-focus' }, 'Fokus: ' + c.focus)),
        nextOk ? h('button', { class: 'icon-btn', onclick: () => toMap(this.ch + 1) }, '▶') : h('span', { class: 'spacer' }),
      ),
      h('div', { class: 'mastery' }, h('div', { class: 'mbar' }, h('i', { style: `width:${Math.round(100 * mm.solid / mm.total)}%` }), h('b', { style: `width:${Math.round(100 * mm.seen / mm.total)}%` })),
        h('small', {}, `Ord: ${mm.seen}/${mm.total} mødt · ${mm.solid} sidder fast ⭐`)),
      h('div', { class: 'node-card' + (n.type === 'boss' ? ' boss' : '') },
        ico,
        h('div', { class: 'grow' }, h('div', { class: 'node-name' }, nodeName(c, n, i), done ? ' ✅' : ''), h('div', { class: 'node-desc' }, nodeDesc(c, n))),
      ),
      btn(ready ? (done ? '↻ Spil igen' : '▶ Start') : 'Går derhen...', () => ready && startNode(this.ch, i), 'primary big', { disabled: ready ? null : true }),
      h('div', { class: 'row' },
        btn('🗼 Træning', () => startTraining(), 'grow small'),
        h('div', { class: 'small dim grow center' }, 'Tryk på et sted på kortet'),
      ),
    );
  }
  draw(ctx, t) {
    ctx.drawImage(this.m.canvas, 0, 0, W, H);
    // vand-glimt
    if (this.c.theme === 'coast') {
      ctx.fillStyle = '#a4e4fc';
      for (let i = 0; i < 6; i++) ctx.fillRect(Math.round((i * 47 + t * 12) % W), 4 + (i * 5) % 12, 5, 1);
    }
    this.c.nodes.forEach((n, i) => {
      const cx = n.x * 16 + 8, cy = n.y * 16 + 8;
      const un = isUnlocked(this.ch, i), dn = isDone(this.ch, i);
      const pulse = un && !dn ? Math.round(Math.sin(t * 5) + 1) : 0;
      disc(ctx, cx, cy, (n.type === 'boss' ? 9 : 7) + pulse, un ? COLOR[n.type] : '#7c7c7c');
      ctx.globalAlpha = un ? 1 : 0.5;
      ctx.drawImage(sprite(ICON[n.type]), cx - 5, cy - 5);
      ctx.globalAlpha = 1;
      if (dn) ctx.drawImage(sprite('star'), cx + 3, cy - 12);
      if (i === this.sel && !this.walking && this.selChest == null) {
        const by = Math.round(Math.sin(t * 6) * 2);
        ctx.fillStyle = '#fcfcfc';
        ctx.fillRect(cx - 3, cy - 22 + by, 7, 2); ctx.fillRect(cx - 2, cy - 20 + by, 5, 2); ctx.fillRect(cx - 1, cy - 18 + by, 3, 2);
      }
    });
    // skattekister
    this.m.chests.forEach((p, k) => {
      const st = this.chestState(k);
      const cx = p.x * 16 + 8, cy = p.y * 16 + 8;
      shadow(ctx, cx, cy + 6, 7, 2);
      if (st === 'ready') glow(ctx, cx, cy, 10 + Math.sin(t * 4) * 2, 'rgba(248,216,120,0.35)');
      ctx.globalAlpha = st === 'locked' ? 0.55 : 1;
      ctx.drawImage(sprite(st === 'open' ? 'mapChestOpen' : 'mapChest'), cx - 6, cy - 5 + (st === 'ready' ? Math.round(Math.sin(t * 5)) : 0));
      ctx.globalAlpha = 1;
      if (st === 'locked') ctx.drawImage(sprite('thorns'), cx - 7, cy - 3);
      if (st === 'ready' && Math.sin(t * 3 + k) > 0.6) { ctx.fillStyle = '#fcfcfc'; ctx.fillRect(cx + 4, cy - 8, 1, 3); ctx.fillRect(cx + 3, cy - 7, 3, 1); }
      if (this.selChest === k) {
        const by = Math.round(Math.sin(t * 6) * 2);
        ctx.fillStyle = '#fcfcfc';
        ctx.fillRect(cx - 3, cy - 18 + by, 7, 2); ctx.fillRect(cx - 2, cy - 16 + by, 5, 2); ctx.fillRect(cx - 1, cy - 14 + by, 3, 2);
      }
    });
    const hc = heroCanvas(save.look);
    shadow(ctx, this.hx, this.hy + 3, 6, 2);
    const bob = this.walking ? Math.round(Math.abs(Math.sin(t * 12)) * -2) : 0;
    const x = Math.round(this.hx - 12), y = Math.round(this.hy - 20 + bob);
    ctx.save();
    if (this.flip) { ctx.translate(x + 24, y); ctx.scale(-1, 1); ctx.drawImage(hc, 0, 0); }
    else ctx.drawImage(hc, x, y);
    ctx.restore();
    if (save.look.pet) {
      const pc = petCanvas(save.look.pet);
      if (pc) ctx.drawImage(pc, Math.round(this.hx + (this.flip ? 8 : -16)), Math.round(this.hy - 4 + Math.sin(t * 5)));
    }
    box(ctx, 2, 2, 8 + this.c.name.length * 6, 13, '#000058');
    text(ctx, this.c.name, 6, 5, { size: 6, color: '#fcfcfc' });
  }
}
