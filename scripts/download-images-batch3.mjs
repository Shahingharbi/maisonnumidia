/**
 * Téléchargement des images pour les produits des batches F-G
 */
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'public', 'images', 'products');
mkdirSync(OUTPUT_DIR, { recursive: true });

const fragranticaMap = {
  // Batch F
  "guerlain-shalimar":           "5",
  "tom-ford-black-orchid":       "3723",
  "baccarat-rouge-540":          "38423",
  "pegasus-parfums-de-marly":    "39315",
  "bombshell-victoria-secret":   "13109",
  "madawi-al-haramain":          "62234",
  "antonio-banderas-the-secret": "11962",
  "shakira-dance":               "14729",
  "pierre-cardin-pour-monsieur": "284",
  "whisky-silver-evaflor":       "1892",
  // Batch G
  "louis-vuitton-ombre-nomade":  "58498",
  "xerjoff-naxos":               "41745",
  "roja-dove-elysium":           "43124",
  "adopt-narcotique":            "71853",
  "zara-rose-gold":              "82451",
  "sultan-al-oud":               "62235",
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (existsSync(dest)) {
      console.log(`  ✓ Déjà présent : ${dest.split(/[\\/]/).pop()}`);
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
        console.log(`  ↓ ${dest.split(/[\\/]/).pop()} (${(buf.length / 1024).toFixed(0)}KB)`);
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
