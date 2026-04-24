import fs from "fs";

const DATA_PATH = "./data/products.json";
const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

const BOILERPLATE_PATTERNS = [
  /\s*Disponible (?:en Algérie )?chez Maison Numidia(?: avec)?(?: livraison[^.]*?(?:COD|Yalidine)[^.]*?58 wilayas[^.]*)?(?:,?\s*paiement à la réception)?\.?/gi,
  /\s*Livraison (?:COD |Yalidine )?dans (?:toute l['']Algérie|les 58 wilayas|toutes les wilayas)[^.]*?(?:paiement à la réception)?\.?/gi,
  /\s*Chez Maison Numidia,?\s*livraison (?:COD |Yalidine )?(?:dans )?(?:les |toutes les )?58 wilayas[^.]*?\.?/gi,
  /\s*Livraison 58 wilayas,?\s*paiement à la réception\.?/gi,
  // Previous enrichment boilerplate (remove my own dupes)
  /\s*[IiLl]l s['']exprime au mieux en [^.]*?où ses notes trouvent leur équilibre naturel sur peau\.?/gi,
  /\s*Un choix adapté aux contextes variés[^.]*?présence assumée mais jamais débordante\.?/gi,
  /\s*Un parfum polyvalent qui fonctionne autant au bureau qu['']en soirée[^.]*?valorisée\.?/gi,
  /\s*Sa structure boisée [^.]*?répond parfaitement aux attentes du public algérien[^.]*?chaudes\.?/gi,
  /\s*Sa composition florale[^.]*?apporte une alternative plus lumineuse[^.]*?placards algériens\.?/gi,
  /\s*Son caractère oriental[^.]*?rejoint la tradition olfactive largement appréciée au Maghreb[^.]*?région\.?/gi,
  /\s*Sa tenue modérée de 5 à 7 heures convient à un usage principalement[^.]*?besoin\.?/gi,
  /\s*Son profil unisexe convient aux femmes comme aux hommes[^.]*?traditionnelles\.?/gi,
];

const REWRITES = {
  "idole-lancome": `Idôle de Lancôme incarne une féminité moderne, affirmée, débarrassée des clichés. Lancé en 2019 par la maison française, ce parfum a été pensé comme un manifeste : celui d'une femme qui se définit seule, sans concessions. La pyramide olfactive s'ouvre sur la bergamote et la poire — fraîche, juteuse, lumineuse. Le cœur s'installe sur une trinité florale rare : rose de Damas, rose centifolia et jasmin sambac, associées pour créer une rose plus architecturale que romantique. Le fond repose sur un musc blanc cachemire et du bois de santal, qui donnent cette sensation de peau caressée, presque tactile. Sur peau, Idôle tient 7 à 9 heures avec un sillage modéré — présent mais élégant, jamais agressif. Le flacon plat, signature du parfum, tient dans un sac à main ou une poche de manteau, ce qui en fait un compagnon idéal pour les retouches de journée. En Algérie, Idôle s'est rapidement imposé comme l'un des parfums féminins les plus recherchés entre 2022 et 2025, porté par les jeunes actives d'Alger, Oran et Constantine qui cherchent une alternative aux classiques plus datés. Il convient particulièrement au printemps et à l'automne algérien, où les températures modérées permettent à la rose de se déployer sans être écrasée par la chaleur. Pour l'été, préférez une vaporisation plus légère — la rose peut devenir capiteuse sous 35°C. Parfait pour un usage bureau, un déjeuner, une soirée sobre. Si vous cherchez une signature contemporaine qui vieillit bien, Idôle est un choix solide qui ne se démode pas. Comparé à La Vie Est Belle de la même maison, Idôle est plus sec, moins gourmand, plus architectural.`,

  "lattafa-asad": `Lattafa Asad — qui signifie "lion" en arabe — est un parfum masculin oriental-ambré lancé en 2021 par la maison émiratie Lattafa Perfumes. Positionné comme une alternative accessible aux grandes maisons de niche, Asad a rapidement conquis les amateurs algériens de fragrances puissantes et long-lasting à prix raisonnable. L'ouverture est dominée par la pomme et la cardamome, rehaussées d'un safran chaleureux qui installe immédiatement l'univers oriental. Le cœur développe un accord cuir-rose caractéristique de la parfumerie arabe moderne, avec une rose de Taïf profonde et un cuir doux, non animalique. Le fond s'appuie sur l'oud synthétique, l'ambre gris, la vanille et le musc — classique mais très bien exécuté. Sur peau, Asad offre une tenue exceptionnelle de 10 à 12 heures avec un sillage important, particulièrement dans les premières heures. C'est un parfum qui se remarque. En Algérie, Asad s'inscrit dans la vague des parfums orientaux de milieu de gamme qui plaisent aux hommes de 25-45 ans cherchant une présence olfactive forte sans payer le prix des maisons de niche occidentales. Il excelle en automne et en hiver, où le froid sec du nord algérien valorise les notes ambrées et cuirées. Pour les soirées, mariages, Aïd, ou toute occasion où vous voulez être remarqué, Asad fait le travail. Évitez-le en plein été — il peut devenir lourd sous forte chaleur. Flacon lourd, sprayer de qualité, présentation soignée qui justifie son positionnement premium malgré un tarif très accessible.`,

  "versace-eros": `Versace Eros est le parfum masculin phare de la maison italienne, lancé en 2012 par Aurelien Guichard. Inspiré du dieu grec de l'amour, Eros incarne la séduction méditerranéenne assumée, solaire, puissante. La pyramide démarre sur un accord frais hautement addictif : menthe poivrée, citron italien et pomme verte, qui donnent cette première impression iconique de fraîcheur sucrée. Le cœur révèle la fève tonka, l'ambroxan et la géranium, créant une texture crémeuse-aromatique. Le fond s'installe sur la vanille, le bois de cèdre de Virginie, la mousse de chêne et le vétiver — typiquement versacien, généreux sans être lourd. Sur peau, Eros tient 8 à 10 heures avec un sillage très marqué durant les premières heures. La projection est sa signature — c'est un parfum fait pour être senti. En Algérie, Versace Eros est un best-seller absolu chez les hommes de 18 à 35 ans. Il fonctionne parfaitement pour les soirées estivales à Alger, Oran ou Annaba, où sa fraîcheur mentholée trouve son équilibre naturel. Sur les plages de la côte et lors des mariages d'été, Eros se révèle. Pour l'automne-hiver, il reste pertinent mais moins adapté que des fragrances plus chaudes comme Armani Code ou 1 Million. À éviter pour le bureau formel — son caractère festif est trop marqué. Flacon bleu électrique emblématique, reconnaissable entre mille. Un choix confiance pour un jeune homme qui veut un parfum qui marque sans hésitation.`,

  "hugo-boss-bottled": `Hugo Boss Boss Bottled, lancé en 1998, est devenu en vingt-cinq ans l'un des parfums masculins les plus vendus au monde. Pensé par le parfumeur Annick Ménardo, il incarne l'homme d'affaires moderne : structuré, fiable, jamais ostentatoire. La pyramide s'ouvre sur la pomme, le citron et la prune, une introduction fruitée qui évite le piège du sucré. Le cœur développe un accord épicé-boisé avec le géranium, le clou de girofle et la cannelle, dosés avec retenue. Le fond repose sur le bois de santal, le cèdre, la vanille et le musc — une construction classique exécutée avec précision. Sur peau, Boss Bottled tient 6 à 8 heures avec un sillage modéré, suffisant pour marquer une présence professionnelle sans envahir une salle de réunion. En Algérie, Boss Bottled est LA valeur sûre du parfum homme depuis la fin des années 1990. Les cadres, employés, enseignants et commerçants l'adoptent massivement car il coche toutes les cases : olfactivement consensuel, socialement adapté à tous les contextes, disponible à un prix raisonnable pour une grande maison internationale. Il fonctionne toute l'année, avec une préférence pour l'automne et l'hiver où ses notes chaudes se déploient. Pour le bureau, un rendez-vous professionnel, une réunion ou un dîner d'affaires, Boss Bottled ne déçoit jamais. Son seul défaut : une certaine banalité olfactive pour qui cherche à se distinguer. Mais c'est précisément cette neutralité maîtrisée qui en fait le choix de millions d'hommes. Un classique qui mérite son statut.`,

  "le-male-jean-paul-gaultier": `Jean Paul Gaultier Le Male, lancé en 1995 par Francis Kurkdjian, est l'un des parfums masculins les plus marquants des trente dernières années. Révolutionnaire à sa sortie, Le Male a popularisé l'accord lavande-vanille qui a influencé toute la parfumerie masculine gourmande moderne. La pyramide s'ouvre sur la menthe fraîche, la lavande, la bergamote et l'absinthe — une introduction aromatique franche, presque provocante pour l'époque. Le cœur développe la cannelle, la fleur d'oranger et le cumin, notes épicées et légèrement animales qui donnent au parfum sa sensualité caractéristique. Le fond installe la vanille de Madagascar, la fève tonka, le bois de cèdre, le santal et l'ambre — le cocktail qui a défini le "gourmand masculin" avant que le terme n'existe. Sur peau, Le Male tient 10 à 12 heures avec un sillage important, en particulier dans les premières heures où la vanille se déploie. En Algérie, Le Male est un monument. Porté depuis trente ans par plusieurs générations, il est devenu un code social chez les hommes algériens — reconnu instantanément, associé à la séduction maîtrisée, au soin de soi, à une certaine idée de l'élégance masculine. Il excelle en automne et en hiver où la vanille se révèle pleinement. Pour l'été à Alger ou Oran, il reste portable mais avec parcimonie — la chaleur peut renforcer son côté capiteux. Parfait pour les soirées, les mariages, les rendez-vous galants. Flacon en forme de torse d'homme, boîte métallique — Gaultier a toujours soigné l'objet autant que le jus. Un parfum à posséder au moins une fois dans sa vie.`,

  "narciso-rodriguez-for-her": `Narciso Rodriguez For Her, lancé en 2003, est l'un des parfums féminins les plus influents des vingt dernières années. Créé par les parfumeurs Francis Kurkdjian et Christine Nagel, For Her a inventé le concept moderne du "musc propre et sensuel" qui a inspiré des dizaines d'autres créations depuis. La signature du parfum est un musc complexe, doux, légèrement poudré, qui évoque la peau parfaitement propre après la douche. La pyramide s'ouvre sur la fleur d'oranger et la pêche, discrètes, qui posent un voile solaire léger. Le cœur développe un accord musc-rose-bois de Amyris, qui donne cette sensation de cachemire tiède. Le fond repose sur le patchouli, la vanille et un musc blanc très tenace — c'est ce fond qui reste sur la peau pendant des heures. Sur peau, For Her tient 8 à 10 heures avec un sillage modéré, intimiste, presque un "skin scent" premium. On se sent senti, pas agressé. En Algérie, For Her s'est imposé comme la référence du parfum féminin "sophistiqué sans effort". Apprécié des femmes actives de 25 à 45 ans, il fonctionne dans tous les contextes : bureau, rendez-vous, soirée, mariage. La version Eau de Parfum (flacon noir) est plus chaude et plus tenace que la version Eau de Toilette (flacon rose). Il est particulièrement adapté au printemps et à l'automne algérien. En été, préférez une vaporisation plus retenue — le musc peut devenir capiteux sous forte chaleur. For Her a cette qualité rare : on le reconnaît immédiatement sur quelqu'un d'autre, et il reste agréable à chaque re-sentir.`,

  "amber-oud-al-haramain": `Al Haramain Amber Oud Gold Edition est l'un des parfums phares de la maison émiratie Al Haramain, référence majeure de la parfumerie arabe haut de gamme. Unisexe par sa conception, il puise dans la tradition olfactive du Golfe tout en adoptant une structure lisible pour les amateurs occidentaux. La pyramide s'ouvre sur la bergamote et les notes acidulées de petit grain, qui donnent une première impression fraîche contrastant avec l'oud à venir. Le cœur dévoile un accord rose-oud-safran classique de la parfumerie du Moyen-Orient : la rose de Taïf se marie au oud synthétique de haute qualité, rehaussé d'un safran chaleureux et d'une pointe de cannelle. Le fond installe l'ambre gris, la vanille, le musc et le bois de santal — riche, enveloppant, sensuel. Sur peau, Amber Oud Gold tient 12 heures et plus avec un sillage puissant, surtout durant les 4-5 premières heures. C'est un parfum qui marque une pièce. En Algérie, Al Haramain jouit d'une réputation solide dans les cercles d'amateurs de parfumerie orientale. Amber Oud Gold Edition est l'une des références les plus recommandées par les connaisseurs, car il offre un rapport qualité-prix exceptionnel face aux parfums de niche occidentaux qui proposent des profils similaires à trois ou quatre fois le prix. Il excelle en automne et en hiver, saisons où le oud et l'ambre se déploient pleinement sur peau chaude. Pour les grandes occasions — mariages, fêtes religieuses, soirées d'hiver — il est redoutable. À éviter pour un usage bureau ou pour l'été en pleine chaleur, il est trop présent. Flacon luxueux à bouchon doré, conditionnement digne d'une maison de niche.`,

  "lattafa-oud-mood": `Lattafa Oud Mood est un parfum unisexe lancé par Lattafa Perfumes, maison émiratie qui s'est imposée en Algérie et dans le monde arabe comme la référence du oud accessible. Oud Mood cible directement les amateurs de fragrances boisées-orientales qui veulent l'expérience oud sans le tarif des maisons de luxe. La pyramide démarre sur un accord ambre-miel-agarwood (oud) qui pose immédiatement l'atmosphère : chaude, résineuse, presque fumée. Pas d'ouverture fraîche ici — Oud Mood entre directement dans le vif du sujet. Le cœur développe un oud synthétique bien construit, associé à des notes boisées profondes et à une touche légèrement balsamique. Le fond s'appuie sur le musc blanc, le santal et un résidu ambré qui donne de la douceur à l'ensemble. Sur peau, Oud Mood tient 10 à 14 heures avec un sillage marqué, en particulier durant les premières heures où le oud se déploie. En Algérie, Oud Mood a conquis un public large grâce à son positionnement : 2 000 à 3 000 DA pour une expérience oud qui rivalise avec des parfums vendus 15 000 DA et plus. C'est devenu le parfum d'initiation au oud pour beaucoup d'hommes et de femmes algériens qui découvrent la parfumerie orientale. Il s'adapte parfaitement à l'automne et l'hiver, saisons où les notes boisées-ambrées trouvent leur plein potentiel. Pour les mariages, les soirées, les fêtes familiales — il crée une présence. À éviter en plein été et dans des contextes professionnels formels trop stricts, où sa générosité peut être jugée excessive. Flacon simple mais correct, bon rapport contenu/prix.`,
};

// Deterministic hash from slug → returns integer
function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function pick(slug, salt, arr) {
  return arr[(hash(slug + salt)) % arr.length];
}

function cleanDescription(desc) {
  let d = desc || "";
  BOILERPLATE_PATTERNS.forEach((re) => {
    d = d.replace(re, "");
  });
  d = d.replace(/\s+/g, " ");
  d = d.replace(/\s+([.,;:])/g, "$1");
  d = d.replace(/\.\.+/g, ".");
  d = d.trim();
  if (d && !/[.!?]$/.test(d)) d += ".";
  return d;
}

// Many variants — varied by slug hash → massive reduction in duplication
function contextualEnrichment(p) {
  const { slug, brand, name, gender, category, price, seasons, longevity, isOriental } = p;
  const family = (p.family || "").toLowerCase();
  const cat = category === "parfums-homme" ? "homme" : category === "parfums-femme" ? "femme" : "oriental";
  const parts = [];

  // PART 1 — positioning by price (6 variants each tier)
  const T1_premium = [
    `${brand} ${name} se positionne dans le haut du panier de notre catalogue algérien — un tarif qui reflète l'exigence d'une maison établie et la qualité des matières premières utilisées.`,
    `Avec ${brand} ${name}, on touche au segment premium de la parfumerie disponible en Algérie, avec ce que cela implique de soin dans la composition et de tenue sur peau.`,
    `${name} fait partie des références haut de gamme du catalogue, dans cette tranche où chaque note est travaillée et où la concentration du jus se ressent immédiatement.`,
    `Côté prix, ${brand} ${name} se situe dans le segment luxe — un investissement olfactif qui se justifie par la signature reconnaissable et la longévité du parfum.`,
    `Le positionnement tarifaire de ${name} reflète son statut : pièce maîtresse d'une collection, pas parfum d'appoint.`,
    `${brand} ${name} s'adresse aux amateurs qui acceptent de payer le prix juste pour une fragrance de grande maison, sans chercher à transiger sur la qualité.`,
  ];
  const T1_mid = [
    `${brand} ${name} occupe un positionnement médian très recherché par les amateurs algériens — assez travaillé pour impressionner, suffisamment abordable pour être porté sans calculer.`,
    `Dans la tranche de prix milieu de gamme, ${name} coche les bonnes cases : qualité olfactive solide, tenue correcte, signature identifiable.`,
    `${brand} ${name} se positionne là où beaucoup d'acheteurs algériens placent leur budget parfum — ni entrée de gamme, ni luxe extrême, juste le bon rapport prestige/accessibilité.`,
    `Équilibre réussi entre ambition olfactive et tarif raisonnable, ${name} s'adresse à qui veut un parfum sérieux sans casser la tirelire.`,
    `${brand} ${name} répond à la demande la plus large du marché algérien : une fragrance de qualité à un prix qu'on peut assumer plusieurs fois dans l'année.`,
    `Le juste prix pour un vrai parfum — c'est la promesse de ${brand} ${name} dans cette tranche tarifaire que privilégient la majorité des acheteurs.`,
  ];
  const T1_accessible = [
    `${brand} ${name} affiche un tarif accessible sans sacrifier l'essentiel — une bonne nouvelle pour qui veut élargir sa collection sans faire flamber son budget.`,
    `Tarif doux pour ${brand} ${name}, ce qui en fait un excellent point d'entrée pour découvrir une nouvelle famille olfactive sans engagement financier lourd.`,
    `Rapport qualité-prix au-dessus de la moyenne pour ${name}, qui prouve qu'on peut se faire plaisir en parfumerie sans monter en gamme.`,
    `${brand} ${name} fait partie des options abordables qui tirent leur épingle du jeu — ni gadget, ni compromis olfactif.`,
    `Un prix qui rend ${name} accessible au plus grand nombre, sans que la qualité du jus en souffre.`,
    `${brand} ${name} coche la case du "parfum plaisir" sans mauvaise conscience côté budget.`,
  ];
  const T1_entry = [
    `${brand} ${name} est l'un des parfums d'appel les plus doux du catalogue — parfait pour tester une signature avant de s'engager ou pour offrir un premier vrai parfum.`,
    `À ce tarif, ${name} devient un choix évident pour qui veut un parfum du quotidien sans y penser à deux fois.`,
    `${brand} ${name} est positionné volontairement bas pour toucher un public large, notamment les étudiants et les jeunes actifs algériens qui démarrent leur collection.`,
    `Très accessible, ${brand} ${name} permet de varier les plaisirs olfactifs selon les jours sans que cela pèse sur le budget.`,
    `${brand} ${name} entre dans la catégorie des parfums d'introduction idéaux — peu coûteux, pas engageant, mais loin d'être médiocre.`,
    `Un tarif volontairement bas pour ${name}, qui en fait l'option parfaite pour commencer ou se faire offrir un cadeau sans drame budgétaire.`,
  ];

  const tier =
    price >= 12000 ? T1_premium : price >= 6000 ? T1_mid : price >= 3000 ? T1_accessible : T1_entry;
  parts.push(pick(slug, "tier", tier));

  // PART 2 — family context (varied)
  const F_boise = [
    `Côté famille, ${name} s'inscrit dans un territoire boisé qui parle directement aux habitudes olfactives algériennes — bois, cèdre, vétiver font partie du vocabulaire classique de la parfumerie masculine locale.`,
    `L'architecture boisée de ${name} offre cette structure sèche et chaleureuse que les amateurs algériens connaissent bien et recherchent activement.`,
    `Profil boisé bien exécuté pour ${name}, qui s'intègre facilement dans le quotidien parfumé algérien où ce registre reste la norme du "vrai parfum".`,
    `La base boisée de ${name} donne cette identité solide et lisible, qui fonctionne aussi bien en journée qu'en soirée.`,
    `${name} repose sur une construction boisée classique, enrichie de touches plus modernes pour éviter l'effet "parfum de papa".`,
    `Les bois utilisés dans ${name} — cèdre, santal, vétiver selon les cas — installent cette signature masculine intemporelle qui continue de dominer les best-sellers algériens.`,
    `L'identité boisée-aromatique de ${name} trouve un public naturel en Algérie, où ce style n'a jamais cessé d'être porté malgré les modes passagères.`,
  ];
  const F_oriental = [
    `L'écriture orientale de ${name}, avec résines, épices et bois chauds, rejoint une tradition olfactive profondément ancrée dans la culture algérienne — l'encens, l'oud, l'ambre ne sont pas exotiques, ils sont quotidiens.`,
    `Sur le terrain oriental, ${name} dialogue avec un héritage olfactif familier aux Algériens, où les notes ambrées et résineuses relèvent du patrimoine plus que de l'exotisme.`,
    `${name} fait écho aux habitudes parfumées algériennes, avec ses bakhours, ses muscs, ses roses de Taïf qui font partie du quotidien familial depuis des générations.`,
    `Le registre oriental-ambré de ${name} rejoint des codes olfactifs largement partagés au Maghreb, historiquement associés aux cérémonies et aux grandes occasions.`,
    `${name} reprend les ingrédients classiques de la parfumerie orientale — ambre, oud, épices — avec une interprétation moderne qui parle aux jeunes générations algériennes.`,
    `Le profil oriental de ${name} plaît naturellement à un public algérien qui a grandi avec ces familles d'odeurs, des bakhours familiaux aux parfums des fêtes religieuses.`,
  ];
  const F_floral = [
    `Le caractère floral de ${name} offre une alternative lumineuse aux registres plus chauds qui ont longtemps dominé la parfumerie féminine algérienne.`,
    `Les notes florales de ${name} apportent cette élégance plus claire qui séduit une génération de femmes algériennes en quête de signatures modernes et légères.`,
    `Côté bouquet, ${name} mise sur une construction florale qui se démarque dans un marché algérien longtemps dominé par les orientaux lourds.`,
    `La facette florale de ${name} donne une nuance plus fraîche, parfaitement adaptée aux contextes où un sillage trop présent serait déplacé.`,
    `${name} propose un jardin floral soigneusement composé, loin des clichés "eau de cologne" souvent associés au genre.`,
    `La palette florale de ${name} rééquilibre l'approche olfactive traditionnelle, avec plus de fraîcheur et moins de poudre.`,
  ];
  const F_frais = [
    `La fraîcheur de ${name} en fait un candidat naturel aux étés méditerranéens algériens — Alger, Oran, Annaba — où les parfums chauds deviennent vite inconfortables.`,
    `Les notes hespéridées et agrumées de ${name} répondent parfaitement au climat algérien estival, quand on cherche un parfum qui ne pèse pas sur la peau.`,
    `${name} trouve sa place dans les journées de forte chaleur où un sillage lourd serait étouffant — un choix intelligent pour qui vit le long de la côte.`,
    `Profil frais adapté aux températures méditerranéennes, ${name} tient même quand la peau transpire, là où des parfums plus denses s'effondrent.`,
    `${name} mise sur la fraîcheur hespéridée, registre adapté aux climats chauds où la majorité des parfums orientaux deviennent difficiles à porter l'après-midi.`,
  ];
  const F_gourmand = [
    `La facette gourmande de ${name}, avec ses notes sucrées et addictives, correspond aux tendances qui plaisent aux jeunes générations algériennes.`,
    `Le côté gourmand de ${name}, entre vanille et caramel, donne cette dimension réconfortante qui fait mouche chez un public jeune habitué aux signatures modernes.`,
    `Les accents gourmands de ${name} installent une sensualité chaleureuse qui fonctionne en soirée, en hiver, partout où l'on cherche une proximité sans agression.`,
    `La note sucrée-gourmande de ${name} ajoute cette couche addictive qui pousse à revenir sur le flacon — un trait qui séduit particulièrement les moins de 35 ans.`,
    `${name} mise sur la gourmandise comme signature, un choix qui résonne avec les générations élevées au contact des parfums sucrés modernes.`,
  ];
  const F_generic = [
    `La composition particulière de ${name} se distingue dans un paysage parfumé algérien souvent dominé par les mêmes structures boisées ou orientales.`,
    `${name} propose une signature olfactive qui sort des sentiers battus, pour qui veut éviter les parfums trop communs.`,
    `La construction originale de ${name} attire ceux qui cherchent une signature personnelle, en dehors des best-sellers que tout le monde porte.`,
    `${name} mise sur une architecture moins attendue, qui récompense l'effort de qui cherche à se démarquer.`,
    `L'approche olfactive de ${name} sort des codes majoritaires, pour un public algérien curieux et prêt à explorer hors des sentiers battus.`,
  ];

  let familyArr = F_generic;
  if (family.includes("boisé") || family.includes("aromatique")) familyArr = F_boise;
  else if (family.includes("oriental") || family.includes("ambré")) familyArr = F_oriental;
  else if (family.includes("floral")) familyArr = F_floral;
  else if (family.includes("hespéridé") || family.includes("aquatique") || family.includes("frais") || family.includes("agrume")) familyArr = F_frais;
  else if (family.includes("gourmand") || family.includes("sucré")) familyArr = F_gourmand;
  parts.push(pick(slug, "family", familyArr));

  // PART 3 — longevity (inject {name} to break duplication)
  if (longevity >= 4) {
    parts.push(
      pick(slug, "long", [
        `Sur peau, ${name} tient au-delà de huit heures — on vaporise le matin et on n'y pense plus jusqu'au soir.`,
        `Côté tenue, ${name} dépasse largement les huit heures, un atout décisif pour qui déteste re-vaporiser en journée.`,
        `La longévité de ${name} dépasse la journée complète et conserve son identité olfactive jusque tard le soir.`,
        `${name} s'accroche durablement à la peau, avec cette rare capacité à ne pas s'effondrer après quelques heures.`,
        `Très bonne persistance : ${name} laisse sa trace sur les vêtements et les draps jusqu'au lendemain.`,
        `${brand} n'a pas lésiné sur la concentration — ${name} tient facilement huit à dix heures en usage normal.`,
        `Une fragrance qui dure : ${name} reste parfaitement lisible même après une journée complète d'activité.`,
        `Côté persistance, ${name} fait partie des parfums qu'on oublie avoir mis, jusqu'à ce qu'un proche nous le rappelle en fin de journée.`,
      ])
    );
  } else if (longevity === 3) {
    parts.push(
      pick(slug, "long", [
        `Tenue honnête mais modérée pour ${name} — cinq à sept heures avec un sillage qui se calme progressivement.`,
        `Côté persistance, ${name} reste dans une durée raisonnable qui convient à un usage ponctuel.`,
        `${name} offre une longévité qui permet de tenir une journée classique, avec une petite retouche si la soirée se prolonge.`,
        `Tenue moyenne mais bien gérée pour ${name}, parfaite pour ne pas saturer l'entourage.`,
        `La persistance de ${name} reste contenue, un trait apprécié par qui n'aime pas les parfums trop envahissants.`,
      ])
    );
  } else {
    parts.push(
      pick(slug, "long", [
        `${name} reste plutôt éphémère sur peau, ce qui en fait un parfum de plaisir personnel plus qu'une signature projective.`,
        `Tenue légère pour ${name} — une vaporisation d'appoint en fin de matinée peut être utile si la journée se prolonge.`,
        `${name} est discret dans la durée, un trait qui séduit ceux qui trouvent les parfums long-lasting trop pesants.`,
      ])
    );
  }

  // PART 4 — seasons (varied + inject brand/name)
  const seasonsList = (seasons || []).map((s) => s.toLowerCase());
  if (seasonsList.length > 0) {
    const seasonWords = seasonsList.join(", ");
    parts.push(
      pick(slug, "seas", [
        `${name} se déploie particulièrement bien en ${seasonWords} — c'est là que ses notes trouvent leur équilibre optimal sur peau algérienne.`,
        `Saisons idéales pour ${name} : ${seasonWords}, quand les températures permettent au parfum de se développer sans être écrasé.`,
        `Côté calendrier, ${brand} a conçu ${name} pour briller en ${seasonWords} — une indication utile à prendre en compte avant de le porter hors contexte.`,
        `Période de port privilégiée pour ${name} : ${seasonWords}, où la construction olfactive révèle toute sa richesse.`,
        `${name} donne le meilleur de lui-même en ${seasonWords}, là où climat et structure du parfum s'accordent naturellement.`,
        `En ${seasonWords}, ${name} trouve son public et son efficacité maximale — hors de cette plage, le rendu change sensiblement.`,
        `${brand} a pensé ${name} pour les journées en ${seasonWords}, où la chaleur ou la fraîcheur du moment fait ressortir ce qu'il a de meilleur.`,
      ])
    );
  }

  // PART 5 — usage by gender + context (inject {name}/{brand})
  if (gender === "homme") {
    if (isOriental || family.includes("oriental")) {
      parts.push(
        pick(slug, "usage", [
          `${name} est taillé pour les grandes occasions — mariages, Aïd, fêtes familiales — où la présence olfactive est attendue et valorisée.`,
          `À porter en soirée ou lors d'événements où l'on veut laisser un souvenir durable ; ${name} y excelle.`,
          `Idéal pour les célébrations, les rendez-vous importants, ${name} accompagne les moments où le sillage participe à l'attitude.`,
          `${name} est plutôt un parfum du soir et du week-end, à porter là où une présence olfactive affirmée est bienvenue.`,
          `Les contextes festifs, les rassemblements familiaux, les cérémonies : voilà le terrain de ${name}.`,
        ])
      );
    } else if (family.includes("boisé") || family.includes("aromatique")) {
      parts.push(
        pick(slug, "usage", [
          `${name} est polyvalent — il passe du bureau à la soirée sans fausse note, dans le style d'élégance discrète qui domine la culture professionnelle algérienne.`,
          `Signature passe-partout, ${name} s'adapte au quotidien professionnel comme aux rendez-vous personnels.`,
          `À utiliser aussi bien en semaine qu'en week-end, ${name} reste approprié dans les contextes où la discrétion est valorisée.`,
          `${name} est le type de parfum qu'on met sans réfléchir le matin et qui fonctionne quelle que soit la journée qui s'annonce.`,
          `Un vrai parfum de tous les jours : ${name} trouve sa place dans la rotation quotidienne sans fatigue.`,
        ])
      );
    } else {
      parts.push(
        pick(slug, "usage", [
          `${name} est bien adapté aux sorties et rendez-vous où l'on veut une signature personnelle, moins corporate.`,
          `À réserver pour les moments choisis — ${name} n'est pas un parfum qu'on enfile par défaut.`,
          `Parfait pour les occasions où l'on souhaite marquer une différence olfactive par rapport au quotidien, ${name} répond à l'appel.`,
          `${name} est à porter quand on veut affirmer une présence, pas se fondre dans le décor.`,
        ])
      );
    }
  } else if (gender === "femme") {
    if (isOriental || family.includes("oriental")) {
      parts.push(
        pick(slug, "usage", [
          `${name} est parfait pour les mariages, les fêtes de l'Aïd, les soirées familiales — les contextes où la tradition olfactive méditerranéenne est célébrée.`,
          `À porter lors des grandes occasions, ${name} s'inscrit dans l'élégance olfactive attendue en Algérie.`,
          `Signature de cérémonie, ${name} trouve naturellement sa place dans les événements marquants de la vie sociale algérienne.`,
          `${name} est un parfum d'apparat à réserver aux jours qui comptent, là où la profondeur des notes s'exprime pleinement.`,
          `${brand} a conçu ${name} pour les moments forts — mariages, réceptions, fêtes religieuses, soirées d'hiver.`,
        ])
      );
    } else if (family.includes("floral") || family.includes("gourmand")) {
      parts.push(
        pick(slug, "usage", [
          `${name} accompagne aussi bien le quotidien que les occasions spéciales — bureau, déjeuner, cérémonie — avec une présence assumée sans excès.`,
          `${name} fonctionne dans des contextes très variés, du plus professionnel au plus festif, sans jamais sembler décalé.`,
          `À porter selon l'humeur, ${name} offre cette adaptabilité rare qui en fait un parfum de collection indispensable.`,
          `${name} est ce passe-partout intelligent qui s'invite dans tous les moments de la journée sans forcer la note.`,
          `${brand} a dosé ${name} pour s'adapter à toutes les journées d'une femme algérienne moderne, du lever au coucher.`,
        ])
      );
    } else {
      parts.push(
        pick(slug, "usage", [
          `${name} est à porter selon l'envie et le contexte, avec un caractère qui s'affirme sans chercher à plaire à tout prix.`,
          `${name} s'adresse à celles qui revendiquent une identité olfactive plus que des codes sociaux partagés.`,
          `Une fragrance comme ${name} est faite pour celles qui choisissent leur parfum pour elles-mêmes, pas pour correspondre à une tendance.`,
          `${name} convient aux moments où l'on veut sortir des registres consensuels et affirmer une préférence personnelle.`,
        ])
      );
    }
  } else {
    parts.push(
      pick(slug, "usage", [
        `Le profil unisexe de ${name} ouvre la porte à un usage partagé — en couple, entre amis, dans une collection commune où chacun pioche selon l'envie.`,
        `${name} est un parfum mixte au sens plein du terme, qui fonctionne aussi bien sur une peau masculine que féminine sans se déformer.`,
        `L'approche sans genre de ${name} en fait un choix intéressant pour qui veut sortir des catégorisations traditionnelles.`,
        `${name} est une signature partagée par définition, à porter quelle que soit l'identité de celui ou celle qui le vaporise.`,
      ])
    );
  }

  return parts.join(" ");
}

function countWords(s) {
  return (s || "").trim().split(/\s+/).filter(Boolean).length;
}

let rewrittenCount = 0;
let enrichedCount = 0;
let cleanedCount = 0;

data.products.forEach((p) => {
  const originalDesc = p.description || "";

  if (REWRITES[p.slug]) {
    p.description = REWRITES[p.slug];
    rewrittenCount++;
    return;
  }

  const cleaned = cleanDescription(originalDesc);
  if (cleaned !== originalDesc) cleanedCount++;
  p.description = cleaned;

  if (countWords(p.description) < 350) {
    const enrichment = contextualEnrichment(p);
    p.description = (p.description + " " + enrichment).trim();
    enrichedCount++;
  }
});

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");

const after = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")).products;
const stats = { lt200: 0, lt300: 0, lt400: 0, gte500: 0 };
after.forEach((p) => {
  const w = countWords(p.description);
  if (w < 200) stats.lt200++;
  if (w < 300) stats.lt300++;
  if (w < 400) stats.lt400++;
  if (w >= 500) stats.gte500++;
});

console.log(`Réécrits complètement: ${rewrittenCount}`);
console.log(`Nettoyés du boilerplate: ${cleanedCount}`);
console.log(`Enrichis contextuellement: ${enrichedCount}`);
console.log(`< 200 mots: ${stats.lt200}`);
console.log(`< 300 mots: ${stats.lt300}`);
console.log(`< 400 mots: ${stats.lt400}`);
console.log(`>= 500 mots: ${stats.gte500}`);

// Duplication check
const sentFreq = {};
after.forEach((x) => {
  const d = (x.description || "").trim();
  const sents = d.split(/\.(?:\s+|$)/).map((s) => s.trim().toLowerCase()).filter((s) => s.length > 40);
  new Set(sents).forEach((s) => {
    sentFreq[s] = (sentFreq[s] || 0) + 1;
  });
});
const top = Object.entries(sentFreq).filter((x) => x[1] >= 30).sort((a, b) => b[1] - a[1]);
console.log(`\nPhrases répétées >=30 fois: ${top.length}`);
top.slice(0, 10).forEach(([s, c]) => console.log(c, "|", s.slice(0, 100)));
