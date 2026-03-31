/**
 * Télécharge les images depuis Fragrantica CDN pour les produits manquants.
 * IDs vérifiés via fragrantica.com URLs - ne pas estimer.
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
  // ── VIKTOR & ROLF ──
  // fragrantica.com/perfume/Viktor-Rolf/Flowerbomb-1460.html
  'flowerbomb-viktor-rolf': 1460,
  // fragrantica.com/perfume/Viktor-Rolf/Flowerbomb-Nectar-48062.html
  'flowerbomb-nectar-viktor-rolf': 48062,
  // fragrantica.com/perfume/Viktor-Rolf/Spicebomb-Extreme-30499.html
  'spicebomb-extreme-viktor-rolf': 30499,
  // fragrantica.com/perfume/Viktor-Rolf/Spicebomb-Infrared-66514.html
  'spicebomb-infrared': 66514,
  // fragrantica.com/perfume/Viktor-Rolf/Good-Fortune-74194.html
  'good-fortune-viktor-rolf': 74194,

  // ── LATTAFA ──
  // fragrantica.com/perfume/Lattafa-Perfumes/Ana-Abiyedh-59149.html
  'lattafa-ana-abiyedh': 59149,
  // fragrantica.com/perfume/Lattafa-Perfumes/Khamrah-75805.html
  'lattafa-khamrah': 75805,
  // fragrantica.com/perfume/Lattafa-Perfumes/Raghba-25807.html
  'lattafa-raghba': 25807,
  // fragrantica.com/perfume/Lattafa-Perfumes/Velvet-Oud-60262.html
  'lattafa-velvet-oud': 60262,

  // ── AL HARAMAIN ──
  // fragrantica.com/perfume/Al-Haramain-Perfumes/L-Aventure-40405.html
  'l-aventure-al-haramain': 40405,
  // fragrantica.com/perfume/Al-Haramain-Perfumes/L-Aventure-Femme-51820.html
  'l-aventure-femme-al-haramain': 51820,
  // fragrantica.com/perfume/Al-Haramain-Perfumes/L-Aventure-Knight-51824.html
  'al-haramain-l-aventure-knight': 51824,
  // fragrantica.com/perfume/Al-Haramain-Perfumes/Amber-Oud-51817.html
  'al-haramain-amber-oud': 51817,

  // ── TOM FORD ──
  // fragrantica.com/perfume/Tom-Ford/Tobacco-Vanille-1825.html
  'tobacco-vanille-tom-ford': 1825,
  // fragrantica.com/perfume/Tom-Ford/Tuscan-Leather-1849.html
  'tom-ford-tuscan-leather': 1849,
  // fragrantica.com/perfume/Tom-Ford/Oud-Wood-1826.html
  'tom-ford-oud-wood': 1826,
  // fragrantica.com/perfume/Tom-Ford/Rose-Prick-58781.html
  'tom-ford-rose-prick': 58781,
  // fragrantica.com/perfume/Tom-Ford/Lost-Cherry-... (need to verify)
  // 'tom-ford-lost-cherry': ???,

  // ── NINA RICCI ──
  // fragrantica.com/perfume/Nina-Ricci/Nina-147.html
  'nina-ricci-nina': 147,
  // fragrantica.com/perfume/Nina-Ricci/L-Air-du-Temps-1014.html
  'nina-ricci-l-air-du-temps': 1014,
  // fragrantica.com/perfume/Nina-Ricci/Ricci-Ricci-6382.html
  'nina-ricci-ricci-ricci': 6382,
  // fragrantica.com/perfume/Nina-Ricci/L-Extase-29668.html
  'nina-ricci-l-extase': 29668,

  // ── CHLOÉ ──
  // fragrantica.com/perfume/Chloe/Nomade-48434.html
  'chloe-nomade': 48434,
  // fragrantica.com/perfume/Chloe/Chloe-Fleur-de-Parfum-39632.html
  'chloe-fleur-de-parfum': 39632,
  // fragrantica.com/perfume/Chloe/Love-Story-26227.html
  'chloe-love-story': 26227,

  // ── NARCISO RODRIGUEZ ──
  // fragrantica.com/perfume/Narciso-Rodriguez/Pure-Musc-For-Her-53441.html
  'narciso-pure-musc': 53441,
  // fragrantica.com/perfume/Narciso-Rodriguez/Narciso-Rodriguez-for-Him-Bleu-Noir-31247.html
  'narciso-rodriguez-bleu-noir': 31247,
  // fragrantica.com/perfume/Narciso-Rodriguez/Narciso-Rodriguez-for-Him-1063.html
  'narciso-rodriguez-for-him': 1063,

  // ── MONTALE ──
  // fragrantica.com/perfume/Montale/Intense-Cafe-18021.html
  'montale-intense-cafe': 18021,
  // fragrantica.com/perfume/Montale/Arabians-Tonka-57384.html
  'montale-arabians-tonka': 57384,
  // fragrantica.com/perfume/Montale/Dark-Aoud-12134.html
  'montale-dark-aoud': 12134,
  // fragrantica.com/perfume/Montale/Roses-Musk-1148.html
  'montale-roses-musk': 1148,

  // ── MUGLER ──
  // fragrantica.com/perfume/Mugler/Alien-Goddess-68354.html
  'alien-goddess-mugler': 68354,
  // fragrantica.com/perfume/Mugler/Aura-Mugler-45639.html
  'mugler-aura': 45639,
  // fragrantica.com/perfume/Mugler/Alien-Goddess-Intense-74871.html
  'mugler-alien-goddess-intense': 74871,
  // fragrantica.com/perfume/Mugler/Innocent-709.html
  'mugler-innocent': 709,
  'thierry-mugler-innocent': 709,
  // fragrantica.com/perfume/Mugler/Alien-707.html
  'thierry-mugler-alien-homme': 707,

  // ── VALENTINO ──
  // fragrantica.com/perfume/Valentino/Valentino-Uomo-Intense-38254.html
  'valentino-uomo-intense': 38254,
  // fragrantica.com/perfume/Valentino/Voce-Viva-62754.html
  'valentino-voce-viva': 62754,
  // fragrantica.com/perfume/Valentino/Valentino-Donna-31411.html
  'valentino-donna': 31411,

  // ── CREED ──
  // fragrantica.com/perfume/Creed/Royal-Oud-12317.html
  'creed-royal-oud': 12317,
  // fragrantica.com/perfume/Creed/Silver-Mountain-Water-472.html
  'creed-silver-mountain-water': 472,
  // fragrantica.com/perfume/Creed/Millesime-Imperial-466.html
  'creed-millesime-imperial': 466,
  // fragrantica.com/perfume/Creed/Green-Irish-Tweed-474.html
  'creed-green-irish-tweed': 474,

  // ── CARTIER ──
  // fragrantica.com/perfume/Cartier/Baiser-Vole-12878.html
  'cartier-baiser-vole': 12878,
  // fragrantica.com/perfume/Cartier/Declaration-d-Un-Soir-15462.html
  'cartier-declaration-d-un-soir': 15462,
  // fragrantica.com/perfume/Cartier/La-Panthere-23295.html
  'cartier-la-panthere': 23295,
  // fragrantica.com/perfume/Cartier/Pasha-Cartier-315.html
  'pasha-cartier-homme': 315,

  // ── COACH ──
  // fragrantica.com/perfume/Coach/Coach-Wild-Rose-72051.html
  'coach-wild-rose': 72051,
  // fragrantica.com/perfume/Coach/Coach-Dreams-58846.html
  'coach-dreams': 58846,

  // ── DIOR ──
  // fragrantica.com/perfume/Dior/Dior-Addict-215.html
  'dior-addict': 215,

  // ── PACO RABANNE ──
  // fragrantica.com/perfume/Rabanne/Fame-74962.html
  'fame-paco-rabanne': 74962,
  // fragrantica.com/perfume/Rabanne/Pure-XS-46038.html
  'pure-xs-paco-rabanne': 46038,
  // fragrantica.com/perfume/Rabanne/Fame-Intense-89716.html
  'paco-rabanne-fame-intense': 89716,
  // fragrantica.com/perfume/Rabanne/Paco-Rabanne-Pour-Homme-526.html
  'paco-rabanne-pour-homme': 526,

  // ── LALIQUE ──
  // fragrantica.com/perfume/Lalique/Encre-Noire-1834.html
  'lalique-encre-noire': 1834,

  // ── MARC JACOBS ──
  // fragrantica.com/perfume/Marc-Jacobs/Lola-6166.html
  'marc-jacobs-lola': 6166,
  // fragrantica.com/perfume/Marc-Jacobs/Daisy-Eau-So-Fresh-10858.html
  'marc-jacobs-daisy-eau-so-fresh': 10858,
  // fragrantica.com/perfume/Marc-Jacobs/Daisy-Wild-89906.html
  'marc-jacobs-daisy-wild': 89906,
  // fragrantica.com/perfume/Marc-Jacobs/Dot-14781.html
  'marc-jacobs-dot': 14781,
  // fragrantica.com/perfume/Marc-Jacobs/Honey-18272.html
  'marc-jacobs-honey': 18272,

  // ── JIMMY CHOO ──
  // fragrantica.com/perfume/Jimmy-Choo/I-Want-Choo-64015.html
  'i-want-choo-jimmy-choo': 64015,
  // fragrantica.com/perfume/Jimmy-Choo/Jimmy-Choo-Blossom-29165.html
  'jimmy-choo-blossom': 29165,
  // fragrantica.com/perfume/Jimmy-Choo/Illicit-31233.html
  'jimmy-choo-illicit': 31233,
  // fragrantica.com/perfume/Jimmy-Choo/Jimmy-Choo-Man-Blue-49723.html
  'jimmy-choo-man-blue': 49723,
  // fragrantica.com/perfume/Jimmy-Choo/Jimmy-Choo-Floral-53143.html
  'jimmy-choo-floral': 53143,

  // ── LOLITA LEMPICKA ──
  // fragrantica.com/perfume/Lolita-Lempicka/Lolita-Lempicka-456.html
  'lolita-lempicka': 456,
  // fragrantica.com/perfume/Lolita-Lempicka/Lolita-Lempicka-Au-Masculin-458.html
  'lolita-lempicka-au-masculin': 458,

  // ── DIESEL ──
  // fragrantica.com/perfume/Diesel/Only-The-Brave-5532.html
  'diesel-only-the-brave': 5532,
  // fragrantica.com/perfume/Diesel/Only-The-Brave-Tattoo-14383.html
  'diesel-only-the-brave-tatoo': 14383,

  // ── JOOP ──
  // fragrantica.com/perfume/Joop/Joop-Homme-1251.html
  'joop-homme': 1251,

  // ── ARMAF ──
  // fragrantica.com/perfume/Armaf/Club-de-Nuit-Intense-Man-34696.html
  'club-de-nuit-intense-armaf': 34696,
  // fragrantica.com/perfume/Armaf/Club-de-Nuit-Woman-27655.html
  'club-de-nuit-women-armaf': 27655,
  // fragrantica.com/perfume/Armaf/Club-de-Nuit-Intense-27656.html
  'armaf-club-de-nuit-intense-femme': 27656,

  // ── RASASI ──
  // fragrantica.com/perfume/Rasasi/La-Yuqawam-Homme-19668.html
  'la-yuqawam-rasasi-homme': 19668,
  // fragrantica.com/perfume/Rasasi/La-Yuqawam-Femme-19669.html
  'la-yuqawam-rasasi-femme': 19669,

  // ── ARABIAN OUD ──
  // fragrantica.com/perfume/Arabian-Oud/Kalemat-21623.html
  'kalemat-arabian-oud': 21623,

  // ── MANCERA ──
  // fragrantica.com/perfume/Mancera/Cedrat-Boise-15211.html
  'mancera-cedrat-boise': 15211,
  // fragrantica.com/perfume/Mancera/Roses-Vanille-15210.html
  'mancera-roses-vanille': 15210,
  // fragrantica.com/perfume/Mancera/Instant-Crush-54885.html
  'mancera-instant-crush': 54885,
  // fragrantica.com/perfume/Mancera/Hindu-Kush-49030.html
  'mancera-hindu-kush': 49030,

  // ── PARFUMS DE MARLY ──
  // fragrantica.com/perfume/Parfums-de-Marly/Percival-51037.html
  'percival-parfums-de-marly': 51037,
  // fragrantica.com/perfume/Parfums-de-Marly/Herod-16939.html
  'herod-parfums-de-marly': 16939,

  // ── AMOUAGE ──
  // fragrantica.com/perfume/Amouage/Interlude-Man-15294.html
  'amouage-interlude-man': 15294,

  // ── HERMÈS ──
  // fragrantica.com/perfume/Hermes/Terre-d-Hermes-17.html
  'terre-d-hermes': 17,
  // fragrantica.com/perfume/Hermes/Terre-D-Hermes-Eau-Intense-Vetiver-50672.html
  'hermes-eau-intense-vetiver': 50672,

  // ── GIORGIO ARMANI ──
  // fragrantica.com/perfume/Giorgio-Armani/Acqua-di-Gio-Profondo-59532.html
  'acqua-di-gio-profondo-armani': 59532,
  // fragrantica.com/perfume/Giorgio-Armani/Acqua-di-Gioia-8442.html
  'acqua-di-gio-femme-armani': 8442,

  // ── MONTBLANC ──
  // fragrantica.com/perfume/Montblanc/Explorer-Ultra-Blue-66266.html
  'mont-blanc-explorer-ultra-blue': 66266,

  // ── CHANEL ──
  // fragrantica.com/perfume/Chanel/Egoiste-613.html
  'egoiste-chanel': 613,

  // ── ZADIG & VOLTAIRE ──
  // fragrantica.com/perfume/Zadig-Voltaire/This-is-Him-39359.html
  'zadig-voltaire-this-is-him': 39359,

  // ── BVLGARI ──
  // fragrantica.com/perfume/Bvlgari/Bvlgari-Man-Wood-Neroli-55688.html
  'bvlgari-man-wood-neroli': 55688,
  // fragrantica.com/perfume/Bvlgari/Pour-Femme-Soir-??? (need to verify)

  // ── JO MALONE ──
  // fragrantica.com/perfume/Jo-Malone-London/English-Pear-Freesia-10314.html
  'jo-malone-english-pear': 10314,

  // ── ELIZABETH ARDEN ──
  // fragrantica.com/perfume/Elizabeth-Arden/Green-Tea-83.html
  'elizabeth-arden-green-tea': 83,
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
    failed.push({ slug, id });
    fail++;
  }
  await sleep(250);
}

console.log(`\n📊 Résultat: ✅ ${ok} téléchargées, ⏭ ${skip} existantes, ❌ ${fail} échouées`);
if (failed.length) console.log('Échecs:', failed.map(f => f.slug).join(', '));
