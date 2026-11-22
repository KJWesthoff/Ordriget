import { W, H, text, sprite, heroCanvas, petCanvas, buildBattleBg, THEMES, ambient, shadow } from '../gfx.js';
import { h, btn, setPanel, hud, dialog } from '../ui.js';
import { save, persist } from '../state.js';
import { music } from '../audio.js';
import { CHAPTERS } from '../data/game.js';
import { STORY } from '../data/story.js';
import { shopScreen, equipScreen } from './menus.js';

export class VillageScene {
  constructor(o) { this.o = o; this.ch = o.ch; this.c = CHAPTERS[o.ch]; this.preview = null; }
  async enter() {
    music('village');
    hud({ noMenu: true });
    this.bg = buildBattleBg(this.c.theme);
    if (!save.seen['village' + this.ch]) {
      save.seen['village' + this.ch] = true; persist();
      await this.talk();
    }
    this.menu();
  }
  talk() { return dialog(STORY[this.ch].village, { npc: this.c.npc }); }
  menu() {
    this.preview = null;
    hud({ noMenu: true });
    setPanel(
      h('div', { class: 'area-name center' }, '🏘️ ' + this.c.village),
      h('div', { class: 'actions col' },
        btn('🛒 Butik', () => shopScreen(this.ch, () => this.menu(), look => (this.preview = look)), 'act primary'),
        btn('👕 Udstyr', () => equipScreen(() => this.menu(), look => (this.preview = look)), 'act'),
        btn('💬 Snak med ' + this.c.npc, async () => { await this.talk(); this.menu(); }, 'act'),
        btn('🗺️ Fortsæt rejsen', () => this.o.onEnd(true), 'act magic'),
      ),
    );
  }
  draw(ctx, t) {
    ctx.drawImage(this.bg, 0, 0, W, H);
    ambient(ctx, this.c.theme, t);
    const th = THEMES[this.c.theme];
    for (const [x, y] of [[20, 100], [70, 92], [190, 98]]) { shadow(ctx, x + 20, y + 38, 18, 3); ctx.drawImage(sprite('house'), x, y, 40, 40); }
    ctx.drawImage(sprite('tree', th.pal.tree || null), 140, 96, 32, 32);
    // butiksbod
    ctx.fillStyle = '#d82800'; for (let x = 128; x < 176; x += 8) ctx.fillRect(x, 128, 4, 6);
    ctx.fillStyle = '#fcfcfc'; for (let x = 132; x < 176; x += 8) ctx.fillRect(x, 128, 4, 6);
    ctx.fillStyle = '#ac7c00'; ctx.fillRect(128, 134, 48, 16);
    ctx.drawImage(heroCanvas({ hair: 'sort', tunic: 'dragt_rød', weapon: null }), 140, 108, 24, 24);
    const look = this.preview || save.look;
    shadow(ctx, 94, 151, 14, 3);
    ctx.drawImage(heroCanvas(look), 70, 104 + Math.round(Math.sin(t * 2.5)), 48, 48);
    if (look.pet) { const pc = petCanvas(look.pet); if (pc) ctx.drawImage(pc, 46, 136 + Math.round(Math.sin(t * 5) * 2), 16, 16); }
    text(ctx, this.c.village, W / 2, 8, { size: 8, align: 'center', color: '#fce0a8' });
  }
}
