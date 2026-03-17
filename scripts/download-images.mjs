/**
 * Script de téléchargement des images produits depuis les URLs définies dans products.json
 * Usage : node scripts/download-images.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(ROOT, "public", "images", "products");

// Ensure output dir exists
mkdirSync(OUTPUT_DIR, { recursive: true });

const { products } = JSON.parse(readFileSync(join(ROOT, "data", "products.json"), "utf-8"));

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (existsSync(dest)) {
      console.log(`  ✓ Déjà téléchargé : ${dest.split("/").pop()}`);
      return resolve();
    }

    const client = url.startsWith("https") ? https : http;
    const file = { data: [] };

    const req = client.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        "Referer": "https://www.fragrantica.com/",
      },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          return downloadFile(redirectUrl, dest).then(resolve).catch(reject);
        }
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} pour ${url}`));
        return;
      }

      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buffer = Buffer.concat(chunks);
        writeFileSync(dest, buffer);
        console.log(`  ↓ Téléchargé : ${dest.split("/").pop()} (${(buffer.length / 1024).toFixed(0)}KB)`);
        resolve();
      });
      res.on("error", reject);
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Timeout pour ${url}`));
    });
  });
}

async function main() {
  console.log(`\n📦 Téléchargement de ${products.length} images produits...\n`);

  const results = { success: [], failed: [] };

  for (const product of products) {
    if (!product.image) {
      console.log(`  ⚠ Pas d'image pour : ${product.slug}`);
      continue;
    }

    const url = product.image;
    // Derive filename from slug
    const ext = url.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i)?.[1] || "jpg";
    const filename = `${product.slug}.${ext}`;
    const dest = join(OUTPUT_DIR, filename);

    try {
      await downloadFile(url, dest);
      results.success.push(product.slug);
    } catch (err) {
      console.error(`  ✗ Erreur ${product.slug}: ${err.message}`);
      results.failed.push({ slug: product.slug, url, error: err.message });
    }
  }

  console.log(`\n✅ Succès : ${results.success.length}/${products.length}`);
  if (results.failed.length > 0) {
    console.log(`\n❌ Échecs (${results.failed.length}):`);
    for (const f of results.failed) {
      console.log(`   - ${f.slug}: ${f.error}`);
      console.log(`     URL: ${f.url}`);
    }
  }
}

main().catch(console.error);
