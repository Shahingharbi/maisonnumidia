/**
 * Téléchargement des images pour les produits des batches A-E
 * Fragrantica CDN : https://fimgs.net/mdimg/perfume/375x500.{ID}.jpg
 */
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'public', 'images', 'products');
mkdirSync(OUTPUT_DIR, { recursive: true });

// Slug → Fragrantica ID
const fragranticaMap = {
  // Batch A
  "evidence-yves-rocher":          "3381",
  "oxygene-lanvin":                "990",
  "libre-le-parfum-ysl":           "75676",
  "amouage-reflection":            "920",
  "jimmy-choo-femme":              "10573",
  "ck-one":                        "276",
  "chloe-signature":               "1733",
  "armani-si":                     "18453",
  "dior-jadore":                   "210",
  "givenchy-irresistible":         "60891",
  "eclat-arpege-lanvin":           "988",
  "marc-jacobs-daisy":             "1361",
  "nishane-ani":                   "54785",
  "creed-aventus":                 "9828",
  "stronger-with-you-intensely":   "52802",
  // Batch B
  "5th-avenue-elizabeth-arden":    "81",
  "mont-blanc-lady-emblem":        "31425",
  "joy-jean-patou":                "1436",
  "mauboussin-pour-elle":          "10585",
  "givenchy-l-interdit":           "51488",
  "givenchy-gentleman":            "48476",
  "azzaro-chrome":                 "788",
  "acqua-di-gio-armani":           "81508",
  "la-nuit-de-l-homme-ysl":        "10206",
  "layton-parfums-de-marly":       "39314",
  "mont-blanc-explorer":           "52002",
  "el-nabil-musc-makkah":          "59137",
  "davidoff-cool-water":           "507",
  "van-cleef-feerie":              "4077",
  "olympea-paco-rabanne":          "31666",
  // Batch C
  "euphoria-calvin-klein":         "253",
  "manifesto-ysl":                 "15540",
  "fahrenheit-dior":               "228",
  "azzaro-wanted":                 "38686",
  "yes-i-am-cacharel":             "48112",
  "this-is-her-zadig-voltaire":    "39358",
  "dolce-gabbana-the-one":         "698",
  "rasasi-hawas":                  "46890",
  "bvlgari-pour-homme-soir":       "770",
  "declaration-cartier":           "307",
  "habit-rouge-guerlain":          "25313",
  "lacoste-l12-noir":              "18274",
  "nautica-voyage":                "913",
  "spicebomb-viktor-rolf":         "13857",
  "ultra-male-jean-paul-gaultier": "30947",
  // Batch D
  "poison-girl-dior":              "35561",
  "hypnotic-poison-dior":          "219",
  "insolence-guerlain":            "4566",
  "kenzo-flower":                  "72",
  "la-belle-jean-paul-gaultier":   "55786",
  "lady-million-paco-rabanne":     "9045",
  "organza-givenchy":              "4",
  "gucci-flora-gorgeous":          "68578",
  "michael-kors-gorgeous":         "64629",
  "ralph-lauren-romance":          "825",
  "gris-dior":                     "48387",
  "drakkar-noir-guy-laroche":      "2069",
  "l-homme-ideal-guerlain":        "37735",
  "le-beau-jean-paul-gaultier":    "55785",
  // Batch E
  "mon-guerlain":                  "43297",
  "amor-amor-cacharel":            "238",
  "bonbon-viktor-rolf":            "23317",
  "miu-miu-l-eau":                 "31468",
  "mademoiselle-rochas":           "43205",
  "ange-ou-demon-givenchy":        "701",
  "goddess-burberry":              "83483",
  "l-eau-d-issey-femme":           "720",
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (existsSync(dest)) {
      console.log(`  ✓ Déjà présent : ${dest.split('\\').pop()}`);
      return resolve('skip');
    }
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://www.fragrantica.com/',
      },
      timeout: 20000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        writeFileSync(dest, buf);
        console.log(`  ↓ ${dest.split('\\').pop()} (${(buf.length / 1024).toFixed(0)}KB)`);
        resolve('downloaded');
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function main() {
  const slugs = Object.keys(fragranticaMap);
  console.log(`\n📦 Téléchargement de ${slugs.length} images...\n`);
  const failed = [];
  let downloaded = 0, skipped = 0;

  for (const slug of slugs) {
    const id = fragranticaMap[slug];
    const url = `https://fimgs.net/mdimg/perfume/375x500.${id}.jpg`;
    const dest = join(OUTPUT_DIR, `${slug}.jpg`);
    try {
      const result = await downloadFile(url, dest);
      if (result === 'skip') skipped++;
      else downloaded++;
    } catch (err) {
      console.error(`  ✗ ${slug}: ${err.message}`);
      failed.push({ slug, url, error: err.message });
    }
  }

  console.log(`\n✅ Téléchargés: ${downloaded} | Déjà présents: ${skipped} | Échecs: ${failed.length}`);
  if (failed.length > 0) {
    console.log('\n❌ Échecs :');
    failed.forEach(f => console.log(`   - ${f.slug}: ${f.error}\n     ${f.url}`));
  }
}

main().catch(console.error);
