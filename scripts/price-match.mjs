import fs from 'fs';

const p = JSON.parse(fs.readFileSync('./data/products.json','utf8'));

// Curated matches - only CONFIRMED same products
const confirmed = [
  // Versace
  {brand:'Versace', kw:['eros'], not:['flame','parfum','femme','energy'], mb:19900},
  {brand:'Versace', kw:['dylan','blue'], not:['femme'], mb:18900},
  {brand:'Versace', kw:['eros','flame'], not:[], mb:19900},
  {brand:'Versace', kw:['eros','parfum'], not:['flame','femme'], mb:24600},
  // Paco Rabanne
  {brand:'Paco Rabanne', kw:['invictus'], not:['victory','elixir','platinum','legend'], mb:15900},
  {brand:'Paco Rabanne', kw:['invictus','victory'], not:['elixir'], mb:17900},
  {brand:'Paco Rabanne', kw:['invictus','victory','elixir'], not:[], mb:18900},
  {brand:'Paco Rabanne', kw:['million'], not:['parfum','elixir','royal','gold','lady'], mb:15900},
  {brand:'Paco Rabanne', kw:['million','parfum'], not:['elixir','royal'], mb:17900},
  {brand:'Paco Rabanne', kw:['million','elixir'], not:[], mb:18900},
  {brand:'Paco Rabanne', kw:['phantom'], not:['parfum','intense'], mb:18900},
  {brand:'Paco Rabanne', kw:['phantom','parfum'], not:['intense'], mb:21900},
  // JPG
  {brand:'Jean Paul Gaultier', kw:['male'], not:['elixir','parfum','beau'], mb:16900},
  {brand:'Jean Paul Gaultier', kw:['male','parfum'], not:['elixir'], mb:19900},
  {brand:'Jean Paul Gaultier', kw:['scandal','homme'], not:['intense'], mb:16900},
  {brand:'Jean Paul Gaultier', kw:['beau'], not:[], mb:21900},
  // YSL
  {brand:'Yves Saint Laurent', kw:['eau','parfum'], not:['intense','le','libre','opium','mon'], mb:19900},
  {brand:'Yves Saint Laurent', kw:['le','parfum'], not:['libre','opium','mon','nuit'], mb:21900},
  {brand:'Yves Saint Laurent', kw:['nuit','homme','parfum'], not:['bleu','electrique'], mb:18900},
  {brand:'Yves Saint Laurent', kw:['myslf'], not:['parfum'], mb:21900},
  {brand:'Yves Saint Laurent', kw:['libre','parfum'], not:['intense'], mb:21900},
  // D&G
  {brand:'Dolce & Gabbana', kw:['one','men'], not:['intense','gold','parfum','desire'], mb:17900},
  {brand:'Dolce & Gabbana', kw:['one','intense'], not:['gold','desire'], mb:18500},
  {brand:'Dolce & Gabbana', kw:['dolce','gabbana'], not:['intense','light','one','only'], mb:17900},
  {brand:'Dolce & Gabbana', kw:['light','blue'], not:['intense','summer','femme','forever','homme'], mb:21900},
  // Azzaro
  {brand:'Azzaro', kw:['wanted','night'], not:[], mb:18900},
  {brand:'Azzaro', kw:['wanted'], not:['night','girl'], mb:17500},
  {brand:'Azzaro', kw:['chrome'], not:['parfum','extreme','legend','united'], mb:13900},
  {brand:'Azzaro', kw:['chrome','parfum'], not:[], mb:14900},
  {brand:'Azzaro', kw:['azzaro','pour','homme'], not:['night','intense'], mb:13000},
  // Armani
  {brand:'Giorgio Armani', kw:['acqua','parfum'], not:['profondo','profumo','gioia'], mb:27900},
  {brand:'Giorgio Armani', kw:['stronger','intensely'], not:[], mb:15900},
  {brand:'Giorgio Armani', kw:['stronger','absolutely'], not:[], mb:24500},
  {brand:'Giorgio Armani', kw:['code','parfum'], not:['profumo','absolu'], mb:23900},
  // Others
  {brand:'Narciso Rodriguez', kw:['him','bleu','noir'], not:['parfum'], mb:16900},
  {brand:'Burberry', kw:['mr','burberry'], not:['indigo','element'], mb:17000},
  {brand:'Mont Blanc', kw:['legend'], not:['spirit','red','night'], mb:16800},
  {brand:'Mont Blanc', kw:['legend','spirit'], not:[], mb:15000},
  {brand:'Mont Blanc', kw:['explorer','ultra','blue'], not:[], mb:16600},
  {brand:'Issey Miyake', kw:['eau','issey','homme'], not:['nuit','intense','wood','noir'], mb:14900},
  {brand:'Issey Miyake', kw:['nuit','issey'], not:['bleu'], mb:19900},
  {brand:'Lacoste', kw:['lacoste','pour','homme'], not:['intense'], mb:15400},
  {brand:'Carolina Herrera', kw:['212','men'], not:['vip','heroes','nyc'], mb:13900},
];

const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g,' ').replace(/\s+/g,' ').trim();

const results = [];
for (const m of confirmed) {
  const candidates = p.products.filter(x => x.brand === m.brand);
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
    const newPrice = Math.round((m.mb - 100) / 100) * 100;
    results.push({
      slug: best.slug, name: best.name, brand: best.brand,
      oldPrice: best.price, newPrice, mbPrice: m.mb
    });
  } else {
    console.log('NO MATCH:', m.brand, m.kw.join(' '));
  }
}

// Dedup by slug
const seen = new Set();
const unique = results.filter(r => { if (seen.has(r.slug)) return false; seen.add(r.slug); return true; });

console.log('\nMATCHS CONFIRMES:', unique.length, '\n');
unique.forEach(r => {
  const diff = r.newPrice - r.oldPrice;
  console.log(`${r.brand} | ${r.name} | ${r.oldPrice} -> ${r.newPrice} (${diff > 0 ? '+' : ''}${diff})`);
});

const ups = unique.filter(r => r.newPrice > r.oldPrice).length;
const downs = unique.filter(r => r.newPrice < r.oldPrice).length;
console.log(`\nHausse: ${ups} | Baisse: ${downs}`);
