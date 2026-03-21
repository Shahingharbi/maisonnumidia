/**
 * Download images batch 3 — verified Fragrantica IDs
 */
import { createWriteStream, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import https from 'https';

const CDN = (id) => `https://fimgs.net/mdimg/perfume/375x500.${id}.jpg`;
const OUT  = 'public/images/products';

const IDS = {
  // Dolce & Gabbana
  'dolce-gabbana-dolce':                   22955,
  'dolce-gabbana-the-only-one':            51249,
  'dolce-gabbana-the-only-one-2':          59312,
  'dolce-gabbana-light-blue-intenso':      44035,
  'dolce-gabbana-pour-homme':              15336,
  'dolce-gabbana-k':                       56358,
  'dolce-gabbana-intenso':                 28935,
  'dolce-gabbana-light-blue-forever-femme': 66555,
  'dolce-gabbana-light-blue-forever-homme': 66556,
  'dolce-gabbana-velvet-love':             13747,
  'dolce-gabbana-devotion':                84951,
  'dolce-gabbana-light-blue-sun':          54493,
  'dolce-gabbana-the-one-gentleman':        8907,

  // Ralph Lauren
  'polo-blue-ralph-lauren':         1198,
  'romance-femme-ralph-lauren':      825,
  'ralph-lauren-polo-red':          18598,
  'polo-sport-ralph-lauren':          894,
  'polo-black-ralph-lauren':         1197,
  'ralph-lauren-polo-red-rush':     50714,
  'ralph-lauren-tender-romance':    36147,

  // Hugo Boss
  'boss-alive-hugo-boss':    59228,
  'boss-alive':              59228,
  'boss-femme-hugo-boss':      821,
  'boss-ma-vie-hugo-boss':   25298,
  'hugo-deep-red':             565,
  'hugo-boss-the-scent-elixir': 88879,

  // Giorgio Armani / Armani
  'armani-code-absolu':              53106,
  'armani-si-rose-signature':        35248,
  'because-it-s-you-armani':        45257,
  'armani-code-edp':                 65581,
  'armani-code-parfum':              75126,
  'armani-my-way-parfum':            78561,
  'armani-acqua-di-gioia':            8442,
  'armani-si-fiori':                 53243,
  'armani-emporio-she':              64482,
  'armani-acqua-di-gio-essenza':     14825,
  'armani-stronger-with-you-freezing': 58808,
  // armani-code-profumo: skipped — different product from code parfum, ID not confirmed

  // Givenchy
  'givenchy-pi':                     39,
  'givenchy-blue-label':             38,
  'givenchy-play':                 3906,
  'givenchy-gentleman-society':    78639,
  'givenchy-hot-couture':             35,
  'givenchy-monsieur-de-givenchy':  1968,
  'givenchy-l-interdit-intense':   62491,
  'givenchy-dahlia-divin-le-nectar': 38582,
  'givenchy-irresistible-rose-velvet': 78480,
  'givenchy-irresistible-eau-fraiche': 71205,
  'givenchy-gentleman-parfum':     48476,

  // Gucci
  'gucci-rush':                 686,
  'gucci-rush-for-men':         693,
  'gucci-guilty-intense':     13201,
  'gucci-bloom-intense':      79602,
  'gucci-envy-me':              682,
  'gucci-guilty-black':       17322,
  'gucci-made-to-measure':    18703,
  'gucci-premiere':           15449,
  'gucci-pour-homme':           691,
  'gucci-pour-homme-ii':       1119,
  'gucci-bamboo':             30815,
  'gucci-guilty-platinum-femme': 40647,

  // YSL
  'opium-ysl':                              93,
  'parisienne-ysl':                       6493,
  'ysl-black-opium-neon':                58525,
  'ysl-kouros':                            735,
  'paris-ysl':                              94,
  'yves-saint-laurent-mon-paris-intensement': 59538,
  'ysl-myslf':                           84094,
  'ysl-rive-gauche':                        96,
  'ysl-libre-intense':                   62318,
  'ysl-mon-paris-couture':               48400,
  'ysl-y-femme':                           100,

  // Jean Paul Gaultier
  'jean-paul-gaultier-kokorico':           12711,
  'jean-paul-gaultier-gaultier-2':           433,
  'jean-paul-gaultier-ultra-male':         30947,
  'jean-paul-gaultier-ultra-male-intense': 30947,
  'jean-paul-gaultier-scandal-absolu':     91052,
  'jean-paul-gaultier-classique-edp':      24821,
  'la-belle-intense-jean-paul-gaultier':   65175,
  // jean-paul-gaultier-bad-boy: skipped — ID not confirmed

  // Calvin Klein
  'eternity-femme-ck':          257,
  'eternity-homme-ck':          258,
  'calvin-klein-eternity-femme': 257,
  'calvin-klein-eternity-homme': 258,
  'obsession-femme-ck':         248,
  'ck-be-calvin-klein':         275,
  'ck-free-calvin-klein':      6281,
  'escape-femme-calvin-klein':  271,

  // Issey Miyake
  'l-eau-d-issey-homme':            721,
  'issey-miyake-l-eau-d-issey-pure': 37741,
  'nuit-d-issey-homme':            25514,
  'issey-miyake-a-drop-d-issey':   66334,
  'issey-miyake-pleats-please':    15997,
  'issey-miyake-l-homme-issey':      721,
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) { file.destroy(); reject(new Error(`HTTP ${res.statusCode}`)); return; }
      pipeline(res, file).then(resolve).catch(reject);
    }).on('error', reject);
  });
}

const entries = Object.entries(IDS);
let ok = 0, skip = 0, err = 0;

for (const [slug, id] of entries) {
  const dest = `${OUT}/${slug}.jpg`;
  if (existsSync(dest)) { skip++; continue; }
  try {
    await download(CDN(id), dest);
    console.log(`✅ ${slug} (${id})`);
    ok++;
  } catch (e) {
    console.error(`❌ ${slug}: ${e.message}`);
    err++;
  }
}

console.log(`\nDone: ${ok} downloaded, ${skip} skipped, ${err} errors`);
