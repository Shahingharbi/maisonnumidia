import fs from "fs";

const items = [
{
  slug: "diesel-only-the-brave-tatoo",
  name: "Only The Brave Tattoo",
  allowedNotes: ["Pomme Rouge","Mandarine","Poivre","Sauge","Tabac","Benjoin","Notes Boisées","Patchouli"],
  shortDescription: "Only The Brave Tattoo associe une pomme rouge croquante à une mandarine acidulée, avant de virer vers un cœur épicé de poivre et de sauge. Le fond tabac-patchouli lui donne un caractère plus sombre et masculin. Un parfum pour les soirées fraîches, loin des eaux de toilette trop légères.",
  description: `Diesel signe avec Only The Brave Tattoo une eau de toilette boisée épicée pensée pour un porteur qui veut du contraste : une entrée fruitée franche, puis un fond tabac-boisé qui prend le dessus dès que la peau réchauffe la composition. Le nom, plus affirmé qu'un parfum classique, annonce une allure sombre qui se confirme dans le sillage.

L'ouverture mise sur la pomme rouge et la mandarine, un duo fruité qui reste vif une dizaine de minutes avant de céder la place au cœur. Cette phase initiale est la plus sucrée de tout le parfum : elle installe une fraîcheur presque gourmande qui tranche avec ce qui suit.

Le cœur resserre l'accord autour du poivre et de la sauge, deux notes sèches qui assombrissent progressivement le sillage. Le fond associe le tabac, le benjoin, des notes boisées et le patchouli : c'est cette base qui donne au parfum sa tenue et son caractère, loin de la légèreté du départ fruité. La composition gagne en densité au fil du temps, sans jamais verser dans le lourd.

Cette fragrance convient aux soirées de week-end et aux sorties nocturnes, davantage qu'au bureau. L'automne et l'hiver lui vont bien, la chaleur du tabac et du bois compensant le froid ambiant. Maison Numidia livre ce flacon de 75 ml dans les 58 wilayas via Yalidine, paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "shakira-dance",
  name: "Dance",
  allowedNotes: ["Mandarine","Poire","Pamplemousse","Bergamote","Pivoine","Fleur d'oranger","Lys","Néroli","Caramel","Vanille","Musc","Notes boisées"],
  shortDescription: "Dance ouvre sur un mélange juteux de mandarine, poire et pamplemousse, avant de glisser vers un cœur floral de pivoine et de fleur d'oranger. Le fond caramel-vanille apporte une touche gourmande sans excès. Une eau de toilette légère, pour le quotidien comme pour une soirée de printemps.",
  description: `Shakira signe avec Dance une eau de toilette fruitée florale gourmande, conçue pour un usage aussi bien quotidien que festif. La composition mise sur un équilibre entre fraîcheur fruitée et fond gourmand, sans jamais basculer dans le sucré pur.

L'attaque associe mandarine, poire, pamplemousse et bergamote, un quatuor fruité et acidulé qui donne le ton dès les premières minutes. Cette ouverture vive et rafraîchissante est typique des eaux de toilette pensées pour le printemps et l'été.

Le cœur s'ouvre sur la pivoine, la fleur d'oranger, le lys et le néroli, un bouquet blanc qui adoucit progressivement la fraîcheur du départ. Le fond associe caramel, vanille, musc et notes boisées : c'est lui qui installe la dimension gourmande de la composition, en restant discret plutôt qu'envahissant.

Cette eau de toilette convient au quotidien comme à une soirée légère, notamment au printemps et en été quand la fraîcheur fruitée trouve tout son sens. Maison Numidia propose ce flacon de 80 ml partout en Algérie via Yalidine, paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "lancome-la-nuit-tresor-nu",
  name: "La Nuit Trésor Nude",
  allowedNotes: ["Bergamote","Rose","Vanille","Noix de coco"],
  shortDescription: "La Nuit Trésor Nude s'ouvre sur une bergamote discrète, puis laisse place à une rose épurée sur un fond vanille-coco. Un profil floral musqué simple et chaleureux, pensé pour les soirées et les rendez-vous du printemps à l'automne.",
  description: `Lancôme réduit ici la pyramide à l'essentiel : une bergamote en tête, une rose en cœur, de la vanille et de la noix de coco en fond. Cette simplicité assumée s'inscrit dans la lignée des eaux de parfum musquées épurées, où chaque note a de la place pour s'exprimer plutôt que de se fondre dans un accord complexe. La Nuit Trésor Nude joue la carte de la clarté plutôt que celle de l'accumulation.

L'ouverture confie tout à la bergamote, qui installe une fraîcheur agrume sans autre note pour la nuancer. Ce départ minimal dure peu, le temps que la peau réchauffe la composition et laisse émerger le cœur.

La rose occupe seule le cœur, dans une version nette plutôt qu'ancienne ou poudrée. Le fond vanille et noix de coco change franchement de registre : la vanille apporte la chaleur, la noix de coco une facette plus gourmande et solaire, assez inhabituelle dans ce type de composition florale musquée. C'est ce duo qui porte le sillage sur la durée, bien après que la bergamote et la rose se soient effacées.

Cette eau de parfum se porte en soirée et pour un rendez-vous, du printemps à l'automne, la chaleur vanillée compensant les soirées encore fraîches. Maison Numidia livre ce flacon de 100 ml dans toute l'Algérie via Yalidine, paiement à la réception et droit de refus possible.`
},
{
  slug: "escape-femme-calvin-klein",
  name: "Escape for Women",
  allowedNotes: ["Mandarine","Pamplemousse rose","Melon","Fleur de pêcher","Jasmin blanc","Muguet","Musc blanc","Cèdre léger","Ambre doux"],
  shortDescription: "Escape for Women ouvre sur un mélange de mandarine, pamplemousse rose et melon, avant un cœur floral de pêcher et de jasmin blanc. Le fond musc-cèdre-ambre reste léger. Une eau de parfum fraîche et aquatique, adaptée au quotidien décontracté et aux journées de plage.",
  description: `Calvin Klein positionne Escape for Women dans la famille florale aquatique, loin du registre plus sombre d'autres eaux de parfum de la marque. La composition reste fraîche du début à la fin, sans accord lourd ni note boisée marquée, ce qui la distingue des parfums floraux orientaux plus denses du même rayon.

L'attaque mêle mandarine, pamplemousse rose et melon, un trio fruité et juteux qui évoque directement l'été. Cette ouverture reste perceptible un moment avant de s'effacer progressivement au profit du cœur floral.

Le cœur associe fleur de pêcher, jasmin blanc et muguet, un bouquet clair et printanier plutôt qu'un accord floral dense. Le fond, musc blanc, cèdre léger et ambre doux, prolonge la fraîcheur du début plutôt que de la contredire : c'est un fond discret, pensé pour ne pas alourdir une composition pensée pour la chaleur.

Cette eau de parfum convient à un usage décontracté, aux journées de plage et aux sorties printanières ou estivales, plutôt qu'à une occasion habillée. Maison Numidia propose ce flacon de 100 ml livré dans les 58 wilayas via Yalidine, paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "gucci-guilty-absolute",
  name: "Guilty Absolute Pour Homme",
  allowedNotes: ["Cuir","Cyprès","Olive","Patchouli","Notes boisées","Vétiver","Ambre","Musc"],
  shortDescription: "Guilty Absolute Pour Homme s'ouvre sur un accord inhabituel de cuir, cyprès et olive, avant un cœur patchouli-cyprès qui approfondit le sillage. Le fond vétiver-ambre-musc referme la composition sur une note boisée dense. Un parfum d'hiver, pour le bureau comme pour le soir.",
  description: `Gucci construit Guilty Absolute Pour Homme dans la famille boisée orientale, avec un accord de tête peu commun : cuir, cyprès et olive plutôt que les agrumes habituels de ce type de parfum. Cette entrée sèche annonce d'emblée une composition dense, pensée pour l'automne et l'hiver plutôt que pour les beaux jours.

L'ouverture associe le cuir, le cyprès et l'olive, un trio qui installe d'emblée une ambiance sombre et légèrement salée. Peu de parfums masculins ouvrent sur une note d'olive, ce qui donne à ce départ un profil singulier.

Le cœur reprend le cyprès et l'associe au patchouli et à des notes boisées, un choix qui prolonge la sécheresse du départ plutôt que de la contredire. Le fond, vétiver, ambre et musc, ferme la composition sur une base dense et tenace, typique des eaux de parfum boisées orientales pensées pour durer.

Ce parfum se porte au bureau comme en soirée, sans grand écart entre les deux usages. L'automne et l'hiver lui conviennent le mieux, la densité du cuir et du vétiver s'accordant avec le froid. Maison Numidia livre ce flacon de 90 ml dans toute l'Algérie via Yalidine, paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "narciso-rodriguez-musc-noir",
  name: "Musc Noir For Her",
  allowedNotes: ["Prune","Héliotrope","Musc","Rose","Bois de Cèdre Blanc","Daim"],
  shortDescription: "Musc Noir For Her ouvre sur une prune sombre, avant un cœur dense d'héliotrope, musc et rose sur bois de cèdre blanc. Le fond de daim referme la composition sur une note presque tactile. Une eau de parfum musquée et boisée, pour toutes les saisons.",
  description: `Narciso Rodriguez signe avec Musc Noir For Her une eau de parfum musquée boisée resserrée autour de quelques notes seulement, dans l'esprit épuré propre à la maison. La pyramide reste courte, une prune en tête, un cœur dense et un fond de daim, ce qui laisse chaque matière s'exprimer sans dilution.

L'ouverture est entièrement portée par la prune, une note sombre et légèrement fruitée qui tranche avec les départs agrumes habituels. Ce départ atypique donne le ton d'une composition qui privilégie la densité à la fraîcheur.

Le cœur associe héliotrope, musc, rose et bois de cèdre blanc, un accord dense qui mêle la poudre de l'héliotrope à la rondeur du musc et à la fraîcheur sèche du cèdre. Le fond de daim referme la composition sur une matière presque tactile, qui rappelle le cuir sans en avoir la sécheresse. C'est cette base qui donne au parfum sa tenue sur la peau.

Cette eau de parfum se porte au bureau, en soirée et au quotidien, sans restriction de saison particulière. Maison Numidia propose ce flacon de 100 ml livré dans les 58 wilayas via Yalidine, paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "givenchy-dahlia-divin-le-nectar",
  name: "Dahlia Divin Le Nectar",
  allowedNotes: ["Mimosa","Pêche","Bergamote","Santal Blanc de Mysore","Rose Noire","Jasmin","Patchouli","Musc Sombre","Ambre"],
  shortDescription: "Dahlia Divin Le Nectar ouvre sur mimosa, pêche et bergamote, avant un cœur dense de santal, rose noire et jasmin. Le fond patchouli-musc-ambre installe un sillage sombre et enveloppant. Une eau de parfum pour les soirées d'automne et d'hiver, plutôt que pour le quotidien.",
  description: `Givenchy inscrit Dahlia Divin Le Nectar dans la famille florale orientale, une version dense construite autour du santal blanc de Mysore et de la rose noire. Cette eau de parfum s'adresse à un usage du soir plutôt qu'au quotidien, la densité de la composition demandant de la place pour se déployer.

L'ouverture associe mimosa, pêche et bergamote, un accord floral-fruité qui reste bref avant de céder la place à un cœur plus affirmé. Cette phase initiale adoucit l'entrée dans une composition qui devient rapidement plus sombre.

Le cœur s'appuie sur le santal blanc de Mysore, la rose noire et le jasmin, un trio dense qui installe la dimension orientale du parfum. Le fond, patchouli, musc sombre et ambre, referme la composition sur un sillage enveloppant et tenace, loin de la légèreté du départ floral-fruité.

Cette eau de parfum convient aux soirées, aux sorties nocturnes et aux occasions spéciales, davantage qu'à un usage quotidien. L'automne et l'hiver lui vont bien, la chaleur du santal et de l'ambre compensant le froid. Maison Numidia livre ce flacon de 75 ml dans toute l'Algérie via Yalidine, paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "prada-l-homme-intense",
  name: "L'Homme Intense",
  allowedNotes: ["Iris","Ambre","Patchouli","Fève de Tonka","Cuir","Bois de Santal"],
  shortDescription: "L'Homme Intense ouvre sur un iris sec, avant un cœur ambré-patchouli qui densifie le sillage. Le fond tonka-cuir-santal referme la composition sur une base chaude et boisée. Une eau de parfum pour le bureau comme pour les occasions plus habillées, toute l'année.",
  description: `Prada resserre L'Homme Intense autour de trois accords seulement, dans un registre oriental boisé plus dense que les versions plus légères de la gamme. L'iris en tête, l'ambre et le patchouli en cœur, la fève de tonka, le cuir et le bois de santal en fond : cette pyramide courte laisse chaque matière occuper sa place sans dilution.

L'ouverture mise entièrement sur l'iris, une note sèche et poudrée qui tranche avec les départs agrumes habituels du rayon masculin. Ce choix installe d'emblée un profil plus sobre, loin des ouvertures fraîches et vives.

Le cœur associe l'ambre et le patchouli, un duo qui réchauffe progressivement la sécheresse de l'iris. Le fond, fève de tonka, cuir et bois de santal, prolonge cette chaleur avec une base dense et légèrement gourmande grâce à la tonka. C'est cette dernière phase qui porte le sillage le plus longtemps, bien après que l'iris se soit effacé.

Cette eau de parfum se porte au bureau comme lors d'une occasion plus habillée, et traverse les saisons sans contrainte particulière. Maison Numidia propose ce flacon de 100 ml livré dans les 58 wilayas via Yalidine, paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "hermes-bel-ami",
  name: "Bel Ami",
  allowedNotes: ["Sauge","Bergamote","Cardamome","Mandarine","Citron","Œillet","Patchouli","Cèdre","Racine d'Iris","Basilic","Jasmin","Cuir","Mousse de chêne","Styrax","Vétiver","Ambre","Vanille","Noix de coco"],
  shortDescription: "Bel Ami ouvre sur un accord d'agrumes et d'herbes fraîches (sauge, bergamote, cardamome), avant un cœur épicé d'œillet et de patchouli. Le fond cuir-mousse de chêne-vanille signe un chypré boisé classique. Une eau de toilette pour le bureau et les soirées d'automne.",
  description: `Hermès construit Bel Ami sur une pyramide dense de treize notes, un choix qui le distingue des chyprés boisés plus épurés. La richesse de la formule se ressent dès l'ouverture, avec cinq notes de tête qui se superposent plutôt que de se succéder.

L'attaque associe sauge, bergamote, cardamome, mandarine et citron, un accord aromatique et citronné dense qui installe d'emblée une fraîcheur complexe. Le cœur prend le relais avec l'œillet, le patchouli, le cèdre, la racine d'iris, le basilic et le jasmin, un bouquet épicé et boisé à la fois, plus sec qu'un cœur floral classique.

Le fond ferme la composition sur sept notes : cuir, mousse de chêne, styrax, vétiver, ambre, vanille et noix de coco. Ce dernier accord mêle la sécheresse du cuir et de la mousse de chêne à une chaleur plus douce apportée par la vanille et la noix de coco, un contraste qui fait la signature du parfum. La tenue de cette base explique pourquoi le sillage reste identifiable longtemps après l'application.

Cette eau de toilette convient au bureau comme aux soirées, en particulier à l'automne et à l'hiver où le cuir et la mousse de chêne trouvent leur place. Maison Numidia livre ce flacon de 100 ml dans toute l'Algérie via Yalidine, paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "miu-miu-l-eau",
  name: "Miu Miu L'Eau Bleue",
  allowedNotes: ["Notes Aqueuses","Bergamote","Poire","Pivoine","Rose","Muguet","Bois de Santal","Cèdre","Musc Blanc"],
  shortDescription: "Miu Miu L'Eau Bleue ouvre sur des notes aqueuses, de la bergamote et de la poire, avant un cœur floral de pivoine, rose et muguet. Le fond santal-cèdre-musc blanc reste léger. Une eau de parfum fraîche, adaptée au bureau comme aux journées d'été.",
  description: `Miu Miu inscrit L'Eau Bleue dans la famille florale boisée, avec une entrée aqueuse qui rappelle l'univers marin plus que la fraîcheur florale habituelle de la maison. Cette eau de parfum reste légère du début à la fin, pensée pour un usage répété plutôt que pour une seule occasion.

L'ouverture combine des notes aqueuses, la bergamote et la poire, un trio qui installe une fraîcheur limpide et légèrement fruitée. Ce départ reste discret, sans excès de sucre ni d'agrume franc.

Le cœur s'appuie sur la pivoine, la rose et le muguet, un bouquet floral clair plutôt que dense. Le fond, bois de santal, cèdre et musc blanc, reste tout aussi léger : ces notes boisées ne cherchent pas à alourdir la composition, elles la referment simplement sur une base propre et discrète.

Cette eau de parfum convient au quotidien, au bureau et aux journées d'été, davantage qu'à une soirée habillée. Le printemps et l'été lui vont particulièrement bien. Maison Numidia propose ce flacon de 100 ml livré dans les 58 wilayas via Yalidine, paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "lattafa-oud-for-glory-intense",
  name: "Oud for Glory Intense",
  allowedNotes: ["Safran rouge","Rose arabique","Épices chaudes","Oud fumé intense","Encens d'Oman","Patchouli","Musc oud","Labdanum","Résine de benjoin"],
  shortDescription: "Oud for Glory Intense ouvre sur du safran rouge et de la rose arabique, avant un cœur d'oud fumé et d'encens d'Oman. Le fond musc oud-labdanum-benjoin installe un sillage dense et résineux. Une eau de parfum unisexe pour les soirées d'hiver.",
  description: `Lattafa construit Oud for Glory Intense dans la famille orientale oud, un registre dense et résineux pensé pour un usage unisexe. La composition reste franchement orientale du début à la fin, sans détour vers des notes fraîches ou fruitées.

L'ouverture associe safran rouge, rose arabique et épices chaudes, un accord dense qui installe d'emblée une ambiance profonde et légèrement épicée. Ce départ ne cherche pas la légèreté : il annonce directement la densité du reste de la composition.

Le cœur s'appuie sur un oud fumé intense, de l'encens d'Oman et du patchouli, un trio qui accentue la dimension boisée et fumée du parfum. Le fond, musc oud, labdanum et résine de benjoin, referme la composition sur une base résineuse et tenace, typique des parfums orientaux les plus denses du marché.

Cette eau de parfum convient aux soirées, aux occasions spéciales et aux mois d'hiver, plutôt qu'à un usage léger du quotidien. L'automne et l'hiver restent les saisons les plus adaptées à sa densité. Maison Numidia livre ce flacon de 100 ml dans toute l'Algérie via Yalidine, paiement à la réception et droit de refus à la livraison.`
},
{
  slug: "rasasi-fattan-pour-femme",
  name: "Fattan pour Femme",
  allowedNotes: ["Poivre rose","Citron","Bergamote","Patchouli","Vétiver","Cèdre","Muguet","Ambre","Benjoin","Mousse de chêne"],
  shortDescription: "Fattan pour Femme ouvre sur poivre rose, citron et bergamote, avant un cœur patchouli-vétiver-cèdre étonnamment boisé pour un oriental floral. Le fond ambre-benjoin-mousse de chêne referme la composition sur une base chaude. Une eau de parfum pour le quotidien comme les grandes occasions.",
  description: `Rasasi classe Fattan pour Femme dans la famille orientale florale, mais la construction penche davantage vers le boisé que vers le floral attendu de cette catégorie. Le muguet reste la seule note florale de toute la pyramide, entouré de bois et de résines.

L'ouverture associe poivre rose, citron et bergamote, un accord épicé et citronné qui installe une fraîcheur nette dès l'application. Cette entrée reste vive quelques minutes avant de laisser place à un cœur plus sec.

Le cœur combine patchouli, vétiver, cèdre et muguet, un mélange où le bois domine largement la seule touche florale apportée par le muguet. Le fond, ambre, benjoin et mousse de chêne, prolonge cette direction boisée avec une base chaude et légèrement résineuse, loin de la fraîcheur du départ.

Cette eau de parfum convient au quotidien comme aux occasions plus marquées, et reste appréciée pour un usage avant la prière grâce à sa discrétion. L'automne et l'hiver lui vont mieux que les mois chauds. Maison Numidia propose ce flacon de 50 ml livré dans les 58 wilayas via Yalidine, paiement à la réception et droit de refus à la livraison.`
}
];

const forbidden = [
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
  "---",
  "certificat de conformité",
  "nos entrepôts",
  "fournisseurs vérifiés",
  "coffret d'origine",
  "scellé",
  "dédouané",
  "2025"
];

function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

let allOk = true;

for (const it of items) {
  const errors = [];
  const paras = it.description.split(/\n\n/).map(p => p.trim()).filter(Boolean);
  if (paras.length < 3 || paras.length > 4) errors.push(`paragraphes=${paras.length} (attendu 3-4)`);

  const descWords = wordCount(it.description);
  if (descWords < 230 || descWords > 300) errors.push(`description mots=${descWords} (attendu 230-300)`);

  const shortWords = wordCount(it.shortDescription);
  if (shortWords < 30 || shortWords > 50) errors.push(`shortDescription mots=${shortWords} (attendu 30-50)`);

  // name occurrence count (case-insensitive, whole name)
  const nameRe = new RegExp(it.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const nameCountDesc = (it.description.match(nameRe) || []).length;
  if (nameCountDesc > 3) errors.push(`nom "${it.name}" apparait ${nameCountDesc} fois dans description (max 3)`);

  // forbidden phrases (case-insensitive) in both fields
  const fullText = (it.description + " " + it.shortDescription).toLowerCase();
  for (const f of forbidden) {
    if (fullText.includes(f.toLowerCase())) errors.push(`expression interdite trouvée: "${f}"`);
  }

  // hour-based longevity claim check: digit followed by h or "heure"
  if (/\d+\s*(h\b|heures?)/i.test(fullText)) errors.push(`tenue chiffrée en heures détectée`);

  // stars/notes out of 5
  if (/★|\d\s*\/\s*5/.test(fullText)) errors.push(`étoiles ou note sur 5 détectée`);

  // price digits check (a run of 3+ digits that could be a price, excluding volume "Xml")
  const priceMatches = fullText.match(/\b\d{3,}\b/g) || [];
  const nonVolumePrices = priceMatches.filter(m => {
    // check if followed by "ml" nearby is handled separately; here just flag any 3+ digit number not "58" wilayas etc.
    return true;
  });
  // We'll just manually check for DA/DZD mentions
  if (/\bda\b|dzd|dinars?/i.test(fullText)) errors.push(`mention de prix/devise détectée`);

  if (errors.length) {
    allOk = false;
    console.log(`\n=== ${it.slug} : ERREURS ===`);
    errors.forEach(e => console.log(" - " + e));
  } else {
    console.log(`${it.slug}: OK (desc=${descWords} mots, short=${shortWords} mots, paras=${paras.length}, nom x${nameCountDesc})`);
  }
}

console.log(allOk ? "\nTOUT OK" : "\nDES ERREURS EXISTENT");

// export for writing if all ok
fs.writeFileSync("./scripts/_catalog-audit/_tmp_items_228.json", JSON.stringify(items, null, 1));
