#!/usr/bin/env node
// Récupère le catalogue COMPLET des concurrents via leurs API publiques (bien plus fiable
// et moins de requêtes que le scraping HTML) :
//   - WooCommerce Store API : /wp-json/wc/store/v1/products?per_page=100&page=N
//   - Shopify             : /products.json?limit=250&page=N
// Usage: node scripts/_price-research/fetch-apis.mjs [site1,site2]
// Sortie: scripts/_price-research/raw2/{site}.json
//   [{ name, price, regular, variants:[{label, price}], cats:[], url, inStock }]
import fs from "fs";

const OUT = "./scripts/_price-research/raw2";
fs.mkdirSync(OUT, { recursive: true });

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "application/json,text/html;q=0.9,*/*;q=0.8",
  "Accept-Language": "fr-FR,fr;q=0.9",
};

export const SITES = {
  briki: { type: "woo", base: "https://briki-parfums.com" },
  gallery: { type: "woo", base: "https://galleryparfums-dz.com" },
  must: { type: "woo", base: "https://www.mustbeauty.dz" },
  tendance: { type: "woo", base: "https://www.tendanceparfumsdz.com" },
  aromatica: { type: "woo", base: "https://aromaticadz.com" },
  parfumalgerie: { type: "woo", base: "https://parfum-algerie.com" },
  parfumalgerieshop: { type: "shopify", base: "https://parfumalgerie.shop" },
  leena: { type: "woo", base: "https://leena-dz.com" }, // ventes privées : utiliser le prix normal (regular)
  leila: { type: "woo", base: "https://leilaparfums-dz.com" },
};

const DELAY_MS = 1800; // Briki (Wordfence) a bloqué à ~450ms entre requêtes
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(30000) });
      if (res.status === 429 || res.status === 503) { await sleep(20000 * (i + 1)); continue; }
      if (!res.ok) return { status: res.status, json: null, headers: res.headers };
      const text = (await res.text()).replace(/^﻿/, "");
      return { status: res.status, json: JSON.parse(text), headers: res.headers };
    } catch (e) {
      if (i === tries - 1) return { status: 0, json: null, error: e.message };
      await sleep(5000);
    }
  }
  return { status: 0, json: null };
}

const decode = (s) => String(s || "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#0*38;|&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "'").replace(/&#8211;|&ndash;/g, "-")
  .replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

async function fetchWoo(key, base) {
  const out = [];
  let page = 1, totalPages = 1;
  do {
    const r = await getJson(`${base}/wp-json/wc/store/v1/products?per_page=100&page=${page}`);
    if (!r.json) { console.log(`  [${key}] page ${page} -> HTTP ${r.status} ${r.error || ""}`); break; }
    totalPages = parseInt(r.headers.get("x-wp-totalpages") || "1", 10);
    for (const p of r.json) {
      const mu = p.prices?.currency_minor_unit ?? 0;
      const conv = (v) => (v == null || v === "" ? null : Math.round(parseInt(v, 10) / Math.pow(10, mu)));
      const item = {
        name: decode(p.name),
        // Certains sites (ex. Gallery) n'écrivent pas la marque dans le nom ("ATOMIC ROSE")
        brand: (p.brands || []).map((b) => decode(b.name)).join(" / ") || null,
        price: conv(p.prices?.price),
        regular: conv(p.prices?.regular_price),
        min: conv(p.prices?.price_range?.min_amount),
        max: conv(p.prices?.price_range?.max_amount),
        cats: (p.categories || []).map((c) => decode(c.name)),
        attrs: (p.attributes || []).map((a) => ({ name: decode(a.name), terms: (a.terms || []).map((t) => decode(t.name)) })),
        variationIds: (p.variations || []).map((v) => ({ id: v.id, attrs: (v.attributes || []).map((a) => decode(a.value)) })),
        url: p.permalink,
        inStock: p.is_in_stock,
        type: p.type,
      };
      out.push(item);
    }
    console.log(`  [${key}] page ${page}/${totalPages} -> ${out.length} produits`);
    page++;
    await sleep(DELAY_MS);
  } while (page <= totalPages);

  // Produits variables (plusieurs contenances) : on récupère le prix de chaque variation,
  // sinon impossible de comparer au bon volume (50ml vs 100ml).
  // Si toutes les variations ont le même prix (min === max), inutile d'interroger chacune :
  // les libellés de contenance sont déjà dans la réponse de listing.
  for (const p of out) {
    if (p.variationIds.length > 0 && (p.min == null || p.min === p.max)) {
      p.variants = p.variationIds.map((v) => ({ label: v.attrs.join(" "), price: p.price }));
    }
  }
  const variable = out.filter((p) => p.variationIds.length > 0 && p.min != null && p.min !== p.max);
  console.log(`  [${key}] ${variable.length} produits à prix différents selon la contenance -> prix par variation`);
  for (const p of variable) {
    p.variants = [];
    for (const v of p.variationIds) {
      const r = await getJson(`${base}/wp-json/wc/store/v1/products/${v.id}`);
      if (r.json?.prices) {
        const mu = r.json.prices.currency_minor_unit ?? 0;
        p.variants.push({ label: v.attrs.join(" "), price: Math.round(parseInt(r.json.prices.price, 10) / Math.pow(10, mu)) });
      }
      await sleep(DELAY_MS / 2);
    }
    delete p.variationIds;
  }
  out.forEach((p) => { delete p.variationIds; });
  return out;
}

async function fetchShopify(key, base) {
  const out = [];
  for (let page = 1; page < 50; page++) {
    const r = await getJson(`${base}/products.json?limit=250&page=${page}`);
    const prods = r.json?.products || [];
    if (!prods.length) break;
    for (const p of prods) {
      const variants = (p.variants || []).map((v) => ({ label: decode(v.title), price: Math.round(parseFloat(v.price)), available: v.available }));
      out.push({
        name: decode(p.title),
        price: variants[0]?.price ?? null,
        regular: null,
        variants: variants.length > 1 || (variants[0] && variants[0].label !== "Default Title") ? variants : undefined,
        cats: [p.product_type, ...(p.tags || [])].filter(Boolean).map(decode),
        url: `${base}/products/${p.handle}`,
        inStock: variants.some((v) => v.available),
        vendor: decode(p.vendor),
      });
    }
    console.log(`  [${key}] page ${page} -> ${out.length} produits`);
    await sleep(DELAY_MS);
  }
  return out;
}

const only = process.argv[2] ? process.argv[2].split(",") : null;
const summary = {};
for (const [key, cfg] of Object.entries(SITES)) {
  if (only && !only.includes(key)) continue;
  console.log(`\n=== ${key} (${cfg.base}) ===`);
  const items = cfg.type === "woo" ? await fetchWoo(key, cfg.base) : await fetchShopify(key, cfg.base);
  fs.writeFileSync(`${OUT}/${key}.json`, JSON.stringify(items, null, 1));
  summary[key] = items.length;
  console.log(`[${key}] TERMINÉ — ${items.length} produits`);
}
console.log("\n=== RÉSUMÉ ===", summary);
