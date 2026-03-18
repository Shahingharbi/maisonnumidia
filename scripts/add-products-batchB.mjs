import { readFileSync, writeFileSync } from 'fs';

const db = JSON.parse(readFileSync('data/products.json', 'utf8'));
const existingSlugs = new Set(db.products.map(p => p.slug));

const newProducts = [

  // 16. Elizabeth Arden 5th Avenue — vol 390
  {
    id: "5th-avenue-elizabeth-arden",
    slug: "5th-avenue-elizabeth-arden",
    name: "5th Avenue",
    brand: "Elizabeth Arden",
    brandSlug: "elizabeth-arden",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé",
    concentration: "EDP",
    volume: "125ml",
    price: 7900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'élégance new-yorkaise en flacon. Magnolia, lilas et bois de santal pour un floral boisé classique et intemporel — 5th Avenue, l'avenue la plus parfumée du monde.",
    description: "Elizabeth Arden 5th Avenue EDP est l'un des classiques féminins les plus durables de la parfumerie américaine. Lancé en 1996, il s'est imposé comme la signature olfactive de l'élégance new-yorkaise — sophistiquée, accessible et intemporelle. En Algérie, il est souvent le premier parfum de luxe abordable découvert par les femmes qui veulent une grande marque sans sacrifier leur budget.\n\nLa composition s'ouvre sur un accord floral-boisé d'une grande clarté : magnolia blanc légèrement crémeux, bergamote lumineuse et ylang-ylang doux créent une entrée florale classique et élégante. C'est une tête qui sent immédiatement le luxe accessible — propre, fleurie, féminine.\n\nLe cœur est d'une générosité florale remarquable : lilas poudré et légèrement sucré, rose fraîche et délicate, jasmin blanc discret et gardénia crémeux forment un bouquet floral d'une richesse et d'une diversité agréables. Ce cœur multi-floral est la force du parfum — complexe sans être confus, riche sans être lourd.\n\nLa base de bois de santal crémeux, musc blanc propre et cèdre sec ancre le tout avec une douceur boisée élégante. La tenue est solide pour un floral boisé : 8 heures sur la peau. Le volume généreux de 125ml représente un excellent rapport qualité-prix pour les femmes algériennes qui cherchent un parfum quotidien de qualité. Livraison COD en 58 wilayas.",
    notes: {
      top: ["Magnolia", "Bergamote", "Ylang-Ylang"],
      heart: ["Lilas", "Rose", "Jasmin Blanc", "Gardénia"],
      base: ["Bois de Santal", "Musc Blanc", "Cèdre"]
    },
    occasions: ["Quotidien", "Bureau", "Soirée"],
    seasons: ["Printemps", "Automne", "Hiver"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/5th-avenue-elizabeth-arden.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["chloe-signature", "tresor-lancome", "armani-my-way"],
    h1: "Elizabeth Arden 5th Avenue Parfum Femme Algérie"
  },

  // 17. Mont Blanc Lady Emblem — vol 390
  {
    id: "mont-blanc-lady-emblem",
    slug: "mont-blanc-lady-emblem",
    name: "Lady Emblem",
    brand: "Mont Blanc",
    brandSlug: "mont-blanc",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé Musqué",
    concentration: "EDP",
    volume: "75ml",
    price: 9900,
    originalPrice: null,
    badge: null,
    shortDescription: "La féminité lumineuse selon Mont Blanc. Pêche, muguet et musc soyeux pour un floral boisé doux et enveloppant — Lady Emblem est la femme élégante dans toute sa subtilité.",
    description: "Mont Blanc Lady Emblem EDP est la réponse féminine de la maison de luxe suisse à ses propres codes de qualité et d'élégance. Lancé en 2014, ce floral boisé musqué s'est imposé comme l'une des fragrances féminines les plus portables et les plus polyvalentes de sa gamme de prix. En Algérie, Mont Blanc bénéficie d'une excellente réputation grâce à ses stylos et montres — une image de luxe accessible qui profite naturellement à ses parfums.\n\nL'ouverture de Lady Emblem est fraîche et fruitée : pêche veloutée dorée, poire juteuse et mandarine lumineuse créent une entrée solaire et appétissante. C'est une tête fruitée-florale qui attire immédiatement et met de bonne humeur.\n\nLe cœur floral est d'une douceur et d'une légèreté remarquables : muguet cristallin et légèrement aquatique, jasmin blanc discret et rose fraîche délicate. Cet accord floral aérien est le cœur de Lady Emblem — léger comme une brise printanière, féminin sans ostentation.\n\nLa base de bois de santal doux, patchouli crémeux traité avec subtilité et musc blanc soyeux donne à Lady Emblem sa profondeur boisée-musquée signature. Cette base enveloppante et douce prolonge le parfum 8 à 10 heures sur la peau avec un sillage délicat. C'est un parfum qui ne fatigue jamais — ni vous, ni votre entourage — la qualité la plus précieuse pour un parfum de quotidien.",
    notes: {
      top: ["Pêche", "Poire", "Mandarine"],
      heart: ["Muguet", "Jasmin Blanc", "Rose"],
      base: ["Bois de Santal", "Patchouli", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Bureau", "Printemps"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/mont-blanc-lady-emblem.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["armani-my-way", "chloe-signature", "eclat-arpege-lanvin"],
    h1: "Mont Blanc Lady Emblem Parfum Femme Algérie"
  },

  // 18. Jean Patou Joy — vol 390
  {
    id: "joy-jean-patou",
    slug: "joy-jean-patou",
    name: "Joy",
    brand: "Jean Patou",
    brandSlug: "jean-patou",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral",
    concentration: "EDP",
    volume: "75ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le parfum floral le plus luxueux de l'histoire. Rose de Grasse et jasmin de Grasse en quantités exorbitantes — Joy de Jean Patou est la définition absolue de l'extravagance florale.",
    description: "Joy de Jean Patou est l'une des fragrances les plus légendaires de l'histoire de la parfumerie. Créé en 1930 par Henri Alméras pour réconforter les clients de la maison pendant la Grande Dépression, Joy était alors le parfum le plus cher du monde — il faut 10 600 fleurs de jasmin et 28 douzaines de roses pour produire une seule once de parfum. Cette extravagance olfactive est restée sa signature pendant un siècle.\n\nLa composition de Joy est d'une simplicité monumentale : c'est avant tout un duo rose-jasmin d'une qualité et d'une quantité exceptionnelles. La rose de Grasse — cueillie à la main dans les champs provençaux — et le jasmin de Grasse — récolté de nuit pour préserver ses molécules aromatiques les plus précieuses — forment un accord floral d'une richesse et d'une profondeur inégalées dans la parfumerie de grande maison.\n\nL'ouverture aldéhydique, caractéristique des grands floraux classiques, donne à Joy son caractère intemporel légèrement poudré et sophistiqué. Le cœur de rose-jasmin est d'une générosité absolue — opulent, capiteux, mais jamais vulgaire. La base de ylang-ylang, bois de santal et musc ajoute une chaleur sensuelle et une tenue remarquable.\n\nEn Algérie, Joy de Jean Patou s'adresse aux femmes qui apprécient l'histoire de la parfumerie et veulent porter une fragrance de légende — quelque chose de vrai, de précieux, qui a résisté à l'épreuve du temps.",
    notes: {
      top: ["Aldéhydes", "Ylang-Ylang", "Néroli"],
      heart: ["Rose de Grasse", "Jasmin de Grasse", "Orchidée"],
      base: ["Bois de Santal", "Civette", "Musc Blanc"]
    },
    occasions: ["Soirée", "Occasions Spéciales", "Mariage"],
    seasons: ["Printemps", "Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/joy-jean-patou.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["tresor-lancome", "miss-dior", "chloe-signature"],
    h1: "Joy Jean Patou Parfum Femme Algérie"
  },

  // 19. Mauboussin Pour Elle — vol 390
  {
    id: "mauboussin-pour-elle",
    slug: "mauboussin-pour-elle",
    name: "Pour Elle",
    brand: "Mauboussin",
    brandSlug: "mauboussin",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental Fruité",
    concentration: "EDP",
    volume: "100ml",
    price: 8500,
    originalPrice: null,
    badge: null,
    shortDescription: "Le luxe joaillier de Mauboussin en parfum. Cassis, pivoine et vanille ambrée pour un floral oriental doux et gourmand — Pour Elle est le parfum de la femme qui aime le beau à prix accessible.",
    description: "Mauboussin Pour Elle EDP est le parfum féminin emblématique de la maison de joaillerie parisienne fondée en 1827. Cette maison, plus connue pour ses bijoux et montres de luxe, a su transposer son savoir-faire dans la parfumerie avec cette fragrance florale-orientale qui allie qualité et accessibilité — un équilibre rare dans le segment luxe.\n\nL'ouverture est fraîche et fruitée avec caractère : cassis noir légèrement acidulé, poire dorée juteuse et bergamote lumineuse créent une entrée vivace et attrayante. Cette fraîcheur fruitée initiale est la marque de fabrique de Mauboussin — directe et séduisante dès les premières secondes.\n\nLe cœur évolue vers un accord floral d'une douceur romantique : pivoine rose délicate et légèrement poudrée, rose fraîche et jasmin discret. Cet accord floral-fruité au cœur est harmonieux et accessible — ni trop sucré, ni trop complexe — parfait pour une utilisation quotidienne en toute saison.\n\nLa base orientale est la vraie surprise de Pour Elle : vanille crémeuse et chaude, ambre doré légèrement sucré et musc blanc soyeux. Ce fond oriental discret donne au parfum une profondeur et une tenue remarquables pour son positionnement tarifaire — 8 à 10 heures sur la peau. En Algérie, Mauboussin Pour Elle offre la combinaison idéale : une marque joaillière de prestige, une composition de qualité réelle, et un prix accessible.",
    notes: {
      top: ["Cassis", "Poire", "Bergamote"],
      heart: ["Pivoine", "Rose", "Jasmin"],
      base: ["Vanille", "Ambre", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Bureau", "Soirée"],
    seasons: ["Printemps", "Automne", "Hiver"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/mauboussin-pour-elle.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["armani-my-way", "dolce-gabbana-l-imperatrice", "born-in-roma-valentino"],
    h1: "Mauboussin Pour Elle Parfum Femme Algérie"
  },

  // 20. Givenchy L'Interdit EDP — vol 390
  {
    id: "givenchy-l-interdit",
    slug: "givenchy-l-interdit",
    name: "L'Interdit",
    brand: "Givenchy",
    brandSlug: "givenchy",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé Poudré",
    concentration: "EDP",
    volume: "80ml",
    price: 13500,
    originalPrice: null,
    badge: null,
    shortDescription: "La féminité rebelle de Givenchy. Fleur d'oranger, jasmin et patchouli pour un floral boisé envoûtant — L'Interdit est le parfum de la femme qui ose transgresser les codes.",
    description: "Givenchy L'Interdit EDP est la réincarnation moderne d'un parfum légendaire créé à l'origine pour Audrey Hepburn en 1957. La maison parisienne lui avait alors demandé de garder le parfum secret — d'où son nom 'L'Interdit'. La version contemporaine, lancée en 2018, réinterprète cet héritage avec une sensibilité actuelle tout en gardant l'essence de sophistication et d'audace.\n\nL'ouverture est florale et légèrement solaire : fleur d'oranger fraîche et lumineuse, jasmin blanc délicat et une touche de poire sucrée. Cette tête florale-fruitée est accessible et séduisante — elle installe immédiatement un sentiment de féminité élégante.\n\nLe cœur révèle la complexité de L'Interdit : un accord de fleurs blanches d'une richesse subtile où l'ylang-ylang, le jasmin et la pivoine s'associent pour créer une signature florale qui porte à la fois la légèreté et la profondeur. C'est un cœur qui évolue magnifiquement sur la peau.\n\nLa base est la signature distinctive du parfum : patchouli sombre et légèrement terreux traité avec une élégance particulière, ambroxan chaud et sensuel, et vétiver sec. Ce fond boisé-poudré donne à L'Interdit sa profondeur caractéristique et sa tenue solide de 10 à 12 heures. En Algérie, L'Interdit attire les femmes sophistiquées qui cherchent un floral avec du caractère — quelque chose de plus profond et de plus envoûtant que les floraux standard.",
    notes: {
      top: ["Fleur d'Oranger", "Poire", "Bergamote"],
      heart: ["Jasmin", "Ylang-Ylang", "Pivoine"],
      base: ["Patchouli", "Ambroxan", "Vétiver"]
    },
    occasions: ["Soirée", "Bureau", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/givenchy-l-interdit.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["givenchy-irresistible", "black-opium-ysl", "alien-mugler"],
    h1: "Givenchy L'Interdit Parfum Femme Algérie"
  },

  // 21. Givenchy Gentleman EDP — vol 390
  {
    id: "givenchy-gentleman",
    slug: "givenchy-gentleman",
    name: "Gentleman",
    brand: "Givenchy",
    brandSlug: "givenchy",
    gender: "homme",
    category: "parfums-homme",
    family: "Oriental Boisé",
    concentration: "EDP",
    volume: "100ml",
    price: 12500,
    originalPrice: null,
    badge: null,
    shortDescription: "L'iris masculin revisité par Givenchy. Bergamote, iris poudré et vanille pour un oriental boisé d'une élégance parisienne — Givenchy Gentleman est l'homme qui connaît sa valeur.",
    description: "Givenchy Gentleman EDP est la réinterprétation contemporaine du parfum masculin iconique de la maison, créé à l'origine en 1975. Relancé en 2017 dans une nouvelle formulation, il actualise l'héritage classique de Givenchy avec une sensibilité moderne tout en gardant les codes d'élégance parisienne de la maison.\n\nLa composition s'articule autour de l'iris — une note florale associée à la masculinité depuis les grands parfums classiques du siècle dernier. L'ouverture conjugue la bergamote lumineuse et légèrement amère avec le poivre noir pour une entrée fraîche et épicée, directe et confiante. C'est une tête qui annonce un homme sûr de lui et de son goût.\n\nLe cœur révèle l'âme du parfum : iris poudré et légèrement beurré, patchouli sombre et légèrement terreux, et une touche de vétiver sec. Cet accord iris-patchouli est la signature moderne du Gentleman — sophistiqué, légèrement androgyne au sens le plus noble, avec cette profondeur que les grands floraux masculins ont toujours su apprivoiser.\n\nLa base de vanille crémeuse, ambre chaud et musc soyeux donne à Givenchy Gentleman sa chaleur orientale et sa tenue solide de 10 heures. Ce fond chaud et enveloppant contraste magnifiquement avec la fraîcheur épicée de l'ouverture pour créer une composition complète et mémorable. En Algérie, Gentleman est le choix de l'homme raffiné qui maîtrise les codes de l'élégance sans chercher à épater.",
    notes: {
      top: ["Bergamote", "Poivre Noir"],
      heart: ["Iris", "Patchouli", "Vétiver"],
      base: ["Vanille", "Ambre", "Musc Blanc"]
    },
    occasions: ["Bureau", "Soirée", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/givenchy-gentleman.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["dior-homme", "armani-code", "valentino-uomo"],
    h1: "Givenchy Gentleman Parfum Homme Algérie"
  },

  // 22. Azzaro Chrome EDT — vol 390
  {
    id: "azzaro-chrome",
    slug: "azzaro-chrome",
    name: "Chrome",
    brand: "Azzaro",
    brandSlug: "azzaro",
    gender: "homme",
    category: "parfums-homme",
    family: "Aromatique Aquatique",
    concentration: "EDT",
    volume: "100ml",
    price: 8900,
    originalPrice: null,
    badge: null,
    shortDescription: "La fraîcheur aromatique signature d'Azzaro. Néroli, coriandre et bois de santal pour un masculin aquatique élégant et discret — Chrome, le parfum de l'homme accompli.",
    description: "Azzaro Chrome EDT est un classique de la parfumerie masculine qui a su traverser plus de vingt-cinq ans sans prendre une ride. Lancé en 1996 par la maison parisienne Azzaro, il fait partie de cette génération dorée des masculins aquatiques-aromatiques qui ont défini le goût des hommes algériens des années 2000 — aux côtés de Cool Water et Acqua di Gio.\n\nLa composition s'ouvre sur un accord frais et aromatique immédiatement reconnaissable : néroli blanc et légèrement floral, citron propre et vif, bergamote lumineuse et coriandre légèrement épicée. C'est une tête qui sent propre, soigné, classique — le type d'ouverture qui donne confiance.\n\nLe cœur évolue vers un accord aromatique plus profond : bois de cardamome chaud, cardamome épicée, noix de muscade et un accord masculin propre. C'est un cœur qui ne surprend pas mais qui satisfait — équilibré, bien construit, avec une cohérence aromatique qui témoigne d'un vrai savoir-faire en parfumerie.\n\nLa base de bois de santal crémeux, oakmoss légèrement terreux et fève tonka chaude donne à Chrome sa profondeur et sa tenue correcte de 6 à 7 heures. C'est un parfum pour les hommes qui ne veulent pas se poser de questions — une valeur sûre, accessible, que l'on peut offrir à son père, son frère ou son mari sans risque. En Algérie, Chrome est le parfum du quotidien par excellence.",
    notes: {
      top: ["Néroli", "Citron", "Bergamote", "Coriandre"],
      heart: ["Cardamome", "Muscade", "Bois de Rose"],
      base: ["Bois de Santal", "Oakmoss", "Fève Tonka"]
    },
    occasions: ["Quotidien", "Bureau", "Été"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/azzaro-chrome.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["davidoff-cool-water", "nautica-voyage", "hugo-boss-bottled"],
    h1: "Azzaro Chrome Parfum Homme Algérie"
  },

  // 23. Acqua di Gio Parfum Armani — vol 320
  {
    id: "acqua-di-gio-armani",
    slug: "acqua-di-gio-armani",
    name: "Acqua di Giò Parfum",
    brand: "Giorgio Armani",
    brandSlug: "armani",
    gender: "homme",
    category: "parfums-homme",
    family: "Aromatique Aquatique Boisé",
    concentration: "Parfum",
    volume: "75ml",
    price: 14500,
    originalPrice: null,
    badge: null,
    shortDescription: "L'aquatique de légende élevé au rang de Parfum. Bergamote marine, géranium et patchouli pour l'expression la plus intense et la plus boisée d'Acqua di Giò.",
    description: "Armani Acqua di Giò Parfum est la version la plus aboutie et la plus intense de l'aquatique masculin le plus iconique du monde. Lancé en 2023, cette concentration Parfum prend l'ADN aquatique-méditerranéen d'Acqua di Giò — lancé en 1996 et jamais sorti du top mondial des ventes — et lui confère une profondeur et une persistance que l'EDT et l'EDP ne pouvaient pas atteindre.\n\nL'ouverture reste fidèle à l'héritage aquatique de la gamme : bergamote fraîche et lumineuse, notes marines iodées qui évoquent la Méditerranée, et une touche de citron brillant. Cette tête est instantanément reconnaissable pour tous ceux qui connaissent Acqua di Giò — mais plus profonde, plus concentrée, plus affirmée.\n\nLe cœur révèle ce qui différencie vraiment cette version Parfum : géranium légèrement herbacé, romarin aromatique et notes de bois vert. Ces notes verdoyantes donnent au parfum une dimension naturelle et authentique qui rappelle les garrigues méditerranéennes plutôt que la plage.\n\nLa base est la vraie nouveauté par rapport aux versions précédentes : patchouli sombre et boisé, labdanum résineux légèrement ambré et encens discret. Ce fond boisé-résineux totalement absent de l'EDT original donne au Parfum sa profondeur, sa tenue exceptionnelle de 12 heures et son sillage plus affirmé. En Algérie, c'est la version à choisir pour l'homme qui veut l'Acqua di Giò dans sa forme la plus sophistiquée.",
    notes: {
      top: ["Bergamote", "Notes Marines", "Citron"],
      heart: ["Géranium", "Romarin", "Bois Vert"],
      base: ["Patchouli", "Labdanum", "Encens"]
    },
    occasions: ["Bureau", "Soirée", "Quotidien"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/acqua-di-gio-armani.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["armani-code", "davidoff-cool-water", "bleu-de-chanel"],
    h1: "Acqua di Giò Armani Parfum Homme Algérie"
  },

  // 24. YSL La Nuit de L'Homme Le Parfum — vol 320
  {
    id: "la-nuit-de-l-homme-ysl",
    slug: "la-nuit-de-l-homme-ysl",
    name: "La Nuit de L'Homme Le Parfum",
    brand: "Yves Saint Laurent",
    brandSlug: "ysl",
    gender: "homme",
    category: "parfums-homme",
    family: "Oriental Épicé",
    concentration: "Parfum",
    volume: "100ml",
    price: 13500,
    originalPrice: null,
    badge: null,
    shortDescription: "L'intensité nocturne de YSL. Cardamome, lavande et vétiver pour un oriental épicé d'une profondeur envoûtante — La Nuit de L'Homme dans sa forme la plus absolue.",
    description: "YSL La Nuit de L'Homme Le Parfum est l'expression ultime de la masculinité nocturne selon Saint Laurent. Lancé en 2016 comme une intensification de l'EDT iconique La Nuit de L'Homme, ce Parfum porte toutes les caractéristiques qui ont fait le succès de la gamme — séduction, mystère, profondeur — et les amplifie considérablement.\n\nLa cardamome est la clé de voûte de cette composition. Fraîche, épicée, légèrement camphrée, elle s'associe à la bergamote lumineuse pour créer une ouverture épicée-aromatique d'une grande personnalité. C'est une tête immédiatement reconnaissable, associée dans l'esprit de nombreux algériens à la sophistication et au charme nocturne.\n\nLe cœur révèle la profondeur de la composition : lavande provençale sombre et aromatique — différente de la lavande fraîche des masculins aquatiques — associée au carvi légèrement anisé et à la sauge clary. Cet accord aromatique-épicé au cœur donne au parfum sa signature masculine distinctive, à la fois familière et surprenante.\n\nLa base de vétiver sec et légèrement fumé, cèdre boisé et musc chaud ancre le tout dans une profondeur orientale retenue. La tenue est exceptionnelle — 12 à 14 heures sur la peau — et la projection nocturne est calculée pour séduire sans agresser. En Algérie, La Nuit de L'Homme est souvent le parfum réservé aux sorties importantes, aux soirées, aux moments où on veut laisser une impression durable.",
    notes: {
      top: ["Cardamome", "Bergamote"],
      heart: ["Lavande", "Carvi", "Sauge Clary"],
      base: ["Vétiver", "Cèdre", "Musc"]
    },
    occasions: ["Soirée", "Occasions Spéciales", "Automne"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/la-nuit-de-l-homme-ysl.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["armani-code", "habit-rouge-guerlain", "dior-homme"],
    h1: "YSL La Nuit de L'Homme Parfum Homme Algérie"
  },

  // 25. Layton Parfums de Marly — vol 320
  {
    id: "layton-parfums-de-marly",
    slug: "layton-parfums-de-marly",
    name: "Layton",
    brand: "Parfums de Marly",
    brandSlug: "parfums-de-marly",
    gender: "homme",
    category: "parfums-homme",
    family: "Boisé Aromatique Gourmand",
    concentration: "EDP",
    volume: "125ml",
    price: 22000,
    originalPrice: null,
    badge: null,
    shortDescription: "Le nec plus ultra de la parfumerie de niche masculine. Pomme fraîche, lavande et vanille pour un gourmand boisé d'une élégance royale — Layton, l'étalon du parfum de statut.",
    description: "Parfums de Marly Layton est l'un des parfums masculins de niche les plus recherchés et les plus appréciés des connaisseurs du monde entier. Lancé en 2016 par la maison française inspirée par la cour de Louis XV, Layton s'est imposé comme une référence absolue dans la catégorie des masculins gourmands-boisés — une fragrance qui conjugue l'accessibilité olfactive et la sophistication avec une harmonie parfaite.\n\nL'ouverture est lumineuse et fraîche : pomme verte croquante légèrement acidulée, bergamote et lavande aromatique créent une entrée fruitée-aromatique d'une grande fraîcheur. C'est une tête séduisante et positive, immédiatement appréciée, qui invite à en découvrir plus.\n\nLe cœur révèle la richesse de la composition : géranium légèrement épicé, jasmin discret et violette poudrée créent un accord floral-aromatique d'une complexité et d'une finesse remarquables pour un masculin. Cette profondeur florale inattendue dans un parfum masculin de niche témoigne de l'audace créative de la maison.\n\nLa base est somptueuse : vanille crémeuse de qualité exceptionnelle, poivre de Timur légèrement citronné, cardamome chaude, bois de santal onctueux et ambre doux. Ce fond gourmand-boisé — riche sans être lourd, sucré sans être candy — donne à Layton sa tenue phénoménale de 14 heures et son sillage enveloppant. En Algérie, Layton est le parfum de statut par excellence pour les hommes qui veulent afficher un goût raffiné et une connaissance réelle de la parfumerie.",
    notes: {
      top: ["Pomme", "Lavande", "Bergamote"],
      heart: ["Géranium", "Jasmin", "Violette"],
      base: ["Vanille", "Cardamome", "Bois de Santal", "Ambre"]
    },
    occasions: ["Bureau", "Soirée", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 5,
    sillage: 5,
    image: "/images/products/layton-parfums-de-marly.jpg",
    inStock: true,
    featured: true,
    isOriental: false,
    related: ["creed-aventus", "amouage-reflection", "delina-parfums-de-marly"],
    h1: "Layton Parfums de Marly Parfum Homme Algérie"
  },

  // 26. Mont Blanc Explorer EDP — vol 210
  {
    id: "mont-blanc-explorer",
    slug: "mont-blanc-explorer",
    name: "Explorer",
    brand: "Mont Blanc",
    brandSlug: "mont-blanc",
    gender: "homme",
    category: "parfums-homme",
    family: "Boisé Aromatique",
    concentration: "EDP",
    volume: "100ml",
    price: 10500,
    originalPrice: null,
    badge: null,
    shortDescription: "L'aventurier du parfum masculin. Bergamote, labdanum et vétiver pour un boisé aromatique authentique et tenace — Mont Blanc Explorer trace son propre chemin.",
    description: "Mont Blanc Explorer EDP est l'une des sorties masculines les plus réussies de ces dernières années. Lancé en 2019, cet EDP boisé-aromatique s'est rapidement imposé comme une alternative sérieuse aux grands boisés masculins de luxe, avec une qualité de composition qui dépasse largement son positionnement tarifaire.\n\nLa composition s'inspire du thème de l'exploration et de la découverte — des grands espaces naturels, des paysages alpins sauvages, de l'aventure authentique. L'ouverture conjugue la bergamote lumineuse avec la sauge clary aromatique pour une entrée fraîche, naturelle et directe qui évoque l'air pur des hauteurs.\n\nLe cœur révèle la profondeur de la composition : labdanum résineux légèrement boisé et ambré, avec une texture qui rappelle les écorces d'arbres séchées par le soleil. C'est une note de fond de cœur très particulière qui donne à Explorer son identité olfactive distinctive — reconnaissable et mémorable.\n\nLa base est d'une qualité remarquable pour ce positionnement prix : vétiver sec de haute qualité — terreux, fumé, légèrement boisé — bois d'ambre chaud et musc propre forment un fond d'une profondeur et d'une persistance dignes d'un parfum deux fois plus cher. La tenue atteint 10 à 12 heures sur la peau. En Algérie, Mont Blanc Explorer s'adresse aux hommes actifs et sportifs qui veulent un parfum de caractère sans investir dans le niche premium.",
    notes: {
      top: ["Bergamote", "Sauge Clary"],
      heart: ["Labdanum", "Bois Ambré"],
      base: ["Vétiver", "Bois d'Ambre", "Musc Blanc"]
    },
    occasions: ["Quotidien", "Sport", "Bureau"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/mont-blanc-explorer.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["hugo-boss-bottled", "davidoff-cool-water", "azzaro-wanted"],
    h1: "Mont Blanc Explorer Parfum Homme Algérie"
  },

  // 27. El Nabil Musc Makkah — vol 170
  {
    id: "el-nabil-musc-makkah",
    slug: "el-nabil-musc-makkah",
    name: "Musc Makkah",
    brand: "El Nabil",
    brandSlug: "el-nabil",
    gender: "unisexe",
    category: "parfums-orientaux",
    family: "Oriental Musqué",
    concentration: "EDP",
    volume: "50ml",
    price: 3900,
    originalPrice: null,
    badge: null,
    shortDescription: "La pureté du musc de Makkah. Rose, musc blanc et oud doux pour une fragrance orientale spirituelle et enveloppante — El Nabil incarne l'authenticité de la parfumerie islamique.",
    description: "El Nabil Musc Makkah est l'une des fragrances les plus emblématiques de la marque française de parfumerie halal El Nabil, spécialisée dans les orientaux traditionnels accessibles. Ce parfum porte en lui l'essence spirituelle de la ville sainte — une composition inspirée par la pureté et la sérénité associées à Makkah dans la culture musulmane.\n\nLa composition s'articule autour du musc blanc — la note olfactive la plus associée à la pureté dans la tradition islamique. Ce musc ici est traité avec une qualité et une générosité qui justifient le succès de la gamme El Nabil : propre, soyeux, légèrement poudré, il forme la colonne vertébrale du parfum.\n\nLa rose damascène — autre matière première emblématique de la parfumerie orientale — apporte sa chaleur florale et sa profondeur au cœur de la composition. Associée au musc, elle crée un accord rosé-musqué très traditionnel et très apprécié dans la culture olfactive algérienne, particulièrement lors des occasions religieuses et familiales.\n\nLa touche d'oud léger en base — bois précieux d'Asie du Sud-Est — donne à Musc Makkah sa profondeur orientale caractéristique sans l'agressivité des oud trop fumés ou médicinaux. C'est un oud doux, accessible, qui complète harmonieusement le musc et la rose. En Algérie, El Nabil Musc Makkah est particulièrement porté durant le Ramadan, l'Aïd et pour la prière — une fragrance de dévotion et de paix intérieure.",
    notes: {
      top: ["Musc Blanc", "Rose"],
      heart: ["Rose Damascène", "Musc Poudré"],
      base: ["Oud Léger", "Ambre Blanc", "Bois"]
    },
    occasions: ["Quotidien", "Prière", "Ramadan"],
    seasons: ["Toute l'année"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/el-nabil-musc-makkah.jpg",
    inStock: true,
    featured: false,
    isOriental: true,
    related: ["amber-oud-al-haramain", "lattafa-oud-mood", "kayali-eden"],
    h1: "El Nabil Musc Makkah Parfum Oriental Algérie"
  },

  // 28. Davidoff Cool Water EDT — vol 170
  {
    id: "davidoff-cool-water",
    slug: "davidoff-cool-water",
    name: "Cool Water",
    brand: "Davidoff",
    brandSlug: "davidoff",
    gender: "homme",
    category: "parfums-homme",
    family: "Aromatique Aquatique",
    concentration: "EDT",
    volume: "100ml",
    price: 7900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le pionnier de l'aquatique masculin. Menthe, lavandin et musc océanique pour une fraîcheur qui a défini une génération — Cool Water reste le classique aquatique inégalé.",
    description: "Davidoff Cool Water EDT est le parfum aquatique masculin qui a tout changé. Lancé en 1988 par le parfumeur Pierre Bourdon, il a littéralement inventé la catégorie des masculins aquatiques — une révolution olfactive que des dizaines de parfums ont tenté d'imiter sans jamais vraiment l'égaler. Trente-cinq ans après sa création, Cool Water reste dans le top mondial des parfums masculins les plus vendus.\n\nL'ouverture est immédiatement reconnaissable et inoubliable : menthe fraîche glacée, notes oceanic ozonic légèrement salines et rosemary aromatique créent la signature aquatique masculine la plus imitée de l'histoire de la parfumerie. C'est une tête qui sent littéralement la vague froide — froide, propre, vivifiante, immédiatement rafraîchissante.\n\nLe cœur aromatique-floral associe lavandin aromatique provençal, jasmin blanc discret et géranium légèrement herbal pour créer un accord qui évolue naturellement de la fraîcheur de la tête vers la chaleur de la base. Cette transition est caractéristique du talent de Pierre Bourdon.\n\nLa base de bois de santal crémeux, oakmoss légèrement terreux, musc blanc propre et tabac doux donne à Cool Water sa profondeur aromatique et sa tenue correcte de 5 à 6 heures. En Algérie, Cool Water est le parfum de l'été par excellence — son rapport fraîcheur-prix est imbattable, et son héritage culturel en fait un choix évident pour toutes les générations d'hommes qui ont grandi dans les années 90 et 2000.",
    notes: {
      top: ["Menthe", "Notes Marines", "Romarin"],
      heart: ["Lavandin", "Jasmin", "Géranium"],
      base: ["Bois de Santal", "Oakmoss", "Musc Blanc", "Tabac"]
    },
    occasions: ["Quotidien", "Sport", "Été"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/davidoff-cool-water.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["azzaro-chrome", "nautica-voyage", "kenzo-l-eau-homme"],
    h1: "Davidoff Cool Water Parfum Homme Algérie"
  },

  // 29. Van Cleef & Arpels Féerie — vol 170
  {
    id: "van-cleef-feerie",
    slug: "van-cleef-feerie",
    name: "Féerie",
    brand: "Van Cleef & Arpels",
    brandSlug: "van-cleef-arpels",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Boisé",
    concentration: "EDP",
    volume: "50ml",
    price: 11500,
    originalPrice: null,
    badge: null,
    shortDescription: "La magie joaillière de Van Cleef en parfum. Fleur de pommier, rose et patchouli pour un floral boisé enchanté — Féerie est la femme qui croit encore aux contes de fées.",
    description: "Van Cleef & Arpels Féerie EDP est un parfum féminin qui porte en lui tout le raffinement et la magie de la grande joaillerie parisienne. Lancé en 2008, il s'inspire de l'univers des fées — cher à la maison Van Cleef & Arpels depuis ses collections de bijoux emblématiques — pour créer une fragrance à la fois lumineuse, délicate et profondément envoûtante.\n\nL'ouverture est d'une fraîcheur florale enchantée : fleur de pommier délicate et légèrement fruitée, pivoine rose poudré et bergamote lumineuse créent une entrée florale-fruitée d'une douceur féerique. C'est une tête qui respire la magie et la légèreté — comme une brise printanière chargée de pétales.\n\nLe cœur floral est d'une richesse et d'une complexité discrète : rose fraîche et délicate, freesia blanc cristallin, jasmin blanc et lis de la vallée forment un bouquet multi-floral qui s'épanouit progressivement comme un jardin enchanté s'ouvrant au soleil.\n\nLa base est la profondeur boisée qui ancre cette féerie dans le réel : patchouli soyeux et légèrement terreux, musc blanc propre et bois de cèdre léger. Ces notes boisées donnent à Féerie sa tenue solide de 8 heures et sa profondeur caractéristique. Le flacon — orné d'une fée sculptée et serti de pierres précieuses — est lui-même un bijou. En Algérie, Van Cleef Féerie est souvent offert comme cadeau de luxe pour les occasions importantes.",
    notes: {
      top: ["Fleur de Pommier", "Pivoine", "Bergamote"],
      heart: ["Rose", "Freesia", "Jasmin", "Muguet"],
      base: ["Patchouli", "Musc Blanc", "Cèdre"]
    },
    occasions: ["Soirée", "Mariage", "Cadeau"],
    seasons: ["Printemps", "Automne"],
    longevity: 4,
    sillage: 3,
    image: "/images/products/van-cleef-feerie.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["miss-dior", "chloe-signature", "born-in-roma-valentino"],
    h1: "Van Cleef Arpels Féerie Parfum Femme Algérie"
  },

  // 30. Paco Rabanne Olympéa EDP — vol 170
  {
    id: "olympea-paco-rabanne",
    slug: "olympea-paco-rabanne",
    name: "Olympéa",
    brand: "Paco Rabanne",
    brandSlug: "paco-rabanne",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Ambré",
    concentration: "EDP",
    volume: "80ml",
    price: 11900,
    originalPrice: null,
    badge: null,
    shortDescription: "La déesse moderne de Paco Rabanne. Gingembre blanc, jasmin et vanille salée pour un floral ambré d'une sensualité olympique — Olympéa, la fragrance des femmes qui règnent.",
    description: "Paco Rabanne Olympéa EDP est la contrepartie féminine de l'Invictus masculin — un parfum qui célèbre la victoire, la force et la sensualité dans leur expression féminine la plus accomplie. Lancé en 2015, Olympéa s'est rapidement imposé comme l'un des parfums féminins les plus séduisants et les plus originaux de sa génération.\n\nLa composition s'articule autour d'une tension créatrice entre la fraîcheur et la chaleur, entre le floral et l'ambré. L'ouverture conjugue le mandarin vert légèrement amer avec le gingembre blanc frais et épicé pour une entrée vivifiante et originale — moderne, directe, immédiatement séduisante.\n\nLe cœur floral est d'une sensualité calculée : lis de gingembre blanc exotique, jasmin blanc discret et cashmere chaud et enveloppant créent un accord floral-ambré d'une douceur sensuelle remarquable. C'est le cœur d'Olympéa qui explique son succès : accessible mais distinctif, floral mais profond.\n\nLa base est la vraie signature du parfum : vanille salée — un accord innovant qui mêle la douceur classique de la vanille à une note légèrement minérale — bois de santal crémeux et ambre blanc chaud. Cette vanille salée donne à Olympéa son unicité absolue et explique son sillage enveloppant, légèrement sensuel, irrésistible. Tenue : 10 heures. En Algérie, Olympéa est le parfum des femmes confiantes qui assument pleinement leur féminité et leur désir de séduire.",
    notes: {
      top: ["Mandarin Vert", "Gingembre Blanc"],
      heart: ["Lis de Gingembre", "Jasmin", "Cachemire"],
      base: ["Vanille Salée", "Bois de Santal", "Ambre Blanc"]
    },
    occasions: ["Soirée", "Quotidien", "Occasions Spéciales"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 4,
    sillage: 4,
    image: "/images/products/olympea-paco-rabanne.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["invictus-paco-rabanne", "1-million-paco-rabanne", "good-girl-carolina-herrera"],
    h1: "Paco Rabanne Olympéa Parfum Femme Algérie"
  }

];

const toAdd = newProducts.filter(p => !existingSlugs.has(p.slug));
db.products.push(...toAdd);
writeFileSync('data/products.json', JSON.stringify(db, null, 2));
console.log('Produits ajoutés:', toAdd.length);
console.log('Total produits:', db.products.length);
toAdd.forEach(p => console.log(' +', p.slug, '|', p.category, '|', p.price, 'DA'));
