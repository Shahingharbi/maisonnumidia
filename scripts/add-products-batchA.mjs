import { readFileSync, writeFileSync } from 'fs';

const db = JSON.parse(readFileSync('data/products.json', 'utf8'));
const existingSlugs = new Set(db.products.map(p => p.slug));

const newProducts = [

  // 1. Evidence Yves Rocher — vol 720
  {
    id: "evidence-yves-rocher",
    slug: "evidence-yves-rocher",
    name: "Evidence",
    brand: "Yves Rocher",
    brandSlug: "yves-rocher",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Fruité",
    concentration: "EDP",
    volume: "50ml",
    price: 5900,
    originalPrice: null,
    badge: null,
    shortDescription: "La signature florale-fruitée d'Yves Rocher. Abricot doré, rose fraîche et musc blanc pour un parfum lumineux et accessible, idéal au quotidien.",
    description: "Evidence d'Yves Rocher est le parfum de la femme qui ne veut pas choisir entre qualité et accessibilité. Lancé en 2008, il est rapidement devenu l'un des best-sellers de la marque bretonne — une réussite méritée pour une formule équilibrée et plaisante. En Algérie, Yves Rocher bénéficie d'une image naturelle et authentique très appréciée des femmes attentives à leur quotidien.\n\nL'ouverture d'Evidence est fraîche et fruitée sans agressivité : abricot doré légèrement sucré, bergamote lumineuse et touche de pêche veloutée créent une entrée solaire et optimiste. C'est une tête qui sent immédiatement propre et frais — deux qualités très recherchées dans les parfums de quotidien en Algérie, surtout pendant les longs étés chauds du nord au sud du pays.\n\nLe cœur floral est rond et accessible : rose fraîche, jasmin blanc sans lourdeur et pivoine rose délicate forment un bouquet féminin et lumineux, pensé pour plaire au plus grand nombre sans sacrifier la qualité. C'est un cœur sans aspérités, doux et naturel, qui s'associe facilement à toutes les tenues.\n\nLa base de musc blanc soyeux, cèdre léger et bois de santal crémeux offre une tenue correcte de 6 à 7 heures sur la peau et une douceur caractéristique. Un parfum propre et moderne, livré en 58 wilayas via Yalidine avec paiement à la réception — la simplicité qu'on aime.",
    notes: {
      top: ["Abricot", "Pêche", "Bergamote"],
      heart: ["Rose", "Pivoine", "Jasmin Blanc"],
      base: ["Musc Blanc", "Cèdre", "Bois de Santal"]
    },
    occasions: ["Quotidien", "Bureau", "Printemps"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/evidence-yves-rocher.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["armani-my-way", "dolce-gabbana-light-blue", "mon-paris-ysl"],
    h1: "Evidence Yves Rocher Parfum Femme Algérie"
  },

  // 2. Oxygène Lanvin femme — vol 720
  {
    id: "oxygene-lanvin",
    slug: "oxygene-lanvin",
    name: "Oxygène",
    brand: "Lanvin",
    brandSlug: "lanvin",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Aquatique",
    concentration: "EDP",
    volume: "75ml",
    price: 8900,
    originalPrice: null,
    badge: null,
    shortDescription: "La bouffée d'air frais de Lanvin. Notes vertes, rose et musc aquatique pour une fraîcheur florale délicate — le parfum des matins clairs et des femmes libres.",
    description: "Lanvin Oxygène est une fragrance féminine qui porte bien son nom : à chaque vaporisation, c'est comme une bouffée d'air pur qui envahit l'espace. Lancé en 2000 par la maison parisienne Lanvin, ce floral aquatique a su conquérir les femmes qui cherchaient une alternative fraîche et élégante aux floraux trop sucrés de l'époque. Il reste aujourd'hui l'une des références discrètes mais solides du catalogue Lanvin.\n\nL'ouverture d'Oxygène est verte et légèrement ozonic : feuilles vertes fraîchement coupées, violette humide et bergamote lumineuse créent une entrée qui évoque immédiatement un jardin après la pluie. Cette fraîcheur végétale est très appréciée dans les régions chaudes de l'Algérie, où les parfums aquatiques offrent une sensation de fraîcheur prolongée.\n\nLe cœur floral est d'une douceur remarquable : rose blanche délicate, jasmin discret, pivoine légère et muguet printanier forment un bouquet aérien qui respire la féminité sans ostentation. C'est un cœur très naturel, qui ne sent jamais le parfum artificiel ou chimique.\n\nLa base de musc propre, cèdre léger et ambre doux conclut avec retenue — Oxygène reste léger du début à la fin. Sa tenue de 5 à 6 heures est honnête pour un floral aquatique de cette légèreté. En Algérie, c'est le parfum des femmes élégantes qui préfèrent suggérer leur présence plutôt que l'imposer.",
    notes: {
      top: ["Feuilles Vertes", "Violette", "Bergamote"],
      heart: ["Rose Blanche", "Jasmin", "Pivoine", "Muguet"],
      base: ["Musc", "Cèdre", "Ambre"]
    },
    occasions: ["Quotidien", "Bureau", "Printemps"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 2,
    image: "/images/products/oxygene-lanvin.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["eclat-arpege-lanvin", "armani-my-way", "chloe-signature"],
    h1: "Oxygène Lanvin Parfum Femme Algérie"
  },

  // 3. YSL Libre Le Parfum — vol 720 (keyword: parfum elixir)
  {
    id: "libre-le-parfum-ysl",
    slug: "libre-le-parfum-ysl",
    name: "Libre Le Parfum",
    brand: "Yves Saint Laurent",
    brandSlug: "ysl",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental",
    concentration: "Parfum",
    volume: "90ml",
    price: 16900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'intensité ultime de Libre. Lavande, jasmin et ambre dans leur expression la plus profonde — Le Parfum est la version la plus somptueuse de l'icône YSL.",
    description: "YSL Libre Le Parfum est l'aboutissement d'une quête : prendre la fragrance Libre déjà iconique et l'élever vers quelque chose de plus profond, plus sensuel, plus absolu. Lancé en 2021, ce Parfum (la concentration la plus élevée) reformule l'ADN de Libre avec une intensité et une richesse qui en font l'une des plus belles fragrances féminines de la décennie.\n\nLà où Libre EDP joue sur l'équilibre entre lavande fraîche et vanille douce, Libre Le Parfum penche franchement du côté de l'intensité orientale. La lavande de Normandie, matière première signature de la gamme Libre, est ici plus profonde et plus sombre — presque envoûtante. Elle s'associe à un jasmin sambac d'une richesse florale extraordinaire pour créer un accord floral-aromatique d'une complexité rare.\n\nLa base est somptueuse : vanille crémeuse, ambre chaud et musc blanc soyeux forment un fond enveloppant et persistant qui reste perceptible 12 à 14 heures après l'application. C'est cette tenue exceptionnelle, combinée à la profondeur de la composition, qui justifie pleinement le positionnement Parfum et son prix.\n\nEn Algérie, Libre Le Parfum s'adresse aux femmes qui connaissent déjà Libre EDP et veulent passer à une dimension supérieure — plus intense pour les soirées, plus persistant pour les occasions importantes. C'est aussi le cadeau ultime pour une femme raffinée qui aime YSL.",
    notes: {
      top: ["Lavande de Normandie", "Mandarine"],
      heart: ["Jasmin Sambac", "Lavande"],
      base: ["Vanille", "Ambre", "Musc Blanc"]
    },
    occasions: ["Soirée", "Occasions Spéciales", "Automne"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/libre-le-parfum-ysl.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["libre-ysl", "black-opium-ysl", "manifesto-ysl"],
    h1: "YSL Libre Le Parfum Femme Algérie"
  },

  // 4. Amouage Reflection Man — vol 720
  {
    id: "amouage-reflection",
    slug: "amouage-reflection",
    name: "Reflection Man",
    brand: "Amouage",
    brandSlug: "amouage",
    gender: "homme",
    category: "parfums-homme",
    family: "Floral Boisé",
    concentration: "EDP",
    volume: "100ml",
    price: 22000,
    originalPrice: null,
    badge: null,
    shortDescription: "La sophistication omanaise sublimée. Néroli, rose et encens pour un floral masculin d'une élégance sans équivalent — Amouage Reflection est la définition même du luxe olfactif.",
    description: "Amouage Reflection Man est l'expression parfaite de ce que la maison omanaise de luxe a su apporter à la parfumerie mondiale : un raffinement absolu, des matières premières d'une qualité irréprochable, et une vision olfactive qui transcende les tendances. Lancé en 2007, Reflection Man est devenu une référence incontournable parmi les connaisseurs de parfums de niche dans le monde arabe et au-delà.\n\nLa composition s'articule autour d'un accord floral-boisé d'une précision remarquable. L'ouverture conjugue le néroli lumineux de la fleur d'oranger avec la sauge clary et une légère touche d'épices douces pour une entrée à la fois fraîche et chaleureuse. C'est une tête sophistiquée qui annonce immédiatement le niveau de la composition.\n\nLe cœur est le joyau du parfum : rose damascène de haute qualité, iris poudré légèrement beurré et violette délicate créent un accord floral masculin d'une noblesse saisissante. Ce cœur floral, rare dans la parfumerie masculine, témoigne de l'audace créative d'Amouage et de sa capacité à réinventer les codes du genre.\n\nLa base d'encens pur, cèdre de l'Atlas, bois de santal de Mysore et musc blanc soyeux ancre le tout dans une profondeur orientale discrète mais certaine. La tenue est exceptionnelle — plus de 12 heures sur la peau. En Algérie, Amouage Reflection s'adresse aux hommes qui cherchent à se distinguer avec un parfum de niche authentique.",
    notes: {
      top: ["Néroli", "Sauge Clary", "Muscade"],
      heart: ["Rose Damascène", "Iris", "Violette"],
      base: ["Encens", "Cèdre", "Bois de Santal", "Musc Blanc"]
    },
    occasions: ["Soirée", "Occasions Spéciales", "Bureau"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/amouage-reflection.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["creed-aventus", "layton-parfums-de-marly", "dior-homme"],
    h1: "Amouage Reflection Parfum Homme Algérie"
  },

  // 5. Jimmy Choo Femme EDP — vol 720
  {
    id: "jimmy-choo-femme",
    slug: "jimmy-choo-femme",
    name: "Jimmy Choo",
    brand: "Jimmy Choo",
    brandSlug: "jimmy-choo",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Fruité",
    concentration: "EDP",
    volume: "100ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le glamour à chaque vaporisation. Poire juteuse, gardénia crémeux et toffee caramel pour une féminité séduisante — Jimmy Choo Femme est le parfum de la femme qui assume son élégance.",
    description: "Jimmy Choo Femme EDP est le premier parfum de la célèbre maison de chaussures de luxe britannique, lancé en 2011. Fidèle à l'ADN de la marque — glamour, sensualité et sophistication — cette fragrance est devenue rapidement un succès commercial mondial et un incontournable de la parfumerie féminine accessible.\n\nL'ouverture est juteuse et séduisante : poire dorée fraîche, freesia blanc légèrement poudrée et pêche veloutée créent une entrée fruitée et lumineuse qui attire immédiatement l'attention. C'est une tête fruité-florale qui sent bon la qualité sans trop en faire — exactement dans l'esprit de la marque.\n\nLe cœur est d'une richesse crémeuse surprenante : gardénia blanc opulent, osmanthus fruité aux accords d'abricot et pêche, et une touche d'orchidée exotique. Cet accord floral-crémeux est le cœur du parfum — séduisant, féminin, avec ce petit quelque chose de délicieusement gourmand qui le distingue des floraux standard.\n\nLa base révèle la vraie personnalité de Jimmy Choo Femme : toffee caramel fondant légèrement sucré, bois de santal doux et ambre chaud. Cette note gourmande en fond, sans être un parfum de pâtisserie, donne au parfum son caractère unique — entre le floral sophistiqué et l'oriental gourmand. La tenue est solide : 8 heures sur la peau, avec une projection flatteuse et enveloppante. En Algérie, il se porte aussi bien le jour que le soir.",
    notes: {
      top: ["Poire", "Freesia", "Pêche"],
      heart: ["Gardénia", "Osmanthus", "Orchidée"],
      base: ["Toffee Caramel", "Bois de Santal", "Ambre"]
    },
    occasions: ["Soirée", "Bureau", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/jimmy-choo-femme.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["good-girl-carolina-herrera", "prada-candy", "black-opium-ysl"],
    h1: "Jimmy Choo Parfum Femme Algérie"
  },

  // 6. CK One Calvin Klein — vol 590
  {
    id: "ck-one",
    slug: "ck-one",
    name: "CK One",
    brand: "Calvin Klein",
    brandSlug: "calvin-klein",
    gender: "unisexe",
    category: "parfums-femme",
    family: "Floral Aromatique",
    concentration: "EDT",
    volume: "100ml",
    price: 8900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'icône unisexe qui a changé la parfumerie des années 90. Thé vert, bergamote et musc propre pour une fraîcheur universelle qui traverse toutes les générations.",
    description: "Calvin Klein CK One est bien plus qu'un parfum — c'est un phénomène culturel. Lancé en 1994, il est le premier grand parfum unisexe de la parfumerie grand public et a radicalement changé la façon dont le monde perçoit le genre en parfumerie. Trois décennies plus tard, CK One reste dans le top des ventes mondiales — une longévité commerciale qui témoigne d'une formule universellement appréciée.\n\nAlberto Morillas et Harry Fremont ont construit CK One autour d'un concept simple et révolutionnaire : créer un parfum propre, frais et naturel, sans marqueur de genre. L'ouverture associe le thé vert japonais — une note aromatique légèrement boisée et végétale — avec des ananas frais, du mandarin et de la bergamote pour une explosion de fraîcheur vivifiante.\n\nLe cœur est floral et légèrement épicé : papaye exotique légèrement sucrée, fleur de musc, jasmin et rose violette délicate. C'est un cœur qui sent propre et naturel, parfait pour les hommes comme pour les femmes qui cherchent une fragrance quotidienne sans prise de tête.\n\nLa base de musc blanc immaculé, cèdre sec et ambre léger donne à CK One son fond signature — cette odeur de peau propre et fraîche qui est devenue sa marque de fabrique. En Algérie, CK One est particulièrement populaire chez les jeunes et dans les couples qui le partagent. Sa polyvalence et son accessibilité en font un choix évident pour toute la famille.",
    notes: {
      top: ["Thé Vert", "Bergamote", "Ananas", "Mandarine"],
      heart: ["Jasmin", "Rose Violette", "Musc de Fleur", "Papaye"],
      base: ["Musc Blanc", "Cèdre", "Ambre"]
    },
    occasions: ["Quotidien", "Bureau", "Été"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/ck-one.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["davidoff-cool-water", "azzaro-chrome", "armani-my-way"],
    h1: "CK One Calvin Klein Parfum Mixte Algérie"
  },

  // 7. Chloé Signature — vol 590
  {
    id: "chloe-signature",
    slug: "chloe-signature",
    name: "Chloé",
    brand: "Chloé",
    brandSlug: "chloe",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé Poudré",
    concentration: "EDP",
    volume: "75ml",
    price: 12500,
    originalPrice: null,
    badge: null,
    shortDescription: "La rose parisienne par excellence. Pivoine, litchi et rose de mai pour une féminité délicate et romantique — Chloé Signature est l'élégance sans effort.",
    description: "Chloé Signature EDP est l'un des parfums féminins les plus romantiques et les plus délicats de la parfumerie contemporaine. Lancé en 2008 par Michel Almairac, il est rapidement devenu le parfum emblématique de la maison de mode parisienne — une traduction olfactive parfaite de l'esthétique Chloé : féminine, romantique, légèrement bohème.\n\nL'ouverture est d'une fraîcheur fruitée-florale enchanteresse : litchi juteux et légèrement sucré, freesia blanc et framboise rose créent une entrée printanière et joyeuse. C'est une tête lumineuse qui met immédiatement de bonne humeur, avec cette douceur fruitée caractéristique des grands floraux féminins.\n\nLe cœur est le joyau de Chloé Signature : rose de mai de Grasse, absolue de rose et pivoine délicate forment un accord floral d'une pureté et d'une richesse rarement atteintes dans cette gamme de prix. La rose est ici traitée avec une finesse exceptionnelle — ni trop sucrée, ni trop poudrée — juste ce qu'il faut de naturel et de profondeur.\n\nLa base de magnolia discret, cèdre de Virginie et ambre discret donne à Chloé Signature sa profondeur boisée légèrement poudrée signature. La tenue est excellente pour un floral : 8 à 10 heures sur la peau, avec un sillage délicat mais persistant. En Algérie, Chloé est souvent choisi comme parfum de mariage ou de fiançailles par les jeunes femmes qui veulent la sophistication française à un prix accessible.",
    notes: {
      top: ["Litchi", "Freesia", "Framboise"],
      heart: ["Rose de Mai", "Pivoine", "Magnolia"],
      base: ["Cèdre de Virginie", "Ambre", "Musc"]
    },
    occasions: ["Quotidien", "Mariage", "Cadeau"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/chloe-signature.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["miss-dior", "armani-my-way", "narciso-rodriguez-for-her"],
    h1: "Chloé Signature Parfum Femme Algérie"
  },

  // 8. Armani Si EDP — vol 480
  {
    id: "armani-si",
    slug: "armani-si",
    name: "Si",
    brand: "Giorgio Armani",
    brandSlug: "armani",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Chypré",
    concentration: "EDP",
    volume: "100ml",
    price: 14500,
    originalPrice: null,
    badge: null,
    shortDescription: "Le OUI de la féminité moderne. Cassis, rose et patchouli pour un chypré floral qui affirme le caractère d'une femme sûre d'elle — Si est la réponse d'Armani à la femme d'aujourd'hui.",
    description: "Giorgio Armani Si EDP est l'une des sorties parfum les plus réussies des années 2010. Lancé en 2013, ce chypré floral moderne a su s'imposer comme une référence de la parfumerie féminine haut de gamme — un parfum qui combine la sophistication d'un chypré classique avec la fraîcheur et la légèreté des standards contemporains.\n\nLa composition s'ouvre sur un accord cassis-bergamote d'une vivacité remarquable. Le cassis noir — à la fois fruité et légèrement végétal, avec ses accords de feuille de cassis légèrement âcres — donne à Si son ouverture signature : reconnaissable entre mille, fraîche mais caractérisée. La bergamote lumineuse apporte la touche d'élégance méditerranéenne typique d'Armani.\n\nLe cœur évolue vers un accord floral-fruité d'une sensualité délicate : rose fraîche, framboise sucrée et pêche dorée créent un bouquet floral féminin et gourmand sans jamais tomber dans l'excès. C'est un cœur moderne qui parle aux femmes actives et confiantes.\n\nLa base est la signature chyprée qui fait toute la différence : patchouli sombre et légèrement terreux, bois de santal crémeux, vanille discrète et musc blanc soyeux. Cette base donne à Si sa profondeur, sa tenue exceptionnelle de 10 à 12 heures et son sillage discret mais persistant. En Algérie, Si est souvent choisi par les femmes professionnelles qui veulent un parfum qui reflète leur ambition et leur féminité.",
    notes: {
      top: ["Cassis", "Bergamote", "Mandarine"],
      heart: ["Rose", "Framboise", "Pêche"],
      base: ["Patchouli", "Bois de Santal", "Vanille", "Musc Blanc"]
    },
    occasions: ["Bureau", "Soirée", "Quotidien"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/armani-si.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["armani-my-way", "libre-ysl", "coco-mademoiselle-chanel"],
    h1: "Armani Si Parfum Femme Algérie"
  },

  // 9. Dior J'adore EDP — vol 480
  {
    id: "dior-jadore",
    slug: "dior-jadore",
    name: "J'adore",
    brand: "Dior",
    brandSlug: "dior",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral",
    concentration: "EDP",
    volume: "100ml",
    price: 15200,
    originalPrice: null,
    badge: null,
    shortDescription: "Le floral absolu de Dior. Ylang-ylang, jasmin de Grasse et rose — J'adore est la définition même de la féminité selon la haute couture parisienne.",
    description: "Dior J'adore EDP est l'un des parfums féminins les plus vendus au monde depuis sa création en 1999 par Calice Becker. Symbole absolu de la féminité Dior, il s'est imposé comme une référence intemporelle de la parfumerie florale — un parfum qui ne se démode pas parce qu'il incarne une idée universelle de la beauté féminine.\n\nLa composition de J'adore est un bouquet floral d'une générosité et d'une complexité exceptionnelles. L'ouverture conjugue le melon juteux et la pêche veloutée avec des notes de magnolia pour une entrée fruitée-florale lumineuse et séduisante. Cette transition rapide vers le cœur floral est l'une des plus réussies de la parfumerie moderne.\n\nLe cœur est le véritable chef-d'œuvre : ylang-ylang de Madagascar — avec ses accords à la fois floraux et légèrement exotiques — rose turque généreuse, jasmin de Grasse d'une qualité exceptionnelle et orchidée crémeuse. Ces quatre floraux s'associent en un accord d'une richesse et d'une sensualité rares, avec la profondeur et la complexité qui justifient pleinement le positionnement luxe de Dior.\n\nLa base de mûre noire, cassis et musc blanc apporte une profondeur fruitée-musquée subtile qui prolonge la composition pendant 10 à 12 heures. En Algérie, J'adore est le parfum des grandes occasions par excellence — mariage, fiançailles, remise de diplôme — son prestige et son élégance en faisant le cadeau féminin ultime de la maison Dior.",
    notes: {
      top: ["Melon", "Pêche", "Magnolia"],
      heart: ["Ylang-Ylang", "Rose Turque", "Jasmin de Grasse", "Orchidée"],
      base: ["Mûre", "Cassis", "Musc Blanc"]
    },
    occasions: ["Soirée", "Mariage", "Occasions Spéciales"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/dior-jadore.jpg",
    inStock: true,
    featured: true,
    isOriental: false,
    related: ["miss-dior", "coco-mademoiselle-chanel", "armani-si"],
    h1: "Dior J'adore Parfum Femme Algérie"
  },

  // 10. Givenchy Irresistible EDP — vol 480
  {
    id: "givenchy-irresistible",
    slug: "givenchy-irresistible",
    name: "Irresistible",
    brand: "Givenchy",
    brandSlug: "givenchy",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé",
    concentration: "EDP",
    volume: "80ml",
    price: 12900,
    originalPrice: null,
    badge: null,
    shortDescription: "La rose boisée de Givenchy. Rose fraîche, muguet et bois de santal pour un floral moderne et irrésistiblement élégant — la signature de la femme Givenchy.",
    description: "Givenchy Irresistible EDP est la nouvelle vision de la féminité selon la maison de haute couture parisienne. Lancé en 2020, il s'impose comme le floral boisé de référence d'une génération — une fragrance qui célèbre la femme moderne dans toute sa complexité et sa liberté.\n\nLa composition s'articule autour de la rose, matière première chère à Givenchy depuis ses débuts. Ici, la rose est fraîche, naturelle, légèrement humide — comme une rose cueillie tôt le matin, encore couverte de rosée. Cette rose, signature du parfum, est accompagnée de muguet cristallin et de pivoine délicate pour créer un cœur floral d'une légèreté et d'une fraîcheur remarquables.\n\nL'ouverture est lumineuse et solaire : notes vertes fraîches légèrement végétales, bergamote perlée et une touche de poire juteuse. C'est une tête qui met immédiatement de bonne humeur et annonce la fraîcheur florale qui suit.\n\nLa base de bois de santal crémeux, vétiver légèrement terreux et musc blanc soyeux donne à Irresistible sa profondeur boisée distinctive. Cette base, plus affirmée que celle de la plupart des floraux contemporains, confère au parfum sa tenue solide — 8 à 10 heures — et son sillage boisé légèrement poudré très apprécié. En Algérie, Givenchy Irresistible attire les femmes qui cherchent un floral moderne avec du caractère, sans tomber dans les excès orientaux ou gourmands.",
    notes: {
      top: ["Notes Vertes", "Bergamote", "Poire"],
      heart: ["Rose Fraîche", "Muguet", "Pivoine"],
      base: ["Bois de Santal", "Vétiver", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Bureau", "Printemps"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/givenchy-irresistible.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["givenchy-l-interdit", "armani-my-way", "chloe-signature"],
    h1: "Givenchy Irresistible Parfum Femme Algérie"
  },

  // 11. Eclat d'Arpège Lanvin — vol 480
  {
    id: "eclat-arpege-lanvin",
    slug: "eclat-arpege-lanvin",
    name: "Éclat d'Arpège",
    brand: "Lanvin",
    brandSlug: "lanvin",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Fruité",
    concentration: "EDT",
    volume: "100ml",
    price: 8900,
    originalPrice: null,
    badge: null,
    shortDescription: "La légèreté solaire de Lanvin. Pamplemousse, rose et musc blanc pour un parfum fruité-floral pétillant — l'éclat d'une femme qui rayonne naturellement.",
    description: "Lanvin Éclat d'Arpège est l'un des parfums féminins les plus plaisants et les plus accessibles de la parfumerie contemporaine. Lancé en 2002, cet EDT floral fruité a su traverser les années avec une fraîcheur intacte — preuve d'une formule bien construite et d'une identité olfactive clairement définie.\n\nL'ouverture est une explosion d'agrumes et de fruits : pamplemousse rose juteux, bergamote lumineuse et mandarine sucrée créent une tête vivace et joyeuse, immédiatement accessible et plaisante. C'est cette fraîcheur fruitée qui a fait le succès du parfum — directe, sincère, sans prétention.\n\nLe cœur floral est agréable et bien équilibré : rose fraîche délicate, jasmin blanc discret et muguet printanier forment un bouquet floral classique et fémininin qui s'associe parfaitement à la vivacité de l'ouverture. La transition du fruité vers le floral est douce et naturelle.\n\nLa base de musc blanc propre, bois de cèdre léger et ambre discret donne à Éclat d'Arpège sa légèreté caractéristique en fond. Ce n'est pas un parfum de grande tenue — 5 à 6 heures — mais c'est sa nature assumée : léger, frais, parfait pour les chaleurs algériennes et les longues journées d'été. Son prix accessible en fait l'un des meilleurs rapports qualité-prix de la sélection Maison Numidia, particulièrement apprécié comme parfum de quotidien ou de bureau.",
    notes: {
      top: ["Pamplemousse", "Bergamote", "Mandarine"],
      heart: ["Rose", "Jasmin", "Muguet"],
      base: ["Musc Blanc", "Cèdre", "Ambre"]
    },
    occasions: ["Quotidien", "Bureau", "Été"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/eclat-arpege-lanvin.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["oxygene-lanvin", "dolce-gabbana-light-blue", "armani-my-way"],
    h1: "Éclat d'Arpège Lanvin Parfum Femme Algérie"
  },

  // 12. Marc Jacobs Daisy EDT — vol 480
  {
    id: "marc-jacobs-daisy",
    slug: "marc-jacobs-daisy",
    name: "Daisy",
    brand: "Marc Jacobs",
    brandSlug: "marc-jacobs",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Fruité",
    concentration: "EDT",
    volume: "100ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "La fraîcheur florale iconique de Marc Jacobs. Fraise, gardénia et bois blanc pour un parfum jeune, lumineux et optimiste — Daisy, c'est la fleur du bonheur.",
    description: "Marc Jacobs Daisy est l'un des parfums féminins les plus reconnaissables de la parfumerie des années 2000. Lancé en 2007, il a conquis des millions de femmes dans le monde grâce à son flacon iconique — orné de marguerites blanches en guise de bouchon — et surtout grâce à sa composition fraîche, joyeuse et immédiatement séduisante.\n\nDaisy s'ouvre sur une fraîcheur fruitée-florale lumineuse : fraise des bois légèrement sucrée, feuille de violette verte et légèrement humide, et pamplemousse rosé pétillant. C'est une ouverture qui sent le matin, le printemps, le bonheur sans complication — exactement ce que promet le nom Daisy.\n\nLe cœur est le cœur floral le plus plaisant du parfum : gardénia blanc crémeux et légèrement capiteux, violette délicate et jasmin blanc discret. Cet accord floral est accessible et moderne, avec cette douceur crémeuse du gardénia qui donne au parfum son caractère distinctif et sa chaleur particulière.\n\nLa base de bois blanc léger, musc blanc propre et vanille discrète donne à Daisy sa légèreté en fond et sa tenue correcte de 6 à 7 heures. C'est un parfum de bonne humeur, facile à porter, qui convient aussi bien aux adolescentes qui découvrent la parfumerie de marque qu'aux femmes adultes qui veulent un parfum frais et joyeux pour l'été. En Algérie, Daisy est particulièrement apprécié comme cadeau, son flacon décoratif étant aussi beau à offrir qu'à utiliser.",
    notes: {
      top: ["Fraise", "Feuille de Violette", "Pamplemousse"],
      heart: ["Gardénia", "Violette", "Jasmin Blanc"],
      base: ["Bois Blanc", "Musc Blanc", "Vanille"]
    },
    occasions: ["Quotidien", "Printemps", "Cadeau"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/marc-jacobs-daisy.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["chloe-signature", "dolce-gabbana-light-blue", "armani-my-way"],
    h1: "Marc Jacobs Daisy Parfum Femme Algérie"
  },

  // 13. Nishane Ani — vol 480
  {
    id: "nishane-ani",
    slug: "nishane-ani",
    name: "Ani",
    brand: "Nishane",
    brandSlug: "nishane",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental",
    concentration: "Extrait de Parfum",
    volume: "50ml",
    price: 20000,
    originalPrice: null,
    badge: null,
    shortDescription: "Le luxe de niche turc à son apogée. Fleur d'oranger, iris et bois de santal pour un floral oriental d'une profondeur et d'une sophistication sans égal — Nishane Ani est l'absolu féminin.",
    description: "Nishane Ani est la fragrance emblématique de la maison de parfumerie de niche d'Istanbul, et l'une des plus belles créations olfactives de la décennie. Lancé en 2019, cet Extrait de Parfum floral oriental s'est imposé comme une référence mondiale parmi les amateurs de parfumerie niche — un statut rarissime pour une maison turque.\n\nLa composition s'articule autour d'une interprétation somptueuse de la fleur d'oranger — matière première chère à la culture olfactive du Moyen-Orient et du Maghreb. Ici, la fleur d'oranger est traitée avec une richesse absolue : fraîche et lumineuse en ouverture, crémeuse et enveloppante au cœur, elle forme la colonne vertébrale de la composition.\n\nL'iris poudré et légèrement beurré apporte une dimension florale sophistiquée — presque couture — qui élève Ani au-delà du simple floral oriental. La rose damascène, présente en fond de cœur, ajoute une profondeur florale chaude et sensuelle. Ces trois matières premières d'exception créent un accord floral d'une complexité et d'une richesse rarement atteintes.\n\nLa base de bois de santal de Mysore crémeux, musc blanc soyeux et ambre chaud forme un fond enveloppant et persistant qui prolonge le parfum pendant plus de 14 heures sur la peau. En Algérie, Nishane Ani est le choix des connaisseurs — des femmes qui ont exploré la parfumerie de luxe conventionnelle et cherchent maintenant quelque chose d'unique, de personnel, de véritablement précieux.",
    notes: {
      top: ["Fleur d'Oranger", "Bergamote"],
      heart: ["Iris", "Rose Damascène", "Jasmin"],
      base: ["Bois de Santal", "Musc Blanc", "Ambre"]
    },
    occasions: ["Soirée", "Occasions Spéciales", "Mariage"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 5,
    sillage: 5,
    image: "/images/products/nishane-ani.jpg",
    inStock: true,
    featured: true,
    isOriental: false,
    related: ["amouage-reflection", "creed-aventus", "elie-saab-le-parfum"],
    h1: "Nishane Ani Parfum Femme Algérie"
  },

  // 14. Creed Aventus — vol 480
  {
    id: "creed-aventus",
    slug: "creed-aventus",
    name: "Aventus",
    brand: "Creed",
    brandSlug: "creed",
    gender: "homme",
    category: "parfums-homme",
    family: "Fruité Boisé",
    concentration: "EDP",
    volume: "100ml",
    price: 36000,
    originalPrice: null,
    badge: null,
    shortDescription: "Le mythe de la parfumerie de niche. Ananas, bouleau fumé et musc pour un parfum masculin d'exception — Creed Aventus est le choix de ceux qui ne font pas de compromis.",
    description: "Creed Aventus est sans doute le parfum masculin le plus discuté, le plus admiré et le plus imité de ces quinze dernières années. Lancé en 2010 par la maison Creed pour célébrer son 250e anniversaire, il s'est imposé en quelques années comme le standard absolu de la parfumerie de niche masculine — une référence à laquelle tous les autres sont comparés.\n\nLa composition s'inspire de la trajectoire de Napoléon Bonaparte — victorieux, ambitieux, avec cette dualité entre la grandeur solaire et la profondeur sombre de la défaite. L'ouverture est explosive et immédiatement reconnaissable : ananas tropical juteux et légèrement acide, cassis noir, bergamote lumineuse et pomme fraîche créent une tête fruitée d'une vivacité et d'une originalité remarquables.\n\nLe cœur révèle la complexité d'Aventus : bouleau légèrement fumé et boisé, jasmin blanc, patchouli sombre et légèrement terreux, rose délicate. Cet accord boisé-floral constitue le cœur du parfum — une transition savante du fruité lumineux de l'ouverture vers la profondeur boisée de la base.\n\nLa base est monumentale : ambre gris naturel d'une qualité exceptionnelle, chêne musqué, vétiver sec et musc blanc. Cette base donne à Aventus sa tenue légendaire — 12 heures ou plus — et cette sillage discret mais persistant que les initiés reconnaissent instantanément. En Algérie, Creed Aventus est le parfum des hommes qui ont réussi — une affirmation de statut et de goût qui ne nécessite aucune explication.",
    notes: {
      top: ["Ananas", "Bergamote", "Cassis Noir", "Pomme"],
      heart: ["Bouleau Fumé", "Jasmin", "Patchouli", "Rose"],
      base: ["Ambre Gris", "Chêne Musqué", "Vétiver", "Musc Blanc"]
    },
    occasions: ["Bureau", "Soirée", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/creed-aventus.jpg",
    inStock: true,
    featured: true,
    isOriental: false,
    related: ["amouage-reflection", "layton-parfums-de-marly", "dior-sauvage"],
    h1: "Creed Aventus Parfum Homme Algérie"
  },

  // 15. Armani Stronger With You Intensely — vol 390
  {
    id: "stronger-with-you-intensely",
    slug: "stronger-with-you-intensely",
    name: "Stronger With You Intensely",
    brand: "Giorgio Armani",
    brandSlug: "armani",
    gender: "homme",
    category: "parfums-homme",
    family: "Oriental Boisé",
    concentration: "EDP",
    volume: "100ml",
    price: 12900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'intensité masculine selon Armani. Cardamome, vanille et cachemire pour un oriental boisé enveloppant et sensuel — Stronger With You Intensely redéfinit la masculinité moderne.",
    description: "Giorgio Armani Stronger With You Intensely est la réinvention la plus aboutie de la gamme Stronger With You. Lancé en 2019, cet EDP oriental boisé prend la structure de son prédécesseur et l'intensifie considérablement — plus de profondeur, plus de chaleur, plus de caractère. Le résultat est un parfum d'une séduction puissante et assumée.\n\nL'ouverture est directe et charismatique : cardamome noire fraîchement moulue, poivre noir piquant et une touche de lavande aromatique créent une entrée épicée-aromatique qui capte immédiatement l'attention. C'est une ouverture masculine au sens le plus noble du terme — affirmée, directe, sans ambiguïté.\n\nLe cœur révèle la richesse de la composition : lavande profonde de type lavandin, sauge clary légèrement mentholée et poivre blanc créent un accord aromatique-épicé d'une complexité croissante. C'est à ce stade que Stronger With You Intensely se distingue vraiment des masculins aquatiques classiques — il choisit la profondeur et la chaleur plutôt que la fraîcheur.\n\nLa base est somptueuse : vanille bourbon d'une qualité remarquable, fève tonka chaude et crémeuse, cachemire soyeux et bois de cèdre. Ce fond gourmand-boisé donne au parfum sa tenue exceptionnelle de 10 à 12 heures et son sillage enveloppant. En Algérie, Stronger With You Intensely est parfait pour les soirées d'automne et d'hiver — sa chaleur et sa profondeur lui permettent de s'épanouir pleinement dans les températures fraîches.",
    notes: {
      top: ["Cardamome", "Poivre Noir", "Lavande"],
      heart: ["Lavande", "Sauge Clary", "Poivre Blanc"],
      base: ["Vanille", "Fève Tonka", "Cachemire", "Cèdre"]
    },
    occasions: ["Soirée", "Automne", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/stronger-with-you-intensely.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["armani-code", "dior-homme", "valentino-uomo"],
    h1: "Armani Stronger With You Intensely Parfum Homme Algérie"
  }

];

const toAdd = newProducts.filter(p => !existingSlugs.has(p.slug));
db.products.push(...toAdd);
writeFileSync('data/products.json', JSON.stringify(db, null, 2));
console.log('Produits ajoutés:', toAdd.length);
console.log('Total produits:', db.products.length);
toAdd.forEach(p => console.log(' +', p.slug, '|', p.category, '|', p.price, 'DA'));
