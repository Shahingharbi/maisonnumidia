import fs from "fs";
import path from "path";

const outDir = "C:/Users/superindep/maisonnumidia/scripts/_catalog-audit/rewrites2";

const entries = [
{
  slug: "paco-rabanne-pour-homme",
  name: "Pour Homme",
  shortDescription: "Paco Rabanne Pour Homme est un fougère aromatique bâti sur le romarin, la lavande et la mousse de chêne, avec un fond tabac-miel qui lui donne du grain. Pensé pour un usage quotidien, il convient à qui cherche une signature discrète et sans excès de sucrosité.",
  description: `Paco Rabanne Pour Homme appartient à la famille des fougères aromatiques, cette association lavande-mousse de chêne qui a longtemps défini le parfum masculin classique. Ici, la sauge sclarée et le bois de rose brésilien adoucissent l'ouverture et évitent l'effet savon que ce type de composition peut produire. Le résultat reste identifiable dès les premières minutes, sans détour ni fioriture inutile.

Les premières minutes sont dominées par un romarin net, presque camphré, épaulé par la sauge sclarée qui apporte une facette aromatique légèrement herbacée. Le bois de rose brésilien arrondit l'ensemble sans le sucrer et prépare la transition vers un cœur plus feutré. Cette ouverture assez sèche convient à qui n'aime pas les départs trop fruités ou trop sucrés.

Le cœur associe la lavande à un géranium légèrement poivré et à la fève tonka, qui annonce déjà le sillage final. En fond, la mousse de chêne retrouve sa texture terreuse, contrebalancée par le miel et un musc discret ; le tabac ajoute une pointe sèche qui distingue cette composition des fougères plus lisses ou plus aseptisées. Cette base tient la longueur sans devenir écrasante au fil des heures.

C'est un parfum de bureau et de quotidien, taillé pour accompagner une journée de travail sans devenir envahissant, quelle que soit la saison. Il conviendra à ceux qui préfèrent une odeur reconnaissable plutôt qu'une composition qui cherche sans cesse à surprendre. Maison Numidia le propose en flacon de 100 ml, livré par Yalidine dans les 58 wilayas, paiement à la réception et droit de refus si le produit ne convient pas.`
},
{
  slug: "ysl-rive-gauche",
  name: "Rive Gauche",
  shortDescription: "YSL Rive Gauche est un floral aldéhydé structuré, entre agrumes frais et bouquet de rose, muguet et jasmin sur un fond d'iris poudré et de vétiver. Un parfum pour femmes qui aiment les compositions nettes, portées aussi bien au bureau que pour une occasion habillée.",
  description: `YSL Rive Gauche fait partie des floraux aldéhydés qui ont marqué la parfumerie du XXe siècle, avec cette texture pétillante propre aux aldéhydes associés aux agrumes. La composition ne cherche pas la douceur immédiate : elle s'impose d'abord par sa netteté avant de se livrer pleinement. Son nom même évoque une élégance parisienne un peu austère, loin des floraux sucrés d'aujourd'hui.

L'ouverture combine l'aldéhyde à la bergamote et au citron, pour un départ frais et légèrement effervescent. Cette entrée en matière, un peu vive, s'estompe progressivement pour laisser place au cœur floral. Elle donne au parfum une allure presque architecturée, où chaque étape reste distincte de la suivante.

La rose, le muguet et le jasmin composent un bouquet dense, soutenu par l'iris qui apporte de la froideur et de la tenue. En fond, l'iris poudré revient sous une forme plus sèche, accompagné du musc et du vétiver qui ancrent l'ensemble sans alourdir la silhouette générale. Cette base légèrement poudrée prolonge le parfum plusieurs heures sans en changer le caractère.

Son profil aldéhydé, plus formel que les compositions fruitées actuelles, le destine au bureau et aux occasions habillées, en toute saison. Il s'adresse à celles qui recherchent une structure classique plutôt qu'une tendance du moment. Chez Maison Numidia, il est disponible en flacon de 100 ml, livraison Yalidine vers les 58 wilayas et paiement à la réception avec droit de refus.`
},
{
  slug: "chloe-see-by-chloe",
  name: "See by Chloé",
  shortDescription: "See by Chloé associe la fleur de pommier et la bergamote à un cœur jasmin-ylang-ylang, sur un fond doux de musc, bois de santal et vanille. Un floral fruité léger, pensé pour un usage quotidien du printemps à l'été.",
  description: `See by Chloé décline en version plus abordable et plus fraîche l'esprit floral de la maison Chloé, avec une matière moins dense que ses aînées mais tout aussi soignée dans sa construction. C'est une eau de parfum pensée pour accompagner les journées ordinaires plutôt que les grandes occasions, sans jamais perdre en cohérence. Elle s'adresse à celles qui veulent un floral facile à porter, sans y réfléchir chaque matin.

L'ouverture joue sur la fleur de pommier et la bergamote, un accord croquant qui installe d'emblée une fraîcheur fruitée sans acidité excessive. Cette entrée légère laisse rapidement place aux notes florales du cœur, dans une transition assez douce pour ne pas surprendre. Rien ici ne cherche à marquer les esprits dès les premières secondes.

Le jasmin et l'ylang-ylang forment un accord blanc, charnu mais pas entêtant, porté par un fond de musc, de bois de santal et de vanille. Cette base reste discrète : elle apporte de la rondeur sans transformer la composition en parfum gourmand, et laisse le floral respirer jusqu'au bout. Le sillage qui en résulte reste proche de la peau plutôt qu'expansif.

Sa légèreté générale en fait un choix logique pour le quotidien et le bureau, particulièrement au printemps et en été, période où sa fraîcheur fruitée s'exprime le mieux. Il conviendra à celles qui portent leur parfum tous les jours et préfèrent une matière discrète à une signature trop marquée. La boutique le propose en flacon de 75 ml, avec livraison Yalidine dans les 58 wilayas, paiement à la réception et droit de refus si le flacon ne correspond pas à l'attente.`
},
{
  slug: "cool-water-woman",
  name: "Cool Water Woman",
  shortDescription: "Cool Water Woman ouvre sur un accord melon aquatique et agrumes, avant un cœur floral de lilas, jasmin et lotus sur fond de musc blanc et cèdre. Une eau de toilette fraîche, adaptée aux journées actives du printemps et de l'été.",
  description: `Davidoff a construit Cool Water Woman comme le pendant féminin de son eau aquatique pour homme, en gardant cette signature marine mais en l'habillant de fleurs plus tendres. Le résultat reste résolument frais, loin des compositions sucrées ou trop denses qui dominent parfois ce segment. C'est un parfum pensé pour se sentir léger plutôt que pour marquer un territoire.

L'ouverture associe le melon aquatique à une rose fraîche et à des agrumes, pour un départ vif qui évoque directement l'eau. Cette facette aquatique traverse toute la composition sans jamais disparaître complètement, même une fois le cœur floral installé, ce qui donne une cohérence à l'ensemble du parfum.

Le cœur déploie le lilas, le jasmin, le muguet et le lotus, un bouquet blanc qui reste léger malgré le nombre de notes réunies. En fond, le musc blanc et le cèdre apportent de la tenue, tandis que l'ambre ajoute une chaleur discrète qui empêche la fraîcheur de tourner au froid pur. Le résultat reste net du début à la fin de son parcours sur la peau.

Sa structure aquatique et florale convient au bureau comme aux activités sportives, surtout au printemps et en été où ce type de parfum s'exprime le mieux. Il reste une option simple pour qui veut une fraîcheur nette sans complexité excessive, ni note trop sucrée. Maison Numidia le propose en flacon de 100 ml, livraison Yalidine dans les 58 wilayas et paiement à la réception, avec droit de refus à la livraison.`
},
{
  slug: "carolina-herrera-212-vip-black",
  name: "212 VIP Black",
  shortDescription: "212 VIP Black mise sur l'absinthe, l'anis et le fenouil en ouverture, un cœur de lavande, puis un fond musc-vanille noire plus sombre que la plupart des fougères. Pensé pour la nuit et les sorties, il convient à l'automne et à l'hiver.",
  description: `Carolina Herrera a construit 212 VIP Black comme une version nocturne et plus dense de la ligne 212 VIP, en gardant l'esprit fougère mais en l'assombrissant nettement. La concentration en eau de parfum renforce cette impression de densité dès les premières minutes, loin de la légèreté attendue d'une fougère classique. Le nom lui-même, avec ce simple ajout de « Black », résume assez bien le parti pris.

L'ouverture surprend par son côté anisé : l'absinthe, l'anis et le fenouil dessinent un accord vert et légèrement médicinal, loin des agrumes habituels de la famille fougère. Cette entrée marquée capte l'attention avant de s'assagir progressivement au fil des minutes, sans jamais devenir agressive.

La lavande occupe seule le cœur, dans un registre plus sec que floral, servant de pont entre l'ouverture herbacée et un fond nettement plus sombre. Le musc et la vanille noire referment la composition sur une note chaude et légèrement fumée, qui tranche avec la fraîcheur du départ et donne au parfum toute sa personnalité. Cette base assure une bonne tenue une fois la soirée bien avancée.

Ce contraste entre ouverture anisée et fond vanillé en fait un parfum de soirée, taillé pour la nuit et les sorties plutôt que pour un usage de journée, particulièrement en automne et en hiver. Il s'adresse à ceux qui n'ont pas peur d'un départ affirmé ni d'un sillage qui se remarque. Maison Numidia le propose en flacon de 100 ml, livraison Yalidine dans les 58 wilayas et paiement à la réception.`
},
{
  slug: "nishane-ambra-calabria",
  name: "Ambra Calabria",
  shortDescription: "Ambra Calabria ouvre sur la bergamote, les feuilles vertes et le galbanum, avant un cœur épicé de coriandre et jasmin sur un fond ambre-vanille-musc. Cet extrait de parfum unisexe convient au quotidien, surtout au printemps et en été.",
  description: `Nishane travaille en extrait de parfum, une concentration qui donne à Ambra Calabria une matière plus dense que la plupart des eaux de parfum classiques. Le nom évoque le sud de l'Italie, mais la composition reste avant tout construite autour du contraste entre une ouverture verte et un fond ambré, deux registres qui se répondent tout au long du parcours du parfum.

L'ouverture associe la bergamote à des feuilles vertes et au galbanum, un accord résineux et légèrement amer qui installe une fraîcheur assez sèche, loin des agrumes sucrés habituels. Cette entrée verte donne le ton de toute la composition et surprend d'abord par sa rigueur, avant de s'assouplir peu à peu.

Au cœur, la coriandre et le jasmin apportent une facette à la fois épicée et florale, sans jamais dominer l'accord vert de l'ouverture. Le fond ambré, porté par la vanille et le musc, réchauffe progressivement l'ensemble et adoucit le côté résineux du départ, dans une transition assez lente qui laisse le temps d'apprécier chaque étape.

Sa construction, ni trop sucrée ni trop sèche, en fait un parfum de quotidien et de détente, particulièrement agréable au printemps et en été. Le format extrait de parfum lui assure une bonne tenue et un sillage qui reste présent sans devenir envahissant. La boutique le propose en flacon de 100 ml, avec livraison Yalidine dans les 58 wilayas et paiement à la réception.`
},
{
  slug: "dolce-gabbana-light-blue-sun",
  name: "Light Blue Sun",
  shortDescription: "Light Blue Sun décline la fraîcheur de Light Blue en version plus solaire, entre nectar de coco, citron et pomme verte, avant un cœur de frangipanier et un fond vanille-ambre. Un parfum d'été pensé pour la plage comme pour un usage quotidien.",
  description: `Dolce&Gabbana a pensé Light Blue Sun comme une variation estivale de sa ligne Light Blue, avec un accord coco qui rappelle directement les vacances méditerranéennes. La structure reste fruitée et légère, mais gagne en gourmandise par rapport aux versions plus classiques de la gamme, sans devenir écœurante pour autant. C'est un parfum qui assume pleinement sa vocation saisonnière.

L'ouverture combine le nectar de coco à des notes ozoniques, au citron et à la pomme granny smith, un mélange qui évoque à la fois l'air marin et le fruit croqué. Cette entrée vive et sucrée installe immédiatement l'ambiance estivale de la composition dès les premières minutes, sans temps de mise en place.

Le cœur adoucit le propos avec le frangipanier, le jasmin et la rose blanche, un bouquet floral tropical qui prend le relais sans casser la fraîcheur du départ. En fond, la vanille bourbon et l'ambre gris apportent de la chaleur, tandis que le musc blanc et le cèdre gardent la composition légère plutôt que lourde, même après plusieurs heures sur la peau.

Sa signature solaire et fruitée le destine surtout à la plage et aux journées d'été, même si son usage quotidien reste possible tant que les températures s'y prêtent. Il plaira à celles qui aiment les parfums immédiatement identifiables et faciles à associer à la saison chaude. Maison Numidia le propose en flacon de 100 ml, livraison Yalidine dans les 58 wilayas et paiement à la réception.`
},
{
  slug: "guerlain-heritage",
  name: "Héritage",
  shortDescription: "Héritage de Guerlain déploie une pyramide dense, entre agrumes, aldéhydes et lavande en ouverture, un cœur épicé et floral, puis un fond boisé-ambré appuyé sur la vanille poudrée. Un boisé épicé formel, pensé pour le bureau comme pour les rendez-vous habillés.",
  description: `Guerlain a construit Héritage sur une pyramide particulièrement fournie, avec une dizaine de notes de tête et presque autant au cœur, une architecture plus proche des grands classiques de la maison que des compositions minimalistes actuelles. Le résultat assume cette densité plutôt que de la fuir, et se révèle différemment selon la chaleur de la peau.

L'ouverture mêle bergamote, orange et citron à des aldéhydes et des notes vertes, avant que la lavande, le petit grain, la violette, la sauge sclarée et la noix de muscade ne viennent complexifier l'ensemble. Ce départ dense évolue rapidement plutôt que de s'installer sur une seule facette, ce qui demande un peu de patience au premier essai.

Le cœur associe le poivre et la coriandre à un bouquet floral construit autour de la rose, du jasmin, de l'œillet, du chèvrefeuille, du géranium et du muguet, le tout porté par la racine d'iris. En fond, le cèdre, le vétiver et le patchouli forment une base boisée classique, réchauffée par l'ambre, la fève tonka, la mousse de chêne, le santal et la vanille poudrée.

Cette richesse le destine à des occasions où l'on a le temps de le laisser se déployer : le bureau, un rendez-vous ou une soirée plus formelle, en toute saison. Maison Numidia le propose en flacon de 100 ml, avec livraison Yalidine dans les 58 wilayas et paiement à la réception, droit de refus compris.`
},
{
  slug: "armani-code-absolu",
  name: "Code Absolu",
  shortDescription: "Code Absolu conjugue mandarine, pomme et un accord rhum en ouverture, un cœur de fleur d'oranger et muscade, puis un fond fève tonka-vanille où le rhum revient. Un oriental épicé gourmand, pensé pour l'automne et l'hiver, du déjeuner à la soirée.",
  description: `Giorgio Armani a construit Code Absolu comme une version plus dense et plus gourmande de sa ligne Code, avec un accord rhum qui traverse toute la composition, de l'ouverture jusqu'au fond. Cette continuité donne au parfum une cohérence assez rare pour ce type de structure orientale, où chaque étape reste liée à la précédente.

L'ouverture associe la mandarine et la pomme à ce même accord rhum, pour un départ fruité et légèrement alcoolisé qui évite le sucre pur. La muscade, discrète mais présente dès les premières minutes, annonce déjà la dimension épicée du cœur à venir.

Le cœur se resserre autour de la fleur d'oranger et de la muscade, un duo qui reste net malgré la richesse générale de la composition. En fond, la fève tonka et la vanille retrouvent l'accord rhum, pour une base chaude et légèrement boisée qui referme la structure sur elle-même sans rupture nette.

Sa chaleur et sa dimension gourmande le rendent particulièrement à l'aise en automne et en hiver, du déjeuner à la sortie nocturne, en passant par une soirée plus habillée. Il conviendra à ceux qui aiment les compositions orientales sans tomber dans l'excès de sucre. La boutique le propose en flacon de 100 ml, livraison Yalidine dans les 58 wilayas et paiement à la réception, droit de refus compris.`
},
{
  slug: "hugo-boss-nuit-femme",
  name: "Boss Nuit pour Femme",
  shortDescription: "Boss Nuit pour Femme ouvre sur la pêche et des aldéhydes, avant un cœur de fleurs blanches, jasmin et violette sur un fond santal-mousse de chêne. Un floral blanc élégant, pensé pour le dîner et les occasions d'automne et d'hiver.",
  description: `Hugo Boss a pensé Boss Nuit pour Femme comme une signature de soirée, avec cette rigueur qui caractérise la ligne Boss : peu de notes, mais une exécution soignée à chaque étape de la pyramide. Le résultat reste lisible du début à la fin, sans surcharge inutile ni effet de superposition.

L'ouverture associe la pêche à des aldéhydes, pour un départ à la fois fruité et légèrement poudré, plus feutré qu'éclatant. Cette entrée discrète laisse rapidement la place au bouquet floral qui constitue le vrai cœur de la composition, sans temps mort entre les deux étapes.

Les fleurs blanches, le jasmin et la violette forment un accord dense mais pas entêtant, porté par une texture presque veloutée. En fond, le santal et la mousse de chêne apportent de la tenue et un léger grain boisé, qui évite au parfum de rester purement floral jusqu'au bout de sa vie sur la peau.

Sa dimension habillée le destine avant tout au dîner et aux occasions, particulièrement en automne et en hiver où les floraux blancs plus denses s'expriment le mieux. Il s'adresse à celles qui cherchent un parfum de soirée plutôt qu'une odeur légère de tous les jours. Maison Numidia le propose en flacon de 75 ml, avec livraison Yalidine dans les 58 wilayas et paiement à la réception.`
},
{
  slug: "chanel-cristalle",
  name: "Cristalle",
  shortDescription: "Cristalle de Chanel ouvre sur le citron et la bergamote, avant un cœur floral de jacinthe, bois de rose, chèvrefeuille et jasmin, sur un fond chypré mousse de chêne-vétiver. Un classique frais et élégant, adapté au bureau comme au quotidien du printemps et de l'été.",
  description: `Chanel a construit Cristalle sur une structure chyprée assez sèche pour l'époque de sa création, loin des floraux plus ronds que la maison proposait alors. Cette netteté reste la signature du parfum : peu de sucre, beaucoup de transparence, et une allure qui n'a pas beaucoup changé depuis sa sortie.

L'ouverture repose sur le citron et la bergamote, un duo d'agrumes classique mais exécuté avec précision, qui installe une fraîcheur immédiate sans jamais virer à l'acidité pure. Cette entrée annonce déjà la tenue générale, assez linéaire, du parfum.

Le cœur déploie la jacinthe, le bois de rose, le chèvrefeuille et le jasmin, un bouquet floral vert plutôt que sucré. En fond, la mousse de chêne et le vétiver referment la composition sur une base chyprée sèche, qui donne à l'ensemble son caractère élégant et un peu réservé, loin des sillages trop appuyés.

Cette sobriété en fait un parfum de bureau et de quotidien, particulièrement agréable au printemps et en été, quand les compositions plus denses deviennent lourdes. Il conviendra à celles qui préfèrent une élégance discrète à un sillage envahissant. La boutique le propose en flacon de 100 ml, avec livraison Yalidine dans les 58 wilayas et paiement à la réception, droit de refus compris.`
},
{
  slug: "burberry-hero-parfum",
  name: "Hero Parfum",
  shortDescription: "Hero Parfum de Burberry repose sur seulement trois notes : l'amyris en ouverture, le bois de cèdre au cœur et l'huile de cypriol en fond. Une composition boisée dense et épicée, pensée pour les soirées d'automne et d'hiver.",
  description: `Burberry a conçu Hero Parfum autour d'une pyramide volontairement réduite à trois matières, une approche minimaliste assez rare dans le boisé masculin contemporain. Plutôt que d'empiler les accords, la composition mise sur la qualité et l'intensité de chaque note prise séparément, dans une logique presque brute.

L'amyris ouvre la marche avec une facette boisée déjà présente dès les premières minutes, plus proche du bois brut que d'un agrume ou d'une note verte classique. Cette entrée directe donne immédiatement le ton d'un parfum sans détour, qui ne cherche pas à séduire par la fraîcheur.

Le bois de cèdre prend le relais au cœur, dans un registre sec et structuré qui prolonge naturellement l'amyris sans rupture nette entre les deux étapes. En fond, l'huile de cypriol, aussi appelée nagarmotha, apporte une facette terreuse et légèrement fumée qui donne à l'ensemble sa profondeur et sa tenue sur la durée.

Cette densité boisée en fait un parfum de soirée et de week-end, particulièrement adapté à l'automne et à l'hiver, saisons où ce type de composition trouve le plus naturellement sa place. Il s'adresse à ceux qui recherchent une matière brute plutôt qu'une pyramide chargée. Maison Numidia le propose en flacon de 100 ml, avec livraison Yalidine dans les 58 wilayas et paiement à la réception.`
},
];

const banned = [
  "positionnement tarifaire",
  "piece maitresse d'une collection",
  "pièce maîtresse d'une collection",
  "parfum d'appoint",
  "reste parfaitement lisible",
  "periode de port privilegiee",
  "période de port privilégiée",
  "la construction olfactive révèle toute sa richesse",
  "fonctionne dans des contextes très variés",
  "sans jamais sembler décalé",
  "plaît naturellement à un public algérien",
  "il est grand temps de la découvrir",
  "une fragrance qui dure",
  "certificat de conformité",
  "nos entrepôts",
  "fournisseurs vérifiés",
  "coffret d'origine",
  "scellé",
  "dédouané",
  "il est important de noter",
  "en conclusion",
  "n'hésitez pas",
  "pour conclure",
  "---",
  "★",
  "/5",
  "2025",
];

let report = [];
for (const e of entries) {
  const wordsShort = e.shortDescription.trim().split(/\s+/).length;
  const wordsDesc = e.description.trim().split(/\s+/).length;
  const paragraphs = e.description.split(/\n\n+/).length;
  const nameCount = e.description.split(e.name).length - 1;
  const lowerDesc = e.description.toLowerCase();
  const foundBanned = banned.filter(b => lowerDesc.includes(b.toLowerCase()));
  const hourNumMatch = e.description.match(/\d+\s*heures?/i);

  report.push({
    slug: e.slug,
    wordsShort,
    wordsDesc,
    paragraphs,
    nameCount,
    foundBanned,
    hourNumMatch: hourNumMatch ? hourNumMatch[0] : null
  });

  const obj = {
    slug: e.slug,
    shortDescription: e.shortDescription,
    description: e.description,
    ecritLe: "2026-09-25"
  };
  fs.writeFileSync(path.join(outDir, e.slug + ".json"), JSON.stringify(obj, null, 1) + "\n", "utf8");
}

console.log(JSON.stringify(report, null, 1));
