import { readFileSync, writeFileSync } from 'fs';
const p = JSON.parse(readFileSync('data/products.json', 'utf8'));
const existing = new Set(p.brands.map(b => b.slug));

const newBrands = [
  { slug: 'maison-margiela', name: 'Maison Margiela', origin: 'France', description: "Maison Margiela, fondée en 1988, est connue pour sa collection Replica. Chaque fragrance capture un souvenir précis avec une authenticité olfactive remarquable.", featured: false },
  { slug: 'roberto-cavalli', name: 'Roberto Cavalli', origin: 'Italie', description: "Roberto Cavalli incarne le glamour italien. Ses parfums reflètent une audace sensuelle avec des notes de fleurs exotiques et de bois précieux.", featured: false },
  { slug: 'salvatore-ferragamo', name: 'Salvatore Ferragamo', origin: 'Italie', description: "Salvatore Ferragamo, maison de luxe italienne fondée en 1927. Ses parfums allient élégance florentine et modernité.", featured: false },
  { slug: 'moschino', name: 'Moschino', origin: 'Italie', description: "Moschino, fondée en 1983, est connue pour son approche ludique du luxe. Ses parfums, dans des flacons originaux, cachent des compositions de grande qualité.", featured: false },
  { slug: 'escada', name: 'Escada', origin: 'Allemagne', description: "Escada est réputée pour ses parfums féminins fruités et joyeux. Chaque été apporte une nouvelle édition limitée colorée et gourmande.", featured: false },
  { slug: 'cerruti', name: 'Cerruti', origin: 'Italie', description: "Cerruti, fondée par Nino Cerruti en 1967. Son parfum iconique 1881 reste une référence des fragrances aromatiques fraîches.", featured: false },
  { slug: 'chopard', name: 'Chopard', origin: 'Suisse', description: "Chopard, maison suisse de haute joaillerie fondée en 1860. Ses parfums reflètent son savoir-faire du luxe avec des compositions précieuses.", featured: false },
  { slug: 'trussardi', name: 'Trussardi', origin: 'Italie', description: "Trussardi, maison de mode italienne fondée en 1911 à Bergame. Du cuir raffiné aux accords frais, chaque fragrance porte le style italien.", featured: false },
  { slug: 'nikos', name: 'Nikos', origin: 'France', description: "Nikos est connu pour sa ligne Sculpture. Sculpture pour Homme est devenue un classique des fragrances fraîches et aqueuses masculines.", featured: false },
  { slug: 'britney-spears', name: 'Britney Spears', origin: 'États-Unis', description: "La ligne Britney Spears, lancée en 2004 avec Curious, a redéfini la parfumerie celebrity avec des compositions florales-gourmandes accessibles.", featured: false },
  { slug: 'boucheron', name: 'Boucheron', origin: 'France', description: "Boucheron, maison de haute joaillerie parisienne fondée en 1858 Place Vendôme. Des compositions opulentes qui portent le luxe français.", featured: false },
  { slug: 'kate-spade', name: 'Kate Spade', origin: 'États-Unis', description: "Kate Spade New York, fondée en 1993, connue pour son style coloré et optimiste. Ses parfums capturent cette joie de vivre.", featured: false },
  { slug: 'afnan', name: 'Afnan', origin: 'Émirats Arabes Unis', description: "Afnan Perfumes est une référence de la parfumerie orientale accessible. Son best-seller 9PM offre des compositions riches à prix compétitifs.", featured: false },
  { slug: 'acqua-di-parma', name: 'Acqua di Parma', origin: 'Italie', description: "Acqua di Parma, fondée en 1916. Sa Colonia originale est un monument de la parfumerie, un agrume hespéridé qui a traversé plus d'un siècle.", featured: false },
  { slug: 'kilian', name: 'Kilian', origin: 'France', description: "Kilian Paris, fondée par Kilian Hennessy en 2007. Angels' Share et Love Don't Be Shy sont des icônes de la parfumerie niche contemporaine.", featured: false },
  { slug: 'initio', name: 'Initio', origin: 'France', description: "Initio Parfums Privés explore le pouvoir des phéromones. Oud for Greatness et Side Effect repoussent les limites de la parfumerie.", featured: false },
  { slug: 'frederic-malle', name: 'Frédéric Malle', origin: 'France', description: "Éditions de Parfums Frédéric Malle donne carte blanche aux plus grands nez. Portrait of a Lady et Carnal Flower sont des chefs-d'œuvre olfactifs.", featured: false },
  { slug: 'byredo', name: 'Byredo', origin: 'Suède', description: "Byredo, fondée à Stockholm en 2006. Gypsy Water et Bal d'Afrique sont des références de la parfumerie niche scandinave.", featured: false },
  { slug: 'diptyque', name: 'Diptyque', origin: 'France', description: "Diptyque, fondée à Paris en 1961. Do Son, Philosykos, Tam Dao racontent des voyages olfactifs uniques avec une qualité exceptionnelle.", featured: false },
  { slug: 'elizabeth-taylor', name: 'Elizabeth Taylor', origin: 'États-Unis', description: "Elizabeth Taylor a été pionnière de la parfumerie celebrity. White Diamonds reste l'un des parfums celebrity les plus vendus de l'histoire.", featured: false },
  { slug: 'karl-lagerfeld', name: 'Karl Lagerfeld', origin: 'France', description: "Karl Lagerfeld, le légendaire directeur artistique de Chanel. Ses parfums reflètent son sens aigu du style, élégants et reconnaissables.", featured: false },
  { slug: 'ungaro', name: 'Emanuel Ungaro', origin: 'France', description: "Emanuel Ungaro, couturier français fondé en 1965. Ses parfums capturent la sensualité de la haute couture parisienne.", featured: false },
  { slug: 'st-dupont', name: 'S.T. Dupont', origin: 'France', description: "S.T. Dupont, fondée en 1872. Ses parfums portent la même exigence de qualité que ses briquets et stylos légendaires.", featured: false },
  { slug: 'jennifer-lopez', name: 'Jennifer Lopez', origin: 'États-Unis', description: "Jennifer Lopez a lancé Glow en 2002, créant un phénomène. Une fragrance fraîche qui a inspiré toute une génération de parfums.", featured: false },
  { slug: 'beyonce', name: 'Beyoncé', origin: 'États-Unis', description: "La ligne Beyoncé, lancée en 2010 avec Heat, propose des compositions sensuelles qui capturent la confiance et le glamour.", featured: false },
  { slug: 'paris-hilton', name: 'Paris Hilton', origin: 'États-Unis', description: "Paris Hilton a lancé son premier parfum en 2004. Sa ligne de fragrances florales et fruitées est l'une des plus vendues en celebrity.", featured: false },
  { slug: 'ariana-grande', name: 'Ariana Grande', origin: 'États-Unis', description: "Ariana Grande a conquis la parfumerie avec Cloud, devenu un phénomène viral et l'un des parfums les plus vendus de sa génération.", featured: false },
  { slug: 'anna-sui', name: 'Anna Sui', origin: 'États-Unis', description: "Anna Sui mêle rock et romantisme. Ses parfums, dans leurs flacons distinctifs, proposent des compositions florales-fruitées ludiques.", featured: false },
  { slug: 'mariah-carey', name: 'Mariah Carey', origin: 'États-Unis', description: "Mariah Carey propose des parfums sensuels et glamour. Des compositions florales-orientales enveloppantes et mémorables.", featured: false },
  { slug: 'orientica', name: 'Orientica', origin: 'Émirats Arabes Unis', description: "Orientica, maison émiratie créée en 2018. Oud Saffron et Royal Amber allient tradition arabe et modernité olfactive.", featured: false },
  { slug: 'memo-paris', name: 'Memo Paris', origin: 'France', description: "Memo Paris, fondée en 2007, est une maison de parfumerie de voyage. Chaque fragrance est inspirée par une destination du monde.", featured: false },
  { slug: 'penhaligons', name: "Penhaligon's", origin: 'Royaume-Uni', description: "Penhaligon's, fondée à Londres en 1870, est la plus ancienne maison de parfumerie britannique. Fournisseur de la Cour royale.", featured: false },
  { slug: 'ex-nihilo', name: 'Ex Nihilo', origin: 'France', description: "Ex Nihilo, fondée à Paris en 2013. Cette maison niche crée des compositions audacieuses avec un concept de personnalisation unique.", featured: false },
  { slug: 'serge-lutens', name: 'Serge Lutens', origin: 'France', description: "Serge Lutens, artiste et parfumeur visionnaire. Féminité du Bois a ouvert la voie aux parfums boisés pour femme. Aucun compromis artistique.", featured: false },
  { slug: 'juliette-has-a-gun', name: 'Juliette Has a Gun', origin: 'France', description: "Juliette Has a Gun, fondée par Romano Ricci en 2005. Not a Perfume, sa création la plus célèbre, ne contient qu'une seule molécule.", featured: false },
];

let added = 0;
newBrands.forEach(b => {
  if (!existing.has(b.slug)) {
    p.brands.push(b);
    added++;
  }
});

// Fix les 9 produits avec < 3 related
const allSlugs = new Set(p.products.map(x => x.slug));
p.products.forEach(pr => {
  if (pr.related && pr.related.length < 3) {
    while (pr.related.length < 3) {
      const candidate = p.products.find(x =>
        x.category === pr.category &&
        x.slug !== pr.slug &&
        !pr.related.includes(x.slug)
      );
      if (candidate) pr.related.push(candidate.slug);
      else break;
    }
  }
});

writeFileSync('data/products.json', JSON.stringify(p, null, 2) + '\n');
console.log('✅', added, 'marques ajoutées. Total:', p.brands.length);
console.log('✅ Related < 3 corrigés');
