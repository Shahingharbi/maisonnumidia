#!/usr/bin/env node
// Applique les prix "marché algérien + petite marge" à data/products.json.
// Source : scripts/_price-research/final-prices.json (produit par merge-final.mjs)
//   [{ slug, newPrice, basis: "concurrents"|"web"|"estimation-marque", tier, market, sources }]
// Par défaut SIMULATION (n'écrit rien). --apply pour écrire.
// Garde-fous :
//   - plancher catalogue 6 500 DA (CLAUDE.md)
//   - variation > MAX_JUMP (±45%) appliquée seulement si niveau A (2+ sources cohérentes)
//     ou prix web confirmé ; sinon listée "à revoir" et prix inchangé
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const MAX_JUMP = 0.45;
const FLOOR = 6500;

const catalog = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const finals = JSON.parse(fs.readFileSync("./scripts/_price-research/final-prices.json", "utf8"));
const bySlug = new Map(finals.map((f) => [f.slug, f]));

const applied = [], review = [], unchanged = [];
for (const p of catalog.products) {
  const f = bySlug.get(p.slug);
  if (!f || !f.newPrice) { unchanged.push(p.slug); continue; }
  const target = Math.max(f.newPrice, FLOOR);
  const jump = (target - p.price) / p.price;
  // Plafond de variation selon la solidité : A (2+ boutiques cohérentes) 45%, B 25%,
  // web / estimation 20%. Au-delà : liste "à revoir" (vérification avant application).
  const cap = f.tier === "A" || f.basis === "web-verifie" ? MAX_JUMP : f.basis === "concurrents" ? 0.25 : 0.2;
  if (Math.abs(jump) > cap) {
    review.push({ slug: p.slug, old: p.price, proposed: target, jumpPct: Math.round(jump * 1000) / 10, basis: f.basis, tier: f.tier });
    continue;
  }
  if (target === p.price) { unchanged.push(p.slug); continue; }
  applied.push({ slug: p.slug, brand: p.brand, name: p.name, old: p.price, new: target, jumpPct: Math.round(jump * 1000) / 10, basis: f.basis, tier: f.tier, market: f.market });
  if (APPLY) p.price = target;
}

const log = { date: "2026-09-15", premium: "+3% sur la médiane marché", floor: FLOOR, applied, review, unchangedCount: unchanged.length };
fs.writeFileSync("./scripts/_price-research/apply-log.json", JSON.stringify(log, null, 1));
if (APPLY) fs.writeFileSync("./data/products.json", JSON.stringify(catalog, null, 2) + "\n");

const up = applied.filter((a) => a.new > a.old).length;
const down = applied.filter((a) => a.new < a.old).length;
console.log(`${APPLY ? "APPLIQUÉ" : "SIMULATION"} — ${applied.length} prix modifiés (${up} hausses, ${down} baisses), ${review.length} à revoir (variation trop forte pour le niveau de preuve), ${unchanged.length} inchangés`);
const avgOld = applied.reduce((s, a) => s + a.old, 0) / (applied.length || 1);
const avgNew = applied.reduce((s, a) => s + a.new, 0) / (applied.length || 1);
console.log(`Prix moyen des produits modifiés : ${Math.round(avgOld)} -> ${Math.round(avgNew)} DA`);
