// Pixelgrafik: sprites tegnes fra tekst-gitre med en farvepalet.
import { ITEMS } from './data/game.js';

export const W = 256, H = 192;
// Skarpere billede: tegn i skærmens egen opløsning (3–6 gange spillets pixels)
const DPR = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
const CSSW = typeof window !== 'undefined' ? Math.min(window.innerWidth || 560, 560) : 560;
export const SCALE = Math.max(3, Math.min(6, Math.round(DPR * CSSW / W)));

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
  mapChest: [
    '.kkkkkkkkkk.',
    'khYhhhhhhYhk',
    'kyhhhhhhhhyk',
    'kkkkkyykkkkk',
    'kyhhhykhhhyk',
    'kyhhhyyhhhyk',
    'kyhhhhhhhhyk',
    'kyHHHHHHHHyk',
    'kkkkkkkkkkkk',
  ],
  mapChestOpen: [
    '.kkkkkkkkkk.',
    'kHHHHHHHHHHk',
    'kkkkkkkkkkkk',
    'kyYyYyyYyYyk',
    'kkkkkkkkkkkk',
    'kyhhhhhhhhyk',
    'kyhhhhhhhhyk',
    'kyHHHHHHHHyk',
    'kkkkkkkkkkkk',
  ],
  thorns: [
    '..k.....k...k.',
    '.kdk...kdk.kdk',
    '..kdk.kdk.kdk.',
    'k..kdkdk.kdk..',
    'dk.kdddkkddk.k',
    '.kdddkdddddkdk',
    'kddkdddkdddddk',
    '.kk.kk.kk.kkk.',
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

// Store kister og hængelåse (bygges med kode)
const grid = (w, h, fn) => Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => fn(x, y)).join(''));
const chestFill = (x, y) => {
  if ((x >= 3 && x <= 5) || (x >= 26 && x <= 28)) return x === 3 || x === 26 ? 'Y' : 'y';
  return y % 6 === 5 ? 'H' : 'h';
};
SPR.chest = grid(32, 20, (x, y) => {
  if (x === 0 || x === 31 || y === 0 || y === 19) return 'k';
  if (x >= 13 && x <= 18 && y >= 1 && y <= 8) return (x >= 15 && x <= 16 && y >= 3 && y <= 6) ? 'k' : (x === 13 || x === 18 || y === 8 ? 'k' : 'y');
  return chestFill(x, y);
});
SPR.chestLid = grid(32, 10, (x, y) => {
  if (y === 0) return x >= 3 && x <= 28 ? 'k' : '.';
  if (y === 1) return x === 2 || x === 29 ? 'k' : x > 2 && x < 29 ? chestFill(x, y) : '.';
  if (x === 0 || x === 31 || y === 9) return 'k';
  if (x === 1 || x === 30) return y === 2 ? 'k' : chestFill(x, y);
  return y === 3 ? 'Y' : chestFill(x, y + 1);
});
SPR.padlock = grid(16, 20, (x, y) => {
  if (y >= 8) {
    if (x === 0 || x === 15 || y === 8 || y === 19) return x === 0 || x === 15 ? (y === 8 || y === 19 ? '.' : 'k') : 'k';
    if ((x === 7 || x === 8) && y >= 11 && y <= 15) return 'k';
    if (x === 6 && y === 12) return 'k'; if (x === 9 && y === 12) return 'k';
    return y === 9 ? 'w' : 'a';
  }
  const dx = x - 7.5, dy = y - 6, d = Math.hypot(dx, dy);
  const on = y <= 6 ? d >= 3 && d <= 6 : Math.abs(dx) >= 3 && Math.abs(dx) <= 6;
  if (!on) return '.';
  const edge = y <= 6 ? d > 5.2 || d < 3.8 : Math.abs(dx) > 5.2 || Math.abs(dx) < 3.8;
  return edge ? 'k' : 'A';
});

// ---------- Farver ----------
const hexRgb = hx => { const n = parseInt(hx.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const rgbHex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
// f > 0 lysere, f < 0 mørkere
export function shade(hx, f) {
  if (!hx || hx[0] !== '#') return hx;
  const [r, g, b] = hexRgb(hx);
  return f >= 0 ? rgbHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f) : rgbHex(r * (1 + f), g * (1 + f), b * (1 + f));
}
export function mix(a, b, p) {
  const A = hexRgb(a), B = hexRgb(b);
  return rgbHex(A[0] + (B[0] - A[0]) * p, A[1] + (B[1] - A[1]) * p, A[2] + (B[2] - A[2]) * p);
}

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
  const at = (x, y) => (y < 0 || y >= h || x < 0 || x >= rows[y].length ? '.' : rows[y][x]);
  const col = ch => (pal && pal[ch]) || PAL[ch] || '#f0f';
  const edge = ch => ch === '.' || ch === 'k';
  for (let y = 0; y < h; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.') continue;
      if (opts && opts.silhouette) { g.fillStyle = opts.silhouette; g.fillRect(x, y, 1, 1); continue; }
      let c2 = col(ch);
      if (ch === 'k') {
        // 16-bit "sel-out": konturen får en mørk udgave af farven ved siden af
        const nb = [at(x, y - 1), at(x + 1, y), at(x, y + 1), at(x - 1, y)].filter(n => !edge(n));
        const outer = [at(x, y - 1), at(x + 1, y), at(x, y + 1), at(x - 1, y)].some(n => n === '.');
        if (nb.length) c2 = shade(col(nb[0]), outer ? -0.8 : -0.62);
        else c2 = '#100818';
      } else {
        // lys fra oven til venstre
        const up = edge(at(x, y - 1)), dn = edge(at(x, y + 1)), lf = edge(at(x - 1, y)), rt = edge(at(x + 1, y));
        if (up && !dn) c2 = shade(c2, 0.28);
        else if (dn && !up && ch !== 'w') c2 = shade(c2, -0.22);
        else if (lf && !rt) c2 = shade(c2, 0.12);
        else if (rt && !lf && ch !== 'w') c2 = shade(c2, -0.14);
      }
      g.fillStyle = c2;
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

// Vindue i 16-bit-stil: afrundede hjørner, glidende farve og indre lyskant
export function box(ctx, x, y, w, h, fill = '#000', border = '#fcfcfc') {
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(x + 1, y + 2, w, h);
  ctx.fillStyle = border; ctx.fillRect(x + 1, y, w - 2, h); ctx.fillRect(x, y + 1, w, h - 2);
  ctx.fillStyle = '#000'; ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  const gr = ctx.createLinearGradient(0, y + 2, 0, y + h - 2);
  gr.addColorStop(0, fill[0] === '#' ? shade(fill, 0.25) : fill); gr.addColorStop(1, fill[0] === '#' ? shade(fill, -0.35) : fill);
  ctx.fillStyle = gr; ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x + 2, y + 2, w - 4, 1);
}

export function bar(ctx, x, y, w, h, frac, color, back = '#404040') {
  const fw = Math.max(0, Math.round(w * Math.min(1, frac)));
  ctx.fillStyle = '#000'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = back; ctx.fillRect(x, y, w, h);
  if (fw) {
    const gr = ctx.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, shade(color, 0.45)); gr.addColorStop(0.45, color); gr.addColorStop(1, shade(color, -0.35));
    ctx.fillStyle = gr; ctx.fillRect(x, y, fw, h);
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(x, y, fw, Math.max(0.5, h / 5));
  }
}

// Blød skygge under en figur
export function shadow(ctx, x, y, rx, ry) {
  ctx.fillStyle = 'rgba(0,0,0,.28)';
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.18)';
  ctx.beginPath(); ctx.ellipse(x, y, rx * 0.6, ry * 0.6, 0, 0, Math.PI * 2); ctx.fill();
}

// Lysende glød (lægges oven på med "lighter")
export function glow(ctx, x, y, r, color) {
  if (r <= 0) return;
  const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, color); gr.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
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
  // større, bløde pletter giver terrænet liv
  for (let i = 0; i < 26; i++) {
    const x = r() * W, y = r() * H, rad = 10 + r() * 22;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, r() < 0.5 ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.10)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
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
    skyBands(g, 0, 18, ['#3c9cfc', '#0868e0', '#0048b8']);
    for (let i = 0; i < 50; i++) { g.fillStyle = r() < 0.5 ? '#78c8fc' : '#1878e8'; g.fillRect(Math.floor(r() * W), Math.floor(r() * 16), 3 + Math.floor(r() * 5), 1); }
    for (let x = 0; x < W; x++) { const fy = 17 + Math.round(Math.sin(x / 6) * 1.5); g.fillStyle = '#fcfcfc'; g.fillRect(x, fy, 1, 2); g.fillStyle = 'rgba(0,40,120,.25)'; g.fillRect(x, fy + 2, 1, 3); }
  }
  // sti: kant, skygge og lys midte
  const cell = (x, y) => pathCells.has(x + ',' + y);
  const rect = (x, y, w, h) => {
    g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + 1, y + 1, w, h);
    g.fillStyle = th.pathEdge; g.fillRect(x, y, w, h);
  };
  for (const k of pathCells) {
    const [x, y] = k.split(',').map(Number);
    rect(x * 16 + 2, y * 16 + 2, 12, 12);
    if (cell(x + 1, y)) rect(x * 16 + 13, y * 16 + 2, 6, 12);
    if (cell(x, y + 1)) rect(x * 16 + 2, y * 16 + 13, 12, 6);
  }
  const inner = (x, y, w, h) => {
    g.fillStyle = th.path; g.fillRect(x, y, w, h);
    g.fillStyle = shade(th.path, 0.25); g.fillRect(x + 1, y + 1, w - 2, h - 3);
  };
  for (const k of pathCells) {
    const [x, y] = k.split(',').map(Number);
    inner(x * 16 + 3, y * 16 + 3, 10, 10);
    if (cell(x + 1, y)) inner(x * 16 + 12, y * 16 + 3, 8, 10);
    if (cell(x, y + 1)) inner(x * 16 + 3, y * 16 + 12, 10, 8);
    for (let i = 0; i < 3; i++) { g.fillStyle = shade(th.path, -0.25); g.fillRect(x * 16 + 4 + Math.floor(r() * 8), y * 16 + 4 + Math.floor(r() * 8), 1, 1); }
  }
  const near = (x, y) => nodes.some(n => Math.abs(n.x - x) <= 1 && Math.abs(n.y - y) <= 1);
  // skattekister: en ledig plads tæt på det sted, der låser dem op
  const chests = [];
  const free = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows && !cell(x, y) && !near(x, y) && !(th.water && y < 2) &&
    !chests.some(p => Math.abs(p.x - x) <= 1 && Math.abs(p.y - y) <= 1) && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => cell(x + dx, y + dy) || near(x + dx, y + dy));
  for (const cd of chapter.chests || []) {
    const n = nodes[cd.after];
    let best = null, bd = 1e9;
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      if (!free(x, y)) continue;
      const d = Math.abs(n.x - x) + Math.abs(n.y - y) + (x === 0 || y === 0 || x === cols - 1 || y === rows - 1 ? 3 : 0);
      if (d < bd) { bd = d; best = { x, y }; }
    }
    chests.push(best || { x: n.x, y: Math.max(0, n.y - 2) });
  }
  // pynt
  const total = th.deco.reduce((s, d) => s + d[1], 0);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    if (pathCells.has(x + ',' + y) || near(x, y)) continue;
    if (th.water && y < 2) continue;
    if (chests.some(p => p.x === x && p.y === y)) continue;
    const edge = (x === 0 || y === 0 || x === cols - 1 || y === rows - 1) ? 0.3 : 0;
    if (r() > 0.32 + edge) continue;
    let pick = r() * total, name = th.deco[0][0];
    for (const [nm, wgt] of th.deco) { if ((pick -= wgt) <= 0) { name = nm; break; } }
    if (name !== 'flowers') { g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(x * 16 + 9, y * 16 + 15, 6, 2, 0, 0, 7); g.fill(); }
    g.drawImage(sprite(name, th.pal[name] || null), x * 16, y * 16);
  }
  return { canvas: c, points, nodeIdx, chests };
}

// ---------- Baggrunde i 16-bit-stil ----------
// Himmel i tynde bånd (som SNES-farveovergange)
function skyBands(g, y0, y1, cols) {
  for (let y = y0; y < y1; y += 2) {
    const p = (y - y0) / (y1 - y0), seg = Math.min(cols.length - 2, Math.floor(p * (cols.length - 1)));
    const lp = p * (cols.length - 1) - seg;
    g.fillStyle = mix(cols[seg], cols[seg + 1], lp); g.fillRect(0, y, W, 2);
  }
}
// Bjerg-/bakkelag med lys kant og skygge
function ridge(g, base, hFn, col, light = 0.18, dark = -0.25) {
  for (let x = 0; x < W; x++) {
    const hh = Math.round(hFn(x)), top = base - hh;
    const gr = g.createLinearGradient(0, top, 0, base);
    gr.addColorStop(0, shade(col, light * 0.5)); gr.addColorStop(1, shade(col, dark));
    g.fillStyle = gr; g.fillRect(x, top, 1, hh);
    g.fillStyle = shade(col, light); g.fillRect(x, top, 1, 1);
  }
}
function peaks(g, base, r, n, minH, varH, col, snow) {
  for (let i = 0; i < n; i++) {
    const cx = (i + 0.3) * (W / (n - 1)) + (r() - 0.5) * 20, hh = minH + r() * varH, half = hh * (0.9 + r() * 0.4);
    for (let y = 0; y < hh; y++) {
      const w2 = (y / hh) * half, yy = base - hh + y;
      g.fillStyle = shade(col, 0.12); g.fillRect(cx - w2, yy, w2, 1);   // solsiden
      g.fillStyle = shade(col, -0.22); g.fillRect(cx, yy, w2 + 1, 1);  // skyggesiden
      if (snow && y < hh * 0.28) { g.fillStyle = '#fcfcfc'; g.fillRect(cx - w2, yy, w2, 1); g.fillStyle = '#c8d8f8'; g.fillRect(cx, yy, w2 + 1, 1); }
    }
  }
}
function cloud(g, x, y, s) {
  const puffs = [[0, 4, 7], [8, 0, 9], [18, 3, 8], [26, 6, 6]];
  for (const [dx, dy, r] of puffs) { g.fillStyle = '#c8e0fc'; g.beginPath(); g.arc(x + dx * s, y + dy * s + 2, r * s, 0, 7); g.fill(); }
  for (const [dx, dy, r] of puffs) { g.fillStyle = '#fcfcfc'; g.beginPath(); g.arc(x + dx * s - 1, y + dy * s, r * s - 1, 0, 7); g.fill(); }
}
function sunGlow(g, x, y, r, core, halo) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r * 4);
  gr.addColorStop(0, halo); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
  g.fillStyle = core; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
}
function pineShape(g, cx, base, hh, col) {
  for (let y = 0; y < hh; y++) {
    const w2 = Math.floor(((y % (hh / 3)) / (hh / 3)) * 4 + y / hh * 5) + 1;
    g.fillStyle = shade(col, 0.1); g.fillRect(cx - w2, base - hh + y, w2, 1);
    g.fillStyle = shade(col, -0.2); g.fillRect(cx, base - hh + y, w2, 1);
  }
  g.fillStyle = '#2a1808'; g.fillRect(cx - 1, base - 2, 2, 3);
}

const FLOOR_Y = 132;

// Kampbaggrund
export function buildBattleBg(themeName) {
  const th = THEMES[themeName];
  const [c, g] = makeCanvas();
  const r = rng(77 + themeName.length * 13);
  if (themeName === 'meadow') {
    skyBands(g, 0, FLOOR_Y, ['#2878f8', '#58a8fc', '#a8dcfc', '#e0f4fc']);
    sunGlow(g, 206, 26, 9, '#fcf8d8', 'rgba(252,240,180,.55)');
    cloud(g, 22, 18, 1); cloud(g, 120, 34, 0.8); cloud(g, 180, 8, 0.6);
    ridge(g, FLOOR_Y, x => 34 + 10 * Math.sin(x / 31) + 6 * Math.sin(x / 13 + 1), '#68b878', 0.2, -0.1);
    for (let i = 0; i < 9; i++) { const x = 10 + i * 30 + r() * 10; g.fillStyle = '#3c8850'; g.beginPath(); g.arc(x, FLOOR_Y - 34 - 8 * Math.sin(x / 31) + 2, 4, 0, 7); g.fill(); }
    ridge(g, FLOOR_Y, x => 16 + 8 * Math.sin(x / 19 + 2) + 4 * Math.sin(x / 7), '#30a040', 0.25, -0.2);
  } else if (themeName === 'forest') {
    skyBands(g, 0, FLOOR_Y, ['#04041c', '#0c1440', '#183868', '#2c5870']);
    for (let i = 0; i < 60; i++) { g.fillStyle = r() < 0.3 ? '#f8e8a8' : '#c8d8fc'; g.fillRect(Math.floor(r() * W), Math.floor(r() * 70), 1, 1); }
    sunGlow(g, 140, 30, 8, '#f0f0d8', 'rgba(200,220,255,.35)');
    g.fillStyle = '#0c1440'; g.beginPath(); g.arc(145, 27, 7, 0, 7); g.fill();
    for (let i = 0; i < 16; i++) pineShape(g, i * 17 + r() * 8, FLOOR_Y - 8, 44 + r() * 20, '#1c4850');
    g.fillStyle = 'rgba(160,200,220,.12)'; g.fillRect(0, FLOOR_Y - 26, W, 14);
    for (let i = 0; i < 11; i++) pineShape(g, i * 25 + r() * 10, FLOOR_Y + 2, 50 + r() * 26, '#0c2c24');
  } else if (themeName === 'coast') {
    skyBands(g, 0, 100, ['#3878f0', '#68b0f8', '#b8e4fc', '#f0f4e8']);
    sunGlow(g, 60, 30, 10, '#fcfce0', 'rgba(252,248,200,.6)');
    cloud(g, 130, 16, 0.9); cloud(g, 200, 40, 0.6);
    g.fillStyle = '#5888a8'; for (let x = 170; x < 230; x++) { const hh = 8 * Math.sin((x - 170) / 60 * Math.PI); g.fillRect(x, 100 - hh, 1, hh); }
    skyBands(g, 100, FLOOR_Y, ['#2068c8', '#0848a0', '#04307c']);
    for (let i = 0; i < 40; i++) { const y = 102 + Math.floor(r() * 28); g.fillStyle = y < 112 ? '#a8dcfc' : '#4890e0'; g.fillRect(Math.floor(r() * W), y, 3 + Math.floor(r() * 6), 1); }
    g.fillStyle = 'rgba(252,252,224,.35)'; for (let y = 101; y < 128; y += 3) g.fillRect(52 + (r() - 0.5) * 10, y, 16 - (y - 100) / 3, 1);
  } else if (themeName === 'mountain') {
    skyBands(g, 0, FLOOR_Y, ['#4060c8', '#7890e0', '#b0b8f0', '#e0d8f0']);
    cloud(g, 40, 22, 0.7); cloud(g, 190, 12, 0.8);
    peaks(g, FLOOR_Y - 10, r, 6, 50, 30, '#9090c0', true);
    g.fillStyle = 'rgba(230,230,250,.25)'; g.fillRect(0, FLOOR_Y - 30, W, 20);
    peaks(g, FLOOR_Y, r, 8, 24, 22, '#686878', false);
  } else if (themeName === 'ice') {
    skyBands(g, 0, FLOOR_Y, ['#040c38', '#10307c', '#3070c0', '#a0d8f0']);
    for (let i = 0; i < 40; i++) { g.fillStyle = '#fcfcfc'; g.fillRect(Math.floor(r() * W), Math.floor(r() * 60), 1, 1); }
    // nordlys
    for (let k = 0; k < 3; k++) for (let x = 0; x < W; x++) {
      const y = 20 + k * 9 + Math.sin(x / 22 + k) * 8, a = 0.18 + 0.12 * Math.sin(x / 9 + k * 2);
      g.fillStyle = `rgba(${k === 1 ? '120,252,220' : '80,220,160'},${a})`; g.fillRect(x, y, 1, 10 + Math.sin(x / 5) * 3);
    }
    peaks(g, FLOOR_Y - 6, r, 6, 46, 26, '#c8e0fc', true);
    peaks(g, FLOOR_Y, r, 9, 20, 16, '#88b8e8', false);
  } else {
    // tårnet: murværk med skygger, vinduer med måneskin
    skyBands(g, 0, FLOOR_Y, ['#0c0418', '#1c0c30', '#2c1440']);
    for (let y = 0; y < FLOOR_Y; y += 8) for (let x = (y / 8) % 2 ? -8 : 0; x < W; x += 16) {
      const base = mix('#3a2450', '#241434', r() * 0.6);
      g.fillStyle = base; g.fillRect(x + 1, y + 1, 14, 6);
      g.fillStyle = shade(base, 0.18); g.fillRect(x + 1, y + 1, 14, 1);
      g.fillStyle = shade(base, -0.35); g.fillRect(x + 1, y + 6, 14, 1);
    }
    for (const wx of [96, 144]) {
      g.fillStyle = '#100818'; g.fillRect(wx - 1, 22, 18, 40); g.beginPath(); g.arc(wx + 8, 22, 9, Math.PI, 0); g.fill();
      const gr = g.createLinearGradient(0, 14, 0, 62); gr.addColorStop(0, '#5878c8'); gr.addColorStop(1, '#203068');
      g.fillStyle = gr; g.fillRect(wx + 1, 22, 14, 38); g.beginPath(); g.arc(wx + 8, 22, 7, Math.PI, 0); g.fill();
      g.fillStyle = '#100818'; g.fillRect(wx + 7, 15, 2, 45); g.fillRect(wx + 1, 38, 14, 2);
      g.fillStyle = 'rgba(140,170,255,.12)'; g.beginPath(); g.moveTo(wx, 60); g.lineTo(wx + 16, 60); g.lineTo(wx + 34, FLOOR_Y); g.lineTo(wx - 18, FLOOR_Y); g.fill();
    }
    for (const tx of [40, 210]) { g.fillStyle = '#5a3a18'; g.fillRect(tx, 70, 4, 10); g.fillStyle = '#8a6a38'; g.fillRect(tx, 70, 1, 10); }
  }
  // gulv med dybde: mørkere langt væk, lysere tæt på
  for (let y = FLOOR_Y; y < H; y++) {
    const p = (y - FLOOR_Y) / (H - FLOOR_Y);
    g.fillStyle = mix(shade(th.floor2, -0.15), th.floor, Math.min(1, p * 1.6)); g.fillRect(0, y, W, 1);
  }
  g.fillStyle = shade(th.floor2, -0.3); g.fillRect(0, FLOOR_Y, W, 1);
  g.fillStyle = shade(th.floor, 0.3); g.fillRect(0, FLOOR_Y + 1, W, 1);
  if (themeName === 'tower') {
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 0.6;
    for (let i = -8; i <= 8; i++) { g.beginPath(); g.moveTo(W / 2 + i * 10, FLOOR_Y); g.lineTo(W / 2 + i * 44, H); g.stroke(); }
    for (let y = FLOOR_Y + 6, d = 6; y < H; d *= 1.35, y += d) { g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(0, y, W, 0.6); }
  } else {
    for (let i = 0; i < 260; i++) {
      const y = FLOOR_Y + 3 + Math.pow(r(), 0.8) * (H - FLOOR_Y - 3), x = r() * W, near = (y - FLOOR_Y) / (H - FLOOR_Y);
      g.fillStyle = r() < 0.5 ? shade(th.floor2, -0.1) : shade(th.floor, 0.22);
      g.fillRect(x, y, 1 + near * 2, 1);
    }
    // græstotter, blomster, sten, muslinger, isrevner
    for (let i = 0; i < 26; i++) {
      const x = r() * W, y = FLOOR_Y + 6 + r() * (H - FLOOR_Y - 8), sz = 1 + (y - FLOOR_Y) / 30;
      if (themeName === 'meadow' || themeName === 'forest') {
        g.fillStyle = shade(th.floor, -0.3); g.fillRect(x, y - 2 * sz, 1, 2 * sz); g.fillRect(x + 2, y - 3 * sz, 1, 3 * sz); g.fillRect(x + 4, y - 2 * sz, 1, 2 * sz);
        if (themeName === 'meadow' && r() < 0.4) { g.fillStyle = r() < 0.5 ? '#f8f8f8' : '#f8d000'; g.fillRect(x + 2, y - 3 * sz - 1, 2, 2); }
        if (themeName === 'forest' && r() < 0.25) { g.fillStyle = '#d83020'; g.fillRect(x, y - 3, 4, 2); g.fillStyle = '#f8f0d8'; g.fillRect(x + 1, y - 1, 2, 2); }
      } else if (themeName === 'coast') { g.fillStyle = r() < 0.5 ? '#fcf0e0' : '#e8b8a0'; g.fillRect(x, y, 2 * sz, sz); }
      else if (themeName === 'ice') { g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(x, y, 6 * sz, 0.6); g.fillRect(x + 3 * sz, y, 0.6, 2 * sz); }
      else { g.fillStyle = shade(th.floor, -0.35); g.fillRect(x, y, 3 * sz, 2 * sz); g.fillStyle = shade(th.floor, 0.3); g.fillRect(x, y, 3 * sz, 0.6); }
    }
  }
  // vignet
  const vg = g.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, W * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.35)');
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
  return c;
}

// Levende detaljer, der tegnes hver frame oven på baggrunden
const AMB = Array.from({ length: 24 }, (_, i) => { const r = rng(500 + i * 31); return [r(), r(), r(), r()]; });
export function ambient(ctx, theme, t) {
  if (theme === 'tower') {
    for (const tx of [42, 212]) {
      const f = Math.sin(t * 13 + tx) * 1.2;
      glow(ctx, tx, 64, 26 + f * 2, 'rgba(248,140,40,.35)');
      ctx.fillStyle = '#e45c10'; ctx.fillRect(tx - 3, 60 + f, 6, 9); ctx.fillStyle = '#f8d000'; ctx.fillRect(tx - 1, 63 + f, 2, 5);
    }
    for (const [a, b, c] of AMB.slice(0, 10)) { const y = 140 - ((t * (10 + c * 14) + b * 140) % 140); ctx.fillStyle = `rgba(248,${120 + c * 100 | 0},40,${y / 140})`; ctx.fillRect((a * W + Math.sin(t + b * 9) * 6), y, 1, 1); }
  } else if (theme === 'forest') {
    for (const [a, b, c] of AMB.slice(0, 12)) {
      const x = a * W + Math.sin(t * 0.7 + b * 10) * 14, y = 70 + b * 80 + Math.cos(t * 0.9 + c * 8) * 8, on = 0.5 + 0.5 * Math.sin(t * 3 + c * 20);
      glow(ctx, x, y, 5, `rgba(200,255,120,${0.45 * on})`); ctx.fillStyle = `rgba(230,255,160,${on})`; ctx.fillRect(x, y, 1, 1);
    }
  } else if (theme === 'ice') {
    for (const [a, b, c] of AMB) { const y = (t * (8 + c * 10) + b * H) % H, x = (a * W + Math.sin(t + b * 7) * 8) % W; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(x, y, c < 0.3 ? 2 : 1, c < 0.3 ? 2 : 1); }
  } else if (theme === 'coast') {
    for (const [a, b] of AMB.slice(0, 12)) { const on = Math.sin(t * 2 + a * 30) > 0.6; if (on) { ctx.fillStyle = '#fcfcfc'; ctx.fillRect(a * W, 103 + b * 26, 2, 1); } }
  } else if (theme === 'meadow') {
    for (const [a, b, c] of AMB.slice(0, 6)) {
      const x = (a * W + t * (6 + c * 6)) % W, y = 120 + b * 40 + Math.sin(t * 3 + c * 9) * 6, fl = Math.sin(t * 14 + a * 20) > 0;
      ctx.fillStyle = c < 0.5 ? '#f8f8f8' : '#f8d000'; ctx.fillRect(x - (fl ? 2 : 1), y, fl ? 2 : 1, 1); ctx.fillRect(x + 1, y, fl ? 2 : 1, 1);
    }
  } else if (theme === 'mountain') {
    for (const [a, b, c] of AMB.slice(0, 8)) { const x = (a * W - t * (12 + c * 10) + W * 4) % W, y = 40 + b * 60; ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(x, y, 30 + c * 30, 2); }
  }
}
