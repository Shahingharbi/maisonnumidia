import fs from 'fs';

const p = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

// ALL mustbeauty prices - HOMME + FEMME
const mb = [
  // === HOMME ===
  {brand:'Dolce & Gabbana', kw:['k','dolce'], not:['intense'], mb:17900},
  {brand:'Dolce & Gabbana', kw:['k','intense'], not:[], mb:18900},
  {brand:'Yves Saint Laurent', kw:['nuit','homme'], not:['parfum','bleu','electrique'], mb:16900},
  {brand:'Yves Saint Laurent', kw:['nuit','homme','parfum'], not:['bleu'], mb:18900},
  {brand:'Yves Saint Laurent', kw:['y','eau','parfum'], not:['intense'], mb:19900},
  {brand:'Yves Saint Laurent', kw:['y','le','parfum'], not:[], mb:21900},
  {brand:'Yves Saint Laurent', kw:['y'], not:['eau','le','parfum','nuit','libre','opium','mon','myslf','homme'], mb:18900},
  {brand:'Yves Saint Laurent', kw:['myslf'], not:['parfum','absolu'], mb:21900},
  {brand:'Yves Saint Laurent', kw:['homme'], not:['nuit','ultime','parfum','cologne'], mb:16900},
  {brand:'Dolce & Gabbana', kw:['one','men'], not:['intense','gold','parfum','desire'], mb:17900},
  {brand:'Dolce & Gabbana', kw:['one','men','intense'], not:['gold'], mb:18500},
  {brand:'Dolce & Gabbana', kw:['one','men','gold'], not:[], mb:24900},
  {brand:'Dolce & Gabbana', kw:['one','men','parfum'], not:['gold','intense'], mb:27900},
  {brand:'Versace', kw:['eros'], not:['flame','parfum','femme','energy','pour'], mb:19900},
  {brand:'Versace', kw:['eros','flame'], not:[], mb:19900},
  {brand:'Versace', kw:['eros','parfum'], not:['flame','femme'], mb:24600},
  {brand:'Jean Paul Gaultier', kw:['scandal','homme'], not:['intense'], mb:16900},
  {brand:'Jean Paul Gaultier', kw:['scandal','homme','intense'], not:[], mb:17900},
  {brand:'Giorgio Armani', kw:['myslf'], not:['parfum','absolu'], mb:21900},
  {brand:'Giorgio Armani', kw:['stronger','intensely'], not:[], mb:15900},
  {brand:'Giorgio Armani', kw:['stronger','absolutely'], not:[], mb:24500},
  {brand:'Giorgio Armani', kw:['stronger','parfum'], not:['intensely','absolutely'], mb:24500},
  {brand:'Paco Rabanne', kw:['invictus','victory'], not:['elixir'], mb:17900},
  {brand:'Paco Rabanne', kw:['invictus','victory','elixir'], not:[], mb:18900},
  {brand:'Paco Rabanne', kw:['invictus'], not:['victory','elixir','platinum','legend'], mb:15900},
  {brand:'Jean Paul Gaultier', kw:['male'], not:['elixir','parfum','beau'], mb:16900},
  {brand:'Jean Paul Gaultier', kw:['male','parfum'], not:['elixir'], mb:19900},
  {brand:'Jean Paul Gaultier', kw:['male','elixir'], not:[], mb:19900},
  {brand:'Jean Paul Gaultier', kw:['beau'], not:['scandal'], mb:21900},
  {brand:'Azzaro', kw:['wanted','night'], not:[], mb:18900},
  {brand:'Azzaro', kw:['wanted'], not:['night','girl'], mb:17500},
  {brand:'Paco Rabanne', kw:['million','parfum'], not:['elixir','royal','gold','lady'], mb:17900},
  {brand:'Paco Rabanne', kw:['million','elixir'], not:['lady'], mb:18900},
  {brand:'Paco Rabanne', kw:['million','royal'], not:['lady'], mb:17900},
  {brand:'Paco Rabanne', kw:['million'], not:['parfum','elixir','royal','gold','lady'], mb:15900},
  {brand:'Versace', kw:['dylan','blue'], not:['femme','turquoise','purple'], mb:18900},
  {brand:'Paco Rabanne', kw:['phantom'], not:['parfum','intense'], mb:18900},
  {brand:'Paco Rabanne', kw:['phantom','parfum'], not:['intense'], mb:21900},
  {brand:'Paco Rabanne', kw:['phantom','intense'], not:[], mb:22500},
  {brand:'Azzaro', kw:['chrome'], not:['parfum','extreme','legend','united'], mb:13900},
  {brand:'Azzaro', kw:['chrome','parfum'], not:[], mb:14900},
  {brand:'Azzaro', kw:['azzaro','pour','homme'], not:['night','intense'], mb:13000},
  {brand:'Narciso Rodriguez', kw:['him','bleu','noir'], not:['parfum'], mb:16900},
  {brand:'Dolce & Gabbana', kw:['light','blue'], not:['intense','summer','femme','forever'], mb:21900},
  {brand:'Carolina Herrera', kw:['212','men'], not:['vip','heroes','nyc'], mb:13900},
  {brand:'Giorgio Armani', kw:['code','parfum'], not:['profumo','absolu','femme'], mb:23900},
  {brand:'Giorgio Armani', kw:['acqua','gio','parfum'], not:['profondo','profumo','gioia'], mb:27900},
  {brand:'Giorgio Armani', kw:['acqua','gio','profondo'], not:[], mb:26900},
  {brand:'Giorgio Armani', kw:['acqua','gio'], not:['parfum','profondo','profumo','gioia'], mb:20900},
  {brand:'Lacoste', kw:['lacoste','homme'], not:['intense'], mb:15400},
  {brand:'Mont Blanc', kw:['explorer','ultra','blue'], not:[], mb:16600},
  {brand:'Mont Blanc', kw:['legend','red'], not:[], mb:16800},
  {brand:'Mont Blanc', kw:['legend','spirit'], not:[], mb:15000},
  {brand:'Mont Blanc', kw:['legend'], not:['spirit','red','night'], mb:16800},
  {brand:'Issey Miyake', kw:['eau','issey','homme'], not:['nuit','intense','wood','noir','solar','cedre'], mb:14900},
  {brand:'Issey Miyake', kw:['nuit','issey'], not:['bleu'], mb:19900},
  {brand:'Issey Miyake', kw:['fusion'], not:[], mb:16300},
  {brand:'Burberry', kw:['mr','burberry'], not:['indigo','element'], mb:17000},
  {brand:'Burberry', kw:['mr','burberry','indigo'], not:[], mb:17000},

  // === FEMME ===
  {brand:'Yves Saint Laurent', kw:['libre'], not:['parfum','intense','flowers','absolu','eau','berry','crush'], mb:21900},
  {brand:'Yves Saint Laurent', kw:['libre','parfum'], not:['intense','absolu','flowers','berry'], mb:23900},
  {brand:'Yves Saint Laurent', kw:['libre','intense'], not:['parfum','absolu'], mb:22900},
  {brand:'Yves Saint Laurent', kw:['mon','paris'], not:['intensement','intense'], mb:26900},
  {brand:'Yves Saint Laurent', kw:['black','opium'], not:['intense','extreme','illicit','parfum','over','glitter'], mb:19900},
  {brand:'Yves Saint Laurent', kw:['black','opium','intense'], not:['extreme'], mb:24900},
  {brand:'Lancôme', kw:['idole'], not:['nectar','power','now','peach'], mb:19900},
  {brand:'Lancôme', kw:['vie','belle'], not:['intense','iris','rose','extraordinaire'], mb:19900},
  {brand:'Lancôme', kw:['vie','belle','intense'], not:['iris'], mb:21500},
  {brand:'Lancôme', kw:['tresor','midnight','rose'], not:[], mb:20500},
  {brand:'Lancôme', kw:['nuit','tresor'], not:['parfum','intense','rouge'], mb:19900},
  {brand:'Lancôme', kw:['nuit','tresor','parfum'], not:['intense','rouge'], mb:21900},
  {brand:'Narciso Rodriguez', kw:['narciso','poudree'], not:[], mb:19900},
  {brand:'Narciso Rodriguez', kw:['narciso','ambree'], not:[], mb:24900},
  {brand:'Narciso Rodriguez', kw:['narciso','cristal'], not:[], mb:19900},
  {brand:'Narciso Rodriguez', kw:['for','her','musc','noir'], not:['rose'], mb:19100},
  {brand:'Narciso Rodriguez', kw:['for','her','musc','noir','rose'], not:[], mb:19900},
  {brand:'Narciso Rodriguez', kw:['for','her'], not:['musc','him','intense','pure','nude'], mb:19900},
  {brand:'Giorgio Armani', kw:['my','way'], not:['intense','parfum','nectar','ylang','sunny','vanilla'], mb:19900},
  {brand:'Giorgio Armani', kw:['my','way','intense'], not:[], mb:28900},
  {brand:'Giorgio Armani', kw:['my','way','parfum'], not:['intense','nectar'], mb:22900},
  {brand:'Giorgio Armani', kw:['si','passione'], not:['intense','red','musk'], mb:20900},
  {brand:'Giorgio Armani', kw:['si'], not:['passione','intense','parfum'], mb:26900},
  {brand:'Givenchy', kw:['irresistible'], not:['rose','velvet','very','nude','nectar','floral'], mb:19900},
  {brand:'Givenchy', kw:['interdit'], not:['absolu','parfum','intense'], mb:19900},
  {brand:'Givenchy', kw:['interdit','parfum'], not:['absolu','intense'], mb:17900},
  {brand:'Givenchy', kw:['very','irresistible'], not:[], mb:21900},
  {brand:'Dolce & Gabbana', kw:['only','one','intense'], not:[], mb:23900},
  {brand:'Dolce & Gabbana', kw:['only','one'], not:['intense'], mb:21900},
  {brand:'Dolce & Gabbana', kw:['the','one'], not:['men','only','gold','intense','desire'], mb:20900},
  {brand:'Dolce & Gabbana', kw:['the','one','gold'], not:['men'], mb:27900},
  {brand:'Dolce & Gabbana', kw:['devotion'], not:['intense','men'], mb:21900},
  {brand:'Dolce & Gabbana', kw:['q','dolce'], not:['intense'], mb:20900},
  {brand:'Versace', kw:['dylan','turquoise'], not:[], mb:19900},
  {brand:'Versace', kw:['dylan','purple'], not:[], mb:21900},
  {brand:'Jean Paul Gaultier', kw:['scandal'], not:['homme','parfum','intense','gold','absolu','pour'], mb:20500},
  {brand:'Jean Paul Gaultier', kw:['scandal','parfum'], not:['homme'], mb:22900},
  {brand:'Jean Paul Gaultier', kw:['belle'], not:[], mb:23900},
  {brand:'Jean Paul Gaultier', kw:['divine'], not:['parfum'], mb:20500},
  {brand:'Carolina Herrera', kw:['very','good','girl'], not:['elixir'], mb:27900},
  {brand:'Carolina Herrera', kw:['good','girl'], not:['very','blush','elixir'], mb:26900},
  {brand:'Carolina Herrera', kw:['good','girl','blush'], not:['elixir'], mb:21900},
  {brand:'Carolina Herrera', kw:['212','vip','rose'], not:['elixir'], mb:22900},
  {brand:'Paco Rabanne', kw:['lady','million'], not:['fabulous','royal','gold'], mb:18500},
  {brand:'Paco Rabanne', kw:['lady','million','royal'], not:[], mb:19900},
  {brand:'Paco Rabanne', kw:['olympea'], not:['blossom','flora','solar','parfum'], mb:17900},
  {brand:'Paco Rabanne', kw:['olympea','blossom'], not:[], mb:17900},
  {brand:'Paco Rabanne', kw:['olympea','flora'], not:[], mb:19900},
  {brand:'Paco Rabanne', kw:['fame'], not:['intense','parfum'], mb:19900},
  {brand:'Paco Rabanne', kw:['fame','intense'], not:[], mb:20900},
  {brand:'Hugo Boss', kw:['scent','her'], not:['absolute'], mb:20800},
  {brand:'Hugo Boss', kw:['alive'], not:['intense'], mb:21900},
  {brand:'Hugo Boss', kw:['alive','intense'], not:[], mb:24900},
  {brand:'Issey Miyake', kw:['eau','issey'], not:['homme','pour','intense','pivoine','solar','drop'], mb:21900},
  {brand:'Issey Miyake', kw:['drop','issey'], not:[], mb:20200},
];

const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

const changes = [];
const matched = new Set();

for (const m of mb) {
  const candidates = p.products.filter(x => x.brand === m.brand && !matched.has(x.slug));
  if (!candidates.length) continue;

  let best = null, bestScore = -1;
  for (const c of candidates) {
    const cNorm = norm(c.name);
    const allMatch = m.kw.every(kw => cNorm.includes(kw.toLowerCase()));
    if (!allMatch) continue;
    if (m.not.length && m.not.some(nk => cNorm.includes(nk.toLowerCase()))) continue;
    const score = 100 - cNorm.length;
    if (score > bestScore) { bestScore = score; best = c; }
  }

  if (best) {
    matched.add(best.slug);
    const newPrice = Math.round((m.mb - 100) / 100) * 100;
    changes.push({
      slug: best.slug, name: best.name, brand: best.brand,
      oldPrice: best.price, newPrice, mbPrice: m.mb
    });
  }
}

// Apply changes
let applied = 0;
for (const c of changes) {
  const prod = p.products.find(x => x.slug === c.slug);
  if (prod) {
    prod.price = c.newPrice;
    // If there was an originalPrice higher than new price, keep it. Otherwise null.
    if (prod.originalPrice && prod.originalPrice <= c.newPrice) {
      prod.originalPrice = null;
      prod.badge = null;
    }
    applied++;
  }
}

// Write
fs.writeFileSync('./data/products.json', JSON.stringify(p, null, 2), 'utf8');

// Report
console.log(`PRIX MIS A JOUR: ${applied} produits\n`);
changes.sort((a, b) => (b.newPrice - b.oldPrice) - (a.newPrice - a.oldPrice));
changes.forEach(c => {
  const diff = c.newPrice - c.oldPrice;
  console.log(`${diff > 0 ? '+' : ''}${diff} | ${c.brand} ${c.name} | ${c.oldPrice} -> ${c.newPrice} (MB:${c.mbPrice})`);
});

const ups = changes.filter(c => c.newPrice > c.oldPrice).length;
const downs = changes.filter(c => c.newPrice < c.oldPrice).length;
const same = changes.filter(c => c.newPrice === c.oldPrice).length;
console.log(`\nHausse: ${ups} | Baisse: ${downs} | Inchange: ${same}`);
console.log(`Produits non touches: ${p.products.length - applied}`);
