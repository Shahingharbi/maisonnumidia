/**
 * Soumet toutes les URLs du site à IndexNow (Bing, Yandex, etc.)
 * pour une indexation accélérée.
 * Usage: node scripts/indexnow-submit.mjs
 */
import https from 'https';
import { readFileSync } from 'fs';

const HOST = 'maisonnumidia.store';
const KEY = 'b7c3d1e2f4a5b6c7d8e9f0a1b2c3d4e5';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const BASE = `https://${HOST}`;

// Charger les données
const data = JSON.parse(readFileSync('data/products.json', 'utf8'));
const products = data.products;
const brands = data.brands;

// Blog slugs (à maintenir en sync avec data/blog.ts)
const blogSlugs = [
  'meilleur-parfum-homme',
  'parfum-de-niche-algerie',
  'eau-de-parfum-vs-eau-de-toilette',
  'meilleur-parfum-femme',
  'parfum-floral-femme',
  'dupe-parfum',
  'parfum-poudre-femme',
  'parfum-ete-femme',
  'reconnaitre-parfum-original',
];

// Construire la liste complète des URLs
const urls = [
  // Pages statiques prioritaires
  BASE,
  `${BASE}/parfums-homme`,
  `${BASE}/parfums-femme`,
  `${BASE}/parfums-orientaux`,
  `${BASE}/marques`,
  `${BASE}/blog`,
  `${BASE}/commander`,
  `${BASE}/contact`,

  // Articles blog
  ...blogSlugs.map(s => `${BASE}/blog/${s}`),

  // Pages marques
  ...brands.map(b => `${BASE}/marques/${b.slug}`),

  // Pages filtre catégorie+marque (homme)
  ...[...new Set(products.filter(p => p.gender === 'homme' || p.gender === 'unisexe').map(p => p.brandSlug))]
    .map(s => `${BASE}/parfums-homme/${s}`),

  // Pages filtre catégorie+marque (femme)
  ...[...new Set(products.filter(p => p.gender === 'femme' || p.gender === 'unisexe').map(p => p.brandSlug))]
    .map(s => `${BASE}/parfums-femme/${s}`),

  // Pages filtre catégorie+marque (oriental)
  ...[...new Set(products.filter(p => p.isOriental).map(p => p.brandSlug))]
    .map(s => `${BASE}/parfums-orientaux/${s}`),

  // Pages produit
  ...products.map(p => `${BASE}/parfums/${p.slug}`),
];

console.log(`\n📋 ${urls.length} URLs à soumettre à IndexNow\n`);

// IndexNow accepte max 10 000 URLs par requête
const BATCH_SIZE = 10000;
const batches = [];
for (let i = 0; i < urls.length; i += BATCH_SIZE) {
  batches.push(urls.slice(i, i + BATCH_SIZE));
}

function post(urlList) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    });

    const req = https.request({
      hostname: 'api.indexnow.org',
      path: '/IndexNow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

for (let i = 0; i < batches.length; i++) {
  const batch = batches[i];
  console.log(`🚀 Envoi batch ${i + 1}/${batches.length} (${batch.length} URLs)...`);
  try {
    const result = await post(batch);
    if (result.status === 200 || result.status === 202) {
      console.log(`✅ Accepté — HTTP ${result.status}`);
    } else {
      console.log(`⚠️  HTTP ${result.status}: ${result.body}`);
    }
  } catch (e) {
    console.log(`❌ Erreur: ${e.message}`);
  }
}

console.log('\n✅ IndexNow terminé — Bing/Yandex notifiés');
console.log('ℹ️  Google utilise son propre système (Search Console)');
console.log('ℹ️  Relancer ce script après chaque ajout de produit\n');
