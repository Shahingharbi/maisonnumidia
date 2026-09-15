#!/usr/bin/env node
// Boutiques algériennes supplémentaires (couverture des parfums orientaux).
// Même logique que ../fetch-apis.mjs (Woo Store API / Shopify products.json), séquentiel,
// >= 1,5 s entre requêtes.
// Usage: node scripts/_price-research/agents/fetch-oriental-shops.mjs [cle1,cle2]
// Sortie: scripts/_price-research/raw2/{cle}.json
import fs from "fs";

const OUT = "./scripts/_price-research/raw2";
fs.mkdirSync(OUT, { recursive: true });

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "application/json,text/html;q=0.9,*/*;q=0.8",
  "Accept-Language": "fr-FR,fr;q=0.9",
};

// api: préfixe de l'API Store Woo. Palais des Parfums bloque /wp-json/ mais accepte ?rest_route=
const SITES = {
  smellgood: { type: "shopify", base: "https://smellgood-dz.com", shopName: /smell ?good/i },
  odorem: { type: "woo", base: "https://odorem-dz.com", api: (q) => `https://odorem-dz.com/wp-json/wc/store/v1/products${q ? "?" + q : ""}` },
  palais: { type: "woo", base: "https://palaisdesparfums-dz.com", api: (q) => `https://palaisdesparfums-dz.com/?rest_route=/wc/store/v1/products${q ? "&" + q : ""}` },
  // Boutique généraliste (hijabs, cosmétiques…) : on ne garde que les parfums
  dion: { type: "shopify", base: "https://dionbyhiba.com", shopName: /dion/i, perfumeOnly: true },
  // Surtout designer, mais Montale / Mancera / Armaf en flacons complets
  parfumdeluxe: { type: "shopify", base: "https://parfumdeluxedz.com", shopName: /parfum ?deluxe/i },
};

const DELAY_MS = 1800;
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
  .replace(/&#0*38;|&amp;/g, "&").replace(/&#8217;|&rsquo;|&#039;|&#39;/g, "'").replace(/&#8211;|&ndash;/g, "-")
  .replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

async function fetchWoo(key, cfg) {
  const out = [];
  let page = 1, totalPages = 1;
  do {
    const r = await getJson(cfg.api(`per_page=100&page=${page}`));
    if (!r.json) { console.log(`  [${key}] page ${page} -> HTTP ${r.status} ${r.error || ""}`); break; }
    totalPages = parseInt(r.headers.get("x-wp-totalpages") || "1", 10);
    for (const p of r.json) {
      const mu = p.prices?.currency_minor_unit ?? 0;
      const conv = (v) => (v == null || v === "" ? null : Math.round(parseInt(v, 10) / Math.pow(10, mu)));
      out.push({
        name: decode(p.name),
        brand: (p.brands || []).map((b) => decode(b.name)).join(" / ")
          || (p.attributes || []).filter((a) => /marque|brand/i.test(a.name)).flatMap((a) => (a.terms || []).map((t) => decode(t.name))).join(" / ") || null,
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
      });
    }
    console.log(`  [${key}] page ${page}/${totalPages} -> ${out.length} produits`);
    page++;
    await sleep(DELAY_MS);
  } while (page <= totalPages);

  for (const p of out) {
    if (p.variationIds.length > 0 && (p.min == null || p.min === p.max)) {
      p.variants = p.variationIds.map((v) => ({ label: v.attrs.join(" "), price: p.price }));
    }
  }
  const variable = out.filter((p) => p.variationIds.length > 0 && p.min != null && p.min !== p.max);
  console.log(`  [${key}] ${variable.length} produits à prix variables -> prix par variation`);
  for (const p of variable) {
    p.variants = [];
    for (const v of p.variationIds) {
      const r = await getJson(cfg.api("").replace(/\/products(\?|&|$)/, `/products/${v.id}$1`));
      if (r.json?.prices) {
        const mu = r.json.prices.currency_minor_unit ?? 0;
        p.variants.push({ label: v.attrs.join(" "), price: Math.round(parseInt(r.json.prices.price, 10) / Math.pow(10, mu)) });
      }
      await sleep(1500);
    }
  }
  out.forEach((p) => { delete p.variationIds; });
  return out;
}

const PERFUME_RE = /parfum|perfume|\bedp\b|\bedt\b|eau de (parfum|toilette|cologne)|cologne|extrait|\bmusc\b|\bmusk\b|\boud\b/i;
const NOT_PERFUME_RE = /eau micellaire|eau thermale|d[ée]odorant|d[ée]transpirant|lotion|cream|huile|\blip|retin|hyalur|spf|hijab|robe|caftan|kimono|ensemble|abaya|jilbab|palette|mascara|serum|sérum|cr[eè]me|toner|mask|masque|shampo|gel nettoyant|rouge à lèvres|fond de teint/i;

async function fetchShopify(key, cfg) {
  const out = [];
  for (let page = 1; page < 50; page++) {
    const r = await getJson(`${cfg.base}/products.json?limit=250&page=${page}`);
    const prods = r.json?.products || [];
    if (!prods.length) { if (!r.json) console.log(`  [${key}] page ${page} -> HTTP ${r.status}`); break; }
    for (const p of prods) {
      const title = decode(p.title);
      const cats = [p.product_type, ...(Array.isArray(p.tags) ? p.tags : String(p.tags || "").split(","))].filter(Boolean).map(decode);
      if (cfg.perfumeOnly) {
        if (!PERFUME_RE.test(title) || NOT_PERFUME_RE.test(title)) continue;
      }
      const variants = (p.variants || []).map((v) => ({
        label: decode(v.title), price: Math.round(parseFloat(v.price)),
        compare: v.compare_at_price ? Math.round(parseFloat(v.compare_at_price)) : null, available: v.available,
      }));
      const vendor = decode(p.vendor);
      const first = variants.find((v) => v.available) || variants[0];
      out.push({
        name: title,
        brand: vendor && !cfg.shopName.test(vendor) ? vendor : null,
        price: first?.price ?? null,
        regular: first?.compare && first.compare > first.price ? first.compare : null,
        variants: variants.length > 1 || (variants[0] && variants[0].label !== "Default Title")
          ? variants.map((v) => ({ label: v.label, price: v.price, available: v.available })) : undefined,
        cats,
        url: `${cfg.base}/products/${p.handle}`,
        inStock: variants.some((v) => v.available),
      });
    }
    console.log(`  [${key}] page ${page} -> ${out.length} produits retenus`);
    await sleep(DELAY_MS);
  }
  return out;
}

const only = process.argv[2] ? process.argv[2].split(",") : null;
const summary = {};
for (const [key, cfg] of Object.entries(SITES)) {
  if (only && !only.includes(key)) continue;
  console.log(`\n=== ${key} (${cfg.base}) ===`);
  const items = cfg.type === "woo" ? await fetchWoo(key, cfg) : await fetchShopify(key, cfg);
  if (items.length) fs.writeFileSync(`${OUT}/${key}.json`, JSON.stringify(items, null, 1));
  summary[key] = items.length;
  console.log(`[${key}] TERMINÉ — ${items.length} produits`);
}
console.log("\n=== RÉSUMÉ ===", summary);
