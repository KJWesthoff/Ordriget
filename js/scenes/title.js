import { W, H, text, sprite, heroCanvas, buildBattleBg, HAIR_COLORS, ambient, shadow, glow } from '../gfx.js';
import { h, btn, setPanel, keyboard, hud, dialog, toast } from '../ui.js';
import { save, newSave, setSave, persist } from '../state.js';
import { music, setAudioPrefs, setRate } from '../audio.js';
import { ITEMS } from '../data/game.js';
import { PROLOGUE } from '../data/story.js';
import { toCreate, toMap } from '../flow.js';

export class TitleScene {
  enter() {
    this.bg = buildBattleBg('meadow');
    music('title');
    hud({ noMenu: true });
    const items = [];
    if (save) {
      items.push(btn(`▶ Fortsæt – ${save.name} (Nv. ${save.lvl})`, () => toMap(), 'primary big'));
      items.push(btn('Nyt eventyr', () => {
        if (confirm('Starte forfra? Det gemte spil bliver slettet.')) toCreate();
      }, 'small'));
    } else {
      items.push(btn('▶ Start eventyret', () => toCreate(), 'primary big'));
    }
    setPanel(
      h('div', { class: 'title-blurb' }, 'Et stave-eventyr. Stav rigtigt for at slå monstre, løse gåder og redde Ordriget fra troldmanden Vrøvl!'),
      ...items,
      h('div', { class: 'small center dim' }, 'Tip: Tilføj spillet til hjemmeskærmen (Del → Føj til hjemmeskærm), så det gemmes sikkert.'),
    );
  }
  draw(ctx, t) {
    ctx.drawImage(this.bg, 0, 0, W, H);
    ambient(ctx, 'meadow', t);
    // slot i baggrunden, med sol- og skyggeside
    const wall = (x, y, w, hh) => { ctx.fillStyle = '#a8a8b8'; ctx.fillRect(x, y, w, hh); ctx.fillStyle = '#c8c8d8'; ctx.fillRect(x, y, Math.ceil(w / 3), hh); ctx.fillStyle = '#787890'; ctx.fillRect(x + w - 3, y, 3, hh); };
    wall(176, 84, 56, 48); wall(170, 64, 16, 68); wall(222, 64, 16, 68);
    ctx.fillStyle = '#585870';
    for (let x = 170; x < 238; x += 6) ctx.fillRect(x, 60, 4, 4);
    for (let y = 90; y < 130; y += 6) for (let x = 178 + (y % 12 ? 0 : 4); x < 230; x += 8) { ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(x, y, 6, 1); }
    ctx.fillStyle = '#302838'; ctx.fillRect(198, 108, 12, 24); ctx.beginPath(); ctx.arc(204, 108, 6, Math.PI, 0); ctx.fill();
    glow(ctx, 178, 74, 8 + Math.sin(t * 3), 'rgba(248,216,120,.5)'); ctx.fillStyle = '#f8d878'; ctx.fillRect(176, 72, 3, 4); ctx.fillRect(228, 72, 3, 4);
    ctx.fillStyle = '#d82800'; ctx.fillRect(203, 44, 2, 20); ctx.fillRect(205, 44, 8, 6);
    const bob = Math.round(Math.sin(t * 2) * 2);
    text(ctx, 'ORDRIGET', W / 2 + 2, 24 + bob + 2, { size: 24, color: '#000', shadow: null, align: 'center' });
    text(ctx, 'ORDRIGET', W / 2, 24 + bob, { size: 24, color: '#f8b800', shadow: '#d82800', align: 'center' });
    text(ctx, 'Stavningens Eventyr', W / 2, 56, { size: 8, color: '#fcfcfc', align: 'center' });
    const look = save ? save.look : { hair: 'brun', tunic: 'dragt_blå', weapon: 'træsværd' };
    shadow(ctx, 64, 151, 14, 3); shadow(ctx, 112, 151, 9, 2);
    ctx.drawImage(heroCanvas(look), 40, 104 + Math.round(Math.abs(Math.sin(t * 3)) * -3), 48, 48);
    ctx.drawImage(sprite('owl'), 96, 92 + Math.round(Math.sin(t * 4) * 4), 32, 32);
  }
}

export class CreateScene {
  enter() {
    this.bg = buildBattleBg('meadow');
    this.name = '';
    this.hair = 'brun';
    this.tunic = 'dragt_blå';
    music('village');
    hud({ noMenu: true });
    this.render();
  }
  render() {
    const nameSlots = h('div', { class: 'name-field' }, (this.name ? this.name.charAt(0).toUpperCase() + this.name.slice(1) : '') + '▌');
    const sw = (obj, cur, set) => h('div', { class: 'swatches' }, Object.entries(obj).map(([k, col]) =>
      h('button', { class: 'swatch' + (k === cur ? ' on' : ''), style: `background:${col}`, onclick: () => { set(k); this.render(); }, 'aria-label': k })));
    const tunics = { dragt_blå: ITEMS.dragt_blå.look.T, dragt_grøn: ITEMS.dragt_grøn.look.T, dragt_rød: ITEMS.dragt_rød.look.T };
    const kb = keyboard({
      onKey: c => { if (this.name.length < 10) { this.name += c; this.render(); } },
      onBack: () => { this.name = this.name.slice(0, -1); this.render(); },
      onEnter: () => this.done(),
    });
    setPanel(
      h('div', { class: 'label' }, 'Hvad hedder du, helt?'), nameSlots,
      h('div', { class: 'row wrap' }, h('div', { class: 'label' }, 'Hår:'), sw(HAIR_COLORS, this.hair, v => (this.hair = v)),
        h('div', { class: 'label' }, 'Dragt:'), sw(tunics, this.tunic, v => (this.tunic = v))),
      kb,
      btn('Start eventyret ▶', () => this.done(), 'primary'),
    );
  }
  async done() {
    const n = this.name.trim();
    if (n.length < 2) { toast('Skriv dit navn først'); return; }
    const s = newSave(n.charAt(0).toUpperCase() + n.slice(1), this.hair, this.tunic);
    setSave(s);
    setAudioPrefs({ music: true, sfx: true }); setRate(s.settings.rate);
    hud();
    await dialog(PROLOGUE);
    save.seen.prologue = true; persist();
    toMap(0);
  }
  draw(ctx, t) {
    ctx.drawImage(this.bg, 0, 0, W, H);
    const look = { hair: this.hair, tunic: this.tunic, weapon: 'træsværd' };
    ctx.drawImage(heroCanvas(look), W / 2 - 48, 60 + Math.round(Math.sin(t * 3) * 2), 96, 96);
    if (this.name) text(ctx, this.name.charAt(0).toUpperCase() + this.name.slice(1), W / 2, 30, { size: 12, color: '#f8b800', align: 'center' });
  }
}
