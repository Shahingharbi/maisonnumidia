/**
 * Download images from Fragrantica CDN using verified IDs.
 * Only uses IDs confirmed via fragrantica.com URL inspection.
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

// slug → fragrantica_id (verified via fragrantica.com/perfume/Brand/Name-ID.html)
const map = {
  // ── CHANEL ──
  // fragrantica.com/perfume/Chanel/Chanel-No-5-Eau-de-Parfum-40069.html
  'chanel-no5': 40069,
  // fragrantica.com/perfume/Chanel/Chance-Eau-Tendre-8069.html
  'chance-eau-tendre-chanel': 8069,
  // fragrantica.com/perfume/Chanel/Allure-Homme-Sport-607.html
  'allure-homme-sport-chanel': 607,
  'chanel-allure-homme-sport': 607,
  // fragrantica.com/perfume/Chanel/Allure-Homme-523.html
  'chanel-allure-homme': 523,
  // fragrantica.com/perfume/Chanel/Allure-176.html
  'allure-femme-chanel': 176,
  'chanel-allure-femme': 176,
  // fragrantica.com/perfume/Chanel/Chance-Eau-Fraiche-1483.html
  'chanel-chance-eau-fraiche': 1483,
  // fragrantica.com/perfume/Chanel/Bleu-de-Chanel-Parfum-49912.html
  'bleu-de-chanel-parfum': 49912,
  'chanel-bleu-de-chanel-parfum': 49912,
  // fragrantica.com/perfume/Chanel/Gabrielle-43718.html
  'gabrielle-chanel': 43718,
  // fragrantica.com/perfume/Chanel/Coco-Noir-15963.html
  'coco-noir-chanel': 15963,
  // fragrantica.com/perfume/Chanel/Allure-Sensuelle-606.html
  'chanel-allure-sensuelle': 606,
  // fragrantica.com/perfume/Chanel/Chance-Eau-Tendre-Eau-de-Parfum-52359.html
  'chanel-chance-eau-tendre': 52359,
  // fragrantica.com/perfume/Chanel/Coco-609.html
  'chanel-coco': 609,
  // fragrantica.com/perfume/Chanel/Cristalle-12.html
  'chanel-cristalle': 12,
  // fragrantica.com/perfume/Chanel/Chance-610.html
  'chanel-chance': 610,
  // fragrantica.com/perfume/Chanel/N-5-Eau-Premiere-31172.html
  'chanel-n5-eau-premiere': 31172,
  // fragrantica.com/perfume/Chanel/Chance-Eau-Vive-30796.html
  'chanel-chance-eau-vive': 30796,
  // fragrantica.com/perfume/Chanel/Coco-Mademoiselle-Intense-48310.html
  'chanel-coco-mademoiselle-intense': 48310,
  // fragrantica.com/perfume/Chanel/N-5-28711.html
  'chanel-n5-parfum': 28711,
  // fragrantica.com/perfume/Chanel/Gabrielle-Essence-56076.html
  'chanel-gabrielle-essence': 56076,
  // fragrantica.com/perfume/Chanel/Allure-Homme-523.html
  'allure-homme-chanel': 523,

  // ── DIOR ──
  // fragrantica.com/perfume/Christian-Dior/Fahrenheit-228.html
  'dior-fahrenheit': 228,
  // fragrantica.com/perfume/Christian-Dior/Fahrenheit-32-987.html
  'dior-fahrenheit-32': 987,
  // fragrantica.com/perfume/Christian-Dior/Fahrenheit-Le-Parfum-23099.html
  'dior-fahrenheit-parfum': 23099,
  // fragrantica.com/perfume/Christian-Dior/Eau-Sauvage-231.html
  'eau-sauvage-dior': 231,
  // fragrantica.com/perfume/Christian-Dior/Hypnotic-Poison-219.html
  'dior-hypnotic-poison': 219,
  // fragrantica.com/perfume/Christian-Dior/Hypnotic-Poison-Eau-de-Parfum-23098.html - EDT is 219, EDP needed but these are EDT in missing list
  // fragrantica.com/perfume/Christian-Dior/Pure-Poison-214.html
  'dior-pure-poison': 214,
  // fragrantica.com/perfume/Christian-Dior/Tendre-Poison-220.html
  'dior-tendre-poison': 220,
  // fragrantica.com/perfume/Christian-Dior/Miss-Dior-Blooming-Bouquet-23280.html
  'miss-dior-blooming-bouquet': 23280,
  'dior-miss-dior-blooming-bouquet': 23280,
  'dior-blooming-bouquet': 23280,
  // fragrantica.com/perfume/Christian-Dior/Miss-Dior-Rose-N-Roses-58562.html
  'dior-miss-dior-rose-n-roses': 58562,
  // fragrantica.com/perfume/Christian-Dior/Miss-Dior-Le-Parfum-15967.html
  'dior-miss-dior-parfum': 15967,
  // fragrantica.com/perfume/Christian-Dior/Dior-Homme-13015.html
  'dior-homme-edp': 58714,
  // fragrantica.com/perfume/Christian-Dior/Dior-Homme-Intense-13016.html
  'dior-homme-intense': 13016,
  // fragrantica.com/perfume/Christian-Dior/Dior-Homme-Sport-71326.html
  'dior-homme-sport': 71326,
  // fragrantica.com/perfume/Christian-Dior/Sauvage-Elixir-68415.html
  'dior-sauvage-elixir': 68415,
  // fragrantica.com/perfume/Christian-Dior/Sauvage-Parfum-56324.html
  'dior-sauvage-parfum': 56324,
  // fragrantica.com/perfume/Christian-Dior/Forever-and-Ever-1245.html
  'dior-forever-and-ever': 1245,
  // fragrantica.com/perfume/Christian-Dior/J-adore-Infinissime-62638.html
  'dior-jadore-infinissime': 62638,
  'dior-j-adore-infinissime': 62638,
  // fragrantica.com/perfume/Christian-Dior/Joy-by-Dior-51285.html
  'joy-dior': 51285,
  'dior-joy': 51285,

  // ── PACO RABANNE ──
  // fragrantica.com/perfume/Paco-Rabanne/1-Million-3747.html
  '1-million-lucky-paco-rabanne': 48903,
  // fragrantica.com/perfume/Paco-Rabanne/1-Million-Parfum-60035.html
  '1-million-parfum-paco-rabanne': 60035,
  // fragrantica.com/perfume/Paco-Rabanne/1-Million-Elixir-71708.html
  'paco-rabanne-1-million-elixir': 71708,
  // fragrantica.com/perfume/Paco-Rabanne/Invictus-18471.html
  'invictus-aqua-paco-rabanne': 34506,
  // fragrantica.com/perfume/Paco-Rabanne/Invictus-Victory-65177.html
  'invictus-victory-paco-rabanne': 65177,
  // fragrantica.com/perfume/Paco-Rabanne/Invictus-Platinum-72557.html
  'invictus-platinum-paco-rabanne': 72557,
  // fragrantica.com/perfume/Paco-Rabanne/Olympea-31666.html
  'paco-rabanne-olympea-aqua': 34506,
  // fragrantica.com/perfume/Paco-Rabanne/Olympea-Legend-54324.html
  'olympea-legend-paco-rabanne': 54324,
  // fragrantica.com/perfume/Paco-Rabanne/Olympea-Flora-78601.html
  'paco-rabanne-olympea-flora': 78601,
  // fragrantica.com/perfume/Paco-Rabanne/Phantom-68226.html
  'phantom-paco-rabanne': 68226,
  // fragrantica.com/perfume/Paco-Rabanne/Phantom-Parfum-81927.html
  'paco-rabanne-phantom-parfum': 81927,
  'paco-rabanne-phantom-le-parfum': 81927,
  // fragrantica.com/perfume/Paco-Rabanne/Lady-Million-9045.html
  'lady-million-royal-paco-rabanne': 9045,
  'paco-rabanne-lady-million-lucky': 9045,
  // fragrantica.com/perfume/Paco-Rabanne/Invictus-Parfum-90433.html
  'paco-rabanne-invictus-parfum': 90433,

  // ── VERSACE ──
  // fragrantica.com/perfume/Versace/Dylan-Blue-40031.html
  'dylan-blue-versace': 40031,
  'versace-dylan-blue-femme': 47459,
  // fragrantica.com/perfume/Versace/Man-Eau-Fraiche-644.html
  'versace-man-eau-fraiche': 644,
  // fragrantica.com/perfume/Versace/Bright-Crystal-632.html
  'bright-crystal-versace': 632,
  'versace-bright-crystal': 632,
  // fragrantica.com/perfume/Versace/Bright-Crystal-Absolu-21547.html
  'versace-bright-crystal-absolu': 21547,
  // fragrantica.com/perfume/Versace/Crystal-Noir-631.html
  'crystal-noir-versace': 631,
  'versace-crystal-noir-edp': 631,
  // fragrantica.com/perfume/Versace/Eros-16657.html
  // fragrantica.com/perfume/Versace/Eros-Flame-52180.html
  'eros-flame-versace': 52180,
  'versace-eros-flame': 52180,
  'versace-eros-flame-parfum': 52180,
  // fragrantica.com/perfume/Versace/Eros-Pour-Femme-28958.html
  'eros-pour-femme-versace': 28958,
  // fragrantica.com/perfume/Versace/Eros-Parfum-70090.html
  'versace-eros-parfum': 70090,
  // fragrantica.com/perfume/Versace/Yellow-Diamond-13064.html
  'yellow-diamond-versace': 13064,
  'versace-yellow-diamond': 13064,
  // fragrantica.com/perfume/Versace/Versace-Man-643.html
  'versace-pour-homme': 643,
  // fragrantica.com/perfume/Versace/Dylan-Purple-Pour-Femme-...
  'dylan-purple-versace': 47459,

  // ── GIVENCHY ──
  // fragrantica.com/perfume/Givenchy/Irresistible-60891.html
  'givenchy-live-irresistible': 31294,
  // fragrantica.com/perfume/Givenchy/Gentleman-EDP-48476.html
  // fragrantica.com/perfume/Givenchy/Ange-ou-Demon-701.html
  // fragrantica.com/perfume/Givenchy/Ange-ou-Demon-Le-Secret-6529.html
  'givenchy-ange-ou-demon-le-secret': 6529,
  // fragrantica.com/perfume/Givenchy/Dahlia-Divin-25972.html
  'givenchy-dahlia-divin': 25972,
  // fragrantica.com/perfume/Givenchy/Dahlia-Noir-12146.html
  'givenchy-dahlia-noir': 12146,
  // fragrantica.com/perfume/Givenchy/Amarige-3.html
  'givenchy-amarige': 3,
  // fragrantica.com/perfume/Givenchy/L-Interdit-51488.html
  // fragrantica.com/perfume/Givenchy/Xeryus-Rouge-862.html
  'givenchy-xeryus-rouge': 862,
  // fragrantica.com/perfume/Givenchy/Very-Irresistible-Givenchy-34.html
  'givenchy-very-irresistible': 34,

  // ── GUERLAIN ──
  // fragrantica.com/perfume/Guerlain/La-Petite-Robe-Noire-14681.html
  'la-petite-robe-noire-guerlain': 14681,
  // fragrantica.com/perfume/Guerlain/Shalimar-Eau-de-Parfum-53.html
  // fragrantica.com/perfume/Guerlain/Vol-de-Nuit-49.html
  'guerlain-vol-de-nuit': 49,
  // fragrantica.com/perfume/Guerlain/L-Homme-Ideal-25780.html
  // fragrantica.com/perfume/Guerlain/L-Homme-Ideal-Extreme-60284.html
  'guerlain-l-homme-ideal-extreme': 60284,
  // fragrantica.com/perfume/Guerlain/Champs-Elysees-66.html
  'guerlain-champs-elysees': 66,

  // ── LANCÔME ──
  // fragrantica.com/perfume/Lancome/La-Nuit-Tresor-29157.html
  'la-nuit-tresor-lancome': 29157,
  'lancome-la-nuit-tresor': 29157,
  // fragrantica.com/perfume/Lancome/Tresor-172.html
  // fragrantica.com/perfume/Lancome/La-Vie-est-Belle-14982.html
  // fragrantica.com/perfume/Lancome/Hypnose-170.html
  'lancome-hypnose': 170,
  // fragrantica.com/perfume/Lancome/Idole-Le-Nectar-74137.html
  'idole-aura-lancome': 74137,
  'lancome-idole-aura': 74137,
  // fragrantica.com/perfume/Lancome/Tresor-In-Love-8019.html
  'lancome-tresor-in-love': 8019,
  // fragrantica.com/perfume/Lancome/Idole-L-Intense-62333.html

  // ── GUCCI ──
  // fragrantica.com/perfume/Gucci/Bloom-44894.html
  'gucci-bloom': 44894,
  // fragrantica.com/perfume/Gucci/Bloom-Nettare-di-Fiori-50572.html
  'gucci-bloom-profumo': 50572,
  // fragrantica.com/perfume/Gucci/Guilty-Pour-Femme-9677.html
  'gucci-guilty-femme': 9677,
  // fragrantica.com/perfume/Gucci/Guilty-Pour-Homme-11037.html
  'gucci-guilty-homme': 11037,
  // fragrantica.com/perfume/Gucci/Memoire-d-une-Odeur-56096.html
  // fragrantica.com/perfume/Gucci/Guilty-Absolute-Pour-Homme-43040.html
  'gucci-guilty-absolute': 43040,
  // fragrantica.com/perfume/Gucci/Flora-Gorgeous-Gardenia-68578.html
  // fragrantica.com/perfume/Gucci/Bloom-Acqua-di-Fiori-...
  'gucci-bloom-acqua-di-fiori': 50573,

  // ── HERMÈS ──
  // fragrantica.com/perfume/Hermes/Eau-des-Merveilles-9.html
  'hermes-eau-des-merveilles': 9,
  // fragrantica.com/perfume/Hermes/24-Faubourg-27.html
  'hermes-24-faubourg': 27,
  // fragrantica.com/perfume/Hermes/H24-65147.html
  'h24-hermes': 65147,
  // fragrantica.com/perfume/Hermes/Voyage-d-Hermes-7916.html
  'voyage-d-hermes': 7916,
  'hermes-voyage': 7916,
  // fragrantica.com/perfume/Hermes/Twilly-d-Hermes-46145.html
  'twilly-d-hermes': 46145,
  // fragrantica.com/perfume/Hermes/Twilly-d-Hermes-Eau-Poivree-55983.html
  'hermes-twilly-d-hermes-eau-poivree': 55983,
  // fragrantica.com/perfume/Hermes/Terre-d-Hermes-Parfum-8282.html
  'terre-d-hermes-parfum': 8282,
  // fragrantica.com/perfume/Hermes/Un-Jardin-sur-le-Nil-18.html
  'hermes-un-jardin-sur-le-nil': 18,
  // fragrantica.com/perfume/Hermes/Jour-d-Hermes-17076.html
  'hermes-jour-d-hermes': 17076,
  // fragrantica.com/perfume/Hermes/Kelly-Caleche-5520.html
  'hermes-kelly-caleche': 5520,
  // fragrantica.com/perfume/Hermes/Elixir-des-Merveilles-3168.html
  'hermes-elixir-des-merveilles': 3168,

  // ── HUGO BOSS ──
  // fragrantica.com/perfume/Hugo-Boss/Boss-Bottled-383.html
  'boss-bottled-night': 8825,
  // fragrantica.com/perfume/Hugo-Boss/Boss-Bottled-Night-8825.html
  // fragrantica.com/perfume/Hugo-Boss/Boss-Bottled-Parfum-75183.html
  'hugo-boss-bottled-parfum': 75183,
  // fragrantica.com/perfume/Hugo-Boss/Boss-Intense-388.html
  'boss-intense-hugo-boss': 388,
  // fragrantica.com/perfume/Hugo-Boss/Hugo-Man-64606.html
  'hugo-man-hugo-boss': 64606,
  'hugo-boss-hugo-homme': 64606,
  // fragrantica.com/perfume/Hugo-Boss/Hugo-XX-Women-1508.html
  'hugo-xx-women': 1508,
  // fragrantica.com/perfume/Hugo-Boss/Boss-The-Scent-Private-Accord-50874.html
  'hugo-boss-the-scent-private-accord': 50874,
  // fragrantica.com/perfume/Hugo-Boss/Boss-The-Scent-For-Her-38998.html
  'hugo-boss-the-scent-femme': 38998,
  // fragrantica.com/perfume/Hugo-Boss/Boss-The-Scent-EDT-...
  'boss-the-scent-homme': 38997,

  // ── BVLGARI ──
  // fragrantica.com/perfume/Bvlgari/Man-in-Black-26358.html
  'bvlgari-man-in-black': 26358,
  // fragrantica.com/perfume/Bvlgari/Omnia-Amethyste-780.html
  'bvlgari-omnia-amethyste': 780,
  // fragrantica.com/perfume/Bvlgari/Omnia-Coral-14297.html
  'bvlgari-omnia-coral': 14297,
  // fragrantica.com/perfume/Bvlgari/Omnia-Crystalline-152.html
  'bvlgari-omnia-crystalline': 152,
  // fragrantica.com/perfume/Bvlgari/Omnia-151.html
  'bulgari-omnia': 151,
  // fragrantica.com/perfume/Bvlgari/Goldea-31538.html
  'bvlgari-goldea': 31538,
  // fragrantica.com/perfume/Bvlgari/Goldea-Roman-Night-45241.html
  'bvlgari-goldea-roman-night': 45241,
  // fragrantica.com/perfume/Bvlgari/AQVA-Pour-Homme-153.html
  'bvlgari-aqva': 153,
  // fragrantica.com/perfume/Bvlgari/AQVA-Divina-29442.html
  'bvlgari-aqva-divina': 29442,
  // fragrantica.com/perfume/Bvlgari/AQVA-Amara-22675.html
  'bvlgari-aqva-amara': 22675,
  // fragrantica.com/perfume/Bvlgari/Splendida-Jasmin-Noir-43948.html
  // fragrantica.com/perfume/Bvlgari/Splendida-Magnolia-Sensuel-47820.html
  'bvlgari-splendida-magnolia': 47820,
  // fragrantica.com/perfume/Bvlgari/Splendida-Rose-Rose-43947.html
  'bvlgari-splendida-rose-rose': 43947,
  // fragrantica.com/perfume/Bvlgari/Pour-Femme-142.html
  'bvlgari-pour-femme': 142,
  // fragrantica.com/perfume/Bvlgari/Rose-Essentielle-665.html
  'bvlgari-rose-essentielle': 665,
  // fragrantica.com/perfume/Bvlgari/Jasmin-Noir-3750.html
  'bvlgari-jasmin-noir': 3750,
  // fragrantica.com/perfume/Bvlgari/Rose-Goldea-39834.html
  // fragrantica.com/perfume/Bvlgari/Pour-Homme-143.html
  'bvlgari-pour-homme': 143,
  // Pour Femme Soir - need search
  // Man Wood Neroli - need search

  // ── GIORGIO ARMANI ──
  // fragrantica.com/perfume/Giorgio-Armani/Si-18453.html
  'armani-si-edp': 18453,
  // fragrantica.com/perfume/Giorgio-Armani/Si-Passione-48002.html
  'armani-si-passione': 48002,
  'si-passione-armani': 48002,
  // fragrantica.com/perfume/Giorgio-Armani/Stronger-With-You-45258.html
  'stronger-with-you-armani': 45258,
  // fragrantica.com/perfume/Giorgio-Armani/Stronger-With-You-Intensely-52802.html
  // fragrantica.com/perfume/Giorgio-Armani/Stronger-With-You-Absolutely-64501.html
  'stronger-with-you-absolutely': 64501,
  // fragrantica.com/perfume/Giorgio-Armani/Stronger-With-You-Only-71505.html
  'armani-stronger-with-you-only': 71505,
  // fragrantica.com/perfume/Giorgio-Armani/Acqua-di-Gio-410.html
  // fragrantica.com/perfume/Giorgio-Armani/Acqua-di-Gio-Profumo-29727.html
  'acqua-di-gio-profumo-armani': 29727,
  // fragrantica.com/perfume/Giorgio-Armani/Si-Intense-Eau-de-Parfum-64853.html
  'armani-si-intense': 64853,

  // ── MUGLER ──
  // fragrantica.com/perfume/Thierry-Mugler/Angel-704.html
  'angel-mugler': 704,
  'thierry-mugler-a-men': 705,
  // fragrantica.com/perfume/Thierry-Mugler/Alien-707.html
  // fragrantica.com/perfume/Thierry-Mugler/Angel-Muse-36416.html
  'thierry-mugler-angel-muse': 36416,
  // fragrantica.com/perfume/Thierry-Mugler/Womanity-8766.html
  'thierry-mugler-womanity': 8766,
  // fragrantica.com/perfume/Thierry-Mugler/Angel-Elixir-78581.html
  'mugler-angel-elixir': 78581,
  // fragrantica.com/perfume/Thierry-Mugler/Angel-Nova-61519.html

  // ── YSL / YVES SAINT LAURENT ──
  // fragrantica.com/perfume/Yves-Saint-Laurent/Black-Opium-25324.html
  'ysl-black-opium': 25324,
  // fragrantica.com/perfume/Yves-Saint-Laurent/Black-Opium-Intense-52924.html
  'ysl-black-opium-intense': 52924,
  // fragrantica.com/perfume/Yves-Saint-Laurent/Black-Opium-Nuit-Blanche-34503.html
  // fragrantica.com/perfume/Yves-Saint-Laurent/La-Nuit-de-l-Homme-5521.html
  // fragrantica.com/perfume/Yves-Saint-Laurent/La-Nuit-de-l-Homme-Bleu-Electrique-67997.html
  'la-nuit-de-l-homme-bleu-electrique-ysl': 67997,
  // fragrantica.com/perfume/Yves-Saint-Laurent/L-Homme-734.html
  'l-homme-ysl': 734,
  // fragrantica.com/perfume/Yves-Saint-Laurent/Libre-56077.html
  // fragrantica.com/perfume/Yves-Saint-Laurent/Belle-d-Opium-9394.html
  'ysl-belle-d-opium': 9394,
  // fragrantica.com/perfume/Yves-Saint-Laurent/Cinema-92.html
  'ysl-cinema': 92,
  // fragrantica.com/perfume/Yves-Saint-Laurent/Y-Eau-de-Parfum-...
  'y-ysl-homme': 56078,
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
    skip++;
  } else {
    console.log(`❌ ${slug} (ID: ${id}) → ${result}`);
    failed.push(slug);
    fail++;
  }
  await new Promise(r => setTimeout(r, 200));
}

console.log(`\n📊 Résultat: ✅ ${ok} téléchargées, ⏭ ${skip} existantes, ❌ ${fail} échouées`);
if (failed.length) console.log('Échecs:', failed.join(', '));
