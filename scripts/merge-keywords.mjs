import { readFileSync, writeFileSync } from 'fs';

const existing = JSON.parse(readFileSync('data/keywords.json', 'utf8'));
const existingKw = new Set(existing.map(k => k.keyword));

const newEntries = [
  // Nouveaux produits à créer
  { keyword: "givenchy gentleman parfum", volume: 170, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Givenchy Gentleman EDP — variante confirmed", slug: null, variants: ["gentleman parfum", "parfum gentelmen"] },
  { keyword: "dior fahrenheit parfum", volume: 140, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Dior Fahrenheit — classique masculin très recherché en DZ", slug: null, variants: ["fahrenheit parfum", "parfum fahrenheit", "christian dior fahrenheit parfum", "fahrenheit dior parfum"] },
  { keyword: "paco rabanne olympea parfum", volume: 170, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Paco Rabanne Olympéa EDP", slug: null, variants: ["olympea parfum", "parfum olympea", "olympia parfum"] },
  { keyword: "calvin klein euphoria parfum", volume: 170, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "CK Euphoria — femme, volume 170", slug: null, variants: ["euphoria parfum"] },
  { keyword: "azzaro wanted parfum", volume: 140, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Azzaro Wanted EDP — demande confirmée", slug: null, variants: ["wanted parfum"] },
  { keyword: "yes i am parfum", volume: 140, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Cacharel Yes I Am — confirme la recherche parfum you/you parfum", slug: null, variants: ["parfum yes i am"] },
  { keyword: "zadig voltaire parfum", volume: 140, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Zadig & Voltaire This is Her EDP", slug: null, variants: ["zadig et voltaire parfum"] },
  { keyword: "ysl manifesto parfum", volume: 170, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "YSL Manifesto EDP", slug: null, variants: ["manifesto parfum"] },
  { keyword: "dolce gabbana the one parfum", volume: 140, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "D&G The One EDP homme — très demandé", slug: null, variants: ["dolce gabbana the one parfum", "the one parfum", "dolce gabbana parfum the one"] },
  { keyword: "rasasi hawas parfum", volume: 110, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Rasasi Hawas — oriental très populaire en DZ, à ajouter", slug: null, variants: ["hawas parfum"] },
  { keyword: "el nabil parfum", volume: 170, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "El Nabil — marque halal orientale, forte demande DZ", slug: null, variants: ["parfum el nabil"] },
  { keyword: "mugler alien parfum", volume: 140, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Mugler Alien — deja dans pending comme alien parfum", slug: null, variants: ["mugler parfum", "parfum angel"] },
  { keyword: "davidoff cool water parfum", volume: 170, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Davidoff Cool Water — classique accessible", slug: null, variants: ["cool water parfum"] },
  { keyword: "van cleef arpels parfum", volume: 170, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Van Cleef Arpege ou First — niche accessible", slug: null, variants: ["van cleef parfum"] },
  { keyword: "dior sauvage parfum concentration", volume: 140, kd: null, category: "parfums-homme", type: "product", status: "done", note: "Dior Sauvage Parfum (concentration) — variante de la page existante", slug: "/parfums/dior-sauvage", variants: ["dior sauvage parfum", "sauvage parfum", "parfum sauvage"] },
  // Opportunités blog
  { keyword: "dupe parfum", volume: 140, kd: null, category: "blog", type: "blog", status: "pending", note: "IDEE BLOG — meilleurs dupes parfums en Algerie, angle fort anti-contrefacon", slug: null, variants: ["parfum dupes", "replica parfum"] },
  { keyword: "parfum floral femme", volume: 170, kd: null, category: "blog", type: "blog", status: "pending", note: "Guide blog — parfums floraux femme populaires en DZ", slug: null, variants: ["parfums floraux femme", "parfums d ete femme", "parfum femme ete"] },
  { keyword: "parfum dubai", volume: 140, kd: null, category: "parfums-orientaux", type: "seo", status: "pending", note: "Recherche parfums style Dubai — page orientaux ou section dedicee", slug: null, variants: [] },
  { keyword: "oud parfum", volume: 110, kd: null, category: "parfums-orientaux", type: "seo", status: "pending", note: "Mot cle generique oud — cibler dans la page /parfums-orientaux", slug: null, variants: ["musc parfum", "musk parfum"] },
  // Locaux DZ interessants
  { keyword: "madawi parfum", volume: 110, kd: null, category: "local-dz", type: "competitor", status: "skip", note: "Marque orientale du Golfe, possible a referencer", slug: null, variants: [] },
  { keyword: "sultan parfum", volume: 170, kd: null, category: "local-dz", type: "competitor", status: "skip", note: "Possible marque locale DZ ou orientale", slug: null, variants: [] },
  { keyword: "must parfum algerie", volume: 110, kd: null, category: "local-dz", type: "competitor", status: "skip", note: "Must Algerie — marque locale, a surveiller", slug: null, variants: ["must algerie prix parfum", "must parfum femme"] },
  // Skip definitifs volume 170-110
  { keyword: "notino parfum", volume: 170, kd: null, category: null, type: "skip", status: "skip", note: "Concurrent e-commerce EU", slug: null, variants: [] },
  { keyword: "druni parfum", volume: 170, kd: null, category: null, type: "skip", status: "skip", note: "Chaine de parfumerie espagnole — hors scope", slug: null, variants: [] },
  { keyword: "xerjoff parfum", volume: 170, kd: null, category: null, type: "skip", status: "skip", note: "Ultra niche — prix 30 000 DA+, pas notre marche", slug: null, variants: [] },
  { keyword: "roja parfum", volume: 170, kd: null, category: null, type: "skip", status: "skip", note: "Ultra niche Roja Dove — hors budget DZ", slug: null, variants: [] },
  { keyword: "parfum smart collection", volume: 170, kd: null, category: null, type: "skip", status: "skip", note: "Copies bas de gamme — hors positionnement", slug: null, variants: ["smart parfum", "smart collection parfum", "collection smart parfum"] },
];

const toAdd = newEntries.filter(e => !existingKw.has(e.keyword));
const merged = [...existing, ...toAdd];
writeFileSync('data/keywords.json', JSON.stringify(merged, null, 2));

const pending = merged.filter(k => k.status === 'pending');
const done = merged.filter(k => k.status === 'done');
const skip = merged.filter(k => k.status === 'skip');
const products = pending.filter(k => k.type === 'product');
const blog = pending.filter(k => k.type === 'blog');

console.log('Nouveaux ajoutes:', toAdd.length);
console.log('Total keywords:', merged.length);
console.log('DONE:', done.length, '| PENDING:', pending.length, '| SKIP:', skip.length);
console.log('  dont produits a creer:', products.length);
console.log('  dont articles blog:', blog.length);
console.log('Volume total pending:', pending.reduce((s,k) => s + (k.volume || 0), 0).toLocaleString());
