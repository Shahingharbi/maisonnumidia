#!/usr/bin/env node
// Injecte les fiches validées (scripts/_catalog-add/fiches.json) dans data/products.json.
// SIMULATION par défaut, --apply pour écrire.
// Refuse tout le lot si une fiche est incomplète : mieux vaut ne rien ajouter qu'ajouter
// une fiche cassée au milieu de 700 bonnes.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const catalogue = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const fiches = JSON.parse(fs.readFileSync("./scripts/_catalog-add/fiches.json", "utf8"));
const slugs = new Set(catalogue.products.map((p) => p.slug));
const marques = new Set(catalogue.brands.map((b) => b.slug));

const CHAMPS = ["id", "slug", "name", "h1", "brand", "brandSlug", "gender", "category", "family",
  "concentration", "volume", "price", "originalPrice", "shortDescription", "description", "notes",
  "occasions", "seasons", "longevity", "sillage", "image", "inStock", "featured", "badge",
  "isOriental", "related"];

const erreurs = [];
for (const f of fiches) {
  for (const c of CHAMPS) if (f[c] === undefined) erreurs.push(`${f.slug} : champ manquant ${c}`);
  if (slugs.has(f.slug)) erreurs.push(`${f.slug} : slug déjà présent`);
  if (!marques.has(f.brandSlug)) erreurs.push(`${f.slug} : marque ${f.brandSlug} absente de brands[]`);
  if (!fs.existsSync("./public/images/products/" + f.slug + ".jpg")) erreurs.push(`${f.slug} : image absente`);
  if (!f.description || !f.shortDescription) erreurs.push(`${f.slug} : texte manquant`);
  if ((f.related || []).length < 3) erreurs.push(`${f.slug} : related < 3`);
}
if (erreurs.length) {
  console.log("LOT REFUSÉ — " + erreurs.length + " problèmes :");
  erreurs.slice(0, 20).forEach((e) => console.log("  " + e));
  process.exit(1);
}

const propres = fiches.map((f) => {
  const o = {};
  for (const c of CHAMPS) o[c] = f[c];
  return o;
});

console.log((APPLY ? "APPLIQUÉ" : "SIMULATION") + " — " + propres.length + " fiches ajoutées, catalogue " +
  catalogue.products.length + " -> " + (catalogue.products.length + propres.length));
const parCat = {};
propres.forEach((f) => (parCat[f.category] = (parCat[f.category] || 0) + 1));
console.log("par catégorie :", parCat);

if (APPLY) {
  catalogue.products.push(...propres);
  fs.writeFileSync("./data/products.json", JSON.stringify(catalogue, null, 2) + "\n");
  // Traçabilité : d'où vient chaque fiche (URL Fragrantica, ID image, nb de boutiques algériennes).
  const provenance = fiches.map((f) => ({ slug: f.slug, ...f._source }));
  fs.writeFileSync("./scripts/_catalog-add/provenance.json", JSON.stringify(provenance, null, 1));
  console.log("provenance écrite dans scripts/_catalog-add/provenance.json");
}
