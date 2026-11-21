// Pixelgrafik: sprites tegnes fra tekst-gitre med en farvepalet.
import { ITEMS } from './data/game.js';

export const W = 256, H = 192, SCALE = 3;

export const PAL = {
  k: '#000000', w: '#fcfcfc', g: '#00a800', G: '#58d854', d: '#005800',
  b: '#0058f8', B: '#3cbcfc', n: '#0000a8', r: '#d82800', R: '#f87858',
  y: '#f8b800', Y: '#fce0a8', o: '#e45c10', s: '#fcc89c', h: '#ac7c00', H: '#503000',
  a: '#7c7c7c', A: '#bcbcbc', D: '#404040', p: '#940084', P: '#d800cc',
  T: '#3cbcfc', t: '#0058f8', C: '#ac7c00', M: '#bcbcbc', S: '#ac7c00', c: '#d82800',
  m: '#58d854', l: '#b8f818', q: '#00a800', x: '#fcfcfc',
};

export const SPR = {
  hero: [
    '................',
    '......kkkkk.....',
    '.....kCCCCCk....',
    '....kCCCCCCCk...',
    '....kCCssssk....',
    '....kCsskskk....',
    '....kCsssssk....',
    '.....kssssk.....',
    '....kTTTTTTk....',
    '...kTTTTTTTTk...',
    '...ksTTyyTTsk...',
    '....kTTTTTTk....',
    '....ktTk.ktTk...',
    '....kHHk.kHHk...',
    '....kHHk.kHHk...',
    '....kkkk.kkkk...',
  ],
  cape: [
    '................', '................', '................', '................',
    '................', '................', '................', '................',
    '..kcccccck......',
    '.kccccccck......',
    '.kcccccck.......',
    '.kccccccck......',
    'kccccccck.......',
    'kcccccck........',
    '.kkkkkk.........',
    '................',
  ],
  sword: [
    '...kk...',
    '..kMMk..',
    '..kMMk..',
    '..kMMk..',
    '..kMMk..',
    '..kMMk..',
    '..kMMk..',
    '..kMMk..',
    'kkkyykkk',
    '.kyyyyk.',
    '..kHHk..',
    '..kkkk..',
  ],
  staff: [
    '..kkkk..',
    '.kPyyPk.',
    '.kyBByk.',
    '.kPyyPk.',
    '..kkkk..',
    '...kh...',
    '...kh...',
    '...kh...',
    '...kh...',
    '...kh...',
    '...kh...',
    '...kk...',
  ],
  shield: [
    '.kkkkk.',
    'kSSSSSk',
    'kSSySSk',
    'kSyyySk',
    'kSSySSk',
    '.kSSSk.',
    '..kSk..',
    '...k...',
  ],
  crown: [
    '................',
    '.....k.kk.k.....',
    '....kykyykyk....',
    '....kyyyyyyk....',
    '....kyryyByk....',
    '....kkkkkkkk....',
  ],
  wizard: [
    '.........kk.....',
    '........kPPk....',
    '.......kPyPk....',
    '......kPPPPk....',
    '....kkPPPPPPkk..',
    '...kPPPPPPPPPPk.',
  ],
  viking: [
    '...k........k...',
    '..kwk......kwk..',
    '..kwk.kkkk.kwk..',
    '...kkkAAAAkkk...',
    '....kAAAAAAk....',
    '....kkkkkkkk....',
  ],
  cap: [
    '................',
    '......kkkk......',
    '.....kRRRRk.....',
    '....kRRRRRRk....',
    '....kRRRRRRRkk..',
    '....kkkkkkkkkk..',
  ],
  helm: [
    '......kkkk......',
    '.....kAAAAk.....',
    '....kAAAAAAk....',
    '....kAwAAAAk....',
    '....kAAAAAAk....',
    '....kkkkkkkk....',
  ],
  // Monstre (vender mod venstre)
  slime: [
    '................', '................', '................', '................', '................',
    '......kkkk......',
    '....kkllmmkk....',
    '...klwlmmmmmk...',
    '..kmlllmmmmmmk..',
    '..kmmmmmmmmmmk..',
    '.kmmkwkmmkwkmmk.',
    '.kmmkkkmmkkkmmk.',
    '.kmmmmmmmmmmmmk.',
    '.kqmmmmqqmmmmqk.',
    '..kqqqqqqqqqqk..',
    '...kkkkkkkkkk...',
  ],
  bat: [
    '................', '................', '................',
    '..k..........k..',
    '.kmk...kk...kmk.',
    '.kmmk.kmmk.kmmk.',
    'kmmmmkmmmmkmmmmk',
    'kmmmmmmrmrmmmmmk',
    'kmmkmmmmmmmmkmmk',
    'kmk.kmmwwmmk.kmk',
    '.k...kmmmmk...k.',
    '......kmmk......',
    '.......kk.......',
    '................', '................', '................',
  ],
  ghost: [
    '................',
    '.....kkkkkk.....',
    '....kmmmmmmk....',
    '...kmmmmmmmmk...',
    '...kmkkmmkkmk...',
    '...kmkkmmkkmk...',
    '...kmmmmmmmmk...',
    '...kmmmkkmmmk...',
    '...kmmmkkmmmk...',
    '...kmmmmmmmmk...',
    '...kmmmmmmmlk...',
    '...kmmmmmmllk...',
    '...kmkmmkmmkmk..',
    '...kk.kk.kk.kk..',
    '................', '................',
  ],
  skeleton: [
    '................',
    '.....kkkkkk.....',
    '....kmmmmmmk....',
    '....kmkkmkkk....',
    '....kmkkmkkk....',
    '....kmmmmmmk....',
    '.....kmkmkk.....',
    '......kkkk......',
    '....k.kmmk.k....',
    '...kmkkmmkkmk...',
    '...k.kmkkmk.k...',
    '.....kmmmmk.....',
    '......kmmk......',
    '.....kmkkmk.....',
    '.....kmk.kmk....',
    '.....kk..kk.....',
  ],
  beast: [
    '................', '................',
    '...k.k..........',
    '..kmkmk.........',
    '.kmmmmmk........',
    'kmrmmmmmk.......',
    'kmmmmmmmmkkkkk..',
    '.kwkmmmmmmmmmmk.',
    '..kkmmmmmmmmmmmk',
    '...kmmmmmmmmmmk.',
    '...kmmllllllmmk.',
    '...kmmkkkkkkmmk.',
    '...kmk.....kmk..',
    '...kmk.....kmk..',
    '...kkk.....kkk..',
    '................',
  ],
  crab: [
    '................', '................', '................',
    '.kk..........kk.',
    'kmmk........kmmk',
    'kmmk.k....k.kmmk',
    '.kmk.kk..kk.kmk.',
    '..kmk......kmk..',
    '...kkmmmmmmkk...',
    '..kmmmmmmmmmmk..',
    '.kmmkwmmmmkwmmk.',
    '.kmmmmmmmmmmmmk.',
    '..kmmmmmmmmmmk..',
    '.k.kkkkkkkkkk.k.',
    'k.k.k......k.k.k',
    '................',
  ],
  octopus: [
    '................',
    '.....kkkkkk.....',
    '....kmmmmmmk....',
    '...kmmllmmmmk...',
    '...kmlmmmmmmk...',
    '...kmmmmmmmmk...',
    '...kmwkmmwkmk...',
    '...kmkkmmkkmk...',
    '...kmmmmmmmmk...',
    '...kmkmmkmmkmk..',
    '..kmk.kmk.kmk.k.',
    '..km..km..km..k.',
    '...k...k...k....',
    '................', '................', '................',
  ],
  golem: [
    '................',
    '....kkkkkkkk....',
    '...kmmmmmmmmk...',
    '...kmlmmmmlmk...',
    '...kmmmmmmmmk...',
    '..kkkmkkkkmkkk..',
    '.kmmkmmmmmmkmmk.',
    'kmmmkmmllmmkmmmk',
    'kmmkkmmllmmkkmmk',
    'kmmk.kmmmmk.kmmk',
    '.kk..kmmmmk..kk.',
    '.....kmkkmk.....',
    '....kmmk.kmmk...',
    '....kmmk.kmmk...',
    '....kkkk.kkkk...',
    '................',
  ],
  troll: [
    '................',
    '.....kkkkkk.....',
    '....kmmmmmmk....',
    '...kmwkmmwkmk...',
    '...kmmmkkmmmk...',
    '...kmmkmmkmmk...',
    '...kmkwwwwkmk...',
    '....kmmmmmmk....',
    '..kkkllllllkkk..',
    '.kmmkllllllkmmk.',
    '.kmmkllllllkmmk.',
    '.kmk.kllllk.kmk.',
    '..k..kmmmmk..k..',
    '.....kmkkmk.....',
    '....kmmk.kmmk...',
    '....kkkk.kkkk...',
  ],
  snowman: [
    '................',
    '......kkkk......',
    '.....kkkkkk.....',
    '....kkkkkkkk....',
    '.....kmmmmk.....',
    '....kmkmmkmk....',
    '....kmooommk....',
    '.....kmmmmk.....',
    '....kmmmmmmk....',
    '...kmmmkmmmmk...',
    '..kmmmmmmmmmmk..',
    '..kmmmmkmmmmmk..',
    '..kmmmmmmmmmqk..',
    '...kmmmmmmmqk...',
    '....kkkkkkkk....',
    '................',
  ],
  dragon: [
    '................',
    '..kk............',
    '.kmmk...k.k.....',
    'kmrmmk.kmkmk....',
    'kmmmmmkmmmmmk...',
    '.kwkmmmmllmmmk..',
    '..kkkmmmllmmmmk.',
    '....kmmmmllmmmmk',
    '...kmmmmmllmmmk.',
    '..kmmkmmmllmmk..',
    '..kmk.kmmmmmmk..',
    '...k..kmmkkmmmk.',
    '......kmk..kmmmk',
    '......kkk...kmk.',
    '..............k.',
    '................',
  ],
  wizard_m: [
    '.......kk.......',
    '......kmmk......',
    '.....kmmlmk.....',
    '....kmmmmmmk....',
    '..kkkkkkkkkkkk..',
    '....kssssssk....',
    '....kskssksk....',
    '....kssssssk....',
    '....kxxxxxxk....',
    '...kmxxxxxxmk...',
    '..kmmmxxxxmmmk..',
    '..ksmmmxxmmmmk..',
    '..kkmmmmmmmmmk..',
    '...kmmmmmmmmmk..',
    '..kmmmmmmmmmmmk.',
    '..kkkkkkkkkkkkk.',
  ],
  owl: [
    '................',
    '...k........k...',
    '...kk......kk...',
    '...khkkkkkkhk...',
    '..khhhhhhhhhhk..',
    '..khwwwhhwwwhk..',
    '..khwkwhhwkwhk..',
    '..khwwwyywwwhk..',
    '..khhhhyyhhhhk..',
    '.khhYYYYYYYYhhk.',
    '.khhYhYYYYhYhhk.',
    '.khhYYYhYYYYhhk.',
    '..khhYYYYYYhhk..',
    '...khhhhhhhhk...',
    '....kykkkkyk....',
    '................',
  ],
  // Kæledyr (8x8)
  cat: [
    '.k...k..',
    '.kk.kk..',
    '.kmmmk..',
    '.kwmwk.k',
    '.kmmmk.k',
    'kmmmmmkk',
    'kmmmmmk.',
    'kk.k.kk.',
  ],
  owlet: [
    '.k....k.',
    '.kmmmmk.',
    'kmwmmwmk',
    'kmmyymmk',
    'kmllllmk',
    'kmllllmk',
    '.kmmmmk.',
    '..k..k..',
  ],
  dragonet: [
    '......k.',
    '.kk..kmk',
    'kmmk.kmk',
    'kwmmkmmk',
    '.kmmmmlk',
    '..kmmmlk',
    '..kmkmk.',
    '..kk.kk.',
  ],
  slimepet: [
    '........',
    '........',
    '..kkkk..',
    '.kllmmk.',
    'kmkmmkmk',
    'kmmmmmmk',
    'kqmmmmqk',
    '.kkkkkk.',
  ],
  // Kort-fliser
  tree: [
    '......kkkk......',
    '....kkGGGGkk....',
    '...kGGGgGGGGk...',
    '..kGGgGGGGgGGk..',
    '..kGgGGGGGGGgk..',
    '.kGGGGgGGgGGGGk.',
    '.kgGGGGGGGGGgGk.',
    '.kGgGGgGGGGGGgk.',
    '..kgGGGGGgGGgk..',
    '..kkggGggggggk..',
    '...kkgggggggk...',
    '.....kkkhkkk....',
    '......khhk......',
    '......khhk......',
    '.....khhhhk.....',
    '......kkkk......',
  ],
  pine: [
    '.......kk.......',
    '......kGGk......',
    '......kGgk......',
    '.....kGGggk.....',
    '.....kGgggk.....',
    '....kGGgGggk....',
    '.....kkggkk.....',
    '....kGGgGggk....',
    '...kGGgggGggk...',
    '...kGgggggggk...',
    '..kGGgggGgggk...',
    '..kGgggggggggk..',
    '..kkkkkhhkkkkk..',
    '.......hh.......',
    '......khhk......',
    '......kkkk......',
  ],
  rock: [
    '................', '................', '................', '................',
    '................', '................', '................', '................',
    '................',
    '......kkkk......',
    '....kkAAAAkk....',
    '...kAAwAAAaak...',
    '..kAAAAAAaaaak..',
    '..kAaaAAaaaDak..',
    '..kaaaaaaaDDak..',
    '...kkkkkkkkkk...',
  ],
  mountain: [
    '................',
    '.......kk.......',
    '......kwwk......',
    '.....kwwAak.....',
    '....kwAAaaak....',
    '....kAAaaaak....',
    '...kAAaaaaaak...',
    '...kAaaaDaaak...',
    '..kAAaaaDaaaak..',
    '..kAaaaDDaaaak..',
    '.kAAaaaDaaaaaak.',
    '.kAaaaDDaaaaaak.',
    'kAAaaaDaaaaaaaak',
    'kAaaaDDaaaaaaaak',
    'kkkkkkkkkkkkkkkk',
    '................',
  ],
  flowers: [
    '................', '................', '................', '................', '................',
    '................', '................', '................', '................', '................',
    '...r.......y....',
    '..rYr.....yYy...',
    '...r...b...y....',
    '...g..bYb..g....',
    '...g...b...g....',
    '......g.........',
  ],
  house: [
    '................',
    '......kkkk......',
    '.....krrrrk.....',
    '....krrrrrrk....',
    '...krrrrrrrrk...',
    '..krrrrrrrrrrk..',
    '.kkkkkkkkkkkkkk.',
    '..kYYYYYYYYYYk..',
    '..kYkkYYYYkkYk..',
    '..kYkBYYYYkBYk..',
    '..kYYYYkkkYYYk..',
    '..kYYYYkhkYYYk..',
    '..kYYYYkhkYYYk..',
    '..kYYYYkhkYYYk..',
    '..kkkkkkkkkkkk..',
    '................',
  ],
  // Ikoner på kortet (10x10)
  icoBattle: [
    'kk......kk',
    'kAk....kAk',
    '.kAk..kAk.',
    '..kAkkAk..',
    '...kAAk...',
    '...kAAk...',
    '..kAkkAk..',
    'kkyk..kykk',
    'kyk....kyk',
    'kk......kk',
  ],
  icoPuzzle: [
    '..kkk.....',
    '.kyyyk....',
    'kyk.kyk...',
    'kyk.kyk...',
    '.kyyyk....',
    '..kyk.....',
    '..kyykk...',
    '..kyk.....',
    '..kyykk...',
    '..kkk.....',
  ],
  icoVillage: [
    '....kk....',
    '...krrk...',
    '..krrrrk..',
    '.krrrrrrk.',
    'kkkkkkkkkk',
    '.kYYYYYYk.',
    '.kYBYYBYk.',
    '.kYYkkYYk.',
    '.kYYkhYYk.',
    '.kkkkkkkk.',
  ],
  icoBoss: [
    '..kkkkkk..',
    '.kwwwwwwk.',
    'kwwwwwwwwk',
    'kwkkwwkkwk',
    'kwkkwwkkwk',
    'kwwwkkwwwk',
    '.kwwwwwwk.',
    '..kwkwkwk.',
    '..kkkkkkk.',
    '..........',
  ],
  star: [
    '....k....',
    '...kyk...',
    'kkkkyykkk',
    'kyyyyyyyk',
    '.kyyyyyk.',
    '..kyyyk..',
    '.kyykyyk.',
    'kyk...kyk',
    'kk.....kk',
  ],
};

const cache = new Map();

export function sprite(name, pal = null, opts = null) {
  const key = name + '|' + (pal ? JSON.stringify(pal) : '') + (opts ? JSON.stringify(opts) : '');
  let c = cache.get(key);
  if (c) return c;
  const rows = SPR[name];
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  for (let y = 0; y < h; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.') continue;
      g.fillStyle = (opts && opts.silhouette) || (pal && pal[ch]) || PAL[ch] || '#f0f';
      g.fillRect(x, y, 1, 1);
    }
  }
  cache.set(key, c);
  return c;
}

const HAIR = { brun: '#ac7c00', sort: '#404040', blond: '#f8d878', rød: '#e45c10' };
export const HAIR_COLORS = HAIR;

// Sammensat helt: 24x24
export function heroCanvas(look, opts = null) {
  const key = 'HERO' + JSON.stringify(look) + (opts ? JSON.stringify(opts) : '');
  let c = cache.get(key);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = 24; c.height = 24;
  const g = c.getContext('2d');
  const tunic = (ITEMS[look.tunic] && ITEMS[look.tunic].look) || { T: '#3cbcfc', t: '#0058f8' };
  const sil = opts && opts.silhouette ? { silhouette: opts.silhouette } : null;
  if (look.cape && ITEMS[look.cape]) g.drawImage(sprite('cape', ITEMS[look.cape].look, sil), 4, 4);
  if (look.shield && ITEMS[look.shield]) g.drawImage(sprite('shield', ITEMS[look.shield].look, sil), 2, 13);
  g.drawImage(sprite('hero', { ...tunic, C: HAIR[look.hair] || HAIR.brun }, sil), 4, 4);
  if (look.weapon && ITEMS[look.weapon]) {
    const wl = ITEMS[look.weapon].look;
    g.drawImage(sprite(wl.kind, wl, sil), 13, 4);
  }
  if (look.hat && ITEMS[look.hat]) {
    const hl = ITEMS[look.hat].look;
    const s = sprite(hl.kind, hl, sil);
    g.drawImage(s, 4, 7 - s.height);
  }
  cache.set(key, c);
  return c;
}

export function petCanvas(id) {
  const it = ITEMS[id];
  if (!it) return null;
  return sprite(it.look.kind, it.look);
}

export function monsterCanvas(def, opts = null) {
  const name = def.spr === 'wizard' ? 'wizard_m' : def.spr;
  return sprite(name, def.pal, opts);
}

// ---------- Tekst ----------
export function text(ctx, str, x, y, { size = 8, color = '#fcfcfc', align = 'left', shadow = '#000', font = "'Press Start 2P', monospace" } = {}) {
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  if (shadow) { ctx.fillStyle = shadow; ctx.fillText(str, x + 1, y + 1); }
  ctx.fillStyle = color;
  ctx.fillText(str, x, y);
}

export function box(ctx, x, y, w, h, fill = '#000', border = '#fcfcfc') {
  ctx.fillStyle = border; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#000'; ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  ctx.fillStyle = fill; ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
}

export function bar(ctx, x, y, w, h, frac, color, back = '#404040') {
  ctx.fillStyle = '#000'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = back; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color; ctx.fillRect(x, y, Math.max(0, Math.round(w * Math.min(1, frac))), h);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x, y, Math.max(0, Math.round(w * Math.min(1, frac))), 1);
}

// ---------- Temaer ----------
export const THEMES = {
  meadow:   { ground: '#58d854', speck: ['#00a800', '#b8f818'], path: '#fce0a8', pathEdge: '#f8b800', deco: [['tree', 5], ['flowers', 3], ['rock', 1]], pal: {},
              sky: ['#3cbcfc', '#6888fc', '#a4e4fc'], far: 'hill', farCol: '#00a800', floor: '#58d854', floor2: '#00a800' },
  forest:   { ground: '#00a800', speck: ['#005800', '#58d854'], path: '#ac7c00', pathEdge: '#503000', deco: [['pine', 6], ['tree', 2], ['rock', 1]], pal: { tree: { G: '#00a800', g: '#005800' } },
              sky: ['#000058', '#0000a8', '#2000a8'], far: 'pines', farCol: '#005800', floor: '#005800', floor2: '#003800' },
  coast:    { ground: '#fce0a8', speck: ['#f8b800', '#fcfcfc'], path: '#f8b800', pathEdge: '#ac7c00', deco: [['rock', 3], ['tree', 2], ['flowers', 1]], water: true, pal: {},
              sky: ['#3cbcfc', '#a4e4fc', '#d8f8f8'], far: 'sea', farCol: '#0058f8', floor: '#fce0a8', floor2: '#f8b800' },
  mountain: { ground: '#7c7c7c', speck: ['#bcbcbc', '#404040'], path: '#ac7c00', pathEdge: '#503000', deco: [['mountain', 5], ['rock', 4], ['pine', 1]], pal: {},
              sky: ['#6888fc', '#a4a4fc', '#d8d8fc'], far: 'peaks', farCol: '#404040', floor: '#7c7c7c', floor2: '#404040' },
  ice:      { ground: '#fcfcfc', speck: ['#a4e4fc', '#d8f8f8'], path: '#a4e4fc', pathEdge: '#3cbcfc', deco: [['pine', 4], ['rock', 2], ['mountain', 2]], pal: { pine: { G: '#fcfcfc', g: '#a4e4fc' }, rock: { A: '#d8f8f8', a: '#a4e4fc', D: '#3cbcfc' }, mountain: { A: '#fcfcfc', a: '#a4e4fc', D: '#3cbcfc' } },
              sky: ['#0058f8', '#3cbcfc', '#a4e4fc'], far: 'peaks', farCol: '#a4e4fc', floor: '#fcfcfc', floor2: '#a4e4fc' },
  tower:    { ground: '#2a1838', speck: ['#503060', '#140820'], path: '#7c7c7c', pathEdge: '#404040', deco: [['rock', 4], ['pine', 2]], pal: { rock: { A: '#8858a8', a: '#503060', D: '#201030', w: '#d8a0fc' }, pine: { G: '#503060', g: '#2a1838', h: '#201030' } },
              sky: ['#140820', '#2a1838', '#503060'], far: 'bricks', farCol: '#201030', floor: '#404040', floor2: '#202020' },
};

export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function makeCanvas(w = W, h = H) {
  const c = document.createElement('canvas');
  c.width = w * SCALE; c.height = h * SCALE;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.scale(SCALE, SCALE);
  return [c, g];
}

function fillNoise(g, x, y, w, h, base, specks, r, density = 0.08) {
  g.fillStyle = base; g.fillRect(x, y, w, h);
  const n = Math.floor(w * h * density);
  for (let i = 0; i < n; i++) {
    g.fillStyle = specks[Math.floor(r() * specks.length)];
    g.fillRect(x + Math.floor(r() * w), y + Math.floor(r() * h), 1, 1);
  }
}

// Kort for et område. Returnerer {canvas, points, nodeIdx}
export function buildMap(chIndex, chapter) {
  const th = THEMES[chapter.theme];
  const [c, g] = makeCanvas();
  const r = rng(1234 + chIndex * 97);
  fillNoise(g, 0, 0, W, H, th.ground, th.speck, r);
  const cols = 16, rows = 12;
  const pathCells = new Set();
  const nodes = chapter.nodes;
  const points = []; const nodeIdx = [];
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (i === 0) { points.push([n.x, n.y]); nodeIdx.push(0); pathCells.add(n.x + ',' + n.y); continue; }
    const p = nodes[i - 1];
    let x = p.x, y = p.y;
    while (x !== n.x) { x += Math.sign(n.x - x); pathCells.add(x + ',' + y); }
    if (y !== n.y) points.push([x, y]);
    while (y !== n.y) { y += Math.sign(n.y - y); pathCells.add(x + ',' + y); }
    points.push([n.x, n.y]); nodeIdx.push(points.length - 1);
  }
  // vand langs toppen ved kysten
  if (th.water) {
    for (let x = 0; x < W; x++) for (let y = 0; y < 22; y++) {
      g.fillStyle = y < 18 ? ((x + y * 3) % 11 === 0 ? '#3cbcfc' : '#0058f8') : '#fcfcfc';
      g.fillRect(x, y, 1, 1);
    }
  }
  // sti
  for (const k of pathCells) {
    const [x, y] = k.split(',').map(Number);
    g.fillStyle = th.pathEdge; g.fillRect(x * 16 + 2, y * 16 + 2, 12, 12);
    g.fillStyle = th.path; g.fillRect(x * 16 + 3, y * 16 + 3, 10, 10);
  }
  // forbind stifliser
  for (const k of pathCells) {
    const [x, y] = k.split(',').map(Number);
    if (pathCells.has((x + 1) + ',' + y)) { g.fillStyle = th.pathEdge; g.fillRect(x * 16 + 13, y * 16 + 2, 6, 12); g.fillStyle = th.path; g.fillRect(x * 16 + 12, y * 16 + 3, 8, 10); }
    if (pathCells.has(x + ',' + (y + 1))) { g.fillStyle = th.pathEdge; g.fillRect(x * 16 + 2, y * 16 + 13, 12, 6); g.fillStyle = th.path; g.fillRect(x * 16 + 3, y * 16 + 12, 10, 8); }
  }
  // pynt
  const near = (x, y) => nodes.some(n => Math.abs(n.x - x) <= 1 && Math.abs(n.y - y) <= 1);
  const total = th.deco.reduce((s, d) => s + d[1], 0);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    if (pathCells.has(x + ',' + y) || near(x, y)) continue;
    if (th.water && y < 2) continue;
    const edge = (x === 0 || y === 0 || x === cols - 1 || y === rows - 1) ? 0.3 : 0;
    if (r() > 0.32 + edge) continue;
    let pick = r() * total, name = th.deco[0][0];
    for (const [nm, wgt] of th.deco) { if ((pick -= wgt) <= 0) { name = nm; break; } }
    g.drawImage(sprite(name, th.pal[name] || null), x * 16, y * 16);
  }
  return { canvas: c, points, nodeIdx };
}

// Kampbaggrund
export function buildBattleBg(themeName) {
  const th = THEMES[themeName];
  const [c, g] = makeCanvas();
  const r = rng(77 + themeName.length * 13);
  const bands = [0, 40, 80, 132];
  for (let i = 0; i < 3; i++) { g.fillStyle = th.sky[i]; g.fillRect(0, bands[i], W, bands[i + 1] - bands[i]); }
  if (themeName === 'forest' || themeName === 'tower') {
    for (let i = 0; i < 40; i++) { g.fillStyle = r() < 0.5 ? '#fcfcfc' : '#f8d878'; g.fillRect(Math.floor(r() * W), Math.floor(r() * 80), 1, 1); }
    g.fillStyle = '#fce0a8'; g.fillRect(134, 34, 14, 14); g.fillStyle = th.sky[0]; g.fillRect(140, 32, 10, 12);
  } else {
    g.fillStyle = '#fcfcfc';
    for (const [cx, cy] of [[30, 20], [150, 34], [210, 12]]) { g.fillRect(cx, cy, 28, 6); g.fillRect(cx + 6, cy - 4, 14, 4); }
  }
  // fjerne silhuetter
  g.fillStyle = th.farCol;
  if (th.far === 'hill') { for (let x = 0; x < W; x++) { const hh = 22 + Math.round(10 * Math.sin(x / 23) + 6 * Math.sin(x / 9)); g.fillRect(x, 132 - hh, 1, hh); } }
  if (th.far === 'pines' || th.far === 'peaks') {
    for (let i = 0; i < 12; i++) { const cx = i * 24 + Math.floor(r() * 10), hh = (th.far === 'peaks' ? 40 : 28) + Math.floor(r() * 24);
      for (let y = 0; y < hh; y++) { const w2 = Math.floor((y / hh) * (th.far === 'peaks' ? 26 : 12)); g.fillRect(cx - w2, 132 - hh + y, w2 * 2 + 1, 1); }
      if (th.far === 'peaks') { g.fillStyle = '#fcfcfc'; for (let y = 0; y < 6; y++) { const w2 = Math.floor((y / hh) * 26); g.fillRect(cx - w2, 132 - hh + y, w2 * 2 + 1, 1); } g.fillStyle = th.farCol; }
    }
  }
  if (th.far === 'sea') { g.fillStyle = '#0058f8'; g.fillRect(0, 104, W, 28); g.fillStyle = '#3cbcfc'; for (let i = 0; i < 30; i++) g.fillRect(Math.floor(r() * W), 106 + Math.floor(r() * 24), 6, 1); }
  if (th.far === 'bricks') { for (let y = 40; y < 132; y += 8) for (let x = (y / 8) % 2 ? 0 : 8; x < W; x += 16) { g.fillStyle = '#2a1838'; g.fillRect(x, y, 15, 7); }
    for (const tx of [40, 210]) { g.fillStyle = '#f8b800'; g.fillRect(tx, 70, 4, 6); g.fillStyle = '#d82800'; g.fillRect(tx + 1, 66, 2, 4); } }
  // gulv
  fillNoise(g, 0, 132, W, H - 132, th.floor, [th.floor2], r, 0.12);
  g.fillStyle = th.floor2; g.fillRect(0, 132, W, 2);
  // skygger under figurer
  g.fillStyle = 'rgba(0,0,0,.25)';
  g.fillRect(40, 150, 40, 4); g.fillRect(156, 150, 64, 5);
  return c;
}
