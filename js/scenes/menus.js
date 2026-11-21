import { h, btn, setPanel, hud, toast, bigCanvas, modal } from '../ui.js';
import { save, persist, wipe, exportCode, importCode, today } from '../state.js';
import { sfx, speak, setAudioPrefs, setRate, voiceName, hasVoice, music } from '../audio.js';
import { ITEMS, CHAPTERS, ABILITIES, heroStats, xpToNext } from '../data/game.js';
import { WORDS, mastery, customWords } from '../learn.js';
import { heroCanvas, petCanvas, sprite } from '../gfx.js';
import { sayWord } from '../quiz.js';
import { startTraining, toTitle } from '../flow.js';

const SLOTS = [
  ['weapon', '⚔️ Våben'], ['shield', '🛡️ Skjolde'], ['tunic', '👕 Dragter'], ['hat', '🎩 Hatte'],
  ['cape', '🧣 Kapper'], ['pet', '🐾 Kæledyr'], ['use', '🧪 Ting'],
];
const REMOVABLE = ['shield', 'hat', 'cape', 'pet'];

function statLine(it) {
  if (it.atk) return '+' + it.atk + ' angreb';
  if (it.def) return '+' + it.def + ' forsvar';
  if (it.desc) return it.desc;
  return 'Kosmetik';
}

function preview(look) {
  const wrap = h('div', { class: 'preview' });
  wrap.append(bigCanvas(heroCanvas(look), 3));
  if (look.pet) { const pc = petCanvas(look.pet); if (pc) wrap.append(bigCanvas(pc, 4)); }
  return wrap;
}

function tabs(cur, onPick, slots = SLOTS) {
  return h('div', { class: 'tabs' }, slots.map(([k, label]) => h('button', { class: 'tab' + (k === cur ? ' on' : ''), onclick: () => { sfx('select'); onPick(k); } }, label)));
}

export function shopScreen(ch, onBack, onPreview, slot = 'weapon') {
  const render = (sel = null) => {
    const look = sel ? { ...save.look, [ITEMS[sel].slot]: sel } : save.look;
    onPreview && onPreview(sel && ITEMS[sel].slot !== 'use' ? look : null);
    const list = Object.entries(ITEMS).filter(([, it]) => it.slot === slot && !it.drop && (it.ch || 0) <= ch);
    setPanel(
      h('div', { class: 'row between' }, h('div', { class: 'area-name' }, '🛒 Butik'), h('div', { class: 'gold' }, '🪙 ' + save.gold)),
      tabs(slot, k => { slot = k; render(); }),
      h('div', { class: 'items' }, list.map(([id, it]) => {
        const owned = it.slot !== 'use' && save.owned.includes(id);
        const worn = save.look[it.slot] === id;
        const afford = save.gold >= it.price;
        return h('div', { class: 'item' + (sel === id ? ' sel' : '') + (owned ? ' owned' : ''), onclick: () => { sfx('select'); render(id); } },
          h('div', { class: 'grow' }, h('b', {}, it.name), h('small', {}, statLine(it) + (it.slot === 'use' ? ` · har ${save.inv[id] || 0}` : ''))),
          owned ? (worn ? h('span', { class: 'tag' }, 'På') : h('button', { class: 'btn small', onclick: e => { e.stopPropagation(); wear(id); } }, 'Tag på')) :
            h('button', { class: 'btn small ' + (afford ? 'primary' : ''), disabled: afford ? null : true, onclick: e => { e.stopPropagation(); buy(id); } }, '🪙 ' + it.price),
        );
      })),
      btn('◀ Tilbage', () => { onPreview && onPreview(null); onBack(); }, 'small'),
    );
  };
  const buy = id => {
    const it = ITEMS[id];
    if (save.gold < it.price) return;
    save.gold -= it.price;
    if (it.slot === 'use') save.inv[id] = (save.inv[id] || 0) + 1;
    else { save.owned.push(id); save.look[it.slot] = id; }
    sfx('coin'); persist(); hud({ noMenu: true });
    toast('Købt: ' + it.name);
    render(it.slot === 'use' ? null : id);
  };
  const wear = id => { save.look[ITEMS[id].slot] = id; persist(); sfx('select'); render(id); };
  render();
}

export function equipScreen(onBack, onPreview, slot = 'weapon') {
  const render = () => {
    onPreview && onPreview(null);
    const st = heroStats(save);
    const list = save.owned.filter(id => ITEMS[id] && ITEMS[id].slot === slot);
    setPanel(
      h('div', { class: 'row between' }, h('div', { class: 'area-name' }, '👕 Udstyr'), h('div', { class: 'small' }, `⚔️ ${st.atk}  🛡️ ${st.def}  ❤️ ${st.maxHp}  ✨ ${st.maxMp}`)),
      preview(save.look),
      tabs(slot, k => { slot = k; render(); }, SLOTS.filter(s => s[0] !== 'use')),
      h('div', { class: 'items' },
        REMOVABLE.includes(slot) ? h('div', { class: 'item' + (!save.look[slot] ? ' sel' : ''), onclick: () => { save.look[slot] = null; persist(); render(); } }, h('div', { class: 'grow' }, h('b', {}, 'Ingen'))) : null,
        list.length ? list.map(id => h('div', { class: 'item' + (save.look[slot] === id ? ' sel' : ''), onclick: () => { sfx('select'); save.look[slot] = id; persist(); render(); } },
          h('div', { class: 'grow' }, h('b', {}, ITEMS[id].name), h('small', {}, statLine(ITEMS[id]))), save.look[slot] === id ? h('span', { class: 'tag' }, 'På') : null)) :
          h('p', { class: 'dim center small' }, 'Du har ikke noget her endnu. Køb i landsbyens butik eller find det i skattekister!'),
      ),
      btn('◀ Tilbage', onBack, 'small'),
    );
  };
  render();
}

export function menuScreen(onBack) {
  const st = heroStats(save);
  setPanel(
    h('div', { class: 'row between' }, h('div', { class: 'area-name' }, save.name), h('div', { class: 'small' }, `Nv. ${save.lvl} · ${save.xp}/${xpToNext(save.lvl)} XP`)),
    h('div', { class: 'menu-grid' },
      btn('👕 Udstyr', () => equipScreen(() => menuScreen(onBack)), 'act'),
      btn('📖 Ordbog', () => wordBook(() => menuScreen(onBack)), 'act'),
      btn('✨ Magi', () => abilityList(() => menuScreen(onBack)), 'act'),
      btn('🗼 Træning', () => startTraining(), 'act'),
      btn('⚙️ Indstillinger', () => settings(() => menuScreen(onBack)), 'act'),
      btn('👪 Forældre', () => parents(() => menuScreen(onBack)), 'act'),
    ),
    h('div', { class: 'small dim center' }, `⚔️ ${st.atk} angreb · 🛡️ ${st.def} forsvar · 🧪 ${save.inv.drik || 0} drikke · 🪶 ${save.inv.fjer || 0} fjer`),
    btn('◀ Tilbage til kortet', onBack, 'small'),
  );
}

function abilityList(onBack) {
  setPanel(
    h('div', { class: 'area-name' }, '✨ Magi'),
    h('div', { class: 'ab-list' }, ABILITIES.map(a => h('div', { class: 'ab' + (a.lvl <= save.lvl ? '' : ' off') },
      h('span', { class: 'ab-ico' }, a.lvl <= save.lvl ? a.icon : '🔒'),
      h('span', { class: 'ab-txt' }, h('b', {}, a.name + (a.lvl > save.lvl ? ` (Nv. ${a.lvl})` : '')), h('small', {}, a.desc)),
      h('span', { class: 'ab-mp' }, a.mp ? a.mp + '✨' : '')))),
    btn('◀ Tilbage', onBack, 'small'),
  );
}

const stars = b => '★'.repeat(b) + '☆'.repeat(5 - b);

function wordBook(onBack, ch = Math.min(save.ch, CHAPTERS.length - 1)) {
  const chs = CHAPTERS.map((c, i) => [i, c.name]).filter(([i]) => i <= save.ch);
  const list = ch === 'c' ? customWords() : WORDS[ch];
  const m = ch === 'c' ? null : mastery(ch);
  setPanel(
    h('div', { class: 'area-name' }, '📖 Ordbog'),
    h('div', { class: 'tabs' }, chs.map(([i, n]) => h('button', { class: 'tab' + (i === ch ? ' on' : ''), onclick: () => wordBook(onBack, i) }, n)),
      save.custom.length ? h('button', { class: 'tab' + (ch === 'c' ? ' on' : ''), onclick: () => wordBook(onBack, 'c') }, 'Egne ord') : null),
    m ? h('div', { class: 'small center' }, `${m.solid} af ${m.total} ord sidder fast (3+ stjerner)`) : null,
    h('div', { class: 'wordlist' }, list.map(w => {
      const s = save.words[w.id];
      return h('button', { class: 'wl' + (s ? (s.b >= 3 ? ' gold' : '') : ' unseen'), onclick: () => sayWord(w) },
        h('span', {}, s ? w.word : '???'), h('span', { class: 'st' }, s ? stars(s.b) : ''));
    })),
    h('p', { class: 'small dim' }, 'Stjerner: hver gang du staver ordet rigtigt uden hjælp, får det en stjerne, og det kommer igen senere (1, 3, 7, 14, 30 dage). Staver du forkert, starter det forfra.'),
    btn('◀ Tilbage', onBack, 'small'),
  );
}

function toggle(label, key, after) {
  return h('label', { class: 'toggle' }, h('input', { type: 'checkbox', checked: save.settings[key] ? true : null, onchange: e => { save.settings[key] = e.target.checked; persist(); after && after(); } }), h('span', {}, label));
}

function settings(onBack) {
  const vn = voiceName();
  const rate = h('input', { type: 'range', min: '0.6', max: '1.1', step: '0.05', value: String(save.settings.rate), oninput: e => { save.settings.rate = Number(e.target.value); setRate(save.settings.rate); persist(); } });
  setPanel(
    h('div', { class: 'area-name' }, '⚙️ Indstillinger'),
    toggle('🎵 Musik', 'music', () => setAudioPrefs({ music: save.settings.music })),
    toggle('🔔 Lydeffekter', 'sfx', () => setAudioPrefs({ sfx: save.settings.sfx })),
    toggle('🗣️ Dansk oplæsning af ord', 'voice'),
    toggle('📜 Læs historien højt', 'readStory'),
    h('div', { class: 'setting' }, h('span', {}, '🐢 Talehastighed 🐇'), rate),
    h('div', { class: 'voice-status ' + (vn ? 'ok' : 'bad') }, vn ? `✓ Dansk stemme fundet: ${vn}` : '✗ Ingen dansk stemme fundet. Ordene vises kort i stedet. (Se Forældre-siden for hjælp.)'),
    btn('🔊 Test stemmen', () => { if (!speak(['søster', 'Min søster hedder Ida.'])) toast('Ingen dansk stemme'); }, 'small'),
    btn('◀ Tilbage', onBack, 'small'),
  );
}

function parents(onBack) {
  const s = save.stats;
  const days = Object.keys(s.days).sort();
  let streak = 0; { const d = new Date(); if (!s.days[localKey(d)]) d.setDate(d.getDate() - 1); while (s.days[localKey(d)]) { streak++; d.setDate(d.getDate() - 1); } }
  const last7 = []; { const d = new Date(); for (let i = 0; i < 7; i++) { const k = localKey(d); last7.unshift([k.slice(5), s.days[k] || { n: 0, c: 0 }]); d.setDate(d.getDate() - 1); } }
  const all = WORDS.flat().concat(customWords());
  const hard = all.map(w => [w, save.words[w.id]]).filter(([, st]) => st && st.x > 0).sort((a, b) => (b[1].x - b[1].c * 0.3) - (a[1].x - a[1].c * 0.3)).slice(0, 12);
  const max7 = Math.max(10, ...last7.map(([, d]) => d.n));
  const ta = h('textarea', { rows: '6', placeholder: 'Ét ord pr. linje. Valgfrit: ord;sætning med ___\nfx:\nskyld;Det er ikke din ___.\nhjørne;Bolden ligger i ___.' });
  ta.value = save.custom.join('\n');
  const vn = voiceName();
  setPanel(
    h('div', { class: 'area-name' }, '👪 Forældre'),
    h('div', { class: 'sumgrid' },
      h('div', {}, 'Svar i alt'), h('b', {}, String(s.answers)),
      h('div', {}, 'Rigtige'), h('b', {}, s.answers ? Math.round(100 * s.correct / s.answers) + '%' : '–'),
      h('div', {}, 'Dage med øvning'), h('b', {}, String(days.length)),
      h('div', {}, 'Dage i træk'), h('b', {}, String(streak)),
    ),
    h('div', { class: 'label' }, 'Sidste 7 dage (antal svar · grøn = rigtige)'),
    h('div', { class: 'chart7' }, last7.map(([d, v]) => h('div', { class: 'c7' },
      h('div', { class: 'c7bar' }, h('i', { style: `height:${Math.round(100 * v.n / max7)}%` }, h('b', { style: `height:${v.n ? Math.round(100 * v.c / v.n) : 0}%` }))),
      h('small', {}, d), h('small', {}, String(v.n))))),
    h('div', { class: 'label' }, 'Mestring pr. område (⭐ = ord med 3+ stjerner)'),
    h('div', { class: 'mlist' }, CHAPTERS.map((c, i) => { const m = mastery(i); return h('div', { class: 'mrow' }, h('span', {}, c.name, h('small', {}, ' · ' + c.focus)),
      h('div', { class: 'mbar' }, h('i', { style: `width:${Math.round(100 * m.solid / m.total)}%` }), h('b', { style: `width:${Math.round(100 * m.seen / m.total)}%` })), h('small', {}, `${m.solid}/${m.total}`)); })),
    h('div', { class: 'label' }, 'Sværeste ord lige nu'),
    hard.length ? h('div', { class: 'hardlist' }, hard.map(([w, st]) => h('span', { class: 'hw' }, w.word, h('small', {}, ` ✗${st.x} ✓${st.c}`)))) : h('p', { class: 'small dim' }, 'Ingen fejl endnu.'),
    h('div', { class: 'label' }, 'Egne ord (fx ugens stavelisten fra skolen)'),
    h('p', { class: 'small dim' }, 'Ordene blandes ind i kampene og Træningstårnet.'),
    ta,
    btn('Gem egne ord', () => { save.custom = cleanCustom(ta.value); ta.value = save.custom.join('\n'); persist(); toast(`Gemt: ${save.custom.length} ord`); }, 'primary small'),
    h('div', { class: 'label' }, 'Dansk oplæsning'),
    h('p', { class: 'small' }, vn ? `Stemme: ${vn}. ` : 'Ingen dansk stemme fundet. ', 'På iPhone: Indstillinger → Tilgængelighed → Oplæst indhold → Stemmer → Dansk → hent "Sara (forbedret)". Genstart derefter spillet.'),
    h('div', { class: 'label' }, 'Sikkerhedskopi'),
    h('p', { class: 'small dim' }, 'Safari kan slette data fra hjemmesider, der ikke bruges i 7 dage. Føj spillet til hjemmeskærmen, og gem en kode her en gang imellem.'),
    h('div', { class: 'row' },
      btn('📋 Kopiér gemmekode', async () => { const c = exportCode(); try { await navigator.clipboard.writeText(c); toast('Kopieret!'); } catch (e) { prompt('Kopiér koden:', c); } }, 'small grow'),
      btn('📥 Indlæs kode', () => { const c = prompt('Indsæt gemmekoden:'); if (!c) return; try { importCode(c); toast('Indlæst!'); toTitle(); } catch (e) { toast('Ugyldig kode'); } }, 'small grow'),
    ),
    btn('🗑️ Slet alt og start forfra', () => { if (confirm('Slet ALT fremskridt? Dette kan ikke fortrydes.')) { wipe(); location.reload(); } }, 'small danger'),
    btn('◀ Tilbage', onBack, 'small'),
  );
}

// "ord;sætning" pr. linje. Ordet må have [ ] for at markere den svære del, fx sk[y]ld
function cleanCustom(text) {
  return text.split('\n').map(line => {
    const [w, ...rest] = line.trim().split(';');
    const word = (w || '').toLowerCase().replace(/[^a-zæøåé\[\]|-]/g, '');
    if (!word.replace(/[\[\]|]/g, '')) return null;
    let sent = rest.join(' ').trim();
    if (sent && !sent.includes('___')) sent = '';
    return sent ? word + ';' + sent : word;
  }).filter(Boolean).slice(0, 200);
}

function localKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
