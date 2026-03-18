import { readFileSync, writeFileSync } from 'fs';

const db = JSON.parse(readFileSync('data/products.json', 'utf8'));
const existingSlugs = new Set(db.products.map(p => p.slug));

const newProducts = [

  // 46. Dior Poison Girl — vol 110
  {
    id: "poison-girl-dior",
    slug: "poison-girl-dior",
    name: "Poison Girl",
    brand: "Dior",
    brandSlug: "dior",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental",
    concentration: "EDP",
    volume: "100ml",
    price: 12900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le poison doux de Dior. Orange amère, rose et vanille tonka pour un floral oriental subtilement dangereux — Poison Girl est la séductrice qui sait ce qu'elle fait.",
    description: "Dior Poison Girl EDP est la réinterprétation moderne de l'icône Poison de 1985 — pour une génération de femmes qui veulent la séduction sans le drama des 80s. Lancé en 2016, il garde l'esprit provocateur de Poison tout en adoptant un langage olfactif plus accessible et plus doux, parfaitement calibré pour les goûts contemporains.\n\nL'ouverture est d'une fraîcheur légèrement amère et florale : orange amère légèrement acidulée et aromatique, bergamote lumineuse et rose fraîche. Cette entrée florale-agrumée est immédiatement accessible et séduisante — elle n'intimide pas, elle invite.\n\nLe cœur révèle le véritable caractère de Poison Girl : rose de Grasse d'une qualité Dior exemplaire, jasmin blanc sensuel et groseille rouge légèrement acidulée. Cet accord rose-jasmin-groseille au cœur est d'une richesse et d'une fraîcheur particulières — floral mais pas sage, lumineux mais profond.\n\nLa base est la signature addictive du parfum : fève tonka crémeuse et légèrement lactique, vanille douce et amande amère subtile. Ce fond gourmand-oriental doux donne à Poison Girl sa chaleur caractéristique, sa tenue de 10 heures et son sillage légèrement enveloppant. En Algérie, Poison Girl est souvent décrit comme 'le parfum qui fait retourner les têtes discrètement' — sa séduction est calculée, sophistiquée, jamais agressive.",
    notes: {
      top: ["Orange Amère", "Bergamote", "Rose"],
      heart: ["Rose de Grasse", "Jasmin", "Groseille Rouge"],
      base: ["Fève Tonka", "Vanille", "Amande Amère"]
    },
    occasions: ["Soirée", "Quotidien", "Bureau"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 5,
    sillage: 3,
    image: "/images/products/poison-girl-dior.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["hypnotic-poison-dior", "miss-dior", "black-opium-ysl"],
    h1: "Dior Poison Girl Parfum Femme Algérie"
  },

  // 47. Dior Hypnotic Poison — vol 110
  {
    id: "hypnotic-poison-dior",
    slug: "hypnotic-poison-dior",
    name: "Hypnotic Poison",
    brand: "Dior",
    brandSlug: "dior",
    gender: "femme",
    category: "parfums-femme",
    family: "Oriental Boisé Vanillé",
    concentration: "EDT",
    volume: "100ml",
    price: 12900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'hypnose olfactive de Dior. Amande, jasmin tubéreuse et vanille pour un oriental boisé envoûtant et mémorable — Hypnotic Poison, l'addiction en parfum.",
    description: "Dior Hypnotic Poison EDT est l'un des parfums féminins les plus addictifs et les plus distinctifs de la maison Dior. Lancé en 1998 par Annick Ménardo, il représente une rupture audacieuse avec les floraux conventionnels — un parfum qui mise tout sur l'envoûtement, sur la texture et sur une profondeur orientale d'une richesse rare.\n\nLa note dominante de Hypnotic Poison est l'amande — douce, crémeuse, légèrement lactique, avec cette ambiguïté entre l'alimentaire et le cosmétique qui lui donne son caractère hypnotisant. Associée à la noix de coco au début, elle crée une tête douce-crémeuse absolument mémorable. La bergamote et le carvi apportent une légère fraîcheur aromatique qui contraste avec cette richesse crémeuse.\n\nLe cœur est d'une opulence florale orientale : tubéreuse blanche légèrement capiteuse et crémeuse — une des fleurs les plus sensuelles de la parfumerie — jasmin blanc profond et légèrement animal. Ces deux fleurs blanches opulentes sont la signature florale du parfum, elles portent la composition vers une sensualité assumée.\n\nLa base de vanille boisée, bois de santal et jatamansi — une résine indienne aux accords boisés et légèrement fumés — donne à Hypnotic Poison sa profondeur orientale, sa tenue exceptionnelle de 12 heures et son sillage enveloppant. En Algérie, Hypnotic Poison est un parfum de soirée par excellence — trop riche pour le quotidien, parfait pour les occasions où on veut laisser une impression durable.",
    notes: {
      top: ["Amande", "Noix de Coco", "Carvi"],
      heart: ["Tubéreuse", "Jasmin Blanc", "Rose"],
      base: ["Vanille Boisée", "Bois de Santal", "Jatamansi"]
    },
    occasions: ["Soirée", "Automne", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/hypnotic-poison-dior.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["poison-girl-dior", "alien-mugler", "prada-candy"],
    h1: "Dior Hypnotic Poison Parfum Femme Algérie"
  },

  // 48. Guerlain Insolence — vol 110
  {
    id: "insolence-guerlain",
    slug: "insolence-guerlain",
    name: "Insolence",
    brand: "Guerlain",
    brandSlug: "guerlain",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé Violet",
    concentration: "EDP",
    volume: "50ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'insolence florale de Guerlain. Violette, iris et rose pour un floral violet signature d'une audace et d'une élégance typiquement guerlainoises.",
    description: "Guerlain Insolence EDP est l'un des parfums féminins les plus audacieux et les plus distinctifs de la maison Guerlain. Lancé en 2006, il porte bien son nom : il y a dans cette fragrance une certaine insolence — florale, colorée, légèrement provocatrice — qui la distingue immédiatement des floraux conventionnels.\n\nLa composition s'articule autour de la violette — fleur symbolique de Guerlain depuis ses débuts au XIXe siècle — dans une interprétation moderne et vivace. L'ouverture conjugue la bergamote lumineuse avec la violette fraîche et légèrement fruitée, et le pamplemousse rosé pour une entrée florale-fruitée colorée et joyeuse.\n\nLe cœur est d'une richesse violette remarquable : violet ionone légèrement poudré et fruitée, iris doux et crémeux, rose fraîche délicate. Cet accord violet-iris-rose est la signature absolue d'Insolence — une palette florale qui oscille entre la douceur poudrée et la vivacité fruitée, avec ce caractère distinctif que seule la violette peut apporter.\n\nLa base de bois de santal crémeux, musc blanc soyeux et benjoin légèrement vanillé donne à Insolence sa chaleur caractéristique et sa tenue solide de 8 heures. C'est un parfum Guerlain accessible — moins complexe que les grands classiques de la maison comme Shalimar ou L'Heure Bleue, mais avec la même qualité de composition et la même identité olfactive forte. En Algérie, Insolence plaît aux femmes qui aiment les floraux poudres distinctifs.",
    notes: {
      top: ["Bergamote", "Violette", "Pamplemousse"],
      heart: ["Violette Ionone", "Iris", "Rose"],
      base: ["Bois de Santal", "Musc Blanc", "Benjoin"]
    },
    occasions: ["Quotidien", "Bureau", "Printemps"],
    seasons: ["Printemps", "Automne"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/insolence-guerlain.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["mon-guerlain", "tresor-lancome", "chloe-signature"],
    h1: "Guerlain Insolence Parfum Femme Algérie"
  },

  // 49. Kenzo Flower — vol 110
  {
    id: "kenzo-flower",
    slug: "kenzo-flower",
    name: "Flower by Kenzo",
    brand: "Kenzo",
    brandSlug: "kenzo",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé",
    concentration: "EDP",
    volume: "100ml",
    price: 9900,
    originalPrice: null,
    badge: null,
    shortDescription: "La fleur urbaine de Kenzo. Violette sauvage, cassis et oakmoss pour un floral boisé iconique — Flower, la nature au coeur de la ville.",
    description: "Kenzo Flower by Kenzo EDP est l'un des parfums féminins les plus reconnaissables de la parfumerie contemporaine. Lancé en 2000 par Alberto Morillas — l'un des nez les plus prolifiques de son époque — il s'est immédiatement distingué par un concept olfactif original : la fleur sauvage au cœur de la ville, la nature qui repousse à travers le béton.\n\nLe flacon iconique — un coquelicot rouge lumineux sur fond blanc — incarne parfaitement ce concept. Tout aussi reconnaissable visuellement qu'olfactivement, Flower by Kenzo est devenu l'un des grands classiques de la parfumerie féminine accessible.\n\nL'ouverture est fraîche et végétale : cassis noir légèrement acidulé et fruité, mandarine lumineuse et bergamote. Ces agrumes vivaces créent une tête pétillante et accessible qui installe immédiatement un sentiment de fraîcheur naturelle.\n\nLe cœur est d'une beauté florale sauvage : violette sauvage légèrement poudrée et fruitée — la fleur centrale du parfum — rose délicate et muguet cristallin. Cet accord violet-rose-muguet est le cœur de Flower — accessible, poétique, avec cette qualité naturelle qui distingue les grands floraux.\n\nLa base de musc blanc immaculé, oakmoss légèrement terreux et vétiver sec donne à Flower sa profondeur boisée et son caractère distinctif. En Algérie, Kenzo Flower est souvent le parfum de la femme indépendante et naturelle — celle qui préfère la beauté sauvage à l'élégance conventionnelle.",
    notes: {
      top: ["Cassis", "Bergamote", "Mandarine"],
      heart: ["Violette Sauvage", "Rose", "Muguet"],
      base: ["Musc Blanc", "Oakmoss", "Vétiver"]
    },
    occasions: ["Quotidien", "Bureau", "Printemps"],
    seasons: ["Printemps", "Été"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/kenzo-flower.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["kenzo-l-eau-homme", "chloe-signature", "narciso-rodriguez-for-her"],
    h1: "Kenzo Flower Parfum Femme Algérie"
  },

  // 50. JPG La Belle — vol 110
  {
    id: "la-belle-jean-paul-gaultier",
    slug: "la-belle-jean-paul-gaultier",
    name: "La Belle",
    brand: "Jean Paul Gaultier",
    brandSlug: "jean-paul-gaultier",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé Fruité",
    concentration: "EDP",
    volume: "100ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "La beauté féminine selon Jean Paul Gaultier. Poire, fleur d'oranger et patchouli pour un floral fruité boisé généreux et moderne — La Belle, le féminin JPG dans toute sa splendeur.",
    description: "Jean Paul Gaultier La Belle EDP est la contrepartie féminine de Le Beau, lancée en 2019 pour compléter la nouvelle vision parfumée de la maison JPG. La Belle incarne l'idéal féminin de Jean Paul Gaultier — généreux, sensuel, légèrement provocateur mais toujours élégant.\n\nL'ouverture est fruitée et lumineuse : poire dorée juteuse et légèrement sucrée, bergamote lumineuse et mandarine fraîche. Ces fruits ensoleillés créent une entrée accessible et séduisante, immédiatement plaisante.\n\nLe cœur est floral avec une générosité caractéristique JPG : fleur d'oranger crémeuse et légèrement miellée — note que la maison maîtrise parfaitement depuis Le Male — jasmin blanc discret et magnolia doux. Cet accord floral au cœur est d'une richesse crémeuse-florale qui donne à La Belle son caractère féminin affirmé.\n\nLa base est la surprise boisée de La Belle : patchouli crémeux et légèrement terreux, bois de santal doux et vanille discrète. Ce fond boisé-patchoulé donne au parfum sa profondeur et sa tenue solide de 8 à 10 heures — bien mieux que la plupart des fruités-floraux de sa gamme. En Algérie, La Belle attire les femmes qui connaissent déjà l'univers JPG via Scandal ou Le Male et veulent découvrir le versant féminin boisé de la maison.",
    notes: {
      top: ["Poire", "Bergamote", "Mandarine"],
      heart: ["Fleur d'Oranger", "Jasmin Blanc", "Magnolia"],
      base: ["Patchouli", "Bois de Santal", "Vanille"]
    },
    occasions: ["Quotidien", "Soirée", "Bureau"],
    seasons: ["Printemps", "Automne"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/la-belle-jean-paul-gaultier.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["scandal-jean-paul-gaultier", "born-in-roma-valentino", "armani-my-way"],
    h1: "Jean Paul Gaultier La Belle Parfum Femme Algérie"
  },

  // 51. Paco Rabanne Lady Million — vol 110
  {
    id: "lady-million-paco-rabanne",
    slug: "lady-million-paco-rabanne",
    name: "Lady Million",
    brand: "Paco Rabanne",
    brandSlug: "paco-rabanne",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Chypré",
    concentration: "EDP",
    volume: "80ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le million féminin de Paco Rabanne. Framboise, gardénia et patchouli pour un chypré floral glamour et sensuel — Lady Million, la femme qui sait ce que vaut.",
    description: "Paco Rabanne Lady Million EDP est la réponse féminine au 1 Million masculin — un parfum qui incarne le glamour, la richesse et la confiance en soi dans leur expression féminine la plus aboutie. Lancé en 2010, Lady Million a rapidement conquis les femmes qui cherchaient un parfum à la fois luxueux dans son image et accessible dans son positionnement.\n\nL'ouverture est d'un glamour immédiat : framboise rose pétillante et légèrement acidulée, néroli frais de fleur d'oranger et orange sanguine vive. Cette tête fruitée-florale est exactement ce qu'elle promet — lumineuse, attractive, de bon goût.\n\nLe cœur révèle l'élégance chyprée du parfum : gardénia blanc crémeux et légèrement capiteux — fleur signature du glamour hollywoodien — jasmin blanc sensuel. Cet accord floral opulent est le cœur de Lady Million — féminin, séduisant, avec cette richesse florale qui justifie le nom.\n\nLa base chyprée-orientale est la force du parfum : patchouli sombre légèrement terreux, miel doré légèrement sucré et ambre chaud. Ce fond patchouli-miel-ambré donne à Lady Million sa profondeur, sa tenue de 10 heures et ce sillage de présence qui est sa marque de fabrique. En Algérie, Lady Million est un parfum cadeau particulièrement apprécié — son flacon en forme de diamant, son nom évocateur et sa composition de qualité en font le choix idéal pour toutes les occasions festives.",
    notes: {
      top: ["Framboise", "Néroli", "Orange Sanguine"],
      heart: ["Gardénia", "Jasmin Blanc"],
      base: ["Patchouli", "Miel", "Ambre"]
    },
    occasions: ["Soirée", "Occasions Spéciales", "Cadeau"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/lady-million-paco-rabanne.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["olympea-paco-rabanne", "1-million-paco-rabanne", "good-girl-carolina-herrera"],
    h1: "Paco Rabanne Lady Million Parfum Femme Algérie"
  },

  // 52. Givenchy Organza — vol 110
  {
    id: "organza-givenchy",
    slug: "organza-givenchy",
    name: "Organza",
    brand: "Givenchy",
    brandSlug: "givenchy",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental",
    concentration: "EDP",
    volume: "100ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le grand floral oriental de Givenchy. Ylang-ylang, lis et vanille ambrée pour un floral oriental classique et intemporel — Organza, la haute couture olfactive.",
    description: "Givenchy Organza EDP est un grand classique de la parfumerie féminine florale-orientale. Lancé en 1996 par Givenchy, il porte le nom du tissu de soie léger et transparent emblématique de la haute couture — une référence qui dit tout sur l'esprit du parfum : aérien en surface, riche en profondeur, d'une élégance absolue.\n\nLa composition s'ouvre sur un accord floral fruité délicat : abricot doré, bergamote lumineuse et mandarine sucrée. Cette tête fruitée-florale est accessible et lumineuse, parfaitement calibrée pour attirer l'attention sans écraser.\n\nLe cœur est le joyau du parfum : ylang-ylang de Madagascar légèrement exotique et crémeux, lis blanc délicat et légèrement poudré, magnolia doux et rose fraîche. Cet accord floral opulent est d'une richesse et d'une complexité qui justifient pleinement le positionnement luxe de Givenchy — chaque fleur apporte sa contribution sans dominer les autres.\n\nLa base orientale est somptueuse : vanille crémeuse et chaude, musc blanc soyeux, bois de santal onctueux et ambre discret. Ce fond oriental enveloppant donne à Organza sa profondeur, sa tenue remarquable de 10 à 12 heures et ce sillage floral-vanillé mémorable qui est sa marque de fabrique. En Algérie, Organza plaît aux femmes qui apprécient les floraux classiques avec une profondeur orientale — un parfum généreux et sans ambiguïté, qui célèbre la féminité avec une élégance haute couture.",
    notes: {
      top: ["Abricot", "Bergamote", "Mandarine"],
      heart: ["Ylang-Ylang", "Lis Blanc", "Magnolia", "Rose"],
      base: ["Vanille", "Musc Blanc", "Bois de Santal", "Ambre"]
    },
    occasions: ["Soirée", "Occasions Spéciales", "Mariage"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/organza-givenchy.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["tresor-lancome", "givenchy-irresistible", "dolce-gabbana-the-one"],
    h1: "Givenchy Organza Parfum Femme Algérie"
  },

  // 53. Gucci Flora Gorgeous Gardenia — vol 110
  {
    id: "gucci-flora-gorgeous",
    slug: "gucci-flora-gorgeous",
    name: "Flora Gorgeous Gardenia",
    brand: "Gucci",
    brandSlug: "gucci",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Fruité",
    concentration: "EDP",
    volume: "100ml",
    price: 13900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le jardin de Gucci en flacon. Baies rouges, gardénia et patchouli pour un floral fruité luxueux et moderne — Flora Gorgeous Gardenia, quand la maison Gucci cultive sa beauté.",
    description: "Gucci Flora Gorgeous Gardenia EDP est la fragrance féminine la plus séduisante de la nouvelle ère Gucci. Lancée en 2021, elle s'inscrit dans la collection Flora de la maison — inspirée par le célèbre motif floral créé pour Grace Kelly en 1966 — et en offre l'interprétation la plus moderne et la plus accessible.\n\nL'ouverture est d'une fraîcheur fruitée-sucrée gourmande : baies rouges juteuses légèrement acidulées et cassonade dorée légèrement caramélisée. Cette association fruit-sucre crée une entrée aussi appétissante qu'un dessert raffiné — immédiatement séduisante et mémorable.\n\nLe cœur floral est opulent : gardénia blanc crémeux et légèrement capiteux — fleur de luxe par excellence — et jasmin blanc sensuel. Cet accord floral gardénia-jasmin est la signature de Flora Gorgeous Gardenia — riche, floral, légèrement exotique, avec cette creaminess du gardénia qui est sa principale force.\n\nLa base boisée-balsamique est moderne et efficace : bois de santal doux, patchouli légèrement terreux et notes boisées. Ce fond boisé ancre le floral crémeux du cœur dans une profondeur contemporaine et lui donne sa tenue solide de 8 heures. En Algérie, Gucci Flora Gorgeous Gardenia attire les femmes qui veulent l'élégance italienne de Gucci dans un floral accessible et moderne — le parfum parfait pour les femmes entre 25 et 40 ans.",
    notes: {
      top: ["Baies Rouges", "Cassonade"],
      heart: ["Gardénia Blanc", "Jasmin"],
      base: ["Bois de Santal", "Patchouli", "Notes Boisées"]
    },
    occasions: ["Quotidien", "Soirée", "Bureau"],
    seasons: ["Printemps", "Automne"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/gucci-flora-gorgeous.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["chloe-signature", "miss-dior", "armani-si"],
    h1: "Gucci Flora Gorgeous Gardenia Parfum Femme Algérie"
  },

  // 54. Michael Kors Gorgeous — vol 110
  {
    id: "michael-kors-gorgeous",
    slug: "michael-kors-gorgeous",
    name: "Gorgeous!",
    brand: "Michael Kors",
    brandSlug: "michael-kors",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé",
    concentration: "EDP",
    volume: "100ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "La féminité glamour selon Michael Kors. Bergamote, rose et iris boisé pour un floral boisé élégant et new-yorkais — Gorgeous!, le parfum de la femme Michael Kors.",
    description: "Michael Kors Gorgeous! EDP est le parfum phare de la grande maison de mode américaine. Lancé en 2021, il incarne parfaitement l'esthétique de la marque : glamour accessible, élégance décontractée, féminité assumée et moderne. C'est le parfum de la femme Michael Kors — active, stylée, qui vit pleinement sa vie.\n\nL'ouverture est lumineuse et épicée : bergamote fraîche et légèrement amère, poivre rose piquant et pétillant. Cette tête épicée-agrumée donne au parfum un démarrage énergique et dynamique — à l'image des femmes que la marque habille.\n\nLe cœur est d'un raffinement floral sophistiqué : rose fraîche et délicate, iris légèrement poudré et beurré, jasmin blanc discret. Cet accord floral moderne — ni trop sucré, ni trop poudré — est le cœur de Gorgeous! : féminin, élégant, avec cette sobriété qui caractérise les grandes compositions florales new-yorkaises.\n\nLa base boisée-musquée est moderne et efficace : ambrette légèrement musquée et crémeuse, iris boisé légèrement terreux et musc blanc propre. Ce fond boisé-musqué donne à Gorgeous! sa tenue solide de 8 heures et son sillage délicat mais persistant. En Algérie, Michael Kors Gorgeous! attire les femmes professionnelles qui cherchent un floral boisé élégant de marque américaine connue — une alternative sérieuse aux floraux boisés européens.",
    notes: {
      top: ["Bergamote", "Poivre Rose"],
      heart: ["Rose", "Iris", "Jasmin Blanc"],
      base: ["Ambrette", "Iris Boisé", "Musc Blanc"]
    },
    occasions: ["Bureau", "Quotidien", "Soirée"],
    seasons: ["Toute l'année"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/michael-kors-gorgeous.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["chloe-signature", "armani-my-way", "5th-avenue-elizabeth-arden"],
    h1: "Michael Kors Gorgeous Parfum Femme Algérie"
  },

  // 55. Ralph Lauren Romance — vol 110
  {
    id: "ralph-lauren-romance",
    slug: "ralph-lauren-romance",
    name: "Romance",
    brand: "Ralph Lauren",
    brandSlug: "ralph-lauren",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé",
    concentration: "EDP",
    volume: "100ml",
    price: 9900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le romantisme américain selon Ralph Lauren. Coriandre fraîche, rose et bois de santal pour un floral boisé délicat et sincère — Romance, l'amour en parfum.",
    description: "Ralph Lauren Romance EDP est l'expression la plus sincère et la plus poétique de la vision du luxe américain par Ralph Lauren. Lancé en 1998, ce floral boisé a su traverser les décennies avec une grâce rare — preuve d'une formule construite sur des matières premières de qualité et un concept olfactif intemporel.\n\nLa composition s'articule autour d'une idée simple et belle : le parfum d'un matin romantique dans un jardin, entre la fraîcheur herbeuse de l'aube et la chaleur florale de la journée. L'ouverture conjugue la coriandre fraîche légèrement herbale avec la fleur de soleil et la bergamote pour une entrée verte-florale d'une fraîcheur naturelle et authentique.\n\nLe cœur floral est d'une délicatesse remarquable : rose fraîche délicate — cueillie tôt le matin — magnolia doux et légèrement crémeux, iris légèrement poudré et beurré. Cet accord floral printanier est le cœur de Romance — romantique, frais, naturel, d'une beauté simple et vraie.\n\nLa base de bois de santal crémeux, ambre chaud discret et musc blanc soyeux donne à Romance sa profondeur boisée et sa tenue solide de 8 heures. C'est un parfum qui grandit bien sur la peau — qui révèle sa beauté progressivement, heure après heure. En Algérie, Romance de Ralph Lauren attire les femmes qui préfèrent l'élégance discrète à l'ostentation — celles qui cherchent la qualité sans avoir besoin de marquer leur présence.",
    notes: {
      top: ["Coriandre", "Fleur de Soleil", "Bergamote"],
      heart: ["Rose", "Magnolia", "Iris"],
      base: ["Bois de Santal", "Ambre", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Bureau", "Printemps"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/ralph-lauren-romance.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["chloe-signature", "narciso-rodriguez-for-her", "5th-avenue-elizabeth-arden"],
    h1: "Ralph Lauren Romance Parfum Femme Algérie"
  },

  // 56. Gris Dior (ex-Gris Montaigne) — vol 110
  {
    id: "gris-dior",
    slug: "gris-dior",
    name: "Gris Dior",
    brand: "Dior",
    brandSlug: "dior",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé Chypré",
    concentration: "EDP",
    volume: "125ml",
    price: 16900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le chypré contemporain de Dior. Rose, jasmin et vétiver pour un floral boisé sophistiqué d'une élégance parisienne intemporelle — Gris Dior, la grâce à l'état pur.",
    description: "Gris Dior EDP — anciennement connu sous le nom de Gris Montaigne — est l'une des créations les plus sophistiquées de la ligne de parfumerie exclusive de Dior. Cette fragrance floral-boisée-chyprée incarne l'élégance discrète et raffinée qui est le véritable code de la maison Dior — avant la célébrité, avant le parfum de masse, il y a cette élégance que les connaisseurs reconnaissent immédiatement.\n\nLa composition s'articule autour d'un accord rose-jasmin d'une grande beauté florale. L'ouverture est fraîche et légèrement boisée : bergamote lumineuse, mandarine douce et une touche de gingembre frais. Cette tête agrumée-épicée s'évanouit rapidement pour laisser place au cœur floral qui est le véritable joyau du parfum.\n\nLe cœur est d'une richesse florale exquise : rose de Damas fraîche et légèrement aquatique, jasmin de Grasse d'une qualité exceptionnelle — cultivé pour Dior en Provence — et lilas délicat. Cet accord floral à dominante rose-jasmin est d'une pureté et d'une complexité qui ne peuvent être atteintes qu'avec des matières premières de la plus haute qualité.\n\nLa base chyprée-boisée donne à Gris Dior sa profondeur et son caractère distinctif : vétiver sec de Madagascar, cèdre de Virginie légèrement poudré et oakmoss discret. Ce fond chypré sobre et élégant est la signature de Gris Dior — intemporel, discret mais remarquable. En Algérie, Gris Dior s'adresse aux femmes qui ont découvert la vraie parfumerie et cherchent quelque chose au-delà des grandes marques conventionnelles.",
    notes: {
      top: ["Bergamote", "Mandarine", "Gingembre"],
      heart: ["Rose de Damas", "Jasmin de Grasse", "Lilas"],
      base: ["Vétiver", "Cèdre de Virginie", "Oakmoss"]
    },
    occasions: ["Bureau", "Soirée", "Occasions Spéciales"],
    seasons: ["Toute l'année"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/gris-dior.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["miss-dior", "dior-jadore", "coco-mademoiselle-chanel"],
    h1: "Gris Dior Parfum Femme Algérie"
  },

  // 57. Drakkar Noir Guy Laroche — vol 90
  {
    id: "drakkar-noir-guy-laroche",
    slug: "drakkar-noir-guy-laroche",
    name: "Drakkar Noir",
    brand: "Guy Laroche",
    brandSlug: "guy-laroche",
    gender: "homme",
    category: "parfums-homme",
    family: "Aromatique Fougère",
    concentration: "EDT",
    volume: "100ml",
    price: 7500,
    originalPrice: null,
    badge: null,
    shortDescription: "Le guerrier de la parfumerie masculine des années 80. Lavande, romarin et cuir pour une fougère aromatique sombre et viriliste — Drakkar Noir, le parfum qui a défini une époque.",
    description: "Guy Laroche Drakkar Noir EDT est l'un des parfums masculins les plus iconiques et les plus vendus des années 1980. Créé en 1982 par Pierre Wargnye pour la maison française Guy Laroche, il incarne l'archétype du masculin viril et sombre de cette décennie — le Viking moderne, sombre, fort et irrésistible.\n\nLa composition appartient à la famille des fougères aromatiques — une famille parfumée créée spécifiquement pour les hommes depuis Fougère Royale en 1882. L'ouverture conjugue l'armoise légèrement herbale et sombre avec la lavande aromatique et le basilic légèrement anisé. Cette tête aromatique est immédiatement masculine, directe, avec une certaine austérité délibérée.\n\nLe cœur révèle la profondeur du parfum : romarin aromatique, genièvre légèrement boisé et coriandre épicée douce. Ces herbes aromatiques forment un cœur vert-aromatique d'une cohérence parfaite — naturel, masculin, légèrement sauvage.\n\nLa base est sombre et persistante : cuir noir légèrement animal, oakmoss terreux, ambre chaud et bois de santal. Ce fond cuiré-boisé-mousse donne à Drakkar Noir sa tenue solide et son sillage enveloppant caractéristique. En Algérie, Drakkar Noir est souvent le parfum de nostalgie — celui que les hommes de 40-50 ans ont découvert dans leur jeunesse et continuent de porter avec fidélité. Sa popularité transgénérationnelle témoigne d'une formule véritablement intemporelle.",
    notes: {
      top: ["Armoise", "Lavande", "Basilic"],
      heart: ["Romarin", "Genièvre", "Coriandre"],
      base: ["Cuir Noir", "Oakmoss", "Ambre", "Bois de Santal"]
    },
    occasions: ["Quotidien", "Bureau", "Soirée"],
    seasons: ["Automne", "Hiver"],
    longevity: 4,
    sillage: 4,
    image: "/images/products/drakkar-noir-guy-laroche.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["azzaro-chrome", "davidoff-cool-water", "hugo-boss-bottled"],
    h1: "Drakkar Noir Guy Laroche Parfum Homme Algérie"
  },

  // 58. Guerlain L'Homme Idéal EDP — vol 90
  {
    id: "l-homme-ideal-guerlain",
    slug: "l-homme-ideal-guerlain",
    name: "L'Homme Idéal",
    brand: "Guerlain",
    brandSlug: "guerlain",
    gender: "homme",
    category: "parfums-homme",
    family: "Oriental Boisé",
    concentration: "EDP",
    volume: "100ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'homme parfait selon Guerlain. Lavande, amande et cachemire pour un oriental boisé gourmand d'une élégance française absolue — L'Homme Idéal, la masculinité rêvée.",
    description: "Guerlain L'Homme Idéal EDP est la vision de la maison de parfumerie parisienne la plus ancienne sur ce qu'est l'homme parfait : cultivé, sensible, fort et légèrement romantique. Lancé en 2014 dans sa version initiale et en EDP en 2016, il conjugue le savoir-faire historique de Guerlain avec une sensibilité contemporaine.\n\nLa composition s'articule autour d'un accord amande-lavande d'une douceur et d'une sophistication remarquables. L'ouverture est aromatique et fraîche : bergamote lumineuse et lavande aromatique provençale créent une entrée classique et élégante — le type d'ouverture qu'on associe immédiatement aux grandes maisons françaises.\n\nLe cœur révèle la richesse du parfum : amande douce et crémeuse légèrement lactique — note gourmande caractéristique de Guerlain depuis ses origines — fève tonka chaude et légèrement coumarine, iris légèrement poudré. Cet accord amande-tonka-iris est le cœur de L'Homme Idéal — sophistiqué, légèrement gourmand, avec cette profondeur boisée-florale typiquement guerlainoise.\n\nLa base de cèdre sec, vétiver terreux et musc blanc soyeux ancre le tout dans une profondeur boisée sobre et élégante. La tenue est remarquable : 10 à 12 heures sur la peau. En Algérie, L'Homme Idéal Guerlain attire les hommes qui ont découvert le savoir-faire Guerlain et cherchent un masculin de qualité exceptionnelle avec une profondeur orientale discrète.",
    notes: {
      top: ["Bergamote", "Lavande"],
      heart: ["Amande", "Fève Tonka", "Iris"],
      base: ["Cèdre", "Vétiver", "Musc Blanc"]
    },
    occasions: ["Bureau", "Soirée", "Automne"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/l-homme-ideal-guerlain.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["habit-rouge-guerlain", "dior-homme", "givenchy-gentleman"],
    h1: "Guerlain L'Homme Idéal Parfum Homme Algérie"
  },

  // 59. JPG Le Beau — vol 90
  {
    id: "le-beau-jean-paul-gaultier",
    slug: "le-beau-jean-paul-gaultier",
    name: "Le Beau",
    brand: "Jean Paul Gaultier",
    brandSlug: "jean-paul-gaultier",
    gender: "homme",
    category: "parfums-homme",
    family: "Boisé Aquatique",
    concentration: "EDT",
    volume: "125ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "La beauté masculine selon Jean Paul Gaultier. Bergamote, notes aquatiques et bois de santal pour un aquatique boisé sensuel et moderne — Le Beau, l'homme JPG sous le soleil.",
    description: "Jean Paul Gaultier Le Beau EDT est le parfum masculin ensoleillé de la maison JPG. Lancé en 2019, il représente un virage vers la fraîcheur estivale et la beauté solaire — loin de la sensualité nocturne des Le Male et Ultra Male — pour un masculin plus accessible et plus polyvalent.\n\nL'ouverture est d'une fraîcheur fruitée-aquatique immédiatement plaisante : bergamote lumineuse et légèrement amère, citron frais et notes aquatiques légèrement marines. Cette tête fraîche et lumineuse annonce un parfum solaire et accessible, parfait pour les journées ensoleillées algériennes.\n\nLe cœur révèle la sophistication de Le Beau : notes aquatiques plus profondes et légèrement marines, néroli doux de fleur d'oranger et une légère touche de melon aquatique frais. Cet accord aquatique-floral au cœur est d'une légèreté et d'une fraîcheur très appréciées dans les températures élevées du nord au sud de l'Algérie.\n\nLa base est la vraie valeur ajoutée de Le Beau : bois de santal crémeux et légèrement onctueux, vanille discrète et musc blanc propre. Ce fond boisé-santal-vanille donne à Le Beau sa profondeur et sa tenue correcte de 6 à 7 heures — meilleure que la plupart des aquatiques de sa gamme. En Algérie, Le Beau est idéal pour l'été — portable tous les jours, accessible pour les hommes qui veulent la qualité JPG dans un format frais et non intimidant.",
    notes: {
      top: ["Bergamote", "Citron", "Notes Aquatiques"],
      heart: ["Notes Marines", "Néroli", "Melon Aquatique"],
      base: ["Bois de Santal", "Vanille", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Été", "Sport"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/le-beau-jean-paul-gaultier.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["le-male-jean-paul-gaultier", "davidoff-cool-water", "nautica-voyage"],
    h1: "Jean Paul Gaultier Le Beau Parfum Homme Algérie"
  },

  // 60. Guess Seductive Homme — vol 90
  {
    id: "guess-seductive-homme",
    slug: "guess-seductive-homme",
    name: "Seductive Homme",
    brand: "Guess",
    brandSlug: "guess",
    gender: "homme",
    category: "parfums-homme",
    family: "Aromatique Boisé",
    concentration: "EDT",
    volume: "100ml",
    price: 6900,
    originalPrice: null,
    badge: null,
    shortDescription: "La séduction masculine selon Guess. Agrumes frais, épices douces et bois ambrés pour un aromatique boisé accessible et séduisant — Guess Seductive, le parfum de la confiance abordable.",
    description: "Guess Seductive Homme EDT est le parfum masculin emblématique de la marque américaine de mode. Lancé en 2008, il incarne l'esprit Guess — jeune, séduisant, accessible — dans un flacon aromatique-boisé qui a su conquérir les hommes qui cherchent la qualité sans l'investissement d'une grande maison de luxe.\n\nLa composition s'articule autour d'un accord aromatique-boisé accessible et immédiatement plaisant. L'ouverture conjugue la bergamote lumineuse, le citron frais et le pamplemousse légèrement amer pour une entrée agrumée-fraîche directe et attractive. C'est une tête qui sent propre et accessible — exactement le bon positionnement pour ce type de parfum.\n\nLe cœur aromatique est simple et efficace : cardamome légèrement épicée, géranium légèrement floral et poivre blanc piquant. Ces notes aromatiques au cœur donnent au parfum son caractère masculin affirme sans ostentation — un masculin qui porte ses codes avec naturel et désinvolture.\n\nLa base boisée-ambrée est chaleureuse et accessible : bois de cèdre sec, ambre doux légèrement vanillé et musc blanc propre. Ce fond boisé-ambré donne à Seductive Homme une tenue correcte de 6 heures et un fond plaisant. En Algérie, Guess Seductive Homme est le choix pragmatique par excellence — une grande marque internationale connue, une formule agréable, un prix très accessible pour les étudiants et les jeunes actifs.",
    notes: {
      top: ["Bergamote", "Citron", "Pamplemousse"],
      heart: ["Cardamome", "Géranium", "Poivre Blanc"],
      base: ["Cèdre", "Ambre", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Bureau", "Soirée"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/guess-seductive-homme.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["davidoff-cool-water", "nautica-voyage", "azzaro-chrome"],
    h1: "Guess Seductive Homme Parfum Homme Algérie"
  }

];

const toAdd = newProducts.filter(p => !existingSlugs.has(p.slug));
db.products.push(...toAdd);
writeFileSync('data/products.json', JSON.stringify(db, null, 2));
console.log('Produits ajoutés:', toAdd.length);
console.log('Total produits:', db.products.length);
toAdd.forEach(p => console.log(' +', p.slug, '|', p.category, '|', p.price, 'DA'));
