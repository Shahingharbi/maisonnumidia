#!/usr/bin/env node
// Fusionne les 3 sources de prix marché en un seul fichier final-prices.json :
//   1. report-v3.json   : catalogues concurrents (niveaux A et B uniquement)
//   2. web/*.json       : prix trouvés par les agents de recherche web (confiance high/medium)
//   3. estimation-marque: pour le reste, écart moyen observé sur la MÊME marque (≥3 produits
//      réellement comparés), appliqué au prix actuel. Jamais de marque "devinée".
// Prix final = médiane marché × (1 + PREMIUM), arrondi 100 DA (<10 000) ou 500 DA.
// Usage: node scripts/_price-research/merge-final.mjs [--premium=0.03]
import fs from "fs";

const PREMIUM = parseFloat((process.argv.find((a) => a.startsWith("--premium=")) || "--premium=0.03").split("=")[1]);
const MIN_BRAND_SAMPLES = 3;
const DIR = "./scripts/_price-research";

const { products } = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const report = JSON.parse(fs.readFileSync(`${DIR}/report-v3.json`, "utf8"));
const byReport = new Map(report.map((r) => [r.slug, r]));

const priceFromMarket = (m) => { const t = m * (1 + PREMIUM); const step = t < 10000 ? 100 : 500; return Math.ceil(t / step) * step; };
const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

// Résultats web des agents (missions "trouver" et "verifier")
const web = new Map();          // prix web exploitables
const webRejected = new Set();  // "verifier" : le prix concurrent était faux et rien de fiable trouvé
if (fs.existsSync(`${DIR}/web`)) {
  for (const f of fs.readdirSync(`${DIR}/web`).filter((f) => f.endsWith(".json"))) {
    let rows = [];
    try { rows = JSON.parse(fs.readFileSync(`${DIR}/web/${f}`, "utf8")); } catch { console.log(`! ${f} illisible, ignoré`); }
    for (const r of rows) {
      if (r.found && r.price && ["high", "medium"].includes(r.confidence)) web.set(r.slug, r);
      else webRejected.add(r.slug);
    }
  }
}
// Produits dont la variation était trop forte pour une seule source : la vérification web tranche
const reviewSlugs = fs.existsSync(`${DIR}/web-batches.json`)
  ? new Set(JSON.parse(fs.readFileSync(`${DIR}/web-batches.json`, "utf8")).flatMap((b) => b.products).filter((p) => p.mission === "verifier").map((p) => p.slug))
  : new Set();

const finals = [];
const brandRatios = new Map();
// 1) concurrents (sauf produits "à vérifier" déjà traités par le web : le web l'emporte)
for (const p of products) {
  const r = byReport.get(p.slug);
  if (reviewSlugs.has(p.slug) && (web.has(p.slug) || webRejected.has(p.slug))) continue;
  if (r && r.status === "match" && (r.tier === "A" || r.tier === "B")) {
    finals.push({ slug: p.slug, basis: "concurrents", tier: r.tier, market: r.market, newPrice: priceFromMarket(r.market), sources: r.sources.map((s) => `${s.site}: ${s.name} ${s.price} DA (${s.volStatus})`) });
    if (!brandRatios.has(p.brand)) brandRatios.set(p.brand, []);
    brandRatios.get(p.brand).push(r.market / p.price);
  }
}
const done = new Set(finals.map((f) => f.slug));
// 2) web
for (const p of products) {
  if (done.has(p.slug)) continue;
  const w = web.get(p.slug);
  if (!w) continue;
  const ourVol = parseInt(p.volume, 10);
  let market = w.price;
  if (w.volumeMl && ourVol && w.volumeMl !== ourVol) {
    const ratio = ourVol / w.volumeMl;
    if (ratio < 0.45 || ratio > 2.2) continue;
    market = Math.round(w.price * Math.pow(ratio, 0.72));
  }
  const verified = reviewSlugs.has(p.slug) && w.confidence === "high";
  finals.push({ slug: p.slug, basis: verified ? "web-verifie" : "web", tier: w.confidence === "high" ? "B" : "C", market, newPrice: priceFromMarket(market), sources: [`${w.shop || "?"}: ${w.url || ""} ${w.price} DA${w.volumeMl ? ` (${w.volumeMl} ml)` : ""}`], note: w.note });
  done.add(p.slug);
  if (w.confidence === "high") {
    if (!brandRatios.has(p.brand)) brandRatios.set(p.brand, []);
    brandRatios.get(p.brand).push(market / p.price);
  }
}
// 3) estimation par marque
let estimated = 0;
const noData = [];
for (const p of products) {
  if (done.has(p.slug)) continue;
  // prix concurrent démenti par la vérification web, sans autre source : on garde le prix actuel
  if (reviewSlugs.has(p.slug) && webRejected.has(p.slug)) { noData.push({ slug: p.slug, brand: p.brand, name: p.name, price: p.price, reason: "prix concurrent démenti, prix actuel conservé" }); continue; }
  const ratios = brandRatios.get(p.brand) || [];
  if (ratios.length >= MIN_BRAND_SAMPLES) {
    const k = median(ratios);
    const market = Math.round(p.price * k);
    finals.push({ slug: p.slug, basis: "estimation-marque", tier: "E", market, newPrice: priceFromMarket(market), sources: [`écart médian ${Math.round((k - 1) * 100)}% observé sur ${ratios.length} produits ${p.brand}`] });
    estimated++;
  } else {
    noData.push({ slug: p.slug, brand: p.brand, name: p.name, price: p.price, brandSamples: ratios.length });
  }
}

fs.writeFileSync(`${DIR}/final-prices.json`, JSON.stringify(finals, null, 1));
fs.writeFileSync(`${DIR}/no-market-data.json`, JSON.stringify(noData, null, 1));
const c = (b) => finals.filter((f) => f.basis === b).length;
console.log(`Prix marché: concurrents ${c("concurrents")} | web ${c("web")} | estimation par marque ${estimated} | sans donnée ${noData.length} / ${products.length}`);
