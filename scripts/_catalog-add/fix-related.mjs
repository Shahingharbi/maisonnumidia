#!/usr/bin/env node
// Répare les `related[]` qui pointent vers un slug absent du catalogue.
// SIMULATION par défaut, --apply pour écrire.
//
// Cas d'usage : une vague d'ajout calcule les produits liés sur l'ensemble des fiches
// préparées, mais seules celles dont le texte est prêt sont publiées. Les fiches publiées
// se retrouvent alors à pointer vers des parfums qui n'existent pas encore.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const catalogue = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const slugs = new Set(catalogue.products.map((p) => p.slug));

const score = (a, b) => (a.brandSlug === b.brandSlug ? 4 : 0) + (a.category === b.category ? 2 : 0) + (a.gender === b.gender ? 1 : 0);

const repares = [];
for (const p of catalogue.products) {
  const valides = (p.related || []).filter((r) => slugs.has(r) && r !== p.slug);
  if (valides.length >= 3) {
    if (valides.length !== (p.related || []).length && APPLY) p.related = valides.slice(0, 3);
    continue;
  }
  const manquants = (p.related || []).filter((r) => !slugs.has(r));
  const remplacants = catalogue.products
    .filter((q) => q.slug !== p.slug && !valides.includes(q.slug) && q.inStock)
    .map((q) => ({ q, s: score(p, q) }))
    .filter((x) => x.s >= 2)
    .sort((a, b) => b.s - a.s || Math.abs(a.q.price - p.price) - Math.abs(b.q.price - p.price))
    .slice(0, 3 - valides.length)
    .map((x) => x.q.slug);
  const nouveau = valides.concat(remplacants);
  repares.push({ slug: p.slug, manquants, nouveau });
  if (APPLY) p.related = nouveau;
}

if (APPLY && repares.length) fs.writeFileSync("./data/products.json", JSON.stringify(catalogue, null, 2) + "\n");
console.log((APPLY ? "APPLIQUÉ" : "SIMULATION") + " — " + repares.length + " fiches réparées");
repares.forEach((r) => console.log(`  ${r.slug} : ${r.manquants.join(", ")} -> ${r.nouveau.join(", ")}`));
