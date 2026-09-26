import fs from "node:fs";
import path from "node:path";

const dir = "scripts/_catalog-add/texts";
const today = "2026-09-26";

const items = [
{
  slug: "hermes-voyage-d-parfum",
  shortDescription: "Voyage d'Hermès Parfum ouvre sur la cardamome, le citron d'Amalfi et les baies de genièvre, relevés d'épices, avant de se fondre dans des notes boisées et un musc blanc en fond. Une composition musquée boisée unisexe, pensée pour accompagner le mouvement plutôt que rester statique.",
  description: `Voyage d'Hermès s'inscrit dans la tradition Hermès des parfums pensés comme des objets de voyage, un jus unisexe en concentration Parfum de 100ml, construit dans la famille musc boisé. Il s'adresse à qui veut un sillage discret mais net, capable de suivre aussi bien un vol long-courrier qu'une journée de bureau.

L'ouverture associe la cardamome, le citron d'Amalfi et les baies de genièvre, réchauffés par un accord d'épices. C'est une entrée vive et légèrement poivrée, où l'agrume ne cherche pas à dominer mais sert de porte d'entrée vers le reste de la composition.

Le cœur se resserre sur des notes boisées qui prennent le relais sans rupture brutale, prolongeant la fraîcheur initiale vers quelque chose de plus sec. Le fond de musc blanc referme la composition sur une base propre et proche de la peau, loin des sillages trop appuyés, ce qui explique la réputation de discrétion élégante attachée à ce parfum.

En format Parfum 100ml, Voyage d'Hermès trouve sa place au bureau comme en soirée, au printemps et à l'automne, quand on cherche un boisé musqué qui ne pèse pas. Maison Numidia le propose 100% original, livré par Yalidine dans les 58 wilayas, avec paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-bottled-intense",
  shortDescription: "Boss Bottled Intense revisite le Bottled original dans une version plus épicée : pomme et fleur d'oranger en ouverture, cannelle et clou de girofle au cœur, vanille et santal en fond. Une EDP boisée épicée de 100ml pensée pour les soirées d'automne et d'hiver.",
  description: `Boss Bottled Intense reprend l'architecture du Bottled original mais en pousse l'intensité, avec cette Eau de Parfum de 100ml classée boisé épicé. Elle vise l'homme qui apprécie la structure du Bottled classique mais cherche davantage de densité pour les soirées fraîches.

L'ouverture marie la pomme et la fleur d'oranger, un duo fruité et floral léger qui rappelle le Bottled d'origine sans en reprendre l'aspect trop pommé. C'est une entrée courte, presque une transition vers le cœur plus épicé qui suit.

Le cœur installe la cannelle, le clou de girofle et le géranium, une association chaude et légèrement poivrée qui donne au parfum son caractère intense. Le fond de vanille, santal, cèdre et vétiver referme la composition sur une base boisée dense, où la vanille adoucit le bois sans jamais le sucrer complètement.

Boss Bottled Intense convient aux soirées et aux occasions spéciales, en automne et en hiver, quand la fraîcheur de l'air laisse la place à ce type de compositions plus corsées. Maison Numidia le garantit 100% original, livraison Yalidine dans les 58 wilayas, paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-bottled-elixir",
  shortDescription: "Boss Bottled Elixir s'ouvre sur l'encens et la cardamome, se prolonge par un cœur de patchouli et de vétiver, et se referme sur le labdanum et le cèdre. Un Parfum oriental épicé de 100ml, dense et concentré, réservé aux soirées froides.",
  description: `Boss Bottled Elixir pousse la ligne Bottled vers son extrémité la plus concentrée, avec cette concentration Parfum de 100ml classée oriental épicé. Elle s'adresse à un homme qui n'a pas peur de la densité et cherche un sillage marqué plutôt qu'une fraîcheur discrète.

L'ouverture associe l'encens et la cardamome, un duo fumé et épicé qui installe d'emblée un caractère affirmé, sans note d'agrume pour l'adoucir. Dès les premières minutes, le parfum affiche la profondeur qui le caractérise.

Le cœur poursuit avec le patchouli et le vétiver, deux matières terreuses qui renforcent l'aspect boisé et oriental de la composition. Le fond de labdanum et de cèdre referme l'ensemble sur une base résineuse et sèche, qui prolonge la tenue tout en gardant ce registre sombre du début à la fin.

Boss Bottled Elixir se réserve aux soirées et aux occasions spéciales, à l'automne et en hiver, quand sa concentration prend tout son sens. Maison Numidia le propose 100% original, livré par Yalidine dans les 58 wilayas, avec paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-bottled-pacific",
  shortDescription: "Boss Bottled Pacific mise sur le citron et le sel marin en ouverture, la noix de coco et le cyprès au cœur, avant un fond de bois de santal et de bois de cachemire. Une EDT boisée aromatique de 200ml pensée pour les journées de printemps et d'été.",
  description: `Boss Bottled Pacific décline la ligne Bottled dans un grand format de 200ml, une Eau de Toilette classée boisé aromatique qui vise l'homme cherchant une fraîcheur marine à porter au quotidien plutôt qu'un parfum de circonstance.

L'attaque combine le citron et le sel marin, une association directe qui évoque le bord de mer sans verser dans l'aquatique trop appuyé. C'est une ouverture nette, pensée pour donner un coup de fraîcheur dès la vaporisation.

Le cœur apporte une touche plus douce avec la noix de coco et le cyprès, qui viennent nuancer le côté salin de l'ouverture par une facette plus ronde. Le fond de bois de santal et de bois de cachemire ancre la composition sur une base boisée discrète, qui laisse la fraîcheur initiale se prolonger sans devenir plate.

Boss Bottled Pacific se porte en journée comme au bureau, au printemps et en été, sur un homme qui veut une fraîcheur marine qui tienne au fil des heures. Maison Numidia le livre partout en Algérie via Yalidine, dans les 58 wilayas, avec paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-bottled-oud",
  shortDescription: "Boss Bottled Oud garde la pomme du Bottled original en ouverture, associée aux agrumes, avant un cœur épicé de cannelle, safran et clou de girofle sur fond d'oud, de santal et de cypriol. Une EDP orientale boisée de 100ml qui passe du bureau à la soirée.",
  description: `Avec Boss Bottled Oud, Hugo Boss transpose la structure du Bottled original vers un registre oriental boisé, dans cette Eau de Parfum de 100ml. Le parfum s'adresse à un homme habitué au Bottled classique mais curieux de sa version plus chaude et plus épicée.

L'ouverture reprend la pomme caractéristique de la ligne, associée aux agrumes, pour une entrée reconnaissable qui rappelle immédiatement la famille Bottled avant de bifurquer vers autre chose.

Le cœur change de direction avec la cannelle, le safran, le clou de girofle et le labdanum, un ensemble épicé et résineux qui installe la dimension orientale du parfum. Le fond d'oud, de santal et de cypriol referme la composition sur une base boisée dense, qui donne au parfum sa tenue et son sillage marqué.

Boss Bottled Oud convient au bureau comme à la soirée, au printemps et à l'automne, sur un homme qui aime les compositions boisées avec du caractère. Maison Numidia le garantit 100% original, livraison Yalidine dans les 58 wilayas, paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-bottled-triumph-elixir",
  shortDescription: "Boss Bottled Triumph Elixir construit sa signature autour de trois accords seulement : la feuille de violette en tête, le vétiver au cœur, la feuille de patchouli en fond. Une EDP Intense boisée aromatique de 100ml, épurée et concentrée, pour le bureau comme pour la soirée.",
  description: `Boss Bottled Triumph Elixir joue la carte de l'épure, avec une pyramide réduite à trois accords pour cette Eau de Parfum Intense de 100ml classée boisé aromatique. C'est un parfum pour homme qui préfère une composition resserrée à un empilement de notes, chaque accord ayant ici sa place et son rôle.

L'ouverture repose sur la feuille de violette, une note verte et légèrement poudrée qui tranche avec les entrées plus fruitées habituelles de la ligne Bottled. Elle donne au parfum un départ sobre, presque minéral.

Le cœur de vétiver prend le relais avec sa facette terreuse et légèrement fumée, avant que le fond de feuille de patchouli ne referme la composition sur une base boisée sèche et persistante. Cette construction en trois temps donne à Triumph Elixir une lecture claire, sans notes superflues pour brouiller le message.

Boss Bottled Triumph Elixir se porte au bureau comme en soirée, au printemps et à l'automne, sur un homme qui aime les parfums construits avec économie de moyens. Maison Numidia le propose 100% original, livré par Yalidine dans les 58 wilayas, avec paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-red",
  shortDescription: "Hugo Red ouvre sur la rhubarbe, l'ananas et le pamplemousse, avant de rejoindre directement un fond de musc, de fève tonka et d'ambre. Une EDT fruitée épicée de 75ml, sans étape intermédiaire marquée, pensée pour les soirées d'automne et d'hiver.",
  description: `Hugo Red appartient à la ligne Hugo, plus abordable que Boss, avec cette Eau de Toilette de 75ml classée fruité épicé. Elle s'adresse à un jeune public qui cherche un parfum facile à porter en soirée, sans la lourdeur d'un oriental classique.

L'ouverture surprend par son trio fruité : rhubarbe, ananas et pamplemousse se mêlent pour une entrée acidulée et légèrement sucrée, plus originale que la plupart des fruités du marché. La rhubarbe en particulier apporte une facette un peu verte qui évite l'effet trop confit.

La composition passe ensuite directement à sa base, sans cœur distinct, sur un fond de musc, de fève tonka et d'ambre. Cette base chaude et légèrement gourmande prend le relais peu après l'application et assure la tenue du parfum jusqu'en soirée.

Hugo Red se porte en soirée et pour les occasions spéciales, à l'automne et en hiver, quand on cherche un fruité épicé qui ne manque pas de présence. Maison Numidia le livre dans toute l'Algérie via Yalidine, dans les 58 wilayas, avec paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-element",
  shortDescription: "Boss Element associe des notes aquatiques et des agrumes en ouverture à un cœur de gingembre et de coriandre, sur un fond de cèdre de Virginie et de musc. Une EDT aromatique boisée de 90ml conçue pour les journées de printemps et d'été.",
  description: `Boss Element propose une Eau de Toilette de 90ml dans la famille aromatique boisée, pensée pour un usage quotidien plutôt que pour les grandes occasions. C'est un parfum discret, destiné à l'homme qui veut sentir bon sans que ça se remarque trop.

L'ouverture combine des notes aquatiques et des agrumes, pour une entrée fraîche et légère qui évoque l'eau claire plus que la mer. Rien d'agressif ici, juste une fraîcheur immédiate qui accompagne les premières heures.

Le cœur apporte du relief avec le gingembre et la coriandre, deux notes épicées qui réchauffent légèrement la fraîcheur initiale sans la faire disparaître. Le fond de cèdre de Virginie et de musc referme la composition sur une base boisée propre, qui tient sans devenir envahissante.

Boss Element convient à la journée comme au bureau, au printemps et en été, sur un homme qui privilégie la discrétion. Maison Numidia le garantit 100% original, livraison Yalidine dans les 58 wilayas, paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-femme",
  shortDescription: "Femme de Hugo Boss s'ouvre sur le freesia, la mandarine et le cassis, avant un cœur floral de rose de Bulgarie, de lys et de jasmin. Le fond associe citronnier, abricot et ambre pour une EDP florale fruitée de 75ml, du bureau à la soirée.",
  description: `Hugo Boss signe avec Femme l'un de ses parfums historiques pour femme, une Eau de Parfum de 75ml classée floral fruité. Elle s'adresse à une femme qui aime les compositions florales généreuses, construites autour d'un bouquet de fleurs plutôt que d'une seule note dominante.

L'ouverture associe le freesia, la mandarine et le cassis, un trio à la fois floral et fruité qui donne une entrée lumineuse et légèrement acidulée. Le cassis apporte une pointe de fraîcheur qui évite à l'ensemble de devenir trop sucré dès le départ.

Le cœur déploie un bouquet floral classique avec la rose de Bulgarie, le lys et le jasmin, trois fleurs qui composent ensemble un accord riche et reconnaissable. Le fond de citronnier, d'abricot et d'ambre vient adoucir cette base florale d'une touche fruitée et chaude, pour une tenue qui reste ronde jusqu'au bout.

Femme se porte au bureau comme en soirée, au printemps et à l'automne, sur une femme qui aime les parfums floraux sans excès de sucre. Maison Numidia le propose 100% original, livré par Yalidine dans les 58 wilayas, avec paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-jeans-man",
  shortDescription: "Hugo Jeans Man mise sur le citron vert et le pamplemousse en ouverture, la menthe et les baies de genièvre au cœur, avant un fond de bois de santal et de cèdre. Une EDT boisée aromatique de 75ml, casual, pour les journées de printemps et d'été.",
  description: `Hugo Jeans Man s'inscrit dans la ligne Hugo, plus décontractée que Boss, avec cette Eau de Toilette de 75ml classée boisé aromatique. Le nom donne le ton : un parfum du quotidien, sans prétention, pensé pour accompagner une tenue casual plutôt qu'un costume.

L'ouverture associe le citron vert et le pamplemousse, deux agrumes vifs qui donnent une entrée franche et immédiatement rafraîchissante. C'est le genre de départ qui se sent bien dès le matin, sans avoir besoin de réchauffer sur peau.

Le cœur apporte de la menthe et des baies de genièvre, un duo aromatique qui prolonge la fraîcheur de l'ouverture tout en lui donnant un peu plus de structure. Le fond de bois de santal et de cèdre referme la composition sur une base boisée légère, qui reste présente sans jamais devenir lourde.

Hugo Jeans Man convient à la journée comme au bureau, au printemps et en été, sur un homme qui cherche un parfum simple et facile à porter tous les jours. Maison Numidia le livre dans les 58 wilayas via Yalidine, avec paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-jour-pour-femme",
  shortDescription: "Boss Jour Pour Femme ouvre sur le citron vert et la fleur de pamplemousse, puis déploie un cœur de fleurs blanches, freesia, muguet et chèvrefeuille sur un fond de bouleau et d'ambre. Une EDP florale de 75ml pour le bureau comme pour la soirée.",
  description: `Boss Jour Pour Femme complète le duo Nuit/Jour de Hugo Boss avec une Eau de Parfum de 75ml classée floral, pensée pour l'usage diurne comme son nom l'indique. Elle s'adresse à une femme qui veut un floral lumineux, à porter aussi bien pour travailler que pour sortir le soir.

L'ouverture associe le citron vert et la fleur de pamplemousse, une entrée hespéridée légère qui donne un premier élan frais avant l'arrivée du bouquet floral. Rien de sucré ici, juste une fraîcheur nette qui prépare le terrain.

Le cœur s'ouvre largement sur les fleurs blanches, le freesia, le muguet et le chèvrefeuille, un bouquet dense qui constitue le vrai sujet du parfum. Le fond de bouleau et d'ambre referme la composition sur une base plus sèche et chaude, qui contraste doucement avec la fraîcheur florale du cœur.

Boss Jour Pour Femme se porte au bureau comme en soirée, au printemps et à l'automne, sur une femme qui aime les floraux construits autour d'un vrai bouquet plutôt que d'une note isolée. Maison Numidia le garantit 100% original, livraison Yalidine dans les 58 wilayas, paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-selection",
  shortDescription: "Boss Selection ouvre sur un trio d'agrumes relevé de poivre rose et d'anis étoilé, avant un cœur aromatique de géranium, cardamome, muscade, petitgrain et feuille de cèdre. Le fond, entre vétiver, patchouli et bois de cèdre et de santal, en fait une EDT fougère de 90ml pour le bureau.",
  description: `Boss Selection propose une Eau de Toilette de 90ml construite dans la famille aromatique fougère, une catégorie classique qui privilégie la fraîcheur épicée sur la durée plutôt que l'effet immédiat. Elle vise un homme habitué aux fougères traditionnelles mais qui veut une version plus riche en facettes.

L'ouverture rassemble le pamplemousse, le citron et la mandarine, réchauffés par le poivre rose et l'anis étoilé. C'est une entrée dense pour un aromatique, où l'agrume classique se voit relevé par deux notes plus originales qui évitent l'effet convenu.

Le cœur poursuit sur le géranium, la cardamome, la muscade, le petitgrain et la feuille de cèdre, un ensemble aromatique et légèrement boisé qui donne au parfum son squelette fougère. Le fond de vétiver, de patchouli, de bois de cèdre, de bois de santal et de musc referme la composition sur une base large et boisée, qui assure une bonne tenue sans devenir écrasante.

Boss Selection convient à la journée comme au bureau, au printemps et en été, sur un homme qui aime les fougères construites avec un peu plus de matière que d'habitude. Maison Numidia le propose 100% original, livré par Yalidine dans les 58 wilayas, avec paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-the-collection-silk-jasmine",
  shortDescription: "Silk & Jasmine construit sa pyramide autour de trois accords : le girofle en tête, le jasmin au cœur, le miel et la vanille en fond. Une EDT florale épicée de 50ml, issue de The Collection signée Hugo Boss, pour les soirées d'automne et d'hiver.",
  description: `BOSS The Collection Silk & Jasmine appartient à The Collection, la ligne plus exclusive de Hugo Boss, avec cette Eau de Toilette de 50ml classée floral épicé. Elle s'adresse à un homme qui cherche une composition resserrée autour d'une seule fleur, plutôt qu'un bouquet complexe.

L'ouverture repose sur le girofle seul, une note épicée et légèrement piquante qui donne un départ affirmé, loin des entrées hespéridées habituelles. C'est un choix net, qui annonce d'emblée le caractère du parfum.

Le cœur de jasmin prend ensuite toute la place, une fleur blanche riche et charnue qui devient le vrai sujet de la composition. Le fond de miel et de vanille referme l'ensemble sur une base gourmande et chaude, qui enveloppe le jasmin sans le masquer.

Silk & Jasmine se réserve aux soirées et aux occasions spéciales, à l'automne et en hiver, quand cette densité florale et gourmande trouve sa place. Maison Numidia le garantit 100% original, livraison Yalidine dans les 58 wilayas, paiement à la réception et droit de refus à la livraison.`,
},
{
  slug: "hugo-boss-the-scent-absolute",
  shortDescription: "Boss The Scent Absolute réduit sa pyramide à trois accords : le gingembre en tête, le maninka au cœur, le vétiver en fond. Une EDP orientale épicée de 100ml, épurée et concentrée, qui prolonge la ligne The Scent vers un registre plus sombre.",
  description: `Boss The Scent Absolute pousse la ligne The Scent vers une version plus concentrée et plus sombre, avec cette Eau de Parfum de 100ml classée oriental épicé. Elle s'adresse à un homme déjà familier de The Scent mais qui cherche une intensité supérieure pour les soirées froides.

L'ouverture repose sur le gingembre seul, une note épicée et vive qui tranche avec la douceur habituelle des ouvertures Boss. C'est un départ direct, sans agrume pour l'adoucir.

Le cœur de maninka prend le relais avec une facette plus douce et légèrement fruitée, avant que le fond de vétiver ne referme la composition sur une base sèche et terreuse. Cette construction en trois temps, sans surcharge de notes, donne à Absolute une lecture claire du début à la fin.

Boss The Scent Absolute se réserve aux soirées et aux occasions spéciales, à l'automne et en hiver, sur un homme qui aime les orientaux épicés concentrés. Maison Numidia le propose 100% original, livré par Yalidine dans les 58 wilayas, avec paiement à la réception et droit de refus à la livraison.`,
},
];

let written = 0;
let skipped = 0;
const wordCounts = [];

for (const item of items) {
  const filePath = path.join(dir, `${item.slug}.json`);
  if (fs.existsSync(filePath)) {
    console.log("SKIP (existe déjà):", item.slug);
    skipped++;
    continue;
  }
  const obj = {
    slug: item.slug,
    shortDescription: item.shortDescription,
    description: item.description,
    ecritLe: today,
  };
  const json = JSON.stringify(obj, null, 1) + "\n";
  // sanity: re-parse
  JSON.parse(json);
  fs.writeFileSync(filePath, json, "utf8");
  written++;
  const shortWords = item.shortDescription.trim().split(/\s+/).length;
  const descWords = item.description.trim().split(/\s+/).length;
  const paras = item.description.split(/\n\n/).length;
  wordCounts.push({ slug: item.slug, shortWords, descWords, paras });
  console.log("OK:", item.slug, "short:", shortWords, "words | desc:", descWords, "words |", paras, "paragraphes");
}

console.log("\nTotal écrits:", written, "| sautés:", skipped);
