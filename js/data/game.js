// Områder, monstre, udstyr og evner.

const NODE_TYPES = ['battle', 'battle', 'puzzle', 'village', 'battle', 'puzzle', 'battle', 'boss'];
const LAYOUTS = [
  [[2, 10], [5, 10], [8, 8], [12, 9], [13, 5], [9, 4], [5, 5], [2, 2]],
  [[13, 10], [10, 10], [7, 8], [3, 9], [2, 5], [6, 4], [10, 5], [13, 2]],
  [[1, 6], [4, 9], [7, 10], [10, 8], [13, 10], [13, 5], [9, 3], [5, 2]],
  [[3, 11], [6, 10], [9, 10], [12, 9], [12, 6], [8, 6], [4, 5], [7, 2]],
  [[14, 6], [11, 9], [8, 10], [5, 8], [2, 10], [2, 5], [6, 3], [10, 2]],
  [[7, 11], [4, 9], [7, 8], [11, 8], [11, 5], [7, 5], [4, 4], [7, 1]],
];

// Skattekister: hver lås er en staveopgave (se quiz.js)
const CHESTS = [
  { after: 1, name: 'Egetræskisten', locks: ['wheel', 'vowel'] },
  { after: 5, name: 'Jernkisten', locks: ['wheel', 'sieve', 'vowel'] },
];
export const LOCK_NAMES = {
  wheel: '🔒 Bogstavhjul-låsen',
  vowel: '🔒 Vokal-låsen',
  sieve: '🔒 Sandhedens lås',
};

export const CHAPTERS = [
  {
    name: 'Engdalen', theme: 'meadow', focus: 'e, æ og i', shard: 'Æ-splinten',
    village: 'Bondebyen', npc: 'Bonden Bent',
    monsters: ['slim', 'vildsvin', 'flagermus'],
    boss: { key: 'tornetrold', drop: 'tornekrone' },
  },
  {
    name: 'Skyggeskoven', theme: 'forest', focus: 'ø, y og u', shard: 'Ø-splinten',
    village: 'Skovhytten', npc: 'Skovfoged Sigrid',
    monsters: ['spøgelse', 'ulv', 'skovflagermus'],
    boss: { key: 'ylva', drop: 'heksehat' },
  },
  {
    name: 'Kysten', theme: 'coast', focus: 'å og o', shard: 'Å-splinten',
    village: 'Havnebyen', npc: 'Kaptajn Knud',
    monsters: ['krabbe', 'blæksprutte', 'skelet'],
    boss: { key: 'søorm', drop: 'søormskappe' },
  },
  {
    name: 'Bjergene', theme: 'mountain', focus: 'stumme bogstaver (hv, hj, d, g, v)', shard: 'Stilhedens splint',
    village: 'Bjerghytten', npc: 'Minearbejder Mette',
    monsters: ['stengolem', 'bjergtrold', 'klippeslim'],
    boss: { key: 'grum', drop: 'stenhjelm' },
  },
  {
    name: 'Isslottet', theme: 'ice', focus: 'nutids-r og dobbelte konsonanter', shard: 'Tidens splint',
    village: 'Isfiskerlejet', npc: 'Isfisker Ib',
    monsters: ['snemand', 'isulv', 'frostånd'],
    boss: { key: 'frost', drop: 'iskrone' },
  },
  {
    name: 'Vrøvls Tårn', theme: 'tower', focus: 'engelske fælder (c/k, w/v, ph/f, x/ks)', shard: 'Sprogenes splint',
    village: 'Tårnets kælder', npc: 'Bibliotekar Bodil',
    monsters: ['skyggeridder', 'blækdæmon', 'vrøvlslim'],
    boss: { key: 'vrøvl', drop: 'guldkrone', phases: ['vrøvl', 'skyggevrøvl'] },
  },
];
CHAPTERS.forEach((c, i) => {
  c.nodes = NODE_TYPES.map((type, j) => ({ type, x: LAYOUTS[i][j][0], y: LAYOUTS[i][j][1] }));
  // Låste skattekister ved siden af stien. after = det sted, der skal klares først.
  c.chests = CHESTS.map(k => ({ ...k }));
});

// Monstre: sprite + palet (m = hovedfarve, l = lys, q = mørk, x = ekstra)
export const MONSTERS = {
  slim:          { name: 'Grønt Slim',   spr: 'slime',    pal: { m: '#58d854', l: '#b8f818', q: '#00a800' } },
  vildsvin:      { name: 'Engbæst',     spr: 'beast',    pal: { m: '#ac7c00', l: '#fcbcb0', q: '#503000' } },
  flagermus:     { name: 'Flagermus',    spr: 'bat',      pal: { m: '#6844fc', l: '#9878f8', q: '#2000a8' } },
  tornetrold:    { name: 'Tornetrolden', spr: 'troll',    pal: { m: '#00a800', l: '#ac7c00', q: '#005800' }, boss: true },

  spøgelse:      { name: 'Spøgelse',     spr: 'ghost',    pal: { m: '#d8f8f8', l: '#fcfcfc', q: '#7c7c7c' } },
  ulv:           { name: 'Skyggeulv',    spr: 'beast',    pal: { m: '#7c7c7c', l: '#bcbcbc', q: '#404040' } },
  skovflagermus: { name: 'Mosflagermus', spr: 'bat',      pal: { m: '#00a800', l: '#58d854', q: '#005800' } },
  ylva:          { name: 'Heksen Ylva',  spr: 'wizard',   pal: { m: '#005800', l: '#f8b800', x: '#7c7c7c', s: '#b8f818' }, boss: true },

  krabbe:        { name: 'Kæmpekrabbe',  spr: 'crab',     pal: { m: '#d82800', l: '#f87858', q: '#881400' } },
  blæksprutte:   { name: 'Blæksprutte',  spr: 'octopus',  pal: { m: '#d800cc', l: '#f878f8', q: '#940084' } },
  skelet:        { name: 'Piratskelet',  spr: 'skeleton', pal: { m: '#fce0a8', l: '#fcfcfc', q: '#ac7c00' } },
  søorm:         { name: 'Søormen',      spr: 'dragon',   pal: { m: '#00a8a8', l: '#58f898', q: '#005858' }, boss: true },

  stengolem:     { name: 'Stengolem',    spr: 'golem',    pal: { m: '#7c7c7c', l: '#3cbcfc', q: '#404040' } },
  bjergtrold:    { name: 'Bjergtrold',   spr: 'troll',    pal: { m: '#887000', l: '#7c7c7c', q: '#503000' } },
  klippeslim:    { name: 'Klippeslim',   spr: 'slime',    pal: { m: '#bcbcbc', l: '#fcfcfc', q: '#7c7c7c' } },
  grum:          { name: 'Stenkæmpen Grum', spr: 'golem', pal: { m: '#503000', l: '#f8b800', q: '#201000' }, boss: true },

  snemand:       { name: 'Ond Snemand',  spr: 'snowman',  pal: { m: '#fcfcfc', l: '#3cbcfc', q: '#a4e4fc' } },
  isulv:         { name: 'Isulv',        spr: 'beast',    pal: { m: '#a4e4fc', l: '#fcfcfc', q: '#3cbcfc' } },
  frostånd:      { name: 'Frostånd',     spr: 'ghost',    pal: { m: '#3cbcfc', l: '#a4e4fc', q: '#0058f8' } },
  frost:         { name: 'Isdragen Frost', spr: 'dragon', pal: { m: '#a4e4fc', l: '#fcfcfc', q: '#0058f8' }, boss: true },

  skyggeridder:  { name: 'Skyggeridder', spr: 'skeleton', pal: { m: '#404040', l: '#7c7c7c', q: '#000000' } },
  blækdæmon:     { name: 'Blækdæmon',    spr: 'octopus',  pal: { m: '#2000a8', l: '#6844fc', q: '#000058' } },
  vrøvlslim:     { name: 'Vrøvlslim',    spr: 'slime',    pal: { m: '#d800cc', l: '#f878f8', q: '#940084' } },
  vrøvl:         { name: 'Mester Vrøvl', spr: 'wizard',   pal: { m: '#940084', l: '#f8b800', x: '#fcfcfc' }, boss: true },
  skyggevrøvl:   { name: 'Skygge-Vrøvl', spr: 'wizard',   pal: { m: '#201030', l: '#d82800', x: '#7c7c7c', s: '#6844fc' }, boss: true },

  dukke:         { name: 'Træningsdukke', spr: 'golem',   pal: { m: '#ac7c00', l: '#f8b800', q: '#503000' } },
};

// Monsterstyrke pr. område
export const MON_HP = [12, 22, 34, 48, 62, 78];
export const MON_DMG = [3, 5, 7, 9, 11, 13];

// Udstyr. slot: weapon | shield | tunic | hat | cape | pet | use
export const ITEMS = {
  // Våben
  træsværd:     { slot: 'weapon', name: 'Træsværd',     atk: 1,  price: 0,    ch: 0, look: { kind: 'sword', M: '#ac7c00' } },
  jernsværd:    { slot: 'weapon', name: 'Jernsværd',    atk: 3,  price: 60,   ch: 0, look: { kind: 'sword', M: '#bcbcbc' } },
  stålsværd:    { slot: 'weapon', name: 'Stålsværd',    atk: 5,  price: 180,  ch: 1, look: { kind: 'sword', M: '#fcfcfc' } },
  krystalsværd: { slot: 'weapon', name: 'Krystalsværd', atk: 8,  price: 400,  ch: 2, look: { kind: 'sword', M: '#3cbcfc' } },
  runesværd:    { slot: 'weapon', name: 'Runesværd',    atk: 12, price: 800,  ch: 3, look: { kind: 'sword', M: '#f8b800' } },
  dragesværd:   { slot: 'weapon', name: 'Dragesværd',   atk: 16, price: 1300, ch: 4, look: { kind: 'sword', M: '#d82800' } },
  vrøvlstav:    { slot: 'weapon', name: 'Valdemars stav', atk: 20, price: 0,  ch: 9, drop: true, look: { kind: 'staff' } },
  // Skjolde
  træskjold:    { slot: 'shield', name: 'Træskjold',    def: 1, price: 40,  ch: 0, look: { S: '#ac7c00' } },
  jernskjold:   { slot: 'shield', name: 'Jernskjold',   def: 2, price: 150, ch: 1, look: { S: '#7c7c7c' } },
  ridderskjold: { slot: 'shield', name: 'Ridderskjold', def: 3, price: 350, ch: 2, look: { S: '#0058f8' } },
  drageskjold:  { slot: 'shield', name: 'Drageskjold',  def: 5, price: 700, ch: 4, look: { S: '#d82800' } },
  // Dragter (kosmetisk)
  dragt_blå:    { slot: 'tunic', name: 'Blå dragt',   price: 0,   ch: 0, look: { T: '#3cbcfc', t: '#0058f8' } },
  dragt_grøn:   { slot: 'tunic', name: 'Grøn dragt',  price: 0,   ch: 0, look: { T: '#58d854', t: '#00a800' } },
  dragt_rød:    { slot: 'tunic', name: 'Rød dragt',   price: 0,   ch: 0, look: { T: '#f87858', t: '#a81000' } },
  dragt_lilla:  { slot: 'tunic', name: 'Lilla dragt', price: 80,  ch: 0, look: { T: '#d8a0fc', t: '#8000c0' } },
  dragt_sort:   { slot: 'tunic', name: 'Ninjadragt',  price: 150, ch: 1, look: { T: '#404040', t: '#000000' } },
  dragt_hvid:   { slot: 'tunic', name: 'Snedragt',    price: 150, ch: 2, look: { T: '#fcfcfc', t: '#a4e4fc' } },
  dragt_guld:   { slot: 'tunic', name: 'Gulddragt',   price: 400, ch: 3, look: { T: '#f8b800', t: '#ac7c00' } },
  // Hatte
  hue_rød:      { slot: 'hat', name: 'Rød hue',        price: 60,  ch: 0, look: { kind: 'cap', R: '#d82800' } },
  hue_blå:      { slot: 'hat', name: 'Blå hue',        price: 60,  ch: 0, look: { kind: 'cap', R: '#0058f8' } },
  ridderhjelm:  { slot: 'hat', name: 'Ridderhjelm',    price: 150, ch: 1, look: { kind: 'helm', A: '#bcbcbc' } },
  vikinghjelm:  { slot: 'hat', name: 'Vikinghjelm',    price: 220, ch: 2, look: { kind: 'viking' } },
  troldhat:     { slot: 'hat', name: 'Troldmandshat',  price: 300, ch: 3, look: { kind: 'wizard', P: '#6844fc' } },
  tornekrone:   { slot: 'hat', name: 'Tornekrone',     price: 0, drop: true, look: { kind: 'crown', y: '#58d854', r: '#d82800', B: '#00a800' } },
  heksehat:     { slot: 'hat', name: 'Heksehat',       price: 0, drop: true, look: { kind: 'wizard', P: '#005800', y: '#b8f818' } },
  stenhjelm:    { slot: 'hat', name: 'Stenhjelm',      price: 0, drop: true, look: { kind: 'helm', A: '#7c7c7c' } },
  iskrone:      { slot: 'hat', name: 'Iskrone',        price: 0, drop: true, look: { kind: 'crown', y: '#a4e4fc', r: '#3cbcfc', B: '#fcfcfc' } },
  guldkrone:    { slot: 'hat', name: 'Ordridderens krone', price: 0, drop: true, look: { kind: 'crown' } },
  // Kapper
  kappe_rød:    { slot: 'cape', name: 'Rød kappe',    price: 100, ch: 0, look: { c: '#d82800' } },
  kappe_blå:    { slot: 'cape', name: 'Blå kappe',    price: 100, ch: 1, look: { c: '#0058f8' } },
  kappe_sort:   { slot: 'cape', name: 'Natkappe',     price: 200, ch: 2, look: { c: '#201030' } },
  søormskappe:  { slot: 'cape', name: 'Søormskappe',  price: 0, drop: true, look: { c: '#00a8a8' } },
  kappe_guld:   { slot: 'cape', name: 'Guldkappe',    price: 500, ch: 4, look: { c: '#f8b800' } },
  // Kæledyr: dmg = ekstra skade ved rigtige svar
  kat:          { slot: 'pet', name: 'Katten Mis',    price: 200, ch: 0, dmg: 1, look: { kind: 'cat', m: '#f8b800' }, desc: 'Kradser med (+1 skade)' },
  ugleunge:     { slot: 'pet', name: 'Ugleungen Ulf', price: 350, ch: 1, dmg: 1, hint: 1, look: { kind: 'owlet', m: '#ac7c00', l: '#fce0a8' }, desc: '+1 skade og +1 fjer pr. kamp' },
  slimven:      { slot: 'pet', name: 'Slimvennen Sus', price: 300, ch: 2, dmg: 2, look: { kind: 'slimepet', m: '#3cbcfc', l: '#a4e4fc', q: '#0058f8' }, desc: 'Hopper på fjenden (+2 skade)' },
  drageunge:    { slot: 'pet', name: 'Drageungen Dino', price: 700, ch: 3, dmg: 4, look: { kind: 'dragonet', m: '#d82800', l: '#f8b800' }, desc: 'Spytter ild (+4 skade)' },
  // Forbrug
  drik:         { slot: 'use', name: 'Lille livsdrik', price: 15, ch: 0, heal: 15, desc: 'Giver 15 liv' },
  stordrik:     { slot: 'use', name: 'Stor livsdrik',  price: 45, ch: 2, heal: 999, desc: 'Fylder livet helt op' },
  fjer:         { slot: 'use', name: 'Ugle-fjer',      price: 8,  ch: 0, desc: 'Et hint i kamp' },
  magidrik:     { slot: 'use', name: 'Energidrik',     price: 30, ch: 1, mana: 99, desc: 'Fylder livsenergien helt op' },
  energikrystal: { slot: 'use', name: 'Livskrystal',   price: 0, drop: true, desc: '+1 maks livsenergi for altid' },
};

// kind: sword (sværdteknik) | magic (magi). mp = livsenergi det koster.
export const ABILITIES = [
  { id: 'hug',     kind: 'sword', name: 'Sværdhug',    lvl: 1,  mp: 0, q: 'hug',      mult: 1,   icon: '⚔️', desc: 'Vælg det rigtige bogstav. Giver +1 ekstra livsenergi.' },
  { id: 'dobbelt', kind: 'sword', name: 'Dobbelthug',  lvl: 2,  mp: 1, q: 'hug',      mult: 0.9, multi: 2, icon: '🗡️', desc: 'To bogstaver i træk → to lynhurtige hug.' },
  { id: 'heal',    kind: 'magic', name: 'Helbred',     lvl: 2,  mp: 3, q: 'type',     heal: 0.5, icon: '💚', desc: 'Skriv ordet → få halvdelen af dit liv tilbage.' },
  { id: 'fire',    kind: 'magic', name: 'Ildkugle',    lvl: 3,  mp: 2, q: 'type',     mult: 2.2, icon: '🔥', desc: 'Skriv hele ordet → dobbelt skade.' },
  { id: 'hvirvel', kind: 'sword', name: 'Hvirvelhug',  lvl: 4,  mp: 2, q: 'scramble', mult: 2.2, icon: '🌀', desc: 'Sæt bogstaverne i rækkefølge → en snurrende hvirvel.' },
  { id: 'frost',   kind: 'magic', name: 'Frostskjold', lvl: 5,  mp: 2, q: 'pick',     mult: 0.6, shield: 2, icon: '🛡️', desc: 'Find den rigtige stavning → blokér de næste 2 angreb.' },
  { id: 'modhug',  kind: 'sword', name: 'Modhug',      lvl: 6,  mp: 2, q: 'pick',     mult: 0.8, counter: true, icon: '↩️', desc: 'Find den rigtige stavning → næste angreb slås tilbage mod fjenden.' },
  { id: 'bolt',    kind: 'magic', name: 'Lynkæde',     lvl: 7,  mp: 4, q: 'fix',      mult: 3.5, icon: '⚡', desc: 'Ret Vrøvls stavefejl → kæmpe skade.' },
  { id: 'rune',    kind: 'sword', name: 'Runeklinge',  lvl: 8,  mp: 3, q: 'wheel',    mult: 3,   icon: '🔱', desc: 'Drej bogstavhjulene → klingen gløder af runekraft.' },
  { id: 'stars',   kind: 'magic', name: 'Stjerneregn', lvl: 10, mp: 6, q: 'type',     mult: 1.8, multi: 3, icon: '🌟', desc: 'Skriv 3 ord i træk → tre stjerneslag.' },
  { id: 'storm',   kind: 'sword', name: 'Ordstorm',    lvl: 11, mp: 5, q: 'sieve',    mult: 4.2, icon: '🌪️', desc: 'Find alle de rigtigt stavede ord → et stormhug.' },
];

// Livsenergi: 4 + halvdelen af niveauet + én pr. splint + livskrystaller fra kister
export function shardCount(save) {
  return CHAPTERS.filter((c, i) => save.done && save.done[i + '-' + (c.nodes.length - 1)]).length;
}

export function xpToNext(lvl) { return 40 + 30 * lvl; }

export function heroStats(save) {
  const l = save.lvl;
  const w = ITEMS[save.look.weapon], s = save.look.shield ? ITEMS[save.look.shield] : null;
  const pet = save.look.pet ? ITEMS[save.look.pet] : null;
  return {
    maxHp: 20 + 4 * l,
    maxMp: 4 + Math.floor(l / 2) + shardCount(save) + (save.bonusMp || 0),
    atk: 2 + l + (w ? w.atk : 0),
    def: s ? s.def : 0,
    petDmg: pet ? pet.dmg : 0,
    petHint: pet && pet.hint ? pet.hint : 0,
  };
}
