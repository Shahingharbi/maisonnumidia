/**
 * Re-download all product images with correct Fragrantica IDs
 * Usage: node scripts/fix-images.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "public", "images", "products");
mkdirSync(OUTPUT_DIR, { recursive: true });

// slug → correct Fragrantica numeric ID
const FRAGRANTICA_IDS = {
  "dior-sauvage":                              48100,
  "bleu-de-chanel":                            25967,
  "scandal-jean-paul-gaultier":                45651,
  "scandal-pour-homme-jean-paul-gaultier":     74915,
  "le-male-jean-paul-gaultier":                61856,
  "black-opium-ysl":                           25324,
  "libre-ysl":                                 56077,
  "good-girl-carolina-herrera":                39681,
  "invictus-paco-rabanne":                     18471,
  "1-million-paco-rabanne":                    3747,
  "delina-parfums-de-marly":                   43871,
  "born-in-roma-valentino":                    55805,
  "kayali-eden":                               70875,
  "coco-mademoiselle-chanel":                  611,
  "armani-code":                               65581,
  "hugo-boss-bottled":                         383,
  "versace-eros":                              16657,
  "narciso-rodriguez-for-her":                 14319,
  "la-vie-est-belle-lancome":                  14982,
  "lattafa-oud-mood":                          46814,
  "amber-oud-al-haramain":                     51816,
  "lattafa-asad":                              72821,
  "idole-lancome":                             55795,
  "franck-olivier":                            6872,
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = https;
    const req = client.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        "Referer": "https://www.fragrantica.com/",
      },
      timeout: 20000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        writeFileSync(dest, buf);
        resolve(buf.length);
      });
      res.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function main() {
  const entries = Object.entries(FRAGRANTICA_IDS);
  console.log(`\n📦 Téléchargement de ${entries.length} images avec les bons IDs Fragrantica...\n`);

  const failed = [];

  for (const [slug, id] of entries) {
    const url = `https://fimgs.net/mdimg/perfume/375x500.${id}.jpg`;
    const dest = join(OUTPUT_DIR, `${slug}.jpg`);

    try {
      const size = await download(url, dest);
      console.log(`  ✓ ${slug} (ID ${id}) — ${(size/1024).toFixed(0)}KB`);
    } catch (err) {
      console.error(`  ✗ ${slug} (ID ${id}): ${err.message}`);
      failed.push({ slug, id, url });
    }
  }

  if (failed.length > 0) {
    console.log(`\n❌ Échecs (${failed.length}):`);
    for (const f of failed) console.log(`   ${f.slug}: ${f.url}`);
  } else {
    console.log(`\n✅ Toutes les images téléchargées avec succès.`);
  }
}

main().catch(console.error);
