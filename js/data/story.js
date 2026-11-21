// Historien. Hver linje: [hvem, tekst]. {navn} udskiftes med heltens navn.
// hvem: narr | ulla | hero | vrovl | valdemar | npc | <monsternøgle> | brev

export const PROLOGUE = [
  ['narr', 'For længe siden var Ordriget et fredeligt land. Alle ord stod pænt på deres plads, og alle kunne læse kongens breve.'],
  ['narr', 'I Biblioteksborgen lyste Ordkrystallen. Den holdt styr på alle bogstaver i hele riget.'],
  ['narr', 'Men en stormfuld nat kom en skikkelse i en lilla kappe. Han løftede sin stav og knuste krystallen i seks splinter...'],
  ['vrovl', 'HA HA HA! Fra i dag staver INGEN rigtigt! Alle ord skal være VRØVL!'],
  ['narr', 'Splinterne fløj ud over landet. Ordene begyndte at bytte bogstaver, og monstre vågnede i skovene og bjergene.'],
  ['narr', 'Samme morgen lagde et skib til i havnen. Om bord var {navn}, som havde boet mange år i Vestlandet – på den anden side af havet.'],
  ['ulla', 'Hu-hu! Er det dig, {navn}? Jeg er Ulla, kongens ugle. Vi har brug for din hjælp!'],
  ['hero', 'Mig? Jeg har været væk i mange år. Derovre staver de helt anderledes...'],
  ['ulla', 'Netop derfor! Du kender TO sprog. Du kan se forskel på vestlandske og danske ord. Vrøvls tricks virker ikke på dig – hvis du øver dig.'],
  ['ulla', 'Hver gang du staver et ord rigtigt, rammer dit sværd. Staver du forkert, slår monstret igen. Men bare rolig – jeg viser dig altid det rigtige ord bagefter.'],
  ['ulla', 'Kom! Den første splint er i Engdalen.'],
];

export const STORY = [
  { // 0 Engdalen
    intro: [
      ['ulla', 'Dette er Engdalen. Her har Vrøvl blandet e og æ sammen.'],
      ['ulla', 'Pas på! Mange ord SIGER æ, men SKRIVES med e – som "hest" og "seks". Andre skrives med æ – som "lærer" og "sværd".'],
      ['ulla', 'Tryk på 🔊 for at høre ordet igen. Og tænk på, hvordan ordet SER ud, når du har læst det i en bog.'],
    ],
    village: [
      ['npc', 'Tak fordi du kom! Tornetrolden har lavet alle vores æbler om til "ebler"!'],
      ['npc', 'Et godt tip fra en gammel bonde: Mange æ-ord har en familie med a. Mand → mænd. Hånd → hænder. Lang → længe.'],
    ],
    preBoss: [
      ['tornetrold', 'GRRR! Hvem er du? Mester Vrøvl gav mig Æ-splinten. Den får du ALDRIG!'],
      ['ulla', 'Den er stærk! Brug din magi, hvis du har lært noget.'],
    ],
    postBoss: [
      ['narr', 'Tornetrolden falder om og bliver til en lille, sur busk.'],
      ['ulla', 'Du fandt Æ-splinten! Den gløder helt varmt.'],
      ['vrovl', 'Hmm... en lille helt fra Vestlandet? Du ved jo ikke engang, hvordan man staver "søster". Mød mig i Skyggeskoven – hvis du tør!'],
      ['ulla', 'Han lød næsten... ked af det? Mærkeligt. Kom, videre til Skyggeskoven!'],
    ],
  },
  { // 1 Skyggeskoven
    intro: [
      ['ulla', 'Uh, her er mørkt. Heksen Ylva har forhekset alle ø-, y- og u-ord.'],
      ['ulla', 'Husk: Et kort y lyder tit som ø – "bygge", "kys", "fyrre". Og et kort u lyder tit som o – "hund", "mund".'],
      ['hero', 'På engelsk findes ø slet ikke! "Sister" bliver til "søster".'],
      ['ulla', 'Netop! Du er allerede i gang med at bygge bro mellem dine to sprog.'],
    ],
    village: [
      ['npc', 'Heksen har stjålet alle y\'erne fra vores skilte. Nu står der "bøgge" i stedet for "bygge"!'],
      ['npc', 'Der går et rygte i skoven... at Vrøvl engang var kongens allerdygtigste skriver. Men det er vist bare snak.'],
    ],
    preBoss: [
      ['ylva', 'Hihihi! Sejlede du hele vejen fra Vestlandet for at stave "køs" og "bøgge"?'],
      ['hero', 'Det hedder "kys" og "bygge"!'],
      ['ylva', 'Det må vi se, lille ven!'],
    ],
    postBoss: [
      ['narr', 'Ylvas kost knækker, og hun forsvinder i en sky af lilla røg.'],
      ['ulla', 'Ø-splinten! To ud af seks!'],
      ['narr', 'På jorden ligger et gammelt, krøllet brev, skrevet med sirlig håndskrift.'],
      ['brev', '"Kære konge. Jeg rejser nu til Vestlandet for at lære deres sprog. Jeg kommer hjem om ti år. Deres tro skriver, Valdemar."'],
      ['ulla', 'Valdemar? Han var kongens skriver for længe siden... Han kom aldrig hjem. Det troede vi i hvert fald.'],
    ],
  },
  { // 2 Kysten
    intro: [
      ['ulla', 'Havet! Se, kysten er fuld af forvirrede å- og o-ord.'],
      ['ulla', 'Et kort o lyder tit som å: "sove", "ost", "godt". Men den lange, runde lyd skrives tit med å: "båd", "gå", "blå".'],
    ],
    village: [
      ['npc', 'Søormen har slugt tre af vores både! Og nu kalder den sig "Søårmen". Det har Vrøvl lært den.'],
      ['npc', 'Ved du hvad? Jeg sejlede engang en mand ved navn Valdemar til Vestlandet. Han elskede ord. Men da han kom hjem, grinede folk af hans stavning...'],
      ['npc', 'Han gik op i bjergene og blev aldrig set igen.'],
    ],
    preBoss: [
      ['søorm', 'SSSS... ingen kommer forbi min båd... min "bod"... min... SSSS!'],
    ],
    postBoss: [
      ['ulla', 'Å-splinten! Vi er halvvejs!'],
      ['vrovl', 'Du er bedre, end jeg troede, lille helt. Men i bjergene bliver det stille... HELT stille. Hahaha!'],
    ],
  },
  { // 3 Bjergene
    intro: [
      ['ulla', 'Bjergene er så stille, at nogle bogstaver er blevet stumme.'],
      ['ulla', 'Man SIGER dem ikke, men man SKRIVER dem: h i "hvad" og "hjem". d i "mand" og "guld". Og v i "selv" og "halv".'],
      ['hero', 'Ligesom k i "knight" på engelsk! Den siger man heller ikke.'],
      ['ulla', 'Præcis! Begge dine sprog har stumme bogstaver.'],
    ],
    village: [
      ['npc', 'Stenkæmpen Grum vogter en hule helt oppe på toppen. Derinde hænger et billede af en ung skriver med en fjerpen.'],
      ['npc', 'Et tip: Er det et spørgeord, der starter med v-lyd – hvad, hvor, hvem, hvis – så skriv hv!'],
    ],
    preBoss: [
      ['grum', 'GRUM... ER... STUM. DU... SKAL... OGSÅ... VÆRE... STUM.'],
    ],
    postBoss: [
      ['narr', 'Bag Grum finder I en lille hule med en seng, et skrivebord og hundredvis af krøllede papirer.'],
      ['narr', 'På alle papirerne står det samme ord, skrevet igen og igen: "sister... søster... søstre... søster".'],
      ['ulla', 'Det er Valdemars hule. Han øvede sig... helt alene.'],
      ['hero', 'Valdemar... er det ham, der er Vrøvl?'],
      ['ulla', 'Jeg er bange for, at du har ret.'],
    ],
  },
  { // 4 Isslottet
    intro: [
      ['ulla', 'Isslottet. Her har Vrøvl frosset tiden. Ordene ved ikke, om de sker NU eller ej.'],
      ['ulla', 'Nutids-r: Sker det nu? Så r: "Han lærer." Står der "vil", "kan", "skal", "må" eller "at" foran? Så ingen r: "Jeg vil lære."'],
      ['ulla', 'Prøv at bytte med "spiser": "Han spiser" – r! "Jeg vil spise" – ingen r!'],
      ['ulla', 'Og pas på dobbelte bogstaver: kat – men katten. Kort lyd og mere bagefter = dobbelt.'],
    ],
    village: [
      ['npc', 'Isdragen Frost har frosset alle de dobbelte bogstaver fast. Katten hedder nu "katen"!'],
      ['npc', 'Husk: hat – hatten. Kat – katten. Men kage og skole har kun én, fordi lyden er lang.'],
    ],
    preBoss: [
      ['frost', 'Tiden står stille her. Ingen nutid. Ingen fremtid. Kun is.'],
      ['vrovl', 'Frost! Stop den helt fra Vestlandet!'],
    ],
    postBoss: [
      ['ulla', 'Den femte splint! Kun én tilbage – og den har Vrøvl selv.'],
      ['narr', 'Isen smelter, og en sti af lys viser vej mod Vrøvls Tårn.'],
    ],
  },
  { // 5 Vrøvls Tårn
    intro: [
      ['vrovl', 'Så du kom. Velkommen til mit tårn, hvor alle ord er halvt vestlandske og halvt danske!'],
      ['vrovl', '"Cake"? "Camera"? "Wind"? Her ved INGEN, hvad der er rigtigt!'],
      ['ulla', 'Pas på de engelske fælder: Dansk skriver k i stedet for c, v i stedet for w, f i stedet for ph og ks i stedet for x.'],
      ['hero', 'Men "cykel" og "cirkus" skrives med c. Det har jeg lært.'],
    ],
    village: [
      ['npc', 'Jeg har gemt mig hernede i ugevis. Vrøvl var engang min ven. Han hed Valdemar og var den venligste skriver i hele riget.'],
      ['npc', 'Da han kom hjem fra Vestlandet, havde han glemt nogle danske ord. Folk grinede. Han skammede sig så meget...'],
      ['npc', 'Til sidst ville han have, at ALLE stavede forkert. Så kunne ingen grine af ham mere.'],
    ],
    preBoss: [
      ['vrovl', 'Du ligner mig, da jeg var ung. Du kom hjem fra Vestlandet og blandede ordene sammen, ikke?'],
      ['hero', 'Jo. I starten skrev jeg "cake" i stedet for "kage" og "søster" med i.'],
      ['vrovl', 'Og grinede de af dig? SÅ FORSTÅR DU MIG!'],
      ['hero', 'Jeg øvede mig. Og at kunne to sprog er ikke dumt. Det er en superkraft!'],
      ['vrovl', 'TI STILLE! Kæmp!'],
    ],
    phase2: [
      ['vrovl', 'NOK! Se min sande skikkelse... SKYGGE-VRØVL!'],
      ['ulla', 'Han er blevet til en skygge af alle de ord, han var flov over. Bliv ved, {navn}!'],
    ],
    postBoss: [
      ['narr', 'Skyggen omkring Vrøvl forsvinder. Tilbage står en gammel mand i en slidt, lilla kappe.'],
      ['valdemar', 'Jeg... jeg er Valdemar. Jeg ville bare ikke være den eneste, der lavede fejl.'],
      ['hero', 'Alle laver fejl, når de lærer noget nyt. Det er sådan, man bliver god.'],
      ['ulla', 'Hu-hu. Og man bliver hurtigere god, når man øver sig sammen.'],
      ['narr', 'Sammen samler I de seks splinter. Ordkrystallen lyser igen – klarere end nogensinde.'],
      ['narr', 'Kongen udnævner {navn} til Rigets Ordridder. Og Valdemar bliver kongens skriver igen.'],
      ['valdemar', 'Tag min stav. Du har fortjent den mere end mig.'],
      ['ulla', 'Træningstårnet er altid åbent. Bliv ved med at øve, så alle ord i Ordbogen bliver til guld!'],
      ['narr', 'SLUT... eller er det? Du kan altid vende tilbage til alle områder og kæmpe igen.'],
    ],
  },
];

export const TRAINING_INTRO = [
  ['ulla', 'Velkommen til Træningstårnet! Her øver vi de ord, der trænger mest – også dem fra tidligere områder.'],
  ['ulla', 'Første gang hver dag får du en skattekiste. Hjernen husker bedst, når man øver lidt hver dag!'],
];
