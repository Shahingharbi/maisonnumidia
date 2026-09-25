#!/usr/bin/env node
// Ordonne les descriptions à réécrire : une fiche mal écrite qui reçoit 5 000 impressions
// compte plus qu'une fiche mal écrite que personne ne voit.
// Sortie : scripts/_catalog-audit/reecriture-todo.json, consommé par le workflow de rédaction.
import fs from "fs";

const notes = JSON.parse(fs.readFileSync("./scripts/_catalog-audit/notes-descriptions.json", "utf8"));
const produits = JSON.parse(fs.readFileSync("./data/products.json", "utf8")).products;
const parSlug = new Map(produits.map((p) => [p.slug, p]));

// Impressions par fiche sur 16 mois (Search Console)
const pages = JSON.parse(fs.readFileSync("./scripts/_gsc/data/pages.json", "utf8"));
const impressions = new Map();
for (const r of pages) {
  const m = r.keys[0].match(/\/parfums\/([a-z0-9-]+)/);
  if (!m) continue;
  impressions.set(m[1], (impressions.get(m[1]) || 0) + r.impressions);
}

const aRefaire = notes
  .filter((n) => n.score >= 8)
  .map((n) => {
    const p = parSlug.get(n.slug);
    const imp = impressions.get(n.slug) || 0;
    // Le trafic pondère, il ne décide pas seul : une fiche à 0 impression reste à refaire,
    // simplement plus tard. La racine carrée évite que les 3 grosses fiches écrasent tout.
    return { ...n, impressions: imp, priorite: Math.round(n.score * (1 + Math.sqrt(imp) / 10)) };
  })
  .sort((a, b) => b.priorite - a.priorite);

const todo = aRefaire.map((n) => {
  const p = parSlug.get(n.slug);
  return {
    slug: n.slug, brand: p.brand, name: p.name, gender: p.gender, concentration: p.concentration,
    volume: p.volume, family: p.family, notes: p.notes, occasions: p.occasions, seasons: p.seasons,
    inStock: p.inStock, impressions: n.impressions, ancienScore: n.score,
  };
});
fs.writeFileSync("./scripts/_catalog-audit/reecriture-todo.json", JSON.stringify(todo, null, 1));

const avecTrafic = aRefaire.filter((n) => n.impressions > 0).length;
console.log("descriptions à refaire : " + aRefaire.length);
console.log("   dont vues au moins une fois par Google : " + avecTrafic);
console.log("   impressions cumulées concernées : " + aRefaire.reduce((s, n) => s + n.impressions, 0).toLocaleString("fr-FR"));
console.log("\n15 premières (score de rédaction × trafic) :");
aRefaire.slice(0, 15).forEach((n) =>
  console.log(`   ${String(n.impressions).padStart(6)} imp.  score ${String(n.score).padStart(2)}  ${n.slug}`));
