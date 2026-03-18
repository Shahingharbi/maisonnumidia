import { readFileSync, writeFileSync } from 'fs';

const db = JSON.parse(readFileSync('data/products.json', 'utf8'));
const existingSlugs = new Set(db.products.map(p => p.slug));

const newProducts = [

  // 1. Louis Vuitton Ombre Nomade — oriental unisexe niche
  {
    id: "louis-vuitton-ombre-nomade",
    slug: "louis-vuitton-ombre-nomade",
    name: "Ombre Nomade",
    brand: "Louis Vuitton",
    brandSlug: "louis-vuitton",
    gender: "unisexe",
    category: "parfums-orientaux",
    family: "Oriental Boisé Oud",
    concentration: "EDP",
    volume: "100ml",
    price: 27900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'oud selon Louis Vuitton — sombre, envoûtant, absolu. Rose, encens et bois d'oud pour un oriental unisexe d'une richesse olfactive sans compromis, signé par la maison parisienne la plus emblématique.",
    description: "Louis Vuitton Ombre Nomade est une déclaration d'amour à l'oud, la matière première la plus précieuse de la parfumerie orientale. Créé par le maître parfumeur Jacques Cavallier Belletrud pour la collection Les Extraits de Louis Vuitton, ce parfum unisexe incarne la rencontre entre la sophistication parisienne et la profondeur de la culture olfactive du Moyen-Orient et du Maghreb.\n\nLe nom dit tout : Ombre Nomade évoque l'errance dans les déserts dorés, les caravanes de marchands d'épices, les nuits étoilées au-delà du Sahara. C'est cette image poétique qui guide chaque étape de la composition — un voyage olfactif de l'ouverture à la base.\n\nL'ouverture associe la bergamote lumineuse aux premières effluves de rose et d'oud brut. Dès les premières secondes, la signature est claire : nous sommes dans un oriental de luxe absolu. La rose ici n'est pas florale et légère — elle est chaude, profonde, légèrement épicée, comme une rose de Damas séchée et mélangée avec du safran.\n\nLe cœur est magistral : bois d'oud de la plus haute qualité, encens résineuse et légèrement fumée, patchouli sombre et terreux. Cet accord oud-encens-patchouli est l'un des plus riches et des plus complexes de la parfumerie contemporaine. L'oud n'est pas édulcoré ni simplifié pour plaire au plus grand nombre — il est présenté dans toute son authenticité et sa puissance.\n\nLa base d'ambre chaud, musc animal et vétiver terreux ancre la composition dans une profondeur et une persistance exceptionnelles. Sur la peau, Ombre Nomade reste perceptible pendant 14 à 16 heures — parfois davantage sur les vêtements. Son sillage est ample et majestueux, en accord avec le statut de la maison Louis Vuitton.\n\nEn Algérie, où la culture de l'oud est profondément ancrée dans les traditions olfactives, Ombre Nomade résonne avec une authenticité particulière. C'est le choix des amateurs de parfumerie sérieux qui cherchent un oud de maison de luxe parisienne — une alliance rare entre deux mondes olfactifs que tout semble opposer et que tout, finalement, rapproche.",
    notes: {
      top: ["Rose", "Oud", "Bergamote"],
      heart: ["Encens", "Bois d'Oud", "Patchouli"],
      base: ["Ambre", "Musc", "Vétiver"]
    },
    occasions: ["Soirée", "Occasions spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 5,
    image: "/images/products/louis-vuitton-ombre-nomade.jpg",
    inStock: true,
    featured: true,
    isOriental: true,
    related: ["layton-parfums-de-marly", "el-nabil-musc-makkah", "rasasi-hawas"],
    h1: "Louis Vuitton Ombre Nomade Parfum Oriental Algérie"
  },

  // 2. Xerjoff Naxos — niche homme
  {
    id: "xerjoff-naxos",
    slug: "xerjoff-naxos",
    name: "Naxos",
    brand: "Xerjoff",
    brandSlug: "xerjoff",
    gender: "homme",
    category: "parfums-homme",
    family: "Fougère Oriental",
    concentration: "EDP",
    volume: "100ml",
    price: 21000,
    originalPrice: null,
    badge: null,
    shortDescription: "La Sicile dans un flacon. Miel ambré, lavande dorée et tabac doux pour un fougère oriental d'une sensualité ensoleillée — Xerjoff Naxos est l'un des parfums masculins de niche les plus admirés du moment.",
    description: "Xerjoff Naxos est une ode à la Sicile — l'île méditerranéenne baignée de soleil, de miel sauvage et de lavande sauvage. Cette fragrance de la maison italienne de niche Xerjoff, fondée à Turin en 2003, s'est imposée en quelques années comme l'une des références absolues de la parfumerie de niche masculine. Son accord miel-lavande-tabac est devenu presque mythique parmi les passionnés.\n\nL'ouverture est ensoleillée et immédiatement séduisante : bergamote lumineuse de Calabre, citron de Sicile et miel sauvage chaud créent une entrée méditerranéenne d'une douceur et d'une lumière remarquables. Le miel ici est d'une qualité exceptionnelle — doux, naturel, légèrement floral, sans jamais devenir lourd ou pharmaceutique.\n\nLe cœur révèle la complexité de Naxos : lavande de Provence profonde et légèrement balsamique, tabac doux avec ses accords de foin séché et de miel, iris légèrement poudré et jasmin blanc discret. Cet accord lavande-tabac-miel est la signature unique de Naxos — à la fois aromatique et oriental, frais et chaleureux, naturel et sophistiqué. C'est ce paradoxe savamment maîtrisé qui rend le parfum si addictif.\n\nLa base de fève tonka crémeuse, bois de santal de Mysore et musc blanc soyeux donne à Naxos son fond enveloppant et sa tenue exceptionnelle. Sur la peau, il reste perceptible pendant 12 à 14 heures avec une projection flatteuse mais jamais agressive.\n\nEn Algérie, Naxos séduit les hommes qui ont déjà exploré les grandes maisons et cherchent maintenant à se distinguer avec un parfum de niche authentique. Sa chaleur méditerranéenne — si proche du tempérament et du climat algérien — en fait un choix particulièrement juste pour nos soirées d'automne et nos hivers doux.",
    notes: {
      top: ["Bergamote", "Citron", "Miel"],
      heart: ["Lavande", "Tabac", "Iris", "Jasmin"],
      base: ["Tonka", "Musc", "Bois de Santal"]
    },
    occasions: ["Soirée", "Occasions spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/xerjoff-naxos.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["layton-parfums-de-marly", "stronger-with-you-intensely", "spicebomb-viktor-rolf"],
    h1: "Xerjoff Naxos Parfum Homme Algérie"
  },

  // 3. Roja Dove Elysium — niche homme ultra-luxe
  {
    id: "roja-dove-elysium",
    slug: "roja-dove-elysium",
    name: "Elysium Pour Homme",
    brand: "Roja Dove",
    brandSlug: "roja-dove",
    gender: "homme",
    category: "parfums-homme",
    family: "Fougère Boisé",
    concentration: "Parfum",
    volume: "100ml",
    price: 28900,
    originalPrice: null,
    badge: null,
    shortDescription: "La quintessence du parfum masculin britannique. Bergamote, lavande et ambre pour un fougère boisé d'une précision et d'une noblesse absolues — Roja Dove Elysium est l'expression ultime du luxe olfactif.",
    description: "Roja Dove Elysium Pour Homme est l'œuvre d'un maître parfumeur britannique qui a consacré toute sa carrière à l'excellence olfactive. Roja Dove, formé chez Guerlain et devenu l'un des parfumeurs les plus respectés au monde, a créé avec Elysium un parfum masculin qui incarne les valeurs de la grande parfumerie classique revisitée avec un regard contemporain.\n\nLe nom Elysium renvoie aux Champs Élysées de la mythologie grecque — le séjour des héros et des hommes vertueux après leur mort. C'est cette aspiration à l'idéal, à la perfection, qui anime chaque composante de la formule.\n\nL'ouverture est d'une fraîcheur citrus-florale lumineuse et raffinée : bergamote italienne de grande qualité, citron de Sicile pétillant et pamplemousse rose légèrement amer. Ces agrumes ne sont pas là pour faire simple — ils sont utilisés avec une précision chirurgicale pour créer un accord d'une luminosité et d'une clarté exceptionnelles, rappelant les grandes eaux de Cologne du XIXe siècle.\n\nLe cœur est le cœur d'un grand classique réinventé : lavande fine de Haute-Provence d'une pureté absolue, géranium rose légèrement épicé, iris beurré et légèrement poudré, vétiver sec et terreux. Cet accord fougère-floral est l'archétype du masculin raffiné — élégant sans ostentation, affirmé sans brutalité.\n\nLa base d'ambre chaud, musc animal de haute qualité, bois précieux et encens discrète offre une profondeur et une persistance qui distinguent Elysium des simples fragrances fraîches. Sa tenue dépasse les 14 heures sur la peau, avec un sillage discret mais persistant — la marque des grands parfums.\n\nEn Algérie, Roja Dove Elysium s'adresse aux hommes qui ont une connaissance approfondie de la parfumerie et cherchent le summum de l'excellence. C'est le parfum de celui qui sait exactement ce qu'il veut et n'a besoin d'aucune validation extérieure pour l'assumer.",
    notes: {
      top: ["Bergamote", "Citron", "Pamplemousse"],
      heart: ["Lavande", "Géranium", "Iris", "Vétiver"],
      base: ["Ambre", "Musc", "Bois", "Encens"]
    },
    occasions: ["Soirée", "Occasions spéciales", "Dîner"],
    seasons: ["Toutes saisons"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/roja-dove-elysium.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["layton-parfums-de-marly", "stronger-with-you-intensely", "acqua-di-gio-armani"],
    h1: "Roja Dove Elysium Parfum Homme Algérie"
  },

  // 4. Adopt Narcotique — accessible femme
  {
    id: "adopt-narcotique",
    slug: "adopt-narcotique",
    name: "Narcotique",
    brand: "Adopt Mon Parfum",
    brandSlug: "adopt-mon-parfum",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental",
    concentration: "EDP",
    volume: "30ml",
    price: 3500,
    originalPrice: null,
    badge: null,
    shortDescription: "Le floral oriental accessible par Adopt. Bergamote fruitée, rose et jasmin sur un fond de vanille et musc — Narcotique est un parfum féminin séduisant au meilleur rapport qualité-prix du marché algérien.",
    description: "Adopt Mon Parfum est une marque française née d'une idée simple et brillante : rendre accessibles des parfums de qualité réelle, sans le prix des grandes maisons. Adopt Narcotique est l'un des fleurons de cette philosophie — un EDP floral oriental qui rivalise sans complexe avec des parfums vendus à trois fois son prix.\n\nLa marque Adopt, fondée à Brest, travaille avec de vraies matières premières et des parfumeurs professionnels pour créer des formules honnêtes et plaisantes. Narcotique est fidèle à cet engagement : une composition florale orientale construite avec soin, pensée pour les femmes qui veulent sentir bon sans se ruiner.\n\nL'ouverture est fruitée et lumineuse : bergamote fraîche, poire juteuse et pomme légèrement acide créent une tête fruitée accessible et joyeuse. Cette entrée fruitée-fraîche donne au parfum son côté moderne et jeune — une caractéristique très appréciée par les femmes algériennes qui cherchent un parfum pour tous les jours.\n\nLe cœur est le cœur floral classique et bien exécuté : rose fraîche, jasmin blanc légèrement crémeux et ylang-ylang exotique forment un bouquet floral féminin et séduisant. L'ylang-ylang, note signature des floraux orientaux, apporte une touche de sensualité qui justifie le nom Narcotique.\n\nLa base de vanille douce et crémeuse, musc blanc propre et bois de cèdre sec complète la composition avec chaleur et douceur. Ce fond vanillé-musqué est la touche orientale qui distingue Narcotique d'un simple floral et lui donne son caractère addictif. Sur la peau, il tient 5 à 6 heures — honorable pour cette gamme de prix.\n\nEn Algérie, Adopt Narcotique représente une alternative sérieuse aux grands noms pour les femmes qui cherchent la qualité sans compromettre leur budget. Livré en 58 wilayas avec paiement à la réception, c'est une découverte à faire absolument.",
    notes: {
      top: ["Bergamote", "Poire", "Pomme"],
      heart: ["Rose", "Jasmin", "Ylang-Ylang"],
      base: ["Vanille", "Musc", "Bois de Cèdre"]
    },
    occasions: ["Quotidien", "Bureau", "Soirée"],
    seasons: ["Toutes saisons"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/adopt-narcotique.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["amor-amor-cacharel", "bonbon-viktor-rolf", "miu-miu-l-eau"],
    h1: "Adopt Narcotique Parfum Femme Algérie"
  },

  // 5. Zara Rose Gold — accessible femme
  {
    id: "zara-rose-gold",
    slug: "zara-rose-gold",
    name: "Rose Gold",
    brand: "Zara",
    brandSlug: "zara",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Fruité",
    concentration: "EDT",
    volume: "90ml",
    price: 2200,
    originalPrice: null,
    badge: null,
    shortDescription: "La surprise florale-fruitée de Zara. Fraise, rose de mai et musc blanc pour un parfum printanier léger et charmant — Rose Gold prouve que l'élégance n'a pas forcément un prix élevé.",
    description: "Zara Rose Gold est l'une des belles surprises de la parfumerie accessible contemporaine. La marque de mode espagnole, connue pour son sens aigu des tendances, applique la même logique à ses parfums : capter l'air du temps avec des formules modernes, plaisantes et accessibles au plus grand nombre.\n\nRose Gold s'inscrit dans la tendance des floraux fruités rosés qui dominent la parfumerie féminine depuis plusieurs années — cette famille olfactive légère, pétillante et immédiatement séduisante qui plaît autant aux adolescentes qu'aux femmes actives.\n\nL'ouverture est fruitée et pétillante : fraise des bois légèrement sucrée, bergamote lumineuse et pamplemousse rose acidulé créent une tête fruitée joyeuse et accessible. C'est une ouverture qui sent bon l'été, la légèreté, le plaisir simple — exactement ce que promet le nom Rose Gold.\n\nLe cœur est d'une douceur florale plaisante : rose de mai délicate, pivoine rose et magnolia crémeux forment un bouquet floral féminin et printanier. Ces floraux sont traités avec légèreté — leur rôle est d'apporter de la douceur et de la féminité sans alourdir la composition. C'est un cœur qui convient parfaitement aux journées chaudes et lumineuses des printemps et étés algériens.\n\nLa base de musc blanc immaculé, ambre doux et cèdre blanc discret donne à Rose Gold sa légèreté caractéristique en fond. Ce n'est pas un parfum de grande tenue — 3 à 4 heures — mais il se respraye facilement et son format généreux de 90ml permet une utilisation généreuse sans culpabilité.\n\nEn Algérie, Zara Rose Gold est le parfum quotidien par excellence pour les femmes qui veulent sentir bon à petit prix. Sa légèreté le rend particulièrement adapté aux longues journées de chaleur dans les villes du nord et du centre du pays.",
    notes: {
      top: ["Fraise", "Bergamote", "Pamplemousse Rose"],
      heart: ["Rose de Mai", "Pivoine", "Magnolia"],
      base: ["Musc Blanc", "Ambre Doux", "Cèdre Blanc"]
    },
    occasions: ["Quotidien", "Printemps"],
    seasons: ["Printemps", "Été"],
    longevity: 2,
    sillage: 2,
    image: "/images/products/zara-rose-gold.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["amor-amor-cacharel", "dolce-gabbana-light-blue", "miu-miu-l-eau"],
    h1: "Zara Rose Gold Parfum Femme Algérie"
  },

  // 6. Al Haramain Sultan Al Oud — oriental homme
  {
    id: "sultan-al-oud",
    slug: "sultan-al-oud",
    name: "Sultan Al Oud",
    brand: "Al Haramain",
    brandSlug: "al-haramain",
    gender: "homme",
    category: "parfums-orientaux",
    family: "Oriental Boisé Oud",
    concentration: "EDP",
    volume: "100ml",
    price: 5200,
    originalPrice: null,
    badge: null,
    shortDescription: "La royauté de l'oud selon Al Haramain. Safran, oud et rose pour un oriental boisé puissant et majestueux — Sultan Al Oud est le parfum de l'homme qui assume son héritage culturel avec fierté.",
    description: "Al Haramain Sultan Al Oud est un parfum qui porte bien son nom — sultan, roi, maître. Cette création de la maison Al Haramain Perfumes, fondée en Arabie Saoudite et devenue l'une des références absolues de la parfumerie orientale authentique, est une déclaration de puissance et de raffinement à l'orientale.\n\nAl Haramain occupe une place particulière dans le cœur des parfumeurs et amateurs d'orientaux au Maghreb et dans le monde arabe. Leurs créations sont ancrées dans la tradition olfactive de la péninsule arabique — l'oud authentique, le safran de qualité, les résines précieuses — mais travaillées avec les techniques de la parfumerie moderne pour offrir des formules complexes et durables.\n\nL'ouverture de Sultan Al Oud est immédiatement souveraine : safran de qualité avec ses accords légèrement cuir et épicés, rose orientale chaude et généreuse, oud brut dès les premières secondes. Cette entrée ne laisse aucun doute sur les intentions du parfum — nous sommes dans un oriental pur, sans compromis avec les tendances occidentales.\n\nLe cœur développe la profondeur de la composition : bois d'oud travaillé et affirmé, encens résineuse et légèrement fumée, musc animalier discret. L'accord oud-encens est ici dans toute son authenticité — chaud, profond, légèrement terreux — comme l'odeur d'un bakhour de qualité dans un salon traditionnel algérien.\n\nLa base d'ambre chaud et soyeux, santal crémeux de qualité et vétiver légèrement terreux donne à Sultan Al Oud sa persistance remarquable — 12 heures ou plus sur la peau, avec un sillage ample et majestueux qui laisse une trace dans l'espace bien après le passage.\n\nEn Algérie, Sultan Al Oud d'Al Haramain représente le parfum oriental accessible au plus grand nombre — une qualité d'oud authentique à un prix juste, livré dans les 58 wilayas avec paiement à la réception. C'est le choix de l'homme qui connaît la valeur de l'oud véritable.",
    notes: {
      top: ["Oud", "Rose", "Safran"],
      heart: ["Bois d'Oud", "Encens", "Musc"],
      base: ["Ambre", "Santal", "Vétiver"]
    },
    occasions: ["Soirée", "Occasions spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/sultan-al-oud.jpg",
    inStock: true,
    featured: false,
    isOriental: true,
    related: ["el-nabil-musc-makkah", "rasasi-hawas", "layton-parfums-de-marly"],
    h1: "Sultan Al Oud Parfum Oriental Algérie"
  }

];

const toAdd = newProducts.filter(p => !existingSlugs.has(p.slug));
db.products.push(...toAdd);
writeFileSync('data/products.json', JSON.stringify(db, null, 2));
console.log('Produits ajoutés:', toAdd.length);
console.log('Total produits:', db.products.length);
toAdd.forEach(p => console.log(' +', p.slug, '|', p.category, '|', p.price, 'DA'));
