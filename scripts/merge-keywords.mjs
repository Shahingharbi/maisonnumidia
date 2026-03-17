import { readFileSync, writeFileSync } from 'fs';

const existing = JSON.parse(readFileSync('data/keywords.json', 'utf8'));
const existingKw = new Set(existing.map(k => k.keyword));

const newEntries = [
  // ── BATCH 4 — volumes 110-70 ──────────────────────────────────────────────

  // Nouveaux produits homme (vol 110)
  { keyword: "parfum bvlgari pour homme", volume: 110, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Bvlgari Pour Homme EDT — classique masculin frais", slug: null, variants: ["bvlgari parfum", "bulgari parfum homme"] },
  { keyword: "parfum declaration cartier", volume: 110, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Cartier Déclaration EDT — très reconnaissable en DZ", slug: null, variants: ["declaration cartier parfum", "parfum declaration cartier homme"] },
  { keyword: "parfum habit rouge", volume: 110, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Guerlain Habit Rouge EDP — classique guerlain masculin oriental", slug: null, variants: ["habit rouge parfum", "guerlain habit rouge"] },
  { keyword: "parfum lacoste noir", volume: 110, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Lacoste Noir Intense — masculin boisé populaire", slug: null, variants: ["lacoste noir parfum"] },
  { keyword: "parfum nautica voyage", volume: 110, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Nautica Voyage EDT — frais aquatique, très accessible en DZ", slug: null, variants: ["nautica voyage parfum", "voyage parfum"] },
  { keyword: "parfum spicebomb", volume: 110, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Viktor & Rolf Spicebomb EDT — masculin épicé-boisé, très demandé", slug: null, variants: ["spicebomb viktor rolf", "parfum viktor rolf homme"] },
  { keyword: "parfum ultra male", volume: 110, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "JPG Ultra Male EDT — version sucrée du Le Male, populaire jeunes DZ", slug: null, variants: ["ultra male parfum", "jean paul gaultier ultra male"] },
  { keyword: "parfum drakkar noir", volume: 90, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Guy Laroche Drakkar Noir EDT — grand classique masculin, forte nostalgie DZ", slug: null, variants: ["drakkar noir parfum", "drakkar parfum"] },
  { keyword: "azzaro chrome parfum", volume: 90, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Azzaro Chrome EDT — frais aquatique, accessible, très connu", slug: null, variants: ["chrome azzaro parfum", "azzaro chrome eau de toilette"] },
  { keyword: "l homme ideal eau de parfum", volume: 90, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Guerlain L'Homme Idéal EDP — boisé-gourmand, cible les 25-40 ans DZ", slug: null, variants: ["guerlain l homme ideal", "l homme ideal parfum"] },
  { keyword: "le beau parfum", volume: 90, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "JPG Le Beau EDP — masculin coconut-boisé, populaire été", slug: null, variants: ["le beau jean paul gaultier", "parfum le beau homme"] },
  { keyword: "parfum boss bottled", volume: 90, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Hugo Boss Bottled Night EDP — boisé profond, très reconnu", slug: null, variants: ["boss bottled parfum", "hugo boss bottled"] },
  { keyword: "parfum guess homme", volume: 90, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Guess Seductive Homme EDT — accessible, populaire en DZ", slug: null, variants: ["guess seductive parfum", "guess parfum homme"] },

  // Nouveaux produits femme (vol 110)
  { keyword: "parfum dior poison", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Dior Poison EDP — classique culte femme, forte recherche DZ", slug: null, variants: ["poison dior parfum", "dior poison rouge"] },
  { keyword: "parfum hypnotic poison", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Dior Hypnotic Poison EDT — boisé-vanillé-cerise, reconnaissable", slug: null, variants: ["hypnotic poison dior", "hypnotic poison parfum"] },
  { keyword: "parfum insolence", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Guerlain Insolence EDP — violet-rose-boisé, très apprécié femme", slug: null, variants: ["guerlain insolence", "insolence guerlain parfum"] },
  { keyword: "parfum kenzo flower", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Kenzo Flower by Kenzo EDP — floral-vanillé, grande popularité DZ", slug: null, variants: ["flower kenzo parfum", "kenzo flower parfum"] },
  { keyword: "parfum la belle", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "JPG La Belle EDP — floral-vanillé, pendant féminin de Le Male", slug: null, variants: ["jean paul gaultier la belle", "la belle parfum"] },
  { keyword: "parfum lady million", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Paco Rabanne Lady Million EDP — floral-miel, iconique femme DZ", slug: null, variants: ["lady million parfum", "lady million paco rabanne"] },
  { keyword: "parfum lancome tresor", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Lancôme Trésor EDP — variante keyword de tresor parfum déjà en pending", slug: null, variants: ["tresor lancome parfum", "lancome tresor eau de parfum"] },
  { keyword: "parfum organza", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Givenchy Organza EDP — floral oriental grand flacon, nostalgique", slug: null, variants: ["givenchy organza", "organza givenchy parfum"] },
  { keyword: "parfum flora gucci", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Gucci Flora Gorgeous Gardenia EDP — floral printanier, fort volume DZ", slug: null, variants: ["flora gucci parfum", "gucci flora parfum", "flora gorgeous gardenia"] },
  { keyword: "parfum femme michael kors", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Michael Kors Gold EDP — blanc fleuri-ambre, accessible premium", slug: null, variants: ["michael kors parfum femme", "michael kors gold parfum"] },
  { keyword: "parfum femme ralph lauren", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Ralph Lauren Romance EDP — rose-musc, classique accessible femme", slug: null, variants: ["ralph lauren romance", "ralph laurent parfum femme"] },
  { keyword: "parfum gris montaigne", volume: 110, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Dior Gris Montaigne EDP — floral poudré discret, cible CSP+", slug: null, variants: ["gris montaigne dior", "gris montaigne parfum"] },
  { keyword: "eau de parfum mon guerlain", volume: 90, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Guerlain Mon Guerlain EDP — lavande-vanille, très féminin doux", slug: null, variants: ["mon guerlain parfum", "guerlain mon guerlain"] },
  { keyword: "parfum amor amor", volume: 90, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Cacharel Amor Amor EDT — floral-fruité jeune, prix accessible", slug: null, variants: ["amor amor cacharel", "amor amor parfum"] },
  { keyword: "parfum bonbon", volume: 90, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Viktor & Rolf Flowerbomb Bonbon EDP — caramel-floral, très féminin", slug: null, variants: ["flowerbomb bonbon", "bonbon viktor rolf"] },
  { keyword: "parfum carolina herrera", volume: 90, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Carolina Herrera 212 ou Very Good Girl EDP — populaire jeune femme DZ", slug: null, variants: ["carolina herrera 212 parfum", "very good girl parfum"] },
  { keyword: "parfum miu miu", volume: 90, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Miu Miu EDP — floral-délicat, niche accessible", slug: null, variants: ["miu miu eau de parfum"] },
  { keyword: "parfum mademoiselle rochas", volume: 90, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Rochas Mademoiselle EDP — floral léger accessible", slug: null, variants: ["mademoiselle rochas parfum", "rochas mademoiselle"] },
  { keyword: "parfum la parisienne", volume: 90, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "YSL La Parisienne EDP — produit distinct de Libre, rose-bois", slug: null, variants: ["ysl la parisienne", "la parisienne ysl parfum"] },
  { keyword: "ange et demon parfum", volume: 70, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Givenchy Ange ou Démon EDP — floral-blanc-boisé, très reconnu DZ", slug: null, variants: ["ange ou demon parfum", "givenchy ange demon"] },
  { keyword: "givenchy irresistible eau de parfum", volume: 70, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Givenchy Irrésistible EDP — rose-ambre-boisé, récent et populaire", slug: null, variants: ["irresistible givenchy parfum"] },
  { keyword: "goddess parfum", volume: 70, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Burberry Goddess EDP — vanille-lavande-boisé, très tendance 2024", slug: null, variants: ["burberry goddess", "parfum goddess burberry"] },

  // Issey Miyake (mixte, ranger homme)
  { keyword: "issey miyake parfum", volume: 90, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Issey Miyake L'Eau d'Issey Pour Homme EDT — aquatique frais iconique", slug: null, variants: ["l eau d issey parfum", "issey miyake homme"] },

  // Blog articles
  { keyword: "comment reconnaître un parfum original", volume: 70, kd: null, category: "blog", type: "blog", status: "pending", note: "BLOG authenticité — guide pratique: code barre, hologramme, qualité bouchon. Angle fort anti-contrefaçon DZ", slug: null, variants: ["code barre parfum original", "parfum original ou contrefaçon", "verifier parfum original"] },
  { keyword: "parfum poudré femme", volume: 110, kd: null, category: "blog", type: "blog", status: "pending", note: "BLOG guide — les meilleurs parfums poudrés femme, angle olfactif + sélection produits", slug: null, variants: ["parfum poudré pour femme", "parfum vanillé femme"] },
  { keyword: "parfum d ete femme guide", volume: 110, kd: null, category: "blog", type: "blog", status: "pending", note: "BLOG saisonnier — sélection parfums d'été femme/homme pour l'Algérie (chaleur = longévité cruciale)", slug: null, variants: ["parfum ete homme", "parfum d ete", "parfum pour l ete homme"] },

  // Skip définitifs (vol 110-90)
  { keyword: "parfum sephora", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "Sephora — retailer concurrent, hors scope", slug: null, variants: [] },
  { keyword: "parfum jumia", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "Jumia — marketplace concurrent, hors scope", slug: null, variants: [] },
  { keyword: "parfum la rive", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "La Rive — copies bas de gamme, hors positionnement", slug: null, variants: [] },
  { keyword: "parfum men in black", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "Men in Black — marque bas de gamme", slug: null, variants: [] },
  { keyword: "parfums de marly pegasus", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "PDM Pegasus — ultra niche 20 000 DA+, hors budget DZ", slug: null, variants: ["pegasus parfum de marly"] },
  { keyword: "pierre cardin parfum", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "Pierre Cardin — marque bas de gamme, hors positionnement", slug: null, variants: [] },
  { keyword: "arvea parfum", volume: 90, kd: null, category: null, type: "skip", status: "skip", note: "Arvea — MLM local algérien, hors scope", slug: null, variants: [] },
  { keyword: "numidia lezoul parfum", volume: 90, kd: null, category: null, type: "skip", status: "skip", note: "Numidia Lezoul — concurrent DZ avec nom similaire au nôtre, surveiller", slug: null, variants: [] },
  { keyword: "parfum victoria secret bombshell", volume: 90, kd: null, category: null, type: "skip", status: "skip", note: "Victoria's Secret — hors scope positionnement", slug: null, variants: [] },
  { keyword: "antonio banderas parfum homme", volume: 90, kd: null, category: null, type: "skip", status: "skip", note: "Antonio Banderas — celebrity bas de gamme, hors positionnement", slug: null, variants: [] },
  { keyword: "shakira parfum", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "Shakira — celebrity bas de gamme, hors positionnement", slug: null, variants: [] },
  { keyword: "whisky silver parfum", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "Whisky Silver — marque vieillissante, hors positionnement", slug: null, variants: ["parfum whisky silver"] },
  { keyword: "zara rose parfum", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "Zara — fast fashion, pas notre positionnement", slug: null, variants: ["parfum zara rose", "zara wonder rose parfum"] },
  { keyword: "primor parfum", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "Primor — chaîne parfumerie espagnole, hors scope", slug: null, variants: [] },
  { keyword: "rolex parfum", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "Rolex — marque horlogerie sans lien parfum, hors scope", slug: null, variants: [] },
  { keyword: "sephora france parfum", volume: 110, kd: null, category: null, type: "skip", status: "skip", note: "Sephora France — retailer EU, hors scope", slug: null, variants: [] },
  { keyword: "smart collection parfum homme", volume: 90, kd: null, category: null, type: "skip", status: "skip", note: "Smart Collection — copies bas de gamme, hors positionnement", slug: null, variants: ["parfum smart homme"] },
];

const toAdd = newEntries.filter(e => !existingKw.has(e.keyword));
const merged = [...existing, ...toAdd];
writeFileSync('data/keywords.json', JSON.stringify(merged, null, 2));

const pending = merged.filter(k => k.status === 'pending');
const done = merged.filter(k => k.status === 'done');
const skip = merged.filter(k => k.status === 'skip');
const products = pending.filter(k => k.type === 'product');
const blog = pending.filter(k => k.type === 'blog');

console.log('Nouveaux ajoutés:', toAdd.length);
console.log('Total keywords:', merged.length);
console.log('DONE:', done.length, '| PENDING:', pending.length, '| SKIP:', skip.length);
console.log('  dont produits à créer:', products.length);
console.log('  dont articles blog:', blog.length);
console.log('Volume total pending:', pending.reduce((s,k) => s + (k.volume || 0), 0).toLocaleString());
