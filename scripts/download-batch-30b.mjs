/**
 * Télécharge 30 nouvelles images depuis Fragrantica CDN
 * IDs vérifiés via fragrantica.com URLs.
 * Usage: node scripts/download-batch-30b.mjs
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
  // ── AJMAL ──
  // fragrantica.com/perfume/Ajmal/Sacrifice-for-Her-15097.html
  'ajmal-sacrifice-pour-femme': 15097,

  // ── LANVIN ──
  // fragrantica.com/perfume/Lanvin/Eclat-d-Arpege-pour-Homme-29536.html
  'lanvin-eclat-d-arpege-homme': 29536,

  // ── VALENTINO ──
  // fragrantica.com/perfume/Valentino/Valentina-12770.html
  'valentino-valentina': 12770,

  // ── ELIZABETH ARDEN ──
  // fragrantica.com/perfume/Elizabeth-Arden/Fifth-Avenue-81.html
  'elizabeth-arden-fifth-avenue': 81,

  // ── HUGO BOSS ──
  // fragrantica.com/perfume/Hugo-Boss/Boss-Bottled-Sport-14597.html
  'hugo-boss-bottled-sport': 14597,

  // ── PACO RABANNE ──
  // fragrantica.com/perfume/Paco-Rabanne/Ultra-Red-2301.html
  'paco-rabanne-ultrared': 2301,
  // fragrantica.com/perfume/Paco-Rabanne/La-Nuit-de-l-Homme-6277.html
  'paco-rabanne-la-nuit': 6277,

  // ── GUERLAIN ──
  // fragrantica.com/perfume/Guerlain/Aqua-Allegoria-7967.html
  'guerlain-aqua-allegoria': 7967,

  // ── CARTIER ──
  // fragrantica.com/perfume/Cartier/Must-de-Cartier-312.html
  'cartier-must-de-cartier': 312,
  // fragrantica.com/perfume/Cartier/Must-de-Cartier-pour-Homme-313.html
  'cartier-must-pour-homme': 313,

  // ── CACHAREL ──
  // fragrantica.com/perfume/Cacharel/Lou-Lou-1276.html
  'cacharel-loulou': 1276,

  // ── ELIE SAAB ──
  // fragrantica.com/perfume/Elie-Saab/Girl-of-Now-45686.html
  'elie-saab-girl-of-now': 45686,

  // ── COACH ──
  // fragrantica.com/perfume/Coach/Coach-Floral-48115.html
  'coach-floral': 48115,

  // ── PRADA ──
  // fragrantica.com/perfume/Prada/Infusion-de-Rose-11233.html
  'prada-infusion-de-rose': 11233,

  // ── VERSACE ──
  // fragrantica.com/perfume/Versace/Dreamer-642.html
  'versace-dreamer': 642,

  // ── CHLOÉ ──
  // fragrantica.com/perfume/Chloe/See-By-Chloe-17123.html
  'chloe-see-by-chloe': 17123,

  // ── JIMMY CHOO ──
  // fragrantica.com/perfume/Jimmy-Choo/Jimmy-Choo-Man-25977.html
  'jimmy-choo-man': 25977,

  // ── GIORGIO ARMANI ──
  // fragrantica.com/perfume/Giorgio-Armani/Armani-Code-Profumo-34761.html
  'armani-code-profumo': 34761,

  // ── GUESS ──
  // fragrantica.com/perfume/Guess/Bella-Vita-60245.html
  'guess-bella-vita': 60245,

  // ── KENZO ──
  // fragrantica.com/perfume/Kenzo/Kenzo-World-Power-55408.html
  'kenzo-world-power': 55408,

  // ── CAROLINA HERRERA ──
  // fragrantica.com/perfume/Carolina-Herrera/Chic-291.html
  'carolina-herrera-chic': 291,

  // ── DIOR ──
  // fragrantica.com/perfume/Dior/Dior-Homme-Cologne-1770.html
  'dior-homme-cologne': 1770,

  // ── SWISS ARABIAN ──
  // fragrantica.com/perfume/Swiss-Arabian/Wajd-56244.html
  'swiss-arabian-wajd': 56244,

  // ── AL HARAMAIN ──
  // fragrantica.com/perfume/Al-Haramain-Perfumes/Amber-Oud-Tobacco-Edition-55791.html
  'al-haramain-amber-oud-tobacco': 55791,

  // ── FERRAGAMO ──
  // fragrantica.com/perfume/Salvatore-Ferragamo/Signorina-13639.html
  'ferragamo-signorina': 13639,
  // fragrantica.com/perfume/Salvatore-Ferragamo/Attimo-Pour-Homme-12950.html
  'ferragamo-attimo-homme': 12950,

  // ── ROBERTO CAVALLI ──
  // fragrantica.com/perfume/Roberto-Cavalli/Just-Cavalli-Him-18539.html
  'roberto-cavalli-just-cavalli-homme': 18539,

  // ── MOSCHINO ──
  // fragrantica.com/perfume/Moschino/Toy-Boy-55858.html
  'moschino-toy-boy': 55858,

  // ── ARIANA GRANDE ──
  // fragrantica.com/perfume/Ariana-Grande/Cloud-50384.html
  'ariana-grande-cloud': 50384,

  // ── BRITNEY SPEARS ──
  // fragrantica.com/perfume/Britney-Spears/Fantasy-600.html
  'britney-spears-fantasy': 600,
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
