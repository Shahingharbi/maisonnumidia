// Script temporaire agent 6 - genere les rewrites2/*.json pour les entrees 60-71
// A supprimer apres usage (pas un script permanent du repo)
import fs from "fs";

const entries = [
{
 slug: "gris-dior",
 name: "Gris Dior",
 shortDescription: "Gris Dior mise sur un accord floral boisé chypré construit autour de la rose de Damas et du vétiver, loin des sillages sucrés habituels chez la même maison. Un parfum unisexe pensé pour un porteur qui préfère les compositions sèches et minérales aux versions gourmandes.",
 description: `Dans la famille florale boisée chyprée, Gris Dior se distingue par un traitement sec de la rose, loin des versions sucrées qu'on trouve ailleurs chez la même maison. La composition en eau de parfum, en flacon de 125 ml, s'adresse aussi bien aux hommes qu'aux femmes : la structure ne cherche pas à marquer un genre, elle joue sur la texture plutôt que sur la douceur.

L'ouverture associe la bergamote, la mandarine et le gingembre, un trio d'agrumes réchauffé par une pointe épicée qui évite l'effet eau de Cologne classique. Le départ est vif sans être acidulé, avec ce grain un peu poivré du gingembre qui annonce déjà la suite, plus sèche.

Le cœur s'installe autour de la rose de Damas, soutenue par le jasmin de Grasse et le lilas, deux notes florales qui adoucissent la rose sans la rendre poudrée. En fond, le vétiver et le cèdre de Virginie apportent la matière boisée qui structure le parfum, complétés par l'oakmoss qui referme la composition sur une note chyprée, verte et un peu terreuse.

Ce profil convient au bureau comme à des occasions plus habillées, et se porte toute l'année sans dépendre d'une saison précise. Il séduira ceux qui cherchent une alternative aux compositions florales trop sucrées, avec un net penchant pour les textures sèches et boisées. Maison Numidia le propose en flacon de 125 ml, livré dans les 58 wilayas via Yalidine, paiement à la réception et droit de refus à la livraison.`
},

{
 slug: "kalemat-arabian-oud",
 name: "Kalemat",
 shortDescription: "Kalemat associe la rose et l'oud dans un style oriental boisé dense, porté par l'ambre et le santal en fond. Une composition pensée pour les grandes occasions, qui conviendra à qui aime les sillages marqués sans passer par le sucré.",
 description: `Arabian Oud construit Kalemat autour d'un duo classique du genre oriental boisé : la rose et l'oud, traités ici sans les couches gourmandes qu'on trouve souvent dans ce registre. En eau de parfum, flacon de 100 ml, le résultat s'adresse à un porteur ou une porteuse qui n'a pas peur d'un sillage affirmé, loin des versions plus douces de ce même style.

Dès l'ouverture, la bergamote et les agrumes apportent une fraîcheur brève, vite rejointe par la rose qui prend le dessus. Ce départ agrume-rose donne un premier repère net, avant que la composition ne s'enfonce dans des matières plus sombres. Cette entrée reste courte, sans excès d'agrumes, pour laisser vite la place à la partie florale et boisée qui structure l'ensemble.

Le cœur associe l'oud, le patchouli et le bois de rose, trois notes qui installent la dimension boisée et un peu fumée typique de ce style. En fond, l'ambre, le musc, le santal et les bois sombres prolongent cette profondeur sur la durée, sans note sucrée pour l'adoucir : le résultat reste sec et minéral jusqu'au bout, avec une montée en puissance progressive plutôt qu'un accord figé.

Ce type de sillage trouve naturellement sa place pour un mariage ou une réunion de famille, mais se porte aussi au quotidien par ceux qui aiment les compositions denses. Toutes les saisons lui conviennent, la chaleur de l'oud et de l'ambre compensant même en climat frais. Le format 100 ml en fait un choix pratique pour un usage répété, pas seulement pour une occasion isolée. Maison Numidia livre ce flacon dans les 58 wilayas, paiement à la réception et droit de refus à la livraison.`
},

{
 slug: "bvlgari-pour-femme",
 name: "Pour Femme",
 shortDescription: "Pour Femme de Bvlgari construit un accord floral boisé autour de l'iris et de la rose de Bulgarie, avec une base ambrée et vanillée qui prolonge le sillage. Une composition dense, pensée pour une femme qui aime les parfums élaborés plutôt que les versions simples.",
 description: `Bvlgari signe avec Pour Femme une composition florale boisée à la pyramide particulièrement fournie, en eau de parfum et flacon de 100 ml. Le nombre de notes utilisées, de l'ouverture au fond, donne un profil qui évolue longuement plutôt qu'un accord simple répété du début à la fin, avec plusieurs strates à distinguer.

L'ouverture mêle la violette, l'œillet, la framboise et la pêche à un ensemble plus aromatique porté par la coriandre, la fleur d'oranger, le poivre du Sichuan et la bergamote. Cette accumulation crée un départ à la fois fruité et légèrement épicé, loin d'un accord agrume classique. Peu de compositions du genre florale boisée ouvrent sur un éventail aussi large de facettes dès les premières minutes.

Le cœur se recentre sur l'iris et la rose de Bulgarie, accompagnés de l'héliotrope, de la racine d'iris, du jasmin d'Égypte et du muguet : un bouquet floral dense qui reste la colonne vertébrale du parfum. En fond, le musc, le thé vert, le bois de santal, la vanille, l'ambre, le benjoin, le styrax et le cèdre construisent une base boisée et ambrée qui porte la fragrance sur la durée, sans qu'une seule matière ne domine les autres.

Cette référence ne fait plus partie de l'assortiment actuel, mais elle reste identifiable pour qui l'a déjà portée : un profil pensé pour le bureau ou des occasions plus formelles, au printemps comme à l'automne. Sa richesse en notes en fait une composition plus travaillée que la moyenne, appréciée de celles qui préfèrent les parfums floraux élaborés aux versions minimalistes et courtes en notes.`
},

{
 slug: "armani-acqua-di-gioia",
 name: "Acqua di Gioia",
 shortDescription: "Acqua di Gioia joue sur une fraîcheur aquatique et florale, portée par le citron d'Amalfi et la menthe, avant de se poser sur un fond plus doux au sucre roux. Un parfum simple et lumineux, pensé pour un usage quotidien plutôt que pour une occasion précise.",
 description: `Giorgio Armani construit Acqua di Gioia sur une structure courte et lisible, typique de la famille aquatique florale. En eau de parfum, flacon de 100 ml, la composition ne cherche pas la complexité mais une fraîcheur immédiate qui reste identifiable du premier au dernier stade, sans détour inutile.

L'ouverture associe le citron d'Amalfi à la menthe, un duo qui installe un départ vif et légèrement mentholé, assez éloigné des agrumes sucrés qu'on trouve dans d'autres parfums d'été. Cette fraîcheur initiale est courte, la composition étant pensée pour glisser vite vers son cœur plutôt que de s'attarder sur l'effet citronné.

Le jasmin aquatique porte à lui seul le cœur du parfum, une note florale traitée de façon transparente plutôt que capiteuse, qui prolonge l'esprit marin de l'ouverture sans rupture nette. En fond, le cèdre de Virginie, le sucre roux et le labdanum apportent une chaleur discrète qui évite au parfum de rester trop plat sur la durée, sans pour autant alourdir l'ensemble.

Ce profil convient à un usage quotidien, du matin à une sortie à la plage, et se porte surtout au printemps et en été quand la fraîcheur citronnée prend tout son sens. Il s'adresse à celles qui cherchent un parfum simple à porter, sans effort de composition à décoder ni sillage trop appuyé. Maison Numidia propose ce flacon de 100 ml, livré partout en Algérie via Yalidine, paiement à la réception et droit de refus à la livraison.`
},

{
 slug: "jimmy-choo-blossom",
 name: "Blossom",
 shortDescription: "Blossom associe la framboise et la rose dans un accord floral fruité léger, avec le pois de senteur en soutien et le santal en fond. Un parfum de jour, facile à porter, qui parlera à qui aime les sillages fruités sans excès de sucre.",
 description: `Jimmy Choo décline avec Blossom une version plus lumineuse de son style floral fruité habituel, en eau de toilette, flacon de 100 ml. La composition reste courte et directe, pensée pour un usage de tous les jours plutôt que pour une occasion précise, sans étages superflus.

Dès l'ouverture, les fruits rouges, portés par une note de framboise, se mêlent aux agrumes pour un départ à la fois sucré et frais. Ce duo installe immédiatement le ton fruité de la composition sans tomber dans l'excès de sucre qu'on retrouve dans d'autres parfums du genre. Le passage vers le cœur se fait sans à-coup, dans la continuité de cette première impression.

Le cœur associe le pois de senteur et la rose, un mariage floral qui apporte de la légèreté et un aspect presque poudré sans être lourd. En fond, le bois de santal et le musc blanc referment la composition sur une base propre, qui prolonge le sillage sans le charger ni l'alourdir sur la peau.

Ce type de profil convient au bureau et à un usage de journée, avec une préférence marquée pour le printemps et l'été où la fraîcheur fruitée trouve sa place naturelle. Il conviendra à une porteuse qui cherche un parfum simple, agréable au quotidien, sans besoin d'un sillage imposant. Maison Numidia livre ce flacon de 100 ml dans les 58 wilayas, paiement à la réception et droit de refus à la livraison.`
},

{
 slug: "gucci-pour-homme-ii",
 name: "Pour Homme II",
 shortDescription: "Pour Homme II mêle le thé noir et les épices à une base tabac et myrrhe, dans un style boisé épicé assez sec. Un parfum d'homme au caractère affirmé, plus proche d'une composition atypique que d'un boisé classique.",
 description: `Gucci propose avec Pour Homme II une composition boisée épicée assez éloignée des standards masculins habituels, en eau de toilette, flacon de 100 ml. La feuille de violette dès l'ouverture donne le ton d'un parfum qui préfère les associations inattendues aux accords convenus, presque à contre-courant du genre.

L'ouverture mêle justement cette feuille de violette à la bergamote, un duo qui apporte à la fois une fraîcheur verte et une pointe d'agrume, sans que l'accord ne s'attarde longtemps avant de laisser place au cœur. Ce départ reste discret, presque une transition plutôt qu'un temps fort à lui seul.

Le thé noir domine le cœur, accompagné de la cannelle et du piment de la Jamaïque : un trio épicé et légèrement fumé qui installe le caractère principal de la composition. En fond, la feuille de tabac, la myrrhe, le musc et l'olivier apportent une base sèche et boisée, loin des accords ambrés sucrés fréquents dans cette famille olfactive.

Ce profil se porte au bureau comme dans un cadre plus sportif, et convient particulièrement au printemps et à l'été où sa sécheresse évite l'effet trop lourd. Il s'adresse à un porteur curieux, prêt à sortir des sentiers battus du boisé épicé classique, loin des valeurs sûres de la même famille. Maison Numidia propose ce flacon de 100 ml, livré dans toute l'Algérie, paiement à la réception et droit de refus à la livraison.`
},

{
 slug: "kenzo-world",
 name: "Kenzo World",
 shortDescription: "Kenzo World s'ouvre sur des fruits rouges avant de se poser sur la pivoine et le jasmin égyptien, avec l'ambroxan qui donne une traîne moderne en fond. Une composition florale fruitée pensée pour un usage large, du bureau à la soirée.",
 description: `Kenzo signe avec Kenzo World une composition florale fruitée qui joue sur le contraste entre un départ gourmand et un fond plus sec porté par l'ambroxan. En eau de parfum, flacon de 75 ml, la structure reste volontairement simple, avec peu de notes mais bien dosées, sans surcharge inutile.

Les fruits rouges ouvrent la composition sur un registre gourmand et immédiat, sans note d'agrume pour l'alléger : c'est un départ franc, pensé pour capter l'attention dès les premières minutes. Peu de transition adoucit ce passage, ce qui donne un profil facile à reconnaître dès l'application.

Le cœur associe la pivoine à des notes florales plus larges et au jasmin égyptien, un ensemble qui adoucit le sucré de l'ouverture tout en gardant une dimension florale reconnaissable. En fond, l'ambroxan seul referme la composition sur une note propre et boisée-musquée, très présente dans les parfums récents de ce type et responsable d'un sillage qui tient sur la durée.

Ce sillage se porte aussi bien au bureau qu'en soirée, dans un registre plutôt décontracté, et ne dépend d'aucune saison en particulier. Il conviendra à une porteuse qui aime les parfums modernes, avec un départ marqué et un fond plus discret. Maison Numidia livre ce flacon de 75 ml partout en Algérie, paiement à la réception et droit de refus à la livraison.`
},

{
 slug: "spicebomb-infrared",
 name: "Spicebomb Infrared",
 shortDescription: "Spicebomb Infrared reprend l'accord épicé de la gamme avec du poivre rouge et de la cannelle, sur un fond de bois ambré et de vétiver plus sombre que l'original. Un parfum d'homme pensé pour le soir et les mois froids.",
 description: `Viktor & Rolf décline avec cette version une variante plus intense de sa gamme épicée, en eau de toilette, flacon de 90 ml. Le nom du parfum annonce la couleur : une composition dense, construite pour un usage nocturne plutôt que pour la journée, sans chercher la discrétion.

L'ouverture associe le poivre rouge, la cannelle de Ceylan et le piment, un trio épicé qui frappe fort dès les premières minutes. Ce départ chaud et légèrement piquant reste la signature la plus immédiate de cette composition, avant que le cœur ne prenne le relais.

Le cœur poursuit sur le tabac blond et des notes de bois enflammé, complétées par des accents épicés supplémentaires qui prolongent l'intensité de l'ouverture sans rupture nette. En fond, le bois ambré, le vétiver et un musc plus sombre installent une base tenace, cohérente avec l'esprit chaud de l'ensemble et construite pour durer sur la peau.

Ce profil trouve sa place en soirée ou en sortie de nuit, et convient surtout à l'automne et à l'hiver où sa chaleur épicée prend tout son sens. Il s'adresse à un porteur qui aime les compositions marquées, loin des boisés discrets et des sillages trop sages. Maison Numidia propose ce flacon de 90 ml, livré dans les 58 wilayas, paiement à la réception et droit de refus à la livraison.`
},

{
 slug: "swiss-arabian-kashkha",
 name: "Kashkha",
 shortDescription: "Kashkha mêle la pomme et la cannelle à un cœur d'oud et de safran, sur une base boisée ambrée assez classique du registre oriental. Un parfum dense, pensé pour une porteuse qui aime les sillages épicés au quotidien comme en soirée.",
 description: `Swiss Arabian construit Kashkha sur une pyramide oriental épicé fournie, en eau de parfum, flacon de 75 ml. Le contraste entre un départ fruité et un cœur nettement plus épicé donne à la composition un profil qui évolue vite après application.

L'ouverture associe la pomme, la cannelle et la bergamote, un trio qui mêle fraîcheur fruitée et pointe chaude dès les premières minutes. Ce départ reste court, la composition étant construite pour glisser rapidement vers des notes plus profondes.

Le cœur rassemble l'oud, le souci, le safran, la cardamome et le clou de girofle, un ensemble épicé et légèrement fumé qui constitue le centre de gravité du parfum. En fond, le cèdre, le bois de santal, le musc, l'ambre, le vétiver et le chêne construisent une base boisée dense qui prolonge le sillage.

Cette composition se porte aussi bien au quotidien qu'en soirée, dans un registre décontracté malgré la richesse de sa pyramide, et convient à toutes les saisons grâce à la chaleur de ses épices. Elle s'adresse à celles qui apprécient les parfums orientaux construits, avec beaucoup de matière plutôt qu'un accord unique. Maison Numidia livre ce flacon dans toute l'Algérie, paiement à la réception et droit de refus à la livraison.`
},

{
 slug: "jimmy-choo-illicit",
 name: "Illicit",
 shortDescription: "Illicit associe le jasmin Sambac et la fleur d'oranger à une base gourmande de miel, caramel et vanille, dans un style floral fruité assez dense. Un parfum de soirée, pensé pour les mois froids et un usage plutôt nocturne.",
 description: `Jimmy Choo signe avec Illicit une composition florale fruitée gourmande, en eau de parfum, flacon de 100 ml. La base sucrée en fond distingue nettement ce parfum des autres compositions plus légères de la maison, avec une présence qui se remarque.

L'ouverture mêle le gingembre à la bigarade, un duo à la fois chaud et légèrement amer qui évite un départ trop sucré malgré l'orientation générale du parfum. Ce contraste installe une première impression plus complexe qu'attendu.

Le cœur associe le jasmin Sambac, la fleur d'oranger et la rose, un bouquet floral blanc assez dense qui prend le relais de l'ouverture. En fond, le miel, l'ambre, le caramel, la vanille, le bois de santal et le bois de cachemire construisent une base gourmande et enveloppante, le point fort de cette composition.

Ce profil se porte surtout en soirée ou en sortie nocturne, et convient particulièrement à l'automne et à l'hiver quand sa richesse gourmande prend tout son sens. La composition s'adresse à une porteuse qui n'a pas peur des bases sucrées marquées. Maison Numidia livre ce flacon de 100 ml dans les 58 wilayas, paiement à la réception et droit de refus à la livraison.`
},

{
 slug: "anna-sui-dolly-girl",
 name: "Dolly Girl",
 shortDescription: "Dolly Girl ouvre sur le melon et la pomme avant de glisser vers un cœur de rose et de violette, sur un fond fruité de framboise et de fraise. Un parfum léger et coloré, pensé pour un usage de journée au printemps et en été.",
 description: `Anna Sui construit Dolly Girl sur une pyramide floral fruité assez fournie, en eau de toilette, flacon de 75 ml. Le nombre de notes présentes à chaque étape donne une composition qui change sensiblement entre l'ouverture et le fond, plutôt qu'un accord unique répété.

L'ouverture associe le melon, la pomme, la bergamote et la cannelle, un mélange à la fois fruité et légèrement épicé qui installe un départ enjoué et facile à identifier. Cette combinaison reste l'une des plus reconnaissables de la composition.

Le cœur rassemble la rose, le magnolia, la violette, le muguet et le jasmin, un bouquet floral dense qui adoucit le côté fruité de l'ouverture. En fond, la framboise, le bois de teck, la fraise, le musc, le vétiver et l'ambre referment la composition sur une base à la fois fruitée et légèrement boisée.

Ce profil convient à un usage de journée, plutôt décontracté, et trouve sa place naturellement au printemps et en été. Il s'adresse à une porteuse qui aime les parfums fruités sans en faire une composition sérieuse ou trop travaillée. Maison Numidia propose ce flacon de 75 ml, livré partout en Algérie, paiement à la réception et droit de refus à la livraison.`
},

{
 slug: "l-eau-d-issey-homme",
 name: "L'Eau d'Issey Pour Homme",
 shortDescription: "L'Eau d'Issey Pour Homme joue sur une fraîcheur aquatique et boisée, entre yuzu, lotus et sauge marine à l'ouverture, puis santal et cèdre en fond. Un parfum de tous les jours, pensé pour un porteur qui aime les sillages nets et propres.",
 description: `Issey Miyake construit ce parfum sur un registre aquatique boisé, en eau de toilette, flacon de 125 ml. La composition reste fidèle à l'esprit d'origine de la maison, avec une fraîcheur marine traitée de façon plus sèche que dans d'autres compositions du genre.

L'ouverture associe le yuzu, le lotus aquatique et la sauge marine, un trio qui installe un départ vif et légèrement salin, loin des agrumes sucrés qu'on trouve ailleurs. Cette fraîcheur initiale reste courte, la structure étant pensée pour évoluer vite vers un cœur plus épicé.

Le cœur mêle la coriandre, la muscade et le lilas d'eau, un ensemble qui prolonge la dimension aquatique tout en amenant une facette plus chaude et légèrement poivrée. En fond, le musc, le bois de santal, le cèdre et l'ambre apportent une base boisée discrète qui ferme la composition sans excès de lourdeur.

Ce profil convient au bureau comme à un usage de journée plus décontracté, et se porte surtout au printemps et en été quand la fraîcheur aquatique trouve sa place naturelle. Il s'adresse à un porteur qui recherche un parfum propre et facile à porter, sans sillage envahissant. Maison Numidia livre ce flacon de 125 ml dans les 58 wilayas, paiement à la réception et droit de refus à la livraison.`
},
];

const forbidden = [
  "positionnement tarifaire",
  "pièce maîtresse d'une collection",
  "parfum d'appoint",
  "reste parfaitement lisible",
  "période de port privilégiée",
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
  "---",
  "certificat de conformité",
  "nos entrepôts",
  "fournisseurs vérifiés",
  "coffret d'origine",
  "scellé",
  "dédouané",
  "2025",
];

let allOk = true;
const outDir = "C:/Users/superindep/maisonnumidia/scripts/_catalog-audit/rewrites2";

for (const e of entries) {
  const descWords = e.description.trim().split(/\s+/).length;
  const shortWords = e.shortDescription.trim().split(/\s+/).length;
  const paras = e.description.trim().split(/\n\n+/).length;
  const nameCount = (e.description.match(new RegExp(e.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length;

  let issues = [];
  if (descWords < 230 || descWords > 300) issues.push(`desc words=${descWords}`);
  if (shortWords < 30 || shortWords > 50) issues.push(`short words=${shortWords}`);
  if (paras < 3 || paras > 4) issues.push(`paragraphs=${paras}`);
  if (nameCount > 3) issues.push(`name count=${nameCount}`);

  const lowerFull = (e.description + " " + e.shortDescription).toLowerCase();
  for (const f of forbidden) {
    if (lowerFull.includes(f.toLowerCase())) issues.push(`forbidden: "${f}"`);
  }
  if (/\d+\s*h(eures)?\b/i.test(e.description)) issues.push("hour-based tenue claim");
  if (/★|☆|\d\s*\/\s*5/.test(e.description)) issues.push("stars/rating");

  if (issues.length) {
    allOk = false;
    console.log(`❌ ${e.slug}: ${issues.join(" | ")}`);
  } else {
    console.log(`✅ ${e.slug}: desc=${descWords}w short=${shortWords}w paras=${paras} nameCount=${nameCount}`);
  }

  const payload = {
    slug: e.slug,
    shortDescription: e.shortDescription,
    description: e.description,
    ecritLe: "2026-09-25"
  };
  fs.writeFileSync(`${outDir}/${e.slug}.json`, JSON.stringify(payload, null, 1) + "\n", "utf8");
}

console.log(allOk ? "\n✅ TOUT OK" : "\n⚠️ CORRECTIONS NECESSAIRES");
