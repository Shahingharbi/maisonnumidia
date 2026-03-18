import { readFileSync, writeFileSync } from 'fs';

const db = JSON.parse(readFileSync('data/products.json', 'utf8'));
const existingSlugs = new Set(db.products.map(p => p.slug));

const newProducts = [

  // 61. Guerlain Mon Guerlain EDP — vol 90
  {
    id: "mon-guerlain",
    slug: "mon-guerlain",
    name: "Mon Guerlain",
    brand: "Guerlain",
    brandSlug: "guerlain",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental Lavande",
    concentration: "EDP",
    volume: "100ml",
    price: 12900,
    originalPrice: null,
    badge: null,
    shortDescription: "La lavande féminine de Guerlain. Lavande de Provence, jasmin et vanille pour un oriental floral envoûtant — Mon Guerlain, la signature olfactive d'une femme libre.",
    description: "Guerlain Mon Guerlain EDP est l'un des parfums féminins les plus séduisants et les plus originaux de la décennie. Lancé en 2017 et inspiré par Angelina Jolie — ambassadrice de la marque — ce floral-oriental à la lavande représente une proposition olfactive unique sur le marché : une lavande féminine, romantique et sensuelle, loin des masculins aromatiques conventionnels.\n\nLa lavande est la clé de voûte de Mon Guerlain. Mais ce n'est pas la lavande masculine fraîche des fougères aromatiques — c'est une lavande de Provence cultivée à haute altitude, d'une qualité exceptionnelle, traitée avec la sophistication qui est le propre de Guerlain. Elle est crémeuse, légèrement amandée, presque douce — une lavande d'un raffinement inouï.\n\nL'ouverture associe cette lavande signature à la bergamote fraîche et à l'amande légèrement gourmande pour une entrée aromatique-florale d'une beauté immédiate. Le cœur révèle le jasmin blanc sensuel de Grasse — grand floral Guerlain par excellence — qui s'associe à la lavande pour créer un accord lavande-jasmin d'une féminité absolue.\n\nLa base est la chaleur orientale qui finalise la composition : vanille bourbon crémeuse de Madagascar, santal fin et cashméran légèrement boisé-ambré. Ce fond oriental enveloppant donne à Mon Guerlain sa tenue remarquable de 10 heures et ce sillage doux qui marque discrètement l'espace. En Algérie, Mon Guerlain est particulièrement apprécié pour son caractère à la fois familier (la lavande, connue) et sophistiqué (le traitement Guerlain).",
    notes: {
      top: ["Lavande de Provence", "Bergamote", "Amande"],
      heart: ["Lavande", "Jasmin Blanc de Grasse"],
      base: ["Vanille Bourbon", "Bois de Santal", "Cashméran"]
    },
    occasions: ["Soirée", "Bureau", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/mon-guerlain.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["insolence-guerlain", "libre-ysl", "alien-mugler"],
    h1: "Mon Guerlain Parfum Femme Algérie"
  },

  // 62. Cacharel Amor Amor — vol 90
  {
    id: "amor-amor-cacharel",
    slug: "amor-amor-cacharel",
    name: "Amor Amor",
    brand: "Cacharel",
    brandSlug: "cacharel",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental Fruité",
    concentration: "EDT",
    volume: "100ml",
    price: 8500,
    originalPrice: null,
    badge: null,
    shortDescription: "L'amour en parfum par Cacharel. Pamplemousse, rose et vanille ambrée pour un floral oriental accessible et romantique — Amor Amor, parce que l'amour ne se conjugue pas à moitié.",
    description: "Cacharel Amor Amor EDT est l'expression olfactive la plus directe de l'amour romantique — intense, sucré, légèrement excessif, mais tellement sincère. Lancé en 2003, il s'est immédiatement imposé comme l'un des parfums féminins les plus vendus au monde dans sa catégorie de prix, conquérant des millions de jeunes femmes grâce à sa composition accessible et son identité visuelle forte.\n\nL'ouverture est fruitée et vivace : pamplemousse rose frais et légèrement acidulé, cassis noir pétillant et mandarine sucrée. Cette tête fruitée-citronnée est immédiatement accessible et plaisante — le genre d'ouverture qui fait sourire dès la première inspiration.\n\nLe cœur floral est romantique et chaleureux : rose fraîche délicate, jasmin blanc discret et lis légèrement crémeux. Cet accord floral accessible et bien construit est le cœur d'Amor Amor — romantique, féminin, avec cette chaleur douce qui prépare la transition vers la base orientale.\n\nLa base orientale est accessible et douce : vanille crémeuse légèrement sucrée, ambre chaud discret, bois de santal doux et musc blanc propre. Ce fond oriental doux et accessible donne à Amor Amor sa profondeur et sa tenue correcte de 6 à 7 heures. En Algérie, Amor Amor est souvent le premier parfum de marque premium des jeunes femmes — son prix accessible, sa composition plaisante et sa réputation positive en font le choix idéal pour entrer dans l'univers de la parfumerie de marque.",
    notes: {
      top: ["Pamplemousse", "Cassis", "Mandarine"],
      heart: ["Rose", "Jasmin Blanc", "Lis"],
      base: ["Vanille", "Ambre", "Bois de Santal", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Bureau", "Printemps"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/amor-amor-cacharel.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["you-cacharel", "yes-i-am-cacharel", "dolce-gabbana-light-blue"],
    h1: "Cacharel Amor Amor Parfum Femme Algérie"
  },

  // 63. Viktor & Rolf Bonbon — vol 90
  {
    id: "bonbon-viktor-rolf",
    slug: "bonbon-viktor-rolf",
    name: "Bonbon",
    brand: "Viktor & Rolf",
    brandSlug: "viktor-rolf",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental Gourmand",
    concentration: "EDP",
    volume: "90ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le bonbon couture de Viktor & Rolf. Mandarine, caramel et bois de santal pour un gourmand oriental d'une douceur sophistiquée — Bonbon, le luxe sucré sans culpabilité.",
    description: "Viktor & Rolf Bonbon EDP est la création féminine la plus gourmande et la plus séduisante de la maison de mode néerlandaise. Lancé en 2014, dans son flacon en forme de nœud couture — référence directe à l'emballage d'une confiserie de luxe — Bonbon marie le savoir-faire de la haute couture avec la générosité gourmande des orientaux sucrés.\n\nLa composition s'ouvre sur un accord fruité-lacté d'une douceur enchanteresse : mandarine sucrée, orange fraîche et une légère touche laiteuse créent une entrée aussi agréable qu'un bonbon de qualité. Cette ouverture fruitée-sucrée est calculée pour séduire immédiatement — et elle réussit parfaitement.\n\nLe cœur révèle la richesse du parfum : caramel doré légèrement beurré et chaud, fleur d'oranger crémeuse et légèrement miellée, pêche veloutée. Cet accord caramel-fleur d'oranger est la signature de Bonbon — gourmand mais raffiné, sucré mais jamais vulgaire. C'est la différence entre un bonbon de supermarché et un caramel d'une confiserie parisienne de luxe.\n\nLa base de bois de santal crémeux, notes boisées légères et musc blanc soyeux donne à Bonbon sa profondeur et sa tenue solide de 8 heures. En Algérie, Bonbon attire les femmes qui aiment les parfums sucrés-gourmands mais cherchent quelque chose de plus sophistiqué que les orientaux accessibles — un parfum qui assume son côté sucré avec l'élégance d'une maison de couture.",
    notes: {
      top: ["Mandarine", "Orange", "Notes Lactées"],
      heart: ["Caramel", "Fleur d'Oranger", "Pêche"],
      base: ["Bois de Santal", "Notes Boisées", "Musc Blanc"]
    },
    occasions: ["Soirée", "Automne", "Cadeau"],
    seasons: ["Automne", "Hiver"],
    longevity: 4,
    sillage: 4,
    image: "/images/products/bonbon-viktor-rolf.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["prada-candy", "hypnotic-poison-dior", "spicebomb-viktor-rolf"],
    h1: "Viktor Rolf Bonbon Parfum Femme Algérie"
  },

  // 64. Miu Miu L'Eau Bleue — vol 90
  {
    id: "miu-miu-l-eau",
    slug: "miu-miu-l-eau",
    name: "Miu Miu L'Eau Bleue",
    brand: "Miu Miu",
    brandSlug: "miu-miu",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé",
    concentration: "EDP",
    volume: "100ml",
    price: 9500,
    originalPrice: null,
    badge: null,
    shortDescription: "La légèreté florale de Miu Miu. Pivoine, rose et bois de santal pour un floral boisé frais et élégant — L'Eau Bleue, la jeunesse de la maison Prada.",
    description: "Miu Miu L'Eau Bleue EDP est la fragrance la plus fraîche et la plus légère de la gamme parfumée de la maison de mode italienne. Lancé en 2016 comme pendant estival de la signature Miu Miu originale, L'Eau Bleue propose une interprétation plus aérienne et plus aquatique du floral boisé de la maison.\n\nLa composition s'articule autour d'un accord floral-aquatique d'une fraîcheur et d'une légèreté remarquables. L'ouverture est d'une clarté cristalline : notes aqueuses légèrement florales, bergamote lumineuse et poire fraîche juteuse. Cette tête fraîche et légère est immédiatement printanière — elle donne envie de se plonger dans un jardin sous la pluie.\n\nLe cœur floral est d'une délicatesse et d'une légèreté voulues : pivoine rose poudré délicate, rose fraîche légèrement aquatique et muguet cristallin. Cet accord floral aquatique est le cœur de L'Eau Bleue — léger comme une brise marine, floral sans jamais être lourd ou entêtant.\n\nLa base de bois de santal doux et crémeux, cèdre léger et musc blanc propre ancre délicatement la composition. La tenue est modérée — 5 à 6 heures — en accord avec le caractère aérien du parfum. En Algérie, Miu Miu L'Eau Bleue est particulièrement adapté aux chaleurs estivales et au quotidien printanier — son profil léger et non entêtant en fait un parfum qu'on peut porter toute la journée sans jamais fatiguer.",
    notes: {
      top: ["Notes Aqueuses", "Bergamote", "Poire"],
      heart: ["Pivoine", "Rose", "Muguet"],
      base: ["Bois de Santal", "Cèdre", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Bureau", "Été"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 2,
    image: "/images/products/miu-miu-l-eau.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["chloe-signature", "givenchy-irresistible", "narciso-rodriguez-for-her"],
    h1: "Miu Miu L'Eau Bleue Parfum Femme Algérie"
  },

  // 65. Mademoiselle Rochas — vol 90
  {
    id: "mademoiselle-rochas",
    slug: "mademoiselle-rochas",
    name: "Mademoiselle Rochas",
    brand: "Rochas",
    brandSlug: "rochas",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Fruité Boisé",
    concentration: "EDP",
    volume: "90ml",
    price: 9900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'élégance parisienne accessible de Rochas. Bergamote, pivoine et bois de santal pour un floral fruité boisé léger et romantique — Mademoiselle, la Parisienne de la parfumerie.",
    description: "Rochas Mademoiselle EDP est la fragrance féminine la plus moderne de la maison française Rochas — une maison de couture fondée en 1925 qui a toujours su allier l'élégance française classique à une certaine accessibilité. Lancé en 2012, ce floral fruité boisé incarne la jeune Parisienne contemporaine — légère, élégante, avec un sourire désarmant.\n\nL'ouverture est fraîche et fruitée avec caractère : bergamote lumineuse et légèrement amère, framboise rose sucrée et pamplemousse pétillant légèrement acidulé. Cette tête fruitée-agrumée est immédiatement accessible et plaisante — elle installe une atmosphère légère et positive.\n\nLe cœur floral est romantique et délicat : pivoine rose fraîche et légèrement poudrée — fleur emblématique de la féminité parisienne — rose fraîche délicate et magnolia doux crémeux. Cet accord floral léger et romantique est le cœur de Mademoiselle — féminin, accessible, avec cette légèreté naturelle qui distingue les Parisiennes des autres femmes du monde.\n\nLa base de bois de santal crémeux, patchouli traité avec subtilité et musc blanc soyeux donne à Mademoiselle sa profondeur boisée et sa tenue correcte de 7 heures. En Algérie, Mademoiselle Rochas attire les femmes qui cherchent un floral fruité léger de marque française connue à un prix accessible — la combinaison idéale qualité-prix pour un parfum quotidien.",
    notes: {
      top: ["Bergamote", "Framboise", "Pamplemousse"],
      heart: ["Pivoine", "Rose", "Magnolia"],
      base: ["Bois de Santal", "Patchouli", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Bureau", "Printemps"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/mademoiselle-rochas.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["armani-my-way", "chloe-signature", "amor-amor-cacharel"],
    h1: "Mademoiselle Rochas Parfum Femme Algérie"
  },

  // 66. Givenchy Ange ou Démon — vol 70
  {
    id: "ange-ou-demon-givenchy",
    slug: "ange-ou-demon-givenchy",
    name: "Ange ou Démon",
    brand: "Givenchy",
    brandSlug: "givenchy",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental",
    concentration: "EDP",
    volume: "100ml",
    price: 12900,
    originalPrice: null,
    badge: null,
    shortDescription: "La dualité féminine de Givenchy. Magnolia, tubéreuse et encens pour un floral oriental mystérieux et envoûtant — Ange ou Démon, la femme qui choisit ses propres règles.",
    description: "Givenchy Ange ou Démon EDP est l'une des fragrances féminines les plus mystérieuses et les plus envoûtantes de la maison parisienne. Lancé en 2006, son nom révèle tout de son caractère : une tension perpétuelle entre la pureté florale angélique et la profondeur sombre du démon oriental — une dualité féminine célébrée comme une force plutôt qu'une contradiction.\n\nL'ouverture est d'une beauté lumineuse et légèrement verte : magnolia blanc délicat, notes vertes légèrement herbales et bergamote lumineuse. Cette tête florale-fraîche est la face angélique du parfum — pure, lumineuse, d'une délicatesse absolue.\n\nLe cœur révèle la face obscure : tubéreuse blanche crémeuse et légèrement capiteuse — l'une des fleurs les plus sensuelles et les plus intenses de la parfumerie — et jasmin blanc d'une richesse florale opulente. Ces deux fleurs blanches opulentes portent le parfum vers une sensualité assumée et enveloppante.\n\nLa base orientale est la pleine révélation de la face démoniaque : encens pur légèrement résineux et mystique, vétiver sec boisé, ambre doux et bois de santal crémeux. Ce fond oriental-encensé donne à Ange ou Démon sa profondeur, sa tenue remarquable de 12 heures et ce sillage mystérieux qui laisse une impression durable et mémorable. En Algérie, Ange ou Démon plaît particulièrement aux femmes qui cherchent un parfum de soirée avec du caractère et de la profondeur.",
    notes: {
      top: ["Magnolia Blanc", "Notes Vertes", "Bergamote"],
      heart: ["Tubéreuse Blanche", "Jasmin Blanc", "Pêche"],
      base: ["Encens", "Vétiver", "Ambre", "Bois de Santal"]
    },
    occasions: ["Soirée", "Occasions Spéciales", "Mariage"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/ange-ou-demon-givenchy.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["givenchy-l-interdit", "hypnotic-poison-dior", "alien-mugler"],
    h1: "Givenchy Ange ou Démon Parfum Femme Algérie"
  },

  // 67. Burberry Goddess EDP — vol 70
  {
    id: "goddess-burberry",
    slug: "goddess-burberry",
    name: "Goddess",
    brand: "Burberry",
    brandSlug: "burberry",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental Vanillé",
    concentration: "EDP",
    volume: "100ml",
    price: 14900,
    originalPrice: null,
    badge: null,
    shortDescription: "La déesse britannique de Burberry. Lavande, lait d'iris et vanille cachemire pour un floral oriental doux et envoûtant — Goddess est la féminité sublimée.",
    description: "Burberry Goddess EDP est la surprise parfumée la plus réussie de la maison britannique ces dernières années. Lancé en 2023, ce floral oriental à la lavande a immédiatement séduit par une proposition olfactive à la fois familière et innovante : une lavande féminine, crémeuse, légèrement vanillée, d'une douceur et d'une sophistication remarquables.\n\nLa composition s'inscrit dans la tendance actuelle des parfums à la lavande féminine — dont Mon Guerlain est le chef de file — tout en apportant une touche britannique distinctive : plus crémeuse, plus douce, plus enveloppante. L'ouverture conjugue la lavande fraîche de Provence avec la bergamote lumineuse pour une entrée aromatique-florale d'une grande fraîcheur.\n\nLe cœur est la véritable originalité de Goddess : lait d'iris blanc crémeux et légèrement laitier — une déclinaison de l'iris d'une douceur presque comfort food — associé à la lavande crémeuse. Cet accord iris-lavande-lait est absolument unique dans la parfumerie féminine — doux, enveloppant, avec cette qualité comfort qui rappelle les textures de cachemire britannique.\n\nLa base de vanille cachemire douce et soyeuse, bois de santal crémeux et musc blanc propre donne à Goddess sa chaleur persistante et sa tenue solide de 10 heures. En Algérie, Goddess de Burberry attire les femmes qui ont été séduites par la tendance lavande-vanille et cherchent une version haut de gamme et sophistiquée — une alternative féminine à Sauvage, avec la même qualité Dior mais pour les femmes.",
    notes: {
      top: ["Lavande", "Bergamote"],
      heart: ["Lait d'Iris Blanc", "Lavande Crémeuse"],
      base: ["Vanille Cachemire", "Bois de Santal", "Musc Blanc"]
    },
    occasions: ["Soirée", "Bureau", "Automne"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/goddess-burberry.jpg",
    inStock: true,
    featured: true,
    isOriental: false,
    related: ["mon-guerlain", "libre-ysl", "alien-mugler"],
    h1: "Burberry Goddess Parfum Femme Algérie"
  },

  // 68. Issey Miyake L'Eau d'Issey femme — vol 90
  {
    id: "l-eau-d-issey-femme",
    slug: "l-eau-d-issey-femme",
    name: "L'Eau d'Issey",
    brand: "Issey Miyake",
    brandSlug: "issey-miyake",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Aquatique",
    concentration: "EDT",
    volume: "100ml",
    price: 10500,
    originalPrice: null,
    badge: null,
    shortDescription: "L'eau qui a révolutionné la parfumerie. Cyclamen aquatique, rose et bois de santal pour un floral aquatique iconique — L'Eau d'Issey, l'air et l'eau en un seul parfum.",
    description: "Issey Miyake L'Eau d'Issey pour Femme EST un parfum qui a véritablement révolutionné la parfumerie féminine. Lancé en 1992 par Jacques Cavallier, il est l'un des premiers grands floraux aquatiques féminins — et à ce jour l'un des plus réussis. Trente ans après sa création, il reste dans le top mondial des ventes, une longévité qui témoigne d'une formule construite sur une vision olfactive authentique et universelle.\n\nLe concept de L'Eau d'Issey est aussi simple que radical : distiller dans un flacon la pure sensation de l'eau — ses notes olfactives aqueuses, fraîches, légèrement florales. Jacques Cavallier a utilisé pour la première fois à grande échelle les notes ozonic et aquatiques synthétiques pour créer cette sensation de fraîcheur marine absolue.\n\nL'ouverture est d'une fraîcheur aqueuse iconique : cyclamen aquatique légèrement floral, melon d'eau frais et lotus blanc cristallin. C'est la signature parfumée de L'Eau d'Issey — immédiatement reconnaissable, d'une fraîcheur et d'une clarté absolues.\n\nLe cœur floral est aérien et délicat : rose fraîche légèrement aquatique, pivoine rose délicate et freesia blanc cristallin. Ces floraux aquatiques constituent un cœur d'une légèreté et d'une transparence uniques dans la parfumerie féminine.\n\nLa base de bois de santal crémeux, musc blanc propre, ambre discret et cèdre léger donne à L'Eau d'Issey sa profondeur discrète et sa tenue de 6 à 7 heures. En Algérie, L'Eau d'Issey est le parfum idéal pour les femmes qui cherchent un classique intemporel — quelque chose d'élégant, de non-daté et d'universellement apprécié.",
    notes: {
      top: ["Cyclamen", "Melon d'Eau", "Lotus Blanc"],
      heart: ["Rose Aquatique", "Pivoine", "Freesia"],
      base: ["Bois de Santal", "Musc Blanc", "Ambre", "Cèdre"]
    },
    occasions: ["Quotidien", "Bureau", "Printemps"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/l-eau-d-issey-femme.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["narciso-rodriguez-for-her", "chloe-signature", "armani-my-way"],
    h1: "Issey Miyake L'Eau d'Issey Parfum Femme Algérie"
  }

];

const toAdd = newProducts.filter(p => !existingSlugs.has(p.slug));
db.products.push(...toAdd);
writeFileSync('data/products.json', JSON.stringify(db, null, 2));
console.log('Produits ajoutés:', toAdd.length);
console.log('Total produits:', db.products.length);
toAdd.forEach(p => console.log(' +', p.slug, '|', p.category, '|', p.price, 'DA'));
