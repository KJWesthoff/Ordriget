// DOM-hjælpere: panel, dialog, tastatur, HUD, popups.
import { sprite, heroCanvas, monsterCanvas } from './gfx.js';
import { MONSTERS, heroStats, xpToNext } from './data/game.js';
import { save } from './state.js';
import { sfx, speak } from './audio.js';

export const $ = s => document.querySelector(s);

export function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

export function btn(label, onclick, cls = '', extra = {}) {
  return h('button', { class: 'btn ' + cls, onclick: e => { sfx('select'); onclick(e); }, ...extra }, label);
}

export function setPanel(...nodes) {
  const p = $('#panel');
  p.replaceChildren(...nodes.flat().filter(Boolean));
  p.scrollTop = 0;
}

// Lille billede af en figur, skaleret op
export function portrait(who, size = 48) {
  let src = null;
  if (who === 'ulla') src = sprite('owl');
  else if (who === 'hero') src = heroCanvas(save.look);
  else if (who === 'vrovl') src = monsterCanvas(MONSTERS['vrøvl']);
  else if (who === 'valdemar') src = monsterCanvas({ spr: 'wizard', pal: { m: '#0058f8', l: '#f8b800', x: '#fcfcfc' } });
  else if (who === 'npc') src = heroCanvas({ hair: 'sort', tunic: 'dragt_rød', weapon: null });
  else if (MONSTERS[who]) src = monsterCanvas(MONSTERS[who]);
  if (!src) return null;
  const c = document.createElement('canvas');
  c.width = size; c.height = size; c.className = 'portrait';
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  const sc = Math.floor(size / Math.max(src.width, src.height));
  g.drawImage(src, (size - src.width * sc) / 2, (size - src.height * sc) / 2, src.width * sc, src.height * sc);
  return c;
}

export function bigCanvas(src, scale = 4) {
  const c = document.createElement('canvas');
  c.width = src.width * scale; c.height = src.height * scale;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(src, 0, 0, c.width, c.height);
  c.className = 'pix';
  return c;
}

const NAMES = { ulla: 'Ulla', vrovl: 'Vrøvl', valdemar: 'Valdemar', brev: 'Brevet' };

// Dialog: lines = [[hvem, tekst], ...]
export function dialog(lines, ctx = {}) {
  return new Promise(resolve => {
    let i = 0, timer = null, full = '', shown = 0;
    const nameEl = h('div', { class: 'dlg-name' });
    const textEl = h('div', { class: 'dlg-text' });
    const portEl = h('div', { class: 'dlg-port' });
    const more = h('div', { class: 'dlg-more' }, '▼');
    const boxEl = h('div', { class: 'dialog', onclick: advance }, portEl, h('div', { class: 'dlg-body' }, nameEl, textEl), more);
    const skip = h('button', { class: 'link', onclick: e => { e.stopPropagation(); clearInterval(timer); resolve(); } }, 'Spring over ⏭');
    setPanel(boxEl, h('div', { class: 'row end' }, skip));
    function show() {
      const [who, t] = lines[i];
      full = t.replaceAll('{navn}', save ? save.name : 'helten');
      shown = 0;
      let name = NAMES[who] || (MONSTERS[who] && MONSTERS[who].name) || (who === 'hero' ? (save ? save.name : '') : who === 'npc' ? (ctx.npc || 'Landsbyboer') : '');
      nameEl.textContent = name;
      nameEl.style.display = name ? '' : 'none';
      boxEl.classList.toggle('narr', who === 'narr' || who === 'brev');
      portEl.replaceChildren(...[portrait(who)].filter(Boolean));
      textEl.textContent = '';
      clearInterval(timer);
      timer = setInterval(() => {
        shown += 2;
        textEl.textContent = full.slice(0, shown);
        if (shown % 6 === 0) sfx('type');
        if (shown >= full.length) clearInterval(timer);
      }, 24);
      if (save && save.settings.readStory) speak(full.replace(/[«»"]/g, ''));
    }
    function advance() {
      if (shown < full.length) { shown = full.length; textEl.textContent = full; clearInterval(timer); return; }
      i++;
      if (i >= lines.length) { clearInterval(timer); resolve(); return; }
      sfx('select');
      show();
    }
    show();
  });
}

let toastTimer = null;
export function toast(msg, ms = 1600) {
  let t = $('#toast');
  if (!t) { t = h('div', { id: 'toast' }); document.body.append(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

// Popup over alt
export function modal(...content) {
  return new Promise(resolve => {
    const ov = $('#overlay');
    const close = () => { ov.hidden = true; ov.replaceChildren(); resolve(); };
    const card = h('div', { class: 'modal' }, ...content.flat(), btn('OK', close, 'primary'));
    ov.replaceChildren(card);
    ov.hidden = false;
  });
}

// ---------- Dansk tastatur ----------
const ROWS = ['qwertyuiopå', 'asdfghjklæø', 'zxcvbnm'];
let activeKb = null;
window.addEventListener('keydown', e => {
  if (!activeKb || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === 'enter') { e.preventDefault(); activeKb.onEnter(); }
  else if (k === 'backspace') { e.preventDefault(); activeKb.onBack(); }
  else if (/^[a-zæøå]$/.test(k)) { e.preventDefault(); activeKb.onKey(k); }
});

export function keyboard({ onKey, onBack, onEnter }) {
  const el = h('div', { class: 'kb' });
  ROWS.forEach((row, ri) => {
    const r = h('div', { class: 'kb-row' });
    for (const ch of row) {
      r.append(h('button', { class: 'key' + ('æøå'.includes(ch) ? ' dk' : ''), onpointerdown: e => { e.preventDefault(); sfx('type'); onKey(ch); } }, ch));
    }
    if (ri === 2) {
      r.append(h('button', { class: 'key wide back', onpointerdown: e => { e.preventDefault(); sfx('type'); onBack(); } }, '⌫'));
      r.append(h('button', { class: 'key wide ok', onpointerdown: e => { e.preventDefault(); onEnter(); } }, 'OK'));
    }
    el.append(r);
  });
  activeKb = { onKey, onBack, onEnter };
  el.detach = () => { if (activeKb && activeKb.onKey === onKey) activeKb = null; };
  return el;
}
export function detachKeyboard() { activeKb = null; }

// ---------- HUD ----------
let menuHandler = null;
export function onMenu(fn) { menuHandler = fn; }
export function hud(extra = {}) {
  const el = $('#hud');
  if (!save) { el.replaceChildren(); return; }
  const st = heroStats(save);
  const xpFrac = save.xp / xpToNext(save.lvl);
  const hp = extra.hp != null ? extra.hp : st.maxHp;
  el.replaceChildren(...[
    h('div', { class: 'hud-l' },
      h('div', { class: 'hud-name' }, save.name, h('span', { class: 'lvl' }, ' Nv.' + save.lvl)),
      h('div', { class: 'hud-bars' },
        h('div', { class: 'mini' }, h('i', { style: `width:${Math.round(100 * hp / st.maxHp)}%;background:#d82800` })),
        h('div', { class: 'mini xp' }, h('i', { style: `width:${Math.round(100 * xpFrac)}%;background:#3cbcfc` })),
      ),
    ),
    h('div', { class: 'hud-gold' }, '🪙 ' + save.gold),
    extra.noMenu ? null : h('button', { class: 'hud-menu', onclick: () => { sfx('select'); menuHandler && menuHandler(); } }, '☰'),
  ].filter(Boolean));
}
