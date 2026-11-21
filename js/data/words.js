// Ordlister for hvert område.
// Format: "mønster;sætning;engelsk"
//   mønster: ordet, hvor den svære del står i [ ]. Fx "s[ø]ster".
//            [ø]        -> rigtigt svar er ø, forkerte valg hentes fra standardlisten
//            [k|c]      -> rigtigt svar er k, forkert valg er c
//            [|r]       -> rigtigt svar er INGEN bogstaver, forkert valg er r
//   sætning: ___ markerer hvor ordet står
//   engelsk: det engelske ord (vises som "bro" mellem sprogene)

export const WORDLISTS = [
  // 0 · Engdalen — e, æ og i
  [
    'h[e]st;Pigen rider på en ___.;horse',
    'v[e]n;Han er min bedste ___.;friend',
    'f[e]st;Vi holder ___ på slottet.;party',
    'gr[e]n;Fuglen sidder på en ___.;branch',
    's[e]ks;Klokken er ___.;six',
    'b[e]dre;Det bliver ___ i morgen.;better',
    'h[e]nte;Kan du ___ vand ved brønden?;fetch',
    'b[e]n;Hesten har fire ___.;legs',
    'h[e]lt;Ridderen er en sand ___.;hero',
    'l[e]ge;Vil du ___ med mig?;play',
    'l[æ]rer;Vores ___ hedder Anne.;teacher',
    'b[æ]r;Vi plukker ___ i skoven.;berries',
    'tr[æ];Katten sidder oppe i et ___.;tree',
    'sv[æ]rd;Ridderen trækker sit ___.;sword',
    'kn[æ];Jeg slog mit ___, da jeg faldt.;knee',
    '[æ]ble;Hun spiser et rødt ___.;apple',
    'v[æ]re;Jeg vil gerne ___ ridder.;to be',
    'm[æ]lk;Jeg drikker et glas ___.;milk',
    'tr[æ]t;Efter kampen er jeg meget ___.;tired',
    'n[æ]se;Trolden har en stor ___.;nose',
    'l[æ]ge;Hun er ___ på hospitalet.;doctor',
    's[æ]lge;Købmanden vil ___ sit sværd.;sell',
    'm[æ]nd;Der står tre ___ ved porten.;men',
    'h[æ]nder;Vask dine ___ før maden.;hands',
    'l[æ]se;Jeg kan godt lide at ___ bøger.;read',
    'l[i]lle;Min ___ bror er fem år.;little',
    'f[i]sk;Katten spiser en ___.;fish',
  ],
  // 1 · Skyggeskoven — ø, y og u
  [
    's[ø]ster;Min ___ hedder Ida.;sister',
    'b[y]gge;Vi skal ___ en borg.;build',
    'k[y]s;Hun giver ham et ___.;kiss',
    'm[ø]rk;Skoven er ___ om natten.;dark',
    'sk[y];Der er en ___ på himlen.;cloud',
    'h[ø]j;Tårnet er meget ___.;high',
    'gr[ø]n;Græsset er ___.;green',
    'n[y];Jeg har fået en ___ cykel.;new',
    'b[u]sk;Haren gemmer sig i en ___.;bush',
    'm[u]nd;Trolden har en stor ___.;mouth',
    'h[u]nd;Vores ___ hedder Bob.;dog',
    'str[ø]mpe;Jeg har hul i min ___.;sock',
    'b[ø]ger;Biblioteket har mange ___.;books',
    'dr[ø]m;Jeg havde en mærkelig ___ i nat.;dream',
    'tr[y]lle;Troldmanden kan ___.;do magic',
    'st[y]kke;Må jeg få et ___ kage?;piece',
    'm[y]g;En ___ stak mig på armen.;mosquito',
    'f[y]rre;Min far er ___ år.;forty',
    'sm[ø]r;Jeg kommer ___ på brødet.;butter',
    'fl[y]ve;Fuglen kan ___.;fly',
    'b[u]kser;Jeg tager ___ på.;trousers',
    'l[ø]be;Jeg kan ___ meget hurtigt.;run',
    'k[ø]kken;Vi spiser morgenmad i ___.;kitchen',
    'st[ø]vler;Jeg tager ___ på, når det regner.;boots',
    'tr[ø]je;Jeg har en blå ___ på.;sweater',
    'fr[y]se;Uden jakke begynder jeg at ___.;freeze',
    'r[y]gsæk;Jeg har madpakken i min ___.;backpack',
  ],
  // 2 · Kysten — å og o
  [
    'b[å]d;Vi sejler i en lille ___.;boat',
    's[o]ve;Jeg er træt og skal ___ nu.;sleep',
    '[o]st;Jeg vil have ___ på brødet.;cheese',
    's[o]l;Den varme ___ skinner.;sun',
    '[å]ben;Døren står ___.;open',
    'g[å];Vi skal ___ en tur.;walk',
    'v[o]ksen;Han er næsten ___.;grown-up',
    'b[o]rd;Vi sidder ved et stort ___.;table',
    'h[å]nd;Giv mig din ___.;hand',
    'l[å]s;Kisten har en stor ___.;lock',
    'gr[å];Elefanten er ___.;grey',
    'bl[å];Himlen er ___.;blue',
    'k[o]nge;Han er ___ over hele landet.;king',
    'm[o]rgen;I ___ skal vi i skole.;tomorrow',
    'v[å]d;Hunden er ___ efter regnen.;wet',
    'h[å]b;Der er stadig ___!;hope',
    'f[å]r;Bonden har mange ___ på marken.;sheep',
    'str[å];Hytten har tag af ___.;straw',
    'b[o]g;Jeg låner en ___ på biblioteket.;book',
    'h[o]ppe;Kan du ___ over hegnet?;jump',
    'kl[o]kken;Hvad er ___?;the time',
    'h[o]ld;Vi er på samme ___.;team',
    'g[o]dt;Kagen smager ___.;good',
    's[o]mmer;Jeg elsker ___ og sol.;summer',
    'r[å]be;Du må ikke ___ indenfor.;shout',
    'h[å]r;Hun har langt ___.;hair',
    'tr[å]d;Jeg syr med nål og ___.;thread',
    'sk[å]l;Hun spiser grød af en ___.;bowl',
  ],
  // 3 · Bjergene — stumme bogstaver
  [
    '[h]vad;___ hedder du?;what',
    '[h]vor;___ bor du?;where',
    '[h]vem;___ har taget min blyant?;who',
    '[h]vid;Sneen er ___.;white',
    '[h]vis;___ det regner, bliver vi inde.;if',
    '[h]jem;Jeg går ___ nu.;home',
    '[h]jælpe;Kan du ___ mig?;help',
    '[h]jerte;Mit ___ banker hurtigt.;heart',
    '[h]jul;Cyklen har to ___.;wheels',
    'man[d];Den gamle ___ sidder på bænken.;man',
    'lan[d];Danmark er et lille ___.;country',
    'kol[d];Vandet i søen er ___.;cold',
    'gul[d];Dragen vogter sit ___.;gold',
    'fjen[d]e;Dragen er ridderens ___.;enemy',
    'sa[g]de;Hun ___, at hun var træt.;said',
    'pi[g]e;Den lille ___ leger i haven.;girl',
    'mi[d]t;Træet står ___ i haven.;in the middle',
    'sel[v];Jeg kan godt ___.;myself',
    'hal[v];Jeg spiser en ___ pizza.;half',
    'tol[v];Klokken er ___.;twelve',
    'skul[d]e;Jeg ___ have øvet mig mere.;should',
    'kun[d]e;Jeg ___ ikke finde min sko.;could',
    'vil[d]e;Hun ___ gerne med i biografen.;wanted',
    'tor[d]en;Vi hørte lyn og ___.;thunder',
    'nor[d];Kompasset peger mod ___.;north',
    'jor[d];Gulerødder gror i ___.;soil',
  ],
  // 4 · Isslottet — nutids-r og dobbelte konsonanter
  [
    'lære[r];Han ___ at spille guitar.;learns',
    'lære[|r];Jeg vil gerne ___ at svømme.;to learn',
    'køre[r];Bussen ___ hver morgen.;drives',
    'køre[|r];Jeg må ikke ___ bil endnu.;to drive',
    'høre[r];Hun ___ musik på sit værelse.;listens',
    'høre[|r];Vil du ___ en historie?;to hear',
    'spørge[r];Han ___ om vej.;asks',
    'bære[r];Ridderen ___ et tungt skjold.;carries',
    'bære[|r];Kan du ___ kassen for mig?;to carry',
    'svare[r];Hun ___ på spørgsmålet.;answers',
    'svare[|r];Du skal ___ hurtigt.;to answer',
    'spise[r];Dragen ___ en hel ko.;eats',
    'spise[|r];Vi skal ___ nu.;to eat',
    'tro[r];Jeg ___ på dig!;believe',
    'bo[r];Kongen ___ på et slot.;lives',
    'se[r];Jeg ___ en drage på himlen!;see',
    'se[|r];Kan du ___ den?;to see',
    'ka[tt]en;___ jager en mus.;the cat',
    'ka[t|tt];Min ___ hedder Mis.;cat',
    'su[pp]e;Vi spiser ___ til aftensmad.;soup',
    'bi[ll]ede;Hun maler et flot ___.;picture',
    'kla[ss]e;Jeg går i 5. ___.;class',
    'ri[dd]er;En ___ i skinnende rustning.;knight',
    'ha[mm]er;Smeden slår med en ___.;hammer',
    'ka[g|gg]e;Mor bager en ___.;cake',
    'tro[l|ll]d;En ___ bor under broen.;troll',
    'hi[mm]len;Stjernerne lyser på ___.;the sky',
    'bo[ll]e;Jeg spiser en ___ med smør.;bun',
    'ky[ll]ing;Vi spiser ___ med ris.;chicken',
    'mu[s|ss];Katten fanger en ___.;mouse',
    'ski[nn]er;Solen ___ i dag.;shines',
    'kli[pp]e;Jeg skal ___ håret.;cut',
  ],
  // 5 · Vrøvls Tårn — engelske fælder
  [
    '[k|c]age;Vi spiser ___ til fødselsdagen.;cake',
    '[k|c]amera;Jeg tager billeder med mit ___.;camera',
    'musi[k|c];Jeg hører ___ i mine høretelefoner.;music',
    'famili[e|y];Min ___ er stor.;family',
    'histori[e|y];Bedstefar fortæller en ___.;story',
    'prin[s|c]esse;En ___ bor i tårnet.;princess',
    '[v|w]ind;Der er meget ___ i dag.;wind',
    '[v|w]inter;Næste ___ skal vi stå på ski.;winter',
    'bana[n|na];Aben spiser en ___.;banana',
    'sk[o|oo]le;Jeg cykler til ___ hver dag.;school',
    '[sj|sh]ovt;Det er ___ at spille.;fun',
    '[k|c]rokodille;En ___ svømmer i floden.;crocodile',
    'klo[v|w]n;En ___ med rød næse.;clown',
    'ele[f|ph]ant;En ___ har en lang snabel.;elephant',
    '[f|ph]oto;Må jeg tage et ___ af dig?;photo',
    'te[ks|x]t;Skriv en kort ___ om din ferie.;text',
    'e[ks|x]tra;Må jeg få en ___ is?;extra',
    'e[ks|x]empel;Giv mig et ___.;example',
    '[t|th]eater;Vi skal i ___ i aften.;theater',
    'ma[t|th]ematik;Jeg har ___ i første time.;math',
    '[kv|qu]arter;Klokken er ___ over tre.;quarter',
    '[k|ch]irke;Brudeparret bliver gift i en ___.;church',
    '[sk|sh]ib;Et stort ___ sejler på havet.;ship',
    '[sk|sh]o;Jeg har en ___ på hver fod.;shoe',
    '[c|s|k]ykel;Min nye ___ er rød.;bicycle',
    '[c|s|k]irkus;Vi skal i ___ og se klovne.;circus',
    'chokola[d|t]e;Jeg elsker varm ___.;chocolate',
  ],
];

const DEFAULT_ALTS = {
  e: ['æ', 'i'], 'æ': ['e'], i: ['e'], y: ['ø', 'u'], 'ø': ['y', 'u'],
  u: ['o', 'ø'], o: ['å', 'u'], 'å': ['o'],
  h: [''], d: [''], g: [''], v: [''], r: [''],
};

export function parseEntry(str, ch) {
  const [pat, sentence = '', en = ''] = str.split(';').map(s => s.trim());
  const m = pat.match(/^(.*)\[([^\]]*)\](.*)$/);
  let pre = pat, ans = '', post = '', opts = null;
  if (m) {
    pre = m[1]; post = m[3];
    const parts = m[2].split('|');
    ans = parts[0];
    if (parts.length > 1) opts = parts;
    else {
      let alts = DEFAULT_ALTS[ans];
      if (!alts) alts = (ans.length === 2 && ans[0] === ans[1]) ? [ans[0]] : [ans + ans];
      opts = [ans, ...alts];
    }
  }
  const word = (pre + ans + post).toLowerCase();
  return { id: ch + ':' + pat, ch, word, pre, ans, post, opts, sentence, en, custom: !m };
}

const VOWEL_TIPS = {
  e: 'Her skrives e, selvom det kan lyde som æ. Se godt på ordet og sig det langsomt: h-e-s-t.',
  'æ': 'Her skrives æ. Tip: Mange æ-ord har en "a-familie": mand → mænd, hånd → hænder. Og "ær" skrives tit med æ: lærer, bær, sværd.',
  i: 'Kort i kan lyde som e (lille, fisk) – men det skrives med i.',
  y: 'Kort y lyder tit som ø: bygge, kys, fyrre. Husk ordets billede!',
  'ø': 'Her er det ø. Engelsk har ikke ø – sister → søster.',
  u: 'Kort u lyder tit som o: hund, mund, bukser. Men det skrives med u.',
  o: 'Kort o lyder tit som å: sove, ost, klokken, godt. Men det skrives med o.',
  'å': 'Her er det å – den lange, runde lyd: båd, gå, blå.',
};
const SILENT_TIPS = {
  h: 'Stumt h! Ord med hv- og hj- har et h, man ikke siger: hvad, hvor, hjem, hjælpe. Engelsk har også stumme bogstaver – tænk på k i "knight".',
  d: 'Stumt d! Efter n, l og r kan man tit ikke høre d: mand, guld, nord. Prøv at bøje ordet: mand → manden.',
  g: 'Stumt g: pige, sagde. Man kan næsten ikke høre det – men det skal med.',
  v: 'Stumt v: selv, halv, tolv. Det siges næsten ikke, men det skrives.',
};
const PAIR_TIPS = {
  'k/c': 'Dansk bruger k, hvor engelsk tit har c: cake → kage, camera → kamera, music → musik.',
  'k/ch': 'Engelsk "church" bliver til "kirke". Dansk bruger k.',
  'c/s': 'Undtagelse! Cykel og cirkus skrives med c på dansk.',
  'v/w': 'Dansk har næsten aldrig w. Wind → vind, winter → vinter, clown → klovn.',
  'f/ph': 'Dansk bruger f, hvor engelsk har ph: photo → foto, elephant → elefant.',
  'ks/x': 'Dansk skriver ks i stedet for x: text → tekst, extra → ekstra.',
  'sk/sh': 'Dansk har ikke "sh". Ship → skib, shoe → sko.',
  'sj/sh': 'Lyden "sh" skrives sj på dansk: sjovt, sjælden.',
  't/th': 'Dansk bruger t, hvor engelsk har th: theater → teater, math → matematik.',
  'kv/qu': 'Engelsk qu bliver til kv på dansk: quarter → kvarter.',
  'e/y': 'Engelske ord på -y ender tit på -e på dansk: family → familie, story → historie.',
  's/c': 'Dansk bruger s: princess → prinsesse.',
  'o/oo': 'Dansk skriver ikke "oo". School → skole.',
  'n/na': 'Banana → banan. Dansk skærer endelsen af.',
  'd/t': 'Chocolate → chokolade. På dansk er det et d.',
};

export function tipFor(w) {
  if (!w.opts) return 'Kig godt på ordet. Sig det langsomt, bogstav for bogstav, og skriv det igen.';
  const a = w.ans, alt = w.opts.find(o => o !== a);
  const pair = PAIR_TIPS[a + '/' + alt];
  if (pair) return pair;
  if (a === 'r' && alt === '') return 'Nutids-r! Sker det NU? Så skal der r på: han lærer, hun kører. Prøv med "spiser": "han spiser" – ja, r!';
  if (a === '' && alt === 'r') return 'Ingen r! Efter "vil", "kan", "skal", "må" og "at" står ordet uden r: Jeg vil lære. Prøv: "jeg vil spise" – ikke "spiser".';
  if (SILENT_TIPS[a] && alt === '') return SILENT_TIPS[a];
  if (a.length === 2 && a[0] === a[1]) return 'Dobbelt konsonant! Kort vokal og flere bogstaver bagefter → dobbelt: katten, suppe, ridder.';
  if (alt && alt.length === 2 && alt[0] === alt[1]) return 'Kun én konsonant her. Sidst i ordet skriver vi sjældent dobbelt: kat, hat – men katten, hatten. Lang vokal → én: kage, skole.';
  if (VOWEL_TIPS[a]) return VOWEL_TIPS[a];
  return 'Kig godt på ordet. Sig det langsomt, og skriv det igen.';
}
