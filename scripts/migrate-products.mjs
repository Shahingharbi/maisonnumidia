/**
 * Migration script: fix slugs, names, H1s, prices, image paths
 * Usage: node scripts/migrate-products.mjs
 */
import { readFileSync, writeFileSync, renameSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PRODUCTS_PATH = join(ROOT, "data", "products.json");
const IMAGES_DIR = join(ROOT, "public", "images", "products");

// ─── SLUG MIGRATION MAP ──────────────────────────────────────────────────────
// oldSlug → { newSlug, name (clean, no EDP/EDT/ml), h1 (exact keyword for page), price, originalPrice?, concentration }
const MIGRATION = {
  "dior-sauvage-edp-100ml": {
    newSlug: "dior-sauvage",
    name: "Sauvage",
    h1: "Dior Sauvage — Parfum Homme en Algérie",
    price: 15900,
    originalPrice: 18500,
    concentration: "EDP",
    volume: "100ml",
  },
  "chanel-bleu-edp-100ml": {
    newSlug: "bleu-de-chanel",
    name: "Bleu de Chanel",
    h1: "Bleu de Chanel — Parfum Homme en Algérie",
    price: 16500,
    originalPrice: 19200,
    concentration: "EDP",
    volume: "100ml",
  },
  "scandal-jean-paul-gaultier-edp-80ml": {
    newSlug: "scandal-jean-paul-gaultier",
    name: "Scandal",
    h1: "Scandal Jean Paul Gaultier — Parfum Femme en Algérie",
    price: 13900,
    originalPrice: 16500,
    concentration: "EDP",
    volume: "80ml",
  },
  "scandal-pour-homme-jean-paul-gaultier-edp-100ml": {
    newSlug: "scandal-pour-homme-jean-paul-gaultier",
    name: "Scandal Pour Homme",
    h1: "Scandal Pour Homme Jean Paul Gaultier — Parfum en Algérie",
    price: 13900,
    originalPrice: null,
    concentration: "EDP",
    volume: "100ml",
  },
  "le-male-jean-paul-gaultier-edp-125ml": {
    newSlug: "le-male-jean-paul-gaultier",
    name: "Le Male",
    h1: "Le Male Jean Paul Gaultier — Parfum Homme en Algérie",
    price: 13200,
    originalPrice: null,
    concentration: "EDP",
    volume: "125ml",
  },
  "ysl-black-opium-edp-90ml": {
    newSlug: "black-opium-ysl",
    name: "Black Opium",
    h1: "Black Opium YSL — Parfum Femme en Algérie",
    price: 15200,
    originalPrice: 17800,
    concentration: "EDP",
    volume: "90ml",
  },
  "libre-ysl-edp-90ml": {
    newSlug: "libre-ysl",
    name: "Libre",
    h1: "Libre YSL — Parfum Femme en Algérie",
    price: 15200,
    originalPrice: null,
    concentration: "EDP",
    volume: "90ml",
  },
  "good-girl-carolina-herrera-edp-80ml": {
    newSlug: "good-girl-carolina-herrera",
    name: "Good Girl",
    h1: "Good Girl Carolina Herrera — Parfum Femme en Algérie",
    price: 13900,
    originalPrice: 16200,
    concentration: "EDP",
    volume: "80ml",
  },
  "invictus-paco-rabanne-edp-100ml": {
    newSlug: "invictus-paco-rabanne",
    name: "Invictus",
    h1: "Invictus Paco Rabanne — Parfum Homme en Algérie",
    price: 12900,
    originalPrice: 14900,
    concentration: "EDT",
    volume: "100ml",
  },
  "one-million-paco-rabanne-edp-100ml": {
    newSlug: "1-million-paco-rabanne",
    name: "1 Million",
    h1: "1 Million Paco Rabanne — Parfum Homme en Algérie",
    price: 12900,
    originalPrice: null,
    concentration: "EDT",
    volume: "100ml",
  },
  "delina-parfums-de-marly-edp-75ml": {
    newSlug: "delina-parfums-de-marly",
    name: "Delina",
    h1: "Delina Parfums de Marly — Parfum Niche en Algérie",
    price: 38500,
    originalPrice: null,
    concentration: "EDP",
    volume: "75ml",
  },
  "valentino-born-in-roma-edp-100ml": {
    newSlug: "born-in-roma-valentino",
    name: "Born in Roma",
    h1: "Born in Roma Valentino — Parfum Femme en Algérie",
    price: 13900,
    originalPrice: null,
    concentration: "EDP",
    volume: "100ml",
  },
  "kayali-eden-edp-67ml": {
    newSlug: "kayali-eden",
    name: "Eden Juicy Apple 01",
    h1: "Kayali Eden — Parfum Femme en Algérie",
    price: 13500,
    originalPrice: null,
    concentration: "EDP",
    volume: "50ml",
  },
  "chanel-coco-mademoiselle-100ml": {
    newSlug: "coco-mademoiselle-chanel",
    name: "Coco Mademoiselle",
    h1: "Coco Mademoiselle Chanel — Parfum Femme en Algérie",
    price: 17200,
    originalPrice: 19900,
    concentration: "EDP",
    volume: "100ml",
  },
  "armani-code-edp-110ml": {
    newSlug: "armani-code",
    name: "Code",
    h1: "Armani Code — Parfum Homme en Algérie",
    price: 13900,
    originalPrice: null,
    concentration: "EDP",
    volume: "110ml",
  },
  "hugo-boss-bottled-edp-100ml": {
    newSlug: "hugo-boss-bottled",
    name: "Boss Bottled",
    h1: "Hugo Boss Bottled — Parfum Homme en Algérie",
    price: 11500,
    originalPrice: 13200,
    concentration: "EDT",
    volume: "100ml",
  },
  "versace-eros-edp-100ml": {
    newSlug: "versace-eros",
    name: "Eros",
    h1: "Versace Eros — Parfum Homme en Algérie",
    price: 12200,
    originalPrice: null,
    concentration: "EDT",
    volume: "100ml",
  },
  "narciso-rodriguez-for-her-edp-100ml": {
    newSlug: "narciso-rodriguez-for-her",
    name: "For Her",
    h1: "Narciso Rodriguez For Her — Parfum Femme en Algérie",
    price: 13900,
    originalPrice: null,
    concentration: "EDP",
    volume: "100ml",
  },
  "la-vie-est-belle-lancome-edp-100ml": {
    newSlug: "la-vie-est-belle-lancome",
    name: "La Vie est Belle",
    h1: "La Vie est Belle Lancôme — Parfum Femme en Algérie",
    price: 13500,
    originalPrice: 15800,
    concentration: "EDP",
    volume: "100ml",
  },
  "lattafa-oud-mood-100ml": {
    newSlug: "lattafa-oud-mood",
    name: "Oud Mood",
    h1: "Lattafa Oud Mood — Parfum Oriental en Algérie",
    price: 3200,
    originalPrice: null,
    concentration: "EDP",
    volume: "100ml",
  },
  "al-haramain-amber-oud-100ml": {
    newSlug: "amber-oud-al-haramain",
    name: "Amber Oud Gold Edition",
    h1: "Amber Oud Al Haramain — Parfum Oriental en Algérie",
    price: 7500,
    originalPrice: null,
    concentration: "EDP",
    volume: "60ml",
  },
  "lattafa-asad-60ml": {
    newSlug: "lattafa-asad",
    name: "Asad",
    h1: "Lattafa Asad — Parfum Oriental en Algérie",
    price: 2900,
    originalPrice: null,
    concentration: "EDP",
    volume: "60ml",
  },
  "lancome-idole-edp-100ml": {
    newSlug: "idole-lancome",
    name: "Idôle",
    h1: "Idôle Lancôme — Parfum Femme en Algérie",
    price: 12900,
    originalPrice: null,
    concentration: "EDP",
    volume: "100ml",
  },
  "franck-olivier-parfum-75ml": {
    newSlug: "franck-olivier",
    name: "Franck Olivier",
    h1: "Franck Olivier — Parfum en Algérie",
    price: 1800,
    originalPrice: null,
    concentration: "EDP",
    volume: "75ml",
  },
};

// ─── RELATED SLUG UPDATE ─────────────────────────────────────────────────────
function newSlugFor(oldSlug) {
  return MIGRATION[oldSlug]?.newSlug ?? oldSlug;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const data = JSON.parse(readFileSync(PRODUCTS_PATH, "utf-8"));

for (const product of data.products) {
  const m = MIGRATION[product.slug];
  if (!m) {
    console.warn(`⚠ No migration entry for: ${product.slug}`);
    continue;
  }

  // Rename image file
  const oldImgPath = join(IMAGES_DIR, `${product.slug}.jpg`);
  const newImgPath = join(IMAGES_DIR, `${m.newSlug}.jpg`);
  if (existsSync(oldImgPath) && !existsSync(newImgPath)) {
    renameSync(oldImgPath, newImgPath);
    console.log(`  🖼 Renamed image: ${product.slug}.jpg → ${m.newSlug}.jpg`);
  }

  // Update product fields
  const oldSlug = product.slug;
  product.id = m.newSlug;
  product.slug = m.newSlug;
  product.name = m.name;
  product.h1 = m.h1;
  product.price = m.price;
  product.originalPrice = m.originalPrice ?? null;
  product.concentration = m.concentration;
  product.volume = m.volume;
  product.image = `/images/products/${m.newSlug}.jpg`;

  // Update related slugs
  if (product.related) {
    product.related = product.related.map(newSlugFor);
  }

  console.log(`  ✓ ${oldSlug} → ${m.newSlug}`);
}

writeFileSync(PRODUCTS_PATH, JSON.stringify(data, null, 2));
console.log("\n✅ Migration terminée.");
