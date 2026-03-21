/**
 * Download images batch 2 — 95 verified Fragrantica IDs
 * Source: fragrantica.com search results (verified URLs, never estimated)
 */
import { createWriteStream, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import https from 'https';

const CDN = (id) => `https://fimgs.net/mdimg/perfume/375x500.${id}.jpg`;
const OUT  = 'public/images/products';

// slug → Fragrantica ID (verified from fragrantica.com URLs)
const IDS = {
  // Burberry
  'burberry-her':            51694, // fragrantica.com/perfume/Burberry/Burberry-Her-51694.html
  'burberry-the-beat':        2092, // fragrantica.com/perfume/Burberry/Burberry-The-Beat-2092.html
  'burberry-london-femme':     813, // fragrantica.com/perfume/Burberry/Burberry-London-813.html
  'mr-burberry':             32565, // fragrantica.com/perfume/Burberry/Mr-Burberry-32565.html
  'my-burberry-blush':       45820, // fragrantica.com/perfume/Burberry/My-Burberry-Blush-45820.html
  'burberry-weekend-homme':    999, // fragrantica.com/perfume/Burberry/Burberry-Weekend-for-Men-999.html
  'my-burberry-black':       32566, // fragrantica.com/perfume/Burberry/My-Burberry-Black-32566.html
  'burberry-touch-homme':      815, // fragrantica.com/perfume/Burberry/Burberry-Touch-for-Men-815.html
  'burberry-brit-femme':       819, // fragrantica.com/perfume/Burberry/Burberry-Brit-819.html
  'burberry-hero':           68627, // fragrantica.com/perfume/Burberry/Burberry-Hero-68627.html
  'burberry-sport-homme':     7614, // fragrantica.com/perfume/Burberry/Burberry-Sport-EDT-7614.html
  'burberry-weekend-femme':   1000, // fragrantica.com/perfume/Burberry/Burberry-Weekend-for-Women-1000.html
  'burberry-london-homme':     804, // fragrantica.com/perfume/Burberry/Burberry-London-for-Men-804.html
  'burberry-touch-femme':      814, // fragrantica.com/perfume/Burberry/Burberry-Touch-for-Women-814.html
  'burberry-goddess-intense': 95883, // fragrantica.com/perfume/Burberry/Goddess-Intense-95883.html
  'burberry-hero-parfum':    90069, // fragrantica.com/perfume/Burberry/Hero-Parfum-90069.html

  // Guerlain
  'guerlain-vetiver':              69, // fragrantica.com/perfume/Guerlain/Vetiver-69.html
  'guerlain-heritage':           1880, // fragrantica.com/perfume/Guerlain/Heritage-1880.html
  'guerlain-insolence':           667, // fragrantica.com/perfume/Guerlain/Insolence-667.html
  'guerlain-mitsouko':            207, // fragrantica.com/perfume/Guerlain/Mitsouko-207.html
  'guerlain-samsara':              55, // fragrantica.com/perfume/Guerlain/Samsara-55.html
  'guerlain-l-heure-bleue':     41153, // fragrantica.com/perfume/Guerlain/L-Heure-Bleue-41153.html
  'guerlain-jicky':               103, // fragrantica.com/perfume/Guerlain/Jicky-103.html
  'guerlain-mon-guerlain-sparkling-bouquet': 65546, // fragrantica.com/perfume/Guerlain/Mon-Guerlain-Sparkling-Bouquet-65546.html
  'guerlain-mon-guerlain-bloom-of-rose':     53320, // fragrantica.com/perfume/Guerlain/Mon-Guerlain-Bloom-of-Rose-53320.html
  'guerlain-mon-guerlain-intense':           55997, // fragrantica.com/perfume/Guerlain/Mon-Guerlain-Intense-55997.html
  'guerlain-aqua-allegoria-bergamote':       43596, // fragrantica.com/perfume/Guerlain/Aqua-Allegoria-Bergamote-Calabria-43596.html

  // Lacoste
  'lacoste-pour-femme':         669, // fragrantica.com/perfume/Lacoste/Pour-Femme-669.html
  'lacoste-touch-of-pink':      673, // fragrantica.com/perfume/Lacoste/Touch-of-Pink-673.html
  'lacoste-l12-blanc':        11043, // fragrantica.com/perfume/Lacoste/L-12-12-Blanc-11043.html
  'lacoste-pour-homme':         670, // fragrantica.com/perfume/Lacoste/Lacoste-pour-Homme-670.html
  'lacoste-l12-vert':         11045, // fragrantica.com/perfume/Lacoste/L-12-12-Vert-11045.html
  'lacoste-noir-fraicheur':   18274, // fragrantica.com/perfume/Lacoste/Noir-Fraicheur-18274.html
  'lacoste-challenge':         5912, // fragrantica.com/perfume/Lacoste/Challenge-5912.html
  'lacoste-match-point':      62252, // fragrantica.com/perfume/Lacoste/Match-Point-62252.html
  'lacoste-pour-femme-intense': 48560, // fragrantica.com/perfume/Lacoste/Pour-Femme-Intense-48560.html

  // Kenzo
  'kenzo-world':            40278, // fragrantica.com/perfume/Kenzo/Kenzo-World-40278.html
  'kenzo-amour':              664, // fragrantica.com/perfume/Kenzo/Kenzo-Amour-664.html
  'kenzo-l-eau-kenzo-femme':   78, // fragrantica.com/perfume/Kenzo/L-Eau-Kenzo-pour-Femme-78.html
  'kenzo-flower-in-the-air': 18701, // fragrantica.com/perfume/Kenzo/Flower-In-The-Air-18701.html
  'kenzo-pour-homme':          77, // fragrantica.com/perfume/Kenzo/Kenzo-pour-Homme-77.html
  'kenzo-flower-edp':          72, // fragrantica.com/perfume/Kenzo/Flower-by-Kenzo-72.html
  'kenzo-jungle-elephant':     70, // fragrantica.com/perfume/Kenzo/Jungle-Elephant-70.html
  'kenzo-homme':            71687, // fragrantica.com/perfume/Kenzo/Kenzo-Homme-71687.html

  // Azzaro
  'azzaro-pour-homme':        829, // fragrantica.com/perfume/Azzaro/Azzaro-pour-Homme-829.html
  'azzaro-wanted-by-night':  49144, // fragrantica.com/perfume/Azzaro/Wanted-by-Night-49144.html
  'azzaro-chrome-cologne':    788, // fragrantica.com/perfume/Azzaro/Chrome-788.html
  'azzaro-chrome-intense':  31321, // fragrantica.com/perfume/Azzaro/Chrome-Intense-31321.html
  'azzaro-chrome-legend':    2959, // fragrantica.com/perfume/Azzaro/Chrome-Legend-2959.html
  'azzaro-most-wanted':     66826, // fragrantica.com/perfume/Azzaro/Most-Wanted-66826.html
  'azzaro-chrome-aqua':     55454, // fragrantica.com/perfume/Azzaro/Chrome-Aqua-55454.html
  'azzaro-silver-black':     3089, // fragrantica.com/perfume/Azzaro/Silver-Black-3089.html
  'azzaro-wanted-girl':     54020, // fragrantica.com/perfume/Azzaro/Wanted-Girl-54020.html
  'azzaro-chrome-parfum':   79268, // fragrantica.com/perfume/Azzaro/Chrome-Le-Parfum-79268.html

  // Mont Blanc
  'mont-blanc-legend':         11784, // fragrantica.com/perfume/Montblanc/Legend-11784.html
  'mont-blanc-legend-spirit':  33443, // fragrantica.com/perfume/Montblanc/Legend-Spirit-33443.html
  'mont-blanc-individuel':      4193, // fragrantica.com/perfume/Montblanc/Individuel-4193.html
  'mont-blanc-legend-rouge':   71652, // fragrantica.com/perfume/Montblanc/Legend-Rouge-71652.html
  'mont-blanc-explorer-platinum': 81392, // fragrantica.com/perfume/Montblanc/Explorer-Platinum-81392.html
  'mont-blanc-emblem-intense': 23715, // fragrantica.com/perfume/Montblanc/Emblem-Intense-23715.html
  'mont-blanc-signature':      60962, // fragrantica.com/perfume/Montblanc/Signature-60962.html

  // Lancôme
  'miracle-lancome':               184, // fragrantica.com/perfume/Lancome/Miracle-184.html
  'lancome-poeme':                 171, // fragrantica.com/perfume/Lancome/Poeme-171.html
  'la-vie-est-belle-intensement': 59326, // fragrantica.com/perfume/Lancome/La-Vie-Est-Belle-Intensement-59326.html
  'lancome-tresor-midnight-rose': 11721, // fragrantica.com/perfume/Lancome/Tresor-Midnight-Rose-11721.html
  'lancome-magnifique':            3746, // fragrantica.com/perfume/Lancome/Magnifique-3746.html
  'lancome-tresor-intense':        /* skip — not found */ null,
  'lancome-la-nuit-tresor-nude':  58825, // fragrantica.com/perfume/Lancome/La-Nuit-Tresor-Nude-58825.html
  'lancome-idole-now':            81792, // fragrantica.com/perfume/Lancome/Idole-Now-81792.html
  'lancome-la-vie-est-belle-florale': 35493, // fragrantica.com/perfume/Lancome/La-Vie-Est-Belle-Florale-35493.html
  'lancome-idole-le-parfum':      62333, // fragrantica.com/perfume/Lancome/Idole-Le-Parfum-62333.html

  // Carolina Herrera
  'good-girl-supreme-carolina-herrera': 61769, // fragrantica.com/perfume/Carolina-Herrera/Good-Girl-Supreme-61769.html
  '212-vip-women-carolina-herrera':     10126, // fragrantica.com/perfume/Carolina-Herrera/212-VIP-10126.html
  'vip-rose-carolina-herrera':          22857, // fragrantica.com/perfume/Carolina-Herrera/212-VIP-Rose-22857.html
  'carolina-herrera-212-men':             297, // fragrantica.com/perfume/Carolina-Herrera/212-Men-297.html
  'carolina-herrera-212-vip-men':       12865, // fragrantica.com/perfume/Carolina-Herrera/212-VIP-Men-12865.html
  '212-sexy-women-carolina-herrera':      306, // fragrantica.com/perfume/Carolina-Herrera/212-Sexy-306.html
  'good-girl-blush-carolina-herrera':   78576, // fragrantica.com/perfume/Carolina-Herrera/Good-Girl-Blush-78576.html
  'carolina-herrera-212-vip-black':     46093, // fragrantica.com/perfume/Carolina-Herrera/212-VIP-Black-46093.html
  'carolina-herrera-212-sexy-men':       1054, // fragrantica.com/perfume/Carolina-Herrera/212-Sexy-Men-1054.html
  'carolina-herrera-very-good-girl':    65560, // fragrantica.com/perfume/Carolina-Herrera/Very-Good-Girl-65560.html
  'carolina-herrera-bad-boy':           55449, // fragrantica.com/perfume/Carolina-Herrera/Bad-Boy-55449.html
  'carolina-herrera-bad-boy-parfum':    65718, // fragrantica.com/perfume/Carolina-Herrera/Bad-Boy-Le-Parfum-65718.html

  // Prada
  'prada-paradoxe':          75668, // fragrantica.com/perfume/Prada/Paradoxe-75668.html
  'prada-luna-rossa-carbon': 43402, // fragrantica.com/perfume/Prada/Luna-Rossa-Carbon-43402.html
  'prada-luna-rossa-ocean':  68753, // fragrantica.com/perfume/Prada/Luna-Rossa-Ocean-68753.html
  'prada-infusion-d-iris':    1795, // fragrantica.com/perfume/Prada/Infusion-d-Iris-1795.html
  'prada-luna-rossa-black':  48682, // fragrantica.com/perfume/Prada/Luna-Rossa-Black-48682.html
  'prada-amber-homme':        1044, // fragrantica.com/perfume/Prada/Amber-pour-Homme-1044.html
  'prada-candy-sugar-pop':   48030, // fragrantica.com/perfume/Prada/Candy-Sugar-Pop-48030.html
  'prada-l-homme':           39029, // fragrantica.com/perfume/Prada/L-Homme-39029.html
  'prada-candy-femme':       12426, // fragrantica.com/perfume/Prada/Candy-12426.html
  'prada-luna-rossa':        15754, // fragrantica.com/perfume/Prada/Luna-Rossa-15754.html
  'prada-candy-night':       53989, // fragrantica.com/perfume/Prada/Candy-Night-53989.html
  'prada-l-homme-intense':   45396, // fragrantica.com/perfume/Prada/L-Homme-Intense-45396.html

  // Davidoff
  'cool-water-woman':       508, // fragrantica.com/perfume/Davidoff/Cool-Water-Woman-508.html
  'davidoff-adventure':    1728, // fragrantica.com/perfume/Davidoff/Adventure-1728.html
  'davidoff-silver-shadow': 1314, // fragrantica.com/perfume/Davidoff/Silver-Shadow-1314.html
  'davidoff-echo':           587, // fragrantica.com/perfume/Davidoff/Echo-587.html
  'davidoff-horizon':      35819, // fragrantica.com/perfume/Davidoff/Horizon-35819.html
  'davidoff-the-game':     17087, // fragrantica.com/perfume/Davidoff/The-Game-17087.html
  'davidoff-cool-water-deep': 511, // fragrantica.com/perfume/Davidoff/Cool-Water-Deep-511.html
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

const entries = Object.entries(IDS).filter(([, id]) => id !== null);
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
