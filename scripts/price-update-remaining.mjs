import fs from 'fs';

const p = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

// Slugs already updated by mustbeauty matching - DON'T TOUCH
const alreadyUpdated = new Set([
  // From the 68 matched products (extracted from previous run)
]);

// First, identify which products were already at MB prices
// by checking which products have prices ending in 800 (MB-100) pattern
// from our previous script. Better: re-run matching to get slugs.
const mbMatched = new Set();
const mbRules = [
  {brand:'Versace', kw:['eros'], not:['flame','parfum','femme','energy','pour']},
  {brand:'Versace', kw:['dylan','blue'], not:['femme','turquoise','purple']},
  {brand:'Versace', kw:['eros','flame'], not:[]},
  {brand:'Versace', kw:['eros','parfum'], not:['flame','femme']},
  {brand:'Versace', kw:['dylan','turquoise'], not:[]},
  {brand:'Versace', kw:['dylan','purple'], not:[]},
  {brand:'Paco Rabanne', kw:['invictus'], not:['victory','elixir','platinum','legend']},
  {brand:'Paco Rabanne', kw:['invictus','victory'], not:['elixir']},
  {brand:'Paco Rabanne', kw:['invictus','victory','elixir'], not:[]},
  {brand:'Paco Rabanne', kw:['million'], not:['parfum','elixir','royal','gold','lady']},
  {brand:'Paco Rabanne', kw:['million','parfum'], not:['elixir','royal','gold','lady']},
  {brand:'Paco Rabanne', kw:['million','elixir'], not:['lady']},
  {brand:'Paco Rabanne', kw:['million','royal'], not:['lady']},
  {brand:'Paco Rabanne', kw:['phantom'], not:['parfum','intense']},
  {brand:'Paco Rabanne', kw:['phantom','parfum'], not:['intense']},
  {brand:'Paco Rabanne', kw:['phantom','intense'], not:[]},
  {brand:'Paco Rabanne', kw:['lady','million'], not:['fabulous','royal','gold']},
  {brand:'Paco Rabanne', kw:['lady','million','royal'], not:[]},
  {brand:'Paco Rabanne', kw:['olympea'], not:['blossom','flora','solar','parfum']},
  {brand:'Paco Rabanne', kw:['olympea','blossom'], not:[]},
  {brand:'Paco Rabanne', kw:['olympea','flora'], not:[]},
  {brand:'Paco Rabanne', kw:['fame'], not:['intense','parfum']},
  {brand:'Paco Rabanne', kw:['fame','intense'], not:[]},
  {brand:'Jean Paul Gaultier', kw:['male'], not:['elixir','parfum','beau']},
  {brand:'Jean Paul Gaultier', kw:['male','parfum'], not:['elixir']},
  {brand:'Jean Paul Gaultier', kw:['male','elixir'], not:[]},
  {brand:'Jean Paul Gaultier', kw:['beau'], not:['scandal']},
  {brand:'Jean Paul Gaultier', kw:['scandal','homme'], not:['intense']},
  {brand:'Jean Paul Gaultier', kw:['scandal','homme','intense'], not:[]},
  {brand:'Jean Paul Gaultier', kw:['scandal'], not:['homme','parfum','intense','gold','absolu','pour']},
  {brand:'Jean Paul Gaultier', kw:['scandal','parfum'], not:['homme']},
  {brand:'Jean Paul Gaultier', kw:['belle'], not:[]},
  {brand:'Jean Paul Gaultier', kw:['divine'], not:['parfum']},
  {brand:'Yves Saint Laurent', kw:['nuit','homme'], not:['parfum','bleu','electrique']},
  {brand:'Yves Saint Laurent', kw:['nuit','homme','parfum'], not:['bleu']},
  {brand:'Yves Saint Laurent', kw:['y'], not:['eau','le','parfum','nuit','libre','opium','mon','myslf','homme']},
  {brand:'Yves Saint Laurent', kw:['y','eau','parfum'], not:['intense']},
  {brand:'Yves Saint Laurent', kw:['y','le','parfum'], not:[]},
  {brand:'Yves Saint Laurent', kw:['myslf'], not:['parfum','absolu']},
  {brand:'Yves Saint Laurent', kw:['homme'], not:['nuit','ultime','parfum','cologne']},
  {brand:'Yves Saint Laurent', kw:['libre'], not:['parfum','intense','flowers','absolu','eau','berry','crush']},
  {brand:'Yves Saint Laurent', kw:['libre','parfum'], not:['intense','absolu','flowers','berry']},
  {brand:'Yves Saint Laurent', kw:['libre','intense'], not:['parfum','absolu']},
  {brand:'Yves Saint Laurent', kw:['mon','paris'], not:['intensement','intense']},
  {brand:'Yves Saint Laurent', kw:['black','opium'], not:['intense','extreme','illicit','parfum','over','glitter']},
  {brand:'Yves Saint Laurent', kw:['black','opium','intense'], not:['extreme']},
  {brand:'Dolce & Gabbana', kw:['one','men'], not:['intense','gold','parfum','desire']},
  {brand:'Dolce & Gabbana', kw:['one','men','intense'], not:['gold']},
  {brand:'Dolce & Gabbana', kw:['one','men','gold'], not:[]},
  {brand:'Dolce & Gabbana', kw:['one','men','parfum'], not:['gold','intense']},
  {brand:'Dolce & Gabbana', kw:['k','dolce'], not:['intense']},
  {brand:'Dolce & Gabbana', kw:['k','intense'], not:[]},
  {brand:'Dolce & Gabbana', kw:['light','blue'], not:['intense','summer','femme','forever']},
  {brand:'Dolce & Gabbana', kw:['only','one'], not:['intense']},
  {brand:'Dolce & Gabbana', kw:['only','one','intense'], not:[]},
  {brand:'Dolce & Gabbana', kw:['the','one'], not:['men','only','gold','intense','desire']},
  {brand:'Dolce & Gabbana', kw:['the','one','gold'], not:['men']},
  {brand:'Dolce & Gabbana', kw:['devotion'], not:['intense','men']},
  {brand:'Dolce & Gabbana', kw:['q','dolce'], not:['intense']},
  {brand:'Azzaro', kw:['wanted','night'], not:[]},
  {brand:'Azzaro', kw:['wanted'], not:['night','girl']},
  {brand:'Azzaro', kw:['chrome'], not:['parfum','extreme','legend','united']},
  {brand:'Azzaro', kw:['chrome','parfum'], not:[]},
  {brand:'Azzaro', kw:['azzaro','pour','homme'], not:['night','intense']},
  {brand:'Giorgio Armani', kw:['acqua','gio','parfum'], not:['profondo','profumo','gioia']},
  {brand:'Giorgio Armani', kw:['acqua','gio','profondo'], not:[]},
  {brand:'Giorgio Armani', kw:['acqua','gio'], not:['parfum','profondo','profumo','gioia']},
  {brand:'Giorgio Armani', kw:['stronger','intensely'], not:[]},
  {brand:'Giorgio Armani', kw:['stronger','absolutely'], not:[]},
  {brand:'Giorgio Armani', kw:['stronger','parfum'], not:['intensely','absolutely']},
  {brand:'Giorgio Armani', kw:['code','parfum'], not:['profumo','absolu','femme']},
  {brand:'Giorgio Armani', kw:['myslf'], not:['parfum','absolu']},
  {brand:'Giorgio Armani', kw:['my','way'], not:['intense','parfum','nectar','ylang','sunny','vanilla']},
  {brand:'Giorgio Armani', kw:['my','way','intense'], not:[]},
  {brand:'Giorgio Armani', kw:['my','way','parfum'], not:['intense','nectar']},
  {brand:'Giorgio Armani', kw:['si','passione'], not:['intense','red','musk']},
  {brand:'Giorgio Armani', kw:['si'], not:['passione','intense','parfum']},
  {brand:'Narciso Rodriguez', kw:['him','bleu','noir'], not:['parfum']},
  {brand:'Narciso Rodriguez', kw:['narciso','poudree'], not:[]},
  {brand:'Narciso Rodriguez', kw:['narciso','ambree'], not:[]},
  {brand:'Narciso Rodriguez', kw:['narciso','cristal'], not:[]},
  {brand:'Narciso Rodriguez', kw:['for','her','musc','noir'], not:['rose']},
  {brand:'Narciso Rodriguez', kw:['for','her','musc','noir','rose'], not:[]},
  {brand:'Narciso Rodriguez', kw:['for','her'], not:['musc','him','intense','pure','nude']},
  {brand:'Givenchy', kw:['irresistible'], not:['rose','velvet','very','nude','nectar','floral']},
  {brand:'Givenchy', kw:['interdit'], not:['absolu','parfum','intense']},
  {brand:'Givenchy', kw:['interdit','parfum'], not:['absolu','intense']},
  {brand:'Givenchy', kw:['very','irresistible'], not:[]},
  {brand:'Lancôme', kw:['idole'], not:['nectar','power','now','peach']},
  {brand:'Lancôme', kw:['vie','belle'], not:['intense','iris','rose','extraordinaire']},
  {brand:'Lancôme', kw:['vie','belle','intense'], not:['iris']},
  {brand:'Lancôme', kw:['tresor','midnight','rose'], not:[]},
  {brand:'Lancôme', kw:['nuit','tresor'], not:['parfum','intense','rouge']},
  {brand:'Lancôme', kw:['nuit','tresor','parfum'], not:['intense','rouge']},
  {brand:'Carolina Herrera', kw:['212','men'], not:['vip','heroes','nyc']},
  {brand:'Carolina Herrera', kw:['very','good','girl'], not:['elixir']},
  {brand:'Carolina Herrera', kw:['good','girl'], not:['very','blush','elixir']},
  {brand:'Carolina Herrera', kw:['good','girl','blush'], not:['elixir']},
  {brand:'Carolina Herrera', kw:['212','vip','rose'], not:['elixir']},
  {brand:'Hugo Boss', kw:['scent','her'], not:['absolute']},
  {brand:'Hugo Boss', kw:['alive'], not:['intense']},
  {brand:'Hugo Boss', kw:['alive','intense'], not:[]},
  {brand:'Issey Miyake', kw:['eau','issey','homme'], not:['nuit','intense','wood','noir','solar','cedre']},
  {brand:'Issey Miyake', kw:['nuit','issey'], not:['bleu']},
  {brand:'Issey Miyake', kw:['fusion'], not:[]},
  {brand:'Issey Miyake', kw:['eau','issey'], not:['homme','pour','intense','pivoine','solar','drop']},
  {brand:'Issey Miyake', kw:['drop','issey'], not:[]},
  {brand:'Burberry', kw:['mr','burberry'], not:['indigo','element']},
  {brand:'Burberry', kw:['mr','burberry','indigo'], not:[]},
  {brand:'Mont Blanc', kw:['legend'], not:['spirit','red','night']},
  {brand:'Mont Blanc', kw:['legend','spirit'], not:[]},
  {brand:'Mont Blanc', kw:['legend','red'], not:[]},
  {brand:'Mont Blanc', kw:['explorer','ultra','blue'], not:[]},
  {brand:'Lacoste', kw:['lacoste','homme'], not:['intense']},
];

const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

// Find already-matched slugs
for (const m of mbRules) {
  const candidates = p.products.filter(x => x.brand === m.brand && !mbMatched.has(x.slug));
  let best = null, bestScore = -1;
  for (const c of candidates) {
    const cNorm = norm(c.name);
    const allMatch = m.kw.every(kw => cNorm.includes(kw.toLowerCase()));
    if (!allMatch) continue;
    if (m.not.length && m.not.some(nk => cNorm.includes(nk.toLowerCase()))) continue;
    const score = 100 - cNorm.length;
    if (score > bestScore) { bestScore = score; best = c; }
  }
  if (best) mbMatched.add(best.slug);
}

console.log('Produits deja alignes sur MB:', mbMatched.size);

// Brand classification
const nicheB = ['Tom Ford','Creed','Amouage','Roja Dove','Xerjoff','Maison Francis Kurkdjian','Initio','Parfums de Marly','Louis Vuitton','Memo Paris','Frédéric Malle','Byredo','Penhaligon','Clive Christian','Nishane','Tiziana Terenzi'];
const orientalB = ['Lattafa','Al Haramain','Rasasi','Ajmal','Swiss Arabian','Al Rehab','El Nabil','Afnan','Ard Al Zaafaran'];
const budgetB = ['Zara','Britney Spears','Paris Hilton','Shakira','Evaflor','Franck Olivier','Pierre Cardin','Jeanne Arthes','Jacques Bogart','Cuba','Beverly Hills Polo Club','Creation Lamis','Lomani','Remy Latour','Ulric de Varens'];

function getMultiplier(product) {
  const { brand, price, category } = product;

  // NICHE: already expensive, light touch
  if (nicheB.some(b => brand.includes(b))) {
    if (price >= 30000) return 1.10; // Creed Aventus 36000 -> 39600 (pas 54000)
    if (price >= 22000) return 1.15; // Amouage etc
    return 1.25; // Tom Ford mid-range ~17000 -> 21250
  }

  // ORIENTAL: must stay affordable, c'est leur argument de vente
  if (orientalB.some(b => brand === b)) {
    if (price <= 3000) return 1.20; // Lattafa Yara 2900 -> 3480
    if (price <= 5000) return 1.25; // Al Haramain 4500 -> 5625
    return 1.30; // Premium oriental 6500 -> 8450
  }

  // BUDGET brands: cheap = their identity, don't inflate too much
  if (budgetB.some(b => brand === b)) {
    if (price <= 3000) return 1.25;
    return 1.35;
  }

  // DIOR, CHANEL, HERMES, GUERLAIN: premium houses
  // MustBeauty sells Armani/YSL/D&G at 17-28k range
  // Dior/Chanel are typically MORE expensive than those
  // So x1.5 is justified, maybe even x1.6 for some
  const superPremium = ['Dior','Chanel','Hermès','Guerlain'];
  if (superPremium.some(b => brand === b)) {
    if (price >= 17000) return 1.35; // Already highish, don't overshoot
    if (price >= 14000) return 1.50;
    return 1.55; // Cheaper Dior/Chanel = probably way underpriced
  }

  // STANDARD premium & mid-range: x1.5 as user requested
  // This covers Prada, Bvlgari, Valentino, Hugo Boss, Kenzo,
  // Calvin Klein, Ralph Lauren, Coach, etc.
  if (price >= 14000) return 1.40; // Don't overshoot on already-highish
  if (price >= 10000) return 1.50;
  if (price >= 7000) return 1.50;
  return 1.45; // Cheap mid-range
}

let changes = 0;
const report = [];

for (const prod of p.products) {
  // Skip already matched with mustbeauty
  if (mbMatched.has(prod.slug)) continue;

  const mult = getMultiplier(prod);
  const oldPrice = prod.price;
  let newPrice = Math.round((oldPrice * mult) / 100) * 100; // Round to 100

  // Sanity checks
  // No perfume in Algeria should cost > 45000 DA
  if (newPrice > 45000) newPrice = 45000;
  // Budget brands should never exceed 8000
  if (budgetB.some(b => prod.brand === b) && newPrice > 8000) newPrice = 8000;
  // Oriental should never exceed 10000
  if (orientalB.some(b => prod.brand === b) && newPrice > 10000) newPrice = 10000;

  if (newPrice !== oldPrice) {
    prod.price = newPrice;
    if (prod.originalPrice && prod.originalPrice <= newPrice) {
      prod.originalPrice = null;
      prod.badge = null;
    }
    changes++;
    report.push({
      brand: prod.brand, name: prod.name, oldPrice, newPrice,
      mult, diff: newPrice - oldPrice
    });
  }
}

fs.writeFileSync('./data/products.json', JSON.stringify(p, null, 2), 'utf8');

// Summary by tier
console.log(`\nPRODUITS RESTANTS MIS A JOUR: ${changes}\n`);

const byTier = {};
report.forEach(r => {
  let tier = 'standard';
  if (nicheB.some(b => r.brand.includes(b))) tier = 'niche';
  else if (orientalB.some(b => r.brand === b)) tier = 'oriental';
  else if (budgetB.some(b => r.brand === b)) tier = 'budget';
  else if (['Dior','Chanel','Hermès','Guerlain'].includes(r.brand)) tier = 'super-premium';

  if (!byTier[tier]) byTier[tier] = { count: 0, examples: [] };
  byTier[tier].count++;
  if (byTier[tier].examples.length < 5) {
    byTier[tier].examples.push(`${r.brand} ${r.name}: ${r.oldPrice} -> ${r.newPrice} (x${r.mult})`);
  }
});

Object.entries(byTier).forEach(([tier, data]) => {
  console.log(`--- ${tier.toUpperCase()} (${data.count} produits) ---`);
  data.examples.forEach(e => console.log('  ' + e));
  console.log('');
});

// Final stats
const allPrices = p.products.map(x => x.price);
console.log('STATS FINALES:');
console.log('  Total produits:', p.products.length);
  console.log('  Prix min:', Math.min(...allPrices));
console.log('  Prix max:', Math.max(...allPrices));
console.log('  Prix moyen:', Math.round(allPrices.reduce((a,b)=>a+b,0)/allPrices.length));
