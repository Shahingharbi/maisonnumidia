#!/usr/bin/env node
// Construit les lots de produits SANS prix marché fiable (aucun match ou niveau C) pour la
// recherche web par agents. Regroupe par marque (un agent réutilise ses trouvailles de
// boutiques d'une même marque). Sortie: scripts/_price-research/residual-batches.json
// Usage: node scripts/_price-research/build-residual-batches.mjs [--size=25]
import fs from "fs";

const SIZE = parseInt((process.argv.find((a) => a.startsWith("--size=")) || "--size=25").split("=")[1], 10);
const report = JSON.parse(fs.readFileSync("./scripts/_price-research/report-v3.json", "utf8"));

const residual = report
  .filter((r) => r.status !== "match" || r.tier === "C")
  .map((r) => ({
    slug: r.slug, brand: r.brand, name: r.name, concentration: r.conc, volume: r.volume,
    gender: r.gender, category: r.category, ourPrice: r.ourPrice,
    hint: r.tier === "C" ? (r.sources || []).map((s) => `${s.site}: "${s.name}" ${s.price} DA`).join(" ; ") : undefined,
  }));

const byBrand = new Map();
for (const r of residual) {
  if (!byBrand.has(r.brand)) byBrand.set(r.brand, []);
  byBrand.get(r.brand).push(r);
}
// Remplissage glouton : marques les plus fournies d'abord, sans couper une marque si possible
const groups = [...byBrand.values()].sort((a, b) => b.length - a.length);
const batches = [];
for (const g of groups) {
  let placed = false;
  for (const b of batches) {
    if (b.products.length + g.length <= SIZE) { b.products.push(...g); placed = true; break; }
  }
  if (!placed) {
    for (let i = 0; i < g.length; i += SIZE) batches.push({ id: batches.length + 1, products: g.slice(i, i + SIZE) });
  }
}
batches.forEach((b, i) => { b.id = i + 1; });
fs.writeFileSync("./scripts/_price-research/residual-batches.json", JSON.stringify(batches, null, 1));
console.log(`${residual.length} produits résiduels -> ${batches.length} lots (≤${SIZE})`);
batches.forEach((b) => console.log(`  lot ${b.id}: ${b.products.length} produits — ${[...new Set(b.products.map((p) => p.brand))].slice(0, 6).join(", ")}${new Set(b.products.map((p) => p.brand)).size > 6 ? "…" : ""}`));
