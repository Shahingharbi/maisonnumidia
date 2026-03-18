import { readFileSync, writeFileSync } from 'fs';

const db = JSON.parse(readFileSync('data/products.json', 'utf8'));
const existingSlugs = new Set(db.products.map(p => p.slug));

const newProducts = [

  // 31. CK Euphoria — vol 170
  {
    id: "euphoria-calvin-klein",
    slug: "euphoria-calvin-klein",
    name: "Euphoria",
    brand: "Calvin Klein",
    brandSlug: "calvin-klein",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental",
    concentration: "EDP",
    volume: "100ml",
    price: 10500,
    originalPrice: null,
    badge: null,
    shortDescription: "L'ivresse florale de Calvin Klein. Grenade, orchidée noire et ambre — Euphoria est le parfum de la femme qui embrasse ses contradictions avec une confiance absolue.",
    description: "Calvin Klein Euphoria EDP est l'un des parfums féminins orientaux les plus séduisants et les plus originaux des années 2000. Lancé en 2005, il s'est immédiatement démarqué dans un marché saturé de floraux classiques grâce à une composition audacieuse et une identité olfactive immédiatement reconnaissable.\n\nL'ouverture est exotic et fruitée : grenade rouge juteuse et légèrement acidulée, persimmon doré et muscat crémeux créent une entrée fruitée d'une originalité remarquable. Ce ne sont pas les fruits classiques de la parfumerie — c'est une ouverture qui surprend et intrigue immédiatement.\n\nLe cœur révèle la profondeur du parfum : orchidée noire — note imaginaire évoquant l'exotisme et la sensualité — lotus blanc aquatique et légèrement floral, champagne pétillant et légèrement acidulé. Cet accord floral imaginaire au cœur donne à Euphoria son caractère unique et mystérieux — un parfum qui parle aux émotions plus qu'à la raison.\n\nLa base orientale est sombre et enveloppante : ambre noire légèrement résineuse, bois de mahogani chaud et vanille crémeuse. Ce fond oriental profond et persistant donne à Euphoria sa tenue exceptionnelle de 10 à 12 heures et son sillage magnétique qui colle à la mémoire. En Algérie, Euphoria séduit les femmes qui cherchent un oriental accessible, moderne et authentiquement sensuel — loin des orientaux poudre d'antan.",
    notes: {
      top: ["Grenade", "Persimmon", "Muscat"],
      heart: ["Orchidée Noire", "Lotus", "Champagne"],
      base: ["Ambre Noire", "Acajou", "Vanille"]
    },
    occasions: ["Soirée", "Automne", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/euphoria-calvin-klein.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["black-opium-ysl", "alien-mugler", "prada-candy"],
    h1: "Calvin Klein Euphoria Parfum Femme Algérie"
  },

  // 32. YSL Manifesto — vol 170
  {
    id: "manifesto-ysl",
    slug: "manifesto-ysl",
    name: "Manifesto",
    brand: "Yves Saint Laurent",
    brandSlug: "ysl",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental",
    concentration: "EDP",
    volume: "90ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'affirmation florale de YSL. Bergamote, jasmin et ambre pour un floral oriental lumineux et moderne — Manifesto, c'est la femme YSL qui signe son indépendance.",
    description: "Yves Saint Laurent Manifesto EDP est une déclaration de féminité affirmée et moderne. Lancé en 2012, il s'inscrit dans la tradition des grands floraux orientaux YSL — entre la sensualité d'Opium et la liberté de Libre — pour offrir quelque chose de lumineux, de floral et d'oriental à la fois.\n\nL'ouverture est solaire et pétillante : bergamote lumineuse et légèrement amère, fleur d'oranger fraîche et violette délicatement poudrée. Cette tête floral-agrumée est immédiatement accessible et optimiste — elle annonce un parfum qui célèbre plutôt qu'il n'écrase.\n\nLe cœur est d'une générosité florale remarquable : jasmin blanc sensuel, rose turque généreuse et pivoine délicate forment un accord floral de grande qualité. Ce cœur floral, plus riche et plus profond que la légèreté de l'ouverture ne le laissait présager, révèle le véritable caractère de Manifesto.\n\nLa base orientale est discrète mais efficace : bois de santal crémeux, musc blanc soyeux et ambrette légèrement musquée donnent au parfum sa tenue solide de 8 heures et sa douceur caractéristique en fond. Manifesto est un parfum YSL accessible — moins intense que Black Opium ou Libre Le Parfum, mais avec la même qualité de composition et la même identité de marque forte. En Algérie, il s'adresse aux femmes qui entrent dans l'univers YSL ou qui cherchent un floral oriental quotidien de la maison.",
    notes: {
      top: ["Bergamote", "Fleur d'Oranger", "Violette"],
      heart: ["Jasmin Blanc", "Rose Turque", "Pivoine"],
      base: ["Bois de Santal", "Musc Blanc", "Ambrette"]
    },
    occasions: ["Bureau", "Quotidien", "Printemps"],
    seasons: ["Printemps", "Automne"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/manifesto-ysl.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["libre-ysl", "mon-paris-ysl", "libre-le-parfum-ysl"],
    h1: "YSL Manifesto Parfum Femme Algérie"
  },

  // 33. Dior Fahrenheit — vol 140
  {
    id: "fahrenheit-dior",
    slug: "fahrenheit-dior",
    name: "Fahrenheit",
    brand: "Dior",
    brandSlug: "dior",
    gender: "homme",
    category: "parfums-homme",
    family: "Boisé Cuiré",
    concentration: "EDT",
    volume: "100ml",
    price: 13500,
    originalPrice: null,
    badge: null,
    shortDescription: "Le parfum masculin le plus iconique et le plus controversé de Dior. Violette, gasoil et cuir pour une fragrance hors norme qui divise — et marque à jamais.",
    description: "Dior Fahrenheit EDT est l'un des parfums masculins les plus originaux, les plus controversés et les plus influents de l'histoire de la parfumerie. Créé en 1988 par Maurice Roger et Jean-Louis Sieuzac, il représente une rupture radicale avec les masculins de son époque — fougères boisés et aquatiques frais — en proposant un accord boisé-cuiré d'une intensité et d'une originalité absolues.\n\nLa note la plus discutée de Fahrenheit est sa facette 'essence de gasoil' en ouverture — une note pétrochimique légèrement métallique et chaude qui donne au parfum son caractère unique et immédiatement clivant. Associée à la violette douce et à la bergamote, cette note crée une tension créatrice fascinante entre le végétal floral et l'industriel mineral.\n\nLe cœur s'assagit vers un accord floral-boisé plus accessible : aubépine blanche légèrement florale, cèdre sec et noix de muscade chaude. C'est un cœur qui tempère l'audace de l'ouverture sans la trahir.\n\nLa base est la vraie force de Fahrenheit : ambre chaud et légèrement résineux, bois de santal crémeux, vétiver sec et cuir blanc noble. Ce fond boisé-cuiré-ambré donne au parfum sa tenue exceptionnelle de 12 heures et son sillage discret mais persistant, presque mémorable. En Algérie, Fahrenheit est le parfum des hommes qui ont du caractère — qui n'ont pas peur de se distinguer et qui comprennent que les grands parfums ne plaisent pas à tout le monde, mais marquent ceux qui les comprennent.",
    notes: {
      top: ["Violette", "Bergamote", "Notes Boisées"],
      heart: ["Aubépine", "Noix de Muscade", "Cèdre"],
      base: ["Ambre", "Bois de Santal", "Vétiver", "Cuir"]
    },
    occasions: ["Soirée", "Occasions Spéciales", "Automne"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/fahrenheit-dior.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["dior-homme", "habit-rouge-guerlain", "la-nuit-de-l-homme-ysl"],
    h1: "Dior Fahrenheit Parfum Homme Algérie"
  },

  // 34. Azzaro Wanted EDT — vol 140
  {
    id: "azzaro-wanted",
    slug: "azzaro-wanted",
    name: "Wanted",
    brand: "Azzaro",
    brandSlug: "azzaro",
    gender: "homme",
    category: "parfums-homme",
    family: "Boisé Aromatique",
    concentration: "EDT",
    volume: "100ml",
    price: 10900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'homme recherché selon Azzaro. Cardamome, vétiver et bois de santal pour un boisé aromatique moderne et charismatique — Wanted, l'homme qui sait ce qu'il veut.",
    description: "Azzaro Wanted EDT est la reinvention réussie du masculin Azzaro pour la génération actuelle. Lancé en 2016, il conjugue le savoir-faire aromatique classique de la maison avec une modernité boisée qui répond parfaitement aux goûts contemporains. En Algérie, Wanted a rapidement gagné en popularité grâce à son sillage affirmé et son rapport qualité-prix compétitif.\n\nL'ouverture est épicée et aromatique : cardamome fraîchement moulue et légèrement camphrée, bergamote lumineuse et feuille de laurier légèrement herbal. C'est une tête qui sent immédiatement l'homme actif et décidé — directe, fraîche et épicée sans excès.\n\nLe cœur évolue vers un accord boisé-aromatique bien construit : géranium légèrement floral et herbacé, vétiver sec et légèrement fumé, et cèdre propre. Cet accord boisé au cœur est la force de Wanted — il donne au parfum une profondeur naturelle et masculine, sans recourir aux facilités des boisés synthétiques.\n\nLa base de fève tonka douce et crémeuse, bois de santal onctueux et amberwood chaud et enveloppant donne à Wanted sa signature douce-boisée finale. Cette base est plus chaleureuse et plus accessible que le cœur végétal — une douceur finale qui équilibre magnifiquement le caractère épicé-boisé de l'ensemble. Tenue : 8 heures. Wanted est le parfum idéal pour les hommes algériens qui cherchent un masculin aromatique moderne à prix raisonnable.",
    notes: {
      top: ["Cardamome", "Bergamote", "Laurier"],
      heart: ["Géranium", "Vétiver", "Cèdre"],
      base: ["Fève Tonka", "Bois de Santal", "Amberwood"]
    },
    occasions: ["Bureau", "Soirée", "Quotidien"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 4,
    sillage: 4,
    image: "/images/products/azzaro-wanted.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["azzaro-chrome", "hugo-boss-bottled", "mont-blanc-explorer"],
    h1: "Azzaro Wanted Parfum Homme Algérie"
  },

  // 35. Cacharel Yes I Am — vol 140
  {
    id: "yes-i-am-cacharel",
    slug: "yes-i-am-cacharel",
    name: "Yes I Am",
    brand: "Cacharel",
    brandSlug: "cacharel",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé Fruité",
    concentration: "EDP",
    volume: "75ml",
    price: 9900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'affirmation de la féminité selon Cacharel. Cassis, pivoine et caramel boisé pour un fruité-floral gourmand et positif — Yes I Am, c'est se choisir sans compromis.",
    description: "Cacharel Yes I Am EDP est le parfum de l'affirmation de soi et de la confiance. Lancé en 2018, il s'adresse aux femmes de la génération Z et Y — celles qui n'ont pas peur de dire OUI à elles-mêmes et à leurs désirs. La fragrance incarne cet état d'esprit positif et décomplexé dans un flacon rose néon immédiatement reconnaissable.\n\nL'ouverture est fraîche et fruitée avec éclat : cassis noir légèrement acidulé et pétillant, bergamote lumineuse et poire juteuse créent une tête fruitée vive et dynamique. C'est une entrée positive et énergisante — le genre d'ouverture qui donne envie de commencer la journée avec enthousiasme.\n\nLe cœur floral est romantique et légèrement gourmand : pivoine rose délicate et légèrement poudrée, caramel doux — une note gourmande inattendue dans un cœur floral — et jasmin blanc discret. Cet accord floral-caramel est la véritable originalité de Yes I Am : il crée un parfum qui oscille délicieusement entre le romantique et le gourmand.\n\nLa base boisée est chaleureuse et rassurante : bois de santal doux, patchouli crémeux légèrement terreux et musc blanc propre. Ce fond boisé-musqué donne au parfum sa profondeur et sa tenue correcte de 7 à 8 heures. En Algérie, Yes I Am plaît particulièrement aux jeunes femmes qui cherchent un parfum accessible d'une grande marque avec un positionnement moderne et une identité visuelle forte.",
    notes: {
      top: ["Cassis", "Bergamote", "Poire"],
      heart: ["Pivoine", "Caramel", "Jasmin Blanc"],
      base: ["Bois de Santal", "Patchouli", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Bureau", "Printemps"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/yes-i-am-cacharel.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["you-cacharel", "armani-my-way", "dolce-gabbana-l-imperatrice"],
    h1: "Cacharel Yes I Am Parfum Femme Algérie"
  },

  // 36. Zadig & Voltaire This Is Her! — vol 140
  {
    id: "this-is-her-zadig-voltaire",
    slug: "this-is-her-zadig-voltaire",
    name: "This Is Her!",
    brand: "Zadig & Voltaire",
    brandSlug: "zadig-voltaire",
    gender: "femme",
    category: "parfums-femme",
    family: "Boisé Vanillé",
    concentration: "EDP",
    volume: "90ml",
    price: 9900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le rock et la féminité selon Zadig & Voltaire. Cassis, jasmin et vanille boisée pour un parfum rebelle et doux à la fois — This Is Her!, l'anti-conformiste séduisante.",
    description: "Zadig & Voltaire This Is Her! EDP est la fragrance emblématique de la maison de mode franco-rock, celle qui incarne le mieux l'esprit Zadig : libre, rebelle, sexy sans effort et profondément moderne. Lancé en 2017, il a su séduire une génération de femmes qui refusent de choisir entre la douceur et la force, entre la féminité et l'indépendance.\n\nL'ouverture est fraîche et fruitée avec une légère tension : cassis noir légèrement acidulé, bergamote lumineuse et feuille de violette légèrement herbale et humide. Cette tête fruitée-verte annonce un parfum qui n'est pas tout à fait ce qu'on attend — différent des floraux standards de la même gamme de prix.\n\nLe cœur floral est romantique mais pas sage : jasmin blanc sensuel, rose fraîche délicate et pivoine légèrement poudrée forment un bouquet floral accessible et plaisant, mais avec ce petit quelque chose de rock qui distingue Zadig des floraux conventionnels.\n\nLa base est la vraie signature de This Is Her! : vanille crémeuse et chaude, bois de santal doux, patchouli léger et musc blanc soyeux. Cette base boisée-vanillée douce et enveloppante donne au parfum sa profondeur, sa tenue solide de 8 heures et ce côté addictif qui fait revenir sans cesse. En Algérie, This Is Her! plaît aux femmes entre 20 et 35 ans qui veulent un parfum avec une personnalité affirmée sans le prix d'une grande maison de couture.",
    notes: {
      top: ["Cassis", "Bergamote", "Feuille de Violette"],
      heart: ["Jasmin Blanc", "Rose", "Pivoine"],
      base: ["Vanille", "Bois de Santal", "Patchouli", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Soirée", "Bureau"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/this-is-her-zadig-voltaire.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["born-in-roma-valentino", "yes-i-am-cacharel", "armani-my-way"],
    h1: "Zadig Voltaire This Is Her Parfum Femme Algérie"
  },

  // 37. Dolce & Gabbana The One femme — vol 140
  {
    id: "dolce-gabbana-the-one",
    slug: "dolce-gabbana-the-one",
    name: "The One",
    brand: "Dolce & Gabbana",
    brandSlug: "dolce-gabbana",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental",
    concentration: "EDP",
    volume: "75ml",
    price: 12500,
    originalPrice: null,
    badge: null,
    shortDescription: "L'oriental glamour de Dolce & Gabbana. Litchi, gardénia et vanille ambrée pour un floral oriental d'une richesse hollywoodienne — The One, le parfum d'une femme qui est unique.",
    description: "Dolce & Gabbana The One EDP est le grand floral oriental de la maison italienne — le parfum de la femme glamour, sûre d'elle, qui assume pleinement sa sensualité et sa féminité. Lancé en 2006 par Alberto Morillas, The One Femme est rapidement devenu l'un des parfums féminins les plus portés dans les soirées et cérémonies du monde entier.\n\nL'ouverture est d'un raffinement immédiat : litchi exotique juteux, pêche veloutée dorée et bergamote lumineuse. Ces fruits solaires et juteux créent une entrée glamour et accessible — séduisante dès les premières secondes, comme un sourire de bienvenue.\n\nLe cœur floral est d'une richesse opulente : gardénia blanc crémeux et légèrement capiteux — la fleur signature de la féminité californienne des années 50 — accompagné de lis délicatement floral et de prune dorée légèrement fruitée. Cet accord floral-fruité au cœur est la partie la plus distinctive et la plus mémorable de The One Femme.\n\nLa base orientale est somptueuse : vanille crémeuse et riche, musc blanc soyeux, ambre chaud et légèrement résineux. Ce fond oriental enveloppant et persistant donne à The One sa tenue remarquable de 10 à 12 heures et son sillage généreux. En Algérie, The One Femme est souvent le parfum de soirée par excellence — mariage, fête de fiançailles, sortie élégante — une fragrance qui habille aussi bien que la plus belle des robes.",
    notes: {
      top: ["Litchi", "Pêche", "Bergamote"],
      heart: ["Gardénia", "Lis", "Prune"],
      base: ["Vanille", "Musc Blanc", "Ambre"]
    },
    occasions: ["Soirée", "Mariage", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/dolce-gabbana-the-one.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["dolce-gabbana-light-blue", "dolce-gabbana-l-imperatrice", "alien-mugler"],
    h1: "Dolce Gabbana The One Parfum Femme Algérie"
  },

  // 38. Rasasi Hawas — vol 110
  {
    id: "rasasi-hawas",
    slug: "rasasi-hawas",
    name: "Hawas",
    brand: "Rasasi",
    brandSlug: "rasasi",
    gender: "homme",
    category: "parfums-orientaux",
    family: "Oriental Aquatique Aromatique",
    concentration: "EDP",
    volume: "100ml",
    price: 5900,
    originalPrice: null,
    badge: null,
    shortDescription: "La désir en parfum selon Rasasi. Notes marines, cardamome et ambre musqué pour un oriental aquatique fascinant — Hawas incarne la sensualité de la parfumerie du Golfe.",
    description: "Rasasi Hawas EDP est l'une des fragrances masculines les plus remarquées de la maison de parfumerie de Dubaï. Lancé en 2016, Hawas — qui signifie 'désir' en arabe — a su conquérir les amateurs de parfumerie orientale dans le monde entier grâce à une composition innovante qui fusionne l'aquatique occidental avec la profondeur de l'oriental du Golfe.\n\nLa composition s'articule autour d'une tension créatrice fascinante entre deux univers olfactifs opposés : la fraîcheur marine et aquatique de la côte, et la chaleur ambrée et musquée de la parfumerie orientale traditionnelle. L'ouverture conjugue les notes marines iodées avec la cardamome épicée fraîche et la bergamote pour une entrée fraîche et épicée simultanément — un paradoxe olfactif parfaitement maîtrisé.\n\nLe cœur révèle l'originalité de Hawas : notes aquatiques fraîches et légèrement salines mêlées à du jasmin discret et à une touche d'iris poudrée. Cet accord aquatique-floral est inattendu dans un oriental — c'est ce qui distingue Hawas des orientaux classiques.\n\nLa base est résolument orientale : ambre gris chaud, bois de santal crémeux et musc blanc soyeux forment un fond enveloppant et persistant. Cette base orientale contraste magnifiquement avec la fraîcheur aquatique du début — une évolution fascinante sur la peau. Tenue : 8 à 10 heures. En Algérie, Hawas plaît aux hommes qui veulent un oriental différent, moins lourd que les ouds traditionnels, avec une fraîcheur moderne.",
    notes: {
      top: ["Notes Marines", "Cardamome", "Bergamote"],
      heart: ["Notes Aquatiques", "Jasmin", "Iris"],
      base: ["Ambre Gris", "Bois de Santal", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Soirée", "Bureau"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 4,
    sillage: 4,
    image: "/images/products/rasasi-hawas.jpg",
    inStock: true,
    featured: false,
    isOriental: true,
    related: ["amber-oud-al-haramain", "lattafa-oud-mood", "el-nabil-musc-makkah"],
    h1: "Rasasi Hawas Parfum Oriental Algérie"
  },

  // 39. Bvlgari Pour Homme Soir — vol 110
  {
    id: "bvlgari-pour-homme-soir",
    slug: "bvlgari-pour-homme-soir",
    name: "Pour Homme Soir",
    brand: "Bvlgari",
    brandSlug: "bvlgari",
    gender: "homme",
    category: "parfums-homme",
    family: "Boisé Aromatique",
    concentration: "EDT",
    volume: "100ml",
    price: 9500,
    originalPrice: null,
    badge: null,
    shortDescription: "L'élégance nocturne de Bvlgari. Bergamote, thé et bois de cèdre pour un boisé aromatique raffiné — Pour Homme Soir est la sophistication joaillière transposée en parfum.",
    description: "Bvlgari Pour Homme Soir EDT est la version nocturne et plus sophistiquée du Pour Homme classique. Lancé en 2010 par la grande joaillerie romaine, il transpose l'élégance et le raffinement caractéristiques de la maison Bvlgari dans une fragrance masculine d'une discrétion et d'une sophistication remarquables.\n\nLa composition s'articule autour du thé — matière première chère à la maison Bvlgari depuis ses premiers parfums — dans une version plus sombre et plus profonde que l'original. L'ouverture conjugue la bergamote lumineuse avec le thé Earl Grey légèrement fumé et aromatique pour une entrée élégante et distinctive. Cette note de thé sombre est la signature olfactive du Soir — elle évoque immédiatement la sophistication d'une soirée romaine.\n\nLe cœur boisé-aromatique est d'une cohérence parfaite : labdanum légèrement résineux et ambré, cardamome épicée douce et vétiver sec. Ces trois matières premières forment un cœur boisé-aromatique d'une qualité et d'une élégance authentiques.\n\nLa base de cèdre sec et légèrement fumé, musc blanc propre et ambre discret ancre tout avec une sobriété distinguée. La tenue est solide : 8 heures sur la peau. Pour Homme Soir est le parfum de l'homme discret mais remarqué — il ne cherche pas à s'imposer, mais laisse une impression durable sur ceux qui ont le privilège de se trouver à proximité. En Algérie, c'est souvent le choix des hommes d'affaires qui ont dépassé le stade des masculins voyants.",
    notes: {
      top: ["Bergamote", "Thé Earl Grey", "Mandarine"],
      heart: ["Labdanum", "Cardamome", "Vétiver"],
      base: ["Cèdre", "Musc Blanc", "Ambre"]
    },
    occasions: ["Bureau", "Soirée", "Quotidien"],
    seasons: ["Automne", "Hiver"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/bvlgari-pour-homme-soir.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["armani-code", "givenchy-gentleman", "hugo-boss-bottled"],
    h1: "Bvlgari Pour Homme Soir Parfum Homme Algérie"
  },

  // 40. Cartier Déclaration — vol 110
  {
    id: "declaration-cartier",
    slug: "declaration-cartier",
    name: "Déclaration",
    brand: "Cartier",
    brandSlug: "cartier",
    gender: "homme",
    category: "parfums-homme",
    family: "Aromatique Boisé",
    concentration: "EDT",
    volume: "100ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "La déclaration masculine de Cartier. Cardamome, pamplemousse et cyprès pour un aromatique boisé d'une élégance joaillière — Déclaration, quand Cartier signe sa masculinité.",
    description: "Cartier Déclaration EDT est le parfum masculin de référence de la grande joaillerie parisienne. Créé en 1998 par Jean-Claude Ellena — l'un des parfumeurs les plus raffinés de sa génération — Déclaration est un parfum d'une singularité absolue, reconnaissable entre mille grâce à son accord cardamome-pamplemousse d'une originalité et d'une cohérence parfaites.\n\nL'ouverture est immédiatement distinctive : cardamome noire fraîchement écrasée — épicée, légèrement camphrée, d'une intensité aromatique remarquable — associée au pamplemousse jaune frais et légèrement amer. Cet accord épicé-agrumé est la signature olfactive de Déclaration — unique, masculin, élégant. On le reconnaît en une seconde, même sans voir le flacon.\n\nLe cœur boisé révèle la profondeur voulue par Ellena : cyprès légèrement résieux et boisé, vétiver sec de Madagascar et cèdre fumé. Ces matières premières boisées et végétales créent un cœur austère et noble — l'équivalent olfactif d'une belle montre Cartier : sobre et précieux.\n\nLa base de bois de cèdre de Virginie sec et légèrement poudré, musc propre et ambre discrètement résineux donne à Déclaration sa tenue de 8 heures et son fond boisé caractéristique. En Algérie, Cartier Déclaration attire les hommes cultivés — juristes, médecins, ingénieurs — qui savent que le vrai luxe ne crie pas.",
    notes: {
      top: ["Cardamome", "Pamplemousse", "Bergamote"],
      heart: ["Cyprès", "Vétiver", "Cèdre"],
      base: ["Cèdre de Virginie", "Musc Blanc", "Ambre"]
    },
    occasions: ["Bureau", "Soirée", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/declaration-cartier.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["fahrenheit-dior", "habit-rouge-guerlain", "givenchy-gentleman"],
    h1: "Cartier Déclaration Parfum Homme Algérie"
  },

  // 41. Guerlain Habit Rouge — vol 110
  {
    id: "habit-rouge-guerlain",
    slug: "habit-rouge-guerlain",
    name: "Habit Rouge",
    brand: "Guerlain",
    brandSlug: "guerlain",
    gender: "homme",
    category: "parfums-homme",
    family: "Oriental Épicé",
    concentration: "EDT",
    volume: "100ml",
    price: 12500,
    originalPrice: null,
    badge: null,
    shortDescription: "Le grand oriental masculin de Guerlain. Citron, rose et benjoin pour un classique intemporel d'une sophistication absolue — Habit Rouge, la tenue de gala de la parfumerie.",
    description: "Guerlain Habit Rouge EDT est l'un des parfums masculins les plus influents de l'histoire de la parfumerie. Créé en 1965 par Jean-Paul Guerlain, il est souvent cité comme l'ancêtre de tous les masculins orientaux modernes — le premier à avoir osé porter la chaleur de l'ambre et de la vanille dans un parfum pour homme, à une époque où cela semblait scandaleux.\n\nLe nom 'Habit Rouge' fait référence à la tenue de chasse royale — élégante, aristocratique, légèrement romantique. La composition incarne parfaitement cette référence : lumineuse en ouverture avec le citron bergamote et l'orange, elle s'assombrit progressivement vers quelque chose de plus profond et de plus fascinant.\n\nLe cœur est d'une richesse florale masculine inattendue : rose délicate légèrement poudrée, jasmin discret et cardamome chaude créent un accord floral-épicé qui est la signature olfactive d'Habit Rouge — à la fois masculin et romantique, fort et délicat.\n\nLa base orientale est la véritable grandeur du parfum : benjoin doux et légèrement vanillé, bois de santal crémeux de Mysore, musc blanc soyeux et labdanum légèrement résineux. Ce fond oriental d'une richesse et d'une complexité remarquables explique la tenue exceptionnelle du parfum — 12 heures sur la peau — et son sillage chaleureux et enveloppant. En Algérie, Habit Rouge est souvent découvert par les hommes de plus de 40 ans qui ont épuisé les masculins standard et cherchent quelque chose de grand et de vrai.",
    notes: {
      top: ["Citron", "Bergamote", "Orange"],
      heart: ["Rose", "Jasmin", "Cardamome"],
      base: ["Benjoin", "Bois de Santal", "Musc Blanc", "Labdanum"]
    },
    occasions: ["Soirée", "Occasions Spéciales", "Hiver"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/habit-rouge-guerlain.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["fahrenheit-dior", "declaration-cartier", "la-nuit-de-l-homme-ysl"],
    h1: "Guerlain Habit Rouge Parfum Homme Algérie"
  },

  // 42. Lacoste L.12.12 Noir — vol 110
  {
    id: "lacoste-l12-noir",
    slug: "lacoste-l12-noir",
    name: "L.12.12 Noir",
    brand: "Lacoste",
    brandSlug: "lacoste",
    gender: "homme",
    category: "parfums-homme",
    family: "Oriental Boisé",
    concentration: "EDT",
    volume: "100ml",
    price: 8900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le côté obscur de Lacoste. Lavande, labdanum et ambre fumé pour un oriental boisé sensuel et mystérieux — L.12.12 Noir transcende le sportswear pour atteindre la sophistication.",
    description: "Lacoste L.12.12 Noir EDT est la surprise de la gamme L.12.12 — le polo blanc Lacoste transformé en oriental sophistiqué et mystérieux. Lancé en 2013, il représente une rupture totale avec l'image sportive et décontractée de la marque au crocodile, prouvant qu'une maison de sport peut aussi créer des parfums de caractère et de profondeur.\n\nL'ouverture aromatique annonce un masculin différent : lavande aromatique provençale, bergamote et thym sauvage légèrement herbacé. Cette tête aromatique-herbale, fraîche mais avec du caractère, prépare le terrain pour ce qui va suivre.\n\nLe cœur révèle la véritable ambition du parfum : labdanum résineux et légèrement ambré, patchouli sombre et légèrement terreux. Ces deux matières premières — habituellement réservées aux orientaux premium — donnent à L.12.12 Noir une profondeur et une sophistication qui dépassent largement son positionnement tarifaire.\n\nLa base est somptueuse pour un parfum de cette gamme : ambre fumé chaud et légèrement résineux, cèdre sec légèrement boisé et musc blanc propre. Ce fond oriental-boisé persistant donne au parfum une tenue remarquable de 8 à 10 heures et un sillage chaleureux et masculin. En Algérie, L.12.12 Noir est le choix intelligent — une marque internationalement reconnue, une composition de qualité, un prix accessible. Le parfum de l'homme qui aime les bonnes affaires.",
    notes: {
      top: ["Lavande", "Bergamote", "Thym"],
      heart: ["Labdanum", "Patchouli"],
      base: ["Ambre Fumé", "Cèdre", "Musc Blanc"]
    },
    occasions: ["Soirée", "Automne", "Bureau"],
    seasons: ["Automne", "Hiver"],
    longevity: 4,
    sillage: 4,
    image: "/images/products/lacoste-l12-noir.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["hugo-boss-bottled", "azzaro-wanted", "mont-blanc-explorer"],
    h1: "Lacoste L12.12 Noir Parfum Homme Algérie"
  },

  // 43. Nautica Voyage — vol 110
  {
    id: "nautica-voyage",
    slug: "nautica-voyage",
    name: "Voyage",
    brand: "Nautica",
    brandSlug: "nautica",
    gender: "homme",
    category: "parfums-homme",
    family: "Aromatique Aquatique",
    concentration: "EDT",
    volume: "100ml",
    price: 7900,
    originalPrice: null,
    badge: null,
    shortDescription: "La liberté marine par Nautica. Pomme fraîche, lotus aquatique et chêne pour un aquatique aromatique accessible et propre — Voyage, le parfum de ceux qui aiment le grand large.",
    description: "Nautica Voyage EDT est l'un des parfums masculins aquatiques les plus populaires du segment accessible. Lancé en 2006 par la marque américaine de sportwear nautique, il a su conquérir des millions d'hommes dans le monde grâce à une composition fraîche, propre et accessible à un prix remarquablement compétitif.\n\nL'ouverture est fraîche et fruitée avec un caractère aquatique marqué : pomme verte croquante légèrement sucrée, lotus aquatique légèrement floral et notes marines fraîches et légères. C'est une tête immédiatement accessible et plaisante — qui sent la fraîcheur sans complication.\n\nLe cœur aquatique-aromatique est bien construit : mimosa légèrement crémeux et floral, notes de brume marine iodées et ambre vert frais. Ces notes créent un cœur aquatique polyvalent — ni trop sportif, ni trop sophistiqué — parfaitement calibré pour une utilisation quotidienne.\n\nLa base de chêne légèrement boisé, musc blanc propre et cèdre sec donne à Voyage une profondeur sobre et sa tenue correcte de 5 à 6 heures. C'est un parfum honnête qui ne prétend pas être ce qu'il n'est pas — un masculin aquatique propre, accessible, polyvalent. En Algérie, Nautica Voyage est souvent le premier parfum de marque pour les jeunes hommes qui découvrent la parfumerie premium — son prix accessible est l'un des meilleurs points d'entrée dans le monde des grandes marques.",
    notes: {
      top: ["Pomme Verte", "Lotus Aquatique", "Notes Marines"],
      heart: ["Mimosa", "Brume Marine", "Ambre Vert"],
      base: ["Chêne", "Musc Blanc", "Cèdre"]
    },
    occasions: ["Quotidien", "Sport", "Été"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/nautica-voyage.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["davidoff-cool-water", "azzaro-chrome", "kenzo-l-eau-homme"],
    h1: "Nautica Voyage Parfum Homme Algérie"
  },

  // 44. Viktor & Rolf Spicebomb — vol 110
  {
    id: "spicebomb-viktor-rolf",
    slug: "spicebomb-viktor-rolf",
    name: "Spicebomb",
    brand: "Viktor & Rolf",
    brandSlug: "viktor-rolf",
    gender: "homme",
    category: "parfums-homme",
    family: "Oriental Épicé",
    concentration: "EDT",
    volume: "90ml",
    price: 12500,
    originalPrice: null,
    badge: null,
    shortDescription: "La bombe épicée de Viktor & Rolf. Bergamote, piment rouge et cuir pour un oriental explosif et masculin — Spicebomb, quand la parfumerie devient une arme de séduction.",
    description: "Viktor & Rolf Spicebomb EDT est l'un des masculins orientaux-épicés les plus originaux de la dernière décennie. Lancé en 2012, dans son flacon en forme de grenade — référence visuelle directe à son caractère explosif — Spicebomb a su imposer une nouvelle vision de la masculinité épicée : provocatrice, intense, mémorable.\n\nLa composition, créée par Oliver Polge, s'articule autour d'un accord épicé d'une intensité et d'une richesse rares. L'ouverture conjugue la bergamote fraîche et le poivre rose piquant pour une entrée épicée-agrumée vivace et directe. C'est une tête qui annonce immédiatement la couleur — ce parfum n'est pas fait pour les timides.\n\nLe cœur est épicé et boisé : cannelle chaude légèrement sucrée, elemi résineux et légèrement citronné, et safran précieux et légèrement métallique. Cet accord épicé au cœur est la signature de Spicebomb — chaleureux, oriental, avec cette légère tension entre le sucré de la cannelle et l'intensité du safran.\n\nLa base est sombre et sensuelle : cuir fin légèrement animal, tabac blond légèrement fumé et vétiver sec boisé. Ce fond cuiré-épicé donne à Spicebomb sa profondeur et sa tenue remarquable de 10 à 12 heures. En Algérie, Spicebomb attire les hommes qui aiment les épices, qui ont grandi dans une culture de la coriandre et du ras el hanout — il y a quelque chose d'instinctif dans l'attraction pour ce parfum.",
    notes: {
      top: ["Bergamote", "Poivre Rose"],
      heart: ["Cannelle", "Elemi", "Safran"],
      base: ["Cuir", "Tabac", "Vétiver"]
    },
    occasions: ["Soirée", "Automne", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/spicebomb-viktor-rolf.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["la-nuit-de-l-homme-ysl", "habit-rouge-guerlain", "ultra-male-jean-paul-gaultier"],
    h1: "Viktor Rolf Spicebomb Parfum Homme Algérie"
  },

  // 45. JPG Ultra Male — vol 110
  {
    id: "ultra-male-jean-paul-gaultier",
    slug: "ultra-male-jean-paul-gaultier",
    name: "Ultra Male",
    brand: "Jean Paul Gaultier",
    brandSlug: "jean-paul-gaultier",
    gender: "homme",
    category: "parfums-homme",
    family: "Oriental Aromatique",
    concentration: "EDT",
    volume: "125ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "La masculinité amplifiée par Jean Paul Gaultier. Poire juteuse, lavande et vanille pour un oriental aromatique excessif et irrésistible — Ultra Male, pour les hommes qui n'ont pas peur.",
    description: "Jean Paul Gaultier Ultra Male EDT est exactement ce que son nom promet : la masculinité portée à son degré maximal. Lancé en 2015 comme une intensification du Le Male original, Ultra Male reprend les codes de son prédécesseur et les pousse dans leurs retranchements — plus sucré, plus intense, plus affirmé.\n\nL'ouverture est une surprise gourmande : poire dorée juteuse et légèrement sucrée associée à la bergamote lumineuse et au feuillage frais. Cette entrée fruitée et appétissante n'est pas ce qu'on attend d'un parfum masculin — c'est précisément l'intention de Jean Paul Gaultier, qui a toujours aimé jouer avec les codes du genre.\n\nLe cœur aromatique-oriental est le cœur du parfum : lavande aromatique profonde, sapin baumier légèrement résineux et cannelle chaude. Cet accord aromatique-épicé est familier pour ceux qui connaissent Le Male, mais ici plus intense, plus profond, plus affirmé dans chaque direction.\n\nLa base est somptueuse et addictive : vanille crémeuse et généreuse, cèdre légèrement boisé et patchouli sombre. Ce fond vanillé-boisé-patchoulé donne à Ultra Male son caractère distinctif — chaud, enveloppant, légèrement gourmand — et sa tenue exceptionnelle de 12 heures. En Algérie, Ultra Male est le parfum des hommes qui aiment les fragrances sucrées et orientales, mais veulent quelque chose de plus structuré et plus masculin qu'un oriental pur.",
    notes: {
      top: ["Poire", "Bergamote", "Feuillage"],
      heart: ["Lavande", "Sapin Baumier", "Cannelle"],
      base: ["Vanille", "Cèdre", "Patchouli"]
    },
    occasions: ["Soirée", "Automne", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 5,
    image: "/images/products/ultra-male-jean-paul-gaultier.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["le-male-jean-paul-gaultier", "le-male-le-parfum", "spicebomb-viktor-rolf"],
    h1: "Jean Paul Gaultier Ultra Male Parfum Homme Algérie"
  }

];

const toAdd = newProducts.filter(p => !existingSlugs.has(p.slug));
db.products.push(...toAdd);
writeFileSync('data/products.json', JSON.stringify(db, null, 2));
console.log('Produits ajoutés:', toAdd.length);
console.log('Total produits:', db.products.length);
toAdd.forEach(p => console.log(' +', p.slug, '|', p.category, '|', p.price, 'DA'));
