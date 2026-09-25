import fs from 'fs';
import path from 'path';

const OUT_DIR = 'C:/Users/superindep/maisonnumidia/scripts/_catalog-audit/rewrites2';

const BANNED_PHRASES = [
  "positionnement tarifaire",
  "pièce maîtresse d'une collection",
  "piece maitresse d'une collection",
  "parfum d'appoint",
  "reste parfaitement lisible",
  "période de port privilégiée",
  "periode de port privilegiee",
  "la construction olfactive révèle toute sa richesse",
  "fonctionne dans des contextes très variés",
  "sans jamais sembler décalé",
  "plaît naturellement à un public algérien",
  "il est grand temps de la découvrir",
  "une fragrance qui dure",
  "il est important de noter",
  "en conclusion",
  "n'hésitez pas",
  "pour conclure",
  "certificat de conformité",
  "nos entrepôts",
  "fournisseurs vérifiés",
  "coffret d'origine",
  "scellé",
  "dédouané",
  "2025",
  "---",
];

const entries = [
  {
    slug: "lacoste-essential",
    nameForCount: ["Essential"],
    shortDescription: "Lacoste Essential ouvre sur une fraîcheur verte et acidulée, portée par la bergamote et une pointe inattendue de feuille de tomate. Le cœur floral et boisé s'installe ensuite en douceur. Un parfum du quotidien, pensé pour les hommes actifs qui veulent sentir propre sans en faire trop.",
    description: `Essential fait partie de ces eaux de toilette Lacoste pensées pour un usage large : le bureau, le sport, les journées qui s'enchaînent sans temps mort. La famille aromatique boisée domine, mais ce qui distingue vraiment ce parfum, c'est une ouverture verte assez inhabituelle, construite autour de la feuille de tomate plutôt que sur les agrumes seuls. On reconnaît là une volonté de sortir un peu du schéma classique des eaux fraîches masculines, sans pour autant perdre en accessibilité.

Dès la vaporisation, la bergamote apporte l'agrume attendu, rejointe par la coriandre qui ajoute une facette légèrement épicée et fraîche. La feuille de tomate, elle, donne ce sillage vert un peu croquant qui rend l'ensemble reconnaissable parmi les fougères aromatiques plus attendues. Cette phase d'ouverture est courte mais nette, et elle installe déjà l'esprit du parfum : propre, actif, sans lourdeur.

Le cœur s'ouvre sur la rose et le magnolia, deux notes florales qui adoucissent la structure sans la féminiser, épaulées par la sauge qui ramène une pointe herbacée. En fond, le bois de santal et le vétiver installent une base chaude et sèche, tandis que le musc blanc lisse l'ensemble pour une tenue discrète sur la peau. La transition entre ces trois phases se fait sans rupture brutale, ce qui explique pourquoi ce parfum garde ses adeptes malgré la concurrence.

Porté au printemps ou en été, ce parfum reste léger sans devenir fade ; en automne, il se fond bien dans une tenue de bureau, quand les journées raccourcissent et que l'on cherche un sillage moins agressif que les compositions d'hiver. Sur maisonnumidia.store, la fiche est vendue en flacon de 125 ml, avec livraison Yalidine dans les 58 wilayas et paiement à la réception, comme pour le reste du catalogue.`,
  },
  {
    slug: "pasha-cartier-homme",
    nameForCount: ["Pasha de Cartier"],
    shortDescription: "Pasha de Cartier joue la carte de la fraîcheur mentholée sur un fond boisé ambré, dans la tradition des fougères aromatiques masculines. Il convient à un homme qui veut un parfum net et structuré, aussi à l'aise au bureau que pour une soirée habillée.",
    description: `La maison Cartier signe avec Pasha de Cartier une fougère aromatique construite sur une fraîcheur mentholée plutôt que sur la lavande seule, ce qui la distingue des fougères aromatiques plus classiques. La structure reste virile et nette, pensée pour durer toute la journée sans demander d'application supplémentaire en cours de route.

L'ouverture associe la menthe fraîche à la bergamote et au citron : un trio d'agrumes vif qui donne une première impression propre et vivifiante, sans excès de sucre ni de douceur. C'est une entrée en matière rapide, presque revigorante, pensée pour habiller une sortie de douche du matin.

Le cœur introduit une rose dite masculine, moins poudrée que la rose florale classique, accompagnée de lavande et de cyprès qui ramènent une facette herbacée. En fond, le cèdre de Virginie et le patchouli apportent la profondeur boisée, et l'ambre referme la composition sur une chaleur discrète qui tient bien sur la peau. Rien dans cette base ne cherche à dominer : l'ensemble reste équilibré du premier au dernier stade.

Cette eau de toilette se porte en toutes saisons, aussi bien pour une journée de bureau que pour une occasion plus formelle où l'on veut sentir soigné sans être trop présent. C'est aussi un choix raisonnable pour un homme qui débute sa collection de parfums et cherche une référence solide. La fiche est disponible en 100 ml sur maisonnumidia.store, livrée dans les 58 wilayas via Yalidine, avec paiement à la réception.`,
  },
  {
    slug: "paco-rabanne-fame-intense",
    nameForCount: ["Fame Intense"],
    shortDescription: "Fame Intense marie des fruits juteux à un cœur floral blanc et une base boisée musquée, pour une allure florale fruitée qui reste facile à porter. Il s'adresse aux femmes qui aiment un parfum lumineux, sans lourdeur, du bureau jusqu'au soir.",
    description: `Fame Intense reprend l'architecture florale boisée de la gamme Fame chez Paco Rabanne, avec une concentration plus marquée en eau de parfum. Le résultat est une fragrance ronde et facile à porter, pensée pour accompagner une journée entière sans besoin de retouche fréquente. Elle s'adresse à celles qui aiment les parfums immédiatement reconnaissables, sans phase de découverte trop longue.

L'attaque est fruitée et pétillante : la bergamote apporte l'agrume, les fruits ajoutent du jus et de la rondeur, tandis que le néroli garde l'ensemble frais plutôt que sucré. Cette ouverture se sent dès les premières secondes et donne le ton de toute la composition.

Le cœur se love autour de trois notes blanches, l'ylang-ylang, la rose et le jasmin, qui donnent à la composition sa dimension florale généreuse sans tomber dans le lourd. Le fond marie le bois de santal, le musc blanc et le cèdre pour une trame boisée douce, qui tient la fragrance en place au fil des heures de la journée et adoucit la sortie du floral.

Cette eau de parfum se prête aussi bien à une journée de bureau qu'à une sortie du soir, en toutes saisons, ce qui en fait un choix pratique pour qui préfère ne pas multiplier les flacons. Le flacon de 80 ml est en stock sur maisonnumidia.store, avec livraison Yalidine vers les 58 wilayas et règlement à la réception du colis.`,
  },
  {
    slug: "hugo-boss-the-scent-private-accord",
    nameForCount: ["Private Accord", "The Scent Private Accord"],
    shortDescription: "The Scent Private Accord approfondit la ligne The Scent avec un accord gourmand-épicé autour du café et du cacao, sur un fond boisé vanillé. Un parfum de soirée pour l'homme qui cherche une signature plus sombre et enveloppante que l'original.",
    description: `Private Accord fait partie des déclinaisons les plus travaillées de la ligne The Scent chez Hugo Boss, avec une orientation boisée épicée plus sombre que l'eau de toilette d'origine. La richesse de la pyramide, construite sur près d'une dizaine de notes, en fait une composition dense, pensée pour le soir plutôt que pour un usage quotidien. Elle vise un homme qui connaît déjà la version classique et cherche une variante plus affirmée.

L'ouverture est courte et directe : le gingembre pique légèrement, la bergamote apporte la fraîcheur nécessaire pour ne pas partir trop lourd dès la vaporisation. Cette phase ne dure pas longtemps, le temps que le cœur torréfié prenne le relais.

Le cœur est la partie la plus singulière de la fragrance, avec le maninka et le café qui donnent un accord torréfié inhabituel, relevé par le poivre et adouci par une touche d'ananas. En fond, le cacao et la vanille apportent la gourmandise, le patchouli et l'ambrebois la profondeur boisée, et le benjoin referme l'ensemble sur une résine chaude qui tient longtemps sur les vêtements, bien après le passage à table.

Pensée pour l'automne et l'hiver, cette eau de parfum convient à un rendez-vous ou une occasion où l'on veut une présence plus marquée que celle d'une eau de toilette légère. Le flacon de 100 ml se commande sur maisonnumidia.store, livraison Yalidine comprise dans les 58 wilayas, paiement à la réception.`,
  },
  {
    slug: "ange-ou-demon-givenchy",
    nameForCount: ["Ange ou Démon"],
    shortDescription: "Ange ou Démon joue sur un contraste assumé entre fleurs blanches lumineuses et fond boisé encensé plus sombre. Construit comme une fragrance à deux visages, il convient aux femmes qui aiment les parfums de soirée avec du caractère.",
    description: `Ange ou Démon tient son nom d'un principe de construction assez rare : une moitié claire et florale, une autre plus sombre et résineuse, réunies dans un seul flacon signé Givenchy. La fragrance appartient à la famille florale orientale, avec une intensité pensée pour le soir plutôt que pour une utilisation en journée.

L'ouverture s'appuie sur le magnolia blanc et des notes vertes qui donnent une première impression fraîche et lumineuse, tandis que la bergamote apporte l'agrume qui allège l'ensemble. Cette entrée en matière tranche volontairement avec ce qui va suivre, comme pour mieux préparer le contraste.

Le cœur bascule vers des fleurs blanches plus capiteuses, la tubéreuse et le jasmin, adoucies par une note de pêche qui évite la lourdeur. C'est en fond que le contraste annoncé par le nom prend tout son sens : l'encens et le vétiver amènent une facette sombre et un peu fumée, tandis que l'ambre et le bois de santal referment la composition sur une chaleur enveloppante qui s'installe durablement sur la peau.

Ce parfum est pensé pour l'automne et l'hiver, pour une soirée, un mariage ou une occasion où l'on veut se démarquer sans passer inaperçue. Le flacon de 100 ml est disponible sur maisonnumidia.store, avec livraison Yalidine dans les 58 wilayas et paiement à la réception.`,
  },
  {
    slug: "prada-candy-night",
    nameForCount: ["Candy Night"],
    shortDescription: "Candy Night reprend la gourmandise vanillée de Candy dans une version plus sombre, entre chocolat et patchouli. Un parfum de nuit pour les femmes qui aiment les sillages sucrés mais avec du corps, plutôt que légers.",
    description: `Candy Night est la version nocturne de la ligne Candy chez Prada : la même base gourmande vanillée, mais assombrie par des notes plus enveloppantes. La famille olfactive reste orientale vanillée, avec une concentration en eau de parfum qui accentue la tenue et rend la fragrance plus dense dès l'application.

L'ouverture commence par l'iris, plus poudré que sucré, entouré d'orange amère et de néroli qui apportent une fraîcheur agrume sans virer au fruité classique. Cette entrée reste brève, le temps que la gourmandise du cœur prenne toute la place.

Le cœur installe la vanille et la fève tonka, un duo gourmand qui rappelle la pâtisserie sans devenir écœurant. En fond, le chocolat approfondit cette gourmandise tandis que le patchouli ramène une facette terreuse qui équilibre le sucré et donne du corps à la fragrance, évitant qu'elle ne devienne trop enfantine.

Pensé pour l'automne et l'hiver, ce parfum se porte le soir, pour un rendez-vous ou une sortie nocturne où l'on veut un sillage présent sans en faire trop dès le premier contact. Le flacon de 80 ml est en vente sur maisonnumidia.store, livraison Yalidine vers les 58 wilayas, paiement à la réception du colis.`,
  },
  {
    slug: "guerlain-mon-guerlain-sparkling-bouquet",
    nameForCount: ["Sparkling Bouquet", "Mon Guerlain Sparkling Bouquet"],
    shortDescription: "Sparkling Bouquet éclaircit la signature vanille-lavande de Mon Guerlain avec des fruits juteux et un bouquet floral frais. Un parfum de tous les jours pour les femmes qui veulent la structure Guerlain en version plus légère.",
    description: `Sparkling Bouquet fait partie des déclinaisons de la ligne Mon Guerlain, avec une orientation plus fruitée et florale que l'eau de parfum d'origine. La structure lavande-vanille, signature de la maison, reste présente, mais allégée pour un usage quotidien où l'on veut moins de poids qu'un soir de fête.

L'ouverture est juteuse et vive : la poire donne du volume, la bergamote et la mandarine ajoutent l'agrume qui rend la première impression fraîche plutôt que sucrée. C'est une entrée en matière énergique, pensée pour le matin.

Le cœur associe la lavande à la pivoine et au jasmin sambac, pour un bouquet floral rond sans excès de poudre. En fond, la vanille de Tahiti apporte la chaleur caractéristique de la gamme, adoucie par le musc blanc et le bois de santal qui prolongent la tenue sur la peau bien au-delà de la matinée.

Cette eau de parfum convient au printemps et à l'été, pour le bureau comme pour un usage quotidien où l'on veut rester fraîche sans sacrifier la profondeur qui fait la réputation de la maison. Le flacon de 100 ml est disponible sur maisonnumidia.store, avec livraison Yalidine dans les 58 wilayas et paiement à la réception.`,
  },
  {
    slug: "hermes-un-jardin-en-mediterranee",
    nameForCount: ["Un Jardin en Méditerranée"],
    shortDescription: "Un Jardin en Méditerranée recrée une matinée d'été au bord de la mer, entre agrumes, fleur d'oranger et feuille de figuier verte. Il convient à celles et ceux qui cherchent un parfum unisexe frais pour la belle saison.",
    description: `Un Jardin en Méditerranée fait partie de la collection des Jardins d'Hermès, une série de parfums construits comme des instantanés de paysage plutôt que comme des compositions classiques. Celui-ci évoque un jardin du sud, entre agrumes et végétation sèche.

L'ouverture rassemble la bergamote, le citron et la mandarine, un trio d'agrumes frais et net qui donne immédiatement l'image d'un été méditerranéen.

Le cœur s'appuie sur la fleur d'oranger et le laurier rose blanc, deux notes qui gardent la fraîcheur florale sans tomber dans le sucré. En fond, la feuille de figuier apporte une verdeur lactée caractéristique, entourée du cyprès, du cèdre rouge, du genévrier et de la pistache, avec le musc qui referme l'ensemble sur une trame propre et légère.

Cette eau de toilette unisexe se porte au printemps et en été, pour un usage casual comme pour une journée en extérieur. Le flacon de 100 ml est disponible sur maisonnumidia.store, livraison Yalidine dans les 58 wilayas, paiement à la réception.`,
  },
  {
    slug: "amouage-dia-homme",
    nameForCount: ["Dia pour Homme"],
    shortDescription: "Dia pour Homme associe un encens épicé à un cœur floral inattendu de pivoine et d'ylang-ylang, sur un fond de cuir et de patchouli. Amouage signe ici un parfum floral boisé pensé pour les hommes qui veulent sortir des sentiers battus.",
    description: `Dia pour Homme occupe une place particulière dans le catalogue Amouage : c'est une composition florale boisée musquée, un registre rare pour un parfum masculin, construit sur un encens résineux plutôt que sur les boisés fougères habituels.

L'ouverture est dense d'emblée, entre l'encens et la cardamome épicée, adoucis par le labdanum et relevés par l'orange amère qui apporte une pointe d'agrume sec.

Le cœur surprend avec la pivoine et la prune, deux notes rarement associées à un parfum pour homme, épaulées par la racine d'iris et l'ylang-ylang qui gardent une dimension florale affirmée. En fond, le vétiver et le bois de rose du Brésil installent la profondeur boisée, tandis que le cuir, l'ambre et le patchouli referment la composition sur un sillage dense et masculin.

Ce parfum convient au printemps et à l'automne, pour le bureau comme pour des occasions plus formelles où l'on veut une signature différente. Le flacon de 100 ml est disponible sur maisonnumidia.store, avec livraison Yalidine dans les 58 wilayas et paiement à la réception.`,
  },
  {
    slug: "ultra-male-jean-paul-gaultier",
    nameForCount: ["Ultra Male"],
    shortDescription: "Ultra Male pousse la gourmandise épicée de la ligne Le Male vers un registre plus intense, entre poire, cannelle et vanille noire. Jean Paul Gaultier vise ici les hommes qui aiment les sillages puissants et sucrés, surtout en soirée.",
    description: `Ultra Male prolonge la ligne Le Male chez Jean Paul Gaultier, dans une version plus concentrée et plus sucrée, classée oriental fougère. La pyramide reste dense du début à la fin, pensée pour un sillage qui se remarque.

L'ouverture combine cinq notes : la poire apporte le fruité, la lavande et la menthe la fraîcheur aromatique, tandis que la bergamote et le citron ajoutent l'agrume qui allège l'ensemble le temps des premières minutes.

Le cœur épicé s'installe avec la cannelle et le carvi, relevés par la sauge sclarée qui garde une facette herbacée au milieu du sucré. En fond, la vanille noire domine, entourée de l'ambre, du patchouli et du cèdre qui donnent la structure boisée nécessaire pour tenir la composition sur la durée.

Pensé pour l'automne et l'hiver, ce parfum se porte surtout le soir, pour des occasions où l'on veut une présence affirmée. Le flacon de 125 ml est disponible sur maisonnumidia.store, livraison Yalidine vers les 58 wilayas, paiement à la réception du colis.`,
  },
  {
    slug: "la-yuqawam-rasasi-homme",
    nameForCount: ["La Yuqawam Pour Homme", "La Yuqawam"],
    shortDescription: "La Yuqawam Pour Homme marie une pointe fruitée de framboise à un cœur d'encens et de jasmin, sur un fond de cuir et de daim. Rasasi propose ici un oriental boisé épicé dense, pensé pour l'hiver et les soirées entre proches.",
    description: `La Yuqawam Pour Homme fait partie des orientaux boisés épicés les plus travaillés du catalogue Rasasi, avec une ouverture fruitée assez inattendue pour ce registre. La composition reste dense et chaude du début à la fin, dans la tradition des parfums arabes.

Dès la vaporisation, la framboise surprend par sa fraîcheur sucrée, vite rejointe par le safran qui apporte la facette épicée caractéristique et par le thym qui ramène une touche herbacée sèche.

Le cœur s'ouvre sur l'encens, ou oliban, associé au jasmin pour la dimension florale et à l'armoise pour une amertume végétale qui équilibre le sucré du départ. En fond, le cuir et le daim installent une matière animale discrète, complétée par des notes boisées et l'ambre qui referment la composition sur une chaleur enveloppante.

Pensé pour l'automne et l'hiver, ce parfum convient aux soirées et aux occasions en famille où l'on veut un sillage présent sans être agressif. Le flacon de 75 ml est disponible sur maisonnumidia.store, avec livraison Yalidine dans les 58 wilayas et paiement à la réception.`,
  },
  {
    slug: "dior-miss-dior-rose-n-roses",
    nameForCount: ["Rose N'Roses", "Miss Dior Rose N'Roses"],
    shortDescription: "Miss Dior Rose N'Roses éclaircit la ligne Miss Dior avec une double rose fraîche, portée par des agrumes légers et un fond de musc blanc. Un parfum simple et lumineux pour les journées de printemps.",
    description: `Rose N'Roses appartient à la famille des déclinaisons Miss Dior, dans une version plus légère et clairement centrée sur la rose. La pyramide reste courte, avec peu de notes, ce qui donne une fragrance nette et facile à identifier.

L'ouverture associe la mandarine d'Italie et la bergamote à l'essence de géranium, pour une première impression fraîche, un peu verte, qui prépare l'arrivée de la rose.

Le cœur est bâti sur deux roses complémentaires : la rose de Grasse, plus verte et lumineuse, et la rose de Damas, plus ronde et épicée, qui se superposent sans jamais devenir écœurantes. En fond, le musc blanc reste le seul élément, discret, chargé simplement de prolonger la tenue sur la peau.

Ce parfum est pensé pour le printemps et l'été, pour un usage casual ou une journée ordinaire où l'on veut sentir propre et frais. Le flacon de 100 ml est disponible sur maisonnumidia.store, livraison Yalidine dans les 58 wilayas, paiement à la réception.`,
  },
];

function wordCount(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

function countOccurrences(text, needle) {
  const re = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const m = text.match(re);
  return m ? m.length : 0;
}

let allOk = true;
const report = [];

for (const e of entries) {
  const issues = [];
  const shortWc = wordCount(e.shortDescription);
  const descWc = wordCount(e.description);
  const paras = e.description.split(/\n\s*\n/).filter(p => p.trim());

  if (shortWc < 25 || shortWc > 55) issues.push(`shortDescription wc=${shortWc}`);
  if (descWc < 225 || descWc > 305) issues.push(`description wc=${descWc}`);
  if (paras.length < 3 || paras.length > 4) issues.push(`paragraphs=${paras.length}`);

  // count max mentions among nameForCount variants (take the max single variant count, but also check full combined isn't excessive)
  let maxNameCount = 0;
  for (const n of e.nameForCount) {
    const c = countOccurrences(e.description, n);
    if (c > maxNameCount) maxNameCount = c;
  }
  if (maxNameCount > 3) issues.push(`name mentions=${maxNameCount}`);

  for (const bp of BANNED_PHRASES) {
    if (e.description.toLowerCase().includes(bp.toLowerCase()) || e.shortDescription.toLowerCase().includes(bp.toLowerCase())) {
      issues.push(`banned phrase: "${bp}"`);
    }
  }

  // parse check
  try {
    JSON.stringify({slug: e.slug, shortDescription: e.shortDescription, description: e.description, ecritLe: "2026-09-25"});
  } catch (err) {
    issues.push(`JSON stringify error: ${err.message}`);
  }

  report.push({slug: e.slug, shortWc, descWc, paras: paras.length, maxNameCount, issues});
  if (issues.length) allOk = false;
}

console.log(JSON.stringify(report, null, 1));
console.log(allOk ? "ALL_OK" : "HAS_ISSUES");

if (allOk) {
  for (const e of entries) {
    const outPath = path.join(OUT_DIR, `${e.slug}.json`);
    const obj = {
      slug: e.slug,
      shortDescription: e.shortDescription,
      description: e.description,
      ecritLe: "2026-09-25",
    };
    fs.writeFileSync(outPath, JSON.stringify(obj, null, 1) + "\n", 'utf8');
    // verify parse
    JSON.parse(fs.readFileSync(outPath, 'utf8'));
  }
  console.log("WROTE_ALL");
}
