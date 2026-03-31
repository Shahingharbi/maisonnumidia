/**
 * Télécharge 30 nouvelles images depuis Fragrantica CDN
 * IDs vérifiés via fragrantica.com URLs.
 * Usage: node scripts/download-batch-30.mjs
 */
import { createWriteStream, existsSync } from 'fs';
import https from 'https';

function downloadImg(id, dest) {
  return new Promise((resolve) => {
    if (existsSync(dest)) { resolve('skip'); return; }
    const url = `https://fimgs.net/mdimg/perfume/375x500.${id}.jpg`;
    const file = createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) { file.close(); resolve('err-' + res.statusCode); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve('ok'); });
      file.on('error', () => resolve('err-write'));
    }).on('error', e => { file.close(); resolve('err-' + e.code); });
  });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const map = {
  // ── GUESS ──
  // fragrantica.com/perfume/Guess/Guess-Seductive-Homme-12953.html
  'guess-seductive-homme': 12953,
  // fragrantica.com/perfume/Guess/Guess-Seductive-9453.html
  'guess-seductive-femme': 9453,

  // ── FRANCK OLIVIER ──
  // fragrantica.com/perfume/Franck-Olivier/Black-Touch-6876.html
  'franck-olivier-black-touch': 6876,

  // ── EL NABIL ──
  // fragrantica.com/perfume/El-Nabil/Musc-Tahara-64907.html
  'el-nabil-musc-tahara': 64907,

  // ── RASASI ──
  // fragrantica.com/perfume/Rasasi/Dhan-Al-Oudh-Safwa-19520.html
  'rasasi-dhan-al-oudh': 19520,
  // fragrantica.com/perfume/Rasasi/Al-Wisam-Evening-19649.html
  'rasasi-al-wisam-evening': 19649,
  // fragrantica.com/perfume/Rasasi/Fattan-Pour-Femme-84399.html
  'rasasi-fattan-pour-femme': 84399,

  // ── CHLOÉ ──
  // fragrantica.com/perfume/Chloe/L-Eau-de-Chloe-14000.html
  'chloe-l-eau-de-chloe': 14000,

  // ── ROJA DOVE ──
  // fragrantica.com/perfume/Roja-Dove/Enigma-20558.html
  'roja-dove-enigma': 20558,

  // ── MONTBLANC ──
  // fragrantica.com/perfume/Montblanc/Legend-Eau-de-Parfum-62583.html
  'mont-blanc-legend-edp': 62583,

  // ── CACHAREL ──
  // fragrantica.com/perfume/Cacharel/Noa-242.html
  'cacharel-noa': 242,
  // fragrantica.com/perfume/Cacharel/Anais-Anais-236.html
  'cacharel-anais-anais': 236,

  // ── LANVIN ──
  // fragrantica.com/perfume/Lanvin/Arpege-6.html
  'lanvin-arpege': 6,
  // fragrantica.com/perfume/Lanvin/Eclat-d-Arpege-988.html
  'lanvin-eclat-d-arpege': 988,

  // ── VALENTINO ──
  // fragrantica.com/perfume/Valentino/Rock-n-Rose-774.html
  'valentino-rock-n-rose': 774,

  // ── HUGO BOSS ──
  // fragrantica.com/perfume/Hugo-Boss/Boss-Nuit-Pour-Femme-15259.html
  'hugo-boss-nuit-femme': 15259,
  // fragrantica.com/perfume/Hugo-Boss/Boss-Orange-for-Men-11070.html
  'hugo-boss-orange-homme': 11070,

  // ── NARCISO RODRIGUEZ ──
  // fragrantica.com/perfume/Narciso-Rodriguez/Musc-Noir-For-Her-64730.html
  'narciso-rodriguez-musc-noir': 64730,

  // ── SWISS ARABIAN ──
  // fragrantica.com/perfume/Swiss-Arabian/Noora-19470.html
  'swiss-arabian-noora': 19470,
  // fragrantica.com/perfume/Swiss-Arabian/Layali-Rouge-54146.html
  'swiss-arabian-layali-rouge': 54146,

  // ── ROCHAS ──
  // fragrantica.com/perfume/Rochas/Rochas-Man-1426.html
  'rochas-man': 1426,
  // fragrantica.com/perfume/Rochas/Femme-Rochas-28.html
  'rochas-femme': 28,

  // ── VERSACE ──
  // fragrantica.com/perfume/Versace/Versense-5752.html
  'versace-versense': 5752,

  // ── LALIQUE ──
  // fragrantica.com/perfume/Lalique/L-Insoumis-39442.html
  'lalique-l-insoumis': 39442,
  // fragrantica.com/perfume/Lalique/L-Amour-16931.html
  'lalique-amour': 16931,

  // ── NINA RICCI ──
  // fragrantica.com/perfume/Nina-Ricci/Premier-Jour-520.html
  'nina-ricci-premier-jour': 520,

  // ── HERMÈS ──
  // fragrantica.com/perfume/Hermes/Bel-Ami-25.html
  'hermes-bel-ami': 25,

  // ── CARTIER ──
  // fragrantica.com/perfume/Cartier/Santos-de-Cartier-316.html
  'cartier-santos-homme': 316,

  // ── AJMAL ──
  // fragrantica.com/perfume/Ajmal/Evoke-for-Her-32526.html
  'ajmal-evoke-femme': 32526,

  // ── DIOR ──
  // fragrantica.com/perfume/Dior/Dune-221.html
  'dior-dune': 221,
};

const BASE = 'public/images/products/';
let ok = 0, skip = 0, fail = 0;
const failed = [];

for (const [slug, id] of Object.entries(map)) {
  const dest = `${BASE}${slug}.jpg`;
  const result = await downloadImg(id, dest);
  if (result === 'ok') {
    console.log(`✅ ${slug} (ID: ${id})`);
    ok++;
  } else if (result === 'skip') {
    console.log(`⏭  ${slug} (déjà présent)`);
    skip++;
  } else {
    console.log(`❌ ${slug} (ID: ${id}) → ${result}`);
    failed.push({ slug, id });
    fail++;
  }
  await sleep(250);
}

console.log(`\n📊 Résultat: ✅ ${ok} téléchargées, ⏭ ${skip} existantes, ❌ ${fail} échouées`);
if (failed.length) console.log('Échecs:', failed.map(f => f.slug).join(', '));
