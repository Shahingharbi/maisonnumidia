/**
 * Télécharge les images manquantes depuis parfumo.com
 * Usage: node scripts/download-parfumo-images.mjs
 */
import { readFileSync, writeFileSync, existsSync, createWriteStream } from 'fs';
import https from 'https';

const data = JSON.parse(readFileSync('data/products.json', 'utf8'));

// Produits avec images manquantes
const missing = data.products.filter(p => !existsSync('public' + p.image));
console.log(`\n🔍 ${missing.length} images manquantes à télécharger\n`);

// ─── Mapping noms de marques → parfumo ───────────────────────────────────────
const brandMap = {
  'Dior': 'Dior',
  'Chanel': 'Chanel',
  'Yves Saint Laurent': 'Yves_Saint_Laurent',
  'Giorgio Armani': 'Giorgio_Armani',
  'Paco Rabanne': 'Paco_Rabanne',
  'Jean Paul Gaultier': 'Jean_Paul_Gaultier',
  'Viktor&Rolf': 'Viktor_Rolf',
  'Versace': 'Versace',
  'Givenchy': 'Givenchy',
  'Lancôme': 'Lancome',
  'Guerlain': 'Guerlain',
  'Hermès': 'Hermes',
  'Hugo Boss': 'Hugo_Boss',
  'Gucci': 'Gucci',
  'Bvlgari': 'Bulgari',
  'Carolina Herrera': 'Carolina_Herrera',
  'Burberry': 'Burberry',
  'Tom Ford': 'Tom_Ford',
  'Mugler': 'Mugler',
  'Dolce&Gabbana': 'Dolce_Gabbana',
  'Dolce & Gabbana': 'Dolce_Gabbana',
  'Ralph Lauren': 'Ralph_Lauren',
  'Mont Blanc': 'Montblanc',
  'Montblanc': 'Montblanc',
  'Prada': 'Prada',
  'Calvin Klein': 'Calvin_Klein',
  'Davidoff': 'Davidoff',
  'Azzaro': 'Azzaro',
  'Issey Miyake': 'Issey_Miyake',
  'Cartier': 'Cartier',
  'Valentino': 'Valentino',
  'Lacoste': 'Lacoste',
  'Nina Ricci': 'Nina_Ricci',
  'Cacharel': 'Cacharel',
  'Kenzo': 'Kenzo',
  'Roberto Cavalli': 'Roberto_Cavalli',
  'Chloe': 'Chloe',
  'Chloé': 'Chloe',
  'Narciso Rodriguez': 'Narciso_Rodriguez',
  'Thierry Mugler': 'Mugler',
  'Escada': 'Escada',
  'Bottega Veneta': 'Bottega_Veneta',
  'Ferragamo': 'Salvatore_Ferragamo',
  'Kate Spade': 'Kate_Spade',
  'Jimmy Choo': 'Jimmy_Choo',
  'Marc Jacobs': 'Marc_Jacobs',
  'Michael Kors': 'Michael_Kors',
  'DKNY': 'DKNY',
  'Anna Sui': 'Anna_Sui',
  'Moschino': 'Moschino',
  'Mariah Carey': 'Mariah_Carey',
  'Viktor & Rolf': 'Viktor_Rolf',
  'Lattafa': 'Lattafa',
  'Al Haramain': 'Al_Haramain',
  'Swiss Arabian': 'Swiss_Arabian',
  'Ajmal': 'Ajmal',
  'Armaf': 'Armaf',
  'Afnan': 'Afnan',
  'Orientica': 'Orientica',
  'Franck Olivier': 'Franck_Olivier',
  'Cerruti': 'Cerruti',
  'Chopard': 'Chopard',
  'Elizabeth Taylor': 'Elizabeth_Taylor',
  'Trussardi': 'Trussardi',
  'Karl Lagerfeld': 'Karl_Lagerfeld',
  'Nikos': 'Nikos',
  'St. Dupont': 'St_Dupont',
  'Ungaro': 'Ungaro',
  'Britney Spears': 'Britney_Spears',
  'Jennifer Lopez': 'Jennifer_Lopez',
  'Beyonce': 'Beyonce',
  'Paris Hilton': 'Paris_Hilton',
  'Ariana Grande': 'Ariana_Grande',
  'Boucheron': 'Boucheron',
  'Van Cleef & Arpels': 'Van_Cleef_Arpels',
  'Rochas': 'Rochas',
  'Jo Malone': 'Jo_Malone_London',
  'Maison Margiela': 'Maison_Margiela',
  'Acqua di Parma': 'Acqua_di_Parma',
  'By Kilian': 'By_Kilian',
  'Initio': 'Initio_Parfums_Prives',
  'Amouage': 'Amouage',
  'Frédéric Malle': 'Frederic_Malle',
  'Byredo': 'Byredo',
  'Memo Paris': 'Memo',
  'Xerjoff': 'Xerjoff',
  'Nishane': 'Nishane',
  'Diptyque': 'Diptyque',
  "Penhaligon's": 'Penhaligons',
  'Parfums de Marly': 'Parfums_de_Marly',
  'Montale': 'Montale',
  'Ex Nihilo': 'Ex_Nihilo',
  'Serge Lutens': 'Serge_Lutens',
  'Juliette Has A Gun': 'Juliette_Has_a_Gun',
};

// ─── Utilitaires ──────────────────────────────────────────────────────────────
function toParfumoSlug(str) {
  return str
    .replace(/[àáâã]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o').replace(/[ùûü]/g, 'u').replace(/ç/g, 'c')
    .replace(/['']/g, '_').replace(/[&]/g, '_')
    .replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').replace(/_+/g, '_')
    .trim().replace(/^_|_$/g, '');
}

function toBrandSlug(brand) {
  return brandMap[brand] || toParfumoSlug(brand);
}

function buildCandidateUrls(product) {
  const brand = toBrandSlug(product.brand);
  const name = toParfumoSlug(product.name);
  const conc = product.concentration.replace(/\s+/g, '_');

  const candidates = [
    `https://www.parfumo.com/Perfumes/${brand}/${name}`,
    `https://www.parfumo.com/Perfumes/${brand}/${name}_${conc}`,
    `https://www.parfumo.com/Perfumes/${brand}/${name}_Eau_de_Parfum`,
    `https://www.parfumo.com/Perfumes/${brand}/${name}_Eau_de_Toilette`,
    `https://www.parfumo.com/Perfumes/${brand}/${name}_Parfum`,
  ];
  return [...new Set(candidates)];
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
function fetchHtml(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
      timeout: 10000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        resolve(fetchHtml(loc.startsWith('http') ? loc : 'https://www.parfumo.com' + loc));
        return;
      }
      if (res.statusCode !== 200) { resolve(null); return; }
      let body = '';
      res.on('data', chunk => { body += chunk; if (body.length > 50000) req.destroy(); });
      res.on('end', () => resolve(body));
      res.on('error', () => resolve(null));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

function extractImageUrl(html) {
  const match = html.match(/https:\/\/media\.parfumo\.com\/perfumes\/[a-z0-9]{2}\/[a-f0-9]+-[^"'\s]+_1200\.jpg/);
  return match ? match[0] : null;
}

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    const file = createWriteStream(dest);
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode !== 200) { file.close(); resolve(false); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
      file.on('error', () => resolve(false));
    }).on('error', () => resolve(false));
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Main ──────────────────────────────────────────────────────────────────────
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT) : missing.length;
const batch = missing.slice(0, LIMIT);
const results = { ok: [], fail: [] };

for (let i = 0; i < batch.length; i++) {
  const p = batch[i];
  const dest = 'public' + p.image;

  if (existsSync(dest)) continue;

  const candidates = buildCandidateUrls(p);
  let found = false;

  for (const url of candidates) {
    const html = await fetchHtml(url);
    if (!html) continue;

    const imgUrl = extractImageUrl(html);
    if (!imgUrl) continue;

    const ok = await downloadImage(imgUrl, dest);
    if (ok) {
      console.log(`✅ [${i+1}/${batch.length}] ${p.slug}`);
      results.ok.push(p.slug);
      found = true;
      break;
    }
  }

  if (!found) {
    console.log(`❌ [${i+1}/${batch.length}] ${p.slug} (${p.brand} - ${p.name})`);
    results.fail.push({ slug: p.slug, brand: p.brand, name: p.name, image: p.image });
  }

  // Petit délai pour ne pas surcharger le serveur
  await sleep(300);
}

// Rapport final
console.log(`\n📊 RÉSULTAT FINAL`);
console.log(`✅ Téléchargées: ${results.ok.length}`);
console.log(`❌ Introuvables: ${results.fail.length}`);

// Sauvegarder les échecs pour traitement manuel
writeFileSync('scripts/parfumo-missing.json', JSON.stringify(results.fail, null, 2));
console.log(`\nÉchecs sauvegardés dans scripts/parfumo-missing.json`);
