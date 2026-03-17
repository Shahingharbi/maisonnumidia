import { readFileSync, writeFileSync } from 'fs';

const existing = JSON.parse(readFileSync('data/keywords.json', 'utf8'));
const existingKw = new Set(existing.map(k => k.keyword));

const newEntries = [
  { keyword: "si parfum", volume: 480, kd: 14, category: "parfums-femme", type: "product", status: "pending", note: "Armani Si EDP — KD 14 GOLD", slug: null, variants: ["parfum si"] },
  { keyword: "elie saab parfum", volume: 480, kd: 17, category: "parfums-femme", type: "product", status: "pending", note: "Elie Saab Le Parfum — KD 17", slug: null, variants: ["eli saab parfum", "parfum elie saab", "elie saab le parfum"] },
  { keyword: "tresor parfum", volume: 480, kd: 17, category: "parfums-femme", type: "product", status: "pending", note: "Lancôme Trésor EDP — KD 17", slug: null, variants: ["parfum tresor", "trésor parfum", "parfum la nuit tresor"] },
  { keyword: "dior jadore parfum", volume: 480, kd: 17, category: "parfums-femme", type: "product", status: "pending", note: "Dior J'Adore EDP — KD 17", slug: null, variants: ["parfum j adore", "parfum j adore dior", "parfum jadore dior"] },
  { keyword: "parfum givenchy femme", volume: 480, kd: 16, category: "parfums-femme", type: "product", status: "pending", note: "Givenchy Irresistible ou L'Interdit — KD 16", slug: null, variants: ["givenchy parfum femme", "parfum givenchy", "parfum irrésistible"] },
  { keyword: "parfum lanvin", volume: 480, kd: 14, category: "parfums-femme", type: "product", status: "pending", note: "Lanvin Eclat d'Arpege — KD 14", slug: null, variants: ["lanvin parfum"] },
  { keyword: "marc jacobs parfum", volume: 480, kd: 19, category: "parfums-femme", type: "product", status: "pending", note: "Marc Jacobs Daisy EDP — KD 19", slug: null, variants: ["parfum marc jacob"] },
  { keyword: "nishane parfum", volume: 480, kd: 17, category: "parfums-orientaux", type: "product", status: "pending", note: "Nishane Hacivat — niche turc premium, volume interessant", slug: null, variants: [] },
  { keyword: "creed parfum", volume: 480, kd: 20, category: "parfums-homme", type: "product", status: "pending", note: "Creed Aventus — niche prestige envisageable", slug: null, variants: ["parfum creed"] },
  { keyword: "stronger with you parfum", volume: 390, kd: 13, category: "parfums-homme", type: "product", status: "pending", note: "Armani Stronger With You Intensely — KD 13 GOLD", slug: null, variants: ["parfum stronger with you"] },
  { keyword: "5eme avenue parfum", volume: 390, kd: 12, category: "parfums-femme", type: "product", status: "pending", note: "Elizabeth Arden 5th Avenue — KD 12 GOLD, tres populaire en DZ", slug: null, variants: [] },
  { keyword: "mont blanc parfum femme", volume: 390, kd: 10, category: "parfums-femme", type: "product", status: "pending", note: "Mont Blanc Lady Emblem — KD 10 JACKPOT", slug: null, variants: ["parfum mont blanc femme", "parfum mont blanc"] },
  { keyword: "jean patou parfum", volume: 390, kd: 13, category: "parfums-femme", type: "product", status: "pending", note: "Jean Patou Joy EDP — KD 13", slug: null, variants: [] },
  { keyword: "lanvin parfum femme", volume: 390, kd: 12, category: "parfums-femme", type: "product", status: "pending", note: "Lanvin Eclat ou Jeanne Lanvin — KD 12", slug: null, variants: ["lanvin parfum"] },
  { keyword: "mauboussin parfum", volume: 390, kd: 19, category: "parfums-femme", type: "product", status: "pending", note: "Mauboussin Pour Elle — KD 19", slug: null, variants: [] },
  { keyword: "parfum l interdit", volume: 390, kd: 20, category: "parfums-femme", type: "product", status: "pending", note: "Givenchy L'Interdit EDP", slug: null, variants: ["parfum interdit", "l interdit parfum", "interdit parfum", "l homme ideal parfum"] },
  { keyword: "givenchy parfum homme", volume: 390, kd: 21, category: "parfums-homme", type: "product", status: "pending", note: "Givenchy Gentleman EDP — KD 21", slug: null, variants: ["parfum givenchy homme"] },
  { keyword: "acqua di gio parfum", volume: 320, kd: 10, category: "parfums-homme", type: "product", status: "pending", note: "Armani Acqua di Gio Parfum — KD 10 JACKPOT", slug: null, variants: ["acqua di gio eau de parfum"] },
  { keyword: "la nuit de l homme le parfum", volume: 320, kd: 12, category: "parfums-homme", type: "product", status: "pending", note: "YSL La Nuit de L'Homme Le Parfum — KD 12 GOLD", slug: null, variants: [] },
  { keyword: "hugo boss parfum homme", volume: 320, kd: 13, category: "parfums-homme", type: "product", status: "done", note: "Hugo Boss Bottled — deja en catalogue", slug: "/parfums/hugo-boss-bottled", variants: ["hugo boss homme parfum", "parfum boss homme"] },
  { keyword: "layton parfums de marly", volume: 320, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Layton Parfums de Marly — niche prestige homme", slug: null, variants: ["parfums de marly layton"] },
  { keyword: "armani code parfum", volume: 480, kd: 11, category: "parfums-homme", type: "product", status: "done", note: "Armani Code — deja en catalogue", slug: "/parfums/armani-code", variants: [] },
  { keyword: "parfum numidia lezoul", volume: 480, kd: 27, category: "local-dz", type: "competitor", status: "skip", note: "CONCURRENT LOCAL ALGERIEN — 480 recherches, a surveiller", slug: null, variants: [] },
  { keyword: "emmanuelle jane parfum", volume: 390, kd: 12, category: "local-dz", type: "competitor", status: "skip", note: "Marque algerienne populaire — page alternative possible plus tard", slug: null, variants: ["emmanuel jane parfum", "parfum emmanuelle jane"] },
  { keyword: "chic parfum blida", volume: 210, kd: null, category: "local-dz", type: "competitor", status: "skip", note: "CONCURRENT DIRECT a Blida — a surveiller de pres", slug: null, variants: [] },
  { keyword: "moon parfum", volume: 390, kd: 16, category: "local-dz", type: "competitor", status: "skip", note: "Possible marque locale DZ", slug: null, variants: [] },
  { keyword: "elite parfum", volume: 390, kd: 10, category: "local-dz", type: "competitor", status: "skip", note: "Possible marque locale DZ — KD 10 mais identifier avant", slug: null, variants: [] },
  { keyword: "meilleur parfum femme", volume: 720, kd: 20, category: "blog", type: "blog", status: "pending", note: "Article blog top parfums femme 2026 — a creer", slug: null, variants: ["parfum femme les plus vendus", "le parfum le plus attirant pour femme"] },
  { keyword: "adopt parfum", volume: 480, kd: 45, category: null, type: "skip", status: "skip", note: "Modele abonnement, hors scope + KD 45", slug: null, variants: [] },
  { keyword: "victoria secret parfum", volume: 590, kd: 23, category: null, type: "skip", status: "skip", note: "Retailer US, hors catalogue", slug: null, variants: ["parfum very sexy", "very sexy parfum"] },
  { keyword: "parfum baccarat rouge", volume: 480, kd: 56, category: null, type: "skip", status: "skip", note: "KD 56 — trop competitif, MFK ultra-premium", slug: null, variants: [] },
  { keyword: "yves rocher parfum", volume: 590, kd: 23, category: null, type: "skip", status: "skip", note: "Marque non referencee", slug: null, variants: ["parfum yves rocher", "yves rocher parfum femme"] },
  { keyword: "mont blanc parfum homme", volume: 210, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Mont Blanc Legend — KD a verifier", slug: null, variants: ["parfum homme mont blanc"] },
  { keyword: "azzaro parfum homme", volume: 390, kd: 27, category: "parfums-homme", type: "product", status: "pending", note: "Azzaro Chrome ou Wanted — KD 27", slug: null, variants: ["azzaro parfum", "parfum azzaro", "parfum azzaro homme"] },
  { keyword: "parfum mon paris", volume: 590, kd: 17, category: "parfums-femme", type: "product", status: "pending", note: "YSL Mon Paris EDP — KD 17", slug: null, variants: ["mon paris parfum"] },
];

const toAdd = newEntries.filter(e => !existingKw.has(e.keyword));
const merged = [...existing, ...toAdd];
writeFileSync('data/keywords.json', JSON.stringify(merged, null, 2));

const pending = merged.filter(k => k.status === 'pending');
const done = merged.filter(k => k.status === 'done');
const skip = merged.filter(k => k.status === 'skip');
const goldPending = pending.filter(k => k.kd !== null && k.kd <= 15).sort((a,b) => b.volume - a.volume);

console.log('Nouveaux ajoutés:', toAdd.length);
console.log('Total keywords:', merged.length);
console.log('DONE:', done.length, '| PENDING:', pending.length, '| SKIP:', skip.length);
console.log('Volume total pending:', pending.reduce((s,k) => s + (k.volume || 0), 0).toLocaleString());
console.log('\nTOP GOLD (KD<=15, pending):');
goldPending.forEach(k => console.log('  KD' + k.kd + ' | vol' + k.volume + ' | ' + k.keyword));
