/**
 * Correction des images batch3 — IDs Fragrantica vérifiés sur fragrantica.com
 */
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'public', 'images', 'products');
mkdirSync(OUTPUT_DIR, { recursive: true });

// IDs vérifiés sur fragrantica.com
const fragranticaMap = {
  "guerlain-shalimar":           "53",     // Shalimar EDP — fragrantica.com/perfume/Guerlain/Shalimar-Eau-de-Parfum-53.html
  "louis-vuitton-ombre-nomade":  "49755",  // Ombre Nomade — fragrantica.com/perfume/Louis-Vuitton/Ombre-Nomade-49755.html
  "bombshell-victoria-secret":   "38144",  // Bombshell EDP — fragrantica.com/perfume/Victoria-s-Secret/Bombshell-Eau-de-Parfum-38144.html
  "madawi-al-haramain":          "51307",  // Madawi (Arabian Oud) — fragrantica.com/perfume/Arabian-Oud/Madawi-51307.html
  "antonio-banderas-the-secret": "8923",   // The Secret — fragrantica.com/perfume/Antonio-Banderas/The-Secret-8923.html
  "shakira-dance":               "40058",  // Dance — fragrantica.com/perfume/Shakira/Dance-40058.html
  "pierre-cardin-pour-monsieur": "2599",   // Pour Monsieur — fragrantica.com/perfume/Pierre-Cardin/Pierre-Cardin-Pour-Monsieur-2599.html
  "whisky-silver-evaflor":       "22284",  // Whisky Silver — fragrantica.com/perfume/Evaflor/Whisky-Silver-22284.html
  "xerjoff-naxos":               "30529",  // XJ 1861 Naxos — fragrantica.com/perfume/Xerjoff/XJ-1861-Naxos-30529.html
  "roja-dove-elysium":           "47480",  // Elysium PH Parfum — fragrantica.com/perfume/Roja-Dove/Elysium-Pour-Homme-Parfum-47480.html
  "zara-rose-gold":              "38022",  // Rose Gold 2016 — fragrantica.com/perfume/Zara/Zara-Woman-Rose-Gold-2016-38022.html
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
  console.log(`\n📦 Re-téléchargement de ${slugs.length} images corrigées...\n`);
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
