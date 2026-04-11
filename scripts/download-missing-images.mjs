import { writeFileSync, existsSync, mkdirSync } from 'fs';
import https from 'https';
import http from 'http';
import { dirname } from 'path';

// Images manquantes — IDs vérifiés sur Fragrantica (avril 2026)
// Chaque entrée : [slug, fragranticaId, sourceUrl]
const images = [
  // === GRANDES MAISONS ===
  ['dior-joy-intense', 56214, 'https://www.fragrantica.com/perfume/Dior/Joy-by-Dior-Intense-56214.html'],
  ['cartier-carat', 50748, 'https://www.fragrantica.com/perfume/Cartier/Carat-50748.html'],
  ['armani-my-way-intense', 68596, 'https://www.fragrantica.com/perfume/Giorgio-Armani/My-Way-Intense-68596.html'],
  ['valentino-voce-viva-intense', 68560, 'https://www.fragrantica.com/perfume/Valentino/Voce-Viva-Intensa-68560.html'],
  ['narciso-rodriguez-for-her-edp-rouge', 14319, 'https://www.fragrantica.com/perfume/Narciso-Rodriguez/Narciso-Rodriguez-for-Her-Eau-de-Parfum-14319.html'],
  ['issey-miyake-l-eau-d-issey-ambre', 42055, 'https://www.fragrantica.com/perfume/Issey-Miyake/L-Eau-d-Issey-Pour-Homme-Noir-Ambre-42055.html'],
  ['carolina-herrera-212-men-edp', 12865, 'https://www.fragrantica.com/perfume/Carolina-Herrera/212-VIP-Men-12865.html'],
  ['lancome-la-nuit-tresor-nu', 58825, 'https://www.fragrantica.com/perfume/Lancome/La-Nuit-Tresor-Nude-58825.html'],
  ['paco-rabanne-pure-xs-femme', 51424, 'https://www.fragrantica.com/perfume/Rabanne/Pure-XS-For-Her-51424.html'],
  ['kenzo-flower-eau-de-vie', 53148, 'https://www.fragrantica.com/perfume/Kenzo/Flower-by-Kenzo-Eau-de-Vie-53148.html'],
  ['moschino-toy-2', 51589, 'https://www.fragrantica.com/perfume/Moschino/Toy-2-51589.html'],
  ['ralph-lauren-polo-green', 890, 'https://www.fragrantica.com/perfume/Ralph-Lauren/Polo-890.html'],
  ['hermes-h24-intense', 75811, 'https://www.fragrantica.com/perfume/Hermes/H24-Eau-de-Parfum-75811.html'],
  ['bvlgari-pour-femme-soir', 43948, 'https://www.fragrantica.com/perfume/Bvlgari/Splendida-Jasmin-Noir-43948.html'],

  // === NICHE ===
  ['chloe-atelier-des-fleurs-cedrus', 57246, 'https://www.fragrantica.com/perfume/Chloe/Cedrus-57246.html'],
  ['acqua-di-parma-colonia', 1681, 'https://www.fragrantica.com/perfume/Acqua-di-Parma/Acqua-di-Parma-Colonia-1681.html'],
  ['acqua-di-parma-magnolia-nobile', 6483, 'https://www.fragrantica.com/perfume/Acqua-di-Parma/Acqua-di-Parma-Magnolia-Nobile-6483.html'],
  ['amouage-dia-homme', 1110, 'https://www.fragrantica.com/perfume/Amouage/Dia-Man-1110.html'],
  ['amouage-lyric-femme', 4623, 'https://www.fragrantica.com/perfume/Amouage/Lyric-Woman-4623.html'],
  ['amouage-beloved-homme', 17726, 'https://www.fragrantica.com/perfume/Amouage/Beloved-Man-17726.html'],
  ['serge-lutens-feminite-du-bois', 5749, 'https://www.fragrantica.com/perfume/Serge-Lutens/Feminite-du-Bois-5749.html'],
  ['mancera-black-to-musk', 36533, 'https://www.fragrantica.com/perfume/Mancera/Black-to-Black-36533.html'],

  // === ORIENTAUX ===
  ['afnan-9pm', 65414, 'https://www.fragrantica.com/perfume/Afnan/9pm-65414.html'],
  ['afnan-supremacy-noir', 40683, 'https://www.fragrantica.com/perfume/Afnan/Supremacy-Noir-40683.html'],
  ['ajmal-aurum', 14028, 'https://www.fragrantica.com/perfume/Ajmal/Aurum-14028.html'],
  ['ajmal-wisal', 15109, 'https://www.fragrantica.com/perfume/Ajmal/Wisal-15109.html'],
  ['al-haramain-amber-oud-bleu', 73206, 'https://www.fragrantica.com/perfume/Al-Haramain-Perfumes/Amber-Oud-Bleu-Edition-73206.html'],
  ['al-haramain-rose-d-arabie', 120166, 'https://www.fragrantica.com/perfume/Al-Haramain-Perfumes/Rose-Oud-120166.html'],
  ['lattafa-ejaazi', 68228, 'https://www.fragrantica.com/perfume/Lattafa-Perfumes/Ejaazi-68228.html'],
  ['lattafa-bade-al-oud', 64948, 'https://www.fragrantica.com/perfume/Lattafa-Perfumes/Bade-e-Al-Oud-Oud-for-Glory-64948.html'],
  ['lattafa-fakhar-homme', 70465, 'https://www.fragrantica.com/perfume/Lattafa-Perfumes/Fakhar-Black-70465.html'],
  ['lattafa-oud-mood-noir', 46814, 'https://www.fragrantica.com/perfume/Lattafa-Perfumes/Oud-Mood-46814.html'],
  ['orientica-oud-saffron', 69452, 'https://www.fragrantica.com/perfume/Orientica/Oud-Saffron-69452.html'],
  ['rasasi-daris', 19688, 'https://www.fragrantica.com/perfume/Rasasi/Daarej-pour-Homme-19688.html'],

  // === CLASSIQUES / CELEBRITY ===
  ['cerruti-1881-homme', 329, 'https://www.fragrantica.com/perfume/Cerruti/1881-Men-329.html'],
  ['cerruti-1881-femme', 327, 'https://www.fragrantica.com/perfume/Cerruti/1881-327.html'],
  ['chopard-wish', 353, 'https://www.fragrantica.com/perfume/Chopard/Wish-353.html'],
  ['chopard-casmir', 348, 'https://www.fragrantica.com/perfume/Chopard/Casmir-348.html'],
  ['elizabeth-taylor-white-diamonds', 887, 'https://www.fragrantica.com/perfume/Elizabeth-Taylor/White-Diamonds-887.html'],
  ['trussardi-donna', 13066, 'https://www.fragrantica.com/perfume/Trussardi/Trussardi-Donna-2011-13066.html'],
  ['trussardi-riflesso', 46287, 'https://www.fragrantica.com/perfume/Trussardi/Riflesso-46287.html'],
  ['karl-lagerfeld-classic', 1309, 'https://www.fragrantica.com/perfume/Karl-Lagerfeld/Lagerfeld-Classic-1309.html'],
  ['nikos-sculpture-homme', 925, 'https://www.fragrantica.com/perfume/Nikos/Sculpture-Homme-925.html'],
  ['nikos-sculpture-femme', 924, 'https://www.fragrantica.com/perfume/Nikos/Sculpture-924.html'],
  ['ungaro-feminin', 25582, 'https://www.fragrantica.com/perfume/Emanuel-Ungaro/Ungaro-Feminin-25582.html'],
  ['st-dupont-noir', 981, 'https://www.fragrantica.com/perfume/S-T-Dupont/S-T-Dupont-Noir-981.html'],
  ['britney-spears-curious', 141, 'https://www.fragrantica.com/perfume/Britney-Spears/Curious-141.html'],
  ['jennifer-lopez-glow', 869, 'https://www.fragrantica.com/perfume/Jennifer-Lopez/Glow-869.html'],
  ['beyonce-heat', 7745, 'https://www.fragrantica.com/perfume/Beyonce/Heat-7745.html'],
  ['paris-hilton-paris-hilton', 1434, 'https://www.fragrantica.com/perfume/Paris-Hilton/Paris-Hilton-1434.html'],
  ['boucheron-femme', 133, 'https://www.fragrantica.com/perfume/Boucheron/Boucheron-133.html'],
  ['boucheron-homme', 132, 'https://www.fragrantica.com/perfume/Boucheron/Boucheron-Pour-Homme-132.html'],
  ['van-cleef-arpels-first', 776, 'https://www.fragrantica.com/perfume/Van-Cleef-Arpels/First-776.html'],
  ['kate-spade-live-colorfully', 17492, 'https://www.fragrantica.com/perfume/Kate-Spade/Live-Colorfully-17492.html'],
  ['kate-spade-in-full-bloom', 48683, 'https://www.fragrantica.com/perfume/Kate-Spade/In-Full-Bloom-48683.html'],
  ['anna-sui-dolly-girl', 2083, 'https://www.fragrantica.com/perfume/Anna-Sui/Dolly-Girl-2083.html'],
  ['dkny-golden-delicious', 10914, 'https://www.fragrantica.com/perfume/Donna-Karan/DKNY-Golden-Delicious-10914.html'],
  ['michael-kors-sexy-amber', 18161, 'https://www.fragrantica.com/perfume/Michael-Kors/Sexy-Amber-18161.html'],
  ['michael-kors-gold', 13088, 'https://www.fragrantica.com/perfume/Michael-Kors/Gold-13088.html'],
  ['mariah-carey-forever', 6693, 'https://www.fragrantica.com/perfume/Mariah-Carey/Forever-6693.html'],
  ['escada-magnetism', 1036, 'https://www.fragrantica.com/perfume/Escada/Escada-Magnetism-1036.html'],
  ['escada-joyful', 25459, 'https://www.fragrantica.com/perfume/Escada/Joyful-25459.html'],
  ['rochas-byzance', 57842, 'https://www.fragrantica.com/perfume/Rochas/Byzance-2019-57842.html'],
  ['roberto-cavalli-just-cavalli-femme', 847, 'https://www.fragrantica.com/perfume/Roberto-Cavalli/Just-Cavalli-Her-847.html'],
  ['nina-ricci-coeur-joie', 2391, 'https://www.fragrantica.com/perfume/Nina-Ricci/Coeur-Joie-2391.html'],
  ['rose-gold-zara-intense', 67803, 'https://www.fragrantica.com/perfume/Zara/Zara-Woman-Rose-Gold-2021-67803.html'],
  ['franck-olivier-club-night', 39763, 'https://www.fragrantica.com/perfume/Franck-Olivier/Night-Touch-39763.html'],
];

const DIR = 'public/images/products';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 2000) {
          return reject(new Error(`Too small (${buf.length}b) — probably not a real image`));
        }
        writeFileSync(dest, buf);
        resolve(buf.length);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });

  let ok = 0, fail = 0, skip = 0;

  for (const [slug, fid, source] of images) {
    const dest = `${DIR}/${slug}.jpg`;
    if (existsSync(dest)) {
      console.log(`⏭ SKIP ${slug} (already exists)`);
      skip++;
      continue;
    }
    const url = `https://fimgs.net/mdimg/perfume/375x500.${fid}.jpg`;
    try {
      const size = await download(url, dest);
      console.log(`✅ ${slug} — ${(size/1024).toFixed(0)} KB (ID ${fid})`);
      ok++;
    } catch (e) {
      console.error(`❌ ${slug} — ${e.message}`);
      fail++;
    }
    // Petit délai pour ne pas flood le CDN
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n=== RÉSULTAT ===`);
  console.log(`✅ Téléchargés : ${ok}`);
  console.log(`❌ Échoués : ${fail}`);
  console.log(`⏭ Déjà présents : ${skip}`);
  console.log(`Total images manquantes restantes : ${95 - ok - skip} (produits sans correspondance Fragrantica)`);
}

main().catch(console.error);
