// Navigation mellem skærme + belønninger.
import { setScene, getScene } from './scene.js';
import { save, persist, addGold, giveItem, gainXp, isDone, markDone, today } from './state.js';
import { CHAPTERS, ITEMS, MONSTERS } from './data/game.js';
import { STORY, TRAINING_INTRO } from './data/story.js';
import { WORDS, reviewPool, trainingPool } from './learn.js';
import { dialog, modal, h, hud, bigCanvas, toast } from './ui.js';
import { sfx, music } from './audio.js';
import { sprite } from './gfx.js';
import { TitleScene, CreateScene } from './scenes/title.js';
import { MapScene } from './scenes/map.js';
import { BattleScene } from './scenes/battle.js';
import { PuzzleScene } from './scenes/puzzle.js';
import { VillageScene } from './scenes/village.js';
import { ChestScene } from './scenes/chest.js';
import { menuScreen } from './scenes/menus.js';

export function toTitle() { setScene(new TitleScene()); }
export function toCreate() { setScene(new CreateScene()); }
export function toMap(ch = save.ch) { setScene(new MapScene(ch)); }

export function openMenu() {
  const s = getScene();
  if (!(s instanceof MapScene)) { toast('Menuen kan bruges på kortet'); return; }
  s.inMenu = true;
  menuScreen(() => { s.inMenu = false; s.panel(); });
}

export async function grantRewards({ xp = 0, gold = 0, items = [] }) {
  addGold(gold);
  for (const it of items) giveItem(it);
  const ups = gainXp(xp);
  persist();
  hud();
  for (const u of ups) {
    sfx('levelup');
    await modal(
      h('div', { class: 'modal-title' }, '⭐ NIVEAU ' + u.lvl + '! ⭐'),
      h('p', {}, 'Du er blevet stærkere: mere liv, mere livsenergi og hårdere slag.'),
      u.abilities.map(a => h('div', { class: 'newab' }, h('div', { class: 'big-ico' }, a.icon), h('div', {}, h('b', {}, (a.kind === 'sword' ? 'Ny sværdteknik: ' : 'Ny magi: ') + a.name), h('br'), a.desc))),
    );
  }
}

function pickWaves(ch, n) {
  const ms = CHAPTERS[ch].monsters;
  return Array.from({ length: n }, () => ms[Math.floor(Math.random() * ms.length)]);
}

export function startNode(ch, i) {
  const c = CHAPTERS[ch], node = c.nodes[i];
  const end = win => nodeEnd(ch, i, win);
  if (node.type === 'battle') {
    setScene(new BattleScene({ ch, theme: c.theme, waves: pickWaves(ch, ch === 0 && i === 0 ? 2 : 3), main: WORDS[ch], review: reviewPool(ch), onEnd: end }));
  } else if (node.type === 'boss') {
    const b = c.boss;
    setScene(new BattleScene({ ch, theme: c.theme, boss: true, waves: b.phases || [b.key], main: WORDS[ch], review: reviewPool(ch), pre: STORY[ch].preBoss, phase2: STORY[ch].phase2, onEnd: end }));
  } else if (node.type === 'puzzle') {
    setScene(new PuzzleScene({ ch, main: WORDS[ch], review: reviewPool(ch), onEnd: end }));
  } else if (node.type === 'village') {
    setScene(new VillageScene({ ch, onEnd: end }));
  }
}

export function startChest(ch, k) {
  setScene(new ChestScene({ ch, k, main: WORDS[ch], review: reviewPool(ch), onEnd: () => toMap(ch) }));
}

async function nodeEnd(ch, i, win) {
  const c = CHAPTERS[ch], node = c.nodes[i];
  if (!win) { toMap(ch); return; }
  const first = !isDone(ch, i);
  markDone(ch, i);
  persist();
  if (node.type === 'boss' && first) {
    music('village');
    await dialog(STORY[ch].postBoss);
    const drop = c.boss.drop;
    const items = [drop];
    if (ch === CHAPTERS.length - 1) items.push('vrøvlstav');
    await grantRewards({ items });
    sfx('victory');
    await modal(
      h('div', { class: 'modal-title' }, '💎 ' + c.shard + '!'),
      h('p', {}, `Du har nu ${ch + 1} af 6 splinter af Ordkrystallen.`),
      h('p', {}, '💠 Splinten giver dig +1 maks livsenergi.'),
      h('div', { class: 'loot' }, items.map(id => h('div', {}, '🎁 ' + ITEMS[id].name))),
      ch < CHAPTERS.length - 1 ? h('p', {}, h('b', {}, 'Nyt område: ' + CHAPTERS[ch + 1].name + '!')) : h('p', {}, h('b', {}, 'Du er Rigets Ordridder! 👑')),
    );
    if (ch < CHAPTERS.length - 1) { save.ch = Math.max(save.ch, ch + 1); persist(); toMap(ch + 1); return; }
    save.won = true; persist();
  }
  toMap(ch);
}

export async function startTraining() {
  if (!save.seen.training) { save.seen.training = true; persist(); await dialog(TRAINING_INTRO); }
  const ch = save.ch;
  setScene(new BattleScene({
    ch, theme: 'tower', training: true, waves: ['dukke', 'dukke', 'dukke'], main: trainingPool(), review: [],
    onEnd: async win => {
      if (win && save.daily !== today()) {
        save.daily = today();
        const gold = 30 + 15 * ch;
        sfx('open');
        await modal(h('div', { class: 'modal-title' }, '🎁 Dagens skattekiste!'), bigCanvas(sprite('star'), 6), h('p', {}, `+${gold} guld, +2 ugle-fjer og en livsdrik.`), h('p', { class: 'small' }, 'Kom igen i morgen for en ny kiste!'));
        save.inv.fjer = (save.inv.fjer || 0) + 2;
        await grantRewards({ gold, items: ['drik'] });
      }
      toMap();
    },
  }));
}

export { MONSTERS };
