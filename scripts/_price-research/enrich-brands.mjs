#!/usr/bin/env node
// Complète raw2/{site}.json avec le champ `brand` (WooCommerce Store API `brands`),
// en ne relisant QUE les pages de listing (≈40 requêtes au total), sans les variations.
// Usage: node scripts/_price-research/enrich-brands.mjs
import fs from "fs";

const RAW = "./scripts/_price-research/raw2";
const SITES = {
  briki: "https://briki-parfums.com",
  gallery: "https://galleryparfums-dz.com",
  must: "https://www.mustbeauty.dz",
  tendance: "https://www.tendanceparfumsdz.com",
  aromatica: "https://aromaticadz.com",
  parfumalgerie: "https://parfum-algerie.com",
  odorem: "https://odorem-dz.com",
};
const ONLY = process.argv[2] ? new Set(process.argv[2].split(",")) : null;
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "application/json",
  "Accept-Language": "fr-FR,fr;q=0.9",
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const decode = (s) => String(s || "").replace(/&#0*38;|&amp;/g, "&").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

for (const [key, base] of Object.entries(SITES)) {
  if (ONLY && !ONLY.has(key)) continue;
  const file = `${RAW}/${key}.json`;
  if (!fs.existsSync(file)) { console.log(`[${key}] pas de fichier, ignoré`); continue; }
  const items = JSON.parse(fs.readFileSync(file, "utf8"));
  const byUrl = new Map();
  let page = 1, total = 1;
  do {
    const res = await fetch(`${base}/wp-json/wc/store/v1/products?per_page=100&page=${page}`, { headers: HEADERS, signal: AbortSignal.timeout(30000) }).catch(() => null);
    if (!res || !res.ok) { console.log(`[${key}] page ${page} HTTP ${res?.status}`); break; }
    total = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
    const json = JSON.parse((await res.text()).replace(/^﻿/, ""));
    for (const p of json) byUrl.set(p.permalink, (p.brands || []).map((b) => decode(b.name)).join(" / ") || null);
    page++;
    await sleep(1800);
  } while (page <= total);
  let n = 0;
  for (const it of items) {
    if (byUrl.has(it.url)) { it.brand = byUrl.get(it.url); if (it.brand) n++; }
  }
  fs.writeFileSync(file, JSON.stringify(items, null, 1));
  console.log(`[${key}] ${n}/${items.length} produits avec marque`);
}
