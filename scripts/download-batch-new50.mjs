/**
 * Télécharge les images depuis Fragrantica CDN — batch new50
 * IDs vérifiés via fragrantica.com URLs.
 * Usage: node scripts/download-batch-new50.mjs
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

// slug → fragrantica_id (vérifiés via fragrantica.com/perfume/Brand/Name-ID.html)
const map = {
  // ── LATTAFA ──
  // fragrantica.com/perfume/Lattafa-Perfumes/Yara-76880.html
  'lattafa-yara': 76880,
  // fragrantica.com/perfume/Lattafa-Perfumes/Yara-Moi-80722.html
  'lattafa-yara-moi': 80722,
  // fragrantica.com/perfume/Lattafa-Perfumes/Bade-e-Al-Oud-Oud-for-Glory-64948.html
  'lattafa-oud-for-glory': 64948,

  // ── TOM FORD ──
  // fragrantica.com/perfume/Tom-Ford/Noir-Extreme-29675.html
  'tom-ford-noir-extreme': 29675,
  // fragrantica.com/perfume/Tom-Ford/Ombre-Leather-2018-50239.html
  'tom-ford-ombre-leather': 50239,
  // fragrantica.com/perfume/Dior/Sauvage-Elixir-68415.html
  'dior-sauvage-elixir-intense': 68415,

  // ── NARCISO RODRIGUEZ ──
  // fragrantica.com/perfume/Narciso-Rodriguez/Narciso-Rodriguez-Fleur-Musc-for-Her-42580.html
  'narciso-rodriguez-for-her-fleur-musc': 42580,

  // ── GIORGIO ARMANI ──
  // fragrantica.com/perfume/Giorgio-Armani/Armani-Code-for-Women-413.html
  'armani-code-femme': 413,

  // ── VERSACE ──
  // fragrantica.com/perfume/Versace/Versace-Pour-Femme-Dylan-Turquoise-62966.html
  'versace-dylan-turquoise': 62966,

  // ── DOLCE & GABBANA ──
  // fragrantica.com/perfume/Dolce-Gabbana/Dolce-Gabbana-Pour-Femme-15335.html
  'dolce-gabbana-pour-femme': 15335,

  // ── DKNY / DONNA KARAN ──
  // fragrantica.com/perfume/Donna-Karan/DKNY-Be-Delicious-498.html
  'dkny-be-delicious-femme': 498,
  // fragrantica.com/perfume/Donna-Karan/DKNY-Be-Delicious-Men-500.html
  'dkny-be-delicious-homme': 500,

  // ── MUGLER ──
  // fragrantica.com/perfume/Mugler/B-Men-706.html
  'mugler-b-men': 706,

  // ── SWISS ARABIAN ──
  // fragrantica.com/perfume/Swiss-Arabian/Shaghaf-Oud-50582.html
  'swiss-arabian-shaghaf-oud': 50582,
  // fragrantica.com/perfume/Swiss-Arabian/Kashkha-19456.html
  'swiss-arabian-kashkha': 19456,
  // fragrantica.com/perfume/Swiss-Arabian/Jannet-El-Firdaus-20749.html
  'swiss-arabian-jannat-ul-firdaus': 20749,
  // fragrantica.com/perfume/Swiss-Arabian/Mukhalat-Malaki-10849.html
  'swiss-arabian-mukhalat-malaki': 10849,

  // ── AL HARAMAIN ──
  // fragrantica.com/perfume/Al-Haramain-Perfumes/Rose-Oud-120166.html
  'al-haramain-rose-oud': 120166,
  // fragrantica.com/perfume/Al-Haramain-Perfumes/Al-Haramain-Oudh-Patchouli-55793.html
  'al-haramain-oudh-patchouli': 55793,
  // fragrantica.com/perfume/Al-Haramain-Perfumes/Black-Oudh-36596.html
  'al-haramain-black-oudh': 36596,
  // fragrantica.com/perfume/Al-Haramain-Perfumes/Royal-Musk-70384.html
  'al-haramain-royal-musk': 70384,

  // ── LANVIN ──
  // fragrantica.com/perfume/Lanvin/Jeanne-Lanvin-3779.html
  'lanvin-jeanne': 3779,

  // ── HERMÈS ──
  // fragrantica.com/perfume/Hermes/L-Ombre-Des-Merveilles-59799.html
  'hermes-l-ombre-des-merveilles': 59799,
  // fragrantica.com/perfume/Hermes/Un-Jardin-en-Mediterranee-19.html
  'hermes-un-jardin-en-mediterranee': 19,

  // ── RALPH LAUREN ──
  // fragrantica.com/perfume/Ralph-Lauren/Polo-Cologne-Intense-Eau-de-Parfum-66411.html
  'polo-intense-ralph-lauren': 66411,

  // ── MONTALE ──
  // fragrantica.com/perfume/Montale/Black-Musk-12298.html
  'montale-black-musk': 12298,
  // fragrantica.com/perfume/Montale/Fruits-of-the-Musk-5143.html
  'montale-fruits-of-the-musk': 5143,

  // ── PRADA ──
  // fragrantica.com/perfume/Prada/Prada-La-Femme-39030.html
  'prada-la-femme': 39030,

  // ── AJMAL ──
  // fragrantica.com/perfume/Ajmal/Amber-Wood-26016.html
  'ajmal-amber-wood': 26016,
  // fragrantica.com/perfume/Ajmal/Sacrifice-for-Him-15098.html
  'ajmal-sacrifice-homme': 15098,
  // fragrantica.com/perfume/Ajmal/Evoke-for-Him-32527.html
  'ajmal-evoke-homme': 32527,

  // ── XERJOFF ──
  // fragrantica.com/perfume/Xerjoff/Alexandria-II-17786.html
  'xerjoff-alexandria-ii': 17786,

  // ── ELIZABETH ARDEN ──
  // fragrantica.com/perfume/Elizabeth-Arden/White-Tea-42439.html
  'elizabeth-arden-white-tea': 42439,

  // ── RASASI ──
  // fragrantica.com/perfume/Rasasi/Hawas-for-Her-67146.html
  'rasasi-hawas-pour-elle': 67146,
  // fragrantica.com/perfume/Rasasi/Al-Wisam-Day-19650.html
  'rasasi-al-wisam-day': 19650,
  // fragrantica.com/perfume/Rasasi/Instincts-84397.html
  'rasasi-instinct': 84397,

  // ── COACH ──
  // fragrantica.com/perfume/Coach/Coach-Wild-Rose-72051.html
  'coach-wild-rose-femme': 72051,
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
