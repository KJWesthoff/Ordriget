// Gemt spil (localStorage) + hjælpefunktioner til fremskridt.
import { ITEMS, xpToNext, ABILITIES } from './data/game.js';

const KEY = 'ordriget-save-v1';

export function newSave(name, hair, tunic) {
  return {
    v: 1, name, created: Date.now(),
    look: { hair, tunic, weapon: 'træsværd', shield: null, hat: null, cape: null, pet: null },
    owned: ['træsværd', tunic],
    inv: { drik: 2, fjer: 3 },
    lvl: 1, xp: 0, gold: 20,
    ch: 0, done: {}, seen: {}, mapPos: {},
    chests: {}, lore: [], bonusMp: 0,
    words: {},
    custom: [],
    stats: { answers: 0, correct: 0, days: {} },
    daily: '',
    settings: { music: true, sfx: true, voice: true, rate: 0.85, readStory: false },
  };
}

export let save = null;

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || s.v !== 1) return null;
    save = fill(s);
    return save;
  } catch (e) { return null; }
}
// Udfyld felter, som ældre gemte spil ikke har
function fill(s) {
  s.settings = Object.assign({ music: true, sfx: true, voice: true, rate: 0.85, readStory: false }, s.settings);
  s.custom ||= []; s.mapPos ||= {}; s.stats ||= { answers: 0, correct: 0, days: {} };
  s.chests ||= {}; s.lore ||= []; s.bonusMp ||= 0;
  return s;
}
export function setSave(s) { save = s; persist(); }
export function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { /* fuld eller blokeret */ }
}
export function wipe() { try { localStorage.removeItem(KEY); } catch (e) { /* */ } save = null; }

export function exportCode() { return btoa(unescape(encodeURIComponent(JSON.stringify(save)))); }
export function importCode(code) {
  const s = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
  if (!s || s.v !== 1 || !s.name) throw new Error('Ugyldig kode');
  save = fill(s); persist(); return s;
}

export function today() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function addGold(n) { save.gold += n; }
export function giveItem(id, n = 1) {
  const it = ITEMS[id];
  if (!it) return;
  if (id === 'energikrystal') save.bonusMp = (save.bonusMp || 0) + n;
  else if (it.slot === 'use') save.inv[id] = (save.inv[id] || 0) + n;
  else if (!save.owned.includes(id)) save.owned.push(id);
}

// Returnerer liste af nye niveauer
export function gainXp(n) {
  save.xp += n;
  const ups = [];
  while (save.xp >= xpToNext(save.lvl)) {
    save.xp -= xpToNext(save.lvl);
    save.lvl++;
    ups.push({ lvl: save.lvl, abilities: ABILITIES.filter(a => a.lvl === save.lvl) });
  }
  return ups;
}

export function isDone(ch, i) { return !!save.done[ch + '-' + i]; }
export function markDone(ch, i) { save.done[ch + '-' + i] = true; }
export function isUnlocked(ch, i) { return ch <= save.ch && (i === 0 || isDone(ch, i - 1)); }
