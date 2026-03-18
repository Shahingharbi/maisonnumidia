import { readFileSync, writeFileSync } from 'fs';

const db = JSON.parse(readFileSync('data/products.json', 'utf8'));
const existingSlugs = new Set(db.products.map(p => p.slug));

const newProducts = [

  // 1. Guerlain Shalimar EDP 90ml
  {
    id: "guerlain-shalimar",
    slug: "guerlain-shalimar",
    name: "Shalimar",
    brand: "Guerlain",
    brandSlug: "guerlain",
    gender: "femme",
    category: "parfums-femme",
    family: "Oriental Vanillé",
    concentration: "EDP",
    volume: "90ml",
    price: 13900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le monument de la parfumerie orientale. Bergamote lumineuse, iris délicat et vanille somptueuse pour un parfum d'une profondeur et d'une féminité intemporelles.",
    description: "Guerlain Shalimar est bien plus qu'un parfum — c'est une œuvre fondatrice. Créé en 1925 par Jacques Guerlain, il est considéré comme l'un des premiers grands orientaux de l'histoire de la parfumerie et reste, un siècle plus tard, l'une des fragrances féminines les plus influentes jamais créées. Son nom s'inspire des jardins de Shalimar à Lahore, construits par l'Empereur moghol Shah Jahan pour son épouse Mumtaz — un hommage à l'amour absolu qui se ressent dans chaque vaporisation.\n\nL'ouverture de Shalimar est d'une clarté lumineuse et fraîche : bergamote calabraise d'une vivacité remarquable, citron frais légèrement acidulé et néroli blanc floral créent une tête brillante qui tranche avec la profondeur orientale de la composition. Cette ouverture lumineuse est la signature Guerlain — cette façon de commencer par la lumière avant de plonger dans la sensualité.\n\nLe cœur est d'une féminité absolue : iris poudré légèrement beurré, rose délicate et jasmin blanc crémeux forment un accord floral d'une sophistication parisienne caractéristique. Ces fleurs nobles s'associent avec une précision et une élégance qui témoignent du savoir-faire centenaire de la maison Guerlain.\n\nLa base est la signature olfactive la plus célèbre de l'histoire : vanille bourbon d'une générosité et d'une richesse extraordinaires, opoponax légèrement balsamique et résineux, benjoin doux et crémeux, et bois de santal de Mysore enveloppant. Ce fond oriental somptueux donne à Shalimar sa tenue exceptionnelle — plus de 12 heures sur la peau — et son sillage enveloppant que l'on reconnaît entre mille.\n\nEn Algérie, Guerlain Shalimar parle aux femmes qui aiment les parfums avec du caractère, de la profondeur et de l'histoire. C'est le parfum des grandes occasions — mariage, fiançailles, soirée — mais aussi le choix des femmes qui assument leur féminité orientale sans complexe. Livré en 58 wilayas avec paiement à la réception via Yalidine.",
    notes: {
      top: ["Bergamote", "Citron", "Néroli"],
      heart: ["Iris", "Rose", "Jasmin"],
      base: ["Vanille", "Opoponax", "Benjoin", "Bois de Santal"]
    },
    occasions: ["Soirée", "Occasions spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/guerlain-shalimar.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["mon-guerlain", "insolence-guerlain", "miss-dior"],
    h1: "Guerlain Shalimar Parfum Femme Algérie"
  },

  // 2. Tom Ford Black Orchid EDP 100ml
  {
    id: "tom-ford-black-orchid",
    slug: "tom-ford-black-orchid",
    name: "Black Orchid",
    brand: "Tom Ford",
    brandSlug: "tom-ford",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Oriental",
    concentration: "EDP",
    volume: "100ml",
    price: 17900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le mystère incarné par Tom Ford. Orchidée noire, truffe et patchouli profond pour un floral oriental d'une séduction sombre et inoubliable.",
    description: "Tom Ford Black Orchid est l'une des créations les plus audacieuses et les plus admirées de la parfumerie contemporaine. Lancé en 2006 comme le tout premier parfum de la marque Tom Ford, il a immédiatement imposé une vision olfactive radicalement différente — luxueuse, sombre, sensuelle, sans aucune concession à la facilité commerciale. Black Orchid reste aujourd'hui le parfum le plus représentatif de l'esthétique Tom Ford : excès assumé, matières premières opulentes, et une féminité qui n'a pas peur d'être désirée.\n\nL'ouverture est immédiatement remarquable par son originalité : truffe noire terreuse et légèrement umami, gardénia blanc capiteux, bergamote lumineuse et un accord tabac légèrement fumé créent une tête d'une complexité et d'une personnalité rares. C'est une ouverture qui divise — on l'adore ou on s'en méfie — mais elle ne laisse personne indifférent.\n\nLe cœur est le sommet de la composition : orchidée noire — note de fantaisie d'une richesse et d'une opulence presque troublantes — lotus blanc légèrement aquatique, épices orientales chaudes. Cet accord floral-épicé est d'une sensualité assumée et d'une profondeur qui s'intensifie au fil des heures sur la peau.\n\nLa base est monumentale et persistante : patchouli sombre et terreux traité avec une qualité exceptionnelle, bois de santal crémeux de Mysore, encens légèrement fumé, vétiver sec et vanille chaude. Cette base orientale profonde donne à Black Orchid une tenue extraordinaire — 12 heures ou plus — et un sillage enveloppant qui marque les esprits et les mémoires.\n\nEn Algérie, Tom Ford Black Orchid s'adresse aux femmes qui ont exploré la parfumerie et cherchent maintenant quelque chose de vraiment unique — un parfum de caractère, de nuit, d'intensité. C'est aussi le cadeau le plus marquant que l'on puisse offrir à une femme qui sait ce qu'elle veut.",
    notes: {
      top: ["Truffe noire", "Gardénia", "Bergamote", "Accord tabac"],
      heart: ["Orchidée noire", "Lotus", "Épices"],
      base: ["Patchouli", "Santal", "Encens", "Vétiver", "Vanille"]
    },
    occasions: ["Soirée", "Dîner", "Occasions spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/tom-ford-black-orchid.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["miss-dior", "lady-million-paco-rabanne", "armani-si"],
    h1: "Tom Ford Black Orchid Parfum Femme Algérie"
  },

  // 3. Baccarat Rouge 540 EDP 70ml
  {
    id: "baccarat-rouge-540",
    slug: "baccarat-rouge-540",
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    brandSlug: "maison-francis-kurkdjian",
    gender: "unisexe",
    category: "parfums-femme",
    family: "Floral Ambré",
    concentration: "EDP",
    volume: "70ml",
    price: 23500,
    originalPrice: null,
    badge: null,
    shortDescription: "Le parfum le plus copié du monde. Jasmin, safran et ambre gris pour une signature olfactive immédiatement reconnaissable — Baccarat Rouge 540 est devenu la référence absolue du luxe contemporain.",
    description: "Maison Francis Kurkdjian Baccarat Rouge 540 est peut-être le parfum qui a le plus marqué la parfumerie de niche des années 2010. Créé en 2014 par Francis Kurkdjian pour célébrer le 250e anniversaire de la cristallerie Baccarat, il est rapidement passé de création exclusive à phénomène culturel mondial — le parfum dont tout le monde parle, que tout le monde veut, et que des centaines de marques tentent d'imiter sans jamais vraiment réussir.\n\nL'accord signature de Baccarat Rouge 540 est unique et immédiatement identifiable par quiconque l'a déjà senti : une alliance entre le jasmin blanc d'une pureté florale cristalline et le safran chaud légèrement métallique, posés sur un fond d'ambre gris synthétique (ambroxan) d'une douceur enveloppante. Cet accord, d'une simplicité apparente, est en réalité le résultat d'un équilibre extrêmement précis entre matières premières d'exception.\n\nL'ouverture révèle la tension créatrice entre le jasmin léger et le safran chaud — ces deux notes se regardent, se défient et finissent par créer un accord d'une sensualité et d'une complexité remarquables. Jasmin trop présent, le parfum deviendrait conventionnel. Safran trop dominant, il deviendrait oriental classique. Francis Kurkdjian a trouvé l'équilibre parfait.\n\nLe cœur révèle la résine de sapin — légèrement boisée, un peu balsamique — qui apporte une dimension arborescente surprenante à la composition. Cette résine, en dialogue avec l'ambre gris de la base, crée une profondeur boisée-ambrée d'une texture particulière : soyeuse, enveloppante, presque comestible.\n\nLa base de musc blanc soyeux et cèdre léger ancre le tout avec subtilité. La tenue est exceptionnelle — plus de 14 heures — et le sillage est précisément calibré : présent sans être oppressant. En Algérie, Baccarat Rouge 540 est le parfum des connaisseurs qui veulent le meilleur — homme ou femme, il transcende les catégories de genre et s'impose comme une signature olfactive à part entière.",
    notes: {
      top: ["Jasmin", "Safran"],
      heart: ["Ambre gris", "Résine de sapin"],
      base: ["Musc", "Cèdre"]
    },
    occasions: ["Soirée", "Bureau", "Occasions spéciales"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 5,
    sillage: 5,
    image: "/images/products/baccarat-rouge-540.jpg",
    inStock: true,
    featured: true,
    isOriental: false,
    related: ["layton-parfums-de-marly", "miss-dior", "armani-si"],
    h1: "Baccarat Rouge 540 Parfum Mixte Algérie"
  },

  // 4. Parfums de Marly Pegasus EDP 125ml
  {
    id: "pegasus-parfums-de-marly",
    slug: "pegasus-parfums-de-marly",
    name: "Pegasus",
    brand: "Parfums de Marly",
    brandSlug: "parfums-de-marly",
    gender: "homme",
    category: "parfums-homme",
    family: "Floral Boisé",
    concentration: "EDP",
    volume: "125ml",
    price: 16900,
    originalPrice: null,
    badge: null,
    shortDescription: "L'élégance baroque de Parfums de Marly. Bergamote, héliotrope et vanille ambrée pour un masculin d'une douceur soyeuse et d'une distinction raffinée.",
    description: "Parfums de Marly Pegasus est l'une des créations les plus emblématiques de la maison française fondée en 2009 par Julien Sprecher, et sans doute le parfum masculin qui a contribué à installer la marque comme une référence de la parfumerie de niche haut de gamme. Inspiré des fastes de la cour de Versailles sous Louis XV, Pegasus porte bien son nom : comme le cheval ailé de la mythologie grecque, il s'élève au-dessus des masculins ordinaires avec une grâce et une légèreté saisissantes.\n\nL'ouverture de Pegasus est d'une fraîcheur florale remarquable : bergamote calabraise lumineuse, néroli blanc et une touche de lavande aromatique douce créent une tête fraîche et élégante qui annonce immédiatement le niveau de la composition. C'est une ouverture masculine au sens classique — propre, fraîche, légèrement florale — mais avec une richesse qui trahit la qualité des matières premières utilisées.\n\nLe cœur est le véritable joyau de Pegasus : héliotrope poudrée légèrement amandée et vanillée, jasmin blanc discret et iris poudré délicat. Cet accord floral poudré est rare dans la parfumerie masculine et donne à Pegasus son caractère distinctif — cette douceur enveloppante, presque soyeuse, qui lui vaut sa réputation de parfum consensuel de luxe.\n\nLa base confirme la richesse de la composition : ambre chaud, vanille crémeuse, cèdre de l'Atlas légèrement sec et vétiver terreux. Ce fond ambré-boisé donne à Pegasus sa tenue remarquable — 10 à 12 heures sur la peau — et son sillage doux mais persistant. C'est une base qui évolue magnifiquement au fil du temps, révélant des nuances nouvelles heure après heure.\n\nEn Algérie, Parfums de Marly Pegasus s'adresse aux hommes qui ont dépassé les masculins conventionnels et cherchent une signature olfactive plus personnelle, plus raffinée. C'est le parfum des hommes qui savent que le vrai luxe n'a pas besoin de crier.",
    notes: {
      top: ["Bergamote", "Néroli", "Lavande"],
      heart: ["Héliotrope", "Jasmin", "Iris"],
      base: ["Ambre", "Vanille", "Cèdre", "Vétiver"]
    },
    occasions: ["Bureau", "Soirée", "Occasions spéciales"],
    seasons: ["Toutes saisons"],
    longevity: 5,
    sillage: 4,
    image: "/images/products/pegasus-parfums-de-marly.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["layton-parfums-de-marly", "stronger-with-you-intensely", "acqua-di-gio-armani"],
    h1: "Parfums de Marly Pegasus Parfum Homme Algérie"
  },

  // 5. Victoria's Secret Bombshell EDP 100ml
  {
    id: "bombshell-victoria-secret",
    slug: "bombshell-victoria-secret",
    name: "Bombshell",
    brand: "Victoria's Secret",
    brandSlug: "victorias-secret",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Fruité",
    concentration: "EDP",
    volume: "100ml",
    price: 6900,
    originalPrice: null,
    badge: null,
    shortDescription: "La féminité explosive de Victoria's Secret. Fruit de la passion, pivoine et muscs blancs pour un parfum fruité-floral pétillant et joyeux — la légèreté assumée.",
    description: "Victoria's Secret Bombshell est le parfum signature de la marque américaine de lingerie de luxe, lancé en 2010 et devenu depuis l'un des floraux fruités les plus populaires aux États-Unis et dans le monde. Fidèle à l'ADN de Victoria's Secret — glamour accessible, féminité assumée, fraîcheur fruitée — Bombshell est un parfum qui met de bonne humeur dès la première vaporisation.\n\nL'ouverture est une explosion de fraîcheur fruitée tropicale : fruit de la passion exotique et légèrement acide, pivoine rose délicate et clémentine pétillante créent une tête lumineuse et joyeuse d'une accessible immédiateté. C'est une ouverture franche et directe, sans prétention, qui sent bon le printemps et la légèreté.\n\nLe cœur floral est coloré et féminin : orchidée de Shanghai légèrement crémeuse et exotique, jasmin blanc classique et fleur de cerisier délicate et légèrement poudrée. Ces floraux s'associent en un accord féminin et accessible, légèrement sucré sans tomber dans l'excès gourmand. C'est un cœur qui sent bon, simplement et honnêtement — sans complexité superflue.\n\nLa base de muscs blancs propres et soyeux associée à un bois de santal doux et crémeux donne à Bombshell sa légèreté caractéristique et sa tenue correcte de 5 à 6 heures. Ce n'est pas un parfum de grande longévité, mais ce n'est pas sa vocation — Bombshell est fait pour être porté généreusement, plusieurs fois par jour si nécessaire, profitant de son format généreux et de son prix accessible.\n\nEn Algérie, Victoria's Secret Bombshell est particulièrement apprécié des jeunes femmes qui veulent un parfum de marque reconnaissable, frais et féminin, sans l'investissement d'un floral de grande maison. C'est aussi un excellent choix pour les étés chauds algériens, sa légèreté fruitée résistant bien aux températures élevées.",
    notes: {
      top: ["Fruit de la passion", "Pivoine", "Clémentine"],
      heart: ["Orchidée de Shanghai", "Jasmin", "Fleur de cerisier"],
      base: ["Muscs blancs", "Bois de santal"]
    },
    occasions: ["Quotidien", "Printemps", "Été"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/bombshell-victoria-secret.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["miss-dior", "dolce-gabbana-light-blue", "chloe-signature"],
    h1: "Victoria's Secret Bombshell Parfum Femme Algérie"
  },

  // 6. Al Haramain Madawi EDP 100ml
  {
    id: "madawi-al-haramain",
    slug: "madawi-al-haramain",
    name: "Madawi",
    brand: "Al Haramain",
    brandSlug: "al-haramain",
    gender: "femme",
    category: "parfums-orientaux",
    family: "Oriental Fleuri",
    concentration: "EDP",
    volume: "100ml",
    price: 5500,
    originalPrice: null,
    badge: null,
    shortDescription: "La rose orientale d'Al Haramain. Pêche, rose et oud profond pour un parfum oriental fleuri d'une féminité généreuse et envoûtante — la signature féminine de la maison.",
    description: "Al Haramain Madawi est l'une des créations féminines les plus admirées de cette grande maison de parfumerie originaire des Émirats Arabes Unis, réputée dans l'ensemble du monde arabe pour la qualité de ses matières premières et l'authenticité de ses compositions orientales. Madawi, dont le nom évoque la douceur et la générosité en arabe, est un parfum qui porte bien son nom : généreux, enveloppant, d'une féminité orientale assumée et lumineuse.\n\nL'ouverture de Madawi est fruitée et lumineuse avec une chaleur immédiate : pêche veloutée légèrement sucrée, baies rouges acidulées et bergamote lumineuse créent une entrée fruitée-florale accessible et séduisante. Cette fraîcheur fruitée initiale est typique des grandes compositions orientales féminines qui savent accueillir sans agressivité avant de révéler progressivement leur profondeur.\n\nLe cœur floral est généreux et richement construit : rose de Taïf d'une qualité exceptionnelle — la rose orientale par excellence, plus profonde et plus mielleuse que la rose européenne — jasmin blanc capiteux et une présence discrète mais certaine de oud. Cet accord rose-oud est l'essence même de la parfumerie orientale féminine de luxe, et Al Haramain le traite avec la finesse qui caractérise la maison.\n\nLa base est profonde et enveloppante : musc blanc soyeux, bois de santal crémeux et ambre chaud. Cette base orientale prolonge Madawi pendant 8 à 10 heures sur la peau avec un sillage généreux mais jamais oppressant — une prouesse d'équilibre que les grandes maisons orientales maîtrisent particulièrement bien.\n\nEn Algérie, Al Haramain Madawi est idéal pour les femmes qui aiment les parfums orientaux de qualité à un prix accessible. Livré en 58 wilayas avec paiement à la réception, c'est le choix évident pour une féminité orientale authentique.",
    notes: {
      top: ["Pêche", "Baies rouges", "Bergamote"],
      heart: ["Rose", "Jasmin", "Oud"],
      base: ["Musc", "Santal", "Ambre"]
    },
    occasions: ["Soirée", "Occasions spéciales"],
    seasons: ["Automne", "Hiver"],
    longevity: 4,
    sillage: 4,
    image: "/images/products/madawi-al-haramain.jpg",
    inStock: true,
    featured: false,
    isOriental: true,
    related: ["el-nabil-musc-makkah", "rasasi-hawas", "miss-dior"],
    h1: "Al Haramain Madawi Parfum Oriental Femme Algérie"
  },

  // 7. Antonio Banderas The Secret EDT 100ml
  {
    id: "antonio-banderas-the-secret",
    slug: "antonio-banderas-the-secret",
    name: "The Secret",
    brand: "Antonio Banderas",
    brandSlug: "antonio-banderas",
    gender: "homme",
    category: "parfums-homme",
    family: "Oriental Boisé",
    concentration: "EDT",
    volume: "100ml",
    price: 3200,
    originalPrice: null,
    badge: null,
    shortDescription: "Le secret de l'élégance accessible. Menthe fraîche, géranium et cuir pour un oriental boisé masculin bien construit — Antonio Banderas livre ici un parfum au rapport qualité-prix imbattable.",
    description: "Antonio Banderas The Secret est l'un des masculins les plus populaires du segment accessible de la parfumerie, lancé en 2010 sous la licence parfums Antonio Banderas. Ce qui le distingue immédiatement de la concurrence dans sa gamme de prix, c'est la solidité de sa construction olfactive — une composition qui dépasse largement les attentes que son prix pourrait susciter.\n\nL'ouverture est fraîche et aromatique avec une belle vivacité : menthe fraîche légèrement mentholée et piquante, cardamome verte épicée et gingembre réchauffant créent une tête aromatique-épicée stimulante et attrayante. C'est une ouverture masculine directe qui capte immédiatement l'attention sans aucune complexité superflue.\n\nLe cœur est boisé et légèrement floral avec du caractère : géranium rosé légèrement vert, lavande douce classique et cèdre de Virginie sec et propre forment un accord boisé-aromatique d'une cohérence appréciable. Ce cœur donne à The Secret sa lisibilité et son accessibilité — c'est un parfum que tout le monde peut comprendre et apprécier sans initiation particulière.\n\nLa base révèle l'ambition de la composition : cuir sec et légèrement fumé, patchouli sombre et terreux, ambre chaud et enveloppant. Ce fond oriental boisé donne à The Secret une profondeur et une tenue surprenantes pour son positionnement — 6 à 7 heures sur la peau, avec un sillage discret mais persistant. Pour un parfum à ce prix, c'est une excellente performance.\n\nEn Algérie, Antonio Banderas The Secret est le choix parfait pour les hommes qui veulent un parfum de marque reconnaissable, bien construit et confortable au quotidien, sans dépenser plus de 4 000 DA. C'est aussi une excellente option de deuxième parfum pour les collections, ou un premier parfum de marque pour les plus jeunes.",
    notes: {
      top: ["Menthe", "Cardamome", "Gingembre"],
      heart: ["Géranium", "Lavande", "Cèdre de Virginie"],
      base: ["Cuir", "Patchouli", "Ambre"]
    },
    occasions: ["Quotidien", "Bureau", "Soirée"],
    seasons: ["Automne", "Hiver"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/antonio-banderas-the-secret.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["davidoff-cool-water", "nautica-voyage", "lacoste-l12-noir"],
    h1: "Antonio Banderas The Secret Parfum Homme Algérie"
  },

  // 8. Shakira Dance EDT 80ml
  {
    id: "shakira-dance",
    slug: "shakira-dance",
    name: "Dance",
    brand: "Shakira",
    brandSlug: "shakira",
    gender: "femme",
    category: "parfums-femme",
    family: "Floral Fruité",
    concentration: "EDT",
    volume: "80ml",
    price: 2700,
    originalPrice: null,
    badge: null,
    shortDescription: "La légèreté fruitée de Shakira. Mandarine, cassis et rose pour un parfum féminin pétillant et accessible — Dance invite à célébrer chaque instant avec insouciance.",
    description: "Shakira Dance est l'un des parfums féminins les plus portés dans la gamme accessible, lancé en 2010 dans la collection de la chanteuse internationale. Dans un segment souvent décevant par la qualité des formules, Dance se distingue par une composition fruitée-florale sincère et plaisante — un parfum sans prétention mais construit avec honnêteté.\n\nL'ouverture est fraîche, fruitée et immédiatement agréable : mandarine pétillante légèrement sucrée, cassis noir légèrement acidulé et fraise des bois délicatement sucrée forment une tête fruitée lumineuse et accessible. C'est une ouverture typique des floraux fruités féminins grand public — directe, plaisante, sans surprise, mais efficace pour ce qu'elle veut faire.\n\nLe cœur floral est délicat et fémininin : rose fraîche et délicate, pivoine rose légèrement crémeuse et magnolia blanc doux composent un accord floral facile à porter et universellement apprécié. Ces floraux s'enchaînent naturellement après l'ouverture fruitée, maintenant la légèreté et la fraîcheur de l'ensemble.\n\nLa base de musc blanc propre et bois ambrés légers apporte une douceur enveloppante et soyeuse qui prolonge le parfum 5 à 6 heures avec un sillage léger. C'est une base discrète qui ne cherche pas à alourdir la composition — Dance reste léger du début à la fin, fidèle à son nom et à l'image de légèreté qu'il incarne.\n\nEn Algérie, Shakira Dance est le choix idéal pour les adolescentes qui découvrent la parfumerie de marque, pour les femmes qui veulent un parfum de tous les jours sans investissement important, ou comme cadeau accessible et bien reçu. Son prix est parmi les plus accessibles de la sélection Maison Numidia, livré dans les 58 wilayas avec paiement à la réception.",
    notes: {
      top: ["Mandarine", "Cassis", "Fraise des bois"],
      heart: ["Rose", "Pivoine", "Magnolia"],
      base: ["Musc blanc", "Bois ambrés"]
    },
    occasions: ["Quotidien", "Soirée"],
    seasons: ["Printemps", "Été"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/shakira-dance.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["dolce-gabbana-light-blue", "amor-amor-cacharel", "miu-miu-l-eau"],
    h1: "Shakira Dance Parfum Femme Algérie"
  },

  // 9. Pierre Cardin Pour Monsieur EDT 75ml
  {
    id: "pierre-cardin-pour-monsieur",
    slug: "pierre-cardin-pour-monsieur",
    name: "Pour Monsieur",
    brand: "Pierre Cardin",
    brandSlug: "pierre-cardin",
    gender: "homme",
    category: "parfums-homme",
    family: "Fougère Chypré",
    concentration: "EDT",
    volume: "75ml",
    price: 2900,
    originalPrice: null,
    badge: null,
    shortDescription: "Le classique français accessible. Bergamote, géranium et mousse de chêne pour un fougère chypré intemporel — Pierre Cardin Pour Monsieur, l'élégance à la française sans concession au prix.",
    description: "Pierre Cardin Pour Monsieur est un parfum masculin classique qui appartient à cette catégorie de fragrances françaises intemporelles — des compositions sobres, bien construites, qui n'ont pas besoin de marketing agressif pour convaincre. Inspiré de la tradition des grands fougères chyprés du XXe siècle, Pour Monsieur incarne une vision de la masculinité française qui privilégie l'élégance discrète à l'ostentation.\n\nL'ouverture est propre, fraîche et légèrement aromatique : bergamote calabraise lumineuse, citron frais et menthe verte légèrement mentholée créent une tête classique des fougères masculins — fraîche, propre, reconnaissable. C'est une ouverture qui sent le soin, la propreté et une certaine idée de l'élégance quotidienne.\n\nLe cœur est aromatique et légèrement herbacé : géranium vert légèrement rosé, romarin aromatique légèrement camphré et vétiver terreux sec forment un accord aromatique-boisé d'une solidité et d'une cohérence appréciables. Ce cœur donne à Pour Monsieur son caractère masculin classique — pas de fioritures, pas de tendances, juste une composition qui fonctionne et qui a fait ses preuves.\n\nLa base est la signature du chypré : mousse de chêne légèrement terreuse et musquée, musc blanc propre et ambre doux. Ce fond chypré donne à Pour Monsieur sa tenue correcte — 5 à 6 heures — et ce caractère particulier, légèrement naturel et boisé, qui définit les grands classiques de la parfumerie masculine française.\n\nEn Algérie, Pierre Cardin Pour Monsieur s'adresse aux hommes qui cherchent un parfum fiable, bien construit et discret pour le quotidien ou le bureau — sans dépenser une fortune. C'est aussi le parfum de ceux qui aiment les classiques et refusent les fragrances trop sucrées ou trop tendance du marché actuel.",
    notes: {
      top: ["Bergamote", "Citron", "Menthe"],
      heart: ["Géranium", "Romarin", "Vétiver"],
      base: ["Mousse de chêne", "Musc", "Ambre"]
    },
    occasions: ["Quotidien", "Bureau"],
    seasons: ["Printemps", "Été", "Automne"],
    longevity: 3,
    sillage: 2,
    image: "/images/products/pierre-cardin-pour-monsieur.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["davidoff-cool-water", "nautica-voyage", "drakkar-noir-guy-laroche"],
    h1: "Pierre Cardin Pour Monsieur Parfum Homme Algérie"
  },

  // 10. Evaflor Whisky Silver EDT 100ml
  {
    id: "whisky-silver-evaflor",
    slug: "whisky-silver-evaflor",
    name: "Whisky Silver",
    brand: "Evaflor",
    brandSlug: "evaflor",
    gender: "homme",
    category: "parfums-homme",
    family: "Fougère Boisé",
    concentration: "EDT",
    volume: "100ml",
    price: 2500,
    originalPrice: null,
    badge: null,
    shortDescription: "L'accessible par excellence. Bergamote, lavande et mousse de chêne pour un fougère boisé propre et fiable — Whisky Silver d'Evaflor, le quotidien sans compromis.",
    description: "Evaflor Whisky Silver est le parfum masculin de la marque française Evaflor, une maison de parfumerie populaire qui a su construire depuis des décennies une réputation de sérieux et de fiabilité dans le segment accessible. Whisky Silver — à ne pas confondre avec Whisky Gold, son frère plus chaleureux — représente la version fraîche et boisée de la gamme, construite autour d'un accord fougère classique.\n\nL'ouverture est fraîche et aromatique sans surprise : bergamote lumineuse, citron frais légèrement acidulé et romarin aromatique créent une tête propre et classique qui s'inscrit dans la grande tradition des fougères masculins français. C'est une entrée directe, sans prétention, qui annonce clairement la direction de la composition.\n\nLe cœur est aromatique et légèrement floral avec de la cohérence : lavande douce de Provence légèrement aromatique, épices discrètes légèrement réchauffantes et cèdre sec. Cet accord lavande-épices-cèdre est l'architecture classique des fougères masculins — éprouvée, fonctionnelle, agréable. C'est un cœur qui sent propre et masculin sans être banal.\n\nLa base fougère-boisée est solide et rassurante : mousse de chêne légèrement terreuse et musquée, bois de santal crémeux et musc blanc propre. Ce fond donne à Whisky Silver sa tenue honnête de 5 à 6 heures et ce caractère boisé-propre qui est sa signature. La projection est modérée — un parfum de présence discrète plutôt que de sillage affirmé.\n\nEn Algérie, Evaflor Whisky Silver est le choix pragmatique et intelligent : un parfum fiable, bien construit pour son prix, idéal au quotidien ou au bureau pour les hommes qui ne veulent pas se soucier de leur parfum mais veulent quand même sentir bon. Son prix est parmi les plus bas de la sélection Maison Numidia, ce qui en fait un incontournable de l'entrée de gamme masculine.",
    notes: {
      top: ["Bergamote", "Citron", "Romarin"],
      heart: ["Lavande", "Épices", "Cèdre"],
      base: ["Mousse de chêne", "Bois de santal", "Musc"]
    },
    occasions: ["Quotidien", "Bureau"],
    seasons: ["Automne", "Hiver", "Printemps"],
    longevity: 3,
    sillage: 3,
    image: "/images/products/whisky-silver-evaflor.jpg",
    inStock: true,
    featured: false,
    isOriental: false,
    related: ["davidoff-cool-water", "drakkar-noir-guy-laroche", "nautica-voyage"],
    h1: "Whisky Silver Parfum Homme Algérie"
  }

];

const toAdd = newProducts.filter(p => !existingSlugs.has(p.slug));
db.products.push(...toAdd);
writeFileSync('data/products.json', JSON.stringify(db, null, 2));
console.log('Produits ajoutés:', toAdd.length);
console.log('Total produits:', db.products.length);
toAdd.forEach(p => console.log(' +', p.slug, '|', p.category, '|', p.price, 'DA'));
