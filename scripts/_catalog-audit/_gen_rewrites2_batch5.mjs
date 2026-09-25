import fs from "fs";
import path from "path";

const outDir = path.resolve("scripts/_catalog-audit/rewrites2");
fs.mkdirSync(outDir, { recursive: true });

const entries = [
{
  slug: "elizabeth-arden-white-tea",
  name: "White Tea",
  shortDescription: "White Tea d'Elizabeth Arden ouvre sur une fraîcheur d'agrumes et de thé blanc, avant de glisser vers un cœur floral tout en douceur. Un sillage léger, pensé pour un usage quotidien, qui convient aux femmes qui cherchent une signature discrète plutôt qu'un parfum qui s'impose.",
  description: `La famille florale thé n'est pas la plus démonstrative de la parfumerie, mais elle a son public : ceux qui préfèrent une eau de toilette qui accompagne la journée sans jamais la dominer. White Tea appartient à cette catégorie. Le flacon de 100 ml en EDT reste léger sur la peau, avec un sillage qui se fait remarquer de près plutôt que de loin.

L'ouverture mise sur la bergamote cristalline et le citron de Calabre, deux agrumes qui donnent l'impression d'un linge frais tout juste sorti du sèche-linge. Le thé blanc arrive presque aussitôt, moins comme une note à part entière que comme une texture : quelque chose de sec, de propre, qui tempère le côté acidulé des agrumes.

Le cœur s'ouvre sur la fleur de camélia et la violette blanche, un duo poudré sans être lourd, complété par un jasmin léger qui reste en retrait. Cette composition florale garde la même intensité du début à la fin, sans montée en puissance marquée. En fond, le musc blanc, l'ambre doux et le cèdre pâle installent une base propre qui prolonge la fraîcheur du départ plutôt que de la contredire.

C'est un parfum de bureau et de tous les jours, pensé pour le printemps et l'été, quand une eau de toilette trop capiteuse devient vite fatigante. Chez Maison Numidia, ce flacon est proposé en version originale, livré par Yalidine dans les 58 wilayas, avec paiement à la réception et droit de refus si le produit ne correspond pas à l'attente.`
},
{
  slug: "evidence-yves-rocher",
  name: "Evidence",
  shortDescription: "Evidence d'Yves Rocher associe l'abricot et la pêche à une rose ronde, pour une eau de parfum fruitée et florale facile à porter. Le format 50 ml en fait un flacon pratique pour un usage quotidien, au bureau comme en dehors.",
  description: `Yves Rocher a construit sa réputation sur des parfums accessibles, portables, sans prétention technique : Evidence en fait partie. C'est une eau de parfum fruitée florale, au format 50 ml, qui n'essaie pas de surprendre mais de plaire directement, dès les premières minutes sur la peau. Sa formule reste simple à lire, ce qui la rend facile à reconnaître même pour quelqu'un qui découvre à peine la parfumerie.

L'ouverture associe l'abricot, la pêche et la bergamote : un trio de fruits mûrs qui donne tout de suite le ton, sucré sans être écœurant, porté par la fraîcheur de l'agrume. Cette entrée en matière est courte, presque immédiate, et laisse rapidement place au cœur.

La rose et la pivoine occupent le centre de la composition, épaulées par un jasmin blanc qui ajoute de la lumière sans alourdir l'ensemble. C'est un accord floral rond, sans aspérités, pensé pour être reconnaissable au premier passage et qui garde une bonne tenue sur la peau. En base, le musc blanc, le cèdre et le bois de santal apportent une tenue discrète, plus une présence qu'un sillage marqué, pensée pour accompagner plutôt que précéder.

Ce flacon convient au quotidien et au bureau, du printemps jusqu'à l'automne, quand une composition trop capiteuse devient vite fatigante à porter toute la journée. C'est aussi un format pratique à offrir, par son prix comme par sa taille compacte. Maison Numidia le propose en version originale, avec livraison Yalidine dans les 58 wilayas et paiement à la réception, sans carte bancaire demandée.`
},
{
  slug: "cartier-la-panthere",
  name: "La Panthère",
  shortDescription: "La Panthère de Cartier joue sur un gardénia charnu porté par des agrumes légers, avant de s'installer sur un fond chypré, mousse de chêne et ambre. Une eau de parfum de soirée, pensée pour les dîners et les occasions où l'on veut un sillage affirmé.",
  description: `Chez Cartier, le gardénia occupe une place particulière : c'est une fleur difficile à rendre naturelle en parfumerie, souvent recréée par accord plutôt qu'extraite directement. La Panthère en fait sa colonne vertébrale, épaulée par la bergamote et le citron qui ouvrent la composition sur une note fraîche et légèrement verte. Le nom de la maison suffit souvent à situer le style : affirmé, sans discrétion excessive.

Cette entrée en matière ne dure pas longtemps : le gardénia revient très vite, cette fois accompagné de jasmin et de musc, pour former un cœur floral charnu, presque crémeux. C'est le moment le plus reconnaissable du parfum, celui qui donne son identité à toute la composition et qui reste perceptible longtemps après l'application.

Le fond marque un virage plus classique, avec la mousse de chêne, l'ambre et un second musc, plus blanc et plus doux que celui du cœur. Cette base chyprée donne du corps à l'ensemble et explique pourquoi la fragrance se prête mieux au soir qu'à une journée de bureau, où un sillage aussi présent serait déplacé.

C'est un parfum pensé pour les dîners et les occasions où l'on sort du registre quotidien, à porter en automne comme au printemps quand les températures permettent un sillage plus présent. Il trouve difficilement sa place l'été, quand la chaleur amplifie déjà les compositions denses. Maison Numidia propose ce flacon de 75 ml en version originale, livré par Yalidine dans les 58 wilayas, paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "acqua-di-parma-colonia",
  name: "Colonia",
  shortDescription: "Colonia d'Acqua di Parma reprend le classique du citron de Sicile et de la lavande, dans un style de cologne italienne sobre et lumineuse. Un format unisexe pensé pour la journée, au bureau comme en dehors, quand la chaleur appelle une fraîcheur simple.",
  description: `La cologne italienne obéit à ses propres règles : peu de matières, une construction simple, et une fraîcheur qui doit tenir sans jamais devenir lourde. Colonia s'inscrit dans cette tradition, avec une formule resserrée autour du citron de Sicile et de la lavande, sans artifice superflu. C'est un format cologne, donc une concentration plus légère qu'une eau de parfum, à réappliquer volontiers au fil de la journée.

L'ouverture est directe : l'agrume domine dès l'application, net et acidulé, avec la lavande qui vient presque aussitôt apporter une facette plus aromatique et légèrement herbacée. C'est une entrée en matière courte, pensée pour donner une impression de propreté immédiate, sans temps mort avant la suite de la composition.

Le romarin prend ensuite le relais, renforçant le côté aromatique, tandis que la rose de Bulgarie et le jasmin apportent une touche florale discrète, presque en retrait derrière les herbes. Le fond reste minimaliste, avec un ambre léger et un musc qui ne cherchent pas à s'imposer : la composition garde sa légèreté du début à la fin, sans jamais chercher à densifier son sillage.

C'est un flacon pensé pour un usage quotidien plutôt que pour une occasion précise, du bureau aux sorties décontractées, particulièrement à l'aise sur les mois chauds du printemps et de l'été. Sa formule unisexe le rend aussi facile à partager qu'à offrir. Maison Numidia le propose en version originale, avec livraison Yalidine dans les 58 wilayas et paiement à la réception.`
},
{
  slug: "dior-homme-sport",
  name: "Homme Sport",
  shortDescription: "Dior Homme Sport ouvre sur un citron vif relevé d'aldéhydes, avant de glisser vers un cœur épicé de poivre rose. Une eau de toilette pensée pour la journée active, entre bureau et sport, dans un registre boisé sans lourdeur.",
  description: `Le nom l'annonce clairement : cette déclinaison de la ligne Dior Homme vise un usage actif plutôt qu'un registre habillé. Homme Sport garde la structure aromatique boisée de la gamme, mais l'allège pour la rendre compatible avec une journée qui bouge, du bureau à l'entraînement. C'est une eau de toilette pensée pour supporter des applications répétées sans devenir écrasante.

L'ouverture combine citron et bergamote sur un fond d'aldéhydes, ce qui donne un effet propre et légèrement métallique, très caractéristique des eaux de toilette conçues pour la fraîcheur immédiate. Cette phase agrume dure un moment avant de laisser place au cœur, sans rupture brutale entre les deux étapes.

L'elemi et le poivre rose prennent alors le relais : le premier apporte une facette résineuse discrète, le second une pointe épicée qui réveille la composition sans la rendre piquante. C'est un cœur court, presque une transition, qui prépare le terrain pour le fond. Les notes boisées, l'ambre et l'oliban ferment la marche avec une base sèche, plus tenue que présence, qui reste propre plutôt que capiteuse.

C'est une eau de toilette de journée, adaptée au bureau comme aux activités physiques, particulièrement à l'aise sur les mois de printemps et d'été quand une fragrance trop dense devient vite pesante. Elle se prête bien à un renouvellement dans l'après-midi, sans jamais saturer l'air ambiant. Chez Maison Numidia, ce flacon de 100 ml est vendu en version originale, livré par Yalidine dans les 58 wilayas, paiement à la réception.`
},
{
  slug: "dior-sauvage-elixir",
  name: "Sauvage Elixir",
  shortDescription: "Sauvage Elixir concentre la ligne Dior dans un extrait de parfum épicé, entre pamplemousse, cannelle et noix de muscade en ouverture. Un flacon de 60 ml pensé pour l'automne et l'hiver, sur les soirées et les dîners où l'on veut un sillage dense.",
  description: `La concentration Parfum change la donne par rapport aux versions EDT et EDP de la ligne Dior Sauvage : la matière est plus dense, plus proche de la peau, et la composition prend une tournure résolument hivernale. Sauvage Elixir s'ouvre sur un accord inhabituel pour la gamme, entre pamplemousse, cannelle et noix de muscade, loin de la fraîcheur attendue d'une entrée de gamme.

Cette entrée en matière est chaleureuse dès les premières minutes : l'agrume s'efface vite derrière les épices, qui donnent le ton pour la suite. Ce n'est pas une ouverture fraîche au sens classique, plutôt une mise en bouche épicée qui annonce un parfum construit pour le froid et les tissus d'hiver.

Le cœur associe la lavande à la réglisse et au poivre de Sichuan, un trio qui garde l'épice au centre de la composition tout en ajoutant une facette aromatique. Le fond, avec le bois de santal, l'ambre et la myrrhe, referme l'ensemble sur une base boisée et résineuse, dense et persistante sur la peau, qui prolonge la sensation de chaleur du début à la fin.

C'est un extrait pensé pour l'automne et l'hiver, sur les soirées et les occasions où l'on assume un sillage marqué, plutôt que pour un usage de bureau. Il demande d'être appliqué avec mesure, la concentration Parfum étant plus généreuse qu'une eau de toilette classique. Maison Numidia le propose en version originale, avec livraison Yalidine dans les 58 wilayas, paiement à la réception et droit de refus si le flacon ne convient pas.`
},
{
  slug: "eau-sauvage-dior",
  name: "Eau Sauvage",
  shortDescription: "Eau Sauvage de Dior mise sur un citron de Calabre vif, relevé de basilic et de pétitgrain, dans un style hespéridé aromatique intemporel. Une eau de toilette légère pour la journée, du bureau aux sorties simples, du printemps à l'automne.",
  description: `Certaines compositions hespéridées ont posé les bases d'un style que la parfumerie masculine reprend encore aujourd'hui. Eau Sauvage appartient à cette catégorie : une structure simple en apparence, construite autour du citron, mais avec une profondeur qui la distingue des colognes ordinaires. C'est un format EDT, donc une eau de toilette légère comparée à un extrait, pensée pour être réappliquée sans excès.

L'ouverture associe le citron de Calabre au basilic, au pétitgrain et au romarin, un ensemble vert et acidulé qui donne une impression de fraîcheur nette, presque tranchante. C'est une entrée en matière courte mais marquante, qui installe tout de suite le ton hespéridé aromatique de la fragrance.

Le cœur surprend davantage : le jasmin et l'hédione apportent une facette florale légère, tandis que l'œillet, la lavande et le vétiver ajoutent de la texture sans alourdir l'ensemble. C'est un cœur complexe pour une eau de toilette qui reste pourtant facile à porter, sans jamais devenir difficile à décrypter. En fond, la mousse de chêne, l'ambre, la civette et le musc installent une base chyprée discrète, qui tient la fragrance sans la rendre capiteuse.

C'est un parfum de journée par excellence, à l'aise au bureau comme dans les sorties simples, du printemps jusqu'à l'automne, un peu moins évident en plein hiver. Maison Numidia propose ce flacon de 100 ml en version originale, avec livraison Yalidine dans les 58 wilayas et paiement à la réception, sans carte bancaire à fournir.`
},
{
  slug: "coco-mademoiselle-chanel",
  name: "Coco Mademoiselle",
  shortDescription: "Coco Mademoiselle de Chanel ouvre sur des agrumes vifs avant de s'installer sur une rose et un jasmin généreux, sur un fond patchouli-vanille. Une eau de parfum polyvalente, du bureau aux occasions plus habillées, portée toute l'année sauf en plein hiver.",
  description: `Peu de compositions oriental floral ont autant marqué l'imaginaire du parfum féminin que celle-ci. Coco Mademoiselle construit son identité sur un contraste : une ouverture d'agrumes lumineuse, suivie d'un cœur floral dense, puis d'un fond patchouli qui ancre l'ensemble dans un registre plus chaud. C'est cette tension entre légèreté et profondeur qui explique sa longévité dans les collections féminines.

L'entrée en matière associe l'orange, la mandarine et la bergamote à la fleur d'oranger, pour un début pétillant et net. Cette phase agrume est courte mais franche, pensée pour capter l'attention avant que la composition ne se transforme progressivement.

Le cœur prend le relais avec la rose de Turquie, le jasmin, le mimosa et l'ylang-ylang : un bouquet floral généreux, sans être écrasant, où chaque note garde sa place. C'est la partie la plus reconnaissable de la fragrance, celle qui définit son style oriental floral. En fond, le patchouli, le musc blanc, la vanille, le vétiver, la fève tonka et l'opoponax forment une base chaude et enveloppante, qui prolonge le sillage bien après l'application.

Cette polyvalence explique pourquoi la fragrance fonctionne aussi bien au bureau que sur des occasions plus habillées, du printemps à l'automne, avec un peu plus de retenue en plein été. Maison Numidia propose ce flacon de 100 ml en version originale, livré par Yalidine dans les 58 wilayas, avec paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "xerjoff-erba-pura",
  name: "Erba Pura",
  shortDescription: "Erba Pura de Xerjoff mise sur un trio d'agrumes siciliens en ouverture, avant un cœur fruité soutenu par une base vanille-musc. Une eau de parfum unisexe, gourmande sans excès, pensée pour le printemps et l'été au quotidien comme en rendez-vous.",
  description: `Xerjoff a construit une partie de sa réputation sur des compositions généreuses, presque gourmandes, et Erba Pura en est un bon exemple accessible dans son catalogue. C'est une eau de parfum unisexe fruitée boisée, pensée pour un usage quotidien plutôt que pour une occasion précise. Son profil reste simple à porter, ce qui en fait une entrée facile dans un catalogue de niche parfois plus exigeant.

L'ouverture rassemble trois agrumes siciliens : l'orange, la bergamote et le citron, tous rattachés à leur terroir sur la fiche olfactive. Le résultat est vif et juteux, presque comme un jus de fruit pressé, loin de la fraîcheur sèche des colognes classiques. Cette phase dure un moment avant que le cœur ne prenne le relais.

Le cœur reste fruité, dans la continuité de l'ouverture, sans note florale ou boisée pour casser cet élan. C'est une composition qui assume sa gourmandise plutôt que de chercher la complexité. En fond, le musc blanc, la vanille de Madagascar et l'ambre viennent adoucir l'ensemble et donner du corps, pour une base ronde plutôt que puissante.

C'est un parfum de printemps et d'été, à l'aise au quotidien comme sur un rendez-vous, quand on cherche un sillage sucré sans être écrasant. Son caractère unisexe le rend aussi facile à partager entre deux personnes. Maison Numidia propose ce flacon de 100 ml en version originale, avec livraison Yalidine dans les 58 wilayas et paiement à la réception, sans carte bancaire demandée.`
},
{
  slug: "roja-dove-elysium",
  name: "Elysium Pour Homme",
  shortDescription: "Elysium Pour Homme de Roja Dove ouvre sur un mélange d'agrumes et de galbanum vert, avant un cœur pomme-muguet épicé de poivre rose. Un extrait de parfum dense, pensé pour les soirées et les dîners, toutes saisons confondues.",
  description: `Les créations Roja Dove visent en général un registre dense et affirmé, loin des compositions légères pensées pour le bureau. Elysium Pour Homme suit cette logique : un extrait de parfum construit sur une structure aromatique fougère classique, mais poussée dans ses proportions les plus riches. C'est un format qui demande peu de sprays pour tenir toute une soirée.

L'ouverture combine le pamplemousse et le citron à l'armoise et au galbanum, un accord vert et légèrement amer qui tranche avec les agrumes plus ronds habituels. C'est une entrée en matière nette, presque austère, qui annonce une composition qui ne cherche pas à plaire immédiatement mais à s'installer durablement.

Le cœur surprend avec la pomme et le muguet, adoucis par le poivre rose, le jasmin et la rose : un ensemble fruité floral inattendu dans une fougère, qui apporte de la texture sans perdre la structure aromatique du départ. Le fond referme l'ensemble avec l'ambre gris, le musc, le cuir, le benjoin, le labdanum et la vanille, une base longue et chaude qui explique la densité du sillage.

C'est un extrait pensé pour les soirées, les dîners et les occasions où l'on veut un parfum qui s'impose, sans restriction de saison particulière, même s'il reste plus à l'aise loin de la chaleur estivale. Maison Numidia propose ce flacon de 100 ml en version originale, avec livraison Yalidine dans les 58 wilayas et paiement à la réception.`
},
{
  slug: "amor-amor-cacharel",
  name: "Amor Amor",
  shortDescription: "Amor Amor de Cacharel rassemble cassis, orange et pamplemousse en ouverture, sur un cœur de rose et d'abricot porté par une base vanille-musc. Une eau de toilette fruitée et gourmande, pensée pour le quotidien et le bureau au printemps et en été.",
  description: `Cacharel a bâti sa gamme Amor sur des compositions fruitées accessibles, sans complexité excessive, et Amor Amor en reste l'exemple le plus connu. C'est une eau de toilette florale orientale fruitée, construite sur une accumulation généreuse d'agrumes et de fruits rouges dès l'ouverture, pensée pour un public plutôt jeune.

Le départ mêle le cassis à l'orange, la mandarine, le pamplemousse, la cassia et la bergamote : une pyramide chargée qui donne un effet de jus de fruits pressé, coloré et immédiat. Cette phase agrume-cassis reste perceptible un moment avant de céder la place au cœur, sans transition brutale.

La rose et l'abricot forment le centre de la composition, épaulés par le jasmin, le lis et le muguet : un bouquet floral fruité qui reste dans la continuité sucrée de l'ouverture plutôt que de la contredire, sans note verte ou boisée pour la casser. En fond, la vanille, la fève tonka, le musc, l'ambre et le cèdre de Virginie installent une base chaude et gourmande, qui adoucit l'ensemble sans l'alourdir et qui prolonge le côté sucré du départ.

C'est une eau de toilette de tous les jours, à l'aise au bureau comme en dehors, particulièrement adaptée au printemps et à l'été, un peu moins évidente sous une chaleur trop forte. Maison Numidia propose ce flacon de 100 ml en version originale, livré par Yalidine dans les 58 wilayas, paiement à la réception et droit de refus si le produit ne convient pas.`
},
{
  slug: "pegasus-parfums-de-marly",
  name: "Pegasus",
  shortDescription: "Pegasus de Parfums de Marly ouvre sur bergamote, néroli et lavande, avant un cœur poudré d'héliotrope et d'iris sur un fond ambré-vanillé. Une eau de parfum polyvalente, du bureau aux occasions plus habillées, portée toute l'année.",
  description: `Parfums de Marly construit ses compositions autour d'un équilibre entre fraîcheur et matières nobles, et Pegasus illustre bien cette approche florale boisée. C'est une eau de parfum qui commence dans un registre clair avant de basculer vers quelque chose de plus poudré et de plus chaud, une trajectoire assez caractéristique de la maison.

L'ouverture associe la bergamote au néroli et à la lavande, un trio qui donne une impression propre et légèrement fleurie, sans lourdeur. Cette phase reste courte, le temps que la composition installe sa transition vers le cœur, sans rupture nette entre les deux étapes.

L'héliotrope, le jasmin et l'iris prennent ensuite le relais, pour un accord poudré caractéristique, presque cosmétique, qui distingue nettement ce parfum des compositions purement boisées ou aromatiques de la même maison. C'est la partie la plus identifiable de la fragrance, celle qui reste en mémoire après le passage des agrumes. En fond, l'ambre, la vanille, le cèdre et le vétiver installent une base chaude et boisée, qui donne de la tenue à l'ensemble sans effacer le côté poudré du cœur ni prendre toute la place.

Cette construction en fait un parfum polyvalent, à l'aise au bureau comme sur des occasions plus habillées, sans restriction de saison particulière, même si le côté ambré s'apprécie un peu plus au frais. Maison Numidia propose ce flacon de 125 ml en version originale, avec livraison Yalidine dans les 58 wilayas et paiement à la réception, sans carte bancaire à fournir.`
}
];

const forbidden = [
  "positionnement tarifaire",
  "piece maitresse d'une collection", "pièce maîtresse d'une collection",
  "parfum d'appoint",
  "reste parfaitement lisible",
  "periode de port privilegiee", "période de port privilégiée",
  "la construction olfactive revele toute sa richesse", "la construction olfactive révèle toute sa richesse",
  "fonctionne dans des contextes tres varies", "fonctionne dans des contextes très variés",
  "sans jamais sembler decale", "sans jamais sembler décalé",
  "plait naturellement a un public algerien", "plaît naturellement à un public algérien",
  "il est grand temps de la decouvrir", "il est grand temps de la découvrir",
  "une fragrance qui dure",
  "il est important de noter",
  "en conclusion",
  "n'hesitez pas", "n'hésitez pas",
  "pour conclure",
  "---",
  "certificat de conformite", "certificat de conformité",
  "nos entrepots", "nos entrepôts",
  "fournisseurs verifies", "fournisseurs vérifiés",
  "coffret d'origine",
  "scelle", "scellé",
  "dedouane", "dédouané",
  "2025"
];

let errors = [];
const results = [];

for (const e of entries) {
  const wc = e.description.trim().split(/\s+/).length;
  const nameCount = e.description.split(e.name).length - 1;
  const lower = (e.shortDescription + "\n" + e.description).toLowerCase();
  const foundForbidden = forbidden.filter(f => lower.includes(f.toLowerCase()));
  const hourClaim = /\b\d+\s*h(eures)?\b/i.test(e.description);
  const starClaim = /★|\/\s*5\b|\d(\.\d)?\s*\/\s*5/.test(e.description);
  const shortWc = e.shortDescription.trim().split(/\s+/).length;

  const entryErrors = [];
  if (wc < 230 || wc > 300) entryErrors.push(`description ${wc} mots (hors 230-300)`);
  if (shortWc < 30 || shortWc > 50) entryErrors.push(`shortDescription ${shortWc} mots (hors 30-50)`);
  if (nameCount > 3) entryErrors.push(`nom cité ${nameCount} fois`);
  if (foundForbidden.length) entryErrors.push(`formules interdites: ${foundForbidden.join(", ")}`);
  if (hourClaim) entryErrors.push(`tenue chiffree en heures detectee`);
  if (starClaim) entryErrors.push(`notation/etoiles detectee`);

  if (entryErrors.length) {
    errors.push(`${e.slug}: ${entryErrors.join(" | ")}`);
  }

  results.push({ slug: e.slug, wc, shortWc, nameCount });

  const payload = {
    slug: e.slug,
    shortDescription: e.shortDescription,
    description: e.description,
    ecritLe: "2026-09-25"
  };
  const filePath = path.join(outDir, `${e.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 1) + "\n", "utf8");

  // verify it parses back
  JSON.parse(fs.readFileSync(filePath, "utf8"));
}

console.log("=== Résultats par fiche ===");
for (const r of results) {
  console.log(`${r.slug}: description=${r.wc} mots, shortDescription=${r.shortWc} mots, nom cité ${r.nameCount}x`);
}

if (errors.length) {
  console.log("\n=== ERREURS ===");
  errors.forEach(e => console.log("❌ " + e));
  process.exitCode = 1;
} else {
  console.log("\n✅ 0 erreur — toutes les contraintes respectées");
}
